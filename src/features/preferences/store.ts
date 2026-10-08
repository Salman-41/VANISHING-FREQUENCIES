import { createStore } from "zustand/vanilla";
import { z } from "zod";

export const PreferencesSchema = z.strictObject({
  version: z.literal(1), readWithoutMotion: z.boolean(), lighterMedia: z.boolean(),
});
export type Preferences = z.infer<typeof PreferencesSchema>;
export const defaults: Preferences = { version: 1, readWithoutMotion: false, lighterMedia: false };
export const preferenceKey = "vf.preferences.v1";

export function parsePreferences(value: string | null): Preferences {
  try { return PreferencesSchema.parse(JSON.parse(value ?? "null")); }
  catch { return { ...defaults }; }
}
export function createPreferenceStore() {
  return createStore<Preferences & { setPreference: (key: "readWithoutMotion" | "lighterMedia", value: boolean) => void }>()((set) => ({
    ...defaults, setPreference: (key, value) => set({ [key]: value }),
  }));
}
