import { z } from "zod";

// This contract supersedes the legacy data/raw/species.json contract for this stage.
// Do not combine the two datasets or silently upgrade organization summaries.
const Text = z.string().trim().min(1);
const Id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const Date = z.iso.date();
const Year = z.number().int().min(1500).max(2100);
const NarrativeText = Text.refine((t) => !/[0-9]/.test(t),
  "Put numeric statistics in measurements, not prose; reference measurement IDs");

export const ReferenceSchema = z.strictObject({ sourceId: Id, locator: Text });
export interface ScientificReference extends z.infer<typeof ReferenceSchema> {}
const References = z.array(ReferenceSchema).min(1);

export const ClaimSchema = z.strictObject({
  text: NarrativeText,
  evidence: z.enum(["institutional-summary", "primary-study", "documented-unknown"]),
  references: References,
  lastVerified: Date,
});
export interface ScientificClaim extends z.infer<typeof ClaimSchema> {}

export const PeriodSchema = z.strictObject({
  startYear: Year, endYear: Year,
  basis: z.enum(["survey-window", "estimate-reference-year"]),
}).refine((p) => p.startYear <= p.endYear, "Reversed period");

const ValueSchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("point"), value: z.number().finite().nonnegative() }),
  z.strictObject({ kind: z.literal("range"), lower: z.number().finite().nonnegative(),
    upper: z.number().finite().nonnegative() }).refine((v) => v.lower <= v.upper, "Reversed estimate range"),
]);
export const UncertaintySchema = z.discriminatedUnion("kind", [
  z.strictObject({ kind: z.literal("not-reported"), explanation: Text }),
  z.strictObject({ kind: z.literal("coefficient-of-variation"), value: z.number().finite().nonnegative(), explanation: Text }),
  z.strictObject({ kind: z.enum(["confidence-interval", "credible-interval"]),
    lower: z.number().finite().nonnegative(), upper: z.number().finite().nonnegative(),
    level: z.number().gt(0).lt(1), explanation: Text }).refine((v) => v.lower <= v.upper, "Reversed interval"),
]);

export const PopulationMeasurementSchema = z.strictObject({
  id: Id,
  metric: z.literal("population-estimate"),
  unit: z.enum(["individuals", "mature-individuals", "adult-individuals", "nesting-females"]),
  value: ValueSchema,
  scope: z.enum(["global", "country", "stock", "local-population"]),
  geography: Text,
  population: Text,
  measurementPeriod: PeriodSchema.nullable(),
  periodGap: Text.nullable(),
  method: Text,
  methodVerification: z.enum(["verified", "unverified"]),
  uncertainty: UncertaintySchema,
  sourcePublicationYear: Year,
  sourceEdition: Text,
  references: References,
  lastVerified: Date,
  display: z.strictObject({
    eligibility: z.enum(["dated-context-only", "hold"]),
    requiredContext: Text,
    holdReason: Text.nullable(),
  }),
  caveats: z.array(Text).min(1),
}).superRefine((m, ctx) => {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message });
  if (!m.measurementPeriod && !m.periodGap) issue("Unknown measurement period needs an explanation");
  if (m.measurementPeriod && m.measurementPeriod.endYear > m.sourcePublicationYear) issue("Measurement ends after source publication year");
  if (m.display.eligibility === "dated-context-only" && (!m.measurementPeriod || m.methodVerification !== "verified"))
    issue("A displayed estimate needs a known period and verified method");
  if (m.display.eligibility === "hold" && !m.display.holdReason) issue("Held estimate needs a reason");
  if (m.display.eligibility !== "hold" && m.display.holdReason) issue("Display eligibility conflicts with hold reason");
  if (m.value.kind === "point" && "lower" in m.uncertainty &&
      (m.value.value < m.uncertainty.lower || m.value.value > m.uncertainty.upper)) issue("Point estimate outside uncertainty interval");
});
export interface PopulationMeasurement extends z.infer<typeof PopulationMeasurementSchema> {}

