/**
 * Bộ sinh số ngẫu nhiên tất định (Mulberry32) – cùng seed luôn cho cùng kết quả,
 * giúp map sinh ngẫu nhiên có thể tái tạo chính xác (lưu tiến trình, bảng xếp hạng theo seed).
 */
export class SeededRng {
  private state: number;

  constructor(seed: number) {
    this.state = seed >>> 0 || 0x9e3779b9;
  }

  /** Số thực trong [0, 1). */
  public next(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let t = this.state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /** Số nguyên trong [min, max] (bao gồm 2 đầu). */
  public int(min: number, max: number): number {
    return min + Math.floor(this.next() * (max - min + 1));
  }

  public chance(p: number): boolean {
    return this.next() < p;
  }

  public pick<T>(items: readonly T[]): T {
    const item = items[Math.floor(this.next() * items.length)];
    if (item === undefined) {
      throw new Error('SeededRng.pick: danh sách rỗng');
    }
    return item;
  }

  public sign(): -1 | 1 {
    return this.next() < 0.5 ? -1 : 1;
  }
}

/** Băm chuỗi thành số nguyên 32-bit (FNV-1a). */
export function hashString(text: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}
