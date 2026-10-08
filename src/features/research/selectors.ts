import type { BiodiversityDataset } from "../../../data/schemas/biodiversity.schema";
import type { ScientificReference, SpeciesRecord } from "../../../data/schemas/species.schema";

export const speciesOrder = ["snow-leopard", "blue-whale", "tiger", "bornean-orangutan", "hawksbill-turtle", "african-forest-elephant"] as const;

export function orderedSpecies(data: BiodiversityDataset): SpeciesRecord[] {
  return speciesOrder.map((id) => {
    const record = data.speciesFoundation.species.find((s) => s.id === id);
    if (!record) throw new Error(`Missing reviewed species: ${id}`);
    return record;
  });
}

export function speciesBySlug(data: BiodiversityDataset, slug: string) {
  return data.speciesFoundation.species.find((s) => s.id === slug);
}

export function resolveReferences(data: BiodiversityDataset, references: ScientificReference[]) {
  return references.map((reference) => {
    const citation = data.citations.find((c) => c.id === reference.sourceId);
    if (!citation || citation.verification !== "page-read") throw new Error(`Unavailable citation: ${reference.sourceId}`);
    return { reference, citation };
  });
}

export function indexSeries(data: BiodiversityDataset, datasetId: string, seriesId: string) {
  if (!data.datasets.some((d) => d.id === datasetId)) throw new Error("Unknown dataset");
  return data.indexObservations.filter((r) => r.datasetId === datasetId && r.seriesId === seriesId);
}

export function clearedAssets(species: SpeciesRecord, kind: "image" | "audio") {
  return species.assets[kind === "image" ? "images" : "audio"].filter((asset) =>
    asset.acquired && asset.clearedForUse && asset.verification === "item-license-verified" && asset.commercialUse === "permitted-with-conditions");
}