export const ConservationStatusSchema = z.strictObject({
  system: z.literal("IUCN-global"), category: z.enum(["LC", "NT", "VU", "EN", "CR", "EW", "EX", "DD", "NE"]),
  verification: z.enum(["public-summary", "authorized-assessment"]),
  assessmentYear: Year.nullable(), assessmentDate: Date.nullable(),
  assessmentYearGap: Text.nullable(),
  statusPublicationYear: Year.nullable(),
  latestAssessmentConfirmed: z.boolean(),
  assessmentAuthorizationReference: Text.nullable(),
  references: References, lastVerified: Date,
}).superRefine((s, ctx) => {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message });
  if (s.assessmentYear === null && !s.assessmentYearGap) issue("Unknown assessment year needs a reason");
  if (s.assessmentDate && Number(s.assessmentDate.slice(0, 4)) !== s.assessmentYear) issue("Assessment date/year conflict");
  if (s.verification === "public-summary" && (s.latestAssessmentConfirmed || s.assessmentYear !== null || s.assessmentDate !== null))
    issue("Public summaries cannot assert formal assessment dates or latest-assessment verification");
  if (s.verification === "authorized-assessment" && (!s.assessmentAuthorizationReference || !s.assessmentDate || !s.assessmentYear))
    issue("Formal assessment data needs date and an authorization reference");
});
export interface ConservationStatus extends z.infer<typeof ConservationStatusSchema> {}

export const TrendSchema = z.strictObject({
  direction: z.enum(["increasing", "decreasing", "stable", "mixed", "unknown"]),
  scope: z.enum(["global", "country", "stock", "local-population"]),
  geography: Text, period: PeriodSchema.nullable(),
  interpretation: ClaimSchema,
  limitations: Text,
});

export const AssetCandidateSchema = z.strictObject({
  id: Id, kind: z.enum(["image", "audio"]), sourceUrl: z.url(),
  creator: Text.nullable(), license: Text.nullable(), licenseUrl: z.url().nullable(),
  credit: Text.nullable(), commercialUse: z.enum(["permitted-with-conditions", "permission-required", "unverified"]),
  verification: z.enum(["item-license-verified", "permission-required", "unverified"]),
  setting: z.enum(["wild", "captive", "unknown"]),
  notes: Text,
  playbackRate: z.number().positive().nullable(),
  references: References,
  lastVerified: Date,
  acquired: z.boolean(), clearedForUse: z.boolean(),
}).superRefine((a, ctx) => {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message });
  if (a.verification === "item-license-verified" && (!a.creator || !a.license || !a.licenseUrl || !a.credit))
    issue("Verified media license needs creator, license URL and credit");
  if (a.kind === "image" && a.playbackRate !== null) issue("Images cannot have playback rates");
  if (a.clearedForUse && (!a.acquired || a.verification !== "item-license-verified" || a.commercialUse !== "permitted-with-conditions"))
    issue("Use clearance requires acquired media and verified compatible license");
});
export interface AssetCandidate extends z.infer<typeof AssetCandidateSchema> {}

export const SpeciesSchema = z.strictObject({
  id: Id, commonName: Text, scientificName: Text,
  taxonomy: z.strictObject({
    kingdom: Text, phylum: Text, class: Text, order: Text, family: Text, genus: Text,
    rank: z.literal("species"), treatmentNote: Text, references: References, lastVerified: Date,
  }),
  conservation: ConservationStatusSchema,
  descriptions: z.strictObject({
    habitat: ClaimSchema, distribution: ClaimSchema,
    threats: z.array(ClaimSchema).min(1), ecologicalRole: ClaimSchema,
    conservationEfforts: z.array(ClaimSchema).min(1),
  }),
  measurements: z.array(PopulationMeasurementSchema),
  populationEstimateGap: Text.nullable(),
  trends: z.array(TrendSchema).min(1),
  interventions: z.array(z.strictObject({
    id: Id, kind: z.enum(["documented-recovery", "documented-intervention"]),
    title: Text, geography: Text, description: ClaimSchema, outcome: ClaimSchema,
    inferenceLimit: Text, measurementIds: z.array(Id),
  })),
  sound: z.strictObject({ knowledge: z.enum(["documented-vocalization", "unverified"]),
    information: ClaimSchema, frequencyHz: z.number().nonnegative().nullable(),
    frequencyGap: Text, designConstraint: Text }),
  assets: z.strictObject({ images: z.array(AssetCandidateSchema), audio: z.array(AssetCandidateSchema),
    imageLicensingNote: Text, audioLicensingNote: Text }),
  editorial: z.strictObject({ kind: z.literal("editorial-not-scientific-evidence"),
    workingTitle: NarrativeText, premise: NarrativeText,
    scientificClaimIds: z.array(z.enum(["habitat", "distribution", "threats", "ecologicalRole", "conservationEfforts"])).min(1) }),
  lastVerified: Date, evidenceGaps: z.array(Text),
}).superRefine((s, ctx) => {
  const issue = (message: string) => ctx.addIssue({ code: "custom", message });
  if (!s.measurements.length && !s.populationEstimateGap) issue("Absent estimates need a documented reason");
  if (!s.scientificName.startsWith(`${s.taxonomy.genus} `)) issue("Scientific name/genus mismatch");
  if (s.sound.frequencyHz !== null) issue("Numeric frequencies need a dedicated cited quantitative contract before use");
  for (const a of s.assets.images) if (a.kind !== "image") issue("Image list contains non-image");
  for (const a of s.assets.audio) if (a.kind !== "audio") issue("Audio list contains non-audio");
  const ids = new Set(s.measurements.map((m) => m.id));
  if (ids.size !== s.measurements.length) issue("Duplicate measurement IDs");
  for (const i of s.interventions) for (const id of i.measurementIds) if (!ids.has(id)) issue(`Missing intervention measurement ${id}`);
});
export interface SpeciesRecord extends z.infer<typeof SpeciesSchema> {}

