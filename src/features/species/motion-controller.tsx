"use client";
import type { RefObject } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP);
export function SpeciesMotionController({ root, revision }: { root: RefObject<HTMLDivElement | null>; revision: string }) {
  useGSAP(() => {
    if (!root.current) return;
    // Photos acknowledge a committed selection; all text and links stay immediately available.
    gsap.fromTo(root.current.querySelectorAll("[data-species-image]"), { opacity: 0.78, y: 8 },
      { opacity: 1, y: 0, duration: 0.24, stagger: 0.02, ease: "power2.out", clearProps: "opacity,transform" });
  }, { scope: root, dependencies: [revision], revertOnUpdate: true });
  return null;
}
