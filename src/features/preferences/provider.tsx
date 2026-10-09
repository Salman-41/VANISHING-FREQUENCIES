"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useStore } from "zustand";
import { AudioProvider } from "@/features/audio/provider";
import {
  createPreferenceStore,
  parsePreferences,
  preferenceKey,
} from "./store";

type Store = ReturnType<typeof createPreferenceStore>;
const PreferenceContext = createContext<Store | null>(null);
export function SiteProviders({ children }: { children: ReactNode }) {
  // One store per tree; no mutable cross-request singleton.
  const [store] = useState(createPreferenceStore);
  useEffect(() => {
    try {
      store.setState(parsePreferences(localStorage.getItem(preferenceKey)));
    } catch {
      /* Storage is optional. */
    }
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const data = matchMedia("(prefers-reduced-data: reduce)");
    const sync = () => {
      const prefs = store.getState();
      document.documentElement.dataset.motion =
        motion.matches || prefs.readWithoutMotion ? "reduced" : "standard";
      document.documentElement.dataset.media =
        data.matches || prefs.lighterMedia ? "lighter" : "standard";
      try {
        localStorage.setItem(
          preferenceKey,
          JSON.stringify({
            version: 1,
            readWithoutMotion: prefs.readWithoutMotion,
            lighterMedia: prefs.lighterMedia,
          }),
        );
      } catch {
        /* Private/blocked storage retains session preferences. */
      }
    };
    sync();
    const unsubscribe = store.subscribe(sync);
    motion.addEventListener("change", sync);
    data.addEventListener("change", sync);
    return () => {
      unsubscribe();
      motion.removeEventListener("change", sync);
      data.removeEventListener("change", sync);
    };
  }, [store]);
  return (
    <PreferenceContext.Provider value={store}>
      <AudioProvider>{children}</AudioProvider>
    </PreferenceContext.Provider>
  );
}
export function usePreferences() {
  const store = useContext(PreferenceContext);
  if (!store) throw new Error("Preferences require SiteProviders");
  return useStore(store);
}
