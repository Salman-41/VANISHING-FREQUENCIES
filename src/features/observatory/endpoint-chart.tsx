"use client";
import { useId, useState } from "react";
import type { IndexObservation } from "../../../data/schemas/biodiversity.schema";
import { endpointScale } from "./geometry";
import { ChartMotion } from "./motion";

// Only fields used for geometry/context cross the interaction boundary.
export type EndpointRecord = Pick<IndexObservation, "id" | "datasetId" | "edition" | "period" | "metric" | "unit" | "value" | "scope" | "geography" | "ecosystem" | "uncertaintyGap" | "missingReason">;
const label = (r: EndpointRecord) => r.scope === "ecosystem" ? r.ecosystem : r.geography;
export function EndpointChart({ records }: { records: EndpointRecord[] }) {
  const id = useId();
  const [active, setActive] = useState<string | null>(null);
  let x;
  try { x = endpointScale(records, 100); }
  catch { return <div className="observatory-empty" role="alert"><h3>Endpoint comparison unavailable</h3><p>The comparison cannot be plotted safely. The source records remain in the table below.</p></div>; }
  const point = records.find(r => r.id === active);
  return <div className="observatory-endpoints" onPointerLeave={e => { if (e.pointerType === "mouse") setActive(null); }}>
    <p className="observatory-plot-header">Index change (%) · {records[0]!.period.startYear}–{records[0]!.period.endYear}<span>0 = no index change</span></p>
    <div className="observatory-endpoint-axis" aria-hidden="true">{[-100, -50, 0, ...(x.domain()[1]! > 0 ? [x.domain()[1]!] : [])].map(t => <span key={t} data-axis-tick={t} style={{ left: `${x(t)}%` }}>{t}%</span>)}</div>
    <ChartMotion revision={records.map(r => r.id).join("-")}>
      <ul className="observatory-endpoint-rows">{records.map(r => <li key={r.id} data-record-id={r.id} data-value={r.value}>
        <div className="observatory-endpoint-label"><h3>{label(r)}</h3><p>{r.value === null ? "Not reported" : `${r.value > 0 ? "+" : ""}${r.value}%`}</p></div>
        <button className="observatory-endpoint-track" type="button" aria-label={`Inspect ${label(r)}: ${r.value === null ? "not reported" : `${r.value}% index change`}, ${r.period.startYear}–${r.period.endYear}`}
          aria-describedby={active === r.id ? `${id}-tip` : undefined}
          onMouseEnter={() => setActive(r.id)} onFocus={() => setActive(r.id)} onBlur={() => setActive(null)}
          onClick={() => setActive(r.id)} onKeyDown={e => { if (e.key === "Escape") setActive(null); }}>
          <svg viewBox="0 0 100 8" preserveAspectRatio="none" aria-hidden="true">
            {[0, 50, 100].map(t => <path key={t} className="observatory-grid" d={`M${t} 0V8`} />)}
            <path className="observatory-zero" d={`M${x(0)} 0V8`} />
            {r.value !== null && <><path className="observatory-endpoint-bar" d={`M${x(r.value)} 4H${x(0)}`} /><circle className="observatory-endpoint-dot" cx={x(r.value)} cy={4} r={0.8} /></>}
          </svg>
        </button>
        <p className="meta">{r.missingReason ?? r.uncertaintyGap}</p>
      </li>)}</ul>
    </ChartMotion>
    {point && <div className="observatory-tooltip" id={`${id}-tip`} role="tooltip">{label(point)} · {point.edition} · {point.period.startYear}–{point.period.endYear}. {point.value === null ? "Estimate not reported." : `${point.value}% published index change.`} {point.uncertaintyGap} This is not a percentage of individual animals lost.</div>}
    <p className="meta">Direct labels and a common signed scale preserve magnitude. These rounded endpoint results do not supply annual values or uncertainty intervals.</p>
  </div>;
}
