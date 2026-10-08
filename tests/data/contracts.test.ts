import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { validateBiodiversityDataset, type BiodiversityDataset } from "../../data/schemas/biodiversity.schema.js";
import { type SpeciesDataset } from "../../data/schemas/species.schema.js";

const data: BiodiversityDataset = JSON.parse(readFileSync(new URL("../../data/processed/biodiversity.json", import.meta.url), "utf8"));
const raw: SpeciesDataset = JSON.parse(readFileSync(new URL("../../data/raw/species-foundation.json", import.meta.url), "utf8"));
test("frontend bundle validates and keeps editions separate", () => {
  const valid = validateBiodiversityDataset(data);
  assert.equal(valid.indexObservations.length, 366);
  assert.deepEqual(valid.availability.annualIndexEditions, ["LPR 2024"]);
  assert.deepEqual(valid.availability.endpointEditions, ["LPR 2026"]);
  assert.equal(valid.availability.speciesPopulationRecords, 2);
});

const mutations: [string, (d: BiodiversityDataset) => void][] = [
  ["bounds reversed", d => { const r=d.indexObservations.find(r => r.uncertainty && r.uncertainty.lower<r.uncertainty.upper)!; [r.uncertainty!.lower,r.uncertainty!.upper]=[r.uncertainty!.upper,r.uncertainty!.lower]; }],
  ["impossible percent decline", d => { d.indexObservations.find(r => r.metric==="index-percent-change")!.value=-101; }],
  ["source citation missing", d => { d.indexObservations[0]!.provenance[0]!.sourceId="missing-source"; }],
  ["index edition relabeled", d => { d.indexObservations[0]!.edition="LPR 2026"; }],
  ["series combined across editions", d => { d.indexObservations.find(r => r.metric==="index-percent-change")!.seriesId=d.indexObservations.find(r => r.metric==="relative-index")!.seriesId; }],
  ["dataset version differs from provenance", d => { d.datasets[0]!.version="different version"; }],
  ["missing estimate turned into unexplained null", d => { d.indexObservations[0]!.value=null; }],
  ["held species measurement leaks to frontend", d => { d.speciesFoundation.species.find(s => s.id==="tiger")!.measurements.push(raw.species.find(s => s.id==="tiger")!.measurements[0]!); d.availability.speciesPopulationRecords++; }],
  ["population rights absent", d => { d.sourceRights=d.sourceRights.filter(s => s.sourceId!=="noaa-blue-stock"); }],
  ["noncommercial license", d => { d.datasets[0]!.rights.licenseId="CC-BY-NC-SA-4.0"; }],
  ["unknown source date replaced with future", d => { d.datasets[0]!.sourceDate="2027-01-01"; }],
];
for (const [name, mutate] of mutations) {
  test(`rejects ${name}`, () => {
    const invalid=structuredClone(data);mutate(invalid);
    assert.throws(() => validateBiodiversityDataset(invalid));
  });
}
