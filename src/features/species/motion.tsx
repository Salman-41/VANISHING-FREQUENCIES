"use client";
import { useEffect, useRef, useState, type ComponentType, type ReactNode, type RefObject } from "react";
import { usePreferences } from "../preferences/provider";
type Props = { root: RefObject<HTMLDivElement | null>; revision: string };
export function SpeciesMotion({ children, revision }: { children: ReactNode; revision: string }) {
  const root = useRef<HTMLDivElement>(null);
  const { readWithoutMotion, lighterMedia } = usePreferences();
  const [Controller, setController] = useState<ComponentType<Props> | null>(null);
  const [allowed, setAllowed] = useState(false);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const data = matchMedia("(prefers-reduced-data: reduce)");
    let cancelled = false;
    const sync = () => {
      const enable = !motion.matches && !data.matches && !readWithoutMotion && !lighterMedia;
      setAllowed(enable);
      if (enable) void import("./motion-controller").then((module) => {
        if (!cancelled) setController(() => module.SpeciesMotionController);
      }).catch(() => { /* The reading path does not depend on motion. */ });
    };
    const timer = setTimeout(sync, 0);
    motion.addEventListener("change", sync);
    data.addEventListener("change", sync);
    return () => { cancelled = true; clearTimeout(timer); motion.removeEventListener("change", sync); data.removeEventListener("change", sync); };
  }, [readWithoutMotion, lighterMedia]);
  return <div ref={root} className="species-motion" data-species-motion={allowed ? "enabled" : "reduced"}>
    {children}{allowed && Controller ? <Controller root={root} revision={revision} /> : null}
  </div>;
}
