# Biodiversity Observatory — implementation handoff

**Stage:** Local implementation, 2026-10-09. `/data` expands the validated homepage index evidence. Research bytes, report editions, species measurements and media remain unchanged.

## Data path and ownership

A request loads `data/processed/biodiversity.json` through the existing server-only `getResearch()` / `loadLocalResearch()` path. The loader checks Zod contracts, the successful validation report, fingerprint, byte length and SHA-256. URL selection is normalized against real series/year options on the server. Server components render citations, provenance, methodology and semantic tables. Small client boundaries handle the selection form, exact-year inspection, tooltips and optional chart fade.

The annual client receives a compact `AnnualSeries` contract from `data/schemas/observatory.schema.ts`: identity, edition, scope, baseline/unit and exact source points, bounds, interval kind/level and missing reasons. It receives no complete research bundle or original row representations. Endpoint interaction receives only the fields required for its signed scale and explanation. Full record provenance remains in the versioned scientific export and permitted downloads.

## Available products

| Product | Observations / scope | Visualization |
| --- | --- | --- |
| LPR 2024 via pinned OWID snapshot | 357 annual estimates: global, five regions, freshwater; 1970–2020 | One selected series with bounds, actual-year inspector and complete table. Regional view also has five panels sharing zero, period and vertical maximum. |
| LPR 2026 WWF-UK announcement | Nine rounded changes: global, five regions, freshwater/terrestrial/marine; fixed 1970–2022 period | Directly labeled signed bars on a common −100% to 0% scale for this negative-change snapshot; global/regions/ecosystems views. No annual curve or reconstructed interval. |

Terrestrial/marine **annual 2024** observations and **annual 2026** products are unavailable. Freshwater does not stand in for the other systems. Species estimates are scoped historical measurements, not annual histories, and are not plotted as biodiversity curves.

## URL and form contract

The GET form operates without JavaScript. Enhanced submission uses one Next router transition with `scroll: false`; existing evidence remains readable while loading. Explicit Apply/Reset preserve ordinary navigation. Back/Forward restore the form; draft edition/scope selections show compatible controls before Apply.

| Parameter | Accepted values | Behavior |
| --- | --- | --- |
| `edition` | `2024`, `2026` | Default 2024; choose a distinct product. |
| `scope` | `global`, `region`, `ecosystem` | Default global; options derive from the reviewed products. |
| `series` | An actual 2024 series ID in the selected scope | Default available series for that scope. No unsupported series gets a fabricated plot. |
| `start`, `end` | Actual published integer years for the selected annual series | Inclusive display window; full range default. Range does not rebase the index. Single-year windows display their one real mark. |

2026 ignores annual series/date parameters with a visible explanation. Unknown, repeated, malformed, reversed, mismatched and unsupported selections receive explicit corrections. Recognized evidence remains available. Missing data is neither zero-filled nor extrapolated. Hover/year inspection is local UI state and does not generate network requests or fractional-year URL values.

Examples:

- `/data`
- `/data?edition=2024&scope=region&series=lpi-2024-owid-asia-and-pacific&start=1990&end=2010`
- `/data?edition=2024&scope=ecosystem`
- `/data?edition=2026&scope=region`
- `/data?edition=2026&scope=ecosystem`

## Scientific geometry and interaction

