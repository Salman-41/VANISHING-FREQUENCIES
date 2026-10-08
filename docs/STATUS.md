# Project status

**Stage:** Creative blueprint complete — ready for local implementation planning  
**Updated:** 2026-10-08

## Completed: creative direction stage

- Read the project rules, source/species research, scientific limitations, licensing notes, pipeline specifications, current status and validated data contract before designing. Continued the existing workspace in place.
- Established **The Listening Margin**: a dark editorial documentary organized around a horizontal landscape aperture and a visible margin for recording context and scientific evidence. Retained the requested palette and “The World Is Getting Quieter.” tagline as an editorial premise, not a measured global acoustic trend.
- Created [creative direction](design/creative-direction.md), [art direction](design/art-direction.md), [narrative storyboard](design/narrative-storyboard.md), [signature interactions](design/signature-interactions.md), and [asset requirements](design/asset-requirements.md).
- Specified all eight chapters (00–07), each with narrative objective, screen composition, typography, colors, real information, art direction, scroll behavior, interaction, motion, assets, audio, mobile alternative and performance considerations. Desktop/mobile dimensions, data bindings, source references and unavailable states are included.
- Designed three signatures: **Listening Aperture** (strongest; chapters 02/04), **Read the Bounds** (03), and **Follow the Field Note** (06). Each has keyboard, reduced-motion, silent/mobile and failure behavior. Ocean direction uses passive listening and playback context; no invented sonar localization or acoustic abundance metric.
- Defined an implementable grid, typography scale, motion timings, contrast usage, media/loading budgets and accessibility requirements. Selected Archivo as the type direction; inspected its official publisher, Google Fonts metadata and OFL 1.1 license on 2026-10-08. No font binary or wildlife media was acquired.
- Bound quantitative presentation to the validated bundle: separate 2024 annual LPI curves and 2026 endpoint summaries; two historical country/stock estimates with adjacent dates, scope and uncertainty; no held population values. Recovery notes retain local scope and intervention limits. Public category summaries retain unknown formal assessment dates.
- Prepared acquisition briefs for ten image slots, eight audio slots, original graphics, fonts and data/credits. Identified captive-image mismatches, Atlantic-audio/ENP-stock separation, unresolved Cornell permissions, absent hawksbill call evidence, and text-first alternatives.
- Document checks: five requested design documents present; eight chapters with **104/104 required fields**; **zero broken local document links**. Calculated solid-palette contrast ratios and documented allowed uses. Frontend implementation, visual prototypes, browser/accessibility/performance tests and new pipeline runs are outside this stage; existing pipeline verification results below remain unchanged.

### Remaining creative production gaps

- All wildlife images/audio remain unacquired and uncleared. The full visual/audio treatment depends on source provenance, compatible rights, exact credits, crop/context review and accessible descriptions. No candidate is promoted to cleared status by this blueprint.
- Priority assets: a verified mountain landscape and wild snow leopard frame, blue whale imagery, and the candidate normal-speed Atlantic recording. Wild tiger/Bornean replacements and actual Tost/Nepal/Arnavon intervention imagery still need sourcing. Each slot has a specified fallback.
- Font delivery, responsive crop proofing, waveform derivation, screen-reader/keyboard review, device performance profiling and user evaluation belong to later authorized production/implementation stages. Design budgets are targets, not measured results.
- Existing scientific/access gaps remain: formal IUCN metadata/authorization, held species methods, full 2026 annual results/methodology and restricted products. The design accommodates those gaps without fabricating inputs.

**Stop:** Creative blueprint complete. No React components, frontend code, new scientific data, media downloads, hosting, deployment, domain or cloud work was performed.

## Completed: processing stage

- Implemented `scripts/data/` offline preparation with Python, pandas and Pydantic, plus independent TypeScript/Zod frontend contracts. CSV/JSON import, mappings, normalization, ISO dates, approved units, duplicate/conflict detection, missing values, name/status/numeric checks, provenance and rights gates are implemented.
- Acquired and pinned public OWID 2024 LPI CSV/metadata and the current ZSL 2026 policy, with URL/date/checksum receipts. Rechecked WWF-UK's nine 2026 endpoint summaries and recorded published-trend CC BY-SA 4.0 permission. No underlying LPD or restricted IUCN/BirdLife dataset was acquired.
- Preserved complete species research in `data/raw/species-foundation.json`. The frontend bundle excludes four held numerical records and retains six species, two eligible historical estimates and six cited intervention/recovery stories.
- Created the three `docs/data/` specifications, Python import/observation JSON Schemas, `data/schemas/biodiversity.schema.ts`, pinned manifest/rights/citations/taxonomic registry, dependency pins/lock and automated tests under `tests/data/`.
- The atomic frontend output is `data/processed/biodiversity.json`; machine/human reports are under `data/processed/reports/`. Failed builds report errors and retain the previous valid artifact. File existence alone does not prove current validation.
- No interpolation, extrapolation, invented values, observation-to-abundance conversion or edition splicing. Source bounds, original units/representations, CV, periods, source editions/dates and hashes remain traceable.

### Exact verification results

