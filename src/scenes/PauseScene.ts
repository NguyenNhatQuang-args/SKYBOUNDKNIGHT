import Phaser from 'phaser';
import {
  GAME_LANGUAGE_LIST,
  GameLanguage,
  LANGUAGE_LABELS,
  LANGUAGE_SHORT_CODES,
  LANGUAGE_SUBTITLES,
  t
} from '../services/I18nService';
import { globalSettings } from '../services/SettingsService';
import { GameScene } from './GameScene';

export class PauseScene extends Phaser.Scene {
  private uiLayer: HTMLElement | null = null;
  private isLanguageListOpen = false;

  constructor() {
    super({ key: 'PauseScene' });
  }

  public create(): void {
    this.uiLayer = document.getElementById('ui-layer');
    this.isLanguageListOpen = false;
    this.renderPauseModal();

    this.input.keyboard?.on('keydown-ESC', () => {
      this.resumeGame();
    });
    this.input.keyboard?.on('keydown-P', () => {
      this.resumeGame();
    });
  }

  private renderPauseModal(): void {
    if (!this.uiLayer) return;
    const tr = t();
    const s = globalSettings.get();
    this.uiLayer.classList.add('visible');

    const langCourseListHtml = this.isLanguageListOpen
      ? `
        <div class="lang-course-list" style="
          display: flex;
          flex-direction: column;
          gap: 5px;
          padding: 8px;
          margin: 2px 0 6px 0;
          background: rgba(11, 13, 20, 0.96);
          border: 1px solid #8a6d3b;
          max-height: 210px;
          overflow-y: auto;
        ">
          ${GAME_LANGUAGE_LIST.map((code, idx) => {
            const active = s.language === code;
            return `
              <button class="ui-btn ${active ? 'primary' : ''}" data-lang-code="${code}" type="button" style="padding: 7px 11px;">
                <div style="display:flex;flex-direction:column;gap:1px;">
                  <div style="font-size:12.5px;font-weight:700;color:${active ? '#fff8e7' : '#e8c170'};">
                    ${idx + 1}. ${LANGUAGE_LABELS[code]} <span style="font-size:10.5px;color:#9e9689;">[${LANGUAGE_SHORT_CODES[code]}]</span>
                  </div>
                  <div style="font-size:10.5px;font-weight:400;color:#a8a093;">
                    ${LANGUAGE_SUBTITLES[code]}
                  </div>
                </div>
                <span class="badge">${active ? tr.activeLabel : LANGUAGE_SHORT_CODES[code]}</span>
              </button>
            `;
          }).join('')}
        </div>
      `
      : '';

    this.uiLayer.innerHTML = `
      <div class="ui-card">
        <div class="citadel-crest-bar">
          <span class="citadel-crest-line"></span>
          <span>${tr.crestPause}</span>
          <span class="citadel-crest-line"></span>
        </div>
        <div class="ui-title">${tr.pauseTitle}</div>
        <div class="ui-subtitle">${tr.pauseSubtitle}</div>
        <div class="ui-btn-list">
          <button class="ui-btn primary" id="btn-pause-resume" type="button">
            <span>${tr.btnPauseResume}</span>
          </button>
          <button class="ui-btn" id="btn-pause-restart" type="button">
            <span>${tr.btnPauseRestart}</span>
          </button>
          <button class="ui-btn" id="btn-pause-lang" type="button">
            <span>${tr.btnPauseLanguage}</span>
            <span class="badge">${LANGUAGE_LABELS[s.language]} ${this.isLanguageListOpen ? '&#9650;' : '&#9660;'}</span>
          </button>
          ${langCourseListHtml}
          <button class="ui-btn" id="btn-pause-ratio" type="button">
            <span>${tr.btnPauseRatio}</span>
            <span class="badge">${tr.displayModes[s.displayMode]}</span>
          </button>
          <button class="ui-btn" id="btn-pause-sound" type="button">
            <span>${tr.btnPauseSound}</span>
            <span class="badge">${s.soundEnabled ? tr.activeLabel : tr.mutedLabel}</span>
          </button>
          <button class="ui-btn" id="btn-pause-fx" type="button">
            <span>${tr.btnPauseFx}</span>
            <span class="badge">${s.effectsEnabled ? tr.activeLabel : tr.mutedLabel}</span>
          </button>
          <div class="ui-section">
            <button class="ui-btn" id="btn-pause-menu" type="button">
              <span>${tr.btnPauseMenu}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-pause-resume')?.addEventListener('click', () => {
      this.resumeGame();
    });

    document.getElementById('btn-pause-restart')?.addEventListener('click', () => {
      const gameScene = this.scene.get('GameScene') as GameScene;
      gameScene.restartLevelFromBottom();
      this.resumeGame();
    });

    document.getElementById('btn-pause-lang')?.addEventListener('click', () => {
      this.isLanguageListOpen = !this.isLanguageListOpen;
      this.renderPauseModal();
    });

    this.uiLayer.querySelectorAll<HTMLButtonElement>('[data-lang-code]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang-code') as GameLanguage;
        if (lang) {
          globalSettings.setLanguage(lang);
          this.isLanguageListOpen = false;
          const gameScene = this.scene.get('GameScene') as GameScene;
          gameScene.syncSettingsFromPause();
          this.renderPauseModal();
        }
      });
    });

    document.getElementById('btn-pause-ratio')?.addEventListener('click', () => {
      globalSettings.cycleDisplayMode();
      const gameScene = this.scene.get('GameScene') as GameScene;
      gameScene.syncSettingsFromPause();
      this.renderPauseModal();
    });

    document.getElementById('btn-pause-sound')?.addEventListener('click', () => {
      globalSettings.toggleSound();
      const gameScene = this.scene.get('GameScene') as GameScene;
      gameScene.syncSettingsFromPause();
      this.renderPauseModal();
    });

    document.getElementById('btn-pause-fx')?.addEventListener('click', () => {
      globalSettings.toggleEffects();
      const gameScene = this.scene.get('GameScene') as GameScene;
      gameScene.syncSettingsFromPause();
      this.renderPauseModal();
    });

    document.getElementById('btn-pause-menu')?.addEventListener('click', () => {
      this.closeModal();
      const gameScene = this.scene.get('GameScene') as GameScene;
      gameScene.exitToMainMenu();
      this.scene.stop();
    });
  }

  private resumeGame(): void {
    this.closeModal();
    const gameScene = this.scene.get('GameScene') as GameScene;
    gameScene.onResumeFromPause();
    this.scene.stop();
  }

  private closeModal(): void {
    if (this.uiLayer) {
      this.uiLayer.classList.remove('visible');
      this.uiLayer.innerHTML = '';
    }
  }
}
