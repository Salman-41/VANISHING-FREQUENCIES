# Responsive specifications

**System v1 · 2026-10-08.** Applies to every [page blueprint](page-blueprints.md). The viewport ranges below are reference CSS pixels at a 16 px browser default. Use equivalent rem media-query thresholds in implementation; a changed browser default can move the transitions. Container fit, text enlargement, reduced motion and actual content height can simplify a layout sooner.

## Breakpoints and grids

| Name / planned threshold | Reference range | Columns | Minimum margins | Gutter | Reference Figma frame |
| --- | --- | --- | --- | --- | --- |
| `CompactNarrow` | <360 px / <22.5rem | 4 | 16 | 12 | 320 × 800 |
| `Compact` | 360–767 px / ≥22.5rem | 4 | 20 | 12 | 390 × 844 |
| `Tablet` | 768–1023 px / ≥48rem | 8 | 32 | 20 | 834 × 1112 |
| `Desktop` | 1024–1279 px / ≥64rem | 12 | 40 | 20 | 1100 × 900 |
| `Wide` | ≥1280 px / ≥80rem | 12 | 60 | 24 | 1440 × 900 |

Cap content at **1560 px equivalent / 97.5rem**. Center excess space; do not stretch prose or chart labels across ultrawide displays. Compute container width as min(viewport−2×minimum margin, content cap), column width as (container−(columns−1)×gutter)/columns. Grid item span s uses s×column+(s−1)×gutter. Avoid fractional rounding per column; let CSS Grid resolve it.

Reference geometry:

| Width | Container | Columns × column width | Gutter |
| --- | --- | --- | --- |
| 320 | 288 | 4 × 63 | 12 |
| 390 | 350 | 4 × 78.5 | 12 |
| 834 | 770 | 8 × 78.75 | 20 |
| 1100 | 1020 | 12 × 66.667 | 20 |
| 1440 | 1320 | 12 × 88 | 24 |
| 1920 | 1560 | 12 × 108 | 24 |

At 1440: c1 x=60; c5 x=508; c8 x=844; c9 x=956. Span 4=424, span 6=648, span 8=872. At 390, full span 4=350. All page blueprint coordinates refer to this grid and the flow area beneath the header. Do not absolutely position reading text to match a screenshot.

## Shared layout transitions

| Module | Desktop/Wide | Tablet | Compact/Narrow |
| --- | --- | --- | --- |
| Page intro | Title c1–8, context c9–12 | Title c1–8; context below, max 62ch | Full width, natural wrapping, 24 px title/body gap |
| Species editorial row | Name/status c1–4, media c5–8, claim c9–12 | Identity c1–3; media c4–8; claim beneath media | Name/status → media → claim → links; one column |
| Species detail hero | Identity c1–5; habitat/animal scene c6–12 | Identity spans 8; scene below spans 8 | Identity above 3:2-ish scene and caption |
| Reading with evidence margin | Prose c1–8, context c9–12; prose max 62ch | Main text spans 8; context follows fact | Same flow; no hidden evidence drawer |
| Annual chart | Plot c1–8, evidence c9–12 | Plot spans 8; evidence below | Plot width=container, height 260 reference; evidence below |
| Soundscape workspace | Habitat c1–3; scene c4–12; record/context underneath | Habitat wraps across 8; scene spans 8; record/context stack | Native select, scene, record list, player/context in one column |
| Field note | Image c1–6, note c8–12 | Image spans 8, note follows | Place/kind, image if available, all passages stacked |
| Source/credit record | Title c1–4, metadata c5–12 | Title c1–3, metadata c4–8 | Title → full metadata; no truncated URLs/credits |
| Filter form | Flowing row, search span 4, two filter groups span 3 each, actions span 2 | Wrapping two columns, controls min 240 px | Full-width controls, Apply/Clear wrapping, filters visible in flow |
| Footer | Project note c1–5, links c8–12 | Two groups where fit | Single column; no fixed footer |

The species card remains an editorial spread, not a generic multi-tile gallery. Do not hide Latin names, conservation-summary dates, uncertainty or evidence limits to make a mobile card fit. If a desktop secondary column falls below 280 px of usable text width, stack it regardless of breakpoint.

## Header, navigation and overlays

