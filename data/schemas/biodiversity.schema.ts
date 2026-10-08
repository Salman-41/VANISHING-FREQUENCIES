import { z } from "zod";
import { ClaimSchema, CitationSchema, SpeciesDatasetSchema, validateSpeciesFoundation } from "./species.schema.js";

const Text = z.string().trim().min(1);
const Date = z.iso.date();
const Hash = z.string().regex(/^[0-9a-f]{64}$/);
const Year = z.number().int().min(1500).max(2100);
const Period = z.strictObject({ startYear: Year, endYear: Year }).refine(p => p.startYear <= p.endYear, "Reversed period");
const Bounds = z.strictObject({ kind: z.enum(["source-bounds", "confidence-interval", "credible-interval"]),
  lower: z.number().finite(), upper: z.number().finite(), level: z.number().gt(0).lt(1).nullable(),
}).refine(b => b.lower <= b.upper, "Reversed bounds");

export const RightsSchema = z.strictObject({
  licenseId: Text, licenseUrl: z.url(), evidenceUrl: z.url(), verifiedOn: Date,
  commercialUse: z.literal("allowed"), redistribution: z.literal(true), attribution: Text, notes: Text,
  authorizationReference: Text.nullable(),
}).refine(r => !/(?:^|-)NC(?:-|$)/i.test(r.licenseId) && !r.licenseUrl.includes("/by-nc") &&
  !["restricted", "unverified"].includes(r.licenseId), "Restricted rights cannot be frontend data");

export const ProvenanceSchema = z.strictObject({
  datasetId: Text, datasetVersion: Text, sourceId: Text, sourceUrl: z.url(), sourceDate: Date.nullable(),
  sourceEdition: Text, accessedDate: Date, inputPath: Text, inputSha256: Hash,
  rowNumber: z.number().int().positive(), jsonPointer: Text.nullable(), locator: Text,
  originalUnit: Text.nullable(), originalValue: z.unknown(), originalUncertainty: z.unknown(),
  rawRecord: z.record(z.string(), z.unknown()), transformations: z.array(Text),
});
export interface RecordProvenance extends z.infer<typeof ProvenanceSchema> {}

export const IndexObservationSchema = z.strictObject({
  id: Text, datasetId: Text, seriesId: Text, metric: z.enum(["relative-index", "index-percent-change"]),
  value: z.number().finite().nullable(), unit: z.enum(["index-1970-1", "percent"]),
  period: Period, geography: Text, ecosystem: Text, scope: z.enum(["global", "region", "ecosystem"]),
  taxon: Text, edition: Text, baselineYear: z.literal(1970), uncertainty: Bounds.nullable(),
  missingReason: Text.nullable(), uncertaintyGap: Text.nullable(),
  temporalMeaning: z.enum(["published-annual-index", "published-endpoint-change"]),
  provenance: z.array(ProvenanceSchema).min(1),
}).superRefine((r, ctx) => {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message });
  const minimum = r.metric === "relative-index" ? 0 : -100;
  if (r.metric === "relative-index" && (r.unit !== "index-1970-1" || r.temporalMeaning !== "published-annual-index" || r.period.startYear !== r.period.endYear)) issue("Annual index contract mismatch");
  if (r.metric === "index-percent-change" && (r.unit !== "percent" || r.temporalMeaning !== "published-endpoint-change" || r.period.startYear !== 1970)) issue("Endpoint contract mismatch");
  if (r.value !== null && r.value < minimum) issue("Impossible index value");
  if ((r.value === null) !== (r.missingReason !== null)) issue("Missing-value reason mismatch");
  if (r.uncertainty === null && !r.uncertaintyGap) issue("Missing uncertainty needs explanation");
  if (r.uncertainty && (r.uncertainty.lower < minimum || (r.value !== null && (r.value < r.uncertainty.lower || r.value > r.uncertainty.upper)))) issue("Invalid index interval");
  for (const p of r.provenance) {
    if (p.datasetId !== r.datasetId || p.sourceEdition !== r.edition) issue("Provenance dataset/edition mismatch");
    if (r.period.endYear > Number(p.accessedDate.slice(0, 4)) || (p.sourceDate && r.period.endYear > Number(p.sourceDate.slice(0, 4)))) issue("Measurement after source/access");
  }
});
export interface IndexObservation extends z.infer<typeof IndexObservationSchema> {}

const BlockerSchema = z.strictObject({ id: Text, sourceUrl: z.url(), reason: Text,
  requirements: z.array(Text).min(1), importAdapter: z.enum(["canonical-index", "species-foundation"]) });
export const SuccessStorySchema = z.strictObject({
  id: Text, speciesId: Text, scientificName: Text,
  kind: z.enum(["documented-recovery", "documented-intervention"]), title: Text, geography: Text,
  description: ClaimSchema, outcome: ClaimSchema, inferenceLimit: Text, measurementIds: z.array(Text),
  provenance: z.array(ProvenanceSchema).min(1),
});
export interface ConservationStory extends z.infer<typeof SuccessStorySchema> {}

export const BiodiversityDatasetSchema = z.strictObject({
  schemaVersion: z.literal("1.0.0"), pipelineVersion: z.literal("1.0.0"), verifiedOn: Date, buildFingerprint: Hash,
  datasets: z.array(z.strictObject({ id: Text, version: Text, edition: Text, sourceId: Text,
    sourceDate: Date.nullable(), accessedDate: Date, rights: RightsSchema })).min(1),
  sourceRights: z.array(z.strictObject({ sourceId: Text, rights: RightsSchema })).min(1),
  indexObservations: z.array(IndexObservationSchema), speciesFoundation: SpeciesDatasetSchema,
  speciesProvenance: z.array(z.strictObject({ speciesId: Text, provenance: z.array(ProvenanceSchema).min(1) })),
  successStories: z.array(SuccessStorySchema),
  availability: z.strictObject({ annualIndexEditions: z.array(Text), endpointEditions: z.array(Text),
    speciesPopulationRecords: z.number().int().nonnegative(), heldPopulationRecords: z.number().int().nonnegative(),
    blockedSources: z.array(BlockerSchema) }),
  citations: z.array(CitationSchema).min(1),
});
export interface BiodiversityDataset extends z.infer<typeof BiodiversityDatasetSchema> {}

