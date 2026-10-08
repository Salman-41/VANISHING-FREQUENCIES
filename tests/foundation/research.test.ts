import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { loadLocalResearch } from "../../src/features/research/load-local";
import {
  clearedAssets,
  indexSeries,
  orderedSpecies,
  resolveReferences,
  speciesBySlug,
} from "../../src/features/research/selectors";
import { annualPlotScales } from "../../src/features/observatory/records";
import { requireClearedAudio } from "../../src/features/audio/session";

const { data, sha256 } = await loadLocalResearch(process.cwd());
test("checked local export loads with the original recorded hash", () => {
  assert.equal(
    sha256,
    "36b87bf96cf579f6bcf5e9b97157573e897de62e65c7829bb9b3b460017d670c",
  );
  assert.equal(data.availability.speciesPopulationRecords, 2);
});
test("narrative species order and exact slugs stay deterministic", () => {
  assert.deepEqual(
    orderedSpecies(data).map((s) => s.id),
    [
      "snow-leopard",
      "blue-whale",
      "tiger",
      "bornean-orangutan",
      "hawksbill-turtle",
      "african-forest-elephant",
    ],
  );
  assert.equal(speciesBySlug(data, "invented-animal"), undefined);
  assert.equal(speciesBySlug(data, "tiger")?.measurements.length, 0);
});
test("reference resolution rejects unverified and missing references", () => {
  assert.equal(
    resolveReferences(data, [
      { sourceId: "noaa-blue-stock", locator: "Population Size" },
    ])[0]?.citation.publisher,
    "NOAA Fisheries",
  );
  assert.throws(() =>
    resolveReferences(data, [{ sourceId: "missing", locator: "none" }]),
  );
  const invalid = structuredClone(data);
  invalid.citations[0]!.verification = "inaccessible";
  assert.throws(() =>
    resolveReferences(invalid, [
      { sourceId: invalid.citations[0]!.id, locator: "none" },
    ]),
  );
});
test("series selects exactly one edition without interpolation", () => {
  const records = indexSeries(data, "lpi-2024-owid", "lpi-2024-owid-world");
  assert.equal(records.length, 51);
  assert.equal(
    indexSeries(data, "lpi-2026-endpoints", "lpi-2024-owid-world").length,
    0,
  );
  assert.throws(() => indexSeries(data, "missing", "missing"));
  const scales = annualPlotScales(records, 800, 400);
  assert.equal(scales.x(1970), 0);
  assert.equal(scales.x(2020), 800);
  assert.throws(() =>
    annualPlotScales(
      [
        ...records,
        data.indexObservations.find(
          (r) => r.metric === "index-percent-change",
        )!,
      ],
      800,
      400,
    ),
  );
});
test("candidate media never becomes usable through a source URL alone", () => {
  for (const s of orderedSpecies(data)) {
    assert.deepEqual(clearedAssets(s, "image"), []);
    assert.deepEqual(clearedAssets(s, "audio"), []);
    for (const a of s.assets.audio) assert.throws(() => requireClearedAudio(a));
  }
  assert.throws(() =>
    requireClearedAudio({ kind: "audio", sourceUrl: "https://example.org" }),
  );
});
test("loader rejects stale hashes, failed reports and mismatched fingerprints", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "vf-loader-"));
  try {
    await mkdir(path.join(root, "data/processed/reports"), { recursive: true });
    const bytes = await readFile("data/processed/biodiversity.json");
    const report = JSON.parse(
      await readFile("data/processed/reports/validation-report.json", "utf8"),
    );
    await writeFile(path.join(root, "data/processed/biodiversity.json"), bytes);
    const target = path.join(
      root,
      "data/processed/reports/validation-report.json",
    );
    for (const mutate of [
      (r: typeof report) => {
        r.status = "failed";
      },
      (r: typeof report) => {
        r.buildFingerprint = "wrong";
      },
      (r: typeof report) => {
        r.outputs["biodiversity.json"].sha256 = "wrong";
      },
    ]) {
      const invalid = structuredClone(report);
      mutate(invalid);
      await writeFile(target, JSON.stringify(invalid));
      await assert.rejects(loadLocalResearch(root));
    }
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
