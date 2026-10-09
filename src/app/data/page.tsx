import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/editorial";
import { getResearch } from "@/features/research/server";
import { AnnualChart } from "@/features/observatory/annual-chart";
import { EndpointChart } from "@/features/observatory/endpoint-chart";
import { ObservatoryControls } from "@/features/observatory/controls";
import { annualOptions, comparisonSeries, editions, labelFor, parseSelection, selectRecords, toAnnualSeries, type Query } from "@/features/observatory/model";
import { ChartProvenance, DownloadRegister, ObservationTable, RegionalComparison } from "@/features/observatory/presentation";
import "@/styles/observatory.css";

export const metadata: Metadata = {
  title: "Data Observatory",
  description: "Explore published Living Planet Index estimates with their dates, uncertainty, report editions and scientific limits. Read accessible tables and download permitted aggregate data.",
  alternates: { canonical: "/data" },
};

export default async function DataObservatory({ searchParams }: { searchParams: Promise<Query> }) {
  const [data, query] = await Promise.all([getResearch(), searchParams]);
  const options = annualOptions(data.indexObservations);
  const { selection, warnings } = parseSelection(query, options);
  const records = selectRecords(data.indexObservations, selection);
  const annual = selection.edition === "2024";
  const allEndpoints = data.indexObservations.filter(r => r.datasetId === editions["2026"]);
  const comparison = comparisonSeries(data, selection);
  const first = records[0];
  const title = annual ? `${first ? labelFor(first) : "Unavailable"} annual index` : `${selection.scope === "region" ? "Regional" : selection.scope === "ecosystem" ? "Ecosystem" : "Global"} endpoint ${records.length === 1 ? "summary" : "comparisons"}`;
  return <div className="observatory">
    <PageIntro eyebrow="Biodiversity Observatory / Published evidence" title="Read the change. Keep the context.">
      <p>A line is a summary. Every point has a place, a period, and a limit.</p>
    </PageIntro>
    <section className="observatory-premise" aria-labelledby="index-meaning">
      <p className="eyebrow">Before the curve / what is being measured</p>
      <div><h2 id="index-meaning">Relative change.<br />Monitored populations.</h2>
        <p>The Living Planet Index measures average relative change in monitored vertebrate populations. It <strong>does not measure the percentage of individual animals</strong> that disappeared. It is neither an animal headcount nor a measure of all life on Earth.</p></div>
      <p className="meta">An index value, a regional comparison, and an ecosystem result each describe their own monitored coverage. No number here measures how much quieter the world has become.</p>
    </section>
    <ObservatoryControls selection={selection} options={options} warnings={warnings}>
      <section className="observatory-study" aria-labelledby="observatory-study-title" data-edition={selection.edition} data-scope={selection.scope}>
        <header className="observatory-study-header"><p className="eyebrow">{annual ? "01 / Annual evidence" : "02 / Published endpoints"} · LPR {selection.edition}</p>
          <h2 id="observatory-study-title">{title}</h2><p>{annual ? `Published annual estimates · ${selection.start ?? "unavailable"}–${selection.end ?? "unavailable"}. Baseline remains 1970 = 1.` : "Published rounded index changes · fixed period 1970–2022. No annual observations or bounds were supplied by this release."}</p></header>
        {!first ? <div className="observatory-empty"><h3>No published observations for this view</h3><p>This documentary has no licensed observations for the selected product. Missing evidence is not a flat trend or a zero.</p><Link className="action" href="/data">Read the available global series</Link></div> : <>
          <div className="observatory-evidence-grid"><div className="observatory-figure"><figure>
            <figcaption className="observatory-figure-caption">{title} / LPR {selection.edition}</figcaption>
            {annual ? <AnnualChart key={`${selection.series}-${selection.start}-${selection.end}`} series={toAnnualSeries(records)} /> : <EndpointChart key={`${selection.edition}-${selection.scope}`} records={records.map(r => ({ id: r.id, datasetId: r.datasetId, edition: r.edition, period: r.period, metric: r.metric, unit: r.unit, value: r.value, scope: r.scope, geography: r.geography, ecosystem: r.ecosystem, uncertaintyGap: r.uncertaintyGap, missingReason: r.missingReason }))} />}
          </figure></div><ChartProvenance data={data} records={records} /></div>
          {selection.scope === "ecosystem" && annual && <aside className="observatory-gap" aria-label="Ecosystem coverage gap"><h3>One annual system, not three.</h3><p>Only freshwater is present in the acquired 2024 annual product. Terrestrial and marine annual observations are unavailable in this snapshot. The separate 2026 endpoint product has three system summaries; it does not extend this curve.</p><Link href="/data?edition=2026&scope=ecosystem" scroll={false}>Read the 2026 ecosystem endpoints</Link></aside>}
          {selection.scope !== "global" && <p className="observatory-comparison-limit">Within-edition comparisons describe proportional change against each series’ 1970 baseline. Monitoring coverage and the state of nature before 1970 differ. These are not rankings of absolute abundance, intactness, or conservation effectiveness.</p>}
          <h3 className="observatory-table-title">Read the source values</h3>
          <noscript><p className="meta">Chart inspection requires JavaScript. Every published value and bound is available in this table; the evidence selection form works with ordinary page navigation.</p></noscript>
          <details className="observatory-values"><summary>Read {records.length} published {annual ? "annual values and bounds" : "endpoint values"}</summary><ObservationTable records={records} title={title} id="selected-observations" /></details>
          <RegionalComparison data={data} series={comparison} />
        </>}
      </section>
    </ObservatoryControls>
    <section className="observatory-methods" aria-labelledby="observatory-methodology"><p className="eyebrow">03 / Read the method</p><h2 id="observatory-methodology">The baseline is part of the story.</h2>
      <div className="observatory-method-grid"><article><h3>One edition at a time</h3><p>The 2024 annual product covers 1970–2020. The 2026 announcement covers 1970–2022. Different editions contain different monitored coverage and time windows. This page never joins their observations, computes a between-edition difference, or appends a 2026 endpoint to a 2024 line.</p></article>
        <article><h3>Bounds, without invented certainty</h3><p>Annual central values and source bounds are divided by 100 together to standardize the acquired 1970 = 100 CSV to an index with 1970 = 1. The acquired metadata does not verify the bounds’ confidence level. Endpoint uncertainty is absent and is never reconstructed.</p></article>
        <article><h3>Published estimates, not detections</h3><p>The annual values are already modeled, aggregated publisher results. Straight plot segments help read adjacent published years; no smoothing, fractional-year estimates, extrapolation, or population histories are generated. Range controls crop the view without rebasing the index.</p></article>
        <article><h3>What this evidence cannot establish</h3><p>Taxonomic and geographical monitoring biases remain. The LPI does not count extinctions or show the share of species that declined. GBIF occurrences are observations of presence; they are not interpreted as measured population sizes. Acoustic recordings and sound levels are not converted into biodiversity estimates.</p></article>
      </div><div className="observatory-method-links"><Link href="/sources#owid-lpi-2024">Annual source and interpretation</Link><Link href="/sources#wwf-lpr-2026">Endpoint source and coverage</Link><a href="https://ourworldindata.org/living-planet-index-decline">OWID: interpreting the Living Planet Index</a><a href="https://www.livingplanetindex.org/documents/LPI_Data_Use_Policy_2026.pdf">ZSL published-trend reuse policy</a></div>
      <aside className="observatory-gap"><h3>Evidence still unavailable</h3><p>Official 2026 annual results and bounds are not acquired. Underlying population records, restricted assessments, and unlicensed bulk products remain outside this Observatory. The selected species have isolated historical estimates, not verified annual histories.</p><Link href="/species">Explore the scoped species evidence</Link></aside>
    </section>
    <DownloadRegister data={data} />
    <section className="observatory-register" aria-labelledby="endpoint-register"><p className="eyebrow">04 / Edition register</p><h2 id="endpoint-register">Keep the endpoints separate.</h2>
      <p>The complete 2026 summary register remains available here as its own product. It is not a continuation of any annual curve.</p>
      <details><summary>Read all nine 2026 endpoint summaries</summary><ObservationTable records={allEndpoints} title="All 2026 published endpoint summaries" id="endpoint-observations" /><ChartProvenance data={data} records={allEndpoints} /></details>
    </section>
  </div>;
}
