# Page blueprints and implementation plan

**System v1 · 2026-10-08 · planned local routes, no application code.** Preserve [The Listening Margin](creative-direction.md), all three [signature interactions](signature-interactions.md), and the [eight-chapter storyboard](narrative-storyboard.md). This stage specifies eight page types; the existing homepage remains the complete documentary rather than being replaced by a directory landing page.

## Routes and shared shell

| Page type | Planned local route | Primary task |
| --- | --- | --- |
| Homepage | `/` | Follow chapters 00–07 |
| Species Explorer | `/species` | Find one of the six selected species |
| Species detail | `/species/[slug]` | Read a species' evidence, ecology and intervention |
| Soundscapes | `/soundscapes` | Explore descriptions and cleared recordings |
| Data Observatory | `/data` | Inspect published LPI values and limitations |
| About | `/about` | Understand the documentary, editorial premise and methods |
| Sources | `/sources` | Trace a claim to an original reference |
| Credits | `/credits` | Read actual contributor/asset/license attribution |

Valid species slugs equal reviewed IDs: `snow-leopard`, `blue-whale`, `tiger`, `bornean-orangutan`, `hawksbill-turtle`, `african-forest-elephant`. One detail template covers all six. Red panda/Asian elephant are research reserves, not public detail routes in v1. No broad “orangutan” or combined “African elephant” slug aliases with ambiguous data.

Shell: skip link → header → breadcrumb where useful → main → footer. Desktop 12 columns, compact 4, tablet 8; exact sizes in [responsive specifications](responsive-specifications.md). Default wide content 1320 px at 1440, compact 350 at 390. Page intro typically has top padding 64 desktop/48 compact. Coordinates refer to main flow beneath the actual header; no fixed-height reading containers. Primary names below correspond to [component system](component-system.md).

Fullscreen navigation has two groups: Explore (eight page destinations), Documentary chapters (eight homepage anchors). On homepage Chapters opens chapters first; elsewhere Explore opens page destinations first. Route changes pause recordings, cancel pending media starts, close overlays and move focus to the new main heading; preserve browser back/forward behavior. Returning to a query restores filters/selection, not playback intent. Native links/forms remain meaningful without enhancement.

## 1. Homepage

**Purpose:** the original cinematic document with precise evidence margins. Single H1 is the opening tagline; chapter titles are H2. Main anchors: `opening`, `snow-leopard`, `blue-whale`, `trends`, `soundscapes`, `species-at-risk`, `conservation`, `closing`. Keep section order and narrative copy from the original storyboard. Subpages offer deeper inspection without requiring departure from the documentary.

| Major section | Desktop/Wide implementation layout | Compact/mobile behavior |
| --- | --- | --- |
| 00 Opening | Opening 144 px type at c1–10, top 96; aperture full width at about 424; intro c1–5, Begin/optional sound c9–12 | 56 px title; 350 × 140 still; intro then controls. No pin/audio gate. |
| 01 Mountain | Heading c1–7; 872 × 560 scene c1–8; identity/718 estimate/coexistence c9–12 | Identity,350 × 240 scene/caption, India-context estimate and evidence; natural flow. |
| 02 Ocean | Full1320 × 544 Listening Aperture; metadata below; historical ENP note c1–5 and recording context c8–12 | 350 × 240 full frame, context/player then stock note; no drag/sonar effect. |
| 03 Trends | 872 × 400 chart c1–8 + evidence c9–12; edition controls and table | 350 × 260 chart with stacked controls/evidence/table. No 2026 annual curve. |
| 04 Listening | Habitat c1–3,984 × 420 scene c4–12, record/context beneath | Select,350 × 220 scene, descriptions/player/context; missing recording visible. |
| 05 Species | Six editorial rows, name/status c1–4, portrait c5–8, claims c9–12 | Six vertical spreads; all status qualifications retained. |
| 06 Conservation | Forest surface, three featured notes with 648 × 420 image c1–6 and note c8–12; other three notes below | All action/result/limit passages in flow, optional site image, static left rule. |
| 07 Closing | Display c1–10; full-width 160 px still; prose c1–5, exploration links c8–12 | Still 140 px high, prose/links/credits stacked. No replay autoplay. |

