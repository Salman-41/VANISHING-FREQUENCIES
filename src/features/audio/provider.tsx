"use client";

import { createContext, useContext, useEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AudioEngine } from "./engine";

const AudioContextValue = createContext<AudioEngine | null>(null);

export function AudioProvider({ children }: { children: ReactNode }) {
  const [engine] = useState(() => new AudioEngine());
  const disposal = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (disposal.current) clearTimeout(disposal.current);
    document.addEventListener("visibilitychange", engine.handleVisibility);
    return () => {
      document.removeEventListener("visibilitychange", engine.handleVisibility);
      // Strict Mode replays effects in development. Let that replay cancel disposal.
      disposal.current = setTimeout(() => engine.dispose(), 0);
    };
  }, [engine]);
  useEffect(() => {
    if (pathname !== "/soundscapes") engine.leavePage();
  }, [pathname, engine]);
  return <AudioContextValue.Provider value={engine}>{children}</AudioContextValue.Provider>;
}

export function useAudio() {
  const engine = useContext(AudioContextValue);
  if (!engine) throw new Error("Audio controls require AudioProvider");
  const state = useSyncExternalStore(engine.subscribe, engine.getSnapshot, engine.getServerSnapshot);
  return { engine, state };
}