Desktop/Wide header min 72 px; compact/tablet min 64 px. Wordmark can use two lines; visible Chapters/Explore and Sound controls have 44 px targets. At 320, reserve approximately 104 px for wordmark, 80 for navigation, 80 for sound with two 12 px gaps. Allow header growth/two rows when user text does not fit. Never shrink readable labels or replace them with unexplained icons. Anchor offset equals actual header height+16 px; update that offset when the header grows. If a fixed header occupies too much of a short/enlarged viewport, make it static.

Fullscreen navigation fills available viewport, with its own ordinary vertical scroll. Desktop page links c1–6; chapter links c8–12. Compact/tablet use one list group after another. Close remains within visible flow/top edge and never overlaps links. For short heights, do not vertically center the whole list. Respect safe-area insets on modal/player controls; no fixed player at the bottom of every page.

Media dialog: max 1120 px, 32 px desktop padding / 20 compact, content height limited to available viewport with caption included in its scroll area. Portrait/media containment must not crop the caption. Preferences popover max 424 px; at widths where trigger alignment would overflow, show as a full-width inline panel or clamped popover with 20 px page margins. Do not turn a nonmodal preferences panel into an unexplained blocking sheet on mobile.

## Media and chart sizes

| Slot | Wide reference | Compact reference | Fallback |
| --- | --- | --- | --- |
| Opening aperture | 1320 × 96 closed; opens to 224 in reserved area | 350 × 140 | Plain rule and title |
| Snow leopard scene | 872 × 560 | 350 × 240 | Full-width fact note |
| Main Listening Aperture | 1320 × 544 reserved, 96 closed | 350 × 240 fully open | Written recording/visual field note |
| Soundscape aperture | 984 × 420 reserved, 96 closed | 350 × 220 fully open | Habitat description/context |
| Editorial portrait | 424 × 288 | 350 × 240 | Named species text; no animal substitution |
| Field-note image | 648 × 420 | Width=container; ratio near 3:2 | Text note with place heading |
| Annual plot | 872 × 400 | 350 × 260 | HTML table + description |
| Closing aperture | 1320 × 160 | 350 × 140 | Plain rule and source links |

Image dimensions scale to the container using the specified aspect ratio rather than fixed viewport height. Documentary focal point comes from the acquired asset; mobile may use a separate reviewed crop or contain the full original. Never crop out the animal/context to preserve an arbitrary ratio. Captions remain external on opaque backgrounds.

Annual SVG recomputes its geometry to actual width, with mobile left/right/top/bottom padding about 44/16/24/40 px rather than desktop 56/24/40/48. Tick density may reduce; published observations remain intact. Values and source bounds remain in HTML. The table can use its own labeled horizontal scroll region if truly necessary; the document body cannot. Endpoint labels wrap independently of the signed value and have no miniature illegible axis.

## Scroll, text enlargement and preferences

Scenic sticky behavior exists only on the homepage at ≥1024 px and ≥800 px high, with motion enabled, a cleared image, and content that fits. Chapter 00 allows at most 20svh of scene travel; chapter 01 at most one viewport of sticky image travel. Other pages use normal flow; a desktop section index may stick only if it fits. The minimum scenic heights in the original storyboard are enhancements, not empty space requirements when assets are absent.

No reliable universal “text zoom” detector is assumed. Use robust wrapping, height/content checks, and fit-based removal of sticky behavior; “Read without motion” always supplies a fully flowing fallback. Browser zoom usually changes effective viewport size and therefore layout. Test text-only enlargement separately. Do not use scroll locks outside actual modal navigation/media dialogs.

At 200% text enlargement and 320 CSS px reflow, all facts, dates, controls and credit strings remain accessible. Text-spacing overrides cannot clip titles/buttons. No line-clamp on factual copy. Long names/URLs may use appropriate overflow wrapping; Latin names retain full spelling. Keep normal body prose left aligned.

Reduced motion: fully open scenes, no pinning, immediate state changes, native scrolling. Lighter media: smaller stills or text-first media areas, no optional video or speculative audio/image fetch. Silent mode: the same named recordings' descriptions/metadata without playback. These preferences are independent of viewport width and of each other.

## Later responsive acceptance matrix

Use 320/390/834/1100/1440/1920 px widths, 568/844/900 px heights where relevant, portrait/landscape, 200% zoom/text enlargement, and 400% browser zoom from 1280 px for reflow review. Check menu/dialog scroll, enlarged header offsets, longest species names, wrapped source credits, failed media, chart bounds and unknown dates. Profile on a documented mobile device/network. These are future checks; no browser or frontend has been produced during this specification stage.
