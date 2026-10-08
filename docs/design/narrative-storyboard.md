# Narrative storyboard — eight chapter blueprints

**Blueprint v1 · 2026-10-08.** Design coordinates use the 1440 × 900 desktop and 390 × 844 mobile grids in [art direction](art-direction.md). Positions are relative to the start of each chapter's content below the global header. They describe the reference composition, not absolute positioning of flowing prose. Heights grow with text; short viewports, zoom and reduced motion use the mobile reading behavior. Asset IDs refer to [asset requirements](asset-requirements.md).

All eight chapters exist as semantic sections in document order. Every source panel contains publisher, linked title, source date/edition, measurement period if applicable, locator, verification date, and limitation. A recording's capture date is distinct from its upload date. “Checked 2026-10-08” never substitutes for a formal assessment date. The [validated bundle](../../data/processed/biodiversity.json) is the data authority; headings below are editorial proposals.

## 00. Opening — The World Is Getting Quieter.

### Narrative objective

Create a pause in attention and introduce the documentary's listening premise. Make sound optional before any playback. Establish that the tagline is an editorial framing of species and habitats, with scientific evidence examined later.

### Screen composition

Desktop: chapter label at columns 1–3, y=24. Title at columns 1–10, y=96, two lines: “The World Is” / “Getting Quieter.” Narrow mountain aperture x=60, y=424, w=1320, h=96. A waveform or editorial line sits 24 px below it. Intro at columns 1–5, y=584; controls at columns 9–12 aligned to that paragraph. Footer context line at y≈760. Keep title and scenery separate.

### Typography

Opening display token: 144 px, width 85, weight 500. Lead 24 px; chapter label and motif caption 14 px. Wordmark remains small in the header. Intro copy: “A documentary about wildlife, the places it inhabits, and the evidence of change.” Supporting line: “Sound is optional. The title is an editorial premise; these datasets do not measure a global change in sound.”

### Colors

Obsidian background, ivory title, stone supporting copy. Rust underlines the focused/selected “Begin” control. Mountain retains natural color with no palette tint. No color pulse or warning light.

### Real information displayed

Project name and tagline; chapter navigation; concise editorial-premise disclosure. No global loss statistic. If a real recording is selected, show actual recording identity and duration from cleared metadata. If the graphic is authored, caption it “Editorial sound motif” and omit numeric axes. This motif supplies no wildlife measurement.

### Art direction

The opening is a composed title spread. The aperture offers a fragment of the coming landscape, with an incomplete visual encounter resolved by chapter 01. A decorative waveform may be drawn as a fixed asymmetric line; it must not decay, flatten, or imply extinction. Prefer a real clip-derived waveform once its asset is cleared.

### Scroll behavior

Desktop ≥1024 px and ≥800 px high: chapter minimum 120svh; scene sticky beneath header for at most the final 20svh. Aperture expands from 96 to 224 px during that interval, without covering copy. “Begin” scrolls to chapter 01. No entrance loader or waiting period. Other conditions use natural content height and a fixed 224 px scene.

### User interaction

“Begin,” “Chapters,” preferences, and optional “Enable sound” are keyboard controls. Enabling sound does not play a clip. “Continue without sound” is an equivalent anchor to chapter 01 when the sound option is offered. When no cleared audio exists, show “Recording not yet available” and keep “Begin” as the only primary action.

### Motion specification

Title visible immediately. Optional scene opening follows scroll progress over the defined 20svh; no delayed text reveal. A manual frame-open action uses 600 ms scene easing. Waveform is static until actual playback; no independent oscillation. Reduced motion uses the expanded still frame.

### Asset requirements

`M01` mountain landscape and `G01` editorial line, or the envelope of a cleared `A01` ambience recording. All are gated by the asset ledger. If `M01` is missing, use the title and a plain horizontal rule; do not insert a stock landscape with an invented location.

### Audio behavior

Silent entry. Optional named habitat clip only after explicit play, with no voiceover or score required. No progressive muting to enact the tagline. Scene opening changes only composition, never volume. On leaving chapter 00, pause the clip; chapter 01 does not automatically start another.

### Mobile alternative

Title at x=20, y=72, w=350, 56 px; wrap into up to three lines if needed. Aperture is 350 × 140 px below a 32 px gap. Intro, premise line, and full-width 44 px controls follow. No pinning, crop animation or footer overlay. All content can extend past one screen.

### Performance considerations

