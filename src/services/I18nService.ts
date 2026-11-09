import {
  CharacterSkinId,
  ShieldItemId,
  WeaponItemId
} from './CharacterLoadoutService';
import { DisplayAspectMode, globalSettings } from './SettingsService';

export type GameLanguage =
  | 'en-US'
  | 'en-GB'
  | 'vi'
  | 'zh'
  | 'ko'
  | 'de'
  | 'fr'
  | 'ru';

export const GAME_LANGUAGE_LIST: readonly GameLanguage[] = [
  'en-US',
  'en-GB',
  'vi',
  'zh',
  'ko',
  'de',
  'fr',
  'ru'
];

export const LANGUAGE_LABELS: Record<GameLanguage, string> = {
  'en-US': 'English (US)',
  'en-GB': 'English (UK)',
  vi: 'Tiếng Việt',
  zh: '中文 (简体)',
  ko: '한국어',
  de: 'Deutsch',
  fr: 'Français',
  ru: 'Русский'
};

export const LANGUAGE_SHORT_CODES: Record<GameLanguage, string> = {
  'en-US': 'EN-US',
  'en-GB': 'EN-UK',
  vi: 'VI',
  zh: '中文',
  ko: '한국어',
  de: 'DE',
  fr: 'FR',
  ru: 'RU'
};

export const LANGUAGE_SUBTITLES: Record<GameLanguage, string> = {
  'en-US': 'United States • Original Edition',
  'en-GB': 'United Kingdom • British English',
  vi: 'Việt Nam • Bản ngữ Tiếng Việt',
  zh: '中国 • 简体中文版',
  ko: '대한민국 • 한국어 번역판',
  de: 'Deutschland • Deutsche Ausgabe',
  fr: 'France • Édition Française',
  ru: 'Россия • Русское издание'
};

export interface UiStrings {
  // Common & HUD
  stageCounter: (cur: number, total: number) => string;
  floorCounter: (cur: number, total: number) => string;
  fallsCount: (count: number) => string;
  jumpsCount: (count: number) => string;
  soundShort: string;
  fxShort: string;
  onLabel: string;
  offLabel: string;
  activeLabel: string;
  mutedLabel: string;
  aspectRatioBtn: (shortMode: string) => string;
  menuEscBtn: string;
  touchLeft: string;
  touchRight: string;
  touchJump: string;

  // In-game status messages
  statusSound: (on: boolean) => string;
  statusFx: (on: boolean) => string;
  statusRatio: (label: string) => string;
  statusRestartBottom: string;
  statusHazardKnockback: string;
  statusRelicFound: (name: string) => string;
  statusWorldAscend: (stageStr: string, name: string) => string;
  statusWorldDescend: (stageStr: string, name: string) => string;

  // Display modes
  displayModes: Record<DisplayAspectMode, string>;
  displayModesShort: Record<DisplayAspectMode, string>;
  controlSchemes: {
    both: string;
    wasd: string;
    arrows: string;
  };

  // Main Menu
  crestMain: string;
  gameTitle: string;
  mainSubtitle: string;
  stat100StagesVal: (count: number) => string;
  stat100StagesLbl: string;
  statRelicsLbl: string;
  statSummitsLbl: string;
  equippedLabel: (skinName: string) => string;
  equippedSubLabel: (weaponName: string, shieldName: string) => string;
  changeLoadoutBtn: string;
  btnContinue: (worldName: string) => string;
  badgeFloor: (floor: number) => string;
  btnNewGame: (roman: string) => string;
  badgeStage01: string;
  btnArmory: string;
  badgeArmory: string;
  btnSelectWorld: string;
  btnSpeedrun: string;
  badgeRelicsCount: (found: number, total: number) => string;
  btnSettings: string;
  btnHowTo: string;
  btnBackMain: string;

  // Armory
  crestArmory: string;
  armoryTitle: string;
  armorySubtitle: string;
  subtabSkins: (count: number) => string;
  subtabWeapons: (count: number) => string;
  subtabShields: (count: number) => string;
  subtabAchievements: (count: number) => string;
  careerSummary: (jumps: number, falls: number, relics: number) => string;
  unlockAllOn: string;
  unlockAllOff: string;
  badgeEquippedSkin: string;
  badgeEquippedWeapon: string;
  badgeEquippedShield: string;
  badgeUnlocked: string;
  badgeLocked: string;
  badgeCompleted: string;

  // Worlds Tab
  crestWorlds: string;
  worldsTitle: (count: number) => string;
  worldsSubtitle: string;
  filterAll: (count: number) => string;
  relicTag: string;
  relicFoundOnly: string;
  unconquered: string;

  // Speedrun Tab
  crestSpeedrun: string;
  speedrunTitle: string;
  speedrunSubtitle: string;
  knightTitleLabel: string;
  saveTitleBtn: string;
  selectWorldLabel: string;
  mapRelicLabel: string;
  badgeCollected: string;
  badgeUndiscovered: string;
  thRank: string;
  thKnight: string;
  thTime: string;
  thFalls: string;
  rank1: string;
  rank2: string;
  rank3: string;
  btnPlaySpeedrun: string;
  badgeLaunch: string;

  // Settings Tab
  crestSettings: string;
  settingsTitle: string;
  settingsSubtitle: string;
  settingLanguage: string;
  settingDisplay: string;
  settingSound: string;
  settingMusic: string;
  settingVolume: string;
  settingFx: string;
  settingKeys: string;

  // How-To / Codex Tab
  crestHowTo: string;
  howToTitle: string;
  howToSubtitle: string;
  howToParagraphs: string[];

  // Pause Scene
  crestPause: string;
  pauseTitle: string;
  pauseSubtitle: string;
  btnPauseResume: string;
  btnPauseRestart: string;
  btnPauseLanguage: string;
  btnPauseRatio: string;
  btnPauseSound: string;
  btnPauseFx: string;
  btnPauseMenu: string;

  // Win Scene
  crestWin: string;
  winTitleRelic: string;
  winTitleSummit: string;
  winSubtitle: (worldName: string) => string;
  winRelicBannerTitle: string;
  winRelicBannerSub: (relicName: string, total: number) => string;
  winTimeLabel: string;
  winJumpsFallsLabel: string;
  winJumpsFallsVal: (jumps: number, falls: number) => string;
  winLeaderboardTitle: (worldName: string) => string;
  btnWinNext: string;
  btnWinReplay: string;
  btnWinMenu: string;
  defaultPlayerName: string;
}

const EN_US_STRINGS: UiStrings = {
  stageCounter: (cur, total) => `Stage ${cur}/${total}`,
  floorCounter: (cur, total) => `Floor ${cur}/${total}`,
  fallsCount: (count) => `Falls: ${count}`,
  jumpsCount: (count) => `${count} jumps`,
  soundShort: 'SFX',
  fxShort: 'FX',
  onLabel: 'ON',
  offLabel: 'OFF',
  activeLabel: 'ENABLED',
  mutedLabel: 'DISABLED',
  aspectRatioBtn: (shortMode) => `Ratio: ${shortMode}`,
  menuEscBtn: 'Menu (Esc)',
  touchLeft: 'LEFT',
  touchRight: 'RIGHT',
  touchJump: 'HOLD JUMP',

  statusSound: (on) => `Audio: ${on ? 'ON' : 'OFF'}`,
  statusFx: (on) => `Visual FX: ${on ? 'ON' : 'OFF'}`,
  statusRatio: (label) => `Aspect Ratio: ${label}`,
  statusRestartBottom: 'Restarted from the Base of Current Stage!',
  statusHazardKnockback: 'Hazard struck! Knocked off the ledge!',
  statusRelicFound: (name) => `Relic Uncovered: ${name}! Keep climbing to the Summit!`,
  statusWorldAscend: (stageStr, name) => `WORLD LINKED -> ${stageStr}: ${name}`,
  statusWorldDescend: (stageStr, name) => `FELL THROUGH REALMS -> Dropped to ${stageStr}: ${name}`,

  displayModes: {
    'auto-fit': 'Auto 4:3 Standard (No Distortion)',
    'pixel-perfect': 'Native Pixel 1x/2x/3x (Ultra Crisp)',
    'desktop-16-9': 'Desktop Widescreen (16:9 Bezel)',
    'mobile-portrait': 'Mobile Portrait (9:16 + Touch Pad)',
    'mobile-landscape': 'Mobile Landscape (16:9 + Touch Pad)',
    'full-stretch': 'Balanced Edge-to-Edge (No Horizontal Stretch)'
  },
  displayModesShort: {
    'auto-fit': '4:3 Auto',
    'pixel-perfect': 'Pixel 1x/2x',
    'desktop-16-9': 'Desktop 16:9',
    'mobile-portrait': 'Mobile 9:16',
    'mobile-landscape': 'Mobile Wide',
    'full-stretch': 'Borderless'
  },
  controlSchemes: {
    both: 'Both WASD + Arrow Keys',
    wasd: 'WASD + Space Only',
    arrows: 'Arrow Keys + Space Only'
  },

  crestMain: 'CITADEL CHRONICLES',
  gameTitle: 'SKYBOUND KNIGHT',
  mainSubtitle: '100 Linked Worlds • 19 Universes • Hardcore Precision Climb',
  stat100StagesVal: (count) => `${count} STAGES`,
  stat100StagesLbl: '19 Core Universes',
  statRelicsLbl: 'Relics Uncovered',
  statSummitsLbl: 'Summits Conquered',
  equippedLabel: (skinName) => `Armor: ${skinName}`,
  equippedSubLabel: (weaponName, shieldName) => `Weapon: ${weaponName} • Off-Hand: ${shieldName}`,
  changeLoadoutBtn: 'Customize Gear',
  btnContinue: (worldName) => `[ I ] Continue Ascent (${worldName})`,
  badgeFloor: (floor) => `FLOOR ${floor}`,
  btnNewGame: (roman) => `[ ${roman} ] Embark from Citadel Base`,
  badgeStage01: 'STAGE 01',
  btnArmory: '[ ARMORY ] Character Skins, Weapons & Achievements',
  badgeArmory: '14 ARMORS • 20 ITEMS',
  btnSelectWorld: '[ ATLAS ] Directory of 100 Linked Worlds',
  btnSpeedrun: '[ RECORDS ] Speedrun Hall of Fame & Secret Relics',
  badgeRelicsCount: (found, total) => `${found}/${total} RELICS`,
  btnSettings: '[ SETTINGS ] Language, Display Ratio, Audio & Controls',
  btnHowTo: '[ CODEX ] Terrain Mechanics & Hardcore Rules',
  btnBackMain: 'Return to Citadel Courtyard',

  crestArmory: 'ROYAL ARMORY',
  armoryTitle: 'ARMORY & CHAMPIONS',
  armorySubtitle: 'Unlock custom armors, glowing blades, staves, and shields via Achievements or Free Try Mode',
  subtabSkins: (c) => `Skins (${c})`,
  subtabWeapons: (c) => `Weapons (${c})`,
  subtabShields: (c) => `Shields (${c})`,
  subtabAchievements: (c) => `Achievements (${c})`,
  careerSummary: (j, f, r) =>
    `Jumps: <b style="color:#e8c170;">${j}</b> &bull; Falls: <b style="color:#e8c170;">${f}</b> &bull; Relics: <b style="color:#e8c170;">${r}</b>`,
  unlockAllOn: 'Unlock All (Free Try): ON',
  unlockAllOff: 'Unlock All (Free Try Mode)',
  badgeEquippedSkin: 'EQUIPPED',
  badgeEquippedWeapon: 'WIELDED',
  badgeEquippedShield: 'EQUIPPED',
  badgeUnlocked: 'UNLOCKED',
  badgeLocked: 'LOCKED',
  badgeCompleted: 'COMPLETED',

  crestWorlds: 'ATLAS OF 100 LINKED REALMS',
  worldsTitle: (c) => `SELECT LINKED WORLD (${c} STAGES)`,
  worldsSubtitle: 'All 100 Worlds seamlessly connect from Stage 1 to Stage 100',
  filterAll: (c) => `All (${c})`,
  relicTag: '[RELIC] ',
  relicFoundOnly: 'Relic Found',
  unconquered: 'Unconquered',

  crestSpeedrun: 'HALL OF RECORDS',
  speedrunTitle: 'SPEEDRUN HALL OF FAME',
  speedrunSubtitle: 'Fastest ascent records & Collection of 100 Ancient Relics',
  knightTitleLabel: 'Your Knight Title:',
  saveTitleBtn: 'Save Title',
  selectWorldLabel: 'Inspect World Stage:',
  mapRelicLabel: 'Stage Relic:',
  badgeCollected: 'COLLECTED',
  badgeUndiscovered: 'UNDISCOVERED',
  thRank: 'Rank',
  thKnight: 'Knight',
  thTime: 'Time',
  thFalls: 'Falls',
  rank1: 'RANK I',
  rank2: 'RANK II',
  rank3: 'RANK III',
  btnPlaySpeedrun: 'Launch Speedrun on This Stage',
  badgeLaunch: 'START',

  crestSettings: 'SYSTEM CONFIGURATION',
  settingsTitle: 'SYSTEM SETTINGS',
  settingsSubtitle: 'Configure language, pixel-perfect aspect ratio, audio, and controls',
  settingLanguage: 'Game Language (8 Languages)',
  settingDisplay: 'Screen Aspect Ratio (Desktop / Mobile)',
  settingSound: 'Sound Effects (Universe SFX)',
  settingMusic: 'Polyphonic Soundtrack (Melody + Bass + Drums)',
  settingVolume: 'Master Volume',
  settingFx: 'Visual Particles, Afterimage & Screen Shake',
  settingKeys: 'Keyboard Control Scheme',

  crestHowTo: 'CODEX OF ASCENSION',
  howToTitle: 'CLIMBER’S CODEX',
  howToSubtitle: 'Controls, terrain mechanics, and seamless 100-world ascension rules',
  howToParagraphs: [
    '&bull; <b>Movement &amp; Jump Charge:</b> Press <kbd>A</kbd>/<kbd>D</kbd> or <kbd>Left</kbd>/<kbd>Right</kbd> to walk. Hold <kbd>Space</kbd> (<kbd>W</kbd>/<kbd>Up</kbd>) to charge power and <b>release</b> to leap in your held direction.',
    '&bull; <b>Seamless 100-World Tower (No Checkpoints):</b> All 100 Worlds are linked end-to-end. Reaching the top of Floor 6 automatically ascends you into the next World with live music &amp; biome transitions. Missing the bottom pit drops you back to the previous World!',
    '&bull; <b>Progressive Difficulty (Medium &rarr; Grandmaster):</b> Stage 1 begins at Medium difficulty. Higher stages feature narrower ledges, wider gaps, crumbling stone (<kbd>K</kbd>), slick ice (<kbd>I</kbd>), and crosswinds (<kbd>W/M</kbd>).',
    '&bull; <b>Creator Armors &amp; Elemental Weapons:</b> Complete 13 Achievements or equip the <b>[CREATOR] Architect Skins</b> featuring wings, flowing cloaks, and 20 elemental weapons/shields that unleash glowing slash waves on every jump.',
    '&bull; <b>Aspect Ratio (<kbd>V</kbd> Key):</b> Press <kbd>V</kbd> anytime to switch between Auto 4:3, Native Pixel 1x/2x/3x, Desktop 16:9, Mobile Portrait/Landscape, or Balanced Borderless.'
  ],

  crestPause: 'CHAMBER OF REST',
  pauseTitle: 'EXPEDITION PAUSED',
  pauseSubtitle: 'Your current tower position has been saved automatically',
  btnPauseResume: '[ I ] Resume Ascent (Esc / P)',
  btnPauseRestart: '[ II ] Restart from Stage Base',
  btnPauseLanguage: 'Language',
  btnPauseRatio: 'Aspect Ratio (V Key)',
  btnPauseSound: 'Audio &amp; Music',
  btnPauseFx: 'Visual Effects (FX)',
  btnPauseMenu: 'Save &amp; Return to Citadel Courtyard',

  crestWin: 'SUMMIT CONQUERED',
  winTitleRelic: 'SUPREME RELIC UNCOVERED',
  winTitleSummit: 'CITADEL SUMMIT CONQUERED',
  winSubtitle: (name) => `Completed World: <b>${name}</b>`,
  winRelicBannerTitle: 'ANCIENT TOWER RELIC DISCOVERED!',
  winRelicBannerSub: (relicName, total) =>
    `Relic: <b style="color:#e8c170;">${relicName}</b> &nbsp;|&nbsp; Collection: <b>${total}/100</b> Relics`,
  winTimeLabel: 'Completion Time (Speedrun):',
  winJumpsFallsLabel: 'Total Jumps / Hard Falls:',
  winJumpsFallsVal: (j, f) => `${j} jumps &nbsp;|&nbsp; ${f} falls`,
  winLeaderboardTitle: (name) => `SPEEDRUN LEADERBOARD (${name})`,
  btnWinNext: '[ I ] Ascend to Next World',
  btnWinReplay: '[ I ] Start New World Run from Stage 1 (Reset Seed)',
  btnWinMenu: 'Return to Citadel Courtyard (Menu)',
  defaultPlayerName: 'Astral Wayfarer'
};

