import { z } from "zod";

export const DateSchema = z.iso.date();
const Id = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const Text = z.string().min(1);
const CitationIds = z.array(Id).min(1);
export const ClaimSchema = z
  .object({ text: Text, sourceIds: CitationIds })
  .strict();
export const SourceSchema = z
  .object({
    id: Id,
    title: Text,
    publisher: Text,
    url: z.url(),
    publishedDate: DateSchema.nullable(),
    accessedDate: DateSchema,
    access: z.enum(["read", "search-result", "blocked", "dynamic-only"]),
    use: Text,
    rights: Text,
    locator: Text,
  })
  .strict();
export const AssetSchema = z
  .object({
    kind: z.enum(["image", "audio", "model", "font"]),
    url: z.url(),
    creator: Text,
    license: Text,
    licenseUrl: z.url(),
    credit: Text,
    downloadedDate: DateSchema.nullable(),
    restrictions: Text,
    sourceIds: CitationIds,
    cleared: z.boolean(),
    playbackRate: z.number().positive().optional(),
  })
  .strict();
const PeriodSchema = z
  .object({
    startYear: z.number().int().min(1500).max(2100),
    endYear: z.number().int().min(1500).max(2100),
  })
  .strict()
  .refine((p) => p.startYear <= p.endYear, "Reversed measurement period");
const Bounds = z
  .object({
    lower: z.number().finite(),
    upper: z.number().finite(),
    kind: z.enum(["range", "confidence-interval", "credible-interval"]),
    level: z.number().gt(0).lt(1).nullable(),
  })
  .strict()
  .refine((b) => b.lower <= b.upper, "Reversed uncertainty bounds");
export const ObservationSchema = z
  .object({
    id: Id,
    seriesId: Id,
    measure: z.enum([
      "relative-index",
      "index-percent-change",
      "abundance",
      "occurrences",
      "species-richness",
    ]),
    value: z.number().finite(),
    unit: z.enum([
      "index-1970-1",
      "percent",
      "individuals",
      "mature-individuals",
      "records",
      "species",
    ]),
    period: PeriodSchema,
    geography: Text,
    ecosystem: Text,
    taxon: Text,
    edition: Text,
    uncertainty: Bounds.nullable(),
    sourceIds: CitationIds,
    sourceLocator: Text,
    method: Text,
    lastVerified: DateSchema,
    redistribution: z.enum(["cleared", "review-required"]),
  })
  .strict()
  .superRefine((o, ctx) => {
    const allowed = {
      "relative-index": ["index-1970-1"],
      "index-percent-change": ["percent"],
      abundance: ["individuals", "mature-individuals"],
      occurrences: ["records"],
      "species-richness": ["species"],
    };
    if (!allowed[o.measure].includes(o.unit))
      ctx.addIssue({ code: "custom", message: "Measure and unit mismatch" });
    if (o.measure === "index-percent-change" ? o.value < -100 : o.value < 0)
      ctx.addIssue({ code: "custom", message: "Impossible negative value" });
    if (
      o.uncertainty &&
      (o.value < o.uncertainty.lower || o.value > o.uncertainty.upper)
    )
      ctx.addIssue({
        code: "custom",
        message: "Value outside uncertainty bounds",
      });
  });
export const SpeciesSchema = z
  .object({
    id: Id,
    commonName: Text,
    scientificName: Text,
    family: Text.nullable(),
    taxonomyNotes: Text,
    group: z.enum(["mammal", "reptile", "bird", "fish", "amphibian"]),
    conservation: z
      .object({
        category: z.enum([
          "EX",
          "EW",
          "CR",
          "EN",
          "VU",
          "NT",
          "LC",
          "DD",
          "NE",
        ]),
        system: z.literal("IUCN-global"),
        assessmentDate: DateSchema.nullable(),
        assessmentUrl: z.url().nullable(),
        verification: z.enum(["assessment-verified", "organization-summary"]),
        sourceIds: CitationIds,
      })
      .strict(),
    habitat: ClaimSchema,
    distribution: ClaimSchema,
    ecosystems: z.array(Text).min(1),
    regions: z.array(Text).min(1),
    populationEstimate: ObservationSchema.nullable(),
    estimateUnavailableReason: Text.nullable(),
    populationTrend: z.enum(["increasing", "decreasing", "stable", "unknown"]),
    trendSourceIds: z.array(Id),
    measurementPeriod: PeriodSchema.nullable(),
    threats: z.array(ClaimSchema),
    ecologicalRole: ClaimSchema.nullable(),
    interventions: z.array(ClaimSchema),
    successes: z.array(ClaimSchema),
    featuredChapter: z.number().int().min(0).max(7).nullable(),
    coordinates: z
      .object({
        longitude: z.number().min(-180).max(180),
        latitude: z.number().min(-90).max(90),
        precision: z.literal("illustrative-habitat-centre"),
      })
      .nullable(),
    audio: AssetSchema.nullable(),
    image: AssetSchema.nullable(),
    model: AssetSchema.nullable(),
    sourceIds: CitationIds,
    lastVerified: DateSchema,
    gaps: z.array(Text),
  })
  .strict()
  .superRefine((s, ctx) => {
    if (
      s.conservation.verification === "assessment-verified" &&
      (!s.conservation.assessmentDate || !s.conservation.assessmentUrl)
    )
      ctx.addIssue({
        code: "custom",
        message: "Verified assessment needs date and URL",
      });
    if (!s.populationEstimate && !s.estimateUnavailableReason)
      ctx.addIssue({
        code: "custom",
        message: "Missing estimates need explanation",
      });
    if (s.populationEstimate && s.populationEstimate.measure !== "abundance")
      ctx.addIssue({
        code: "custom",
        message: "Population estimate must measure abundance",
      });
    if (s.populationTrend !== "unknown" && !s.trendSourceIds.length)
      ctx.addIssue({ code: "custom", message: "Trend requires provenance" });
  });
export const EditorialSchema = z
  .object({ speciesId: Id, title: Text, question: Text, treatment: Text })
  .strict();
export const VisualSchema = z
  .object({
    speciesId: Id,
    palette: z.array(z.string().regex(/^#[0-9A-Fa-f]{6}$/)).min(2),
    scene: Text,
    representation: z.literal("artistic"),
  })
  .strict();
export interface Species extends z.infer<typeof SpeciesSchema> {}
export interface PopulationObservation extends z.infer<
  typeof ObservationSchema
> {}
export interface Source extends z.infer<typeof SourceSchema> {}
