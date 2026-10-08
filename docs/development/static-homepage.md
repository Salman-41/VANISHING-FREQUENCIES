# Static homepage handoff

**Stage: complete static documentary · 2026-10-08 · local development.**

Read the project rules, scientific review, data methodology, creative direction and page blueprints before modifying this implementation. The repository root is the project; do not create a nested replacement app.

## The implemented reading experience

| Chapter | Static composition | Evidence and limits |
| --- | --- | --- |
| 00 | Oversized two-line title, narrow mountain aperture, original fixed sound motif, asymmetric introduction and chapter index | Editorial premise explicitly distinguished from a global acoustic measurement; motif is not recorded audio |
| 01 | Full landscape, inset wild snow leopard encounter, offset reading copy and historical estimate margin | Nepal landscape and Ladakh portrait are separate from India's 2019–2023 survey estimate; geography, method, uncertainty gap, publication and citation remain visible |
| 02 | Large ocean photograph, sound-knowledge margin and a separate historical stock spread | Eastern North Pacific, 2015–2018, CV and photographic mark-recapture method; neither photograph nor estimate establishes current global abundance |
| 03 | Server-rendered annual SVG plot, uncertainty envelope, visible interpretation and native data disclosure | 2024 global estimates only; source interval confidence level unknown; 2026 endpoint dataset discussed separately and linked to the Observatory |
| 04 | Forest photograph and communication record, explicit unavailable audio state, three-part listening note | No fake Play control, invented recording or sonification; missing audio is not evidence of silence |
| 05 | Six editorial rows: identity/status, photograph, ecological role and threats | Public category summaries with dated source links; formal assessment dates unverified; population figures on hold remain excluded |
| 06 | Forest-colored field-note register with geography, action, outcome and inference limit in adjacent columns | Tost corral intervention, Nepal programme and Arnavon nesting recovery; no generic portrait misrepresented as a project-site photograph |
| 07 | Oversized closing message, returning mountain aperture, exploration links and colophon | Editorial message; evidence and image rights accessible through Sources and Credits |

Desktop spreads become two-column tablet layouts and sequential mobile reading. Heading and evidence height follows content. There are no fixed-height text containers, scroll traps, pinning, entrance opacity gates, autoplay or canvas scenes. Scoped `src/styles/homepage.css` extends existing tokens without replacing the subpage layouts.

## Components and data boundaries

- `src/app/page.tsx`: server composition of all eight chapters.
- `src/features/homepage/primitives.tsx`: Chapter, MediaFigure, TextLink, CitedText, Evidence, HistoricalEstimate and WaveformMotif.
- `index-chart.tsx`: validated single-edition SVG coordinates using server-side D3 scales; separate mobile plot geometry and a native HTML table of all published annual values and bounds. Straight segments connect annual index estimates for readability; no new records or species populations are produced.
- `species-rows.tsx` and `conservation-notes.tsx`: reusable editorial registers selected from the validated processed export.
- `media-contract.ts` / `media.ts`: Zod-reviewed local acquisition ledger and server-only asset access. The ledger is separate from the immutable research snapshot, whose old candidates remain unchanged.
- Header supports compact two-line branding, desktop exploration links, native fullscreen menu and JavaScript-free navigation. Existing keyboard focus/Escape behavior is retained.
- Essential reading does not depend on JavaScript. The automatic root `loading.tsx` boundary was moved to `src/components/page-loading.tsx`: testing found that the streamed replacement could remain hidden without JavaScript. The shared loading component is reserved for optional deferred widgets. Do not reintroduce an automatic Suspense boundary around the documentary. Image dimensions/aspect ratios and calm background apertures reserve space while photographs load; no artificial waiting screen is required for local prerendered content.

All factual content reads through the existing server-only loader, joint Zod validator and matching successful report/hash check. No research JSON is passed to client preferences or fetched from a remote API. Population measurements keep all required date, scope, units, method, uncertainty and source-edition context. Exceptions fail into the existing error boundary, never into invented substitute facts.

## Photography and acquisition

Seven actual photographs are retained locally, with creator, item/source URL, commercial permission, license, setting, capture-date gaps, acquired representation, original acquired-byte hash, derivative hash and modification notes in `data/sources/homepage-assets.json`.

- Himalayan landscape: Konstantin Viktorov, Everest/Nuptse panorama, CC BY-SA 3.0.
- Wild snow leopard in Ladakh: T. R. Shankar Raman, CC BY-SA 4.0.
- Blue whale: NOAA Fisheries / Lisa Conger, U.S. federal-work public domain; capture date/location and stock identity unverified.
- Ranthambore tiger: Psoham87, CC BY-SA 4.0; safari setting retained, not Nepal intervention evidence.
- Bornean orangutan: Rezky Putri Harisanti, CC BY-SA 4.0; Camp Leakey rehabilitation-site context disclosed, individual release/wild history unverified.
- Hawksbill: Colin Johnson / Cmjohns6, author public-domain dedication; source color adjustment disclosed, British Virgin Islands rather than Arnavon.
- Forest elephant: Thomas Breuer, CC BY 2.5, with Gross (2007), PLOS Biology article/figure attribution; source corrections by Lycaon disclosed.

