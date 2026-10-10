import { createStore } from "zustand/vanilla";
import type { Preferences } from "./contract";
export type { Preferences } from "./contract";
export const defaults: Preferences = {
  version: 1,
  readWithoutMotion: false,
  lighterMedia: false,
};
export const preferenceKey = "vf.preferences.v1";

export function parsePreferences(value: string | null): Preferences {
  try {
    const input: unknown = JSON.parse(value ?? "null");
    // Keep the exact strict contract without importing a schema runtime into every route.
    if (typeof input !== "object" || input === null || Array.isArray(input)) return { ...defaults };
    const stored = input as Record<string, unknown>;
    if (Object.keys(stored).length !== 3 || stored.version !== 1 ||
      typeof stored.readWithoutMotion !== "boolean" || typeof stored.lighterMedia !== "boolean")
      return { ...defaults };
    return { version: 1, readWithoutMotion: stored.readWithoutMotion, lighterMedia: stored.lighterMedia };
  } catch {
    return { ...defaults };
  }
}
export function createPreferenceStore() {
  return createStore<
    Preferences & {
      setPreference: (
        key: "readWithoutMotion" | "lighterMedia",
        value: boolean,
      ) => void;
    }
  >()((set) => ({
    ...defaults,
    setPreference: (key, value) => set({ [key]: value }),
  }));
}
