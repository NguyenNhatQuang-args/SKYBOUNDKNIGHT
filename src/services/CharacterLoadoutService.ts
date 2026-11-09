import { LocalStorageSaveService } from './SaveService';

export type CharacterSkinId =
  | 'knight-skybound'
  | 'paladin-solaris'
  | 'ranger-sylvan'
  | 'archmage-astral'
  | 'ronin-crimson'
  | 'warden-abyss'
  | 'maestro-neon'
  | 'monarch-eternal'
  | 'valkyrie-celestial'
  | 'dragonlord-infernal'
  | 'phantom-reaper'
  | 'creator-architect'
  | 'creator-pixelgod'
  | 'creator-chronos';

export type WeaponItemId =
  | 'weapon-none'
  | 'weapon-broadsword'
  | 'weapon-sunblade'
  | 'weapon-archmage-staff'
  | 'weapon-dragon-lance'
  | 'weapon-runed-axe'
  | 'weapon-void-scythe'
  | 'weapon-royal-scepter'
  | 'weapon-starforge-hammer'
  | 'weapon-phoenix-glaive'
  | 'weapon-creator-pen'
  | 'weapon-chrono-blade';

export type ShieldItemId =
  | 'shield-none'
  | 'shield-heraldic'
  | 'shield-sun-aegis'
  | 'shield-frost-buckler'
  | 'shield-arcane-tome'
  | 'shield-soul-lantern'
  | 'shield-phoenix-wing'
  | 'shield-creator-cube';

export type HeadgearStyle =
  | 'plume'
  | 'crown'
  | 'hood'
  | 'wizard'
  | 'horns'
  | 'visor'
  | 'wings-helm'
  | 'halo-crown';

export type BodySilhouetteStyle = 'standard' | 'winged' | 'cloaked' | 'halo-winged';

export type ItemEffectStyle =
  | 'none'
  | 'steel'
  | 'flame'
  | 'arcane'
  | 'emerald'
  | 'frost'
  | 'void'
  | 'divine'
  | 'creator-prism';

export interface CharacterSkinPalette {
  O: number; // Viền tối (Outline)
  H: number; // Bóng mũ/giáp
  L: number; // Màu sáng mũ/giáp chính
  V: number; // Hốc mắt tối
  E: number; // Mắt phát sáng
  S: number; // Khăn choàng / Áo choàng / Đôi cánh chính
  R: number; // Bóng áo choàng / Bóng cánh
  B: number; // Giáp ngực
  G: number; // Khuy / Đai lưng / Vương miện / Hào quang
  T: number; // Tay phải
  K: number; // Găng tay phải
  F: number; // Quần / Giáp đùi
  Z: number; // Giày chiến
  t: number; // Tay trái (bóng)
  k: number; // Găng tay trái (bóng)
  f: number; // Quần (bóng)
  z: number; // Giày (bóng)
}

export interface CharacterSkinDef {
  id: CharacterSkinId;
  name: string;
  title: string;
  description: string;
  headStyle: HeadgearStyle;
  bodyStyle: BodySilhouetteStyle;
  isCreatorSeries?: boolean;
  achievementId: string | null;
  achievementDesc: string;
  trailColor: number;
  palette: CharacterSkinPalette;
}

export interface WeaponItemDef {
  id: WeaponItemId;
  name: string;
  category: 'Không cầm' | 'Kiếm' | 'Trượng' | 'Thương' | 'Rìu' | 'Lưỡi Hái' | 'Búa Thần' | 'Thần Khí';
  description: string;
  achievementId: string | null;
  achievementDesc: string;
  fxStyle: ItemEffectStyle;
  fxColor: number;
  fxSecondaryColor: number;
}

export interface ShieldItemDef {
  id: ShieldItemId;
  name: string;
  category: 'Không đeo' | 'Khiên' | 'Pháp Khí' | 'Thần Khí';
  description: string;
  achievementId: string | null;
  achievementDesc: string;
  fxStyle: ItemEffectStyle;
  fxColor: number;
  fxSecondaryColor: number;
}

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  rewardText: string;
  checkUnlocked: (stats: PlayerCareerStats) => boolean;
  getProgressText: (stats: PlayerCareerStats) => string;
}

export interface PlayerCareerStats {
  completedWorldsCount: number;
  discoveredEggsCount: number;
  totalJumps: number;
  totalHardFalls: number;
  fastestRunMs: number | null;
  zeroFallCompleted: boolean;
  unlockAllOverride: boolean;
}

export interface PlayerLoadout {
  skinId: CharacterSkinId;
  weaponId: WeaponItemId;
  shieldId: ShieldItemId;
}

const STORAGE_KEY_LOADOUT = 'skybound_knight_loadout_v1';
const STORAGE_KEY_CAREER = 'skybound_knight_career_stats_v1';