export const SpeciesDatasetSchema = z.strictObject({
  schemaVersion: z.literal("1.0.0"), project: z.literal("VANISHING FREQUENCIES"),
  lastVerified: Date, species: z.array(SpeciesSchema).min(4).max(6),
}).superRefine((data, ctx) => {
  if (new Set(data.species.map((s) => s.id)).size !== data.species.length)
    ctx.addIssue({ code: "custom", message: "Duplicate species IDs" });
});
export interface SpeciesDataset extends z.infer<typeof SpeciesDatasetSchema> {}

export const CitationSchema = z.strictObject({
  id: Id, title: Text, publisher: Text, authors: z.array(Text), url: z.url(),
  publicationDate: Date.nullable(), publicationYear: Year.nullable(), accessedDate: Date,
  type: z.enum(["institutional-profile", "public-news", "government-report", "institutional-report", "primary-study", "taxonomy", "media-file", "rights-guidance", "assessment-lead"]),
  verification: z.enum(["page-read", "search-result-only", "inaccessible"]),
  locators: z.array(Text).min(1),
  reuse: Text, limitations: Text,
}).superRefine((c, ctx) => {
  if (c.publicationDate && Number(c.publicationDate.slice(0, 4)) !== c.publicationYear)
    ctx.addIssue({ code: "custom", message: "Citation date/year conflict" });
});
export interface SpeciesCitation extends z.infer<typeof CitationSchema> {}
export const CitationCatalogSchema = z.strictObject({
  schemaVersion: z.literal("1.0.0"), lastVerified: Date,
  citations: z.array(CitationSchema).min(1),
}).superRefine((data, ctx) => {
  if (new Set(data.citations.map((c) => c.id)).size !== data.citations.length)
    ctx.addIssue({ code: "custom", message: "Duplicate citation IDs" });
});

/** Validate records AND reference integrity. Unknown sources cannot support displayable content. */
export function validateSpeciesFoundation(dataset: unknown, catalog: unknown): SpeciesDataset {
  const data = SpeciesDatasetSchema.parse(dataset);
  const citations = CitationCatalogSchema.parse(catalog);
  const sourceMap = new Map(citations.citations.map((c) => [c.id, c]));
  const errors: string[] = [];
  function walk(node: unknown, path: string, verifiedOn: string): void {
    if (Array.isArray(node)) { node.forEach((v, i) => walk(v, `${path}[${i}]`, verifiedOn)); return; }
    if (!node || typeof node !== "object") return;
    const obj = node as Record<string, unknown>;
    const currentDate = typeof obj.lastVerified === "string" ? obj.lastVerified : verifiedOn;
    if (currentDate > data.lastVerified) errors.push(`${path}: verification date after dataset date`);
    if (typeof obj.sourceId === "string") {
      const source = sourceMap.get(obj.sourceId);
      if (!source) errors.push(`${path}: missing citation ${obj.sourceId}`);
      else {
        if (source.verification !== "page-read" || source.type === "assessment-lead") errors.push(`${path}: source is an unverified lead`);
        if (source.accessedDate !== verifiedOn) errors.push(`${path}: reference access and verification dates differ`);
        if (source.publicationDate && source.publicationDate > source.accessedDate) errors.push(`${path}: source published after access`);
      }
    }
    Object.entries(obj).forEach(([k, v]) => walk(v, `${path}.${k}`, currentDate));
  }
  walk(data.species, "species", data.lastVerified);
  for (const s of data.species) {
    const claimIds = new Set(Object.keys(s.descriptions));
    for (const id of s.editorial.scientificClaimIds) if (!claimIds.has(id)) errors.push(`${s.id}: unknown editorial claim key ${id}`);
    for (const m of s.measurements) for (const ref of m.references) {
      const source = sourceMap.get(ref.sourceId);
      if (source?.publicationYear !== m.sourcePublicationYear) errors.push(`${m.id}: publication year does not match citation`);
    }
  }
  if (errors.length) throw new Error(errors.join("\n"));
  return data;
}
