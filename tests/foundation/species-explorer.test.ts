import assert from "node:assert/strict";
import test from "node:test";
import { loadLocalResearch } from "../../src/features/research/load-local";
import { orderedSpecies } from "../../src/features/research/selectors";
import { buildSpeciesIndex, emptyFilters, facetKeys, filterSpecies, filtersToQuery, getFacetOptions, parseFilters, relatedSpecies } from "../../src/features/species/model";

const { data } = await loadLocalResearch(process.cwd());
const records = orderedSpecies(data);
const index = buildSpeciesIndex(records);
const options = getFacetOptions(index);
// Independent expected membership from the reviewed habitat/distribution and taxonomy fields.
const expected = [
  { id: "snow-leopard", status: ["VU"], group: ["Mammalia"], habitat: ["mountain"], region: ["asia"] },
  { id: "blue-whale", status: ["EN"], group: ["Mammalia"], habitat: ["open-ocean"], region: ["ocean"] },
  { id: "tiger", status: ["EN"], group: ["Mammalia"], habitat: ["forest", "grassland"], region: ["asia"] },
  { id: "bornean-orangutan", status: ["CR"], group: ["Mammalia"], habitat: ["forest"], region: ["asia"] },
  { id: "hawksbill-turtle", status: ["CR"], group: ["Reptilia"], habitat: ["reef-coast"], region: ["ocean"] },
  { id: "african-forest-elephant", status: ["CR"], group: ["Mammalia"], habitat: ["forest"], region: ["africa"] },
];
function subsets(values: string[]) {
  return Array.from({ length: 2 ** values.length }, (_, mask) => values.filter((_, i) => !!(mask & (1 << i))));
}

test("all 8192 multi-select combinations preserve reviewed membership without duplicates", () => {
  let checked = 0;
  for (const status of subsets(["VU", "EN", "CR"]))
    for (const group of subsets(["Mammalia", "Reptilia"]))
      for (const habitat of subsets(["mountain", "open-ocean", "forest", "grassland", "reef-coast"]))
        for (const region of subsets(["asia", "ocean", "africa"])) {
          const filters = { ...emptyFilters(), status, group, habitat, region };
          const wanted = expected.filter((record) => facetKeys.every((key) => !filters[key].length || filters[key].some((value) => record[key].includes(value)))).map((record) => record.id);
          assert.deepEqual(filterSpecies(index, filters).map((record) => record.id), wanted);
          checked++;
        }
  assert.equal(checked, 8192);
});

test("common and scientific names match literal case-insensitive substrings", () => {
  for (const record of records) for (const q of [record.commonName.toUpperCase(), ` ${record.scientificName.toUpperCase()} `])
    assert.deepEqual(filterSpecies(index, { ...emptyFilters(), q }).map((entry) => entry.id), [record.id]);
  assert.deepEqual(filterSpecies(index, { ...emptyFilters(), q: "Panthera" }).map((entry) => entry.id), ["snow-leopard", "tiger"]);
  assert.deepEqual(filterSpecies(index, { ...emptyFilters(), q: "[.*]" }), []);
});

test("URL state round-trips multiple values; invalid values remain explained and do not remove records", () => {
  const parsed = parseFilters({ q: " Tiger ", habitat: ["forest", "grassland", "forest", "wrong"], status: ["EN", "not-a-status"], sort: "scientific" }, options);
  assert.equal(parsed.warnings.length, 2);
  assert.equal(parsed.filters.q, "Tiger");
  assert.deepEqual(parsed.filters.habitat, ["forest", "grassland"]);
  const query = new URLSearchParams(filtersToQuery(parsed.filters));
  const restored = parseFilters(Object.fromEntries([...query.keys()].map((key) => [key, query.getAll(key)])), options);
  assert.equal(filtersToQuery(restored.filters), filtersToQuery(parsed.filters));
  const invalid = parseFilters({ status: "bad", sort: "population" }, options);
  assert.equal(invalid.warnings.length, 2);
  assert.equal(filterSpecies(index, invalid.filters).length, 6);
});

test("sorts order names without changing membership or mutating input", () => {
  const original = index.map((entry) => entry.id);
  const names = ["african-forest-elephant", "blue-whale", "bornean-orangutan", "hawksbill-turtle", "snow-leopard", "tiger"];
  assert.deepEqual(filterSpecies(index, { ...emptyFilters(), sort: "name" }).map((entry) => entry.id), names);
  assert.deepEqual(filterSpecies(index, { ...emptyFilters(), sort: "name-desc" }).map((entry) => entry.id), [...names].reverse());
  assert.deepEqual(filterSpecies(index, { ...emptyFilters(), sort: "scientific" }).map((entry) => entry.id), ["blue-whale", "hawksbill-turtle", "african-forest-elephant", "tiger", "snow-leopard", "bornean-orangutan"]);
  assert.deepEqual(index.map((entry) => entry.id), original);
});

test("future unclassified records remain discoverable and are represented in facet options", () => {
  const added = structuredClone(records[0]!);
  added.id = "future-reviewed-species";
  added.taxonomy.class = "Aves";
  const expanded = buildSpeciesIndex([...records, added]);
  assert.equal(filterSpecies(expanded, emptyFilters()).length, 7);
  assert.equal(getFacetOptions(expanded).habitat.find((option) => option.value === "unclassified")?.count, 1);
  assert.equal(getFacetOptions(expanded).group.find((option) => option.value === "Aves")?.count, 1);
});

test("related records exclude the current species and describe editorial navigation connections", () => {
  for (const record of index) {
    const related = relatedSpecies(index, record.id);
    assert.equal(related.length, 2);
    assert.ok(related.every((entry) => entry.id !== record.id && entry.reason.length));
  }
  assert.equal(relatedSpecies(index, "bornean-orangutan")[0]?.id, "tiger");
  assert.deepEqual(relatedSpecies(index, "missing"), []);
});
