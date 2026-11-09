import Phaser from 'phaser';
import { DISPLAY, PLAYER_CONSTANTS } from '../constants';
import { LevelData, TileKind, WorldTheme } from '../data/levelTypes';
import { ProceduralTextures, TEXTURE_KEYS } from './ProceduralTextures';

export interface WorldTileRect {
  x: number;
  y: number;
  width: number;
  height: number;
  kind: TileKind;
  screenIndex: number;
  row: number;
  col: number;
  sprite?: Phaser.GameObjects.Image;
  shadowSprite?: Phaser.GameObjects.Image;
  activated?: boolean;
  crumbling?: boolean;
  crumbleTimerMs?: number;
  broken?: boolean;
  respawnTimerMs?: number;
}

export interface BuiltLevel {
  levelData: LevelData;
  totalScreens: number;
  totalHeightPx: number;
  spawnPosition: { x: number; y: number; screenIndex: number };
  solids: WorldTileRect[];
  crumbleTiles: WorldTileRect[];
  hazards: WorldTileRect[];
  windZones: WorldTileRect[];
  checkpoints: WorldTileRect[];
  goals: WorldTileRect[];
  easterEggs: WorldTileRect[];
}

export class LevelRenderer {
  private readonly scene: Phaser.Scene;
  private tileSprites: Phaser.GameObjects.Image[] = [];
  private windTween: Phaser.Tweens.Tween | null = null;
  private propTween: Phaser.Tweens.Tween | null = null;
  private eggTween: Phaser.Tweens.Tween | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  public clear(): void {
    if (this.windTween) {
      this.windTween.stop();
      this.windTween = null;
    }
    if (this.propTween) {
      this.propTween.stop();
      this.propTween = null;
    }
    if (this.eggTween) {
      this.eggTween.stop();
      this.eggTween = null;
    }
    for (const s of this.tileSprites) {
      s.destroy();
    }
    this.tileSprites = [];
  }

  public static getScreenTopY(screenIndex: number, totalScreens: number): number {
    return (totalScreens - 1 - screenIndex) * DISPLAY.HEIGHT;
  }

  public static getScreenIndexFromY(worldY: number, totalScreens: number): number {
    const rawIdx = totalScreens - 1 - Math.floor(worldY / DISPLAY.HEIGHT);
    return Phaser.Math.Clamp(rawIdx, 0, totalScreens - 1);
  }

  private isSolidChar(ch: string | undefined, legend: Record<string, TileKind>): boolean {
    if (!ch || ch === '.') return false;
    const k = legend[ch];
    return k === 'solid' || k === 'ice' || k === 'bouncy' || k === 'crumble';
  }

