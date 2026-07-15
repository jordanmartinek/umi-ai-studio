/**
 * A small seeded PRNG (mulberry32) so bracelet concept generation is
 * reproducible for a given (selections, seed) pair but varies meaningfully
 * when the user clicks "Regenerate" (which just bumps the seed).
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Hashes a string into a positive 32-bit integer, for turning selections into a stable seed. */
export function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export interface SeededRandom {
  next(): number;
  pick<T>(items: readonly T[]): T;
  pickMany<T>(items: readonly T[], count: number): T[];
  int(min: number, max: number): number;
}

export function createSeededRandom(seed: number): SeededRandom {
  const rand = mulberry32(seed);
  return {
    next: rand,
    pick<T>(items: readonly T[]): T {
      return items[Math.floor(rand() * items.length)];
    },
    pickMany<T>(items: readonly T[], count: number): T[] {
      const pool = [...items];
      const result: T[] = [];
      const n = Math.min(count, pool.length);
      for (let i = 0; i < n; i++) {
        const idx = Math.floor(rand() * pool.length);
        result.push(pool.splice(idx, 1)[0]);
      }
      return result;
    },
    int(min: number, max: number): number {
      return Math.floor(rand() * (max - min + 1)) + min;
    },
  };
}