Interactions: bounded chapter 00/01 scenic scroll only when fit/cleared/motion enabled; all other sections natural flow. “Explore species,” “Open Data Observatory,” “Visit Soundscapes,” Sources and Credits are ordinary links after the relevant chapter; no extra marketing sections. Each cited homepage fact links to the shared source reference and exact locator. “See conservation story” first targets the matching local field note, with an optional detail-page link.

**Evidence/asset binding:** validated `indexObservations`, `speciesFoundation`, `successStories`, `citations`, rights and cleared-media ledger; M01–M10/A01–A08 briefs. Current state has zero cleared wildlife assets. Render typographic scenes/sound descriptions with clear availability notes; do not populate a finished-looking fake media library. Unknown dates and held estimates remain unavailable. Initial transfer ≤1.2 MB, initial JS ≤200 KB gzip and selected data ≤80 KB gzip remain future targets; do not load the whole provenance bundle into the opening.

## 2. Species Explorer

**Purpose/H1:** “Six lives. Different pressures.” Label the collection as this documentary's selection, not all endangered wildlife. Default narrative order: snow leopard, blue whale, tiger, Bornean orangutan, hawksbill, forest elephant. Result count describes records in this collection.

| Major section | Desktop/Wide | Compact/mobile |
| --- | --- | --- |
| Intro | Page display 80 px at c1–8; selection scope c9–12 | 40 px H1, scope paragraph below |
| Search/filter | At1440, search c1–4, habitat c5–7, category c8–10, Apply/Clear c11–12; labels above | Single column,48 px controls; filter groups visible in flow, Apply/Clear wrap |
| Results summary | One line below form, count and chosen filter labels; sort control alongside | Count/filters then native Sort select; no terse icon chips |
| Six editorial records | Reuse SpeciesCard; name/status c1–4, image c5–8, claim/actions c9–12 | Name/status, portrait if cleared, role/threat/source, detail link |
| End note | Limits of selection, link to About and Sources | Same note in one column |

Form plan: query `q`, habitat group, category group, sort `narrative|name`. Search literally matches common/scientific names, case-insensitively; no AI-generated answer. OR inside a multi-select group, AND between groups. Curated habitat tags derive from reviewed descriptions: mountain=snow leopard; open ocean=blue whale; forest=tiger/Bornean/forest elephant; grassland=tiger; reef/coast=hawksbill. These are broad navigation tags, not range polygons or exclusive habitat claims. Status filters use the public summaries with their shared qualification. Do not sort by headcount, decline rate or severity score.

Search/Apply commits the selection and URL; Clear removes filters. Preserve text/focus, announce committed count politely. Zero results shows chosen filters and Clear, not “No wildlife remains.” No pagination/virtualization for six records. Detail links are descriptive; cards do not auto-play sounds. Media missing does not remove a species. Use all six descriptions/status references, with no held raw statistics. No numeric comparison panel or occurrence map is planned.

## 3. Species detail

**Purpose/H1:** common species name plus real italic scientific name; one reusable template. The title could be 64 px wide/36 compact, with an editorial chapter heading optional below, never substituting for identity.

| Major section | Desktop/Wide | Compact/mobile |
| --- | --- | --- |
| Breadcrumb/hero | Breadcrumb above; identity/status c1–5, scene c6–12 around 760 × 480 at 1440 | Breadcrumb/identity/status,350 × 240 media/caption |
| Quick section index | Habitat, Population evidence, Sound, Conservation, Sources; in-flow or fitting c1–3 sidebar | Wrapping anchor list below hero; no fixed tabs |
| Habitat/ecology/threats | Reading c4–10, source/context c11–12 when usable; otherwise 8+4 grid | Named sections and sources directly after paragraphs |
| Population evidence | Eligible Measurement module plus scoped TrendNote; sources beside/underneath | Full sentence and 48 px estimate if eligible; qualifiers remain visible |
| Sound | Small Aperture/RecordingPlayer only if cleared; known sound text/source independent | Scene/description, controls when available, context below |
| Conservation | FieldNote bound to this species' story, action/result/limit visible | All three passages, optional cleared site image |
| Evidence/related navigation | References, gaps and next/previous selection links | Same content; link labels include species names |

