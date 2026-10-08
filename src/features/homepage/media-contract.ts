import { z } from "zod";

const hash = z.string().regex(/^[a-f0-9]{64}$/);
export const homepageMediaSchema = z
  .object({
    schemaVersion: z.literal("1.0.0"),
    verifiedOn: z.iso.date(),
    assets: z
      .array(
        z.object({
          id: z.string(),
          title: z.string(),
          creator: z.string(),
          license: z.string(),
          licenseUrl: z.url(),
          sourceUrl: z.url(),
          downloadUrl: z.url(),
          originalPublication: z.url().optional(),
          sourcePath: z.string().regex(/^data\/raw\/media\/[^/]+\.jpg$/),
          sourceSha256: hash,
          sourceBytes: z.number().int().positive(),
          acquiredRepresentation: z.string(),
          location: z.string(),
          setting: z.enum(["landscape", "wild", "rehabilitation-site"]),
          captureDate: z.string().nullable(),
          notes: z.string(),
          alt: z.string().min(10),
          verifiedOn: z.iso.date(),
          rightsEvidence: z.string(),
          commercialUse: z.literal("permitted"),
          clearedForUse: z.literal(true),
          changes: z.string(),
          localPath: z.string().regex(/^\/media\/[^/]+\.webp$/),
          width: z.number().int().positive(),
          height: z.number().int().positive(),
          bytes: z.number().int().positive(),
          sha256: hash,
        }),
      )
      .length(7),
  })
  .superRefine((registry, context) => {
    if (
      new Set(registry.assets.map((a) => a.id)).size !== registry.assets.length
    )
      context.addIssue({ code: "custom", message: "Duplicate media ID" });
  });
export type HomepageMedia = z.infer<
  typeof homepageMediaSchema
>["assets"][number];
