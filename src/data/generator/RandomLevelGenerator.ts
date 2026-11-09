import { DISPLAY } from '../../constants';
import {
  ALL_WORLD_THEMES,
  LevelData,
  LevelSeedState,
  TileKind,
  WorldTheme
} from '../levelTypes';
import { hashString, SeededRng } from './rng';

export type LayoutArchetype =
  | 'zigzag-classic'
  | 'twin-towers'
  | 'spiral-staircase'
  | 'crumble-gauntlet'
  | 'pinball-shaft'
  | 'sky-archipelago'
  | 'glacial-slalom'
  | 'canyon-wallbounce'
  | 'crosswind-citadel'
  | 'chaos-sanctum';

export const ARCHETYPE_LABELS: Record<LayoutArchetype, string> = {
  'zigzag-classic': 'Con Lắc Lệch Tầng (ZigZag Pendulum)',
  'twin-towers': 'Song Tháp Đối Xứng & Cầu Mỏng',
  'spiral-staircase': 'Cầu Thang Xoắn Ốc Đa Nhịp',
  'crumble-gauntlet': 'Thác Đá Cổ Sụp Đổ (Crumble Cascade)',
  'pinball-shaft': 'Giếng Bật Lò Xo & Gió Xoáy',
  'sky-archipelago': 'Quần Đảo Đá Nhảy Chân Mây',
  'glacial-slalom': 'Đường Trượt Băng Zíc-Zắc',
  'canyon-wallbounce': 'Hẻm Núi Dội Tường (Wall-Bounce)',
  'crosswind-citadel': 'Pháo Đài Gió Ngược Đảo Chiều',
  'chaos-sanctum': 'Thánh Điện Hỗn Mang Đa Chướng Ngại'
};

export const ALL_ARCHETYPES: readonly LayoutArchetype[] = [
  'zigzag-classic',
  'twin-towers',
  'spiral-staircase',
  'crumble-gauntlet',
  'pinball-shaft',
  'sky-archipelago',
  'glacial-slalom',
  'canyon-wallbounce',
  'crosswind-citadel',
  'chaos-sanctum'
];

const STANDARD_LEGEND: Record<string, TileKind> = {
  '#': 'solid',
  I: 'ice',
  B: 'bouncy',
  P: 'platform',
  K: 'crumble',
  '^': 'hazard',
  W: 'wind-right',
  M: 'wind-left',
  C: 'checkpoint',
  S: 'spawn',
  G: 'goal',
  E: 'easter-egg'
};

/**
 * Các mẫu nhịp độ cao dọc (Vertical Cadence) theo từng tầng màn hình được chọn bởi Seed:
 * Mọi khoảng cách giữa 2 bậc liên tiếp (kể cả từ row 2 của màn s lên row 23 của màn s+1)
 * đều đảm bảo 1 <= dRow <= 3 (16px..48px), 100% khả thi vật lý nhưng đổi nhịp liên tục!
 */
const SCREEN_0_CADENCES: readonly (readonly number[])[] = [
  [19, 16, 13, 10, 7, 4, 2],
  [19, 17, 14, 11, 8, 5, 2],
  [18, 15, 13, 10, 7, 4, 2],
  [19, 16, 14, 11, 9, 6, 4, 2]
];

const MID_SCREEN_CADENCES: readonly (readonly number[])[] = [
  [23, 20, 17, 14, 11, 8, 5, 2],
  [23, 21, 18, 15, 12, 9, 6, 4, 2],
  [23, 20, 18, 15, 12, 10, 7, 4, 2],
  [23, 20, 17, 15, 12, 9, 6, 3, 2],
  [23, 21, 18, 15, 13, 10, 7, 5, 2]
];

const TOP_SCREEN_CADENCES: readonly (readonly number[])[] = [
  [23, 20, 17, 14, 11, 8, 5],
  [23, 21, 18, 15, 12, 9, 6, 5],
  [23, 20, 18, 15, 12, 9, 6, 5],
  [23, 20, 17, 15, 12, 10, 7, 5]
];