  public build(level: LevelData, playerWidth: number, playerHeight: number): BuiltLevel {
    this.clear();

    const totalScreens = level.screens.length;
    const totalHeightPx = totalScreens * DISPLAY.HEIGHT;
    const tileSize = level.tileSize;

    const solids: WorldTileRect[] = [];
    const crumbleTiles: WorldTileRect[] = [];
    const hazards: WorldTileRect[] = [];
    const windZones: WorldTileRect[] = [];
    const checkpoints: WorldTileRect[] = [];
    const goals: WorldTileRect[] = [];
    const easterEggs: WorldTileRect[] = [];
    const windSprites: Phaser.GameObjects.Image[] = [];
    const animatedProps: Phaser.GameObjects.Image[] = [];
    const eggSprites: Phaser.GameObjects.Image[] = [];

    let spawnPosition = {
      x: 96,
      y: totalHeightPx - 64,
      screenIndex: 0
    };

    for (let sIdx = 0; sIdx < totalScreens; sIdx++) {
      const screen = level.screens[sIdx];
      if (!screen) continue;
      const screenTopY = LevelRenderer.getScreenTopY(sIdx, totalScreens);

      for (let row = 0; row < DISPLAY.ROWS; row++) {
        const rowStr = screen.rows[row] ?? '';
        const aboveRowStr =
          row > 0
            ? screen.rows[row - 1]
            : sIdx + 1 < totalScreens
              ? level.screens[sIdx + 1]?.rows[DISPLAY.ROWS - 1]
              : undefined;
        const belowRowStr =
          row + 1 < DISPLAY.ROWS
            ? screen.rows[row + 1]
            : sIdx > 0
              ? level.screens[sIdx - 1]?.rows[0]
              : undefined;

        for (let col = 0; col < DISPLAY.COLS; col++) {
          const ch = rowStr[col] ?? '.';
          if (ch === '.') continue;

          const kind: TileKind = level.legend[ch] ?? 'empty';
          if (kind === 'empty' || kind === 'checkpoint') continue;

          const worldX = col * tileSize;
          const worldY = screenTopY + row * tileSize;

          const hasSolidAbove = this.isSolidChar(aboveRowStr?.[col], level.legend);
          const hasSolidBelow = this.isSolidChar(belowRowStr?.[col], level.legend);
          const hash = (sIdx * 131 + row * 37 + col * 17) % 100;

          let shadowSprite: Phaser.GameObjects.Image | undefined;
          if (
            kind === 'solid' ||
            kind === 'ice' ||
            kind === 'bouncy' ||
            kind === 'crumble'
          ) {
            shadowSprite = this.scene.add
              .image(worldX + 3, worldY + 4, TEXTURE_KEYS.TILE_SHADOW_3D)
              .setOrigin(0, 0)
              .setAlpha(0.55)
              .setDepth(6);
            this.tileSprites.push(shadowSprite);

            const charBelow = belowRowStr?.[col] ?? '.';
            if (
              kind !== 'crumble' &&
              !hasSolidBelow &&
              charBelow === '.' &&
              col > 1 &&
              col < DISPLAY.COLS - 2
            ) {
              if (hash < 22) {
                const underTex = this.resolveHangingProp(level.theme, hash);
                const hanging = this.scene.add
                  .image(worldX, worldY + tileSize, underTex)
                  .setOrigin(0, 0)
                  .setAlpha(0.92)
                  .setDepth(7);
                this.tileSprites.push(hanging);
              } else if (col % 4 === 0 && row < DISPLAY.ROWS - 2) {
                const support = this.scene.add
                  .image(worldX, worldY + tileSize, TEXTURE_KEYS.TILE_BG_SUPPORT)
                  .setOrigin(0, 0)
                  .setAlpha(0.45)
                  .setDepth(5.5);
                this.tileSprites.push(support);
              }
            }
          }

          const textureKey = this.resolveTextureKey(
            kind,
            level.theme,
            hasSolidAbove,
            hash
          );

          const sprite = this.scene.add
            .image(worldX, worldY, textureKey)
            .setOrigin(0, 0)
            .setDepth(this.resolveDepth(kind));

          this.tileSprites.push(sprite);

          const charAbove = aboveRowStr?.[col] ?? '.';
          if (
            kind === 'solid' &&
            !hasSolidAbove &&
            charAbove === '.' &&
            col > 1 &&
            col < DISPLAY.COLS - 2 &&
            hash < 28
          ) {
            const propKey = this.resolveSurfaceProp(level.theme, hash);
            const propSprite = this.scene.add
              .image(worldX, worldY - tileSize + 1, propKey)
              .setOrigin(0, 0)
              .setDepth(7.5);
            this.tileSprites.push(propSprite);
            animatedProps.push(propSprite);
          }

          const rect: WorldTileRect = {
            x: worldX,
            y: worldY,
            width: tileSize,
            height: kind === 'platform' ? 6 : tileSize,
            kind,
            screenIndex: sIdx,
            row,
            col,
            sprite,
            shadowSprite,
            crumbling: false,
            crumbleTimerMs: 0,
            broken: false,
            respawnTimerMs: 0
          };

          switch (kind) {
            case 'solid':
            case 'ice':
            case 'bouncy':
            case 'platform':
              solids.push(rect);
              break;
            case 'crumble':
              solids.push(rect);
              crumbleTiles.push(rect);
              break;
            case 'hazard':
              hazards.push(rect);
              break;
            case 'wind-left':
            case 'wind-right':
              sprite.setAlpha(0.75);
              windZones.push(rect);
              windSprites.push(sprite);
              break;
            case 'spawn':
              spawnPosition = {
                x: worldX + (tileSize - playerWidth) * 0.5,
                y: worldY + tileSize - playerHeight,
                screenIndex: sIdx
              };
              break;
            case 'goal':
              goals.push(rect);
              break;
            case 'easter-egg':
              easterEggs.push(rect);
              eggSprites.push(sprite);
              break;
          }
        }
      }
    }

    if (windSprites.length > 0) {
      this.windTween = this.scene.tweens.add({
        targets: windSprites,
        alpha: { from: 0.35, to: 0.85 },
        duration: 520,
        yoyo: true,
        repeat: -1
      });
    }

    if (animatedProps.length > 0) {
      const isConcert =
        level.theme.startsWith('wk-') ||
        level.theme.startsWith('mb-') ||
        level.theme.startsWith('sw-') ||
        level.theme.startsWith('ed-') ||
        level.theme.startsWith('rk-');
      this.propTween = this.scene.tweens.add({
        targets: animatedProps,
        alpha: { from: isConcert ? 0.88 : 0.86, to: 1 },
        scaleY: isConcert ? { from: 0.96, to: 1.07 } : 1,
        duration: isConcert ? 420 : 950,
        yoyo: true,
        repeat: -1
      });
    }

    if (eggSprites.length > 0) {
      this.eggTween = this.scene.tweens.add({
        targets: eggSprites,
        alpha: { from: 0.78, to: 1 },
        scaleX: { from: 0.95, to: 1.08 },
        scaleY: { from: 0.95, to: 1.08 },
        duration: 620,
        yoyo: true,
        repeat: -1
      });
    }

    return {
      levelData: level,
      totalScreens,
      totalHeightPx,
      spawnPosition,
      solids,
      crumbleTiles,
      hazards,
      windZones,
      checkpoints,
      goals,
      easterEggs
    };
  }

