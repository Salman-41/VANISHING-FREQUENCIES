import { extent, ticks } from "d3-array";
import { scaleLinear } from "d3-scale";
import type { AnnualPoint, AnnualSeries } from "../../../data/schemas/observatory.schema";
import type { IndexObservation } from "../../../data/schemas/biodiversity.schema";

export function sharedMaximum(series: AnnualSeries[]) {
  return Math.max(1, ...series.flatMap(s => s.points.flatMap(p => [p.value ?? 0, p.upper ?? 0])));
}

/** Gaps and missing bounds break paths. Straight connectors are graphic aids, never new estimates. */
export function pointSegments(points: AnnualPoint[], bounded = false) {
  const segments: AnnualPoint[][] = [];
  let segment: AnnualPoint[] = [];
  for (const p of points) {
    const valid = p.value !== null && (!bounded || (p.lower !== null && p.upper !== null));
    if (!valid || (segment.length && p.year !== segment.at(-1)!.year + 1)) {
      if (segment.length) segments.push(segment); segment = [];
    }
    if (valid) segment.push(p);
  }
  if (segment.length) segments.push(segment);
  return segments;
}

export function annualGeometry(series: AnnualSeries, width: number, height: number, maximum = sharedMaximum([series])) {
  if (series.unit !== "index-1970-1" || series.baselineYear !== 1970 || !series.points.length || !Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0 || !Number.isFinite(maximum) || maximum < sharedMaximum([series]))
    throw new Error("The annual plot has no usable geometry or would clip source values");
  if (series.points.some((p, i) => !Number.isInteger(p.year) || (i > 0 && p.year <= series.points[i - 1]!.year) ||
    [p.value, p.lower, p.upper].some(v => v !== null && (!Number.isFinite(v) || v < 0)) ||
    ((p.lower === null) !== (p.upper === null)) || (p.lower !== null && p.upper !== null && (p.lower > p.upper || (p.value !== null && (p.value < p.lower || p.value > p.upper)))))) throw new Error("Invalid annual coordinates");
  const [first, last] = extent(series.points, p => p.year) as [number, number];
  const x = scaleLinear().domain(first === last ? [first - 0.5, last + 0.5] : [first, last]).range([0, width]);
  const y = scaleLinear().domain([0, maximum]).range([height, 0]);
  const coordinate = (p: AnnualPoint, value: number) => `${x(p.year).toFixed(3)},${y(value).toFixed(3)}`;
  const paths = pointSegments(series.points).map(ps => `M${ps.map(p => coordinate(p, p.value!)).join("L")}`);
  const bounds = pointSegments(series.points, true).map(ps => `${ps.map(p => coordinate(p, p.upper!)).join(" ")} ${[...ps].reverse().map(p => coordinate(p, p.lower!)).join(" ")}`);
  const boundLines = pointSegments(series.points, true).flatMap(ps => ["lower", "upper"].map(key => `M${ps.map(p => coordinate(p, p[key as "lower" | "upper"]!)).join("L")}`));
  const yearTicks = [...new Set([first, ...ticks(first, last, 4).filter(t => series.points.some(p => p.year === t)), last])];
  return { x, y, paths, bounds, boundLines, yearTicks, yTicks: ticks(0, maximum, 4), maximum };
}

export function nearestPoint(points: AnnualPoint[], year: number) {
  if (!Number.isFinite(year) || !points.length) return undefined;
  return points.reduce((nearest, p) => Math.abs(p.year - year) < Math.abs(nearest.year - year) ? p : nearest);
}

export function endpointScale(records: Pick<IndexObservation, "metric" | "unit" | "datasetId" | "edition" | "period" | "value">[], width: number) {
  const first = records[0];
  if (!first || !Number.isFinite(width) || width <= 0 || records.some(r => r.metric !== "index-percent-change" || r.unit !== "percent" ||
    r.datasetId !== first.datasetId || r.edition !== first.edition || r.period.startYear !== first.period.startYear || r.period.endYear !== first.period.endYear ||
    (r.value !== null && (!Number.isFinite(r.value) || r.value < -100)))) throw new Error("Endpoint comparison must use one dataset, edition and period");
  const max = Math.max(0, ...records.map(r => r.value ?? 0));
  return scaleLinear().domain([-100, max]).range([0, width]);
}
