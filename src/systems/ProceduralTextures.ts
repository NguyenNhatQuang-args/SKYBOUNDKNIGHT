import Phaser from 'phaser';
import { DISPLAY } from '../constants';
import { WorldTheme } from '../data/levelTypes';
import {
  CHARACTER_SKINS,
  CharacterSkinDef,
  CharacterSkinId,
  ShieldItemId,
  WeaponItemId
} from '../services/CharacterLoadoutService';

export const TEXTURE_KEYS = {
  PLAYER_IDLE: 'player_idle',
  PLAYER_WALK_1: 'player_walk_1',
  PLAYER_WALK_2: 'player_walk_2',
  PLAYER_WALK_3: 'player_walk_3',
  PLAYER_WALK_4: 'player_walk_4',
  PLAYER_WALK_5: 'player_walk_5',
  PLAYER_WALK_6: 'player_walk_6',
  PLAYER_CHARGE: 'player_charge',
  PLAYER_JUMP: 'player_jump',
  PLAYER_FALL: 'player_fall',
  PLAYER_SPLAT: 'player_splat',

  // 3D Depth & Structural Support
  TILE_SHADOW_3D: 'tile_shadow_3d',
  TILE_BG_SUPPORT: 'tile_bg_support',

  // Interactive Special Tiles
  TILE_ICE: 'tile_ice',
  TILE_BOUNCY: 'tile_bouncy',
  TILE_PLATFORM: 'tile_platform',
  TILE_CRUMBLE: 'tile_crumble',
  TILE_CRUMBLE_CRACKED: 'tile_crumble_cracked',
  TILE_WIND_LEFT: 'tile_wind_left',
  TILE_WIND_RIGHT: 'tile_wind_right',
  TILE_CHECKPOINT_INACTIVE: 'tile_checkpoint_inactive',
  TILE_CHECKPOINT_ACTIVE: 'tile_checkpoint_active',
  TILE_SPAWN: 'tile_spawn',
  TILE_GOAL: 'tile_goal',
  TILE_EASTER_EGG: 'tile_easter_egg',

  // Scenic Props (Vật thể trang trí có chiều sâu)
  PROP_TREE_OAK: 'prop_tree_oak',
  PROP_TREE_CHERRY: 'prop_tree_cherry',
  PROP_SHROOM_GLOW: 'prop_shroom_glow',
  PROP_CRYSTAL_CLUSTER: 'prop_crystal_cluster',
  PROP_LANTERN: 'prop_lantern',
  PROP_SOUL_BRAZIER: 'prop_soul_brazier',
  PROP_CORAL_FAN: 'prop_coral_fan',
  PROP_CHEST_GOLD: 'prop_chest_gold',
  PROP_END_ROD: 'prop_end_rod',
  PROP_VINE_GLOW: 'prop_vine_glow',
  PROP_STALACTITE: 'prop_stalactite',
  PROP_TORCH: 'prop_torch',
  PROP_RUIN_PILLAR: 'prop_ruin_pillar',
  PROP_TECH_LIGHT: 'prop_tech_light',
  PROP_SAND_URN: 'prop_sand_urn',
  PROP_SPIRIT_FLOWER: 'prop_spirit_flower',
  PROP_STAGE_SPEAKER: 'prop_stage_speaker',
  PROP_LASER_BEAM: 'prop_laser_beam',
  PROP_MELLO_HELMET: 'prop_mello_helmet',
  PROP_MIC_STAND: 'prop_mic_stand',

  // Particles
  PARTICLE_DUST: 'particle_dust',
  PARTICLE_SPARK: 'particle_spark',
  PARTICLE_ICE: 'particle_ice',
  PARTICLE_LEAF: 'particle_leaf',
  PARTICLE_SNOW: 'particle_snow',
  PARTICLE_WIND_STREAK: 'particle_wind_streak',
  PARTICLE_EMBER: 'particle_ember',
  PARTICLE_END_PORTAL: 'particle_end_portal',
  PARTICLE_BUBBLE: 'particle_bubble',
  PARTICLE_PETAL: 'particle_petal',
  PARTICLE_DEBRIS: 'particle_debris'
} as const;

export interface ThemePaletteConfig {
  surface: { O: number; H: number; G: number; M: number; L: number; S: number; D: number };
  deep: { O: number; L: number; S: number; D: number; A: number };
  ore: { O: number; L: number; S: number; D: number; G: number; W: number };
  hazard: { W: number; S: number; D: number; O: number };
  skyBands: [number, number, number, number];
  celestialColor: number;
  cloudColor: number;
  midDark: number;
  midLight: number;
  midAccent: number;
  nearDark: number;
  nearLight: number;
  nearGlow: number;
  nearStyle: 'pine' | 'crystal' | 'tower' | 'coral' | 'nether' | 'cherry';
}

function makeConcertPalette(
  neonHi: number,
  neonMain: number,
  neonDeep: number,
  stageMetal: number,
  stageDark: number,
  skyTop: number,
  skyBot: number,
  accentGlow: number,
  nearStyle: 'pine' | 'crystal' | 'tower' | 'coral' | 'nether' | 'cherry' = 'tower'
): ThemePaletteConfig {
  return {
    surface: {
      O: 0x05060d,
      H: neonHi,
      G: neonMain,
      M: neonDeep,
      L: stageMetal,
      S: stageDark,
      D: 0x0b0f1c
    },
    deep: { O: 0x05060d, L: stageMetal, S: stageDark, D: 0x090c17, A: neonMain },
    ore: { O: 0x05060d, L: stageDark, S: 0x0b0f1c, D: 0x05060d, G: accentGlow, W: 0xffffff },
    hazard: { W: 0xffffff, S: neonMain, D: neonDeep, O: 0x1a051d },
    skyBands: [skyTop, stageDark, neonDeep, skyBot],
    celestialColor: neonHi,
    cloudColor: accentGlow,
    midDark: stageDark,
    midLight: stageMetal,
    midAccent: neonMain,
    nearDark: 0x080b14,
    nearLight: stageDark,
    nearGlow: accentGlow,
    nearStyle
  };
}

