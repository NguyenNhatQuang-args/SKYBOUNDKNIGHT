import Phaser from 'phaser';
import { DISPLAY } from '../constants';
import { WorldTheme } from '../data/levelTypes';
import { globalLoadout } from '../services/CharacterLoadoutService';
import { globalSettings } from '../services/SettingsService';
import { TEXTURE_KEYS } from './ProceduralTextures';

interface AmbientParticle {
  sprite: Phaser.GameObjects.Image;
  vx: number;
  vy: number;
  wobbleSpeed: number;
  wobblePhase: number;
}

export class EffectsSystem {
  private readonly scene: Phaser.Scene;
  private ambientParticles: AmbientParticle[] = [];
  private lastTrailTimeMs = 0;
  private lastTrailX = -9999;
  private lastTrailY = -9999;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public clearAmbient(): void {
    for (const p of this.ambientParticles) {
      p.sprite.destroy();
    }
    this.ambientParticles = [];
  }

  public setupAmbientParticles(theme: WorldTheme): void {
    this.clearAmbient();
    if (!globalSettings.get().effectsEnabled) return;

    const count = 24;
    let tex: string = TEXTURE_KEYS.PARTICLE_LEAF;
    if (
      theme === 'ice' ||
      theme === 'mc-frozen' ||
      theme === 'cl-city' ||
      theme === 'cl-summit' ||
      theme === 'sn-icecap' ||
      theme === 'er-nokron' ||
      theme === 'tb-himalaya' ||
      theme === 'sp-icecaves' ||
      theme === 'or-forlorn'
    )
      tex = TEXTURE_KEYS.PARTICLE_SNOW;
    else if (
      theme === 'wind' ||
      theme === 'cl-ridge' ||
      theme === 'er-azula' ||
      theme === 'sm-sky' ||
      theme === 'zd-skyisle' ||
      theme === 'tb-yamatai'
    )
      tex = TEXTURE_KEYS.PARTICLE_WIND_STREAK;
    else if (
      theme === 'mc-cherry' ||
      theme === 'tr-hallow' ||
      theme === 'hk-crystal' ||
      theme === 'or-willow' ||
      theme === 'or-nibel' ||
      theme === 'sb-jellyshroom' ||
      theme.startsWith('mb-') ||
      theme === 'ed-rose' ||
      theme === 'sw-holo'
    )
      tex = TEXTURE_KEYS.PARTICLE_PETAL;
    else if (
      theme === 'mc-nether' ||
      theme === 'mc-bastion' ||
      theme === 'mc-redstone' ||
      theme === 'er-caelid' ||
      theme === 'sm-castle' ||
      theme === 'cl-resort' ||
      theme === 'zd-deathmtn' ||
      theme === 'mt-norfair' ||
      theme === 'sb-lava' ||
      theme === 'or-horu' ||
      theme === 'tb-egypt' ||
      theme === 'sp-temple' ||
      theme === 'tb-atlantis' ||
      theme.startsWith('wk-') ||
      theme.startsWith('rk-')
    )
      tex = TEXTURE_KEYS.PARTICLE_EMBER;
    else if (
      theme === 'mc-end' ||
      theme === 'mc-endcity' ||
      theme === 'tr-nebula' ||
      theme === 'tr-corruption' ||
      theme === 'cl-dream' ||
      theme === 'sm-galaxy' ||
      theme === 'sn-casino' ||
      theme === 'sp-cosmic' ||
      theme === 'mt-tourian' ||
      theme.startsWith('sw-') ||
      theme.startsWith('ed-')
    )
      tex = TEXTURE_KEYS.PARTICLE_END_PORTAL;
    else if (
      theme === 'mc-ocean' ||
      theme === 'mc-deepdark' ||
      theme === 'mc-soul' ||
      theme === 'hk-tears' ||
      theme === 'hk-crossroads' ||
      theme === 'er-liurnia' ||
      theme === 'sn-chemical' ||
      theme === 'zd-zora' ||
      theme === 'mt-maridia' ||
      theme === 'sb-shallows' ||
      theme === 'sb-kelp' ||
      theme === 'sb-lostriver' ||
      theme === 'or-ginso'
    )
      tex = TEXTURE_KEYS.PARTICLE_BUBBLE;

    for (let i = 0; i < count; i++) {
      const x = Phaser.Math.Between(0, DISPLAY.WIDTH);
      const y = Phaser.Math.Between(0, DISPLAY.HEIGHT);
      const sprite = this.scene.add
        .image(x, y, tex)
        .setScrollFactor(0)
        .setDepth(4)
        .setAlpha(Phaser.Math.FloatBetween(0.4, 0.85));

      const rising =
        theme === 'mc-nether' ||
        theme === 'mc-bastion' ||
        theme === 'mc-redstone' ||
        theme === 'mc-soul' ||
        theme === 'mc-ocean' ||
        theme === 'mc-deepdark' ||
        theme === 'mc-end' ||
        theme === 'mc-endcity';

      const vx =
        theme === 'wind'
          ? Phaser.Math.FloatBetween(65, 125)
          : theme === 'mc-cherry'
            ? Phaser.Math.FloatBetween(-26, -8)
            : Phaser.Math.FloatBetween(-14, 18);
      const vy =
        theme === 'wind'
          ? Phaser.Math.FloatBetween(-10, 10)
          : rising
            ? Phaser.Math.FloatBetween(-28, -10)
            : Phaser.Math.FloatBetween(12, 28);

      this.ambientParticles.push({
        sprite,
        vx,
        vy,
        wobbleSpeed: Phaser.Math.FloatBetween(1.5, 3.5),
        wobblePhase: Phaser.Math.FloatBetween(0, Math.PI * 2)
      });
    }
  }

