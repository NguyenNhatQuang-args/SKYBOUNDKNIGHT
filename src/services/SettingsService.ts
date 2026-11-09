import { APP_CONFIG } from '../config';

export type ControlScheme = 'both' | 'wasd' | 'arrows';

export type GameLanguage = 'en-US' | 'en-GB' | 'vi' | 'zh' | 'ko' | 'de' | 'fr' | 'ru';

export const GAME_LANGUAGE_ORDER: GameLanguage[] = [
  'en-US',
  'en-GB',
  'vi',
  'zh',
  'ko',
  'de',
  'fr',
  'ru'
];

export type DisplayAspectMode =
  | 'auto-fit'
  | 'pixel-perfect'
  | 'desktop-16-9'
  | 'mobile-portrait'
  | 'mobile-landscape'
  | 'full-stretch';

export const DISPLAY_MODE_LABELS: Record<DisplayAspectMode, string> = {
  'auto-fit': 'Auto 4:3 Standard (No Distortion)',
  'pixel-perfect': 'Pixel-Perfect 1x/2x/3x (Ultra Crisp)',
  'desktop-16-9': 'Desktop Widescreen (16:9 Bezel)',
  'mobile-portrait': 'Mobile Portrait (9:16 + Touch Pad)',
  'mobile-landscape': 'Mobile Landscape (16:9 + Touch Pad)',
  'full-stretch': 'Edge-to-Edge Balanced (No Horizontal Stretch)'
};

export const DISPLAY_MODE_SHORT_LABELS: Record<DisplayAspectMode, string> = {
  'auto-fit': '4:3 Auto',
  'pixel-perfect': 'Pixel 1x/2x',
  'desktop-16-9': 'Desktop 16:9',
  'mobile-portrait': 'Mobile 9:16',
  'mobile-landscape': 'Mobile Wide',
  'full-stretch': 'Edge-to-Edge'
};

export interface GameSettings {
  language: GameLanguage;
  soundEnabled: boolean;
  musicEnabled: boolean;
  masterVolume: number; // 0.0 -> 1.0
  effectsEnabled: boolean;
  screenShakeEnabled: boolean;
  controlScheme: ControlScheme;
  displayMode: DisplayAspectMode;
}

const DEFAULT_SETTINGS: GameSettings = {
  language: 'en-US',
  soundEnabled: true,
  musicEnabled: true,
  masterVolume: 0.7,
  effectsEnabled: true,
  screenShakeEnabled: true,
  controlScheme: 'both',
  displayMode: 'auto-fit'
};

export class SettingsService {
  private current: GameSettings;

  constructor() {
    this.current = this.load();
  }

  public get(): Readonly<GameSettings> {
    return this.current;
  }

  public update(partial: Partial<GameSettings>): GameSettings {
    this.current = {
      ...this.current,
      ...partial
    };
    this.save();
    return this.current;
  }

  public toggleSound(): boolean {
    this.current.soundEnabled = !this.current.soundEnabled;
    this.save();
    return this.current.soundEnabled;
  }

  public toggleMusic(): boolean {
    this.current.musicEnabled = !this.current.musicEnabled;
    this.save();
    return this.current.musicEnabled;
  }

  public toggleEffects(): boolean {
    this.current.effectsEnabled = !this.current.effectsEnabled;
    this.current.screenShakeEnabled = this.current.effectsEnabled;
    this.save();
    return this.current.effectsEnabled;
  }

  public cycleVolume(): number {
    const steps = [0.25, 0.5, 0.75, 1.0];
    const currentIdx = steps.findIndex((v) => Math.abs(v - this.current.masterVolume) < 0.1);
    const nextVal = steps[(currentIdx + 1) % steps.length] ?? 0.75;
    this.current.masterVolume = nextVal;
    this.save();
    return nextVal;
  }

  public cycleControlScheme(): ControlScheme {
    const order: ControlScheme[] = ['both', 'wasd', 'arrows'];
    const idx = order.indexOf(this.current.controlScheme);
    const next = order[(idx + 1) % order.length] ?? 'both';
    this.current.controlScheme = next;
    this.save();
    return next;
  }

  public cycleDisplayMode(): DisplayAspectMode {
    const order: DisplayAspectMode[] = [
      'auto-fit',
      'pixel-perfect',
      'desktop-16-9',
      'mobile-portrait',
      'mobile-landscape',
      'full-stretch'
    ];
    const idx = order.indexOf(this.current.displayMode);
    const next = order[(idx + 1) % order.length] ?? 'auto-fit';
    this.current.displayMode = next;
    this.save();
    window.dispatchEvent(new CustomEvent('skybound-display-mode-change', { detail: next }));
    return next;
  }

  public setDisplayMode(mode: DisplayAspectMode): DisplayAspectMode {
    this.current.displayMode = mode;
    this.save();
    window.dispatchEvent(new CustomEvent('skybound-display-mode-change', { detail: mode }));
    return mode;
  }

  public setLanguage(lang: GameLanguage): GameLanguage {
    this.current.language = lang;
    this.save();
    window.dispatchEvent(new CustomEvent('skybound-language-change', { detail: lang }));
    return lang;
  }

  public cycleLanguage(): GameLanguage {
    const idx = GAME_LANGUAGE_ORDER.indexOf(this.current.language);
    const next = GAME_LANGUAGE_ORDER[(idx + 1) % GAME_LANGUAGE_ORDER.length] ?? 'en-US';
    this.current.language = next;
    this.save();
    window.dispatchEvent(new CustomEvent('skybound-language-change', { detail: next }));
    return next;
  }

  private load(): GameSettings {
    try {
      const raw = window.localStorage.getItem(APP_CONFIG.storageKeys.settings);
      if (!raw) return { ...DEFAULT_SETTINGS };
      const parsed = JSON.parse(raw) as Partial<GameSettings>;
      const validLang =
        parsed.language && GAME_LANGUAGE_ORDER.includes(parsed.language)
          ? parsed.language
          : DEFAULT_SETTINGS.language;
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        language: validLang
      };
    } catch {
      return { ...DEFAULT_SETTINGS };
    }
  }

  private save(): void {
    try {
      window.localStorage.setItem(APP_CONFIG.storageKeys.settings, JSON.stringify(this.current));
    } catch (err) {
      console.warn('[SettingsService] Không thể lưu cài đặt:', err);
    }
  }
}

export const globalSettings = new SettingsService();
