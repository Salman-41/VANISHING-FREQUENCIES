import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadLocalResearch } from "../../src/features/research/load-local";
import { AnnualSeriesSchema } from "../../data/schemas/observatory.schema";
import { annualOptions, comparisonSeries, editions, formatValue, parseSelection, selectRecords, selectionQuery, toAnnualSeries } from "../../src/features/observatory/model";
import { annualGeometry, endpointScale, nearestPoint, pointSegments, sharedMaximum } from "../../src/features/observatory/geometry";
import { createDownloads } from "../../src/features/observatory/downloads";
import { AnnualChart } from "../../src/features/observatory/annual-chart";
import { EndpointChart } from "../../src/features/observatory/endpoint-chart";

const { data, sha256 } = await loadLocalResearch(process.cwd());
const options = annualOptions(data.indexObservations);
const annualRecords = data.indexObservations.filter(r => r.datasetId === editions["2024"]);
const endpoints = data.indexObservations.filter(r => r.datasetId === editions["2026"]);
const allSeries = options.map(o => toAnnualSeries(annualRecords.filter(r => r.seriesId === o.id)));
const world = allSeries.find(s => s.scope === "global")!;
const defaultSelection = parseSelection({}, options).selection;
function python<T>(code: string, input?: string): T {
  const result = spawnSync("python3", ["-c", code], { input, encoding: "utf8" });
  assert.equal(result.status, 0, result.stderr); return JSON.parse(result.stdout) as T;
}

test("interaction payload preserves all 357 actual annual values and bounds", () => {
  assert.equal(options.length, 7); assert.equal(allSeries.flatMap(s => s.points).length, 357);
  for (const series of allSeries) {
    assert.deepEqual(AnnualSeriesSchema.parse(series), series);
    for (const point of series.points) {
      const r = annualRecords.find(r => r.id === point.id)!;
      assert.equal(point.year, r.period.endYear); assert.equal(point.value, r.value);
      assert.equal(point.lower, r.uncertainty?.lower); assert.equal(point.upper, r.uncertainty?.upper);
      assert.equal(point.uncertaintyGap, r.uncertaintyGap);
      assert.equal(point.uncertaintyKind, r.uncertainty?.kind ?? null);
      assert.equal(point.uncertaintyLevel, r.uncertainty?.level ?? null);
    }
  }
});

test("every annual output numerically matches independent raw CSV parsing and declared unit conversion", () => {
  const rows = python<Record<string, string>[]>("import csv,json; print(json.dumps(list(csv.DictReader(open('data/raw/public/owid-lpi-2024.csv')))))");
  assert.equal(rows.length, 357);
  for (const r of annualRecords) {
    const p = r.provenance[0]!, raw = rows[p.rowNumber - 1]!;
    assert.equal(r.period.endYear, Number(raw.year));
    // Python/pandas and JS decimal parsing may differ by a few binary floating-point ULPs.
    // The interaction/download values above remain bit-for-bit equal to the processed artifact.
    for (const [actual, expected] of [[r.value!, Number(raw.lpi_final) / 100], [r.uncertainty!.lower, Number(raw.ci_low) / 100], [r.uncertainty!.upper, Number(raw.ci_high) / 100]])
      assert.ok(Math.abs(actual! - expected!) <= Number.EPSILON * 8 * Math.max(1, Math.abs(expected!)));
    assert.equal(p.originalUnit, "index-1970-100"); assert.equal(p.originalValue, raw.lpi_final);
    assert.equal(p.originalUncertainty && (p.originalUncertainty as Record<string, string>).ci_low, raw.ci_low);
  }
  assert.equal(world.points.at(-1)!.value, 0.27134067);
});

test("all nine endpoints exactly match raw summary rows without reconstructed uncertainty", () => {
  const rows = python<Record<string, string>[]>("import csv,json; print(json.dumps(list(csv.DictReader(open('data/raw/observations.csv')))))");
  for (const r of endpoints) {
    const raw = rows[r.provenance[0]!.rowNumber - 1]!;
    assert.equal(r.value, Number(raw.value)); assert.equal(r.edition, raw.edition);
    assert.deepEqual(r.period, JSON.parse(raw.period!)); assert.equal(r.uncertainty, null);
    assert.equal(r.unit, "percent"); assert.equal(r.metric, "index-percent-change");
  }
});

test("all 9,282 supported annual series/range combinations select only source years without rebasing", () => {
  let checked = 0;
  for (const o of options) for (let i = 0; i < o.years.length; i++) for (let j = i; j < o.years.length; j++) {
    const { selection, warnings } = parseSelection({ edition: "2024", scope: o.scope, series: o.id, start: String(o.years[i]), end: String(o.years[j]) }, options);
    assert.equal(warnings.length, 0);
    const records = selectRecords(data.indexObservations, selection);
    assert.equal(records.length, j - i + 1);
    assert.deepEqual(records.map(r => r.period.endYear), o.years.slice(i, j + 1));
    assert.ok(records.every(r => r.baselineYear === 1970 && r.edition === "LPR 2024"));
    const serialized = Object.fromEntries(new URLSearchParams(selectionQuery(selection)));
    assert.deepEqual(parseSelection(serialized, options).selection, selection); checked++;
  }
  assert.equal(checked, 9282);
});

