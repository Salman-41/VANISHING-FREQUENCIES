import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";
import { z } from "zod";
import { validateBiodiversityDataset } from "../../../data/schemas/biodiversity.schema";

/** Validates the immutable export and matching report; never rebuilds or writes research. */
export async function loadLocalResearch(root: string) {
  const [bytes, reportText] = await Promise.all([
    readFile(path.join(root, "data/processed/biodiversity.json")),
    readFile(
      path.join(root, "data/processed/reports/validation-report.json"),
      "utf8",
    ),
  ]);
  const data = validateBiodiversityDataset(JSON.parse(bytes.toString("utf8")));
  const report = z
    .object({
      status: z.literal("passed"),
      buildFingerprint: z.string(),
      outputs: z.object({
        "biodiversity.json": z.object({
          sha256: z.string(),
          bytes: z.number(),
        }),
      }),
    })
    .parse(JSON.parse(reportText));
  const sha256 = createHash("sha256").update(bytes).digest("hex");
  // Reject a stale successful report or a saved export following a failed attempt.
  if (
    report.buildFingerprint !== data.buildFingerprint ||
    report.outputs["biodiversity.json"].sha256 !== sha256 ||
    report.outputs["biodiversity.json"].bytes !== bytes.length
  ) {
    throw new Error(
      "Research export does not have a matching successful validation report",
    );
  }
  return { data, sha256 };
}
