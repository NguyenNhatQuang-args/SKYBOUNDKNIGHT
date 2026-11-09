import { DISPLAY } from '../constants';
import { LevelData, TileKind } from './levelTypes';

const VALID_TILE_KINDS: ReadonlySet<TileKind> = new Set<TileKind>([
  'empty',
  'solid',
  'ice',
  'bouncy',
  'platform',
  'crumble',
  'hazard',
  'wind-left',
  'wind-right',
  'checkpoint',
  'spawn',
  'goal',
  'easter-egg'
]);

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Kiểm tra cấu trúc dữ liệu màn chơi JSON:
 * - Kích thước lưới mỗi màn hình đúng 32x24 (tileSize = 16)
 * - Tất cả ký tự nằm trong legend (hoặc '.' mặc định là empty)
 * - Có đúng 1 vị trí spawn ('S') trên toàn bộ level
 * Hiển thị lỗi chi tiết ra console.error nếu không hợp lệ.
 */
export function validateLevelData(data: unknown, sourceLabel = 'unknown'): ValidationResult {
  const errors: string[] = [];

  if (!data || typeof data !== 'object') {
    errors.push(`[${sourceLabel}] Dữ liệu JSON không phải là một object hợp lệ.`);
    logValidationErrors(sourceLabel, errors);
    return { valid: false, errors };
  }

  const level = data as Partial<LevelData>;

  if (!level.id || typeof level.id !== 'string') {
    errors.push(`[${sourceLabel}] Thiếu trường "id" kiểu chuỗi.`);
  }
  if (!level.name || typeof level.name !== 'string') {
    errors.push(`[${sourceLabel}] Thiếu trường "name" kiểu chuỗi.`);
  }
  if (level.tileSize !== DISPLAY.TILE_SIZE) {
    errors.push(
      `[${sourceLabel}] "tileSize" phải bằng ${DISPLAY.TILE_SIZE}, nhận được: ${String(level.tileSize)}.`
    );
  }
  if (!level.legend || typeof level.legend !== 'object') {
    errors.push(`[${sourceLabel}] Thiếu bảng ánh xạ ký tự "legend".`);
  } else {
    for (const [charKey, kind] of Object.entries(level.legend)) {
      if (charKey.length !== 1) {
        errors.push(`[${sourceLabel}] Ký tự trong legend phải có độ dài 1: "${charKey}".`);
      }
      if (!VALID_TILE_KINDS.has(kind)) {
        errors.push(
          `[${sourceLabel}] Loại tile "${String(kind)}" của ký tự "${charKey}" không hợp lệ.`
        );
      }
    }
  }

  if (!Array.isArray(level.screens) || level.screens.length === 0) {
    errors.push(`[${sourceLabel}] Danh sách "screens" phải là mảng có ít nhất 1 màn hình.`);
  } else {
    let spawnCount = 0;
    const legend = level.legend ?? {};

    for (let sIdx = 0; sIdx < level.screens.length; sIdx++) {
      const screen = level.screens[sIdx];
      if (!screen || !Array.isArray(screen.rows)) {
        errors.push(`[${sourceLabel}] Màn hình #${sIdx} thiếu mảng "rows".`);
        continue;
      }

      if (screen.rows.length !== DISPLAY.ROWS) {
        errors.push(
          `[${sourceLabel}] Màn hình #${sIdx} phải có đúng ${DISPLAY.ROWS} hàng, hiện có ${screen.rows.length} hàng.`
        );
      }

      for (let rIdx = 0; rIdx < screen.rows.length; rIdx++) {
        const rowStr = screen.rows[rIdx];
        if (typeof rowStr !== 'string') {
          errors.push(`[${sourceLabel}] Màn #${sIdx}, hàng #${rIdx} không phải chuỗi.`);
          continue;
        }

        if (rowStr.length !== DISPLAY.COLS) {
          errors.push(
            `[${sourceLabel}] Màn #${sIdx}, hàng #${rIdx} phải có đúng ${DISPLAY.COLS} ký tự, hiện có ${rowStr.length} ký tự.`
          );
        }

        for (let cIdx = 0; cIdx < rowStr.length; cIdx++) {
          const ch = rowStr[cIdx] ?? '.';
          if (ch === '.') continue;

          const mapped = legend[ch];
          if (!mapped) {
            errors.push(
              `[${sourceLabel}] Ký tự lạ "${ch}" tại màn #${sIdx}, hàng #${rIdx}, cột #${cIdx} chưa được khai báo trong legend.`
            );
          } else if (mapped === 'spawn') {
            spawnCount++;
          }
        }
      }
    }

    if (spawnCount !== 1) {
      errors.push(
        `[${sourceLabel}] Màn chơi phải có ĐÚNG 1 điểm spawn ("S"), nhưng tìm thấy ${spawnCount} điểm.`
      );
    }
  }

  if (errors.length > 0) {
    logValidationErrors(sourceLabel, errors);
    return { valid: false, errors };
  }

  console.info(
    `%c[LevelValidator] Màn chơi "${level.id}" (${level.name}) hợp lệ (${level.screens?.length ?? 0} màn hình).`,
    'color: #52b788; font-weight: bold;'
  );
  return { valid: true, errors: [] };
}

function logValidationErrors(sourceLabel: string, errors: string[]): void {
  console.group(`%c[LevelValidator] LỖI DỮ LIỆU MÀN CHƠI: ${sourceLabel}`, 'color: #ff4d6d; font-weight: bold;');
  for (const err of errors) {
    console.error(err);
  }
  console.groupEnd();
}