function createEmptyGrid(): string[][] {
  return Array.from({ length: DISPLAY.ROWS }, () => Array<string>(DISPLAY.COLS).fill('.'));
}

function setChar(grid: string[][], r: number, c: number, ch: string): void {
  if (r >= 0 && r < DISPLAY.ROWS && c >= 0 && c < DISPLAY.COLS) {
    const row = grid[r];
    if (row) {
      row[c] = ch;
    }
  }
}

export function computeDifficultyMeta(worldNumber: number): {
  label: string;
  rating: number;
  ratio: number;
} {
  const clamped = Math.max(1, Math.min(100, worldNumber));
  const ratio = (clamped - 1) / 99;
  const rating = Math.max(4, Math.min(10, 4 + Math.floor(ratio * 6.5)));
  let label = 'Trung Bình (Medium)';
  if (clamped >= 80) label = 'Thần Thoại (Grandmaster)';
  else if (clamped >= 60) label = 'Bậc Thầy (Master)';
  else if (clamped >= 40) label = 'Chuyên Gia (Expert)';
  else if (clamped >= 20) label = 'Khó (Hard)';
  return { label, rating, ratio };
}

export function computeCanonicalSeedCode(
  worldNumber: number,
  worldId: string,
  customRunSeed?: string
): string {
  const cleanId = worldId
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()
    .slice(0, 6);
  const baseTag = customRunSeed?.trim()
    ? `${customRunSeed.trim().toUpperCase()}-${worldNumber}-${worldId}`
    : `SKB-V3-${worldNumber}-${worldId}`;
  const hex = hashString(baseTag).toString(16).toUpperCase().padStart(8, '0');
  const numStr = String(worldNumber).padStart(3, '0');
  return `SKB-${numStr}-${cleanId}-${hex.slice(0, 6)}`;
}

export interface ProceduralLevelOptions {
  id: string;
  name: string;
  theme: WorldTheme;
  seedInput: string | number;
  worldNumber?: number;
  totalWorlds?: number;
  archetype?: LayoutArchetype;
  styleTags?: readonly string[];
}

/**
 * Thuật toán kiến tạo địa hình & chướng ngại vật nhảy dựa trên Hạt Giống (Seed-Driven Terrain & Obstacle Engine):
 * - Mỗi màn chơi có trạng thái `seedState` riêng biệt điều khiển:
 *   1) Nhịp độ cao các bậc nhảy (Vertical Cadence)
 *   2) Kiến trúc hình học 10 kiểu (Archetype Topology)
 *   3) Độ hẹp bệ đứng & biên độ nhảy ngang tăng dần theo `worldNumber` (từ Medium ở Màn 1 đến Grandmaster ở Màn 100)
 *   4) Các tổ hợp chướng ngại vật nhảy (Đá sụp đổ K, Băng trượt I + Gai ^, Đệm lò xo trên không B, Gió lốc đảo chiều W/M, Bục 1 chiều P)
 *   5) Cổng Liên Thông Thế Giới ở Đỉnh Màn 6 và Hố Rơi Liên Thông ở Đáy Màn 1 (cho phép leo/rơi xuyên suốt 100 Thế Giới).
 */
