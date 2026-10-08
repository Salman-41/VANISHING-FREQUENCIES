import "server-only";
import registry from "../../../data/sources/homepage-assets.json";
import { homepageMediaSchema } from "./media-contract";

export const homepageAssets = homepageMediaSchema.parse(registry).assets;
export function homepageAsset(id: string) {
  const asset = homepageAssets.find((a) => a.id === id);
  if (!asset) throw new Error(`Missing homepage media: ${id}`);
  return asset;
}
