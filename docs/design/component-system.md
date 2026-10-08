# Component system

**System v1 · 2026-10-08 · implementation specification.** Reuse the [tokens](design-tokens.md), [responsive rules](responsive-specifications.md), [motion rules](motion-tokens.md), and [accessibility design](accessibility-design.md). These are planned components, not implemented React exports.

## Figma and code mapping

Figma library groups: `VF/Foundation`, `VF/Control`, `VF/Navigation`, `VF/Editorial`, `VF/Species`, `VF/Data`, `VF/Audio`, `VF/Feedback`, `VF/Overlay`. Names are stable nouns; variant properties use `Size`, `Tone`, `State`, `Layout`, and `Media`. Boolean properties include `ShowIcon`, `Expanded`, and `Selected`; text/instance properties carry content. Prefer nested components to a Cartesian product of every option. Layout constraints use Auto Layout with content-sized height, fill width, minimum control target, and wrapping text.

Example: `VF/Control/Button`, `Tone=Primary`, `Size=Standard`, `State=Default`; future symbol `VFButton`. `VF/Species/Card`, `Layout=Editorial`, `Media=Unavailable`; future symbol `VFSpeciesCard`. An unavailable asset is a real library variant, not an unsourced placeholder image. Use `VF/Page/{Name}/{Viewport}` for composition frames, with component instances and the same token aliases. No Figma access or new file is required for this plan.

Canonical shared property values: `Size=Standard|Compact`, `Tone=Primary|Secondary|Text`, `State=Default|Hover|Pressed|FocusVisible|Disabled|Busy`, `Layout=Editorial|CompactIndex`, and `Media=Ready|Unavailable|Error`. Use only relevant properties on each component. Feedback uses its own `State=Loading|Empty|Unavailable|Error|Confirmation`; independent selection/expansion are boolean properties. Names use these exact capitalizations in Figma; prose descriptions below use ordinary lowercase. Prototype motion uses the documented timings and does not substitute for browser semantics.

## Controls and navigation

| Component / code name | Geometry and variants | Behavior and content |
| --- | --- | --- |
| `VF/Control/Button` / `VFButton` | Standard min 48 high, 20 horizontal/12 vertical padding; Compact min 44 high, 16 horizontal; gap 8; square corners. Primary, Secondary, Text; default/hover/pressed/focus/disabled/busy. | Button for actions, anchor for destinations with same styling. Text 16 px; icon 20 px. Busy retains label/width plus “Working…” status; prevent repeated action. Never disable navigation while decorative motion finishes. |
| `VF/Control/IconButton` / `VFIconButton` | 44 × 44 minimum; 20 px original line icon, 2 px stroke | Use only familiar player/close functions with accessible names. Essential navigation/preferences keep visible words. Tooltip is supplemental. |
| `VF/Control/Link` / `VFLink` | Underlined body link; 44 px padded standalone navigation link | Clear destination text; active/current indicated by underline and current-state semantics. No color-only meaning or global automatic new-tab behavior. |
| `VF/Navigation/Header` / `VFHeader` | 72 px desktop minimum; brand c1–4, flexible blank c5–8, nav c9–10, sound c11–12. At narrow fit, two-line header grows. | On homepage label “Chapters”; other pages “Explore.” Both open the same site navigation with the relevant section first. Brand links home. Compact sound control says Off/On/Paused with visible “Sound” context. |
| `VF/Navigation/SectionIndex` / `VFSectionIndex` | 14 px labels, 44 px links; vertical at c1–3, or in-flow wrapping list | Ordinary anchor links, not an ARIA application menu. Current chapter can be indicated without a continuous progress meter. No sticky index below 1024 or when too tall. |
| `VF/Navigation/Breadcrumb` / `VFBreadcrumb` | 14 px, 8 px gaps; wraps, no truncation | List of ancestors; final item is current page. Display `Explorer / Blue whale`; do not turn scientific names into slugs. |
| `VF/Navigation/Footer` / `VFFooter` | 64 px upper padding; divider; utility links and short project note | Sources, methods/About, Credits, and revisit navigation. No fundraising/newsletter block added. Media credits remain beside the media as well. |

Primary buttons use rust background/obsidian text. Hover/pressed use ivory background/obsidian text; pressed adds a visible inset line, no bounce. Secondary uses dark surface, stone border and ivory text; hover adds underline. Focus remains independent of hover. Disabled fields/buttons have a visible reason when their absence would be confusing; unlicensed audio uses an explanatory state instead of an inert Play control.

## Form controls

The forms in scope are search, filters, dataset selection, player controls and preferences. No contact, account, newsletter or donation form is introduced.