  public updateAmbient(dtSec: number, timeSec: number): void {
    const enabled = globalSettings.get().effectsEnabled;
    for (const p of this.ambientParticles) {
      p.sprite.setVisible(enabled);
      if (!enabled) continue;

      p.sprite.x += (p.vx + Math.sin(timeSec * p.wobbleSpeed + p.wobblePhase) * 10) * dtSec;
      p.sprite.y += p.vy * dtSec;

      if (p.sprite.x > DISPLAY.WIDTH + 12) p.sprite.x = -12;
      if (p.sprite.x < -12) p.sprite.x = DISPLAY.WIDTH + 12;
      if (p.sprite.y > DISPLAY.HEIGHT + 12) p.sprite.y = -12;
      if (p.sprite.y < -12) p.sprite.y = DISPLAY.HEIGHT + 12;
    }
  }

  public spawnPlayerTrail(
    x: number,
    y: number,
    textureKey: string,
    flipX: boolean,
    scaleX: number,
    scaleY: number,
    tint: number,
    nowMs: number,
    minIntervalMs = 24,
    angleDeg = 0,
    vx = 0,
    vy = 0,
    baseAlpha = 0.22
  ): void {
    if (!globalSettings.get().effectsEnabled) return;

    const elapsed = nowMs - this.lastTrailTimeMs;
    if (elapsed > 110) {
      // Bắt đầu một chuỗi nhảy/lướt mới -> đặt lại điểm neo khoảng cách
      this.lastTrailX = x;
      this.lastTrailY = y;
    }

    const dx = x - this.lastTrailX;
    const dy = y - this.lastTrailY;
    const dist = Math.hypot(dx, dy);

    // Chỉ sinh bóng mờ khi đã di chuyển đủ quãng đường (>= 8.5px) và đủ nhịp thời gian
    if (elapsed < minIntervalMs || dist < 8.5) {
      return;
    }

    // Nếu tốc độ cao khiến khoảng cách giữa 2 khung hình xa (>= 17px),
    // nội suy thêm 1 bóng mờ trung gian ở giữa để tạo dải lụa chuyển động liền mạch
    if (dist >= 17 && dist <= 48 && elapsed <= 90) {
      this.spawnSingleAfterimage(
        (this.lastTrailX + x) * 0.5,
        (this.lastTrailY + y) * 0.5,
        textureKey,
        flipX,
        scaleX,
        scaleY,
        tint,
        angleDeg,
        vx,
        vy,
        baseAlpha * 0.62,
        155
      );
    }

    this.lastTrailTimeMs = nowMs;
    this.lastTrailX = x;
    this.lastTrailY = y;

    this.spawnSingleAfterimage(
      x,
      y,
      textureKey,
      flipX,
      scaleX,
      scaleY,
      tint,
      angleDeg,
      vx,
      vy,
      baseAlpha,
      200
    );
  }

