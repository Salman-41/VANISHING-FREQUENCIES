import { z } from "zod/mini";
import ledger from "../../../data/sources/audio-assets.json";

const ClipSchema = z.strictObject({
  id: z.string().check(z.regex(/^(forest|mountain|ocean)-[a-z-]+$/)),
  habitat: z.enum(["forest", "mountain", "ocean"]),
  kind: z.enum(["ambience", "wildlife"]),
  title: z.string().check(z.minLength(1)),
  description: z.string().check(z.minLength(1)),
  place: z.string().check(z.minLength(1)),
  sourcePage: z.url(),
  sourceFile: z.url(),
  licensePage: z.url(),
  creator: z.string().check(z.minLength(1)),
  credit: z.string().check(z.minLength(1)),
  capturedOn: z.nullable(z.iso.date()),
  retrievedOn: z.iso.date(),
  localPath: z.string().check(z.regex(/^\/audio\/[a-z-]+\.mp3$/)),
  format: z.literal("MP3"),
  durationSeconds: z.number().check(z.gt(0)),
  sourceSha256: z.string().check(z.regex(/^[a-f0-9]{64}$/)),
  localSha256: z.string().check(z.regex(/^[a-f0-9]{64}$/)),
  sourceBytes: z.int().check(z.gt(0)),
  localBytes: z.int().check(z.gt(0)),
  processing: z.string().check(z.minLength(1)),
  waveformPeaks: z.array(z.number().check(z.minimum(0), z.maximum(1))).check(z.length(72)),
  waveformMethod: z.string().check(z.minLength(1)),
});

export const AudioCatalogSchema = z.strictObject({
  schemaVersion: z.literal("1.0.0"),
  rights: z.string().check(z.minLength(1)),
  verifiedOn: z.iso.date(),
  clips: z.array(ClipSchema).check(z.length(6)),
}).check(({ value: data, issues }) => {
  if (new Set(data.clips.map((clip) => clip.id)).size !== data.clips.length)
    issues.push({ code: "custom", input: data, message: "Duplicate audio id" });
  for (const habitat of ["forest", "mountain", "ocean"] as const) {
    const clips = data.clips.filter((clip) => clip.habitat === habitat);
    if (clips.length !== 2 || !clips.some((clip) => clip.kind === "ambience") || !clips.some((clip) => clip.kind === "wildlife"))
      issues.push({ code: "custom", input: data, message: `${habitat} needs ambience and wildlife layers` });
  }
});

export type AudioClip = z.infer<typeof ClipSchema>;
export type Habitat = AudioClip["habitat"];
export const audioCatalog = AudioCatalogSchema.parse(ledger);
