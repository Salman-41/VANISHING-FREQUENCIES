import type { Metadata } from "next";
import { ActionLink, PageIntro, Note } from "@/components/editorial";
import { getResearch } from "@/features/research/server";
export const metadata: Metadata = { title: "About" };
export default async function About() {
  const data = await getResearch();
  return (
    <>
      <PageIntro eyebrow="About" title="A documentary about attention.">
        <p>
          VANISHING FREQUENCIES connects wildlife stories with the evidence
          available to tell them.
        </p>
      </PageIntro>
      <section className="section">
        <h2>The Listening Margin</h2>
        <p>
          “The World Is Getting Quieter” is an editorial premise. It does not
          establish a measured global acoustic trend. Each species, population,
          and intervention has its own geography and limits.
        </p>
        <p>
          Our selected species span different habitats and forms of life. This
          selection is not a representative sample of global biodiversity.
        </p>
      </section>
      <section className="section">
        <h2>What is measured</h2>
        <dl className="facts">
          <div>
            <dt>Living Planet Index</dt>
            <dd>
              Average relative change in monitored vertebrate populations, with
              separate published report editions.
            </dd>
          </div>
          <div>
            <dt>Species estimates</dt>
            <dd>
              Dated, scoped historical estimates with verified methods. Unknown
              values stay unknown.
            </dd>
          </div>
          <div>
            <dt>Occurrences</dt>
            <dd>
              Observations indicate recorded presence. Observation counts are
              not population abundance.
            </dd>
          </div>
          <div>
            <dt>Recordings</dt>
            <dd>
              Situated recordings with provenance and explicit permission. No
              wildlife media is cleared yet.
            </dd>
          </div>
        </dl>
      </section>
      <Note title="Review and evidence limits">
        <p>
          The research bundle was verified on{" "}
          <time dateTime={data.verifiedOn}>{data.verifiedOn}</time>. This desk
          review is not independent scientific certification. Formal assessment
          dates, some original population methods, and asset permissions remain
          unresolved.
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
