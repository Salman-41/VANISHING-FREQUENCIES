import type { Metadata } from "next";
import { PageIntro } from "@/components/editorial";
import { getResearch } from "@/features/research/server";
export const metadata: Metadata = {
  title: "Sources",
  description:
    "Source citations, verification dates, reuse terms, and limits for the evidence used in VANISHING FREQUENCIES.",
  alternates: { canonical: "/sources" },
};
export default async function Sources() {
  const data = await getResearch();
  return (
    <>
      <PageIntro eyebrow="Sources" title="Follow the evidence.">
        <p>
          Trace claims and published values to their references, publishers,
          publication dates, review locations, and verification dates. A
          source-page review is not a reuse license or a guarantee of scientific
          certainty. Each claim also links to the reference used for it.
        </p>
      </PageIntro>
      <section className="section" aria-labelledby="reading-sources">
        <h2 id="reading-sources">Reading this register</h2>
        <p>
          Publication date and our access date are shown separately. “Page
          read” means the cited public page or document was reviewed; it does
          not mean that restricted underlying records were downloaded. Reuse
          terms are source-specific. The Living Planet Index measures average
          relative change in monitored populations, not the percentage of
          animals lost. GBIF occurrence counts are not population estimates.
        </p>
      </section>
      <ul className="citation-list">
        {data.citations.map((c) => (
          <li key={c.id} id={c.id}>
            <p className="eyebrow">
              {c.id} · {c.type.replaceAll("-", " ")}
            </p>
            <h2>
              <a href={c.url} rel="noreferrer">
                {c.title}
              </a>
            </h2>
            <p>
              {c.publisher}
              {c.authors.length ? ` · ${c.authors.join(", ")}` : ""}
            </p>
            <dl className="facts">
              <div>
                <dt>Published</dt>
                <dd>
                  {c.publicationDate ??
                    c.publicationYear ??
                    "Date not reported"}
                </dd>
              </div>
              <div>
                <dt>Accessed / verification</dt>
                <dd>
                  {c.accessedDate} · {c.verification}
                </dd>
              </div>
              <div>
                <dt>Reuse</dt>
                <dd>{c.reuse}</dd>
              </div>
              <div>
                <dt>Limitations</dt>
                <dd>{c.limitations}</dd>
              </div>
            </dl>
            <details>
              <summary>Locations reviewed in this source</summary>
              <ul>
                {c.locators.map((l) => (
                  <li key={l}>{l}</li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ul>
      <section className="section">
        <h2>Outstanding data access</h2>
        {data.availability.blockedSources.map((b) => (
          <article key={b.id} className="note">
            <h3>{b.id.replaceAll("-", " ")}</h3>
            <p>{b.reason}</p>
            <ul>
              {b.requirements.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
            <a href={b.sourceUrl}>
              Visit the {b.id.replaceAll("-", " ")} source
            </a>
          </article>
        ))}
      </section>
      <section className="section">
        <h2>Methods and data notes</h2>
        <p>
          The Observatory preserves source editions, units, boundaries, gaps,
          and provenance. Review the <a href="/data">Biodiversity Observatory</a>
          and its methodology alongside the original records. Current source
          restrictions and unresolved access needs are listed above rather than
          treated as available evidence.
        </p>
        <div className="actions">
          <a className="action" href="/about">About the documentary</a>
          <a className="action" href="/credits">Media and data credits</a>
        </div>
      </section>
    </>
  );
}
