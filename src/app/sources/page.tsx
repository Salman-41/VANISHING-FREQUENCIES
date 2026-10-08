import type { Metadata } from "next";
import { PageIntro } from "@/components/editorial";
import { getResearch } from "@/features/research/server";
export const metadata: Metadata = { title: "Sources" };
export default async function Sources() {
  const data = await getResearch();
  return (
    <>
      <PageIntro eyebrow="Sources" title="Follow the evidence.">
        <p>
          The source register for the validated documentary bundle. A page-read
          verification is not a reuse license or a guarantee of scientific
          certainty.
        </p>
      </PageIntro>
      <ul className="citation-list">
        {data.citations.map((c) => (
          <li key={c.id} id={c.id}>
            <p className="eyebrow">
              {c.id} · {c.type.replaceAll("-", " ")}
            </p>
            <h2>
              <a href={c.url}>{c.title}</a>
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
    </>
  );
}
