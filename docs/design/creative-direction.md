# VANISHING FREQUENCIES — creative direction

**Blueprint v1 · 2026-10-08 · Local development handoff only**  
**Tagline: The World Is Getting Quieter.**

## The Listening Margin

Build the documentary like a field recording with its margins left visible. A narrow horizontal opening offers a glimpse of a place. The visitor opens the frame, encounters an animal, and finds the recording context and scientific evidence beside it. Large areas of obsidian give the image room; an ivory line carries the eye between landscape, listening, and evidence. The margin is where we explain what is known, where it was measured, and what remains unknown.

The emotional movement is **attention → encounter → understanding → agency → continued curiosity**. Begin with an invitation to notice, introduce the snow leopard and blue whale, widen to measured biodiversity change, allow voluntary listening, meet the other selected species, then examine specific conservation outcomes. End with ways to keep exploring the evidence. The audience should leave remembering a place, an animal, and the distinction between a compelling story and a measured result.

Originality comes from this consistent relationship between an expansive scene and its precise documentary margin. The opening slit, the recording frame, chart annotation, and conservation field note share one horizontal alignment. Their shapes can rhyme; their meanings remain explicit. A waveform is never morphed into a population curve. No page from an existing design showcase is a visual reference for this direction.

## Documentary position

- Treat the tagline as an editorial premise. The acquired datasets do not measure a worldwide decline in acoustic activity. Introductory copy must make that distinction available before any listening interaction.
- Show living animals within habitats, including ordinary behavior and the work of people sharing those places. Do not frame communities as obstacles or assign a single organization credit for a multi-party recovery.
- Leave observations and limits in the main reading path. Uncertainty deserves readable typography and space beside the number.
- Write short, concrete sentences. Name the place before stating a result. Use “estimated,” “reported,” “local,” and “historical” when the evidence requires them.
- No countdown to extinction, fabricated loss ticker, disappearing animal icons, implied acoustic baseline, or fading calls proportional to an LPI value. No donation funnel, partner-logo wall, generic card grid, or achievement badges.
- Photographs and recordings remain documentary assets. Do not use generated animals, invented field recordings, or composites as evidence of a real encounter. Abstract interface marks may be authored and identified as editorial graphics.

## Narrative spine and working copy

Headings below are original editorial copy, not claims or quotations from scientists. Supporting facts must resolve to the existing citation records.

| Chapter | Working heading | Narrative job | Transition |
| --- | --- | --- | --- |
| 00 · Opening | **The World Is / Getting Quieter.** | Invite attention; offer an equally complete experience without audio. | The narrow image aperture opens onto a mountain. |
| 01 · Snow leopard | **A life within / the mountain.** | Establish an individual species, its place, and the limits of a national estimate. | The mountain frame leaves; an ocean frame enters with a clean cut. |
| 02 · Blue whale | **An ocean / worth listening to.** | Separate the animal's voice, recording provenance, and a historical stock estimate. | The listening playhead stops; a separately labeled chart begins. |
| 03 · Measured trends | **Read the change. / Keep the context.** | Explain the LPI and let readers inspect published results with their bounds. | Chart space becomes a quiet divider, then the listening library. |
| 04 · Soundscapes | **A place has / more than one voice.** | Explore recordings as situated documents, with descriptions and rights. | Recording credits lead into species names. |
| 05 · Species at risk | **Six lives. / Different pressures.** | Give each selected species a specific ecology, threat, and evidence limit. | The final threat paragraph links to a documented action. |
| 06 · Recoveries and interventions | **What changed / in one place.** | Show local recovery and practical interventions with their inference limits. | Close each field note; leave the margin open for further reading. |
| 07 · Closing | **Keep listening. / Keep looking.** | Return attention to the world and to original sources. | A still image aperture, source links, credits; no automatic restart. |

“Six” describes this editorial selection, not a representative sample of biodiversity. Five selected mammals and one reptile cannot stand in for all taxa.

## Experience structure

One continuous document, with eight stable chapter anchors and a compact chapter menu. The opening has a single invitation, “Begin,” plus explicit sound controls when a cleared recording exists. The menu lists every chapter by number and name; it is accessible from the outset. Scrolling, chapter navigation, reading sources, and completing the narrative never depend on playing media or finishing an animation.

The shared margin contains chapter number, place or dataset scope, and a source/recording link. A persistent sound button says “Sound off,” “Sound on,” or “Paused”; a separate preference control provides reduced motion and lighter media. Menu, audio, and preference controls have real labels. Do not use an unexplained hamburger, headphone icon, custom cursor, or volume-reactive navigation.

