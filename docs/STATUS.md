# Project status

**Stage:** Local Next.js foundation complete and verified

**Updated:** 2026-10-08

## Completed: local frontend foundation

- Inspected the existing repository, project rules, status, all research/data/design documents and validated contracts before implementation. Continued in this workspace; no nested replacement project was generated. The framework-generated `AGENTS.md` was inspected and its relevant installed Next documentation read.
- Installed exact stable versions after official npm registry peer/engine inspection: **Next 16.4.0, React/React DOM 19.3.0, TypeScript 7.0.2, Tailwind/PostCSS 4.3.3, GSAP 3.15.0, @gsap/react 2.1.2, Lenis 1.3.26, Three 0.186.1, Fiber 9.8.1, Drei 10.7.9, Zustand 5.0.15, Zod 4.6.5, d3-scale 4.0.2 and d3-array 3.2.4**. Playwright 1.64.0 and relevant typings support local checks. Pinned lockfile and [compatibility receipt](development/dependency-compatibility.json) preserve the declarations.
- Runtime: **Node 24.21.0 LTS / npm 11.19.0**. The machine's default Node 20 installation reported a transitive camera-controls engine warning. Reinstalled with `npm install --strict-peer-deps --engine-strict` under the official local Node 24 toolchain; no force/legacy-peer flags. `.nvmrc`, package engines and developer instructions record the requirement. The downloaded Node archive matched the official SHA-256 list. No global runtime/PATH setting was changed.
- Created App Router foundations for `/`, `/species`, `/species/[slug]`, `/soundscapes`, `/data`, `/about`, `/sources` and `/credits`. Six reviewed slugs prerender through one detail template; unknown slugs return 404. Added root layout/metadata, loading/error/global-error/404, shared header/footer, editorial/action/note/evidence components, responsive tokens and normal-flow chapter anchors.
- Bundled actual Archivo Latin variable upright and real italic WOFF2 files, original OFL license and acquisition hashes. Upright is preloaded; italic is loaded on use. Credits state the actual copyright/license. No wildlife photo or recording was acquired, hotlinked or promoted to cleared.
- Implemented a native fullscreen navigation dialog with explicit Tab/Shift-Tab wrapping, Escape/Close, background inertness, opener restoration, route focus and JavaScript-free page links. Per-tree Zustand preferences use a strict versioned Zod contract; OS reduced motion wins, lighter-media and motion choices remain independent, and storage failures are safe.
- Server-only research access validates the saved JSON and its matching successful report/fingerprint/hash/byte size, deduplicated through React request caching. The large research bundle never crosses a client provider boundary. Dates, geography, measurement method/uncertainty, public-summary status limitations and citations remain adjacent to evidence. A Turbopack alias resolves the original research schema's `.js` specifier without editing that schema.
- Data page provides a semantic 2024 global annual table and a separate 2026 endpoint table, source dates/version/attribution and licensed-use limits. No interpolated species populations, cross-edition splice, occurrence abundance, inferred confidence level or sonification was added. Other licensed annual series remain available for future controls.
- Added opt-in GSAP/ScrollTrigger/Lenis loading, pure observed-record D3 scales and a lazy, clearance-gated Web Audio session interface. No global Lenis instance, animation ticker, autoplay, synthetic sound, WebGL canvas or unnecessary backend starts in the foundation. Three/Fiber/Drei are installed for later features and excluded from the initial feature graph.
- Added [local development handoff](development/foundation.md), root README, `tests/foundation/`, `tests/browser/`, development and production Playwright configurations and local npm commands. Native reading and unavailable-media states are implemented; the cinematic signatures, player, search/filter and interactive charts remain later features.

### Installation and exact local verification

Commands were run from the repository root with `/tmp/vf-node24/node-v24.21.0-linux-x64/bin` prepended to the command environment's PATH. For future sessions, select Node from `.nvmrc` with an existing runtime manager; the temporary extraction is not a permanent system installation.

