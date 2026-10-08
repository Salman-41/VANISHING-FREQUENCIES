import { readFile } from "node:fs/promises";
import { validateSpeciesFoundation } from "../data/schemas/species.schema.js";

const [dataset, citations] = await Promise.all([
  readFile(new URL("../data/processed/species.json", import.meta.url), "utf8"),
  readFile(new URL("../data/sources/species-citations.json", import.meta.url), "utf8"),
]);
const data = validateSpeciesFoundation(JSON.parse(dataset), JSON.parse(citations));
const measurements = data.species.flatMap((s) => s.measurements);
console.log(`Validated ${data.species.length} species, ${measurements.length} measurements; ${measurements.filter((m) => m.display.eligibility === "dated-context-only").length} eligible only with dated context.`);
