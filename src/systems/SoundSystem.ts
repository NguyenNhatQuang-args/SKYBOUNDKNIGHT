import { WorldTheme } from '../data/levelTypes';
import { globalSettings } from '../services/SettingsService';

type AcousticProfile =
  | 'woodland'
  | 'crystal'
  | 'arcade'
  | 'cavern'
  | 'infernal'
  | 'cosmic'
  | 'desert'
  | 'aquatic'
  | 'tech'
  | 'mystic';

interface ThemeAudioSpec {
  profile: AcousticProfile;
  tempoMs: number;
  leadWave: OscillatorType;
  bassWave: OscillatorType;
  hasPercussion: boolean;
  melody: number[];
  bass: number[];
}

const THEME_AUDIO_SPECS: Record<WorldTheme, ThemeAudioSpec> = {
  forest: {
    profile: 'woodland',
    tempoMs: 360,
    leadWave: 'triangle',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [261.63, 329.63, 392.0, 523.25, 493.88, 392.0, 329.63, 293.66],
    bass: [130.81, 130.81, 164.81, 196.0]
  },
  ice: {
    profile: 'crystal',
    tempoMs: 380,
    leadWave: 'sine',
    bassWave: 'triangle',
    hasPercussion: false,
    melody: [523.25, 659.25, 783.99, 1046.5, 987.77, 783.99, 659.25, 587.33],
    bass: [261.63, 196.0, 220.0, 174.61]
  },
  wind: {
    profile: 'cosmic',
    tempoMs: 280,
    leadWave: 'triangle',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [293.66, 369.99, 440.0, 587.33, 659.25, 587.33, 440.0, 369.99],
    bass: [146.83, 185.0, 220.0, 164.81]
  },
  'mc-overworld': {
    profile: 'woodland',
    tempoMs: 400,
    leadWave: 'sine',
    bassWave: 'triangle',
    hasPercussion: false,
    melody: [261.63, 329.63, 392.0, 493.88, 523.25, 493.88, 392.0, 329.63],
    bass: [130.81, 164.81, 146.83, 196.0]
  },
  'mc-lush': {
    profile: 'woodland',
    tempoMs: 340,
    leadWave: 'sine',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [293.66, 369.99, 440.0, 554.37, 587.33, 554.37, 440.0, 369.99],
    bass: [146.83, 185.0, 220.0, 146.83]
  },
  'mc-deepdark': {
    profile: 'cavern',
    tempoMs: 460,
    leadWave: 'triangle',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [130.81, 155.56, 196.0, 207.65, 196.0, 155.56, 130.81, 116.54],
    bass: [65.41, 77.78, 65.41, 58.27]
  },
  'mc-frozen': {
    profile: 'crystal',
    tempoMs: 350,
    leadWave: 'sine',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [392.0, 493.88, 587.33, 783.99, 659.25, 587.33, 493.88, 392.0],
    bass: [196.0, 246.94, 164.81, 146.83]
  },
  'mc-ocean': {
    profile: 'cavern',
    tempoMs: 390,
    leadWave: 'sine',
    bassWave: 'triangle',
    hasPercussion: false,
    melody: [220.0, 277.18, 329.63, 415.3, 440.0, 415.3, 329.63, 277.18],
    bass: [110.0, 138.59, 164.81, 110.0]
  },
  'mc-cherry': {
    profile: 'crystal',
    tempoMs: 330,
    leadWave: 'sine',
    bassWave: 'triangle',
    hasPercussion: false,
    melody: [329.63, 392.0, 440.0, 587.33, 659.25, 587.33, 440.0, 392.0],
    bass: [164.81, 196.0, 220.0, 146.83]
  },
  'mc-redstone': {
    profile: 'cavern',
    tempoMs: 260,
    leadWave: 'square',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [196.0, 233.08, 261.63, 293.66, 349.23, 293.66, 261.63, 233.08],
    bass: [98.0, 116.54, 130.81, 98.0]
  },
  'mc-nether': {
    profile: 'infernal',
    tempoMs: 310,
    leadWave: 'sawtooth',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [146.83, 174.61, 220.0, 233.08, 277.18, 233.08, 220.0, 174.61],
    bass: [73.42, 87.31, 110.0, 73.42]
  },
  'mc-soul': {
    profile: 'infernal',
    tempoMs: 420,
    leadWave: 'triangle',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [164.81, 196.0, 246.94, 261.63, 246.94, 196.0, 164.81, 146.83],
    bass: [82.41, 98.0, 123.47, 73.42]
  },
  'mc-bastion': {
    profile: 'infernal',
    tempoMs: 240,
    leadWave: 'square',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [164.81, 196.0, 246.94, 293.66, 329.63, 293.66, 246.94, 196.0],
    bass: [82.41, 98.0, 110.0, 82.41]
  },
  'mc-end': {
    profile: 'cosmic',
    tempoMs: 380,
    leadWave: 'sawtooth',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [185.0, 246.94, 277.18, 369.99, 415.3, 369.99, 277.18, 246.94],
    bass: [92.5, 123.47, 138.59, 92.5]
  },
  'mc-endcity': {
    profile: 'cosmic',
    tempoMs: 300,
    leadWave: 'triangle',
    bassWave: 'sine',
    hasPercussion: true,
    melody: [246.94, 293.66, 369.99, 493.88, 587.33, 493.88, 369.99, 293.66],
    bass: [123.47, 146.83, 185.0, 123.47]
  },

  // ==================== TERRARIA ====================
  'tr-purity': {
    profile: 'woodland',
    tempoMs: 250,
    leadWave: 'square',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [329.63, 392.0, 440.0, 523.25, 587.33, 523.25, 440.0, 392.0],
    bass: [164.81, 196.0, 220.0, 130.81]
  },
  'tr-corruption': {
    profile: 'cavern',
    tempoMs: 240,
    leadWave: 'sawtooth',
    bassWave: 'square',
    hasPercussion: true,
    melody: [155.56, 185.0, 207.65, 233.08, 277.18, 233.08, 207.65, 185.0],
    bass: [77.78, 92.5, 103.83, 77.78]
  },
  'tr-hallow': {
    profile: 'crystal',
    tempoMs: 230,
    leadWave: 'sine',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [523.25, 659.25, 783.99, 987.77, 1046.5, 987.77, 783.99, 659.25],
    bass: [261.63, 329.63, 392.0, 261.63]
  },
  'tr-jungle': {
    profile: 'woodland',
    tempoMs: 260,
    leadWave: 'triangle',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [220.0, 261.63, 329.63, 392.0, 440.0, 392.0, 329.63, 261.63],
    bass: [110.0, 130.81, 164.81, 98.0]
  },
  'tr-nebula': {
    profile: 'cosmic',
    tempoMs: 220,
    leadWave: 'sawtooth',
    bassWave: 'square',
    hasPercussion: true,
    melody: [293.66, 349.23, 440.0, 523.25, 587.33, 698.46, 587.33, 440.0],
    bass: [146.83, 174.61, 220.0, 146.83]
  },

  // ==================== CELESTE ====================
  'cl-city': {
    profile: 'crystal',
    tempoMs: 290,
    leadWave: 'triangle',
    bassWave: 'sine',
    hasPercussion: true,
    melody: [329.63, 392.0, 493.88, 523.25, 587.33, 523.25, 493.88, 392.0],
    bass: [164.81, 196.0, 130.81, 146.83]
  },
  'cl-dream': {
    profile: 'cosmic',
    tempoMs: 270,
    leadWave: 'sine',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [261.63, 311.13, 392.0, 466.16, 523.25, 466.16, 392.0, 311.13],
    bass: [130.81, 155.56, 196.0, 116.54]
  },
  'cl-resort': {
    profile: 'cavern',
    tempoMs: 250,
    leadWave: 'square',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [246.94, 293.66, 329.63, 369.99, 440.0, 369.99, 329.63, 293.66],
    bass: [123.47, 146.83, 164.81, 123.47]
  },
  'cl-ridge': {
    profile: 'woodland',
    tempoMs: 310,
    leadWave: 'sine',
    bassWave: 'triangle',
    hasPercussion: false,
    melody: [349.23, 440.0, 523.25, 659.25, 698.46, 659.25, 523.25, 440.0],
    bass: [174.61, 220.0, 261.63, 174.61]
  },
  'cl-summit': {
    profile: 'crystal',
    tempoMs: 215,
    leadWave: 'square',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [440.0, 523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 523.25],
    bass: [220.0, 261.63, 329.63, 196.0]
  },

  // ==================== HOLLOW KNIGHT ====================
  'hk-crossroads': {
    profile: 'cavern',
    tempoMs: 420,
    leadWave: 'sine',
    bassWave: 'triangle',
    hasPercussion: false,
    melody: [220.0, 261.63, 329.63, 293.66, 261.63, 246.94, 220.0, 196.0],
    bass: [110.0, 130.81, 98.0, 110.0]
  },
  'hk-greenpath': {
    profile: 'woodland',
    tempoMs: 350,
    leadWave: 'sine',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [293.66, 349.23, 440.0, 523.25, 493.88, 440.0, 349.23, 329.63],
    bass: [146.83, 174.61, 220.0, 130.81]
  },
  'hk-crystal': {
    profile: 'crystal',
    tempoMs: 320,
    leadWave: 'triangle',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [392.0, 466.16, 587.33, 698.46, 783.99, 698.46, 587.33, 466.16],
    bass: [196.0, 233.08, 293.66, 196.0]
  },
  'hk-tears': {
    profile: 'cavern',
    tempoMs: 390,
    leadWave: 'sine',
    bassWave: 'triangle',
    hasPercussion: false,
    melody: [329.63, 392.0, 493.88, 659.25, 587.33, 493.88, 392.0, 329.63],
    bass: [164.81, 196.0, 246.94, 146.83]
  },
  'hk-palace': {
    profile: 'crystal',
    tempoMs: 310,
    leadWave: 'sine',
    bassWave: 'triangle',
    hasPercussion: false,
    melody: [440.0, 523.25, 659.25, 880.0, 783.99, 659.25, 523.25, 493.88],
    bass: [220.0, 261.63, 329.63, 246.94]
  },

  // ==================== SUPER MARIO ====================
  'sm-plains': {
    profile: 'arcade',
    tempoMs: 210,
    leadWave: 'square',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [659.25, 659.25, 523.25, 659.25, 783.99, 392.0, 523.25, 392.0],
    bass: [130.81, 196.0, 164.81, 130.81]
  },
  'sm-underground': {
    profile: 'arcade',
    tempoMs: 230,
    leadWave: 'square',
    bassWave: 'square',
    hasPercussion: true,
    melody: [261.63, 523.25, 220.0, 440.0, 233.08, 466.16, 196.0, 392.0],
    bass: [130.81, 110.0, 116.54, 98.0]
  },
  'sm-sky': {
    profile: 'arcade',
    tempoMs: 205,
    leadWave: 'square',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [523.25, 587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33],
    bass: [261.63, 293.66, 329.63, 196.0]
  },
  'sm-galaxy': {
    profile: 'cosmic',
    tempoMs: 260,
    leadWave: 'triangle',
    bassWave: 'sine',
    hasPercussion: true,
    melody: [392.0, 493.88, 587.33, 783.99, 880.0, 783.99, 587.33, 493.88],
    bass: [196.0, 246.94, 293.66, 196.0]
  },
  'sm-castle': {
    profile: 'infernal',
    tempoMs: 220,
    leadWave: 'sawtooth',
    bassWave: 'square',
    hasPercussion: true,
    melody: [220.0, 233.08, 220.0, 207.65, 220.0, 246.94, 233.08, 207.65],
    bass: [110.0, 116.54, 103.83, 98.0]
  },

  // ==================== SONIC ZONES ====================
  'sn-greenhill': {
    profile: 'arcade',
    tempoMs: 195,
    leadWave: 'square',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [523.25, 493.88, 440.0, 392.0, 440.0, 523.25, 659.25, 587.33],
    bass: [130.81, 164.81, 174.61, 196.0]
  },
  'sn-chemical': {
    profile: 'arcade',
    tempoMs: 190,
    leadWave: 'sawtooth',
    bassWave: 'square',
    hasPercussion: true,
    melody: [329.63, 392.0, 440.0, 493.88, 587.33, 523.25, 440.0, 392.0],
    bass: [164.81, 196.0, 220.0, 146.83]
  },
  'sn-casino': {
    profile: 'arcade',
    tempoMs: 215,
    leadWave: 'triangle',
    bassWave: 'square',
    hasPercussion: true,
    melody: [392.0, 493.88, 587.33, 698.46, 783.99, 698.46, 587.33, 493.88],
    bass: [196.0, 246.94, 293.66, 174.61]
  },
  'sn-icecap': {
    profile: 'crystal',
    tempoMs: 210,
    leadWave: 'sawtooth',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [369.99, 440.0, 493.88, 587.33, 659.25, 587.33, 493.88, 440.0],
    bass: [185.0, 220.0, 246.94, 164.81]
  },
  'sn-sanctuary': {
    profile: 'cosmic',
    tempoMs: 225,
    leadWave: 'square',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [440.0, 554.37, 659.25, 880.0, 783.99, 659.25, 554.37, 493.88],
    bass: [220.0, 277.18, 329.63, 196.0]
  },

  // ==================== ELDEN RING ====================
  'er-limgrave': {
    profile: 'woodland',
    tempoMs: 430,
    leadWave: 'sawtooth',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [196.0, 220.0, 233.08, 293.66, 261.63, 233.08, 220.0, 196.0],
    bass: [98.0, 110.0, 116.54, 98.0]
  },
  'er-liurnia': {
    profile: 'cosmic',
    tempoMs: 410,
    leadWave: 'sine',
    bassWave: 'triangle',
    hasPercussion: false,
    melody: [246.94, 293.66, 369.99, 440.0, 392.0, 369.99, 293.66, 246.94],
    bass: [123.47, 146.83, 185.0, 123.47]
  },
  'er-caelid': {
    profile: 'infernal',
    tempoMs: 390,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [146.83, 155.56, 185.0, 207.65, 185.0, 155.56, 146.83, 138.59],
    bass: [73.42, 77.78, 92.5, 69.3]
  },
  'er-nokron': {
    profile: 'crystal',
    tempoMs: 400,
    leadWave: 'sine',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [329.63, 392.0, 493.88, 587.33, 523.25, 493.88, 392.0, 329.63],
    bass: [164.81, 196.0, 246.94, 164.81]
  },
  'er-azula': {
    profile: 'cosmic',
    tempoMs: 280,
    leadWave: 'sawtooth',
    bassWave: 'square',
    hasPercussion: true,
    melody: [220.0, 261.63, 329.63, 440.0, 493.88, 440.0, 329.63, 261.63],
    bass: [110.0, 130.81, 164.81, 110.0]
  },
  // ==================== 9. THE LEGEND OF ZELDA (5 Themes) ====================
  'zd-meadow': {
    profile: 'woodland',
    tempoMs: 310,
    leadWave: 'triangle',
    bassWave: 'sine',
    hasPercussion: true,
    melody: [392.0, 440.0, 493.88, 587.33, 659.25, 783.99, 659.25, 587.33],
    bass: [196.0, 146.83, 164.81, 196.0]
  },
  'zd-lostwoods': {
    profile: 'mystic',
    tempoMs: 250,
    leadWave: 'triangle',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [349.23, 440.0, 493.88, 659.25, 587.33, 493.88, 523.25, 440.0],
    bass: [174.61, 220.0, 164.81, 146.83]
  },
  'zd-deathmtn': {
    profile: 'infernal',
    tempoMs: 320,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [164.81, 174.61, 207.65, 220.0, 246.94, 207.65, 174.61, 164.81],
    bass: [82.41, 87.31, 103.83, 82.41]
  },
  'zd-zora': {
    profile: 'aquatic',
    tempoMs: 350,
    leadWave: 'sine',
    bassWave: 'triangle',
    hasPercussion: false,
    melody: [523.25, 587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33],
    bass: [130.81, 164.81, 196.0, 146.83]
  },
  'zd-skyisle': {
    profile: 'cosmic',
    tempoMs: 290,
    leadWave: 'triangle',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [440.0, 554.37, 659.25, 880.0, 783.99, 659.25, 554.37, 493.88],
    bass: [220.0, 185.0, 164.81, 220.0]
  },
  // ==================== 10. TOMB RAIDER (5 Themes) ====================
  'tb-jungle': {
    profile: 'woodland',
    tempoMs: 330,
    leadWave: 'triangle',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [293.66, 349.23, 440.0, 392.0, 349.23, 329.63, 293.66, 261.63],
    bass: [146.83, 130.81, 110.0, 146.83]
  },
  'tb-egypt': {
    profile: 'desert',
    tempoMs: 300,
    leadWave: 'sawtooth',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [329.63, 349.23, 415.3, 440.0, 493.88, 415.3, 349.23, 329.63],
    bass: [164.81, 174.61, 207.65, 164.81]
  },
  'tb-himalaya': {
    profile: 'crystal',
    tempoMs: 360,
    leadWave: 'sine',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [493.88, 587.33, 659.25, 783.99, 739.99, 659.25, 587.33, 493.88],
    bass: [123.47, 146.83, 164.81, 123.47]
  },
  'tb-atlantis': {
    profile: 'desert',
    tempoMs: 280,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [246.94, 261.63, 311.13, 369.99, 392.0, 311.13, 261.63, 246.94],
    bass: [123.47, 130.81, 155.56, 123.47]
  },
  'tb-yamatai': {
    profile: 'cavern',
    tempoMs: 295,
    leadWave: 'triangle',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [220.0, 261.63, 293.66, 329.63, 392.0, 329.63, 293.66, 246.94],
    bass: [110.0, 98.0, 87.31, 110.0]
  },
  // ==================== 11. METROID (5 Themes) ====================
  'mt-crateria': {
    profile: 'tech',
    tempoMs: 310,
    leadWave: 'square',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [261.63, 311.13, 392.0, 415.3, 392.0, 311.13, 293.66, 246.94],
    bass: [130.81, 155.56, 196.0, 123.47]
  },
  'mt-brinstar': {
    profile: 'tech',
    tempoMs: 245,
    leadWave: 'square',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [392.0, 466.16, 523.25, 587.33, 622.25, 587.33, 523.25, 466.16],
    bass: [196.0, 155.56, 174.61, 196.0]
  },
  'mt-norfair': {
    profile: 'infernal',
    tempoMs: 265,
    leadWave: 'sawtooth',
    bassWave: 'square',
    hasPercussion: true,
    melody: [196.0, 207.65, 233.08, 261.63, 277.18, 261.63, 233.08, 207.65],
    bass: [98.0, 103.83, 116.54, 98.0]
  },
  'mt-maridia': {
    profile: 'aquatic',
    tempoMs: 390,
    leadWave: 'sine',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [311.13, 369.99, 466.16, 554.37, 493.88, 466.16, 369.99, 311.13],
    bass: [155.56, 185.0, 138.59, 155.56]
  },
  'mt-tourian': {
    profile: 'tech',
    tempoMs: 225,
    leadWave: 'square',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [440.0, 466.16, 415.3, 440.0, 523.25, 493.88, 466.16, 415.3],
    bass: [110.0, 116.54, 103.83, 110.0]
  },
  // ==================== 12. SUBNAUTICA (5 Themes) ====================
  'sb-shallows': {
    profile: 'aquatic',
    tempoMs: 335,
    leadWave: 'sine',
    bassWave: 'triangle',
    hasPercussion: false,
    melody: [392.0, 493.88, 587.33, 783.99, 659.25, 587.33, 493.88, 440.0],
    bass: [196.0, 164.81, 130.81, 146.83]
  },
  'sb-kelp': {
    profile: 'aquatic',
    tempoMs: 365,
    leadWave: 'triangle',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [329.63, 392.0, 440.0, 523.25, 493.88, 440.0, 392.0, 349.23],
    bass: [164.81, 130.81, 146.83, 110.0]
  },
  'sb-jellyshroom': {
    profile: 'mystic',
    tempoMs: 345,
    leadWave: 'sine',
    bassWave: 'triangle',
    hasPercussion: false,
    melody: [440.0, 523.25, 659.25, 783.99, 739.99, 659.25, 523.25, 493.88],
    bass: [220.0, 164.81, 196.0, 146.83]
  },
  'sb-lostriver': {
    profile: 'aquatic',
    tempoMs: 410,
    leadWave: 'sine',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [246.94, 293.66, 329.63, 369.99, 329.63, 293.66, 261.63, 246.94],
    bass: [123.47, 98.0, 110.0, 123.47]
  },
  'sb-lava': {
    profile: 'infernal',
    tempoMs: 300,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [146.83, 174.61, 196.0, 220.0, 207.65, 196.0, 174.61, 146.83],
    bass: [73.42, 87.31, 98.0, 73.42]
  },
  // ==================== 13. SPELUNKY (5 Themes) ====================
  'sp-mines': {
    profile: 'cavern',
    tempoMs: 260,
    leadWave: 'triangle',
    bassWave: 'square',
    hasPercussion: true,
    melody: [329.63, 392.0, 440.0, 493.88, 440.0, 392.0, 329.63, 293.66],
    bass: [164.81, 196.0, 220.0, 146.83]
  },
  'sp-jungle': {
    profile: 'woodland',
    tempoMs: 255,
    leadWave: 'square',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [392.0, 440.0, 523.25, 587.33, 523.25, 440.0, 392.0, 329.63],
    bass: [196.0, 220.0, 164.81, 146.83]
  },
  'sp-icecaves': {
    profile: 'crystal',
    tempoMs: 340,
    leadWave: 'sine',
    bassWave: 'triangle',
    hasPercussion: false,
    melody: [587.33, 659.25, 783.99, 880.0, 783.99, 659.25, 587.33, 523.25],
    bass: [146.83, 164.81, 196.0, 130.81]
  },
  'sp-temple': {
    profile: 'desert',
    tempoMs: 285,
    leadWave: 'sawtooth',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [293.66, 311.13, 369.99, 392.0, 440.0, 369.99, 311.13, 293.66],
    bass: [146.83, 155.56, 185.0, 146.83]
  },
  'sp-cosmic': {
    profile: 'cosmic',
    tempoMs: 315,
    leadWave: 'sine',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [523.25, 622.25, 783.99, 932.33, 880.0, 783.99, 622.25, 523.25],
    bass: [130.81, 155.56, 196.0, 130.81]
  },
  // ==================== 14. ORI & SPIRIT TREE (5 Themes) ====================
  'or-nibel': {
    profile: 'mystic',
    tempoMs: 330,
    leadWave: 'sine',
    bassWave: 'triangle',
    hasPercussion: false,
    melody: [440.0, 523.25, 659.25, 880.0, 783.99, 659.25, 587.33, 523.25],
    bass: [220.0, 174.61, 130.81, 196.0]
  },
  'or-ginso': {
    profile: 'mystic',
    tempoMs: 245,
    leadWave: 'triangle',
    bassWave: 'sine',
    hasPercussion: true,
    melody: [493.88, 587.33, 659.25, 783.99, 880.0, 987.77, 880.0, 783.99],
    bass: [246.94, 196.0, 220.0, 164.81]
  },
  'or-forlorn': {
    profile: 'crystal',
    tempoMs: 355,
    leadWave: 'sine',
    bassWave: 'sine',
    hasPercussion: false,
    melody: [369.99, 440.0, 554.37, 659.25, 587.33, 554.37, 440.0, 369.99],
    bass: [185.0, 146.83, 164.81, 138.59]
  },
  'or-horu': {
    profile: 'infernal',
    tempoMs: 260,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [220.0, 246.94, 261.63, 329.63, 349.23, 329.63, 261.63, 246.94],
    bass: [110.0, 123.47, 130.81, 98.0]
  },
  'or-willow': {
    profile: 'mystic',
    tempoMs: 305,
    leadWave: 'triangle',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [392.0, 466.16, 587.33, 698.46, 659.25, 587.33, 466.16, 392.0],
    bass: [196.0, 155.56, 174.61, 146.83]
  },
  // ==================== 15. THE WEEKND TOUR (5 Themes) ====================
  'wk-blinding': {
    profile: 'tech',
    tempoMs: 175,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    hasPercussion: true,
    // F4 - F4 - Eb4 - F4 - G4 - C4 - Eb4 - F4 (Blinding Lights synth riff)
    melody: [349.23, 349.23, 311.13, 349.23, 392.0, 261.63, 311.13, 349.23],
    bass: [87.31, 69.3, 77.78, 65.41]
  },
  'wk-starboy': {
    profile: 'tech',
    tempoMs: 215,
    leadWave: 'square',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [440.0, 392.0, 349.23, 329.63, 293.66, 329.63, 392.0, 440.0],
    bass: [110.0, 98.0, 87.31, 98.0]
  },
  'wk-afterhours': {
    profile: 'cosmic',
    tempoMs: 245,
    leadWave: 'sawtooth',
    bassWave: 'sine',
    hasPercussion: true,
    melody: [261.63, 311.13, 392.0, 466.16, 523.25, 466.16, 392.0, 311.13],
    bass: [65.41, 77.78, 98.0, 87.31]
  },
  'wk-dawnfm': {
    profile: 'tech',
    tempoMs: 195,
    leadWave: 'sawtooth',
    bassWave: 'square',
    hasPercussion: true,
    melody: [329.63, 392.0, 493.88, 587.33, 659.25, 587.33, 493.88, 392.0],
    bass: [82.41, 98.0, 123.47, 110.0]
  },
  'wk-sofi': {
    profile: 'cosmic',
    tempoMs: 185,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [440.0, 523.25, 659.25, 783.99, 880.0, 783.99, 659.25, 523.25],
    bass: [110.0, 87.31, 65.41, 98.0]
  },
  // ==================== 16. MARSBUNN LIVE (5 Themes) ====================
  'mb-alone': {
    profile: 'arcade',
    tempoMs: 190,
    leadWave: 'square',
    bassWave: 'triangle',
    hasPercussion: true,
    // D5 - E5 - F#5 - A5 - F#5 - E5 - D5 - B4 (Marshmello Alone lead)
    melody: [587.33, 659.25, 739.99, 880.0, 739.99, 659.25, 587.33, 493.88],
    bass: [146.83, 123.47, 98.0, 110.0]
  },
  'mb-happier': {
    profile: 'crystal',
    tempoMs: 205,
    leadWave: 'triangle',
    bassWave: 'sine',
    hasPercussion: true,
    melody: [698.46, 659.25, 587.33, 523.25, 587.33, 659.25, 698.46, 880.0],
    bass: [146.83, 174.61, 130.81, 116.54]
  },
  'mb-joytime': {
    profile: 'arcade',
    tempoMs: 180,
    leadWave: 'square',
    bassWave: 'square',
    hasPercussion: true,
    melody: [523.25, 659.25, 783.99, 1046.5, 987.77, 783.99, 659.25, 587.33],
    bass: [130.81, 164.81, 196.0, 146.83]
  },
  'mb-bass': {
    profile: 'tech',
    tempoMs: 170,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [311.13, 392.0, 466.16, 622.25, 587.33, 466.16, 392.0, 311.13],
    bass: [77.78, 98.0, 116.54, 77.78]
  },
  'mb-ultra': {
    profile: 'arcade',
    tempoMs: 165,
    leadWave: 'sawtooth',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [659.25, 783.99, 880.0, 1046.5, 1174.66, 1046.5, 880.0, 783.99],
    bass: [164.81, 130.81, 146.83, 196.0]
  },
  // ==================== 17. SYNTHWAVE LIVE (5 Themes) ====================
  'sw-outrun': {
    profile: 'tech',
    tempoMs: 185,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [329.63, 440.0, 493.88, 659.25, 587.33, 493.88, 440.0, 329.63],
    bass: [82.41, 110.0, 123.47, 98.0]
  },
  'sw-pyramid': {
    profile: 'tech',
    tempoMs: 195,
    leadWave: 'square',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [369.99, 440.0, 554.37, 659.25, 739.99, 659.25, 554.37, 440.0],
    bass: [92.5, 110.0, 138.59, 123.47]
  },
  'sw-holo': {
    profile: 'crystal',
    tempoMs: 200,
    leadWave: 'triangle',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [523.25, 659.25, 783.99, 987.77, 880.0, 783.99, 659.25, 523.25],
    bass: [130.81, 164.81, 196.0, 146.83]
  },
  'sw-vinyl': {
    profile: 'cosmic',
    tempoMs: 210,
    leadWave: 'sawtooth',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [392.0, 493.88, 587.33, 739.99, 783.99, 739.99, 587.33, 493.88],
    bass: [98.0, 123.47, 146.83, 110.0]
  },
  'sw-cathedral': {
    profile: 'tech',
    tempoMs: 180,
    leadWave: 'sawtooth',
    bassWave: 'square',
    hasPercussion: true,
    melody: [440.0, 554.37, 659.25, 880.0, 987.77, 880.0, 659.25, 554.37],
    bass: [110.0, 138.59, 164.81, 110.0]
  },
  // ==================== 18. EDM FESTIVAL (5 Themes) ====================
  'ed-wisdom': {
    profile: 'mystic',
    tempoMs: 185,
    leadWave: 'sawtooth',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [493.88, 587.33, 739.99, 880.0, 987.77, 880.0, 739.99, 587.33],
    bass: [123.47, 146.83, 185.0, 164.81]
  },
  'ed-rose': {
    profile: 'crystal',
    tempoMs: 190,
    leadWave: 'triangle',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [587.33, 698.46, 880.0, 1046.5, 987.77, 880.0, 698.46, 587.33],
    bass: [146.83, 174.61, 220.0, 164.81]
  },
  'ed-freedom': {
    profile: 'tech',
    tempoMs: 175,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [523.25, 622.25, 783.99, 932.33, 1046.5, 932.33, 783.99, 622.25],
    bass: [130.81, 155.56, 196.0, 116.54]
  },
  'ed-core': {
    profile: 'woodland',
    tempoMs: 195,
    leadWave: 'square',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [392.0, 466.16, 587.33, 783.99, 698.46, 587.33, 466.16, 392.0],
    bass: [98.0, 116.54, 146.83, 130.81]
  },
  'ed-encore': {
    profile: 'arcade',
    tempoMs: 165,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [659.25, 783.99, 987.77, 1174.66, 1318.51, 1174.66, 987.77, 783.99],
    bass: [164.81, 196.0, 246.94, 146.83]
  },
  // ==================== 19. ROCK & SYMPHONY (5 Themes) ====================
  'rk-amp': {
    profile: 'infernal',
    tempoMs: 175,
    leadWave: 'sawtooth',
    bassWave: 'square',
    hasPercussion: true,
    melody: [220.0, 261.63, 293.66, 311.13, 293.66, 261.63, 220.0, 196.0],
    bass: [110.0, 130.81, 146.83, 98.0]
  },
  'rk-pyro': {
    profile: 'infernal',
    tempoMs: 165,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [246.94, 293.66, 329.63, 369.99, 440.0, 369.99, 329.63, 293.66],
    bass: [123.47, 146.83, 164.81, 110.0]
  },
  'rk-piano': {
    profile: 'crystal',
    tempoMs: 220,
    leadWave: 'triangle',
    bassWave: 'sine',
    hasPercussion: true,
    melody: [523.25, 659.25, 783.99, 1046.5, 1174.66, 1046.5, 783.99, 659.25],
    bass: [130.81, 196.0, 220.0, 174.61]
  },
  'rk-symphony': {
    profile: 'cosmic',
    tempoMs: 205,
    leadWave: 'sawtooth',
    bassWave: 'triangle',
    hasPercussion: true,
    melody: [440.0, 523.25, 659.25, 880.0, 987.77, 880.0, 659.25, 523.25],
    bass: [110.0, 130.81, 164.81, 146.83]
  },
  'rk-finale': {
    profile: 'cosmic',
    tempoMs: 160,
    leadWave: 'sawtooth',
    bassWave: 'sawtooth',
    hasPercussion: true,
    melody: [587.33, 739.99, 880.0, 1174.66, 1318.51, 1174.66, 880.0, 739.99],
    bass: [146.83, 185.0, 220.0, 196.0]
  }
};