`geometry.ts` uses the existing `d3-scale` and `d3-array` modules. Numeric mapping is based on documented [linear scales](https://d3js.org/d3-scale/linear) and [array summarization](https://d3js.org/d3-array/summarize). D3 scales map values to coordinates; their mathematical interpolation is not used to produce scientific estimates.

Annual vertical domains start at zero, include 1970=1, and contain every central value and source upper bound. The inspected estimate goes directly to a published point. Straight graphic connectors join adjacent reported years only; null estimates, missing years and absent bound pairs break the appropriate paths. No smoothed curves, rebasing, generated intermediate points, extrapolation or between-edition morph is used. Single-year domain padding reserves screen space without making observations at those extra coordinates. Regional panel scale includes every panel's bounds.

Endpoint bars extend from their signed source value to zero. −100% is a meaningful lower bound for proportional index change. The helper can expand the positive end if a future **reviewed** source contains an increase; current records all decline. No endpoint is converted into a headcount or appended to an annual line. Null values remain unavailable. Interval kinds/levels survive the chart contract; the current annual source level is null and no 95% interval is assumed.

The LPI is average relative change in monitored vertebrate populations. It does not measure the percentage of individual animals lost, extinctions, the percentage of species/populations declining, or all biodiversity. Regional/system comparisons describe proportional indices with differing populations, monitoring coverage and pre-baseline histories; they are not rankings of abundance, intactness or intervention efficacy. No GBIF counts or acoustic measurements are used.

## Editorial and accessible reading

The design uses the established obsidian/ivory/stone/forest/rust tokens, a large opening statement, an interpretation preface, a plot with an adjacent evidence margin, exact-record inspection, regional small multiples, method passages and an edition register. Desktop and compact SVG geometries keep labels legible without a horizontal plot carousel. Only the tables scroll horizontally in their own named keyboard-focusable regions. Long tables use native disclosures; every source row remains available in HTML.

Each figure has a caption, named SVG, unit, zero/baseline explanation, legend and local source edition/version/date/license. Marks never rely only on color. Native selection and Previous/Next controls provide the same inspection information as pointer/touch. Tooltip descriptions are linked to their trigger; Escape dismisses, and pointer movement into the tooltip region does not immediately close it. Committed year changes announce the real estimate. Complete tables and static plots remain readable without motion or JavaScript; the GET form still works. With JavaScript disabled, the inline note directs readers to the source table for year inspection.

Selection loading uses a written busy state while previous evidence stays available. Empty selections have a no-observation explanation. Unsafe chart geometry produces a chart-specific written error and refers to the independent source table. Failed validation/load reaches the `/data/error.tsx` boundary with the installed Next 16.4 `retry` API, which refetches the server evidence. There are no dummy values or zero-line fallbacks.

## Motion and cleanup

`ChartMotion` calls the existing `loadMotionTools()` utility. A scoped GSAP context fades the **already exact, opaque chart wrapper** from 0.86 to 1 over 160 ms on a product/range commit. No mark is drawn sequentially, no numerical value is counted up, and no geometry is morphed. Text controls and evidence stay available.

OS/user reduced motion, reduced data and lighter media disable enhancement. Live changes revert the context. Generation/cancellation checks prevent delayed imports from mutating an obsolete chart. Unmount removes listeners and reverts owned work. No scroll controller, ScrollTrigger, pin or RAF loop is created; the page remains silent.

## Download reproduction and rights

`npm run data:observatory-export` validates the existing scientific export/report and creates five static files in `public/data-downloads/`. No API, runtime external fetch, source acquisition, hosting or deployment setup is added.

- `lpi-2024-owid.json` / `.csv`: complete 357-row aggregate annual product.
- `lpi-2026-endpoints.json` / `.csv`: complete nine-row aggregate endpoint product.
- `README.txt`: edition-specific citations, interpretation, transformations and reuse conditions.

JSON retains complete normalized records/provenance, dataset rights, citations, verification date, fingerprint and research export hash. CSV retains dates, units, source values, bounds, interval metadata, missing explanations, original representations, attribution and full `provenance_json`. Null CSV fields are empty; JSON nulls remain null. Display filters do not alter these complete product downloads. CSV uses canonical LF line endings and standard quoted fields; this changes no scientific value.

Only allowlisted published aggregate datasets with matching edition/metric and permitted redistribution/CC BY-SA 4.0 rights can export. The acquired [ZSL policy](https://www.livingplanetindex.org/documents/LPI_Data_Use_Policy_2026.pdf), clause 3, permits published-trend reproduction under [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/). Original report prose/artwork/logos, the underlying Living Planet Database, IUCN/BirdLife restricted products, species research and media are not redistributed. Original raw endpoint rows retain a pre-review `review-required` representation; the normalized dataset rights contain the subsequent published-trend clearance. The download notes explain this distinction. This is not a site-wide content license or endorsement.

On 2026-10-09 the [WWF-UK release](https://www.wwf.org.uk/press-release/living-planet-report-2026) was read again: endpoint values, coverage and the edition-comparability caveat agree with the pinned records. The [OWID interpretation](https://ourworldindata.org/living-planet-index-decline) was read for the interpretation safeguards; no updated monitoring totals were imported. Direct policy access through the web tool failed, so its new online reread is **unverified**; the previously acquired, hashed policy was inspected locally. No research verification dates were advanced by this frontend stage.

`npm run data:check-observatory` compares generated bytes with every committed download. It fails on stale/missing files. Regenerate only after source/rights review following a legitimate pipeline change, then run all checks; never change source hashes to silence failures. Citation notes are pinned to this reviewed snapshot and must be reviewed with any future edition or coverage update.

## Verification commands

```bash
npm run typecheck
npm run test:visualizations
npm run data:check-observatory
npm run test:local
npm run build
npx playwright test tests/browser/observatory.spec.ts --config=playwright.production.config.ts
npx playwright test --config=playwright.production.config.ts
```

The visualization suite checks all 357 annual rows and nine endpoints against independently parsed raw CSV; every point/table/download equals the processed artifact. Independent raw decimal conversion permits at most eight scaled JavaScript machine epsilons for Python/JS floating-point parsing differences, not a scientific rounding tolerance. Processed-to-chart and processed-to-download comparisons are exact. The suite covers all 9,282 series/inclusive-range combinations, URL behavior, scale inverses/bounds/zero, same-edition regional panels, null/gap segmentation, source-year snapping, single points, invalid geometry, uncertainty contracts and deterministic licensed downloads. Python's standard CSV parser checks exported quoting, values, dates and full provenance independently.

Browser coverage includes all seven annual series, all three endpoint scopes, all rendered numerical cells/marks, cropped/single-year windows, Apply/history/focus, invalid queries, keyboard/pointer/touch tooltips, actual download events, native no-JavaScript forms/tables, 320/390/768px reflow, reduced-motion changes and delayed navigation. A React SVG-title hydration issue found in the first run was fixed using a single string title; the subsequent targeted route suite passed. A later pointer test found the decorative selected marker intercepting the underlying mark; the marker and crosshair now ignore pointer events, and the tooltip hover check covers its persistent reading region. Current exact results and screenshots are recorded in `docs/STATUS.md`.

## Remaining review and access

- Official 2026 annual results/bounds and full current technical-method review remain outstanding; endpoints cannot fill that gap.
- 2024 terrestrial/marine annual observations are absent in the acquired product.
- Interval confidence levels remain unverified in the acquired annual metadata; endpoints have no supplied bounds.
- Underlying LPD, restricted IUCN/BirdLife data and held species methods retain their prior access/evidence blockers.
- Local Chromium, touch emulation and responsive checks do not certify physical-device, Safari/Firefox or assistive-technology behavior. A formal accessibility/scientific review remains separate.
- Asset rights and species facts were not changed. The scientific export SHA-256 remains `36b87bf96cf579f6bcf5e9b97157573e897de62e65c7829bb9b3b460017d670c`.

**Stop:** The Observatory stage ends after local verification; continue only with a new requested stage.
