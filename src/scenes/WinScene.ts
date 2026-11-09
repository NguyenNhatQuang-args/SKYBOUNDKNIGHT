import Phaser from 'phaser';
import { APP_CONFIG } from '../config';
import { localizeWorldName, t } from '../services/I18nService';
import { Leaderboard, LocalStorageLeaderboard } from '../services/Leaderboard';
import { StaticLevelRepository } from '../services/LevelRepository';
import { LocalStorageSaveService, SaveService } from '../services/SaveService';
import { globalTouchControls } from '../systems/TouchControls';

export interface WinSceneData {
  levelId: string;
  levelName: string;
  elapsedMs: number;
  falls: number;
  jumps: number;
  nextLevelId: string | null;
  foundEasterEgg?: boolean;
  easterEggName?: string;
}

export class WinScene extends Phaser.Scene {
  private readonly saveService: SaveService = new LocalStorageSaveService();
  private readonly leaderboard: Leaderboard = new LocalStorageLeaderboard();
  private uiLayer: HTMLElement | null = null;
  private hudOverlay: HTMLElement | null = null;

  constructor() {
    super({ key: 'WinScene' });
  }

  public create(data: WinSceneData): void {
    this.uiLayer = document.getElementById('ui-layer');
    this.hudOverlay = document.getElementById('hud-overlay');
    this.hudOverlay?.classList.remove('visible');
    globalTouchControls.setSceneActive(false);

    void this.recordAndRender(data);
  }

  private async recordAndRender(data: WinSceneData): Promise<void> {
    const nowIso = new Date().toISOString();
    const playerName = this.saveService.getPlayerName();

    this.saveService.saveBestRun({
      levelId: data.levelId,
      bestTimeMs: data.elapsedMs,
      leastFalls: data.falls,
      achievedAt: nowIso,
      foundEasterEgg: Boolean(data.foundEasterEgg)
    });

    await this.leaderboard.submit({
      playerName,
      levelId: data.levelId,
      timeMs: data.elapsedMs,
      falls: data.falls,
      dateIso: nowIso,
      foundEasterEgg: Boolean(data.foundEasterEgg)
    });

    await this.renderLeaderboardModal(data);
  }

