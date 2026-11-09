import Phaser from 'phaser';
import { CAMERA_CONSTANTS, DISPLAY } from '../constants';
import { LevelRenderer } from './LevelRenderer';

export class CameraSnap {
  private readonly scene: Phaser.Scene;
  private readonly camera: Phaser.Cameras.Scene2D.Camera;
  private totalScreens = 1;
  private currentScreenIndex = 0;
  private snapTween: Phaser.Tweens.Tween | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.camera = scene.cameras.main;
  }

  public init(totalScreens: number, startScreenIndex: number): void {
    this.totalScreens = Math.max(1, totalScreens);
    this.currentScreenIndex = Phaser.Math.Clamp(startScreenIndex, 0, this.totalScreens - 1);
    if (this.snapTween) {
      this.snapTween.stop();
      this.snapTween = null;
    }
    const targetY = LevelRenderer.getScreenTopY(this.currentScreenIndex, this.totalScreens);
    this.camera.setScroll(0, targetY);
  }

  public get screenIndex(): number {
    return this.currentScreenIndex;
  }

  /**
   * Kiểm tra vị trí dọc của nhân vật (`playerCenterY`).
   * Khi nhân vật vượt mép trên hoặc rơi qua mép dưới của màn hình hiện tại,
   * camera sẽ snap sang màn hình kế tiếp với hiệu ứng chuyển ngắn (~150ms).
   */
  public update(playerCenterY: number, onScreenChange?: (oldScreen: number, newScreen: number) => void): void {
    const newScreenIndex = LevelRenderer.getScreenIndexFromY(playerCenterY, this.totalScreens);
    if (newScreenIndex !== this.currentScreenIndex) {
      const oldScreen = this.currentScreenIndex;
      this.currentScreenIndex = newScreenIndex;
      const targetScrollY = LevelRenderer.getScreenTopY(newScreenIndex, this.totalScreens);

      if (this.snapTween) {
        this.snapTween.stop();
      }

      this.snapTween = this.scene.tweens.add({
        targets: this.camera,
        scrollY: targetScrollY,
        duration: CAMERA_CONSTANTS.SNAP_DURATION_MS,
        ease: 'Cubic.easeOut',
        onUpdate: () => {
          this.camera.scrollY = Math.round(this.camera.scrollY);
        },
        onComplete: () => {
          this.camera.scrollY = targetScrollY;
          this.snapTween = null;
        }
      });

      onScreenChange?.(oldScreen, newScreenIndex);
    }
  }

  public get bottomLimitY(): number {
    return this.totalScreens * DISPLAY.HEIGHT;
  }
}
