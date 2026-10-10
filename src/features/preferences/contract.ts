import { z } from "zod";

// Reference contract for tests and tooling; the three-field browser reader is checked against it.
export const PreferencesSchema = z.strictObject({
  version: z.literal(1),
  readWithoutMotion: z.boolean(),
  lighterMedia: z.boolean(),
});
export type Preferences = z.infer<typeof PreferencesSchema>;