export function validateBiodiversityDataset(input: unknown): BiodiversityDataset {
  const data = BiodiversityDatasetSchema.parse(input);
  const errors: string[] = [];
  const sources = new Map(data.citations.map(s => [s.id, s]));
  const datasets = new Map(data.datasets.map(d => [d.id, d]));
  const species = new Map(data.speciesFoundation.species.map(s => [s.id, s]));
  if (sources.size !== data.citations.length || datasets.size !== data.datasets.length) errors.push("Duplicate source/dataset IDs");
  if (new Set(data.indexObservations.map(r => r.id)).size !== data.indexObservations.length) errors.push("Duplicate observation IDs");
  const keys = data.indexObservations.map(r => JSON.stringify([r.datasetId, r.edition, r.seriesId, r.period.startYear, r.period.endYear]));
  if (new Set(keys).size !== keys.length) errors.push("Duplicate observation keys");
  const seriesVersions = new Map<string, string>();
  for (const r of data.indexObservations) {
    const identity = JSON.stringify([r.datasetId, r.edition]);
    if (seriesVersions.has(r.seriesId) && seriesVersions.get(r.seriesId) !== identity) errors.push("Series ID reused across editions/datasets");
    seriesVersions.set(r.seriesId, identity);
  }
  function walk(node: unknown): void {
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (!node || typeof node !== "object") return;
    const o = node as Record<string, unknown>;
    if (typeof o.sourceId === "string") {
      const s = sources.get(o.sourceId);
      if (!s || s.verification !== "page-read") errors.push(`Unverified/missing source: ${o.sourceId}`);
      if (s && typeof o.sourceUrl === "string" && s.url !== o.sourceUrl) errors.push(`Source URL mismatch: ${o.sourceId}`);
    }
    Object.values(o).forEach(walk);
  }
  // Raw provenance fields contain the original representation, not normalized references.
  for (const d of data.datasets) {
    walk({ sourceId: d.sourceId });
    if (d.accessedDate > data.verifiedOn || d.rights.verifiedOn > data.verifiedOn || (d.sourceDate && d.sourceDate > d.accessedDate)) errors.push(`Future dataset date: ${d.id}`);
  }
  const checkProvenance = (p: RecordProvenance) => {
    walk({ sourceId: p.sourceId, sourceUrl: p.sourceUrl });
    const d = datasets.get(p.datasetId);
    if (!d || d.version !== p.datasetVersion || d.edition !== p.sourceEdition || d.sourceId !== p.sourceId || d.sourceDate !== p.sourceDate || d.accessedDate !== p.accessedDate) errors.push(`Dataset provenance mismatch: ${p.datasetId}`);
  };
  for (const r of data.indexObservations) r.provenance.forEach(checkProvenance);
  for (const p of data.speciesProvenance) p.provenance.forEach(checkProvenance);
  if (new Set(data.speciesProvenance.map(p => p.speciesId)).size !== species.size || data.speciesProvenance.length !== species.size || data.speciesProvenance.some(p => !species.has(p.speciesId))) errors.push("Species provenance coverage mismatch");
  for (const story of data.successStories) {
    const s = species.get(story.speciesId);
    if (!s || s.scientificName !== story.scientificName) errors.push(`Story taxon mismatch: ${story.id}`);
    for (const id of story.measurementIds) if (!s?.measurements.some(m => m.id === id)) errors.push(`Story measurement absent: ${id}`);
    story.provenance.forEach(checkProvenance);
    walk(story.description); walk(story.outcome);
  }
  if (new Set(data.successStories.map(s => s.id)).size !== data.successStories.length) errors.push("Duplicate story IDs");
  const measurements = data.speciesFoundation.species.flatMap(s => s.measurements);
  const sourceRights = new Map(data.sourceRights.map(r => [r.sourceId, r.rights]));
  if (sourceRights.size !== data.sourceRights.length) errors.push("Duplicate source rights entries");
  for (const r of data.sourceRights) {
    walk({ sourceId: r.sourceId });
    if (r.rights.verifiedOn > data.verifiedOn) errors.push("Source rights verified after build date");
  }
  for (const m of measurements) for (const ref of m.references) if (!sourceRights.has(ref.sourceId)) errors.push(`Population source rights absent: ${ref.sourceId}`);
  if (measurements.some(m => m.display.eligibility !== "dated-context-only")) errors.push("Held measurement leaked into frontend export");
  if (measurements.length !== data.availability.speciesPopulationRecords) errors.push("Population availability count mismatch");
  const editions = (metric: string) => [...new Set(data.indexObservations.filter(r => r.metric === metric).map(r => r.edition))].sort();
  if (JSON.stringify(editions("relative-index")) !== JSON.stringify(data.availability.annualIndexEditions) || JSON.stringify(editions("index-percent-change")) !== JSON.stringify(data.availability.endpointEditions)) errors.push("Edition availability mismatch");
  validateSpeciesFoundation(data.speciesFoundation, { schemaVersion: "1.0.0", lastVerified: data.verifiedOn, citations: data.citations });
  if (errors.length) throw new Error(errors.join("\n"));
  return data;
}
