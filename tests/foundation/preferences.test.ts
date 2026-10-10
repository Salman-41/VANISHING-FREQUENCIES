import assert from "node:assert/strict";
import test from "node:test";
import {
  createPreferenceStore,
  defaults,
  parsePreferences,
} from "../../src/features/preferences/store";
test("preferences reject malformed, unknown and stale storage", () => {
  for (const input of [
    null,
    "broken",
    "{}",
    '{"version":0,"readWithoutMotion":true,"lighterMedia":true}',
    '{"version":1,"readWithoutMotion":true,"lighterMedia":true,"soundEnabled":true}',
  ])
    assert.deepEqual(parsePreferences(input), defaults);
  assert.equal(
    parsePreferences(
      '{"version":1,"readWithoutMotion":true,"lighterMedia":false}',
    ).readWithoutMotion,
    true,
  );
});
test("preference stores are isolated and motion/media choices are independent", () => {
  const a = createPreferenceStore();
  const b = createPreferenceStore();
  a.getState().setPreference("readWithoutMotion", true);
  assert.equal(a.getState().readWithoutMotion, true);
  assert.equal(a.getState().lighterMedia, false);
  assert.equal(b.getState().readWithoutMotion, false);
});

test("small browser preference reader agrees with the strict Zod reference contract", async () => {
  const { PreferencesSchema } = await import("../../src/features/preferences/contract");
  const inputs: unknown[] = [null, [], true, 1, "text", {},
    { version: 1, readWithoutMotion: true },
    { version: 1, lighterMedia: true },
    { version: 1, readWithoutMotion: true, lighterMedia: true, extra: false },
    { version: 1, readWithoutMotion: "false", lighterMedia: 0 },
    { version: 2, readWithoutMotion: true, lighterMedia: true },
    { version: 1, readWithoutMotion: null, lighterMedia: false }];
  for (const readWithoutMotion of [true, false]) for (const lighterMedia of [true, false])
    inputs.push({ version: 1, readWithoutMotion, lighterMedia });
  for (const input of inputs) {
    const expected = PreferencesSchema.safeParse(input);
    assert.deepEqual(parsePreferences(JSON.stringify(input)), expected.success ? expected.data : defaults);
  }
});