One prioritized responsive still; no opening video, WebGL or audio request. Reserve image size. Inline the small decorative SVG only if present. Title and Begin work before enhanced motion loads. Meet the initial transfer budget from art direction.

## 01. Snow leopard — A life within the mountain.

### Narrative objective

Move from landscape to species, then from elusive presence to a carefully scoped estimate. Explain the difference between seeing an animal and estimating a population. Establish coexistence as a thread that returns in chapter 06.

### Screen composition

Label and place at y=24. Heading at columns 1–7, y=72. Below y=304, image occupies columns 1–8, 872 × 560 px; fact column occupies 9–12, 424 px wide. Image remains beside three flowing text blocks: habitat/identity, India estimate, coexistence link. Its visible caption names actual location/context. The estimate uses a 64 px value with the scope line immediately below.

### Typography

Chapter heading 96 px; common name 32 px; *Panthera uncia* 18 px italic. Estimate label “Estimated snow leopards in India” at 18 px before the number. Reading text 18 px and metadata 14 px; no microtype over rock texture.

### Colors

Obsidian/ivory/stone. Rust is confined to an evidence link or selection rule. Natural gray, snow and fur colors remain in photography. Vulnerable status uses the word, not a color-coded threat meter.

### Real information displayed

Habitat: rocky high mountains; distribution: Central and South Asia; mountain predator of wild ungulates; prey depletion and livestock conflict among documented threats (`wwf-snow`). Public category: Vulnerable, with public-summary/date qualification. **718 estimated individuals**, India, **2019–2023** SPAI survey, announced **30 January 2024**, `snow-india-spai` / `india-snow-spai`. Visible note: “National estimate. Quantitative uncertainty was not supplied in the inspected release.” Source panel gives the two-stage occupancy/camera-trap estimation method. No global total or drawn historical trajectory. Calls: chuffs, mews and growls; no roar (`snow-behavior`).

### Art direction

Begin with the landscape, then an optional real animal detail. Keep the animal small in the establishing shot, accompanied by a plainly labeled detail view so recognition is not a game. Do not place a captive portrait inside a Himalayan landscape. An India estimate does not license labeling every Himalayan image as its survey site.

### Scroll behavior

Natural two-column reading section, minimum 190svh desktop. Image may be sticky at header+24 px while the three text blocks pass, for no more than one viewport of travel. Heading stays in flow. At viewport heights below 800 px, remove stickiness. No scroll-controlled zoom into the animal.

### User interaction

“View image detail” toggles between the full original frame and a documented crop; “Read the estimate” expands method/source inline; “Explore coexistence” links to the Tost field note in chapter 06. Reading the method is optional; place/period/uncertainty are always visible.

### Motion specification

Crop change: 240 ms opacity transition, with caption retained; do not interpolate the camera position. Text visible by default. Optional first-entry translation 12 px over 320 ms on the image caption only. Numeric value appears complete. Reduced motion changes images immediately and uses normal flow.

### Asset requirements

`M01` and `M02`: authentic mountain landscape and wild snow leopard image with crop alternatives. `A02` species call is optional and currently unsourced. Existing Louisville Zoo portrait may only appear as an explicitly captive reference after clearance, never as the intended wild hero. Missing images yield the same fact column across the reading grid plus a labeled media-unavailable area.

### Audio behavior

Optional verified mountain ambience and snow leopard recording are separate selectable tracks, each with location/context. Do not layer them into an implied shared encounter. No generic big-cat roar. If no recording is cleared, show the cited sound description. Pause on chapter exit.

### Mobile alternative

Heading 44 px; species name and scientific name follow. Landscape 350 × 240 px, caption, habitat paragraph, estimate, method disclosure, then coexistence link. Context stays adjacent to 718; no sticky image or miniature side column. Captive context, if applicable, appears before any play/view control.

### Performance considerations

One visible image source at a time; load detail only when requested. No terrain mesh, map tiles or camera-trap sequence. Load species descriptions and the eligible measurement only, retaining citation IDs. Audio waits for play.

## 02. Blue whale — An ocean worth listening to.

### Narrative objective

Offer a deliberate listening encounter, then situate a historical stock estimate. Interpret the requested “ocean and sonar” atmosphere through passive listening and a playback cursor. The interface makes no claim that blue whales echolocate or that a drawn pulse locates an animal.

### Screen composition

