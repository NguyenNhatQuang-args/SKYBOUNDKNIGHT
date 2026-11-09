import Phaser from 'phaser';
import { DISPLAY, PHYSICS, PLAYER_CONSTANTS } from '../constants';
import { TileKind } from '../data/levelTypes';
import { globalLoadout } from '../services/CharacterLoadoutService';
import { globalSettings } from '../services/SettingsService';
import { WorldTileRect } from './LevelRenderer';
import { ProceduralTextures, TEXTURE_KEYS } from './ProceduralTextures';
import { globalTouchControls } from './TouchControls';

export interface PlayerCollisionContext {
  solids: readonly WorldTileRect[];
  hazards: readonly WorldTileRect[];
  windZones: readonly WorldTileRect[];
  checkpoints: readonly WorldTileRect[];
  goals: readonly WorldTileRect[];
  easterEggs: readonly WorldTileRect[];
  worldBottomY: number;
}

export interface PlayerEvents {
  onChargeTick?: (chargeRatio: number) => void;
  onJump?: (chargeRatio: number, vx: number, vy: number) => void;
  onWalkStep?: (x: number, y: number, facing: -1 | 1, surface: TileKind) => void;
  onWallBounce?: (x: number, y: number, normalX: number, normalY: number, isBouncy: boolean) => void;
  onCeilingBonk?: (x: number, y: number) => void;
  onLand?: (x: number, y: number, impactVy: number, isHardFall: boolean, surface: TileKind) => void;
  onHazardHit?: (x: number, y: number) => void;
  onCheckpointReach?: (checkpoint: WorldTileRect) => void;
  onGoalReach?: (goal: WorldTileRect) => void;
  onEasterEggReach?: (egg: WorldTileRect) => void;
  onAscendPastTop?: () => void;
  onFallBelowBottom?: () => void;
  onTrailEmit?: (
    x: number,
    y: number,
    textureKey: string,
    flipX: boolean,
    scaleX: number,
    scaleY: number,
    tint: number,
    minIntervalMs: number,
    angleDeg?: number,
    vx?: number,
    vy?: number,
    baseAlpha?: number
  ) => void;
  onEquipMoteEmit?: (x: number, y: number, color: number) => void;
}

interface InputKeys {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  a: Phaser.Input.Keyboard.Key;
  d: Phaser.Input.Keyboard.Key;
  up: Phaser.Input.Keyboard.Key;
  w: Phaser.Input.Keyboard.Key;
  space: Phaser.Input.Keyboard.Key;
}

const WALK_FRAMES = [
  TEXTURE_KEYS.PLAYER_WALK_1,
  TEXTURE_KEYS.PLAYER_WALK_2,
  TEXTURE_KEYS.PLAYER_WALK_3,
  TEXTURE_KEYS.PLAYER_WALK_4,
  TEXTURE_KEYS.PLAYER_WALK_5,
  TEXTURE_KEYS.PLAYER_WALK_6
] as const;

export class Player {
  private readonly scene: Phaser.Scene;
  private readonly events: PlayerEvents;

  public x: number;
  public y: number;
  public vx = 0;
  public vy = 0;
  public prevVx = 0;
  public prevVy = 0;

  public readonly width = PLAYER_CONSTANTS.WIDTH;
  public readonly height = PLAYER_CONSTANTS.HEIGHT;

  public isGrounded = false;
  public currentSurface: TileKind = 'solid';
  public isCharging = false;
  public chargeMs = 0;
  public splatTimerMs = 0;
  public landRecoveryMs = 0;
  public hitStopMs = 0;
  public respawnFreezeMs = 0;
  public facing: -1 | 1 = 1;

  public jumpCount = 0;
  public hardFallCount = 0;

  public checkpointX: number;
  public checkpointY: number;

  public readonly sprite: Phaser.GameObjects.Sprite;
  private readonly weaponSprite: Phaser.GameObjects.Image;
  private readonly shieldSprite: Phaser.GameObjects.Image;
  private readonly equipAuraGraphics: Phaser.GameObjects.Graphics;
  private readonly chargeBarGraphics: Phaser.GameObjects.Graphics;
  private walkAnimTimerMs = 0;
  private walkDustTimerMs = 0;
  private equipMoteTimerMs = 0;
  private walkFrameIndex = 0;
  private scaleTween: Phaser.Tweens.Tween | null = null;
  private squashX = 1;
  private squashY = 1;
  private smoothTiltDeg = 0;

  private readonly keys: InputKeys;