export const CHARACTER_SKINS: readonly CharacterSkinDef[] = [
  {
    id: 'knight-skybound',
    name: 'Hiệp Sĩ Thiên Không',
    title: 'Skybound Vanguard',
    description: 'Bộ giáp bạc lam truyền thống của hội Hiệp Sĩ Đỉnh Tháp cùng khăn choàng cam rực.',
    headStyle: 'plume',
    bodyStyle: 'standard',
    achievementId: null,
    achievementDesc: 'Mặc định mở khóa từ đầu hành trình',
    trailColor: 0x5ce1e6,
    palette: {
      O: 0x101320,
      H: 0x38598b,
      L: 0x679bf1,
      V: 0x0d0f18,
      E: 0x5ce1e6,
      S: 0xff8c42,
      R: 0xc85a17,
      B: 0x263859,
      G: 0xffd166,
      T: 0x4cc9f0,
      K: 0xffd166,
      F: 0xf77f00,
      Z: 0xffffff,
      t: 0x274c77,
      k: 0xd4a373,
      f: 0x9b2226,
      z: 0xadb5bd
    }
  },
  {
    id: 'paladin-solaris',
    name: 'Thánh Kỵ Sĩ Hoàng Kim',
    title: 'Solaris Paladin',
    description: 'Giáp vàng ròng đính ngọc lục bảo và mũ miện ánh sáng của Điện Thờ Mặt Trời.',
    headStyle: 'crown',
    bodyStyle: 'cloaked',
    achievementId: 'ach-first-summit',
    achievementDesc: 'Thành tựu: Chinh phục đỉnh cao 1 Thế giới bất kỳ',
    trailColor: 0xffd166,
    palette: {
      O: 0x1c1408,
      H: 0xb45309,
      L: 0xfacc15,
      V: 0x18181b,
      E: 0x34d399,
      S: 0xf8fafc,
      R: 0xcbd5e1,
      B: 0xd97706,
      G: 0x10b981,
      T: 0xfde047,
      K: 0xffffff,
      F: 0x92400e,
      Z: 0xfef08a,
      t: 0x92400e,
      k: 0xcbd5e1,
      f: 0x78350f,
      z: 0xd97706
    }
  },
  {
    id: 'ranger-sylvan',
    name: 'Lữ Khách Rừng Già',
    title: 'Sylvan Pathfinder',
    description: 'Mũ trùm đầu lá rừng cổ thụ và áo choàng thợ săn giúp di chuyển thanh thoát.',
    headStyle: 'hood',
    bodyStyle: 'cloaked',
    achievementId: 'ach-jumper-25',
    achievementDesc: 'Thành tựu: Thực hiện 25 cú nhảy trong hành trình',
    trailColor: 0x52b788,
    palette: {
      O: 0x0b1911,
      H: 0x1b4332,
      L: 0x40916c,
      V: 0x081c15,
      E: 0xa7f3d0,
      S: 0xd97706,
      R: 0x92400e,
      B: 0x2d6a4f,
      G: 0xfbbf24,
      T: 0x52b788,
      K: 0xb45309,
      F: 0x78350f,
      Z: 0xd6d3d1,
      t: 0x1b4332,
      k: 0x78350f,
      f: 0x451a03,
      z: 0x78716c
    }
  },
  {
    id: 'archmage-astral',
    name: 'Đại Pháp Sư Tinh Tú',
    title: 'Astral Archmage',
    description: 'Mũ chóp nhọn phù thủy thêu chỉ vàng cùng pháp bào tím sẫm hội tụ năng lượng ngân hà.',
    headStyle: 'wizard',
    bodyStyle: 'cloaked',
    achievementId: 'ach-treasure-1',
    achievementDesc: 'Thành tựu: Khám phá 1 Kho Báu Cổ Vật (Easter Egg)',
    trailColor: 0xc084fc,
    palette: {
      O: 0x120724,
      H: 0x4c1d95,
      L: 0x8b5cf6,
      V: 0x090414,
      E: 0xfef08a,
      S: 0xe879f9,
      R: 0xa21caf,
      B: 0x3b0764,
      G: 0xfacc15,
      T: 0xa855f7,
      K: 0xfde047,
      F: 0x581c87,
      Z: 0xf5d0fe,
      t: 0x3b0764,
      k: 0xca8a04,
      f: 0x2e1065,
      z: 0xa855f7
    }
  },
  {
    id: 'ronin-crimson',
    name: 'Kiếm Khách Huyết Nguyệt',
    title: 'Crimson Ronin',
    description: 'Giáp hắc thiết viền đỏ thẫm với cặp sừng chiến binh phương Đông dưới ánh trăng máu.',
    headStyle: 'horns',
    bodyStyle: 'standard',
    achievementId: 'ach-conqueror-3',
    achievementDesc: 'Thành tựu: Chinh phục 3 Thế giới khác nhau',
    trailColor: 0xf43f5e,
    palette: {
      O: 0x09090b,
      H: 0x27272a,
      L: 0x52525b,
      V: 0x090507,
      E: 0xff2a55,
      S: 0xe11d48,
      R: 0x881337,
      B: 0x18181b,
      G: 0xfacc15,
      T: 0xef4444,
      K: 0xd4d4d8,
      F: 0x27272a,
      Z: 0xf43f5e,
      t: 0x18181b,
      k: 0x71717a,
      f: 0x09090b,
      z: 0x9f1239
    }
  },
  {
    id: 'warden-abyss',
    name: 'Hộ Vệ Cổ Thành Sculk',
    title: 'Abyssal Warden',
    description: 'Sừng cảm biến âm vang xanh ngọc và bộ giáp hắc diện thạch từ tầng sâu Y=-54.',
    headStyle: 'horns',
    bodyStyle: 'cloaked',
    achievementId: 'ach-iron-will',
    achievementDesc: 'Thành tựu: Đứng dậy sau 10 cú ngã nặng từ trên cao',
    trailColor: 0x2dd4bf,
    palette: {
      O: 0x030c14,
      H: 0x0c2d3d,
      L: 0x155e75,
      V: 0x02080d,
      E: 0x2dd4bf,
      S: 0x06b6d4,
      R: 0x0e7490,
      B: 0x082f49,
      G: 0x5eead4,
      T: 0x22d3ee,
      K: 0x99f6e4,
      F: 0x0f172a,
      Z: 0x2dd4bf,
      t: 0x082f49,
      k: 0x14b8a6,
      f: 0x020617,
      z: 0x0891b2
    }
  },
  {
    id: 'maestro-neon',
    name: 'Chiến Binh Nhịp Điệu',
    title: 'Stage Maestro',
    description: 'Mũ ánh sáng trắng ngà kết hợp áo khoác sân khấu mang âm hưởng đại nhạc hội.',
    headStyle: 'visor',
    bodyStyle: 'standard',
    achievementId: 'ach-treasure-3',
    achievementDesc: 'Thành tựu: Khám phá 3 Kho Báu Cổ Vật',
    trailColor: 0x38bdf8,
    palette: {
      O: 0x0f172a,
      H: 0xcbd5e1,
      L: 0xffffff,
      V: 0x090d16,
      E: 0xf43f5e,
      S: 0x38bdf8,
      R: 0x0284c7,
      B: 0xe2e8f0,
      G: 0xfacc15,
      T: 0xffffff,
      K: 0xec4899,
      F: 0x1e293b,
      Z: 0xffffff,
      t: 0x94a3b8,
      k: 0xbe185d,
      f: 0x0f172a,
      z: 0xcbd5e1
    }
  },
  {
    id: 'valkyrie-celestial',
    name: 'Chiến Thần Cánh Trắng',
    title: 'Celestial Valkyrie',
    description: 'Mũ chiến thần gắn lông vũ bạc cùng đôi cánh thiên giới mở rộng mỗi khi tung mình lên không.',
    headStyle: 'wings-helm',
    bodyStyle: 'winged',
    achievementId: 'ach-jumper-100',
    achievementDesc: 'Thành tựu: Thực hiện tổng cộng 100 cú nhảy',
    trailColor: 0xe0f2fe,
    palette: {
      O: 0x0f172a,
      H: 0x94a3b8,
      L: 0xf8fafc,
      V: 0x0f172a,
      E: 0x38bdf8,
      S: 0xffffff,
      R: 0xbae6fd,
      B: 0x0284c7,
      G: 0xfacc15,
      T: 0xf8fafc,
      K: 0xfef08a,
      F: 0x0369a1,
      Z: 0xfacc15,
      t: 0x64748b,
      k: 0xeab308,
      f: 0x0c4a6e,
      z: 0xd97706
    }
  },
  {
    id: 'dragonlord-infernal',
    name: 'Long Vương Hỏa Ngục',
    title: 'Infernal Dragonlord',
    description: 'Giáp vảy rồng đen đỏ rực cháy cùng đôi cánh hỏa diệm và cặp sừng đại long.',
    headStyle: 'horns',
    bodyStyle: 'winged',
    achievementId: 'ach-iron-will-35',
    achievementDesc: 'Thành tựu: Kiên cường đứng dậy sau 35 lần ngã nặng',
    trailColor: 0xf97316,
    palette: {
      O: 0x180402,
      H: 0x7c2d12,
      L: 0xea580c,
      V: 0x0f0201,
      E: 0xfef08a,
      S: 0xfacc15,
      R: 0xdc2626,
      B: 0x450a0a,
      G: 0xfde047,
      T: 0xf97316,
      K: 0xfef08a,
      F: 0x7f1d1d,
      Z: 0xf59e0b,
      t: 0x450a0a,
      k: 0xd97706,
      f: 0x290505,
      z: 0xb45309
    }
  },
  {
    id: 'phantom-reaper',
    name: 'Bóng Ma Hư Không',
    title: 'Void Wraith',
    description: 'Áo choàng bóng đêm lơ lửng không trọng lực cùng đôi mắt tím phát quang ma mị.',
    headStyle: 'hood',
    bodyStyle: 'cloaked',
    achievementId: 'ach-flawless-climb',
    achievementDesc: 'Thành tựu: Hoàn thành 1 Thế giới mà không bị ngã nặng lần nào (0 Ngã)',
    trailColor: 0xa855f7,
    palette: {
      O: 0x05020a,
      H: 0x1e1b4b,
      L: 0x4c1d95,
      V: 0x030106,
      E: 0xe879f9,
      S: 0x6d28d9,
      R: 0x3b0764,
      B: 0x0f0d26,
      G: 0x22d3ee,
      T: 0x7c3aed,
      K: 0xf0abfc,
      F: 0x1e1b4b,
      Z: 0xc084fc,
      t: 0x0f0d26,
      k: 0x9333ea,
      f: 0x090514,
      z: 0x6b21a8
    }
  },
  {
    id: 'monarch-eternal',
    name: 'Quân Vương Bách Giới',
    title: 'Sovereign of Realms',
    description: 'Vương miện Đế Vương Bạch Kim cùng chiến bào đỏ hoàng gia dành cho bậc thầy leo tháp.',
    headStyle: 'crown',
    bodyStyle: 'winged',
    achievementId: 'ach-conqueror-5',
    achievementDesc: 'Thành tựu: Chinh phục 5 Thế giới hoặc đạt Speedrun dưới 90 giây',
    trailColor: 0xfbbf24,
    palette: {
      O: 0x181024,
      H: 0x94a3b8,
      L: 0xf8fafc,
      V: 0x0f071e,
      E: 0xfbbf24,
      S: 0xdc2626,
      R: 0x7f1d1d,
      B: 0x475569,
      G: 0xfacc15,
      T: 0xe2e8f0,
      K: 0xfacc15,
      F: 0x991b1b,
      Z: 0xfef08a,
      t: 0x64748b,
      k: 0xd97706,
      f: 0x450a0a,
      z: 0xeab308
    }
  },
  // ==================== TRANG PHỤC NGƯỜI SÁNG TẠO (CREATOR / ARCHITECT SERIES) ====================
  {
    id: 'creator-architect',
    name: '[SÁNG THẾ] Kiến Trúc Sư Đa Vũ Trụ',
    title: 'The Grand Architect',
    description: 'Trang phục Người Tạo: Áo bào Hoàng Kim Lục Bảo cùng Vòng Hào Quang Sáng Thế và đôi cánh ánh sáng.',
    headStyle: 'halo-crown',
    bodyStyle: 'halo-winged',
    isCreatorSeries: true,
    achievementId: 'ach-treasure-7',
    achievementDesc: 'Thành tựu Sáng Thế: Khám phá 7 Cổ Vật Bí Mật hoặc bật Chế độ Thử Đồ',
    trailColor: 0x10b981,
    palette: {
      O: 0x04120e,
      H: 0x047857,
      L: 0x34d399,
      V: 0x020a08,
      E: 0xfef08a,
      S: 0xfacc15,
      R: 0xd97706,
      B: 0x064e3b,
      G: 0xffffff,
      T: 0x6ee7b7,
      K: 0xfef08a,
      F: 0x065f46,
      Z: 0xffffff,
      t: 0x047857,
      k: 0xf59e0b,
      f: 0x022c22,
      z: 0xfacc15
    }
  },
  {
    id: 'creator-pixelgod',
    name: '[SÁNG THẾ] Họa Sư Điểm Ảnh',
    title: 'Pixel Forgemaster',
    description: 'Trang phục Người Tạo: Giáp Bạch Kim Quang Phổ hội tụ sắc màu nguyên bản của thế giới Pixel.',
    headStyle: 'halo-crown',
    bodyStyle: 'halo-winged',
    isCreatorSeries: true,
    achievementId: 'ach-conqueror-10',
    achievementDesc: 'Thành tựu Sáng Thế: Chinh phục 10 Thế giới hoặc bật Chế độ Thử Đồ',
    trailColor: 0xf472b6,
    palette: {
      O: 0x090d16,
      H: 0xcbd5e1,
      L: 0xffffff,
      V: 0x050811,
      E: 0x22d3ee,
      S: 0xf472b6,
      R: 0x8b5cf6,
      B: 0x38bdf8,
      G: 0xfef08a,
      T: 0xffffff,
      K: 0x34d399,
      F: 0x6366f1,
      Z: 0xfef08a,
      t: 0x94a3b8,
      k: 0xec4899,
      f: 0x312e81,
      z: 0x22d3ee
    }
  },
  {
    id: 'creator-chronos',
    name: '[SÁNG THẾ] Chúa Tể Thời Không',
    title: 'Chronos Overseer',
    description: 'Trang phục Người Tạo tối thượng: Pháp phục Đen Vàng Vĩnh Cửu điều khiển dòng chảy thời gian.',
    headStyle: 'halo-crown',
    bodyStyle: 'halo-winged',
    isCreatorSeries: true,
    achievementId: 'ach-jumper-300',
    achievementDesc: 'Thành tựu Sáng Thế: Thực hiện 300 cú nhảy hoặc Chinh phục 20 Thế giới',
    trailColor: 0xfde047,
    palette: {
      O: 0x050507,
      H: 0x27272a,
      L: 0xfacc15,
      V: 0x000000,
      E: 0xffffff,
      S: 0xfef08a,
      R: 0xb45309,
      B: 0x18181b,
      G: 0x38bdf8,
      T: 0xfde047,
      K: 0xffffff,
      F: 0x09090b,
      Z: 0xfacc15,
      t: 0x3f3f46,
      k: 0xeab308,
      f: 0x000000,
      z: 0xd97706
    }
  }
];