  private spawnSingleAfterimage(
    x: number,
    y: number,
    textureKey: string,
    flipX: boolean,
    scaleX: number,
    scaleY: number,
    tint: number,
    angleDeg: number,
    vx: number,
    vy: number,
    initialAlpha: number,
    durationMs: number
  ): void {
    const startX = Math.round(x);
    const startY = Math.round(y);

    const ghost = this.scene.add
      .image(startX, startY, textureKey)
      .setOrigin(0.5, 1)
      .setFlipX(flipX)
      .setAngle(angleDeg)
      .setScale(scaleX, scaleY)
      .setTint(tint)
      .setAlpha(initialAlpha)
      .setDepth(18);

    // Trôi nhẹ theo quán tính vận tốc (giúp bóng mờ hòa quyện vào quỹ đạo nhảy thay vì đứng khựng)
    const driftX = Math.round(Phaser.Math.Clamp(vx * 0.018, -5, 5));
    const driftY = Math.round(Phaser.Math.Clamp(vy * 0.018, -5, 5));

    this.scene.tweens.add({
      targets: ghost,
      x: startX + driftX,
      y: startY + driftY,
      alpha: 0,
      scaleX: scaleX * 0.96,
      scaleY: scaleY * 0.96,
      duration: durationMs,
      ease: 'Sine.easeOut',
      onComplete: () => ghost.destroy()
    });
  }

  public spawnJumpEffect(x: number, y: number, chargeRatio: number, vx: number): void {
    if (!globalSettings.get().effectsEnabled) return;

    const ring = this.scene.add.graphics().setDepth(24);
    ring.setPosition(Math.round(x), Math.round(y - 1));
    const ringColor = chargeRatio >= 0.85 ? 0xffbe0b : 0x5ce1e6;
    ring.lineStyle(2, ringColor, 0.9);
    ring.strokeEllipse(0, 0, 10, 4);

    this.scene.tweens.add({
      targets: ring,
      scaleX: 2.2 + chargeRatio * 1.4,
      scaleY: 1.8 + chargeRatio * 0.8,
      alpha: 0,
      duration: 210,
      ease: 'Cubic.easeOut',
      onComplete: () => ring.destroy()
    });

    const count = Math.round(6 + chargeRatio * 6);
    this.spawnDustBurst(x, y, count, vx, false);

    // Nếu người chơi đang cầm Vũ Khí, phóng thêm Vệt Chém Ánh Sáng Nguyên Tố khi bật nhảy
    const loadout = globalLoadout.getLoadout();
    if (loadout.weaponId !== 'weapon-none') {
      const wDef = globalLoadout.getWeaponDef(loadout.weaponId);
      const facing: -1 | 1 = vx < -5 ? -1 : 1;
      this.spawnWeaponJumpSlash(
        x,
        y - 8,
        facing,
        wDef.fxColor,
        wDef.fxSecondaryColor,
        chargeRatio
      );
    }
  }