export class SoundSystem {
  private ctx: AudioContext | null = null;
  private bgmTimer: number | null = null;
  private currentTheme: WorldTheme = 'forest';
  private noteStep = 0;
  private lastChargeTickMs = 0;
  private noiseBuffer: AudioBuffer | null = null;

  private ensureContext(): AudioContext | null {
    if (!globalSettings.get().soundEnabled && !globalSettings.get().musicEnabled) {
      return null;
    }
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
    return this.ctx;
  }

  private getNoiseBuffer(ctx: AudioContext): AudioBuffer {
    if (this.noiseBuffer) return this.noiseBuffer;
    const bufferSize = ctx.sampleRate * 0.25;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    this.noiseBuffer = buffer;
    return buffer;
  }

  private get profile(): AcousticProfile {
    return THEME_AUDIO_SPECS[this.currentTheme]?.profile ?? 'woodland';
  }

  private get sfxVolume(): number {
    const s = globalSettings.get();
    return s.soundEnabled ? s.masterVolume * 0.34 : 0;
  }

  private get musicVolume(): number {
    const s = globalSettings.get();
    return s.soundEnabled && s.musicEnabled ? s.masterVolume * 0.085 : 0;
  }

  private playNoiseBurst(
    ctx: AudioContext,
    durationSec: number,
    filterFreq: number,
    vol: number
  ): void {
    const src = ctx.createBufferSource();
    src.buffer = this.getNoiseBuffer(ctx);
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(filterFreq, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + durationSec);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    src.stop(ctx.currentTime + durationSec);
  }