export const WEAPON_ITEMS: readonly WeaponItemDef[] = [
  {
    id: 'weapon-none',
    name: 'Tay Không',
    category: 'Không cầm',
    description: 'Không cầm vũ khí để giữ phong thái tối giản.',
    achievementId: null,
    achievementDesc: 'Mặc định có sẵn',
    fxStyle: 'none',
    fxColor: 0x94a3b8,
    fxSecondaryColor: 0xffffff
  },
  {
    id: 'weapon-broadsword',
    name: 'Trường Kiếm Hiệp Sĩ',
    category: 'Kiếm',
    description: 'Thanh kiếm thép sáng cổ điển tỏa ánh kim sắc lạnh.',
    achievementId: null,
    achievementDesc: 'Mặc định mở khóa',
    fxStyle: 'steel',
    fxColor: 0x7dd3fc,
    fxSecondaryColor: 0xffffff
  },
  {
    id: 'weapon-archmage-staff',
    name: 'Quyền Trượng Pha Lê',
    category: 'Trượng',
    description: 'Trượng gỗ cổ thụ gắn viên pha lê xanh ngọc tỏa hạt ma pháp lấp lánh.',
    achievementId: null,
    achievementDesc: 'Mặc định mở khóa',
    fxStyle: 'arcane',
    fxColor: 0x22d3ee,
    fxSecondaryColor: 0xa5f3fc
  },
  {
    id: 'weapon-sunblade',
    name: 'Hỏa Long Đại Kiếm',
    category: 'Kiếm',
    description: 'Lưỡi đại kiếm rèn từ dung nham bốc lửa hồng liên tục quanh thân kiếm.',
    achievementId: 'ach-first-summit',
    achievementDesc: 'Thành tựu: Chinh phục 1 Thế giới bất kỳ',
    fxStyle: 'flame',
    fxColor: 0xf97316,
    fxSecondaryColor: 0xfef08a
  },
  {
    id: 'weapon-dragon-lance',
    name: 'Thương Ngọc Lục Bảo',
    category: 'Thương',
    description: 'Mũi trường thương sắc bén bao bọc bởi luồng gió lốc xanh lục bảo.',
    achievementId: 'ach-treasure-1',
    achievementDesc: 'Thành tựu: Khám phá 1 Kho Báu Cổ Vật',
    fxStyle: 'emerald',
    fxColor: 0x10b981,
    fxSecondaryColor: 0xa7f3d0
  },
  {
    id: 'weapon-runed-axe',
    name: 'Chiến Rìu Cổ Tự',
    category: 'Rìu',
    description: 'Rìu chiến hai lưỡi khắc cổ tự băng giá tỏa sương hàn phương Bắc.',
    achievementId: 'ach-iron-will',
    achievementDesc: 'Thành tựu: Đứng dậy sau 10 cú ngã nặng',
    fxStyle: 'frost',
    fxColor: 0x38bdf8,
    fxSecondaryColor: 0xe0f2fe
  },
  {
    id: 'weapon-void-scythe',
    name: 'Lưỡi Hái Tinh Hà',
    category: 'Lưỡi Hái',
    description: 'Lưỡi hái uốn cong giải phóng hạt năng lượng hư không tím sẫm.',
    achievementId: 'ach-treasure-3',
    achievementDesc: 'Thành tựu: Khám phá 3 Kho Báu Cổ Vật',
    fxStyle: 'void',
    fxColor: 0xa855f7,
    fxSecondaryColor: 0xf0abfc
  },
  {
    id: 'weapon-starforge-hammer',
    name: 'Búa Rèn Tinh Tú',
    category: 'Búa Thần',
    description: 'Chiếc búa thần rèn các vì sao, phóng tia hồ quang điện vàng xanh.',
    achievementId: 'ach-jumper-100',
    achievementDesc: 'Thành tựu: Thực hiện tổng cộng 100 cú nhảy',
    fxStyle: 'divine',
    fxColor: 0xfacc15,
    fxSecondaryColor: 0x38bdf8
  },
  {
    id: 'weapon-phoenix-glaive',
    name: 'Đại Đao Phượng Hoàng',
    category: 'Thương',
    description: 'Thanh đại đao rực lửa bất diệt tạo cánh chim lửa khi bật nhảy.',
    achievementId: 'ach-iron-will-35',
    achievementDesc: 'Thành tựu: Đứng dậy sau 35 cú ngã nặng',
    fxStyle: 'flame',
    fxColor: 0xef4444,
    fxSecondaryColor: 0xfde047
  },
  {
    id: 'weapon-royal-scepter',
    name: 'Vương Trượng Tối Thượng',
    category: 'Trượng',
    description: 'Quyền trượng hoàng kim đính hồng ngọc tỏa hào quang đế vương.',
    achievementId: 'ach-conqueror-5',
    achievementDesc: 'Thành tựu: Chinh phục 5 Thế giới hoặc Speedrun < 90s',
    fxStyle: 'divine',
    fxColor: 0xfbbf24,
    fxSecondaryColor: 0xffffff
  },
  {
    id: 'weapon-creator-pen',
    name: '[SÁNG THẾ] Bút Kiếm Kiến Tạo',
    category: 'Thần Khí',
    description: 'Thần khí của Người Tạo: Vẽ ra các hạt điểm ảnh cầu vồng rực rỡ trong không trung.',
    achievementId: 'ach-treasure-7',
    achievementDesc: 'Thành tựu Sáng Thế: Khám phá 7 Cổ Vật Bí Mật',
    fxStyle: 'creator-prism',
    fxColor: 0x34d399,
    fxSecondaryColor: 0xf472b6
  },
  {
    id: 'weapon-chrono-blade',
    name: '[SÁNG THẾ] Kiếm Thời Không Vô Cực',
    category: 'Thần Khí',
    description: 'Thanh kiếm cắt xuyên chiều không gian, bao phủ bởi vòng xoáy vàng kim - lam ngọc.',
    achievementId: 'ach-conqueror-10',
    achievementDesc: 'Thành tựu Sáng Thế: Chinh phục 10 Thế giới',
    fxStyle: 'creator-prism',
    fxColor: 0xfacc15,
    fxSecondaryColor: 0x22d3ee
  }
];