| Check / output | Result |
| --- | --- |
| `npm run data:build` | Passed; zero errors |
| `npm run data:validate` | Zod passed: 366 index records; six species; two population records; six stories |
| Active inputs | Three: 357 annual LPI rows, nine endpoint summaries, six species records |
| Index series | 16: seven annual 2024 series and nine endpoint 2026 series |
| Real index missing values | Zero; missing behavior tested with deliberate mutations |
| Real duplicates/conflicts | Zero exact duplicates; zero conflicts; both behaviors tested |
| Population export | Two dated historical estimates; four held research figures excluded |
| Stories | Six: three documented interventions; three scoped/local recovery stories |
| Export citations | 36 referenced page-read entries |
| Python tests | 43 passed |
| TypeScript export tests | 12 passed |
| Existing species checks | Eleven passed in direct execution; aggregate `npm test` also passed |
| `npm run typecheck` | Passed |
| Reproducibility | Two independent builds produced identical bytes/hashes in the automated test |
| Export size | 966,276 bytes; human-readable JSON, no embedded media |
| Runtime | Python 3.13.5; pandas 2.2.3; Pydantic 2.11.7; NumPy 2.5.3; Node v20.19.2; Zod 4.6.5 |

Build fingerprint: `23585475d87da7054520dacc7a12083a4adf60f204fbae387292dc8b97bf13f4`. Export SHA-256: `36b87bf96cf579f6bcf5e9b97157573e897de62e65c7829bb9b3b460017d670c`. These identify this checked build; later legitimate input/code changes produce new hashes.

### Remaining processing gaps and access

- Five explicit manifest blockers: underlying LPD, official 2026 annual LPI results, IUCN assessments, BirdLife products and held species original-method evidence. Each has a source URL, requirements and candidate import interface; no dummy observations. External tables may need further reviewed adapters before reaching the canonical contracts.
- Current ZSL policy restricts underlying LPD financial-gain use and original redistribution. The published-trend exception applies only to aggregate results. No form was submitted or underlying-data agreement accepted.
- Acquired annual 2024 data contains freshwater but no terrestrial/marine series. Three-system comparisons use separate 2026 endpoint summaries. Annual 2026 data and full methodology review remain outstanding.
- Source upper/lower bounds are retained; confidence level remains null where the acquired metadata does not verify it. No endpoint uncertainty intervals were reconstructed.
- Formal species assessment dates remain unknown. Original Nepal/Bornean estimate evidence remains insufficient for display; no forest-only or hawksbill global count was filled in. Media remains unacquired/uncleared.
- The bundle is a provenance artifact, not an optimized website payload. Future development must select/limit data while preserving dates, units, geography, citations and rights.

**Stop:** This processing stage is complete and verified. No frontend, website, hosting or deployment implementation was performed.

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

- The processing stage verified the official WWF-UK 2026 announcement and its nine endpoint summaries, with a 1970–2022 period. The full report/technical supplement and official annual 2026 export remain unacquired; endpoints cannot supply intermediate years or interval estimates.
- The LPI underlying database download requires a use description and acceptance of its current agreement. The acquired/read 2026 policy refers to LPD 2026.1 and restricts financial-gain use and original redistribution. No underlying data was acquired; verify exact release/coverage and obtain appropriate permitted use before acquisition. The published-trend CC BY-SA 4.0 exception is used only for the aggregate results in this pipeline.
- IUCN API use requires a token and is forbidden for commercial purposes under the API terms. This project's commercial status/use needs resolution; obtain written authorization or an appropriate commercial license before relying on Red List data.
- BirdLife species datasets may have restricted/paid terms; no bulk data was acquired. Request access and confirm permitted use.
- NOAA and sound archive asset rights can vary by recording, creator, or page. Check each recording and image's item-level license/credit before reuse.
- No raw source datasets, audio or images were downloaded in the source inventory stage. This species stage adds curated factual JSON and references; no credentials, account registrations or external permission requests were submitted.

## Next data acquisition steps

1. Inspect WWF's full 2026 report, official annual results and technical notes; capture exact edition, periods, caveats, citations and rights. Its announcement endpoint summaries have been verified separately.
2. Request and archive the LPI public dataset plus applicable agreement; retain release/version and original citations.
3. Decide the intended commercial status and obtain IUCN authorization before any Red List API requests.
4. Species selection is complete. Request BirdLife access only if later scope needs its bird datasets; prefer open species-level datasets where rights permit.
5. Use GBIF only for documented occurrence/distribution questions, not population abundance; create a DOI-backed download and follow record licenses/citation.
6. Select individually licensed sound/image assets and record creator, source URL, license, required credit, modifications, and retrieval date in asset metadata.

## Handoff

Read the project rules, species research, `docs/data/` specifications and all five `docs/design/` blueprints together. Use `data/processed/biodiversity.json` as the validated pipeline bundle; the earlier species JSON remains complete research with held values. Unresolved facts stay unknown and held values are excluded from the frontend export. Follow the documented mobile, reduced-motion, silent and unavailable-media alternatives. Evidence/rights clearance remains necessary for any affected public content. The creative stage stops here; frontend development requires a subsequent task.