  constructor(scene: Phaser.Scene, spawnX: number, spawnY: number, events: PlayerEvents = {}) {
    this.scene = scene;
    this.events = events;
    this.x = spawnX;
    this.y = spawnY;
    this.checkpointX = spawnX;
    this.checkpointY = spawnY;

    ProceduralTextures.ensureCharacterEquipmentTextures(scene);
    const loadout = globalLoadout.getLoadout();

    this.sprite = scene.add.sprite(
      Math.round(this.centerX),
      Math.round(this.bottomY),
      ProceduralTextures.getPlayerFrameKey(loadout.skinId, TEXTURE_KEYS.PLAYER_IDLE)
    );
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setDepth(20);

    // Trang bị Vũ Khí cầm tay phải & Khiên/Pháp Khí tay trái
    this.weaponSprite = scene.add
      .image(
        Math.round(this.centerX),
        Math.round(this.bottomY - 7),
        loadout.weaponId !== 'weapon-none'
          ? ProceduralTextures.getWeaponKey(loadout.weaponId)
          : ProceduralTextures.getWeaponKey('weapon-broadsword')
      )
      .setOrigin(0.35, 0.78)
      .setDepth(20.6)
      .setVisible(loadout.weaponId !== 'weapon-none');

    this.shieldSprite = scene.add
      .image(
        Math.round(this.centerX),
        Math.round(this.bottomY - 6),
        loadout.shieldId !== 'shield-none'
          ? ProceduralTextures.getShieldKey(loadout.shieldId)
          : ProceduralTextures.getShieldKey('shield-heraldic')
      )
      .setOrigin(0.5, 0.5)
      .setDepth(20.4)
      .setVisible(loadout.shieldId !== 'shield-none');

    this.equipAuraGraphics = scene.add.graphics();
    this.equipAuraGraphics.setDepth(20.8);

    this.chargeBarGraphics = scene.add.graphics();
    this.chargeBarGraphics.setDepth(30);

    const keyboard = scene.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard input plugin is not enabled.');
    }

