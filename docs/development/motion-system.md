# Homepage motion system

Implemented 2026-10-09. Read together with [motion tokens](../design/motion-tokens.md), [storyboard](../design/narrative-storyboard.md) and [scientific limitations](../research/data-limitations.md).

## Experience and ownership

The user reads server-rendered, validated scientific information, then opts into composition changes through scrolling or the listening-aperture button. The server research loader still validates local JSON before rendering. No scientific dataset, measurement or citation is handed to the motion controller; it selects only editorial headings, rules and photographic layers. No new API/backend is involved.

`src/features/motion/boundary.tsx` leaves its server-rendered children visible and dynamically imports `controller.tsx` after preference hydration. The controller uses `useGSAP` with a scoped root, `revertOnUpdate`, and a nested `gsap.matchMedia` context. Event callbacks are registered with that context's `add` method (the same context-safe recording mechanism used by `contextSafe`), and event listeners are explicitly removed. Late imports, image/font callbacks, resize debounce and anchor animation frames have cancellation/cleanup guards.

There is one Lenis instance on a fitting, fine-pointer desktop homepage. `autoRaf:false`; one GSAP ticker callback supplies `performance.now()` in milliseconds. `lenis.on('scroll', ScrollTrigger.update)` synchronizes native root scrolling. This real clock avoids modifying the shared GSAP lag-smoothing policy. There is no transformed scroll wrapper, `scrollerProxy`, `normalizeScroll`, competing RAF, scroll snapping, forced horizontal travel or scroll-linked audio. Lenis `syncTouch:false` retains native touch momentum; compact/short/touch-only viewports use native scrolling entirely.

Keyboard/focus, hashes and history settle wheel momentum immediately after synchronizing Lenis’ current document bounds. The pending wheel tween is cancelled with public `stop`/`start` methods before resizing; the prior stopped state is retained. This prevents a stale scroll limit from moving controls during a native focus jump and prevents an old wheel tween from undoing Page Down. Links retain normal browser/Next navigation; the enhancement never prevents an anchor or waits for a timeline. Chapter progress uses Next links so App Router history retains the correct route tree. Restored chapter positions are preserved when adding enhancement geometry. Modal observation stops Lenis while the native dialog is open. Visibility changes detach the owned ticker, settle/stop Lenis, and refresh on return. Route unmount destroys Lenis and reverts only this feature's timelines/triggers, never all site triggers.

## Choreography

| Element | Motion | Conditions / limits |
| --- | --- | --- |
| Editorial titles | 12px vertical entrance, 320ms, once; always opaque | Fitting fine-pointer desktop only. Body, estimates, taxonomy and citations never move or fade |
| Chapter registers | 320ms rule appearance; rule-color exit linked to chapter bottom | Natural-flow sections, no content concealment |
| Opening landscape | Two obsidian masks reveal a fixed 224px reserved frame from a 96px aperture over 20vh of scroll | ≥1024×800, fine pointer; no opening pin, animal movement or waveform oscillation |
| Mountain landscape | −6px→+6px vertical editorial parallax | Landscape only, desktop; no subject zoom |
| Snow leopard image panel | One optional ScrollTrigger pin at 48px viewport inset | Panel fits within viewport minus 96px; real adjacent evidence travel ≥80px; travel capped at one viewport. Spacer protects following copy; caption, credits, controls and measurements are outside the pin |
| Blue whale aperture | Open/Close reverses one 600ms mask timeline | Fixed image size/crop. Starts fully open for immediate reading; explicit Close then Open allows inspection. Rapid activation reverses current state; no animation queue or audio |
| Reading margin | Eight chapter links in the ≥1280px outer gutter, `aria-current=location`, overall reading-line transform | Imperative updates, no React scroll state or live percentage announcements. No content overlay: compact screens use a noninteractive 1px top-edge line and the native index/menu for chapter jumps. Hides near footer/dialog |
| Pointer / keyboard link feedback | Arrow shifts 3px right/up over 160ms, reverses on exit | Fine pointers and equivalent focus behavior; native cursor retained. Reuses timelines, no pointer-position tracking |
| Fullscreen menu | Whole surface opacity .92→1 over 160ms; all links available together | Fine-pointer desktop only; native focus/inertness is immediate. Close/Escape/route exit close immediately, without a visual exit delaying focus |
| Page commit | Stationary header rule acknowledgment over 160ms | No main-content overlay, delayed route commit or forced scroll-to-top |

