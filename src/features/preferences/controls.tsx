"use client";
import { usePreferences } from "./provider";

export function PreferenceControls() {
  const { readWithoutMotion, lighterMedia, setPreference } = usePreferences();
  return <fieldset className="preferences">
    <legend>Reading preferences</legend>
    <label><input type="checkbox" checked={readWithoutMotion} onChange={(e) => setPreference("readWithoutMotion", e.target.checked)} />Read without motion</label>
    <label><input type="checkbox" checked={lighterMedia} onChange={(e) => setPreference("lighterMedia", e.target.checked)} />Lighter media</label>
  </fieldset>;
}
