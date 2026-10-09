# Project status

**Stage:** Biodiversity Observatory implemented; final browser regression in progress

**Updated:** 2026-10-09

## Completed: Biodiversity Observatory

- Replaced the `/data` foundation with the complete editorial Observatory: interpretation preface, edition/scope controls, annual evidence with a source margin, regional comparisons, ecosystem coverage notes, exact source tables, scientific methodology, licensed downloads and a separate endpoint register. The established visual tokens/layout and other routes remain intact.
- Implemented native GET and enhanced URL selection for edition, scope, actual annual series and inclusive published-year windows. Apply/Reset, preserved focus/history, a written pending state, invalid-query corrections, single-year windows and no-observation states are included. Cropping never rebases the 1970 index. 2026 endpoints reject annual date/series controls with an explanation.
- Annual views retain all **357** 2024 observations: global, five regions, freshwater; **1970–2020**. D3 linear scales/array utilities produce zero-based charts containing the baseline and all source bounds. Regional panels share a scale and period within that edition. Pointer/touch and keyboard/year controls inspect actual records; nulls and missing years break graphic connectors. No smoothing or intermediate observations are generated.
- Endpoint views retain all **nine** 2026 announcement summaries for **1970–2022**, with global/region/system groups, direct signed labels and a shared proportional-change scale. They have no annual curve, inferred intervals, headcount interpretation or connection to 2024 observations. Comparisons explicitly preserve differing monitoring coverage and pre-baseline context.
- Added the small TypeScript/Zod interaction contract, scoped feature modules and Observatory styles. Interval bounds, kind/level, original measurement units, periods, publication/access/verification dates, source editions and row provenance remain available. Confidence levels are unverified where the source metadata does not supply them; they are not assumed to be 95%.
- Accessible SVG titles/descriptions, full-precision tables in named keyboard scroll regions, native disclosures, year stepping, tooltip descriptions/Escape/hover persistence, compact layouts and no-JavaScript forms/tables provide a complete reading path. Unsafe geometry gets a chart-specific written error; failed checked-data loading reaches a route error boundary with Next 16.4 `retry`. No replacement numbers or dummy plots are used.
- Optional chart motion calls the existing GSAP utility and fades the already exact wrapper over **160 ms**. Mark geometry, values, axes and dates are never tweened. Scoped contexts and listeners clean up on preference changes, route/unmount and interrupted imports; OS/user reduced motion/data and lighter media disable it. No extra scroll controller, pin, audio, canvas or RAF loop was added.
- Created five deterministic static aggregate files under `public/data-downloads/`: edition-specific JSON/CSV plus citation/reuse notes, totaling **1,523,459 bytes**. JSON preserves full records/provenance; CSV preserves context, original fields and `provenance_json`. Files download only on request; display filters do not alter their complete products. The exporter validates the existing successful export/report, allowlists datasets and checks published-trend redistribution rights. `data:check-observatory` detects stale/missing outputs. No underlying LPD, restricted assessment/BirdLife product, species research bundle or media is redistributed.
- Added [Observatory implementation/methodology notes](development/data-observatory.md), dedicated visualization validation and browser tests, export/check scripts and the README handoff. No dependency, hosted service, deployment or data acquisition was added. The official WWF-UK announcement was reread and agrees with the pinned endpoints. The policy's direct online reread failed; the previously acquired hashed policy was inspected locally and the new online reread remains unverified.

### Exact local results (2026-10-09)

All commands used Node **24.21.0** / npm **11**. Playwright owns the local production server on **3001**. The existing user development server on **3000** was retained. A second attempted dev start exited because that server already owned the development directory; no user process was stopped.

