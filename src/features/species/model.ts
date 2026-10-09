import type { ConservationStatus, SpeciesRecord } from "../../../data/schemas/species.schema";
import { conservationLabels } from "../research/labels";

export const facetKeys = ["status", "group", "habitat", "region"] as const;
export type FacetKey = typeof facetKeys[number];
export const sorts = { narrative: "Documentary order", name: "Common name · A–Z", "name-desc": "Common name · Z–A", scientific: "Scientific name · A–Z" };
export type Sort = keyof typeof sorts;
export type Filters = { q: string; status: string[]; group: string[]; habitat: string[]; region: string[]; sort: Sort };
export type FacetOption = { value: string; label: string; count: number };
export type FacetOptions = Record<FacetKey, FacetOption[]>;
export type SpeciesIndexEntry = {
  id: string; commonName: string; scientificName: string; status: ConservationStatus["category"];
  group: string; habitat: string[]; region: string[]; order: number;
};
export const habitatLabels: Record<string, string> = {
  mountain: "Mountain", "open-ocean": "Open ocean", forest: "Forest", grassland: "Grassland",
  "reef-coast": "Reef & coast", unclassified: "Habitat not classified",
};
export const regionLabels: Record<string, string> = {
  asia: "Asia", africa: "West & Central Africa", ocean: "Ocean basins", unclassified: "Region not classified",
};
const groupLabels: Record<string, string> = { Mammalia: "Mammals", Reptilia: "Reptiles" };

/** Broad navigation tags, derived from the cited habitat/distribution claims.
 * They are not exclusive habitats, occurrence maps, or range overlap assertions.
 * See docs/development/species-pages.md for the field and source mapping. */
const navigation: Partial<Record<string, { habitat: string[]; region: string[] }>> = {
  "snow-leopard": { habitat: ["mountain"], region: ["asia"] },
  "blue-whale": { habitat: ["open-ocean"], region: ["ocean"] },
  tiger: { habitat: ["forest", "grassland"], region: ["asia"] },
  "bornean-orangutan": { habitat: ["forest"], region: ["asia"] },
  "hawksbill-turtle": { habitat: ["reef-coast"], region: ["ocean"] },
  "african-forest-elephant": { habitat: ["forest"], region: ["africa"] },
};
export function buildSpeciesIndex(species: readonly SpeciesRecord[]): SpeciesIndexEntry[] {
  return species.map((record, order) => {
    const tags = navigation[record.id];
    return {
      id: record.id, commonName: record.commonName, scientificName: record.scientificName,
      status: record.conservation.category, group: record.taxonomy.class,
      habitat: [...(tags?.habitat ?? ["unclassified"])], region: [...(tags?.region ?? ["unclassified"])], order,
    };
  });
}
export function facetLabel(key: FacetKey, value: string): string {
  if (key === "status") return conservationLabels[value as ConservationStatus["category"]] ?? value;
  if (key === "group") return groupLabels[value] ?? value;
  return (key === "habitat" ? habitatLabels : regionLabels)[value] ?? value;
}
export function getFacetOptions(entries: readonly SpeciesIndexEntry[]): FacetOptions {
  const options = {} as FacetOptions;
  for (const key of facetKeys) {
    const values = new Map<string, number>();
    for (const entry of entries) {
      for (const value of new Set(Array.isArray(entry[key]) ? entry[key] : [entry[key]]))
        values.set(value, (values.get(value) ?? 0) + 1);
    }
    options[key] = [...values].map(([value, count]) => ({ value, label: facetLabel(key, value), count }))
      .sort((a, b) => a.label.localeCompare(b.label, "en"));
  }
  return options;
}
export function emptyFilters(): Filters { return { q: "", status: [], group: [], habitat: [], region: [], sort: "narrative" }; }
export type SearchQuery = Record<string, string | string[] | undefined>;
export function parseFilters(query: SearchQuery, options: FacetOptions): { filters: Filters; warnings: string[] } {
  const filters = emptyFilters();
  const warnings: string[] = [];
  const all = (key: string) => Array.isArray(query[key]) ? query[key] as string[] : query[key] ? [query[key] as string] : [];
  filters.q = (all("q")[0] ?? "").trim();
  for (const key of facetKeys) {
    const known = new Set(options[key].map((option) => option.value));
    for (const value of new Set(all(key).filter(Boolean))) {
      if (known.has(value)) filters[key].push(value);
      else warnings.push(`Unrecognized ${key} filter “${value}” was ignored.`);
    }
  }
  const requestedSort = all("sort")[0];
  if (requestedSort && Object.hasOwn(sorts, requestedSort)) filters.sort = requestedSort as Sort;
  else if (requestedSort) warnings.push(`Unrecognized sort “${requestedSort}”; documentary order is shown.`);
  return { filters, warnings };
}
export function filtersToQuery(filters: Filters): string {
  const query = new URLSearchParams();
  if (filters.q) query.set("q", filters.q);
  for (const key of facetKeys) for (const value of [...filters[key]].sort()) query.append(key, value);
  if (filters.sort !== "narrative") query.set("sort", filters.sort);
  return query.toString();
}
export function filterSpecies(entries: readonly SpeciesIndexEntry[], filters: Filters): SpeciesIndexEntry[] {
  const q = filters.q.trim().toLocaleLowerCase("en");
  const results = entries.filter((entry) => {
    if (q && !entry.commonName.toLocaleLowerCase("en").includes(q) && !entry.scientificName.toLocaleLowerCase("en").includes(q)) return false;
    return facetKeys.every((key) => !filters[key].length || filters[key].some((value) =>
      Array.isArray(entry[key]) ? entry[key].includes(value) : entry[key] === value));
  });
  return results.sort((a, b) => {
    if (filters.sort === "name") return a.commonName.localeCompare(b.commonName, "en") || a.order - b.order;
    if (filters.sort === "name-desc") return b.commonName.localeCompare(a.commonName, "en") || a.order - b.order;
    if (filters.sort === "scientific") return a.scientificName.localeCompare(b.scientificName, "en") || a.order - b.order;
    return a.order - b.order;
  });
}
export function filterSummary(filters: Filters): string[] {
  const labels: string[] = [];
  if (filters.q) labels.push(`Name contains “${filters.q}”`);
  for (const key of facetKeys) if (filters[key].length) labels.push(`${key}: ${filters[key].map((value) => facetLabel(key, value)).join(" or ")}`);
  return labels;
}
export function relatedSpecies(entries: readonly SpeciesIndexEntry[], currentId: string, limit = 2) {
  const current = entries.find((entry) => entry.id === currentId);
  if (!current) return [];
  return entries.filter((entry) => entry.id !== currentId).map((entry) => {
    const shared = entry.habitat.filter((value) => current.habitat.includes(value) && value !== "unclassified");
    const sameRegion = entry.region.some((value) => current.region.includes(value) && value !== "unclassified");
    const score = shared.length * 3 + Number(sameRegion) * 2 + Number(entry.group === current.group);
    const reason = shared.length ? `Shared navigation habitat: ${shared.map((value) => habitatLabels[value]).join(", ")}`
      : entry.group === current.group ? `Also in the ${facetLabel("group", entry.group).toLowerCase()} group`
      : "Another selection from the documentary";
    return { ...entry, score, reason };
  }).sort((a, b) => b.score - a.score || a.order - b.order).slice(0, limit);
}
