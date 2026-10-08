# Run and extend the data pipeline

Local preparation only. Read `docs/PROJECT_RULES.md`, `docs/STATUS.md`, this directory's specifications and the research limitations before changing inputs or code. Every stage must update status. No website, deployment, hosting or cloud work is part of these commands.

## Setup

From the existing project root:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r scripts/data/requirements.lock.txt
npm ci --ignore-scripts
```

The verified environment used Python 3.13.5 and Node 20.19.2; the report records the actual environment. Check the current report rather than treating these documentation values as a universal compatibility guarantee. All dependencies are local; `.venv` and `node_modules` are ignored. The pinned dependency set is tested for this environment, not necessarily every OS/Python release.

## Build and validate

```bash
npm run data:build
npm run data:validate
npm run typecheck
npm test
```

`data:build` is entirely offline and already runs Python plus Zod validation before export. `data:validate` independently validates the frontend bundle; `data:validate-species` checks the complete earlier research records. `npm test` runs pytest pipeline tests, TypeScript frontend contract tests and the species foundation tests.

Default output: `data/processed/biodiversity.json`. Default reports: `data/processed/reports/validation-report.json` and `.md`. Every successful frontend statistic has a source, source date/edition, measurement period, unit and original provenance. A report status of `failed` makes the build unsuccessful even if a previous bundle still exists.

Alternative paths do not change scientific processing:

```bash
.venv/bin/python -m scripts.data.pipeline --manifest data/sources/pipeline-manifest.json --output /tmp/vf-data-check --reports /tmp/vf-data-check/reports
.venv/bin/python -m scripts.data.export_schemas
```

The schema export writes import/observation JSON Schema documentation. Executable Python/Zod validators additionally enforce scientific and cross-reference rules.

## Active import interfaces

The manifest is validated against `data/schemas/import-manifest.schema.json`. Each dataset needs a unique ID, adapter, format, raw input path/SHA-256, version, report edition, source ID/URL, source/access dates, rights evidence and coverage. Supporting catalogs and registries are pinned separately. Sources must exist as `page-read` citations, with matching URLs.

| Adapter | Input | Required scientific boundary |
| --- | --- | --- |
| `owid-index` | Acquired CSV + matching chart metadata JSON | Pinned 2024 metadata columns, conversionFactor, update date, coverage and mapped entities. A different release needs a reviewed adapter/descriptor. |
| `endpoint` | CSV or JSON records, optionally encoded JSON period/uncertainty/source-ID cells | Exact declared edition and full endpoint period; no annual reconstruction. |
| `canonical-index` | CSV or JSON using the header template in `data/schemas/canonical-index.template.csv` | Published annual index or endpoint change only, explicit edition/coverage/units/bounds; never occurrence/abundance records. |
| `species-foundation` | Complete reviewed species JSON snapshot (`recordPath: species`) or equivalent complete-record CSV | Selected names, nested existing species contract, measurements and source rights. This does not parse arbitrary external stock-report tables. |

For species CSV, list encoded nested columns in `options.jsonColumns` (taxonomy, conservation, descriptions, measurements, trends, interventions, sound, assets, editorial and evidenceGaps). Every row must represent a complete reviewed record; JSON cells are parsed strictly. JSON files require a top-level array or explicit `recordPath`. CSV and JSON copies of the same evidence are alternate inputs, not additional observations.

Canonical index columns include series ID, metric, value, unit, year (annual) or start/end year (endpoint), geography, ecosystem, scope, taxon, edition, lower/upper bounds, uncertainty kind/level and locator. Use `columnMap` to map canonical keys to actual header names. Supported source units are `index-1970-1`, `index-1970-100`, `percent`, `%`. Unsupported units fail and need a documented conversion/contract change. Empty bounds are allowed only as an absent pair; a lone bound fails.

Set `dateFormat` explicitly for non-ISO row verification dates; dates in descriptors/output are ISO. Set `missingTokens` explicitly; no automatic pandas NA inference or inferred zero. Keep source measurement units and demographic populations separate from editorial descriptions.

Do not import a source until its rights and scientific provenance are verified. A SHA-256 pins bytes; it does not make them scientifically valid or licensed. Record a new citation, original source date/version, rights evidence and appropriately reviewed taxon concept. Make a new immutable snapshot and descriptor for changed releases; do not overwrite a report edition or relabel the old data.

## Separate optional acquisition

`scripts/data/acquire_public.py` downloads only its three explicit public OWID/policy URLs and writes URL/date/hash receipts. It refuses to overwrite existing snapshots and never submits an access form. The default build never runs it. For an initial empty acquisition directory:

```bash
python3 scripts/data/acquire_public.py --retrieved-on 2026-10-08
```

This is a record of the acquisition command used in this stage, not a daily refresh instruction: the script's versioned filenames must be reviewed for a new release/date. To acquire a new release, add a separately named reviewed snapshot/URL and matching descriptor rather than deleting or overwriting the existing snapshot. Dynamic URLs may change over time; only the saved hashes and metadata identify this exact acquired version.

## Authorization and evidence blockers

- Underlying LPD records: purpose/agreement and current restrictions apply; financial-gain use and original redistribution are prohibited by the current policy. No form submission is authorized or performed here. Keep a blocker unless appropriate permission and an allowed export strategy are documented.
- IUCN assessment/API data: appropriate commercial/access authorization and allowed redistribution must be established before acquisition. No token or restricted dataset is used. Exact assessment dates remain unknown.
- BirdLife: obtain product-specific permission/license before bulk import or redistribution.
- 2026 annual LPI results: acquire the official published result file, uncertainty and version; the nine endpoint summaries cannot supply historical intermediate values.
- Held species figures: inspect original survey/model methods, units, periods, uncertainty and comparability; then re-review the species research snapshot. Do not clear a figure merely by changing its `display` flag.

Blockers are explicit manifest records with URLs, requirements and candidate adapters, not dummy files. Moving a blocker into active datasets requires actual permitted data and a complete reviewed descriptor. Restricted data must not be placed in the frontend bundle even if parsing succeeds.

## Development handoff

Future Next.js code should read the validated bundle through `BiodiversityDataset`/`validateBiodiversityDataset`. Select one LPI edition and metric; display geography, period, unit and uncertainty, and link its citations. Species estimates are historical country/stock records, not current global totals. Unknown dates/trends/abundance remain unknown; unavailable products must show an unavailable state. Keep editorial narratives and media candidates distinct from scientific measurements.

This stage stops after the verified pipeline. It does not create frontend components or a website.