Heading columns 1–8 at y=72; intro columns 9–12. Listening frame x=60, y=304, w=1320, reserved h=544; initial aperture h=96 centered inside it. Controls and track caption sit below the frame. Beneath it, the ENP stock note occupies columns 1–5; sound/provenance note columns 8–12. Maintain this separate stock note even if the audio comes from another ocean.

### Typography

96 px chapter title; “Blue whale” 32 px and *Balaenoptera musculus* 18 px italic. Recording title 24 px, playback metadata 14 px. Estimate uses 64 px figures with “Eastern North Pacific stock” at 24 px directly above.

### Colors

Obsidian dominates the scene margin; ivory labels and waveform, rust playhead, stone secondary detail. Natural ocean tones supply depth. No neon green radar or concentric targeting graphics.

### Real information displayed

Low-frequency calls (`noaa-ocean-sounds`); feeding on krill (`adw-blue`); ship strikes and entanglement among threats (`wwf-blue`). **1,898 estimated individuals**, ENP stock, **2015–2018** data, **CV 0.085**, **2023 assessment revised 14 May 2024**, `blue-enp-2018` / `noaa-blue-stock`, PDF p.2 / printed p.205. Visible text: “Historical stock estimate. Current stock trend unknown in this report.” Explain CV as relative uncertainty, not a confidence interval or decline rate. No current global count. Public category: Endangered with summary qualification.

### Art direction

Show the whale across a horizontal ocean frame, with space ahead of its movement. The image opening reveals visual context rather than simulated sonar range. Use no invented depth, coordinates, distance, frequency labels, or pressure-level measurements. A general photograph is labeled as a species portrait if its stock is unconfirmed.

### Scroll behavior

Natural flow, approximately 150–190svh at reference desktop depending on notes. Listening frame never traps scroll. Stock note follows below; visitors can reach it without playing or opening the frame. Leaving the chapter pauses playback. No audio scrubbing by scroll position.

### User interaction

Use the strongest signature, **Listening Aperture**: play a named recording and independently open its visual frame/context. Play, pause, seek, open/close frame, description, and source are separate explicit controls. The text description is available before play. If audio is unavailable, the same frame can open as a visual field note without a faux player.

### Motion specification

Frame mask opens symmetrically from 96 to 544 px over 600 ms; image scale stays fixed. Waveform cursor follows media time, capped at 30 fps. Metadata stays visible and stationary. No amplitude-driven image size. Reduced motion shows the full scene immediately with a static envelope and native seek control.

### Asset requirements

`M03` ocean/blue whale image; `A03` candidate normal-speed Atlantic recording after provenance review. `A04` accelerated NOAA example is an alternate, not an interchangeable master. `G02` waveform derives from the chosen file. If only Atlantic audio is cleared, explicitly caption “Atlantic recording; separate from the Eastern North Pacific stock estimate below.”

### Audio behavior

Single clip, explicit play, no looping or artificial sonar. Show exact source playback rate, including “8× source playback” if that alternate is used; do not label it natural pitch. Keep bass at the recorded content's safe delivery level with user volume control; no automatic gain boost to make low frequencies audible. No asserted sound/abundance relationship.

### Mobile alternative

350 × 240 px fully open photograph, then title/context and stacked controls. The “Open field note” button expands inline description/credits without animation. Stock note follows with 48 px estimate and all qualifiers. No drag or hover is necessary.

### Performance considerations

Static scene plus a precomputed waveform; no real-time FFT or underwater shader. Audio fetched and decoded only on play; preserve actual sample-rate/playback metadata. Dispose buffer on chapter exit where appropriate. Data and player failure leave the stock note and sound description readable.

## 03. Measured biodiversity trends — Read the change. Keep the context.

### Narrative objective

Widen from species encounters to the published LPI while teaching how to read it. Put scope, bounds, and editions into the chart's main composition. The reader can inspect change without being led to an animal-loss interpretation.

### Screen composition

Heading columns 1–8 at y=48; explanation columns 9–12. At y≈304, edition/view controls span the page. Annual chart occupies columns 1–8, 872 × 400 px; a 424 px evidence margin occupies 9–12. Axes sit inside 56 px left / 24 px right / 40 px top / 48 px bottom chart padding. Under-chart interpretation, source credit, and table toggle span columns 1–8. In endpoint mode, replace the whole chart area with labeled rows; never overlay both editions.

### Typography

Heading 80 px desktop / 40 px mobile to leave reading room. Control text 16 px; chart axes and sources 14 px; selected value 32 px with unit. Chart title includes the complete edition and period. Never give a naked percentage the opening-display treatment.