const EN_GB_STRINGS: UiStrings = {
  ...EN_US_STRINGS,
  statusFx: (on) => `Visual Effects: ${on ? 'ON' : 'OFF'}`,
  statusRatio: (label) => `Display Ratio: ${label}`,
  statusHazardKnockback: 'Spikes struck! Knocked off the parapet!',
  displayModes: {
    'auto-fit': 'Auto 4:3 Standard (No Distortion)',
    'pixel-perfect': 'Native Pixel 1x/2x/3x (Ultra Crisp)',
    'desktop-16-9': 'Desktop Widescreen (16:9 Bezel)',
    'mobile-portrait': 'Mobile Portrait (9:16 + Touch Pad)',
    'mobile-landscape': 'Mobile Landscape (16:9 + Touch Pad)',
    'full-stretch': 'Balanced Full-Bleed (No Horizontal Stretch)'
  },
  equippedLabel: (skinName) => `Armour: ${skinName}`,
  changeLoadoutBtn: 'Customise Kit',
  btnArmory: '[ ARMOURY ] Character Attire, Weapons & Honours',
  badgeArmory: '14 ARMOURS • 20 ARTEFACTS',
  btnSpeedrun: '[ ROLL OF HONOUR ] Speedrun Records & Ancient Relics',
  crestArmory: 'ROYAL ARMOURY',
  armoryTitle: 'ARMOURY & CHAMPIONS',
  armorySubtitle: 'Unlock bespoke suits of armour, glowing blades, staves, and shields via Honours or Free Trial Mode',
  subtabSkins: (c) => `Armours (${c})`,
  crestSpeedrun: 'ROLL OF HONOUR',
  speedrunTitle: 'SPEEDRUN ROLL OF HONOUR',
  howToParagraphs: [
    '&bull; <b>Movement &amp; Jump Charge:</b> Press <kbd>A</kbd>/<kbd>D</kbd> or <kbd>Left</kbd>/<kbd>Right</kbd> to step. Hold <kbd>Space</kbd> (<kbd>W</kbd>/<kbd>Up</kbd>) to gather strength and <b>release</b> to leap towards your held direction.',
    '&bull; <b>Seamless 100-Realm Tower (No Checkpoints):</b> All 100 Realms are linked continuously. Reaching the pinnacle of Floor 6 automatically ascends you into the next Realm with live music &amp; scenery transitions. Falling through the bottom pit drops you back to the lower Realm!',
    '&bull; <b>Progressive Challenge (Medium &rarr; Grandmaster):</b> Stage 1 starts at Medium difficulty. Higher realms demand precision across narrower ledges, wider chasms, crumbling masonry (<kbd>K</kbd>), black ice (<kbd>I</kbd>), and gales (<kbd>W/M</kbd>).',
    '&bull; <b>Creator Regalia &amp; Elemental Arms:</b> Earn 13 Honours or don the <b>[CREATOR] Architect Regalia</b> featuring wings, flowing cloaks, and 20 elemental arms/shields that cast radiant slash arcs as you leap.',
    '&bull; <b>Display Ratio (<kbd>V</kbd> Key):</b> Press <kbd>V</kbd> at any time to switch between Auto 4:3, Native Pixel 1x/2x/3x, Desktop 16:9, Mobile Portrait/Landscape, or Balanced Full-Bleed.'
  ],
  defaultPlayerName: 'Royal Knight-Errant'
};

const VI_STRINGS: UiStrings = {
  stageCounter: (cur, total) => `Màn ${cur}/${total}`,
  floorCounter: (cur, total) => `Tầng ${cur}/${total}`,
  fallsCount: (count) => `Ngã: ${count}`,
  jumpsCount: (count) => `${count} nhảy`,
  soundShort: 'Âm',
  fxShort: 'FX',
  onLabel: 'BẬT',
  offLabel: 'TẮT',
  activeLabel: 'ĐANG BẬT',
  mutedLabel: 'ĐANG TẮT',
  aspectRatioBtn: (shortMode) => `Tỉ lệ: ${shortMode}`,
  menuEscBtn: 'Menu (Esc)',
  touchLeft: 'TRÁI',
  touchRight: 'PHẢI',
  touchJump: 'GIỮ NHẢY',

  statusSound: (on) => `Âm thanh: ${on ? 'BẬT' : 'TẮT'}`,
  statusFx: (on) => `Hiệu ứng (FX): ${on ? 'BẬT' : 'TẮT'}`,
  statusRatio: (label) => `Tỉ lệ màn hình: ${label}`,
  statusRestartBottom: 'Bắt đầu lại từ Chân Màn Hiện Tại!',
  statusHazardKnockback: 'Chạm bẫy! Bị hất văng khỏi mỏm đá!',
  statusRelicFound: (name) => `Đã mở Cổ Vật: ${name}! Tiếp tục leo lên Đỉnh!`,
  statusWorldAscend: (stageStr, name) => `LIÊN KẾT THẾ GIỚI -> ${stageStr}: ${name}`,
  statusWorldDescend: (stageStr, name) => `RƠI XUYÊN TẦNG THẾ GIỚI -> Tụt về ${stageStr}: ${name}`,

  displayModes: {
    'auto-fit': 'Tự Động Chuẩn 4:3 (Không méo/mờ)',
    'pixel-perfect': 'Pixel Nguyên Bản 1x/2x/3x (Siêu nét)',
    'desktop-16-9': 'Desktop Widescreen (Khung 16:9)',
    'mobile-portrait': 'Điện Thoại Dọc (Khung 9:16 + Pad)',
    'mobile-landscape': 'Điện Thoại Ngang (Khung 16:9 + Pad)',
    'full-stretch': 'Tràn Viền Cân Bằng (Sát Cạnh • Không Phình Ngang)'
  },
  displayModesShort: {
    'auto-fit': 'Chuẩn 4:3',
    'pixel-perfect': 'Pixel 1x/2x',
    'desktop-16-9': 'Desktop 16:9',
    'mobile-portrait': 'Mobile 9:16',
    'mobile-landscape': 'Mobile Ngang',
    'full-stretch': 'Tràn Viền'
  },
  controlSchemes: {
    both: 'Cả A/D + Phím Mũi Tên',
    wasd: 'Chỉ A / D / W / Space',
    arrows: 'Chỉ Mũi Tên + Space'
  },

  crestMain: 'CITADEL CHRONICLES',
  gameTitle: 'SKYBOUND KNIGHT',
  mainSubtitle: 'Hành Trình 100 Thế Giới Liên Thông • 19 Vũ Trụ • Chuẩn Xác Tuyệt Đối',
  stat100StagesVal: (count) => `${count} MÀN`,
  stat100StagesLbl: '19 Vũ Trụ Chính',
  statRelicsLbl: 'Cổ Vật Đã Mở',
  statSummitsLbl: 'Đỉnh Tháp Đã Qua',
  equippedLabel: (skinName) => `Trang bị: ${skinName}`,
  equippedSubLabel: (weaponName, shieldName) => `Vũ khí: ${weaponName} • Khiên: ${shieldName}`,
  changeLoadoutBtn: 'Đổi Trang Bị',
  btnContinue: (worldName) => `[ I ] Tiếp tục Hành Trình (${worldName})`,
  badgeFloor: (floor) => `TẦNG ${floor}`,
  btnNewGame: (roman) => `[ ${roman} ] Khởi Hành Từ Chân Tháp Cổ`,
  badgeStage01: 'MÀN 01',
  btnArmory: '[ NHÂN VẬT ] Kho Trang Phục, Vũ Khí & Thành Tựu',
  badgeArmory: '14 GIÁP • 20 VẬT PHẨM',
  btnSelectWorld: '[ BẢN ĐỒ ] Danh Mục 100 Thế Giới & 19 Vũ Trụ',
  btnSpeedrun: '[ KỶ LỤC ] Bảng Vàng Speedrun & Cổ Vật Bí Mật',
  badgeRelicsCount: (found, total) => `${found}/${total} CỔ VẬT`,
  btnSettings: '[ CÀI ĐẶT ] Ngôn Ngữ, Tỉ Lệ Màn Hình & Âm Thanh',
  btnHowTo: '[ CẨM NANG ] Cơ Chế Địa Hình & Luật Chơi',
  btnBackMain: 'Quay lại Sảnh Thành Cổ',

  crestArmory: 'ROYAL ARMORY',
  armoryTitle: 'KHO VŨ KHÍ & NHÂN VẬT',
  armorySubtitle: 'Mở khóa trang phục, kiếm, trượng, khiên qua Thành Tựu hoặc bật chế độ Thử Đồ Tự Do',
  subtabSkins: (c) => `Nhân Vật (${c})`,
  subtabWeapons: (c) => `Vũ Khí (${c})`,
  subtabShields: (c) => `Khiên (${c})`,
  subtabAchievements: (c) => `Thành Tựu (${c})`,
  careerSummary: (j, f, r) =>
    `Nhảy: <b style="color:#e8c170;">${j}</b> &bull; Ngã: <b style="color:#e8c170;">${f}</b> &bull; Cổ vật: <b style="color:#e8c170;">${r}</b>`,
  unlockAllOn: 'Đang Mở Khóa Tất Cả: BẬT',
  unlockAllOff: 'Mở Khóa Tất Cả (Thử Đồ)',
  badgeEquippedSkin: 'ĐANG MẶC',
  badgeEquippedWeapon: 'ĐANG CẦM',
  badgeEquippedShield: 'ĐANG ĐEO',
  badgeUnlocked: 'ĐÃ MỞ KHÓA',
  badgeLocked: 'CHƯA MỞ KHÓA',
  badgeCompleted: 'HOÀN THÀNH',

  crestWorlds: 'ATLAS OF 100 LINKED REALMS',
  worldsTitle: (c) => `CHỌN THẾ GIỚI LIÊN THÔNG (${c} BẢN ĐỒ)`,
  worldsSubtitle: '100 Thế Giới tự động liên kết xuyên suốt từ Màn 1 đến Màn 100',
  filterAll: (c) => `Tất cả (${c})`,
  relicTag: '[CỔ VẬT] ',
  relicFoundOnly: 'Đã mở Cổ Vật',
  unconquered: 'Chưa chinh phục',

  crestSpeedrun: 'HALL OF RECORDS',
  speedrunTitle: 'BẢNG VÀNG SPEEDRUN',
  speedrunSubtitle: 'Kỷ lục chinh phục nhanh nhất & Bộ sưu tập 100 Cổ Vật Bí Mật',
  knightTitleLabel: 'Danh hiệu Hiệp Sĩ của bạn:',
  saveTitleBtn: 'Lưu Danh Hiệu',
  selectWorldLabel: 'Chọn Thế giới tra cứu:',
  mapRelicLabel: 'Cổ vật bản đồ:',
  badgeCollected: 'ĐÃ THU THẬP',
  badgeUndiscovered: 'CHƯA TÌM THẤY',
  thRank: 'Thứ Hạng',
  thKnight: 'Hiệp Sĩ',
  thTime: 'Thời Gian',
  thFalls: 'Số Lần Ngã',
  rank1: 'HẠNG I',
  rank2: 'HẠNG II',
  rank3: 'HẠNG III',
  btnPlaySpeedrun: 'Khởi Hành Phá Kỷ Lục Bản Đồ Này',
  badgeLaunch: 'XUẤT PHÁT',

  crestSettings: 'SYSTEM CONFIGURATION',
  settingsTitle: 'CÀI ĐẶT HỆ THỐNG',
  settingsSubtitle: 'Tùy chỉnh ngôn ngữ, tỉ lệ khung hình chuẩn Pixel-Art, âm thanh và bộ phím',
  settingLanguage: 'Ngôn ngữ hiển thị (Language)',
  settingDisplay: 'Tỉ lệ màn hình (Desktop / Điện thoại)',
  settingSound: 'Hiệu ứng âm thanh (SFX theo từng Vũ Trụ)',
  settingMusic: 'Nhạc nền Đa Bè (Melody + Bass + Trống)',
  settingVolume: 'Mức âm lượng tổng',
  settingFx: 'Hiệu ứng hạt, Bóng mờ (Trail) & Rung chấn',
  settingKeys: 'Bộ phím điều khiển',

  crestHowTo: 'CODEX OF ASCENSION',
  howToTitle: 'CẨM NANG LEO THÁP',
  howToSubtitle: 'Quy tắc điều khiển, cơ chế địa hình và liên thông 100 Thế Giới',
  howToParagraphs: [
    '&bull; <b>Di chuyển &amp; Nạp lực nhảy:</b> Dùng <kbd>A</kbd>/<kbd>D</kbd> hoặc <kbd>Trái</kbd>/<kbd>Phải</kbd> để bước đi. Giữ <kbd>Space</kbd> (<kbd>W</kbd>/<kbd>Lên</kbd>) để tích lực và <b>nhả phím</b> để bật nhảy theo hướng đang giữ.',
    '&bull; <b>Liên Thông 100 Thế Giới (Không Checkpoint):</b> Mọi Thế Giới được nối liền mạch. Nhảy qua đỉnh Tầng 6 sẽ tự động liên kết thẳng lên Thế Giới tiếp theo kèm chuyển nhạc nền &amp; bối cảnh. Rơi xuống hố đáy Tầng 1 sẽ tụt về Thế Giới phía dưới!',
    '&bull; <b>Độ Khó Tăng Tiến (Medium &rarr; Grandmaster):</b> Màn 1 khởi đầu ở độ khó Trung Bình (Medium), càng lên cao mỏm đá càng hẹp, kết hợp đá sụp đổ (<kbd>K</kbd>), băng trơn (<kbd>I</kbd>) và gió lốc (<kbd>W/M</kbd>).',
    '&bull; <b>Kho Trang Phục Sáng Thế &amp; Vũ Khí Phát Sáng:</b> Chinh phục 13 Thành Tựu hoặc sử dụng các bộ <b>Trang Phục Người Tạo [SÁNG THẾ]</b> có cánh thiên thần, áo choàng bay và 20 Vũ Khí/Khiên tỏa hạt nguyên tố.',
    '&bull; <b>Tỉ Lệ Màn Hình (Phím V):</b> Bấm phím <kbd>V</kbd> hoặc nút Tỉ Lệ trên thanh HUD để chuyển đổi giữa khung chuẩn 4:3, Pixel 1x/2x/3x, Desktop 16:9, Điện Thoại Dọc/Ngang hoặc Tràn Viền Cân Bằng.'
  ],

  crestPause: 'CHAMBER OF REST',
  pauseTitle: 'TẠM DỪNG HÀNH TRÌNH',
  pauseSubtitle: 'Tiến trình leo tháp của bạn đã được lưu tự động',
  btnPauseResume: '[ I ] Tiếp tục leo tháp (Esc / P)',
  btnPauseRestart: '[ II ] Chơi lại từ Chân Màn Hiện Tại',
  btnPauseLanguage: 'Ngôn ngữ (Language)',
  btnPauseRatio: 'Tỉ lệ màn hình (Phím V)',
  btnPauseSound: 'Âm thanh &amp; Nhạc nền',
  btnPauseFx: 'Hiệu ứng hình ảnh (FX)',
  btnPauseMenu: 'Lưu &amp; Trở về Sảnh Thành Cổ',

  crestWin: 'SUMMIT CONQUERED',
  winTitleRelic: 'KHÁM PHÁ CỔ VẬT ĐỈNH CAO',
  winTitleSummit: 'CHINH PHỤC ĐỈNH ĐẠI THÁP',
  winSubtitle: (name) => `Hoàn thành thế giới: <b>${name}</b>`,
  winRelicBannerTitle: 'KHÁM PHÁ CỔ VẬT BÍ MẬT TẦNG THÁP!',
  winRelicBannerSub: (relicName, total) =>
    `Cổ vật: <b style="color:#e8c170;">${relicName}</b> &nbsp;|&nbsp; Đã thu thập: <b>${total}/100</b> Cổ Vật`,
  winTimeLabel: 'Thời gian hoàn thành (Speedrun):',
  winJumpsFallsLabel: 'Tổng số cú nhảy / Số lần ngã:',
  winJumpsFallsVal: (j, f) => `${j} nhảy &nbsp;|&nbsp; ${f} ngã`,
  winLeaderboardTitle: (name) => `BẢNG VÀNG SPEEDRUN (${name})`,
  btnWinNext: '[ I ] Tiến Sang Thế Giới Tiếp Theo',
  btnWinReplay: '[ I ] Chơi Lại Thế Giới Mới Từ Đầu (Màn 1 • Reset Seed)',
  btnWinMenu: 'Trở Về Sảnh Thành Cổ (Menu)',
  defaultPlayerName: 'Lữ Khách Tinh Vân'
};