export function generateProceduralLevel(opts: ProceduralLevelOptions): LevelData {
  const worldNumber = opts.worldNumber ?? 1;
  const totalWorlds = opts.totalWorlds ?? 100;
  const seedCode =
    typeof opts.seedInput === 'string' && opts.seedInput.startsWith('SKB-')
      ? opts.seedInput
      : computeCanonicalSeedCode(worldNumber, opts.id, String(opts.seedInput));

  const numericSeed = hashString(`${seedCode}::${worldNumber}::${opts.id}`);
  const rng = new SeededRng(numericSeed);
  const diffMeta = computeDifficultyMeta(worldNumber);
  const diffRatio = diffMeta.ratio;

  const primaryArchetype: LayoutArchetype =
    opts.archetype ??
    ALL_ARCHETYPES[(numericSeed + worldNumber * 3) % ALL_ARCHETYPES.length] ??
    'zigzag-classic';

  const tags = opts.styleTags ?? [];
  const hasIce =
    tags.includes('ice') ||
    opts.theme.includes('ice') ||
    opts.theme.includes('frozen') ||
    primaryArchetype === 'glacial-slalom' ||
    (worldNumber >= 35 && (numericSeed & 3) === 1);
  const hasBounce =
    tags.includes('bounce') ||
    primaryArchetype === 'pinball-shaft' ||
    primaryArchetype === 'canyon-wallbounce' ||
    primaryArchetype === 'chaos-sanctum' ||
    (numericSeed & 7) === 2;
  const hasWind =
    tags.includes('wind') ||
    primaryArchetype === 'pinball-shaft' ||
    primaryArchetype === 'crosswind-citadel' ||
    primaryArchetype === 'chaos-sanctum' ||
    worldNumber >= 28;
  const hasSpikes =
    tags.includes('spikes') ||
    primaryArchetype === 'chaos-sanctum' ||
    worldNumber >= 12;
  const hasCrumble =
    tags.includes('crumble') ||
    primaryArchetype === 'crumble-gauntlet' ||
    primaryArchetype === 'chaos-sanctum' ||
    worldNumber >= 18;
  const hasPlatform =
    tags.includes('platform') ||
    primaryArchetype === 'spiral-staircase' ||
    primaryArchetype === 'sky-archipelago' ||
    primaryArchetype === 'twin-towers' ||
    worldNumber >= 25;

  const obstacleLabels: string[] = [];
  if (hasCrumble) obstacleLabels.push('Đá Cổ Sụp Đổ');
  if (hasIce) obstacleLabels.push('Băng Trơn Trượt Đà');
  if (hasWind) obstacleLabels.push('Gió Lốc Đảo Chiều');
  if (hasBounce) obstacleLabels.push('Đệm Bật Quán Tính');
  if (hasSpikes) obstacleLabels.push('Bẫy Gai Khóa Mép');
  if (hasPlatform) obstacleLabels.push('Bục Mỏng 1 Chiều');
  if (obstacleLabels.length === 0) obstacleLabels.push('Địa Hình Nhảy Chuẩn Xác');

  interface StepSpec {
    s: number;
    t: number;
    r: number;
    col: number;
    w: number;
    archetype: LayoutArchetype;
  }

  const steps: StepSpec[] = [];
  for (let s = 0; s < 6; s++) {
    const cadencePool =
      s === 0 ? SCREEN_0_CADENCES : s === 5 ? TOP_SCREEN_CADENCES : MID_SCREEN_CADENCES;
    const rows = cadencePool[(numericSeed + s * 7 + worldNumber) % cadencePool.length]!;
    const screenArch =
      s % 2 === 0
        ? primaryArchetype
        : ALL_ARCHETYPES[(ALL_ARCHETYPES.indexOf(primaryArchetype) + s * 3 + (numericSeed & 3)) % ALL_ARCHETYPES.length] ??
          primaryArchetype;

    for (let t = 0; t < rows.length; t++) {
      steps.push({ s, t, r: rows[t] ?? 10, col: 6, w: 5, archetype: screenArch });
    }
  }

  const computeWidth = (stepObj: StepSpec, randVal: number): number => {
    const isTopGoal = stepObj.s === 5 && stepObj.r === 5;
    const isEntry = stepObj.s > 0 && stepObj.r === 23;
    const isExit = stepObj.s < 5 && stepObj.r === 2;
    if (isTopGoal) return 7;
    if (isEntry) return worldNumber < 25 ? 6 : worldNumber < 65 ? 5 : 4;
    if (isExit) return worldNumber < 25 ? 5 : 4;

    if (worldNumber <= 20) {
      return 4 + (randVal < 0.55 ? 1 : 0);
    }
    if (worldNumber <= 50) {
      return 3 + Math.floor(randVal * 2.3);
    }
    if (worldNumber <= 75) {
      return 3 + (randVal < 0.42 ? 1 : 0);
    }
    if (stepObj.t === 3 && stepObj.s >= 2) {
      return 2 + (randVal < 0.35 ? 1 : 0);
    }
    return 3 + (randVal < 0.3 ? 1 : 0);
  };

  let curCol = 3 + ((numericSeed + worldNumber * 5) % 18);
  let spiralDir: -1 | 1 = rng.sign();

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i]!;
    const w = computeWidth(step, rng.next());
    curCol = Math.max(2, Math.min(29 - w, curCol));
    step.col = curCol;
    step.w = w;

    if (i + 1 < steps.length) {
      const next = steps[i + 1]!;
      const nextIsTopGoal = next.s === 5 && next.r === 5;
      const nextIsEntry = next.s > 0 && next.r === 23;
      const nextIsExit = next.s < 5 && next.r === 2;
      const nextW = computeWidth(next, 0.5);

      if (
        (next.archetype === 'spiral-staircase' || next.archetype === 'glacial-slalom') &&
        !nextIsEntry &&
        !nextIsExit &&
        !nextIsTopGoal
      ) {
        const shift = (worldNumber < 30 ? 5 : 6) + rng.int(0, 1);
        let candidate = curCol + spiralDir * shift;
        if (candidate < 3 || candidate + nextW > 28) {
          spiralDir = (spiralDir * -1) as -1 | 1;
          candidate = curCol + spiralDir * shift;
        }
        curCol = Math.max(2, Math.min(29 - nextW, candidate));
      } else if (
        next.archetype === 'canyon-wallbounce' &&
        !nextIsEntry &&
        !nextIsExit &&
        !nextIsTopGoal
      ) {
        // Đưa đảo nhảy về gần 2 vách hẻm núi nhưng vẫn trong tầm nhảy ngang (<= 5 ô trống)
        const targetLeft = curCol > 14;
        const edgeGap = rng.int(3, 5);
        const candidate = targetLeft ? curCol - nextW - edgeGap : curCol + w + edgeGap;
        curCol = Math.max(2, Math.min(29 - nextW, candidate));
      } else {
        const baseGap = nextIsEntry || nextIsExit ? 2 : worldNumber <= 22 ? 2 : 3;
        const extraGap =
          nextIsEntry || nextIsExit
            ? rng.int(0, 1)
            : Math.floor(rng.next() * (1.6 + diffRatio * 1.35));
        const edgeGap = Math.min(5, baseGap + extraGap);

        const rightCandidate = curCol + w + edgeGap;
        const leftCandidate = curCol - nextW - edgeGap;
        const canGoRight = rightCandidate + nextW <= 29;
        const canGoLeft = leftCandidate >= 2;

        let goRight = rng.chance(0.5);
        if (canGoRight && !canGoLeft) goRight = true;
        else if (!canGoRight && canGoLeft) goRight = false;

        if (goRight && canGoRight) {
          curCol = rightCandidate;
        } else if (!goRight && canGoLeft) {
          curCol = leftCandidate;
        } else {
          curCol =
            curCol < 14
              ? Math.min(29 - nextW, curCol + w + 2)
              : Math.max(2, curCol - nextW - 2);
        }
      }
    }
  }

  const screens = Array.from({ length: 6 }, () => createEmptyGrid());

  for (let s = 0; s < 6; s++) {
    const g = screens[s]!;
    for (let r = 0; r < DISPLAY.ROWS; r++) {
      setChar(g, r, 0, '#');
      setChar(g, r, DISPLAY.COLS - 1, '#');
    }

    if (s === 0) {
      const firstStep = steps[0]!;
      const spawnStart =
        firstStep.col >= 10
          ? Math.max(2, firstStep.col - 6)
          : Math.min(21, firstStep.col + firstStep.w + 1);

      if (worldNumber <= 1) {
        // Màn 1 (Chân Đại Tháp): Đáy đá liền mạch bảo vệ người mới khởi hành
        for (let c = 0; c < DISPLAY.COLS; c++) {
          setChar(g, 22, c, '#');
          setChar(g, 23, c, '#');
        }
      } else {
        // Từ Màn 2..100: Mở Hố Rơi Liên Thông Thế Giới ở đáy Tầng 1 (chỉ giữ thềm đá quanh điểm đáp)
        // Nếu người chơi rơi trượt xuống hố này sẽ rơi thẳng về Tầng 6 của Thế Giới phía dưới!
        const safeLeft = Math.max(1, spawnStart - 2);
        const safeRight = Math.min(30, spawnStart + 9);
        for (let c = safeLeft; c <= safeRight; c++) {
          setChar(g, 22, c, '#');
          setChar(g, 23, c, '#');
        }
      }

      for (let c = spawnStart; c < spawnStart + 7; c++) {
        setChar(g, 21, c, '#');
      }
      setChar(g, 20, spawnStart + 3, 'S');
    }

    if (s === 5) {
      const topStep = steps[steps.length - 1]!;
      const gateLeft = Math.max(2, topStep.col - 1);
      const gateRight = Math.min(29, topStep.col + topStep.w);
      for (let c = 0; c < DISPLAY.COLS; c++) {
        // Nếu chưa phải Màn 100 cuối cùng, mở Cổng Trời Liên Thông ở trần Tầng 6 ngay phía trên Đỉnh
        if (worldNumber < totalWorlds && c >= gateLeft && c <= gateRight) {
          continue;
        }
        setChar(g, 0, c, '#');
      }
    }
  }

  for (let i = 0; i < steps.length; i++) {
    const { s, t, r, col, w, archetype } = steps[i]!;
    const g = screens[s]!;
    const isTopGoal = s === 5 && r === 5;
    const isBoundaryStep = r === 2 || r === 23;

    // Chọn vật liệu khối đứng dựa vào Seed & Archetype
    let mat = '#';
    if (!isBoundaryStep && !isTopGoal) {
      if ((archetype === 'spiral-staircase' || archetype === 'sky-archipelago') && t % 2 === 1) {
        mat = 'P';
      } else if (
        hasCrumble &&
        (archetype === 'crumble-gauntlet' ||
          t === 2 ||
          t === 4 ||
          (worldNumber >= 55 && t === 1))
      ) {
        mat = 'K';
      } else if (hasIce && (archetype === 'glacial-slalom' || (i + numericSeed) % 3 === 1)) {
        mat = 'I';
      } else if (hasPlatform && (i + numericSeed) % 4 === 2) {
        mat = 'P';
      }
    }

    for (let c = col; c < col + w; c++) {
      if (c >= 1 && c <= 30) {
        const isSafeAnchor =
          mat === 'K' && (w >= 4 ? c === col || c === col + w - 1 : c === col);
        setChar(g, r, c, isSafeAnchor ? '#' : mat);
      }
    }

    if (!isBoundaryStep && mat !== 'P' && mat !== 'K' && r + 1 < 23) {
      const subStart = w >= 4 ? col + 1 : col;
      const subEnd = w >= 4 ? col + w - 1 : col + w;
      for (let c = subStart; c < subEnd; c++) {
        if (c >= 1 && c <= 30) {
          setChar(g, r + 1, c, '#');
        }
      }
    }

    // Khối Nảy Bouncy (B) trên đảo hoặc trên vách tường (cho Canyon Wall-Bounce)
    if (hasBounce && !isTopGoal && (t === 2 || t === 5)) {
      const bCol = col + Math.floor(w / 2);
      setChar(g, r, bCol, 'B');
    }
    if (archetype === 'canyon-wallbounce' && !isBoundaryStep && !isTopGoal && t % 2 === 1) {
      const wallCol = col < 15 ? 1 : 30;
      if (g[r - 1]?.[wallCol] === '.') {
        setChar(g, r - 1, wallCol, 'B');
      }
    }

    // Chướng ngại Gai bẫy (^) sinh theo Seed (luôn đặt ở 1 ô mép xa để không chắn đường nhảy)
    const shouldPlaceSpike =
      !isBoundaryStep &&
      !isTopGoal &&
      w >= 4 &&
      s > 0 &&
      ((hasSpikes && (t === 2 || t === 4)) ||
        (worldNumber >= 20 && t === 4) ||
        (worldNumber >= 60 && (t === 2 || t === 5)));
    if (shouldPlaceSpike) {
      const prevStep = steps[i - 1];
      const spikeCol = prevStep && prevStep.col < col ? col + w - 1 : col;
      setChar(g, r - 1, spikeCol, '^');
    }

    // Rương Kho Báu Easter Egg (E) ở Màn 5 (s === 4)
    if (s === 4 && t === Math.min(4, steps.filter((st) => st.s === 4).length - 2)) {
      const eggCol = col + (w >= 4 ? w - 2 : Math.floor(w / 2));
      setChar(g, r - 1, eggCol, 'E');
    }

    // Cổng/Đài Thăng Hoa Liên Kết Thế Giới (G) ở Đỉnh Màn 6 (s === 5, r === 5)
    if (isTopGoal) {
      const gCol = col + Math.floor(w / 2);
      setChar(g, r - 1, gCol, 'G');
    }

    // Luồng Gió (W / M) sinh theo Seed
    if (
      hasWind &&
      (t === 1 || t === 4 || (worldNumber >= 50 && t === 2)) &&
      i + 1 < steps.length
    ) {
      const nextStep = steps[i + 1]!;
      if (nextStep.s === s) {
        // Ở các màn Crosswind Citadel hoặc level cao, gió có thể thổi ngược tạo thử thách căn lực
        const reverseWind =
          archetype === 'crosswind-citadel' || (worldNumber >= 45 && (i + numericSeed) % 2 === 0);
        const wDir = nextStep.col > col ? (reverseWind ? 'M' : 'W') : reverseWind ? 'W' : 'M';
        const windCol = nextStep.col > col ? col + w : col - 1;
        if (windCol >= 2 && windCol <= 29 && g[r - 2]?.[windCol] === '.') {
          setChar(g, r - 2, windCol, wDir);
        }
      }
    }
  }

  const seedState: LevelSeedState = {
    seedCode,
    numericSeed,
    worldNumber,
    totalWorlds,
    difficultyLabel: diffMeta.label,
    difficultyRating: diffMeta.rating,
    archetypeLabel: ARCHETYPE_LABELS[primaryArchetype],
    obstacleLabels
  };

  return {
    id: opts.id,
    name: opts.name,
    version: 3,
    tileSize: DISPLAY.TILE_SIZE,
    theme: opts.theme,
    seedState,
    legend: STANDARD_LEGEND,
    screens: screens.map((g) => ({ rows: g.map((row) => row.join('')) }))
  };
}

