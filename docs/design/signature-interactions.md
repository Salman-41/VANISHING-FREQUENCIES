# Three signature interactions

**Blueprint v1 · 2026-10-08.** These specifications describe future behavior; no frontend code or media acquisition is included. All dimensions are CSS px. Shared typography, colors, timing and budgets are in [art direction](art-direction.md).

## Decision

| Signature | Primary chapter | What the visitor does | Why it belongs here |
| --- | --- | --- | --- |
| **1. Listening Aperture — strongest** | 02; adapted in 00 and 04 | Opens the scene around a recording and reads its context | Makes listening and provenance one composed encounter; memorable in both silent and audio modes |
| **2. Read the Bounds** | 03 | Inspects a published year alongside its source bounds and scope | Gives the documentary's scientific precision a direct physical expression |
| **3. Follow the Field Note** | 06 | Follows an action through the reported result to its evidential limit | Makes conservation agency specific and prevents an intervention from becoming an invented recovery |

The first signature is the lead visual identity. Reserve the full large-frame version for the blue whale encounter; use its visual grammar elsewhere with restraint. Each interaction enhances an already complete reading path. No completion gate, reward mechanic, simulated population, or personalized conservation score is needed.

## 1. Listening Aperture

### Purpose and composition

A shallow opening contains a fragment of an authentic scene. The recording title, location, capture date or explicit unknown, source playback rate, and recordist sit outside the frame from the start. “Open field note” reveals the full scene and a longer contextual description. Sound is an independently controlled document; opening the image is an editorial act, not a model of hearing distance or population size.

Desktop chapter 02: outer scene **1320 × 544**, initial opening **1320 × 96**, centered vertically. Retain the full reserved height in the layout to prevent jumps. Photo remains at a fixed crop/scale behind a mask. Top and bottom obsidian masks translate outward by **224 px** each on opening; no subject morphing. A 1 px rule meets the left edge of the recording title. Play controls and source line remain on opaque background below the scene, never hidden behind it. Chapter 04 adapts to **984 × 420**, with a 96 px closed opening; mask displacement is 162 px.

The closed/open state describes framing only. The complete text account, credit and accessibility description remain available before opening. On small screens the photograph starts fully open and only the additional field note expands.

### Controls and states

| State | Visible behavior | Allowed transition |
| --- | --- | --- |
| No cleared recording | Scene if licensed; cited sound description; “No cleared recording available” | Open/close visual field note, read source, continue; no simulated player |
| Available, unrequested | Recording identity/rate and Play; static envelope if supplied | Play requests audio; Open field note is independent |
| Loading | Short text “Loading recording”; Cancel; existing scene/description retained | Success → playing only if original request is still active; cancel/failure → idle/error |
| Playing | Pause, elapsed/total time, native seek, visible playback-rate label | Pause, mute, seek, change recording, chapter exit or interruption |
| Paused or ended | Play/replay remains explicit; envelope and context retained | Resume/replay from user action only |
| Open field note | Full scene plus inline expanded note | Close field note returns crop without changing audio |
| Error/unsupported | Plain error with Retry and text description | Retry requests the same licensed clip; no automatic alternate species recording |

Audio preference and playback state are distinct. When sound is off, an explicit “Enable sound” action arms audio; a Play action starts the named clip. If a browser requires another gesture, explain the state without looping permission prompts. Changing clips cancels pending loads and pauses the previous clip. A late network response cannot start audio after navigation or mute.

### Inputs and timing

- Button activation works with Enter/Space and touch; no press-and-hold requirement. Label changes between “Open field note” and “Close field note,” with expanded state exposed to assistive technology.
- The optional desktop reveal is **600 ms**, cubic-bezier(0.22, 1, 0.36, 1). Repeated activation reverses from the current position; do not queue animations. Focus stays on the button.
- Seek uses a native range with elapsed/total labels; Left/Right follow its normal step behavior, Home/End seek endpoints. Seek does not begin playback when paused. Controls have 44 px targets and visible focus.
- Only a genuine clip supplies a waveform. Compute a peak envelope from that exact delivered recording in a later offline media-preparation step. Store duration, channel handling and any normalization. Display is relative amplitude, **not calibrated sound pressure**, animal count, or a species-wide frequency signature.
- Playhead follows audio time at at most 30 fps. No frequency axis, invented hertz/dB number, audio-reactive crop, or amplitude-based environmental degradation. Seeking does not rescale the scene.