const ZH_STRINGS: UiStrings = {
  stageCounter: (cur, total) => `第 ${cur}/${total} 关`,
  floorCounter: (cur, total) => `第 ${cur}/${total} 层`,
  fallsCount: (count) => `跌落: ${count}`,
  jumpsCount: (count) => `${count} 次跳跃`,
  soundShort: '音效',
  fxShort: '特效',
  onLabel: '开',
  offLabel: '关',
  activeLabel: '已开启',
  mutedLabel: '已关闭',
  aspectRatioBtn: (shortMode) => `比例: ${shortMode}`,
  menuEscBtn: '菜单 (Esc)',
  touchLeft: '左移',
  touchRight: '右移',
  touchJump: '长按蓄力跳',

  statusSound: (on) => `音效与音乐: ${on ? '已开启' : '已关闭'}`,
  statusFx: (on) => `视觉特效 (FX): ${on ? '已开启' : '已关闭'}`,
  statusRatio: (label) => `画面比例: ${label}`,
  statusRestartBottom: '已从当前世界底层重新出发！',
  statusHazardKnockback: '触碰机关！被震飞出岩台！',
  statusRelicFound: (name) => `获得秘宝遗物：【${name}】！继续向塔顶进发！`,
  statusWorldAscend: (stageStr, name) => `世界无缝连结 -> ${stageStr}: ${name}`,
  statusWorldDescend: (stageStr, name) => `坠穿界域深渊 -> 跌回 ${stageStr}: ${name}`,

  displayModes: {
    'auto-fit': '自动标准 4:3（无拉伸/不模糊）',
    'pixel-perfect': '原生像素 1x/2x/3x（极致锐利）',
    'desktop-16-9': '桌面宽屏模式（16:9 画框）',
    'mobile-portrait': '手机竖屏模式（9:16 + 触控板）',
    'mobile-landscape': '手机横屏模式（16:9 + 触控板）',
    'full-stretch': '无边框均衡满屏（等比无横向变形）'
  },
  displayModesShort: {
    'auto-fit': '标准 4:3',
    'pixel-perfect': '像素 1x/2x',
    'desktop-16-9': '桌面 16:9',
    'mobile-portrait': '竖屏 9:16',
    'mobile-landscape': '横屏模式',
    'full-stretch': '均衡满屏'
  },
  controlSchemes: {
    both: '同时支持 WASD + 方向键',
    wasd: '仅限 WASD + 空格键',
    arrows: '仅限方向键 + 空格键'
  },

  crestMain: 'CITADEL CHRONICLES',
  gameTitle: '苍穹骑士 • SKYBOUND KNIGHT',
  mainSubtitle: '百界无缝连塔 • 十九重宇宙 • 硬核精准攀登',
  stat100StagesVal: (count) => `${count} 大世界`,
  stat100StagesLbl: '19 重主题宇宙',
  statRelicsLbl: '已寻获古遗物',
  statSummitsLbl: '已征服塔顶',
  equippedLabel: (skinName) => `当前战甲：${skinName}`,
  equippedSubLabel: (weaponName, shieldName) => `主武器：${weaponName} • 副手圣盾：${shieldName}`,
  changeLoadoutBtn: '更换装束',
  btnContinue: (worldName) => `[ I ] 继续攀登征途 (${worldName})`,
  badgeFloor: (floor) => `第 ${floor} 层`,
  btnNewGame: (roman) => `[ ${roman} ] 从古圣城塔底启程`,
  badgeStage01: '第 01 关',
  btnArmory: '[ 皇家军械库 ] 角色战甲、神兵与圣城成就',
  badgeArmory: '14 套战甲 • 20 件神兵',
  btnSelectWorld: '[ 百界星图 ] 100 座无缝世界与 19 重宇宙',
  btnSpeedrun: '[ 荣耀殿堂 ] 速通排行榜与百件秘宝图鉴',
  badgeRelicsCount: (found, total) => `${found}/${total} 秘宝`,
  btnSettings: '[ 系统设置 ] 语言切换、画面比例、音效与键位',
  btnHowTo: '[ 攀登法典 ] 地形机关机制与硬核法则',
  btnBackMain: '返回圣城大厅',

  crestArmory: 'ROYAL ARMORY',
  armoryTitle: '皇家军械与英雄圣殿',
  armorySubtitle: '达成圣城成就或开启自由试穿，解锁传奇战甲、羽翼披风与元素发光神兵',
  subtabSkins: (c) => `角色战甲 (${c})`,
  subtabWeapons: (c) => `手持神兵 (${c})`,
  subtabShields: (c) => `圣盾古物 (${c})`,
  subtabAchievements: (c) => `荣耀成就 (${c})`,
  careerSummary: (j, f, r) =>
    `跳跃: <b style="color:#e8c170;">${j}</b> &bull; 跌落: <b style="color:#e8c170;">${f}</b> &bull; 秘宝: <b style="color:#e8c170;">${r}</b>`,
  unlockAllOn: '全解锁自由试穿：已开启',
  unlockAllOff: '开启全解锁（自由试穿模式）',
  badgeEquippedSkin: '穿戴中',
  badgeEquippedWeapon: '装备中',
  badgeEquippedShield: '佩带中',
  badgeUnlocked: '已解锁',
  badgeLocked: '未解锁',
  badgeCompleted: '已达成',

  crestWorlds: 'ATLAS OF 100 LINKED REALMS',
  worldsTitle: (c) => `选择连结世界 (${c} 座界域)`,
  worldsSubtitle: '100 座世界上下无缝贯通，登顶即自动进入下一界域',
  filterAll: (c) => `全部 (${c})`,
  relicTag: '[秘宝] ',
  relicFoundOnly: '已获秘宝',
  unconquered: '尚未征服',

  crestSpeedrun: 'HALL OF RECORDS',
  speedrunTitle: '速通荣耀金榜',
  speedrunSubtitle: '最快登顶纪录 & 100 件传世秘宝收集进度',
  knightTitleLabel: '您的骑士尊号：',
  saveTitleBtn: '保存尊号',
  selectWorldLabel: '查阅世界关卡：',
  mapRelicLabel: '本关秘宝：',
  badgeCollected: '已收集',
  badgeUndiscovered: '未发现',
  thRank: '名次',
  thKnight: '骑士尊号',
  thTime: '通关用时',
  thFalls: '跌落次数',
  rank1: '第一名',
  rank2: '第二名',
  rank3: '第三名',
  btnPlaySpeedrun: '立即挑战本关速通纪录',
  badgeLaunch: '出征',

  crestSettings: 'SYSTEM CONFIGURATION',
  settingsTitle: '系统与画面设置',
  settingsSubtitle: '切换八国语言、调整像素级画面比例、多声部配乐与操作键位',
  settingLanguage: '游戏语言 (Language)',
  settingDisplay: '画面显示比例（桌面 / 手机）',
  settingSound: '环境与动作音效（随宇宙主题变化）',
  settingMusic: '多声部合成配乐（主旋律 + 低音 + 鼓点）',
  settingVolume: '主音量大小',
  settingFx: '粒子特效、残影轨迹与震屏反馈',
  settingKeys: '键盘控制方案',

  crestHowTo: 'CODEX OF ASCENSION',
  howToTitle: '圣城攀登法典',
  howToSubtitle: '蓄力法则、特殊地形机关与百界无缝连塔机制',
  howToParagraphs: [
    '&bull; <b>移动与蓄力跳跃：</b>按 <kbd>A</kbd>/<kbd>D</kbd> 或 <kbd>左</kbd>/<kbd>右</kbd> 移动。长按 <kbd>Space</kbd>（<kbd>W</kbd>/<kbd>上</kbd>）积蓄力量，<b>松开按键</b>即可向当前方向跃出。',
    '&bull; <b>百界无缝连塔（无存档点模式）：</b>全部 100 座世界上下贯通。跃出第 6 层顶端将直接飞入下一座世界，背景与音乐自动无缝切换；若从第 1 层底部深渊坠落，则会跌回上一座世界顶端！',
    '&bull; <b>递进式硬核难度（中等 &rarr; 宗师）：</b>第 1 关从中等难度起步，越往高处岩台越窄，并融合崩塌古石（<kbd>K</kbd>）、寒冰滑面（<kbd>I</kbd>）与逆风旋流（<kbd>W/M</kbd>）。',
    '&bull; <b>创世神装与元素剑气：</b>达成 13 项成就或直接穿戴<b>【创世】建筑师神装</b>（附带天使羽翼、飘逸披风），搭配 20 件散发元素星芒并在起跳时斩出剑气的神兵圣盾。',
    '&bull; <b>画面比例切换（<kbd>V</kbd> 键）：</b>随时按 <kbd>V</kbd> 键在标准 4:3、原生像素、16:9 宽屏、手机竖/横屏或无边框均衡满屏之间切换。'
  ],

  crestPause: 'CHAMBER OF REST',
  pauseTitle: '征途暂歇',
  pauseSubtitle: '您当前的攀登位置已自动保存',
  btnPauseResume: '[ I ] 继续攀登圣塔 (Esc / P)',
  btnPauseRestart: '[ II ] 从当前世界底层重新开始',
  btnPauseLanguage: '游戏语言 (Language)',
  btnPauseRatio: '画面比例 (快捷键 V)',
  btnPauseSound: '音效与背景音乐',
  btnPauseFx: '视觉特效 (FX)',
  btnPauseMenu: '保存并返回圣城大厅',

  crestWin: 'SUMMIT CONQUERED',
  winTitleRelic: '寻获传世秘宝•荣登绝顶',
  winTitleSummit: '成功征服百界圣塔之巅',
  winSubtitle: (name) => `征服世界：<b>${name}</b>`,
  winRelicBannerTitle: '成功寻获圣塔隐藏古遗物！',
  winRelicBannerSub: (relicName, total) =>
    `秘宝：<b style="color:#e8c170;">${relicName}</b> &nbsp;|&nbsp; 秘宝收集：<b>${total}/100</b>`,
  winTimeLabel: '通关耗时 (Speedrun)：',
  winJumpsFallsLabel: '总跳跃次数 / 重摔次数：',
  winJumpsFallsVal: (j, f) => `${j} 次跳跃 &nbsp;|&nbsp; ${f} 次重摔`,
  winLeaderboardTitle: (name) => `速通荣耀榜 (${name})`,
  btnWinNext: '[ I ] 迈向下一座世界',
  btnWinReplay: '[ I ] 从第 1 关开启全新世界征途 (重置 Seed)',
  btnWinMenu: '返回圣城大厅 (Menu)',
  defaultPlayerName: '星界游侠'
};

const KO_STRINGS: UiStrings = {
  stageCounter: (cur, total) => `스테이지 ${cur}/${total}`,
  floorCounter: (cur, total) => `${cur}/${total}층`,
  fallsCount: (count) => `추락: ${count}`,
  jumpsCount: (count) => `${count}회 점프`,
  soundShort: '음향',
  fxShort: '효과',
  onLabel: '켜짐',
  offLabel: '꺼짐',
  activeLabel: '활성화됨',
  mutedLabel: '비활성화됨',
  aspectRatioBtn: (shortMode) => `화면비: ${shortMode}`,
  menuEscBtn: '메뉴 (Esc)',
  touchLeft: '왼쪽',
  touchRight: '오른쪽',
  touchJump: '점프 차징',

  statusSound: (on) => `사운드: ${on ? '켜짐' : '꺼짐'}`,
  statusFx: (on) => `시각 효과(FX): ${on ? '켜짐' : '꺼짐'}`,
  statusRatio: (label) => `화면 비율: ${label}`,
  statusRestartBottom: '현재 스테이지 최하단에서 다시 시작합니다!',
  statusHazardKnockback: '함정 피격! 바위 턱에서 튕겨 나갔습니다!',
  statusRelicFound: (name) => `고대 유물 발견: [${name}]! 정상으로 계속 오르세요!`,
  statusWorldAscend: (stageStr, name) => `세계 연결 완료 -> ${stageStr}: ${name}`,
  statusWorldDescend: (stageStr, name) => `하층 세계로 추락 -> ${stageStr}: ${name}`,

  displayModes: {
    'auto-fit': '자동 표준 4:3 (왜곡/흐림 없음)',
    'pixel-perfect': '원본 픽셀 1x/2x/3x (초고화질)',
    'desktop-16-9': '데스크톱 와이드스크린 (16:9 베젤)',
    'mobile-portrait': '모바일 세로 모드 (9:16 + 터치패드)',
    'mobile-landscape': '모바일 가로 모드 (16:9 + 터치패드)',
    'full-stretch': '균형 전체화면 (가로 늘어짐 방지)'
  },
  displayModesShort: {
    'auto-fit': '표준 4:3',
    'pixel-perfect': '픽셀 1x/2x',
    'desktop-16-9': '데스크톱 16:9',
    'mobile-portrait': '모바일 9:16',
    'mobile-landscape': '모바일 가로',
    'full-stretch': '균형 전체화면'
  },
  controlSchemes: {
    both: 'WASD + 방향키 모두 사용',
    wasd: 'WASD + Space 전용',
    arrows: '방향키 + Space 전용'
  },

  crestMain: 'CITADEL CHRONICLES',
  gameTitle: '스카이바운드 나이트',
  mainSubtitle: '100개의 연결된 세계 • 19개 유니버스 • 하드코어 정밀 등반',
  stat100StagesVal: (count) => `${count} 스테이지`,
  stat100StagesLbl: '19개 메인 세계관',
  statRelicsLbl: '발견한 고대 유물',
  statSummitsLbl: '정복한 첨탑 정상',
  equippedLabel: (skinName) => `장착 갑주: ${skinName}`,
  equippedSubLabel: (weaponName, shieldName) => `무기: ${weaponName} • 방패: ${shieldName}`,
  changeLoadoutBtn: '장비 변경',
  btnContinue: (worldName) => `[ I ] 등반 이어하기 (${worldName})`,
  badgeFloor: (floor) => `${floor}층`,
  btnNewGame: (roman) => `[ ${roman} ] 고대 성채 기슭에서 출발`,
  badgeStage01: '스테이지 01',
  btnArmory: '[ 왕실 무기고 ] 캐릭터 갑주, 무기 및 업적',
  badgeArmory: '14종 갑주 • 20종 장비',
  btnSelectWorld: '[ 세계 도감 ] 100대 연결 세계 & 19개 유니버스',
  btnSpeedrun: '[ 명예의 전당 ] 스피드런 랭킹 & 비밀 유물',
  badgeRelicsCount: (found, total) => `${found}/${total} 유물`,
  btnSettings: '[ 환경 설정 ] 언어, 화면 비율, 사운드 및 조작키',
  btnHowTo: '[ 등반 교범 ] 지형 기믹 및 하드코어 규칙',
  btnBackMain: '성채 중앙 홀로 돌아가기',

  crestArmory: 'ROYAL ARMORY',
  armoryTitle: '왕실 무기고 & 영웅 전당',
  armorySubtitle: '업적을 달성하거나 자유 체험 모드를 켜서 날개 갑주, 망토, 원소 발광 무기를 장착하세요',
  subtabSkins: (c) => `캐릭터 (${c})`,
  subtabWeapons: (c) => `무기 (${c})`,
  subtabShields: (c) => `방패 (${c})`,
  subtabAchievements: (c) => `업적 (${c})`,
  careerSummary: (j, f, r) =>
    `점프: <b style="color:#e8c170;">${j}</b> &bull; 추락: <b style="color:#e8c170;">${f}</b> &bull; 유물: <b style="color:#e8c170;">${r}</b>`,
  unlockAllOn: '전체 해금 (자유 체험): 켜짐',
  unlockAllOff: '전체 해금 켜기 (장비 체험)',
  badgeEquippedSkin: '장착 중',
  badgeEquippedWeapon: '착용 중',
  badgeEquippedShield: '착용 중',
  badgeUnlocked: '해금됨',
  badgeLocked: '잠김',
  badgeCompleted: '달성 완료',

  crestWorlds: 'ATLAS OF 100 LINKED REALMS',
  worldsTitle: (c) => `연결된 세계 선택 (${c}개 맵)`,
  worldsSubtitle: '1스테이지부터 100스테이지까지 모든 세계가 끊김 없이 하나로 이어집니다',
  filterAll: (c) => `전체 (${c})`,
  relicTag: '[유물] ',
  relicFoundOnly: '유물 획득',
  unconquered: '미정복',

  crestSpeedrun: 'HALL OF RECORDS',
  speedrunTitle: '스피드런 명예의 전당',
  speedrunSubtitle: '최단 시간 등반 기록 & 100대 비밀 유물 컬렉션',
  knightTitleLabel: '당신의 기사 칭호:',
  saveTitleBtn: '칭호 저장',
  selectWorldLabel: '조회할 세계 선택:',
  mapRelicLabel: '스테이지 유물:',
  badgeCollected: '수집 완료',
  badgeUndiscovered: '미발견',
  thRank: '순위',
  thKnight: '기사단원',
  thTime: '기록 시간',
  thFalls: '추락 횟수',
  rank1: '1위',
  rank2: '2위',
  rank3: '3위',
  btnPlaySpeedrun: '이 스테이지 기록 경신 도전',
  badgeLaunch: '출정',

  crestSettings: 'SYSTEM CONFIGURATION',
  settingsTitle: '시스템 환경 설정',
  settingsSubtitle: '언어 선택, 픽셀 퍼펙트 화면 비율, 사운드 및 조작키 설정',
  settingLanguage: '게임 언어 (Language)',
  settingDisplay: '화면 비율 모드 (데스크톱 / 모바일)',
  settingSound: '효과음 (유니버스별 고유 SFX)',
  settingMusic: '다성부 배경음악 (멜로디 + 베이스 + 드럼)',
  settingVolume: '전체 음량',
  settingFx: '파티클, 잔상 효과(Trail) 및 화면 진동',
  settingKeys: '키보드 조작 방식',

  crestHowTo: 'CODEX OF ASCENSION',
  howToTitle: '성채 등반 교범',
  howToSubtitle: '점프 차징 조작법, 지형 기믹 및 100대 세계 연속 등반 규칙',
  howToParagraphs: [
    '&bull; <b>이동 및 점프 차징:</b> <kbd>A</kbd>/<kbd>D</kbd> 또는 <kbd>좌</kbd>/<kbd>우</kbd> 방향키로 이동합니다. <kbd>Space</kbd>(<kbd>W</kbd>/<kbd>위</kbd>)를 길게 눌러 힘을 모은 뒤 <b>키를 떼면</b> 누르고 있는 방향으로 도약합니다.',
    '&bull; <b>100대 세계 심리스 연결 (체크포인트 없음):</b> 모든 세계가 하나로 연결되어 있습니다. 6층 꼭대기를 넘으면 음악과 배경이 자연스럽게 바뀌며 다음 세계로 이어지고, 1층 바닥 심연으로 떨어지면 이전 세계로 추락합니다!',
    '&bull; <b>단계별 난이도 상승 (Medium &rarr; Grandmaster):</b> 1스테이지(보통)부터 시작해 위로 올라갈수록 발판이 좁아지며 무너지는 돌(<kbd>K</kbd>), 빙판(<kbd>I</kbd>), 돌풍(<kbd>W/M</kbd>)이 결합됩니다.',
    '&bull; <b>창세자 신장 &amp; 원소 오라 무기:</b> 13종 업적을 달성하거나 천사 날개와 망토가 달린 <b>[창세] 아키텍트 스킨</b> 및 점프할 때마다 검기를 발산하는 20종 무기/방패를 장착해 보세요.',
    '&bull; <b>화면 비율 전환 (<kbd>V</kbd> 키):</b> 언제든 <kbd>V</kbd> 키를 눌러 4:3 표준, 원본 픽셀, 16:9 와이드, 모바일 세로/가로, 균형 전체화면 모드를 전환할 수 있습니다.'
  ],

  crestPause: 'CHAMBER OF REST',
  pauseTitle: '여정 일시 정지',
  pauseSubtitle: '현재 등반 위치가 자동으로 저장되었습니다',
  btnPauseResume: '[ I ] 등반 계속하기 (Esc / P)',
  btnPauseRestart: '[ II ] 현재 스테이지 처음부터 다시 시작',
  btnPauseLanguage: '언어 설정 (Language)',
  btnPauseRatio: '화면 비율 (단축키 V)',
  btnPauseSound: '사운드 및 배경음악',
  btnPauseFx: '시각 효과 (FX)',
  btnPauseMenu: '저장 후 성채 홀로 나가기',

  crestWin: 'SUMMIT CONQUERED',
  winTitleRelic: '전설의 유물 발견 & 정상 정복',
  winTitleSummit: '대성채 최정상 정복 완료',
  winSubtitle: (name) => `클리어한 세계: <b>${name}</b>`,
  winRelicBannerTitle: '첨탑의 숨겨진 고대 유물을 발견했습니다!',
  winRelicBannerSub: (relicName, total) =>
    `유물: <b style="color:#e8c170;">${relicName}</b> &nbsp;|&nbsp; 수집 현황: <b>${total}/100</b>`,
  winTimeLabel: '클리어 시간 (Speedrun):',
  winJumpsFallsLabel: '총 점프 횟수 / 추락 횟수:',
  winJumpsFallsVal: (j, f) => `${j}회 점프 &nbsp;|&nbsp; ${f}회 추락`,
  winLeaderboardTitle: (name) => `스피드런 명예의 전당 (${name})`,
  btnWinNext: '[ I ] 다음 세계로 진격',
  btnWinReplay: '[ I ] 1스테이지부터 새 세계 다시 시작 (시드 초기화)',
  btnWinMenu: '성채 중앙 홀로 돌아가기 (Menu)',
  defaultPlayerName: '성운의 방랑기사'
};