/**
 * Tạo một LevelData ngẫu nhiên hoàn chỉnh từ mã Seed bất kỳ (hỗ trợ chuỗi tầng liên kết vô tận: random-SEED, random-SEED__2, ...).
 */
export function generateRandomMapFromSeed(seedStr: string): LevelData {
  const parts = seedStr.trim().split('__');
  const baseSeed = parts[0] || String(Date.now());
  const stageNum = Math.max(1, parseInt(parts[1] ?? '1', 10) || 1);

  const stageSeedKey = `${baseSeed}#STAGE_${stageNum}`;
  const num = hashString(stageSeedKey);
  const rng = new SeededRng(num);
  const theme = rng.pick(ALL_WORLD_THEMES);
  const archetype = rng.pick(ALL_ARCHETYPES);
  const stylePool = ['bounce', 'ice', 'wind', 'spikes', 'crumble', 'platform'] as const;
  const tags: string[] = [];
  for (const tag of stylePool) {
    if (rng.chance(0.45 + Math.min(0.35, stageNum * 0.03))) tags.push(tag);
  }

  // Độ khó tăng dần theo số màn ngẫu nhiên đã leo qua
  const effectiveWorldNum = Math.min(100, 15 + (stageNum - 1) * 8);

  return generateProceduralLevel({
    id: `random-${seedStr}`,
    name: `Màn Seed #${baseSeed.slice(0, 8).toUpperCase()} - Tầng Thế Giới ${stageNum}`,
    theme,
    seedInput: stageSeedKey,
    worldNumber: effectiveWorldNum,
    totalWorlds: 999,
    archetype,
    styleTags: tags
  });
}
