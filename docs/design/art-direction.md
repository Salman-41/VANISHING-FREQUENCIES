# Art direction and layout system

**Blueprint v1 · 2026-10-08.** Measurements below are design specifications, not scientific data. Read with the [storyboard](narrative-storyboard.md) and [asset briefs](asset-requirements.md).

## 1. Master composition

Use a horizontal image aperture, an asymmetric editorial grid, and a persistent documentary margin. Scenes alternate between expansive photography and concentrated reading. Keep corners square; no elevated cards, glass panels, gradients behind charts, faux recording equipment, crosshairs, or decorative coordinates. The image may fill the width, but essential text sits on an opaque surface.

Reference canvas: **1440 × 900 CSS px**. Content width **1320 px**, centered with **60 px** margins. Twelve columns, **24 px** gutters: column width **88 px**, column-start interval **112 px**. Column 1 starts at x=60, column 5 at x=508, column 8 at x=844, column 9 at x=956. A four-column block is 424 px wide; six columns 648 px; eight columns 872 px. Use these coordinates for the reference layouts, then let content determine height.

| Range | Grid | Margins / gutters | Behavior |
| --- | --- | --- | --- |
| ≥1280 px | 12 columns; content capped at 1560 px | 60 px / 24 px | Reference desktop composition; additional width remains breathing space |
| 1024–1279 px | 12 columns | 40 px / 20 px | Smaller display type; same chapter order |
| 768–1023 px | 8 columns | 32 px / 20 px | Two-column reading where it fits; no scene pinning |
| <768 px | 4 columns | 20 px / 12 px | One reading column; full-width inline media |
| ≤359 px | 4 columns | 16 px / 12 px | Wrap headings and controls; retain 16 px minimum body size |

Mobile reference: **390 × 844 px**; content width 350 px; column width 78.5 px. At 320 px width, long scientific names wrap; no horizontal page scrolling. Reference viewport heights are never fixed content heights. Apply minimum heights only when the text fits, and remove sticky layouts at short viewport heights, text zoom, and enlarged text settings.

Spacing scale: **4, 8, 12, 16, 24, 32, 48, 64, 96, 144 px**. Body paragraphs: 16–24 px apart. Heading-to-body: 32 px desktop / 24 px mobile. Major section spacing: 144 / 80 px. Sources sit 16 px after their fact block. Readable prose width: 48–62 characters; no line longer than 72 characters. Numbers and their scope labels remain one indivisible editorial group.

Global header: 72 px desktop / 64 px mobile, opaque obsidian. Desktop brand occupies columns 1–4; chapter menu columns 9–10; sound/preferences 11–12. On mobile use a compact two-line wordmark, a labeled “Chapters” button, and a sound button; preferences live in the chapter panel. Control targets are at least 44 × 44 px. Content begins beneath the header; anchors reserve its height plus 16 px. Hide no text beneath a fixed audio bar.

## 2. Typography

**Select Archivo by Omnibus-Type** for both display and reading. Its grotesque character and variable width let the title feel compressed and substantial while body copy stays open. The publisher describes the family and supplies it under SIL OFL 1.1; Google Fonts' metadata identifies weight and width axes. Inspected 2026-10-08: [publisher repository](https://github.com/Omnibus-Type/Archivo), [distribution metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/METADATA.pb), [license](https://github.com/google/fonts/blob/main/ofl/archivo/OFL.txt). No font binary was downloaded in this stage.

Use upright and real italic files, locally served in future implementation. Preserve the bundled copyright/license; record the chosen revision and any subset changes. OFL permits embedding and redistribution under its conditions; it does not license unrelated images. Fallback: `Arial, Helvetica, sans-serif`. Do not fake italic for scientific names or horizontally scale text with transforms. If fonts are unavailable, accept reflow and retain all words.