Population-specific branches: snow leopard uses `snow-india-spai` (India 2019–2023 estimate, release 2024, absent numerical uncertainty in inspected release); blue whale uses `blue-enp-2018` (ENP 2015–2018,2023 assessment revised 2024, CV0.085 and unknown stock trend). Exact numbers and dates come from records with their references. The other four show “No verified population estimate available in this documentary,” qualitative trends if documented, and evidence gaps. No historical population chart is created from isolated estimates.

All formal assessment dates remain unverified and cannot display the verification date as an assessment year. Taxonomy is a disclosure/definition list, not a substitute source of population evidence. References point to `/sources#citation-id` and the primary publication. A related recording link can preselect its verified species/context in Soundscapes but never autoplay. An unmatched slug receives a useful unavailable page with Explorer link; no fabricated record or loosely matched taxonomy.

## 4. Soundscapes

**Purpose/H1:** “A place has more than one voice.” This is a situated recording library with readable descriptions. Default selection can be Open ocean, with no autoplay. Availability is determined by the future cleared ledger, not by the existence of a candidate URL.

| Major section | Desktop/Wide | Compact/mobile |
| --- | --- | --- |
| Intro | Page display c1–8, recording-vs-measurement context c9–12 | 40 px H1 and premise below |
| Habitat selection | c1–3 vertical mountain/ocean/Borneo/African forest/reef controls | Native select or wrapping named radios; 44 px targets |
| Scene/listening aperture | c4–12,984 × 420 reserve; identity and context outside masks | 350 × 220 full scene, no masking animation |
| Recording index/player | Records c4–8; metadata/source/description c9–12 | Named records followed by one player and all context |
| Listening limitations | Full-width note on rate/context/archive access, link to Sources/Credits | Same text; no technical archive widgets |

Selecting habitat/record stops the prior track and updates context, then waits for Play. Query may identify `habitat`, `species`, or a cleared `recording` ID; invalid/uncleared IDs show unavailable and a useful description. Descriptions remain before Play. Display source capture date or explicit unknown, creator, wild/captive setting, geography, duration, source rate, changes/license. Atlantic whale recording is not ENP stock audio; accelerated alternate is labeled. Reef ambience is not a hawksbill call. Do not mix recordings into an implied shared encounter or reconstruct past/future sound.

Current state has no playable entries. Show each relevant cited sound description and a no-cleared-recording state; no fake waveform, disabled library full of enticing Play icons, archive embed, or fabricated acoustic richness count. Later only current clip is decoded; descriptions and context survive network/decoder failure. No microphone permission or real-time FFT is required.

## 5. Data Observatory

**Purpose/H1:** “Read the change. Keep the context.” This page expands the chapter 03 view with the same validated records, scales, source notes and table. Page title 80/40 px; avoid dashboard-style KPI cards.

| Major section | Desktop/Wide | Compact/mobile |
| --- | --- | --- |
| Intro/interpretation | Title c1–8, complete LPI caveat c9–12 | Heading and interpretation stacked before controls |
| Edition and scope form | Radios for 2024 annual/2026 endpoints; series or group controls underneath | Radios wrap with full names; native series select |
| Annual view | 872 × 400 plot c1–8, estimate/bounds/scope/source c9–12 | 350 × 260 plot plus range/Previous/Next controls and evidence |
| Endpoint view | Direct labeled signed-change rows c1–8; source/interval gap c9–12 | Wrapping labels/values on shared scale, source below |
| Table | Selected-series semantic table below view; data precision preserved | Same table in its own labeled scroll region where necessary |
| Methods/access note | Coverage, missing annual products, original units/attribution and Sources link | Full written note; no hidden methodology modal |