export const SHIELD_ITEMS: readonly ShieldItemDef[] = [
  {
    id: 'shield-none',
    name: 'Không Đeo Khiên',
    category: 'Không đeo',
    description: 'Tay trái tự do, không mang khiên hoặc pháp khí.',
    achievementId: null,
    achievementDesc: 'Mặc định có sẵn',
    fxStyle: 'none',
    fxColor: 0x94a3b8,
    fxSecondaryColor: 0xffffff
  },
  {
    id: 'shield-heraldic',
    name: 'Khiên Thép Chữ Thập',
    category: 'Khiên',
    description: 'Khiên hiệp sĩ viền vàng khắc gia huy tỏa vòng bảo hộ lam nhạt.',
    achievementId: null,
    achievementDesc: 'Mặc định mở khóa',
    fxStyle: 'steel',
    fxColor: 0x60a5fa,
    fxSecondaryColor: 0xe2e8f0
  },
  {
    id: 'shield-sun-aegis',
    name: 'Khiên Thánh Quang Aegis',
    category: 'Khiên',
    description: 'Khiên tròn mạ vàng ròng phát vòng hào quang mặt trời rực rỡ.',
    achievementId: 'ach-first-summit',
    achievementDesc: 'Thành tựu: Chinh phục 1 Thế giới bất kỳ',
    fxStyle: 'divine',
    fxColor: 0xfacc15,
    fxSecondaryColor: 0xfef08a
  },
  {
    id: 'shield-frost-buckler',
    name: 'Khiên Băng Vĩnh Cửu',
    category: 'Khiên',
    description: 'Khiên đúc từ băng vĩnh cửu tỏa bông tuyết lạnh giá xoay quanh.',
    achievementId: 'ach-jumper-25',
    achievementDesc: 'Thành tựu: Thực hiện 25 cú nhảy',
    fxStyle: 'frost',
    fxColor: 0x38bdf8,
    fxSecondaryColor: 0xffffff
  },
  {
    id: 'shield-arcane-tome',
    name: 'Cổ Thư Pháp Thuật',
    category: 'Pháp Khí',
    description: 'Quyển sách cổ ngữ bìa vàng lơ lửng, phóng thích các ký tự ma thuật.',
    achievementId: 'ach-treasure-1',
    achievementDesc: 'Thành tựu: Khám phá 1 Kho Báu Cổ Vật',
    fxStyle: 'arcane',
    fxColor: 0xc084fc,
    fxSecondaryColor: 0xfef08a
  },
  {
    id: 'shield-soul-lantern',
    name: 'Lồng Đèn Linh Hồn',
    category: 'Pháp Khí',
    description: 'Chiếc đèn sắt cổ phát ngọn lửa linh hồn xanh ngọc bập bùng.',
    achievementId: 'ach-conqueror-3',
    achievementDesc: 'Thành tựu: Chinh phục 3 Thế giới khác nhau',
    fxStyle: 'arcane',
    fxColor: 0x2dd4bf,
    fxSecondaryColor: 0x99f6e4
  },
  {
    id: 'shield-phoenix-wing',
    name: 'Khiên Cánh Phượng Hoàng',
    category: 'Khiên',
    description: 'Tấm khiên hình cánh chim lửa tỏa tàn lửa đỏ vàng bảo vệ chủ nhân.',
    achievementId: 'ach-flawless-climb',
    achievementDesc: 'Thành tựu: Hoàn thành 1 Thế giới mà không bị ngã nặng (0 Ngã)',
    fxStyle: 'flame',
    fxColor: 0xf97316,
    fxSecondaryColor: 0xfef08a
  },
  {
    id: 'shield-creator-cube',
    name: '[SÁNG THẾ] Khối Lập Phương Khởi Nguyên',
    category: 'Thần Khí',
    description: 'Lõi ma trận của Người Tạo: Tự xoay tròn và phát sóng năng lượng đa chiều.',
    achievementId: 'ach-jumper-300',
    achievementDesc: 'Thành tựu Sáng Thế: Thực hiện 300 cú nhảy hoặc Chinh phục 20 Thế giới',
    fxStyle: 'creator-prism',
    fxColor: 0x22d3ee,
    fxSecondaryColor: 0xfacc15
  }
];