```bash
export PATH="/tmp/vf-node24/node-v24.21.0-linux-x64/bin:$PATH"
npm install --strict-peer-deps --engine-strict
npx playwright install chromium
npm run test:local
npm run data:validate
npm run check:dependencies
npm run dev
npm run test:browser
npm run test:browser:production
```

| Final check | Exact result |
| --- | --- |
| Strict peer/engine installation | Passed under Node 24; npm reported zero audit vulnerabilities at installation |
| `npm run check:dependencies` | Passed, exit 0; no missing/invalid required peers |
| `npm run typecheck` | Passed, zero TypeScript errors; strict mode and unchecked-index checks retained |
| Existing Python pipeline tests | **43 passed**; builds isolated temporary outputs |
| Existing TypeScript export tests | **12 passed** |
| Existing species validation tests | **11 passed** |
| New foundation unit tests | **8 passed**: checked loader, exact slugs/order, references, edition-safe scales, media clearance and isolated/versioned preferences |
| `npm run test:local` total | **74 passed**, zero failures |
| `npm run data:validate` | Passed: **366 index records, six species, two population records, six stories** |
| Local development server | Started successfully at **http://127.0.0.1:3000** |
| Development Chromium suite | **6 passed**; latest full run **1.2 minutes** |
| `npm run build` | Passed: compiled, built-in TypeScript check, generated **15/15 framework pages**; seven fixed public URLs + six species detail URLs |
| `npm run test:browser:production` | Final build passed + **6 Chromium checks passed in 18.2 seconds** against local production on **127.0.0.1:3001**; test server stops after the suite |
| Browser route coverage | **13 populated URLs** returned 200 and one meaningful H1; unknown species and unmatched path returned 404 |
| Browser evidence checks | Historical whale value/stock/period/CV/publication/check date + source link; tiger missing-estimate state; **51 annual world rows** / **nine separate endpoint rows**; citation date retained |
| Browser accessibility checks | Menu containment/Escape/focus restoration/route focus; **320 px** reflow on all populated URLs; OS motion precedence; persisted lighter media; essential evidence/navigation without JavaScript |
| Browser error/network checks | Zero page errors or hydration warnings in final production route check; no remote page/media/font requests; no audio/video/canvas in the foundation |
| Visual inspection | Desktop **1440×900** opening and mobile **390×844** whale detail inspected; computed obsidian/ivory colors and local font loading confirmed; no mobile horizontal page overflow |
| Original artifact preservation | **50 original data/docs files** hashed before work; all unchanged before status update. **49/49 other original files** remain unchanged after this required status update |

Initial build resolution, focus-wrap and streamed-404 issues were corrected and rerun. A first browser run was interrupted during server setup; the final development and production runs above passed. Temporary hot-refresh warnings during source/font editing are not claimed as clean-run results. Browser audits above are scoped checks, not WCAG certification or an assistive-technology/device-performance audit.

Original saved export SHA-256 remains `36b87bf96cf579f6bcf5e9b97157573e897de62e65c7829bb9b3b460017d670c`; build fingerprint remains `23585475d87da7054520dacc7a12083a4adf60f204fbae387292dc8b97bf13f4`. No original `data/` file or preceding research/design/data specification changed. Future legitimate pipeline regeneration will use the new dependency lock in its fingerprint; this stage did not replace the verified saved artifact.

### Remaining foundation and evidence limits

- Wildlife media remains unacquired/uncleared. Complete item-level provenance, compatible permission, wild/captive/geographic context, final credits and accessible descriptions before enabling image/audio modules. The Web Audio interface is not a completed recording player; live decoding, volume/pause controls and reviewed file-ledger binding await cleared assets.
- Formal IUCN dates/appropriate authorization, held Nepal/Bornean original methods, full 2026 annual LPI/methodology, underlying LPD and any BirdLife bulk product permissions remain unresolved. Unknown/held values remain unavailable; no API token or restricted data was requested.
- Full cinematic interactions, richer exploration/filter controls, SVG charts, actual media crop review and optional WebGL are outside this foundation. Screen-reader, forced-colors/text-zoom and representative mobile performance review remain necessary for later implementation. Core content is readable without these enhancements.
- No hosting provider, deployment script, cloud infrastructure, domain, paid service, database or API backend was added. Server file access reads local versioned JSON. Only local development/production processes were used.