### Colors

Obsidian plot; ivory central line (2 px); source bounds outlined in stone, with a low-opacity stone fill that is decorative support to the labeled limits. Rust is the selected-year marker. Endpoint rows use ivory labels and rust markers with direct signed values. No green/red performance score or world heat map.

### Real information displayed

Default: **LPR 2024 annual series, 1970–2020, 1970=1**, `lpi-2024-owid`, initially `lpi-2024-owid-world`. Offer the five regional series and freshwater; no annual terrestrial/marine option exists. Bounds are “Source lower/upper bounds; confidence level unverified in acquired metadata,” never assumed 95% intervals.

Separate view: **LPR 2026 endpoint summaries, 1970–2022**, `lpi-2026-endpoints`. Global **−73%**; ecosystem view **freshwater −85%, terrestrial −69%, marine −59%**; regional view binds the five region records directly. All refer to change in the index of monitored vertebrate populations, from the 2026 announcement, not counts of lost animals. No connecting annual curve or reconstructed bounds. Source/date: `wwf-lpr-2026`, 8 October 2026.

Persistent interpretation: “The Living Planet Index measures average relative change in monitored vertebrate populations. It does not measure the percentage of individual animals that disappeared.” Add a short coverage note about uneven monitoring and excluded taxa. Annual values/precision come from data; displayed decimals are rounded consistently to three places, with original precision in the table. Missing values become gaps with reasons.

### Art direction

This is the most analytical spread: open space around a single plot, an aligned source margin, and crisp labels. The curve occupies less visual area than the preceding animal image. Separate the 2024 chart and 2026 summary with a full title and data replacement; do not suggest that switching editions is the passage of time.

### Scroll behavior

Normal section, minimum about 1050 px at desktop with table collapsed. No pinned progress chart, line-drawing as scroll advances, or forced horizontal journey. Opening a table expands document height. All controls remain in source order.

### User interaction

Use **Read the Bounds**, signature 2: year inspection by pointer or native range/buttons, linked value/bounds/source margin and accessible data table. Edition choices read “2024 annual series” and “2026 endpoint summaries.” Dataset selection resets focusable year controls to valid values. Ecosystem and region switches are explicit named groups. Choosing 2026 removes the annual slider.

### Motion specification

Series replacement is immediate, or a 160 ms opacity change with the new title already visible. Never morph one curve into another. No animated bar growth or number count-up. Marker position follows the selected actual year, not an interpolated year/value. Reduced motion uses instant updates.

### Asset requirements

`D01` validated index subsets, provenance and rights; `G03` original chart geometry. No report screenshot or third-party chart artwork. A real-data HTML table is the complete fallback. The missing 2026 annual file does not block the separately labeled summary view.

### Audio behavior

No playback and no data sonification. Entering this chapter pauses an earlier recording. Index magnitude is never mapped to volume, pitch, number of animals, or waveform loss. Sound control remains visible but indicates paused.

### Mobile alternative

Controls stack; chart is 350 × 260 px, with sparse year ticks but full inspection controls. Evidence margin becomes a block below. Endpoint rows use left label/right value and signed markers on a shared scale; their data table is equally prominent. Upper/lower values wrap normally. No sideways page scrolling.

### Performance considerations

Small preselected dataset, SVG and HTML; defer D3 to this chapter if used. At most one annual series and its bounds are plotted at a time. Use all published annual points without smoothing; straight segments are visual guides between labeled published years, not new estimates. Reuse derived geometry until size/data change. Keep attribution and source links in the same loaded slice.

## 04. Environmental soundscapes — A place has more than one voice.

### Narrative objective

Give the visitor time to listen to a real place or animal with context. Make recording limitations tangible. The experience is an annotated listening library, with no reconstructed historical “before/after” ecology.

### Screen composition

Heading columns 1–8 at y=48. At y≈280, habitat selector columns 1–3, listening frame columns 4–12 (984 px wide, 420 px reserved height). Beneath the frame: recording list and controls in columns 4–8, context in 9–12. Habitat entries: mountain, open ocean, Borneo forest, African forest, tropical reef. These are navigation categories, not claims that audio is already available.

### Typography

Heading 80 px / 40 px; selected habitat 32 px; recording title 24 px; recordist/date/rate and described sounds 14–18 px. Keep scientific names in italic when a voice is identified. Labels say “Habitat ambience” or the verified species name.

### Colors

