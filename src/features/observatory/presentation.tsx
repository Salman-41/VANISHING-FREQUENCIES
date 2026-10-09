import Link from "next/link";
import type { BiodiversityDataset, IndexObservation } from "../../../data/schemas/biodiversity.schema";
import type { AnnualSeries } from "../../../data/schemas/observatory.schema";
import { SourceReferences } from "@/features/research/evidence";
import { annualGeometry, sharedMaximum } from "./geometry";
import { formatChange, formatValue, labelFor } from "./model";

export function ChartProvenance({ data, records }: { data: BiodiversityDataset; records: IndexObservation[] }) {
  const first = records[0];
  if (!first) return null;
  const dataset = data.datasets.find(d => d.id === first.datasetId)!;
  const coverage = [...new Set(records.map(r => r.scope === "ecosystem" ? `${r.ecosystem} system` : r.geography))].join("; ");
  const refs = [...new Map(records.flatMap(r => r.provenance.map(p => ({ sourceId: p.sourceId, locator: p.locator }))).map(p => [`${p.sourceId}-${p.locator}`, p])).values()];
  return <aside className="observatory-provenance" aria-label="Chart source and provenance">
    <p className="eyebrow">Evidence margin</p><h3>{first.edition}</h3>
    <dl><div><dt>Population coverage</dt><dd>{first.taxon}; displayed coverage: {coverage}.</dd></div>
      <div><dt>Dataset version</dt><dd>{dataset.version}</dd></div>
      <div><dt>Source date</dt><dd><time dateTime={dataset.sourceDate ?? undefined}>{dataset.sourceDate ?? "Not reported"}</time></dd></div>
      <div><dt>Acquired</dt><dd><time dateTime={dataset.accessedDate}>{dataset.accessedDate}</time></dd></div>
      <div><dt>Unit</dt><dd>{first.unit === "percent" ? "Index change (%) over 1970–2022" : "Relative index · 1970 = 1"}</dd></div>
      <div><dt>Uncertainty</dt><dd>{first.uncertainty ? `Source bounds retained. ${first.uncertainty.level === null ? "Confidence level unverified in acquired metadata." : `Source interval level: ${first.uncertainty.level * 100}%.`}` : first.uncertaintyGap}</dd></div>
    </dl>
    <SourceReferences data={data} references={refs} verifiedOn={data.verifiedOn} />
    <p className="meta">ZSL / WWF{first.datasetId === "lpi-2024-owid" ? "; Our World in Data processing" : "; WWF-UK release"}. Chart/data adaptation: <a href={dataset.rights.licenseUrl}>CC BY-SA 4.0</a>. No institutional endorsement.</p>
    <details><summary>Original units and record locations</summary><p className="meta">{first.provenance[0]!.transformations.join(". ")}. Original unit: {first.provenance[0]!.originalUnit}. Each table row identifies the source record; downloads retain raw row values, hashes and transformations.</p></details>
  </aside>;
}

export function ObservationTable({ records, title, id }: { records: IndexObservation[]; title: string; id: string }) {
  if (!records.length) return <p className="observatory-empty">No published records are available for this selection. Missing evidence is not a zero value.</p>;
  const annual = records[0]!.metric === "relative-index";
  return <div className="observatory-table"><div className="table-scroll" tabIndex={0} role="region" aria-label={`${title}, horizontally scrollable`}>
    <table id={id}><caption>{title} · {records[0]!.edition} · {annual ? "index (1970 = 1)" : "index change (%) · 1970–2022"}. Values preserve exported numerical precision.</caption>
      <thead><tr><th scope="col">{annual ? "Published year" : "Geography / ecosystem"}</th><th scope="col">{annual ? "Index" : "Index change (%)"}</th>
        {annual ? <><th scope="col">Lower source bound</th><th scope="col">Upper source bound</th></> : <th scope="col">Scope</th>}
        <th scope="col">Evidence / uncertainty</th></tr></thead>
      <tbody>{records.map(r => <tr key={r.id} data-record-id={r.id}><th scope="row">{annual ? r.period.endYear : labelFor(r)}</th><td data-field="value">{annual ? formatValue(r.value) : formatChange(r.value)}</td>
        {annual ? <><td data-field="lower">{formatValue(r.uncertainty?.lower ?? null)}</td><td data-field="upper">{formatValue(r.uncertainty?.upper ?? null)}</td></> : <td>{r.scope}</td>}
        <td className="observatory-table-source"><a href={`/sources#${r.provenance[0]!.sourceId}`}>Source record {r.provenance.map(p => p.rowNumber).join(", ")}</a><span>{r.missingReason ?? r.uncertaintyGap ?? "Source interval retained"}{r.uncertainty?.level != null ? ` · ${r.uncertainty.kind.replaceAll("-", " ")}, level ${r.uncertainty.level * 100}%` : ""}</span></td></tr>)}</tbody>
    </table></div></div>;
}

