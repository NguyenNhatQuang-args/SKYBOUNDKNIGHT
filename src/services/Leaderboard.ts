import { APP_CONFIG } from '../config';

export interface LeaderboardEntry {
  playerName: string;
  levelId: string;
  timeMs: number;
  falls: number;
  dateIso: string;
  foundEasterEgg?: boolean;
}

export interface Leaderboard {
  submit(run: LeaderboardEntry): Promise<void>;
  top(levelId: string, limit?: number): Promise<LeaderboardEntry[]>;
  topGlobal(limit?: number): Promise<LeaderboardEntry[]>;
}

export class LocalStorageLeaderboard implements Leaderboard {
  public async submit(run: LeaderboardEntry): Promise<void> {
    try {
      const all = this.readAll();
      all.push(run);
      all.sort((a, b) => a.timeMs - b.timeMs);
      window.localStorage.setItem(
        APP_CONFIG.storageKeys.leaderboard,
        JSON.stringify(all.slice(0, 300))
      );
    } catch (err) {
      console.warn('[LocalStorageLeaderboard] Không thể lưu điểm:', err);
    }
  }

  public async top(levelId: string, limit = 5): Promise<LeaderboardEntry[]> {
    const all = this.readAll().filter((entry) => entry.levelId === levelId);
    const benchmarks = this.getSeededBenchmarks(levelId);
    const merged = [...all, ...benchmarks];
    merged.sort((a, b) => a.timeMs - b.timeMs);
    return merged.slice(0, limit);
  }

  public async topGlobal(limit = 15): Promise<LeaderboardEntry[]> {
    const all = this.readAll();
    all.sort((a, b) => a.timeMs - b.timeMs);
    return all.slice(0, limit);
  }

  private getSeededBenchmarks(levelId: string): LeaderboardEntry[] {
    let hash = 0;
    for (let i = 0; i < levelId.length; i++) {
      hash = (hash * 31 + levelId.charCodeAt(i)) % 10000;
    }
    const baseMs = 48000 + (hash % 24000);
    return [
      {
        playerName: '⚡ Thần Tốc (Kỷ lục mẫu)',
        levelId,
        timeMs: baseMs,
        falls: 0,
        dateIso: '2026-10-01T00:00:00.000Z',
        foundEasterEgg: true
      },
      {
        playerName: '👑 Hiệp Sĩ Ánh Sáng',
        levelId,
        timeMs: baseMs + 19500,
        falls: 1,
        dateIso: '2026-10-01T00:00:00.000Z',
        foundEasterEgg: false
      },
      {
        playerName: '🛡️ Kẻ Chinh Phục',
        levelId,
        timeMs: baseMs + 42000,
        falls: 3,
        dateIso: '2026-10-01T00:00:00.000Z',
        foundEasterEgg: false
      }
    ];
  }

  private readAll(): LeaderboardEntry[] {
    try {
      const raw = window.localStorage.getItem(APP_CONFIG.storageKeys.leaderboard);
      if (!raw) return [];
      return JSON.parse(raw) as LeaderboardEntry[];
    } catch {
      return [];
    }
  }
}
