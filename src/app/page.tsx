import type { Metadata } from "next";
import Link from "next/link";
import { getResearch } from "@/features/research/server";
import { speciesBySlug } from "@/features/research/selectors";
import { chapters, TAGLINE } from "@/lib/site";
import {
  Chapter,
  CitedText,
  HistoricalEstimate,
  MediaFigure,
  TextLink,
  WaveformMotif,
} from "@/features/homepage/primitives";
import { StaticIndexChart } from "@/features/homepage/index-chart";
import { SpeciesRows } from "@/features/homepage/species-rows";
import { ConservationNotes } from "@/features/homepage/conservation-notes";
import { HomepageMotion } from "@/features/motion/boundary";
export const metadata: Metadata = {
  title: TAGLINE,
  description:
    "An original wildlife documentary: mountain lives, ocean voices, measured biodiversity change, and the people making room for recovery.",
};
export default async function Home() {
  const data = await getResearch();
  const snow = speciesBySlug(data, "snow-leopard")!;
  const whale = speciesBySlug(data, "blue-whale")!;
  const elephant = speciesBySlug(data, "african-forest-elephant")!;
  return (
    <HomepageMotion>
      <section
        id="opening"
        tabIndex={-1}
        aria-labelledby="opening-title"
        className="doc-opening"
        data-chapter="opening"
        data-scene="static"
      >
        <div className="opening-register">
          <p className="eyebrow">00 / An original wildlife documentary</p>
          <p className="eyebrow">A study in attention</p>
        </div>
        <h1 id="opening-title">
          The World Is <br />
          <span>Getting Quieter.</span>
        </h1>
        <MediaFigure
          id="himalaya"
          className="opening-aperture"
          preload
          sizes="(min-width: 1680px) 1560px, 100vw"
        />
        <WaveformMotif />
        <div className="opening-bottom">
          <div>
            <p className="lead">
              A documentary about wildlife, <br className="desktop-break" /> the
              places it inhabits, <br className="desktop-break" /> and the
              evidence of change.
            </p>
            <p className="meta">
              The title is an editorial premise. These datasets do not measure a
              global change in sound. Reading requires no audio.
            </p>
          </div>
          <div className="opening-actions">
            <TextLink href="#snow-leopard" primary>
              Begin the documentary
            </TextLink>
            <TextLink href="/sources">Follow the evidence</TextLink>
          </div>
        </div>
        <nav
          id="chapter-index"
          aria-label="Documentary chapters"
          className="chapter-index"
        >
          <p className="eyebrow">The chapters</p>
          <ol>
            {chapters.slice(1).map((c, i) => (
              <li key={c.id}>
                <Link href={`#${c.id}`}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {c.label}
                  <span aria-hidden="true">↓</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>
      </section>
      <Chapter
        id="snow-leopard"
        number="01"
        label="The high mountains"
        className="chapter-mountains"
      >
        <div className="chapter-title-spread">
          <h2 id="snow-leopard-title">
            A life at <br />
            <span>the edge of sight.</span>
          </h2>
          <div className="title-margin">
            <p className="eyebrow">Snow leopard</p>
            <em>{snow.scientificName}</em>
            <CitedText data={data} claim={snow.descriptions.distribution} />
          </div>
        </div>
        <MediaFigure
          id="himalaya"
          className="mountain-landscape"
          immersiveScene="mountain"
          sizes="(min-width: 1680px) 1560px, 100vw"
        />
        <div className="mountain-spread">
          <div className="mountain-encounter">
            <MediaFigure
              id="snow-leopard"
              className="snow-portrait"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
            <div className="encounter-copy">
              <p className="eyebrow">Rock, cover, coexistence</p>
              <CitedText data={data} claim={snow.descriptions.habitat} />
              <CitedText data={data} claim={snow.descriptions.threats[0]!} />
              <TextLink href="/species/snow-leopard">
                Explore the snow leopard
              </TextLink>
            </div>
          </div>
          <HistoricalEstimate data={data} measurement={snow.measurements[0]!} />
        </div>
        <p className="scene-footnote">
          The Nepal landscape and Ladakh portrait are separate encounters.
          Neither photograph is survey evidence for the national estimate.
        </p>
      </Chapter>
      <Chapter
        id="blue-whale"
        number="02"
        label="The open ocean"
        className="chapter-ocean"
      >
        <div className="ocean-heading">
          <p className="eyebrow">
            Blue whale / <em>{whale.scientificName}</em>
          </p>
          <h2 id="blue-whale-title">
            Below <br />
            <span>the surface.</span>
          </h2>
        </div>
        <div className="ocean-spread">
          <MediaFigure
            id="blue-whale"
            className="ocean-portrait"
            immersiveScene="ocean"
            interactiveAperture
            sizes="(min-width: 1024px) 65vw, 100vw"
          />
          <div className="ocean-margin">
            <p className="eyebrow">An ocean life</p>
            <CitedText data={data} claim={whale.descriptions.habitat} />
            <CitedText data={data} claim={whale.sound.information} />
            <TextLink href="/species/blue-whale">
              Explore the blue whale
            </TextLink>
          </div>
        </div>
        <div className="ocean-evidence">
          <div>
            <h3>
              One stock. <br />
              One measurement window.
            </h3>
            <p className="lead">
              A population estimate begins with a place and a period.
            </p>
            <p className="meta">
              This photograph does not establish a stock identity. The estimate
              is historical; NOAA leaves the stock’s current trend unknown in
              the inspected assessment.
            </p>
            <TextLink href="/sources#noaa-blue-stock">
              Read the stock assessment
            </TextLink>
          </div>
          <HistoricalEstimate
            data={data}
            measurement={whale.measurements[0]!}
          />
        </div>
      </Chapter>
      <Chapter
        id="trends"
        number="03"
        label="Measured biodiversity"
        className="chapter-trends"
      >
        <div className="chapter-title-spread">
          <h2 id="trends-title">
            Read the change. <br />
            <span>Keep the context.</span>
          </h2>
          <div className="title-margin">
            <p className="eyebrow">The Living Planet Index</p>
            <p>
              Average relative change in monitored vertebrate populations. An
              index decline is not the percentage of individual animals that
              disappeared.
            </p>
            <p className="meta">
              Different places, species and monitoring methods contribute to an
              aggregate index. It is not a count of all wildlife.
            </p>
          </div>
        </div>
        <StaticIndexChart data={data} />
        <div className="edition-margin">
          <p className="eyebrow">A separate report edition</p>
          <div>
            <h3>
              Later endpoints. <br />A different dataset.
            </h3>
            <p>
              The verified 2026 report announcement covers 1970–2022. Its
              rounded endpoints are kept separate from this 2024 annual series.
              They supply no intermediate years or reconstructed intervals.
            </p>
            <p className="meta">
              <Link href="/sources#wwf-lpr-2026">
                WWF-UK, Living Planet Report 2026 endpoint summaries
              </Link>{" "}
              · Published and checked 2026-10-08.
            </p>
            <TextLink href="/data">Enter the Data Observatory</TextLink>
          </div>
        </div>
      </Chapter>
      <Chapter
        id="soundscapes"
        number="04"
        label="Sound knowledge"
        className="chapter-sound"
      >
        <div className="sound-heading">
          <h2 id="soundscapes-title">
            A place has <br />
            <span>more than one voice.</span>
          </h2>
          <p className="lead">
            Listen with context. <br />
            Read what a recording cannot tell you.
          </p>
        </div>
        <div className="sound-spread">
          <MediaFigure
            id="african-forest-elephant"
            className="sound-landscape"
            sizes="(min-width: 1024px) 65vw, 100vw"
          />
          <div className="sound-margin">
            <p className="eyebrow">Forest / communication</p>
            <CitedText data={data} claim={elephant.sound.information} />
            <div className="audio-availability" data-audio-slot="unavailable">
              <span className="availability-mark" aria-hidden="true" />
              <p>Recording not yet available</p>
              <p className="meta">
                No wildlife audio has been acquired or cleared. Missing audio is
                not evidence of silence. No playback control is offered.
              </p>
            </div>
            <TextLink href="/soundscapes">Explore sound knowledge</TextLink>
          </div>
        </div>
        <div className="sound-notes">
          <p className="eyebrow">Three things to keep distinct</p>
          <div>
            <h3>A call.</h3>
            <p>A species’ communication, documented by an identified source.</p>
          </div>
          <div>
            <h3>A soundscape.</h3>
            <p>
              A situated recording: a place, a time, a recordist and permission.
            </p>
          </div>
          <div>
            <h3>A measurement.</h3>
            <p>
              Calibrated evidence. An attractive waveform is not a population
              trend.
            </p>
          </div>
        </div>
      </Chapter>
      <Chapter
        id="species-at-risk"
        number="05"
        label="Species at risk"
        className="chapter-species"
      >
        <div className="chapter-title-spread">
          <h2 id="species-at-risk-title">
            Six lives. <br />
            <span>Different pressures.</span>
          </h2>
          <div className="title-margin">
            <p>
              Mountains. Ocean. Forest. Reef. A small documentary selection, not
              a representative sample of global biodiversity.
            </p>
            <p className="meta">
              Categories below are verified public summaries of IUCN global
              status. Formal assessment dates and latest-assessment confirmation
              remain unverified. “Checked” is not an assessment date.
            </p>
            <TextLink href="/species">Open the Species Explorer</TextLink>
          </div>
        </div>
        <SpeciesRows data={data} />
      </Chapter>
      <Chapter
        id="conservation"
        number="06"
        label="Conservation field notes"
        className="chapter-conservation"
      >
        <div className="chapter-title-spread">
          <h2 id="conservation-title">
            Change is possible. <br />
            <span>It happens in places.</span>
          </h2>
          <div className="title-margin">
            <p className="lead">
              People, protection, <br />
              and patient work.
            </p>
            <p>
              These are documented local recoveries and interventions. Their
              outcomes differ. A protected corral, a national survey and a
              nesting shore cannot tell the same story.
            </p>
            <p className="meta">
              No illustrative portrait is presented as a photograph of these
              intervention sites.
            </p>
          </div>
        </div>
        <ConservationNotes data={data} />
        <div className="conservation-next">
          <p>
            Continue with forest restoration, managed elephant habitats and
            whale collision-risk information.
          </p>
          <TextLink href="/species">Explore every conservation record</TextLink>
        </div>
      </Chapter>
      <Chapter
        id="closing"
        number="07"
        label="Keep paying attention"
        className="chapter-closing"
      >
        <h2 id="closing-title">
          There is still <br />
          <span>a world to hear.</span>
        </h2>
        <MediaFigure
          id="himalaya"
          className="closing-aperture"
          sizes="(min-width: 1680px) 1560px, 100vw"
        />
        <div className="closing-bottom">
          <p className="lead">
            Attention begins with the detail: <br />a place, a population, a
            source, <br />
            and the limits of what we know.
          </p>
          <div>
            <p className="eyebrow">Continue the documentary</p>
            <nav aria-label="Continue exploring" className="exploration-links">
              <TextLink href="/species">Species Explorer</TextLink>
              <TextLink href="/data">Data Observatory</TextLink>
              <TextLink href="/soundscapes">Sound knowledge</TextLink>
              <TextLink href="/about">About the documentary</TextLink>
              <TextLink href="/sources">Scientific sources</TextLink>
              <TextLink href="/credits">Image credits & licenses</TextLink>
            </nav>
          </div>
        </div>
        <div className="closing-colophon">
          <p>VANISHING FREQUENCIES</p>
          <a href="#opening">
            Return to the beginning <span aria-hidden="true">↑</span>
          </a>
        </div>
      </Chapter>
    </HomepageMotion>
  );
}
