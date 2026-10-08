/** Opt-in enhancement only. Call after preference checks; dispose returned scope on route exit. */
export async function loadMotionTools() {
  if (
    typeof window === "undefined" ||
    matchMedia("(prefers-reduced-motion: reduce)").matches ||
    document.documentElement.dataset.motion === "reduced"
  )
    return null;
  const [{ gsap }, { ScrollTrigger }, { useGSAP }, { default: Lenis }] =
    await Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
      import("@gsap/react"),
      import("lenis"),
    ]);
  gsap.registerPlugin(ScrollTrigger, useGSAP);
  // No Lenis instance/global ticker starts here. Feature callers own lifecycle and preference changes.
  return { gsap, ScrollTrigger, Lenis };
}