export const ACHIEVEMENTS_LIST: readonly AchievementDef[] = [
  {
    id: 'ach-jumper-25',
    title: 'I. Bước Nhảy Khởi Đầu',
    description: 'Thực hiện tổng cộng 25 cú nhảy trong hành trình leo tháp.',
    rewardText: 'Mở khóa: Lữ Khách Rừng Già & Khiên Băng Vĩnh Cửu',
    checkUnlocked: (s) => s.unlockAllOverride || s.totalJumps >= 25,
    getProgressText: (s) => `${Math.min(25, s.totalJumps)} / 25 nhảy`
  },
  {
    id: 'ach-first-summit',
    title: 'II. Người Chinh Phục Đỉnh Tháp',
    description: 'Hoàn thành 1 Thế giới bất kỳ lần đầu tiên (Không dùng Checkpoint).',
    rewardText: 'Mở khóa: Thánh Kỵ Sĩ Hoàng Kim, Hỏa Long Kiếm & Khiên Aegis',
    checkUnlocked: (s) => s.unlockAllOverride || s.completedWorldsCount >= 1,
    getProgressText: (s) => `${Math.min(1, s.completedWorldsCount)} / 1 Thế giới`
  },
  {
    id: 'ach-treasure-1',
    title: 'III. Thợ Săn Cổ Vật',
    description: 'Tìm thấy ít nhất 1 Kho Báu Bí Mật (Easter Egg) ở tầng 5.',
    rewardText: 'Mở khóa: Đại Pháp Sư Tinh Tú, Thương Lục Bảo & Cổ Thư',
    checkUnlocked: (s) => s.unlockAllOverride || s.discoveredEggsCount >= 1,
    getProgressText: (s) => `${Math.min(1, s.discoveredEggsCount)} / 1 Cổ Vật`
  },
  {
    id: 'ach-iron-will',
    title: 'IV. Ý Chí Bất Khuất',
    description: 'Đứng dậy tiếp tục leo sau 10 cú ngã nặng từ trên cao.',
    rewardText: 'Mở khóa: Hộ Vệ Cổ Thành Sculk & Chiến Rìu Cổ Tự',
    checkUnlocked: (s) => s.unlockAllOverride || s.totalHardFalls >= 10,
    getProgressText: (s) => `${Math.min(10, s.totalHardFalls)} / 10 lần ngã`
  },
  {
    id: 'ach-jumper-100',
    title: 'V. Đôi Cánh Vượt Mây',
    description: 'Thực hiện tổng cộng 100 cú nhảy trên các vách đá.',
    rewardText: 'Mở khóa: Chiến Thần Cánh Trắng (Valkyrie) & Búa Rèn Tinh Tú',
    checkUnlocked: (s) => s.unlockAllOverride || s.totalJumps >= 100,
    getProgressText: (s) => `${Math.min(100, s.totalJumps)} / 100 nhảy`
  },
  {
    id: 'ach-conqueror-3',
    title: 'VI. Lữ Khách Đa Vũ Trụ',
    description: 'Chinh phục 3 Thế giới khác nhau.',
    rewardText: 'Mở khóa: Kiếm Khách Huyết Nguyệt & Lồng Đèn Linh Hồn',
    checkUnlocked: (s) => s.unlockAllOverride || s.completedWorldsCount >= 3,
    getProgressText: (s) => `${Math.min(3, s.completedWorldsCount)} / 3 Thế giới`
  },
  {
    id: 'ach-treasure-3',
    title: 'VII. Bậc Thầy Cổ Vật',
    description: 'Sưu tầm được 3 Kho Báu Cổ Vật trên các bản đồ.',
    rewardText: 'Mở khóa: Chiến Binh Nhịp Điệu & Lưỡi Hái Tinh Hà',
    checkUnlocked: (s) => s.unlockAllOverride || s.discoveredEggsCount >= 3,
    getProgressText: (s) => `${Math.min(3, s.discoveredEggsCount)} / 3 Cổ Vật`
  },
  {
    id: 'ach-iron-will-35',
    title: 'VIII. Trái Tim Long Vương',
    description: 'Vượt qua 35 cú ngã nặng mà không bỏ cuộc.',
    rewardText: 'Mở khóa: Long Vương Hỏa Ngục & Đại Đao Phượng Hoàng',
    checkUnlocked: (s) => s.unlockAllOverride || s.totalHardFalls >= 35,
    getProgressText: (s) => `${Math.min(35, s.totalHardFalls)} / 35 lần ngã`
  },
  {
    id: 'ach-flawless-climb',
    title: 'IX. Bước Chân Vô Ảnh',
    description: 'Chinh phục đỉnh cao 1 Thế giới mà không bị ngã nặng lần nào (0 Ngã).',
    rewardText: 'Mở khóa: Bóng Ma Hư Không & Khiên Cánh Phượng Hoàng',
    checkUnlocked: (s) => s.unlockAllOverride || s.zeroFallCompleted,
    getProgressText: (s) => (s.zeroFallCompleted ? 'Đã đạt 0 Ngã' : 'Cần 1 màn 0 Ngã')
  },
  {
    id: 'ach-conqueror-5',
    title: 'X. Quân Vương Đỉnh Tháp',
    description: 'Chinh phục 5 Thế giới hoặc hoàn thành 1 màn dưới 90 giây.',
    rewardText: 'Mở khóa: Quân Vương Bách Giới & Vương Trượng Tối Thượng',
    checkUnlocked: (s) =>
      s.unlockAllOverride ||
      s.completedWorldsCount >= 5 ||
      (s.fastestRunMs !== null && s.fastestRunMs <= 90000),
    getProgressText: (s) => `${Math.min(5, s.completedWorldsCount)} / 5 Thế giới`
  },
  {
    id: 'ach-treasure-7',
    title: 'XI. [SÁNG THẾ] Kiến Trúc Sư Cổ Vật',
    description: 'Khám phá 7 Kho Báu Bí Mật trên khắp các vũ trụ.',
    rewardText: 'Mở khóa: [SÁNG THẾ] Kiến Trúc Sư Đa Vũ Trụ & Bút Kiếm Kiến Tạo',
    checkUnlocked: (s) => s.unlockAllOverride || s.discoveredEggsCount >= 7,
    getProgressText: (s) => `${Math.min(7, s.discoveredEggsCount)} / 7 Cổ Vật`
  },
  {
    id: 'ach-conqueror-10',
    title: 'XII. [SÁNG THẾ] Họa Sư Mười Thế Giới',
    description: 'Chinh phục thành công 10 Thế giới đầy thử thách.',
    rewardText: 'Mở khóa: [SÁNG THẾ] Họa Sư Điểm Ảnh & Kiếm Thời Không Vô Cực',
    checkUnlocked: (s) => s.unlockAllOverride || s.completedWorldsCount >= 10,
    getProgressText: (s) => `${Math.min(10, s.completedWorldsCount)} / 10 Thế giới`
  },
  {
    id: 'ach-jumper-300',
    title: 'XIII. [SÁNG THẾ] Chúa Tể Thời Không',
    description: 'Thực hiện 300 cú nhảy hoặc chinh phục 20 Thế giới.',
    rewardText: 'Mở khóa: [SÁNG THẾ] Chúa Tể Thời Không & Khối Lập Phương Khởi Nguyên',
    checkUnlocked: (s) =>
      s.unlockAllOverride || s.totalJumps >= 300 || s.completedWorldsCount >= 20,
    getProgressText: (s) => `${Math.min(300, s.totalJumps)} / 300 nhảy`
  }
];

