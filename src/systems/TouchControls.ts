export interface TouchInputState {
  left: boolean;
  right: boolean;
  jump: boolean;
}

/**
 * Quản lý nút cảm ứng ảo trên điện thoại / máy tính bảng:
 * - Tự động ẩn trên máy tính có bàn phím.
 * - Tự động hiện khi phát hiện thiết bị cảm ứng (` coarse pointer` hoặc sự kiện `touchstart`).
 * - Hỗ trợ giữ đa điểm (vừa giữ nút Nhảy để nạp lực, vừa giữ Trái/Phải để chọn hướng nhảy).
 */
export class TouchControls {
  public readonly state: TouchInputState = {
    left: false,
    right: false,
    jump: false
  };

  private containerEl: HTMLElement | null = null;
  private leftBtn: HTMLElement | null = null;
  private rightBtn: HTMLElement | null = null;
  private jumpBtn: HTMLElement | null = null;
  private isTouchDevice = false;
  private forcedByDisplayMode = false;
  private enabledInScene = false;

  constructor() {
    this.containerEl = document.getElementById('touch-controls');
    this.leftBtn = document.getElementById('btn-touch-left');
    this.rightBtn = document.getElementById('btn-touch-right');
    this.jumpBtn = document.getElementById('btn-touch-jump');

    this.detectTouchCapability();
    this.bindButtonEvents();
  }

  public setSceneActive(active: boolean): void {
    this.enabledInScene = active;
    if (!active) {
      this.resetState();
    }
    this.refreshVisibility();
  }

  public setForcedByDisplayMode(forced: boolean): void {
    this.forcedByDisplayMode = forced;
    this.refreshVisibility();
  }

  public resetState(): void {
    this.state.left = false;
    this.state.right = false;
    this.state.jump = false;
    this.leftBtn?.classList.remove('active');
    this.rightBtn?.classList.remove('active');
    this.jumpBtn?.classList.remove('active');
  }

  private detectTouchCapability(): void {
    const coarse = window.matchMedia?.('(pointer: coarse)').matches ?? false;
    if (coarse) {
      this.isTouchDevice = true;
      this.refreshVisibility();
    }

    window.addEventListener(
      'touchstart',
      () => {
        if (!this.isTouchDevice) {
          this.isTouchDevice = true;
          this.refreshVisibility();
        }
      },
      { passive: true }
    );

    window.addEventListener('keydown', () => {
      // Tự ẩn khi người chơi sử dụng bàn phím vật lý
      if (this.isTouchDevice) {
        this.isTouchDevice = false;
        this.resetState();
        this.refreshVisibility();
      }
    });
  }

  private refreshVisibility(): void {
    if (!this.containerEl) return;
    if (this.enabledInScene && (this.isTouchDevice || this.forcedByDisplayMode)) {
      this.containerEl.classList.add('visible');
    } else {
      this.containerEl.classList.remove('visible');
    }
  }

  private bindButtonEvents(): void {
    this.bindHoldButton(this.leftBtn, (down) => {
      this.state.left = down;
    });
    this.bindHoldButton(this.rightBtn, (down) => {
      this.state.right = down;
    });
    this.bindHoldButton(this.jumpBtn, (down) => {
      this.state.jump = down;
    });
  }

  private bindHoldButton(btn: HTMLElement | null, onChange: (down: boolean) => void): void {
    if (!btn) return;

    const setDown = (down: boolean, ev: Event) => {
      ev.preventDefault();
      onChange(down);
      if (down) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    };

    btn.addEventListener('pointerdown', (e) => setDown(true, e));
    btn.addEventListener('pointerup', (e) => setDown(false, e));
    btn.addEventListener('pointercancel', (e) => setDown(false, e));
    btn.addEventListener('pointerleave', (e) => setDown(false, e));
  }
}

export const globalTouchControls = new TouchControls();