| Token | Desktop reference | Mobile reference | Weight / width / tracking |
| --- | --- | --- | --- |
| Opening display | 144 px / 0.94 line height | 56 px / 0.98 | 500 / 85 / −0.035em |
| Chapter display | 96 px / 1.00 | 44 px / 1.04 | 500 / 90 / −0.025em |
| Species name | 64 px / 1.04 | 36 px / 1.08 | 500 / 95 / −0.02em |
| Section heading | 32 px / 1.15 | 28 px / 1.18 | 500 / 100 / −0.01em |
| Contextual estimate | 64 px / 1.00 | 48 px / 1.05 | 500 / 100 / tabular figures |
| Lead | 24 px / 1.4 | 20 px / 1.45 | 400 / 100 / normal |
| Body | 18 px / 1.55 | 17 px / 1.55 | 400 / 100 / normal |
| Metadata and source | 14 px / 1.5 | 14 px / 1.5 | 400 / 100 / normal |
| Control | 16 px / 1.25 | 16 px / 1.25 | 500 / 100 / normal |
| Chapter label | 14 px / 1.4 | 14 px / 1.4 | 500 / 100 / +0.08em, uppercase |

Display sizes interpolate between the stated mobile/desktop values and stop growing at the reference desktop size. At narrow widths use intentional line breaks from the storyboard, then natural wrapping if needed. Only chapter labels and the wordmark use capitals. Scientific names use real italic at body/metadata size. Do not crop titles for effect or animate individual letters. Large numbers never replace the complete measurement sentence.

## 3. Palette and contrast

| Token | Hex | Role |
| --- | --- | --- |
| Obsidian | `#0B0D0D` | Main page, image margins, reading panels |
| Warm ivory | `#ECEAE4` | Primary text, central chart line, occasional evidence sheet |
| Stone | `#A4A197` | Secondary text, metadata, reference rules |
| Forest | `#24372D` | Chapter 06 surface and occasional inset; no ecological score meaning |
| Rust | `#CF5A3D` | Selected control, cursor/marker, limited editorial emphasis |

Calculated solid-color WCAG contrast ratios, rounded to two decimals: ivory/obsidian **16.20:1**; stone/obsidian **7.54:1**; rust/obsidian **4.81:1**; ivory/forest **10.52:1**; stone/forest **4.90:1**; rust/forest **3.12:1**; ivory/rust **3.37:1**; stone/ivory **2.15:1**; forest/obsidian **1.54:1**. These calculations do not establish contrast over photographs or transparency.

Use ivory or stone text on obsidian. Rust text is allowed on solid obsidian at full opacity. Rust buttons use obsidian labels. On forest use ivory/stone text; rust may mark a non-text shape but never normal-sized text. Ivory sheets use obsidian/forest text. Never use stone text on ivory or ivory body text on rust. Forest against obsidian needs a separate visible border when conveying a control boundary. Focus uses a 2 px ivory ring with a 2 px obsidian separation; adapt to ivory surfaces with a forest ring. Pair every status and selection color with words and shape/underline.

Approximate surface composition: mostly obsidian, a smaller amount of ivory typography, and brief forest/rust accents. These are aesthetic proportions, not a pie chart. Preserve natural wildlife color; do not force blue water, orange fur, coral, or vegetation into the interface palette.

## 4. Photography and motif grammar

- **Landscapes:** use long, stable horizons or sloping rock strata. Establish habitat before close detail. Mountain animal should be small enough to belong to the frame, with a second accessible close view if a real photograph supports it. No “find the hidden animal” barrier.
- **Animals:** prefer wild, behaviorally ordinary encounters with documented provenance. Keep eyes, limbs, breathing space, and movement direction intact. No artificial rim lighting, eye glow, invented fog, or animal pasted into a different habitat.
- **People and interventions:** show work at a named place: corral construction, planting, monitoring, habitat protection. Identify agency accurately and obtain necessary contributor/likeness permissions. Avoid anonymous heroic silhouettes.
- **Grade:** modest exposure and tonal balancing; retain shadow detail and true species colors. Disclose meaningful edits. Never remove ships, fences, researchers, or environmental damage to alter the documentary meaning.
- **Aperture:** a horizontal view through a 96 px opening in a reserved 544 px scene on desktop. Opening the frame reveals the full original crop and its margin. This is an editorial reveal, not a simulation of an animal's senses.
- **Rule:** one 1 px ivory/stone horizontal rule aligns chapter, recording, and evidence. It is decorative unless labeled as an actual axis. No frequency ticks, dates, or coordinates on ornamental lines.
- **Waveform:** a static, clip-derived amplitude envelope with seconds only when a real cleared recording is present; active playback adds a playhead. Normalized amplitude is explicitly uncalibrated. In the opening, an optional authored line drawing can be labeled “Editorial sound motif”; it carries no axis or biological information. Never animate it into silence to signify loss.
- **Uncertainty:** a restrained bounded area behind a solid chart line plus labeled upper/lower limits. Do not use blur to communicate uncertainty. Actual bounds must remain inspectable.

