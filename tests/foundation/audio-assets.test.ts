import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import test from "node:test";
import { audioCatalog } from "../../src/features/audio/catalog";

const hash = (bytes: Buffer) => createHash("sha256").update(bytes).digest("hex");

test("public domain audio catalog is source-complete and local files match receipts", () => {
  assert.equal(audioCatalog.clips.length, 6);
  for (const clip of audioCatalog.clips) {
    assert.equal(hash(readFileSync(`public${clip.localPath}`)), clip.localSha256);
    assert.equal(hash(readFileSync(`data/raw/audio/${clip.id}.mp3`)), clip.sourceSha256);
    assert.match(clip.sourcePage, /^https:\/\/www\.nps\.gov\//);
    assert.match(clip.licensePage, /^https:\/\/www\.nps\.gov\//);
    assert.equal(clip.credit, "National Park Service");
    assert.equal(clip.waveformPeaks.length, 72);
    assert.equal(clip.sourceBytes, readFileSync(`data/raw/audio/${clip.id}.mp3`).byteLength);
    assert.equal(clip.localBytes, readFileSync(`public${clip.localPath}`).byteLength);
  }
  assert.equal(audioCatalog.clips.find((clip) => clip.id === "ocean-humpback")?.title, "Humpback whale");
  assert.equal(audioCatalog.clips.find((clip) => clip.id === "mountain-wind")?.capturedOn, "2015-03-21");
  assert.ok(audioCatalog.clips.filter((clip) => clip.capturedOn === null).length === 5);
});
