/** Opt-in enhancement only. Feature callers own every instance and its cleanup. */
export async function loadMotionTools() {
  const unavailable = () =>
    typeof window === "undefined" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    matchMedia("(prefers-reduced-data: reduce)").matches ||
    document.documentElement.dataset.motion === "reduced" ||
    document.documentElement.dataset.media === "lighter";
  if (unavailable()) return null;
  const modules = await Promise.all([
    import("gsap"),
    import("gsap/ScrollTrigger"),
    import("@gsap/react"),
    import("lenis"),
  ]).catch(() => null);
  if (!modules || unavailable()) return null;
  const [{ gsap }, { ScrollTrigger }, { useGSAP }, { default: Lenis }] =
    modules;
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // Registration starts no scroll controller or global ticker.
  return { gsap, ScrollTrigger, Lenis };
}
