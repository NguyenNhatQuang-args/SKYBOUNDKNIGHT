import Phaser from 'phaser';
import { DISPLAY } from '../constants';
import { ProceduralTextures } from '../systems/ProceduralTextures';

export class PreloadScene extends Phaser.Scene {
  private progressBox!: Phaser.GameObjects.Graphics;
  private progressBar!: Phaser.GameObjects.Graphics;
  private steps: Array<() => void> = [];
  private currentStep = 0;

  constructor() {
    super({ key: 'PreloadScene' });
  }

  public create(): void {
    this.cameras.main.setBackgroundColor('#0d0f18');

    const cx = DISPLAY.WIDTH * 0.5;
    const cy = DISPLAY.HEIGHT * 0.5;

    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x1e293b, 0.9);
    this.progressBox.fillRect(cx - 110, cy - 10, 220, 20);
    this.progressBox.lineStyle(2, 0x4cc9f0, 1);
    this.progressBox.strokeRect(cx - 110, cy - 10, 220, 20);

    this.progressBar = this.add.graphics();

    // Chỉ nạp tài nguyên chung ở bước khởi động; texture của từng thế giới sẽ nạp khi người chơi chọn (Lazy Load)
    this.steps = ProceduralTextures.generateSharedSteps(this);
    this.currentStep = 0;
  }

  public override update(): void {
    if (this.currentStep < this.steps.length) {
      const fn = this.steps[this.currentStep];
      fn?.();
      this.currentStep++;

      const ratio = this.currentStep / this.steps.length;
      const cx = DISPLAY.WIDTH * 0.5;
      const cy = DISPLAY.HEIGHT * 0.5;

      this.progressBar.clear();
      this.progressBar.fillStyle(0x5ce1e6, 1);
      this.progressBar.fillRect(cx - 106, cy - 6, Math.round(212 * ratio), 12);
    } else {
      this.scene.start('MenuScene');
    }
  }
}
