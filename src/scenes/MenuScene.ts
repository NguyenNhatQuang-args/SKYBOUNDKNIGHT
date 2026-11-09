import Phaser from 'phaser';
import { APP_CONFIG } from '../config';
import { DISPLAY } from '../constants';
import { WorldMeta } from '../data/levelTypes';
import {
  ACHIEVEMENTS_LIST,
  CHARACTER_SKINS,
  CharacterSkinId,
  globalLoadout,
  SHIELD_ITEMS,
  ShieldItemId,
  WEAPON_ITEMS,
  WeaponItemId
} from '../services/CharacterLoadoutService';
import { Leaderboard, LocalStorageLeaderboard } from '../services/Leaderboard';
import {
  LevelRepository,
  StaticLevelRepository
} from '../services/LevelRepository';
import { LocalStorageSaveService, SaveService } from '../services/SaveService';
import {
  GAME_LANGUAGE_LIST,
  GameLanguage,
  getAchievementLocalized,
  getShieldLocalized,
  getSkinLocalized,
  getWeaponLocalized,
  LANGUAGE_LABELS,
  LANGUAGE_SHORT_CODES,
  LANGUAGE_SUBTITLES,
  localizeRealmName,
  localizeWorldName,
  t
} from '../services/I18nService';
import { globalSettings } from '../services/SettingsService';
import { ProceduralTextures, TEXTURE_KEYS } from '../systems/ProceduralTextures';
import { globalTouchControls } from '../systems/TouchControls';

type MenuTab = 'main' | 'armory' | 'worlds' | 'speedrun' | 'settings' | 'howto';
type ArmorySubTab = 'skins' | 'weapons' | 'shields' | 'achievements';

export class MenuScene extends Phaser.Scene {
  private readonly levelRepo: LevelRepository = new StaticLevelRepository();
  private readonly saveService: SaveService = new LocalStorageSaveService();
  private readonly leaderboard: Leaderboard = new LocalStorageLeaderboard();

  private uiLayer: HTMLElement | null = null;
  private hudOverlay: HTMLElement | null = null;
  private currentTab: MenuTab = 'main';
  private armorySubTab: ArmorySubTab = 'skins';
  private isLanguageListOpen = false;
  private selectedRealm = 'ALL';
  private selectedSpeedrunWorldId: string = APP_CONFIG.defaultLevelId;
  private worlds: WorldMeta[] = [];

  private heroSprite!: Phaser.GameObjects.Sprite;
  private heroWeaponSprite!: Phaser.GameObjects.Image;
  private heroShieldSprite!: Phaser.GameObjects.Image;
  private heroAuraGraphics!: Phaser.GameObjects.Graphics;
  private heroTitleText!: Phaser.GameObjects.Text;
  private heroSubText!: Phaser.GameObjects.Text;
  private heroBaseX = 116;
  private heroBaseY = 264;
  private heroHopOffsetY = 0;
  private ambientSprites: Array<{ sprite: Phaser.GameObjects.Image; vx: number; vy: number }> = [];

  constructor() {
    super({ key: 'MenuScene' });
  }

  public create(): void {
    this.uiLayer = document.getElementById('ui-layer');
    this.hudOverlay = document.getElementById('hud-overlay');
    this.hudOverlay?.classList.remove('visible');
    globalTouchControls.setSceneActive(false);

    ProceduralTextures.ensureWorldTextures(this, 'forest');
    ProceduralTextures.ensureCharacterEquipmentTextures(this);

    this.buildCitadelBackdrop();
    this.syncHeroPedestalVisuals();

    void this.initMenu();
  }