Default `dataset=lpi-2024-owid`, `series=lpi-2024-owid-world`, year 2020. Select one annual series: global, five regions or freshwater. 1970=1 baseline,1970–2020 period, source bounds with unverified interval level. Use all annual published points with no smoothing/interpolation; inspect actual years only. Scope/title/values/bounds/source update as one selection. Pointer preview never changes URL; committed selection may use replace history, explicit edition/group changes preserve navigable history.

2026 mode binds `lpi-2026-endpoints`, period 1970–2022, Global/Regions/Ecosystems groups. No year slider; no annual curve. Announced endpoint percentages are index changes, with no supplied bounds. The regional and ecosystem views are not rankings of absolute biodiversity abundance. Never compute a between-edition delta or extend a2024 curve to 2022. Invalid requested 2026 year is removed/explained rather than reconstructed.

Attribution/edition/version/measurement period and source links travel with every view. Prefer an in-page table to downloads; any later optional export requires rights/citation review and contains only permitted selected records with provenance. Restricted underlying LPD/IUCN/BirdLife records are excluded. Missing dataset shows available view and reason; never dummy data or a zero line. This page is silent; data is not sonified.

## 6. About

**Purpose/H1:** “A documentary about attention.” Explain the original project, editorial premise, species selection and scientific limits without fabricated team biographies or institutional endorsement.

| Major section | Desktop/Wide | Compact/mobile |
| --- | --- | --- |
| Intro | 80 px H1 c1–8, tagline/editorial qualifier c9–12 | 40 px H1, qualifier under lead |
| Why listening | Prose c3–9 max 62ch; optional existing cleared landscape full width | Prose in full column; no required image |
| What is measured | Definition-style rows for LPI, species estimates and recordings | One term/value pair at a time, source link after explanation |
| How species were chosen | Selection rationale c1–8, six named detail links c9–12 | Rationale, list, geographic/taxonomic coverage limit |
| Method/review/access | Source dates, human-review scope, evidence gaps and permitted-use boundaries | Same full reading path; disclosures only for supplemental detail |
| Preferences/exploration | Accessible Preferences panel plus links to Data/Sources/Credits | Full-width controls and links |

Copy states this is an original documentary, its desk review is not independent scientific certification, and six selected species are not a representative global sample. The tagline does not establish a global acoustic trend. Methods derive from existing research/pipeline docs; no new ecological claim is introduced by layout. Use actual verification date with its proper label. No named staff, partners, awards or endorsement logos are invented. Sources and Credits have distinct roles; About links to both.

## 7. Sources

**Purpose/H1:** “Follow the evidence.” A readable reference register that reaches every displayed factual claim. Scientific references are separate from media credits but cross-linked where helpful.

| Major section | Desktop/Wide | Compact/mobile |
| --- | --- | --- |
| Intro | 80 px H1 c1–8; citation/permission distinction c9–12 | 40 px H1, scope/reuse note below |
| Find/filter | Search title/publisher/ID, group selector, Apply/Clear on one wrapping row | Labeled stacked fields/controls |
| Reference records | Title/publisher c1–4; dates/coverage/locator/uses/reuse/limits c5–12; divider rows | Each full reference as one vertical record |
| Dataset/rights notes | Edition-specific result licenses and versions, source/provenance path descriptions | Definition list; no dense legal microtype |
| Outstanding access | Explicit evidence/access gaps and original reading leads where needed | Normal text, accessible labels “Unverified lead”; no statistic backed by them |

Primary populated register uses the bundle's36 referenced page-read citations. Preserve exact citation ID as anchor, title, authors/publisher, source publication date/year when known, accessed date, locators and limitations. Source-link label names the publication rather than “click here.” A source-detail disclosure can expand use examples and exact locators. Deep link auto-expands supplemental details but leaves the record heading/source identity available without JavaScript.

Curatorial grouping may be Index, Species, Conservation, Sound knowledge, Rights/methods; source entries with multiple roles retain one stable anchor and can appear in search groups without duplicate IDs. A reference/source-use map should be derived from existing claim references later, not hand-typed unrelated claims. Old search-only/inaccessible research leads are labeled separately if shown and cannot support displayed statistics. “Verified page read” is access/review status, not a guarantee of scientific truth or a reuse license.