### Scientific and rights boundaries

The Atlantic blue whale candidate and ENP abundance estimate belong to different contexts. Their geographic distinction stays visible. Source speed changes, such as the NOAA 8× example, are labeled at the controls and in the description. No sonar transmission or apparent acoustic localization is generated. Calls from different species or habitats cannot substitute for missing recordings.

The opening waveform is either clip-derived with context or a labeled editorial line without axes. The same line is never transformed into the LPI curve. Images have independent provenance from audio; pairing two separately sourced records must not suggest they document the same encounter.

### Accessible, mobile and failure forms

Reduced motion: show the full frame; field-note disclosure switches instantly. Mobile: 350 × 240 scene in chapter 02, 350 × 220 in chapter 04, context and stacked controls beneath. Audio description gives the meaningful content to people who cannot hear; if speech exists, add an accurate transcript and speaker identification where known. Descriptions may only describe the acquired clip after listening review.

No cleared image: replace scene with a generous typographic field note, source line and plain rule. No cleared audio: no play button or fake waveform, but retain the cited sound knowledge. Neither failure blocks the species story or later chapters. A waveform SVG can be decorative when the player/text already exposes time and recording meaning; the seek control remains semantic.

### Performance and later verification

One photo and one active audio buffer; no microphone permission, autoplay, FFT, 3D simulation or cross-habitat mixing. Cache the small envelope; abort obsolete fetches; stop requestAnimationFrame updates when paused/hidden. Do not fetch on hover. Retain original recording separately from compressed playback derivatives.

Later acceptance scenarios: enter with sound off; open note without sound; play/pause/seek with keyboard; change habitat while loading; mute while loading; navigate away during play; return without autoplay; reduce motion mid-animation; fail the media request. At each point, recording identity, source and full written account remain available. These scenarios are specified here, not executed against a frontend.

## 2. Read the Bounds

### Purpose and composition

An exact-year marker sits in the annual LPI plot and aligns to an evidence margin. The margin is organized as **Published estimate / Source bounds / Scope and source**. Selecting a year updates these three fields together. The visitor learns that the line is an estimate with provenance rather than a count of animals.

Desktop: **872 × 400** SVG plot, **24 px** gutter, **424 px** margin. Plot uses a 2 px ivory central line, 1 px stone bound lines, optional low-opacity band, rust selected-point marker with a contrasting outline. Selection guides end at the plot boundary. The layout's reading order is chart title, interpretation, controls, selected values, chart description/table, sources.

### Data and scale contract

Use one series from `datasetId=lpi-2024-owid`, `metric=relative-index`, `edition=LPR 2024`. Initial series is `lpi-2024-owid-world`; initial selected year is its latest published year, **2020**. X domain **1970–2020**, baseline **1970=1**. Y domain starts at zero and includes the maximum upper bound across the available 2024 selector series, rounded upward to the next tenth. Hold this common domain when switching those series. Do not cap values or bounds at one.

Use straight segments through actual annual estimates; do not generate intermediate observations or spline overshoot. A missing record creates a gap. The table preserves original precision; selected display rounds central/bound values to three decimals. If rounding would erase a relevant difference, show extra decimals consistently and document that format change rather than claiming higher scientific precision.

Source bounds are visible by default and retain their lower/upper values. Label their unknown confidence level. No control can silently hide uncertainty while leaving a decontextualized number. The source panel explains that annual index points are published modeled/aggregated estimates, with sampling/coverage limitations.

### Interaction states

| Input / event | Result |
| --- | --- |
| Pointer moves within plot | Preview nearest actual published year; selected numeric value remains until click/keyboard change |
| Click on an annual point or use year control | Commit year and update estimate, bounds and source margin together |
| Keyboard year range / Previous year / Next year | Step among available observations; expose year and values as text |
| Select region or freshwater | Replace series with its own full name and source; retain selected year only if present |
| Open table | Expand all published rows for that series; preserve headers, units and source/bounds notes |
| Choose 2026 endpoint summaries | Clear annual plot/controls, replace title/period/source and render separate endpoint rows |
| Missing selected observation | Show “No published value available” and recorded reason; no zero marker or interpolation |