const DE_STRINGS: UiStrings = {
  stageCounter: (cur, total) => `Stufe ${cur}/${total}`,
  floorCounter: (cur, total) => `Ebene ${cur}/${total}`,
  fallsCount: (count) => `Stürze: ${count}`,
  jumpsCount: (count) => `${count} Sprünge`,
  soundShort: 'Ton',
  fxShort: 'FX',
  onLabel: 'AN',
  offLabel: 'AUS',
  activeLabel: 'AKTIV',
  mutedLabel: 'STUMM',
  aspectRatioBtn: (shortMode) => `Format: ${shortMode}`,
  menuEscBtn: 'Menü (Esc)',
  touchLeft: 'LINKS',
  touchRight: 'RECHTS',
  touchJump: 'SPRUNG HALTEN',

  statusSound: (on) => `Audio: ${on ? 'AN' : 'AUS'}`,
  statusFx: (on) => `Grafikeffekte (FX): ${on ? 'AN' : 'AUS'}`,
  statusRatio: (label) => `Bildformat: ${label}`,
  statusRestartBottom: 'Neustart am Fuß der aktuellen Stufe!',
  statusHazardKnockback: 'Falle berührt! Vom Felsvorsprung geschleudert!',
  statusRelicFound: (name) => `Relikt entdeckt: ${name}! Steige weiter zum Gipfel!`,
  statusWorldAscend: (stageStr, name) => `WELT VERBUNDEN -> ${stageStr}: ${name}`,
  statusWorldDescend: (stageStr, name) => `DURCH DEN ABGRUND GEFALLEN -> Zurück zu ${stageStr}: ${name}`,

  displayModes: {
    'auto-fit': 'Auto 4:3 Standard (Ohne Verzerrung)',
    'pixel-perfect': 'Original Pixel 1x/2x/3x (Ultrascharf)',
    'desktop-16-9': 'Desktop-Breitbild (16:9 Rahmen)',
    'mobile-portrait': 'Mobil Hochformat (9:16 + Touchpad)',
    'mobile-landscape': 'Mobil Querformat (16:9 + Touchpad)',
    'full-stretch': 'Randlos Ausgewogen (Kein Breiten-Verzerren)'
  },
  displayModesShort: {
    'auto-fit': '4:3 Auto',
    'pixel-perfect': 'Pixel 1x/2x',
    'desktop-16-9': 'Desktop 16:9',
    'mobile-portrait': 'Mobil 9:16',
    'mobile-landscape': 'Mobil Quer',
    'full-stretch': 'Randlos'
  },
  controlSchemes: {
    both: 'WASD + Pfeiltasten kombiniert',
    wasd: 'Nur WASD + Leertaste',
    arrows: 'Nur Pfeiltasten + Leertaste'
  },

  crestMain: 'CITADEL CHRONICLES',
  gameTitle: 'SKYBOUND KNIGHT',
  mainSubtitle: '100 Verbundene Welten • 19 Universen • Präzisions-Aufstieg',
  stat100StagesVal: (count) => `${count} STUFEN`,
  stat100StagesLbl: '19 Hauptuniversen',
  statRelicsLbl: 'Entdeckte Relikte',
  statSummitsLbl: 'Eroberte Gipfel',
  equippedLabel: (skinName) => `Rüstung: ${skinName}`,
  equippedSubLabel: (weaponName, shieldName) => `Waffe: ${weaponName} • Schild: ${shieldName}`,
  changeLoadoutBtn: 'Ausrüstung ändern',
  btnContinue: (worldName) => `[ I ] Aufstieg fortsetzen (${worldName})`,
  badgeFloor: (floor) => `EBENE ${floor}`,
  btnNewGame: (roman) => `[ ${roman} ] Vom Fuß der Zitadelle starten`,
  badgeStage01: 'STUFE 01',
  btnArmory: '[ RÜSTKAMMER ] Rüstungen, Waffen & Errungenschaften',
  badgeArmory: '14 RÜSTUNGEN • 20 OBJEKTE',
  btnSelectWorld: '[ WELTATLAS ] Verzeichnis aller 100 Welten',
  btnSpeedrun: '[ RUHMESHALLE ] Speedrun-Rekorde & Geheimrelikte',
  badgeRelicsCount: (found, total) => `${found}/${total} RELIKTE`,
  btnSettings: '[ EINSTELLUNGEN ] Sprache, Bildformat, Audio & Tasten',
  btnHowTo: '[ KODEX ] Geländemechanik & Spielregeln',
  btnBackMain: 'Zurück zum Zitadellenhof',

  crestArmory: 'ROYAL ARMORY',
  armoryTitle: 'KÖNIGLICHE RÜSTKAMMER',
  armorySubtitle: 'Schalte Rüstungen, leuchtende Klingen, Stäbe und Schilde über Erfolge oder den Testmodus frei',
  subtabSkins: (c) => `Rüstungen (${c})`,
  subtabWeapons: (c) => `Waffen (${c})`,
  subtabShields: (c) => `Schilde (${c})`,
  subtabAchievements: (c) => `Erfolge (${c})`,
  careerSummary: (j, f, r) =>
    `Sprünge: <b style="color:#e8c170;">${j}</b> &bull; Stürze: <b style="color:#e8c170;">${f}</b> &bull; Relikte: <b style="color:#e8c170;">${r}</b>`,
  unlockAllOn: 'Alles freischalten (Testmodus): AN',
  unlockAllOff: 'Alles freischalten (Freier Testmodus)',
  badgeEquippedSkin: 'ANGELEGT',
  badgeEquippedWeapon: 'GEFÜHRT',
  badgeEquippedShield: 'ANGELEGT',
  badgeUnlocked: 'FREIGESCHALTET',
  badgeLocked: 'GESPERRT',
  badgeCompleted: 'VOLLENDET',

  crestWorlds: 'ATLAS OF 100 LINKED REALMS',
  worldsTitle: (c) => `VERBUNDENE WELT WÄHLEN (${c} KARTEN)`,
  worldsSubtitle: 'Alle 100 Welten gehen nahtlos von Stufe 1 bis Stufe 100 ineinander über',
  filterAll: (c) => `Alle (${c})`,
  relicTag: '[RELIKT] ',
  relicFoundOnly: 'Relikt geborgen',
  unconquered: 'Unbezwungen',

  crestSpeedrun: 'HALL OF RECORDS',
  speedrunTitle: 'SPEEDRUN-RUHMESHALLE',
  speedrunSubtitle: 'Schnellste Aufstiegszeiten & Sammlung der 100 Uralten Relikte',
  knightTitleLabel: 'Dein Rittertitel:',
  saveTitleBtn: 'Titel speichern',
  selectWorldLabel: 'Weltstufe auswählen:',
  mapRelicLabel: 'Stufen-Relikt:',
  badgeCollected: 'GEBORGEN',
  badgeUndiscovered: 'UNENTDECKT',
  thRank: 'Rang',
  thKnight: 'Ritter',
  thTime: 'Zeit',
  thFalls: 'Stürze',
  rank1: 'RANG I',
  rank2: 'RANG II',
  rank3: 'RANG III',
  btnPlaySpeedrun: 'Speedrun auf dieser Stufe starten',
  badgeLaunch: 'START',

  crestSettings: 'SYSTEM CONFIGURATION',
  settingsTitle: 'SYSTEMEINSTELLUNGEN',
  settingsSubtitle: 'Sprache, pixelgenaues Bildformat, Klangkulisse und Tastenbelegung anpassen',
  settingLanguage: 'Spielsprache (Language)',
  settingDisplay: 'Bildschirmformat (Desktop / Mobil)',
  settingSound: 'Soundeffekte (Themen-SFX)',
  settingMusic: 'Mehrstimmiger Soundtrack (Melodie + Bass + Schlagzeug)',
  settingVolume: 'Gesamtlautstärke',
  settingFx: 'Partikeleffekte, Nachbilder & Kamerabeben',
  settingKeys: 'Tastatursteuerung',

  crestHowTo: 'CODEX OF ASCENSION',
  howToTitle: 'KODEX DES AUFSTIEGS',
  howToSubtitle: 'Steuerung, Geländemechaniken und Regeln des nahtlosen 100-Welten-Turms',
  howToParagraphs: [
    '&bull; <b>Bewegung &amp; Sprungkraft:</b> Nutze <kbd>A</kbd>/<kbd>D</kbd> oder <kbd>Links</kbd>/<kbd>Rechts</kbd> zum Gehen. Halte <kbd>Leertaste</kbd> (<kbd>W</kbd>/<kbd>Oben</kbd>) gedrückt, um Kraft zu sammeln, und <b>lasse los</b>, um in die gehaltene Richtung zu springen.',
    '&bull; <b>Nahtloser 100-Welten-Turm (Keine Checkpoints):</b> Alle 100 Welten sind direkt verbunden. Am Gipfel von Ebene 6 steigst du nahtlos in die nächste Welt samt Musikwechsel auf. Ein Sturz in den Abgrund von Ebene 1 wirft dich in die vorherige Welt zurück!',
    '&bull; <b>Steigender Schwierigkeitsgrad (Medium &rarr; Grandmaster):</b> Stufe 1 beginnt auf Mittel. Höhere Stufen verlangen höchste Präzision auf schmalen Simssteinen mit bröckelndem Fels (<kbd>K</kbd>), Glatteis (<kbd>I</kbd>) und Seitenwinden (<kbd>W/M</kbd>).',
    '&bull; <b>Schöpfer-Rüstungen &amp; Elementarwaffen:</b> Meistere 13 Erfolge oder trage die <b>[SCHÖPFER]-Architektenrüstungen</b> mit Flügeln, Umhang und 20 leuchtenden Elementarwaffen.',
    '&bull; <b>Bildformat (<kbd>V</kbd>-Taste):</b> Drücke jederzeit <kbd>V</kbd>, um zwischen 4:3 Standard, Original-Pixel, 16:9 Breitbild, Mobilformat oder Randlos Ausgewogen zu wechseln.'
  ],

  crestPause: 'CHAMBER OF REST',
  pauseTitle: 'REISE UNTERBROCHEN',
  pauseSubtitle: 'Deine aktuelle Position im Turm wurde automatisch gespeichert',
  btnPauseResume: '[ I ] Aufstieg fortsetzen (Esc / P)',
  btnPauseRestart: '[ II ] Vom Fuß dieser Stufe neu starten',
  btnPauseLanguage: 'Sprache (Language)',
  btnPauseRatio: 'Bildformat (Taste V)',
  btnPauseSound: 'Ton &amp; Musik',
  btnPauseFx: 'Grafikeffekte (FX)',
  btnPauseMenu: 'Speichern &amp; Zurück zum Zitadellenhof',

  crestWin: 'SUMMIT CONQUERED',
  winTitleRelic: 'GEHEIMRELIKT & GIPFEL EROBERT',
  winTitleSummit: 'GIPFEL DER ZITADELLE EROBERT',
  winSubtitle: (name) => `Abgeschlossene Welt: <b>${name}</b>`,
  winRelicBannerTitle: 'URALTES TURMRELIKT ENTDECKT!',
  winRelicBannerSub: (relicName, total) =>
    `Relikt: <b style="color:#e8c170;">${relicName}</b> &nbsp;|&nbsp; Sammlung: <b>${total}/100</b> Relikte`,
  winTimeLabel: 'Abschlusszeit (Speedrun):',
  winJumpsFallsLabel: 'Sprünge gesamt / Stürze:',
  winJumpsFallsVal: (j, f) => `${j} Sprünge &nbsp;|&nbsp; ${f} Stürze`,
  winLeaderboardTitle: (name) => `SPEEDRUN-BESTENLISTE (${name})`,
  btnWinNext: '[ I ] Aufstieg in die nächste Welt',
  btnWinReplay: '[ I ] Neue Weltreise ab Stufe 1 starten (Seed-Reset)',
  btnWinMenu: 'Zurück zum Zitadellenhof (Menü)',
  defaultPlayerName: 'Sternenwanderer'
};