const THEME_CONFIGS: Record<WorldTheme, ThemePaletteConfig> = {
  forest: {
    surface: { O: 0x0f171e, H: 0x95d5b2, G: 0x52b788, M: 0x2d6a4f, L: 0x718096, S: 0x4a5568, D: 0x2d3748 },
    deep: { O: 0x0f141c, L: 0x64748b, S: 0x475569, D: 0x1e293b, A: 0x40916c },
    ore: { O: 0x0f141c, L: 0x475569, S: 0x334155, D: 0x1e293b, G: 0x52b788, W: 0xb7e4c7 },
    hazard: { W: 0xffe5ec, S: 0xff4d6d, D: 0xa4133c, O: 0x590d22 },
    skyBands: [0x07111a, 0x0e2433, 0x183d4e, 0x24555c],
    celestialColor: 0xfefae0,
    cloudColor: 0x52b788,
    midDark: 0x122a24,
    midLight: 0x234f3e,
    midAccent: 0x74c69d,
    nearDark: 0x0a1914,
    nearLight: 0x163629,
    nearGlow: 0x95d5b2,
    nearStyle: 'pine'
  },
  ice: {
    surface: { O: 0x081026, H: 0xffffff, G: 0xcaf0f8, M: 0x90e0ef, L: 0x6c7a9c, S: 0x41506b, D: 0x232d42 },
    deep: { O: 0x081026, L: 0x48cae4, S: 0x0077b6, D: 0x023e8a, A: 0x90e0ef },
    ore: { O: 0x081026, L: 0x33415c, S: 0x1d2d44, D: 0x0b132b, G: 0x00f5d4, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0x48cae4, D: 0x0077b6, O: 0x03045e },
    skyBands: [0x03045e, 0x023e8a, 0x0077b6, 0x00b4d8],
    celestialColor: 0x90e0ef,
    cloudColor: 0xcaf0f8,
    midDark: 0x041e42,
    midLight: 0x0a4c8a,
    midAccent: 0x90e0ef,
    nearDark: 0x02122c,
    nearLight: 0x073168,
    nearGlow: 0x48cae4,
    nearStyle: 'crystal'
  },
  wind: {
    surface: { O: 0x140924, H: 0xffea00, G: 0xe0aaff, M: 0xc77dff, L: 0x9d4edd, S: 0x5a189a, D: 0x3c096c },
    deep: { O: 0x140924, L: 0x7b2cbf, S: 0x5a189a, D: 0x240046, A: 0xffd166 },
    ore: { O: 0x140924, L: 0x5a189a, S: 0x3c096c, D: 0x240046, G: 0xffbe0b, W: 0xfff3b0 },
    hazard: { W: 0xfff3b0, S: 0xffbe0b, D: 0xfb5607, O: 0x5a189a },
    skyBands: [0x10002b, 0x240046, 0x3c096c, 0x6a1b9a],
    celestialColor: 0xffd166,
    cloudColor: 0xe0aaff,
    midDark: 0x1d0038,
    midLight: 0x480ca8,
    midAccent: 0xffbe0b,
    nearDark: 0x120024,
    nearLight: 0x2d0059,
    nearGlow: 0xffd166,
    nearStyle: 'tower'
  },
  // ==================== MINECRAFT ====================
  'mc-overworld': {
    surface: { O: 0x28180b, H: 0x9ef01a, G: 0x70e000, M: 0x38b000, L: 0xb07d4f, S: 0x8a5a36, D: 0x583118 },
    deep: { O: 0x1c1917, L: 0x78716c, S: 0x57534e, D: 0x292524, A: 0xa8a29e },
    ore: { O: 0x1c1917, L: 0x57534e, S: 0x44403c, D: 0x292524, G: 0x00f5d4, W: 0xcaf0f8 },
    hazard: { W: 0xfff3b0, S: 0xff5400, D: 0x9e2a2b, O: 0x431407 },
    skyBands: [0x1d4ed8, 0x2563eb, 0x38bdf8, 0x7dd3fc],
    celestialColor: 0xfef08a,
    cloudColor: 0xffffff,
    midDark: 0x15803d,
    midLight: 0x22c55e,
    midAccent: 0x86efac,
    nearDark: 0x14532d,
    nearLight: 0x166534,
    nearGlow: 0xfacc15,
    nearStyle: 'pine'
  },
  'mc-lush': {
    surface: { O: 0x132a13, H: 0xff70a6, G: 0x80ed99, M: 0x38b000, L: 0xa3b18a, S: 0x588157, D: 0x344e41 },
    deep: { O: 0x132a13, L: 0x8d99ae, S: 0x5c677d, D: 0x2b2d42, A: 0x52b788 },
    ore: { O: 0x132a13, L: 0x4f772d, S: 0x31572c, D: 0x132a13, G: 0xff9f1c, W: 0xfff3b0 },
    hazard: { W: 0xffcad4, S: 0xf72585, D: 0x7209b7, O: 0x240046 },
    skyBands: [0x0b1f17, 0x143628, 0x1e4d38, 0x2b6e4e],
    celestialColor: 0xffbe0b,
    cloudColor: 0x80ed99,
    midDark: 0x123022,
    midLight: 0x265940,
    midAccent: 0xff70a6,
    nearDark: 0x091c13,
    nearLight: 0x19402d,
    nearGlow: 0xff9f1c,
    nearStyle: 'pine'
  },
  'mc-deepdark': {
    surface: { O: 0x03070e, H: 0x72efdd, G: 0x00f5d4, M: 0x00bbf9, L: 0x33415c, S: 0x1d2d44, D: 0x0b132b },
    deep: { O: 0x03070e, L: 0x2b2d42, S: 0x1a1c2c, D: 0x0d0f18, A: 0x00bbf9 },
    ore: { O: 0x03070e, L: 0x1a1c2c, S: 0x0f101a, D: 0x050811, G: 0x00f5d4, W: 0xcaf0f8 },
    hazard: { W: 0xcaf0f8, S: 0x00f5d4, D: 0x0077b6, O: 0x03045e },
    skyBands: [0x020409, 0x050b14, 0x081624, 0x0c2236],
    celestialColor: 0x00f5d4,
    cloudColor: 0x00bbf9,
    midDark: 0x05101c,
    midLight: 0x0c263b,
    midAccent: 0x00f5d4,
    nearDark: 0x030911,
    nearLight: 0x081a29,
    nearGlow: 0x00f5d4,
    nearStyle: 'tower'
  },
  'mc-frozen': {
    surface: { O: 0x0a1128, H: 0xffffff, G: 0x90e0ef, M: 0x00b4d8, L: 0x48cae4, S: 0x0096c7, D: 0x023e8a },
    deep: { O: 0x0a1128, L: 0x00b4d8, S: 0x0077b6, D: 0x03045e, A: 0xcaf0f8 },
    ore: { O: 0x0a1128, L: 0x0077b6, S: 0x023e8a, D: 0x03045e, G: 0xffbe0b, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0x90e0ef, D: 0x0077b6, O: 0x03045e },
    skyBands: [0x1e1b4b, 0x312e81, 0x6366f1, 0xf472b6],
    celestialColor: 0xfef08a,
    cloudColor: 0xe0e7ff,
    midDark: 0x1e3a8a,
    midLight: 0x38bdf8,
    midAccent: 0xffffff,
    nearDark: 0x0f172a,
    nearLight: 0x1d4ed8,
    nearGlow: 0x7dd3fc,
    nearStyle: 'crystal'
  },
  'mc-ocean': {
    surface: { O: 0x042430, H: 0xcaf0f8, G: 0x64dfdf, M: 0x48bfe3, L: 0x56cfe1, S: 0x118ab2, D: 0x073b4c },
    deep: { O: 0x042430, L: 0x2ec4b6, S: 0x0f766e, D: 0x115e59, A: 0x80ffdb },
    ore: { O: 0x042430, L: 0x118ab2, S: 0x073b4c, D: 0x042430, G: 0x80ffdb, W: 0xffffff },
    hazard: { W: 0xfff3b0, S: 0xf77f00, D: 0xd62828, O: 0x003049 },
    skyBands: [0x022c3a, 0x044b62, 0x087592, 0x16a3b8],
    celestialColor: 0xa5f3fc,
    cloudColor: 0x67e8f9,
    midDark: 0x053747,
    midLight: 0x0d657d,
    midAccent: 0xff70a6,
    nearDark: 0x03222c,
    nearLight: 0x084c61,
    nearGlow: 0xffbe0b,
    nearStyle: 'coral'
  },
  'mc-cherry': {
    surface: { O: 0x2b0918, H: 0xffe5ec, G: 0xff8fab, M: 0xfb6f92, L: 0x9d4edd, S: 0x6d3b47, D: 0x3d1e28 },
    deep: { O: 0x230c16, L: 0x7b2cbf, S: 0x5a189a, D: 0x3c096c, A: 0xffb3c6 },
    ore: { O: 0x230c16, L: 0x6d3b47, S: 0x4a2531, D: 0x2b0918, G: 0xe0aaff, W: 0xffffff },
    hazard: { W: 0xffe5ec, S: 0xc77dff, D: 0x7b2cbf, O: 0x240046 },
    skyBands: [0x2e1035, 0x581c5c, 0x9d4edd, 0xffb3c6],
    celestialColor: 0xfff0f3,
    cloudColor: 0xffccd5,
    midDark: 0x3c096c,
    midLight: 0x7b2cbf,
    midAccent: 0xff8fab,
    nearDark: 0x240046,
    nearLight: 0x5a189a,
    nearGlow: 0xffb3c6,
    nearStyle: 'cherry'
  },
  'mc-redstone': {
    surface: { O: 0x1a1412, H: 0x64dfdf, G: 0x2ec4b6, M: 0xe76f51, L: 0xd4a373, S: 0x9c6644, D: 0x582f0e },
    deep: { O: 0x1a1412, L: 0x6c757d, S: 0x495057, D: 0x212529, A: 0xe76f51 },
    ore: { O: 0x1a1412, L: 0x495057, S: 0x343a40, D: 0x212529, G: 0xff2a2a, W: 0xffbe0b },
    hazard: { W: 0xffea00, S: 0xff2a2a, D: 0x9d0208, O: 0x370617 },
    skyBands: [0x140d0b, 0x261714, 0x3d231c, 0x543025],
    celestialColor: 0xff5400,
    cloudColor: 0x2ec4b6,
    midDark: 0x1f1410,
    midLight: 0x40261d,
    midAccent: 0x2ec4b6,
    nearDark: 0x120b09,
    nearLight: 0x2b1913,
    nearGlow: 0xff2a2a,
    nearStyle: 'tower'
  },
  'mc-nether': {
    surface: { O: 0x210404, H: 0xffea00, G: 0xff7b00, M: 0xd00000, L: 0x9d0208, S: 0x6a040f, D: 0x370617 },
    deep: { O: 0x210404, L: 0x800f2f, S: 0x590d22, D: 0x2b060d, A: 0xff5400 },
    ore: { O: 0x210404, L: 0x6a040f, S: 0x370617, D: 0x210404, G: 0xffbe0b, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0xff9e00, D: 0xd00000, O: 0x470606 },
    skyBands: [0x1f0000, 0x3d0404, 0x6a040f, 0x9d0208],
    celestialColor: 0xff9e00,
    cloudColor: 0xff5400,
    midDark: 0x2b0509,
    midLight: 0x590d22,
    midAccent: 0xff9e00,
    nearDark: 0x1a0204,
    nearLight: 0x370617,
    nearGlow: 0xff7b00,
    nearStyle: 'nether'
  },
  'mc-soul': {
    surface: { O: 0x0b131e, H: 0x9bf6ff, G: 0x00f5d4, M: 0x00bbf9, L: 0x6c757d, S: 0x495057, D: 0x212529 },
    deep: { O: 0x0b131e, L: 0x5c5446, S: 0x3d372e, D: 0x24201a, A: 0x00f5d4 },
    ore: { O: 0x0b131e, L: 0x495057, S: 0x343a40, D: 0x1b1e23, G: 0x00f5d4, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0x00f5d4, D: 0x0096c7, O: 0x03045e },
    skyBands: [0x09131c, 0x102536, 0x16384f, 0x1d4e6b],
    celestialColor: 0x72efdd,
    cloudColor: 0x48cae4,
    midDark: 0x141a21,
    midLight: 0x2b3440,
    midAccent: 0x00f5d4,
    nearDark: 0x0c1014,
    nearLight: 0x1e252e,
    nearGlow: 0x00f5d4,
    nearStyle: 'crystal'
  },
  'mc-bastion': {
    surface: { O: 0x080708, H: 0xfff3b0, G: 0xffbe0b, M: 0xf77f00, L: 0x495057, S: 0x2b2d42, D: 0x161a1d },
    deep: { O: 0x080708, L: 0x343a40, S: 0x212529, D: 0x111315, A: 0xffbe0b },
    ore: { O: 0x080708, L: 0x2b2d42, S: 0x161a1d, D: 0x0b090a, G: 0xffbe0b, W: 0xffffff },
    hazard: { W: 0xfff3b0, S: 0xff9f1c, D: 0xd62828, O: 0x370617 },
    skyBands: [0x0d090a, 0x1f1215, 0x3b1920, 0x5e2129],
    celestialColor: 0xffbe0b,
    cloudColor: 0xf77f00,
    midDark: 0x14151a,
    midLight: 0x2b2d42,
    midAccent: 0xffbe0b,
    nearDark: 0x0b090a,
    nearLight: 0x1f2229,
    nearGlow: 0xffbe0b,
    nearStyle: 'tower'
  },
  'mc-end': {
    surface: { O: 0x19002e, H: 0xffffff, G: 0xfefae0, M: 0xd4d700, L: 0xe9edc9, S: 0xccd5ae, D: 0x7f8c72 },
    deep: { O: 0x0a0112, L: 0x3c096c, S: 0x240046, D: 0x10002b, A: 0xc77dff },
    ore: { O: 0x0a0112, L: 0x240046, S: 0x10002b, D: 0x05000d, G: 0xe0aaff, W: 0xffffff },
    hazard: { W: 0xffccd5, S: 0xf72585, D: 0x7209b7, O: 0x240046 },
    skyBands: [0x040008, 0x0b0118, 0x16032e, 0x240046],
    celestialColor: 0xe0aaff,
    cloudColor: 0x9d4edd,
    midDark: 0x10002b,
    midLight: 0x240046,
    midAccent: 0xe0aaff,
    nearDark: 0x070014,
    nearLight: 0x190036,
    nearGlow: 0xf72585,
    nearStyle: 'crystal'
  },
  'mc-endcity': {
    surface: { O: 0x1f0333, H: 0xfff3b0, G: 0xe0aaff, M: 0xc77dff, L: 0xb56576, S: 0x8338ec, D: 0x3a0ca3 },
    deep: { O: 0x1f0333, L: 0x9d4edd, S: 0x7209b7, D: 0x3c096c, A: 0xfefae0 },
    ore: { O: 0x1f0333, L: 0x7209b7, S: 0x480ca8, D: 0x240046, G: 0xffea00, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0xff70a6, D: 0x7209b7, O: 0x240046 },
    skyBands: [0x090114, 0x170332, 0x2d0659, 0x4a0e82],
    celestialColor: 0xfff3b0,
    cloudColor: 0xe0aaff,
    midDark: 0x1c0236,
    midLight: 0x3f0a73,
    midAccent: 0xffea00,
    nearDark: 0x110022,
    nearLight: 0x2c0552,
    nearGlow: 0xffea00,
    nearStyle: 'tower'
  },

  // ==================== 3. TERRARIA (5 Themes) ====================
  'tr-purity': {
    surface: { O: 0x142615, H: 0xb7e4c7, G: 0x40916c, M: 0x2d6a4f, L: 0xb5835a, S: 0x8c5a3c, D: 0x5c3824 },
    deep: { O: 0x18181b, L: 0x71717a, S: 0x52525b, D: 0x27272a, A: 0x38bdf8 },
    ore: { O: 0x18181b, L: 0x52525b, S: 0x3f3f46, D: 0x27272a, G: 0x38bdf8, W: 0xe0f2fe },
    hazard: { W: 0xd8f3dc, S: 0x38b000, D: 0x1b4332, O: 0x081c15 },
    skyBands: [0x0284c7, 0x38bdf8, 0x7dd3fc, 0xbae6fd],
    celestialColor: 0xfef08a,
    cloudColor: 0xffffff,
    midDark: 0x166534,
    midLight: 0x22c55e,
    midAccent: 0x38bdf8,
    nearDark: 0x14532d,
    nearLight: 0x15803d,
    nearGlow: 0x4ade80,
    nearStyle: 'pine'
  },
  'tr-corruption': {
    surface: { O: 0x190b28, H: 0xc77dff, G: 0x7b2cbf, M: 0x5a189a, L: 0x4a3b5c, S: 0x322640, D: 0x1d1526 },
    deep: { O: 0x12081c, L: 0x5a189a, S: 0x3c096c, D: 0x240046, A: 0x9ef01a },
    ore: { O: 0x12081c, L: 0x3c096c, S: 0x240046, D: 0x10002b, G: 0x9ef01a, W: 0xd9f99d },
    hazard: { W: 0xd9f99d, S: 0x80ed99, D: 0x5a189a, O: 0x240046 },
    skyBands: [0x130722, 0x240e3d, 0x39195c, 0x4f247d],
    celestialColor: 0x9ef01a,
    cloudColor: 0x9d4edd,
    midDark: 0x1d0a30,
    midLight: 0x381759,
    midAccent: 0x9ef01a,
    nearDark: 0x11051c,
    nearLight: 0x280f42,
    nearGlow: 0x9ef01a,
    nearStyle: 'crystal'
  },
  'tr-hallow': {
    surface: { O: 0x1e1b4b, H: 0xfff0f3, G: 0x4cc9f0, M: 0x4361ee, L: 0xf72585, S: 0xb5179e, D: 0x7209b7 },
    deep: { O: 0x1e1b4b, L: 0x7209b7, S: 0x560bad, D: 0x3a0ca3, A: 0x4cc9f0 },
    ore: { O: 0x1e1b4b, L: 0x480ca8, S: 0x3a0ca3, D: 0x240046, G: 0xff70a6, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0xff70a6, D: 0x4cc9f0, O: 0x3a0ca3 },
    skyBands: [0x3b82f6, 0x60a5fa, 0xf472b6, 0xfbcfe8],
    celestialColor: 0xfef08a,
    cloudColor: 0xfff0f3,
    midDark: 0x4338ca,
    midLight: 0x6366f1,
    midAccent: 0xf472b6,
    nearDark: 0x312e81,
    nearLight: 0x4f46e5,
    nearGlow: 0xf472b6,
    nearStyle: 'cherry'
  },
  'tr-jungle': {
    surface: { O: 0x1c1206, H: 0xa3e635, G: 0x65a30d, M: 0x3f6212, L: 0xd97706, S: 0xb45309, D: 0x78350f },
    deep: { O: 0x1c1206, L: 0x92400e, S: 0x78350f, D: 0x451a03, A: 0xfacc15 },
    ore: { O: 0x1c1206, L: 0x78350f, S: 0x451a03, D: 0x290f02, G: 0x84cc16, W: 0xfef08a },
    hazard: { W: 0xfef08a, S: 0xf59e0b, D: 0x92400e, O: 0x451a03 },
    skyBands: [0x142609, 0x243e10, 0x365314, 0x4d7c0f],
    celestialColor: 0xfacc15,
    cloudColor: 0xa3e635,
    midDark: 0x1a2e05,
    midLight: 0x365314,
    midAccent: 0xf59e0b,
    nearDark: 0x111c04,
    nearLight: 0x283d0b,
    nearGlow: 0xfacc15,
    nearStyle: 'tower'
  },
  'tr-nebula': {
    surface: { O: 0x170326, H: 0x67e8f9, G: 0xe879f9, M: 0xc026d3, L: 0x86198f, S: 0x581c87, D: 0x3b0764 },
    deep: { O: 0x0f0219, L: 0x6b21a8, S: 0x4c1d95, D: 0x2e1065, A: 0x22d3ee },
    ore: { O: 0x0f0219, L: 0x4c1d95, S: 0x2e1065, D: 0x170326, G: 0x22d3ee, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0xe879f9, D: 0x7e22ce, O: 0x2e1065 },
    skyBands: [0x090114, 0x1e0538, 0x4a0e6b, 0x831843],
    celestialColor: 0x22d3ee,
    cloudColor: 0xf472b6,
    midDark: 0x1e1b4b,
    midLight: 0x4c1d95,
    midAccent: 0x22d3ee,
    nearDark: 0x0f0524,
    nearLight: 0x3b0764,
    nearGlow: 0xe879f9,
    nearStyle: 'crystal'
  },

  // ==================== 4. CELESTE (5 Themes) ====================
  'cl-city': {
    surface: { O: 0x0f172a, H: 0xffffff, G: 0xe2e8f0, M: 0x94a3b8, L: 0x64748b, S: 0x475569, D: 0x1e293b },
    deep: { O: 0x0f172a, L: 0x475569, S: 0x334155, D: 0x1e293b, A: 0x38bdf8 },
    ore: { O: 0x0f172a, L: 0x334155, S: 0x1e293b, D: 0x0f172a, G: 0xf43f5e, W: 0xffe4e6 },
    hazard: { W: 0xffffff, S: 0x38bdf8, D: 0x0284c7, O: 0x0f172a },
    skyBands: [0x0f172a, 0x1e293b, 0x334155, 0x475569],
    celestialColor: 0x38bdf8,
    cloudColor: 0xcbd5e1,
    midDark: 0x0f172a,
    midLight: 0x1e3a8a,
    midAccent: 0xf43f5e,
    nearDark: 0x090d16,
    nearLight: 0x1e293b,
    nearGlow: 0x38bdf8,
    nearStyle: 'tower'
  },
  'cl-dream': {
    surface: { O: 0x090414, H: 0x67e8f9, G: 0xc084fc, M: 0x9333ea, L: 0x3b0764, S: 0x1e1b4b, D: 0x0f172a },
    deep: { O: 0x090414, L: 0x312e81, S: 0x1e1b4b, D: 0x090414, A: 0xf472b6 },
    ore: { O: 0x090414, L: 0x1e1b4b, S: 0x0f172a, D: 0x05020a, G: 0x38bdf8, W: 0xfef08a },
    hazard: { W: 0xffffff, S: 0xf472b6, D: 0x9333ea, O: 0x1e1b4b },
    skyBands: [0x05020c, 0x110726, 0x1e1040, 0x2e1065],
    celestialColor: 0xf472b6,
    cloudColor: 0x38bdf8,
    midDark: 0x0f0724,
    midLight: 0x2e1065,
    midAccent: 0x38bdf8,
    nearDark: 0x070312,
    nearLight: 0x1e1b4b,
    nearGlow: 0xf472b6,
    nearStyle: 'crystal'
  },
  'cl-resort': {
    surface: { O: 0x1c080d, H: 0xfde047, G: 0xe11d48, M: 0x9f1239, L: 0x78350f, S: 0x451a03, D: 0x270e02 },
    deep: { O: 0x1c080d, L: 0x5c2434, S: 0x3f1623, D: 0x240a12, A: 0xfacc15 },
    ore: { O: 0x1c080d, L: 0x4c1d2c, S: 0x31101b, D: 0x1c080d, G: 0xfacc15, W: 0xffffff },
    hazard: { W: 0xfecdd3, S: 0xf43f5e, D: 0x9f1239, O: 0x4c0519 },
    skyBands: [0x190814, 0x311028, 0x4c1538, 0x6b1d49],
    celestialColor: 0xfacc15,
    cloudColor: 0xf43f5e,
    midDark: 0x240a18,
    midLight: 0x4c1532,
    midAccent: 0xfacc15,
    nearDark: 0x14050d,
    nearLight: 0x330d21,
    nearGlow: 0xf43f5e,
    nearStyle: 'tower'
  },
  'cl-ridge': {
    surface: { O: 0x271206, H: 0xfef08a, G: 0xf59e0b, M: 0xd97706, L: 0xb45309, S: 0x92400e, D: 0x451a03 },
    deep: { O: 0x271206, L: 0x9a3412, S: 0x7c2d12, D: 0x431407, A: 0xfbbf24 },
    ore: { O: 0x271206, L: 0x7c2d12, S: 0x431407, D: 0x271206, G: 0x38bdf8, W: 0xffffff },
    hazard: { W: 0xfef08a, S: 0xf97316, D: 0xc2410c, O: 0x431407 },
    skyBands: [0x4c1d95, 0x9d174d, 0xea580c, 0xfbbf24],
    celestialColor: 0xfef08a,
    cloudColor: 0xfed7aa,
    midDark: 0x7c2d12,
    midLight: 0xc2410c,
    midAccent: 0xfef08a,
    nearDark: 0x431407,
    nearLight: 0x9a3412,
    nearGlow: 0xfbbf24,
    nearStyle: 'pine'
  },
  'cl-summit': {
    surface: { O: 0x170a29, H: 0xffffff, G: 0x38bdf8, M: 0xf43f5e, L: 0x8b5cf6, S: 0x6d28d9, D: 0x4c1d95 },
    deep: { O: 0x170a29, L: 0x6d28d9, S: 0x4c1d95, D: 0x2e1065, A: 0xf43f5e },
    ore: { O: 0x170a29, L: 0x4c1d95, S: 0x2e1065, D: 0x170a29, G: 0xfacc15, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0xf43f5e, D: 0x0284c7, O: 0x1e1b4b },
    skyBands: [0x1e1b4b, 0x4c1d95, 0xbe185d, 0x38bdf8],
    celestialColor: 0xffffff,
    cloudColor: 0xfbcfe8,
    midDark: 0x312e81,
    midLight: 0x6d28d9,
    midAccent: 0x38bdf8,
    nearDark: 0x1e1b4b,
    nearLight: 0x4c1d95,
    nearGlow: 0xf43f5e,
    nearStyle: 'crystal'
  },

  // ==================== 5. HOLLOW KNIGHT (5 Themes) ====================
  'hk-crossroads': {
    surface: { O: 0x090d16, H: 0xe2e8f0, G: 0x94a3b8, M: 0x64748b, L: 0x475569, S: 0x334155, D: 0x1e293b },
    deep: { O: 0x090d16, L: 0x334155, S: 0x1e293b, D: 0x0f172a, A: 0x7dd3fc },
    ore: { O: 0x090d16, L: 0x1e293b, S: 0x0f172a, D: 0x090d16, G: 0xfef08a, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0x94a3b8, D: 0x475569, O: 0x0f172a },
    skyBands: [0x060911, 0x0f172a, 0x1e293b, 0x273549],
    celestialColor: 0xfef08a,
    cloudColor: 0x64748b,
    midDark: 0x0b111e,
    midLight: 0x1e293b,
    midAccent: 0xfef08a,
    nearDark: 0x060911,
    nearLight: 0x151e2e,
    nearGlow: 0xfef08a,
    nearStyle: 'tower'
  },
  'hk-greenpath': {
    surface: { O: 0x061a14, H: 0xa7f3d0, G: 0x34d399, M: 0x059669, L: 0x334155, S: 0x1e293b, D: 0x0f172a },
    deep: { O: 0x061a14, L: 0x1f3a33, S: 0x112620, D: 0x061a14, A: 0x34d399 },
    ore: { O: 0x061a14, L: 0x112620, S: 0x061a14, D: 0x030f0b, G: 0xa3e635, W: 0xffffff },
    hazard: { W: 0xd9f99d, S: 0x84cc16, D: 0x3f6212, O: 0x142609 },
    skyBands: [0x04120e, 0x08261d, 0x0f3d2e, 0x165942],
    celestialColor: 0xa7f3d0,
    cloudColor: 0x34d399,
    midDark: 0x062119,
    midLight: 0x114232,
    midAccent: 0xa3e635,
    nearDark: 0x04140f,
    nearLight: 0x0c3024,
    nearGlow: 0x6ee7b7,
    nearStyle: 'pine'
  },
  'hk-crystal': {
    surface: { O: 0x1a0826, H: 0xffffff, G: 0xf472b6, M: 0xdb2777, L: 0x475569, S: 0x334155, D: 0x1e293b },
    deep: { O: 0x1a0826, L: 0x4a1d59, S: 0x2e1038, D: 0x1a0826, A: 0xf472b6 },
    ore: { O: 0x1a0826, L: 0x2e1038, S: 0x1a0826, D: 0x0f0417, G: 0xfbcfe8, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0xf472b6, D: 0xbe185d, O: 0x3b0764 },
    skyBands: [0x12051c, 0x240a36, 0x3b0f54, 0x591678],
    celestialColor: 0xfbcfe8,
    cloudColor: 0xf472b6,
    midDark: 0x1e082e,
    midLight: 0x42125c,
    midAccent: 0xf472b6,
    nearDark: 0x12041c,
    nearLight: 0x2e0b42,
    nearGlow: 0xf9a8d4,
    nearStyle: 'crystal'
  },
  'hk-tears': {
    surface: { O: 0x051026, H: 0xbae6fd, G: 0x38bdf8, M: 0x0284c7, L: 0x1e3a8a, S: 0x172554, D: 0x0b132b },
    deep: { O: 0x051026, L: 0x1e3a8a, S: 0x172554, D: 0x090f24, A: 0x38bdf8 },
    ore: { O: 0x051026, L: 0x172554, S: 0x090f24, D: 0x040712, G: 0x7dd3fc, W: 0xffffff },
    hazard: { W: 0xe0f2fe, S: 0x38bdf8, D: 0x1d4ed8, O: 0x0b132b },
    skyBands: [0x04091a, 0x091536, 0x102454, 0x173573],
    celestialColor: 0x7dd3fc,
    cloudColor: 0x38bdf8,
    midDark: 0x07112b,
    midLight: 0x132a5c,
    midAccent: 0x7dd3fc,
    nearDark: 0x040a1a,
    nearLight: 0x0d1e42,
    nearGlow: 0x38bdf8,
    nearStyle: 'tower'
  },
  'hk-palace': {
    surface: { O: 0x1e293b, H: 0xffffff, G: 0xf8fafc, M: 0xe2e8f0, L: 0xcbd5e1, S: 0x94a3b8, D: 0x64748b },
    deep: { O: 0x1e293b, L: 0xcbd5e1, S: 0x94a3b8, D: 0x475569, A: 0xffffff },
    ore: { O: 0x1e293b, L: 0x94a3b8, S: 0x64748b, D: 0x334155, G: 0xffffff, W: 0xfef08a },
    hazard: { W: 0xffffff, S: 0xe2e8f0, D: 0x94a3b8, O: 0x1e293b },
    skyBands: [0x1e293b, 0x334155, 0x64748b, 0x94a3b8],
    celestialColor: 0xffffff,
    cloudColor: 0xf8fafc,
    midDark: 0x334155,
    midLight: 0x64748b,
    midAccent: 0xffffff,
    nearDark: 0x1e293b,
    nearLight: 0x475569,
    nearGlow: 0xffffff,
    nearStyle: 'tower'
  },

  // ==================== 6. SUPER MARIO (5 Themes) ====================
  'sm-plains': {
    surface: { O: 0x271202, H: 0x86efac, G: 0x22c55e, M: 0x15803d, L: 0xea580c, S: 0xc2410c, D: 0x7c2d12 },
    deep: { O: 0x271202, L: 0xea580c, S: 0xc2410c, D: 0x7c2d12, A: 0xfacc15 },
    ore: { O: 0x271202, L: 0xfacc15, S: 0xeab308, D: 0xa16207, G: 0xffffff, W: 0xfef08a },
    hazard: { W: 0xffffff, S: 0xef4444, D: 0x991b1b, O: 0x450a0a },
    skyBands: [0x2563eb, 0x3b82f6, 0x60a5fa, 0x93c5fd],
    celestialColor: 0xfef08a,
    cloudColor: 0xffffff,
    midDark: 0x15803d,
    midLight: 0x4ade80,
    midAccent: 0xfacc15,
    nearDark: 0x166534,
    nearLight: 0x22c55e,
    nearGlow: 0xfef08a,
    nearStyle: 'pine'
  },
  'sm-underground': {
    surface: { O: 0x020617, H: 0x60a5fa, G: 0x2563eb, M: 0x1d4ed8, L: 0x1e40af, S: 0x1e3a8a, D: 0x172554 },
    deep: { O: 0x020617, L: 0x1d4ed8, S: 0x1e3a8a, D: 0x0f172a, A: 0x38bdf8 },
    ore: { O: 0x020617, L: 0x1e3a8a, S: 0x0f172a, D: 0x020617, G: 0xfacc15, W: 0xffffff },
    hazard: { W: 0x86efac, S: 0x22c55e, D: 0x15803d, O: 0x052e16 },
    skyBands: [0x020617, 0x06102b, 0x0b1c47, 0x112863],
    celestialColor: 0xfacc15,
    cloudColor: 0x3b82f6,
    midDark: 0x071330,
    midLight: 0x142d66,
    midAccent: 0x22c55e,
    nearDark: 0x040b1c,
    nearLight: 0x0d204a,
    nearGlow: 0xfacc15,
    nearStyle: 'tower'
  },
  'sm-sky': {
    surface: { O: 0x1e3a8a, H: 0xffffff, G: 0xf8fafc, M: 0xbae6fd, L: 0xf43f5e, S: 0xe11d48, D: 0x9f1239 },
    deep: { O: 0x1e3a8a, L: 0xfde047, S: 0xfacc15, D: 0xca8a04, A: 0xffffff },
    ore: { O: 0x1e3a8a, L: 0x38bdf8, S: 0x0284c7, D: 0x0369a1, G: 0xfef08a, W: 0xffffff },
    hazard: { W: 0xfef08a, S: 0xef4444, D: 0xb91c1c, O: 0x450a0a },
    skyBands: [0x0284c7, 0x38bdf8, 0x7dd3fc, 0xe0f2fe],
    celestialColor: 0xfef08a,
    cloudColor: 0xffffff,
    midDark: 0x0369a1,
    midLight: 0x38bdf8,
    midAccent: 0xfacc15,
    nearDark: 0x075985,
    nearLight: 0x0ea5e9,
    nearGlow: 0xffffff,
    nearStyle: 'cherry'
  },
  'sm-galaxy': {
    surface: { O: 0x09041c, H: 0xfef08a, G: 0xfacc15, M: 0x38bdf8, L: 0x6366f1, S: 0x4338ca, D: 0x1e1b4b },
    deep: { O: 0x09041c, L: 0x4338ca, S: 0x312e81, D: 0x1e1b4b, A: 0xfacc15 },
    ore: { O: 0x09041c, L: 0x312e81, S: 0x1e1b4b, D: 0x09041c, G: 0xfef08a, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0xc084fc, D: 0x6b21a8, O: 0x1e1b4b },
    skyBands: [0x03010a, 0x090420, 0x150a3d, 0x22125c],
    celestialColor: 0xfacc15,
    cloudColor: 0x38bdf8,
    midDark: 0x0f072e,
    midLight: 0x261466,
    midAccent: 0xfacc15,
    nearDark: 0x070317,
    nearLight: 0x180c42,
    nearGlow: 0xfef08a,
    nearStyle: 'crystal'
  },
  'sm-castle': {
    surface: { O: 0x09090b, H: 0xd4d4d8, G: 0x71717a, M: 0x52525b, L: 0x3f3f46, S: 0x27272a, D: 0x18181b },
    deep: { O: 0x09090b, L: 0x3f3f46, S: 0x27272a, D: 0x18181b, A: 0xf97316 },
    ore: { O: 0x09090b, L: 0x27272a, S: 0x18181b, D: 0x09090b, G: 0xf97316, W: 0xfef08a },
    hazard: { W: 0xfef08a, S: 0xf97316, D: 0xdc2626, O: 0x450a0a },
    skyBands: [0x180404, 0x330808, 0x520d0d, 0x7f1d1d],
    celestialColor: 0xf97316,
    cloudColor: 0xef4444,
    midDark: 0x18181b,
    midLight: 0x3f3f46,
    midAccent: 0xf97316,
    nearDark: 0x09090b,
    nearLight: 0x27272a,
    nearGlow: 0xf97316,
    nearStyle: 'tower'
  },

  // ==================== 7. SONIC ZONES (5 Themes) ====================
  'sn-greenhill': {
    surface: { O: 0x291102, H: 0x86efac, G: 0x22c55e, M: 0x16a34a, L: 0xd97706, S: 0x92400e, D: 0x451a03 },
    deep: { O: 0x291102, L: 0xd97706, S: 0x92400e, D: 0x451a03, A: 0xfacc15 },
    ore: { O: 0x291102, L: 0xb45309, S: 0x78350f, D: 0x451a03, G: 0xfacc15, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0x94a3b8, D: 0x475569, O: 0x0f172a },
    skyBands: [0x1d4ed8, 0x2563eb, 0x38bdf8, 0x60a5fa],
    celestialColor: 0xfacc15,
    cloudColor: 0xffffff,
    midDark: 0x92400e,
    midLight: 0xd97706,
    midAccent: 0x22c55e,
    nearDark: 0x14532d,
    nearLight: 0x22c55e,
    nearGlow: 0xfacc15,
    nearStyle: 'pine'
  },
  'sn-chemical': {
    surface: { O: 0x090d16, H: 0xfef08a, G: 0xfacc15, M: 0xca8a04, L: 0x2563eb, S: 0x1d4ed8, D: 0x1e3a8a },
    deep: { O: 0x090d16, L: 0x1d4ed8, S: 0x1e3a8a, D: 0x0f172a, A: 0xd946ef },
    ore: { O: 0x090d16, L: 0x1e3a8a, S: 0x0f172a, D: 0x090d16, G: 0xd946ef, W: 0xf5d0fe },
    hazard: { W: 0xf5d0fe, S: 0xd946ef, D: 0x86198f, O: 0x2e1065 },
    skyBands: [0x090514, 0x160d2e, 0x24154a, 0x3b1f70],
    celestialColor: 0xd946ef,
    cloudColor: 0x38bdf8,
    midDark: 0x0f172a,
    midLight: 0x1d4ed8,
    midAccent: 0xfacc15,
    nearDark: 0x090d16,
    nearLight: 0x1e3a8a,
    nearGlow: 0xd946ef,
    nearStyle: 'tower'
  },
  'sn-casino': {
    surface: { O: 0x14041c, H: 0xfef08a, G: 0xf43f5e, M: 0xd946ef, L: 0x38bdf8, S: 0x6366f1, D: 0x312e81 },
    deep: { O: 0x14041c, L: 0x7e22ce, S: 0x581c87, D: 0x2e1065, A: 0xfacc15 },
    ore: { O: 0x14041c, L: 0x581c87, S: 0x2e1065, D: 0x14041c, G: 0xfacc15, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0xfacc15, D: 0xf43f5e, O: 0x4c0519 },
    skyBands: [0x090212, 0x19062e, 0x2e0b52, 0x4a1278],
    celestialColor: 0xfacc15,
    cloudColor: 0xf43f5e,
    midDark: 0x1e1b4b,
    midLight: 0x4c1d95,
    midAccent: 0xf43f5e,
    nearDark: 0x0f0524,
    nearLight: 0x3b0764,
    nearGlow: 0xfacc15,
    nearStyle: 'tower'
  },
  'sn-icecap': {
    surface: { O: 0x041026, H: 0xffffff, G: 0x7dd3fc, M: 0x38bdf8, L: 0x0284c7, S: 0x0369a1, D: 0x075985 },
    deep: { O: 0x041026, L: 0x0ea5e9, S: 0x0284c7, D: 0x0c4a6e, A: 0xbae6fd },
    ore: { O: 0x041026, L: 0x0284c7, S: 0x075985, D: 0x082f49, G: 0x67e8f9, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0x38bdf8, D: 0x1d4ed8, O: 0x0f172a },
    skyBands: [0x082f49, 0x0369a1, 0x0ea5e9, 0x7dd3fc],
    celestialColor: 0xffffff,
    cloudColor: 0xe0f2fe,
    midDark: 0x075985,
    midLight: 0x0ea5e9,
    midAccent: 0xffffff,
    nearDark: 0x0c4a6e,
    nearLight: 0x0284c7,
    nearGlow: 0x67e8f9,
    nearStyle: 'crystal'
  },
  'sn-sanctuary': {
    surface: { O: 0x062419, H: 0xfef08a, G: 0x34d399, M: 0x10b981, L: 0xe2e8f0, S: 0xcbd5e1, D: 0x94a3b8 },
    deep: { O: 0x062419, L: 0xd1fae5, S: 0x6ee7b7, D: 0x047857, A: 0xfacc15 },
    ore: { O: 0x062419, L: 0x6ee7b7, S: 0x10b981, D: 0x047857, G: 0x22c55e, W: 0xffffff },
    hazard: { W: 0xfef08a, S: 0xf59e0b, D: 0xb45309, O: 0x451a03 },
    skyBands: [0x0284c7, 0x38bdf8, 0xbae6fd, 0xfef9c3],
    celestialColor: 0x10b981,
    cloudColor: 0xffffff,
    midDark: 0x047857,
    midLight: 0x34d399,
    midAccent: 0xfacc15,
    nearDark: 0x065f46,
    nearLight: 0x10b981,
    nearGlow: 0xfef08a,
    nearStyle: 'tower'
  },

  // ==================== 8. ELDEN RING (5 Themes) ====================
  'er-limgrave': {
    surface: { O: 0x14170a, H: 0xfef08a, G: 0x84cc16, M: 0x4d7c0f, L: 0x78716c, S: 0x57534e, D: 0x292524 },
    deep: { O: 0x14170a, L: 0x57534e, S: 0x44403c, D: 0x1c1917, A: 0xfacc15 },
    ore: { O: 0x14170a, L: 0x44403c, S: 0x292524, D: 0x1c1917, G: 0xfacc15, W: 0xfef08a },
    hazard: { W: 0xfef08a, S: 0xd97706, D: 0x78350f, O: 0x290f02 },
    skyBands: [0x1c2410, 0x364219, 0x656b24, 0xca8a04],
    celestialColor: 0xfef08a,
    cloudColor: 0xfde047,
    midDark: 0x27272a,
    midLight: 0x57534e,
    midAccent: 0xfacc15,
    nearDark: 0x18181b,
    nearLight: 0x3f6212,
    nearGlow: 0xfef08a,
    nearStyle: 'pine'
  },
  'er-liurnia': {
    surface: { O: 0x071126, H: 0xbae6fd, G: 0x38bdf8, M: 0x0284c7, L: 0x475569, S: 0x334155, D: 0x1e293b },
    deep: { O: 0x071126, L: 0x334155, S: 0x1e293b, D: 0x0f172a, A: 0x60a5fa },
    ore: { O: 0x071126, L: 0x1e293b, S: 0x0f172a, D: 0x071126, G: 0x38bdf8, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0x60a5fa, D: 0x1d4ed8, O: 0x0f172a },
    skyBands: [0x091326, 0x132647, 0x1e3a6b, 0x2b528f],
    celestialColor: 0xbae6fd,
    cloudColor: 0x7dd3fc,
    midDark: 0x0f1f38,
    midLight: 0x1e3a66,
    midAccent: 0x38bdf8,
    nearDark: 0x081224,
    nearLight: 0x152c4f,
    nearGlow: 0x7dd3fc,
    nearStyle: 'tower'
  },
  'er-caelid': {
    surface: { O: 0x240606, H: 0xfca5a5, G: 0xef4444, M: 0xb91c1c, L: 0x7f1d1d, S: 0x5c1414, D: 0x380a0a },
    deep: { O: 0x240606, L: 0x6b1818, S: 0x470e0e, D: 0x290606, A: 0xf97316 },
    ore: { O: 0x240606, L: 0x470e0e, S: 0x290606, D: 0x170303, G: 0xfacc15, W: 0xfef08a },
    hazard: { W: 0xfecaca, S: 0xef4444, D: 0x991b1b, O: 0x450a0a },
    skyBands: [0x290505, 0x4c0b0b, 0x7f1d1d, 0xb91c1c],
    celestialColor: 0xfca5a5,
    cloudColor: 0xf87171,
    midDark: 0x330707,
    midLight: 0x661212,
    midAccent: 0xf97316,
    nearDark: 0x1f0404,
    nearLight: 0x470b0b,
    nearGlow: 0xef4444,
    nearStyle: 'nether'
  },
  'er-nokron': {
    surface: { O: 0x070a17, H: 0xe0e7ff, G: 0x818cf8, M: 0x4f46e5, L: 0x475569, S: 0x334155, D: 0x1e293b },
    deep: { O: 0x070a17, L: 0x334155, S: 0x1e293b, D: 0x0f172a, A: 0xa5b4fc },
    ore: { O: 0x070a17, L: 0x1e293b, S: 0x0f172a, D: 0x070a17, G: 0xc7d2fe, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0x818cf8, D: 0x3730a3, O: 0x1e1b4b },
    skyBands: [0x03050c, 0x080d21, 0x111a3d, 0x1b2859],
    celestialColor: 0xe0e7ff,
    cloudColor: 0x818cf8,
    midDark: 0x0b1026,
    midLight: 0x1e2952,
    midAccent: 0xc7d2fe,
    nearDark: 0x060917,
    nearLight: 0x141d3d,
    nearGlow: 0xa5b4fc,
    nearStyle: 'crystal'
  },
  'er-azula': {
    surface: { O: 0x1c1613, H: 0xfef08a, G: 0xeab308, M: 0xa16207, L: 0x78716c, S: 0x57534e, D: 0x292524 },
    deep: { O: 0x1c1613, L: 0x57534e, S: 0x44403c, D: 0x292524, A: 0xfacc15 },
    ore: { O: 0x1c1613, L: 0x44403c, S: 0x292524, D: 0x1c1917, G: 0xef4444, W: 0xfef08a },
    hazard: { W: 0xfef08a, S: 0xef4444, D: 0x991b1b, O: 0x450a0a },
    skyBands: [0x1c1917, 0x3b3531, 0x574e47, 0x786c61],
    celestialColor: 0xfef08a,
    cloudColor: 0xd6d3d1,
    midDark: 0x292524,
    midLight: 0x57534e,
    midAccent: 0xfacc15,
    nearDark: 0x1c1917,
    nearLight: 0x44403c,
    nearGlow: 0xfacc15,
    nearStyle: 'tower'
  },
  // ==================== 9. THE LEGEND OF ZELDA (5 Themes) ====================
  'zd-meadow': {
    surface: { O: 0x0f1f14, H: 0xd9f99d, G: 0x84cc16, M: 0x4d7c0f, L: 0x94a3b8, S: 0x64748b, D: 0x334155 },
    deep: { O: 0x0f172a, L: 0x64748b, S: 0x475569, D: 0x1e293b, A: 0x84cc16 },
    ore: { O: 0x0f172a, L: 0x475569, S: 0x334155, D: 0x1e293b, G: 0xfacc15, W: 0xfef9c3 },
    hazard: { W: 0xfef08a, S: 0xef4444, D: 0x991b1b, O: 0x450a0a },
    skyBands: [0x0284c7, 0x38bdf8, 0x7dd3fc, 0xbae6fd],
    celestialColor: 0xfef08a,
    cloudColor: 0xffffff,
    midDark: 0x1e3a2f,
    midLight: 0x3b6e52,
    midAccent: 0xa3e635,
    nearDark: 0x14291f,
    nearLight: 0x28543c,
    nearGlow: 0xfef08a,
    nearStyle: 'pine'
  },
  'zd-lostwoods': {
    surface: { O: 0x071717, H: 0x99f6e4, G: 0x14b8a6, M: 0x0f766e, L: 0x475569, S: 0x334155, D: 0x1e293b },
    deep: { O: 0x041212, L: 0x334155, S: 0x1e293b, D: 0x0f172a, A: 0x2dd4bf },
    ore: { O: 0x041212, L: 0x1e293b, S: 0x0f172a, D: 0x041212, G: 0x5eead4, W: 0xffffff },
    hazard: { W: 0xccfbf1, S: 0xec4899, D: 0x9d174d, O: 0x500724 },
    skyBands: [0x04131a, 0x092630, 0x113c47, 0x195461],
    celestialColor: 0x5eead4,
    cloudColor: 0x2dd4bf,
    midDark: 0x082229,
    midLight: 0x134450,
    midAccent: 0x5eead4,
    nearDark: 0x05181c,
    nearLight: 0x0d333b,
    nearGlow: 0x99f6e4,
    nearStyle: 'pine'
  },
  'zd-deathmtn': {
    surface: { O: 0x1c0805, H: 0xfdba74, G: 0xf97316, M: 0xc2410c, L: 0x57534e, S: 0x44403c, D: 0x292524 },
    deep: { O: 0x1c0805, L: 0x44403c, S: 0x292524, D: 0x1c1917, A: 0xf97316 },
    ore: { O: 0x1c0805, L: 0x292524, S: 0x1c1917, D: 0x0c0a09, G: 0xef4444, W: 0xfef08a },
    hazard: { W: 0xfef08a, S: 0xf97316, D: 0xb91c1c, O: 0x450a0a },
    skyBands: [0x240704, 0x471008, 0x7c1d0e, 0xb93818],
    celestialColor: 0xfdba74,
    cloudColor: 0xf97316,
    midDark: 0x290c07,
    midLight: 0x571a0e,
    midAccent: 0xf97316,
    nearDark: 0x1c0805,
    nearLight: 0x3b1109,
    nearGlow: 0xfb923c,
    nearStyle: 'nether'
  },
  'zd-zora': {
    surface: { O: 0x06162e, H: 0xe0f2fe, G: 0x38bdf8, M: 0x0284c7, L: 0x64748b, S: 0x475569, D: 0x1e293b },
    deep: { O: 0x06162e, L: 0x0369a1, S: 0x075985, D: 0x0c4a6e, A: 0x7dd3fc },
    ore: { O: 0x06162e, L: 0x075985, S: 0x0c4a6e, D: 0x082f49, G: 0x38bdf8, W: 0xffffff },
    hazard: { W: 0xe0f2fe, S: 0x38bdf8, D: 0x0369a1, O: 0x082f49 },
    skyBands: [0x06162e, 0x0c2d59, 0x144987, 0x1d68b5],
    celestialColor: 0xbae6fd,
    cloudColor: 0x7dd3fc,
    midDark: 0x082042,
    midLight: 0x12407a,
    midAccent: 0x7dd3fc,
    nearDark: 0x05152b,
    nearLight: 0x0d2f5c,
    nearGlow: 0x38bdf8,
    nearStyle: 'crystal'
  },
  'zd-skyisle': {
    surface: { O: 0x1f1908, H: 0xfef9c3, G: 0xfacc15, M: 0xca8a04, L: 0xe2e8f0, S: 0x94a3b8, D: 0x475569 },
    deep: { O: 0x1f1908, L: 0xcbd5e1, S: 0x94a3b8, D: 0x475569, A: 0xfacc15 },
    ore: { O: 0x1f1908, L: 0x94a3b8, S: 0x64748b, D: 0x334155, G: 0x2dd4bf, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0xf59e0b, D: 0xb45309, O: 0x451a03 },
    skyBands: [0x0369a1, 0x0ea5e9, 0x38bdf8, 0xbae6fd],
    celestialColor: 0xfef9c3,
    cloudColor: 0xffffff,
    midDark: 0x94a3b8,
    midLight: 0xe2e8f0,
    midAccent: 0xfacc15,
    nearDark: 0x64748b,
    nearLight: 0xcbd5e1,
    nearGlow: 0xfef08a,
    nearStyle: 'tower'
  },
  // ==================== 10. TOMB RAIDER (5 Themes) ====================
  'tb-jungle': {
    surface: { O: 0x0d1a0f, H: 0x86efac, G: 0x22c55e, M: 0x15803d, L: 0x78716c, S: 0x57534e, D: 0x292524 },
    deep: { O: 0x0d1a0f, L: 0x57534e, S: 0x44403c, D: 0x292524, A: 0x16a34a },
    ore: { O: 0x0d1a0f, L: 0x44403c, S: 0x292524, D: 0x1c1917, G: 0xfacc15, W: 0xfef9c3 },
    hazard: { W: 0xfef08a, S: 0x84cc16, D: 0x3f6212, O: 0x1a2e05 },
    skyBands: [0x091711, 0x122b20, 0x1d4231, 0x2a5c44],
    celestialColor: 0xfef08a,
    cloudColor: 0x86efac,
    midDark: 0x11241a,
    midLight: 0x214532,
    midAccent: 0x4ade80,
    nearDark: 0x0b1711,
    nearLight: 0x173023,
    nearGlow: 0xfacc15,
    nearStyle: 'pine'
  },
  'tb-egypt': {
    surface: { O: 0x261707, H: 0xfef08a, G: 0xf59e0b, M: 0xd97706, L: 0xd6d3d1, S: 0xa8a29e, D: 0x57534e },
    deep: { O: 0x261707, L: 0xb45309, S: 0x92400e, D: 0x451a03, A: 0xfbbf24 },
    ore: { O: 0x261707, L: 0x92400e, S: 0x78350f, D: 0x451a03, G: 0x06b6d4, W: 0xcffafe },
    hazard: { W: 0xfef9c3, S: 0xf59e0b, D: 0x92400e, O: 0x451a03 },
    skyBands: [0x451a03, 0x78350f, 0xb45309, 0xd97706],
    celestialColor: 0xfef08a,
    cloudColor: 0xfde68a,
    midDark: 0x542409,
    midLight: 0x9a4412,
    midAccent: 0xfacc15,
    nearDark: 0x3b1805,
    nearLight: 0x73310c,
    nearGlow: 0xfbbf24,
    nearStyle: 'tower'
  },
  'tb-himalaya': {
    surface: { O: 0x091526, H: 0xffffff, G: 0xe0f2fe, M: 0x7dd3fc, L: 0x64748b, S: 0x475569, D: 0x1e293b },
    deep: { O: 0x091526, L: 0x475569, S: 0x334155, D: 0x0f172a, A: 0x38bdf8 },
    ore: { O: 0x091526, L: 0x334155, S: 0x1e293b, D: 0x0f172a, G: 0x38bdf8, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0x7dd3fc, D: 0x0284c7, O: 0x082f49 },
    skyBands: [0x081426, 0x10284a, 0x1b4073, 0x295c9e],
    celestialColor: 0xffffff,
    cloudColor: 0xe0f2fe,
    midDark: 0x122645,
    midLight: 0x244980,
    midAccent: 0xbae6fd,
    nearDark: 0x0b192e,
    nearLight: 0x18345e,
    nearGlow: 0x7dd3fc,
    nearStyle: 'crystal'
  },
  'tb-atlantis': {
    surface: { O: 0x1f0914, H: 0xfde047, G: 0xeab308, M: 0xca8a04, L: 0x9f1239, S: 0x881337, D: 0x4c0519 },
    deep: { O: 0x1f0914, L: 0x881337, S: 0x4c0519, D: 0x2e020f, A: 0xfacc15 },
    ore: { O: 0x1f0914, L: 0x6b112c, S: 0x4c0519, D: 0x26020c, G: 0x2dd4bf, W: 0xccfbf1 },
    hazard: { W: 0xfecdd3, S: 0xf43f5e, D: 0x9f1239, O: 0x4c0519 },
    skyBands: [0x1c0510, 0x380b20, 0x571231, 0x781944],
    celestialColor: 0xfacc15,
    cloudColor: 0xf43f5e,
    midDark: 0x2e0819,
    midLight: 0x5c1132,
    midAccent: 0xfacc15,
    nearDark: 0x1f0511,
    nearLight: 0x420b23,
    nearGlow: 0x2dd4bf,
    nearStyle: 'tower'
  },
  'tb-yamatai': {
    surface: { O: 0x0f141c, H: 0xcbd5e1, G: 0x64748b, M: 0x475569, L: 0x57534e, S: 0x44403c, D: 0x1c1917 },
    deep: { O: 0x0f141c, L: 0x44403c, S: 0x292524, D: 0x1c1917, A: 0xef4444 },
    ore: { O: 0x0f141c, L: 0x334155, S: 0x1e293b, D: 0x0f172a, G: 0xf97316, W: 0xfef08a },
    hazard: { W: 0xfecaca, S: 0xef4444, D: 0x991b1b, O: 0x450a0a },
    skyBands: [0x090d14, 0x141d2b, 0x212f45, 0x314463],
    celestialColor: 0xe2e8f0,
    cloudColor: 0x64748b,
    midDark: 0x141c29,
    midLight: 0x28374f,
    midAccent: 0xf97316,
    nearDark: 0x0d121a,
    nearLight: 0x1b2638,
    nearGlow: 0xef4444,
    nearStyle: 'cherry'
  },
  // ==================== 11. METROID (5 Themes) ====================
  'mt-crateria': {
    surface: { O: 0x09101d, H: 0x93c5fd, G: 0x3b82f6, M: 0x1d4ed8, L: 0x475569, S: 0x334155, D: 0x1e293b },
    deep: { O: 0x09101d, L: 0x334155, S: 0x1e293b, D: 0x0f172a, A: 0x60a5fa },
    ore: { O: 0x09101d, L: 0x1e293b, S: 0x0f172a, D: 0x060a12, G: 0x38bdf8, W: 0xe0f2fe },
    hazard: { W: 0xe0f2fe, S: 0x60a5fa, D: 0x1e40af, O: 0x0f172a },
    skyBands: [0x050912, 0x0c1529, 0x152445, 0x1f3666],
    celestialColor: 0x93c5fd,
    cloudColor: 0x3b82f6,
    midDark: 0x0c1424,
    midLight: 0x1a2c4e,
    midAccent: 0x60a5fa,
    nearDark: 0x070c17,
    nearLight: 0x13203b,
    nearGlow: 0x38bdf8,
    nearStyle: 'tower'
  },
  'mt-brinstar': {
    surface: { O: 0x071a12, H: 0x86efac, G: 0x10b981, M: 0x047857, L: 0x831843, S: 0x500724, D: 0x290312 },
    deep: { O: 0x071a12, L: 0x065f46, S: 0x064e3b, D: 0x022c22, A: 0xf43f5e },
    ore: { O: 0x071a12, L: 0x064e3b, S: 0x022c22, D: 0x011c16, G: 0xf472b6, W: 0xfce7f3 },
    hazard: { W: 0xfce7f3, S: 0xf43f5e, D: 0x9f1239, O: 0x4c0519 },
    skyBands: [0x03120c, 0x072619, 0x0d3d28, 0x14573a],
    celestialColor: 0xf472b6,
    cloudColor: 0x34d399,
    midDark: 0x062116,
    midLight: 0x0e452e,
    midAccent: 0xf472b6,
    nearDark: 0x04170f,
    nearLight: 0x0a3322,
    nearGlow: 0x34d399,
    nearStyle: 'coral'
  },
  'mt-norfair': {
    surface: { O: 0x210505, H: 0xfef08a, G: 0xef4444, M: 0xb91c1c, L: 0x7f1d1d, S: 0x450a0a, D: 0x260404 },
    deep: { O: 0x210505, L: 0x7f1d1d, S: 0x450a0a, D: 0x260404, A: 0xf97316 },
    ore: { O: 0x210505, L: 0x450a0a, S: 0x260404, D: 0x140202, G: 0xfacc15, W: 0xffffff },
    hazard: { W: 0xfef08a, S: 0xf97316, D: 0xb91c1c, O: 0x450a0a },
    skyBands: [0x1c0303, 0x3d0707, 0x660d0d, 0x991414],
    celestialColor: 0xfef08a,
    cloudColor: 0xef4444,
    midDark: 0x2e0505,
    midLight: 0x5c0b0b,
    midAccent: 0xf97316,
    nearDark: 0x1c0303,
    nearLight: 0x420707,
    nearGlow: 0xfacc15,
    nearStyle: 'nether'
  },
  'mt-maridia': {
    surface: { O: 0x081a29, H: 0xfbcfe8, G: 0x38bdf8, M: 0x0284c7, L: 0x334155, S: 0x1e293b, D: 0x0f172a },
    deep: { O: 0x081a29, L: 0x0369a1, S: 0x075985, D: 0x0c4a6e, A: 0xf472b6 },
    ore: { O: 0x081a29, L: 0x075985, S: 0x0c4a6e, D: 0x082f49, G: 0xf472b6, W: 0xffffff },
    hazard: { W: 0xfce7f3, S: 0xec4899, D: 0x9d174d, O: 0x500724 },
    skyBands: [0x04101c, 0x082138, 0x0e3559, 0x164c7d],
    celestialColor: 0xf472b6,
    cloudColor: 0x38bdf8,
    midDark: 0x071d33,
    midLight: 0x103c66,
    midAccent: 0xf472b6,
    nearDark: 0x051424,
    nearLight: 0x0b2b4a,
    nearGlow: 0x38bdf8,
    nearStyle: 'coral'
  },
  'mt-tourian': {
    surface: { O: 0x090d16, H: 0xe2e8f0, G: 0x94a3b8, M: 0x475569, L: 0x334155, S: 0x1e293b, D: 0x0f172a },
    deep: { O: 0x090d16, L: 0x334155, S: 0x1e293b, D: 0x0f172a, A: 0xef4444 },
    ore: { O: 0x090d16, L: 0x1e293b, S: 0x0f172a, D: 0x05080f, G: 0x22d3ee, W: 0xffffff },
    hazard: { W: 0xfecaca, S: 0xef4444, D: 0x991b1b, O: 0x450a0a },
    skyBands: [0x05070c, 0x0b101c, 0x131c30, 0x1c2947],
    celestialColor: 0x22d3ee,
    cloudColor: 0xef4444,
    midDark: 0x0c1221,
    midLight: 0x192542,
    midAccent: 0x22d3ee,
    nearDark: 0x070b14,
    nearLight: 0x121b30,
    nearGlow: 0xef4444,
    nearStyle: 'tower'
  },
  // ==================== 12. SUBNAUTICA (5 Themes) ====================
  'sb-shallows': {
    surface: { O: 0x041e2b, H: 0x99f6e4, G: 0x06b6d4, M: 0x0891b2, L: 0xfde68a, S: 0xd97706, D: 0x92400e },
    deep: { O: 0x041e2b, L: 0x0e7490, S: 0x155e75, D: 0x164e63, A: 0xf472b6 },
    ore: { O: 0x041e2b, L: 0x155e75, S: 0x164e63, D: 0x083344, G: 0xfacc15, W: 0xffffff },
    hazard: { W: 0xfef08a, S: 0xf97316, D: 0xc2410c, O: 0x431407 },
    skyBands: [0x083344, 0x0e7490, 0x06b6d4, 0x22d3ee],
    celestialColor: 0xa5f3fc,
    cloudColor: 0x67e8f9,
    midDark: 0x0b4f6c,
    midLight: 0x1482ad,
    midAccent: 0xf472b6,
    nearDark: 0x073b52,
    nearLight: 0x0f6285,
    nearGlow: 0x2dd4bf,
    nearStyle: 'coral'
  },
  'sb-kelp': {
    surface: { O: 0x051c16, H: 0xbef264, G: 0x65a30d, M: 0x3f6212, L: 0x115e59, S: 0x134e4a, D: 0x042f2e },
    deep: { O: 0x051c16, L: 0x115e59, S: 0x134e4a, D: 0x042f2e, A: 0xa3e635 },
    ore: { O: 0x051c16, L: 0x134e4a, S: 0x042f2e, D: 0x021f1e, G: 0xfacc15, W: 0xfef9c3 },
    hazard: { W: 0xecfccb, S: 0x84cc16, D: 0x3f6212, O: 0x1a2e05 },
    skyBands: [0x031a17, 0x063630, 0x0b544b, 0x117569],
    celestialColor: 0xbef264,
    cloudColor: 0x2dd4bf,
    midDark: 0x062e28,
    midLight: 0x0d594e,
    midAccent: 0xa3e635,
    nearDark: 0x04211d,
    nearLight: 0x09423a,
    nearGlow: 0xbef264,
    nearStyle: 'coral'
  },
  'sb-jellyshroom': {
    surface: { O: 0x140626, H: 0xf5d0fe, G: 0xd946ef, M: 0xa21caf, L: 0x312e81, S: 0x1e1b4b, D: 0x0f0d26 },
    deep: { O: 0x140626, L: 0x312e81, S: 0x1e1b4b, D: 0x0f0d26, A: 0xe879f9 },
    ore: { O: 0x140626, L: 0x1e1b4b, S: 0x0f0d26, D: 0x070614, G: 0x38bdf8, W: 0xffffff },
    hazard: { W: 0xfae8ff, S: 0xd946ef, D: 0x86198f, O: 0x4a044e },
    skyBands: [0x090414, 0x14092b, 0x221047, 0x331869],
    celestialColor: 0xe879f9,
    cloudColor: 0xc084fc,
    midDark: 0x160a2e,
    midLight: 0x2d155c,
    midAccent: 0xe879f9,
    nearDark: 0x0e061f,
    nearLight: 0x210f45,
    nearGlow: 0xf0abfc,
    nearStyle: 'crystal'
  },
  'sb-lostriver': {
    surface: { O: 0x041a14, H: 0xa7f3d0, G: 0x10b981, M: 0x047857, L: 0x334155, S: 0x1e293b, D: 0x0f172a },
    deep: { O: 0x041a14, L: 0x065f46, S: 0x064e3b, D: 0x022c22, A: 0x34d399 },
    ore: { O: 0x041a14, L: 0x064e3b, S: 0x022c22, D: 0x011a14, G: 0x6ee7b7, W: 0xffffff },
    hazard: { W: 0xd1fae5, S: 0x10b981, D: 0x047857, O: 0x022c22 },
    skyBands: [0x02120e, 0x05261d, 0x093d2f, 0x0f5743],
    celestialColor: 0x6ee7b7,
    cloudColor: 0x10b981,
    midDark: 0x052119,
    midLight: 0x0b4233,
    midAccent: 0x34d399,
    nearDark: 0x031712,
    nearLight: 0x083025,
    nearGlow: 0x6ee7b7,
    nearStyle: 'coral'
  },
  'sb-lava': {
    surface: { O: 0x1f0604, H: 0xfde047, G: 0xf97316, M: 0xc2410c, L: 0x450a0a, S: 0x290505, D: 0x170202 },
    deep: { O: 0x1f0604, L: 0x450a0a, S: 0x290505, D: 0x170202, A: 0xef4444 },
    ore: { O: 0x1f0604, L: 0x290505, S: 0x170202, D: 0x0c0101, G: 0x06b6d4, W: 0xffffff },
    hazard: { W: 0xfef08a, S: 0xef4444, D: 0x991b1b, O: 0x450a0a },
    skyBands: [0x170302, 0x330805, 0x570f09, 0x80180e],
    celestialColor: 0xfacc15,
    cloudColor: 0xf97316,
    midDark: 0x260604,
    midLight: 0x4d0d08,
    midAccent: 0xf97316,
    nearDark: 0x170302,
    nearLight: 0x380906,
    nearGlow: 0xfacc15,
    nearStyle: 'nether'
  },
  // ==================== 13. SPELUNKY (5 Themes) ====================
  'sp-mines': {
    surface: { O: 0x1c1208, H: 0xfde68a, G: 0xd97706, M: 0x92400e, L: 0x78716c, S: 0x57534e, D: 0x292524 },
    deep: { O: 0x1c1208, L: 0x57534e, S: 0x44403c, D: 0x292524, A: 0xf59e0b },
    ore: { O: 0x1c1208, L: 0x44403c, S: 0x292524, D: 0x1c1917, G: 0xfacc15, W: 0xffffff },
    hazard: { W: 0xfef08a, S: 0xef4444, D: 0x991b1b, O: 0x450a0a },
    skyBands: [0x140d06, 0x26190c, 0x3b2713, 0x52361b],
    celestialColor: 0xfacc15,
    cloudColor: 0xd97706,
    midDark: 0x1f140a,
    midLight: 0x3d2814,
    midAccent: 0xf59e0b,
    nearDark: 0x140d06,
    nearLight: 0x2b1c0e,
    nearGlow: 0xfacc15,
    nearStyle: 'tower'
  },
  'sp-jungle': {
    surface: { O: 0x091c0d, H: 0xbbf7d0, G: 0x22c55e, M: 0x15803d, L: 0x713f12, S: 0x422006, D: 0x261103 },
    deep: { O: 0x091c0d, L: 0x166534, S: 0x14532d, D: 0x052e16, A: 0x4ade80 },
    ore: { O: 0x091c0d, L: 0x14532d, S: 0x052e16, D: 0x021c0d, G: 0xec4899, W: 0xfce7f3 },
    hazard: { W: 0xfecdd3, S: 0xe11d48, D: 0x881337, O: 0x4c0519 },
    skyBands: [0x061409, 0x0d2913, 0x16421f, 0x205e2d],
    celestialColor: 0x86efac,
    cloudColor: 0x22c55e,
    midDark: 0x0b2410,
    midLight: 0x174721,
    midAccent: 0x4ade80,
    nearDark: 0x07170a,
    nearLight: 0x113318,
    nearGlow: 0x86efac,
    nearStyle: 'pine'
  },
  'sp-icecaves': {
    surface: { O: 0x061326, H: 0xffffff, G: 0x7dd3fc, M: 0x0284c7, L: 0x475569, S: 0x334155, D: 0x1e293b },
    deep: { O: 0x061326, L: 0x0369a1, S: 0x075985, D: 0x082f49, A: 0x38bdf8 },
    ore: { O: 0x061326, L: 0x075985, S: 0x082f49, D: 0x041929, G: 0x22d3ee, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0x38bdf8, D: 0x0369a1, O: 0x082f49 },
    skyBands: [0x040d1a, 0x091c36, 0x102e59, 0x184380],
    celestialColor: 0xe0f2fe,
    cloudColor: 0x38bdf8,
    midDark: 0x081930,
    midLight: 0x123461,
    midAccent: 0x7dd3fc,
    nearDark: 0x051021,
    nearLight: 0x0d2447,
    nearGlow: 0x38bdf8,
    nearStyle: 'crystal'
  },
  'sp-temple': {
    surface: { O: 0x241604, H: 0xfef08a, G: 0xeab308, M: 0xa16207, L: 0x92400e, S: 0x78350f, D: 0x451a03 },
    deep: { O: 0x241604, L: 0x854d0e, S: 0x713f12, D: 0x422006, A: 0xfacc15 },
    ore: { O: 0x241604, L: 0x713f12, S: 0x422006, D: 0x261103, G: 0xef4444, W: 0xfef08a },
    hazard: { W: 0xfef08a, S: 0xef4444, D: 0x991b1b, O: 0x450a0a },
    skyBands: [0x1c1003, 0x382006, 0x57320a, 0x78460e],
    celestialColor: 0xfef08a,
    cloudColor: 0xeab308,
    midDark: 0x2b1805,
    midLight: 0x54300a,
    midAccent: 0xfacc15,
    nearDark: 0x1c1003,
    nearLight: 0x3d2207,
    nearGlow: 0xfacc15,
    nearStyle: 'tower'
  },
  'sp-cosmic': {
    surface: { O: 0x09041c, H: 0xf5d0fe, G: 0xa855f7, M: 0x6b21a8, L: 0x312e81, S: 0x1e1b4b, D: 0x0f0d26 },
    deep: { O: 0x09041c, L: 0x312e81, S: 0x1e1b4b, D: 0x0f0d26, A: 0xec4899 },
    ore: { O: 0x09041c, L: 0x1e1b4b, S: 0x0f0d26, D: 0x060412, G: 0x22d3ee, W: 0xffffff },
    hazard: { W: 0xffffff, S: 0xec4899, D: 0x9d174d, O: 0x500724 },
    skyBands: [0x04020d, 0x09041f, 0x120938, 0x1d0f54],
    celestialColor: 0xf0abfc,
    cloudColor: 0x818cf8,
    midDark: 0x0d0626,
    midLight: 0x1c0d4d,
    midAccent: 0x22d3ee,
    nearDark: 0x080417,
    nearLight: 0x140936,
    nearGlow: 0xe879f9,
    nearStyle: 'crystal'
  },
  // ==================== 14. ORI & SPIRIT TREE (5 Themes) ====================
  'or-nibel': {
    surface: { O: 0x061224, H: 0xbae6fd, G: 0x38bdf8, M: 0x0284c7, L: 0x312e81, S: 0x1e1b4b, D: 0x0f0d26 },
    deep: { O: 0x061224, L: 0x1e3a8a, S: 0x1e1b4b, D: 0x0f172a, A: 0x7dd3fc },
    ore: { O: 0x061224, L: 0x1e1b4b, S: 0x0f172a, D: 0x060a14, G: 0x38bdf8, W: 0xffffff },
    hazard: { W: 0xe0f2fe, S: 0xec4899, D: 0x9d174d, O: 0x500724 },
    skyBands: [0x040b17, 0x091730, 0x112852, 0x1a3c78],
    celestialColor: 0xe0f2fe,
    cloudColor: 0x38bdf8,
    midDark: 0x08152b,
    midLight: 0x122c57,
    midAccent: 0x7dd3fc,
    nearDark: 0x050e1c,
    nearLight: 0x0d2040,
    nearGlow: 0xbae6fd,
    nearStyle: 'cherry'
  },
  'or-ginso': {
    surface: { O: 0x051c24, H: 0x99f6e4, G: 0x14b8a6, M: 0x0f766e, L: 0x4c1d95, S: 0x2e1065, D: 0x170736 },
    deep: { O: 0x051c24, L: 0x0f766e, S: 0x115e59, D: 0x042f2e, A: 0x2dd4bf },
    ore: { O: 0x051c24, L: 0x115e59, S: 0x042f2e, D: 0x021c1b, G: 0x5eead4, W: 0xffffff },
    hazard: { W: 0xccfbf1, S: 0xa855f7, D: 0x6b21a8, O: 0x3b0764 },
    skyBands: [0x04141c, 0x082938, 0x0f4259, 0x175e7d],
    celestialColor: 0x99f6e4,
    cloudColor: 0x2dd4bf,
    midDark: 0x072430,
    midLight: 0x10475e,
    midAccent: 0x5eead4,
    nearDark: 0x041821,
    nearLight: 0x0b3345,
    nearGlow: 0x99f6e4,
    nearStyle: 'coral'
  },
  'or-forlorn': {
    surface: { O: 0x0c1026, H: 0xe0e7ff, G: 0x818cf8, M: 0x4f46e5, L: 0x334155, S: 0x1e293b, D: 0x0f172a },
    deep: { O: 0x0c1026, L: 0x312e81, S: 0x1e1b4b, D: 0x0f0d26, A: 0xa5b4fc },
    ore: { O: 0x0c1026, L: 0x1e1b4b, S: 0x0f0d26, D: 0x070614, G: 0xc7d2fe, W: 0xffffff },
    hazard: { W: 0xe0e7ff, S: 0x6366f1, D: 0x3730a3, O: 0x1e1b4b },
    skyBands: [0x060917, 0x0d1330, 0x172152, 0x233178],
    celestialColor: 0xe0e7ff,
    cloudColor: 0x818cf8,
    midDark: 0x0b1029,
    midLight: 0x182254,
    midAccent: 0xa5b4fc,
    nearDark: 0x070a1c,
    nearLight: 0x11183d,
    nearGlow: 0xc7d2fe,
    nearStyle: 'crystal'
  },
  'or-horu': {
    surface: { O: 0x240704, H: 0xfef08a, G: 0xf97316, M: 0xc2410c, L: 0x57534e, S: 0x44403c, D: 0x1c1917 },
    deep: { O: 0x240704, L: 0x44403c, S: 0x292524, D: 0x1c1917, A: 0xf97316 },
    ore: { O: 0x240704, L: 0x292524, S: 0x1c1917, D: 0x0c0a09, G: 0xfacc15, W: 0xffffff },
    hazard: { W: 0xfef08a, S: 0xef4444, D: 0x991b1b, O: 0x450a0a },
    skyBands: [0x1c0502, 0x3b0b05, 0x611309, 0x8c1c0e],
    celestialColor: 0xfef08a,
    cloudColor: 0xf97316,
    midDark: 0x290804,
    midLight: 0x541108,
    midAccent: 0xfacc15,
    nearDark: 0x1c0502,
    nearLight: 0x3d0c06,
    nearGlow: 0xf97316,
    nearStyle: 'nether'
  },
  'or-willow': {
    surface: { O: 0x1a0621, H: 0xfbcfe8, G: 0xe879f9, M: 0xa21caf, L: 0x4c1d95, S: 0x2e1065, D: 0x170736 },
    deep: { O: 0x1a0621, L: 0x4c1d95, S: 0x2e1065, D: 0x170736, A: 0xf472b6 },
    ore: { O: 0x1a0621, L: 0x2e1065, S: 0x170736, D: 0x0b031c, G: 0xf472b6, W: 0xffffff },
    hazard: { W: 0xfce7f3, S: 0xf43f5e, D: 0x9f1239, O: 0x4c0519 },
    skyBands: [0x120417, 0x24092e, 0x3b0f4d, 0x56166e],
    celestialColor: 0xfbcfe8,
    cloudColor: 0xe879f9,
    midDark: 0x1f0729,
    midLight: 0x400f52,
    midAccent: 0xf472b6,
    nearDark: 0x14041c,
    nearLight: 0x2e0a3d,
    nearGlow: 0xf9a8d4,
    nearStyle: 'cherry'
  },
  // ==================== 15. THE WEEKND: AFTER HOURS TOUR (5 Themes) ====================
  'wk-blinding': makeConcertPalette(0xfef08a, 0xef4444, 0x991b1b, 0x334155, 0x1e1b4b, 0x0f0514, 0x7f1d1d, 0xf97316, 'tower'),
  'wk-starboy': makeConcertPalette(0xfbcfe8, 0xec4899, 0x831843, 0x312e81, 0x1e1b4b, 0x090418, 0x500724, 0x38bdf8, 'crystal'),
  'wk-afterhours': makeConcertPalette(0xfecaca, 0xdc2626, 0x7f1d1d, 0x27272a, 0x18181b, 0x090204, 0x450a0a, 0xfacc15, 'tower'),
  'wk-dawnfm': makeConcertPalette(0xfde68a, 0x38bdf8, 0x0369a1, 0x1e3a8a, 0x0f172a, 0x040917, 0x1e3a8a, 0xf59e0b, 'tower'),
  'wk-sofi': makeConcertPalette(0xffffff, 0xe2e8f0, 0x64748b, 0x334155, 0x1e293b, 0x050814, 0x1e293b, 0xef4444, 'tower'),

  // ==================== 16. MARSBUNN / MARSHMELLO LIVE (5 Themes) ====================
  'mb-alone': makeConcertPalette(0xffffff, 0x22d3ee, 0x0891b2, 0x475569, 0x1e293b, 0x061024, 0x0e7490, 0xf472b6, 'crystal'),
  'mb-happier': makeConcertPalette(0xfef9c3, 0xfacc15, 0xca8a04, 0x475569, 0x1e293b, 0x1c1008, 0x854d0e, 0x38bdf8, 'cherry'),
  'mb-joytime': makeConcertPalette(0xf5d0fe, 0xd946ef, 0x86198f, 0x312e81, 0x1e1b4b, 0x0f0524, 0x581c87, 0x2dd4bf, 'crystal'),
  'mb-bass': makeConcertPalette(0xa5f3fc, 0x8b5cf6, 0x4c1d95, 0x1e293b, 0x0f172a, 0x050414, 0x3b0764, 0x22d3ee, 'tower'),
  'mb-ultra': makeConcertPalette(0xfef08a, 0xf43f5e, 0x881337, 0x312e81, 0x1e1b4b, 0x0c041c, 0x701a75, 0x06b6d4, 'nether'),

  // ==================== 17. SYNTHWAVE & CYBER LIVE (5 Themes) ====================
  'sw-outrun': makeConcertPalette(0xfef08a, 0xf472b6, 0x9d174d, 0x312e81, 0x1e1b4b, 0x080318, 0x4c1d95, 0x22d3ee, 'tower'),
  'sw-pyramid': makeConcertPalette(0xfef08a, 0xf59e0b, 0x92400e, 0x334155, 0x0f172a, 0x05060c, 0x451a03, 0xef4444, 'tower'),
  'sw-holo': makeConcertPalette(0xccfbf1, 0x2dd4bf, 0x0f766e, 0x312e81, 0x1e1b4b, 0x04121c, 0x115e59, 0xf472b6, 'crystal'),
  'sw-vinyl': makeConcertPalette(0xe0e7ff, 0x6366f1, 0x3730a3, 0x27272a, 0x18181b, 0x05050a, 0x1e1b4b, 0xfacc15, 'tower'),
  'sw-cathedral': makeConcertPalette(0xe0f2fe, 0x38bdf8, 0x0284c7, 0x312e81, 0x1e1b4b, 0x04091a, 0x1e3a8a, 0xe879f9, 'crystal'),

  // ==================== 18. TOMORROWLAND & EDM FESTIVAL (5 Themes) ====================
  'ed-wisdom': makeConcertPalette(0xfef9c3, 0xeab308, 0x854d0e, 0x3f3f46, 0x1e1b4b, 0x09061a, 0x3b0764, 0x34d399, 'tower'),
  'ed-rose': makeConcertPalette(0xffe4e6, 0xfb7185, 0x9f1239, 0x1e3a2f, 0x0f172a, 0x0c0512, 0x4c0519, 0xfacc15, 'cherry'),
  'ed-freedom': makeConcertPalette(0xa5f3fc, 0x06b6d4, 0x0e7490, 0x312e81, 0x1e1b4b, 0x040d1f, 0x164e63, 0xf472b6, 'coral'),
  'ed-core': makeConcertPalette(0xbbf7d0, 0x22c55e, 0x15803d, 0x334155, 0x1e293b, 0x04120c, 0x14532d, 0xfacc15, 'pine'),
  'ed-encore': makeConcertPalette(0xffffff, 0xa855f7, 0x581c87, 0x334155, 0x0f172a, 0x070312, 0x4c1d95, 0xfacc15, 'crystal'),

  // ==================== 19. ROCK & SYMPHONY GRAND LIVE (5 Themes) ====================
  'rk-amp': makeConcertPalette(0xfef08a, 0xd97706, 0x78350f, 0x27272a, 0x09090b, 0x050505, 0x27272a, 0xef4444, 'tower'),
  'rk-pyro': makeConcertPalette(0xfef08a, 0xf97316, 0x9a3412, 0x292524, 0x1c1917, 0x140402, 0x7c2d12, 0xfacc15, 'nether'),
  'rk-piano': makeConcertPalette(0xffffff, 0xcbd5e1, 0x475569, 0x1e293b, 0x09090b, 0x030712, 0x1e293b, 0x38bdf8, 'tower'),
  'rk-symphony': makeConcertPalette(0xfef9c3, 0xfbbf24, 0x92400e, 0x4c1d95, 0x1e1b4b, 0x070414, 0x311042, 0x38bdf8, 'crystal'),
  'rk-finale': makeConcertPalette(0xffffff, 0xf43f5e, 0x6d28d9, 0x312e81, 0x0f172a, 0x050314, 0x4c1d95, 0xfacc15, 'tower')
};