  public playChargeTick(chargeRatio: number, nowMs: number): void {
    if (this.sfxVolume <= 0) return;
    if (nowMs - this.lastChargeTickMs < 55) return;
    this.lastChargeTickMs = nowMs;

    const ctx = this.ensureContext();
    if (!ctx) return;

    const prof = this.profile;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (prof === 'arcade') {
      osc.type = 'square';
      const f = 300 + Math.floor(chargeRatio * 8) * 65;
      osc.frequency.setValueAtTime(f, ctx.currentTime);
    } else if (prof === 'crystal') {
      osc.type = 'sine';
      const f = 520 + chargeRatio * 680;
      osc.frequency.setValueAtTime(f, ctx.currentTime);
    } else if (prof === 'infernal') {
      osc.type = 'sawtooth';
      const f = 140 + chargeRatio * 260;
      osc.frequency.setValueAtTime(f, ctx.currentTime);
    } else {
      osc.type = chargeRatio >= 1 ? 'triangle' : 'sine';
      const baseFreq = 220 + chargeRatio * 420;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.12, ctx.currentTime + 0.045);
    }

    const vol = this.sfxVolume * (0.26 + chargeRatio * 0.34);
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  public playStep(isIce: boolean): void {
    if (this.sfxVolume <= 0) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const prof = isIce ? 'crystal' : this.profile;
    const now = ctx.currentTime;

    if (prof === 'woodland') {
      // Tiếng giẫm lá cỏ sột soạt + nhịp chân trầm
      this.playNoiseBurst(ctx, 0.04, 1600, this.sfxVolume * 0.18);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.035);
      g.gain.setValueAtTime(this.sfxVolume * 0.2, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (prof === 'crystal') {
      // Tiếng chuông băng / pha lê leng keng 2 tần số
      [980, 1470].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq + Math.random() * 80, now + i * 0.012);
        g.gain.setValueAtTime(this.sfxVolume * 0.16, now + i * 0.012);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + i * 0.012);
        osc.stop(now + 0.06);
      });
    } else if (prof === 'arcade') {
      // Tiếng bước chân 8-bit nảy gọn kiểu Mario/Sonic
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(340, now);
      osc.frequency.setValueAtTime(510, now + 0.018);
      g.gain.setValueAtTime(this.sfxVolume * 0.16, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.038);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.04);
    } else if (prof === 'cavern') {
      // Tiếng bước chân đá kèm tiếng vọng (Echo) trong hang sâu
      [0, 0.075].forEach((delay, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(idx === 0 ? 190 : 285, now + delay);
        osc.frequency.exponentialRampToValueAtTime(110, now + delay + 0.04);
        g.gain.setValueAtTime(this.sfxVolume * (idx === 0 ? 0.22 : 0.09), now + delay);
        g.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.045);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + delay);
        osc.stop(now + delay + 0.05);
      });
    } else if (prof === 'infernal') {
      // Tiếng dậm đá lửa nặng nề
      this.playNoiseBurst(ctx, 0.05, 420, this.sfxVolume * 0.25);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.05);
      g.gain.setValueAtTime(this.sfxVolume * 0.24, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.055);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.055);
    } else {
      // Cosmic / Astral step
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.045);
      g.gain.setValueAtTime(this.sfxVolume * 0.18, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    }
  }

  public playJump(chargeRatio: number): void {
    if (this.sfxVolume <= 0) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const prof = this.profile;
    const now = ctx.currentTime;

    if (prof === 'arcade') {
      // Tiếng nhảy 8-Bit đa nốt kiểu NES/Genesis
      const notes = [220, 330, 440, 587.33 + chargeRatio * 220];
      notes.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(f, now + idx * 0.032);
        g.gain.setValueAtTime(this.sfxVolume * 0.42, now + idx * 0.032);
        g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.032 + 0.045);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now + idx * 0.032);
        osc.stop(now + idx * 0.032 + 0.05);
      });
    } else if (prof === 'crystal') {
      // Tiếng nhảy lấp lánh pha lê 2 bè hòa âm
      [1, 1.5].forEach((mult) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime((280 + chargeRatio * 120) * mult, now);
        osc.frequency.exponentialRampToValueAtTime((620 + chargeRatio * 340) * mult, now + 0.16);
        g.gain.setValueAtTime(this.sfxVolume * 0.35, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.17);
      });
    } else if (prof === 'infernal') {
      // Tiếng nhảy bùng lửa địa ngục
      this.playNoiseBurst(ctx, 0.12, 750, this.sfxVolume * 0.32);
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120 + chargeRatio * 60, now);
      osc.frequency.exponentialRampToValueAtTime(340 + chargeRatio * 200, now + 0.16);
      g.gain.setValueAtTime(this.sfxVolume * 0.48, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.17);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.17);
    } else if (prof === 'cosmic') {
      // Tiếng nhảy không gian Chorus kép
      [-6, 6].forEach((detuneHz) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(210 + detuneHz, now);
        osc.frequency.exponentialRampToValueAtTime(540 + chargeRatio * 320 + detuneHz, now + 0.18);
        g.gain.setValueAtTime(this.sfxVolume * 0.38, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.19);
      });
    } else {
      // Woodland / Cavern elastic jump
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = prof === 'cavern' ? 'triangle' : 'square';
      const startFreq = 180 + chargeRatio * 90;
      const endFreq = 460 + chargeRatio * 280;
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.14);
      gain.gain.setValueAtTime(this.sfxVolume * 0.5, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.15);
    }
  }

  public playWallBounce(isBouncy: boolean): void {
    if (this.sfxVolume <= 0) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const prof = this.profile;
    const now = ctx.currentTime;

    if (isBouncy) {
      // Tiếng bật lò xo / Slime / Pinball đặc trưng theo từng chủ đề
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = prof === 'arcade' ? 'square' : 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.06);
      osc.frequency.exponentialRampToValueAtTime(340, now + 0.11);
      osc.frequency.exponentialRampToValueAtTime(760, now + 0.2);

      gain.gain.setValueAtTime(this.sfxVolume * 0.65, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.21);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.21);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = prof === 'crystal' ? 'sine' : prof === 'infernal' ? 'sawtooth' : 'triangle';
      const startF = prof === 'crystal' ? 680 : prof === 'infernal' ? 140 : 210;
      const endF = prof === 'crystal' ? 340 : 85;
      osc.frequency.setValueAtTime(startF, now);
      osc.frequency.exponentialRampToValueAtTime(endF, now + 0.09);

      gain.gain.setValueAtTime(this.sfxVolume * 0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    }
  }

  public playCeilingBonk(): void {
    if (this.sfxVolume <= 0) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(65, ctx.currentTime + 0.075);

    gain.gain.setValueAtTime(this.sfxVolume * 0.42, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.08);
  }

  public playLand(isHardFall: boolean, isIce: boolean): void {
    if (this.sfxVolume <= 0) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const prof = isIce ? 'crystal' : this.profile;
    const now = ctx.currentTime;

    if (isHardFall) {
      this.playNoiseBurst(ctx, 0.22, 320, this.sfxVolume * 0.55);
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(135, now);
      osc.frequency.exponentialRampToValueAtTime(34, now + 0.26);

      gain.gain.setValueAtTime(this.sfxVolume * 0.78, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.28);
    } else {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = prof === 'crystal' ? 'sine' : prof === 'arcade' ? 'square' : 'triangle';
      const startF = prof === 'crystal' ? 520 : prof === 'arcade' ? 240 : 165;
      const endF = prof === 'crystal' ? 310 : 75;
      osc.frequency.setValueAtTime(startF, now);
      osc.frequency.exponentialRampToValueAtTime(endF, now + 0.065);

      gain.gain.setValueAtTime(this.sfxVolume * 0.36, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    }
  }

  public playCheckpoint(): void {
    if (this.sfxVolume <= 0) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const prof = this.profile;
    // Chủ đề Arcade dùng tiếng ăn Xu/Ring kinh điển (B5 -> E6)
    const notes =
      prof === 'arcade'
        ? [987.77, 1318.51]
        : prof === 'crystal'
          ? [659.25, 783.99, 1046.5, 1318.51]
          : [523.25, 659.25, 783.99, 1046.5];

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = prof === 'arcade' ? 'square' : 'triangle';
      const startTime = ctx.currentTime + idx * 0.065;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(this.sfxVolume * 0.48, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.18);
    });
  }

  public playHazard(): void {
    if (this.sfxVolume <= 0) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    this.playNoiseBurst(ctx, 0.18, 600, this.sfxVolume * 0.4);
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(340, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(85, ctx.currentTime + 0.22);

    gain.gain.setValueAtTime(this.sfxVolume * 0.58, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.24);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.24);
  }

  public playGoalFanfare(): void {
    if (this.sfxVolume <= 0) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73];
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      const startTime = ctx.currentTime + idx * 0.08;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(this.sfxVolume * 0.5, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.24);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.24);
    });
  }

  public playEasterEggFanfare(): void {
    if (this.sfxVolume <= 0) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    // Khúc khải hoàn tìm thấy Kho Báu Bí Mật Easter Egg (8 nốt lấp lánh 2 bè)
    const notes = [523.25, 659.25, 783.99, 1046.5, 987.77, 1046.5, 1318.51, 1567.98];
    notes.forEach((freq, idx) => {
      [1, 0.5].forEach((harm) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = harm === 1 ? 'triangle' : 'sine';
        const startTime = ctx.currentTime + idx * 0.075;
        osc.frequency.setValueAtTime(freq * harm, startTime);

        gain.gain.setValueAtTime(this.sfxVolume * (harm === 1 ? 0.55 : 0.3), startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.29);
      });
    });
  }

  public playCrumble(): void {
    if (this.sfxVolume <= 0) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    this.playNoiseBurst(ctx, 0.16, 850, this.sfxVolume * 0.42);
    [220, 145, 95].forEach((f, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f, now + idx * 0.04);
      osc.frequency.exponentialRampToValueAtTime(f * 0.55, now + idx * 0.04 + 0.06);
      g.gain.setValueAtTime(this.sfxVolume * 0.34, now + idx * 0.04);
      g.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.065);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.07);
    });
  }

  public playScreenWhoosh(up: boolean): void {
    if (this.sfxVolume <= 0) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(up ? 240 : 420, now);
    osc.frequency.exponentialRampToValueAtTime(up ? 520 : 190, now + 0.11);
    g.gain.setValueAtTime(this.sfxVolume * 0.16, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc.connect(g);
    g.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.12);
  }

  public startWorldMusic(theme: WorldTheme): void {
    this.currentTheme = theme;
    this.stopMusic();

    const spec = THEME_AUDIO_SPECS[theme] ?? THEME_AUDIO_SPECS.forest;
    // Hệ số biến thiên âm sắc nhẹ theo tên theme giúp mọi map đều có tần số đặc trưng riêng
    let hash = 0;
    for (let i = 0; i < theme.length; i++) {
      hash = (hash * 31 + theme.charCodeAt(i)) % 97;
    }
    const themePitchShift = 0.94 + (hash / 97) * 0.12;

    this.bgmTimer = window.setInterval(() => {
      if (this.musicVolume <= 0) return;
      const ctx = this.ensureContext();
      if (!ctx) return;

      const step = this.noteStep++;
      const now = ctx.currentTime;
      const noteDur = (spec.tempoMs / 1000) * 0.92;

      // 1. Giai điệu chính (Lead Melody)
      const leadFreq = (spec.melody[step % spec.melody.length] ?? 261.63) * themePitchShift;
      const leadOsc = ctx.createOscillator();
      const leadGain = ctx.createGain();
      leadOsc.type = spec.leadWave;
      leadOsc.frequency.setValueAtTime(leadFreq, now);

      leadGain.gain.setValueAtTime(0.001, now);
      leadGain.gain.linearRampToValueAtTime(this.musicVolume, now + 0.04);
      leadGain.gain.exponentialRampToValueAtTime(0.0008, now + noteDur);

      leadOsc.connect(leadGain);
      leadGain.connect(ctx.destination);
      leadOsc.start(now);
      leadOsc.stop(now + noteDur + 0.02);

      // 2. Bè Trầm Hòa Âm (Bassline mỗi 2 nhịp)
      if (step % 2 === 0) {
        const bassFreq =
          (spec.bass[Math.floor(step / 2) % spec.bass.length] ?? 130.81) * themePitchShift;
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        bassOsc.type = spec.bassWave;
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0.001, now);
        bassGain.gain.linearRampToValueAtTime(this.musicVolume * 0.72, now + 0.03);
        bassGain.gain.exponentialRampToValueAtTime(0.0008, now + noteDur * 1.8);

        bassOsc.connect(bassGain);
        bassGain.connect(ctx.destination);
        bassOsc.start(now);
        bassOsc.stop(now + noteDur * 1.85);
      }

      // 3. Bè Arpeggio / Chime không gian ở mỗi nhịp thứ 4
      if (step % 4 === 2) {
        const arpOsc = ctx.createOscillator();
        const arpGain = ctx.createGain();
        arpOsc.type = 'sine';
        arpOsc.frequency.setValueAtTime(leadFreq * 1.5, now + noteDur * 0.45);
        arpGain.gain.setValueAtTime(this.musicVolume * 0.42, now + noteDur * 0.45);
        arpGain.gain.exponentialRampToValueAtTime(0.0008, now + noteDur * 1.1);
        arpOsc.connect(arpGain);
        arpGain.connect(ctx.destination);
        arpOsc.start(now + noteDur * 0.45);
        arpOsc.stop(now + noteDur * 1.15);
      }

      // 4. Nhịp Trống / Hi-Hat cho các map tiết tấu nhanh
      if (spec.hasPercussion && step % 2 === 1) {
        this.playNoiseBurst(ctx, 0.035, 3200, this.musicVolume * 0.45);
      }
    }, spec.tempoMs);
  }

  public stopMusic(): void {
    if (this.bgmTimer !== null) {
      window.clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}