| Check | Result |
| --- | --- |
| `npm run test:local` | **105 passed:** 43 Python data + 12 export contracts + 11 species research + 23 foundation + 16 visualization checks; TypeScript and five-file download freshness check passed. |
| `npm run test:visualizations` after CSV line-ending normalization | **16 passed**; independent Python CSV parsing reproduces exported values/dates/full provenance, and deterministic download bytes match. |
| Exact source verification | All **357 annual values/bound pairs** and **nine endpoints** matched independent raw CSV parsing. Processed-to-chart/table/download values are exact; raw Python/JS conversion allows only up to eight scaled machine epsilons for binary floating-point parsing. |
| Selection coverage | All **9,282** supported annual series/inclusive-range combinations select exactly their published source years, retain the baseline, and round-trip through URL state. |
| `npm run build` | Passed after the final pointer refinement; `/data` renders query-specific evidence on the local server. All 15 framework pages generate and the six species details remain SSG. |
| Targeted production route checks | **16 passed** after the SVG-title hydration fix: ten Observatory + six foundation scenarios. A later persistent-tooltip check found a decorative-marker hit target, which was refined and is under final full regression. |
| Final full production regression | **In progress** after the decorative marker/crosshair were made transparent to pointer events. |
| Responsive review | Browser checks at **320, 390 and 768px**, touch, reduced motion and native no-JavaScript forms/tables passed in the targeted run; final production screenshots pending. |
| Scientific preservation | Existing raw/processed/source data and image/audio files are unchanged. Export SHA-256 remains `36b87bf96cf579f6bcf5e9b97157573e897de62e65c7829bb9b3b460017d670c`. New data file: frontend interaction schema only. |

### Remaining evidence and device gaps

- Official annual 2026 results/bounds and the full current technical-method review remain unacquired. Endpoints cannot supply intervening observations.
- No terrestrial/marine annual 2024 series is present in the pinned OWID product; the UI states this explicitly.
- Annual source bounds' confidence level remains unverified in acquired metadata. Endpoint bounds were not supplied. No invented interval is shown.
- All earlier underlying LPD/IUCN/BirdLife access restrictions, held species method questions and missing assessment dates remain. The Observatory does not resolve or bypass them.
- New online policy access was unsuccessful; retained acquisition evidence is used for the previously reviewed published-trend permission. No new agreement was accepted or authorization inferred.
- Local Chromium and touch emulation do not certify Safari/Firefox, physical mobile hardware or screen-reader behavior. Formal scientific/accessibility review remains separate.

**Completion:** Final production regression and screenshot review are still being recorded. This stage has no hosting or deployment work.

## Previous stage: Species Explorer and species detail pages

## Completed: Species Explorer and species detail pages

- Implemented `/species` with literal common/scientific-name search, repeated-value conservation/animal-group/habitat/region filters, four sorting modes, URL queries, explicit Apply/Clear, result announcements, pending and no-results states, and visible correction of invalid URL values. OR applies within a group; groups and name search use AND. All current records and global option counts remain available; missing media never excludes a record. The normal GET form also filters without JavaScript.
- Bound categories to `conservation.category`, groups to cited taxonomy classes, and broad habitat/region navigation tags to the reviewed habitat/distribution descriptions. The mapping and source IDs are in [species page handoff](development/species-pages.md). No occurrence-to-abundance conversion, range polygons, population ranking or interpolated history is used. Unclassified future index entries stay visible with explicit facets.
- Built all six `/species/[slug]` records as statically generated editorial pages: credited full-proportion portraits, common/scientific identity, qualified conservation summary and date availability, habitat/geographical context, eligible population evidence and scoped trends, threats, ecological significance, sound knowledge, conservation actions/outcomes, taxonomy, source register, evidence gaps, related records and previous/next narrative navigation. Metadata includes species/scientific names, descriptions, relative canonicals and Open Graph article descriptions; filtered explorer URLs use noindex/follow.
- Added small client boundaries for the form, media errors and optional GSAP photo transitions. Server components retain scientific content/citations; the full provenance bundle is not imported by the client filter controls. Scoped 240 ms photo transitions clean up on revision/unmount and live motion/media preference changes. Text, controls, measurements and source links remain visible throughout. Filter commits preserve keyboard focus and history restores fields. A source-keyed image boundary recovers when moving from a failed portrait to a different species.
- Preserved scientific and media data bytes. Existing eligible snow leopard/blue whale estimates keep all scope, period, method and uncertainty notes; the other four show estimate gaps. Formal assessment dates and recordings of the six selected species remain unavailable and explicitly labeled. No NPS humpback/ptarmigan/thrush clip is substituted as selected-species audio.
- Added feature modules under `src/features/species/`, scoped `src/styles/species.css`, reusable conservation labels, a species segment error boundary using the installed Next 16.4 `retry` API, a useful missing-species route, six model tests and ten species browser scenarios. Rechecked existing photo licenses and retained creator/location/capture/context notes; no asset file or dependency was added. Six production review screenshots are in `docs/development/review/species-*.png`.

