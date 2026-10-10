export type SceneKind = "mountain" | "ocean";
export type Quality = "balanced" | "light";

/** Upper bounds, never a claim that device hints measure GPU speed. */
export function sceneBudget(width: number, height: number, dpr: number, light: boolean) {
  const low = light || width < 768;
  const pixelCap = low ? 450_000 : 1_600_000;
  return {
    dpr: Math.max(0.5, Math.min(dpr, low ? 1 : 1.5, Math.sqrt(pixelCap / Math.max(1, width * height)))),
    segments: low ? 48 : 96,
    rows: low ? 32 : 64,
    particles: low ? 80 : 240,
  };
}

export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
export const elapsedProgress = (start: number, now: number, durationMs: number) => clamp01((now - start) / durationMs);
export function sceneMix(kind: SceneKind, progress: number) {
  // The mountain dissolves on exit; the ocean receives the same underwater state.
  if (kind === "ocean") return 1;
  const t = clamp01((progress - 0.82) / 0.17);
  return t * t * (3 - 2 * t);
}

export function ridgeHeight(x: number, z: number) {
  // Asymmetric summits and a near shoulder, with broad readable faces at 48×32.
  // This authored composition echoes the photo's ridge hierarchy, not its geography.
  const peaks = Math.max(0,
    6.3 - Math.abs(x - 5.5) * 0.58 - Math.abs(z + 8) * 0.62,
    4.9 - Math.abs(x + 10) * 0.48 - Math.abs(z + 12) * 0.72,
    3.8 - Math.abs(x - 17) * 0.68 - Math.abs(z + 4) * 0.8,
    3.5 - Math.abs(x + 11) * 0.4 - Math.abs(z - 7) * 0.42);
  const fold = Math.abs(Math.sin(x * 0.83 + z * 0.31)) * 0.22
    + Math.abs(Math.sin(x * 1.7 - z * 0.62)) * 0.08;
  return 0.22 + Math.max(0, peaks - fold) + Math.sin(x * 0.23 + z * 0.17) * 0.08;
}

/** Deterministic original scenery, never sampled elevation or wildlife data. */
export function particlePositions(count: number) {
  let seed = 7351;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  return Float32Array.from({ length: count * 3 }, (_, i) =>
    i % 3 === 0 ? (random() - 0.5) * 38 : i % 3 === 1 ? random() * 14 - 2 : random() * 42 - 28,
  );
}