Item licenses were reviewed with the completed research and current primary item pages where accessible. The forest-elephant source article's copyright statement and photograph credit were verified directly. Direct Commons rereads for the turtle/elephant returned 503; existing reviewed item records were corroborated by current Commons search extracts (including turtle licensing) and the elephant's original PLOS publication. No inaccessible page was treated as newly page-read.

Original Wikimedia downloads were rate limited for four items. Official Wikimedia thumbnail representations were acquired instead, and are labeled as such. The annotated Everest panorama first inspected was rejected visually and is not shipped. No generated wildlife, retouching, generative enlargement or composite scene was added. Conflicting exact dates for the sunset panorama/turtle are not displayed as precise capture dates: the agreed year is retained, with the conflict in Credits. Unknown blue whale/elephant capture dates remain unknown.

Acquired JPEG bytes are in `data/raw/media/`; optimized WebP derivatives in `public/media/`. The seven derivatives total **1,422,982 bytes**, range **89,288–358,510 bytes**, and have maximum width **1600px** without enlargement. Next Image supplies responsive local variants and native lazy loading for noncritical photographs. Only the opening landscape is preloaded. The small archive sources constrain large/retina image quality; acquire better compatible originals before enlarging their roles.

Credits and every figure caption link to the applicable source/license and modifications. `public/media/README.md` retains attribution with the distributable derivatives; `data/raw/media/README.md` points to the ledger. Adapted CC BY-SA photographs retain their individual source licenses. The LPI figure/data adaptation is credited to ZSL/WWF and Our World in Data and labeled CC BY-SA 4.0. This does not assert one license for the entire application.

### Reproduce derivatives offline

With the repository's Node 24.21.0 runtime and installed lockfile dependencies:

```bash
node scripts/data/prepare-homepage-media.mjs
npm run test:foundation
```

The script uses the installed Sharp 0.35.5, checks each acquired source hash and clearance before conversion, writes WebP derivatives, and records dimensions, byte sizes and SHA-256 hashes. It makes no network requests and never writes scientific inputs or processed biodiversity records. Changing sources or rights requires a new review, not simply rerunning this script.

## Future integration points

| Hook | Intended optional enhancement | Required fallback |
| --- | --- | --- |
| `data-chapter` / stable chapter IDs | Scoped GSAP/ScrollTrigger timelines | Entire chapter visible and readable before registration and after cleanup |
| `data-scene="static"` | Lenis/scene policy boundary | Native document scrolling, anchors and keyboard navigation remain functional |
| `data-scene-layer="photograph"` | Optional aperture motion or separately approved 3D layer | Real licensed photograph, caption and all evidence remain in the DOM |
| `data-scene-layer="editorial-motif"` | Future cleared clip-derived waveform | Current fixed drawing retains its editorial label; never imply population/acoustic measurement |
| `data-audio-slot="unavailable"` | Future permission-gated player | Descriptions and explicit unavailable state; no invented fallback recording |
| `data-chart="lpi-2024-world"` | Future keyboard-accessible annual-value inspection | Static plot and native table; no mixed editions or reconstructed annual observations |

No GSAP, ScrollTrigger, Lenis, Three.js, R3F, Web Audio runtime or new backend is activated. Reduced-motion reading is the same complete static document. The existing lighter-media preference is retained as an integration policy; this stage uses bounded responsive images by default and does not implement a preference-controlled media download manager.

## Verification scope

User story: local homepage request → validated scientific bundle and reviewed media ledger → server-rendered chapters, image optimizer and citations → reading, chapter links, source disclosures, menu and exploration routes.

- Local checks cover Python processing, TypeScript scientific contracts, species restrictions, research loader, preferences, receipt hashes/dimensions and rights gates.
- Chromium browser checks cover all routes, menu focus/Escape, reduced motion, 320px reflow, five homepage widths, complete local image loading, source context and native JavaScript-free documentary reading.
- Browser development and production traces use separate output directories to avoid artifact collisions. Run them sequentially for a reproducible local review.
- Visual review covered all chapters at 1440px and 390px; opening/tablet/narrow screens at 768px and 320px. Production opening screenshots are retained in `docs/development/review/`.
- These are Chromium desktop emulations, not physical-device, Safari/Firefox, screen-reader certification or full WCAG audits. No advanced motion/audio/GPU behavior was implemented or tested.

See `docs/STATUS.md` for exact final command results and remaining evidence gaps. This stage stops at the completed static homepage.