Obsidian with ivory primary text, stone metadata. Forest background for the selected habitat label, with ivory text; rust selection rule. Natural environmental images remain distinct between ocean, Borneo, African forest and mountain.

### Real information displayed

Recording metadata and a descriptive equivalent of what can be heard, only after acquisition. Existing cited knowledge: forest elephant rumbles (`cornell-elephant-sound`); Bornean male long calls (`adw-orangutan`); blue whale calls (`noaa-ocean-sounds`). Hawksbill-specific sound is unverified. No sound level, species richness, acoustic diversity index, or population abundance is inferred. A generic reef recording is habitat ambience and never labeled a hawksbill call.

### Art direction

Adapt the Listening Aperture at smaller scale. The frame reveals a photograph and contextual field note. Separate recordings retain separate timestamps, locations, and credits. Do not fabricate a continuous chorus by mixing archives recorded in different places or years.

### Scroll behavior

Natural reading section, minimum about 1000 px desktop. The selected habitat does not move the page or auto-advance. Changing it preserves the control's focus. Visitor may continue immediately, whether playback has begun or not.

### User interaction

Choose habitat, then choose a recording. Only cleared entries have playback controls. Select new recording → stop old recording → show its context → wait for Play. A text-only “Read sound description” path is always available. Missing category displays “No cleared recording available” plus the known sound description and its source, without a synthetic sample.

### Motion specification

Selected row underline changes in 160 ms. Scene replacement 240 ms opacity; opening frame 600 ms. No idle waveform animation. Recorded playhead only; seek cursor does not change scene brightness. Reduced motion uses expanded frames and immediate selection changes.

### Asset requirements

`A01`–`A08` as available; `M01`, `M03`, `M05`–`M07` for contextual imagery, provided the captions accurately describe any geographic mismatch. Forest elephant audio requires confirmed species identity and compatible rights; Cornell playback access is insufficient. No clip is mandatory for retaining the chapter's written content.

### Audio behavior

One track at a time, default off, explicit play for every newly selected recording. No autoplay next, crossfade between habitats, or loop by default. User may replay manually. Source playback rate remains visible; no slider to invent “past” or “future” sound. Description includes relevant background human/mechanical sound if present, rather than removing it to create an idealized habitat.

### Mobile alternative

Native labeled habitat select or wrapping buttons; 350 × 220 px scene; one-column record list with 44 px controls. Descriptions appear before expanded technical metadata. No mixer panel, horizontal carousel, drag, or headphone requirement. If audio is unsupported, description and source remain.

### Performance considerations

No simultaneous decoders or live spectrum analyzer. Load selected clip only; cache metadata/envelopes, not all audio buffers. Habitat posters load on selection; lighter-media mode omits photographs if requested and keeps text. No fetch to a sound archive from a mere hover.

## 05. Species at risk — Six lives. Different pressures.

### Narrative objective

Broaden beyond the two initial encounters while maintaining taxonomic and geographic specificity. Show ecological roles and pressures without turning conservation categories into a numerical ranking or implying the selected animals represent all life.

### Screen composition

Heading columns 1–8. Six full-width editorial rows, ordered snow leopard, blue whale, tiger, Bornean orangutan, hawksbill sea turtle, African forest elephant. Each row: species name columns 1–4; portrait columns 5–8, 424 × 288 px; habitat/ecology/threats columns 9–12. A 1 px divider separates rows, with 64 px vertical padding. Status and summary date sit beneath the name; further evidence expands below the row across columns 5–12.

### Typography

Chapter heading 80 px / 40 px; species names 48 px / 36 px; Latin names 18 px italic. Category 18 px, spelled out: Vulnerable, Endangered, Critically Endangered. Threat and role paragraphs 18 px. No tiny abbreviations as the sole status label.

### Colors

Obsidian and ivory, stone metadata. Rust marks the open row; status text uses ivory rather than different alarm colors. Portraits preserve habitat color. No six equal boxed cards, rarity meter, or progress ring.

### Real information displayed

Use each record's `descriptions.habitat`, `distribution`, `ecologicalRole`, `threats`, and `conservation`. Categories: snow leopard VU; blue whale and tiger EN; Bornean orangutan, hawksbill and forest elephant CR. These are **public summaries checked 2026-10-08**, with **formal assessment date unverified**; exact source IDs are in each record and reference register below. Give one clear role: mountain predator, krill consumer, large predator, seed disperser, sponge consumer, forest seed disperser respectively. No held tiger/Bornean counts. For absent eligible population estimates say “No verified population estimate available in this documentary.” “Unknown” trend remains unknown; no arrows guessed from a threat category.