const FR_STRINGS: UiStrings = {
  stageCounter: (cur, total) => `Étape ${cur}/${total}`,
  floorCounter: (cur, total) => `Étage ${cur}/${total}`,
  fallsCount: (count) => `Chutes : ${count}`,
  jumpsCount: (count) => `${count} sauts`,
  soundShort: 'Son',
  fxShort: 'FX',
  onLabel: 'OUI',
  offLabel: 'NON',
  activeLabel: 'ACTIVÉ',
  mutedLabel: 'DÉSACTIVÉ',
  aspectRatioBtn: (shortMode) => `Format : ${shortMode}`,
  menuEscBtn: 'Menu (Échap)',
  touchLeft: 'GAUCHE',
  touchRight: 'DROITE',
  touchJump: 'MAINTENIR SAUT',

  statusSound: (on) => `Audio : ${on ? 'ACTIVÉ' : 'DÉSACTIVÉ'}`,
  statusFx: (on) => `Effets visuels (FX) : ${on ? 'ACTIVÉS' : 'DÉSACTIVÉS'}`,
  statusRatio: (label) => `Format d’écran : ${label}`,
  statusRestartBottom: 'Recommencé au pied de l’étape actuelle !',
  statusHazardKnockback: 'Piège touché ! Projeté hors de la corniche !',
  statusRelicFound: (name) => `Relique découverte : ${name} ! Continuez vers le Sommet !`,
  statusWorldAscend: (stageStr, name) => `MONDE RELIÉ -> ${stageStr} : ${name}`,
  statusWorldDescend: (stageStr, name) => `CHUTE À TRAVERS L’ABÎME -> Retour à ${stageStr} : ${name}`,

  displayModes: {
    'auto-fit': 'Standard 4:3 Auto (Sans déformation)',
    'pixel-perfect': 'Pixel Natif 1x/2x/3x (Ultra net)',
    'desktop-16-9': 'Grand Écran Bureau (Cadre 16:9)',
    'mobile-portrait': 'Mobile Portrait (9:16 + Pavé tactile)',
    'mobile-landscape': 'Mobile Paysage (16:9 + Pavé tactile)',
    'full-stretch': 'Plein Écran Équilibré (Sans étirement horizontal)'
  },
  displayModesShort: {
    'auto-fit': '4:3 Auto',
    'pixel-perfect': 'Pixel 1x/2x',
    'desktop-16-9': 'Bureau 16:9',
    'mobile-portrait': 'Mobile 9:16',
    'mobile-landscape': 'Mobile Large',
    'full-stretch': 'Sans bordure'
  },
  controlSchemes: {
    both: 'WASD / ZQSD + Flèches directionnelles',
    wasd: 'Touches A/D/W + Espace uniquement',
    arrows: 'Flèches + Espace uniquement'
  },

  crestMain: 'CITADEL CHRONICLES',
  gameTitle: 'SKYBOUND KNIGHT',
  mainSubtitle: '100 Mondes Reliés • 19 Univers • Ascension de Haute Précision',
  stat100StagesVal: (count) => `${count} ÉTAPES`,
  stat100StagesLbl: '19 Univers Majeurs',
  statRelicsLbl: 'Reliques Découvertes',
  statSummitsLbl: 'Sommets Conquis',
  equippedLabel: (skinName) => `Armure : ${skinName}`,
  equippedSubLabel: (weaponName, shieldName) => `Arme : ${weaponName} • Bouclier : ${shieldName}`,
  changeLoadoutBtn: 'Changer d’Équipement',
  btnContinue: (worldName) => `[ I ] Poursuivre l’Ascension (${worldName})`,
  badgeFloor: (floor) => `ÉTAGE ${floor}`,
  btnNewGame: (roman) => `[ ${roman} ] Partir du Pied de la Citadelle`,
  badgeStage01: 'ÉTAPE 01',
  btnArmory: '[ ARMURERIE ] Armures, Armes & Hauts Faits',
  badgeArmory: '14 ARMURES • 20 RELIQUES',
  btnSelectWorld: '[ ATLAS ] Répertoire des 100 Mondes Reliés',
  btnSpeedrun: '[ PANTHÉON ] Records Speedrun & Reliques Secrètes',
  badgeRelicsCount: (found, total) => `${found}/${total} RELIQUES`,
  btnSettings: '[ PARAMÈTRES ] Langue, Format d’Écran, Audio & Commandes',
  btnHowTo: '[ CODEX ] Mécaniques de Terrain & Règles',
  btnBackMain: 'Retourner à la Cour de la Citadelle',

  crestArmory: 'ROYAL ARMORY',
  armoryTitle: 'ARMURERIE ROYALE & HÉROS',
  armorySubtitle: 'Débloquez des armures, lames ardentes, bâtons et boucliers via les Hauts Faits ou le Mode Essai Libre',
  subtabSkins: (c) => `Armures (${c})`,
  subtabWeapons: (c) => `Armes (${c})`,
  subtabShields: (c) => `Boucliers (${c})`,
  subtabAchievements: (c) => `Hauts Faits (${c})`,
  careerSummary: (j, f, r) =>
    `Sauts : <b style="color:#e8c170;">${j}</b> &bull; Chutes : <b style="color:#e8c170;">${f}</b> &bull; Reliques : <b style="color:#e8c170;">${r}</b>`,
  unlockAllOn: 'Tout Débloquer (Essai Libre) : OUI',
  unlockAllOff: 'Tout Débloquer (Mode Essai Libre)',
  badgeEquippedSkin: 'PORTÉE',
  badgeEquippedWeapon: 'BRANDIE',
  badgeEquippedShield: 'ÉQUIPÉ',
  badgeUnlocked: 'DÉBLOQUÉ',
  badgeLocked: 'VERROUILLÉ',
  badgeCompleted: 'ACCOMPLI',

  crestWorlds: 'ATLAS OF 100 LINKED REALMS',
  worldsTitle: (c) => `CHOISIR UN MONDE RELIÉ (${c} CARTES)`,
  worldsSubtitle: 'Les 100 Mondes s’enchaînent sans transition de l’Étape 1 à l’Étape 100',
  filterAll: (c) => `Tous (${c})`,
  relicTag: '[RELIQUE] ',
  relicFoundOnly: 'Relique trouvée',
  unconquered: 'Inexploré',

  crestSpeedrun: 'HALL OF RECORDS',
  speedrunTitle: 'PANTHÉON DU SPEEDRUN',
  speedrunSubtitle: 'Meilleurs temps d’ascension & Collection des 100 Reliques Anciennes',
  knightTitleLabel: 'Votre Titre de Chevalier :',
  saveTitleBtn: 'Enregistrer',
  selectWorldLabel: 'Consulter le Monde :',
  mapRelicLabel: 'Relique du Monde :',
  badgeCollected: 'OBTENUE',
  badgeUndiscovered: 'INCONNUE',
  thRank: 'Rang',
  thKnight: 'Chevalier',
  thTime: 'Temps',
  thFalls: 'Chutes',
  rank1: 'RANG I',
  rank2: 'RANG II',
  rank3: 'RANG III',
  btnPlaySpeedrun: 'Lancer un Speedrun sur ce Monde',
  badgeLaunch: 'DÉPART',

  crestSettings: 'SYSTEM CONFIGURATION',
  settingsTitle: 'PARAMÈTRES DU SYSTÈME',
  settingsSubtitle: 'Configurez la langue, le format d’image pixel-art, la musique et les touches',
  settingLanguage: 'Langue du Jeu (Language)',
  settingDisplay: 'Format d’Écran (Bureau / Mobile)',
  settingSound: 'Effets Sonores (SFX par Univers)',
  settingMusic: 'Musique Polyphonique (Mélodie + Basse + Batterie)',
  settingVolume: 'Volume Principal',
  settingFx: 'Particules, Persistance (Trail) & Secousses',
  settingKeys: 'Configuration du Clavier',

  crestHowTo: 'CODEX OF ASCENSION',
  howToTitle: 'CODEX DE L’ASCENSION',
  howToSubtitle: 'Commandes, mécaniques de terrain et règles de la Tour des 100 Mondes',
  howToParagraphs: [
    '&bull; <b>Déplacement &amp; Saut Chargé :</b> Utilisez <kbd>A</kbd>/<kbd>D</kbd> ou <kbd>Gauche</kbd>/<kbd>Droite</kbd> pour marcher. Maintenez <kbd>Espace</kbd> (<kbd>W</kbd>/<kbd>Haut</kbd>) pour concentrer votre force et <b>relâchez</b> pour bondir.',
    '&bull; <b>Tour Continue de 100 Mondes (Sans Checkpoint) :</b> Les 100 Mondes sont directement reliés. Franchir le sommet de l’Étage 6 vous propulse dans le Monde suivant avec transition musicale automatique. Tomber dans l’abîme du 1er étage vous ramène au Monde précédent !',
    '&bull; <b>Difficulté Progressive (Medium &rarr; Grandmaster) :</b> L’Étape 1 débute en difficulté Moyenne. Plus vous montez, plus les corniches se réduisent avec pierres friables (<kbd>K</kbd>), glace vive (<kbd>I</kbd>) et bourrasques (<kbd>W/M</kbd>).',
    '&bull; <b>Armures de Créateur &amp; Armes Élémentaires :</b> Accomplissez 13 Hauts Faits ou revêtez les <b>Armures d’Architecte [CRÉATEUR]</b> dotées d’ailes, de capes et de 20 armes/boucliers projetant des lames d’énergie.',
    '&bull; <b>Format d’Écran (Touche <kbd>V</kbd>) :</b> Appuyez sur <kbd>V</kbd> pour basculer entre Standard 4:3, Pixel Natif, Bureau 16:9, Mobile Portrait/Paysage ou Plein Écran Équilibré.'
  ],

  crestPause: 'CHAMBER OF REST',
  pauseTitle: 'ASCENSION EN PAUSE',
  pauseSubtitle: 'Votre position actuelle dans la tour a été sauvegardée automatiquement',
  btnPauseResume: '[ I ] Reprendre l’Ascension (Échap / P)',
  btnPauseRestart: '[ II ] Recommencer au Pied de cette Étape',
  btnPauseLanguage: 'Langue (Language)',
  btnPauseRatio: 'Format d’écran (Touche V)',
  btnPauseSound: 'Audio &amp; Musique',
  btnPauseFx: 'Effets Visuels (FX)',
  btnPauseMenu: 'Sauvegarder &amp; Retourner à la Citadelle',

  crestWin: 'SUMMIT CONQUERED',
  winTitleRelic: 'RELIQUE SUPRÊME & SOMMET CONQUIS',
  winTitleSummit: 'SOMMET DE LA CITADELLE CONQUIS',
  winSubtitle: (name) => `Monde accompli : <b>${name}</b>`,
  winRelicBannerTitle: 'RELIQUE SECRÈTE DE LA TOUR DÉCOUVERTE !',
  winRelicBannerSub: (relicName, total) =>
    `Relique : <b style="color:#e8c170;">${relicName}</b> &nbsp;|&nbsp; Collection : <b>${total}/100</b> Reliques`,
  winTimeLabel: 'Temps d’Ascension (Speedrun) :',
  winJumpsFallsLabel: 'Total de sauts / Chutes lourdes :',
  winJumpsFallsVal: (j, f) => `${j} sauts &nbsp;|&nbsp; ${f} chutes`,
  winLeaderboardTitle: (name) => `CLASSEMENT SPEEDRUN (${name})`,
  btnWinNext: '[ I ] Monter vers le Monde Suivant',
  btnWinReplay: '[ I ] Nouveau Monde depuis l’Étape 1 (Reset Seed)',
  btnWinMenu: 'Retourner à la Cour de la Citadelle (Menu)',
  defaultPlayerName: 'Chevalier Stellaire'
};