Pinning is conditional, not guaranteed at every desktop size. A panel too tall, a short viewport, small available travel, increased text/layout size or coarse pointer prevents it. A debounced viewport change reverts and rebuilds the entire scope; image/font completion and a size observer refresh cached chapter positions; layout-size changes also refresh Lenis bounds. Progress reads cached geometry, not repeated layout measurements on every scroll frame. Native evidence disclosures/data-table expansion update that geometry.

## Preference and fallback behavior

OS reduced motion or “Read without motion” wins. Reduced data or “Lighter media” also disables the optional motion scope. In these states there is no Lenis instance, pin, mask, reveal or pointer animation. Reading data/media preferences remain independent; this stage adds no speculative media downloads.

Mask layers are `display:none` in base CSS; inactive controls/progress are `hidden`. A JS-disabled reader receives the whole documentary, native links, tables and photographs. No Suspense/loading boundary gates essential content on the motion import. A failed enhancement import leaves the complete native page. When an active enhancement control becomes unavailable, focus moves to its existing chapter rather than remaining on a hidden control. Reduced/mobile frames are fully open.

Current stage deliberately interprets the requested cursor interactions as native-cursor link feedback, matching the blueprint's prohibition on replacing the cursor. No statistics count up; no curves draw/morph, animal quantities change, cross-edition series merge, or editorial waveform masquerades as measured sound.

## Local checks and reproduction

Use Node 24.21.x/npm 11 as recorded in `.nvmrc` and the package engines:

```bash
npm run test:local
npm run test:browser
npm run test:browser:production
```

`tests/browser/motion.spec.ts` covers gutter fit/non-obstruction, wheel/keyboard/anchors, reversible aperture and interruption, repeated OS preferences, route/history cleanup, resize, pointer/focus equivalence, native CDP touch swipes, stored motion/media preferences, bounded image-only pinning, modal scroll suspension, and live user preference changes. Existing browser tests still exercise all routes, science, citations, no-JS fallback and five responsive widths. Foundation tests assert the pin fit policy and token values. See [STATUS](../STATUS.md) for completed results and any remaining qualification.

Inspect `.documentary`'s `data-motion-runtime`, `data-scroll-controller` and `data-motion-trigger-count` in local DevTools. These describe lifecycle ownership, not scientific values. Repeated reactivation should restore the same trigger count, with at most one `.pin-spacer`; leaving the homepage should remove Lenis classes and all homepage pin spacers. No global testing hook is installed.

Production review screenshots are saved under `docs/development/review/motion-*.jpg`. The [frame observation](review/motion-frame-observation.json) records the exact host/browser/method and raw intervals: 55 active-scroll intervals, approximately 16.7ms median/p95/max, no intervals above 33.3ms and no observed long tasks.

Browser emulation is not physical-device, cross-browser or screen-reader certification. The 16.7ms frame target requires representative hardware review; any local frame sampling is a limited observation, not a universal performance guarantee. Wildlife audio remains unavailable and no audio/3D integration starts here.

## Primary implementation references

Reviewed official sources on 2026-10-09: [GSAP React lifecycle](https://gsap.com/resources/React/), [ScrollTrigger](https://gsap.com/docs/v3/Plugins/ScrollTrigger/), [gsap.matchMedia](https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/), and [Lenis integration and options](https://github.com/darkroomengineering/lenis). Installed Next 16 documentation for `usePathname` and server/client component boundaries was read before code changes, as required by `AGENTS.md`. Installed `@gsap/react`/Lenis documentation and TypeScript definitions verified cleanup and option behavior.