function createPixelTexture(
  scene: Phaser.Scene,
  key: string,
  grid: string[],
  palette: Record<string, number>
): void {
  if (scene.textures.exists(key)) {
    return;
  }
  const height = grid.length;
  const width = grid[0]?.length ?? 16;
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  for (let y = 0; y < height; y++) {
    const row = grid[y] ?? '';
    for (let x = 0; x < width; x++) {
      const ch = row[x];
      if (!ch || ch === '.') continue;
      const color = palette[ch];
      if (color !== undefined) {
        g.fillStyle(color, 1);
        g.fillRect(x, y, 1, 1);
      }
    }
  }

  g.generateTexture(key, width, height);
  g.destroy();
}

export class ProceduralTextures {
  private static readonly loadedThemes = new Set<WorldTheme>();

  public static getSolidSurfaceKey(theme: WorldTheme): string {
    return `tile_solid_${theme}`;
  }

  public static getSolidDeepKey(theme: WorldTheme): string {
    return `tile_deep_${theme}`;
  }

  public static getSolidOreKey(theme: WorldTheme): string {
    return `tile_ore_${theme}`;
  }

  public static getHazardKey(theme: WorldTheme): string {
    return `tile_hazard_${theme}`;
  }

  public static getPlatformKey(theme: WorldTheme): string {
    return `tile_platform_${theme}`;
  }