  private async renderLeaderboardModal(data: WinSceneData): Promise<void> {
    const topEntries = await this.leaderboard.top(data.levelId, 6);
    if (!this.uiLayer) return;
    this.uiLayer.classList.add('visible');

    const tr = t();
    const totalEggs = this.saveService.getDiscoveredEasterEggs().length;
    const playerName = this.saveService.getPlayerName();
    const locLevelName = localizeWorldName(data.levelId, data.levelName);

    const rowsHtml = topEntries
      .map((entry, idx) => {
        const rankLabel = idx === 0 ? tr.rank1 : idx === 1 ? tr.rank2 : idx === 2 ? tr.rank3 : `#${idx + 1}`;
        const eggBadge = entry.foundEasterEgg
          ? ` <span style="color:#e8c170;font-weight:700;">${tr.relicTag.trim()}</span>`
          : '';
        return `
        <tr>
          <td style="font-weight:700;color:#d4b475;">${rankLabel}</td>
          <td>${entry.playerName}${eggBadge}</td>
          <td style="color:#e8c170;font-weight:700;">${this.formatTime(entry.timeMs)}</td>
          <td>${entry.falls}</td>
        </tr>
      `;
      })
      .join('');

    const easterEggBanner = data.foundEasterEgg
      ? `
        <div class="loadout-summary-box" style="flex-direction:column;text-align:center;">
          <div style="color:#e8c170; font-weight:800; font-size:14px; letter-spacing:0.5px;">
            ${tr.winRelicBannerTitle}
          </div>
          <div style="color:#e6dfd3; font-size:12.5px; margin-top:2px;">
            ${tr.winRelicBannerSub(data.easterEggName ?? 'Ancient Relic', totalEggs)}
          </div>
        </div>
      `
      : '';

    this.uiLayer.innerHTML = `
      <div class="ui-card">
        <div class="citadel-crest-bar">
          <span class="citadel-crest-line"></span>
          <span>${tr.crestWin}</span>
          <span class="citadel-crest-line"></span>
        </div>
        <div class="ui-title">${data.foundEasterEgg ? tr.winTitleRelic : tr.winTitleSummit}</div>
        <div class="ui-subtitle">${tr.winSubtitle(locLevelName)}</div>

        ${easterEggBanner}

        <div class="ui-row">
          <span>${tr.knightTitleLabel}</span>
          <span style="display:flex;gap:6px;">
            <input id="inp-speedrun-name" type="text" value="${playerName}" maxlength="20"
              style="background:#0e1017;border:1px solid #8a6d3b;color:#f8fafc;padding:3px 8px;font-size:13px;width:155px;" />
            <button class="hud-btn" id="btn-save-name" type="button">${tr.saveTitleBtn}</button>
          </span>
        </div>
        <div class="ui-row">
          <span>${tr.winTimeLabel}</span>
          <span style="color:#e8c170;font-weight:800;font-size:17px;">${this.formatTime(data.elapsedMs)}</span>
        </div>
        <div class="ui-row">
          <span>${tr.winJumpsFallsLabel}</span>
          <b>${tr.winJumpsFallsVal(data.jumps, data.falls)}</b>
        </div>

        <div class="ui-section">
          <div style="font-size:12px;font-weight:700;color:#d4b475;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">
            ${tr.winLeaderboardTitle(locLevelName)}
          </div>
          <table class="ui-table">
            <thead>
              <tr>
                <th>${tr.thRank}</th>
                <th>${tr.thKnight}</th>
                <th>${tr.thTime}</th>
                <th>${tr.thFalls}</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>

        <div class="ui-section ui-btn-list">
          ${
            data.nextLevelId
              ? `<button class="ui-btn primary" id="btn-win-next">
                  <span>${tr.btnWinNext}</span>
                </button>`
              : ''
          }
          <button class="ui-btn ${data.nextLevelId ? '' : 'primary'}" id="btn-win-replay">
            <span>${tr.btnWinReplay}</span>
          </button>
          <button class="ui-btn" id="btn-win-menu">
            <span>${tr.btnWinMenu}</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-save-name')?.addEventListener('click', () => {
      const inp = document.getElementById('inp-speedrun-name') as HTMLInputElement | null;
      if (inp && inp.value.trim()) {
        this.saveService.setPlayerName(inp.value.trim());
        void this.leaderboard
          .submit({
            playerName: this.saveService.getPlayerName(),
            levelId: data.levelId,
            timeMs: data.elapsedMs,
            falls: data.falls,
            dateIso: new Date().toISOString(),
            foundEasterEgg: Boolean(data.foundEasterEgg)
          })
          .then(() => this.renderLeaderboardModal(data));
      }
    });

    document.getElementById('btn-win-next')?.addEventListener('click', () => {
      if (data.nextLevelId) {
        this.closeModal();
        this.scene.start('GameScene', {
          levelId: data.nextLevelId,
          resumeSavedCheckpoint: false
        });
      }
    });

    document.getElementById('btn-win-replay')?.addEventListener('click', () => {
      this.saveService.clearProgress();
      this.saveService.resetRunSeed();
      StaticLevelRepository.clearCache();
      this.closeModal();
      this.scene.start('GameScene', {
        levelId: APP_CONFIG.defaultLevelId,
        resumeSavedCheckpoint: false
      });
    });

    document.getElementById('btn-win-menu')?.addEventListener('click', () => {
      this.closeModal();
      this.scene.start('MenuScene');
    });
  }

  private closeModal(): void {
    if (this.uiLayer) {
      this.uiLayer.classList.remove('visible');
      this.uiLayer.innerHTML = '';
    }
  }

  private formatTime(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  }
}