export function RegionalComparison({ data, series }: { data: BiodiversityDataset; series: AnnualSeries[] }) {
  if (!series.length) return null;
  const maximum = sharedMaximum(series);
  const period = `${series[0]!.points[0]!.year}–${series[0]!.points.at(-1)!.year}`;
  const dataset = data.datasets.find(d => d.id === series[0]!.datasetId)!;
  const levelsUnverified = series.every(s => s.points.every(p => p.uncertaintyLevel === null));
  return <section className="observatory-comparison" aria-labelledby="regional-comparison-title"><p className="eyebrow">Within the 2024 edition</p>
    <h3 id="regional-comparison-title">Five baselines. A shared scale.</h3>
    <p>These published regional indices share a 1970 = 1 baseline and the displayed {period} window. They summarize different monitored populations; a higher index does not mean more animals or more intact biodiversity.</p>
    <p className="meta">All panels: vertical scale 0–{maximum}; horizontal scale {period}. {levelsUnverified ? "Source bounds have an unverified confidence level." : "Interval definitions and verified levels remain in each series’ year inspector and table."} Values below are the last published year in this window.</p>
    <p className="meta">ZSL / WWF; <Link href={`/sources#${dataset.sourceId}`}>Our World in Data processing</Link>. Source date {dataset.sourceDate}; acquired {dataset.accessedDate}; {dataset.edition}. Chart/data adaptation: <a href={dataset.rights.licenseUrl}>{dataset.rights.licenseId}</a>.</p>
    <ul>{series.map(s => {
      const g = annualGeometry(s, 256, 92, maximum), last = s.points.at(-1)!;
      return <li key={s.id} data-comparison-series={s.id}>
        <h4>{s.label}</h4>
        <svg viewBox="0 0 280 128" role="img" aria-label={`${s.label}, ${period}, final index ${formatValue(last.value)}; same zero-based vertical scale as other panels.`}>
          <g transform="translate(12,10)"><path className="observatory-baseline" d={`M0 ${g.y(1)}H256`} />
            {g.bounds.map((points, i) => <polygon key={i} className="observatory-bound-fill" points={points} />)}
            {g.boundLines.map((d, i) => <path key={i} className="observatory-bound-line" d={d} />)}
            {g.paths.map((d, i) => <path key={i} className="observatory-estimate" d={d} />)}
            {last.value !== null && <circle className="observatory-selected-point" cx={g.x(last.year)} cy={g.y(last.value)} r={3} />}
            <text className="observatory-axis" x={0} y={116}>{s.points[0]!.year}</text><text className="observatory-axis" x={256} y={116} textAnchor="end">{last.year}</text>
          </g></svg>
        <p>{last.year} / <strong>{formatValue(last.value)}</strong></p><p className="meta">Bounds {formatValue(last.lower)}–{formatValue(last.upper)}</p>
        <Link href={`/data?edition=2024&scope=region&series=${s.id}&start=${s.points[0]!.year}&end=${last.year}`} scroll={false}>Inspect {s.label}</Link>
      </li>;
    })}</ul>
  </section>;
}

export function DownloadRegister({ data }: { data: BiodiversityDataset }) {
  return <section className="observatory-downloads" aria-labelledby="data-downloads"><p className="eyebrow">Take the evidence with you</p><h2 id="data-downloads">Published trends. Portable context.</h2>
    <p>These complete edition-specific exports contain the permitted aggregate observations behind this page. They include original units and values, source dates, row provenance, checksums, transformations and attribution. Display filters do not alter the downloads.</p>
    {data.datasets.filter(d => d.id.startsWith("lpi-")).map(d => <article key={d.id}><h3>{d.edition}</h3><p className="meta">{d.version}. Acquired {d.accessedDate}. <a href={d.rights.licenseUrl}>{d.rights.licenseId}</a>.</p>
      <div className="actions"><a className="action" href={`/data-downloads/${d.id}.csv`} download>Download {d.edition} CSV</a><a className="action" href={`/data-downloads/${d.id}.json`} download>Download {d.edition} JSON</a></div>
      <p className="meta">{d.id === "lpi-2024-owid" ? "ZSL / WWF; Our World in Data processing. 357 annual estimates; seven series." : "ZSL / WWF; WWF-UK release. Nine rounded summaries for 1970–2022; no annual curve."} Adapted aggregate data: CC BY-SA 4.0. Retain attribution and share-alike terms.</p>
    </article>)}
    <a href="/data-downloads/README.txt" download>Download the citation and reuse notes</a><p className="meta">No underlying Living Planet Database, restricted IUCN or BirdLife records, media, or species research bundle is redistributed here.</p>
  </section>;
}