### Exact local results (2026-10-09)

All checks used the existing Node 24.21.0 / npm 11 runtime. Tests owned the local production server on port 3001; a separate screenshot server on port 3002 was stopped after review. No hosting or deployment was configured.

| Check | Result |
| --- | --- |
| `npm run test:local` | **89 passed:** 43 Python data + 12 export contracts + 11 species research + 23 foundation/media/filter checks; TypeScript passed. |
| Filter model coverage | All **8,192 multi-select combinations** matched an independent expected-membership table; search, URL corrections/round trips, sorting, unknown-record preservation and related navigation passed. |
| `npm run build` | Passed after the final image lifecycle change; all six detail pages are generated statically. `/species` renders query-specific results on the local server. |
| Full production browser regression | **45 passed** across routes, homepage, motion, soundscapes, species and WebGL. |
| Final species production rerun | **10 passed** after the source-keyed portrait refinement; includes failed-photo-to-next-species recovery. |
| Species route/filter inputs | All six detail routes, every individual facet, representative intersections/multi-select OR, both name fields, sort/history, keyboard focus, no-results/invalid values, no-JavaScript GET, pending results and live reduced-motion cleanup passed. |
| Responsive/visual review | Every detail and the explorer reflow at **320, 390 and 768px** without horizontal overflow; desktop/mobile screenshots reviewed at 1440/390px. Photos preserve full source proportions and captions remain outside the image. |
| Scientific preservation | No changes to `data/` or `public/` files in this stage. Export SHA-256 remains `36b87bf96cf579f6bcf5e9b97157573e897de62e65c7829bb9b3b460017d670c`. |

### Remaining evidence and device gaps

- All formal conservation assessment dates/latest-assessment metadata remain unverified. Displaying an authorized assessment date requires appropriate access and source verification; check dates are not substituted.
- Held tiger/orangutan numerical estimates and unknown global hawksbill/forest-elephant totals remain excluded. There is no verified historical species curve to display.
- No selected-species recording is cleared. Detail pages use cited sound descriptions and link to the independently credited NPS listening room with its separate species/location context.
- Region and habitat tags are broad curated navigation labels, not exhaustive ranges or evidence of absence. Any changed source description needs a mapping review.
- The hawksbill Commons direct rights reread failed; current search metadata repeats the public-domain dedication, and the already reviewed local acquisition/credit remains intact. No new rights or capture dates were invented.
- Chromium local checks do not certify physical device, Safari/Firefox or screen-reader behavior. A formal accessibility audit remains outstanding.

**Stop:** The Species Explorer and six detail pages are complete and locally verified. Continue only with the next explicitly requested stage.

## Previous stage: immersive soundscapes and audio interaction

## Completed: immersive soundscapes and audio interaction