test("unsupported, reversed, repeated and incompatible URL selections produce explicit corrections", () => {
  for (const query of [{ edition: "2025" }, { start: "1969" }, { start: "1970.5" }, { start: "2020", end: "1970" }, { series: "invented" }, { scope: "invented" }, { start: ["2000", "2010"] }, { year: "2021" }]) {
    assert.ok(parseSelection(query, options).warnings.length);
  }
  const { selection, warnings } = parseSelection({ edition: "2026", scope: "ecosystem", start: "1990", end: "2021", series: world.id }, options);
  assert.equal(selection.start, null); assert.equal(selection.end, null); assert.equal(selection.series, "");
  assert.ok(warnings.length); assert.equal(selectRecords(data.indexObservations, selection).length, 3);
  assert.equal(parseSelection({}, options).selection.series, world.id);
});

test("all 2026 scopes select their own complete fixed-period records", () => {
  for (const [scope, count] of [["global", 1], ["region", 5], ["ecosystem", 3]] as const) {
    const records = selectRecords(data.indexObservations, parseSelection({ edition: "2026", scope }, options).selection);
    assert.equal(records.length, count); assert.ok(records.every(r => r.period.startYear === 1970 && r.period.endYear === 2022));
  }
  assert.equal(options.filter(o => o.scope === "ecosystem").length, 1);
});

test("annual scales begin at zero, include baseline and all source bounds, and invert source coordinates", () => {
  for (const s of allSeries) {
    const g = annualGeometry(s, 660, 310);
    assert.equal(g.y(0), 310); assert.ok(g.maximum >= 1); assert.equal(g.x(1970), 0); assert.equal(g.x(2020), 660);
    for (const p of s.points) {
      assert.ok(Math.abs(g.x.invert(g.x(p.year)) - p.year) < 1e-10);
      for (const v of [p.value, p.lower, p.upper]) if (v !== null) {
        assert.ok(g.y(v) >= 0 && g.y(v) <= 310); assert.ok(Math.abs(g.y.invert(g.y(v)) - v) < 1e-12);
      }
    }
    assert.equal(g.paths.length, 1); assert.equal(g.paths[0]!.split("L").length, s.points.length);
    assert.equal(g.bounds[0]!.split(" ").length, s.points.length * 2);
  }
});

test("regional panels use one maximum and compatible edition/baseline/period, with no abundance ranking", () => {
  const selection = parseSelection({ edition: "2024", scope: "region", start: "1990", end: "2010" }, options).selection;
  const series = comparisonSeries(data, selection); assert.equal(series.length, 5);
  const maximum = sharedMaximum(series);
  for (const s of series) {
    assert.equal(s.edition, "LPR 2024"); assert.equal(s.baselineYear, 1970);
    assert.equal(s.points[0]!.year, 1990); assert.equal(s.points.at(-1)!.year, 2010);
    assert.deepEqual(annualGeometry(s, 256, 92, maximum).y.domain(), [0, maximum]);
  }
  assert.deepEqual(comparisonSeries(data, { ...selection, edition: "2026" }), []);
});

test("missing values, absent years and absent bounds break graphic connectors without manufactured points", () => {
  const missing = structuredClone(world);
  missing.points[20]!.value = null; missing.points[20]!.missingReason = "Test mutation of real record";
  assert.equal(pointSegments(missing.points).length, 2);
  assert.equal(annualGeometry(missing, 300, 200).paths.join("L").split("L").length, 50);
  const absent = structuredClone(world); absent.points.splice(20, 1);
  assert.equal(pointSegments(absent.points).length, 2);
  const unbounded = structuredClone(world); unbounded.points[20]!.lower = null; unbounded.points[20]!.upper = null;
  unbounded.points[20]!.uncertaintyKind = null;
  assert.equal(pointSegments(unbounded.points, true).length, 2);
  assert.equal(unbounded.points.length, 51);
});

test("inspection snaps to real source years, including missing estimates, and single-year geometry remains finite", () => {
  assert.equal(nearestPoint(world.points, 1990.4)?.year, 1990);
  assert.equal(nearestPoint(world.points, 1990.6)?.year, 1991);
  assert.equal(nearestPoint(world.points, -100)?.year, 1970);
  assert.equal(nearestPoint(world.points, 3000)?.year, 2020);
  assert.equal(nearestPoint(world.points, NaN), undefined);
  const single = { ...world, points: [world.points[25]!] };
  const g = annualGeometry(single, 300, 200); assert.equal(g.x(1995), 150); assert.deepEqual(g.yearTicks, [1995]);
});