interface StoredCareerData {
  totalJumps: number;
  totalHardFalls: number;
  unlockAllOverride: boolean;
}

export class CharacterLoadoutService {
  private readonly saveService = new LocalStorageSaveService();
  private loadout: PlayerLoadout;
  private career: StoredCareerData;

  constructor() {
    this.career = this.loadCareerData();
    this.loadout = this.loadLoadout();
  }

  public getLoadout(): Readonly<PlayerLoadout> {
    return this.loadout;
  }

  public getSkinDef(id: CharacterSkinId = this.loadout.skinId): CharacterSkinDef {
    return CHARACTER_SKINS.find((s) => s.id === id) ?? CHARACTER_SKINS[0]!;
  }

  public getWeaponDef(id: WeaponItemId = this.loadout.weaponId): WeaponItemDef {
    return WEAPON_ITEMS.find((w) => w.id === id) ?? WEAPON_ITEMS[0]!;
  }

  public getShieldDef(id: ShieldItemId = this.loadout.shieldId): ShieldItemDef {
    return SHIELD_ITEMS.find((sh) => sh.id === id) ?? SHIELD_ITEMS[0]!;
  }

  public getCareerStats(): PlayerCareerStats {
    const bestRuns = this.saveService.getBestRuns();
    const runsList = Object.values(bestRuns);
    const completedWorldsCount = runsList.length;
    const discoveredEggsCount = this.saveService.getDiscoveredEasterEggs().length;
    let fastestRunMs: number | null = null;
    let zeroFallCompleted = false;
    for (const run of runsList) {
      if (fastestRunMs === null || run.bestTimeMs < fastestRunMs) {
        fastestRunMs = run.bestTimeMs;
      }
      if (run.leastFalls === 0) {
        zeroFallCompleted = true;
      }
    }
    return {
      completedWorldsCount,
      discoveredEggsCount,
      totalJumps: this.career.totalJumps,
      totalHardFalls: this.career.totalHardFalls,
      fastestRunMs,
      zeroFallCompleted,
      unlockAllOverride: this.career.unlockAllOverride
    };
  }