- Built `/soundscapes` as a responsive editorial listening room with forest, mountain and coastal ocean studies. Each uses a separately credited NPS ambient clip and wildlife clip. Layer switches, mute, volume, a real clip-derived relative-amplitude waveform, accessible seek, keyboard/touch controls and text-only use are available. The scene blend is always labeled an **artistic composition of recordings from different places/times**, never a measured soundscape or population/acoustic trend.
- Acquired six NPS MP3 recordings from official item pages. The NPS Natural Sounds gallery and Yellowstone Sound Library explicitly declare their linked audio public domain and request NPS credit. `data/sources/audio-assets.json` contains item/rights links, creator, park, known or unknown capture date, acquisition date, original/local hashes and sizes, durations, transformations, and waveform method. Source bytes are in `data/raw/audio/`; public playback copies are in `public/audio/`. The 7.19 MB Yellowstone original was cut to a documented 45-second 64 kb/s MP3 (360,280 bytes); the other five public files preserve original bytes. Total playback files are approximately 0.83 MB, and only selected layers load after explicit Play.
- Added a single app-scoped Web Audio manager. It creates no `AudioContext`, media request or playback before a user gesture. Gain ramps handle layer/habitat crossfades and master mute/volume; stale fetches abort; decoded buffers are session-cached; sources disconnect on exit; route change and inactive tab halt playback. Hidden-tab pause preserves position and requires explicit Resume. Audio errors leave all source notes and species research readable. Reduced motion/data preferences suppress the live audio meter.
- The selected wildlife recordings are hermit thrush, ptarmigan and **humpback whale**. They are not snow leopard or blue whale recordings; Olympic surf is a **coastal surface** recording. Species sound research remains separately cited below the listening room. Unknown NPS capture dates are displayed as “Not reported.”
- Added [soundscape acquisition and interaction notes](development/soundscapes.md), a source-catalog entry, updated rights register, receipt/hash tests and browser interaction/error tests. No Howler dependency, hosting service or external audio API was needed.

### Exact local results (2026-10-09)

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed with no TypeScript errors. |
| `npm run build` | Passed; all 15 Next.js pages generated, `/soundscapes` statically prerendered. |
| `npm run test:local` | 83 passed: 43 Python data, 12 export contracts, 11 species, 17 foundation/media/audio. |
| `npx playwright test --config=playwright.production.config.ts` | 35 passed, including 4 soundscape browser cases plus existing route/homepage/motion/3D coverage. |
| Soundscape browser observations | No MP3 request before Play; two local layers requested after Play; cross-habitat loading, mute/volume/keyboard, hidden-tab pause, 390px reduced-motion controls, HTTP 503 written fallback, and active AudioContext closure on route exit passed. |
| Visual review | Desktop 1440px and mobile 390px screenshots reviewed; no horizontal overflow. Existing 320px route suite also passed. |

### Remaining evidence and device gaps

- None of the newly cleared clips supplies snow leopard, blue whale or other selected-species audio. A future item needs verified species identity, exact recording rights, location/setting, and any speed transformation disclosure before use. NOAA blue whale candidates are still held for item-level review. The NPS rockfall page/filename location conflict remains unresolved and that clip was excluded.
- Most NPS item pages do not state capture date. This is an archival metadata gap, not a reason to infer timing. Clip gain, amplitude bins and the analyser meter are uncalibrated and must not be used as ecological statistics.
- Physical mobile audio, Safari/Firefox decoding and screen-reader listening checks remain outstanding. Chromium local production checks establish functionality in the tested environment, not universal device support.
- The preceding optional WebGL stage is implemented in [immersive scene notes](development/immersive-scenes.md); its production browser cases passed in this suite. A late software-renderer DPR adjustment now typechecks and builds, but its earlier performance observation predates that adjustment. Physical GPU and fresh constrained-device measurements remain open.

**Stop:** This local audio stage is complete. Continue only with the next requested stage.

## Previous stage: homepage motion system

## Completed: homepage motion system