| Component | Visual construction | Semantics and state behavior |
| --- | --- | --- |
| `VF/Control/TextField` | Dark surface; 1 px stone border; min 48 high; 16 px text/padding; label 16 px above by 8 px, help/error 14 px below | Search is a labeled search input within a form with Search and Clear actions. Placeholder is an example, not a label. Invalid uses rust border + explicit error text/icon. Error is associated with field. Keep entered text after failure. |
| `VF/Control/Select` | Same dark field; min 48 high; native disclosure, adequate right padding | Native select for habitat/series/source group; selected value and label stay visible. No custom combobox is required for six species. |
| `VF/Control/Checkbox`, `Radio` | 20 px visual box/circle; full label row min 44 high, gap 12; checked has ivory fill/obsidian mark, unchecked stone border | Native inputs. Checkbox groups have legends; radio groups choose one value. Disabled reason readable. Use radios, not tabs, for edition/filter choices that replace the current data selection. |
| `VF/Control/Range` | 4 px stone rail; rust selected segment; 20 px thumb inside 44 px interaction height; numeric/text value beside label | Native range plus Previous/Next buttons for published years; min/max/step and meaningful value text. Seek and volume retain player-specific units. No drag-only action. |
| `VF/Control/Preference` | Checkbox row with title/body explanation; no unlabeled pill switch | “Read without motion,” “Lighter media,” “Enable sound.” Motion defaults to OS reduction. Preference changes never automatically play sound. |
| `VF/Control/FilterGroup` | Wrapping checkbox/radio rows, 12 px gap; clear group heading | Explicit Apply for Explorer/Sources filter forms; URL-backed query state later. Chart edition/series radios update in place without navigation. No ambiguous hover-triggered filter. |

When native controls differ by browser/forced colors, preserve native functionality and visible selection; cosmetic matching is secondary. Checkboxes are not used to express statistical uncertainty. Search matches names/source metadata only; it never generates biological facts.

## Editorial and species modules

| Component | Structure and reference layout | Required content / rules |
| --- | --- | --- |
| `VF/Editorial/PageIntro` | Eyebrow, single H1, lead; desktop c1–8 + context c9–12; compact stack | Editorial titles are marked in authoring metadata, separate from cited facts. Text stays on opaque surface. |
| `VF/Editorial/Scene` | Wide media with fixed aspect-ratio reserve, caption/source below; media ready/unavailable/error variants | Render only cleared assets. Caption includes place, context, creator, license and changes. No location claim inferred from the surrounding page. |
| `VF/Editorial/Aperture` | 1320 × 544 desktop / 350 × 240 compact reference; inner 96 px closed crop desktop | Implements Listening Aperture; no change to image scale/audio amplitude. Fixed reserved space; full frame compact/reduced. Context remains available closed. |
| `VF/Species/Card` | Editorial row: name/status c1–4, 424 × 288 media c5–8, role/threat c9–12; 64 px row padding/divider. Compact name → media → description. | An article with one species heading link, scientific name, status context, role/threat and source links. No whole-card clickable overlay with nested links. No lifted/shadowed tiles. Optional CompactIndex variant omits photo, never date qualifications. |
| `VF/Species/Status` | Full category word, optional code in parentheses, public-summary qualifier beneath; 18 px text | Checked date, source link and formal-date gap retained. No red/green category severity scale or assessment date guessed from publication date. |
| `VF/Species/TrendNote` | Direction word, geographic scope, period/gap, interpretation, source | Unknown is explicit. Distinguish global and stock trends, preserve qualifiers; no guessed arrow. |
| `VF/Data/Measurement` | Label 18 px, estimate token, unit/scope, period/publication, short method label, uncertainty, citation; source panel after 16 px | Requires eligible measurement and references from bundle. Essential context always visible; expanded source panel supplies full method and exact locator. CV/range/interval remain distinct. No count-up or comparable-total layout for incompatible species estimates. |
| `VF/Editorial/Claim` | Body/lead claim plus source reference and optional limitation | Use validated claim text and references; no numeric statistic embedded into editorial description as a shortcut. |
| `VF/Editorial/FieldNote` | Place/kind, Action, Observed result, What this establishes; bracket; optional site photo | Keeps local scope/causal limit visible. All passages exist initially; sources expand in place. No restorative before/after simulation. |
| `VF/Editorial/DefinitionList` | Term c1–3, value c4–10; compact term above value | Taxonomy, dates, media and dataset metadata. Long scientific names/URLs wrap. |
| `VF/Editorial/SourceDisclosure` | 44 px named trigger, chevron; expanded inset 24 px padding, 1 px stone border | Expanded state/controlled panel; citations readable with ordinary links. Focus stays on trigger. Never conceal essential scope/uncertainty inside disclosure. |

Do not offer sorting by population, threat magnitude or “most endangered.” A category is an assessment summary, not a numeric priority score. Explorer can sort alphabetically or retain the selected narrative order.

## Chart and audio modules