**Stop:** Local project foundation complete and verified. Continue only on a subsequent implementation task, with the existing scientific/media limits intact.

## Completed: design system and page planning stage

- Read the existing creative direction, art direction, storyboard, signatures, asset briefs, project rules/status, species selection, scientific review/limitations and data specifications. Continued the existing workspace without generating an application.
- Created [design tokens](design/design-tokens.md), [component system](design/component-system.md), [responsive specifications](design/responsive-specifications.md), [page blueprints](design/page-blueprints.md), [accessibility design](design/accessibility-design.md), and [motion tokens](design/motion-tokens.md).
- Defined Archivo families/weights/fallbacks, fluid `clamp()` typography, palette primitives and semantic surface modes, grid/spacing/dimension/layer tokens, control states and focus treatments. Rechecked the official font metadata/OFL license and current W3C accessibility/dialog guidance on 2026-10-08. No font binary was acquired.
- Specified buttons/navigation, native form controls, editorial species cards, evidence/measurement modules, charts/tables, recording player, tooltips/popovers, dialogs/fullscreen navigation, and loading/empty/unavailable/error states. Essential scientific context is visible within reusable modules; sources and media clearance travel with content.
- Planned eight page types: Homepage, Species Explorer, Species detail, Soundscapes, Data Observatory, About, Sources and Credits. The homepage retains all eight documentary chapters; the detail template covers the six reviewed species. Each major page section has desktop/mobile behavior, route/content bindings, interactions and meaningful fallback states.
- Planned Figma-compatible `VF/` component/style names, exact variant properties and primitive/semantic/responsive/motion variable collections, with a mapping to future CSS and TypeScript names. Figma modes represent reference frames; they do not execute `clamp()`. No Figma file or plugin setup was performed.
- Preserved the strongest Listening Aperture signature, separate 2024 annual/2026 endpoint LPI views, dated country/stock estimates, local conservation inference limits and explicit unknown formal assessment dates. No held statistic, observation-derived abundance, restricted dataset or unverified media was promoted for display.
- Document checks passed: **six requested files**, **eight page blueprints**, **zero broken local links** in the new documents; **10/10 fluid endpoint calculations** within 0.02 px at 390/1440 px with a 16 px root; **6/6 reference grid calculations**; **9/9 solid-palette contrast pair calculations**. These are specification checks, not browser/accessibility/performance results. Existing pipeline verification was not rerun or altered.

### Remaining implementation and production needs

- All wildlife media remains unacquired/uncleared. Follow the existing asset briefs and rights ledger before populating image/player components. Captive-image, Atlantic/ENP and recording-rate distinctions remain requirements. Current page plans include complete text alternatives.
- Font acquisition/revision/subsets, real responsive crops, recording descriptions/waveforms, actual contributor credits and any optional media exports await production review. No names, permissions, clips or asset use were fabricated.
- Browser/keyboard/screen-reader/forced-colors/reflow testing and actual device performance measurements require later implementation; budgets and accessibility specifications are targets. Source/version/rights review remains necessary for content used publicly.
- Existing scientific blockers continue: formal IUCN metadata/appropriate authorization, held original species methods, full 2026 annual data/methodology and permissioned source products. The page plan implements explicit unavailability rather than inventing content.

**Stop:** This design-system stage is complete. Only documentation was created/updated; no React components, Next.js scaffold, package installation, hosting, deployment, domains or cloud work was performed.

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

Read the project rules, species research, `docs/data/`, all eleven `docs/design/` documents and [local foundation handoff](development/foundation.md) together. Use the implemented server-only access to `data/processed/biodiversity.json`; earlier species JSON is complete research with held values and must not provide UI numbers. Inspect existing files before future changes and update this status at every stage. Preserve dated evidence, independent report editions, mobile/reduced-motion reading and explicit unknown/media-unavailable states. The Next.js foundation is now implemented and verified; cinematic features, richer page interactions and cleared media require a subsequent task. Evidence/rights review remains necessary for affected content.