- Added a preference-aware client enhancement boundary around the complete server-rendered documentary. Scientific content stays visible before hydration, if the motion import fails, with JavaScript disabled, and in reduced-motion mode. All existing research contracts, source dates, captions and citations remain intact.
- Implemented GSAP / `@gsap/react` / ScrollTrigger with scoped `useGSAP`, `gsap.matchMedia`, context-safe event callbacks, reversible timelines and explicit cleanup. Resize rebuilding reverts the prior scope; image/font completion and native disclosure expansion refresh cached geometry. No React state updates occur during scrolling.
- Integrated one Lenis controller for fitting fine-pointer desktop viewports, driven by one GSAP ticker callback using a real millisecond clock. Scroll events synchronize ScrollTrigger; no second RAF controller, transformed root, scroller proxy, normalization, scroll snapping or forced horizontal travel was introduced. Touch/compact/short viewports keep native scrolling.
- Added opaque typography entrances, chapter rule entrance/exit timelines, opening landscape masking, restrained landscape parallax, and an explicit reversible whale listening aperture. The whale photograph's scale/crop stays fixed. All measurements, chart paths/points/bounds, body text and citations remain static; no numerical count-up, invented trajectory, acoustic inference or animated editorial waveform was added.
- Added one optional snow-leopard **image-panel-only** pin. It requires ≥1024×800, fine pointer, image fit and real adjacent evidence travel, capped at one viewport. Captions, credit links, controls, estimates and headings remain outside the pin; the spacer protects following copy. Unsuitable layouts omit it entirely.
- Added chapter location/progress with desktop controls in the ≥1280px outer gutter. Compact screens use a noninteractive 1px top-edge line and native chapter index/menu links. This avoids covering scientific descriptions, uncertainty, credits or footer controls. Native cursor link feedback has an equivalent keyboard state; no cursor replacement or pointer-coordinate tracking was added.
- Animated the fullscreen native dialog surface as one 160ms group; links, focus and background inertness remain immediately available. Escape/Close/navigation release focus immediately. A stationary header rule acknowledges route commits without a main-content overlay or delayed navigation. Modal observation suspends Lenis; hidden documents detach its owned ticker. Route exits destroy the controller and remove its pin spacers/classes.
- OS reduced motion or the user's reading preference immediately reverts optional work; reduced-data/lighter-media choices also disable the motion scope. Native keyboard/focus/hash/history actions cancel pending wheel motion and synchronize the current page bounds. Preference changes, resize and unmount remove listeners, observers, ticker callbacks, triggers, pending frames and obsolete async callbacks; unavailable enhancement controls restore chapter focus.
- Added [motion handoff](development/motion-system.md), two fit/token unit checks, eleven motion browser checks, six production review screenshots and a limited [frame observation](development/review/motion-frame-observation.json). README points to the new handoff. No new dependency versions, audio, 3D, backend, hosting or deployment were added.

### Exact final local results

All final commands used Node **24.21.0 / npm 11.19.0**, with the compatible local runtime prepended to PATH. The temporary official Node archive was recreated and checked against the publisher's SHA-256 list. No global runtime setting was changed. Development used `127.0.0.1:3000`; production browser tests owned port 3001. A separate temporary production server on port 3002 supplied review screenshots/profile and was stopped after review.

| Check | Final result |
| --- | --- |
| `npm run test:local` | **79 passed:** 43 Python + 12 export contracts + 11 species + 13 foundation/preferences/media/motion; TypeScript passed |
| `npm run test:browser` | **24 passed**, Chromium development; 2.2 minutes |
| `npm run test:browser:production` | **Build and all 24 browser checks passed**; browser suite 1.1 minutes |
| Production generation | All 15 framework pages generated; homepage remains prerendered |
| Inputs / lifecycle | Mouse wheel, Page Down during wheel momentum, Tab/Shift-Tab/Escape, anchor target focus, CDP native touch swipe, repeated OS preferences, live user preference, modal suspension, resize, route exit and Back/history restoration passed |
| Responsive reading | 1440, 1024, 768, 390 and 320px; no document horizontal overflow; gutter/non-obstruction check passed |
| Native fallback | All eight homepage chapters, photographs, citations, native table and chapter jump remain available without JavaScript; reduced mode removes masks, pins, Lenis and optional controls |
| Scientific preservation | All **45 pre-stage scientific data/media files unchanged byte-for-byte**; export SHA-256 remains `36b87bf96cf579f6bcf5e9b97157573e897de62e65c7829bb9b3b460017d670c` |
| Local performance observation | Warm production Chromium 156.0.8078.4, 1440×900, no CPU throttling: **55 active-scroll frame intervals**, median/p95/max approximately **16.7ms**, **0 intervals >33.3ms**, **0 observed long tasks**, no page errors in the review flow |

