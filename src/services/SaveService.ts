import { APP_CONFIG } from '../config';
import { t } from './I18nService';

export interface PlayerProgress {
  currentLevelId: string;
  screenIndex: number;
  checkpointX: number;
  checkpointY: number;
  elapsedMs: number;
  fallCount: number;
  jumpCount: number;
}

export interface BestRunRecord {
  levelId: string;
  bestTimeMs: number;
  leastFalls: number;
  achievedAt: string;
  foundEasterEgg?: boolean;
}

export interface SaveService {
  loadProgress(): PlayerProgress | null;
  saveProgress(progress: PlayerProgress): void;
  clearProgress(): void;
  saveBestRun(run: BestRunRecord): void;
  getBestRuns(): Record<string, BestRunRecord>;
  getDiscoveredEasterEggs(): string[];
  markEasterEggDiscovered(levelId: string): boolean;
  getPlayerName(): string;
  setPlayerName(name: string): void;
  getRunSeed(): string | null;
  resetRunSeed(): string;
}

export class LocalStorageSaveService implements SaveService {
  public loadProgress(): PlayerProgress | null {
    try {
      const raw = window.localStorage.getItem(APP_CONFIG.storageKeys.progress);
      if (!raw) return null;
      return JSON.parse(raw) as PlayerProgress;
    } catch (err) {
      console.warn('[LocalStorageSaveService] Không thể đọc tiến trình:', err);
      return null;
    }
  }

  public saveProgress(progress: PlayerProgress): void {
    try {
      window.localStorage.setItem(APP_CONFIG.storageKeys.progress, JSON.stringify(progress));
    } catch (err) {
      console.warn('[LocalStorageSaveService] Không thể lưu tiến trình:', err);
    }
  }

  public clearProgress(): void {
    try {
      window.localStorage.removeItem(APP_CONFIG.storageKeys.progress);
    } catch (err) {
      console.warn('[LocalStorageSaveService] Không thể xóa tiến trình:', err);
    }
  }

  public saveBestRun(run: BestRunRecord): void {
    try {
      const all = this.getBestRuns();
      const existing = all[run.levelId];
      const foundEgg = Boolean(run.foundEasterEgg || existing?.foundEasterEgg);
      if (!existing || run.bestTimeMs < existing.bestTimeMs) {
        all[run.levelId] = { ...run, foundEasterEgg: foundEgg };
      } else if (foundEgg && !existing.foundEasterEgg) {
        all[run.levelId] = { ...existing, foundEasterEgg: true };
      }
      window.localStorage.setItem(APP_CONFIG.storageKeys.bestRuns, JSON.stringify(all));
    } catch (err) {
      console.warn('[LocalStorageSaveService] Không thể lưu kỷ lục:', err);
    }
  }

  public getBestRuns(): Record<string, BestRunRecord> {
    try {
      const raw = window.localStorage.getItem(APP_CONFIG.storageKeys.bestRuns);
      if (!raw) return {};
      return JSON.parse(raw) as Record<string, BestRunRecord>;
    } catch {
      return {};
    }
  }

  public getDiscoveredEasterEggs(): string[] {
    try {
      const raw = window.localStorage.getItem(APP_CONFIG.storageKeys.easterEggs);
      if (!raw) return [];
      return JSON.parse(raw) as string[];
    } catch {
      return [];
    }
  }

  public markEasterEggDiscovered(levelId: string): boolean {
    try {
      const list = this.getDiscoveredEasterEggs();
      if (!list.includes(levelId)) {
        list.push(levelId);
        window.localStorage.setItem(APP_CONFIG.storageKeys.easterEggs, JSON.stringify(list));
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }

  public getPlayerName(): string {
    try {
      const raw = window.localStorage.getItem(APP_CONFIG.storageKeys.playerName);
      return raw && raw.trim().length > 0 ? raw.trim() : t().defaultPlayerName;
    } catch {
      return t().defaultPlayerName;
    }
  }

  public setPlayerName(name: string): void {
    try {
      const clean = name.trim().slice(0, 22) || t().defaultPlayerName;
      window.localStorage.setItem(APP_CONFIG.storageKeys.playerName, clean);
    } catch {
      // Ignore storage error
    }
  }

  public getRunSeed(): string | null {
    try {
      const raw = window.localStorage.getItem(APP_CONFIG.storageKeys.runSeed);
      return raw && raw.trim().length > 0 ? raw.trim() : null;
    } catch {
      return null;
    }
  }

  public resetRunSeed(): string {
    const timePart = Date.now().toString(36).toUpperCase().slice(-4);
    const randPart = Math.random().toString(36).slice(2, 6).toUpperCase();
    const newSeed = `RUN-${timePart}-${randPart}`;
    try {
      window.localStorage.setItem(APP_CONFIG.storageKeys.runSeed, newSeed);
      window.localStorage.removeItem(APP_CONFIG.storageKeys.progress);
    } catch {
      // Ignore storage error
    }
    return newSeed;
  }
}
