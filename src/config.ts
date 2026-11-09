import Phaser from 'phaser';
import { DISPLAY } from './constants';

export const APP_CONFIG = {
  gameTitle: 'Skybound Knight',
  version: '1.0.0-multiverse',
  levelsBasePath: '/levels',
  defaultLevelId: 'forest-01',
  storageKeys: {
    progress: 'skybound_knight_progress_v1',
    bestRuns: 'skybound_knight_best_runs_v1',
    leaderboard: 'skybound_knight_leaderboard_v1',
    settings: 'skybound_knight_settings_v1',
    easterEggs: 'skybound_knight_easter_eggs_v1',
    playerName: 'skybound_knight_player_name_v1',
    runSeed: 'skybound_knight_run_seed_v1'
  }
} as const;

export function createPhaserConfig(scenes: Phaser.Types.Scenes.SceneType[]): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: DISPLAY.WIDTH,
    height: DISPLAY.HEIGHT,
    backgroundColor: DISPLAY.BACKGROUND_COLOR,
    pixelArt: true,
    roundPixels: true,
    antialias: false,
    scale: {
      mode: Phaser.Scale.NONE,
      autoCenter: Phaser.Scale.NO_CENTER
    },
    fps: {
      target: 60,
      forceSetTimeOut: false
    },
    scene: scenes
  };
}