Do not expose secrets, tokens or restricted datasets; no access request form is added. Separate published LPI licensing from report artwork and underlying LPD terms. Formal species assessment metadata remains a blocker, not a downloadable hidden record. All citation/source dates wrap on mobile; no truncated author list or rights text. No remotely embedded PDFs are required.

## 8. Credits

**Purpose/H1:** “The work behind each frame.” Credit only actual contributors and cleared assets. Keep scientific citations accessible through Sources and match asset credits to the visible media/player.

| Major section | Desktop/Wide | Compact/mobile |
| --- | --- | --- |
| Intro | 80 px H1 c1–8, credit/rights note c9–12 | 40 px H1 and note |
| Project contributors | Role c1–3, actual name/detail c4–10 | Role then actual contributor; no invented staffing |
| Photography/recordings | Asset title c1–4, creator/source/license/changes/context c5–12 | Full asset record with small optional cleared thumbnail |
| Typography/graphics | Family/authors/license and original editorial graphics | Same readable list |
| Data attribution | Publisher/curator credit, edition, rights and Sources links | Full labeled rows; no logos required |
| License summaries | Short summary plus actual license/evidence links | Same content, no collapsed essential attribution |

Current media state: “No wildlife media has been acquired or cleared for use.” Candidate credits must not appear as used assets. Later each used asset ID gets a stable credit anchor; include creator, original item URL, exact license/version, required attribution, alterations, wild/captive/context and capture-date gap. Item-level credit beside the scene/player links here; Credits is not a substitute for local notice when the license requires it.

Archivo credit/official license links are present when actually distributed; before acquisition label it “Planned typography” rather than claiming a bundled file. Original graphics can be credited as project-created only when created. Human roles/name data await actual contributor information; omit an empty section rather than add placeholder biographies. Data attribution derives from recorded rights/citations and retains ZSL/WWF/OWID editions and share-alike obligations. No blanket public-domain statement for all NOAA-hosted media or one site-wide license inferred.

## Reusable data boundary and planned construction order

Future implementation uses [the validated bundle](../../data/processed/biodiversity.json) and [Zod contracts](../../data/schemas/biodiversity.schema.ts). Shared source resolution powers Measurement, Claim, TrendNote, Status, IndexChart, FieldNote and Sources. Do not read the earlier full species research file for UI numbers because it includes four held values. A selector returns the record and all required context/references; it must not strip dates/uncertainty to meet a layout.

Cleared media comes from a separately reviewed ledger compatible with existing asset metadata. Scientific population numbers, media availability and filter-result counts have different meanings. No UI query changes the scientific record. Small page-specific slices retain provenance; keep raw hash/record details in the pipeline artifact while carrying essential displayed citation/version metadata into the page.

Planned construction sequence after an authorized implementation task:

1. Translate tokens and shell into reusable styles, navigation/preferences and feedback; keep the existing research/data pipeline intact.
2. Implement source resolution and evidence modules, Sources and Credits; exercise dated/unknown/held/unavailable states before adding effects.
3. Implement Explorer and the six detail routes from one template with static factual content and progressive filter enhancement.
4. Build Data Observatory with semantic table first, then SVG and exact-record controls; retain separate edition behavior.
5. Build Soundscapes descriptions/availability first, then the one-player client interaction for genuinely cleared media.
6. Compose homepage chapters from those modules; add bounded scene enhancements and the field-note bracket last. Build About from existing editorial/methodology records.
7. Review keyboard/reflow, reader/rights correctness, actual media and performance under documented profiles; update status with real results. Native reading/source access precedes optional motion.

Future Next.js 16/React 19/TypeScript/Tailwind 4 may use server-rendered factual modules and small client interactions for filters/player/chart/menu; this is an architecture plan, not scaffolding. GSAP/ScrollTrigger/Lenis, Three.js/R3F/Drei, Web Audio and D3 retain their existing approved roles; the core plan requires no 3D scene. No package installation, frontend project generation, hosting/deployment, domains or cloud work is included in this stage.
