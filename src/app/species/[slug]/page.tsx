import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Note } from "@/components/editorial";
import { Claim, FieldNote, Measurement, SourceReferences, Status } from "@/features/research/evidence";
import { getResearch } from "@/features/research/server";
import { orderedSpecies, resolveReferences, speciesBySlug } from "@/features/research/selectors";
import { SpeciesMotion } from "@/features/species/motion";
import { RelatedSpecies, SpeciesPortrait, SpeciesSection } from "@/features/species/presentation";
import type { ScientificReference } from "../../../../data/schemas/species.schema";
import "@/styles/species.css";

type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export async function generateStaticParams() {
  return orderedSpecies(await getResearch()).map((species) => ({ slug: species.id }));
}
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const species = speciesBySlug(await getResearch(), slug);
  if (!species) notFound();
  const title = `${species.commonName} · ${species.scientificName}`;
  const description = `${species.descriptions.habitat.text} ${species.descriptions.distribution.text} Read cited population evidence, ecological context and conservation efforts.`;
  return { title, description, alternates: { canonical: `/species/${species.id}` }, openGraph: { title, description, type: "article" } };
}
export default async function SpeciesDetail({ params }: Props) {
  const { slug } = await params;
  const data = await getResearch();
  const species = speciesBySlug(data, slug);
  if (!species) notFound();
  const all = orderedSpecies(data);
  const index = all.findIndex((record) => record.id === species.id);
  const previous = all[index - 1];
  const next = all[index + 1];
  const stories = data.successStories.filter((story) => story.speciesId === species.id);
  const references: ScientificReference[] = [
    ...species.conservation.references, ...species.taxonomy.references,
    ...species.descriptions.habitat.references, ...species.descriptions.distribution.references,
    ...species.descriptions.ecologicalRole.references, ...species.sound.information.references,
    ...species.descriptions.threats.flatMap((claim) => claim.references),
    ...species.descriptions.conservationEfforts.flatMap((claim) => claim.references),
    ...species.measurements.flatMap((measurement) => measurement.references),
    ...species.trends.flatMap((trend) => trend.interpretation.references),
    ...stories.flatMap((story) => [...story.description.references, ...story.outcome.references]),
  ];
  const register = new Map<string, { citation: ReturnType<typeof resolveReferences>[number]["citation"]; locators: Set<string> }>();
  for (const { citation, reference } of resolveReferences(data, references)) {
    const record = register.get(citation.id) ?? { citation, locators: new Set<string>() };
    record.locators.add(reference.locator);
    register.set(citation.id, record);
  }
  const sections = [ ["habitat", "Habitat"], ["population", "Population evidence"], ["threats", "Threats"], ["ecology", "Ecological role"], ["sound", "Sound"], ["conservation", "Conservation"], ["evidence", "Sources & gaps"] ];
  return <SpeciesMotion revision={species.id}>
    <div className={`species-detail-page species-detail-${species.id}`}>
      <nav className="species-breadcrumb" aria-label="Breadcrumb"><Link href="/">Documentary</Link><span aria-hidden="true">/</span><Link href="/species">Species Explorer</Link><span aria-hidden="true">/</span><span aria-current="page">{species.commonName}</span></nav>
      <header className="species-hero">
        <div className="species-hero-identity">
          <p className="eyebrow">{String(index + 1).padStart(2, "0")} / selected species</p>
          <h1>{species.commonName}</h1>
          <p className="species-hero-scientific"><em>{species.scientificName}</em></p>
          <div className="species-hero-status"><Status data={data} status={species.conservation} /></div>
          <p className="meta">Species record checked <time dateTime={species.lastVerified}>{species.lastVerified}</time>.</p>
        </div>
        <SpeciesPortrait species={species} variant="hero" preload />
      </header>
      <nav className="species-section-index" aria-label="On this species page">{sections.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}</nav>
      <SpeciesSection id="habitat" number="01" title={species.editorial.workingTitle}>
        <p className="eyebrow">An editorial chapter / cited habitat below</p>
        <h3>Habitat</h3><Claim data={data} claim={species.descriptions.habitat} />
        <h3>Geographical context</h3><Claim data={data} claim={species.descriptions.distribution} />
      </SpeciesSection>
      <SpeciesSection id="population" number="02" title="Read the population in context.">
        {species.measurements.length ? species.measurements.map((measurement) => <Measurement data={data} measurement={measurement} key={measurement.id} />)
          : <Note title="No verified population estimate available in this documentary"><p>{species.populationEstimateGap}</p></Note>}
        <h3>Documented trends and their scope</h3>
        {species.trends.map((trend, i) => <article className="species-trend" key={i}>
          <p className="eyebrow">{trend.direction} · {trend.scope} · {trend.geography}</p>
          <p className="meta">Measurement period: {trend.period ? `${trend.period.startYear}–${trend.period.endYear}` : "not verified in the source summary"}.</p>
          <Claim data={data} claim={trend.interpretation} /><p className="species-context-note">{trend.limitations}</p>
        </article>)}
      </SpeciesSection>
      <SpeciesSection id="threats" number="03" title="The pressures on this life.">
        {species.descriptions.threats.map((claim) => <Claim key={claim.text} data={data} claim={claim} />)}
      </SpeciesSection>
      <SpeciesSection id="ecology" number="04" title="A place in the ecosystem."><Claim data={data} claim={species.descriptions.ecologicalRole} /></SpeciesSection>
      <SpeciesSection id="sound" number="05" title="Sound, with its context.">
        <Claim data={data} claim={species.sound.information} />
        <p className="species-context-note">{species.sound.designConstraint}</p>
        <Note title="Recording unavailable for this species"><p>No recording of {species.commonName.toLowerCase()} has been acquired and cleared for playback. The cited description is sound research, not a transcript of an acquired clip. Unavailable audio does not establish silence.</p></Note>
        <Link className="species-record-link" href="/soundscapes">Visit the habitat listening room <span aria-hidden="true">↗</span></Link>
        <p className="meta">The listening room uses independent NPS recordings of other wildlife and habitats, including humpback whale. It contains no recording of the six selected documentary species.</p>
      </SpeciesSection>
      <SpeciesSection id="conservation" number="06" title="Conservation has a place." className="species-conservation-section">
        <h3>Conservation efforts</h3>{species.descriptions.conservationEfforts.map((claim) => <Claim key={claim.text} data={data} claim={claim} />)}
        {stories.length ? stories.map((story) => <FieldNote data={data} story={story} key={story.id} />) : <Note title="No verified intervention record available"><p>Conservation efforts are described above; no reviewed outcome story is available in this collection.</p></Note>}
      </SpeciesSection>
      <SpeciesSection id="evidence" number="07" title="Follow the evidence.">
        <p>Species record last verified <time dateTime={species.lastVerified}>{species.lastVerified}</time>. Each claim above retains its own source and check date.</p>
        <h3>Remaining questions</h3><ul className="species-evidence-gaps">{species.evidenceGaps.map((gap) => <li key={gap}>{gap}</li>)}</ul>
        <details className="species-taxonomy"><summary>Taxonomy and treatment</summary><dl className="facts">{Object.entries(species.taxonomy).filter(([key]) => !["references", "lastVerified"].includes(key)).map(([key, value]) => <div key={key}><dt>{key.replace(/([A-Z])/g, " $1")}</dt><dd>{String(value)}</dd></div>)}</dl><SourceReferences data={data} references={species.taxonomy.references} verifiedOn={species.taxonomy.lastVerified} /></details>
        <h3>Sources used in this record</h3><ol className="species-reference-list">{[...register.values()].map(({ citation, locators }) => <li key={citation.id}>
          <Link href={`/sources#${citation.id}`}>{citation.publisher}: {citation.title}</Link>
          <p className="meta">Published {citation.publicationDate ?? citation.publicationYear ?? "date not reported"}; accessed {citation.accessedDate}. Source locations: {[...locators].join("; ")}.</p><a href={citation.url}>Open primary source ↗</a>
        </li>)}</ol>
      </SpeciesSection>
      <RelatedSpecies data={data} species={species} all={all} />
      <nav className="species-previous-next" aria-label="Documentary species order">
        {previous ? <Link href={`/species/${previous.id}`}><span>Previous record</span>{previous.commonName} <span aria-hidden="true">↖</span></Link> : <Link href="/species"><span>The full collection</span>Species Explorer <span aria-hidden="true">↖</span></Link>}
        {next ? <Link href={`/species/${next.id}`}><span>Next record</span>{next.commonName} <span aria-hidden="true">↗</span></Link> : <Link href="/species"><span>The full collection</span>Species Explorer <span aria-hidden="true">↗</span></Link>}
      </nav>
    </div>
  </SpeciesMotion>;
}