  public static getCrumbleKey(theme: WorldTheme): string {
    return `tile_crumble_${theme}`;
  }

  public static getCrumbleCrackedKey(theme: WorldTheme): string {
    return `tile_crumble_cracked_${theme}`;
  }

  public static getSkyKey(theme: WorldTheme): string {
    return `bg_${theme}_sky`;
  }

  public static getMidKey(theme: WorldTheme): string {
    return `bg_${theme}_mid`;
  }

  public static getNearKey(theme: WorldTheme): string {
    return `bg_${theme}_near`;
  }

  public static getPlayerFrameKey(skinId: CharacterSkinId, baseFrameKey: string): string {
    if (skinId === 'knight-skybound') {
      return baseFrameKey;
    }
    return `${baseFrameKey}_${skinId}`;
  }

  public static getWeaponKey(weaponId: WeaponItemId): string {
    return `equip_${weaponId}`;
  }

  public static getShieldKey(shieldId: ShieldItemId): string {
    return `equip_${shieldId}`;
  }

  private static applyHeadStyleToGrid(grid: string[], skin: CharacterSkinDef): string[] {
    const copy = [...grid];
    // Tìm dòng đầu tiên có đỉnh mũ '....OOOOOOOO....'
    const topIdx = copy.findIndex((r) => r.includes('OOOOOOOO'));
    if (topIdx < 0 || topIdx + 2 >= copy.length) return copy;

    if (skin.headStyle === 'crown') {
      copy[topIdx] = '..O.OG.GG.GO.O..';
      copy[topIdx + 1] = '..OGGLLLLLLGGO..';
    } else if (skin.headStyle === 'horns') {
      copy[topIdx] = '.OO.OOOOOOOO.OO.';
      copy[topIdx + 1] = '.OGOHLLLLLLHOGO.';
    } else if (skin.headStyle === 'wizard') {
      copy[topIdx] = '.....OOOOOO.....';
      copy[topIdx + 1] = '..OOOHLLLLHOOO..';
      copy[topIdx + 2] = '.OGGGGGGGGGGGGO.';
    } else if (skin.headStyle === 'hood') {
      copy[topIdx] = '...OOOOOOOOOO...';
      copy[topIdx + 1] = '..OSSSSSSSSSSO..';
      copy[topIdx + 2] = '..OSRRRRRRRRSO..';
    } else if (skin.headStyle === 'visor') {
      copy[topIdx] = '...OOOOOOOOOO...';
      copy[topIdx + 1] = '..OLLLLLLLLLLO..';
    } else if (skin.headStyle === 'wings-helm') {
      copy[topIdx] = '.OSO.OOOOOO.OSO.';
      copy[topIdx + 1] = 'OSGSOLLLLLLOSGSO';
    } else if (skin.headStyle === 'halo-crown') {
      copy[topIdx] = '..GGGGGGGGGGGG..';
      copy[topIdx + 1] = '..O.OGLLLLGO.O..';
    }

    // Nâng cấp hình dáng cơ thể (Cánh thiên thần/rồng hoặc Áo choàng dài hoặc Hào quang cánh Sáng Thế)
    const setPixelIfEmpty = (rowIdx: number, colIdx: number, ch: string) => {
      if (rowIdx < 0 || rowIdx >= copy.length) return;
      const r = copy[rowIdx];
      if (!r || colIdx < 0 || colIdx >= r.length) return;
      if (r[colIdx] === '.') {
        copy[rowIdx] = r.slice(0, colIdx) + ch + r.slice(colIdx + 1);
      }
    };

    if (skin.bodyStyle === 'winged' || skin.bodyStyle === 'halo-winged') {
      const wingCh = skin.bodyStyle === 'halo-winged' ? 'G' : 'S';
      // Cánh mở rộng 2 bên vai nhân vật
      setPixelIfEmpty(topIdx + 5, 0, 'O');
      setPixelIfEmpty(topIdx + 5, 1, wingCh);
      setPixelIfEmpty(topIdx + 5, 14, wingCh);
      setPixelIfEmpty(topIdx + 5, 15, 'O');

      setPixelIfEmpty(topIdx + 6, 0, wingCh);
      setPixelIfEmpty(topIdx + 6, 1, 'R');
      setPixelIfEmpty(topIdx + 6, 14, 'R');
      setPixelIfEmpty(topIdx + 6, 15, wingCh);

      setPixelIfEmpty(topIdx + 7, 1, 'O');
      setPixelIfEmpty(topIdx + 7, 14, 'O');
    } else if (skin.bodyStyle === 'cloaked') {
      // Tà áo choàng bay sau lưng
      setPixelIfEmpty(topIdx + 7, 1, 'S');
      setPixelIfEmpty(topIdx + 8, 1, 'R');
      setPixelIfEmpty(topIdx + 8, 2, 'R');
      setPixelIfEmpty(topIdx + 9, 1, 'O');
    }

    return copy;
  }

