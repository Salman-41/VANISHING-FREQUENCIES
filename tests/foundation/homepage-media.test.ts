import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import test from "node:test";
import sharp from "sharp";
import { homepageMediaSchema } from "../../src/features/homepage/media-contract";
const input = JSON.parse(
  await readFile("data/sources/homepage-assets.json", "utf8"),
);
const registry = homepageMediaSchema.parse(input);
const hash = (b: Buffer) => createHash("sha256").update(b).digest("hex");
test("all acquired and rendered media match reviewed receipts", async () => {
  for (const asset of registry.assets) {
    const original = await readFile(asset.sourcePath);
    const derivative = await readFile(`public${asset.localPath}`);
    assert.equal(hash(original), asset.sourceSha256, asset.id);
    assert.equal(hash(derivative), asset.sha256, asset.id);
    assert.equal(original.length, asset.sourceBytes);
    assert.equal(derivative.length, asset.bytes);
    const metadata = await sharp(derivative).metadata();
    assert.equal(metadata.width, asset.width);
    assert.equal(metadata.height, asset.height);
    assert.equal(metadata.format, "webp");
    assert.ok(asset.width <= 1600);
  }
});
test("rights and uniqueness gates reject unreviewed assets", () => {
  const uncleared = structuredClone(input);
  uncleared.assets[0].clearedForUse = false;
  assert.equal(homepageMediaSchema.safeParse(uncleared).success, false);
  const duplicate = structuredClone(input);
  duplicate.assets[1].id = duplicate.assets[0].id;
  assert.equal(homepageMediaSchema.safeParse(duplicate).success, false);
});
test("context gaps and actual photo settings remain explicit", () => {
  assert.equal(
    registry.assets.find((a) => a.id === "bornean-orangutan")?.setting,
    "rehabilitation-site",
  );
  assert.equal(
    registry.assets.find((a) => a.id === "blue-whale")?.captureDate,
    null,
  );
  assert.ok(
    registry.assets.find((a) => a.id === "african-forest-elephant")
      ?.originalPublication,
  );
});
