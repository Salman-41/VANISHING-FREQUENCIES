import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageIntro, Note } from "@/components/editorial";
import { Claim, FieldNote, Measurement, SourceReferences, Status } from "@/features/research/evidence";
import { getResearch } from "@/features/research/server";
import { orderedSpecies, speciesBySlug } from "@/features/research/selectors";
type Props = { params: Promise<{ slug: string }> };
// This documentary has a fixed reviewed collection; unknown slugs fail before streaming.
export const dynamicParams = false;
export async function generateStaticParams() { return orderedSpecies(await getResearch()).map((s) => ({ slug: s.id })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params; const species = speciesBySlug(await getResearch(), slug);
  return { title: species?.commonName ?? "Species unavailable" };
}
export default async function SpeciesDetail({ params }: Props) {
  const { slug } = await params; const data = await getResearch(); const species = speciesBySlug(data, slug);
  if (!species) notFound();
  return <><PageIntro eyebrow="Selected species" title={species.commonName}><p><em>{species.scientificName}</em></p><Link href="/species">Back to the Species Explorer</Link></PageIntro>
    <Status data={data} status={species.conservation} />
    <nav aria-label="On this species page"><ul className="footer-links">{["habitat", "population", "sound", "conservation", "evidence"].map((id) => <li key={id}><a href={`#${id}`}>{id === "population" ? "Population evidence" : id[0]!.toUpperCase() + id.slice(1)}</a></li>)}</ul></nav>
    <section id="habitat" className="section"><h2>Habitat and distribution</h2><Claim data={data} claim={species.descriptions.habitat} /><Claim data={data} claim={species.descriptions.distribution} /><h3>Ecological role</h3><Claim data={data} claim={species.descriptions.ecologicalRole} /><h3>Main threats</h3>{species.descriptions.threats.map((c) => <Claim key={c.text} data={data} claim={c} />)}</section>
    <section id="population" className="section"><h2>Population evidence</h2>{species.measurements.length ? species.measurements.map((m) => <Measurement data={data} measurement={m} key={m.id} />) : <Note title="No verified population estimate available in this documentary"><p>{species.populationEstimateGap}</p></Note>}
      <h3>Documented trends and their scope</h3>{species.trends.map((t, i) => <article key={i}><p className="eyebrow">{t.direction} · {t.scope} · {t.geography}</p><p className="meta">Measurement period: {t.period ? `${t.period.startYear}–${t.period.endYear}` : "not verified in the source summary"}.</p><Claim data={data} claim={t.interpretation} /><p className="meta">{t.limitations}</p></article>)}</section>
    <section id="sound" className="section"><h2>Sound knowledge</h2><Claim data={data} claim={species.sound.information} /><p>{species.sound.designConstraint}</p><Note title="Recording unavailable"><p>No recording has been acquired and cleared for playback. This description is research about sound, not a transcript of an acquired recording.</p></Note></section>
    <section id="conservation" className="section"><h2>Conservation efforts</h2>{species.descriptions.conservationEfforts.map((c) => <Claim key={c.text} data={data} claim={c} />)}{data.successStories.filter((s) => s.speciesId === species.id).map((s) => <FieldNote data={data} story={s} key={s.id} />)}</section>
    <section id="evidence" className="section"><h2>Evidence and remaining questions</h2><p>Species record last verified <time dateTime={species.lastVerified}>{species.lastVerified}</time>.</p><ul>{species.evidenceGaps.map((gap) => <li key={gap}>{gap}</li>)}</ul><details><summary>Taxonomy and treatment</summary><dl className="facts">{Object.entries(species.taxonomy).filter(([k]) => !["references", "lastVerified"].includes(k)).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{String(v)}</dd></div>)}</dl><SourceReferences data={data} references={species.taxonomy.references} verifiedOn={species.taxonomy.lastVerified} /></details><div className="actions"><Link className="action" href="/species">Explore the other species</Link><Link className="action" href="/sources">Follow all sources</Link></div></section>
  </>;
}