Keyboard controls are the primary complete alternative to pointer inspection. Announce committed changes politely; do not stream screen-reader updates during hover or every playback-like animation frame. The SVG has an accessible title/description; HTML values and table carry the full data. A pointer guide never implies an unobserved fractional year is a new datum.

### Endpoint view

The 2026 view provides Global, Regions, and Ecosystems groups from `lpi-2026-endpoints`. Current signed percent-change scale is **−100% to 0%**, shared across rows; if a future reviewed edition includes positive values, expand the domain to include them. Place the actual signed number beside each label. The visible heading says “LPR 2026 announcement · Change in the index, 1970–2022.” Add “No uncertainty bounds supplied in this release.”

There is no annual slider, synthetic line, or extension of the 2024 curve. A brief edition note explains that report revisions and coverage differ. Switching editions does not produce a computed difference, growth arrow, or claim of improvement between reports. CC BY-SA attribution and the relevant source/processing credit accompany the view.

### Motion, mobile and resources

Data replacement is immediate; optional 160 ms opacity only. Do not animate values, grow bars or interpolate paths between datasets. On mobile use **350 × 260** plot, year range/buttons, then stacked evidence fields. Full table is readable without a chart or JavaScript. Reduced motion keeps immediate updates. Use HTML/SVG; D3 may calculate axes/scales later, with no required canvas or 3D runtime.

Later acceptance scenarios: inspect endpoints and intermediate published years; switch from global to freshwater; open bounds/source; use only keyboard/table; encounter missing data; choose each 2026 group; zoom/reflow. Check that displayed value, period, geography, edition, bounds and citation always belong to the same record. No frontend tests were run in this design stage.

## 3. Follow the Field Note

### Purpose and composition

An intervention story is composed as a visible chain of three passages: **Action → Observed result → What this establishes**. A single bracket in the margin follows the visitor's selected passage. Each passage carries its own citation or clearly editorial inference-limit label. The result and limitation are present from the start; the reader opens supporting detail rather than discovering a hidden qualification later.

Desktop featured spread: photo **648 × 420** at columns 1–6; note **536 px** wide at columns 8–12. A **24 px** bracket lane precedes the text. Three named passage links sit above the note. Place, source date and story kind stay at its top. If no image is cleared, text occupies columns 3–10 and the named location occupies columns 1–2; no synthetic map pin is required.

### Story binding

Use `successStories` and their own `kind`, `description`, `outcome`, `inferenceLimit`, `geography`, and references. Tost corrals is the first interaction example. Action: fencing corrals; result: reduced night-time depredation; limit: livestock outcome involving snow leopards and wolves, with no established snow leopard abundance increase. Do not connect its bracket to a rising population chart.

Second featured note: Nepal's reported tiger recovery, with national scope and continuing coexistence needs. Third: Arnavon local nesting recovery signs. The other three stories remain separately scoped notes. A public announcement date labels reporting, not an invented intervention start date. Missing dates remain unspecified.

### Interaction and state

Each passage link is an ordinary internal anchor with visible current-state indication. Activation highlights its passage border and moves the bracket in **240 ms**; all text remains in flow. No automatic passage cycling. The corresponding source link opens an inline citation panel below that passage; focus stays on its disclosure control and the panel has a heading. Closing restores the compact note without hiding its outcome or limit.

Controls use Enter/Space as appropriate to their semantic type; anchors follow ordinary Enter activation. Tab order follows the written note, not the bracket's visual position. A deep link from a species row goes to the complete note, with its heading focused only when navigation semantics require it. No forced audio, simulated decision tree, success badge or number animation accompanies selection.

### Alternative forms and resources

On mobile, the bracket is a static left rule; every passage stacks below its place name. Reduced motion makes highlight changes instantaneous. With JavaScript off, links jump to their passage and references remain normal links. With no site photograph, the full typographic field note is the intended alternate design, with no false site imagery.

One optional still per featured story, reused citations, no new heavy module. This interaction's value is the spatial connection between action and evidence, so do not add a 3D page turn or elaborate animated paper texture. Later review must confirm that the source actually supports each passage, no held figure leaks in, and local outcomes retain their geographic/causal limits.

## Shared priority when inputs conflict

User mute/stop, page visibility and navigation events override a pending play request. Reduced motion overrides every scene animation, even if its interaction has already begun. Lighter-media preference suppresses prefetch, not essential evidence. Source or media failure preserves the reading path. Chapter navigation and ordinary scrolling are always available.