const RU_STRINGS: UiStrings = {
  stageCounter: (cur, total) => `Этап ${cur}/${total}`,
  floorCounter: (cur, total) => `Ярус ${cur}/${total}`,
  fallsCount: (count) => `Падений: ${count}`,
  jumpsCount: (count) => `${count} прыжков`,
  soundShort: 'Звук',
  fxShort: 'FX',
  onLabel: 'ВКЛ',
  offLabel: 'ВЫКЛ',
  activeLabel: 'ВКЛЮЧЕНО',
  mutedLabel: 'ВЫКЛЮЧЕНО',
  aspectRatioBtn: (shortMode) => `Экран: ${shortMode}`,
  menuEscBtn: 'Меню (Esc)',
  touchLeft: 'ВЛЕВО',
  touchRight: 'ВПРАВО',
  touchJump: 'ЗАЖАТЬ ПРЫЖОК',

  statusSound: (on) => `Звук и музыка: ${on ? 'ВКЛ' : 'ВЫКЛ'}`,
  statusFx: (on) => `Визуальные эффекты (FX): ${on ? 'ВКЛ' : 'ВЫКЛ'}`,
  statusRatio: (label) => `Формат экрана: ${label}`,
  statusRestartBottom: 'Восхождение начато с подножия текущего этапа!',
  statusHazardKnockback: 'Ловушка! Вас сбросило с уступа!',
  statusRelicFound: (name) => `Найдена реликвия: «${name}»! Продолжайте путь к вершине!`,
  statusWorldAscend: (stageStr, name) => `ПЕРЕХОД В НОВЫЙ МИР -> ${stageStr}: ${name}`,
  statusWorldDescend: (stageStr, name) => `ПАДЕНИЕ СКВОЗЬ МИРЫ -> Возврат на ${stageStr}: ${name}`,

  displayModes: {
    'auto-fit': 'Авто 4:3 Стандарт (Без искажений)',
    'pixel-perfect': 'Нативный Пиксель 1x/2x/3x (Чёткий)',
    'desktop-16-9': 'Широкий экран ПК (Рамка 16:9)',
    'mobile-portrait': 'Смартфон Портрет (9:16 + Геймпад)',
    'mobile-landscape': 'Смартфон Альбом (16:9 + Геймпад)',
    'full-stretch': 'Безрамочный Баланс (Без растяжения по ширине)'
  },
  displayModesShort: {
    'auto-fit': '4:3 Авто',
    'pixel-perfect': 'Пиксель 1x/2x',
    'desktop-16-9': 'ПК 16:9',
    'mobile-portrait': 'Моб. 9:16',
    'mobile-landscape': 'Моб. Альбом',
    'full-stretch': 'Без рамки'
  },
  controlSchemes: {
    both: 'WASD + Стрелки одновременно',
    wasd: 'Только WASD + Пробел',
    arrows: 'Только Стрелки + Пробел'
  },

  crestMain: 'CITADEL CHRONICLES',
  gameTitle: 'SKYBOUND KNIGHT',
  mainSubtitle: '100 Связанных Миров • 19 Вселенных • Хардкорное Восхождение',
  stat100StagesVal: (count) => `${count} ЭТАПОВ`,
  stat100StagesLbl: '19 Главных Вселенных',
  statRelicsLbl: 'Найдено Реликвий',
  statSummitsLbl: 'Покорено Вершин',
  equippedLabel: (skinName) => `Доспех: ${skinName}`,
  equippedSubLabel: (weaponName, shieldName) => `Оружие: ${weaponName} • Щит: ${shieldName}`,
  changeLoadoutBtn: 'Сменить Снаряжение',
  btnContinue: (worldName) => `[ I ] Продолжить Восхождение (${worldName})`,
  badgeFloor: (floor) => `ЯРУС ${floor}`,
  btnNewGame: (roman) => `[ ${roman} ] Начать от Подножия Цитадели`,
  badgeStage01: 'ЭТАП 01',
  btnArmory: '[ АРСЕНАЛ ] Доспехи, Оружие и Достижения',
  badgeArmory: '14 ДОСПЕХОВ • 20 ПРЕДМЕТОВ',
  btnSelectWorld: '[ АТЛАС ] Каталог 100 Связанных Миров',
  btnSpeedrun: '[ ЗАЛ СЛАВЫ ] Рекорды Спидрана и Реликвии',
  badgeRelicsCount: (found, total) => `${found}/${total} РЕЛИКВИЙ`,
  btnSettings: '[ НАСТРОЙКИ ] Язык, Формат Экрана, Звук и Управление',
  btnHowTo: '[ КОДЕКС ] Механика Территории и Правила',
  btnBackMain: 'Вернуться в Зал Цитадели',

  crestArmory: 'ROYAL ARMORY',
  armoryTitle: 'КОРОЛЕВСКИЙ АРСЕНАЛ',
  armorySubtitle: 'Открывайте доспехи, сияющие клинки, посохи и щиты за достижения или в режиме примерки',
  subtabSkins: (c) => `Доспехи (${c})`,
  subtabWeapons: (c) => `Оружие (${c})`,
  subtabShields: (c) => `Щиты (${c})`,
  subtabAchievements: (c) => `Достижения (${c})`,
  careerSummary: (j, f, r) =>
    `Прыжки: <b style="color:#e8c170;">${j}</b> &bull; Падения: <b style="color:#e8c170;">${f}</b> &bull; Реликвии: <b style="color:#e8c170;">${r}</b>`,
  unlockAllOn: 'Открыть Всё (Примерка): ВКЛ',
  unlockAllOff: 'Открыть Всё (Режим Примерки)',
  badgeEquippedSkin: 'НАДЕТО',
  badgeEquippedWeapon: 'В РУКАХ',
  badgeEquippedShield: 'ЭКИПИРОВАН',
  badgeUnlocked: 'ОТКРЫТО',
  badgeLocked: 'ЗАКРЫТО',
  badgeCompleted: 'ВЫПОЛНЕНО',

  crestWorlds: 'ATLAS OF 100 LINKED REALMS',
  worldsTitle: (c) => `ВЫБОР СВЯЗАННОГО МИРА (${c} КАРТ)`,
  worldsSubtitle: 'Все 100 миров непрерывно соединены с 1-го по 100-й этап',
  filterAll: (c) => `Все (${c})`,
  relicTag: '[РЕЛИКВИЯ] ',
  relicFoundOnly: 'Реликвия найдена',
  unconquered: 'Не покорено',

  crestSpeedrun: 'HALL OF RECORDS',
  speedrunTitle: 'ЗАЛ СЛАВЫ СПИДРАНА',
  speedrunSubtitle: 'Лучшее время восхождения и коллекция из 100 Древних Реликвий',
  knightTitleLabel: 'Ваш Рыцарский Титул:',
  saveTitleBtn: 'Сохранить',
  selectWorldLabel: 'Выберите мир:',
  mapRelicLabel: 'Реликвия мира:',
  badgeCollected: 'СОБРАНО',
  badgeUndiscovered: 'НЕ НАЙДЕНО',
  thRank: 'Ранг',
  thKnight: 'Рыцарь',
  thTime: 'Время',
  thFalls: 'Падения',
  rank1: 'РАНГ I',
  rank2: 'РАНГ II',
  rank3: 'РАНГ III',
  btnPlaySpeedrun: 'Начать Спидран на Этом Этапе',
  badgeLaunch: 'СТАРТ',

  crestSettings: 'SYSTEM CONFIGURATION',
  settingsTitle: 'СИСТЕМНЫЕ НАСТРОЙКИ',
  settingsSubtitle: 'Настройка языка, пиксельного формата экрана, музыки и клавиш управления',
  settingLanguage: 'Язык игры (Language)',
  settingDisplay: 'Формат экрана (ПК / Смартфон)',
  settingSound: 'Звуковые эффекты (SFX вселенных)',
  settingMusic: 'Полифоническая музыка (Мелодия + Бас + Ударные)',
  settingVolume: 'Общая громкость',
  settingFx: 'Частицы, шлейф (Trail) и тряска камеры',
  settingKeys: 'Схема управления клавиатурой',

  crestHowTo: 'CODEX OF ASCENSION',
  howToTitle: 'КОДЕКС ВОСХОЖДЕНИЯ',
  howToSubtitle: 'Управление, механика уступов и правила единой Башни 100 Миров',
  howToParagraphs: [
    '&bull; <b>Движение и заряд прыжка:</b> Нажимайте <kbd>A</kbd>/<kbd>D</kbd> или <kbd>Влево</kbd>/<kbd>Вправо</kbd> для шага. Удерживайте <kbd>Пробел</kbd> (<kbd>W</kbd>/<kbd>Вверх</kbd>) для накопления силы и <b>отпустите</b> для прыжка в выбранную сторону.',
    '&bull; <b>Единая Башня 100 Миров (Без Чекпоинтов):</b> Все 100 миров связаны напрямую. Прыжок через вершину 6-го яруса мгновенно переносит вас в следующий мир со сменой музыки и декораций, а падение в бездну 1-го яруса сбрасывает в предыдущий мир!',
    '&bull; <b>Растущая сложность (Medium &rarr; Grandmaster):</b> 1-й этап начинается со средней сложности. Чем выше уровень, тем уже уступы, больше рушащихся камней (<kbd>K</kbd>), скользкого льда (<kbd>I</kbd>) и вихрей (<kbd>W/M</kbd>).',
    '&bull; <b>Доспехи Творца и Стихийное Оружие:</b> Выполните 13 достижений или облачитесь в <b>Доспехи Архитектора [ТВОРЕЦ]</b> с крыльями, плащом и 20 видами сияющего оружия.',
    '&bull; <b>Формат экрана (Клавиша <kbd>V</kbd>):</b> Нажмите <kbd>V</kbd> в любой момент для переключения между 4:3, Нативным Пикселем, 16:9, Мобильным режимом или Безрамочным Балансом.'
  ],

  crestPause: 'CHAMBER OF REST',
  pauseTitle: 'ВОСХОЖДЕНИЕ НА ПАУЗЕ',
  pauseSubtitle: 'Ваша текущая позиция в башне сохранена автоматически',
  btnPauseResume: '[ I ] Продолжить Восхождение (Esc / P)',
  btnPauseRestart: '[ II ] Начать с Подножия Текущего Этапа',
  btnPauseLanguage: 'Язык (Language)',
  btnPauseRatio: 'Формат экрана (Клавиша V)',
  btnPauseSound: 'Звук и Музыка',
  btnPauseFx: 'Визуальные эффекты (FX)',
  btnPauseMenu: 'Сохранить и Выйти в Зал Цитадели',

  crestWin: 'SUMMIT CONQUERED',
  winTitleRelic: 'ТАЙНАЯ РЕЛИКВИЯ И ВЕРШИНА ПОКОРЕНЫ',
  winTitleSummit: 'ВЕРШИНА ЦИТАДЕЛИ ПОКОРЕНА',
  winSubtitle: (name) => `Пройден мир: <b>${name}</b>`,
  winRelicBannerTitle: 'ОБНАРУЖЕНА ДРЕВНЯЯ РЕЛИКВИЯ БАШНИ!',
  winRelicBannerSub: (relicName, total) =>
    `Реликвия: <b style="color:#e8c170;">${relicName}</b> &nbsp;|&nbsp; Собрано: <b>${total}/100</b>`,
  winTimeLabel: 'Время прохождения (Спидран):',
  winJumpsFallsLabel: 'Всего прыжков / Падений:',
  winJumpsFallsVal: (j, f) => `${j} прыжков &nbsp;|&nbsp; ${f} падений`,
  winLeaderboardTitle: (name) => `ТАБЛИЦА РЕКОРДОВ (${name})`,
  btnWinNext: '[ I ] Подняться в Следующий Мир',
  btnWinReplay: '[ I ] Начать Новый Мир с 1-го этапа (Сброс сида)',
  btnWinMenu: 'Вернуться в Зал Цитадели (Меню)',
  defaultPlayerName: 'Звёздный Странник'
};

const DICTIONARIES: Record<GameLanguage, UiStrings> = {
  'en-US': EN_US_STRINGS,
  'en-GB': EN_GB_STRINGS,
  vi: VI_STRINGS,
  zh: ZH_STRINGS,
  ko: KO_STRINGS,
  de: DE_STRINGS,
  fr: FR_STRINGS,
  ru: RU_STRINGS
};

interface LocalizedEquipText {
  name: string;
  title?: string;
  category?: string;
  description: string;
  achievementDesc: string;
}

const SKIN_EN_TEXTS: Record<CharacterSkinId, LocalizedEquipText> = {
  'knight-skybound': {
    name: 'Skybound Vanguard',
    title: 'Citadel Recruit',
    description: 'Traditional silver-azure plate armor of the Citadel Order with a blazing orange scarf.',
    achievementDesc: 'Default — Unlocked from the start'
  },
  'paladin-solaris': {
    name: 'Solaris Paladin',
    title: 'Tower Conqueror',
    description: 'Gilded solar armor forged in the sacred flames of the first summit.',
    achievementDesc: 'Achievement: Conquer at least 1 Tower World'
  },
  'ranger-sylvan': {
    name: 'Sylvan Wayfarer',
    title: 'Elderwood Strider',
    description: 'Emerald woodland cloak woven with ancient wind-walking runes.',
    achievementDesc: 'Achievement: Perform 25 total jumps across the tower'
  },
  'archmage-astral': {
    name: 'Astral Archmage',
    title: 'Relic Seeker',
    description: 'Starlight magister robes infused with echoes of hidden tower vaults.',
    achievementDesc: 'Achievement: Uncover at least 1 Secret Easter Egg Relic'
  },
  'ronin-crimson': {
    name: 'Bloodmoon Ronin',
    title: 'Multiverse Wanderer',
    description: 'Crimson samurai battle-gear tempered across three distinct realms.',
    achievementDesc: 'Achievement: Conquer 3 different Worlds'
  },
  'warden-abyss': {
    name: 'Sculk Abyss Warden',
    title: 'Unbreakable Will',
    description: 'Deep-dark obsidian sentinel armor forged through relentless falls and recoveries.',
    achievementDesc: 'Achievement: Endure 10 hard falls and rise again'
  },
  'maestro-neon': {
    name: 'Synthwave Maestro',
    title: 'Rhythm Master',
    description: 'Cyber-neon headliner suit pulsing to the beat of stadium lights.',
    achievementDesc: 'Achievement: Uncover 3 Secret Easter Egg Relics'
  },
  'monarch-eternal': {
    name: 'Eternal Sovereign',
    title: 'Citadel Monarch',
    description: 'Imperial golden-crown regalia of the ruler of the 100 linked realms.',
    achievementDesc: 'Achievement: Conquer 5 Worlds or clear any stage under 90s'
  },
  'valkyrie-celestial': {
    name: 'Celestial Valkyrie',
    title: 'Skyward Seraph',
    description: 'Radiant winged battleplate adorned with feathered seraphim wings.',
    achievementDesc: 'Achievement: Perform 100 total jumps across the tower'
  },
  'dragonlord-infernal': {
    name: 'Infernal Dragonlord',
    title: 'Draconic Sovereign',
    description: 'Ancient dragon-scale armor with spreading volcanic ember wings.',
    achievementDesc: 'Achievement: Endure 35 hard falls without giving up'
  },
  'phantom-reaper': {
    name: 'Void Phantom Reaper',
    title: 'Shadow Walker',
    description: 'Wraith shroud woven from soulfire for knights who ascend with zero falls.',
    achievementDesc: 'Achievement: Complete a World with 0 hard falls'
  },
  'creator-architect': {
    name: '[CREATOR] Multiverse Architect',
    title: 'The Grand Architect',
    description: 'Supreme Creator regalia with seraphic wings and golden halo crown.',
    achievementDesc: 'Creator Achievement: Discover 7 Secret Relics (or Unlock All)'
  },
  'creator-pixelgod': {
    name: '[CREATOR] Sovereign Pixel Weaver',
    title: 'Master Artisan',
    description: 'Royal prism mantle of the world-shaping pixel artisan.',
    achievementDesc: 'Creator Achievement: Conquer 10 Worlds (or Unlock All)'
  },
  'creator-chronos': {
    name: '[CREATOR] Chronos Spacetime Lord',
    title: 'Timekeeper Dev',
    description: 'Nebula-winged armor governing the physical laws of all 100 realms.',
    achievementDesc: 'Creator Achievement: 300 Jumps or 20 Worlds (or Unlock All)'
  }
};

const WEAPON_EN_TEXTS: Record<WeaponItemId, LocalizedEquipText> = {
  'weapon-none': {
    name: 'Bare-Handed',
    category: 'Unarmed',
    description: 'Climb with pure martial agility without carrying a weapon.',
    achievementDesc: 'Default — Unlocked from the start'
  },
  'weapon-broadsword': {
    name: 'Knight’s Broadsword',
    category: 'Sword',
    description: 'Balanced steel broadsword of the Skybound Order.',
    achievementDesc: 'Default — Unlocked from the start'
  },
  'weapon-sunblade': {
    name: 'Sunflame Claymore',
    category: 'Sword',
    description: 'Blazing golden greatblade radiating solar fire arcs on every leap.',
    achievementDesc: 'Achievement: Conquer at least 1 Tower World'
  },
  'weapon-archmage-staff': {
    name: 'Archmage Astral Staff',
    category: 'Staff',
    description: 'Ancient staff crowned with a levitating starlight mana core.',
    achievementDesc: 'Default / Arcane Mastery'
  },
  'weapon-dragon-lance': {
    name: 'Emerald Dragon Lance',
    category: 'Spear',
    description: 'Long-reach jade dragon spear piercing through wind currents.',
    achievementDesc: 'Achievement: Uncover at least 1 Secret Relic'
  },
  'weapon-runed-axe': {
    name: 'Runed Sculk Greataxe',
    category: 'Axe',
    description: 'Heavy double-bitted battleaxe etched with glowing deep-dark runes.',
    achievementDesc: 'Achievement: Endure 10 hard falls'
  },
  'weapon-void-scythe': {
    name: 'Nebula Void Scythe',
    category: 'Scythe',
    description: 'Crescent grim scythe wreathed in purple-crimson abyssal flames.',
    achievementDesc: 'Achievement: Uncover 3 Secret Relics'
  },
  'weapon-royal-scepter': {
    name: 'Supreme Sovereign Scepter',
    category: 'Divine Relic',
    description: 'Imperial golden scepter of the Citadel Monarch.',
    achievementDesc: 'Achievement: Conquer 5 Worlds or clear under 90s'
  },
  'weapon-starforge-hammer': {
    name: 'Starforge Thunder Hammer',
    category: 'Warhammer',
    description: 'Runic celestial warhammer discharging high-voltage arcs on every jump.',
    achievementDesc: 'Achievement: Perform 100 total jumps'
  },
  'weapon-phoenix-glaive': {
    name: 'Immortal Phoenix Glaive',
    category: 'Spear',
    description: 'Blazing crimson polearm scattering rebirth embers across the sky.',
    achievementDesc: 'Achievement: Endure 35 hard falls'
  },
  'weapon-creator-pen': {
    name: '[CREATOR] Genesis Worldbrush Blade',
    category: 'Divine Relic',
    description: 'Supreme golden brush-sword that paints reality and slashes rainbow starlight.',
    achievementDesc: 'Creator Achievement: Uncover 7 Secret Relics'
  },
  'weapon-chrono-blade': {
    name: '[CREATOR] Infinity Chrono Blade',
    category: 'Divine Relic',
    description: 'Spacetime rift blade that cleaves through dimensions.',
    achievementDesc: 'Creator Achievement: Conquer 10 Worlds'
  }
};

const SHIELD_EN_TEXTS: Record<ShieldItemId, LocalizedEquipText> = {
  'shield-none': {
    name: 'No Off-Hand',
    category: 'None',
    description: 'Keep your off-hand free for maximum lightness.',
    achievementDesc: 'Default — Unlocked from the start'
  },
  'shield-heraldic': {
    name: 'Royal Lion Kite Shield',
    category: 'Shield',
    description: 'Sapphire-and-gold kite shield bearing the Citadel crest.',
    achievementDesc: 'Default — Unlocked from the start'
  },
  'shield-sun-aegis': {
    name: 'Celestial Sun Aegis',
    category: 'Shield',
    description: 'Radiant winged paladin shield of the summit conquerors.',
    achievementDesc: 'Achievement: Conquer at least 1 Tower World'
  },
  'shield-frost-buckler': {
    name: 'Permafrost Crystal Buckler',
    category: 'Shield',
    description: 'Enchanted ice shield orbited by twin frost spirits.',
    achievementDesc: 'Achievement: Perform 25 total jumps'
  },
  'shield-arcane-tome': {
    name: 'Astral Grimoire Tome',
    category: 'Talisman',
    description: 'Floating spellbook radiating arcane runes.',
    achievementDesc: 'Achievement: Uncover at least 1 Secret Relic'
  },
  'shield-soul-lantern': {
    name: 'Guiding Soul Lantern',
    category: 'Talisman',
    description: 'Mystic cyan soul-fire lantern illuminating dark chasms.',
    achievementDesc: 'Achievement: Conquer 3 different Worlds'
  },
  'shield-phoenix-wing': {
    name: 'Phoenix Feather Ward',
    category: 'Shield',
    description: 'Blazing wing-shaped shield that scatters rebirth embers.',
    achievementDesc: 'Achievement: Complete a World with 0 hard falls'
  },
  'shield-creator-cube': {
    name: '[CREATOR] Genesis Matrix Cube',
    category: 'Divine Relic',
    description: 'Floating multidimensional hypercube orbiting the Creator.',
    achievementDesc: 'Creator Achievement: 300 Jumps or 20 Worlds'
  }
};

const ACHIEVEMENT_EN_TEXTS: Record<
  string,
  { title: string; description: string; rewardText: string }