  public recordJump(): void {
    this.career.totalJumps += 1;
    this.saveCareerData();
  }

  public recordHardFall(): void {
    this.career.totalHardFalls += 1;
    this.saveCareerData();
  }

  public toggleUnlockAllOverride(): boolean {
    this.career.unlockAllOverride = !this.career.unlockAllOverride;
    this.saveCareerData();
    return this.career.unlockAllOverride;
  }

  public isAchievementUnlocked(achievementId: string | null): boolean {
    if (!achievementId) return true;
    const stats = this.getCareerStats();
    if (stats.unlockAllOverride) return true;
    const ach = ACHIEVEMENTS_LIST.find((a) => a.id === achievementId);
    return ach ? ach.checkUnlocked(stats) : true;
  }

  public setSkin(skinId: CharacterSkinId): boolean {
    const def = this.getSkinDef(skinId);
    if (!this.isAchievementUnlocked(def.achievementId)) return false;
    this.loadout.skinId = skinId;
    this.saveLoadout();
    return true;
  }

  public setWeapon(weaponId: WeaponItemId): boolean {
    const def = this.getWeaponDef(weaponId);
    if (!this.isAchievementUnlocked(def.achievementId)) return false;
    this.loadout.weaponId = weaponId;
    this.saveLoadout();
    return true;
  }

