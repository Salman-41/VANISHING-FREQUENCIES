// Offline derivatives only. Acquiring/replacing sources requires a new rights review.
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import sharp from "sharp";

const manifestPath = "data/sources/homepage-assets.json";
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const sha = (bytes) => createHash("sha256").update(bytes).digest("hex");
for (const asset of manifest.assets) {
  const source = await readFile(asset.sourcePath);
  if (!asset.clearedForUse || sha(source) !== asset.sourceSha256)
    throw new Error(`Unreviewed or changed source: ${asset.id}`);
  const destination = `public/media/${asset.id}.webp`;
  const { data, info } = await sharp(source)
    .rotate()
    .resize({ width: 1600, withoutEnlargement: true })
    .webp({ quality: 84, effort: 6 })
    .toBuffer({ resolveWithObject: true });
  await writeFile(destination, data);
  asset.localPath = `/media/${asset.id}.webp`;
  asset.width = info.width;
  asset.height = info.height;
  asset.bytes = data.length;
  asset.sha256 = sha(data);
}
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log(
  `Prepared ${manifest.assets.length} reviewed WebP assets (${manifest.assets.reduce((n, a) => n + a.bytes, 0)} bytes)`,
);