  /**
   * Cập nhật hiệu ứng rung lắc, nứt vỡ và tự tái tạo của các khối đá sụp đổ ('crumble').
   */
  public updateDynamicTiles(
    crumbleTiles: readonly WorldTileRect[],
    dtMs: number,
    theme: WorldTheme,
    onBreak?: (tile: WorldTileRect) => void
  ): void {
    for (let i = 0; i < crumbleTiles.length; i++) {
      const tile = crumbleTiles[i];
      if (!tile) continue;

      if (tile.broken) {
        tile.respawnTimerMs = (tile.respawnTimerMs ?? 0) - dtMs;
        if ((tile.respawnTimerMs ?? 0) <= 0) {
          tile.broken = false;
          tile.crumbling = false;
          tile.crumbleTimerMs = 0;
          if (tile.sprite) {
            tile.sprite.setTexture(ProceduralTextures.getCrumbleKey(theme));
            tile.sprite.setPosition(tile.x, tile.y);
            tile.sprite.setVisible(true);
            tile.sprite.setAlpha(1);
          }
          tile.shadowSprite?.setVisible(true);
        }
      } else if (tile.crumbling) {
        tile.crumbleTimerMs = (tile.crumbleTimerMs ?? 0) + dtMs;
        const progress = (tile.crumbleTimerMs ?? 0) / PLAYER_CONSTANTS.CRUMBLE_DELAY_MS;
        if (tile.sprite) {
          if (progress >= 0.45) {
            tile.sprite.setTexture(ProceduralTextures.getCrumbleCrackedKey(theme));
          }
          const jitter = Math.sin((tile.crumbleTimerMs ?? 0) * 0.08) * (progress > 0.5 ? 1.5 : 0.8);
          tile.sprite.setPosition(Math.round(tile.x + jitter), tile.y);
        }
        if ((tile.crumbleTimerMs ?? 0) >= PLAYER_CONSTANTS.CRUMBLE_DELAY_MS) {
          tile.broken = true;
          tile.crumbling = false;
          tile.respawnTimerMs = PLAYER_CONSTANTS.CRUMBLE_RESPAWN_MS;
          if (tile.sprite) {
            tile.sprite.setPosition(tile.x, tile.y);
            tile.sprite.setVisible(false);
          }
          tile.shadowSprite?.setVisible(false);
          onBreak?.(tile);
        }
      }
    }
  }

  public activateCheckpoint(target: WorldTileRect, allCheckpoints: readonly WorldTileRect[]): boolean {
    if (target.activated) return false;
    for (const cp of allCheckpoints) {
      cp.activated = false;
      cp.sprite?.setTexture(TEXTURE_KEYS.TILE_CHECKPOINT_INACTIVE);
    }
    target.activated = true;
    target.sprite?.setTexture(TEXTURE_KEYS.TILE_CHECKPOINT_ACTIVE);
    return true;
  }