  public static ensureCharacterEquipmentTextures(scene: Phaser.Scene): void {
    const baseFrames: Array<{ key: string; grid: string[] }> = [
      {
        key: TEXTURE_KEYS.PLAYER_IDLE,
        grid: [
          '....OOOOOOOO....',
          '...OHLLLLLLHO...',
          '..OHLLHHHHLLHO..',
          '..OHVVVVVVVVHO..',
          '..OHVEEVVEEVHO..',
          '...OSSSSSSSSO...',
          '..OSSSSSSSSSSO..',
          '..ORBBBBBBBBRO..',
          '...OBBBGBBBBO...',
          '...OttO..OTTO...',
          '...OkkO..OKKO...',
          '...OffO..OFFO...',
          '...OzzO..OZZO...',
          '...OOOO..OOOO...',
          '................',
          '................'
        ]
      },
      {
        key: TEXTURE_KEYS.PLAYER_WALK_1,
        grid: [
          '....OOOOOOOO....',
          '...OHLLLLLLHO...',
          '..OHLLHHHHLLHO..',
          '..OHVVVVVVVVHO..',
          '..OHVEEVVEEVHO..',
          '..OOSSSSSSSSO...',
          '.ORSSSSSSSSSSO..',
          '.OR.OBBBBBBO....',
          '....OBBGBBBO....',
          '...OttO..OTTO...',
          '..OkkO....OKKO..',
          '..OffO....OFFO..',
          '.OzzO......OZZO.',
          '.OOOO......OOOO.',
          '................',
          '................'
        ]
      },
      {
        key: TEXTURE_KEYS.PLAYER_WALK_2,
        grid: [
          '................',
          '....OOOOOOOO....',
          '...OHLLLLLLHO...',
          '..OHLLHHHHLLHO..',
          '..OHVVVVVVVVHO..',
          '..OHVEEVVEEVHO..',
          '.OOSSSSSSSSSSO..',
          'ORRSSSSSSSSSO...',
          '....OBBBBBBO....',
          '....OBBGBBBO....',
          '...OttO.OTTO....',
          '...OkkO..OKKO...',
          '..OffO...OFFO...',
          '..OzzO...OZZO...',
          '..OOOO...OOOO...',
          '................'
        ]
      },
      {
        key: TEXTURE_KEYS.PLAYER_WALK_3,
        grid: [
          '....OOOOOOOO....',
          '...OHLLLLLLHO...',
          '..OHLLHHHHLLHO..',
          '..OHVVVVVVVVHO..',
          '..OHVEEVVEEVHO..',
          '..OOSSSSSSSSO...',
          '.ORSSSSSSSSSSO..',
          '..R.OBBBBBBO....',
          '....OBBGBBBO....',
          '....OTTOOttO....',
          '....OKKO.OkkO...',
          '....OFFO..OzzO..',
          '....OZZO..OOOO..',
          '....OOOO........',
          '................',
          '................'
        ]
      },
      {
        key: TEXTURE_KEYS.PLAYER_WALK_4,
        grid: [
          '....OOOOOOOO....',
          '...OHLLLLLLHO...',
          '..OHLLHHHHLLHO..',
          '..OHVVVVVVVVHO..',
          '..OHVEEVVEEVHO..',
          '..OOSSSSSSSSO...',
          '.ORSSSSSSSSSSO..',
          '.OR.OBBBBBBO....',
          '....OBBGBBBO....',
          '...OTTO..OttO...',
          '..OKKO....OkkO..',
          '..OFFO....OffO..',
          '.OZZO......OzzO.',
          '.OOOO......OOOO.',
          '................',
          '................'
        ]
      },
      {
        key: TEXTURE_KEYS.PLAYER_WALK_5,
        grid: [
          '................',
          '....OOOOOOOO....',
          '...OHLLLLLLHO...',
          '..OHLLHHHHLLHO..',
          '..OHVVVVVVVVHO..',
          '..OHVEEVVEEVHO..',
          '.OOSSSSSSSSSSO..',
          'ORRSSSSSSSSSO...',
          '....OBBBBBBO....',
          '....OBBGBBBO....',
          '...OTTO.OttO....',
          '...OKKO..OkkO...',
          '..OFFO...OffO...',
          '..OZZO...OzzO...',
          '..OOOO...OOOO...',
          '................'
        ]
      },
      {
        key: TEXTURE_KEYS.PLAYER_WALK_6,
        grid: [
          '....OOOOOOOO....',
          '...OHLLLLLLHO...',
          '..OHLLHHHHLLHO..',
          '..OHVVVVVVVVHO..',
          '..OHVEEVVEEVHO..',
          '...OSSSSSSSSO...',
          '..OOSSSSSSSSOO..',
          '.OR.OBBBBBBO....',
          '....OBBGBBBO....',
          '....OttOOTTO....',
          '....OkkO.OKKO...',
          '....OffO..OZZO..',
          '....OzzO..OOOO..',
          '....OOOO........',
          '................',
          '................'
        ]
      },
      {
        key: TEXTURE_KEYS.PLAYER_CHARGE,
        grid: [
          '................',
          '................',
          '................',
          '....OOOOOOOO....',
          '...OHLLLLLLHO...',
          '..OHLLHHHHLLHO..',
          '..OHVVVVVVVVHO..',
          '..OHVEEVVEEVHO..',
          '.OOSSSSSSSSSSOO.',
          '.ORBBBBGBBBBBRO.',
          '..OttttOOTTTTO..',
          '.OkkkO....OKKKO.',
          '.OfffO....OFFFO.',
          '.OzzzO....OZZZO.',
          '.OOOOO....OOOOO.',
          '................'
        ]
      },
      {
        key: TEXTURE_KEYS.PLAYER_JUMP,
        grid: [
          '....OOOOOOOO....',
          '...OHLLLLLLHO...',
          '..OHLLHHHHLLHO..',
          '..OHVVVVVVVVHO..',
          '..OHVEEVVEEVHO..',
          '...OSSSSSSSSO...',
          '..OOSSSSSSSSOO..',
          '.ORRSSBBBBSSRRO.',
          '.OR.OBBGBBBO.RO.',
          '....OttOOTTO....',
          '....OkkOOKKO....',
          '....OffOOFFO....',
          '....OzzOOZZO....',
          '....OOOOOOOO....',
          '................',
          '................'
        ]
      },
      {
        key: TEXTURE_KEYS.PLAYER_FALL,
        grid: [
          '.OO..........OO.',
          '.ORSOOOOOOOOSRO.',
          '..OSSHLLLLHSSO..',
          '..OHLLHHHHLLHO..',
          '..OHVVVVVVVVHO..',
          '..OHVEEVVEEVHO..',
          '...OBBBBBBBBO...',
          '..OBBBBGBBBBBO..',
          '..OttO....OTTO..',
          '.OkkO......OKKO.',
          '.OffO......OFFO.',
          '.OzzO......OZZO.',
          '.OOOO......OOOO.',
          '................',
          '................',
          '................'
        ]
      },
      {
        key: TEXTURE_KEYS.PLAYER_SPLAT,
        grid: [
          '................',
          '................',
          '................',
          '................',
          '................',
          '................',
          '................',
          '..OOOOOOOOOOOO..',
          '.OSSSSSSSSSSSSO.',
          'OHLLLLLLLLLLLLHO',
          'OHVVVEEVVEEVVVHO',
          'OBBBBBGBBBBBBBBO',
          'OKKKFFFFFFFFKKKO',
          'OZZZZZZZZZZZZZZO',
          '.OOOOOOOOOOOOOO.',
          '................'
        ]
      }
    ];

    for (const skin of CHARACTER_SKINS) {
      for (const frame of baseFrames) {
        const texKey = this.getPlayerFrameKey(skin.id, frame.key);
        const styledGrid =
          frame.key === TEXTURE_KEYS.PLAYER_SPLAT
            ? frame.grid
            : this.applyHeadStyleToGrid(frame.grid, skin);
        createPixelTexture(
          scene,
          texKey,
          styledGrid,
          skin.palette as unknown as Record<string, number>
        );
      }
    }

    // ==================== VŨ KHÍ CẦM TAY (WEAPONS 14x14) ====================
    const weaponPalette: Record<string, number> = {
      O: 0x090d16,
      S: 0xe2e8f0,
      M: 0x94a3b8,
      G: 0xfacc15,
      B: 0x92400e,
      R: 0xef4444,
      F: 0xf97316,
      Y: 0xfef08a,
      C: 0x22d3ee,
      E: 0x10b981,
      P: 0xa855f7,
      W: 0xffffff
    };

    // 1. Trường Kiếm Hiệp Sĩ
    createPixelTexture(
      scene,
      this.getWeaponKey('weapon-broadsword'),
      [
        '...........OO.',
        '..........OSWO',
        '.........OSWMO',
        '........OSWMO.',
        '.......OSWMO..',
        '......OSWMO...',
        '.....OSWMO....',
        '...OOOSMO.....',
        '..OGGGGGO.....',
        '...OOBGO......',
        '...OBBO.......',
        '..OGBO........',
        '..OOO.........',
        '..............'
      ],
      weaponPalette
    );

    // 2. Hỏa Long Đại Kiếm
    createPixelTexture(
      scene,
      this.getWeaponKey('weapon-sunblade'),
      [
        '..........OOO.',
        '.........ORYFO',
        '........ORYFO.',
        '.......ORYFO..',
        '......ORYFO...',
        '.....ORYFO....',
        '....ORYFO.....',
        '..OOORFO......',
        '.OGGGGGGO.....',
        '..OORGO.......',
        '..OBBO........',
        '.OGBO.........',
        '.OOO..........',
        '..............'
      ],
      weaponPalette
    );

    // 3. Quyền Trượng Pha Lê
    createPixelTexture(
      scene,
      this.getWeaponKey('weapon-archmage-staff'),
      [
        '........OOOO..',
        '.......OCWWCO.',
        '.......OCWWCO.',
        '.......OGGGGO.',
        '........OBBO..',
        '.......OBBO...',
        '......OBBO....',
        '.....OBBO.....',
        '....OBBO......',
        '...OBBO.......',
        '..OBBO........',
        '.OGGO.........',
        '.OOO..........',
        '..............'
      ],
      weaponPalette
    );

    // 4. Thương Ngọc Lục Bảo
    createPixelTexture(
      scene,
      this.getWeaponKey('weapon-dragon-lance'),
      [
        '...........OOO',
        '..........OEWO',
        '.........OEWEO',
        '........OEEEO.',
        '.......OGGGO..',
        '......OBBO....',
        '.....OBBO.....',
        '....OBBO......',
        '...OBBO.......',
        '..OBBO........',
        '.OGBO.........',
        '.OOO..........',
        '..............',
        '..............'
      ],
      weaponPalette
    );

    // 5. Chiến Rìu Cổ Tự
    createPixelTexture(
      scene,
      this.getWeaponKey('weapon-runed-axe'),
      [
        '.......OOOOO..',
        '......OSWWWCO.',
        '.....OSMMMMCO.',
        '.....OSMGMMCO.',
        '......OOOBBOO.',
        '.......OBBO...',
        '......OBBO....',
        '.....OBBO.....',
        '....OBBO......',
        '...OBBO.......',
        '..OGGO........',
        '..OOO.........',
        '..............',
        '..............'
      ],
      weaponPalette
    );

    // 6. Lưỡi Hái Tinh Hà
    createPixelTexture(
      scene,
      this.getWeaponKey('weapon-void-scythe'),
      [
        '....OOOOOOOO..',
        '...OPWWWWWWPO.',
        '..OPPPPPPPPPO.',
        '..OPO....OBBO.',
        '........OBBO..',
        '.......OBBO...',
        '......OBBO....',
        '.....OBBO.....',
        '....OBBO......',
        '...OBBO.......',
        '..OGPO........',
        '..OOO.........',
        '..............',
        '..............'
      ],
      weaponPalette
    );

    // 7. Vương Trượng Tối Thượng
    createPixelTexture(
      scene,
      this.getWeaponKey('weapon-royal-scepter'),
      [
        '.......O.OO.O.',
        '......OGGGGGGO',
        '......OGRWWRGO',
        '......OGGGGGGO',
        '.......OOGGOO.',
        '.......OGGO...',
        '......OGGO....',
        '.....OGGO.....',
        '....OGGO......',
        '...OGGO.......',
        '..ORGO........',
        '..OOO.........',
        '..............',
        '..............'
      ],
      weaponPalette
    );

    // 8. Búa Rèn Tinh Tú
    createPixelTexture(
      scene,
      this.getWeaponKey('weapon-starforge-hammer'),
      [
        '.....OOOOOOOO.',
        '....OGCWWWWCGO',
        '....OGCCCCCCGO',
        '.....OOOOOOO..',
        '.......OGGO...',
        '......OGGO....',
        '.....OBBO.....',
        '....OBBO......',
        '...OBBO.......',
        '..OGGO........',
        '..OOO.........',
        '..............',
        '..............',
        '..............'
      ],
      weaponPalette
    );

    // 9. Đại Đao Phượng Hoàng
    createPixelTexture(
      scene,
      this.getWeaponKey('weapon-phoenix-glaive'),
      [
        '..........OOOO',
        '.........ORYWO',
        '........ORYFO.',
        '.......ORYFO..',
        '......OGGGO...',
        '.....OBBO.....',
        '....OBBO......',
        '...OBBO.......',
        '..OBBO........',
        '.OGRO.........',
        '.OOO..........',
        '..............',
        '..............',
        '..............'
      ],
      weaponPalette
    );

    // 10. [SÁNG THẾ] Bút Kiếm Kiến Tạo
    createPixelTexture(
      scene,
      this.getWeaponKey('weapon-creator-pen'),
      [
        '...........OOO',
        '..........OCWO',
        '.........OEWPO',
        '........OGYGO.',
        '.......OGWGO..',
        '......OGWGO...',
        '.....OGWGO....',
        '....OGGGO.....',
        '...OCCCCO.....',
        '..OGBO........',
        '.OGBO.........',
        '.OOO..........',
        '..............',
        '..............'
      ],
      weaponPalette
    );

    // 11. [SÁNG THẾ] Kiếm Thời Không Vô Cực
    createPixelTexture(
      scene,
      this.getWeaponKey('weapon-chrono-blade'),
      [
        '..........OOOO',
        '.........OCWYO',
        '........OCWYO.',
        '.......OCWYO..',
        '......OCWYO...',
        '.....OCWYO....',
        '...OOOGYO.....',
        '..OGGGGGGO....',
        '...OOCGO......',
        '...OGGO.......',
        '..OCGO........',
        '..OOO.........',
        '..............',
        '..............'
      ],
      weaponPalette
    );

    // ==================== KHIÊN & PHÁP KHÍ (SHIELDS 12x12) ====================
    // 1. Khiên Thép Chữ Thập
    createPixelTexture(
      scene,
      this.getShieldKey('shield-heraldic'),
      [
        '.OOOOOOOOOO.',
        'OGSSSSSSSSGO',
        'OSMMGGGGMMSO',
        'OSMMGYYGMMSO',
        'OSGGGGGGGGSO',
        'OSMMGYYGMMSO',
        'OSMMGGGGMMSO',
        '.OSMMMMMMSO.',
        '..OSMMMMSO..',
        '...OSSSSO...',
        '....OOOO....',
        '............'
      ],
      weaponPalette
    );

    // 2. Khiên Thánh Quang Aegis
    createPixelTexture(
      scene,
      this.getShieldKey('shield-sun-aegis'),
      [
        '..OOOOOOOO..',
        '.OGYYYYYYGO.',
        'OGYGGGGGGYGO',
        'OGYGRWWWRGYO',
        'OGYGRWWWRGYO',
        'OGYGGGGGGYGO',
        '.OGYYYYYYGO.',
        '..OGGGGGGO..',
        '...OOOOOO...',
        '............',
        '............',
        '............'
      ],
      weaponPalette
    );

    // 3. Khiên Băng Vĩnh Cửu
    createPixelTexture(
      scene,
      this.getShieldKey('shield-frost-buckler'),
      [
        '..OOOOOOOO..',
        '.OCWWWWWWCO.',
        'OCWCCCCCCWCO',
        'OCWCWWWWCWCO',
        'OCWCWWWWCWCO',
        'OCWCCCCCCWCO',
        '.OCWWWWWWCO.',
        '..OCCCCCCCO.',
        '...OOOOOO...',
        '............',
        '............',
        '............'
      ],
      weaponPalette
    );

    // 4. Cổ Thư Pháp Thuật
    createPixelTexture(
      scene,
      this.getShieldKey('shield-arcane-tome'),
      [
        '.OOOOOOOOOO.',
        'OGPPPPPPPPGO',
        'OPWWWWWWWWPO',
        'OPWGGGGGGWPO',
        'OPWGYWWYGWPO',
        'OPWGGGGGGWPO',
        'OPPPPPPPPPPO',
        'OGGGGGGGGGGO',
        '.OOOOOOOOOO.',
        '............',
        '............',
        '............'
      ],
      weaponPalette
    );

    // 5. Lồng Đèn Linh Hồn
    createPixelTexture(
      scene,
      this.getShieldKey('shield-soul-lantern'),
      [
        '....OOOO....',
        '...OGGGGO...',
        '..OOOOOOOO..',
        '..OSCCCCSO..',
        '..OCWWWWCO..',
        '..OCWWWWCO..',
        '..OSCCCCSO..',
        '..OOOOOOOO..',
        '...OGGGGO...',
        '....OOOO....',
        '............',
        '............'
      ],
      weaponPalette
    );

    // 6. Khiên Cánh Phượng Hoàng
    createPixelTexture(
      scene,
      this.getShieldKey('shield-phoenix-wing'),
      [
        '..OOOOOOOO..',
        '.ORYYYYYYRO.',
        'ORYFFFFFFYRO',
        'ORYFGGGGFYRO',
        'ORYFGWWGFYRO',
        '.ORYFFFFYRO.',
        '..ORRFFRRO..',
        '...OORRRO...',
        '....OOOO....',
        '............',
        '............',
        '............'
      ],
      weaponPalette
    );

    // 7. [SÁNG THẾ] Khối Lập Phương Khởi Nguyên
    createPixelTexture(
      scene,
      this.getShieldKey('shield-creator-cube'),
      [
        '..OOOOOOOO..',
        '.OGCCCCCCGO.',
        'OGCWWWWWWCGO',
        'OGCWYYYYWCGO',
        'OGCWYEEYWCGO',
        'OGCWYYYYWCGO',
        'OGCWWWWWWCGO',
        '.OGCCCCCCGO.',
        '..OOOOOOOO..',
        '............',
        '............',
        '............'
      ],
      weaponPalette
    );
  }

