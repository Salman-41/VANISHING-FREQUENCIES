# Responsive and accessibility implementation audit

2026-10-10 · local production application · WCAG 2.2 AA target. This is an implementation audit, not a conformance certificate.

## Scope and reading path

Reviewed the project rules, creative direction, responsive/accessibility specifications, data contracts, existing components and status before editing. Read the installed Next.js 16.4 server/client and CSS guides. The verification and React review skills informed the local checks; no hosted tooling or service was configured.

The complete reading path is still versioned scientific JSON → validated server loader → semantic editorial HTML → optional client enhancements. No source acquisition, assessment update, data interpolation or scientific-content replacement occurred. Asset files and source/data ledgers retain their existing rights and evidence limits.

Coverage includes `/`, `/species`, all six existing `/species/[slug]` pages, `/soundscapes`, `/data`, `/about`, `/sources`, `/credits`, `/privacy`, and the helpful missing-route page. Three further views exercise ecosystem endpoints, regional annual comparisons and an empty species search. That is **18 views at each of seven widths**, plus interactive and failure states. Existing tests also cover the missing-species response.

| Viewport width | Coverage |
| --- | --- |
| 320 px | All 18 views; compact charts/forms; short 568 px menu; keyboard and enlarged text |
| 375 px | All 18 views; route axe scans; constrained mobile observations |
| 430 px | All 18 views; expanded filters and compact chart labels |
| 768 px | All 18 views; mountain composition, species detail and enlarged text |
| 1024 px | All 18 views; ocean composition and existing pin-fit/resize checks |
| 1440 px | All 18 views; route/interactive axe scans; desktop motion and scenes |
| 1920 px | All 18 views; bounded editorial composition |

## Implemented fixes

| Defect or unnecessary work | Implementation |
| --- | --- |
| Enlarged text forced editorial grids beyond the viewport | Replaced automatic minimum widths on fractional grid tracks with `minmax(0, …)`, enabled long-name/citation wrapping, and allowed constrained links to shrink. Normal grid proportions remain intact. |
| Chapter-index links overflowed at 320 px with enlarged text | Removed forced no-wrap on the link; the arrow and label remain operable together. |
| Large population figures could break awkwardly after general text wrapping | Sized the homepage estimate typography against its actual evidence-column container and kept the number together. Measurements and units are unchanged. |
| Compact annual chart ticks crowded each other | Show three actual source-year labels, de-duplicated for short/single-year windows. Every observation, interval and exact inspector/table record remains present. |
| Endpoint `0%` split onto two lines at the right edge | Keep percentage labels together, anchor them using their complete width, and omit the supplemental −50% tick at ≤430 px. −100% and zero remain visible; proportional geometry is unchanged. |
| Narrow scope/series select controls | Give the first two Observatory fields full-width rows at ≤550 px. Native dates and keyboard selection remain available. |
| Small audio slider hit areas and ambiguous waveform names | Use 44 px slider height, wrapping volume controls, a named habitat group, distinct recording-specific waveform names and a polite playback-status heading. |
| Soundscape text depended on the brightness of the artwork | Add a 90% obsidian reading surface under scene copy. Artwork remains visible around it; the surface guarantees readable text even as enlarged text reaches the bright mountain layer. |
| Audio visuals kept a frame loop in reduced-sensory modes | Observe live motion/media preferences; cancel visual RAF work in either reduced mode. A separate 250 ms position timer keeps the seek control readable during playback. Timer, observer and frames clean up on stop/unmount. |
| Fallback links/copy inside `noscript` were absent from Chromium's accessibility snapshot | Put navigation links and the audio explanation in ordinary HTML. `noscript` only supplies fallback CSS. Hide inoperable sound controls when scripting is disabled; retain archive descriptions, sources and Credits. |
| Standalone fades imported unused scroll libraries | Navigation/chart fades now import GSAP core only. The homepage controller retains its own ScrollTrigger, React hook and Lenis imports. No motion or scroll controller was added. |
| Fullscreen menu on a short/touch viewport | Add safe-area padding and contain its overscroll. Native modal semantics, scrollable links, Tab wrapping, Escape and focus restoration remain intact. |

