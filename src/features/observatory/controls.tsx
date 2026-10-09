"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition, type FormEvent, type ReactNode } from "react";
import type { Selection, SeriesOption, Scope } from "./model";

export function ObservatoryControls({ selection, options, warnings, children }: {
  selection: Selection; options: SeriesOption[]; warnings: string[]; children: ReactNode;
}) {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [draft, setDraft] = useState(selection);
  const [pending, startTransition] = useTransition();
  useEffect(() => { setDraft(selection); }, [selection]);
  const available = options.filter(o => o.scope === draft.scope);
  const years = options.find(o => o.id === draft.series)?.years ?? [];
  const changeScope = (scope: Scope) => {
    const option = options.find(o => o.scope === scope);
    setDraft(d => ({ ...d, scope, series: option?.id ?? "", start: option?.years[0] ?? null, end: option?.years.at(-1) ?? null }));
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (pending) return;
    const fields = new FormData(event.currentTarget);
    const query = new URLSearchParams();
    for (const [key, value] of fields) if (typeof value === "string" && value) query.set(key, value);
    startTransition(() => router.push(`/data?${query}`, { scroll: false }));
  };
  return <>
    <form className="observatory-controls" ref={form} action="/data" method="get" onSubmit={submit} aria-label="Choose biodiversity evidence">
      <fieldset className="observatory-editions"><legend>Report edition / available product</legend>
        {(["2024", "2026"] as const).map(edition => <label key={edition}>
          <input type="radio" name="edition" value={edition} checked={draft.edition === edition} onChange={() => setDraft(d => ({ ...d, edition }))} />
          <span>{edition}<small>{edition === "2024" ? "Annual estimates · 1970–2020" : "Endpoint summaries · 1970–2022"}</small></span>
        </label>)}
      </fieldset>
      <div className="observatory-fields">
        <label>Evidence scope<select name="scope" value={draft.scope} onChange={e => changeScope(e.target.value as Scope)}>
          <option value="global">Global</option><option value="region">Regions</option><option value="ecosystem">Ecosystems</option>
        </select></label>
        {draft.edition === "2024" && <>
          <label>Annual series<select name="series" value={draft.series} onChange={e => {
            const option = options.find(o => o.id === e.target.value);
            setDraft(d => ({ ...d, series: e.target.value, start: option?.years[0] ?? null, end: option?.years.at(-1) ?? null }));
          }}>{available.map(o => <option key={o.id} value={o.id}>{o.label}</option>)}</select></label>
          <label>From published year<select name="start" value={draft.start ?? ""} onChange={e => setDraft(d => ({ ...d, start: Number(e.target.value) }))}>
            {years.map(year => <option key={year} value={year}>{year}</option>)}
          </select></label>
          <label>To published year<select name="end" value={draft.end ?? ""} onChange={e => setDraft(d => ({ ...d, end: Number(e.target.value) }))}>
            {years.map(year => <option key={year} value={year}>{year}</option>)}
          </select></label>
        </>}
      </div>
      <div className="observatory-apply"><button className="action action-primary" type="submit" aria-disabled={pending}>{pending ? "Loading selection…" : "Apply selection"}</button>
        <Link className="action" href="/data" scroll={false}>Reset view</Link>
        <p className="meta">{draft.edition === "2026" ? "Fixed 1970–2022 period. Annual 2026 values are unavailable; there is no date-range control for endpoints." : "Choose only published years. Cropping the display keeps the original 1970 baseline."}</p>
      </div>
    </form>
    {warnings.length > 0 && <aside className="observatory-warning" aria-label="Selection corrections"><h2>Selection adjusted</h2><ul>{warnings.map(w => <li key={w}>{w}</li>)}</ul><p>The chart below identifies the evidence actually displayed.</p></aside>}
    <p role="status" className="meta observatory-selection" aria-live="polite" aria-atomic="true">{pending ? "Loading selection. Previous evidence remains available." : `Showing ${selection.edition} ${selection.edition === "2024" ? "annual estimates" : "endpoint summaries"} · ${selection.scope === "region" ? "Regions" : selection.scope === "ecosystem" ? "Ecosystems" : "Global"}${selection.start !== null ? ` · ${selection.start}–${selection.end}` : " · 1970–2022"}.`}</p>
    <div id="observatory-evidence" aria-busy={pending}>{children}</div>
  </>;
}
