# Accessibility design

**System v1 · 2026-10-08 · target specification, not an audit certificate.** Meet the project's WCAG 2.2 AA target while preserving the complete editorial/scientific reading path. Checked the current [W3C recommendation](https://www.w3.org/TR/WCAG22/) and linked primary guidance during this stage. Frontend, assistive-technology and browser verification require a later implementation.

## Contrast and semantic colors

For normal text require at least 4.5:1; large text at least 3:1; necessary interface/graphic boundaries at least 3:1 against adjacent colors. Selection must also use words/shape. These requirements derive from WCAG 1.4.3 and 1.4.11; focus/keyboard/labels/status messages also remain requirements of the AA target. See [WCAG 2.2](https://www.w3.org/TR/WCAG22/).

Calculated solid sRGB pairings:

| Foreground / background | Ratio | Allowed use |
| --- | --- | --- |
| Ivory / obsidian | 16.20:1 | Primary text, focus, chart line |
| Stone / obsidian | 7.54:1 | Secondary text, boundaries/bounds |
| Rust / obsidian | 4.81:1 | Text accent, error text, point marker |
| Obsidian / rust | 4.81:1 | Primary button label |
| Ivory / forest | 10.52:1 | Conservation surface text/focus |
| Stone / forest | 4.90:1 | Conservation metadata/borders |
| Forest / ivory | 10.52:1 | Paper mode body/link/focus |
| Ivory / rust | 3.37:1 | Avoid for ordinary text/buttons |
| Rust / forest | 3.12:1 | Non-text marker only, no normal body text |
| Stone / ivory | 2.15:1 | Disallowed text/necessary boundaries |
| Forest / obsidian | 1.54:1 | Decorative adjacent surface only; border needed for a control |

Color names are defined in [tokens](design-tokens.md). All ratios use solid colors and WCAG relative luminance; transparency/image overlays need separate checking. Do not dim source/uncertainty copy through opacity. Decorative grid and bound fills may be faint because full-opacity bound lines and text convey their meaning. Essential chart data cannot depend on a faint band.

Put text on opaque surfaces. If text is proposed over a photograph later, review the actual crop and every responsive state; a generalized gradient is not a contrast guarantee. Error labels on forest/paper use their readable mode colors plus an explicit icon/word. Conservation categories use full words and sources, never a red/orange/green legend alone.

## Focus, keyboard and overlays

Project focus treatment: 2 px ring plus 2 px contrasting separation, immediate on keyboard focus. Dark ring ivory/gap obsidian; Conservation ring ivory/gap forest; Paper ring forest/gap ivory. Rings must not be clipped by image masks, overflow, rounded controls or header layers. Focus is visible during hover/pressed states too. A 2 px design rule is a project choice, not a claim to have tested WCAG's AAA focus-appearance criterion.

Controls use native semantics: links navigate, buttons act, inputs take values. Tab follows DOM reading order. Enter activates links; Enter/Space buttons; native select/radio/range behavior remains intact. Do not introduce global single-character shortcuts. Charts/seek have button/range alternatives to dragging; hover is never the only way to reveal facts.

Use actual header height in anchor/focus offsets. Keep focused content visible when sticky regions change. Where a header would obscure content, simplify it to normal flow. W3C's [Focus Not Obscured guidance](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html) supports this requirement; the project aims to keep the entire target visible, beyond merely avoiding total obstruction.

Fullscreen navigation/media enlargement use a named modal with visible Close, Escape, contained focus, inert background and return focus to the opener. For long content, initially focus its heading; for short navigation, Close is acceptable. If navigation proceeds to a new page, focus its main heading instead of a removed opener. There are no nested modals. These behaviors follow the [W3C modal dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/). Nonmodal preferences/source disclosures do not trap focus or disable the background.

Tooltip content is supplemental, dismissal works with Escape, pointer movement into it is supported, and content persists while trigger/tooltip is active. Associate description with the trigger; do not put links inside a tooltip. Touch uses inline help/disclosure. Essential source/date/uncertainty is always visible outside it. See [W3C hover/focus guidance](https://www.w3.org/WAI/WCAG22/Understanding/content-on-hover-or-focus.html).

## Targets, forms and feedback

All standalone controls/navigation targets are **44 × 44 CSS px minimum**, usually 48 px high; labels wrap to grow height. This is the project's stronger practical target. WCAG 2.2's [minimum target criterion](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html) defines 24 × 24 with exceptions; do not describe 44 as its AA minimum. Inline prose links retain sufficient separation and visible underlines.

Every search/filter/slider has a visible label. Groups have legends; help/error associates with the input. Errors identify the problem and how to correct it, preserve input, and are not conveyed by color alone. Explorer/Sources use explicit Apply and Clear; chart controls update in place without moving focus. A filter failure is not an extinct-species result.

Feedback regions distinguish loading, empty query, missing evidence, restricted/uncleared media, invalid route and request failure. Announce a committed result count or completed Retry politely; errors may need a timely announcement. Do not announce pointer previews, all playing seconds, or decorative transitions. Provide meaningful busy state only on the region doing work. Do not hide essential text in a transient toast.

## Structure and scientific reading

Every page has language, unique title, skip-to-content, header/navigation/main/footer landmarks, one H1, and hierarchical section headings. Fullscreen navigation is a navigation list inside its dialog, not an ARIA menu application. Sources/Credits provide additional routes to information. Subpage navigation distinguishes site pages from homepage chapters.

Species modules identify the common and full scientific name. Their conservation categories are public summaries with verification dates; formal assessment date remains explicitly unverified. Measurement modules keep estimate/units/geography/period/publication/method summary/uncertainty/source together. Dates are labeled by their actual meaning. Never let a screen reader hear a bare 718 or 1,898 without its context; the complete measurement sentence is available in normal reading order.

Index views include edition, baseline/end period, monitored-vertebrate scope, source and bounds/gap. The LPI's interpretation caveat is beside the view. Unknown confidence level cannot be spoken as 95%. Selected-year HTML values and a semantic table supplement the SVG. Table caption/headers/units persist; no graph-only/tooltip-only data. Use signed percent text for endpoint changes so shape/color alone does not carry direction.

Fields such as unknown trend, absent population estimate, not reported uncertainty, held evidence and no cleared media are different states. None is zero, stable, silent or biological absence. No essential reading or source access depends on audio, motion, fullscreen artwork or 3D.

## Audio, images and motion

Audio is off initially and every clip needs explicit Play. One recording plays at a time; mute/pause and volume are available. Stop on route/chapter exit, hidden document or interruption; return never auto-resumes. A waveform is decorative support to the player and text; relative amplitude is not a calibrated wildlife measurement. Rate transformations are visible before playback.

For wildlife audio provide an accurate descriptive equivalent based on the acquired clip, with species/habitat identity, context and meaningful background sounds. Speech needs a transcript; any later video needs the applicable caption/description treatment. A known sound description from research can exist without a recording, but cannot masquerade as a transcript of an unacquired clip.

Images have useful alt text based on their purpose, and visible provenance/caption for location, creator/license, wild/captive context and edits. A decorative duplicate may have empty alt; the primary documentary scene cannot rely on an uncaptioned generic label. Unavailable image uses text, not an invented documentary replacement. No graphic text replaces the editorial headings.

Reduced motion or “Read without motion” yields fully opened frames, no pinning/translation/smooth scroll and immediate state changes. Static loading replaces shimmer/spinner. User-requested playback remains separate from motion preference. No flashes, volume-to-loss metaphor, repetitive particle effect or essential time limit is designed. See [motion tokens](motion-tokens.md).

## Reflow and review plan

At320 CSS px equivalent width, ordinary reading content and controls reflow without two-dimensional page scrolling. A genuinely two-dimensional table may have its own labeled scroll area; this exception does not apply to surrounding prose. W3C explains this distinction in [Reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html).

Review at 200% browser zoom and text-only enlargement,400% zoom from 1280 px, portrait/landscape, longest names/credit strings and user text-spacing overrides. Leave heights content-sized, wrap controls, remove sticky scenes that do not fit, and avoid factual line-clamping. Fluid type needs this review; `clamp()` alone proves no accessibility result.

Future implementation checks: complete all eight pages/menus with keyboard; inspect focus restoration and source panels; read samples with desktop/mobile screen readers; inspect forced-colors mode/native controls; compare real image/plot contrast; exercise each missing/error state; verify audio interruption and reduced-motion changes. Record device/browser/assistive technology and results in status. No conformance, browser performance or assistive-technology results are claimed by this design stage.
