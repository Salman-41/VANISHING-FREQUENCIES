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

test("audio catalog rejects malformed provenance, unsafe playback fields and invalid layer membership", async () => {
  const { AudioCatalogSchema } = await import("../../src/features/audio/catalog");
  type Catalog = typeof audioCatalog;
  const mutations: ((data: Catalog) => void)[] = [
    data => { Object.assign(data, { unknown: true }); },
    data => { Object.assign(data.clips[0]!, { unknown: true }); },
    data => { data.clips[0]!.id = data.clips[1]!.id; },
    data => { data.clips[0]!.kind = "wildlife"; },
    data => { data.clips[0]!.habitat = "ocean"; },
    data => { data.clips[0]!.durationSeconds = 0; },
    data => { data.clips[0]!.durationSeconds = Infinity; },
    data => { data.clips[0]!.sourceBytes = 1.5; },
    data => { data.clips[0]!.localBytes = -1; },
    data => { data.clips[0]!.sourceSha256 = "bad-hash"; },
    data => { data.clips[0]!.localPath = "/audio/../secret.mp3"; },
    data => { data.clips[0]!.sourcePage = "not-a-url"; },
    data => { data.clips[0]!.creator = ""; },
    data => { data.clips[0]!.capturedOn = "2026-02-30"; },
    data => { data.clips[0]!.waveformPeaks.pop(); },
    data => { data.clips[0]!.waveformPeaks[0] = 1.1; },
    data => { data.clips.pop(); },
  ];
  for (const mutate of mutations) {
    const data = structuredClone(audioCatalog);
    mutate(data);
    assert.equal(AudioCatalogSchema.safeParse(data).success, false);
  }
  assert.deepEqual(AudioCatalogSchema.parse(audioCatalog), audioCatalog);
});