  private resolveSurfaceProp(theme: WorldTheme, hash: number): string {
    if (theme.startsWith('wk-')) {
      if (hash % 3 === 0) return TEXTURE_KEYS.PROP_MIC_STAND;
      if (hash % 4 === 0) return TEXTURE_KEYS.PROP_LASER_BEAM;
      return TEXTURE_KEYS.PROP_STAGE_SPEAKER;
    }
    if (theme.startsWith('mb-')) {
      if (hash % 3 === 0) return TEXTURE_KEYS.PROP_MELLO_HELMET;
      if (hash % 4 === 0) return TEXTURE_KEYS.PROP_LASER_BEAM;
      return TEXTURE_KEYS.PROP_STAGE_SPEAKER;
    }
    if (theme.startsWith('sw-') || theme.startsWith('ed-')) {
      if (hash % 3 === 0) return TEXTURE_KEYS.PROP_LASER_BEAM;
      if (hash % 4 === 0) return TEXTURE_KEYS.PROP_MELLO_HELMET;
      return TEXTURE_KEYS.PROP_STAGE_SPEAKER;
    }
    if (theme.startsWith('rk-')) {
      if (hash % 3 === 0) return TEXTURE_KEYS.PROP_MIC_STAND;
      if (hash % 4 === 0) return TEXTURE_KEYS.PROP_STAGE_SPEAKER;
      return TEXTURE_KEYS.PROP_LASER_BEAM;
    }
    if (theme.startsWith('zd-') || theme.startsWith('or-')) {
      if (hash % 3 === 0) return TEXTURE_KEYS.PROP_SPIRIT_FLOWER;
      if (hash % 4 === 0) return TEXTURE_KEYS.PROP_RUIN_PILLAR;
      return TEXTURE_KEYS.PROP_TREE_OAK;
    }
    if (theme.startsWith('tb-') || theme.startsWith('sp-')) {
      if (hash % 3 === 0) return TEXTURE_KEYS.PROP_SAND_URN;
      if (hash % 4 === 0) return TEXTURE_KEYS.PROP_RUIN_PILLAR;
      return TEXTURE_KEYS.PROP_TORCH;
    }
    if (theme.startsWith('mt-')) {
      if (hash % 3 === 0) return TEXTURE_KEYS.PROP_CRYSTAL_CLUSTER;
      return TEXTURE_KEYS.PROP_TECH_LIGHT;
    }
    if (theme.startsWith('sb-')) {
      if (hash % 3 === 0) return TEXTURE_KEYS.PROP_SHROOM_GLOW;
      return TEXTURE_KEYS.PROP_CORAL_FAN;
    }

    switch (theme) {
      case 'forest':
      case 'mc-overworld':
      case 'tr-purity':
      case 'sm-plains':
      case 'sn-greenhill':
      case 'er-limgrave':
        if (hash % 5 === 0) return TEXTURE_KEYS.PROP_CHEST_GOLD;
        if (hash % 3 === 0) return TEXTURE_KEYS.PROP_LANTERN;
        return TEXTURE_KEYS.PROP_TREE_OAK;
      case 'mc-lush':
      case 'hk-greenpath':
      case 'tr-jungle':
        if (hash % 3 === 0) return TEXTURE_KEYS.PROP_SHROOM_GLOW;
        if (hash % 4 === 0) return TEXTURE_KEYS.PROP_LANTERN;
        return TEXTURE_KEYS.PROP_TREE_OAK;
      case 'mc-cherry':
      case 'tr-hallow':
      case 'sm-sky':
      case 'cl-ridge':
        if (hash % 3 === 0) return TEXTURE_KEYS.PROP_CRYSTAL_CLUSTER;
        return TEXTURE_KEYS.PROP_TREE_CHERRY;
      case 'ice':
      case 'mc-frozen':
      case 'cl-city':
      case 'cl-summit':
      case 'sn-icecap':
      case 'hk-crystal':
        if (hash % 4 === 0) return TEXTURE_KEYS.PROP_LANTERN;
        return TEXTURE_KEYS.PROP_CRYSTAL_CLUSTER;
      case 'mc-deepdark':
      case 'hk-crossroads':
      case 'hk-tears':
      case 'er-nokron':
      case 'er-liurnia':
        if (hash % 3 === 0) return TEXTURE_KEYS.PROP_SOUL_BRAZIER;
        return TEXTURE_KEYS.PROP_SHROOM_GLOW;
      case 'mc-ocean':
        if (hash % 4 === 0) return TEXTURE_KEYS.PROP_CHEST_GOLD;
        return TEXTURE_KEYS.PROP_CORAL_FAN;
      case 'mc-redstone':
      case 'cl-resort':
      case 'sm-underground':
      case 'sn-chemical':
      case 'sn-casino':
        if (hash % 3 === 0) return TEXTURE_KEYS.PROP_CHEST_GOLD;
        return TEXTURE_KEYS.PROP_TECH_LIGHT;
      case 'mc-nether':
      case 'er-caelid':
      case 'sm-castle':
      case 'tr-corruption':
        if (hash % 3 === 0) return TEXTURE_KEYS.PROP_TORCH;
        return TEXTURE_KEYS.PROP_LANTERN;
      case 'mc-soul':
        return TEXTURE_KEYS.PROP_SOUL_BRAZIER;
      case 'mc-bastion':
      case 'hk-palace':
      case 'sn-sanctuary':
      case 'er-azula':
        if (hash % 2 === 0) return TEXTURE_KEYS.PROP_RUIN_PILLAR;
        return TEXTURE_KEYS.PROP_LANTERN;
      case 'wind':
      case 'mc-end':
      case 'mc-endcity':
      case 'tr-nebula':
      case 'cl-dream':
      case 'sm-galaxy':
      default:
        if (hash % 3 === 0) return TEXTURE_KEYS.PROP_CRYSTAL_CLUSTER;
        return TEXTURE_KEYS.PROP_END_ROD;
    }
  }