  public setShield(shieldId: ShieldItemId): boolean {
    const def = this.getShieldDef(shieldId);
    if (!this.isAchievementUnlocked(def.achievementId)) return false;
    this.loadout.shieldId = shieldId;
    this.saveLoadout();
    return true;
  }

  private loadLoadout(): PlayerLoadout {
    const fallback: PlayerLoadout = {
      skinId: 'knight-skybound',
      weaponId: 'weapon-broadsword',
      shieldId: 'shield-heraldic'
    };
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_LOADOUT);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw) as Partial<PlayerLoadout>;
      return {
        skinId: CHARACTER_SKINS.some((s) => s.id === parsed.skinId)
          ? (parsed.skinId as CharacterSkinId)
          : fallback.skinId,
        weaponId: WEAPON_ITEMS.some((w) => w.id === parsed.weaponId)
          ? (parsed.weaponId as WeaponItemId)
          : fallback.weaponId,
        shieldId: SHIELD_ITEMS.some((sh) => sh.id === parsed.shieldId)
          ? (parsed.shieldId as ShieldItemId)
          : fallback.shieldId
      };
    } catch {
      return fallback;
    }
  }

  private saveLoadout(): void {
    try {
      window.localStorage.setItem(STORAGE_KEY_LOADOUT, JSON.stringify(this.loadout));
    } catch {
      // Ignore storage error
    }
  }

  private loadCareerData(): StoredCareerData {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY_CAREER);
      if (!raw) {
        return { totalJumps: 0, totalHardFalls: 0, unlockAllOverride: false };
      }
      const parsed = JSON.parse(raw) as Partial<StoredCareerData>;
      return {
        totalJumps: typeof parsed.totalJumps === 'number' ? parsed.totalJumps : 0,
        totalHardFalls: typeof parsed.totalHardFalls === 'number' ? parsed.totalHardFalls : 0,
        unlockAllOverride: Boolean(parsed.unlockAllOverride)
      };
    } catch {
      return { totalJumps: 0, totalHardFalls: 0, unlockAllOverride: false };
    }
  }

  private saveCareerData(): void {
    try {
      window.localStorage.setItem(STORAGE_KEY_CAREER, JSON.stringify(this.career));
    } catch {
      // Ignore storage error
    }
  }
}

export const globalLoadout = new CharacterLoadoutService();
