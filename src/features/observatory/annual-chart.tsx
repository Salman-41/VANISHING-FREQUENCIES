"use client";
import { useId, useState, type PointerEvent } from "react";
import type { AnnualPoint, AnnualSeries } from "../../../data/schemas/observatory.schema";
import { annualGeometry, nearestPoint } from "./geometry";
import { ChartMotion } from "./motion";

const exact = (v: number | null) => v === null ? "Not reported" : String(v);
export function AnnualChart({ series }: { series: AnnualSeries }) {
  const id = useId();
  const [year, setYear] = useState(series.points.at(-1)?.year);
  const [preview, setPreview] = useState<number | null>(null);
  const [dismissed, setDismissed] = useState(false);
  // Two SSR SVG geometries selected with CSS; no data or DOM measuring loop.
  let geometry;
  try { geometry = annualGeometry(series, 660, 310); }
  catch { return <div className="observatory-empty" role="alert"><h3>Annual chart unavailable</h3><p>The plot could not be constructed safely. Read the cited values in the data table below.</p></div>; }
  const point = series.points.find(p => p.year === (preview ?? year)) ?? series.points.at(-1)!;
  const select = (p: AnnualPoint) => { setYear(p.year); setPreview(null); setDismissed(false); };
  const pointer = (event: PointerEvent<SVGSVGElement>, commit = false) => {
    if (event.pointerType !== "mouse" && !commit) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const mobile = event.currentTarget.dataset.variant === "compact";
    const plotWidth = mobile ? 248 : 660, left = mobile ? 38 : 52, total = mobile ? 304 : 742;
    const g = mobile ? annualGeometry(series, plotWidth, 188) : geometry;
    const pixel = ((event.clientX - bounds.left) / bounds.width) * total - left;
    const p = nearestPoint(series.points, g.x.invert(pixel));
    if (!p) return;
    if (commit) select(p); else { setPreview(p.year); setDismissed(false); }
  };
  const svg = (mobile: boolean) => {
    const width = mobile ? 248 : 660, height = mobile ? 188 : 310;
    const left = mobile ? 38 : 52, top = 18;
    const g = mobile ? annualGeometry(series, width, height) : geometry;
    return <svg className={mobile ? "observatory-svg-compact" : "observatory-svg-wide"} data-variant={mobile ? "compact" : "wide"}
      viewBox={`0 0 ${mobile ? 304 : 742} ${height + 64}`} role="img" aria-labelledby={`${id}-${mobile}-title ${id}-${mobile}-desc`}
      aria-describedby={preview !== null && !dismissed ? `${id}-tip` : undefined}
      onPointerMove={e => pointer(e)} onPointerDown={e => { if (e.pointerType !== "mouse") pointer(e, true); }} onClick={e => {
        const bounds = e.currentTarget.getBoundingClientRect();
        const p = nearestPoint(series.points, g.x.invert((e.clientX - bounds.left) / bounds.width * (mobile ? 304 : 742) - left));
        if (p) select(p);
      }}>
      <title id={`${id}-${mobile}-title`}>{`${series.label} Living Planet Index · ${series.edition}`}</title>
      <desc id={`${id}-${mobile}-desc`}>Published annual estimates, {series.points[0]!.year}–{series.points.at(-1)!.year}. Index baseline 1970 = 1. The vertical axis begins at zero. Source intervals and any verified levels are available in the year inspector and complete table below.</desc>
      <g transform={`translate(${left},${top})`}>
        {g.yTicks.map(t => <g key={t}><path className="observatory-grid" d={`M0 ${g.y(t)}H${width}`} /><text className="observatory-axis" x={-8} y={g.y(t) + 4} textAnchor="end">{t.toFixed(2)}</text></g>)}
        <path className="observatory-baseline" d={`M0 ${g.y(1)}H${width}`} />
        {g.bounds.map((points, i) => <polygon key={i} className="observatory-bound-fill" points={points} />)}
        {g.boundLines.map((d, i) => <path key={i} className="observatory-bound-line" d={d} />)}
        {g.paths.map((d, i) => <path key={i} className="observatory-estimate" d={d} />)}
        {series.points.filter(p => p.value !== null).map(p => <circle key={p.id} data-record-id={p.id} data-value={p.value} className="observatory-point" cx={g.x(p.year)} cy={g.y(p.value!)} r={mobile ? 1.8 : 2.3} />)}
        <path className="observatory-crosshair" d={`M${g.x(point.year)} 0V${height}`} />
        {point.value !== null && <circle className="observatory-selected-point" cx={g.x(point.year)} cy={g.y(point.value)} r={mobile ? 4 : 5} />}
        {g.yearTicks.map(t => <text key={t} className="observatory-axis" x={g.x(t)} y={height + 25} textAnchor={t === series.points[0]!.year ? "start" : t === series.points.at(-1)!.year ? "end" : "middle"}>{t}</text>)}
      </g>
      <text className="observatory-axis-title" x={left + width / 2} y={height + 59} textAnchor="middle">Published year</text>
    </svg>;
  };
  const activeIndex = series.points.findIndex(p => p.year === year);
  return <div className="observatory-annual" onPointerLeave={e => { if (e.pointerType === "mouse") setPreview(null); }} onKeyDown={e => { if (e.key === "Escape") { setPreview(null); setDismissed(true); } }}>
    <div className="observatory-plot-header"><p>Relative index <span>1970 = 1</span></p><p>Vertical axis starts at 0</p></div>
    <ChartMotion revision={`${series.id}-${series.points[0]!.year}-${series.points.at(-1)!.year}`}>{svg(false)}{svg(true)}</ChartMotion>
    <div className="observatory-legend"><span><i className="observatory-key-estimate" />Published annual estimate</span><span><i className="observatory-key-bounds" />Source lower / upper bounds</span><span><i className="observatory-key-baseline" />1970 baseline = 1</span></div>
    <div className="observatory-inspect"><label htmlFor={`${id}-year`}>Inspect a published year<select id={`${id}-year`} aria-describedby={`${id}-readout`} value={year} onChange={e => select(series.points.find(p => p.year === Number(e.target.value))!)}>
      {series.points.map(p => <option key={p.id} value={p.year}>{p.year}</option>)}
    </select></label><div className="observatory-step"><button type="button" className="control" disabled={activeIndex <= 0} onClick={() => select(series.points[activeIndex - 1]!)}>Previous year</button><button type="button" className="control" disabled={activeIndex >= series.points.length - 1} onClick={() => select(series.points[activeIndex + 1]!)}>Next year</button></div></div>
    <div className="observatory-readout" id={`${id}-readout`} data-selected-year={point.year}>
      <p className="eyebrow">{preview !== null && !dismissed ? "Pointer preview" : "Selected published year"} / {point.year}</p>
      <p className="observatory-number">{exact(point.value)}<span>index · 1970 = 1</span></p>
      <p>Source bounds: <strong>{exact(point.lower)}–{exact(point.upper)}</strong>.</p>
      <p className="meta">{point.missingReason} {point.uncertaintyKind ? `${point.uncertaintyKind.replaceAll("-", " ")}. ` : ""}{point.uncertaintyLevel !== null ? `Source interval level: ${point.uncertaintyLevel * 100}%. ` : ""}{point.uncertaintyGap} No fractional-year estimate is calculated.</p>
      {preview !== null && !dismissed && <div className="observatory-tooltip" id={`${id}-tip`} role="tooltip">{point.year} · index {exact(point.value)} · bounds {exact(point.lower)}–{exact(point.upper)}. Click to retain this published year. Escape dismisses preview.</div>}
      <p className="observatory-sr" role="status" aria-live="polite">Selected {year}: index {exact(series.points.find(p => p.year === year)?.value ?? null)}.</p>
    </div>
    <p className="meta">Hover or tap the plot, or use the year control. Straight segments connect adjacent published years; missing values and unreported years break the line. Connectors do not create observations.</p>
  </div>;
}