  /**
   * Dựng bối cảnh Sảnh Thành Cổ & Đài Hiệp Sĩ (Citadel Sanctuary Courtyard)
   * trực tiếp trên Canvas để làm nền kiến trúc sống động cho Menu.
   */
  private buildCitadelBackdrop(): void {
    this.add.image(0, 0, ProceduralTextures.getSkyKey('forest')).setOrigin(0, 0);
    this.add.image(0, 0, ProceduralTextures.getMidKey('forest')).setOrigin(0, 0);
    this.add.image(0, 0, ProceduralTextures.getNearKey('forest')).setOrigin(0, 0);

    const surfaceTex = ProceduralTextures.getSolidSurfaceKey('forest');
    const deepTex = ProceduralTextures.getSolidDeepKey('forest');
    const oreTex = ProceduralTextures.getSolidOreKey('forest');
    const supportTex = TEXTURE_KEYS.TILE_BG_SUPPORT;
    const platformTex = ProceduralTextures.getPlatformKey('forest');

    // Tường thành cổ và nền móng đá phía dưới (Rows 21..23)
    for (let r = 21; r < 24; r++) {
      for (let c = 0; c < 32; c++) {
        const tex = r === 21 ? surfaceTex : (c + r) % 5 === 0 ? oreTex : deepTex;
        this.add.image(c * 16, r * 16, tex).setOrigin(0, 0).setDepth(5);
      }
    }

    // Tháp canh cổ bên trái (Cols 1..4, Rows 13..20)
    for (let r = 13; r <= 20; r++) {
      for (let c = 1; c <= 4; c++) {
        this.add
          .image(c * 16, r * 16, supportTex)
          .setOrigin(0, 0)
          .setAlpha(0.75)
          .setDepth(3);
      }
    }
    for (let c = 1; c <= 4; c++) {
      this.add.image(c * 16, 13 * 16, surfaceTex).setOrigin(0, 0).setDepth(6);
    }

    // Đài Tưởng Niệm Hiệp Sĩ ở khu vực trung tâm trái (Cols 5..10, Rows 17..20)
    for (let r = 18; r <= 20; r++) {
      for (let c = 4; c <= 10; c++) {
        this.add.image(c * 16, r * 16, supportTex).setOrigin(0, 0).setAlpha(0.85).setDepth(4);
      }
    }
    for (let c = 4; c <= 10; c++) {
      this.add.image(c * 16, 17 * 16, surfaceTex).setOrigin(0, 0).setDepth(6);
      this.add.image(c * 16, 18 * 16, deepTex).setOrigin(0, 0).setDepth(6);
    }
    // Bệ đá trung tâm nơi Hiệp Sĩ đứng (Cols 6..8, Row 16 -> y = 256, mặt trên = 256)
    for (let c = 6; c <= 8; c++) {
      this.add.image(c * 16, 16 * 16, surfaceTex).setOrigin(0, 0).setDepth(7);
    }
    this.heroBaseX = 7 * 16 + 8; // x = 120
    this.heroBaseY = 16 * 16; // y = 256

    // Cầu treo cổ nối sang tháp phụ (Cols 11..14, Row 17)
    for (let c = 11; c <= 14; c++) {
      this.add.image(c * 16, 17 * 16, platformTex).setOrigin(0, 0).setDepth(6);
    }

    // Các bậc tháp đá dẫn lên bầu trời (Cols 12..16, Rows 10..14)
    for (let c = 13; c <= 16; c++) {
      this.add.image(c * 16, 14 * 16, surfaceTex).setOrigin(0, 0).setDepth(6);
    }
    for (let c = 8; c <= 11; c++) {
      this.add.image(c * 16, 11 * 16, surfaceTex).setOrigin(0, 0).setDepth(6);
    }

    // Vật thể kiến trúc: Trụ đá cổ, Cây đại thụ, Đuốc lửa, Lò lửa linh hồn, Rương báu
    this.add.image(2 * 16 + 8, 13 * 16, TEXTURE_KEYS.PROP_TREE_OAK).setOrigin(0.5, 1).setDepth(7);
    this.add.image(15 * 16 + 8, 14 * 16, TEXTURE_KEYS.PROP_TREE_CHERRY).setOrigin(0.5, 1).setDepth(7);
    this.add.image(5 * 16, 17 * 16, TEXTURE_KEYS.PROP_RUIN_PILLAR).setOrigin(0.5, 1).setDepth(7);
    this.add.image(10 * 16, 17 * 16, TEXTURE_KEYS.PROP_RUIN_PILLAR).setOrigin(0.5, 1).setDepth(7);
    this.add.image(5 * 16 + 12, 17 * 16, TEXTURE_KEYS.PROP_SOUL_BRAZIER).setOrigin(0.5, 1).setDepth(8);
    this.add.image(9 * 16 + 4, 17 * 16, TEXTURE_KEYS.PROP_SOUL_BRAZIER).setOrigin(0.5, 1).setDepth(8);
    this.add.image(9 * 16 + 8, 11 * 16, TEXTURE_KEYS.PROP_CHEST_GOLD).setOrigin(0.5, 1).setDepth(8);
    this.add.image(14 * 16, 14 * 16, TEXTURE_KEYS.PROP_LANTERN).setOrigin(0.5, 1).setDepth(8);
    this.add
      .image(3 * 16 + 8, 21 * 16, TEXTURE_KEYS.PROP_SOUL_BRAZIER)
      .setOrigin(0.5, 1)
      .setDepth(8);

    // Tạo hạt đom đóm / lá bay trong sân thành cổ
    this.ambientSprites = [];
    for (let i = 0; i < 18; i++) {
      const pTex = i % 2 === 0 ? TEXTURE_KEYS.PARTICLE_EMBER : TEXTURE_KEYS.PARTICLE_LEAF;
      const sp = this.add
        .image(
          Phaser.Math.Between(8, DISPLAY.WIDTH - 8),
          Phaser.Math.Between(12, DISPLAY.HEIGHT - 40),
          pTex
        )
        .setAlpha(Phaser.Math.FloatBetween(0.45, 0.85))
        .setDepth(9);
      this.ambientSprites.push({
        sprite: sp,
        vx: Phaser.Math.FloatBetween(-12, 16),
        vy: Phaser.Math.FloatBetween(-14, -4)
      });
    }

    // Khởi tạo Nhân Vật chính trên Bệ Đá Thành Cổ (Scale 2.5x sắc nét)
    this.heroAuraGraphics = this.add.graphics().setDepth(16.5);

    this.heroSprite = this.add
      .sprite(this.heroBaseX, this.heroBaseY, TEXTURE_KEYS.PLAYER_IDLE)
      .setOrigin(0.5, 1)
      .setScale(2.5)
      .setDepth(15);

    this.heroShieldSprite = this.add
      .image(
        this.heroBaseX - 12,
        this.heroBaseY - 15,
        ProceduralTextures.getShieldKey('shield-heraldic')
      )
      .setOrigin(0.5, 0.5)
      .setScale(2.1)
      .setDepth(15.5);

    this.heroWeaponSprite = this.add
      .image(
        this.heroBaseX + 12,
        this.heroBaseY - 16,
        ProceduralTextures.getWeaponKey('weapon-broadsword')
      )
      .setOrigin(0.35, 0.78)
      .setScale(2.15)
      .setDepth(16);

    // Bảng tên khắc đá phía trên nhân vật
    this.heroTitleText = this.add
      .text(this.heroBaseX, this.heroBaseY - 64, '', {
        fontFamily: 'Georgia, serif',
        fontSize: '11px',
        color: '#e8c170',
        stroke: '#090a0f',
        strokeThickness: 3,
        fontStyle: 'bold'
      })
      .setOrigin(0.5, 0.5)
      .setDepth(18);

    this.heroSubText = this.add
      .text(this.heroBaseX, this.heroBaseY - 51, '', {
        fontFamily: 'Segoe UI, sans-serif',
        fontSize: '9px',
        color: '#cbd5e1',
        stroke: '#090a0f',
        strokeThickness: 3
      })
      .setOrigin(0.5, 0.5)
      .setDepth(18);
  }