test("visual contracts reject mixed editions, duplicate years, clipping, nonfinite coordinates and invalid bounds", () => {
  const r = annualRecords.find(r => r.seriesId === world.id)!;
  assert.throws(() => toAnnualSeries([r, endpoints[0]!]));
  assert.throws(() => toAnnualSeries([r, { ...r, edition: "LPR 2026" }]));
  assert.throws(() => toAnnualSeries([r, r]));
  assert.throws(() => annualGeometry(world, 300, 200, .2));
  assert.throws(() => annualGeometry(world, Infinity, 200));
  const invalid = structuredClone(world); invalid.points[0]!.value = Infinity;
  assert.throws(() => annualGeometry(invalid, 300, 200));
  assert.equal(AnnualSeriesSchema.safeParse(invalid).success, false);
  invalid.points[0]!.value = 2; assert.throws(() => annualGeometry(invalid, 300, 200));
});

test("signed endpoint scale preserves zero and magnitudes, rejects edition/period mixing and permits supported positive change", () => {
  const x = endpointScale(endpoints, 100);
  assert.deepEqual(x.domain(), [-100, 0]); assert.equal(x(-100), 0); assert.equal(x(0), 100);
  for (const r of endpoints) assert.ok(Math.abs((x(0) - x(r.value!)) - Math.abs(r.value!)) < 1e-12);
  assert.throws(() => endpointScale([endpoints[0]!, { ...endpoints[1]!, edition: "LPR 2024" }], 100));
  assert.throws(() => endpointScale([endpoints[0]!, { ...endpoints[1]!, period: { startYear: 1970, endYear: 2020 } }], 100));
  const positive = endpointScale([{ ...endpoints[0]!, value: 20 }], 100); assert.deepEqual(positive.domain(), [-100, 20]);
});

test("downloads preserve normalized records, provenance, rights, separate editions and deterministic bytes", async () => {
  const files = createDownloads(data, sha256); assert.equal(Object.keys(files).length, 5);
  assert.deepEqual(files, createDownloads(data, sha256));
  for (const id of Object.values(editions)) {
    const json = JSON.parse(files[`${id}.json`]!);
    assert.deepEqual(json.records, data.indexObservations.filter(r => r.datasetId === id));
    assert.equal(json.researchExportSha256, sha256); assert.equal(json.dataset.rights.licenseId, "CC-BY-SA-4.0");
    assert.equal(json.speciesFoundation, undefined); assert.equal(json.successStories, undefined);
    assert.equal(await readFile(`public/data-downloads/${id}.json`, "utf8"), files[`${id}.json`]);
    assert.equal(await readFile(`public/data-downloads/${id}.csv`, "utf8"), files[`${id}.csv`]);
  }
  const blocked = structuredClone(data); blocked.datasets[0]!.rights.redistribution = false as true;
  assert.throws(() => createDownloads(blocked, sha256));
  blocked.datasets[0]!.rights.redistribution = true; blocked.datasets[0]!.edition = "LPR 2026";
  assert.throws(() => createDownloads(blocked, sha256));
});

test("independent Python CSV parsing reproduces every download value, bound, date and full provenance", () => {
  const files = createDownloads(data, sha256);
  for (const id of Object.values(editions)) {
    const rows = python<Record<string, string>[]>("import csv,io,json,sys; print(json.dumps(list(csv.DictReader(io.StringIO(sys.stdin.read())))))", files[`${id}.csv`]);
    const records = data.indexObservations.filter(r => r.datasetId === id); assert.equal(rows.length, records.length);
    for (let i = 0; i < records.length; i++) {
      const r = records[i]!, row = rows[i]!;
      assert.equal(row.value, formatValue(r.value));
      assert.equal(row.lower, r.uncertainty ? String(r.uncertainty.lower) : "");
      assert.equal(row.upper, r.uncertainty ? String(r.uncertainty.upper) : "");
      assert.equal(row.source_date, r.provenance[0]!.sourceDate);
      assert.equal(row.edition, r.edition); assert.equal(row.original_unit, r.provenance[0]!.originalUnit);
      assert.deepEqual(JSON.parse(row.provenance_json!), r.provenance);
      assert.equal(row.uncertainty_level, ""); assert.equal(row.license_id, "CC-BY-SA-4.0");
    }
  }
});

test("unsafe/empty visualization geometry produces written chart errors without fabricated zero lines", () => {
  const annual = renderToStaticMarkup(createElement(AnnualChart, { series: { ...world, points: [] } }));
  assert.match(annual, /Annual chart unavailable/); assert.doesNotMatch(annual, /<svg/);
  const endpoint = renderToStaticMarkup(createElement(EndpointChart, { records: [] }));
  assert.match(endpoint, /Endpoint comparison unavailable/); assert.doesNotMatch(endpoint, /<svg/);
});

test("interval kind and a verified source level survive the visualization contract; absent intervals cannot gain a level", () => {
  const mutation = structuredClone(world);
  mutation.points[0]!.uncertaintyKind = "confidence-interval";
  mutation.points[0]!.uncertaintyLevel = .95;
  assert.equal(AnnualSeriesSchema.parse(mutation).points[0]!.uncertaintyLevel, .95);
  mutation.points[0]!.lower = null; mutation.points[0]!.upper = null; mutation.points[0]!.uncertaintyKind = null;
  assert.equal(AnnualSeriesSchema.safeParse(mutation).success, false);
});
