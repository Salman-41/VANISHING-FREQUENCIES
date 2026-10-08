import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateSpeciesFoundation, type SpeciesDataset } from "../data/schemas/species.schema.js";

const dataset: SpeciesDataset = JSON.parse(readFileSync(new URL("../data/processed/species.json", import.meta.url), "utf8"));
const citations: unknown = JSON.parse(readFileSync(new URL("../data/sources/species-citations.json", import.meta.url), "utf8"));
const first = (d: SpeciesDataset) => d.species[0]!;

test("all curated records and references validate", () => {
  const valid = validateSpeciesFoundation(dataset, citations);
  assert.equal(valid.species.length, 6);
  const measurements = valid.species.flatMap((s) => s.measurements);
  assert.equal(measurements.length, 6);
  assert.equal(measurements.filter((m) => m.display.eligibility === "dated-context-only").length, 2);
});

const invalidCases: [string, (d: SpeciesDataset) => void][] = [
  ["missing citation", (d) => { first(d).measurements[0]!.references[0]!.sourceId = "missing-source"; }],
  ["reversed measurement period", (d) => { first(d).measurements[0]!.measurementPeriod!.startYear = 2025; }],
  ["display without measurement period", (d) => { first(d).measurements[0]!.measurementPeriod = null; }],
  ["display with unverified method", (d) => { first(d).measurements[0]!.methodVerification = "unverified"; }],
  ["public summary posing as an assessment", (d) => { first(d).conservation.assessmentYear = 2024; }],
  ["numeric statistic buried in narrative", (d) => { first(d).descriptions.habitat.text = "Only 718 animals remain."; }],
  ["uncleared image marked usable", (d) => { first(d).assets.images[0]!.clearedForUse = true; }],
  ["duplicate species ID", (d) => { d.species[1]!.id = first(d).id; }],
  ["source publication year mismatch", (d) => { first(d).measurements[0]!.sourcePublicationYear = 2025; }],
  ["unverified source lead used as evidence", (d) => { first(d).descriptions.habitat.references[0]!.sourceId = "forest-report-lead"; }],
];
for (const [name, mutate] of invalidCases) {
  test(`rejects ${name}`, () => {
    const changed = structuredClone(dataset);
    mutate(changed);
    assert.throws(() => validateSpeciesFoundation(changed, citations));
  });
}
