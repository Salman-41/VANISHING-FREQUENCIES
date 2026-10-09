"use client";

import { Component, useEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import dynamic from "next/dynamic";
import type { SceneKind, Quality } from "./policy";
import type { SceneCommands } from "./renderer";

const Renderer = dynamic(() => import("./renderer"), { ssr: false, loading: () => null });
type Slot = { kind: SceneKind; frame: HTMLElement; controls: HTMLElement };

class SceneBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

/** Small eager shell; Three/R3F/Drei are fetched only after explicit activation. */
export function ImmersiveScenes({ root, allowed }: { root: RefObject<HTMLDivElement | null>; allowed: boolean }) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [enabled, setEnabled] = useState(false);
  const [visible, setVisible] = useState<SceneKind | null>(null);
  const [quality, setQuality] = useState<Quality>("balanced");
  const [status, setStatus] = useState<"loading" | "ready" | "failed">("loading");
  const [attempt, setAttempt] = useState(0);
  const [preview, setPreview] = useState(false);
  const commands = useRef<SceneCommands | null>(null);
  const focusedControl = useRef<HTMLElement | null>(null);
  const active = allowed && enabled && status !== "failed" ? visible : null;

  useEffect(() => {
    const found: Slot[] = [];
    for (const kind of ["mountain", "ocean"] as const) {
      const controls = root.current?.querySelector<HTMLElement>(`[data-immersive-controls="${kind}"]`);
      const frame = controls?.parentElement?.querySelector<HTMLElement>(".media-aperture");
      if (frame && controls) found.push({ kind, frame, controls });
    }
    setSlots(found);
    const ratios = new Map<Element, number>();
    const update = () => {
      const best = document.hidden ? undefined : found
        .filter((slot) => (ratios.get(slot.frame) ?? 0) > 0)
        .sort((a, b) => (ratios.get(b.frame) ?? 0) - (ratios.get(a.frame) ?? 0))[0];
      setVisible(best?.kind ?? null);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => ratios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0));
      update();
    }, { threshold: [0, 0.01, 0.25, 0.5, 0.75, 1] });
    found.forEach((slot) => observer.observe(slot.frame));
    document.addEventListener("visibilitychange", update);
    return () => { observer.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, [root]);

  useEffect(() => {
    setPreview(false);
    if (active) setStatus("loading");
    const frame = slots.find((slot) => slot.kind === active)?.frame;
    if (!frame) return;
    frame.dataset.immersive = "active";
    // The masks belong to the photograph's independent listening aperture.
    return () => { delete frame.dataset.immersive; commands.current = null; };
  }, [active, attempt, quality, slots]);

  useEffect(() => {
    if ((!allowed || !enabled || status === "failed") && focusedControl.current &&
        document.activeElement === document.body) {
      const slot = slots.find((item) => item.controls === focusedControl.current);
      if (!allowed) slot?.frame.closest<HTMLElement>("section")?.focus({ preventScroll: true });
      else slot?.controls.querySelector<HTMLButtonElement>("button")?.focus({ preventScroll: true });
    }
  }, [allowed, enabled, status, slots]);

  const fail = () => { setStatus("failed"); setEnabled(false); };
  const activate = (kind: SceneKind) => {
    setStatus("loading"); setAttempt((n) => n + 1); setVisible(kind); setEnabled(true);
  };
  return <>
    {slots.map((slot) => createPortal(
      <div className="immersive-controls" data-scene-control={slot.kind}
        onFocusCapture={() => { focusedControl.current = slot.controls; }}>
        <p className="immersive-note" id={`scene-note-${slot.kind}`}>
          Interpretive 3D study · generated terrain and light, not mapped habitat or acoustic evidence.
          {slot.kind === "ocean" ? " The whale photograph is the verified animal reference." : " Photograph credits below apply to the photo view."}
        </p>
        <div className="immersive-actions">
          <button className="control" type="button" disabled={!allowed}
            aria-describedby={`scene-note-${slot.kind}`} aria-pressed={enabled && allowed}
            onClick={() => enabled ? setEnabled(false) : activate(slot.kind)}>
            {enabled && allowed ? "Return to photographs" : status === "failed" ? "Retry 3D study" : "Explore in 3D"}
          </button>
          {enabled && allowed && <>
            <label className="immersive-quality">Rendering
              <select value={quality} onChange={(e) => setQuality(e.target.value as Quality)}>
                <option value="balanced">Balanced</option><option value="light">Lighter 3D</option>
              </select>
            </label>
            <button className="control" type="button" disabled={active !== slot.kind || status !== "ready"}
              aria-pressed={preview} onClick={() => { commands.current?.transition(!preview); setPreview(!preview); }}>
              {preview ? "Resume scroll scene" : slot.kind === "mountain" ? "Follow the water" : "Trace the source"}
            </button>
            <button className="control" type="button" disabled={active !== slot.kind || status !== "ready" || (slot.kind === "mountain" && !preview) || (slot.kind === "ocean" && preview)}
              onClick={() => commands.current?.pulse()}>Send a visual pulse</button>
          </>}
        </div>
        <p className="immersive-status" role="status">
          {!allowed ? "Still photographs shown for reduced motion or lighter media." : status === "failed"
            ? "3D is unavailable. Photographs and the documentary remain available. You can retry."
            : enabled && active === slot.kind ? status === "loading" ? "Preparing the 3D study…" : "3D study ready. Scroll to move; pulses are silent visual illustrations."
            : "Optional scene; no audio."}
        </p>
      </div>, slot.controls, slot.kind,
    ))}
    {slots.filter((slot) => slot.kind === active).map((slot) => createPortal(
      <SceneBoundary key={`${attempt}:${quality}`} onFailure={fail}>
        <div className="immersive-layer" aria-hidden="true">
          <Renderer kind={slot.kind} quality={quality} frame={slot.frame} commands={commands}
            onReady={() => setStatus("ready")} onFailure={fail} />
          <span className="immersive-label">Interpretive environment / {slot.kind === "mountain" ? "01 → 02" : "02"}</span>
        </div>
      </SceneBoundary>, slot.frame, slot.kind,
    ))}
  </>;
}