Use a normal document with progressive enhancement. Desktop can use brief sticky images; mobile is a vertical editorial essay with inline media. With JavaScript unavailable, retain headings, facts, image captions, data tables, source links, and credits. “Read without motion” produces the same information and reading order. Sound remains opt-in and playback begins only from an explicit play action.

## Evidence contract for the design

Read [project rules](../PROJECT_RULES.md), [species selection](../research/species-selection.md), [scientific review](../research/scientific-review.md), [data limitations](../research/data-limitations.md), [data dictionary](../data/data-dictionary.md), and [methodology](../data/methodology.md) together. The processing-stage verification supersedes older inventory notes about whether the 2026 announcement was verified; the full 2026 annual dataset and methodology are still outstanding.

The future application consumes [the validated bundle](../../data/processed/biodiversity.json) through [its contract](../../data/schemas/biodiversity.schema.ts). The earlier species research file contains held values and must not become an alternate statistics feed.

| Available evidence | Design use | Visible qualification |
| --- | --- | --- |
| LPR 2024 annual published indices, 1970–2020 | Global chart; region selector; freshwater view | 1970=1; monitored vertebrates; edition; source bounds with unverified confidence level |
| LPR 2026 announcement endpoints, 1970–2022 | Separate summary view with global, regional, and ecosystem comparisons | Announcement-derived endpoint change; no annual curve or supplied intervals |
| India snow leopard estimate, `snow-india-spai` | One contextual estimate in chapter 01 | Estimated individuals; India; survey 2019–2023; release 2024; interval absent from inspected release |
| ENP blue whale estimate, `blue-enp-2018` | One contextual estimate in chapter 02 | Historical stock estimate; 2015–2018 data; 2023 assessment revised 2024; CV 0.085; current stock trend unknown |
| Public conservation summaries | Full category words beside each species | Public summary; checked 2026-10-08; formal assessment date unverified |
| Six cited conservation stories | Place-specific field notes | Recovery/intervention kind and inference limit retained |
| Media candidates | Acquisition briefs and unavailable states | No current image or audio is acquired or cleared |

Every displayed statistic travels with its unit, geography, measurement period, source edition/date, uncertainty statement, and reference. The short context line is always visible; expanded methods and exact locator are one action away. Publication date, survey date, assessment date, recording date, and verification date have separate labels. “Unknown” and “not reported” are text states, never zero values or empty graphics.

The LPI describes average relative change in monitored vertebrate populations. It does not count all animals lost or all species declining. Keep that sentence beside all index views. No GBIF occurrence counts are used as abundance. No restricted IUCN data is required for these layouts; exact assessment dates remain unavailable until appropriately authorized and verified.

## Creative priorities and acceptance criteria

1. **Strongest signature: Listening Aperture.** An explicitly opened landscape and its recording note create the main sensory memory. Its full specification and silent alternative are in [signature interactions](signature-interactions.md).
2. Make reading evidence as carefully composed as looking at an image. Sources open in an accessible inline panel without abandoning the chapter.
3. Let composition supply drama: large typography, abrupt scale changes, sustained stillness, and one moving element at a time. Avoid fog shaders, animated particles, rubbery type, perpetual parallax, and simulated monitoring dashboards.
4. Keep the plan independent of uncleared assets. Each media slot has a text-first state; no placeholder is presented as an acquired field record.
5. Meet the accessibility, layout, contrast, and performance targets in [art direction](art-direction.md). Quality is judged by clarity, rhythm, factual trust, and execution; an awards outcome is not promised.

## Stage boundary and handoff

The deliverable is these five design documents: creative direction, [art direction](art-direction.md), [eight-chapter storyboard](narrative-storyboard.md), [signature interactions](signature-interactions.md), and [asset requirements](asset-requirements.md). The approved future stack remains Next.js 16, React 19, TypeScript, Tailwind 4, GSAP/ScrollTrigger/Lenis, Three.js/React Three Fiber/Drei, Web Audio API, and D3 where useful. This blueprint requires no 3D scene for its core experience; add one later only if it improves a documented purpose within the budget.

This stage creates no React components, frontend scaffold, new dataset, acquired media, hosting, deployment, domains, or cloud configuration. Future agents must inspect existing files and update `docs/STATUS.md` at the end of each stage. Scientific and media clearance gates continue to apply.