### Art direction

Species names form an irregular typographic rhythm across the repeated grid. Portrait sizes remain consistent without implying comparable population sizes. The two previously encountered species can use smaller reuses of their established frames. New species deserve complete names: Bornean orangutan and African forest elephant. Do not substitute Sumatran orangutan or savanna elephant assets.

### Scroll behavior

Entirely natural vertical reading, roughly 400–480 px per desktop row depending on copy. No mandatory horizontal species carousel, pinned giant name, or scroll-to-change species. The menu can link directly to an individual row.

### User interaction

Each row has “Read evidence” and “See conservation story” anchors. Evidence expands inline to show trend scope/limitations, category source, date gap, and linked measurement if present. Images can open their caption/credit; no animated 3D specimen rotation. More than one evidence row may remain open.

### Motion specification

Optional row divider/portrait opacity entry 320 ms once; body text stays visible. Evidence panel uses 240 ms if layout can remain stable; otherwise immediate expansion. Reduced motion has no entry reveal. No red pulsing for Critically Endangered species.

### Asset requirements

`M02`–`M07` portraits, licensed and accurately captioned. Tiger and orangutan candidates are captive and cannot fulfill a wild-portrait brief without replacement. For an uncleared/missing image use the text row at full reading width with a labeled absent-media slot, not an unrelated animal silhouette or generated portrait.

### Audio behavior

No automatic species calls on hover, focus, or scroll. Sound descriptions link back to chapter 04. This chapter is intentionally quiet; a reader can inspect taxonomy and threats without competing playback.

### Mobile alternative

Each species becomes a vertical spread: name/status, 350 × 240 px portrait, role/threat, evidence/story controls. Category date qualification stays above the image. Preserve natural wrapping of *Eretmochelys imbricata* and *Loxodonta cyclotis*. No sticky bottom action bar.

### Performance considerations

Lazy-load one row ahead; use responsive portraits and existing cached images for the first two species. Render all headings/text server-side later. Do not load audio modules here. A single evidence component pattern can serve all records without duplicating the full bundle.

## 06. Verified recoveries and interventions — What changed in one place.

### Narrative objective

Offer grounded agency through specific places and actions. Distinguish an observed local recovery from a management intervention and from broader global claims. Show the limit of the evidence alongside the outcome.

### Screen composition

Forest section background. Heading columns 1–8 at y=64; introduction columns 9–12. Three featured notes follow: Tost corrals, Nepal tiger conservation, Arnavon hawksbill conservation. Each occupies a full-width reading spread: image columns 1–6, 648 × 420 px; note columns 8–12, 536 px wide. Note has three aligned horizontal entries: “Action,” “Observed result,” “What this establishes.” A thin bracket aligns those entries. Further notes for WhaleWatch, Bukit Piton, and managed forest elephant areas follow as three full-width text rows with expandable detail.

### Typography

Heading 96 px / 44 px. Place name 32 px; kind label 14 px uppercase (“Documented intervention” or “Reported local recovery”). Outcome 24 px; limit 18 px, equal reading prominence to the action paragraph. Do not hide qualifications in footnotes.

### Colors

Forest surface, ivory text, stone source labels. Bracket in ivory. Rust used only for a non-text current-note marker. Obsidian inset for reference detail, with ivory/stone text. No triumphant green growth charts.

### Real information displayed

Bind `successStories` by exact ID. `snow-corrals`: reduced night-time livestock depredation, involving snow leopards and wolves; no measured snow leopard recovery. `tiger-nepal-programme`: national recovery reported, park differences/coexistence needs remain; no held numerical count or calculated percent. `hawksbill-arnavon`: encouraging local nesting recovery signs; no global headcount. `blue-whalewatch`: supplies collision-risk information; measured collision reduction unestablished. `orangutan-bukit-piton`: feeding/travel/nesting in restored areas; no standardized abundance increase. `forest-managed-areas`: historical reported local stabilization in selected Gabon/Congo areas, not current global recovery. Use source dates from citations and leave unreported periods explicitly unknown.

### Art direction

Show conservation as situated work, with named local participants when documented. Use original site imagery only when provenance confirms the actual place/action. A generic animal portrait cannot serve as a “successful recovery” photograph. When site imagery is missing, give the field note the full spread with a simple named-place heading; no fake before/after pair.

