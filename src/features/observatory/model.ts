import type { BiodiversityDataset, IndexObservation } from "../../../data/schemas/biodiversity.schema";
import { AnnualSeriesSchema, type AnnualSeries } from "../../../data/schemas/observatory.schema";

export const editions = { "2024": "lpi-2024-owid", "2026": "lpi-2026-endpoints" } as const;
export const scopes = { global: "Global", region: "Regions", ecosystem: "Ecosystems" } as const;
export type Edition = keyof typeof editions;
export type Scope = keyof typeof scopes;
export type Query = Record<string, string | string[] | undefined>;
export interface Selection { edition: Edition; scope: Scope; series: string; start: number | null; end: number | null }
export interface SeriesOption { id: string; label: string; scope: Scope; years: number[] }
export const labelFor = (r: Pick<IndexObservation, "scope" | "ecosystem" | "geography">) => r.scope === "ecosystem" ? r.ecosystem : r.geography;
export const formatValue = (value: number | null) => value === null ? "Not reported" : String(value);
export const formatChange = (value: number | null) => value === null ? "Not reported" : `${value > 0 ? "+" : ""}${value}%`;

export function annualOptions(records: IndexObservation[]): SeriesOption[] {
  const groups = new Map<string, IndexObservation[]>();
  for (const r of records.filter(r => r.datasetId === editions["2024"] && r.metric === "relative-index")) {
    const group = groups.get(r.seriesId) ?? []; group.push(r); groups.set(r.seriesId, group);
  }
  return [...groups].map(([id, rs]) => ({ id, label: labelFor(rs[0]!), scope: rs[0]!.scope,
    years: [...new Set(rs.map(r => r.period.endYear))].sort((a, b) => a - b) }))
    .sort((a, b) => a.label.localeCompare(b.label, "en"));
}

export function parseSelection(query: Query, options: SeriesOption[]) {
  const warnings: string[] = [];
  const one = (key: string) => {
    const value = query[key];
    if (Array.isArray(value)) { warnings.push(`Repeated ${key} values: only the first was used.`); return value[0]; }
    return value;
  };
  const choose = <T extends string>(value: string | undefined, allowed: readonly T[], fallback: T, name: string): T => {
    if (!value) return fallback;
    if (allowed.includes(value as T)) return value as T;
    warnings.push(`Unrecognized ${name}; showing ${fallback}.`); return fallback;
  };
  for (const key of Object.keys(query)) if (!["edition", "scope", "series", "start", "end"].includes(key))
    warnings.push(`The ${key} parameter is not supported and was ignored.`);
  const edition = choose(one("edition"), ["2024", "2026"], "2024", "edition");
  const scope = choose(one("scope"), ["global", "region", "ecosystem"], "global", "scope");
  const candidates = options.filter(o => o.scope === scope);
  let series = candidates[0]?.id ?? "";
  let start: number | null = null, end: number | null = null;
  if (edition === "2024") {
    const requested = one("series");
    if (requested && !candidates.some(o => o.id === requested)) warnings.push("That annual series is unavailable in this scope; showing the available default.");
    else if (requested) series = requested;
    const years = candidates.find(o => o.id === series)?.years ?? [];
    const year = (key: string, fallback: number | null) => {
      const value = one(key);
      if (value === undefined || value === "") return fallback;
      if (/^\d{4}$/.test(value) && years.includes(Number(value))) return Number(value);
      warnings.push(`Unsupported ${key} year; using the available range.`); return fallback;
    };
    start = year("start", years[0] ?? null); end = year("end", years.at(-1) ?? null);
    if (start !== null && end !== null && start > end) { warnings.push("The date range was reversed; showing the full available range."); start = years[0] ?? null; end = years.at(-1) ?? null; }
  } else {
    series = "";
    if (query.start || query.end || query.series) warnings.push("Annual series and date filters do not apply to 2026 endpoint summaries and were ignored.");
  }
  return { selection: { edition, scope, series, start, end } satisfies Selection, warnings };
}

export function selectionQuery(s: Selection) {
  const params = new URLSearchParams({ edition: s.edition, scope: s.scope });
  if (s.edition === "2024") {
    if (s.series) params.set("series", s.series);
    if (s.start !== null) params.set("start", String(s.start));
    if (s.end !== null) params.set("end", String(s.end));
  }
  return params.toString();
}

export function selectRecords(records: IndexObservation[], s: Selection) {
  return records.filter(r => r.datasetId === editions[s.edition] && r.scope === s.scope &&
    (s.edition === "2026" || (r.seriesId === s.series && (s.start === null || r.period.endYear >= s.start) && (s.end === null || r.period.endYear <= s.end))))
    .sort((a, b) => s.edition === "2024" ? a.period.endYear - b.period.endYear : labelFor(a).localeCompare(labelFor(b), "en"));
}

export function toAnnualSeries(records: IndexObservation[]): AnnualSeries {
  const first = records[0];
  if (!first) throw new Error("No annual series available");
  if (records.some(r => r.metric !== "relative-index" || r.temporalMeaning !== "published-annual-index" ||
    r.period.startYear !== r.period.endYear || r.seriesId !== first.seriesId || r.edition !== first.edition || r.datasetId !== first.datasetId ||
    r.unit !== first.unit || r.scope !== first.scope)) throw new Error("Cannot combine annual series, editions or metrics");
  return AnnualSeriesSchema.parse({ id: first.seriesId, datasetId: first.datasetId, edition: first.edition,
    label: labelFor(first), scope: first.scope, unit: first.unit, baselineYear: first.baselineYear,
    points: records.map(r => ({ id: r.id, year: r.period.endYear, value: r.value,
      lower: r.uncertainty?.lower ?? null, upper: r.uncertainty?.upper ?? null,
      uncertaintyKind: r.uncertainty?.kind ?? null, uncertaintyLevel: r.uncertainty?.level ?? null,
      uncertaintyGap: r.uncertaintyGap, missingReason: r.missingReason })).sort((a, b) => a.year - b.year) });
}

export function comparisonSeries(data: BiodiversityDataset, s: Selection) {
  if (s.edition !== "2024" || s.scope !== "region") return [];
  return annualOptions(data.indexObservations).filter(o => o.scope === "region").map(o =>
    toAnnualSeries(selectRecords(data.indexObservations, { ...s, series: o.id })));
}
