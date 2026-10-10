import { test } from "node:test";
import assert from "node:assert/strict";
import { sceneBudget, sceneMix, elapsedProgress, particlePositions, ridgeHeight } from "../../src/features/immersive/policy";

test("3D pixel budgets cap desktop, mobile and explicit lighter rendering", () => {
  for (const [w, h] of [[1440, 900], [390, 844], [320, 140], [3840, 2160]]) {
    for (const light of [false, true]) {
      const budget = sceneBudget(w!, h!, 3, light);
      assert.ok(budget.dpr >= 0.5 && budget.dpr <= 1.5);
      assert.equal(budget.particles, light || w! < 768 ? 80 : 240);
      assert.ok(budget.segments * budget.rows * 6 <= 36864);
    }
  }
});
test("scene dissolve is bounded and does not transform scientific measurements", () => {
  for (const progress of [-1, 0, 0.5, 1, 2]) for (const kind of ["mountain", "ocean"] as const) {
    assert.ok(sceneMix(kind, progress) >= 0 && sceneMix(kind, progress) <= 1);
  }
  assert.equal(sceneMix("mountain", 0.5), 0);
  assert.equal(sceneMix("mountain", 1), 1);
  assert.equal(sceneMix("ocean", 0), 1);
  assert.equal(sceneMix("ocean", 0.5), 1);
  // A chapter boundary starts and settles without an abrupt velocity change.
  assert.ok(sceneMix("mountain", 0.8201) < 0.00001);
  assert.ok(1 - sceneMix("mountain", 0.9899) < 0.00001);
  let previous = 0;
  for (let progress = 0; progress <= 1; progress += 0.001) {
    const mix = sceneMix("mountain", progress);
    assert.ok(mix >= previous);
    previous = mix;
  }
  assert.equal(elapsedProgress(100, 400, 600), 0.5);
  assert.equal(elapsedProgress(100, 3000, 1800), 1); // A stalled frame settles, never stretches the pulse.
});
test("interpretive geometry and particles are deterministic, finite and bounded", () => {
  assert.deepEqual(particlePositions(80), particlePositions(80));
  assert.equal(particlePositions(240).length, 720);
  assert.ok([...particlePositions(240)].every(Number.isFinite));
  for (let x = -22; x <= 22; x++) for (let z = -22; z <= 10; z++) {
    const height = ridgeHeight(x, z);
    assert.ok(Number.isFinite(height) && height >= 0 && height <= 7);
  }
});