### Scroll behavior

Natural vertical notes; no pin or slider requiring the reader to travel through a recovery timeline. Each of the three main notes can occupy approximately 600–800 px at reference size; content determines the actual height. Additional notes expand in place. Deep links from species rows target the corresponding note.

### User interaction

**Follow the Field Note**, signature 3: selecting Action, Observed result, or What this establishes highlights its passage and moves a bracket; source links resolve the exact claim. All three passages remain readable. “Read the study/report” exposes the primary source. There is no score for an action's effectiveness and no choice that simulates animal recovery.

### Motion specification

Bracket translates at most the height of the note over 240 ms. Text never erases/retypes. At reduced motion, selection changes the border instantly. Optional photograph appearance is a single 320 ms opacity change; no restorative forest growth animation or animal multiplication.

### Asset requirements

`M08`–`M10` site-specific images for the three featured notes; `D02` six existing story records and citations; optional later site images for secondary notes. Human identification/credits require appropriate permission and accurate reporting. All three featured spreads can ship later as text-first notes if no image is cleared.

### Audio behavior

Silent by default and on entry. No rising score or restored chorus as a recovery signal. Link to a related cleared recording only if its geography/context is described; the recording is not evidence of recovery. No autoplay when highlighting a result.

### Mobile alternative

Place name, kind label, image if available, then all three passages in one column. The bracket becomes a left rule. Passage links scroll to visible paragraphs without animation in reduced mode. Secondary notes are normal disclosures with descriptive headings. Full outcome and inference limit remain visible when detail is collapsed.

### Performance considerations

Text-first HTML; optional responsive site image loaded near its note. No map service, timeline engine or additional audio bundle. Images are independent of the evidence, so failures do not conceal a result or source.

## 07. Closing — Keep listening. Keep looking.

### Narrative objective

End with attention and a route back to evidence. Leave the visitor with agency to learn and explore rather than a false promise of resolution or an unsupported claim that the world has become louder.

### Screen composition

Obsidian returns. Heading columns 1–10 at y=96; final still aperture x=60, y≈360, w=1320, h=160. Below: closing paragraph columns 1–5; exploration links columns 8–12 in a vertical list. Credits and data methods form a full-width final reading area. Minimum 100svh; longer source/credit content extends naturally.

### Typography

96 px display / 44 px mobile. Closing body 24 / 20 px: “Stay with a place. Learn its species. Follow the people studying and protecting it.” Link titles 20 px, descriptions 16 px. “The World Is Getting Quieter.” returns as a small editorial line, not a new quantitative conclusion.

### Colors

Obsidian, ivory, stone; rust underline for active links. Final landscape in natural color. No white flash, bright conversion banner or animated logo end card.

### Real information displayed

