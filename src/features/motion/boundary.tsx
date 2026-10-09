"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
  type RefObject,
} from "react";
import { usePreferences } from "@/features/preferences/provider";
import { chapters } from "@/lib/site";
import Link from "next/link";

type ControllerProps = { root: RefObject<HTMLDivElement | null> };
/** Server-rendered children stay visible; only the disposable enhancement is deferred. */
export function HomepageMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  const prefs = usePreferences();
  const [Controller, setController] =
    useState<ComponentType<ControllerProps> | null>(null);
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const data = matchMedia("(prefers-reduced-data: reduce)");
    let cancelled = false;
    const sync = () => {
      const allow =
        !motion.matches &&
        !data.matches &&
        !prefs.readWithoutMotion &&
        !prefs.lighterMedia;
      setEnabled(allow);
      if (allow)
        void import("./controller")
          .then((module) => {
            if (!cancelled) setController(() => module.MotionController);
          })
          .catch(() => {
            /* Native reading is the complete fallback. */
          });
    };
    // Parent preference hydration completes before this deferred check.
    const timer = window.setTimeout(sync, 0);
    motion.addEventListener("change", sync);
    data.addEventListener("change", sync);
    return () => {
      cancelled = true;
      clearTimeout(timer);
      motion.removeEventListener("change", sync);
      data.removeEventListener("change", sync);
    };
  }, [prefs.readWithoutMotion, prefs.lighterMedia]);
  return (
    <div className="documentary" ref={root}>
      {children}
      <nav className="reading-margin" aria-label="Reading position" hidden>
        <span className="reading-label">Reading position</span>
        <ol>
          {chapters.map((chapter, index) => (
            <li key={chapter.id}>
              <Link
                href={`#${chapter.id}`}
                prefetch={false}
                aria-label={`Chapter ${String(index).padStart(2, "0")}: ${chapter.label}`}
              >
                {String(index).padStart(2, "0")}
              </Link>
            </li>
          ))}
        </ol>
        <span className="reading-track" aria-hidden="true">
          <span className="reading-fill" />
        </span>
      </nav>
      {enabled && Controller ? <Controller root={root} /> : null}
    </div>
  );
}
