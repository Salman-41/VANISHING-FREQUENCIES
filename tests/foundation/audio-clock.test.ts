import assert from "node:assert/strict";
import test from "node:test";
import { AudioEngine } from "../../src/features/audio/engine";

test("seek uses the inspected recording duration, not the ambience duration", () => {
  const engine = new AudioEngine();
  engine.selectHabitat("forest");
  engine.seek(6, "forest-hermit-thrush");
  assert.equal(engine.position(7.139), 6);
  assert.ok(Math.abs(engine.position(5.078) - 0.922) < 1e-9);
});

test("seek rejects another habitat and non-finite input, and clamps at clip bounds", () => {
  const engine = new AudioEngine();
  engine.seek(4, "ocean-humpback");
  engine.seek(30, "mountain-wind");
  engine.seek(NaN, "ocean-humpback");
  engine.seek(Infinity, "ocean-humpback");
  assert.equal(engine.position(100), 4);
  engine.seek(100, "ocean-humpback");
  assert.equal(engine.position(100), 7.557);
  engine.seek(-1, "ocean-humpback");
  assert.equal(engine.position(), 0);
});

test("stop resets the composition clock for every recording", () => {
  const engine = new AudioEngine();
  engine.seek(7, "ocean-humpback");
  engine.stop("idle");
  assert.equal(engine.position(7.557), 0);
});