Intermediate checks exposed and fixed a reused whale-control ID, reduced-motion listener-order race, App Router history state for chapter links, restoration offsets from enhancement geometry, stale Lenis bounds during native focus, and an uncancelled wheel tween overriding Page Down. Visual review also moved the floating chapter bar out of scientific copy. One added chart test initially used the wrong selector and was corrected. A touch test now waits for native momentum to settle before tapping. Only the final complete passing suites above count as completion evidence. The runner's `NO_COLOR`/`FORCE_COLOR` notice is not an application failure.

### Remaining qualifications and source gaps

- Browser checks use Chromium viewport/input emulation. Physical touch devices, Safari/Firefox, screen-reader certification and a full accessibility audit are not verified here. The single host frame-cadence sample is not isolated JavaScript work, a sustained benchmark or a guarantee on mobile hardware; representative-device performance review remains appropriate.
- No cleared wildlife recording is available. Sound remains descriptive and silent; audio/3D implementation is outside this stage.
- Existing IUCN assessment-date/authorization gaps, held population estimates, unknown global totals, asset capture/context gaps and unavailable additional datasets remain as documented in research and prior-stage records. This stage acquired or inferred no new scientific data.

**Stop:** The homepage motion system is ready. This stage is complete; continue only with the next explicitly requested stage.

## Previous stage (2026-10-08): complete static homepage

- Implemented all eight chapters in the existing Next.js app: opening/editorial waveform, Himalayan landscape and snow leopard, ocean/blue whale, biodiversity index story, sound knowledge, six species, conservation field notes, and closing/exploration links. Oversized Archivo typography, natural-color photography, quiet reading margins and differentiated desktop/mobile compositions follow The Listening Margin blueprint. Native scrolling remains the complete experience.
- Added reusable server components under `src/features/homepage/` and scoped `src/styles/homepage.css`: chapters, apertures/credits, cited descriptions, evidence disclosure, historical measurement margins, annual index SVG/table, species register and conservation notes. Stable scene/chapter/audio hooks prepare later enhancement without starting those systems.
- Acquired seven individually reviewed photographs. Preserved actual JPEG acquisition bytes under `data/raw/media/`, generated responsive-ready WebP masters under `public/media/`, and added a separate Zod-validated `data/sources/homepage-assets.json` ledger. All original 28 data files match their pre-stage hashes; verified scientific data, reports, citations and old candidate flags were not overwritten.
- Photograph credits, license links, context and modification notes appear in figure captions, `/credits` and `public/media/README.md`. Wild Ladakh/Ranthambore images replace captive research candidates in this homepage. Camp Leakey's rehabilitation-site context and unknown individual history remain explicit; no portrait is represented as intervention-site evidence. Source-date/capture-date distinctions and conflicting exact dates remain documented.
- Rendered only the two permitted historical population measurements with complete geography, measurement periods, methods, uncertainty/gaps, source editions and dated references. Displayed the 2024 global LPI annual estimates and source bounds in a static chart with distinct visible bound outlines and a native table. Confidence level remains unknown; the 2026 report endpoints are a separate dataset. No occurrence-to-abundance conversion, interpolated species populations, mixed-edition curve or acoustic inference was added.
- Kept unavailable audio explicit. The waveform is labeled an original editorial motif. No audio/video/canvas, autoplay, active GSAP/Lenis/ScrollTrigger/Three.js integration, new backend or hosting work was added.
- Polished responsive navigation, including compact branding and desktop exploration links. JavaScript-free navigation remains native; inactive menu/preferences are hidden in that mode. Moved the automatic root loading boundary to reusable `src/components/page-loading.tsx` after verification found it could leave completed server content hidden without JavaScript. The whole documentary now arrives visibly; image frames reserve loading space.
- Created [static homepage handoff](development/static-homepage.md), offline media preparation script, three receipt/rights tests, seven homepage browser tests and production visual review screenshots in `docs/development/review/`. Updated README and About/Credits media statements. Browser artifacts now use separate development/production directories.