  public static generateSharedSteps(scene: Phaser.Scene): Array<() => void> {
    const knightPalette: Record<string, number> = {
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
    };

    return [
      () => {
        this.ensureCharacterEquipmentTextures(scene);
        createPixelTexture(
          scene,
          TEXTURE_KEYS.PLAYER_IDLE,
          [
            '....OOOOOOOO....',
            '...OHLLLLLLHO...',
            '..OHLLHHHHLLHO..',
            '..OHVVVVVVVVHO..',
            '..OHVEEVVEEVHO..',
            '...OSSSSSSSSO...',
            '..OSSSSSSSSSSO..',
            '..ORBBBBBBBBRO..',
            '...OBBBGBBBBO...',
            '...OttO..OTTO...',
            '...OkkO..OKKO...',
            '...OffO..OFFO...',
            '...OzzO..OZZO...',
            '...OOOO..OOOO...',
            '................',
            '................'
          ],
          knightPalette
        );
      },
      () => {
        createPixelTexture(
          scene,
          TEXTURE_KEYS.PLAYER_WALK_1,
          [
            '....OOOOOOOO....',
            '...OHLLLLLLHO...',
            '..OHLLHHHHLLHO..',
            '..OHVVVVVVVVHO..',
            '..OHVEEVVEEVHO..',
            '..OOSSSSSSSSO...',
            '.ORSSSSSSSSSSO..',
            '.OR.OBBBBBBO....',
            '....OBBGBBBO....',
            '...OttO..OTTO...',
            '..OkkO....OKKO..',
            '..OffO....OFFO..',
            '.OzzO......OZZO.',
            '.OOOO......OOOO.',
            '................',
            '................'
          ],
          knightPalette
        );
        createPixelTexture(
          scene,
          TEXTURE_KEYS.PLAYER_WALK_2,
          [
            '................',
            '....OOOOOOOO....',
            '...OHLLLLLLHO...',
            '..OHLLHHHHLLHO..',
            '..OHVVVVVVVVHO..',
            '..OHVEEVVEEVHO..',
            '.OOSSSSSSSSSSO..',
            'ORRSSSSSSSSSO...',
            '....OBBBBBBO....',
            '....OBBGBBBO....',
            '...OttO.OTTO....',
            '...OkkO..OKKO...',
            '..OffO...OFFO...',
            '..OzzO...OZZO...',
            '..OOOO...OOOO...',
            '................'
          ],
          knightPalette
        );
        createPixelTexture(
          scene,
          TEXTURE_KEYS.PLAYER_WALK_3,
          [
            '....OOOOOOOO....',
            '...OHLLLLLLHO...',
            '..OHLLHHHHLLHO..',
            '..OHVVVVVVVVHO..',
            '..OHVEEVVEEVHO..',
            '..OOSSSSSSSSO...',
            '.ORSSSSSSSSSSO..',
            '..R.OBBBBBBO....',
            '....OBBGBBBO....',
            '....OTTOOttO....',
            '....OKKO.OkkO...',
            '....OFFO..OzzO..',
            '....OZZO..OOOO..',
            '....OOOO........',
            '................',
            '................'
          ],
          knightPalette
        );
      },
      () => {
        createPixelTexture(
          scene,
          TEXTURE_KEYS.PLAYER_WALK_4,
          [
            '....OOOOOOOO....',
            '...OHLLLLLLHO...',
            '..OHLLHHHHLLHO..',
            '..OHVVVVVVVVHO..',
            '..OHVEEVVEEVHO..',
            '..OOSSSSSSSSO...',
            '.ORSSSSSSSSSSO..',
            '.OR.OBBBBBBO....',
            '....OBBGBBBO....',
            '...OTTO..OttO...',
            '..OKKO....OkkO..',
            '..OFFO....OffO..',
            '.OZZO......OzzO.',
            '.OOOO......OOOO.',
            '................',
            '................'
          ],
          knightPalette
        );
        createPixelTexture(
          scene,
          TEXTURE_KEYS.PLAYER_WALK_5,
          [
            '................',
            '....OOOOOOOO....',
            '...OHLLLLLLHO...',
            '..OHLLHHHHLLHO..',
            '..OHVVVVVVVVHO..',
            '..OHVEEVVEEVHO..',
            '.OOSSSSSSSSSSO..',
            'ORRSSSSSSSSSO...',
            '....OBBBBBBO....',
            '....OBBGBBBO....',
            '...OTTO.OttO....',
            '...OKKO..OkkO...',
            '..OFFO...OffO...',
            '..OZZO...OzzO...',
            '..OOOO...OOOO...',
            '................'
          ],
          knightPalette
        );
        createPixelTexture(
          scene,
          TEXTURE_KEYS.PLAYER_WALK_6,
          [
            '....OOOOOOOO....',
            '...OHLLLLLLHO...',
            '..OHLLHHHHLLHO..',
            '..OHVVVVVVVVHO..',
            '..OHVEEVVEEVHO..',
            '...OSSSSSSSSO...',
            '..OOSSSSSSSSOO..',
            '.OR.OBBBBBBO....',
            '....OBBGBBBO....',
            '....OttOOTTO....',
            '....OkkO.OKKO...',
            '....OffO..OZZO..',
            '....OzzO..OOOO..',
            '....OOOO........',
            '................',
            '................'
          ],
          knightPalette
        );
      },
      () => {
        createPixelTexture(
          scene,
          TEXTURE_KEYS.PLAYER_CHARGE,
          [
            '................',
            '................',
            '................',
            '....OOOOOOOO....',
            '...OHLLLLLLHO...',
            '..OHLLHHHHLLHO..',
            '..OHVVVVVVVVHO..',
            '..OHVEEVVEEVHO..',
            '.OOSSSSSSSSSSOO.',
            '.ORBBBBGBBBBBRO.',
            '..OttttOOTTTTO..',
            '.OkkkO....OKKKO.',
            '.OfffO....OFFFO.',
            '.OzzzO....OZZZO.',
            '.OOOOO....OOOOO.',
            '................'
          ],
          knightPalette
        );
        createPixelTexture(
          scene,
          TEXTURE_KEYS.PLAYER_JUMP,
          [
            '....OOOOOOOO....',
            '...OHLLLLLLHO...',
            '..OHLLHHHHLLHO..',
            '..OHVVVVVVVVHO..',
            '..OHVEEVVEEVHO..',
            '...OSSSSSSSSO...',
            '..OOSSSSSSSSOO..',
            '.ORRSSBBBBSSRRO.',
            '.OR.OBBGBBBO.RO.',
            '....OttOOTTO....',
            '....OkkOOKKO....',
            '....OffOOFFO....',
            '....OzzOOZZO....',
            '....OOOOOOOO....',
            '................',
            '................'
          ],
          knightPalette
        );
        createPixelTexture(
          scene,
          TEXTURE_KEYS.PLAYER_FALL,
          [
            '.OO..........OO.',
            '.ORSOOOOOOOOSRO.',
            '..OSSHLLLLHSSO..',
            '..OHLLHHHHLLHO..',
            '..OHVVVVVVVVHO..',
            '..OHVEEVVEEVHO..',
            '...OBBBBBBBBO...',
            '..OBBBBGBBBBBO..',
            '..OttO....OTTO..',
            '.OkkO......OKKO.',
            '.OffO......OFFO.',
            '.OzzO......OZZO.',
            '.OOOO......OOOO.',
            '................',
            '................',
            '................'
          ],
          knightPalette
        );
        createPixelTexture(
          scene,
          TEXTURE_KEYS.PLAYER_SPLAT,
          [
            '................',
            '................',
            '................',
            '................',
            '................',
            '................',
            '................',
            '..OOOOOOOOOOOO..',
            '.OSSSSSSSSSSSSO.',
            'OHLLLLLLLLLLLLHO',
            'OHVVVEEVVEEVVVHO',
            'OBBBBBGBBBBBBBBO',
            'OKKKFFFFFFFFKKKO',
            'OZZZZZZZZZZZZZZO',
            '.OOOOOOOOOOOOOO.',
            '................'
          ],
          knightPalette
        );
      },
      () => {
        this.generateSimpleRectTexture(scene, TEXTURE_KEYS.TILE_SHADOW_3D, 16, 16, 0x03050a);
        createPixelTexture(
          scene,
          TEXTURE_KEYS.TILE_BG_SUPPORT,
          [
            'DDDDDDDDDDDDDDDD',
            'DLLLLLLLLLLLLLLD',
            'DLSSSSSSSSSSSSLD',
            'DLSSDDDDDDDDSSLD',
            'DLSSD......DSSLD',
            'DLSSD......DSSLD',
            'DLSSDDDDDDDDSSLD',
            'DLSSSSSSSSSSSSLD',
            'DDDDDDDDDDDDDDDD',
            'DLLLLLLLLLLLLLLD',
            'DLSSSSSSSSSSSSLD',
            'DLSSDDDDDDDDSSLD',
            'DLSSD......DSSLD',
            'DLSSD......DSSLD',
            'DLSSDDDDDDDDSSLD',
            'DDDDDDDDDDDDDDDD'
          ],
          { D: 0x0c1017, S: 0x18202c, L: 0x253042 }
        );

        createPixelTexture(
          scene,
          TEXTURE_KEYS.TILE_ICE,
          [
            'OOOOOOOOOOOOOOOO',
            'OWWWWWWWWWWWWWDO',
            'OWCCCCCCWWWWCCDO',
            'OWCCCCWWWWCCCCDO',
            'OWCCWWWWCCBBBBDO',
            'OWWWWWCCBBBBCCDO',
            'OWCCCCCCCCWWCCDO',
            'OWCCBBBBWWWWCCDO',
            'OWBBBBWWWWCCCCDO',
            'OWBBWWWWCCCCCCDO',
            'OWWWWWCCCCBBBBDO',
            'OWCCCCCCBBBBBBDO',
            'OWCCCCBBBBDDDDDO',
            'OWBBBBDDDDDDDDOO',
            'ODDDDDDDDDDDDOOO',
            'OOOOOOOOOOOOOOOO'
          ],
          { W: 0xffffff, C: 0x90e0ef, B: 0x00b4d8, D: 0x0077b6, O: 0x03045e }
        );

        createPixelTexture(
          scene,
          TEXTURE_KEYS.TILE_BOUNCY,
          [
            'OOOOOOOOOOOOOOOO',
            'OYYYYYYYYYYYYYDO',
            'OYPPPPWWWWPPPPDO',
            'OYPPWWWWWWWWPPDO',
            'OYPWWOOOOOOWWPDO',
            'OYPWOOGGGGGOOWDO',
            'OYPWOGWWWWWGOWDO',
            'OYPWOGWYYYWGoWDO',
            'OYPWOGWYYYWGoWDO',
            'OYPWOGWWWWWGOWDO',
            'OYPWOOGGGGGOOWDO',
            'OYPWWOOOOOOWWPDO',
            'OYPPWWWWWWWWPPDO',
            'OYPPPPPPPPPPPPDO',
            'ODDDDDDDDDDDDDDO',
            'OOOOOOOOOOOOOOOO'
          ],
          { O: 0x132a13, Y: 0xb7e4c7, P: 0x52b788, W: 0x80ed99, G: 0xffbe0b, o: 0xf77f00, D: 0x1b4332 }
        );

        createPixelTexture(
          scene,
          TEXTURE_KEYS.TILE_WIND_RIGHT,
          [
            '................',
            '........WWW.....',
            '..AAAAAWWWWW....',
            '........WWW.....',
            '................',
            '..........WWW...',
            '....BBBBBWWWWW..',
            '..........WWW...',
            '................',
            '.......WWW......',
            '.AAAAAWWWWW.....',
            '.......WWW......',
            '................',
            '................',
            '................',
            '................'
          ],
          { A: 0x90e0ef, B: 0x48cae4, W: 0xffffff }
        );

        createPixelTexture(
          scene,
          TEXTURE_KEYS.TILE_WIND_LEFT,
          [
            '................',
            '.....WWW........',
            '....WWWWWAAAAA..',
            '.....WWW........',
            '................',
            '...WWW..........',
            '..WWWWWBBBBBB...',
            '...WWW..........',
            '................',
            '......WWW.......',
            '.....WWWWWAAAAA.',
            '......WWW.......',
            '................',
            '................',
            '................',
            '................'
          ],
          { A: 0x90e0ef, B: 0x48cae4, W: 0xffffff }
        );
      },
      () => {
        const checkpointGrid = [
          '.....OOOO.......',
          '....OYYYYO......',
          '....OYWWYO......',
          '....OYYYYO......',
          '.....OOOO.......',
          '......OOFFFFFFFF',
          '......OOFFFFWWFF',
          '......OOFFFFFFFF',
          '......OOFFFFOO..',
          '......OO........',
          '......OO........',
          '......OO........',
          '....OOOOOO......',
          '...OBBBBBBO.....',
          '..OBBBBBBBBO....',
          '..OOOOOOOOOO....'
        ];
        createPixelTexture(scene, TEXTURE_KEYS.TILE_CHECKPOINT_INACTIVE, checkpointGrid, {
          O: 0x111827,
          Y: 0x64748b,
          W: 0x94a3b8,
          F: 0x475569,
          B: 0x334155
        });
        createPixelTexture(scene, TEXTURE_KEYS.TILE_CHECKPOINT_ACTIVE, checkpointGrid, {
          O: 0x111827,
          Y: 0xffbe0b,
          W: 0xffffff,
          F: 0x38b000,
          B: 0xf77f00
        });

        createPixelTexture(
          scene,
          TEXTURE_KEYS.TILE_SPAWN,
          [
            '......OOOO......',
            '.....OCCCCO.....',
            '....OCWWWWCO....',
            '....OCWWWWCO....',
            '.....OCCCCO.....',
            '......OOOO......',
            '................',
            '................',
            '................',
            '................',
            '....OOOOOOOO....',
            '...OPPPPPPPPO...',
            '..OPCCCCCCCCPO..',
            '.OBBBBBBBBBBBBO.',
            '.OOOOOOOOOOOOOO.',
            '................'
          ],
          { O: 0x0f172a, W: 0xffffff, P: 0x80ffdb, C: 0x00bbf9, B: 0x3a0ca3 }
        );

        createPixelTexture(
          scene,
          TEXTURE_KEYS.TILE_GOAL,
          [
            '..OO...OO...OO..',
            '.OYYO.OYYO.OYYO.',
            '.OYYOOOYYOOOYYO.',
            '.OYYYYWWWWYYYYO.',
            '.OYYWWCCCCWWYYO.',
            '..OYWCCCCCCWYO..',
            '..OYWWCCCCWWYO..',
            '...OYYYYYYYYO...',
            '....OOYYYYOO....',
            '.....OOYYOO.....',
            '....OOYYYYOO....',
            '...OYYYYYYYYO...',
            '..OBBBBBBBBBBO..',
            '.OBBWWWWWWWWBBO.',
            '.OOOOOOOOOOOOOO.',
            '................'
          ],
          { O: 0x1e1b4b, Y: 0xffbe0b, W: 0xffffff, C: 0x00f5d4, B: 0x7209b7 }
        );

        // Rương Kho Báu & Cổ Vật Easter Egg Huyền Thoại (TILE_EASTER_EGG)
        createPixelTexture(
          scene,
          TEXTURE_KEYS.TILE_EASTER_EGG,
          [
            '..W....WW....W..',
            '......WCCW......',
            '.OOOOOOOOOOOOOO.',
            'OYYYYYYYYYYYYYYO',
            'OYRRRRWWWWWRRRYO',
            'OYRRWWCCCCCWWRYO',
            'OYYYYWCCCCCWYYYO',
            'OOOOOOOOOOOOOOOO',
            'OYYYYYWWWWYYYYYO',
            'OYRRRRWMMMWWRRYO',
            'OYRRRRWWWWWRRRYO',
            'OYYYYYYYYYYYYYYO',
            'ODDDDDDDDDDDDDDO',
            '.OOOOOOOOOOOOOO.',
            '................',
            '................'
          ],
          {
            O: 0x11052c,
            W: 0xffffff,
            C: 0x00f5d4,
            Y: 0xffbe0b,
            R: 0xf72585,
            M: 0x7209b7,
            D: 0xd97706
          }
        );

        this.generateScenicProps(scene);

        // Bục nhảy 1 chiều mặc định (TILE_PLATFORM)
        createPixelTexture(
          scene,
          TEXTURE_KEYS.TILE_PLATFORM,
          [
            'OOOOOOOOOOOOOOOO',
            'OHHHHHHHHHHHHHHO',
            'OGGGGGGGGGGGGGGO',
            'OMMMMMMMMMMMMMMO',
            'OODDOOOOOOOODDOO',
            '.ODDO......ODDO.',
            '..OO........OO..',
            '................',
            '................',
            '................',
            '................',
            '................',
            '................',
            '................',
            '................',
            '................'
          ],
          { O: 0x0f172a, H: 0xfef08a, G: 0xf59e0b, M: 0xb45309, D: 0x78350f }
        );

        // Khối đá sụp đổ mặc định (TILE_CRUMBLE & TILE_CRUMBLE_CRACKED)
        createPixelTexture(
          scene,
          TEXTURE_KEYS.TILE_CRUMBLE,
          [
            'OOOOOOOOOOOOOOOO',
            'OHHHHHOLLLOHHHHO',
            'OLSSSOOSSSOLSSDO',
            'OSSSSOSSSSSOSSDO',
            'ODDDDOOOOOODDDDO',
            'OOOOOODSSDOOOOOO',
            'OLLLSOOSSSOLLLDO',
            'OLSSSOOOOOSSSSDO',
            'OSSSSDOOOODSSSDO',
            'ODDDDOOOOOODDDDO',
            'OOOOODSSSSDOOOOO',
            'OLLSOOSSSSOOLLDO',
            'OLSSODDDDDOOSSDO',
            'ODDDDOOOOOODDDDO',
            '.OOOO......OOOO.',
            '................'
          ],
          { O: 0x1c1917, H: 0xe7e5e4, L: 0xa8a29e, S: 0x78716c, D: 0x44403c }
        );

        createPixelTexture(
          scene,
          TEXTURE_KEYS.TILE_CRUMBLE_CRACKED,
          [
            'OOOO..OOOO..OOOO',
            'OHHHOO.LL.OOHHHO',
            'OLSSO.OSSO.OSSDO',
            'OSSSOO.WW.OOSSDO',
            'ODDDDOOWWOODDDDO',
            '.OOOO.DWWD.OOOO.',
            'OLLSOOWWWWOOLLDO',
            'OLSSO.OWWO.OSSDO',
            'OSSDOO.OO.OODSSO',
            'ODDDO.OSSO.ODDD.',
            '.OOO.OSSSSO.OOO.',
            'OLLSO.DDDD.OLLDO',
            '.ODDO......ODDO.',
            '..OO........OO..',
            '................',
            '................'
          ],
          { O: 0x1c1917, H: 0xfef08a, L: 0xfdba74, S: 0x78716c, D: 0x44403c, W: 0xef4444 }
        );

        this.generateSimpleRectTexture(scene, TEXTURE_KEYS.PARTICLE_DUST, 3, 3, 0xe2e8f0);
        this.generateSimpleRectTexture(scene, TEXTURE_KEYS.PARTICLE_SPARK, 3, 3, 0xffbe0b);
        this.generateSimpleRectTexture(scene, TEXTURE_KEYS.PARTICLE_ICE, 3, 3, 0x90e0ef);
        this.generateSimpleRectTexture(scene, TEXTURE_KEYS.PARTICLE_LEAF, 4, 2, 0x74c69d);
        this.generateSimpleRectTexture(scene, TEXTURE_KEYS.PARTICLE_SNOW, 2, 2, 0xffffff);
        this.generateSimpleRectTexture(scene, TEXTURE_KEYS.PARTICLE_WIND_STREAK, 10, 1, 0xc77dff);
        this.generateSimpleRectTexture(scene, TEXTURE_KEYS.PARTICLE_EMBER, 3, 3, 0xff5400);
        this.generateSimpleRectTexture(scene, TEXTURE_KEYS.PARTICLE_END_PORTAL, 3, 3, 0xe0aaff);
        this.generateSimpleRectTexture(scene, TEXTURE_KEYS.PARTICLE_BUBBLE, 3, 3, 0x48cae4);
        this.generateSimpleRectTexture(scene, TEXTURE_KEYS.PARTICLE_PETAL, 3, 2, 0xff8fab);
        this.generateSimpleRectTexture(scene, TEXTURE_KEYS.PARTICLE_DEBRIS, 3, 3, 0xa8a29e);
      }
    ];
  }

