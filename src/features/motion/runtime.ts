/** Opt-in enhancement only. Feature callers own every instance and its cleanup. */
export async function loadMotionTools() {
  const unavailable = () =>
    typeof window === "undefined" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    matchMedia("(prefers-reduced-data: reduce)").matches ||
    document.documentElement.dataset.motion === "reduced" ||
    document.documentElement.dataset.media === "lighter";
  if (unavailable()) return null;
  // Navigation and chart fades need only core GSAP. The homepage controller
  // owns its ScrollTrigger, React hook and Lenis imports independently.
  const module = await import("gsap").catch(() => null);
  if (!module || unavailable()) return null;
  return { gsap: module.gsap };
}