  private resolveHangingProp(theme: WorldTheme, hash: number): string {
    if (
      theme === 'forest' ||
      theme === 'mc-overworld' ||
      theme === 'mc-lush' ||
      theme === 'mc-cherry' ||
      theme === 'tr-purity' ||
      theme === 'tr-jungle' ||
      theme === 'hk-greenpath' ||
      theme === 'sm-plains' ||
      theme === 'sn-greenhill' ||
      theme.startsWith('zd-') ||
      theme.startsWith('or-') ||
      theme === 'tb-jungle' ||
      theme === 'sp-jungle'
    ) {
      return hash % 2 === 0 ? TEXTURE_KEYS.PROP_VINE_GLOW : TEXTURE_KEYS.PROP_STALACTITE;
    }
    return TEXTURE_KEYS.PROP_STALACTITE;
  }

  private resolveTextureKey(
    kind: TileKind,
    theme: WorldTheme,
    hasSolidAbove: boolean,
    hash: number
  ): string {
    switch (kind) {
      case 'solid':
        if (!hasSolidAbove) {
          return ProceduralTextures.getSolidSurfaceKey(theme);
        }
        if (hash < 30) {
          return ProceduralTextures.getSolidOreKey(theme);
        }
        return ProceduralTextures.getSolidDeepKey(theme);
      case 'ice':
        return TEXTURE_KEYS.TILE_ICE;
      case 'bouncy':
        return TEXTURE_KEYS.TILE_BOUNCY;
      case 'platform':
        return ProceduralTextures.getPlatformKey(theme);
      case 'crumble':
        return ProceduralTextures.getCrumbleKey(theme);
      case 'hazard':
        return ProceduralTextures.getHazardKey(theme);
      case 'wind-left':
        return TEXTURE_KEYS.TILE_WIND_LEFT;
      case 'wind-right':
        return TEXTURE_KEYS.TILE_WIND_RIGHT;
      case 'checkpoint':
        return TEXTURE_KEYS.TILE_CHECKPOINT_INACTIVE;
      case 'spawn':
        return TEXTURE_KEYS.TILE_SPAWN;
      case 'goal':
        return TEXTURE_KEYS.TILE_GOAL;
      case 'easter-egg':
        return TEXTURE_KEYS.TILE_EASTER_EGG;
      default:
        return ProceduralTextures.getSolidSurfaceKey(theme);
    }
  }

  private resolveDepth(kind: TileKind): number {
    if (kind === 'wind-left' || kind === 'wind-right') return 5;
    if (kind === 'spawn' || kind === 'checkpoint' || kind === 'goal' || kind === 'easter-egg')
      return 8.5;
    return 10;
  }
}
