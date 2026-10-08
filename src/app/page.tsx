import type { Metadata } from "next";
import Link from "next/link";
import { ActionLink, Note } from "@/components/editorial";
import { Claim, FieldNote } from "@/features/research/evidence";
import { getResearch } from "@/features/research/server";
import { speciesBySlug } from "@/features/research/selectors";
import { chapters, TAGLINE } from "@/lib/site";

export const metadata: Metadata = { title: "The World Is Getting Quieter." };
export default async function Home() {
  const data = await getResearch();
  const snow = speciesBySlug(data, "snow-leopard")!;
  const whale = speciesBySlug(data, "blue-whale")!;
  return (
    <>
      <section id="opening" tabIndex={-1} className="home-opening">
        <p className="eyebrow">00 / An original wildlife documentary</p>
        <h1>{TAGLINE}</h1>
        <span className="listening-line" aria-hidden="true" />
        <p className="lead">
          A journey through living landscapes, the animals within them, and the
          evidence of change.
        </p>
        <p className="meta">
          An editorial premise, not a measurement of global acoustic decline.
        </p>
        <div className="actions">
          <ActionLink href="#snow-leopard" primary>
            Begin the documentary
          </ActionLink>
          <ActionLink href="/sources">Follow the evidence</ActionLink>
        </div>
      </section>
      {[snow, whale].map((species, i) => (
        <section
          key={species.id}
          id={species.id}
          tabIndex={-1}
          className="section editorial-grid"
        >
          <div className="grid-heading">
            <p className="eyebrow">
              <span className="chapter-number">0{i + 1}</span> /{" "}
              {species.commonName}
            </p>
            <h2 className="chapter-title">{chapters[i + 1]!.label}</h2>
            <p>
              <em>{species.scientificName}</em>
            </p>
          </div>
          <div className="grid-copy">
            <Claim data={data} claim={species.descriptions.habitat} />
            <ActionLink href={`/species/${species.id}`}>
              Explore {species.commonName.toLowerCase()}
            </ActionLink>
          </div>
        </section>
      ))}
      <section id="trends" tabIndex={-1} className="section editorial-grid">
        <div className="grid-heading">
          <p className="eyebrow">03 / Measured biodiversity trends</p>
          <h2 className="chapter-title">{chapters[3]!.label}</h2>
        </div>
        <div className="grid-copy">
          <p>
            The Living Planet Index measures average relative change in
            monitored vertebrate populations. An index decline is not the
            percentage of individual animals that disappeared.
          </p>
          <p className="meta">
            Published annual results and later report endpoints are separate
            datasets.
          </p>
          <ActionLink href="/data">Read the Data Observatory</ActionLink>
          <Link className="source-disclosure" href="/sources#owid-lpi-2024">
            LPI interpretation and source
          </Link>
        </div>
      </section>
      <section id="soundscapes" tabIndex={-1} className="section">
        <p className="eyebrow">04 / Sound knowledge</p>
        <h2 className="chapter-title">{chapters[4]!.label}</h2>
        <p>
          Read what is known about animal sounds, together with the limits of
          the available recordings.
        </p>
        <Note title="No cleared recordings yet">
          <p>
            No wildlife audio has been acquired or cleared for this documentary.
            Missing audio is not evidence of silence.
          </p>
        </Note>
        <ActionLink href="/soundscapes">Explore sound knowledge</ActionLink>
      </section>
      <section id="species-at-risk" tabIndex={-1} className="section">
        <p className="eyebrow">05 / Species at risk</p>
        <h2 className="chapter-title">{chapters[5]!.label}</h2>
        <p>
          This is a documentary selection, not a representative sample of global
          biodiversity.
        </p>
        <ActionLink href="/species">Open the Species Explorer</ActionLink>
      </section>
      <section id="conservation" tabIndex={-1} className="section">
        <p className="eyebrow">06 / Conservation</p>
        <h2 className="chapter-title">{chapters[6]!.label}</h2>
        <FieldNote
          data={data}
          story={data.successStories.find((s) => s.id === "snow-corrals")!}
        />
        <ActionLink href="/species">
          Explore the other conservation stories
        </ActionLink>
      </section>
      <section id="closing" tabIndex={-1} className="section">
        <p className="eyebrow">07 / Continue exploring</p>
        <h2 className="chapter-title">{chapters[7]!.label}</h2>
        <p>
          Attention begins with the detail: a place, a population, a source, and
          the limits of what we know.
        </p>
        <div className="actions">
          <ActionLink href="/species" primary>
            Explore species
          </ActionLink>
          <ActionLink href="/about">About the documentary</ActionLink>
        </div>
      </section>
    </>
  );
}