  private syncHeroPedestalVisuals(triggerHop = false): void {
    if (!this.heroSprite) return;
    const loadout = globalLoadout.getLoadout();
    const skinDef = globalLoadout.getSkinDef(loadout.skinId);
    const weaponDef = globalLoadout.getWeaponDef(loadout.weaponId);
    const shieldDef = globalLoadout.getShieldDef(loadout.shieldId);

    this.heroSprite.setTexture(
      ProceduralTextures.getPlayerFrameKey(loadout.skinId, TEXTURE_KEYS.PLAYER_IDLE)
    );

    if (loadout.weaponId !== 'weapon-none') {
      this.heroWeaponSprite.setVisible(true);
      this.heroWeaponSprite.setTexture(ProceduralTextures.getWeaponKey(loadout.weaponId));
    } else {
      this.heroWeaponSprite.setVisible(false);
    }

    if (loadout.shieldId !== 'shield-none') {
      this.heroShieldSprite.setVisible(true);
      this.heroShieldSprite.setTexture(ProceduralTextures.getShieldKey(loadout.shieldId));
    } else {
      this.heroShieldSprite.setVisible(false);
    }

    const skinLoc = getSkinLocalized(loadout.skinId, skinDef);
    const weaponLoc = getWeaponLocalized(loadout.weaponId, weaponDef);
    const shieldLoc = getShieldLocalized(loadout.shieldId, shieldDef);

    this.heroTitleText.setText(skinLoc.name.toUpperCase());
    this.heroSubText.setText(`${weaponLoc.name}  |  ${shieldLoc.name}`);

    if (triggerHop) {
      this.tweens.add({
        targets: this,
        heroHopOffsetY: -18,
        duration: 130,
        yoyo: true,
        ease: 'Quad.easeOut'
      });
    }
  }

  public override update(time: number, delta: number): void {
    const loadout = globalLoadout.getLoadout();
    const frameIdx = Math.floor(time / 135) % 6;
    const baseKeys = [
      TEXTURE_KEYS.PLAYER_WALK_1,
      TEXTURE_KEYS.PLAYER_WALK_2,
      TEXTURE_KEYS.PLAYER_WALK_3,
      TEXTURE_KEYS.PLAYER_WALK_4,
      TEXTURE_KEYS.PLAYER_WALK_5,
      TEXTURE_KEYS.PLAYER_WALK_6
    ];
    const baseFrame = baseKeys[frameIdx] ?? TEXTURE_KEYS.PLAYER_IDLE;
    this.heroSprite.setTexture(ProceduralTextures.getPlayerFrameKey(loadout.skinId, baseFrame));

    const drawY = Math.round(this.heroBaseY + this.heroHopOffsetY);
    this.heroSprite.setPosition(this.heroBaseX, drawY);

    const swing = Math.sin(time * 0.008) * 12;
    const bob = Math.cos(time * 0.008) * 2;

    const wx = this.heroBaseX + 13;
    const wy = Math.round(drawY - 16 + bob);
    this.heroWeaponSprite.setPosition(wx, wy);
    this.heroWeaponSprite.setAngle(swing);

    const sx = this.heroBaseX - 13;
    const sy = Math.round(drawY - 14 - bob * 0.6);
    this.heroShieldSprite.setPosition(sx, sy);
    this.heroShieldSprite.setAngle(-swing * 0.35);

    this.heroAuraGraphics.clear();
    const weaponDef = globalLoadout.getWeaponDef(loadout.weaponId);
    const shieldDef = globalLoadout.getShieldDef(loadout.shieldId);
    const pulse = 0.55 + 0.45 * Math.sin(time * 0.007);

    if (loadout.weaponId !== 'weapon-none' && weaponDef.fxStyle !== 'none') {
      const tipX = wx + 13;
      const tipY = wy - 14;
      this.heroAuraGraphics.fillStyle(weaponDef.fxColor, 0.22 * pulse);
      this.heroAuraGraphics.fillCircle(tipX, tipY, 13);
      this.heroAuraGraphics.fillStyle(weaponDef.fxSecondaryColor, 0.5 * pulse);
      this.heroAuraGraphics.fillCircle(tipX, tipY, 6);
      const flareLen = Math.round(8 + pulse * 6);
      this.heroAuraGraphics.lineStyle(1.5, 0xffffff, 0.85 * pulse);
      this.heroAuraGraphics.lineBetween(tipX - flareLen, tipY, tipX + flareLen, tipY);
      this.heroAuraGraphics.lineBetween(tipX, tipY - flareLen, tipX, tipY + flareLen);
    }

    if (loadout.shieldId !== 'shield-none' && shieldDef.fxStyle !== 'none') {
      this.heroAuraGraphics.lineStyle(1.5, shieldDef.fxColor, 0.45 * pulse);
      this.heroAuraGraphics.strokeCircle(sx, sy, 14 + pulse * 3);
      for (let k = 0; k < 2; k++) {
        const ang = time * 0.0045 + k * Math.PI;
        const ox = sx + Math.cos(ang) * 15;
        const oy = sy + Math.sin(ang) * 11;
        this.heroAuraGraphics.fillStyle(k === 0 ? shieldDef.fxColor : shieldDef.fxSecondaryColor, 0.9);
        this.heroAuraGraphics.fillCircle(ox, oy, 2.5);
      }
    }

    const dtSec = delta / 1000;
    for (const p of this.ambientSprites) {
      p.sprite.x += p.vx * dtSec;
      p.sprite.y += p.vy * dtSec;
      if (p.sprite.x < -8) p.sprite.x = DISPLAY.WIDTH + 8;
      if (p.sprite.x > DISPLAY.WIDTH + 8) p.sprite.x = -8;
      if (p.sprite.y < -8) p.sprite.y = DISPLAY.HEIGHT - 44;
    }
  }

