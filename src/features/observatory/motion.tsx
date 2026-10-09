"use client";
import { useEffect, useRef, type ReactNode } from "react";
import { usePreferences } from "@/features/preferences/provider";
import { loadMotionTools } from "@/features/motion/runtime";

export function ChartMotion({ children, revision }: { children: ReactNode; revision: string }) {
  const root = useRef<HTMLDivElement>(null);
  const { readWithoutMotion, lighterMedia } = usePreferences();
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const data = matchMedia("(prefers-reduced-data: reduce)");
    let cancelled = false, generation = 0;
    let revert: (() => void) | undefined;
    const sync = () => {
      const run = ++generation;
      revert?.(); revert = undefined;
      if (cancelled || motion.matches || data.matches || readWithoutMotion || lighterMedia) return;
      void loadMotionTools().then(tools => {
        if (!tools || cancelled || run !== generation || !root.current) return;
        const context = tools.gsap.context(() => {
          // Immediately replaced exact geometry. No animated years, values, line drawing or shape morphing.
          tools.gsap.fromTo(root.current, { opacity: 0.86 }, { opacity: 1, duration: 0.16, ease: "power2.out", clearProps: "opacity" });
        }, root);
        revert = () => context.revert();
      });
    };
    sync(); motion.addEventListener("change", sync); data.addEventListener("change", sync);
    return () => { cancelled = true; ++generation; revert?.(); motion.removeEventListener("change", sync); data.removeEventListener("change", sync); };
  }, [revision, readWithoutMotion, lighterMedia]);
  return <div className="observatory-chart-motion" ref={root} data-chart-motion>{children}</div>;
}
