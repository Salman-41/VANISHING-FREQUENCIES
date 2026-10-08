# Project status

**Stage:** Species scientific foundation complete for local development with explicit evidence gaps  
**Updated:** 2026-10-08

## Completed: species stage

- Read existing rules, status, research files and data scaffold before changes. Continued the existing workspace in place.
- Researched all eight candidates and selected six: snow leopard, blue whale, tiger, Bornean orangutan, hawksbill sea turtle and African forest elephant. Red panda and Asian elephant remain reserves.
- Created `docs/research/species-selection.md`, `docs/research/species-fact-sheets.md` and `docs/research/scientific-review.md`.
- Created `data/processed/species.json`, `data/schemas/species.schema.ts` and `data/sources/species-citations.json`. The contract separates scientific descriptions, scoped quantitative measurements, trends, editorial proposals and asset provenance.
- The citation catalog contains 35 page-read sources and six unverified reading leads (five search-only, one inaccessible); unverified leads cannot support species records.
- Recorded six measurements: two historical estimates eligible only with their full dated context, and four held research figures. No global totals or annual trend series were fabricated.
- Cataloged six image candidates with item-page licenses and three audio candidates with differing license/permission states. All remain unacquired and uncleared; three image candidates are captive portraits.
- Added `scripts/validate-species.ts`, `tests/species-foundation.test.ts` and dedicated package commands. Installed only the existing research dependencies locally and added `package-lock.json`.
- Passed `npm run data:validate-species` (six species / six measurements / two dated-context-only), `npm run typecheck`, `npm run test:species`, and a direct run of eleven validation/negative checks.
- No frontend implementation, hosting, deployment, domain or cloud work. This stage stops at the scientific development handoff.

## Unresolved: species evidence and asset access

- All exact formal IUCN assessment years/dates remain unknown and latest-assessment confirmation is false. Verified public categories are retained as public summaries; no restricted assessment/API data was imported. Obtain appropriate authorization and exact assessment metadata before publishing assessment dates or assessment-derived rationale.
- Original Nepal tiger census methods, measurement windows, demographic units, uncertainty and cross-year comparability require verification. The official historical PDF was inaccessible; public national results are retained on hold, including the current announcement.
- The historical Bornean orangutan estimate needs its original model and uncertainty. An older forecast was excluded.
- No verified current global abundance for hawksbill or forest elephant is imported. Inspect the newer forest elephant status report and rights; inspect newer whale stock editions before describing an estimate as current. NOAA's inspected historical Eastern North Pacific stock report explicitly leaves its current trend unknown.
- No standardized annual series or numeric global trend magnitude exists in the selected records. Qualitative directions retain source qualifiers and geography.
- Acquire media and preserve original provenance, creator, license evidence, final credit and modifications before setting clearance true. Obtain appropriate audio permission for the Cornell candidate; verify blue whale audio provenance and playback speed. Snow leopard, tiger and Bornean audio remain unsourced; hawksbill species-specific sound is unverified, not evidence of silence.
- The legacy raw dataset/schema and legacy build/test commands are historical scaffold, not the validated development input. Use the new processed dataset and joint citation validator.

## Completed: preceding source inventory stage

- Inspected existing project files, including the research scaffold under `data/raw/` and `data/sources/catalog.json`.
- Created source inventory, licensing notes, data limitations, project rules, and a machine-readable source manifest.
- Verified current LPI portal content and OWID LPI interpretation page. Verified IUCN API terms through its official API documentation and Wikimedia Commons reuse guidance.
- Recorded the LPI interpretation caveat and separated observation records from abundance data.

## Continuing source inventory limitations and access

- WWF Living Planet Report 2026 publication details and 2026 dataset/methodology were not independently verified from an accessible primary report page in this research pass. Treat 2026-specific metrics and downloads as unverified until the report and its technical supplement are checked.
- The LPI public database download requires a use description and acceptance of its data-use agreement. The available portal describes time series covering 1970–2020; verify the exact release and terms at acquisition.
- IUCN API use requires a token and is forbidden for commercial purposes under the API terms. This project's commercial status/use needs resolution; obtain written authorization or an appropriate commercial license before relying on Red List data.
- BirdLife species datasets may have restricted/paid terms; no bulk data was acquired. Request access and confirm permitted use.
- NOAA and sound archive asset rights can vary by recording, creator, or page. Check each recording and image's item-level license/credit before reuse.
- No raw source datasets, audio or images were downloaded in the source inventory stage. This species stage adds curated factual JSON and references; no credentials, account registrations or external permission requests were submitted.

## Next data acquisition steps

1. Inspect WWF's 2026 report, downloadable tables, and technical notes; capture exact edition, period, caveats, citations, and rights.
2. Request and archive the LPI public dataset plus applicable agreement; retain release/version and original citations.
3. Decide the intended commercial status and obtain IUCN authorization before any Red List API requests.
4. Species selection is complete. Request BirdLife access only if later scope needs its bird datasets; prefer open species-level datasets where rights permit.
5. Use GBIF only for documented occurrence/distribution questions, not population abundance; create a DOI-backed download and follow record licenses/citation.
6. Select individually licensed sound/image assets and record creator, source URL, license, required credit, modifications, and retrieval date in asset metadata.

## Handoff

Read the species selection, fact sheets and scientific review together. Development may model known, unknown and held states using the validated contract; unresolved facts must stay unknown and held figures must remain undisplayed. Evidence/rights clearance remains necessary for any affected public content. This task ends here.
