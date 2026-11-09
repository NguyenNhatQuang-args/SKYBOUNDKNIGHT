export type WorldTheme =
  | 'forest'
  | 'ice'
  | 'wind'
  // Vũ trụ Minecraft (12 themes)
  | 'mc-overworld'
  | 'mc-lush'
  | 'mc-deepdark'
  | 'mc-frozen'
  | 'mc-ocean'
  | 'mc-cherry'
  | 'mc-redstone'
  | 'mc-nether'
  | 'mc-soul'
  | 'mc-bastion'
  | 'mc-end'
  | 'mc-endcity'
  // Vũ trụ Terraria (5 themes)
  | 'tr-purity'
  | 'tr-corruption'
  | 'tr-hallow'
  | 'tr-jungle'
  | 'tr-nebula'
  // Vũ trụ Celeste (5 themes)
  | 'cl-city'
  | 'cl-dream'
  | 'cl-resort'
  | 'cl-ridge'
  | 'cl-summit'
  // Vũ trụ Hollow Knight (5 themes)
  | 'hk-crossroads'
  | 'hk-greenpath'
  | 'hk-crystal'
  | 'hk-tears'
  | 'hk-palace'
  // Vũ trụ Super Mario (5 themes)
  | 'sm-plains'
  | 'sm-underground'
  | 'sm-sky'
  | 'sm-galaxy'
  | 'sm-castle'
  // Vũ trụ Sonic (5 themes)
  | 'sn-greenhill'
  | 'sn-chemical'
  | 'sn-casino'
  | 'sn-icecap'
  | 'sn-sanctuary'
  // Vũ trụ Elden Ring (5 themes)
  | 'er-limgrave'
  | 'er-liurnia'
  | 'er-caelid'
  | 'er-nokron'
  | 'er-azula'
  // ===== Thám hiểm: The Legend of Zelda (5 themes) =====
  | 'zd-meadow'
  | 'zd-lostwoods'
  | 'zd-deathmtn'
  | 'zd-zora'
  | 'zd-skyisle'
  // ===== Thám hiểm: Tomb Raider (5 themes) =====
  | 'tb-jungle'
  | 'tb-egypt'
  | 'tb-himalaya'
  | 'tb-atlantis'
  | 'tb-yamatai'
  // ===== Thám hiểm: Metroid (5 themes) =====
  | 'mt-crateria'
  | 'mt-brinstar'
  | 'mt-norfair'
  | 'mt-maridia'
  | 'mt-tourian'
  // ===== Thám hiểm: Subnautica (5 themes) =====
  | 'sb-shallows'
  | 'sb-kelp'
  | 'sb-jellyshroom'
  | 'sb-lostriver'
  | 'sb-lava'
  // ===== Thám hiểm: Spelunky (5 themes) =====
  | 'sp-mines'
  | 'sp-jungle'
  | 'sp-icecaves'
  | 'sp-temple'
  | 'sp-cosmic'
  // ===== Thám hiểm: Ori (5 themes) =====
  | 'or-nibel'
  | 'or-ginso'
  | 'or-forlorn'
  | 'or-horu'
  | 'or-willow'
  // ===== Liveshow & Concert: The Weeknd Tour (5 themes) =====
  | 'wk-blinding'
  | 'wk-starboy'
  | 'wk-afterhours'
  | 'wk-dawnfm'
  | 'wk-sofi'
  // ===== Liveshow & Concert: Marsbunn / Marshmello Live (5 themes) =====
  | 'mb-alone'
  | 'mb-happier'
  | 'mb-joytime'
  | 'mb-bass'
  | 'mb-ultra'
  // ===== Liveshow & Concert: Synthwave & Cyber Live (5 themes) =====
  | 'sw-outrun'
  | 'sw-pyramid'
  | 'sw-holo'
  | 'sw-vinyl'
  | 'sw-cathedral'
  // ===== Liveshow & Concert: EDM Festival Mainstage (5 themes) =====
  | 'ed-wisdom'
  | 'ed-rose'
  | 'ed-freedom'
  | 'ed-core'
  | 'ed-encore'
  // ===== Liveshow & Concert: Rock & Symphony Encore (5 themes) =====
  | 'rk-amp'
  | 'rk-pyro'
  | 'rk-piano'
  | 'rk-symphony'
  | 'rk-finale';