### Exact local results

Commands ran with the repository's compatible Node 24.21.0/npm 11 runtime prepended to PATH. Browser development checks reused the existing local server on `127.0.0.1:3000`; the production suite launched and stopped its own local server on port 3001. No external hosting or cloud services were used.

| Check | Result |
| --- | --- |
| `npm run typecheck` | Passed, no TypeScript errors |
| `npm run test:local` | 77 passed: 43 Python, 12 export contracts, 11 species, 11 foundation/preferences/media |
| `npm run test:browser` | 13 passed; all route/menu/reduced-motion checks plus complete static homepage coverage |
| `npm run test:browser:production` | Production build passed; 13 browser checks passed |
| Production build | All 15 framework pages generated; homepage prerendered |
| Homepage widths | 1440, 1024, 768, 390 and 320px; no document horizontal overflow; mobile-specific SVG and scrollable data table |
| Photographs | All 12 displayed instances loaded locally; seven asset credits present; no remote browser requests in the checked flows |
| JavaScript disabled | Begin anchor and native annual table work; all eight chapter sections visible; first image loaded; dead menu hidden |
| Media reproducibility | Reran offline conversion: all seven derivative hashes identical |
| Scientific preservation | All 28 pre-existing data files unchanged; export SHA-256 remains `36b87bf96cf579f6bcf5e9b97157573e897de62e65c7829bb9b3b460017d670c` |

The first JavaScript-free browser run exposed the loading-boundary issue, which was fixed and rechecked. A development trace teardown failed while suites shared the same output directory; separate artifact directories and a clean sequential development rerun passed. Intermediate interrupted runs are not counted as successful suites. The environment's `NO_COLOR`/`FORCE_COLOR` notice is a runner warning, not an application error.

### Remaining gaps and next-stage limits

- No wildlife recording is acquired/cleared; sound descriptions and unavailable states are intentional. Acquire exact recordings, permissions, identity, setting, capture metadata and playback-rate information before adding playback or recorded waveforms.
- Formal IUCN assessment dates/latest-assessment confirmation remain unverified. Held tiger/orangutan numerical estimates and unknown global hawksbill/forest-elephant totals remain excluded. Use authorization and original methods before expanding affected content.
- Four photographs use official Wikimedia thumbnail representations because original downloads were rate limited. Actual dimensions and bytes are recorded; small archive sources constrain large/retina scenes. Direct turtle/elephant Commons rereads returned 503; retain the existing item review, current licensing extracts and original elephant publication verification as described in the handoff.
- Photographs with exact capture-date conflicts display only the agreed year; unknown dates/locations and rehabilitation/tourism context stay explicit. No photograph proves an abundance, a soundscape or the outcome of a conservation project.
- Browser verification uses Chromium viewport emulation. Physical devices, Safari/Firefox, screen-reader certification and a full WCAG audit remain outside these checks. Existing lighter-media preference is an integration hook; bounded responsive images are the current default, without a preference-controlled download manager.
- Advanced scroll motion, audio and 3D are future tasks. Preserve native reading, visible limits, local assets and citations when adding them. Do not reintroduce a loading boundary that gates essential content on JavaScript.

**Stop:** The complete static homepage is ready. This stage is finished; no advanced interactive systems or deployment tasks were started.

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

Read the project rules, species research, `docs/data/`, all eleven `docs/design/` documents and [local foundation handoff](development/foundation.md) together. Use the implemented server-only access to `data/processed/biodiversity.json`; earlier species JSON is complete research with held values and must not provide UI numbers. Inspect existing files before future changes and update this status at every stage. Preserve dated evidence, independent report editions, mobile/reduced-motion reading and explicit unknown/media-unavailable states. The Next.js foundation and complete static homepage are implemented and verified. Read [the static homepage handoff](development/static-homepage.md) and the new media ledger before changes. Advanced motion, audio, 3D and richer subpage interactions require a subsequent task. Evidence/rights review remains necessary for affected content.
