import type { Metadata } from "next";
import { PageIntro, Note } from "@/components/editorial";
import { SourceReferences } from "@/features/research/evidence";
import { getResearch } from "@/features/research/server";
import { indexSeries } from "@/features/research/selectors";
export const metadata: Metadata = { title: "Data Observatory" };
export default async function DataObservatory() {
  const data = await getResearch();
  const annual = indexSeries(data, "lpi-2024-owid", "lpi-2024-owid-world");
  const endpoints = data.indexObservations.filter(
    (r) => r.datasetId === "lpi-2026-endpoints",
  );
  const formatIndex = (value: number | null | undefined) =>
    value == null
      ? "Not reported"
      : new Intl.NumberFormat("en-US", { maximumFractionDigits: 8 }).format(
          value,
        );
  return (
    <>
      <PageIntro
        eyebrow="Data Observatory"
        title="Read the change. Keep the context."
      >
        <p>
          Published Living Planet Index results, with report editions kept
          separate.
        </p>
      </PageIntro>
      <Note title="What the index means">
        <p>
          The LPI measures average relative change in monitored vertebrate
          populations. It does not measure the percentage of individual animals
          that disappeared. Regional and ecosystem index values are not rankings
          of absolute abundance.
        </p>
      </Note>
      <section className="section">
        <h2>LPR 2024 · Global annual index</h2>
        <p>
          Published annual results, 1970–2020. Baseline: 1970 = 1. Scope:
          monitored vertebrate populations, global, all ecosystems represented
          in this series.
        </p>
        <p className="meta">
          Source upper and lower bounds are preserved; the interval confidence
          level is not verified. These values are not a species population
          series.
        </p>
        <p className="meta">
          Table display uses up to eight decimal places. The original values and
          units remain in the versioned research artifact.
        </p>
        <div
          className="table-scroll"
          role="region"
          aria-label="Global annual index table"
          tabIndex={0}
        >
          <table>
            <caption>
              Global Living Planet Index · LPR 2024 · unit: index (1970 = 1)
            </caption>
            <thead>
              <tr>
                <th scope="col">Published year</th>
                <th scope="col">Index</th>
                <th scope="col">Lower source bound</th>
                <th scope="col">Upper source bound</th>
              </tr>
            </thead>
            <tbody>
              {annual.map((r) => (
                <tr key={r.id}>
                  <th scope="row">{r.period.endYear}</th>
                  <td>{formatIndex(r.value)}</td>
                  <td>{formatIndex(r.uncertainty?.lower)}</td>
                  <td>{formatIndex(r.uncertainty?.upper)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SourceReferences
          data={data}
          references={annual[0]!.provenance.map((p) => ({
            sourceId: p.sourceId,
            locator: p.locator,
          }))}
          verifiedOn={data.verifiedOn}
        />
      </section>
      <section className="section">
        <h2>LPR 2026 · Published endpoint summaries</h2>
        <p>
          Rounded index changes over 1970–2022, as announced by WWF-UK. Annual
          observations and uncertainty intervals were not supplied by this
          acquired source. No intermediate years are reconstructed.
        </p>
        <div
          className="table-scroll"
          role="region"
          aria-label="2026 endpoint summary table"
          tabIndex={0}
        >
          <table>
            <caption>
              Published endpoint change · LPR 2026 · monitored vertebrate
              populations · 1970–2022
            </caption>
            <thead>
              <tr>
                <th scope="col">Geography / ecosystem</th>
                <th scope="col">Scope</th>
                <th scope="col">Index change (%)</th>
                <th scope="col">Uncertainty</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((r) => (
                <tr key={r.id}>
                  <th scope="row">
                    {r.geography} / {r.ecosystem}
                  </th>
                  <td>{r.scope}</td>
                  <td>
                    {r.value === null
                      ? "Not reported"
                      : `${r.value > 0 ? "+" : ""}${r.value}%`}
                  </td>
                  <td>{r.uncertaintyGap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <SourceReferences
          data={data}
          references={endpoints[0]!.provenance.map((p) => ({
            sourceId: p.sourceId,
            locator: p.locator,
          }))}
          verifiedOn={data.verifiedOn}
        />
      </section>
      <section className="section">
        <h2>Dataset versions, attribution, and access</h2>
        {data.datasets
          .filter((d) => d.id.startsWith("lpi-"))
          .map((d) => (
            <article className="note" key={d.id}>
              <h3>{d.edition}</h3>
              <dl className="facts">
                <div>
                  <dt>Dataset version</dt>
                  <dd>{d.version}</dd>
                </div>
                <div>
                  <dt>Source date</dt>
                  <dd>{d.sourceDate ?? "Unknown"}</dd>
                </div>
                <div>
                  <dt>Accessed</dt>
                  <dd>{d.accessedDate}</dd>
                </div>
                <div>
                  <dt>License</dt>
                  <dd>
                    <a href={d.rights.licenseUrl}>{d.rights.licenseId}</a>
                  </dd>
                </div>
              </dl>
              <p>{d.rights.attribution}</p>
              <p className="meta">{d.rights.notes}</p>
            </article>
          ))}
        <p>
          Only licensed published trends are included. Underlying LPD,
          restricted IUCN assessments, and BirdLife bulk products have not been
          imported.
        </p>
      </section>
    </>
  );
}