## Automated and interaction checks

The dedicated [browser audit](../../tests/browser/accessibility.spec.ts) covers **126** normal reflow combinations and **54** text-spacing combinations. Spacing overrides use 1.5 line height, .12 em letter spacing, .16 em word spacing and 2 em paragraph separation. They run at 320 px, at 320 px with a 200% root font size, and at 768 px with a 200% root font size. Root-size emulation is supplemental to narrow reflow; it is not a physical browser zoom test.

Axe scans use `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa` and `wcag22aa`: 15 routes at 375/1440 px, eight opened interactive states, and all three sound habitats at 320 px with enlarged text: **41 scans**. Raw outcomes include `incomplete` findings; none are silently treated as passed rules. The retained [summary](review/accessibility-summary.json) records scan views, exact rule IDs, affected HTML/targets and manual-review reasons.

Keyboard/reading checks cover modal naming and state, short-screen focus visibility, Tab/Shift+Tab wrapping, Escape, opener restoration, new-route main focus, forced-colors focus outlines, habitat/layer/volume/seek controls, live reduced preferences, named groups, semantic headings, and no-JavaScript reading/navigation across all routes. No waveform sample is announced repeatedly as scientific data.

The full regression also checks mouse/touch native scrolling, desktop pin fitting and teardown, route/history cleanup, preferences, chart year/endpoint inspection and Escape, named scrollable tables, filter membership and URL state, delayed/error/empty states, descriptive alt text, exact scientific values and WebGL/photo fallback. Constrained SwiftShader checks use touch, CPU slowdown and the light scene: at most 1 DPR, 80 particles, 9,220 terrain triangles, three geometries/draw calls and no textures. They verify context-loss retry and released GPU resources, not physical-device frame rates.

Exact completed commands/results and the production build ID are in [STATUS](../STATUS.md) and the retained JSON reports.

## Manual review of automated “incomplete” results

- **Closed-popup ARIA reference:** the menu's `aria-controls="site-navigation"` references one existing native dialog. Its closed state excludes it from the accessibility tree. Opening exposes the named dialog; `aria-expanded`, focus containment and restoration are verified. This is not a missing referenced node.
- **Arrows and other non-text glyphs:** editorial arrow spans/icons supplement named text links/controls. They do not carry a species category, numeric direction, unit or action alone. Necessary control borders/focus use full-opacity semantic colors.
- **SVG chart contrast:** axe cannot infer the background of some SVG text/image nodes. Chart labels and bounds use stone on obsidian (**7.54:1**); estimates use ivory (**16.20:1**); selected marks use rust (**4.81:1**). Bound fill/grid opacity is decorative; opaque lines, legends, numbers and tables carry the information. Screenshot review and separate label-collision checks supplement axe.
- **Sound artwork/pseudo backgrounds:** the scene-copy surface composites 90% obsidian over the art. Even over hypothetical white, stone metadata has **5.94:1** contrast. Ivory text has a larger margin. This calculation covers the darkest text used in the reading surface; it does not certify arbitrary future overlays.
- **Enlargement and no-script semantics:** inspected actual layout and Chromium accessibility snapshots; fallback navigation/audio explanation are now ordinary HTML. This is evidence about Chromium's tree, not an NVDA/VoiceOver listening session.

Solid semantic pairings remain ivory/obsidian 16.20:1, stone/obsidian 7.54:1, obsidian/rust 4.81:1, ivory/forest 10.52:1 and stone/forest 4.90:1. The palette and type identity were preserved. Standalone audio controls are explicitly checked at ≥44 ×44 px; checkbox labels and existing navigation/control wrappers supply their hit areas. Inline source links retain their prose context rather than being converted into large buttons.

