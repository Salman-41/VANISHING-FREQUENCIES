import { z } from "zod";
import ledger from "../../../data/sources/audio-assets.json";

const ClipSchema = z.strictObject({
  id: z.string().regex(/^(forest|mountain|ocean)-[a-z-]+$/),
  habitat: z.enum(["forest", "mountain", "ocean"]),
  kind: z.enum(["ambience", "wildlife"]),
  title: z.string().min(1),
  description: z.string().min(1),
  place: z.string().min(1),
  sourcePage: z.url(),
  sourceFile: z.url(),
  licensePage: z.url(),
  creator: z.string().min(1),
  credit: z.string().min(1),
  capturedOn: z.iso.date().nullable(),
  retrievedOn: z.iso.date(),
  localPath: z.string().regex(/^\/audio\/[a-z-]+\.mp3$/),
  format: z.literal("MP3"),
  durationSeconds: z.number().positive(),
  sourceSha256: z.string().regex(/^[a-f0-9]{64}$/),
  localSha256: z.string().regex(/^[a-f0-9]{64}$/),
  sourceBytes: z.number().int().positive(),
  localBytes: z.number().int().positive(),
  processing: z.string().min(1),
  waveformPeaks: z.array(z.number().min(0).max(1)).length(72),
  waveformMethod: z.string().min(1),
});

export const AudioCatalogSchema = z.strictObject({
  schemaVersion: z.literal("1.0.0"),
  rights: z.string().min(1),
  verifiedOn: z.iso.date(),
  clips: z.array(ClipSchema).length(6),
}).superRefine((data, ctx) => {
  if (new Set(data.clips.map((clip) => clip.id)).size !== data.clips.length)
    ctx.addIssue({ code: "custom", message: "Duplicate audio id" });
  for (const habitat of ["forest", "mountain", "ocean"] as const) {
    const clips = data.clips.filter((clip) => clip.habitat === habitat);
    if (clips.length !== 2 || !clips.some((clip) => clip.kind === "ambience") || !clips.some((clip) => clip.kind === "wildlife"))
      ctx.addIssue({ code: "custom", message: `${habitat} needs ambience and wildlife layers` });
  }
});

export type AudioClip = z.infer<typeof ClipSchema>;
export type Habitat = AudioClip["habitat"];
export const audioCatalog = AudioCatalogSchema.parse(ledger);