    this.keys = {
      left: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
      a: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      d: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      up: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP),
      w: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      space: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    };
  }

  public destroy(): void {
    if (this.scaleTween) {
      this.scaleTween.stop();
      this.scaleTween = null;
    }
    this.sprite.destroy();
    this.weaponSprite.destroy();
    this.shieldSprite.destroy();
    this.equipAuraGraphics.destroy();
    this.chargeBarGraphics.destroy();
  }

  public get centerX(): number {
    return this.x + this.width * 0.5;
  }

  public get centerY(): number {
    return this.y + this.height * 0.5;
  }

  public get bottomY(): number {
    return this.y + this.height;
  }

  public get chargeRatio(): number {
    return Phaser.Math.Clamp(this.chargeMs / PLAYER_CONSTANTS.MAX_CHARGE_MS, 0, 1);
  }

  public setCheckpoint(x: number, y: number): void {
    this.checkpointX = x;
    this.checkpointY = y;
  }

  public teleportToCheckpoint(): void {
    this.x = this.checkpointX;
    this.y = this.checkpointY;
    this.vx = 0;
    this.vy = 0;
    this.isCharging = false;
    this.chargeMs = 0;
    this.splatTimerMs = 0;
    this.respawnFreezeMs = PLAYER_CONSTANTS.HAZARD_RESPAWN_FREEZE_MS;
    this.playSquashTween(0.7, 1.3, 180);
  }

  private getHorizontalInput(): -1 | 0 | 1 {
    const scheme = globalSettings.get().controlScheme;
    const allowArrows = scheme === 'both' || scheme === 'arrows';
    const allowWasd = scheme === 'both' || scheme === 'wasd';

    const leftDown =
      globalTouchControls.state.left ||
      (allowArrows && this.keys.left.isDown) ||
      (allowWasd && this.keys.a.isDown);
    const rightDown =
      globalTouchControls.state.right ||
      (allowArrows && this.keys.right.isDown) ||
      (allowWasd && this.keys.d.isDown);

    if (leftDown && !rightDown) return -1;
    if (rightDown && !leftDown) return 1;
    return 0;
  }

  private isJumpButtonHeld(): boolean {
    const scheme = globalSettings.get().controlScheme;
    const allowArrows = scheme === 'both' || scheme === 'arrows';
    const allowWasd = scheme === 'both' || scheme === 'wasd';

    return (
      globalTouchControls.state.jump ||
      this.keys.space.isDown ||
      (allowWasd && this.keys.w.isDown) ||
      (allowArrows && this.keys.up.isDown)
    );
  }

  public fixedUpdate(ctx: PlayerCollisionContext): void {
    const dtMs = PHYSICS.FIXED_DT_MS;
    const dtSec = PHYSICS.FIXED_DT_SEC;

    if (this.hitStopMs > 0) {
      this.hitStopMs = Math.max(0, this.hitStopMs - dtMs);
      this.syncVisuals(dtMs);
      return;
    }

    if (this.respawnFreezeMs > 0) {
      this.respawnFreezeMs = Math.max(0, this.respawnFreezeMs - dtMs);
      this.syncVisuals(dtMs);
      return;
    }

    const moveDir = this.getHorizontalInput();
    const jumpHeld = this.isJumpButtonHeld();
    const onIce = this.isGrounded && this.currentSurface === 'ice';

    if (this.isGrounded) {
      if (this.splatTimerMs > 0) {
        this.splatTimerMs = Math.max(0, this.splatTimerMs - dtMs);
        this.applyGroundFriction(dtSec, onIce);
      } else if (this.landRecoveryMs > 0) {
        this.landRecoveryMs = Math.max(0, this.landRecoveryMs - dtMs);
        this.applyGroundFriction(dtSec, onIce);
      } else if (this.isCharging) {
        if (onIce) {
          this.applyGroundFriction(dtSec, true);
        } else {
          this.vx = 0;
        }

        if (moveDir !== 0) {
          this.facing = moveDir;
        }

        this.chargeMs = Math.min(PLAYER_CONSTANTS.MAX_CHARGE_MS, this.chargeMs + dtMs);
        this.events.onChargeTick?.(this.chargeRatio);

        if (!jumpHeld) {
          this.executeJump(moveDir);
        }
      } else {
        if (jumpHeld) {
          this.isCharging = true;
          this.chargeMs = dtMs;
          if (!onIce) {
            this.vx = 0;
          }
          if (moveDir !== 0) {
            this.facing = moveDir;
          }
          this.events.onChargeTick?.(this.chargeRatio);
        } else {
          if (onIce) {
            if (moveDir !== 0) {
              this.facing = moveDir;
              this.vx = Phaser.Math.Clamp(
                this.vx + moveDir * PLAYER_CONSTANTS.ICE_ACCEL * dtSec,
                -PLAYER_CONSTANTS.ICE_MAX_SLIDE_SPEED,
                PLAYER_CONSTANTS.ICE_MAX_SLIDE_SPEED
              );
            } else {
              this.applyGroundFriction(dtSec, true);
            }
          } else {
            if (moveDir !== 0) {
              this.facing = moveDir;
              this.vx = moveDir * PLAYER_CONSTANTS.WALK_SPEED;
            } else {
              this.vx = 0;
            }
          }
        }
      }
    } else {
      this.isCharging = false;
      this.chargeMs = 0;
      this.applyWindForces(ctx.windZones, dtSec);
    }

    this.vy = Math.min(this.vy + PHYSICS.GRAVITY * dtSec, PHYSICS.MAX_FALL_SPEED);

    this.prevVx = this.vx;
    this.prevVy = this.vy;

    this.x += this.vx * dtSec;
    this.resolveHorizontalCollisions(ctx.solids);

    const wasGrounded = this.isGrounded;
    this.y += this.vy * dtSec;
    this.isGrounded = false;
    this.resolveVerticalCollisions(ctx.solids, wasGrounded, ctx.worldBottomY);

    if (!this.isGrounded && this.vy >= 0) {
      this.checkGroundProbe(ctx.solids);
    }

    this.checkTriggers(ctx);
    this.syncVisuals(dtMs);
  }

  private applyGroundFriction(dtSec: number, onIce: boolean): void {
    const decel = onIce ? PLAYER_CONSTANTS.ICE_DECEL : PLAYER_CONSTANTS.GROUND_DECEL;
    if (this.vx > 0) {
      this.vx = Math.max(0, this.vx - decel * dtSec);
    } else if (this.vx < 0) {
      this.vx = Math.min(0, this.vx + decel * dtSec);
    }
  }

  private applyWindForces(windZones: readonly WorldTileRect[], dtSec: number): void {
    let windDir = 0;
    for (let i = 0; i < windZones.length; i++) {
      const zone = windZones[i];
      if (!zone) continue;
      if (this.overlaps(zone)) {
        windDir += zone.kind === 'wind-right' ? 1 : -1;
      }
    }

    if (windDir !== 0) {
      const sign = Math.sign(windDir);
      this.vx = Phaser.Math.Clamp(
        this.vx + sign * PLAYER_CONSTANTS.WIND_ACCEL * dtSec,
        -(PLAYER_CONSTANTS.JUMP_VX_MAX + PLAYER_CONSTANTS.WIND_MAX_BONUS_VX),
        PLAYER_CONSTANTS.JUMP_VX_MAX + PLAYER_CONSTANTS.WIND_MAX_BONUS_VX
      );
    }
  }

  private executeJump(releaseDirection: -1 | 0 | 1): void {
    const effectiveCharge = Math.max(this.chargeMs, PLAYER_CONSTANTS.MIN_CHARGE_MS);
    const ratio = Phaser.Math.Clamp(effectiveCharge / PLAYER_CONSTANTS.MAX_CHARGE_MS, 0, 1);

    const jumpVy = Phaser.Math.Linear(
      PLAYER_CONSTANTS.JUMP_VY_MIN,
      PLAYER_CONSTANTS.JUMP_VY_MAX,
      ratio
    );
    const jumpVxSpeed = Phaser.Math.Linear(
      PLAYER_CONSTANTS.JUMP_VX_MIN,
      PLAYER_CONSTANTS.JUMP_VX_MAX,
      ratio
    );

    this.vy = jumpVy;
    this.vx = releaseDirection * jumpVxSpeed;
    if (releaseDirection !== 0) {
      this.facing = releaseDirection;
    }

    this.isGrounded = false;
    this.isCharging = false;
    this.chargeMs = 0;
    this.jumpCount += 1;
    globalLoadout.recordJump();

    this.playSquashTween(0.74, 1.32, 140);
    this.events.onJump?.(ratio, this.vx, this.vy);
  }

  private resolveHorizontalCollisions(solids: readonly WorldTileRect[]): void {
    if (this.x < 0) {
      this.x = 0;
      this.handleWallImpact(1, false);
    } else if (this.x + this.width > DISPLAY.WIDTH) {
      this.x = DISPLAY.WIDTH - this.width;
      this.handleWallImpact(-1, false);
    }

    for (let i = 0; i < solids.length; i++) {
      const tile = solids[i];
      if (!tile || tile.broken || tile.kind === 'platform') continue;

      if (this.overlaps(tile)) {
        const isBouncy = tile.kind === 'bouncy';
        if (this.prevVx > 0) {
          this.x = tile.x - this.width;
          this.handleWallImpact(-1, isBouncy);
        } else if (this.prevVx < 0) {
          this.x = tile.x + tile.width;
          this.handleWallImpact(1, isBouncy);
        }
      }
    }
  }

  private handleWallImpact(normalDir: -1 | 1, isBouncy: boolean): void {
    if (!this.isGrounded) {
      const factor = isBouncy
        ? PLAYER_CONSTANTS.BOUNCY_WALL_FACTOR
        : PLAYER_CONSTANTS.WALL_BOUNCE_FACTOR;
      const minSpeed = isBouncy
        ? PLAYER_CONSTANTS.MIN_BOUNCE_VX * 2.2
        : PLAYER_CONSTANTS.MIN_BOUNCE_VX;
      const bouncedSpeed = Math.max(Math.abs(this.prevVx) * factor, minSpeed);

      this.vx = normalDir * bouncedSpeed;
      this.facing = normalDir;
      this.playSquashTween(isBouncy ? 0.68 : 0.8, isBouncy ? 1.3 : 1.18, 115);
      this.events.onWallBounce?.(
        normalDir === 1 ? this.x : this.x + this.width,
        this.y + this.height * 0.5,
        normalDir,
        0,
        isBouncy
      );
    } else {
      this.vx = 0;
    }
  }

  private resolveVerticalCollisions(
    solids: readonly WorldTileRect[],
    wasGrounded: boolean,
    worldBottomY: number
  ): void {
    if (this.y < 2) {
      if (this.events.onAscendPastTop) {
        this.events.onAscendPastTop();
        return;
      }
      this.y = 0;
      if (this.prevVy < 0) {
        this.vy = 0;
        this.playSquashTween(1.2, 0.82, 95);
        this.events.onCeilingBonk?.(this.centerX, this.y);
      }
    }

    if (this.y + this.height > worldBottomY) {
      if (this.events.onFallBelowBottom) {
        this.events.onFallBelowBottom();
        return;
      }
      this.y = worldBottomY - this.height;
      this.vy = 0;
      this.isGrounded = true;
      this.currentSurface = 'solid';
      if (!wasGrounded) {
        this.handleLanding(this.prevVy, 'solid');
      }
    }

    const prevBottomY = this.y - this.vy * PHYSICS.FIXED_DT_SEC + this.height;

    for (let i = 0; i < solids.length; i++) {
      const tile = solids[i];
      if (!tile || tile.broken) continue;

      if (this.overlaps(tile)) {
        if (tile.kind === 'platform') {
          // Khối bục 1 chiều: chỉ đứng được khi rơi từ trên xuống và chân trước đó ở phía trên mặt bục
          if (this.prevVy >= 0 && prevBottomY <= tile.y + 4) {
            this.y = tile.y - this.height;
            this.vy = 0;
            this.isGrounded = true;
            this.currentSurface = 'platform';
            if (!wasGrounded) {
              this.handleLanding(this.prevVy, 'platform');
            }
          }
          continue;
        }

        if (this.prevVy >= 0) {
          this.y = tile.y - this.height;

          if (tile.kind === 'bouncy') {
            this.vy = PLAYER_CONSTANTS.BOUNCY_FLOOR_VY;
            this.isGrounded = false;
            this.playSquashTween(0.72, 1.34, 145);
            this.events.onWallBounce?.(this.centerX, this.bottomY, 0, -1, true);
          } else {
            this.vy = 0;
            this.isGrounded = true;
            this.currentSurface = tile.kind;
            if (tile.kind === 'crumble') {
              tile.crumbling = true;
            }
            if (!wasGrounded) {
              this.handleLanding(this.prevVy, tile.kind);
            }
          }
        } else if (this.prevVy < 0) {
          this.y = tile.y + tile.height;
          const isBouncy = tile.kind === 'bouncy';
          this.vy = isBouncy ? Math.abs(this.prevVy) * 0.65 : PLAYER_CONSTANTS.CEILING_DAMPING;
          this.playSquashTween(1.22, 0.8, 95);
          if (isBouncy) {
            this.events.onWallBounce?.(this.centerX, this.y, 0, 1, true);
          } else {
            this.events.onCeilingBonk?.(this.centerX, this.y);
          }
        }
      }
    }
  }

  private checkGroundProbe(solids: readonly WorldTileRect[]): void {
    const probeY = this.y + this.height + 0.6;
    for (let i = 0; i < solids.length; i++) {
      const tile = solids[i];
      if (!tile || tile.broken || tile.kind === 'bouncy') continue;
      const horizontalOverlap = this.x + this.width > tile.x && this.x < tile.x + tile.width;
      const onTopSurface = Math.abs(probeY - tile.y) <= 0.8;
      if (horizontalOverlap && onTopSurface) {
        this.y = tile.y - this.height;
        this.vy = 0;
        this.isGrounded = true;
        this.currentSurface = tile.kind;
        if (tile.kind === 'crumble') {
          tile.crumbling = true;
        }
        return;
      }
    }
  }

  private handleLanding(impactVy: number, surface: TileKind): void {
    if (surface === 'ice') {
      this.vx = this.prevVx * 0.88;
    } else {
      this.vx = 0;
    }

    const isHardFall = impactVy >= PLAYER_CONSTANTS.HARD_FALL_SPEED_THRESHOLD;
    if (isHardFall) {
      this.hardFallCount += 1;
      globalLoadout.recordHardFall();
      this.splatTimerMs = PLAYER_CONSTANTS.HARD_FALL_SPLAT_MS;
      this.hitStopMs = PLAYER_CONSTANTS.HIT_STOP_MS;
      this.playSquashTween(1.44, 0.56, 230);
    } else {
      this.landRecoveryMs = PLAYER_CONSTANTS.NORMAL_LAND_RECOVERY_MS;
      this.playSquashTween(1.24, 0.78, 115);
    }

    this.events.onLand?.(this.centerX, this.bottomY, impactVy, isHardFall, surface);
  }

  private checkTriggers(ctx: PlayerCollisionContext): void {
    // Đã loại bỏ hoàn toàn Checkpoint tự động: Người chơi phải tự leo bằng thực lực!
    for (let i = 0; i < ctx.easterEggs.length; i++) {
      const egg = ctx.easterEggs[i];
      if (egg && !egg.activated && this.overlaps(egg)) {
        egg.activated = true;
        egg.sprite?.setVisible(false);
        this.events.onEasterEggReach?.(egg);
        return;
      }
    }

    for (let i = 0; i < ctx.goals.length; i++) {
      const goal = ctx.goals[i];
      if (goal && this.overlaps(goal)) {
        this.events.onGoalReach?.(goal);
        return;
      }
    }

    for (let i = 0; i < ctx.hazards.length; i++) {
      const hazard = ctx.hazards[i];
      if (hazard && this.overlaps(hazard)) {
        const hitX = this.centerX;
        const hitY = this.centerY;
        // Không còn tele về Checkpoint: Chạm bẫy sẽ hất văng nhân vật khỏi mỏm đá để rơi tự do!
        const pushDir: -1 | 1 = this.centerX < DISPLAY.WIDTH * 0.5 ? 1 : -1;
        this.y = Math.min(this.y, hazard.y - this.height - 2);
        this.vy = -210;
        this.vx = pushDir * 175;
        this.isGrounded = false;
        this.isCharging = false;
        this.chargeMs = 0;
        this.hardFallCount += 1;
        globalLoadout.recordHardFall();
        this.hitStopMs = 45;
        this.playSquashTween(1.35, 0.65, 190);
        this.events.onHazardHit?.(hitX, hitY);
        return;
      }
    }
  }

  private overlaps(rect: { x: number; y: number; width: number; height: number }): boolean {
    return (
      this.x < rect.x + rect.width &&
      this.x + this.width > rect.x &&
      this.y < rect.y + rect.height &&
      this.y + this.height > rect.y
    );
  }

  private playSquashTween(startX: number, startY: number, duration: number): void {
    if (this.scaleTween) {
      this.scaleTween.stop();
      this.scaleTween = null;
    }
    this.squashX = startX;
    this.squashY = startY;

    this.scaleTween = this.scene.tweens.add({
      targets: this,
      squashX: 1,
      squashY: 1,
      duration,
      ease: 'Quad.easeOut'
    });
  }

  private syncVisuals(dtMs: number): void {
    let targetTiltDeg = 0;
    let strideStretchX = 1;
    let strideStretchY = 1;
    let currentTexture: string = TEXTURE_KEYS.PLAYER_IDLE;

    if (this.splatTimerMs > 0) {
      currentTexture = TEXTURE_KEYS.PLAYER_SPLAT;
    } else if (this.isCharging) {
      currentTexture = TEXTURE_KEYS.PLAYER_CHARGE;
    } else if (!this.isGrounded) {
      if (this.vy < -20) {
        currentTexture = TEXTURE_KEYS.PLAYER_JUMP;
      } else {
        currentTexture = TEXTURE_KEYS.PLAYER_FALL;
      }
      targetTiltDeg = Phaser.Math.Clamp(this.vx * 0.035, -6, 6);
    } else if (Math.abs(this.vx) > 4) {
      this.walkAnimTimerMs += dtMs;
      this.walkDustTimerMs += dtMs;

      const frameDurationMs = 62;
      this.walkFrameIndex = Math.floor(this.walkAnimTimerMs / frameDurationMs) % WALK_FRAMES.length;
      currentTexture = WALK_FRAMES[this.walkFrameIndex] ?? TEXTURE_KEYS.PLAYER_WALK_1;

      const wave = Math.sin(this.walkAnimTimerMs * 0.028);
      strideStretchX = 1 + wave * 0.045;
      strideStretchY = 1 - wave * 0.045;
      targetTiltDeg = this.facing * 2.2;

      if (this.walkDustTimerMs >= PLAYER_CONSTANTS.WALK_DUST_INTERVAL_MS) {
        this.walkDustTimerMs = 0;
        this.events.onWalkStep?.(this.centerX, this.bottomY, this.facing, this.currentSurface);
      }
    } else {
      this.walkAnimTimerMs = 0;
      this.walkDustTimerMs = 0;
      currentTexture = TEXTURE_KEYS.PLAYER_IDLE;
    }

    const loadout = globalLoadout.getLoadout();
    const skinDef = globalLoadout.getSkinDef(loadout.skinId);
    const resolvedPlayerTex = ProceduralTextures.getPlayerFrameKey(loadout.skinId, currentTexture);

    this.sprite.setTexture(resolvedPlayerTex);
    this.smoothTiltDeg = Phaser.Math.Linear(this.smoothTiltDeg, targetTiltDeg, 0.25);

    let renderScaleX = this.squashX * strideStretchX;
    let renderScaleY = this.squashY * strideStretchY;
    let shakeOffsetX = 0;

    if (this.isCharging) {
      const ratio = this.chargeRatio;
      renderScaleX = 1 + ratio * 0.26;
      renderScaleY = 1 - ratio * 0.28;
      if (ratio >= 0.75) {
        shakeOffsetX = Math.sin(this.scene.time.now * 0.06) * 1;
      }
    }

    const drawX = Math.round(this.centerX + shakeOffsetX);
    const drawY = Math.round(this.bottomY);
    const isFlipped = this.facing === -1;

    this.sprite.setPosition(drawX, drawY);
    this.sprite.setFlipX(isFlipped);
    this.sprite.setAngle(this.smoothTiltDeg);
    this.sprite.setScale(renderScaleX, renderScaleY);

    // Đồng bộ vị trí & chuyển động của Vũ Khí (Tay phải) và Khiên/Pháp Khí (Tay trái)
    if (loadout.weaponId !== 'weapon-none') {
      this.weaponSprite.setVisible(true);
      this.weaponSprite.setTexture(ProceduralTextures.getWeaponKey(loadout.weaponId));
      this.weaponSprite.setFlipX(isFlipped);

      const walkSwing =
        this.isGrounded && Math.abs(this.vx) > 4
          ? Math.sin(this.walkAnimTimerMs * 0.028) * 14
          : 0;
      const wOffsetX = this.facing * (this.isCharging ? 6 : 5);
      const wOffsetY =
        this.splatTimerMs > 0 ? -2 : this.isCharging ? -4 : !this.isGrounded ? -8 : -6;
      let wAngle = walkSwing * this.facing + this.smoothTiltDeg;
      if (this.splatTimerMs > 0) {
        wAngle = this.facing * 75;
      } else if (this.isCharging) {
        wAngle = this.facing * (28 + this.chargeRatio * 20);
      } else if (!this.isGrounded) {
        wAngle = this.vy < 0 ? -this.facing * 18 : this.facing * 24;
      }

      this.weaponSprite.setPosition(Math.round(drawX + wOffsetX), Math.round(drawY + wOffsetY));
      this.weaponSprite.setAngle(wAngle);
      this.weaponSprite.setScale(renderScaleX * 0.85, renderScaleY * 0.85);
    } else {
      this.weaponSprite.setVisible(false);
    }

    if (loadout.shieldId !== 'shield-none') {
      this.shieldSprite.setVisible(true);
      this.shieldSprite.setTexture(ProceduralTextures.getShieldKey(loadout.shieldId));
      this.shieldSprite.setFlipX(isFlipped);

      const walkBob =
        this.isGrounded && Math.abs(this.vx) > 4
          ? Math.cos(this.walkAnimTimerMs * 0.028) * 1.2
          : 0;
      const shOffsetX = -this.facing * (this.isCharging ? 4 : 5);
      const shOffsetY =
        this.splatTimerMs > 0
          ? -2
          : this.isCharging
            ? -4
            : Math.round(-6 + walkBob);

      this.shieldSprite.setPosition(Math.round(drawX + shOffsetX), Math.round(drawY + shOffsetY));
      this.shieldSprite.setAngle(this.splatTimerMs > 0 ? -this.facing * 65 : this.smoothTiltDeg * 0.6);
      this.shieldSprite.setScale(renderScaleX * 0.82, renderScaleY * 0.82);
    } else {
      this.shieldSprite.setVisible(false);
    }

    const speed = Math.hypot(this.vx, this.vy);
    if (!this.isGrounded && speed > 235) {
      // Độ đậm bóng mờ tự động tăng mượt theo tốc độ thực tế trên không
      const speedFactor = Phaser.Math.Clamp((speed - 235) / 230, 0.18, 1);
      const trailAlpha = 0.09 + speedFactor * 0.17;
      const trailTint = speed > 410 ? 0xffd166 : skinDef.trailColor;
      this.events.onTrailEmit?.(
        drawX,
        drawY,
        resolvedPlayerTex,
        isFlipped,
        renderScaleX,
        renderScaleY,
        trailTint,
        24,
        this.smoothTiltDeg,
        this.vx,
        this.vy,
        trailAlpha
      );
    } else if (this.isGrounded && this.currentSurface === 'ice' && Math.abs(this.vx) > 102) {
      // Chỉ tạo bóng mờ băng tuyết mảnh khi đang trượt băng tốc độ cao (không tạo khi đi bộ thường)
      this.events.onTrailEmit?.(
        drawX,
        drawY,
        resolvedPlayerTex,
        isFlipped,
        renderScaleX,
        renderScaleY,
        0xa5f3fc,
        45,
        this.smoothTiltDeg,
        this.vx,
        0,
        0.14
      );
    }

    this.drawEquipmentAura(drawX, drawY, dtMs);
    this.drawChargeBar();
  }

  /**
   * Vẽ hào quang năng lượng, tia sáng đầu mũi kiếm/trượng, vòng hộ mệnh quanh khiên
   * và phát hạt nguyên tố bắt mắt cho các vật phẩm cầm tay.
   */
  private drawEquipmentAura(drawX: number, drawY: number, dtMs: number): void {
    this.equipAuraGraphics.clear();
    if (!globalSettings.get().effectsEnabled) return;

    const loadout = globalLoadout.getLoadout();
    const now = this.scene.time.now;
    const pulse = 0.55 + Math.sin(now * 0.008) * 0.35;
    const prismColors = [0x34d399, 0x22d3ee, 0xf472b6, 0xfacc15];
    const prismIdx = Math.floor(now / 160) % prismColors.length;

    let wx = drawX + this.facing * 6;
    let wy = drawY - 9;
    let wActiveColor = 0xffffff;

    // 1. Hiệu ứng Hào Quang Vũ Khí (Tay phải)
    if (loadout.weaponId !== 'weapon-none') {
      const wDef = globalLoadout.getWeaponDef(loadout.weaponId);
      const isPrism = wDef.fxStyle === 'creator-prism';
      const primaryColor = isPrism ? (prismColors[prismIdx] ?? wDef.fxColor) : wDef.fxColor;
      const secondaryColor = wDef.fxSecondaryColor;
      wActiveColor = primaryColor;

      wx = Math.round(this.weaponSprite.x + this.facing * 4);
      wy = Math.round(this.weaponSprite.y - 4);

      const glowRadius = this.isCharging ? 4 + this.chargeRatio * 3.5 : 3;
      this.equipAuraGraphics.fillStyle(primaryColor, (0.28 + (this.isCharging ? 0.35 : 0)) * pulse);
      this.equipAuraGraphics.fillCircle(wx, wy, glowRadius);

      // Chữ thập sao lấp lánh trên mũi vũ khí
      this.equipAuraGraphics.fillStyle(secondaryColor, 0.85 * pulse);
      this.equipAuraGraphics.fillRect(wx - 2, wy, 5, 1);
      this.equipAuraGraphics.fillRect(wx, wy - 2, 1, 5);

      // Nếu đang nạp lực nhảy: vẽ vòng hội tụ năng lượng quanh vũ khí
      if (this.isCharging && this.chargeRatio > 0.2) {
        const ringR = 5 + (1 - this.chargeRatio) * 6;
        this.equipAuraGraphics.lineStyle(1, primaryColor, 0.75);
        this.equipAuraGraphics.strokeCircle(wx, wy, ringR);
      }
    }

    // 2. Hiệu ứng Vòng Bảo Hộ & Tinh Cầu Xoay Quanh Khiên/Pháp Khí (Tay trái)
    let shX = drawX - this.facing * 5;
    let shY = drawY - 6;
    let shActiveColor = 0xffffff;
    if (loadout.shieldId !== 'shield-none') {
      const shDef = globalLoadout.getShieldDef(loadout.shieldId);
      const isPrism = shDef.fxStyle === 'creator-prism';
      const shColor = isPrism ? (prismColors[(prismIdx + 2) % prismColors.length] ?? shDef.fxColor) : shDef.fxColor;
      shActiveColor = shColor;

      shX = Math.round(this.shieldSprite.x);
      shY = Math.round(this.shieldSprite.y);

      // 2 hạt tinh cầu ma thuật xoay quanh khiên
      const orbitAngle = now * 0.0055;
      const ox1 = Math.round(shX + Math.cos(orbitAngle) * 5);
      const oy1 = Math.round(shY + Math.sin(orbitAngle) * 5);
      const ox2 = Math.round(shX + Math.cos(orbitAngle + Math.PI) * 5);
      const oy2 = Math.round(shY + Math.sin(orbitAngle + Math.PI) * 5);

      this.equipAuraGraphics.fillStyle(shColor, 0.85);
      this.equipAuraGraphics.fillRect(ox1, oy1, 2, 2);
      this.equipAuraGraphics.fillStyle(shDef.fxSecondaryColor, 0.85);
      this.equipAuraGraphics.fillRect(ox2, oy2, 1, 1);
    }

    // 3. Phát hạt tia sáng nguyên tố định kỳ từ Vũ Khí / Khiên
    this.equipMoteTimerMs += dtMs;
    const interval = this.isCharging || !this.isGrounded ? 60 : 125;
    if (this.equipMoteTimerMs >= interval) {
      this.equipMoteTimerMs = 0;
      if (loadout.weaponId !== 'weapon-none') {
        this.events.onEquipMoteEmit?.(wx, wy, wActiveColor);
      } else if (loadout.shieldId !== 'shield-none') {
        this.events.onEquipMoteEmit?.(shX, shY, shActiveColor);
      }
    }
  }

  private drawChargeBar(): void {
    this.chargeBarGraphics.clear();
    if (!this.isCharging) return;

    const ratio = this.chargeRatio;
    const isFull = ratio >= 1;
    const barW = 20;
    const barH = 4;
    const jitterX =
      ratio >= 0.75 ? (Math.floor(this.scene.time.now / 35) % 2 === 0 ? -1 : 1) : 0;
    const barX = Math.round(this.centerX - barW * 0.5 + jitterX);
    const barY = Math.round(this.y - 10);

    const borderColor =
      isFull && Math.floor(this.scene.time.now / 70) % 2 === 0 ? 0xffffff : 0x0d0f18;
    this.chargeBarGraphics.fillStyle(borderColor, 0.95);
    this.chargeBarGraphics.fillRect(barX - 1, barY - 1, barW + 2, barH + 2);

    let fillColor = 0x80ed99;
    if (isFull) {
      fillColor = 0xff2a55;
    } else if (ratio > 0.75) {
      fillColor = 0xff595e;
    } else if (ratio > 0.4) {
      fillColor = 0xffca3a;
    }

    const fillW = Math.max(1, Math.round(barW * ratio));
    this.chargeBarGraphics.fillStyle(fillColor, 1);
    this.chargeBarGraphics.fillRect(barX, barY, fillW, barH);
  }
}