Links to [LPI](https://livingplanetindex.org/latest_results), [NOAA species science](https://www.fisheries.noaa.gov/species), [the snow leopard intervention study](https://doi.org/10.1017/S0030605319000565), and the source/method register. Include the actual data editions, research verification date, media credits and required licenses. Link labels accurately describe external destinations; no endorsement implied. Avoid a global animal total or summary calculated by adding incompatible species estimates.

### Art direction

Return to the opening mountain or another already-cleared frame, now fully contextualized. The horizontal opening stays open and still. Let the last visual be a habitat rather than a badge, donation amount, endangered counter, or team portrait.

### Scroll behavior

Normal final section and footer. “Revisit a chapter” opens the chapter list; “Back to opening” is explicit. Reaching the bottom never starts a replay, loops audio, or navigates to an external organization automatically.

### User interaction

Explore source links, expand credits by media title, read methods, revisit chapters. Links use normal browser behavior; if a destination must open a new tab, say so. Include a persistent way to pause/mute any intentionally replayed clip. No email form or donation action is introduced.

### Motion specification

No closing animation is required. Optional final image opacity 320 ms once; title is immediately readable. Underlines respond in 160 ms. Reduced motion and lighter-media states show a still image or plain rule.

### Asset requirements

Reuse `M01` or a cleared earlier habitat image; `D03` source/rights register and final asset credits. No new ending film or composer commission. With no media acquired, use the typographic closing intact.

### Audio behavior

Silent entry. A “Replay a recording” link returns to that recording's controls and context; it does not auto-play. No fading “last voice” metaphor, celebratory sound bed, or sound that restarts when the user reaches the footer.

### Mobile alternative

Single-column heading, 350 × 140 px still, short paragraph, stacked exploration links, then credits. At least 16 px text for links and 14 px for credits; long URLs are descriptive links rather than raw strings. No fixed footer covering browser safe areas.

### Performance considerations

Reuse an already fetched poster, no new animation/runtime module. Load complete source/asset details on explicit expansion while keeping short attribution visible. If external links fail, local method/source descriptions remain useful. No external embeds or tracking scripts are part of this blueprint.

## Reference and binding register

These links and IDs come from completed research. This design stage does not claim a new scientific audit. Quantitative UI copy must be generated from the validated measurement/index records and their references, not copied out of this storyboard as an independent dataset.

| Chapters | Binding / source ID | Primary reference and exact use |
| --- | --- | --- |
| 01, 05 | `snow-india-spai` → `india-snow-spai` | [MoEFCC/PIB, 30 January 2024](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2000545&lang=2&reg=48): India estimate, period, estimation method |
| 01, 04 | `snow-behavior` | [Snow Leopard Trust](https://snowleopard.org/snow-leopard-facts/behavior/): sound description |
| 02, 05 | `blue-enp-2018` → `noaa-blue-stock` | [NOAA 2023 stock assessment, revised 2024](https://www.fisheries.noaa.gov/s3/2024-12/2023-sar-blue-whale-enp.pdf): PDF p.2 / printed p.205, estimate/CV and unknown current trend |
| 02, 04 | `noaa-ocean-sounds` | [NOAA ocean sounds](https://www.fisheries.noaa.gov/national/science-data/sounds-ocean-mammals): calls and accelerated example; not blanket audio permission |
| 03 | `owid-lpi-2024` | [OWID chart](https://ourworldindata.org/grapher/global-living-planet-index): acquired 2024 annual series; edition and processing credit preserved |
| 03 | `wwf-lpr-2026` | [WWF-UK 2026 announcement](https://www.wwf.org.uk/press-release/living-planet-report-2026): nine separate endpoint summaries |
| 03 | `datasets[].rights` | [ZSL 2026 policy](https://www.livingplanetindex.org/documents/LPI_Data_Use_Policy_2026.pdf): published-trend CC BY-SA 4.0; no underlying database permission inferred |
| 04, 05 | `cornell-elephant-sound` | [Cornell Elephant Listening Project](https://www.birds.cornell.edu/ccb/elephant-listening-project/sound/): rumbles; actual recordings require identity and rights review |
| 05 | `wwf-snow`, `wwf-blue`, `iucn-tiger-update`, `wwf-orangutan`, `wwf-hawksbill`, `wwf-forest` | Public category references resolve through [species citations](../../data/sources/species-citations.json); full claim URLs and locators also appear in [fact sheets](../research/species-fact-sheets.md) |
| 06 | `snow-corrals` → `snow-corrals-study` | [Oryx primary study](https://doi.org/10.1017/S0030605319000565): corral intervention and livestock outcome |
| 06 | `tiger-nepal-programme` → `iucn-nepal-2022` | [IUCN Nepal report](https://iucn.org/news/202207/nepal-achieves-global-commitment-double-tiger-1): qualitative recovery; numerical records held |
| 06 | `hawksbill-arnavon` → `noaa-hawksbill` | [NOAA hawksbill profile](https://www.fisheries.noaa.gov/species/hawksbill-turtle): local nesting recovery signs |
| 06 | `blue-whalewatch` → `noaa-whalewatch` | [NOAA WhaleWatch](https://www.fisheries.noaa.gov/west-coast/marine-mammal-protection/whalewatch): management information, not demonstrated collision reduction |
| 06 | `orangutan-bukit-piton` → `orangutan-restoration` | [WWF Bukit Piton, 19 August 2020](https://www.worldwildlife.org/news/stories/restoring-orangutan-habitat-in-malaysia/): reported habitat use |
| 06 | `forest-managed-areas` → `iucn-forest-public` | [IUCN, March 2021](https://iucn.org/news/species/202103/african-elephant-species-now-endangered-and-critically-endangered-iucn-red-list): historical local stabilization |

## Reading and failure order

Heading → place/species/dataset identity → editorial premise → evidence → limitation → source → optional media/expanded detail. Visual grids may place media beside text, but DOM/focus order follows that reading logic. Failed media never removes facts. Missing datasets show the reason and source links; they never render zero or decorative replacement data. Audio permission failure falls back to the full text description. Every chapter is reachable from the menu regardless of interaction state.
