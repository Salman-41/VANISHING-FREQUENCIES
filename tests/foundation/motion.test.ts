import assert from "node:assert/strict";
import test from "node:test";
import { pinTravel, motionTokens } from "../../src/features/motion/policy";
test("pinning requires viewport, image fit and real editorial travel", () => {
  assert.equal(pinTravel(1023, 900, 500, 400), 0);
  assert.equal(pinTravel(1440, 799, 500, 400), 0);
  assert.equal(pinTravel(1440, 900, 805, 400), 0);
  assert.equal(pinTravel(1440, 900, 500, 79), 0);
  assert.equal(pinTravel(1440, 900, 500, 400), 400);
  assert.equal(pinTravel(1440, 900, 500, 1800), 900);
});
test("motion durations preserve the documented short interaction budget", () => {
  assert.deepEqual(motionTokens, {
    state: 0.16,
    panel: 0.24,
    content: 0.32,
    scene: 0.6,
    entry: 12,
  });
});