  private static generateScenicProps(scene: Phaser.Scene): void {
    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_TREE_OAK,
      [
        '....OOOOOOOO....',
        '..OOHHHHHHHHOO..',
        '.OOHHGGGGGGHHOO.',
        '.OHGGGGGGGGGGHO.',
        'OHGGRRGGGGGGGMMO',
        'OHGGRRGGGGGGMMMO',
        'OHGGGGGGGRRMMMMO',
        '.OOMMMMMMRRMMOO.',
        '..OOOMMMMMMOOO..',
        '.....OTTTTO.....',
        '.....OTTTTO.....',
        '.....OTDDTO.....',
        '.....OTDDTO.....',
        '....OOTDDTOO....',
        '...OOOTDDTOOO...',
        '................'
      ],
      { O: 0x0f171e, H: 0x9ef01a, G: 0x38b000, M: 0x1b4332, R: 0xff4d6d, T: 0x9c6644, D: 0x582f0e }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_TREE_CHERRY,
      [
        '....OOOOOOOO....',
        '..OOWWWWWWWWOO..',
        '.OOWWPPPPPPWWOO.',
        '.OWPPPPPPPPPPWO.',
        'OWPPWWPPPPPPDDDO',
        'OWPPPPPPPPWWDDDO',
        'OWPPPPPPPPDDDDDO',
        '.OODDDDDDDDDDOO.',
        '..OOODDDDDDOOO..',
        '.....OTTTTO.....',
        '.....OTTTTO.....',
        '.....OTBBTO.....',
        '.....OTBBTO.....',
        '....OOTBBTOO....',
        '...OOOTBBTOOO...',
        '................'
      ],
      { O: 0x2b0918, W: 0xffe5ec, P: 0xff8fab, D: 0xfb6f92, T: 0x6d3b47, B: 0x3d1e28 }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_SHROOM_GLOW,
      [
        '................',
        '.....OOOOOO.....',
        '...OCCCCCCCCO...',
        '..OCWWCCCCWWCO..',
        '.OCCCCCCCCCCCCO.',
        '.OMMMMMMMMMMMMO.',
        '..OOOOOTTOOOOO..',
        '......OTTO....OO',
        '.OOOO.OTTO..OCCC',
        'OCCCCOOTTO.OCWWC',
        'OCWWCOOTTO.OCCCC',
        'OOOOOOOTTO..OSSO',
        '..OSSOOTTO...OO.',
        '..OSSOOTTO..OSSO',
        '..OOOOOOOOOOOOOO',
        '................'
      ],
      { O: 0x081c24, C: 0x00f5d4, W: 0xffffff, M: 0x00bbf9, T: 0xe2e8f0, S: 0x94a3b8 }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_CRYSTAL_CLUSTER,
      [
        '.......OO.......',
        '......OWWO......',
        '......OCCO......',
        '..OO..OCCO..OO..',
        '.OWWO.OCCO.OWWO.',
        '.OCCO.OCCO.OCCO.',
        '.OCCOOOCCOOOCCO.',
        'OOCCCOCCCCOCCCOO',
        'OWCCCCDDDDCCCCWO',
        'OCCCCCDDDDCCCCCO',
        '.OCCDDDDDDDDCCO.',
        '.ODDDDDDDDDDDDO.',
        '..ODDDDDDDDDDO..',
        '...OOOOOOOOOO...',
        '................',
        '................'
      ],
      { O: 0x19002e, W: 0xffffff, C: 0xe0aaff, D: 0x7b2cbf }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_LANTERN,
      [
        '.......OO.......',
        '......OSSO......',
        '.......OO.......',
        '.....OOOOOO.....',
        '....OSSSSSSO....',
        '...OOOOOOOOOO...',
        '...OYYWWWWYYO...',
        '...OYWWWWWWYO...',
        '...OYWWGGWWYO...',
        '...OYWWWWWWYO...',
        '...OYYWWWWYYO...',
        '...OOOOOOOOOO...',
        '....OSSSSSSO....',
        '...OOOOOOOOOO...',
        '................',
        '................'
      ],
      { O: 0x1c1917, S: 0x78716c, Y: 0xf77f00, G: 0xffbe0b, W: 0xffffff }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_SOUL_BRAZIER,
      [
        '.......WW.......',
        '......WCCW......',
        '.....WCCCCW.....',
        '....WCCWWCCW....',
        '...WCCWWWWCCW...',
        '...BBBBBBBBBB...',
        '..OOOOOOOOOOOO..',
        '..OSSSSSSSSSSO..',
        '...ODDDDDDDDO...',
        '....ODDDDDDO....',
        '....OO....OO....',
        '...OO......OO...',
        '..OO........OO..',
        '................',
        '................',
        '................'
      ],
      { W: 0xffffff, C: 0x00f5d4, B: 0x00bbf9, O: 0x0f172a, S: 0x64748b, D: 0x334155 }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_CORAL_FAN,
      [
        '..OO....OO....OO',
        '.OWWO..OYYO..OWW',
        '.OPPO..OYYO..OPP',
        '..OPPOOOYYOOOPPO',
        '..OPPPPPYYPPPPO.',
        'OO.OPPPPYYPPPO..',
        'OYYOOPPPYYPPPOOO',
        '.OYYOPPPPPPPPOYY',
        '..OYOOPPPPPPOOYY',
        '...OYYOPPPPOYYO.',
        '....OYYOPPOYYO..',
        '.....OOOOOOOO...',
        '......OCCCCO....',
        '.....OCCCCCC....',
        '................',
        '................'
      ],
      { O: 0x1f0322, W: 0xffe5ec, P: 0xff4d6d, Y: 0xffbe0b, C: 0x00f5d4 }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_CHEST_GOLD,
      [
        '................',
        '................',
        '................',
        '..OOOOOOOOOOOO..',
        '.OGGGGGGGGGGGGO.',
        '.OGLLLLLLLLLLGO.',
        '.OGSSSSSSSSSSGO.',
        '.OOOOOOOOOOOOOO.',
        '.OGGGGGYYYYGGGO.',
        '.OGSSSSYWWYSSGO.',
        '.OGSSSSYYYYSSGO.',
        '.OGDDDDDDDDDDGO.',
        '.OGDDDDDDDDDDGO.',
        '.OOOOOOOOOOOOOO.',
        '................',
        '................'
      ],
      { O: 0x1c1008, G: 0xffbe0b, Y: 0xfff3b0, W: 0xffffff, L: 0xd97706, S: 0x9a3412, D: 0x581c0c }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_END_ROD,
      [
        '.....OOOOOO.....',
        '....OPWWWWPO....',
        '....OPWWWWPO....',
        '.....OOOOOO.....',
        '......OWWO......',
        '......OWWO......',
        '......OWWO......',
        '......OWWO......',
        '......OWWO......',
        '......OWWO......',
        '......OWWO......',
        '.....OOOOOO.....',
        '....OPPPPPPO....',
        '...OPDDDDDDPO...',
        '...OOOOOOOOOO...',
        '................'
      ],
      { O: 0x240046, W: 0xffffff, P: 0xe0aaff, D: 0x7b2cbf }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_VINE_GLOW,
      [
        '..OO........OO..',
        '..OGOO....OOGO..',
        '...OGGO..OGGO...',
        '...OYYO..OGGO...',
        '...OWWO...OGO...',
        '....OO....OYYO..',
        '....OGO...OWWO..',
        '....OGGO...OO...',
        '.....OGO...OGO..',
        '....OYYO...OGO..',
        '....OWWO....OO..',
        '.....OO.........',
        '.....OGO........',
        '......OO........',
        '................',
        '................'
      ],
      { O: 0x0b1f17, G: 0x52b788, Y: 0xff9f1c, W: 0xffffff }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_STALACTITE,
      [
        'OOOOOOOOOOOOOOOO',
        'ODDDDDDDDDDDDDDO',
        '.ODDLLLLLLLLDDO.',
        '.ODDLLSSSSLLDDO.',
        '..ODDLSSSSLDDO..',
        '..ODDLSSSSLDDO..',
        '...ODDLLLLDDO...',
        '...ODDLLLLDDO...',
        '....ODDSSDDO....',
        '....ODDSSDDO....',
        '.....ODDDDO.....',
        '.....ODWWDO.....',
        '......OWWO......',
        '......OOOO......',
        '.......OO.......',
        '................'
      ],
      { O: 0x0f172a, D: 0x334155, S: 0x64748b, L: 0x94a3b8, W: 0xe2e8f0 }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_TORCH,
      [
        '.......OO.......',
        '......OWWO......',
        '.....OWYYWO.....',
        '....OWYYYYWO....',
        '....OYYFFYYO....',
        '.....OFFFFO.....',
        '.....OOOOOO.....',
        '......OTTO......',
        '......OTTO......',
        '......OTTO......',
        '......OTTO......',
        '......ODDO......',
        '......ODDO......',
        '.....OODDOO.....',
        '.....OOOOOO.....',
        '................'
      ],
      { O: 0x1c1917, W: 0xffffff, Y: 0xfef08a, F: 0xf97316, T: 0x92400e, D: 0x451a03 }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_RUIN_PILLAR,
      [
        '..OOOOOOOOOOOO..',
        '.OHHHHHHHHHHHHO.',
        '.OLLLLLLLLLLLLDO',
        '..OOOOOOOOOOOO..',
        '...OLLSSSSLLDO..',
        '...OLLSSSSLLDO..',
        '...OLLSDDSLLDO..',
        '...OLLSDDSLLDO..',
        '...OLLSDDSLLDO..',
        '...OLLSDDSLLDO..',
        '...OLLSSSSLLDO..',
        '..OOOOOOOOOOOO..',
        '.OLLLLSSSSLLLLDO',
        '.ODDDDDDDDDDDDDO',
        '.OOOOOOOOOOOOOO.',
        '................'
      ],
      { O: 0x1e293b, H: 0xf8fafc, L: 0xcbd5e1, S: 0x94a3b8, D: 0x475569 }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_TECH_LIGHT,
      [
        '.....OOOOOO.....',
        '....OCCCCCCo....',
        '...OCWWWWWWCO...',
        '...OCWWWWWWCO...',
        '...OCCCCCCCCO...',
        '....OOOOOOOO....',
        '.....OSSSSO.....',
        '.....OSRRSO.....',
        '.....OSSSSO.....',
        '.....OSRRSO.....',
        '.....OSSSSO.....',
        '....OOSSSSOO....',
        '...OODDDDDDOO...',
        '...OOOOOOOOOO...',
        '................',
        '................'
      ],
      { O: 0x090d16, C: 0x06b6d4, o: 0x0891b2, W: 0xe0f2fe, S: 0x475569, R: 0xef4444, D: 0x1e293b }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_SAND_URN,
      [
        '.....OOOOOO.....',
        '....OYYYYYYO....',
        '....OOOOOOOO....',
        '.....OSSSSO.....',
        '...OOOSGGSOOO...',
        '..OYYYYGGYYYYO..',
        '.OYSSSSSSSSSSYO.',
        '.OYSCCCCCCCCSYO.',
        '.OYSSSSSSSSSSYO.',
        '..OYDDDDDDDDYO..',
        '...OODDDDDDOO...',
        '....OODDDDOO....',
        '....OYYYYYYO....',
        '...OOOOOOOOOO...',
        '................',
        '................'
      ],
      { O: 0x261707, Y: 0xfacc15, S: 0xd97706, G: 0xfef08a, C: 0x06b6d4, D: 0x92400e }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_SPIRIT_FLOWER,
      [
        '......OOOO......',
        '....OOWWWWOO....',
        '...OWWCCCCWWO...',
        '..OWWCCCCCCWWO..',
        '..OWCCYYYYCCWO..',
        '...OWWCCCCWWO...',
        '....OOWWWWOO....',
        '......OGGO......',
        '....OOOGGOOO....',
        '...OGGGGGGGGO...',
        '....OOOGGOOO....',
        '......OGGO......',
        '......ODDO......',
        '.....OODDOO.....',
        '.....OOOOOO.....',
        '................'
      ],
      { O: 0x061224, W: 0xffffff, C: 0x38bdf8, Y: 0xfef08a, G: 0x2dd4bf, D: 0x0f766e }
    );