Primary criteria reviewed: [Reflow](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html), [Text spacing](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html), [Focus not obscured](https://www.w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html), and [Target size minimum](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html). The project's 44 px standalone-control goal is stronger than the AA target-size criterion's 24 px minimum with exceptions.

## Reproduce locally

Use Node 24.21.x and npm 11, with the installed dependencies and Playwright Chromium. The test configuration owns production port 3001; do not reuse the user development server.

```sh
npm run build
npm run typecheck
npm run test:local
PLAYWRIGHT_JSON_OUTPUT_FILE=test-results/responsive-final.json npx playwright test --config=playwright.production.config.ts --reporter=list,json
npm run report:accessibility
```

For the isolated cold-load observations and review screenshots, start a separate local production server, then run the observer in another terminal:

```sh
npm run start -- --port 3002
npm run measure:responsive -- http://127.0.0.1:3002
```

Stop that server after review. `measure:responsive` rejects remote hosts. It records its build ID, browser, profile, timings, encoded response-body sizes and capture paths in [responsive-performance.json](review/responsive-performance.json). Do not run CPU-heavy browser tests simultaneously with the observer. `test:accessibility` runs just the 15 audit scenarios against an existing production build. `report:accessibility` requires the full JSON regression report and all 41 current scans; failures, skips or flaky outcomes stop summary generation.

## Limits and follow-up

Final isolated observations for production build `Tsam_SASQOvzU-0mVQfo-`:

| Route | Last LCP candidate | Observed non-input shift sum | Encoded JS bodies | All encoded bodies | Longest startup task |
| --- | --- | --- | --- | --- | --- |
| `/` | 1.056 s | 0 | 240,259 B | 545,699 B | 325 ms |
| `/species` | 0.764 s | 0 | 224,198 B | 518,357 B | 312 ms |
| `/soundscapes` | 0.840 s | 0 | 190,459 B | 422,269 B | 297 ms |
| `/data` | 0.716 s | 0.002836 | 229,059 B | 378,637 B | 357 ms |

These samples are below the documentary's 2.5 s LCP, 0.1 CLS and 1.2 MB initial-body targets. They do **not** establish field performance: the shift sum is not the full field-session CLS metric, and body sizes omit request/response overhead. JavaScript uses a mix of gzip and identity responses; its encoded-body sum is the recorded delivery measure rather than a recompression estimate. Compared with a 200,000 B initial-JS ceiling, the homepage, explorer and Observatory remain over budget by **40,259 B, 24,198 B and 29,059 B**. Startup long tasks remain despite readable SSR content. No INP pass is claimed. No external resource, audio file or canvas was observed during these initial loads.

The 21 `responsive-*.jpg` receipts include every opening width, mountain/ocean compositions, species/filter views, annual/endpoint plots, Observatory controls and soundscape scenes/consoles. They were visually reviewed after the fixes; the observation JSON lists each capture.

- Automated scans, DOM/ARIA snapshots and synthetic interaction checks do not establish complete WCAG conformance. Physical VoiceOver/Safari, NVDA/Chrome/Firefox, TalkBack, switch input, real browser zoom and physical touch-device testing remain unverified.
- The constrained performance observation is one local sample per route, with fresh contexts, no cache, 375×812/DPR2, 4× CPU slowdown, 200,000 B/s download, 93,750 B/s upload and 150 ms latency. Startup long tasks and initial JavaScript budget gaps remain explicit in STATUS. Field INP, sustained hardware GPU timing, battery/thermal behavior and low-end memory pressure are unmeasured.
- Screenshots were made in reduced-motion mode to inspect stable compositions. Motion and optional WebGL are tested separately in the interaction suite. Screenshots show representative crops and controls; they are not a photographic/scientific verification.
- Cross-browser forced-colors rendering and spoken live announcements need physical assistive-technology review. Any future visual asset or scientific-data update requires renewed contrast, crop, chart and licensing checks.
- Existing scientific access/assessment/missing-population and selected-species-recording gaps remain unchanged. No inaccessible data was substituted and no dataset editions were merged.

Stop at completion of this implementation audit. No hosting, deployment or new project stage is authorized by this handoff.