  public spawnWeaponJumpSlash(
    x: number,
    y: number,
    facing: -1 | 1,
    primaryColor: number,
    secondaryColor: number,
    chargeRatio: number
  ): void {
    if (!globalSettings.get().effectsEnabled) return;

    const arc = this.scene.add.graphics().setDepth(21.5);
    arc.setPosition(Math.round(x + facing * 4), Math.round(y));
    arc.lineStyle(2, primaryColor, 0.92);
    arc.beginPath();
    arc.arc(0, 0, 9 + chargeRatio * 5, -Math.PI * 0.75, Math.PI * 0.25, false);
    arc.strokePath();

    arc.lineStyle(1, secondaryColor, 0.85);
    arc.beginPath();
    arc.arc(0, 0, 7 + chargeRatio * 4, -Math.PI * 0.65, Math.PI * 0.15, false);
    arc.strokePath();
    if (facing === -1) {
      arc.setScale(-1, 1);
    }

    this.scene.tweens.add({
      targets: arc,
      y: Math.round(y - 10 - chargeRatio * 8),
      scaleX: facing * (1.35 + chargeRatio * 0.4),
      scaleY: 1.35 + chargeRatio * 0.4,
      alpha: 0,
      duration: 210,
      ease: 'Cubic.easeOut',
      onComplete: () => arc.destroy()
    });

    const sparkCount = 4 + Math.round(chargeRatio * 4);
    for (let i = 0; i < sparkCount; i++) {
      this.spawnEquipmentMote(
        x + facing * Phaser.Math.Between(3, 10),
        y + Phaser.Math.Between(-5, 3),
        i % 2 === 0 ? primaryColor : secondaryColor,
        true
      );
    }
  }

  public spawnEquipmentMote(
    x: number,
    y: number,
    color: number,
    fastBurst = false
  ): void {
    if (!globalSettings.get().effectsEnabled) return;

    const p = this.scene.add
      .image(Math.round(x), Math.round(y), TEXTURE_KEYS.PARTICLE_SPARK)
      .setTint(color)
      .setAlpha(fastBurst ? 0.95 : 0.78)
      .setScale(fastBurst ? 0.85 : 0.65)
      .setDepth(21.2);

    const dx = Phaser.Math.Between(fastBurst ? -14 : -6, fastBurst ? 14 : 6);
    const dy = Phaser.Math.Between(fastBurst ? -18 : -11, fastBurst ? -4 : -3);

    this.scene.tweens.add({
      targets: p,
      x: Math.round(x + dx),
      y: Math.round(y + dy),
      alpha: 0,
      scale: 0.2,
      duration: fastBurst ? 210 : 280,
      ease: 'Sine.easeOut',
      onComplete: () => p.destroy()
    });
  }

  public spawnCollisionEffect(
    x: number,
    y: number,
    normalX: number,
    normalY: number,
    isBouncy: boolean
  ): void {
    if (!globalSettings.get().effectsEnabled) return;

    const ring = this.scene.add.graphics().setDepth(27);
    ring.setPosition(Math.round(x), Math.round(y));
    const color = isBouncy ? 0x80ed99 : 0xffbe0b;
    ring.lineStyle(2, color, 1);
    ring.strokeCircle(0, 0, 4);

    this.scene.tweens.add({
      targets: ring,
      scaleX: isBouncy ? 3.2 : 2.1,
      scaleY: isBouncy ? 3.2 : 2.1,
      alpha: 0,
      duration: isBouncy ? 230 : 160,
      ease: 'Quad.easeOut',
      onComplete: () => ring.destroy()
    });

    const count = isBouncy ? 14 : 8;
    const baseAngle = Math.atan2(normalY, normalX);

    for (let i = 0; i < count; i++) {
      const p = this.scene.add
        .image(Math.round(x), Math.round(y), TEXTURE_KEYS.PARTICLE_SPARK)
        .setTint(isBouncy && i % 2 === 0 ? 0x80ed99 : 0xffbe0b)
        .setDepth(28);

      const angle = baseAngle + Phaser.Math.FloatBetween(-1.1, 1.1);
      const dist = Phaser.Math.FloatBetween(10, isBouncy ? 34 : 22);

      this.scene.tweens.add({
        targets: p,
        x: Math.round(x + Math.cos(angle) * dist),
        y: Math.round(y + Math.sin(angle) * dist),
        alpha: 0,
        scale: 0.3,
        duration: Phaser.Math.Between(140, 250),
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy()
      });
    }
  }