`VF/Data/IndexChart` contains title/edition/period, LPI explanation, controls, SVG, selected value/bounds/context, source attribution and an expandable HTML table. Desktop plot 872 × 400 + 424 evidence margin; compact plot 350 × 260 + stacked evidence. Stroke: central 2 px ivory, bounds 1 px stone, selected marker 8 px rust with 2 px obsidian edge. Axis text 14 px; selected HTML value 32 px tabular. Grid is decorative at 24% stone. Source bounds remain inspectable at full opacity and are never silently omitted.

Use a common y-domain including zero and every acquired annual upper bound for the selectable 2024 series. X domain is 1970–2020; no spline smoothing or unobserved data. Sparse mobile ticks do not remove records from controls/table. The 2026 endpoint variant has its own heading, −100 to 0 signed scale for current data, separate source and no year slider/curve. Dataset replacement is atomic; no two-edition merge. Exact behavior: [Read the Bounds](signature-interactions.md).

`VF/Data/DataTable`: semantic caption, column headers, right-aligned tabular values, left-aligned text, 14 px minimum, min 44 px row height, 12 px cell padding. Source edition/unit belong to table heading; per-row uncertainty remains explicit. Use a labeled horizontal scroll region only when a genuine table needs it; prose outside never overflows. Missing values say “Not available” with a reason, not an em dash meaning zero.

`VF/Audio/RecordingPlayer`: title/identity, date/location/rate, Play/Pause, seek, elapsed/duration, mute/volume, description and credits. Standard min 44 px targets. No audio appears before clearance; unavailable variant is a sound description and reason. One recording at a time, default off, explicit play, pause on route/chapter exit/hidden document. Waveform is clip-derived relative amplitude; no hertz/dB values without actual verified measurements. Full specification: [Listening Aperture](signature-interactions.md).

## Tooltips, overlays, modals and fullscreen navigation

`VF/Overlay/Tooltip`: short supplemental text, max 240 px wide, 12 px padding, 14 px type, opaque obsidian, 1 px stone border; 8 px from trigger, viewport-clamped. No essential date/uncertainty/reference belongs solely here. On focus show immediately; optional hover delay 300 ms. Escape dismisses and suppresses reopening until the trigger is deactivated; allow pointer travel to tooltip and keep it available while trigger/tooltip remains hovered/focused. It contains no interactive links. Use a disclosure/popover for actionable content. On touch provide the same label/help inline; tooltips are unnecessary for essential actions.

`VF/Overlay/Popover` is a nonmodal preferences/help panel: max 424 px, padding 24, opaque dark border. Explicit trigger, close button and Escape; no focus trap. Essential Sources uses an inline disclosure instead. Closing restores focus to trigger when focus was inside; do not steal focus from an outside-click target.

`VF/Overlay/Dialog` is reserved for media enlargement and the site navigation. Modal behavior follows the [W3C dialog pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/): named dialog, contained keyboard focus, Escape, visible close and sensible focus restoration. Use native dialog where suitable and make background inert only while truly modal. Reading content may receive initial focus at its heading; a brief navigation dialog may focus Close. No nested dialogs; close current overlay before opening another.

Media dialog: max width 1120 px, 32 px padding desktop / 20 compact, available-height scrolling, caption always available, no close by swipe only. Fullscreen nav: opaque obsidian, no backdrop blur; desktop page links c1–6 at 48 px, homepage chapter links c8–12 at 24 px, preferences below. Compact: single vertical list, links 28 px, 44 px minimum rows, complete internal scroll area. Group page links under “Explore” and anchors under “Documentary chapters”; these are ordinary navigation links, never role=menu/menuitem. Eight page destinations remain visible across scroll; no staggered animation delays. Without JavaScript provide the same index as normal navigation.

## Loading, empty, unavailable and error states

| `VF/Feedback/State` variant | Visual/content behavior | Recovery |
| --- | --- | --- |
| Loading | Reserve actual media/chart geometry; static decorative neutral blocks or “Loading…” text, no shimmer; region marked busy | Cancel audio request; allow reading/navigation. Do not render dummy data points. |
| Empty filter result | Heading “No matching species/sources,” chosen filter summary, normal text | Clear filters button; keep search input. An empty selection is not biological absence. |
| Unavailable evidence | Specific reason: missing formal date, held estimate, missing annual edition | Show known descriptions, available edition and source; no endless spinner or fake numerical fallback. |
| Uncleared media | “No cleared recording/image available,” source-backed description where present | Continue reading; no enabled playback, fake silhouette or archive hotlink bypass. |
| Request/decode error | Region-scoped error with text and icon; existing description and source retained | Retry same permitted resource; reset requires explicit action. No auto-switch to another species. |
| Invalid/unmatched route | Plain page title and explanation, Explorer/Explore links | Useful navigation; never fabricate species record. |
| Copy/download confirmation | Small inline status, no blocking modal/toast required | Text can remain until next action; no essential message disappears on a short timer. |

States must distinguish a network failure, an evidence gap and a rights restriction. Content error does not replace the entire site. Busy/confirmation text is announced when useful; hover changes and every audio tick are not. All form/media/data states must be represented in the planned Figma component set.
