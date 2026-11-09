import Phaser from 'phaser';
import { APP_CONFIG } from '../config';
import { CAMERA_CONSTANTS, DISPLAY, PHYSICS, PLAYER_CONSTANTS } from '../constants';
import { WorldMeta, WorldTheme } from '../data/levelTypes';
import { Leaderboard, LocalStorageLeaderboard } from '../services/Leaderboard';
import {
  LevelRepository,
  StaticLevelRepository
} from '../services/LevelRepository';
import { LocalStorageSaveService, SaveService } from '../services/SaveService';
import { localizeWorldName, t } from '../services/I18nService';
import { globalSettings } from '../services/SettingsService';
import { CameraSnap } from '../systems/CameraSnap';
import { EffectsSystem } from '../systems/EffectsSystem';
import { BuiltLevel, LevelRenderer } from '../systems/LevelRenderer';
import { Player } from '../systems/Player';
import { ProceduralTextures } from '../systems/ProceduralTextures';
import { SoundSystem } from '../systems/SoundSystem';
import { globalTouchControls } from '../systems/TouchControls';
import { WinSceneData } from './WinScene';

export interface GameSceneInitData {
  levelId?: string;
  resumeSavedCheckpoint?: boolean;
}

type WorldTransitionMode = 'spawn' | 'resume' | 'ascend' | 'descend';

export class GameScene extends Phaser.Scene {
  private readonly levelRepo: LevelRepository = new StaticLevelRepository();
  private readonly saveService: SaveService = new LocalStorageSaveService();
  private readonly leaderboard: Leaderboard = new LocalStorageLeaderboard();

  private levelRenderer!: LevelRenderer;
  private cameraSnap!: CameraSnap;
  private effects!: EffectsSystem;
  private soundSystem!: SoundSystem;

  private worldsCatalog: WorldMeta[] = [];
  private builtLevel: BuiltLevel | null = null;
  private player: Player | null = null;

  private bgSky!: Phaser.GameObjects.TileSprite;
  private bgMid!: Phaser.GameObjects.TileSprite;
  private bgNear!: Phaser.GameObjects.TileSprite;

  private accumulatorMs = 0;
  private elapsedMs = 0;
  private worldSplitMs = 0;
  private worldSplitFalls = 0;
  private foundEggInCurrentWorld = false;

  private currentLevelId: string = APP_CONFIG.defaultLevelId;
  private isLoadingLevel = false;
  private isPausedOverlay = false;

  private hudOverlayEl: HTMLElement | null = null;
  private hudLeftEl: HTMLElement | null = null;
  private hudRightEl: HTMLElement | null = null;
  private stageBottomLeftEl: HTMLElement | null = null;
  private stageFlashTimer: number | null = null;
  private statusBannerTimer: number | null = null;
  private statusMessage = '';

  private readonly visibilityChangeHandler = () => {
    if (document.hidden && this.scene.isActive() && !this.isPausedOverlay) {
      this.openPauseMenu();
    }
  };

  private readonly beforeUnloadHandler = () => {
    this.saveCurrentProgress();
  };

  constructor() {
    super({ key: 'GameScene' });
  }