/** Danh sách đầy đủ 100 chủ đề (dùng cho map ngẫu nhiên & kiểm tra hợp lệ). */
export const ALL_WORLD_THEMES: readonly WorldTheme[] = [
  'forest', 'ice', 'wind',
  'mc-overworld', 'mc-lush', 'mc-deepdark', 'mc-frozen', 'mc-ocean', 'mc-cherry',
  'mc-redstone', 'mc-nether', 'mc-soul', 'mc-bastion', 'mc-end', 'mc-endcity',
  'tr-purity', 'tr-corruption', 'tr-hallow', 'tr-jungle', 'tr-nebula',
  'cl-city', 'cl-dream', 'cl-resort', 'cl-ridge', 'cl-summit',
  'hk-crossroads', 'hk-greenpath', 'hk-crystal', 'hk-tears', 'hk-palace',
  'sm-plains', 'sm-underground', 'sm-sky', 'sm-galaxy', 'sm-castle',
  'sn-greenhill', 'sn-chemical', 'sn-casino', 'sn-icecap', 'sn-sanctuary',
  'er-limgrave', 'er-liurnia', 'er-caelid', 'er-nokron', 'er-azula',
  'zd-meadow', 'zd-lostwoods', 'zd-deathmtn', 'zd-zora', 'zd-skyisle',
  'tb-jungle', 'tb-egypt', 'tb-himalaya', 'tb-atlantis', 'tb-yamatai',
  'mt-crateria', 'mt-brinstar', 'mt-norfair', 'mt-maridia', 'mt-tourian',
  'sb-shallows', 'sb-kelp', 'sb-jellyshroom', 'sb-lostriver', 'sb-lava',
  'sp-mines', 'sp-jungle', 'sp-icecaves', 'sp-temple', 'sp-cosmic',
  'or-nibel', 'or-ginso', 'or-forlorn', 'or-horu', 'or-willow',
  'wk-blinding', 'wk-starboy', 'wk-afterhours', 'wk-dawnfm', 'wk-sofi',
  'mb-alone', 'mb-happier', 'mb-joytime', 'mb-bass', 'mb-ultra',
  'sw-outrun', 'sw-pyramid', 'sw-holo', 'sw-vinyl', 'sw-cathedral',
  'ed-wisdom', 'ed-rose', 'ed-freedom', 'ed-core', 'ed-encore',
  'rk-amp', 'rk-pyro', 'rk-piano', 'rk-symphony', 'rk-finale'
];

export type TileKind =
  | 'empty'
  | 'solid'
  | 'ice'
  | 'bouncy'
  /** Bục nhảy một chiều: nhảy xuyên từ dưới lên, chỉ đứng được khi rơi xuống từ phía trên. */
  | 'platform'
  /** Khối sụp đổ: vỡ sau khi đứng lên một lúc, tự hồi phục sau vài giây. */
  | 'crumble'
  | 'hazard'
  | 'wind-left'
  | 'wind-right'
  | 'checkpoint'
  | 'spawn'
  | 'goal'
  | 'easter-egg';

export interface LevelScreenData {
  rows: string[];
}

export interface LevelSeedState {
  /** Mã Hạt Giống định danh duy nhất của bản đồ (VD: SKB-001-FOREST-7A3F) */
  seedCode: string;
  /** Giá trị số nguyên 32-bit băm từ seedCode */
  numericSeed: number;
  /** Số thứ tự màn chơi trong chuỗi 100 thế giới (1..100, hoặc 1+ cho chuỗi ngẫu nhiên) */
  worldNumber: number;
  /** Tổng số thế giới trong chuỗi liên kết (mặc định 100) */
  totalWorlds: number;
  /** Cấp độ khó tính theo bậc (Medium, Hard, Expert, Master, Grandmaster) */
  difficultyLabel: string;
  /** Chỉ số độ khó từ 1..10 */
  difficultyRating: number;
  /** Tên kiểu kiến trúc địa hình sinh từ Seed */
  archetypeLabel: string;
  /** Danh sách các mô-đun chướng ngại vật nhảy được kích hoạt bởi Seed */
  obstacleLabels: string[];
}

export interface LevelData {
  id: string;
  name: string;
  version: number;
  tileSize: number;
  theme: WorldTheme;
  /** Trạng thái Hạt Giống (Seed State) chi tiết điều khiển địa hình & chướng ngại vật */
  seedState?: LevelSeedState;
  /**
   * Danh sách các màn hình xếp chồng từ DƯỚI LÊN TRÊN (screens[0] là màn đáy chứa Spawn,
   * screens[screens.length - 1] là màn đỉnh).
   * Mỗi màn hình có đúng 24 hàng (từ đỉnh màn hình xuống đáy màn hình), mỗi hàng 32 ký tự.
   */
  screens: LevelScreenData[];
  legend: Record<string, TileKind>;
}

export interface WorldMeta {
  id: string;
  name: string;
  theme: WorldTheme;
  file: string;
  realm?: string;
  easterEggName?: string;
  /** Mã Seed gốc của bản đồ trong chuỗi 100 Thế Giới */
  defaultSeed?: string;
  /** Thứ tự màn (1..100) */
  worldNumber?: number;
}
