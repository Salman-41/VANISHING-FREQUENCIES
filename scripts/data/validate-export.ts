import { readFile } from "node:fs/promises";
import { validateBiodiversityDataset } from "../../data/schemas/biodiversity.schema.js";
import { validateSpeciesFoundation } from "../../data/schemas/species.schema.js";

const [bundlePath, rawSpeciesPath, citationsPath] = process.argv.slice(2);
if (!bundlePath) throw new Error("Usage: node --import tsx scripts/data/validate-export.ts <bundle> [raw-species citations]");
if (rawSpeciesPath && citationsPath) {
  const [raw, citations] = await Promise.all([readFile(rawSpeciesPath, "utf8"), readFile(citationsPath, "utf8")]);
  validateSpeciesFoundation(JSON.parse(raw), JSON.parse(citations));
}
const data = validateBiodiversityDataset(JSON.parse(await readFile(bundlePath, "utf8")));
console.log(`Zod passed: ${data.indexObservations.length} index records; ${data.speciesFoundation.species.length} species; ${data.availability.speciesPopulationRecords} population records; ${data.successStories.length} stories.`);
