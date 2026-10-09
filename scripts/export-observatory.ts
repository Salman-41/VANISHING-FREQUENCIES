import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { loadLocalResearch } from "../src/features/research/load-local";
import { createDownloads } from "../src/features/observatory/downloads";

const { data, sha256 } = await loadLocalResearch(process.cwd());
const files = createDownloads(data, sha256);
const check = process.argv.includes("--check");
const folder = path.join(process.cwd(), "public/data-downloads");
if (!check) await mkdir(folder, { recursive: true });
for (const [name, content] of Object.entries(files)) {
  const file = path.join(folder, name);
  if (check) {
    if (await readFile(file, "utf8") !== content) throw new Error(`Stale Observatory download: ${name}. Run npm run data:observatory-export after scientific/rights review.`);
  } else await writeFile(file, content);
}
console.log(`${check ? "Verified" : "Created"} ${Object.keys(files).length} deterministic aggregate download files; source export ${sha256}.`);
