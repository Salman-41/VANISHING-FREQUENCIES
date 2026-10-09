import { z } from "zod";

/** A small interaction payload. Full source-row provenance remains on the server and in downloads. */
export const AnnualPointSchema = z.strictObject({
  id: z.string().min(1), year: z.number().int(), value: z.number().finite().nonnegative().nullable(),
  lower: z.number().finite().nonnegative().nullable(), upper: z.number().finite().nonnegative().nullable(),
  uncertaintyKind: z.enum(["source-bounds", "confidence-interval", "credible-interval"]).nullable(),
  uncertaintyLevel: z.number().gt(0).lt(1).nullable(),
  uncertaintyGap: z.string().nullable(), missingReason: z.string().nullable(),
}).superRefine((p, ctx) => {
  if ((p.lower === null) !== (p.upper === null) || (p.lower !== null && p.upper !== null &&
    (p.lower > p.upper || (p.value !== null && (p.value < p.lower || p.value > p.upper)))))
    ctx.addIssue({ code: "custom", message: "Invalid source bounds" });
  if ((p.value === null) !== (p.missingReason !== null)) ctx.addIssue({ code: "custom", message: "Missing-value reason mismatch" });
  if ((p.lower === null) !== (p.uncertaintyKind === null) || (p.lower === null && p.uncertaintyLevel !== null))
    ctx.addIssue({ code: "custom", message: "Interval metadata mismatch" });
});
export const AnnualSeriesSchema = z.strictObject({
  id: z.string().min(1), datasetId: z.string().min(1), edition: z.string().min(1),
  label: z.string().min(1), scope: z.enum(["global", "region", "ecosystem"]),
  unit: z.literal("index-1970-1"), baselineYear: z.literal(1970), points: z.array(AnnualPointSchema),
}).superRefine((s, ctx) => {
  const years = new Set<number>();
  const ids = new Set<string>();
  for (const p of s.points) {
    if (years.has(p.year) || ids.has(p.id)) ctx.addIssue({ code: "custom", message: "Duplicate annual observation" });
    years.add(p.year); ids.add(p.id);
  }
});
export interface AnnualPoint extends z.infer<typeof AnnualPointSchema> {}
export interface AnnualSeries extends z.infer<typeof AnnualSeriesSchema> {}