> = {
  'ach-jumper-25': {
    title: 'I. First Leaps of Faith',
    description: 'Execute 25 charged jumps across your tower ascent.',
    rewardText: 'Unlocks: Sylvan Wayfarer & Permafrost Crystal Buckler'
  },
  'ach-first-summit': {
    title: 'II. Summit Conqueror',
    description: 'Conquer any World for the first time (No Checkpoints).',
    rewardText: 'Unlocks: Solaris Paladin, Sunflame Claymore & Sun Aegis'
  },
  'ach-treasure-1': {
    title: 'III. Relic Seeker',
    description: 'Discover at least 1 hidden Easter Egg Relic on Floor 5.',
    rewardText: 'Unlocks: Astral Archmage, Emerald Dragon Lance & Astral Tome'
  },
  'ach-iron-will': {
    title: 'IV. Unbreakable Will',
    description: 'Rise again after enduring 10 hard falls from high ledges.',
    rewardText: 'Unlocks: Sculk Abyss Warden & Runed Sculk Greataxe'
  },
  'ach-jumper-100': {
    title: 'V. Wings Above the Clouds',
    description: 'Execute 100 total charged jumps across the cliffs.',
    rewardText: 'Unlocks: Celestial Valkyrie (Winged) & Starforge Hammer'
  },
  'ach-conqueror-3': {
    title: 'VI. Multiverse Wayfarer',
    description: 'Conquer 3 different Worlds across the tower.',
    rewardText: 'Unlocks: Bloodmoon Ronin & Guiding Soul Lantern'
  },
  'ach-treasure-3': {
    title: 'VII. Master of Forbidden Relics',
    description: 'Collect 3 hidden Easter Egg Relics across the worlds.',
    rewardText: 'Unlocks: Synthwave Maestro & Nebula Void Scythe'
  },
  'ach-iron-will-35': {
    title: 'VIII. Heart of the Dragonlord',
    description: 'Endure 35 hard falls without ever giving up.',
    rewardText: 'Unlocks: Infernal Dragonlord & Immortal Phoenix Glaive'
  },
  'ach-flawless-climb': {
    title: 'IX. Flawless Shadow Step',
    description: 'Conquer any World without suffering a single hard fall (0 Falls).',
    rewardText: 'Unlocks: Void Phantom Reaper & Phoenix Feather Ward'
  },
  'ach-conqueror-5': {
    title: 'X. Sovereign of the Spire',
    description: 'Conquer 5 Worlds or complete any stage in under 90 seconds.',
    rewardText: 'Unlocks: Eternal Sovereign & Supreme Sovereign Scepter'
  },
  'ach-treasure-7': {
    title: 'XI. [CREATOR] Architect of Relics',
    description: 'Uncover 7 Secret Relics across the multiverse.',
    rewardText: 'Unlocks: [CREATOR] Multiverse Architect & Genesis Worldbrush'
  },
  'ach-conqueror-10': {
    title: 'XII. [CREATOR] Weaver of Ten Realms',
    description: 'Successfully conquer 10 challenging Worlds.',
    rewardText: 'Unlocks: [CREATOR] Sovereign Pixel Weaver & Infinity Chrono Blade'
  },
  'ach-jumper-300': {
    title: 'XIII. [CREATOR] Lord of Spacetime',
    description: 'Execute 300 jumps or conquer 20 Worlds.',
    rewardText: 'Unlocks: [CREATOR] Chronos Spacetime Lord & Genesis Matrix Cube'
  }
};

export function t(): UiStrings {
  const lang = globalSettings.get().language;
  return DICTIONARIES[lang] ?? EN_US_STRINGS;
}

const SKIN_MULTI_NAMES: Record<
  CharacterSkinId,
  Partial<Record<GameLanguage, { name: string; title: string; description: string; achievementDesc: string }>>
> = {
  'knight-skybound': {
    zh: { name: '苍穹先锋骑士', title: '圣塔新锐', description: '圣塔骑士团传统的银蓝钢甲与烈焰橙披巾。', achievementDesc: '默认解锁 — 初始可用' },
    ko: { name: '스카이바운드 선봉기사', title: '성채 신병', description: '성채 기사단의 전통 은빛 푸른 판금 갑주와 주황색 스카프.', achievementDesc: '기본 제공 — 처음부터 사용 가능' },
    de: { name: 'Himmels-Vorhutritter', title: 'Zitadellen-Rekrut', description: 'Traditionelle Silber-Azur-Plattenrüstung des Turmordens.', achievementDesc: 'Standard — Von Anfang an verfügbar' },
    fr: { name: 'Chevalier Céleste', title: 'Recrue de la Citadelle', description: 'Armure argent-azur traditionnelle de l’Ordre de la Tour.', achievementDesc: 'Par défaut — Disponible dès le départ' },
    ru: { name: 'Небесный Рыцарь', title: 'Рекрут Цитадели', description: 'Традиционные серебристо-лазурные латы Ордена Башни.', achievementDesc: 'По умолчанию — Доступно сразу' }
  },
  'paladin-solaris': {
    zh: { name: '日冕圣殿骑士', title: '破塔征服者', description: '在第一座圣塔巅峰圣火中锻造的耀金战甲。', achievementDesc: '成就解锁：征服至少 1 座世界圣塔' },
    ko: { name: '솔라리스 성기사', title: '성탑 정복자', description: '첫 첨탑 정상에서 성스러운 태양불로 제련된 황금 갑주.', achievementDesc: '업적: 최소 1개의 세계 정복' },
    de: { name: 'Solaris-Paladin', title: 'Turmeroberer', description: 'Vergoldete Sonnenrüstung aus den Flammen des ersten Gipfels.', achievementDesc: 'Erfolg: Erobere mindestens 1 Welt' },
    fr: { name: 'Paladin Solaris', title: 'Conquérant des Tours', description: 'Armure solaire dorée forgée au premier sommet.', achievementDesc: 'Haut Fait : Conquérir au moins 1 Monde' },
    ru: { name: 'Паладин Солярис', title: 'Покоритель Башни', description: 'Позолоченный солнечный доспех первой вершины.', achievementDesc: 'Достижение: Покорить хотя бы 1 Мир' }
  },
  'ranger-sylvan': {
    zh: { name: '翡翠古林游侠', title: '林间行者', description: '织入远古疾风符文的翠绿森林披风。', achievementDesc: '成就解锁：累计完成 25 次跳跃' },
    ko: { name: '실반 숲 순찰자', title: '고대숲 보행자', description: '고대 바람의 룬이 깃든 에메랄드빛 숲 망토.', achievementDesc: '업적: 누적 점프 25회 달성' },
    de: { name: 'Sylvanischer Waldläufer', title: 'Waldwanderer', description: 'Smaragdgrüner Waldmantel mit uralten Windrunen.', achievementDesc: 'Erfolg: 25 Sprünge ausführen' },
    fr: { name: 'Rôdeur Sylvestre', title: 'Marche-Forêt', description: 'Cape d’émeraude tissée de runes des vents anciens.', achievementDesc: 'Haut Fait : Effectuer 25 sauts' },
    ru: { name: 'Лесной Следопыт', title: 'Странник Чащи', description: 'Изумрудный плащ с древними рунами ветра.', achievementDesc: 'Достижение: Совершить 25 прыжков' }
  },
  'archmage-astral': {
    zh: { name: '星界大魔导师', title: '秘宝寻觅者', description: '浸透隐秘地窟远古回响的星辉法袍。', achievementDesc: '成就解锁：发掘至少 1 件隐藏秘宝' },
    ko: { name: '아스트랄 대마법사', title: '유물 탐색가', description: '고대 비밀 금고의 별빛 마력이 깃든 대마법사 로브.', achievementDesc: '업적: 숨겨진 유물 1개 이상 발견' },
    de: { name: 'Astral-Erzmagier', title: 'Reliktsucher', description: 'Sternenlicht-Robe voller uralter Echos geheimer Gewölbe.', achievementDesc: 'Erfolg: Entdecke 1 Geheimrelikt' },
    fr: { name: 'Archimage Astral', title: 'Chercheur de Reliques', description: 'Robe stellaire imprégnée des échos des cryptes.', achievementDesc: 'Haut Fait : Découvrir 1 Relique Secrète' },
    ru: { name: 'Астральный Архимаг', title: 'Искатель Реликвий', description: 'Звёздная мантия, хранящая тайны древних склепов.', achievementDesc: 'Достижение: Найти 1 Тайную Реликвию' }
  },
  'ronin-crimson': {
    zh: { name: '血月浪人剑客', title: '多维行者', description: '历经三界试炼淬炼而成的绯红武士战甲。', achievementDesc: '成就解锁：征服 3 座不同的世界' },
    ko: { name: '블러드문 로닌', title: '차원 방랑자', description: '세 세계의 시련을 거치며 단련된 진홍빛 사무라이 갑주.', achievementDesc: '업적: 서로 다른 3개의 세계 정복' },
    de: { name: 'Blutmond-Ronin', title: 'Weltenwanderer', description: 'Karmesinrote Samurai-Rüstung, gehärtet in drei Welten.', achievementDesc: 'Erfolg: Erobere 3 verschiedene Welten' },
    fr: { name: 'Rônin Lune-de-Sang', title: 'Voyageur des Mondes', description: 'Armure de samouraï cramoisie trempée dans trois mondes.', achievementDesc: 'Haut Fait : Conquérir 3 Mondes' },
    ru: { name: 'Ронин Кровавой Луны', title: 'Путник Миров', description: 'Багровый доспех самурая, закалённый в трёх мирах.', achievementDesc: 'Достижение: Покорить 3 разных Мира' }
  },
  'warden-abyss': {
    zh: { name: '幽匿深渊守卫', title: '不屈意志', description: '在无数次坠落与重登中铸就的深暗黑曜重甲。', achievementDesc: '成就解锁：历经 10 次重跌仍不放弃' },
    ko: { name: '심연의 스컬크 수호자', title: '불굴의 의지', description: '추락 후에도 다시 일어서는 기사를 위한 심연의 중갑.', achievementDesc: '업적: 10회 추락을 견디고 다시 등반' },
    de: { name: 'Abgrund-Wächter', title: 'Unbeugsamer Wille', description: 'Tiefdunkle Obsidianrüstung für unermüdliche Kletterer.', achievementDesc: 'Erfolg: Überstehe 10 tiefe Stürze' },
    fr: { name: 'Gardien des Abysses', title: 'Volonté de Fer', description: 'Armure d’obsidienne forgée à travers les chutes.', achievementDesc: 'Haut Fait : Subir 10 chutes lourdes' },
    ru: { name: 'Страж Глубин', title: 'Несгибаемая Воля', description: 'Обсидиановая броня, закалённая десятью падениями.', achievementDesc: 'Достижение: Пережить 10 падений' }
  },
  'maestro-neon': {
    zh: { name: '霓虹律动宗师', title: '节奏主宰', description: '随舞台聚光灯与音乐节拍律动的赛博霓虹战衣。', achievementDesc: '成就解锁：发掘 3 件隐藏秘宝' },
    ko: { name: '네온 비트 마에스트로', title: '리듬의 지배자', description: '콘서트 조명과 비트에 맞춰 빛나는 사이버 네온 수트.', achievementDesc: '업적: 숨겨진 유물 3개 발견' },
    de: { name: 'Synthwave-Maestro', title: 'Meister des Takts', description: 'Cyber-Neon-Anzug, der im Takt der Bühnenlichter pulsiert.', achievementDesc: 'Erfolg: Entdecke 3 Geheimrelikte' },
    fr: { name: 'Maestro Synthwave', title: 'Maître du Rythme', description: 'Tenue néon vibrant au rythme des projecteurs.', achievementDesc: 'Haut Fait : Découvrir 3 Reliques Secrètes' },
    ru: { name: 'Неоновый Маэстро', title: 'Повелитель Ритма', description: 'Кибер-неоновый костюм, пульсирующий в такт музыке.', achievementDesc: 'Достижение: Найти 3 Тайные Реликвии' }
  },
  'monarch-eternal': {
    zh: { name: '百界永恒君王', title: '圣塔帝皇', description: '统御百座连通世界之主的皇家金冠礼装。', achievementDesc: '成就解锁：征服 5 座世界或 90 秒内通关' },
    ko: { name: '영원의 군주', title: '성채의 제왕', description: '100대 연결 세계를 통치하는 황제의 금관 예복.', achievementDesc: '업적: 5개 세계 정복 또는 90초 이내 클리어' },
    de: { name: 'Ewiger Souverän', title: 'Monarch der Zitadelle', description: 'Kaiserliche Goldkronen-Rüstung des Herrschers der 100 Welten.', achievementDesc: 'Erfolg: 5 Welten oder unter 90s' },
    fr: { name: 'Souverain Éternel', title: 'Monarque de la Tour', description: 'Parure impériale couronnée du maître des 100 mondes.', achievementDesc: 'Haut Fait : 5 Mondes ou moins de 90s' },
    ru: { name: 'Вечный Монарх', title: 'Владыка Цитадели', description: 'Императорское облачение правителя 100 миров.', achievementDesc: 'Достижение: 5 Миров или быстрее 90 сек' }
  },
  'valkyrie-celestial': {
    zh: { name: '苍穹炽翼女武神', title: '天界炽天使', description: '展开洁白神圣光翼的女武神辉光战甲。', achievementDesc: '成就解锁：累计完成 100 次跳跃' },
    ko: { name: '천상의 발키리', title: '창공의 치천사', description: '찬란한 천사의 날개가 펼쳐지는 발키리 전투복.', achievementDesc: '업적: 누적 점프 100회 달성' },
    de: { name: 'Himmlische Walküre', title: 'Himmels-Seraph', description: 'Strahlende Walkürenrüstung mit leuchtenden Federflügeln.', achievementDesc: 'Erfolg: 100 Sprünge ausführen' },
    fr: { name: 'Valkyrie Céleste', title: 'Séraphin Ailé', description: 'Armure radieuse ornée d’ailes séraphiques.', achievementDesc: 'Haut Fait : Effectuer 100 sauts' },
    ru: { name: 'Небесная Валькирия', title: 'Крылатый Серафим', description: 'Сияющий доспех валькирии с белоснежными крыльями.', achievementDesc: 'Достижение: Совершить 100 прыжков' }
  },
  'dragonlord-infernal': {
    zh: { name: '炼狱赤焰龙皇', title: '古龙霸主', description: '展开熔岩烈焰龙翼的远古赤龙鳞甲。', achievementDesc: '成就解锁：历经 35 次重跌仍不放弃' },
    ko: { name: '인페르날 용군주', title: '드래곤의 지배자', description: '불타는 용의 날개가 펼쳐지는 고대 용비늘 갑주.', achievementDesc: '업적: 35회 추락을 극복하고 등반' },
    de: { name: 'Infernalischer Drachenfürst', title: 'Drachenherrscher', description: 'Drachenschuppenrüstung mit ausgebreiteten Glutflügeln.', achievementDesc: 'Erfolg: Überstehe 35 Stürze' },
    fr: { name: 'Seigneur-Dragon Infernal', title: 'Souverain Draconique', description: 'Armure d’écailles de dragon aux ailes de braise.', achievementDesc: 'Haut Fait : Subir 35 chutes' },
    ru: { name: 'Инфернальный Повелитель Драконов', title: 'Драконий Властелин', description: 'Чешуйчатая броня с пылающими крыльями дракона.', achievementDesc: 'Достижение: Пережить 35 падений' }
  },
  'phantom-reaper': {
    zh: { name: '虚空无影死神', title: '暗影行者', description: '赐予零失误登顶者的灵魂冥火死神披风。', achievementDesc: '成就解锁：以 0 次重跌完美通关任意世界' },
    ko: { name: '공허의 사신 팬텀', title: '무결점 그림자', description: '단 한 번의 추락 없이 정상에 오른 자를 위한 사신의 망토.', achievementDesc: '업적: 추락 0회로 세계 클리어' },
    de: { name: 'Leeren-Phantom', title: 'Schattenläufer', description: 'Geistergewand für Ritter, die ohne einen Sturz siegen.', achievementDesc: 'Erfolg: Welt mit 0 Stürzen abschließen' },
    fr: { name: 'Faucheur Fantôme du Néant', title: 'Marche-Ombre', description: 'Linceul spectral des chevaliers gravissant sans chute.', achievementDesc: 'Haut Fait : Terminer un Monde avec 0 chute' },
    ru: { name: 'Призрачный Жнец Бездны', title: 'Безупречная Тень', description: 'Призрачный плащ для покоривших мир без единого падения.', achievementDesc: 'Достижение: Пройти Мир с 0 падений' }
  },
  'creator-architect': {
    zh: { name: '[创世] 多元宇宙架构师', title: '至高造物主', description: '拥有六翼炽天使光辉与黄金圣环的创世者专属神装。', achievementDesc: '创世成就：发掘 7 件秘宝（或开启自由试用）' },
    ko: { name: '[창세] 멀티버스 아키텍트', title: '위대한 설계자', description: '세라핌 날개와 황금 후광이 빛나는 창조주 전용 신장.', achievementDesc: '창세 업적: 유물 7개 발견 (또는 전체 해금)' },
    de: { name: '[SCHÖPFER] Multiversum-Architekt', title: 'Der Große Architekt', description: 'Erhabene Schöpferrüstung mit Seraphimflügeln und Aureole.', achievementDesc: 'Schöpfer-Erfolg: 7 Relikte entdecken' },
    fr: { name: '[CRÉATEUR] Architecte du Multivers', title: 'Le Grand Architecte', description: 'Tenue suprême du Créateur avec ailes séraphiques et auréole.', achievementDesc: 'Haut Fait Créateur : 7 Reliques' },
    ru: { name: '[ТВОРЕЦ] Архитектор Мультивселенной', title: 'Великий Зодчий', description: 'Высшее облачение Творца с крыльями серафима и золотым нимбом.', achievementDesc: 'Достижение Творца: 7 Реликвий' }
  },
  'creator-pixelgod': {
    zh: { name: '[创世] 翡翠像素画神', title: '造物匠神', description: '编织百界像素法则的皇家翡翠金丝披风战甲。', achievementDesc: '创世成就：征服 10 座世界（或开启自由试用）' },
    ko: { name: '[창세] 픽셀 위버 소버린', title: '마스터 장인', description: '세계를 빚어내는 픽셀 장인의 에메랄드 황금 망토 갑주.', achievementDesc: '창세 업적: 10개 세계 정복 (또는 전체 해금)' },
    de: { name: '[SCHÖPFER] Souveräner Pixelweber', title: 'Meisterhandwerker', description: 'Smaragd-goldener Königsmantel des Pixelkünstlers.', achievementDesc: 'Schöpfer-Erfolg: 10 Welten erobern' },
    fr: { name: '[CRÉATEUR] Souverain Tisseur de Pixels', title: 'Maître Artisan', description: 'Manteau royal émeraude et or du bâtisseur de mondes.', achievementDesc: 'Haut Fait Créateur : 10 Mondes' },
    ru: { name: '[ТВОРЕЦ] Повелитель Пикселей', title: 'Великий Мастер', description: 'Изумрудно-золотая мантия зодчего пиксельных миров.', achievementDesc: 'Достижение Творца: 10 Миров' }
  },
  'creator-chronos': {
    zh: { name: '[创世] 时空星云主宰', title: '时空律者', description: '掌控百界重力与时间法则的星云双翼神装。', achievementDesc: '创世成就：300 次跳跃或 20 座世界' },
    ko: { name: '[창세] 크로노스 시공간 군주', title: '시간의 지배자', description: '100대 세계의 물리 법칙을 관장하는 성운 날개 갑주.', achievementDesc: '창세 업적: 300회 점프 또는 20개 세계' },
    de: { name: '[SCHÖPFER] Chronos Raumzeit-Fürst', title: 'Hüter der Zeit', description: 'Nebelschwingen-Rüstung, die über Raum und Zeit gebietet.', achievementDesc: 'Schöpfer-Erfolg: 300 Sprünge' },
    fr: { name: '[CRÉATEUR] Seigneur Chronos', title: 'Maître du Temps', description: 'Armure aux ailes nébuleuses régissant l’espace-temps.', achievementDesc: 'Haut Fait Créateur : 300 sauts' },
    ru: { name: '[ТВОРЕЦ] Хронос Властелин Времени', title: 'Хранитель Времени', description: 'Доспех с крыльями туманности, управляющий временем.', achievementDesc: 'Достижение Творца: 300 прыжков' }
  }
};

