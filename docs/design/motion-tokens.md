# Motion tokens and behavior

**System v1 · 2026-10-08.** Motion clarifies a user action or composition. It never invents a biological process, population trajectory or calibrated acoustic change. Original signatures remain specified in [signature interactions](signature-interactions.md); the reusable bindings below serve all [pages](page-blueprints.md).

## Token registry

| Figma token / future CSS suffix | Standard value | Reduced value | Use |
| --- | --- | --- | --- |
| `motion/duration/instant` / `motion-duration-instant` | 0 ms | 0 ms | Focus, essential data/text availability |
| `motion/duration/state` / `motion-duration-state` | 160 ms | 0 ms | Color/underline selection |
| `motion/duration/panel` / `motion-duration-panel` | 240 ms | 0 ms | Disclosure/photo replacement/field bracket |
| `motion/duration/content` / `motion-duration-content` | 320 ms | 0 ms | Optional first image/caption entry |
| `motion/duration/scene` / `motion-duration-scene` | 600 ms | 0 ms | Explicit desktop aperture opening |
| `motion/duration/audio-stop` / `motion-duration-audio-stop` | 150 ms gain ramp | 150 ms gain ramp | Ordinary audio stop; audio handling independent of visual motion |
| `motion/ease/state` / `motion-ease-state` | `cubic-bezier(0, 0, 0.2, 1)` | none | Brief state appearance |
| `motion/ease/editorial` / `motion-ease-editorial` | `cubic-bezier(0.22, 1, 0.36, 1)` | none | Frame/panel/content |
| `motion/distance/entry` / `motion-distance-entry` | 12 px | 0 px | Optional caption/image entry; no body-text movement |
| `motion/distance/aperture-main` / `motion-distance-aperture-main` | 224 px each mask at 1320 × 544 | 0; frame fully open | 96→544 opening |
| `motion/distance/aperture-library` / `motion-distance-aperture-library` | 162 px each mask at 984 × 420 | 0; frame fully open | 96→420 opening |
| `motion/rate/playhead` / `motion-rate-playhead` | ≤30 updates/sec while playing/visible | Static waveform + semantic seek/progress | Actual playback time only |

Motion prefixes become `--vf-…` CSS custom-property names later. Distances are reference geometry; derive actual mask displacement as (full height−closed height)/2 when the container scales. Native controls need not be animated. Preserve all durations as numbers+ms in token exports; Figma's easing support does not substitute for the browser implementation.

## Component bindings

| Component/action | Standard behavior | Reduced/mobile or interrupted behavior |
| --- | --- | --- |
| Button/link state | State color/underline over 160 ms; pressed inset, no scale | Instant change; focus always instant |
| Nav/dialog open | Entire opaque surface appears over 160 ms; links available together | Immediate open; no stagger, slide or focus delay |
| Inline disclosure | Optional panel appearance over 240 ms; natural layout expansion | Immediate expansion; essential outcome/context already visible |
| Listening Aperture | Masks reveal fixed-scale photo over 600 ms; one scene animation | Full frame on mobile/reduced; note toggles instantly |
| Scene/portrait replacement | Opacity over 240 ms; keep caption/geometry | Immediate replace; no pan/zoom between crops |
| Caption first appearance | Optional 320 ms, opacity +12 px translation once | Visible from first render |
| Field-note selection | Bracket to cited passage over 240 ms; text remains visible | Static left rule / instant border change |
| Index series/edition change | Immediate data replacement; optional 160 ms opacity | Instant title/data replacement, controls reset coherently |
| Selected published year | Marker goes directly to actual selected point | Same exact update; no fractional year/value generation |
| Loading | Static message/reserved geometry | Same; no spinner/shimmer needed |

Avoid animating height repeatedly during content loading. A disclosure may expand immediately and fade its supplemental region; focusable elements cannot be tabbable while visually concealed. Exit cannot leave stale focus or an invisible modal trap. If a transition makes content harder to follow, remove it rather than adding a longer timeline.

## Scroll enhancement budget

Homepage only: chapter 00 aperture 96→224 through the final 20svh, chapter 01 optional sticky image for at most one viewport of travel. Enable only at ≥1024 px width, ≥800 px height, motion enabled, cleared imagery and sufficient content fit. All headings, citations and controls remain in normal flow. No enhancement on the other seven page types beyond a fitting section index.

Native scroll remains the base. GSAP/ScrollTrigger can orchestrate these bounded scene changes later; Lenis is optional enhancement and must preserve keyboard, touch momentum, anchors, browser find and restored positions. No scroll snapping, forced horizontal scene, scroll-scrubbed audio, arbitrary timeline delays, or custom cursor. Chapter navigation never waits for animation completion.

## Preference and interruption precedence

1. User Stop/Mute, route/chapter exit, hidden document, or audio interruption cancels playback and pending start requests. Stop ordinary playback with the short ramp; urgent mute/interruption may act immediately. A visual duration never delays silence.
2. OS `prefers-reduced-motion: reduce` or user “Read without motion” enables reduced behavior. The user may further reduce motion; the interface does not override OS reduction with a casual toggle. Preference change mid-animation resolves immediately to an accessible static state and removes pinning.
3. “Lighter media” or available reduced-data signals disables speculative media fetch/optional video; it does not remove scientific descriptions, sources or chart tables.
4. Sound permission, reduced motion and lighter media are independent. A remembered “sound enabled” preference still cannot autoplay on reload or a new route.

Do not queue duplicate aperture/disclosure animations. Reverse/snap from the current state when reactivated. Dispose listeners/animation work on leaving the relevant section/route; cancel obsolete network responses. Restore focus/reading position after closing an overlay without automatic scroll flights.

## Scientific boundaries and performance

No count-up, spline interpolation across unobserved years, edition morph, disappearing animal marks, volume mapped to LPI, sped-up call without disclosure, forest regrowth simulation, sonar localization or synthetic restored chorus. A static editorial line is labeled and has no numerical biological meaning. User-requested audio is a recording with provenance, not a movie score.

Aim for ≤16.7 ms active-frame work under a documented later device profile. Use masks/transforms/opacity only where appropriate; avoid animating font axes, large blurs and full-screen canvas loops. One clip decoder, one optional video, no idle waveform animation. Pause rendering offscreen/hidden; reserve scene sizes to prevent layout shift. CSS/HTML/SVG suffice for the core; no 3D requirement is added by these tokens.

Future review scenarios: interruption during scene open, repeated activation, reduced-motion change, failed clip load, route exit, keyboard navigation mid-transition, restored browser history and text zoom disabling a pin. Verify final state/focus/audio intent, not only animation smoothness. This document specifies the checks; it does not report them as passed.
