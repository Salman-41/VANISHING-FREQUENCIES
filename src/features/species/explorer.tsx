"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useTransition, type FormEvent, type ReactNode } from "react";
import { facetKeys, filtersToQuery, filterSummary, parseFilters, sorts, type FacetKey, type FacetOptions, type Filters, type SearchQuery } from "./model";

const labels: Record<FacetKey, string> = { status: "Conservation status", group: "Animal group", habitat: "Habitat", region: "Geographic region" };
export function SpeciesExplorerControls({ filters, options, warnings, count, total, children }: {
  filters: Filters; options: FacetOptions; warnings: string[]; count: number; total: number; children: ReactNode;
}) {
  const router = useRouter();
  const form = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const summary = filterSummary(filters);
  useEffect(() => {
    // Keep the form mounted so Apply and browser history preserve keyboard focus.
    const search = form.current?.elements.namedItem("q");
    const sort = form.current?.elements.namedItem("sort");
    if (search instanceof HTMLInputElement && search.value !== filters.q) search.value = filters.q;
    if (sort instanceof HTMLSelectElement) sort.value = filters.sort;
    form.current?.querySelectorAll<HTMLInputElement>("input[type='checkbox']").forEach((input) => {
      input.checked = filters[input.name as FacetKey].includes(input.value);
    });
  }, [filters]);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending) return;
    const input = new FormData(event.currentTarget);
    const query: SearchQuery = {};
    for (const key of ["q", ...facetKeys, "sort"]) query[key] = input.getAll(key).filter((value): value is string => typeof value === "string");
    const next = filtersToQuery(parseFilters(query, options).filters);
    startTransition(() => router.push(next ? `/species?${next}` : "/species", { scroll: false }));
  };
  return <>
    <form ref={form} action="/species" method="get" role="search" aria-label="Find selected species" onSubmit={submit} className="species-filters">
      <div className="species-search-row">
        <label htmlFor="species-query">Search common or scientific name
          <input id="species-query" name="q" type="search" defaultValue={filters.q} placeholder="Snow leopard or Panthera uncia" autoComplete="off" />
        </label>
        <label htmlFor="species-sort">Sort records
          <select id="species-sort" name="sort" defaultValue={filters.sort}>{Object.entries(sorts).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        </label>
      </div>
      <div className="species-filter-groups">
        {facetKeys.map((key) => <details key={key} open={filters[key].length > 0}>
          <summary>{labels[key]}<span>{filters[key].length ? `${filters[key].length} selected` : "All"}</span></summary>
          <fieldset><legend className="species-visually-hidden">{labels[key]} filters</legend>
            {options[key].map((option) => <label key={option.value}>
              <input type="checkbox" name={key} value={option.value} defaultChecked={filters[key].includes(option.value)} />
              <span>{option.label} <small>({option.count} {option.count === 1 ? "record" : "records"})</small></span>
            </label>)}
          </fieldset>
        </details>)}
      </div>
      <div className="species-filter-actions"><button type="submit" className="action action-primary" aria-disabled={pending}>{pending ? "Applying filters…" : "Apply filters"}</button><Link className="action" href="/species" scroll={false}>Clear filters</Link><p>Choose any values within a group. A record must match each selected group.</p></div>
    </form>
    {warnings.length > 0 && <aside className="species-filter-warning" aria-label="Filter corrections"><h2>Some URL values were not recognized</h2><ul>{warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul><p>Recognized selections remain applied; no unknown filter silently removes a record.</p></aside>}
    <div className="species-result-summary">
      <p role="status" aria-live="polite" aria-atomic="true">{count} {count === 1 ? "record" : "records"} in this selection <span>/ {total} in the documentary</span>{pending && " · Updating…"}</p>
      <p>{summary.length ? summary.join(" · ") : "All selected species"}</p>
    </div>
    <div id="species-results" aria-busy={pending}>{children}</div>
  </>;
}