  private async initMenu(): Promise<void> {
    this.worlds = await this.levelRepo.listWorlds();
    this.currentTab = 'main';
    this.renderUi();
  }

  private renderUi(): void {
    if (!this.uiLayer) return;
    this.uiLayer.classList.add('visible');

    // Ở màn hình chính và Kho Trang Bị, neo bảng sang bên phải để lộ Đài Hiệp Sĩ Thành Cổ bên trái
    if (this.currentTab === 'main' || this.currentTab === 'armory') {
      this.uiLayer.classList.add('citadel-dock');
    } else {
      this.uiLayer.classList.remove('citadel-dock');
    }

    if (this.currentTab === 'main') {
      this.renderMainTab();
    } else if (this.currentTab === 'armory') {
      this.renderArmoryTab();
    } else if (this.currentTab === 'worlds') {
      this.renderWorldsTab();
    } else if (this.currentTab === 'speedrun') {
      void this.renderSpeedrunTab();
    } else if (this.currentTab === 'settings') {
      this.renderSettingsTab();
    } else if (this.currentTab === 'howto') {
      this.renderHowToTab();
    }
  }

  private renderMainTab(): void {
    if (!this.uiLayer) return;
    const tr = t();
    const s = globalSettings.get();
    const saved = this.saveService.loadProgress();
    const savedWorldMeta = saved ? this.worlds.find((w) => w.id === saved.currentLevelId) : null;
    const savedWorld = saved
      ? savedWorldMeta
        ? localizeWorldName(savedWorldMeta.id, savedWorldMeta.name)
        : saved.currentLevelId
      : null;
    const discoveredEggs = this.saveService.getDiscoveredEasterEggs().length;
    const bestRunsCount = Object.keys(this.saveService.getBestRuns()).length;
    const loadout = globalLoadout.getLoadout();
    const skinDef = globalLoadout.getSkinDef(loadout.skinId);
    const weaponDef = globalLoadout.getWeaponDef(loadout.weaponId);
    const shieldDef = globalLoadout.getShieldDef(loadout.shieldId);
    const skinLoc = getSkinLocalized(loadout.skinId, skinDef);
    const weaponLoc = getWeaponLocalized(loadout.weaponId, weaponDef);
    const shieldLoc = getShieldLocalized(loadout.shieldId, shieldDef);

    this.uiLayer.innerHTML = `
      <div class="ui-card citadel-panel">
        <div class="citadel-crest-bar" style="justify-content:space-between;">
          <span class="citadel-crest-line"></span>
          <span>${tr.crestMain}</span>
          <span class="citadel-crest-line"></span>
          <button class="hud-btn" id="btn-quick-lang" type="button" title="Switch Language" style="padding:2px 7px;font-size:10.5px;">
            ${LANGUAGE_SHORT_CODES[s.language]}
          </button>
        </div>
        <div class="ui-title">${tr.gameTitle}</div>
        <div class="ui-subtitle">${tr.mainSubtitle}</div>

        <div class="hero-banner">
          <div class="stat-chip">
            <div class="val">${tr.stat100StagesVal(this.worlds.length)}</div>
            <div class="lbl">${tr.stat100StagesLbl}</div>
          </div>
          <div class="stat-chip">
            <div class="val">${discoveredEggs} / ${this.worlds.length}</div>
            <div class="lbl">${tr.statRelicsLbl}</div>
          </div>
          <div class="stat-chip">
            <div class="val">${bestRunsCount} / ${this.worlds.length}</div>
            <div class="lbl">${tr.statSummitsLbl}</div>
          </div>
        </div>

        <div class="loadout-summary-box">
          <div>
            <div style="color:#e8c170;font-weight:700;">${tr.equippedLabel(skinLoc.name)}</div>
            <div style="color:#a8a093;font-size:11.5px;">${tr.equippedSubLabel(weaponLoc.name, shieldLoc.name)}</div>
          </div>
          <button class="hud-btn" id="btn-quick-armory" type="button">${tr.changeLoadoutBtn}</button>
        </div>

        <div class="ui-btn-list">
          ${
            saved && savedWorld
              ? `<button class="ui-btn primary" id="btn-continue">
                  <span>${tr.btnContinue(savedWorld)}</span>
                  <span class="badge">${tr.badgeFloor(saved.screenIndex + 1)}</span>
                </button>`
              : ''
          }
          <button class="ui-btn ${saved ? '' : 'primary'}" id="btn-new-game">
            <span>${tr.btnNewGame(saved ? 'II' : 'I')}</span>
            <span class="badge">${tr.badgeStage01}</span>
          </button>
          <button class="ui-btn" id="btn-armory">
            <span>${tr.btnArmory}</span>
            <span class="badge">${tr.badgeArmory}</span>
          </button>
          <button class="ui-btn" id="btn-select-world">
            <span>${tr.btnSelectWorld}</span>
            <span class="badge">${bestRunsCount}/${this.worlds.length}</span>
          </button>
          <button class="ui-btn" id="btn-speedrun">
            <span>${tr.btnSpeedrun}</span>
            <span class="badge">${tr.badgeRelicsCount(discoveredEggs, this.worlds.length)}</span>
          </button>
          <button class="ui-btn" id="btn-settings">
            <span>${tr.btnSettings}</span>
            <span class="badge">${LANGUAGE_LABELS[s.language]}</span>
          </button>
          <button class="ui-btn" id="btn-howto">
            <span>${tr.btnHowTo}</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-quick-lang')?.addEventListener('click', () => {
      this.currentTab = 'settings';
      this.isLanguageListOpen = true;
      this.renderUi();
    });

    document.getElementById('btn-continue')?.addEventListener('click', () => {
      if (saved) {
        this.startGame(saved.currentLevelId, true);
      }
    });

    document.getElementById('btn-new-game')?.addEventListener('click', () => {
      this.saveService.clearProgress();
      this.saveService.resetRunSeed();
      StaticLevelRepository.clearCache();
      this.startGame(APP_CONFIG.defaultLevelId, false);
    });

    document.getElementById('btn-armory')?.addEventListener('click', () => {
      this.currentTab = 'armory';
      this.renderUi();
    });

    document.getElementById('btn-quick-armory')?.addEventListener('click', () => {
      this.currentTab = 'armory';
      this.renderUi();
    });

    document.getElementById('btn-select-world')?.addEventListener('click', () => {
      this.currentTab = 'worlds';
      this.renderUi();
    });

    document.getElementById('btn-speedrun')?.addEventListener('click', () => {
      this.currentTab = 'speedrun';
      this.renderUi();
    });

    document.getElementById('btn-settings')?.addEventListener('click', () => {
      this.currentTab = 'settings';
      this.isLanguageListOpen = false;
      this.renderUi();
    });

    document.getElementById('btn-howto')?.addEventListener('click', () => {
      this.currentTab = 'howto';
      this.renderUi();
    });
  }

  private renderArmoryTab(): void {
    if (!this.uiLayer) return;
    const tr = t();
    const loadout = globalLoadout.getLoadout();
    const stats = globalLoadout.getCareerStats();

    let listHtml = '';

    if (this.armorySubTab === 'skins') {
      listHtml = CHARACTER_SKINS.map((skin) => {
        const loc = getSkinLocalized(skin.id, skin);
        const unlocked = globalLoadout.isAchievementUnlocked(skin.achievementId);
        const equipped = loadout.skinId === skin.id;
        const statusBadge = equipped
          ? tr.badgeEquippedSkin
          : unlocked
            ? tr.badgeUnlocked
            : tr.badgeLocked;
        return `
          <button class="ui-btn ${equipped ? 'primary' : ''} ${unlocked ? '' : 'locked'}" data-skin-id="${skin.id}">
            <div>
              <div style="font-weight:700;color:${equipped ? '#f7ebd4' : '#e8c170'};">${loc.name} <span style="font-size:11px;color:#9e9689;">(${loc.title})</span></div>
              <div style="font-size:11.5px;color:#a8a093;font-weight:400;margin-top:2px;">${loc.description}</div>
              <div style="font-size:11px;color:${unlocked ? '#84cc16' : '#f59e0b'};margin-top:2px;">${loc.achievementDesc}</div>
            </div>
            <span class="badge">${statusBadge}</span>
          </button>
        `;
      }).join('');
    } else if (this.armorySubTab === 'weapons') {
      listHtml = WEAPON_ITEMS.map((w) => {
        const loc = getWeaponLocalized(w.id, w);
        const unlocked = globalLoadout.isAchievementUnlocked(w.achievementId);
        const equipped = loadout.weaponId === w.id;
        const statusBadge = equipped
          ? tr.badgeEquippedWeapon
          : unlocked
            ? tr.badgeUnlocked
            : tr.badgeLocked;
        return `
          <button class="ui-btn ${equipped ? 'primary' : ''} ${unlocked ? '' : 'locked'}" data-weapon-id="${w.id}">
            <div>
              <div style="font-weight:700;color:${equipped ? '#f7ebd4' : '#e8c170'};">[${loc.category}] ${loc.name}</div>
              <div style="font-size:11.5px;color:#a8a093;font-weight:400;margin-top:2px;">${loc.description}</div>
              <div style="font-size:11px;color:${unlocked ? '#84cc16' : '#f59e0b'};margin-top:2px;">${loc.achievementDesc}</div>
            </div>
            <span class="badge">${statusBadge}</span>
          </button>
        `;
      }).join('');
    } else if (this.armorySubTab === 'shields') {
      listHtml = SHIELD_ITEMS.map((sh) => {
        const loc = getShieldLocalized(sh.id, sh);
        const unlocked = globalLoadout.isAchievementUnlocked(sh.achievementId);
        const equipped = loadout.shieldId === sh.id;
        const statusBadge = equipped
          ? tr.badgeEquippedShield
          : unlocked
            ? tr.badgeUnlocked
            : tr.badgeLocked;
        return `
          <button class="ui-btn ${equipped ? 'primary' : ''} ${unlocked ? '' : 'locked'}" data-shield-id="${sh.id}">
            <div>
              <div style="font-weight:700;color:${equipped ? '#f7ebd4' : '#e8c170'};">[${loc.category}] ${loc.name}</div>
              <div style="font-size:11.5px;color:#a8a093;font-weight:400;margin-top:2px;">${loc.description}</div>
              <div style="font-size:11px;color:${unlocked ? '#84cc16' : '#f59e0b'};margin-top:2px;">${loc.achievementDesc}</div>
            </div>
            <span class="badge">${statusBadge}</span>
          </button>
        `;
      }).join('');
    } else {
      listHtml = ACHIEVEMENTS_LIST.map((ach) => {
        const loc = getAchievementLocalized(ach.id, ach);
        const unlocked = ach.checkUnlocked(stats);
        const progress = ach.getProgressText(stats);
        return `
          <div class="ui-btn ${unlocked ? 'primary' : 'locked'}" style="cursor:default;">
            <div>
              <div style="font-weight:700;color:${unlocked ? '#f7ebd4' : '#e8c170'};">${loc.title}</div>
              <div style="font-size:11.5px;color:#d6d3d1;font-weight:400;margin-top:2px;">${loc.description}</div>
              <div style="font-size:11px;color:#e8c170;margin-top:2px;">${loc.rewardText}</div>
            </div>
            <span class="badge">${unlocked ? tr.badgeCompleted : progress}</span>
          </div>
        `;
      }).join('');
    }

    this.uiLayer.innerHTML = `
      <div class="ui-card citadel-panel">
        <div class="citadel-crest-bar">
          <span class="citadel-crest-line"></span>
          <span>${tr.crestArmory}</span>
          <span class="citadel-crest-line"></span>
        </div>
        <div class="ui-title">${tr.armoryTitle}</div>
        <div class="ui-subtitle">${tr.armorySubtitle}</div>

        <div class="armory-subtabs">
          <button class="armory-tab-btn ${this.armorySubTab === 'skins' ? 'active' : ''}" data-subtab="skins">${tr.subtabSkins(CHARACTER_SKINS.length)}</button>
          <button class="armory-tab-btn ${this.armorySubTab === 'weapons' ? 'active' : ''}" data-subtab="weapons">${tr.subtabWeapons(WEAPON_ITEMS.length)}</button>
          <button class="armory-tab-btn ${this.armorySubTab === 'shields' ? 'active' : ''}" data-subtab="shields">${tr.subtabShields(SHIELD_ITEMS.length)}</button>
          <button class="armory-tab-btn ${this.armorySubTab === 'achievements' ? 'active' : ''}" data-subtab="achievements">${tr.subtabAchievements(ACHIEVEMENTS_LIST.length)}</button>
        </div>

        <div class="loadout-summary-box">
          <span style="color:#a8a093;">${tr.careerSummary(stats.totalJumps, stats.totalHardFalls, stats.discoveredEggsCount)}</span>
          <button class="hud-btn" id="btn-toggle-unlock-all" type="button" style="border-color:#e8c170;color:#e8c170;">
            ${stats.unlockAllOverride ? tr.unlockAllOn : tr.unlockAllOff}
          </button>
        </div>

        <div class="ui-btn-list" style="max-height:46vh;overflow-y:auto;padding-right:4px;">
          ${listHtml}
        </div>

        <div class="ui-section">
          <button class="ui-btn" id="btn-back-main">
            <span>${tr.btnBackMain}</span>
          </button>
        </div>
      </div>
    `;

    this.uiLayer.querySelectorAll<HTMLButtonElement>('[data-subtab]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.armorySubTab = (btn.getAttribute('data-subtab') as ArmorySubTab) ?? 'skins';
        this.renderArmoryTab();
      });
    });

    document.getElementById('btn-toggle-unlock-all')?.addEventListener('click', () => {
      globalLoadout.toggleUnlockAllOverride();
      this.syncHeroPedestalVisuals(true);
      this.renderArmoryTab();
    });

    this.uiLayer.querySelectorAll<HTMLButtonElement>('[data-skin-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-skin-id') as CharacterSkinId;
        if (globalLoadout.setSkin(id)) {
          this.syncHeroPedestalVisuals(true);
          this.renderArmoryTab();
        }
      });
    });

    this.uiLayer.querySelectorAll<HTMLButtonElement>('[data-weapon-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-weapon-id') as WeaponItemId;
        if (globalLoadout.setWeapon(id)) {
          this.syncHeroPedestalVisuals(true);
          this.renderArmoryTab();
        }
      });
    });

    this.uiLayer.querySelectorAll<HTMLButtonElement>('[data-shield-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-shield-id') as ShieldItemId;
        if (globalLoadout.setShield(id)) {
          this.syncHeroPedestalVisuals(true);
          this.renderArmoryTab();
        }
      });
    });

    document.getElementById('btn-back-main')?.addEventListener('click', () => {
      this.currentTab = 'main';
      this.renderUi();
    });
  }

  private renderWorldsTab(): void {
    if (!this.uiLayer) return;
    const tr = t();
    const bestRuns = this.saveService.getBestRuns();
    const discoveredEggs = new Set(this.saveService.getDiscoveredEasterEggs());

    const realms = [
      'ALL',
      'Cổ Nguyên',
      'Minecraft',
      'Terraria',
      'Celeste',
      'Hollow Knight',
      'Super Mario',
      'Sonic Zones',
      'Elden Ring',
      'Zelda: Hyrule',
      'Tomb Raider',
      'Metroid',
      'Subnautica',
      'Spelunky',
      'Ori Spirit',
      'The Weeknd Tour',
      'Marsbunn Live',
      'Synthwave Live',
      'EDM Festival',
      'Rock & Symphony'
    ];

    const filterBtnsHtml = realms
      .map((r) => {
        const active = this.selectedRealm === r;
        const label = r === 'ALL' ? tr.filterAll(this.worlds.length) : localizeRealmName(r);
        return `<button class="hud-btn" data-realm="${r}" style="${
          active ? 'background:#5e4321;border-color:#e8c170;color:#fff;' : ''
        }">${label}</button>`;
      })
      .join('');

    const filteredWorlds =
      this.selectedRealm === 'ALL'
        ? this.worlds
        : this.worlds.filter((w) => w.realm === this.selectedRealm);

    const itemsHtml = filteredWorlds
      .map((w) => {
        const best = bestRuns[w.id];
        const hasEgg = discoveredEggs.has(w.id) || Boolean(best?.foundEasterEgg);
        const eggTag = hasEgg ? tr.relicTag : '';
        const bestLabel = best
          ? `${eggTag}${this.formatTime(best.bestTimeMs)} (${tr.fallsCount(best.leastFalls)})`
          : hasEgg
            ? tr.relicFoundOnly
            : tr.unconquered;
        const realmPrefix = w.realm ? `[${localizeRealmName(w.realm)}] ` : '';
        const stageNumStr = w.worldNumber ? tr.stageCounter(w.worldNumber, 100) : '';
        const worldTitle = localizeWorldName(w.id, w.name);
        return `
          <button class="ui-btn" data-world-id="${w.id}">
            <span><b style="color:#e8c170;">${stageNumStr}</b> &bull; ${realmPrefix}${worldTitle}</span>
            <span class="badge">${bestLabel}</span>
          </button>
        `;
      })
      .join('');

    this.uiLayer.innerHTML = `
      <div class="ui-card" style="max-width:680px;">
        <div class="citadel-crest-bar">
          <span class="citadel-crest-line"></span>
          <span>${tr.crestWorlds}</span>
          <span class="citadel-crest-line"></span>
        </div>
        <div class="ui-title">${tr.worldsTitle(filteredWorlds.length)}</div>
        <div class="ui-subtitle">${tr.worldsSubtitle}</div>

        <div style="display:flex;flex-wrap:wrap;gap:5px;margin-bottom:12px;justify-content:center;">
          ${filterBtnsHtml}
        </div>
        <div class="ui-btn-list" style="max-height:52vh;overflow-y:auto;padding-right:4px;">
          ${itemsHtml}
        </div>
        <div class="ui-section">
          <button class="ui-btn" id="btn-back-main">
            <span>${tr.btnBackMain}</span>
          </button>
        </div>
      </div>
    `;

    this.uiLayer.querySelectorAll<HTMLButtonElement>('[data-realm]').forEach((btn) => {
      btn.addEventListener('click', () => {
        this.selectedRealm = btn.getAttribute('data-realm') ?? 'ALL';
        this.renderWorldsTab();
      });
    });

    this.uiLayer.querySelectorAll<HTMLButtonElement>('[data-world-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const worldId = btn.getAttribute('data-world-id') ?? APP_CONFIG.defaultLevelId;
        this.startGame(worldId, false);
      });
    });

    document.getElementById('btn-back-main')?.addEventListener('click', () => {
      this.currentTab = 'main';
      this.renderUi();
    });
  }

  private async renderSpeedrunTab(): Promise<void> {
    if (!this.uiLayer) return;
    const tr = t();
    const discoveredEggs = new Set(this.saveService.getDiscoveredEasterEggs());
    const currentMeta =
      this.worlds.find((w) => w.id === this.selectedSpeedrunWorldId) ?? this.worlds[0];
    const entries = await this.leaderboard.top(this.selectedSpeedrunWorldId, 6);
    const playerName = this.saveService.getPlayerName();

    const optionsHtml = this.worlds
      .map(
        (w) =>
          `<option value="${w.id}" ${w.id === this.selectedSpeedrunWorldId ? 'selected' : ''}>[${localizeRealmName(
            w.realm ?? 'World'
          )}] ${localizeWorldName(w.id, w.name)}</option>`
      )
      .join('');

    const rowsHtml = entries
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

    const isEggFound = currentMeta ? discoveredEggs.has(currentMeta.id) : false;

    this.uiLayer.innerHTML = `
      <div class="ui-card" style="max-width:600px;">
        <div class="citadel-crest-bar">
          <span class="citadel-crest-line"></span>
          <span>${tr.crestSpeedrun}</span>
          <span class="citadel-crest-line"></span>
        </div>
        <div class="ui-title">${tr.speedrunTitle}</div>
        <div class="ui-subtitle">${tr.speedrunSubtitle}</div>

        <div class="ui-row">
          <span>${tr.knightTitleLabel}</span>
          <span style="display:flex;gap:6px;">
            <input id="inp-menu-player-name" type="text" value="${playerName}" maxlength="20"
              style="background:#0e1017;border:1px solid #8a6d3b;color:#f8fafc;padding:4px 8px;font-size:13px;width:165px;" />
            <button class="hud-btn" id="btn-menu-save-name" type="button">${tr.saveTitleBtn}</button>
          </span>
        </div>

        <div class="ui-row">
          <span>${tr.selectWorldLabel}</span>
          <select id="sel-speedrun-world" style="background:#0e1017;border:1px solid #8a6d3b;color:#f8fafc;padding:5px 8px;max-width:280px;font-size:12.5px;">
            ${optionsHtml}
          </select>
        </div>

        <div class="loadout-summary-box" style="margin-top:6px;">
          <span>${tr.mapRelicLabel} <b style="color:#e8c170;">${currentMeta?.easterEggName ?? 'Ancient Relic'}</b></span>
          <span class="badge">${isEggFound ? tr.badgeCollected : tr.badgeUndiscovered}</span>
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

        <div class="ui-section ui-btn-list">
          <button class="ui-btn primary" id="btn-play-selected-speedrun">
            <span>${tr.btnPlaySpeedrun}</span>
            <span class="badge">${tr.badgeLaunch}</span>
          </button>
          <button class="ui-btn" id="btn-back-main">
            <span>${tr.btnBackMain}</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-menu-save-name')?.addEventListener('click', () => {
      const inp = document.getElementById('inp-menu-player-name') as HTMLInputElement | null;
      if (inp && inp.value.trim()) {
        this.saveService.setPlayerName(inp.value.trim());
        void this.renderSpeedrunTab();
      }
    });

    document.getElementById('sel-speedrun-world')?.addEventListener('change', (e) => {
      const target = e.target as HTMLSelectElement;
      this.selectedSpeedrunWorldId = target.value;
      void this.renderSpeedrunTab();
    });

    document.getElementById('btn-play-selected-speedrun')?.addEventListener('click', () => {
      this.startGame(this.selectedSpeedrunWorldId, false);
    });

    document.getElementById('btn-back-main')?.addEventListener('click', () => {
      this.currentTab = 'main';
      this.renderUi();
    });
  }

  private renderSettingsTab(): void {
    if (!this.uiLayer) return;
    const tr = t();
    const s = globalSettings.get();

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
          max-height: 240px;
          overflow-y: auto;
        ">
          ${GAME_LANGUAGE_LIST.map((code, idx) => {
            const active = s.language === code;
            return `
              <button class="ui-btn ${active ? 'primary' : ''}" data-lang-code="${code}" type="button" style="padding: 8px 12px;">
                <div style="display:flex;flex-direction:column;gap:1px;">
                  <div style="font-size:13px;font-weight:700;color:${active ? '#fff8e7' : '#e8c170'};">
                    ${idx + 1}. ${LANGUAGE_LABELS[code]} <span style="font-size:11px;color:#9e9689;">[${LANGUAGE_SHORT_CODES[code]}]</span>
                  </div>
                  <div style="font-size:11px;font-weight:400;color:#a8a093;">
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
      <div class="ui-card" style="max-width:600px;">
        <div class="citadel-crest-bar">
          <span class="citadel-crest-line"></span>
          <span>${tr.crestSettings}</span>
          <span class="citadel-crest-line"></span>
        </div>
        <div class="ui-title">${tr.settingsTitle}</div>
        <div class="ui-subtitle">${tr.settingsSubtitle}</div>

        <div class="ui-btn-list">
          <button class="ui-btn primary" id="btn-toggle-lang-list" type="button">
            <span>${tr.settingLanguage}</span>
            <span class="badge">${LANGUAGE_LABELS[s.language]} ${this.isLanguageListOpen ? '&#9650;' : '&#9660;'}</span>
          </button>
          ${langCourseListHtml}
          <button class="ui-btn" id="btn-cycle-display" type="button">
            <span>${tr.settingDisplay}</span>
            <span class="badge">${tr.displayModes[s.displayMode]}</span>
          </button>
          <button class="ui-btn" id="btn-toggle-sound" type="button">
            <span>${tr.settingSound}</span>
            <span class="badge">${s.soundEnabled ? tr.activeLabel : tr.mutedLabel}</span>
          </button>
          <button class="ui-btn" id="btn-toggle-music" type="button">
            <span>${tr.settingMusic}</span>
            <span class="badge">${s.musicEnabled ? tr.activeLabel : tr.mutedLabel}</span>
          </button>
          <button class="ui-btn" id="btn-cycle-vol" type="button">
            <span>${tr.settingVolume}</span>
            <span class="badge">${Math.round(s.masterVolume * 100)}%</span>
          </button>
          <button class="ui-btn" id="btn-toggle-fx" type="button">
            <span>${tr.settingFx}</span>
            <span class="badge">${s.effectsEnabled ? tr.activeLabel : tr.mutedLabel}</span>
          </button>
          <button class="ui-btn" id="btn-cycle-keys" type="button">
            <span>${tr.settingKeys}</span>
            <span class="badge">${tr.controlSchemes[s.controlScheme]}</span>
          </button>
          <div class="ui-section">
            <button class="ui-btn" id="btn-back-main" type="button">
              <span>${tr.btnBackMain}</span>
            </button>
          </div>
        </div>
      </div>
    `;

    document.getElementById('btn-toggle-lang-list')?.addEventListener('click', () => {
      this.isLanguageListOpen = !this.isLanguageListOpen;
      this.renderUi();
    });

    this.uiLayer.querySelectorAll<HTMLButtonElement>('[data-lang-code]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const lang = btn.getAttribute('data-lang-code') as GameLanguage;
        if (lang) {
          globalSettings.setLanguage(lang);
          this.isLanguageListOpen = false;
          this.syncHeroPedestalVisuals(false);
          this.renderUi();
        }
      });
    });

    document.getElementById('btn-cycle-display')?.addEventListener('click', () => {
      globalSettings.cycleDisplayMode();
      this.renderUi();
    });
    document.getElementById('btn-toggle-sound')?.addEventListener('click', () => {
      globalSettings.toggleSound();
      this.renderUi();
    });
    document.getElementById('btn-toggle-music')?.addEventListener('click', () => {
      globalSettings.toggleMusic();
      this.renderUi();
    });
    document.getElementById('btn-cycle-vol')?.addEventListener('click', () => {
      globalSettings.cycleVolume();
      this.renderUi();
    });
    document.getElementById('btn-toggle-fx')?.addEventListener('click', () => {
      globalSettings.toggleEffects();
      this.renderUi();
    });
    document.getElementById('btn-cycle-keys')?.addEventListener('click', () => {
      globalSettings.cycleControlScheme();
      this.renderUi();
    });
    document.getElementById('btn-back-main')?.addEventListener('click', () => {
      this.currentTab = 'main';
      this.renderUi();
    });
  }

  private renderHowToTab(): void {
    if (!this.uiLayer) return;
    const tr = t();

    this.uiLayer.innerHTML = `
      <div class="ui-card">
        <div class="citadel-crest-bar">
          <span class="citadel-crest-line"></span>
          <span>${tr.crestHowTo}</span>
          <span class="citadel-crest-line"></span>
        </div>
        <div class="ui-title">${tr.howToTitle}</div>
        <div class="ui-subtitle">${tr.howToSubtitle}</div>
        <div style="font-size: 13.5px; line-height: 1.68; color: #dcd6c8;">
          ${tr.howToParagraphs.map((p) => `<p>${p}</p>`).join('')}
        </div>
        <div class="ui-section">
          <button class="ui-btn" id="btn-back-main">
            <span>${tr.btnBackMain}</span>
          </button>
        </div>
      </div>
    `;

    document.getElementById('btn-back-main')?.addEventListener('click', () => {
      this.currentTab = 'main';
      this.renderUi();
    });
  }

  private startGame(levelId: string, resumeSavedCheckpoint: boolean): void {
    if (this.uiLayer) {
      this.uiLayer.classList.remove('visible', 'citadel-dock');
      this.uiLayer.innerHTML = '';
    }
    this.scene.start('GameScene', { levelId, resumeSavedCheckpoint });
  }

  private formatTime(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  }
}