    // 4 Vật thể Sân Khấu Liveshow / Concert (The Weeknd & Marsbunn / Marshmello)
    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_STAGE_SPEAKER,
      [
        '..OOOOOOOOOOOO..',
        '.OLLLLLLLLLLLLDO',
        '.OLCCCCCCCCCCLDO',
        '.OLCWWWWWWWWCLDO',
        '.OLCWOOOOOOWCLDO',
        '.OLCWOYYYYOWCLDO',
        '.OLCWOOOOOOWCLDO',
        '.OLCCCCCCCCCCLDO',
        '.OLLLLLLLLLLLLDO',
        '.OLCCCCCCCCCCLDO',
        '.OLCWOYYYYOWCLDO',
        '.OLCWOOOOOOWCLDO',
        '.OLCCCCCCCCCCLDO',
        '.ODDDDDDDDDDDDDO',
        '.OOOOOOOOOOOOOO.',
        '................'
      ],
      { O: 0x05060d, L: 0x334155, D: 0x1e293b, C: 0x06b6d4, W: 0xe0f2fe, Y: 0xf43f5e }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_LASER_BEAM,
      [
        '......WWWW......',
        '.....WCCCCW.....',
        '.....WCCCCW.....',
        '....PWWWWWWP....',
        '....PCCCCCCP....',
        '...PPWWWWWWPP...',
        '...PPCCCCCCPP...',
        '....OOOOOOOO....',
        '...OLLLLLLLLDO..',
        '...OLYYYYYYLDO..',
        '....ODDDDDDDO...',
        '.....OSSSSSO....',
        '....OODDDDDOO...',
        '...OOOOOOOOOOO..',
        '................',
        '................'
      ],
      { O: 0x090d16, W: 0xffffff, C: 0x22d3ee, P: 0xf472b6, L: 0x475569, Y: 0xfacc15, D: 0x1e293b, S: 0x334155 }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_MELLO_HELMET,
      [
        '...OOOOOOOOOO...',
        '..OWWWWWWWWWWO..',
        '.OWWWWWWWWWWWWO.',
        '.OWWOOOWWOOOWWO.',
        '.OWOOOWWWOOOWWO.',
        '.OWWOOOWWOOOWWO.',
        '.OWWWWWWWWWWWWO.',
        '.OWWOOWWWWOOwWO.',
        '.OWWWOOOOOOWWWO.',
        '..OWWWWWWWWWWO..',
        '...OOOOOOOOOO...',
        '....OCCCCCCo....',
        '...OCCCCCCCCO...',
        '..OODDDDDDDDOO..',
        '..OOOOOOOOOOOO..',
        '................'
      ],
      { O: 0x090d16, W: 0xffffff, w: 0xe2e8f0, C: 0x22d3ee, o: 0xf472b6, D: 0x334155 }
    );

    createPixelTexture(
      scene,
      TEXTURE_KEYS.PROP_MIC_STAND,
      [
        '......OOOO......',
        '.....OYYYYO.....',
        '.....OWWWWO.....',
        '.....OYYYYO.....',
        '......ORRO......',
        '......OOOO......',
        '.......OO.......',
        '.......YY.......',
        '.......YY.......',
        '.......YY.......',
        '.......YY.......',
        '.......YY.......',
        '......OYYO......',
        '....OYYYYYYO....',
        '...OOOOOOOOOO...',
        '................'
      ],
      { O: 0x090d16, Y: 0xfacc15, W: 0xffffff, R: 0xef4444 }
    );
  }

  public static ensureWorldTextures(scene: Phaser.Scene, theme: WorldTheme): void {
    const cfg = THEME_CONFIGS[theme] ?? THEME_CONFIGS.forest;

    const isConcertStage =
      theme.startsWith('wk-') ||
      theme.startsWith('mb-') ||
      theme.startsWith('sw-') ||
      theme.startsWith('ed-') ||
      theme.startsWith('rk-');
    const isTech =
      isConcertStage ||
      theme.startsWith('mt-') ||
      theme.startsWith('sn-chemical') ||
      theme.startsWith('sn-casino') ||
      theme === 'mc-redstone';
    const isTempleOrDesert =
      theme.startsWith('tb-') ||
      theme.startsWith('sp-temple') ||
      theme.startsWith('er-') ||
      theme.startsWith('hk-palace') ||
      theme === 'zd-skyisle';
    const isCrystalOrIce =
      theme === 'ice' ||
      theme.startsWith('cl-') ||
      theme.startsWith('sb-jelly') ||
      theme.startsWith('or-') ||
      theme === 'hk-crystal' ||
      theme === 'sp-icecaves' ||
      theme === 'sp-cosmic';

    const surfaceGrid = isTech
      ? [
          'OOOOOOOOOOOOOOOO',
          'OHHHHHHHHHHHHHHO',
          'OGGGGGGGGGGGGGGO',
          'OMOOOMMMMMMOOOMO',
          'OOOOOOOOOOOOOOOO',
          'OLLLLLLLLLLLLLDO',
          'OLSSSOOOOOOSSSDO',
          'OLSSOHHHHHHOSSDO',
          'OLSSOHGGGGHOSSDO',
          'OLSSOOOOOOOSSSDO',
          'OLLLLLLLLLLLLLDO',
          'ODDDDDDDDDDDDDDO',
          'OMOOOMMMMMMOOOMO',
          'ODDDDDDDDDDDDDDO',
          'OOOOOOOOOOOOOOOD',
          'OOOOOOOOOOOOOOOO'
        ]
      : isTempleOrDesert
        ? [
            'OOOOOOOOOOOOOOOO',
            'OHHHHHHHHHHHHHGO',
            'OGGGGGGGGGGGGGMO',
            'OMMMMMGGGGMMMMMO',
            'OOOOOOOOOOOOOOOO',
            'OLLLLLLLOLLLLLDO',
            'OLSSSSSSOLSSSSDO',
            'OLSSDDSSOLSSDDDO',
            'ODDDDDDDODDDDDDO',
            'OOOOOOOOOOOOOOOO',
            'OLLLLOLLLLLLLLDO',
            'OLSSSOLSSSSSSSDO',
            'OLSSDOLSSDDDDDDO',
            'ODDDDODDDDDDDDDO',
            'OOOOOOOOOOOOOOOD',
            'OOOOOOOOOOOOOOOO'
          ]
        : isCrystalOrIce
          ? [
              'OOOOOOOOOOOOOOOO',
              'OHHHHHHHHHHHHHHO',
              'OHGGGGGGGGGGGGHO',
              'OGGHHHHHHHHHHGGO',
              'OMMGGGGGGGGGGMMO',
              'OLLLLLSOOOLLLLDO',
              'OLHLLSDSSOLLHLDO',
              'OSSHSSDSSSSSHSSO',
              'ODDDDDDDDDSSOSSO',
              'OOOOOOOOOOODDDDO',
              'OLLHSSSSOOLLLLDO',
              'OLSHSSSDOOSSHLDO',
              'OSSSSSSDOOSSSSDO',
              'ODDDDDDDOODDDDDO',
              'OOOOOOOOOOOOOOOD',
              'OOOOOOOOOOOOOOOO'
            ]
          : [
              'OOOOOOOOOOOOOOOO',
              'OHHHHHHHHHHHHHGO',
              'OHGGGGGGGGGGGGMO',
              'OGGGGMMGGGGMMGMO',
              'OMMMOOOOOOOMMMOO',
              'OLLLLLSOOOLLLLDO',
              'OLSSSSDSSOLLSSDO',
              'OSSSSSDSSSSSSSSO',
              'ODDDDDDDDDSSOSSO',
              'OOOOOOOOOOODDDDO',
              'OLLSSSSSOOLLLLDO',
              'OLSSSSSDOOSSSSDO',
              'OSSSSSSDOOSSSSDO',
              'ODDDDDDDOODDDDDO',
              'OOOOOOOOOOOOOOOD',
              'OOOOOOOOOOOOOOOO'
            ];
    createPixelTexture(scene, this.getSolidSurfaceKey(theme), surfaceGrid, cfg.surface);

    // Bục nhảy 1 chiều theo chủ đề (Platform 1-way bridge)
    const platformGrid = [
      'OOOOOOOOOOOOOOOO',
      'OHHHHHHHHHHHHHHO',
      'OGGGGGGGGGGGGGGO',
      'OMMMMMMMMMMMMMMO',
      'OODDOOOOOOOODDOO',
      '.ODDO......ODDO.',
      '..OO........OO..',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................',
      '................'
    ];
    createPixelTexture(scene, this.getPlatformKey(theme), platformGrid, cfg.surface);

    // Khối đá sụp đổ theo chủ đề (Crumble block & Cracked state)
    const crumbleGrid = [
      'OOOOOOOOOOOOOOOO',
      'OHHHHHOLLLOHHHHO',
      'OLSSSOOSSSOLSSDO',
      'OSSSSOSSSSSOSSDO',
      'ODDDDOOOOOODDDDO',
      'OOOOOODSSDOOOOOO',
      'OLLLSOOSSSOLLLDO',
      'OLSSSOOOOOSSSSDO',
      'OSSSSDOOOODSSSDO',
      'ODDDDOOOOOODDDDO',
      'OOOOODSSSSDOOOOO',
      'OLLSOOSSSSOOLLDO',
      'OLSSODDDDDOOSSDO',
      'ODDDDOOOOOODDDDO',
      '.OOOO......OOOO.',
      '................'
    ];
    createPixelTexture(scene, this.getCrumbleKey(theme), crumbleGrid, cfg.surface);

    const crumbleCrackedGrid = [
      'OOOO..OOOO..OOOO',
      'OHHHOO.LL.OOHHHO',
      'OLSSO.OSSO.OSSDO',
      'OSSSOO.HH.OOSSDO',
      'ODDDDOOHHOODDDDO',
      '.OOOO.DHHD.OOOO.',
      'OLLSOOHHHHOOLLDO',
      'OLSSO.OHHO.OSSDO',
      'OSSDOO.OO.OODSSO',
      'ODDDO.OSSO.ODDD.',
      '.OOO.OSSSSO.OOO.',
      'OLLSO.DDDD.OLLDO',
      '.ODDO......ODDO.',
      '..OO........OO..',
      '................',
      '................'
    ];
    createPixelTexture(scene, this.getCrumbleCrackedKey(theme), crumbleCrackedGrid, cfg.surface);

    const deepGrid = [
      'OOOOOOOOOOOOOOOO',
      'OLLLLLLSOOLLLLDO',
      'OLSSSSSDOOSSSSDO',
      'OSSSSSAASOOSSSDO',
      'ODDDDDDDDDDDDDDO',
      'OOOOOOOODOOOOOOO',
      'OLLLLSOOOOLLLLDO',
      'OLSSSDSSSOLSSSDO',
      'OSSSSDAASSSSSSDO',
      'ODDDDDDDDDDDDDDO',
      'OOOOOOOOOOODDOOO',
      'OLLLLLLSOOLLLLDO',
      'OLSSSSSDOOSSSSDO',
      'OSSSSSSDOOSSSSDO',
      'ODDDDDDDOODDDDDO',
      'OOOOOOOOOOOOOOOO'
    ];
    createPixelTexture(scene, this.getSolidDeepKey(theme), deepGrid, cfg.deep);

    const oreGrid = [
      'OOOOOOOOOOOOOOOO',
      'OLLLLLLSOOLLLLDO',
      'OLSGWWSDOOSSSSDO',
      'OSSGGWSDOOGWWSDO',
      'ODDDDDDDDDGGGSSO',
      'OOOOOOOODOOOOOOO',
      'OLLLLSOOOOLLLLDO',
      'OLSSSDSSSOLGWwDO',
      'OSSGWWSASSOGGGDO',
      'ODGGGGDDDDDDDDDO',
      'OOOOOOOOOOODDOOO',
      'OLLLLLLSOOLLLLDO',
      'OLSGWWSDOOSSSSDO',
      'OSSGGGSSOOSSSSDO',
      'ODDDDDDDOODDDDDO',
      'OOOOOOOOOOOOOOOO'
    ];
    createPixelTexture(scene, this.getSolidOreKey(theme), oreGrid, {
      ...cfg.ore,
      w: cfg.ore.W,
      A: cfg.ore.G
    });

    const spikeGrid = [
      '................',
      '................',
      '................',
      '...OO......OO...',
      '..OWWO....OWWO..',
      '..OSSO....OSSO..',
      '.OWSSWO..OWSSWO.',
      '.OSSSSO..OSSSSO.',
      '.OSSDSO..OSSDSO.',
      'OWSSDSWOOWSSDSWO',
      'OSSSSDSOOSSSSDSO',
      'OSSDDDSOOSSDDDSO',
      'ODDDDDDOODDDDDDO',
      'ODDDDDDDDDDDDDDO',
      'OOOOOOOOOOOOOOOO',
      'OOOOOOOOOOOOOOOO'
    ];
    createPixelTexture(scene, this.getHazardKey(theme), spikeGrid, cfg.hazard);

    this.createSkyLayer(
      scene,
      this.getSkyKey(theme),
      cfg.skyBands,
      cfg.celestialColor,
      cfg.cloudColor
    );
    this.createMountainLayer(
      scene,
      this.getMidKey(theme),
      cfg.midDark,
      cfg.midLight,
      cfg.midAccent
    );
    this.createNearLayer(
      scene,
      this.getNearKey(theme),
      cfg.nearDark,
      cfg.nearLight,
      cfg.nearGlow,
      cfg.nearStyle
    );

    if (!this.loadedThemes.has(theme)) {
      this.loadedThemes.add(theme);
      console.info(
        `%c[LazyLoad] Đã khởi tạo bộ khối 3D (Surface/Deep/Ore) & Parallax đa sắc cho chủ đề "${theme}".`,
        'color: #5ce1e6; font-weight: bold;'
      );
    }
  }

  private static generateSimpleRectTexture(
    scene: Phaser.Scene,
    key: string,
    w: number,
    h: number,
    color: number
  ): void {
    if (scene.textures.exists(key)) return;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    g.fillStyle(color, 1);
    g.fillRect(0, 0, w, h);
    g.generateTexture(key, w, h);
    g.destroy();
  }

  private static createSkyLayer(
    scene: Phaser.Scene,
    key: string,
    bands: [number, number, number, number],
    celestialColor: number,
    cloudColor: number
  ): void {
    if (scene.textures.exists(key)) return;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);
    const h = DISPLAY.HEIGHT / 4;
    for (let i = 0; i < 4; i++) {
      g.fillStyle(bands[i] ?? 0x0d0f18, 1);
      g.fillRect(0, i * h, DISPLAY.WIDTH, h);
      if (i > 0) {
        g.fillStyle(bands[i - 1] ?? 0x0d0f18, 0.45);
        g.fillRect(0, i * h, DISPLAY.WIDTH, 12);
      }
    }

    g.fillStyle(celestialColor, 0.16);
    g.fillRect(368, 28, 56, 56);
    g.fillStyle(celestialColor, 0.35);
    g.fillRect(376, 36, 40, 40);
    g.fillStyle(celestialColor, 0.95);
    g.fillRect(382, 42, 28, 28);
    g.fillStyle(0xffffff, 0.85);
    g.fillRect(386, 46, 12, 12);

    g.fillStyle(celestialColor, 0.8);
    for (let i = 0; i < 34; i++) {
      const sx = (i * 73 + 19) % DISPLAY.WIDTH;
      const sy = (i * 41 + 11) % (DISPLAY.HEIGHT - 90);
      const size = i % 4 === 0 ? 3 : i % 2 === 0 ? 2 : 1;
      g.fillRect(sx, sy, size, size);
    }

    for (let i = 0; i < 5; i++) {
      const cx = (i * 112 + 24) % (DISPLAY.WIDTH - 64);
      const cy = 48 + ((i * 53) % 130);
      const cw = 48 + (i % 3) * 20;
      g.fillStyle(cloudColor, 0.28);
      g.fillRect(cx, cy, cw, 12);
      g.fillStyle(0xffffff, 0.22);
      g.fillRect(cx + 6, cy - 6, cw - 14, 8);
      g.fillStyle(bands[0] ?? 0x000000, 0.25);
      g.fillRect(cx + 2, cy + 9, cw - 2, 4);
    }

    g.generateTexture(key, DISPLAY.WIDTH, DISPLAY.HEIGHT);
    g.destroy();
  }

  private static createMountainLayer(
    scene: Phaser.Scene,
    key: string,
    darkColor: number,
    lightColor: number,
    accentColor: number
  ): void {
    if (scene.textures.exists(key)) return;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);

    for (let x = 0; x < DISPLAY.WIDTH; x += 40) {
      const peakH = 130 + ((x * 37 + 17) % 115);
      const topY = DISPLAY.HEIGHT - peakH;

      g.fillStyle(lightColor, 0.72);
      g.fillRect(x, topY, 24, peakH);
      g.fillStyle(darkColor, 0.85);
      g.fillRect(x + 20, topY + 10, 28, peakH - 10);

      g.fillStyle(lightColor, 0.8);
      g.fillRect(x + 6, topY - 12, 20, 12);

      g.fillStyle(accentColor, 0.65);
      g.fillRect(x + 8, topY - 12, 14, 4);
      if (x % 80 === 0) {
        g.fillStyle(accentColor, 0.85);
        g.fillRect(x + 14, topY + 28, 4, 8);
        g.fillRect(x + 24, topY + 28, 4, 8);
      }
    }

    g.generateTexture(key, DISPLAY.WIDTH, DISPLAY.HEIGHT);
    g.destroy();
  }

  private static createNearLayer(
    scene: Phaser.Scene,
    key: string,
    darkColor: number,
    lightColor: number,
    glowColor: number,
    style: 'pine' | 'crystal' | 'tower' | 'coral' | 'nether' | 'cherry'
  ): void {
    if (scene.textures.exists(key)) return;
    const g = scene.make.graphics({ x: 0, y: 0 }, false);

    for (let x = 8; x < DISPLAY.WIDTH; x += 48) {
      const h = 80 + ((x * 23) % 85);
      const topY = DISPLAY.HEIGHT - h;

      if (style === 'pine' || style === 'cherry') {
        g.fillStyle(darkColor, 0.9);
        g.fillRect(x + 12, topY + 18, 8, h - 18);
        g.fillStyle(darkColor, 0.88);
        g.fillRect(x, topY + 26, 32, 22);
        g.fillRect(x + 4, topY + 10, 24, 18);
        g.fillStyle(lightColor, 0.82);
        g.fillRect(x + 2, topY + 24, 16, 16);
        g.fillRect(x + 6, topY + 8, 14, 14);
        g.fillRect(x + 10, topY, 12, 10);
        g.fillStyle(glowColor, 0.85);
        g.fillRect(x + 8, topY + 14, 3, 3);
        g.fillRect(x + 20, topY + 30, 3, 3);
      } else if (style === 'crystal' || style === 'nether') {
        g.fillStyle(lightColor, 0.78);
        g.fillRect(x + 4, topY, 12, h);
        g.fillStyle(darkColor, 0.88);
        g.fillRect(x + 14, topY + 8, 12, h - 8);
        const ceilH = 40 + ((x * 19) % 55);
        g.fillStyle(darkColor, 0.8);
        g.fillRect(x + 8, 0, 14, ceilH);
        g.fillStyle(glowColor, 0.75);
        g.fillRect(x + 12, ceilH - 6, 4, 6);
        g.fillRect(x + 8, topY + 12, 4, 14);
      } else if (style === 'coral') {
        g.fillStyle(lightColor, 0.78);
        g.fillRect(x + 6, topY + 10, 20, h - 10);
        g.fillStyle(darkColor, 0.85);
        g.fillRect(x + 16, topY + 16, 12, h - 16);
        g.fillStyle(glowColor, 0.85);
        g.fillRect(x + 4, topY + 4, 8, 8);
        g.fillRect(x + 18, topY + 12, 8, 8);
      } else {
        g.fillStyle(lightColor, 0.78);
        g.fillRect(x + 2, topY, 18, h);
        g.fillStyle(darkColor, 0.9);
        g.fillRect(x + 18, topY, 16, h);
        g.fillRect(x - 2, topY - 6, 10, 8);
        g.fillRect(x + 12, topY - 6, 10, 8);
        g.fillRect(x + 26, topY - 6, 10, 8);
        g.fillStyle(glowColor, 0.9);
        g.fillRect(x + 10, topY + 16, 6, 12);
        g.fillRect(x + 10, topY + 44, 6, 12);
      }
    }

    g.generateTexture(key, DISPLAY.WIDTH, DISPLAY.HEIGHT);
    g.destroy();
  }
}
