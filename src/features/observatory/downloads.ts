import type { BiodiversityDataset } from "../../../data/schemas/biodiversity.schema";
import { editions } from "./model";

export const downloadNotes = [
  "VANISHING FREQUENCIES — published Living Planet Index downloads",
  "Only aggregate published results are included. No underlying Living Planet Database, restricted IUCN/BirdLife records, species research or media is supplied.",
  "2024 annual estimates: ZSL/WWF (2024), Living Planet Index, processed by Our World in Data. OWID indicator 990513, source update 2024-09-30; snapshot accessed 2026-10-08. 1970–2020; seven series; 357 observations.",
  "Source: https://ourworldindata.org/grapher/global-living-planet-index",
  "2026 endpoint summaries: ZSL/WWF (2026), Living Planet Index, WWF-UK press release 2026-10-08; accessed 2026-10-08. 1970–2022; nine rounded summaries. No annual observations or bounds were acquired.",
  "Source: https://www.wwf.org.uk/press-release/living-planet-report-2026",
  "Published-trend reproduction: CC BY-SA 4.0, under clause 3 of the acquired ZSL 2026 Data Use Policy. Retain attribution, edition, dates, license link and share-alike obligations for adapted data. This permission does not cover source report prose, figures, logos or underlying monitoring records. No institutional endorsement.",
  "License: https://creativecommons.org/licenses/by-sa/4.0/",
  "Rights evidence: https://www.livingplanetindex.org/documents/LPI_Data_Use_Policy_2026.pdf",
  "Method: the annual acquired CSV uses 1970=100; central values and both bounds are divided by 100 together, as declared by its metadata. Standardized unit: index-1970-1. Original units, values and row representations are retained. No interpolation, extrapolation or smoothing. Endpoint unit: percent index change.",
  "Source bounds' confidence level is unverified in the acquired metadata. Null means missing, not zero. No endpoint uncertainty interval is reconstructed. CV is never treated as a confidence interval.",
  "The LPI measures average relative change in monitored vertebrate populations. It does not measure the percentage of individual animals lost, the percentage of species/populations declining, or extinctions. Regional/system results are not rankings of absolute abundance.",
  "Different editions have different coverage/windows and cannot be directly combined. These downloads retain separate datasets/series/editions. They are not species population histories or measures of acoustic activity.",
  "JSON retains complete normalized aggregate records and provenance. CSV retains the same context, nullable fields as empty cells, and full provenance in provenance_json. The legacy raw row's redistribution text, when present, is a pre-review source representation; the explicit dataset rights entry records the subsequent aggregate-trend clearance.",
  "UI filters crop the display only; these files contain complete, separate edition products. No blanket license for other project data is granted.",
].join("\n\n") + "\n";

const cell = (value: unknown) => {
  if (value === null || value === undefined) return "";
  const text = typeof value === "object" ? JSON.stringify(value) : String(value);
  return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
};

/** Deterministic extraction from a successful checked export. Fail closed on rights or edition drift. */
export function createDownloads(data: BiodiversityDataset, exportSha256: string) {
  const files: Record<string, string> = { "README.txt": downloadNotes };
  for (const [edition, id] of Object.entries(editions)) {
    const dataset = data.datasets.find(d => d.id === id);
    if (!dataset || dataset.edition !== `LPR ${edition}` || !dataset.rights.redistribution || dataset.rights.commercialUse !== "allowed" || dataset.rights.licenseId !== "CC-BY-SA-4.0")
      throw new Error(`Download rights or edition unavailable: ${id}`);
    const records = data.indexObservations.filter(r => r.datasetId === id);
    if (!records.length || records.some(r => r.edition !== dataset.edition ||
      r.metric !== (edition === "2024" ? "relative-index" : "index-percent-change"))) throw new Error("Download would conflate edition or metric");
    const ids = new Set(records.flatMap(r => r.provenance.map(p => p.sourceId)));
    const citations = data.citations.filter(c => ids.has(c.id)).map(c => ({ id: c.id, title: c.title, publisher: c.publisher, authors: c.authors, url: c.url, publicationDate: c.publicationDate, publicationYear: c.publicationYear, accessedDate: c.accessedDate }));
    files[`${id}.json`] = JSON.stringify({ downloadSchemaVersion: "1.0.0", researchVerifiedOn: data.verifiedOn,
      researchBuildFingerprint: data.buildFingerprint, researchExportSha256: exportSha256,
      dataset, interpretationAndReuse: downloadNotes, citations, records }, null, 2) + "\n";
    const headers = ["id", "dataset_id", "dataset_version", "edition", "series_id", "scope", "geography", "ecosystem", "taxon", "metric", "unit", "baseline_year", "start_year", "end_year", "value", "uncertainty_kind", "lower", "upper", "uncertainty_level", "uncertainty_gap", "missing_reason", "source_date", "accessed_date", "research_verified_on", "original_unit", "original_value", "original_uncertainty_json", "license_id", "license_url", "attribution", "research_export_sha256", "provenance_json"];
    const rows = records.map(r => [r.id, r.datasetId, dataset.version, r.edition, r.seriesId, r.scope, r.geography, r.ecosystem, r.taxon, r.metric, r.unit, r.baselineYear, r.period.startYear, r.period.endYear, r.value, r.uncertainty?.kind, r.uncertainty?.lower, r.uncertainty?.upper, r.uncertainty?.level, r.uncertaintyGap, r.missingReason, dataset.sourceDate, dataset.accessedDate, data.verifiedOn, r.provenance[0]!.originalUnit, r.provenance[0]!.originalValue, r.provenance[0]!.originalUncertainty, dataset.rights.licenseId, dataset.rights.licenseUrl, dataset.rights.attribution, exportSha256, r.provenance]);
    files[`${id}.csv`] = [headers, ...rows].map(row => row.map(cell).join(",")).join("\n") + "\n";
  }
  return files;
}