const WEAPON_MULTI_NAMES: Record<
  WeaponItemId,
  Partial<Record<GameLanguage, { name: string; category: string }>>
> = {
  'weapon-none': {
    zh: { name: '徒手空拳', category: '无武器' },
    ko: { name: '맨손 격투', category: '비무장' },
    de: { name: 'Unbewaffnet', category: 'Waffenlos' },
    fr: { name: 'Mains Nues', category: 'Sans arme' },
    ru: { name: 'Без оружия', category: 'Безоружный' }
  },
  'weapon-broadsword': {
    zh: { name: '圣塔骑士阔剑', category: '长剑' },
    ko: { name: '기사단 브로드소드', category: '도검' },
    de: { name: 'Ritter-Breitschwert', category: 'Schwert' },
    fr: { name: 'Épée Large de Chevalier', category: 'Épée' },
    ru: { name: 'Рыцарский Палаш', category: 'Меч' }
  },
  'weapon-sunblade': {
    zh: { name: '烈阳圣焰巨剑', category: '双手巨剑' },
    ko: { name: '태양불꽃 클레이모어', category: '대검' },
    de: { name: 'Sonnenflammen-Zweihänder', category: 'Großschwert' },
    fr: { name: 'Claymore Solaire', category: 'Espadon' },
    ru: { name: 'Двуручник Солнечного Пламени', category: 'Двуручный меч' }
  },
  'weapon-archmage-staff': {
    zh: { name: '星界大魔导师法杖', category: '法杖' },
    ko: { name: '대마법사의 아스트랄 스태프', category: '지팡이' },
    de: { name: 'Astralstab des Erzmagiers', category: 'Zauberstab' },
    fr: { name: 'Bâton Astral d’Archimage', category: 'Bâton' },
    ru: { name: 'Астральный Посох Архимага', category: 'Посох' }
  },
  'weapon-dragon-lance': {
    zh: { name: '翡翠龙吟长枪', category: '长枪' },
    ko: { name: '에메랄드 드래곤 랜스', category: '장창' },
    de: { name: 'Smaragd-Drachenlanze', category: 'Lanze' },
    fr: { name: 'Lance-Dragon d’Émeraude', category: 'Lance' },
    ru: { name: 'Изумрудное Копьё Дракона', category: 'Копьё' }
  },
  'weapon-runed-axe': {
    zh: { name: '古字幽匿战斧', category: '战斧' },
    ko: { name: '고대 룬 문자 전투도끼', category: '전투도끼' },
    de: { name: 'Runen-Streitaxt', category: 'Streitaxt' },
    fr: { name: 'Hache Runique des Profondeurs', category: 'Hache' },
    ru: { name: 'Руническая Секира Глубин', category: 'Секира' }
  },
  'weapon-void-scythe': {
    zh: { name: '星河虚空死神镰', category: '战镰' },
    ko: { name: '성운 공허의 사신 낫', category: '사신의 낫' },
    de: { name: 'Nebel-Leeren-Sense', category: 'Sense' },
    fr: { name: 'Faux Nébuleuse du Néant', category: 'Faux' },
    ru: { name: 'Коса Туманности Бездны', category: 'Коса' }
  },
  'weapon-royal-scepter': {
    zh: { name: '至高君王权杖', category: '神器' },
    ko: { name: '지고의 군주 왕홀', category: '신기' },
    de: { name: 'Oberstes Königszepter', category: 'Relikt' },
    fr: { name: 'Sceptre Suprême du Monarque', category: 'Relique' },
    ru: { name: 'Верховный Скипетр Монарха', category: 'Реликвия' }
  },
  'weapon-starforge-hammer': {
    zh: { name: '锻星雷霆战锤', category: '雷神锤' },
    ko: { name: '별벼림 천둥 전쟁망치', category: '전쟁망치' },
    de: { name: 'Sternenschmiede-Donnerhammer', category: 'Kriegshammer' },
    fr: { name: 'Marteau Forge-Étoile', category: 'Marteau' },
    ru: { name: 'Звёздный Громовой Молот', category: 'Молот' }
  },
  'weapon-phoenix-glaive': {
    zh: { name: '不死火凤偃月刀', category: '长柄刀' },
    ko: { name: '불사조의 화염 언월도', category: '글레이브' },
    de: { name: 'Unsterbliche Phönix-Glefe', category: 'Stangenwaffe' },
    fr: { name: 'Vouge du Phénix Immortel', category: 'Arme d’hast' },
    ru: { name: 'Глефа Бессмертного Феникса', category: 'Глефа' }
  },
  'weapon-creator-pen': {
    zh: { name: '[创世] 万象画境笔剑', category: '创世神器' },
    ko: { name: '[창세] 제네시스 월드브러시 검', category: '창조주 신기' },
    de: { name: '[SCHÖPFER] Genesis-Weltenpinsel', category: 'Schöpfer-Relikt' },
    fr: { name: '[CRÉATEUR] Lame-Pinceau Genèse', category: 'Relique Créateur' },
    ru: { name: '[ТВОРЕЦ] Кисть-Клинок Мироздания', category: 'Реликвия Творца' }
  },
  'weapon-chrono-blade': {
    zh: { name: '[创世] 无尽时空裂隙剑', category: '创世神器' },
    ko: { name: '[창세] 인피니티 시공간의 검', category: '창조주 신기' },
    de: { name: '[SCHÖPFER] Unendliche Chronoklinge', category: 'Schöpfer-Relikt' },
    fr: { name: '[CRÉATEUR] Lame Chrono Infinie', category: 'Relique Créateur' },
    ru: { name: '[ТВОРЕЦ] Клинок Бесконечного Времени', category: 'Реликвия Творца' }
  }
};

const SHIELD_MULTI_NAMES: Record<
  ShieldItemId,
  Partial<Record<GameLanguage, { name: string; category: string }>>
> = {
  'shield-none': {
    zh: { name: '不装备副手', category: '轻装' },
    ko: { name: '보조장비 없음', category: '비무장' },
    de: { name: 'Keine Nebenhand', category: 'Ohne Schild' },
    fr: { name: 'Main Gauche Libre', category: 'Aucun' },
    ru: { name: 'Без щита', category: 'Нет' }
  },
  'shield-heraldic': {
    zh: { name: '皇家金狮纹章盾', category: '骑士盾' },
    ko: { name: '왕실 사자 문장 카이트 실드', category: '기사 방패' },
    de: { name: 'Königlicher Löwen-Langschild', category: 'Langschild' },
    fr: { name: 'Écu Royal au Lion d’Or', category: 'Écu' },
    ru: { name: 'Королевский Щит Золотого Льва', category: 'Рыцарский щит' }
  },
  'shield-sun-aegis': {
    zh: { name: '曜阳圣翼神盾', category: '圣盾' },
    ko: { name: '천상의 태양 아이기스', category: '신성 방패' },
    de: { name: 'Himmlische Sonnen-Ägide', category: 'Göttlicher Schild' },
    fr: { name: 'Égide Solaire Céleste', category: 'Bouclier divin' },
    ru: { name: 'Небесная Солнечная Эгида', category: 'Священный щит' }
  },
  'shield-frost-buckler': {
    zh: { name: '永恒寒冰圆盾', category: '冰晶盾' },
    ko: { name: '만년설 수정 버클러', category: '수정 방패' },
    de: { name: 'Permafrost-Kristallschild', category: 'Kristallschild' },
    fr: { name: 'Rondache de Givre Éternel', category: 'Bouclier de glace' },
    ru: { name: 'Ледяной Баклер Вечной Мерзлоты', category: 'Кристальный щит' }
  },
  'shield-arcane-tome': {
    zh: { name: '星界奥术魔导书', category: '法器' },
    ko: { name: '아스트랄 비전 마도서', category: '법구' },
    de: { name: 'Astrales Zauberbuch', category: 'Artefakt' },
    fr: { name: 'Grimoire Astral', category: 'Talisman' },
    ru: { name: 'Астральный Гримуар', category: 'Реликвия' }
  },
  'shield-soul-lantern': {
    zh: { name: '引魂幽蓝提灯', category: '法器' },
    ko: { name: '영혼 인도의 청옥 등불', category: '법구' },
    de: { name: 'Seelenführer-Laterne', category: 'Artefakt' },
    fr: { name: 'Lanterne des Âmes', category: 'Talisman' },
    ru: { name: 'Фонарь Душ', category: 'Реликвия' }
  },
  'shield-phoenix-wing': {
    zh: { name: '不死火凤羽翼盾', category: '烈焰盾' },
    ko: { name: '불사조의 날개 방패', category: '화염 방패' },
    de: { name: 'Phönixschwingen-Schild', category: 'Flammenschild' },
    fr: { name: 'Écu Aile-de-Phénix', category: 'Bouclier ardent' },
    ru: { name: 'Щит Крыла Феникса', category: 'Огненный щит' }
  },
  'shield-creator-cube': {
    zh: { name: '[创世] 起源矩阵立方体', category: '创世神器' },
    ko: { name: '[창세] 제네시스 매트릭스 큐브', category: '창조주 신기' },
    de: { name: '[SCHÖPFER] Genesis-Matrixwürfel', category: 'Schöpfer-Relikt' },
    fr: { name: '[CRÉATEUR] Cube Matrice de la Genèse', category: 'Relique Créateur' },
    ru: { name: '[ТВОРЕЦ] Куб Матрицы Мироздания', category: 'Реликвия Творца' }
  }
};

export function getSkinLocalized(
  id: CharacterSkinId,
  fallback: { name: string; title: string; description: string; achievementDesc: string }
): { name: string; title: string; description: string; achievementDesc: string } {
  const lang = globalSettings.get().language;
  if (lang === 'vi') return fallback;
  const multi = SKIN_MULTI_NAMES[id]?.[lang];
  if (multi) return multi;
  const en = SKIN_EN_TEXTS[id];
  if (!en) return fallback;
  if (lang === 'en-GB') {
    return {
      name: en.name.replace('Armor', 'Armour'),
      title: en.title ?? fallback.title,
      description: en.description.replace(/armor/g, 'armour').replace(/color/g, 'colour'),
      achievementDesc: en.achievementDesc
    };
  }
  return {
    name: en.name,
    title: en.title ?? fallback.title,
    description: en.description,
    achievementDesc: en.achievementDesc
  };
}

export function getWeaponLocalized(
  id: WeaponItemId,
  fallback: { name: string; category: string; description: string; achievementDesc: string }
): { name: string; category: string; description: string; achievementDesc: string } {
  const lang = globalSettings.get().language;
  if (lang === 'vi') return fallback;
  const en = WEAPON_EN_TEXTS[id];
  if (!en) return fallback;
  const multi = WEAPON_MULTI_NAMES[id]?.[lang];
  return {
    name: multi?.name ?? en.name,
    category: multi?.category ?? en.category ?? fallback.category,
    description: en.description,
    achievementDesc: en.achievementDesc
  };
}

export function getShieldLocalized(
  id: ShieldItemId,
  fallback: { name: string; category: string; description: string; achievementDesc: string }
): { name: string; category: string; description: string; achievementDesc: string } {
  const lang = globalSettings.get().language;
  if (lang === 'vi') return fallback;
  const en = SHIELD_EN_TEXTS[id];
  if (!en) return fallback;
  const multi = SHIELD_MULTI_NAMES[id]?.[lang];
  return {
    name: multi?.name ?? en.name,
    category: multi?.category ?? en.category ?? fallback.category,
    description: en.description,
    achievementDesc: en.achievementDesc
  };
}

export function getAchievementLocalized(
  id: string,
  fallback: { title: string; description: string; rewardText: string }
): { title: string; description: string; rewardText: string } {
  const lang = globalSettings.get().language;
  if (lang === 'vi') return fallback;
  const en = ACHIEVEMENT_EN_TEXTS[id];
  if (!en) return fallback;
  return en;
}

const WORLD_EN_NAMES: Record<string, string> = {
  'forest-01': '1. Ancient Pinewood Sanctuary',
  'ice-01': '2. Cavern of Eternal Permafrost',
  'wind-01': '3. Tempest Gale Spire',
  'mc-01-overworld': 'MC 1. Oak Meadow & Floating Isles',
  'mc-02-lush-caves': 'MC 2. Glowberry Lush Caverns',
  'mc-03-deep-dark': 'MC 3. Ancient Sculk Stronghold (Y=-54)',
  'mc-04-frozen-peaks': 'MC 4. Sunset Frozen Jagged Peaks',
  'mc-05-ocean-monument': 'MC 5. Prismarine Ocean Monument',
  'mc-11-cherry-amethyst': 'MC 6. Cherry Grove & Amethyst Geode',
  'mc-12-trial-redstone': 'MC 7. Redstone Mines & Trial Vault',
  'mc-06-nether-wastes': 'MC 8. Nether Fortress & Lava Chasm',
  'mc-07-soul-valley': 'MC 9. Soul Sand Valley & Fossils',
  'mc-08-bastion-remnant': 'MC 10. Gilded Blackstone Bastion',
  'mc-09-obsidian-pillars': 'MC 11. End Obsidian Pillars',
  'mc-10-end-city': 'MC 12. Purpur End City Skyship',
  'rk-05-grand-encore-100': 'RK 5. STAGE 100: Grand Encore Finale'
};

export function localizeWorldName(id: string, rawName: string): string {
  const lang = globalSettings.get().language;
  if (lang === 'vi') return rawName;
  if (WORLD_EN_NAMES[id]) return WORLD_EN_NAMES[id]!;
  // If rawName has an English subtitle in parentheses like "CL 1. Thành Phố Bỏ Hoang (Forsaken City)", extract the prefix + English title!
  const match = /^([A-Z0-9]+\s+\d+\.\s+).*\(([^)]+)\)$/.exec(rawName);
  if (match) {
    return `${match[1]}${match[2]}`;
  }
  return rawName;
}

export function localizeRealmName(realm: string): string {
  const lang = globalSettings.get().language;
  if (lang === 'vi') return realm;
  if (realm === 'Cổ Nguyên') {
    if (lang === 'zh') return '远古本源';
    if (lang === 'ko') return '고대 기원';
    if (lang === 'de') return 'Urzeit-Reich';
    if (lang === 'fr') return 'Origines Anciennes';
    if (lang === 'ru') return 'Древние Истоки';
    return 'Primeval Realms';
  }
  return realm;
}
