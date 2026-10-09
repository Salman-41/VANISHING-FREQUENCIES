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
  return kind === "mountain"
    ? clamp01((progress - 0.82) / 0.17)
    : 1;
}

export function ridgeHeight(x: number, z: number) {
  const ridge = Math.pow(1 - Math.abs(Math.sin(x * 0.17 + Math.sin(z * 0.12) * 0.8)), 1.4);
  const spine = 1 - Math.abs(Math.sin(z * 0.13 + x * 0.025));
  const serration = 0.76 + Math.abs(Math.sin(x * 0.81 + z * 0.27)) * 0.24;
  return 0.4 + ridge * 6.2 * spine * serration + Math.sin(x * 0.73 + z * 0.35) * 0.28;
}

/** Deterministic original scenery, never sampled elevation or wildlife data. */
export function particlePositions(count: number) {
  let seed = 7351;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  return Float32Array.from({ length: count * 3 }, (_, i) =>
    i % 3 === 0 ? (random() - 0.5) * 38 : i % 3 === 1 ? random() * 14 - 2 : random() * 42 - 28,
  );
}