  public create(data?: GameSceneInitData): void {
    this.accumulatorMs = 0;
    this.isPausedOverlay = false;

    this.hudOverlayEl = document.getElementById('hud-overlay');
    this.hudLeftEl = document.getElementById('hud-left');
    this.hudRightEl = document.getElementById('hud-right');
    this.stageBottomLeftEl = document.getElementById('stage-bottom-left-hud');

    this.hudOverlayEl?.classList.add('visible');
    this.stageBottomLeftEl?.classList.add('visible');
    globalTouchControls.setSceneActive(true);

    // Đảm bảo thế giới mặc định có texture khởi tạo cho 3 lớp TileSprite
    ProceduralTextures.ensureWorldTextures(this, 'forest');

    this.bgSky = this.add
      .tileSprite(0, 0, DISPLAY.WIDTH, DISPLAY.HEIGHT, ProceduralTextures.getSkyKey('forest'))
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(0);

    this.bgMid = this.add
      .tileSprite(0, 0, DISPLAY.WIDTH, DISPLAY.HEIGHT, ProceduralTextures.getMidKey('forest'))
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(1);

    this.bgNear = this.add
      .tileSprite(0, 0, DISPLAY.WIDTH, DISPLAY.HEIGHT, ProceduralTextures.getNearKey('forest'))
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(2);

    this.levelRenderer = new LevelRenderer(this);
    this.cameraSnap = new CameraSnap(this);
    this.effects = new EffectsSystem(this);
    this.soundSystem = new SoundSystem();

    this.bindKeyboardShortcuts();

    document.addEventListener('visibilitychange', this.visibilityChangeHandler);
    window.addEventListener('beforeunload', this.beforeUnloadHandler);

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.cleanupScene();
    });

    const saved = this.saveService.loadProgress();
    const targetLevelId = data?.levelId ?? saved?.currentLevelId ?? APP_CONFIG.defaultLevelId;
    const shouldResume = Boolean(
      data?.resumeSavedCheckpoint && saved?.currentLevelId === targetLevelId
    );

    void this.initWorldAndStart(targetLevelId, shouldResume ? 'resume' : 'spawn');
  }

  private async initWorldAndStart(
    levelId: string,
    mode: WorldTransitionMode
  ): Promise<void> {
    this.worldsCatalog = await this.levelRepo.listWorlds();
    await this.loadAndStartLevel(levelId, mode);
  }

  private bindKeyboardShortcuts(): void {
    this.input.keyboard?.on('keydown-ESC', () => {
      this.openPauseMenu();
    });
    this.input.keyboard?.on('keydown-P', () => {
      this.openPauseMenu();
    });
    this.input.keyboard?.on('keydown-ONE', () => {
      void this.loadAndStartLevel('forest-01', 'spawn');
    });
    this.input.keyboard?.on('keydown-TWO', () => {
      void this.loadAndStartLevel('ice-01', 'spawn');
    });
    this.input.keyboard?.on('keydown-THREE', () => {
      void this.loadAndStartLevel('wind-01', 'spawn');
    });
    this.input.keyboard?.on('keydown-M', () => {
      const enabled = globalSettings.toggleSound();
      this.syncSettingsFromPause();
      this.showTempStatus(t().statusSound(enabled));
    });
    this.input.keyboard?.on('keydown-E', () => {
      const enabled = globalSettings.toggleEffects();
      this.syncSettingsFromPause();
      this.showTempStatus(t().statusFx(enabled));
    });
    this.input.keyboard?.on('keydown-V', () => {
      const mode = globalSettings.cycleDisplayMode();
      this.renderHudButtons();
      this.showTempStatus(t().statusRatio(t().displayModes[mode]));
    });
    this.input.keyboard?.on('keydown-PAGE_UP', () => {
      if (this.player && this.builtLevel && !this.isPausedOverlay) {
        if (this.cameraSnap.screenIndex >= this.builtLevel.totalScreens - 1) {
          this.handleSeamlessAscendToNextWorld();
          return;
        }
        this.player.y = Math.max(24, this.player.y - DISPLAY.HEIGHT);
        this.player.vx = 0;
        this.player.vy = 0;
        this.cameraSnap.update(this.player.centerY);
        this.triggerBottomLeftFlash();
      }
    });
    this.input.keyboard?.on('keydown-PAGE_DOWN', () => {
      if (this.player && this.builtLevel && !this.isPausedOverlay) {
        if (this.cameraSnap.screenIndex <= 0) {
          this.handleSeamlessDescendToPreviousWorld();
          return;
        }
        this.player.y = Math.min(
          this.builtLevel.totalHeightPx - 40,
          this.player.y + DISPLAY.HEIGHT
        );
        this.player.vx = 0;
        this.player.vy = 0;
        this.cameraSnap.update(this.player.centerY);
        this.triggerBottomLeftFlash();
      }
    });
  }

  public openPauseMenu(): void {
    if (this.isPausedOverlay || this.isLoadingLevel) return;
    this.isPausedOverlay = true;
    this.saveCurrentProgress();
    globalTouchControls.setSceneActive(false);
    this.scene.pause();
    this.scene.launch('PauseScene');
  }

  public onResumeFromPause(): void {
    this.isPausedOverlay = false;
    globalTouchControls.setSceneActive(true);
    this.scene.resume();
  }

  public restartLevelFromBottom(): void {
    void this.loadAndStartLevel(this.currentLevelId, 'spawn');
    this.showTempStatus(t().statusRestartBottom);
  }

  public syncSettingsFromPause(): void {
    const s = globalSettings.get();
    if (!s.soundEnabled || !s.musicEnabled) {
      this.soundSystem.stopMusic();
    } else if (this.builtLevel) {
      this.soundSystem.startWorldMusic(this.builtLevel.levelData.theme);
    }
    if (this.builtLevel) {
      this.effects.setupAmbientParticles(this.builtLevel.levelData.theme);
    }
    this.renderHudButtons();
    this.updateHudDom();
  }

  public exitToMainMenu(): void {
    this.saveCurrentProgress();
    this.cleanupScene();
    this.scene.stop();
    this.scene.start('MenuScene');
  }

  private cleanupScene(): void {
    document.removeEventListener('visibilitychange', this.visibilityChangeHandler);
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
    this.soundSystem.stopMusic();
    this.effects.clearAmbient();
    globalTouchControls.setSceneActive(false);
    this.hudOverlayEl?.classList.remove('visible');
    this.stageBottomLeftEl?.classList.remove('visible', 'world-link-flash');
  }

  private triggerBottomLeftFlash(): void {
    if (!this.stageBottomLeftEl) return;
    this.stageBottomLeftEl.classList.add('world-link-flash');
    if (this.stageFlashTimer !== null) {
      window.clearTimeout(this.stageFlashTimer);
    }
    this.stageFlashTimer = window.setTimeout(() => {
      this.stageBottomLeftEl?.classList.remove('world-link-flash');
    }, 950);
  }

  private async loadAndStartLevel(
    levelId: string,
    mode: WorldTransitionMode,
    carryState?: { x: number; vx: number; totalElapsedMs: number; totalFalls: number; totalJumps: number }
  ): Promise<void> {
    if (this.isLoadingLevel) return;
    this.isLoadingLevel = true;

    try {
      const levelData = await this.levelRepo.getLevel(levelId);
      this.currentLevelId = levelData.id;

      // Tự động nạp Texture, Parallax và Chuyển Nhạc Nền Đa Bè của thế giới mới
      ProceduralTextures.ensureWorldTextures(this, levelData.theme);
      this.applyThemeParallaxAndAudio(levelData.theme);

      if (this.player) {
        this.player.destroy();
        this.player = null;
      }

      const built = this.levelRenderer.build(
        levelData,
        PLAYER_CONSTANTS.WIDTH,
        PLAYER_CONSTANTS.HEIGHT
      );
      this.builtLevel = built;

      const saved = this.saveService.loadProgress();
      const useSaved =
        mode === 'resume' && saved && saved.currentLevelId === levelData.id;

      let startX = built.spawnPosition.x;
      let startY = built.spawnPosition.y;
      let startScreen = built.spawnPosition.screenIndex;

      if (useSaved && saved) {
        startX = saved.checkpointX;
        startY = saved.checkpointY;
      } else if (mode === 'descend') {
        // Rơi từ Thế giới phía trên xuống Đỉnh Tầng 6 của Thế giới phía dưới
        const topGoal = built.goals[0];
        startX = carryState
          ? Phaser.Math.Clamp(carryState.x, 24, DISPLAY.WIDTH - 38)
          : topGoal
            ? topGoal.x
            : DISPLAY.WIDTH * 0.5;
        startY = topGoal ? Math.max(18, topGoal.y - 22) : 28;
        startScreen = built.totalScreens - 1;
      } else if (mode === 'ascend') {
        // Leo từ Đỉnh Thế giới dưới lên Tầng 1 của Thế giới tiếp theo
        startX = built.spawnPosition.x;
        startY = built.spawnPosition.y;
        startScreen = built.spawnPosition.screenIndex;
      }

      this.player = new Player(this, startX, startY, {
        onChargeTick: (ratio) => {
          this.soundSystem.playChargeTick(ratio, this.time.now);
        },
        onJump: (ratio, vx, _vy) => {
          if (!this.player) return;
          this.soundSystem.playJump(ratio);
          this.effects.spawnJumpEffect(
            this.player.centerX,
            this.player.bottomY,
            ratio,
            vx
          );
        },
        onWalkStep: (x, y, facing, surface) => {
          const isIce = surface === 'ice';
          this.soundSystem.playStep(isIce);
          this.effects.spawnWalkStepParticles(x, y, facing, isIce);
        },
        onWallBounce: (x, y, normalX, normalY, isBouncy) => {
          this.soundSystem.playWallBounce(isBouncy);
          this.effects.spawnCollisionEffect(x, y, normalX, normalY, isBouncy);
          if (isBouncy && globalSettings.get().screenShakeEnabled) {
            this.cameras.main.shake(95, 0.007);
          }
        },
        onCeilingBonk: (x, y) => {
          this.soundSystem.playCeilingBonk();
          this.effects.spawnCollisionEffect(x, y, 0, 1, false);
        },
        onLand: (x, y, _impactVy, isHardFall, surface) => {
          const isIce = surface === 'ice';
          this.soundSystem.playLand(isHardFall, isIce);
          this.effects.spawnLandingEffect(x, y, isHardFall, isIce);
          if (isHardFall) {
            this.worldSplitFalls += 1;
          }
          if (isHardFall && globalSettings.get().screenShakeEnabled) {
            this.cameras.main.shake(
              CAMERA_CONSTANTS.SHAKE_HARD_FALL_DURATION_MS,
              CAMERA_CONSTANTS.SHAKE_HARD_FALL_INTENSITY
            );
          }
        },
        onHazardHit: (x, y) => {
          this.soundSystem.playHazard();
          this.effects.spawnCollisionEffect(x, y, 0, -1, true);
          if (globalSettings.get().screenShakeEnabled) {
            this.cameras.main.shake(150, 0.01);
          }
          if (this.player) {
            this.cameraSnap.update(this.player.centerY);
          }
          this.showTempStatus(t().statusHazardKnockback);
        },
        onGoalReach: (goal) => {
          this.soundSystem.playGoalFanfare();
          this.effects.spawnCollisionEffect(goal.x + 8, goal.y + 8, 0, -1, true);
          this.handleSeamlessAscendToNextWorld();
        },
        onAscendPastTop: () => {
          this.soundSystem.playGoalFanfare();
          this.handleSeamlessAscendToNextWorld();
        },
        onFallBelowBottom: () => {
          this.handleSeamlessDescendToPreviousWorld();
        },
        onEasterEggReach: (egg) => {
          this.soundSystem.playEasterEggFanfare();
          this.effects.spawnCollisionEffect(egg.x + 8, egg.y + 8, 0, -1, true);
          this.saveService.markEasterEggDiscovered(this.currentLevelId);
          this.foundEggInCurrentWorld = true;
          const currentMeta = this.worldsCatalog.find((w) => w.id === this.currentLevelId);
          this.showTempStatus(
            t().statusRelicFound(currentMeta?.easterEggName ?? 'Ancient Relic')
          );
          this.triggerBottomLeftFlash();
        },
        onEquipMoteEmit: (x, y, color) => {
          this.effects.spawnEquipmentMote(x, y, color);
        },
        onTrailEmit: (
          x,
          y,
          textureKey,
          flipX,
          scaleX,
          scaleY,
          tint,
          minIntervalMs,
          angleDeg,
          vx,
          vy,
          baseAlpha
        ) => {
          this.effects.spawnPlayerTrail(
            x,
            y,
            textureKey,
            flipX,
            scaleX,
            scaleY,
            tint,
            this.time.now,
            minIntervalMs,
            angleDeg,
            vx,
            vy,
            baseAlpha
          );
        }
      });

      this.worldSplitMs = 0;
      this.worldSplitFalls = 0;
      this.foundEggInCurrentWorld = false;

      if (useSaved && saved) {
        this.player.hardFallCount = saved.fallCount;
        this.player.jumpCount = saved.jumpCount;
        this.elapsedMs = saved.elapsedMs;
        startScreen = LevelRenderer.getScreenIndexFromY(
          this.player.centerY,
          built.totalScreens
        );
        this.cameraSnap.init(built.totalScreens, startScreen);
      } else if (carryState) {
        this.player.hardFallCount = carryState.totalFalls;
        this.player.jumpCount = carryState.totalJumps;
        this.elapsedMs = carryState.totalElapsedMs;
        if (mode === 'ascend') {
          this.player.vy = -140;
          this.effects.spawnJumpEffect(this.player.centerX, this.player.bottomY, 0.75, 0);
        } else if (mode === 'descend') {
          this.player.vy = 165;
          this.player.vx = carryState.vx * 0.5;
        }
        this.cameraSnap.init(built.totalScreens, startScreen);
      } else {
        this.elapsedMs = 0;
        this.cameraSnap.init(built.totalScreens, startScreen);
      }

      this.accumulatorMs = 0;
      this.saveCurrentProgress();

      const seedInfo = levelData.seedState;
      const tr = t();
      const stageBadge = seedInfo
        ? tr.stageCounter(seedInfo.worldNumber, seedInfo.totalWorlds)
        : tr.stageCounter(1, 100);
      const locName = localizeWorldName(levelData.id, levelData.name);

      if (mode === 'ascend') {
        this.showTempStatus(tr.statusWorldAscend(stageBadge, locName));
      } else if (mode === 'descend') {
        this.showTempStatus(tr.statusWorldDescend(stageBadge, locName));
      } else {
        this.showTempStatus(`${stageBadge}: ${locName}`);
      }

      this.triggerBottomLeftFlash();
      this.renderHudButtons();
      this.updateHudDom();
    } catch (err) {
      console.error('[GameScene] Lỗi khi tải màn chơi:', err);
    } finally {
      this.isLoadingLevel = false;
    }
  }

  /**
   * Khi người chơi chinh phục Đỉnh Tầng 6 của một Thế Giới:
   * - Tự động ghi nhận kỷ lục Speedrun & Thành tựu cho thế giới vừa qua
   * - Tự động liên kết thẳng lên Thế Giới tiếp theo (cả địa hình, hiệu ứng lẫn âm nhạc) mà KHÔNG hiện bảng ngắt quãng!
   * - Chỉ khi vượt qua Đỉnh Màn 100 cuối cùng mới mở màn hình Chiến Thắng Chung Cuộc.
   */
  private handleSeamlessAscendToNextWorld(): void {
    if (!this.player || !this.builtLevel || this.isLoadingLevel) return;

    const splitTime = Math.max(1000, this.worldSplitMs);
    this.saveService.saveBestRun({
      levelId: this.currentLevelId,
      bestTimeMs: splitTime,
      leastFalls: this.worldSplitFalls,
      achievedAt: new Date().toISOString(),
      foundEasterEgg: this.foundEggInCurrentWorld
    });
    void this.leaderboard.submit({
      playerName: this.saveService.getPlayerName(),
      levelId: this.currentLevelId,
      timeMs: splitTime,
      falls: this.worldSplitFalls,
      dateIso: new Date().toISOString(),
      foundEasterEgg: this.foundEggInCurrentWorld
    });

    const carry = {
      x: this.player.x,
      vx: this.player.vx,
      totalElapsedMs: this.elapsedMs,
      totalFalls: this.player.hardFallCount,
      totalJumps: this.player.jumpCount
    };

    const currentIdx = this.worldsCatalog.findIndex((w) => w.id === this.currentLevelId);
    const nextWorld =
      currentIdx >= 0 && currentIdx + 1 < this.worldsCatalog.length
        ? this.worldsCatalog[currentIdx + 1]
        : null;

    if (nextWorld) {
      void this.loadAndStartLevel(nextWorld.id, 'ascend', carry);
      return;
    }

    // Đã chinh phục Đỉnh Thế Giới thứ 100 cuối cùng!
    const currentMeta = currentIdx >= 0 ? this.worldsCatalog[currentIdx] : undefined;
    const winData: WinSceneData = {
      levelId: this.currentLevelId,
      levelName: this.builtLevel.levelData.name,
      elapsedMs: this.elapsedMs,
      falls: this.player.hardFallCount,
      jumps: this.player.jumpCount,
      nextLevelId: null,
      foundEasterEgg: this.foundEggInCurrentWorld,
      easterEggName: currentMeta?.easterEggName ?? 'Vương Miện Âm Nhạc Tối Thượng'
    };

    this.saveService.clearProgress();
    this.cleanupScene();
    this.scene.start('WinScene', winData);
  }

  /**
   * Khi người chơi rơi trượt xuống Hố Rơi Liên Thông ở đáy Tầng 1 (từ Màn 2..100):
   * Tự động rơi xuyên về lại Đỉnh Tầng 6 của Thế Giới liền trước!
   */
  private handleSeamlessDescendToPreviousWorld(): void {
    if (!this.player || !this.builtLevel || this.isLoadingLevel) return;

    const carry = {
      x: this.player.x,
      vx: this.player.vx,
      totalElapsedMs: this.elapsedMs,
      totalFalls: this.player.hardFallCount + 1,
      totalJumps: this.player.jumpCount
    };

    const currentIdx = this.worldsCatalog.findIndex((w) => w.id === this.currentLevelId);
    if (currentIdx > 0) {
      const prevWorld = this.worldsCatalog[currentIdx - 1];
      if (prevWorld) {
        this.soundSystem.playScreenWhoosh(false);
        void this.loadAndStartLevel(prevWorld.id, 'descend', carry);
        return;
      }
    }

    // Nếu đang ở Màn 1 (Chân Đại Tháp), đặt lại người chơi lên mặt đất Tầng 1
    this.player.y = this.builtLevel.totalHeightPx - 32 - this.player.height;
    this.player.vy = 0;
    this.player.isGrounded = true;
  }

  private applyThemeParallaxAndAudio(theme: WorldTheme): void {
    this.bgSky.setTexture(ProceduralTextures.getSkyKey(theme));
    this.bgMid.setTexture(ProceduralTextures.getMidKey(theme));
    this.bgNear.setTexture(ProceduralTextures.getNearKey(theme));

    this.effects.setupAmbientParticles(theme);
    this.soundSystem.startWorldMusic(theme);
  }

  public saveCurrentProgress(): void {
    if (!this.player || !this.builtLevel) return;
    if (this.player.isGrounded) {
      this.player.checkpointX = this.player.x;
      this.player.checkpointY = this.player.y;
    }
    this.saveService.saveProgress({
      currentLevelId: this.currentLevelId,
      screenIndex: this.cameraSnap.screenIndex,
      checkpointX: this.player.checkpointX,
      checkpointY: this.player.checkpointY,
      elapsedMs: this.elapsedMs,
      fallCount: this.player.hardFallCount,
      jumpCount: this.player.jumpCount
    });
  }

  private showTempStatus(msg: string): void {
    this.statusMessage = msg;
    if (this.statusBannerTimer !== null) {
      window.clearTimeout(this.statusBannerTimer);
    }
    this.statusBannerTimer = window.setTimeout(() => {
      this.statusMessage = '';
    }, 3000);
  }

  public override update(time: number, delta: number): void {
    if (!this.player || !this.builtLevel || this.isLoadingLevel || this.isPausedOverlay) {
      return;
    }

    const clampedDelta = Math.min(delta, PHYSICS.FIXED_DT_MS * PHYSICS.MAX_SUBSTEPS);
    this.accumulatorMs += clampedDelta;
    this.elapsedMs += clampedDelta;
    this.worldSplitMs += clampedDelta;

    let subSteps = 0;
    while (
      this.player &&
      this.builtLevel &&
      !this.isLoadingLevel &&
      this.accumulatorMs >= PHYSICS.FIXED_DT_MS &&
      subSteps < PHYSICS.MAX_SUBSTEPS
    ) {
      this.player.fixedUpdate({
        solids: this.builtLevel.solids,
        hazards: this.builtLevel.hazards,
        windZones: this.builtLevel.windZones,
        checkpoints: this.builtLevel.checkpoints,
        goals: this.builtLevel.goals,
        easterEggs: this.builtLevel.easterEggs,
        worldBottomY: this.builtLevel.totalHeightPx
      });

      if (!this.player || !this.builtLevel || this.isLoadingLevel) {
        break;
      }

      this.cameraSnap.update(this.player.centerY, (oldS, newS) => {
        this.soundSystem.playScreenWhoosh(newS > oldS);
        this.triggerBottomLeftFlash();
      });
      this.accumulatorMs -= PHYSICS.FIXED_DT_MS;
      subSteps++;
    }

    if (!this.player || !this.builtLevel || this.isLoadingLevel) {
      return;
    }

    this.levelRenderer.updateDynamicTiles(
      this.builtLevel.crumbleTiles,
      clampedDelta,
      this.builtLevel.levelData.theme,
      (tile) => {
        this.soundSystem.playCrumble();
        this.effects.spawnCrumbleDebris(tile.x, tile.y);
      }
    );

    const camY = this.cameras.main.scrollY;
    this.bgSky.tilePositionY = Math.round(camY * 0.08);
    this.bgMid.tilePositionY = Math.round(camY * 0.22);
    this.bgMid.tilePositionX = Math.round((this.player.centerX - DISPLAY.WIDTH * 0.5) * 0.05);
    this.bgNear.tilePositionY = Math.round(camY * 0.42);
    this.bgNear.tilePositionX = Math.round((this.player.centerX - DISPLAY.WIDTH * 0.5) * 0.12);

    this.effects.updateAmbient(clampedDelta / 1000, time / 1000);
    this.updateHudDom();
  }

  private renderHudButtons(): void {
    if (!this.hudRightEl) return;
    const tr = t();
    const settings = globalSettings.get();
    const sndLabel = settings.soundEnabled ? tr.onLabel : tr.offLabel;
    const fxLabel = settings.effectsEnabled ? tr.onLabel : tr.offLabel;
    const ratioShort = tr.displayModesShort[settings.displayMode];

    this.hudRightEl.innerHTML = `
      <span><kbd>M</kbd> ${tr.soundShort}:${sndLabel}</span>
      <span><kbd>E</kbd> ${tr.fxShort}:${fxLabel}</span>
      <button class="hud-btn" id="btn-hud-ratio" type="button" title="${tr.displayModes[settings.displayMode]} (V)">${tr.aspectRatioBtn(ratioShort)}</button>
      <button class="hud-btn" id="btn-hud-pause" type="button">${tr.menuEscBtn}</button>
    `;

    // Đồng bộ ngôn ngữ cho các phím cảm ứng điện thoại
    const btnLeft = document.getElementById('btn-touch-left');
    const btnRight = document.getElementById('btn-touch-right');
    const btnJump = document.getElementById('btn-touch-jump');
    if (btnLeft) btnLeft.textContent = tr.touchLeft;
    if (btnRight) btnRight.textContent = tr.touchRight;
    if (btnJump) btnJump.textContent = tr.touchJump;

    document.getElementById('btn-hud-ratio')?.addEventListener('click', () => {
      const nextMode = globalSettings.cycleDisplayMode();
      this.renderHudButtons();
      this.showTempStatus(t().statusRatio(t().displayModes[nextMode]));
    });

    document.getElementById('btn-hud-pause')?.addEventListener('click', () => {
      this.openPauseMenu();
    });
  }

  private updateHudDom(): void {
    if (!this.player || !this.builtLevel) return;

    const tr = t();
    const screenNum = this.cameraSnap.screenIndex + 1;
    const totalScreens = this.builtLevel.totalScreens;
    const timerStr = this.formatSpeedrunTime(this.elapsedMs);
    const totalH = Math.max(1, this.builtLevel.totalHeightPx - 80);
    const altitudePct = Phaser.Math.Clamp(
      Math.round(((this.builtLevel.totalHeightPx - this.player.bottomY) / totalH) * 100),
      0,
      100
    );

    const seedState = this.builtLevel.levelData.seedState;
    const currentIdx = this.worldsCatalog.findIndex((w) => w.id === this.currentLevelId);
    const worldNum = seedState?.worldNumber ?? (currentIdx >= 0 ? currentIdx + 1 : 1);
    const totalWorlds = seedState?.totalWorlds ?? (this.worldsCatalog.length || 100);
    const locName = localizeWorldName(
      this.builtLevel.levelData.id,
      this.builtLevel.levelData.name
    );

    if (this.hudLeftEl) {
      const statusHtml = this.statusMessage
        ? ` &nbsp;|&nbsp; <span class="cyan">${this.statusMessage}</span>`
        : '';
      this.hudLeftEl.innerHTML =
        `<span class="highlight">${locName}</span> ` +
        `(<span class="cyan">${tr.floorCounter(screenNum, totalScreens)}</span>) ` +
        `<span class="hud-progress-wrap"><span class="hud-progress-fill" style="width:${altitudePct}%"></span></span> ` +
        `<span class="cyan">${altitudePct}%</span> &nbsp;|&nbsp; ` +
        `<span class="cyan">${timerStr}</span> &nbsp;|&nbsp; ` +
        `<span class="highlight">${tr.fallsCount(this.player.hardFallCount)}</span>` +
        statusHtml;
    }

    // Dòng chữ gọn gàng góc trái phía dưới theo ngôn ngữ hiện tại (Stage X/100, Màn X/100, 第 X/100 关, ...)
    if (this.stageBottomLeftEl) {
      this.stageBottomLeftEl.textContent = tr.stageCounter(worldNum, totalWorlds);
    }
  }

  private formatSpeedrunTime(ms: number): string {
    const totalSec = Math.floor(ms / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  }
}