Image captions are outside the photograph on solid background. Alt text describes the image's purpose; context, location, wild/captive status and creator live in a visible caption. General habitat photography is labeled as such if it does not document the measured population or intervention site.

## 5. Shared motion and audio rules

| Motion token | Timing | Use |
| --- | --- | --- |
| State | 160 ms, ease-out | Button/selection appearance; focus immediate |
| Panel | 240 ms, cubic-bezier(0.22, 1, 0.36, 1) | Inline source panel; no page takeover |
| Scene | 600 ms, same easing | Aperture opening/closing; one property group at a time |
| Content | 320 ms, same easing | Optional opacity + 12 px translation on first entry |
| Media stop | 150 ms gain ramp | Ordinary user stop; immediate mute and interruption take precedence |

No auto-looping ornamental motion, auto-advancing slides, scroll snapping, pointer parallax, numerical count-up, smooth chart interpolation, or zoom flights. Keep text fully readable throughout. Scrolling does not scrub audio. GSAP/ScrollTrigger may enhance the stated scenes later; Lenis must preserve native scrolling, keyboard, anchors, and browser find. Native scroll is the default whenever enhancement compromises those behaviors.

Reduced motion: no pinning, clip animation, translations, or smooth scrolling; all source panels and frame states switch immediately. Read-mode scene content is expanded and static. User-requested playback may retain a simple progress indicator; stop offscreen animation. Reduced motion and sound are independent preferences.

Sound starts off. “Enable sound” arms the player; “Play recording” starts a named clip. Only one clip plays at a time. Stop on chapter exit, navigation away, hidden document, audio interruption, and muted state; resume only by explicit play. Never resume audio after reload. Keep mute/pause, volume, seek, duration, playback-rate disclosure, descriptions, and credits available. No synthesized sonar pings, mood score, spatialized animal placement, or automatic bass amplification is needed. Full interaction states are in [signature interactions](signature-interactions.md).

## 6. Accessibility and performance requirements

Target WCAG 2.2 AA. Provide skip-to-content, landmark navigation, one primary heading, ordered chapter headings, explicit link labels, visible focus, and focus restoration for menus. Use normal buttons/range controls; no drag-only, hover-only, timed, audio-only, color-only, or canvas-only tasks. Tables and text descriptions accompany charts and recordings. Sources expand inline, preserve position, and never trap focus. At 200% zoom and narrow reflow, reading and controls remain complete; if a pin cannot fit, remove it. User text spacing must not clip content.

These are **future acceptance budgets**, not achieved measurements:

| Budget | Target and response if exceeded |
| --- | --- |
| Initial mobile transfer | ≤1.2 MB compressed total, including poster, font, markup/data and scripts; no audio/video fetched initially |
| Initial JavaScript | ≤200 KB gzip, including framework; defer chart/media/motion modules; simplify effects before raising budget |
| First image | ≤350 KB mobile / ≤650 KB desktop, responsive source dimensions and explicit aspect ratio |
| Fonts | ≤140 KB combined compressed upright/italic initial family subsets; load further language coverage only when needed |
| Chapter data | ≤80 KB gzip initial selection; do not ship the entire 966,276-byte provenance bundle in the opening |
| Media | One audio decoder, one optional video at most; audio ≤1 MB per delivered excerpt; video only by explicit request, ≤3 MB per clip |
| Rendering | Aim for ≤16.7 ms active-frame work on the chosen reference device; waveform update ≤30 fps; static render when inactive |
| User experience | Target LCP ≤2.5 s, INP ≤200 ms, CLS ≤0.1 under a documented mobile test profile in the implementation stage |

Reserve media dimensions to avoid layout shift. Only fetch current and, with data-saving off, next-chapter imagery; dispose offscreen decoded audio and pause video. SVG/HTML covers all required motifs and charts; no full-screen WebGL render loop is required. Honor available reduced-data signals and a visible “Lighter media” preference: still images, smaller sources, no speculative media fetch, audio on demand. Preserve the complete readable experience when media fails. These budgets must be measured later; this stage runs no frontend performance or accessibility test.
