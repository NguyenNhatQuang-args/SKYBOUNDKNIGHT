import { DISPLAY } from '../constants';
import {
  DISPLAY_MODE_LABELS,
  DISPLAY_MODE_SHORT_LABELS,
  DisplayAspectMode,
  globalSettings
} from '../services/SettingsService';
import { globalTouchControls } from './TouchControls';

/**
 * Quản lý tỉ lệ khung hình (Aspect Ratio) và độ phân giải hiển thị Pixel-Perfect
 * cho cả Desktop và Điện thoại (Dọc / Ngang):
 * - Đảm bảo khung hình game gốc 512x384 (4:3) KHÔNG bị phình to, méo hình hoặc nhòe/mờ.
 * - Hỗ trợ 6 chế độ tỉ lệ khung hình do người chơi tùy chỉnh trực tiếp.
 * - Tự động căn chỉnh kích thước theo bội số nguyên / chẵn để giữ nét Pixel Art tuyệt đối.
 */
export class DisplayManager {
  private shellEl: HTMLElement | null = null;
  private containerEl: HTMLElement | null = null;
  private bezelInfoEl: HTMLElement | null = null;

  constructor() {
    this.shellEl = document.getElementById('viewport-shell');
    this.containerEl = document.getElementById('game-container');
    this.bezelInfoEl = document.getElementById('viewport-bezel-info');

    window.addEventListener('resize', () => this.applyCurrentMode());
    window.addEventListener('orientationchange', () => {
      window.setTimeout(() => this.applyCurrentMode(), 80);
    });
    window.addEventListener('skybound-display-mode-change', () => {
      this.applyCurrentMode();
    });
  }

  public init(): void {
    this.applyCurrentMode();
    // Chờ Phaser khởi tạo thẻ <canvas> rồi căn chỉnh lần nữa
    window.requestAnimationFrame(() => this.applyCurrentMode());
  }

  public getModeLabel(mode: DisplayAspectMode = globalSettings.get().displayMode): string {
    return DISPLAY_MODE_LABELS[mode] ?? DISPLAY_MODE_LABELS['auto-fit'];
  }

  public getShortModeLabel(mode: DisplayAspectMode = globalSettings.get().displayMode): string {
    return DISPLAY_MODE_SHORT_LABELS[mode] ?? DISPLAY_MODE_SHORT_LABELS['auto-fit'];
  }

