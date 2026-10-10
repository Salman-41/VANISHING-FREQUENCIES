"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import type { AudioEngine } from "./engine";

type AudioOwner = { engine: AudioEngine | null };
const AudioContextValue = createContext<AudioOwner | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  // Retain one engine across routes, but let the listening room supply its code on first use.
  const [owner] = useState<AudioOwner>(() => ({ engine: null }));
  const disposal = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (disposal.current) clearTimeout(disposal.current);
    const visibility = () => owner.engine?.handleVisibility();
    document.addEventListener("visibilitychange", visibility);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      // Strict Mode replays effects in development. Let that replay cancel disposal.
      disposal.current = setTimeout(() => owner.engine?.dispose(), 0);
    };
  }, [owner]);
  useEffect(() => {
    if (pathname !== "/soundscapes") owner.engine?.leavePage();
  }, [pathname, owner]);
  return <AudioContextValue.Provider value={owner}>{children}</AudioContextValue.Provider>;
}

export function useAudio(createEngine: () => AudioEngine) {
  const owner = useContext(AudioContextValue);
  if (!owner) throw new Error("Audio controls require AudioProvider");
  // Deterministic, once-per-tree initialization. The constructor performs no browser work.
  const engine = owner.engine ??= createEngine();
  const state = useSyncExternalStore(engine.subscribe, engine.getSnapshot, engine.getServerSnapshot);
  return { engine, state };
}
