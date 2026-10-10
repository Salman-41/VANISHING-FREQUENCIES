import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/editorial";
import { getResearch } from "@/features/research/server";
import { orderedSpecies } from "@/features/research/selectors";
import { SpeciesExplorerControls } from "@/features/species/explorer";
import { buildSpeciesIndex, getFacetOptions, parseFilters, filterSpecies, filtersToQuery, type SearchQuery } from "@/features/species/model";
import { SpeciesMotion } from "@/features/species/motion";
import { ExplorerCard } from "@/features/species/presentation";
import "@/styles/species.css";

type Props = { searchParams: Promise<SearchQuery> };
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const query = await searchParams;
  const filtered = ["q", "status", "group", "habitat", "region", "sort"].some((key) => !!query[key]);
  return { title: "Species Explorer", description: "Explore six selected wildlife species through documented habitats, conservation context, and cited scientific evidence.",
    alternates: { canonical: "/species" }, robots: filtered ? { index: false, follow: true } : { index: true, follow: true } };
}
export default async function SpeciesExplorer({ searchParams }: Props) {
  const [data, query] = await Promise.all([getResearch(), searchParams]);
  const all = orderedSpecies(data);
  const index = buildSpeciesIndex(all);
  const options = getFacetOptions(index);
  const { filters, warnings } = parseFilters(query, options);
  const results = filterSpecies(index, filters);
  return <div className="species-explorer-page">
    <PageIntro eyebrow="Species Explorer / the selected collection" title={"Six lives.\nDifferent pressures."}>
      <p>From high mountains to tropical forests and the open ocean. Find a species by name, habitat, or the scope of its documented distribution.</p>
    </PageIntro>
    <SpeciesExplorerControls filters={filters} options={options} warnings={warnings} count={results.length} total={all.length}>
      <SpeciesMotion revision={`${filtersToQuery(filters)}:${results.map((record) => record.id).join(",")}`}>
        {results.length ? <ul className="explorer-records">{results.map((entry) => <li key={entry.id}>
          <ExplorerCard data={data} species={all.find((record) => record.id === entry.id)!} entry={entry} />
        </li>)}</ul> : <section className="species-no-results" aria-labelledby="no-results-heading"><p className="eyebrow">No records in this selection</p><h2 id="no-results-heading">No matching species.</h2><p>Try a broader name or clear one of the filter groups. An empty result describes this six-species collection, not biological absence.</p><Link className="action" href="/species" scroll={false}>Clear all filters</Link></section>}
      </SpeciesMotion>
    </SpeciesExplorerControls>
    <aside className="species-scope" aria-labelledby="collection-scope">
      <div><p className="eyebrow">A selected collection</p><h2 id="collection-scope">Six records, not a global sample.</h2></div>
      <div><p>These species were chosen for evidence quality, habitat diversity, and storytelling potential. Categories use verified public summaries; formal assessment dates remain unverified.</p><p>Habitat and region filters are broad navigation tags drawn from the cited descriptions. They do not represent range polygons, every occupied habitat, or biological absence outside a tag. Asia includes the Borneo record; “Ocean basins” groups the two marine distribution descriptions. Animal groups follow the recorded taxonomy.</p><div className="actions"><Link href="/about">How the species were selected</Link><Link href="/sources">Follow the evidence</Link></div></div>
    </aside>
  </div>;
}
