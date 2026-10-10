import type { Metadata } from "next";
import { ActionLink, PageIntro, Note } from "@/components/editorial";
import { getResearch } from "@/features/research/server";
export const metadata: Metadata = {
  title: "About",
  description: "The purpose, creative method, and scientific boundaries of VANISHING FREQUENCIES.",
  alternates: { canonical: "/about" },
};
export default async function About() {
  const data = await getResearch();
  return (
    <>
      <PageIntro eyebrow="About" title="A documentary about attention.">
        <p>
          VANISHING FREQUENCIES is an original wildlife documentary about what
          measured evidence can tell us, where it stops, and how we pay
          attention to living systems.
        </p>
      </PageIntro>
      <section className="section">
        <h2>The Listening Margin</h2>
        <p>
          “The World Is Getting Quieter” is an editorial premise. It does not
          establish a measured global acoustic trend. The documentary pairs
          landscapes, species accounts, published measurements, and optional
          archival recordings. These describe different places, periods, and
          kinds of evidence; they are not merged into one proxy for ecosystem
          health.
        </p>
        <p>
          The selected species span different habitats and forms of life. They
          are an editorial selection, not a representative sample of global
          biodiversity. Visual scenes and sound blends are crafted to support
          the narrative. They do not claim to be scientific measurements.
        </p>
      </section>
      <section className="section">
        <h2>Measurement is not metaphor</h2>
        <dl className="facts">
          <div>
            <dt>Living Planet Index</dt>
            <dd>
              Average relative change in monitored vertebrate populations. It
              is not the percentage of individual animals that have
              disappeared, an animal headcount, or a measure of all life on
              Earth. Published editions remain separate.
            </dd>
          </div>
          <div>
            <dt>Species estimates</dt>
            <dd>
              Dated estimates are shown with their population scope, geography,
              method, uncertainty, and source edition where documented. Unknown
              values stay unknown; unobserved historical values are not
              interpolated.
            </dd>
          </div>
          <div>
            <dt>Occurrences</dt>
            <dd>
              Occurrence records document observations and recorded presence.
              Their counts are not estimates of population abundance.
            </dd>
          </div>
          <div>
            <dt>Sound and image</dt>
            <dd>
              Credits identify the actual licensed material in use. The
              soundscapes page combines recordings made in separate places;
              the mix is an editorial composition, not a measured or historic
              habitat soundscape. No recording is presented as a snow leopard
              or blue whale call.
            </dd>
          </div>
        </dl>
      </section>
      <section className="section">
        <h2>How to read a scene</h2>
        <p>
          Photographs document their credited subjects and settings; they do
          not establish population size or prove that a conservation action
          caused a change. The mountain, ocean, and waveform motifs are
          illustrative. Charts use the published values and boundaries listed
          alongside them, and the text remains available without animation,
          audio, or WebGL.
        </p>
      </section>
      <Note title="Review and evidence limits">
        <p>
          The research bundle was verified on{" "}
          <time dateTime={data.verifiedOn}>{data.verifiedOn}</time>. This desk
          review is not independent scientific certification. Formal assessment
          dates for some species, some original population methods, and
          source-specific limits remain unresolved. The source register marks
          access and reuse questions that have not been cleared.
        </p>
      </Note>
      <div className="actions">
        <ActionLink href="/data">Read the measured evidence</ActionLink>
        <ActionLink href="/sources">Follow the sources</ActionLink>
        <ActionLink href="/credits">Read the credits</ActionLink>
      </div>
    </>
  );
}
