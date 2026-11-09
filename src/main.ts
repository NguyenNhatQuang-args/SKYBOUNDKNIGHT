import Phaser from 'phaser';
import { createPhaserConfig } from './config';
import { BootScene } from './scenes/BootScene';
import { GameScene } from './scenes/GameScene';
import { MenuScene } from './scenes/MenuScene';
import { PauseScene } from './scenes/PauseScene';
import { PreloadScene } from './scenes/PreloadScene';
import { WinScene } from './scenes/WinScene';
import { globalDisplayManager } from './systems/DisplayManager';

// Khóa cuộn trang bằng phím Space / Mũi tên trên trình duyệt
window.addEventListener(
  'keydown',
  (event) => {
    if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.code)) {
      event.preventDefault();
    }
  },
  { passive: false }
);

// Chống zoom hai ngón tay / double-tap trên thiết bị di động
window.addEventListener(
  'touchmove',
  (event) => {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  },
  { passive: false }
);

const config = createPhaserConfig([
  BootScene,
  PreloadScene,
  MenuScene,
  GameScene,
  PauseScene,
  WinScene
]);

new Phaser.Game(config);
globalDisplayManager.init();