  public spawnWalkStepParticles(x: number, y: number, facing: -1 | 1, isIce: boolean): void {
    if (!globalSettings.get().effectsEnabled) return;
    const tex = isIce ? TEXTURE_KEYS.PARTICLE_ICE : TEXTURE_KEYS.PARTICLE_DUST;

    for (let i = 0; i < 2; i++) {
      const p = this.scene.add
        .image(Math.round(x - facing * 3), Math.round(y - 1), tex)
        .setAlpha(0.85)
        .setDepth(24);

      const targetX = x - facing * Phaser.Math.Between(9, 17);
      const targetY = y - Phaser.Math.Between(3, 8);

      this.scene.tweens.add({
        targets: p,
        x: Math.round(targetX),
        y: Math.round(targetY),
        alpha: 0,
        scale: 0.4,
        duration: 170,
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy()
      });
    }
  }

  public spawnLandingEffect(x: number, y: number, isHardFall: boolean, isIce: boolean): void {
    if (!globalSettings.get().effectsEnabled) return;

    if (isHardFall) {
      const shock = this.scene.add.graphics().setDepth(25);
      shock.setPosition(Math.round(x), Math.round(y - 1));
      shock.lineStyle(2, 0xff4d6d, 0.95);
      shock.strokeEllipse(0, 0, 14, 5);

      this.scene.tweens.add({
        targets: shock,
        scaleX: 3.4,
        scaleY: 2.0,
        alpha: 0,
        duration: 280,
        ease: 'Cubic.easeOut',
        onComplete: () => shock.destroy()
      });
    }

    this.spawnDustBurst(x, y, isHardFall ? 14 : 6, 0, isIce);
  }

  public spawnDustBurst(
    x: number,
    y: number,
    count: number,
    biasVx: number,
    isIce = false
  ): void {
    if (!globalSettings.get().effectsEnabled) return;
    const tex = isIce ? TEXTURE_KEYS.PARTICLE_ICE : TEXTURE_KEYS.PARTICLE_DUST;

    for (let i = 0; i < count; i++) {
      const p = this.scene.add.image(Math.round(x), Math.round(y - 2), tex).setDepth(25);

      const angle = Phaser.Math.FloatBetween(-Math.PI * 0.92, -Math.PI * 0.08);
      const speed = Phaser.Math.FloatBetween(12, 36);
      const targetX = x + Math.cos(angle) * speed - biasVx * 0.05;
      const targetY = y + Math.sin(angle) * speed * 0.65;

      this.scene.tweens.add({
        targets: p,
        x: Math.round(targetX),
        y: Math.round(targetY),
        alpha: 0,
        duration: Phaser.Math.Between(180, 320),
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy()
      });
    }
  }

  public spawnCrumbleDebris(x: number, y: number): void {
    if (!globalSettings.get().effectsEnabled) return;
    for (let i = 0; i < 8; i++) {
      const p = this.scene.add
        .image(
          Math.round(x + Phaser.Math.Between(2, 14)),
          Math.round(y + Phaser.Math.Between(2, 14)),
          TEXTURE_KEYS.PARTICLE_DEBRIS
        )
        .setDepth(26);
      const targetX = p.x + Phaser.Math.Between(-16, 16);
      const targetY = p.y + Phaser.Math.Between(12, 34);
      this.scene.tweens.add({
        targets: p,
        x: targetX,
        y: targetY,
        alpha: 0,
        angle: Phaser.Math.Between(-90, 90),
        duration: Phaser.Math.Between(220, 360),
        ease: 'Quad.easeIn',
        onComplete: () => p.destroy()
      });
    }
  }
}