  public applyCurrentMode(): void {
    const mode = globalSettings.get().displayMode;
    const winW = Math.max(280, window.innerWidth);
    const winH = Math.max(240, window.innerHeight);
    const isPortraitWindow = winH > winW * 1.06;

    const shell = this.shellEl ?? document.getElementById('viewport-shell');
    const container = this.containerEl ?? document.getElementById('game-container');
    const canvas = container?.querySelector('canvas') as HTMLCanvasElement | null;

    if (!shell || !container) return;

    // Xóa các class layout cũ trên body
    document.body.classList.remove(
      'layout-auto-fit',
      'layout-pixel-perfect',
      'layout-desktop-16-9',
      'layout-mobile-portrait',
      'layout-mobile-landscape',
      'layout-full-stretch',
      'is-portrait-screen'
    );
    document.body.classList.add(`layout-${mode}`);
    if (isPortraitWindow || mode === 'mobile-portrait') {
      document.body.classList.add('is-portrait-screen');
    }

    // Đồng bộ chế độ hiển thị nút cảm ứng ảo khi chọn khung Điện Thoại
    if (mode === 'mobile-portrait' || mode === 'mobile-landscape') {
      globalTouchControls.setForcedByDisplayMode(true);
    } else {
      globalTouchControls.setForcedByDisplayMode(false);
    }

    let shellW: number = winW;
    let shellH: number = winH;
    let canvasW: number = DISPLAY.WIDTH;
    let canvasH: number = DISPLAY.HEIGHT;
    let scaleTag = '1.0x';

    if (mode === 'full-stretch') {
      // Tràn Viền Cân Bằng: Mở rộng sát mép màn hình (0px viền/lề) nhưng GIỮ NGUYÊN tỉ lệ 4:3 chuẩn
      // để tuyệt đối không bị phình ngang hay biến dạng hình ảnh nhân vật/khối đá!
      shellW = winW;
      shellH = winH;
      const reserveBottom = isPortraitWindow ? 104 : 0;
      const availW = winW;
      const availH = Math.max(180, winH - reserveBottom);
      const fitW = Math.floor(Math.min(availW, (availH * 4) / 3) / 2) * 2;
      canvasW = fitW;
      canvasH = Math.round((canvasW * 3) / 4);
      const ratioMult = (canvasW / DISPLAY.WIDTH).toFixed(2);
      scaleTag = `Tràn Viền Cân Bằng (${ratioMult}x • ${canvasW}×${canvasH})`;
    } else if (mode === 'pixel-perfect') {
      // Bội số nguyên (1x = 512x384, 2x = 1024x768, 3x = 1536x1152...)
      const intScale = Math.floor(Math.min(winW / DISPLAY.WIDTH, winH / DISPLAY.HEIGHT));
      if (intScale >= 1) {
        canvasW = DISPLAY.WIDTH * intScale;
        canvasH = DISPLAY.HEIGHT * intScale;
        scaleTag = `${intScale}x Pixel Nguyên Bản (${canvasW}×${canvasH})`;
      } else {
        // Màn hình nhỏ hơn 512x384: chia theo nấc 4:3 chẵn để không bị lệch pixel
        const fitW = Math.floor(Math.min(winW, (winH * 4) / 3) / 4) * 4;
        canvasW = Math.max(240, fitW);
        canvasH = Math.round((canvasW * 3) / 4);
        scaleTag = `Chuẩn 4:3 (${canvasW}×${canvasH})`;
      }
      shellW = winW;
      shellH = winH;
    } else if (mode === 'desktop-16-9') {
      // Khung Widescreen 16:9 bên ngoài, bên trong là màn hình game 4:3 chuẩn không méo
      const maxShellW = winW - 16;
      const maxShellH = winH - 16;
      if (maxShellW / maxShellH > 16 / 9) {
        shellH = maxShellH;
        shellW = Math.round((shellH * 16) / 9);
      } else {
        shellW = maxShellW;
        shellH = Math.round((shellW * 9) / 16);
      }
      const availH = Math.max(216, shellH - 12);
      const availW = Math.max(288, shellW - 24);
      const fitW = Math.floor(Math.min(availW, (availH * 4) / 3) / 4) * 4;
      canvasW = fitW;
      canvasH = Math.round((canvasW * 3) / 4);
      scaleTag = `Khung 16:9 • Game 4:3 (${canvasW}×${canvasH})`;
    } else if (mode === 'mobile-portrait') {
      // Khung Điện Thoại Dọc 9:16: Phần trên là HUD, phần giữa là Game 4:3 sắc nét, phần dưới là Pad điều khiển
      const maxH = winH - 12;
      const maxW = winW - 12;
      if (maxW / maxH > 9 / 16) {
        shellH = maxH;
        shellW = Math.round((shellH * 9) / 16);
      } else {
        shellW = maxW;
        shellH = Math.round((shellW * 16) / 9);
      }
      const availW = Math.max(240, shellW - 12);
      const availH = Math.max(180, Math.floor(shellH * 0.62));
      const fitW = Math.floor(Math.min(availW, (availH * 4) / 3) / 4) * 4;
      canvasW = fitW;
      canvasH = Math.round((canvasW * 3) / 4);
      scaleTag = `Mobile Dọc 9:16 • Game 4:3 (${canvasW}×${canvasH})`;
    } else if (mode === 'mobile-landscape') {
      // Khung Điện Thoại Ngang 18:9: Hai bên là vùng nút bấm cảm ứng, ở giữa là màn hình 4:3 sắc nét
      const maxW = winW - 12;
      const maxH = winH - 12;
      if (maxW / maxH > 18 / 9) {
        shellH = maxH;
        shellW = Math.round(shellH * 2);
      } else {
        shellW = maxW;
        shellH = Math.round(shellW / 2);
      }
      // Chừa 2 bên cho nút cảm ứng để ngón tay không che màn hình game
      const availW = Math.max(256, shellW - 210);
      const availH = Math.max(192, shellH - 8);
      const fitW = Math.floor(Math.min(availW, (availH * 4) / 3) / 4) * 4;
      canvasW = fitW;
      canvasH = Math.round((canvasW * 3) / 4);
      scaleTag = `Mobile Ngang • Game 4:3 (${canvasW}×${canvasH})`;
    } else {
      // 'auto-fit' (Mặc định): Tự động nhận diện Desktop hoặc Điện thoại, giữ chuẩn 4:3 không méo/phình
      shellW = winW;
      shellH = winH;
      const reserveBottom = isPortraitWindow ? 112 : 0;
      const reserveTop = isPortraitWindow ? 52 : 0;
      const availW = Math.max(240, winW - (isPortraitWindow ? 8 : 16));
      const availH = Math.max(180, winH - reserveTop - reserveBottom - (isPortraitWindow ? 8 : 12));

      const fitW = Math.floor(Math.min(availW, (availH * 4) / 3) / 4) * 4;
      canvasW = fitW;
      canvasH = Math.round((canvasW * 3) / 4);
      const ratioMult = (canvasW / DISPLAY.WIDTH).toFixed(2);
      scaleTag = `Chuẩn 4:3 (${ratioMult}x • ${canvasW}×${canvasH})`;
    }

    shell.style.width = `${shellW}px`;
    shell.style.height = `${shellH}px`;

    container.style.width = `${canvasW}px`;
    container.style.height = `${canvasH}px`;

    if (canvas) {
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;
    }

    if (this.bezelInfoEl) {
      this.bezelInfoEl.textContent = scaleTag;
    }
  }
}

export const globalDisplayManager = new DisplayManager();
