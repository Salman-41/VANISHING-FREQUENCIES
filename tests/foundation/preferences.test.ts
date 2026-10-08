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
