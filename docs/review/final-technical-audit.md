# Final technical audit

**Date:** 2026-10-10. **Final local build:** `uAmLXIW28bKaALj_o6EjJ`. Node 24.21.0, Next 16.4.0, React 19.3.0, Playwright 1.64.0 / Chromium. Production browser tests used loopback port 3001; visual inspection used 3002. No deployment, hosting configuration or external backend was added.

## Verdict

The application is ready for continued local demonstration and editorial review. The confirmed audio timing defect is corrected and verified. Existing route structure, server-loaded scientific JSON, explicit audio consent, optional rendering and accessible reading alternatives remain intact.

**Do not describe it as universally production-verified, WCAG-certified or Awwwards-ready.** Main-thread blocking, device coverage, lint compatibility and selected-species audio rights are unresolved. No severe new route failure was found in the sampled pages and targeted regression tests; that is narrower than proving every possible browser/device state.

## Categories and implementation findings

| # | Category | Findings / remaining boundary |
| --- | --- | --- |
| 11 | Scientific accuracy | Local records preserve species identity, source references, geography, measurement dates and uncertainty. LPI copy correctly describes relative change in monitored vertebrate populations, not animals lost. Six selected species have only two eligible dated population estimates; missing estimates remain missing. Public conservation summaries are not promoted to confirmed formal assessment dates. This review checks implementation and existing research provenance, not a new independent evaluation of all underlying ecological studies. |
| 12 | Data visualization integrity | Inspected `geometry.ts` and `annual-chart.tsx`: zero-based annual scale includes bounds; missing years/values break connectors; selection snaps to source years. Endpoint scales reject incompatible editions/periods. Tables, provenance and permitted downloads remain available. Fresh 16-test visualization run numerically compares all 357 annual rows and nine endpoints with raw inputs; all passed. No GBIF abundance inference, invented confidence intervals or cross-edition interpolation was introduced. |
| 14 | Accessibility | Semantic main/skip link, native dialog, visible focus, ordinary forms, chart inspector/table equivalents and independent sensory preferences are present. Final targeted audio accessibility test passed at 320 px with 200% type and three habitat axe scans. Earlier 41-scan route/state audit reported zero violations; incomplete findings and manual limitations remain in the QA handoff. Neither result establishes full WCAG 2.2 AA conformance or screen-reader compatibility on untested platforms. |
| 15 | Performance | Demand-rendered WebGL, lazy scene import, limited buffers and no default audio requests are sound decisions. Fresh light scene observation: three draw calls, three geometries, zero textures, 9,218 triangles, 80 points, DPR 0.62. Previous Lighthouse TBT and JS budgets remain unsatisfactory; see measurements below. No new claim of performance improvement follows from the clock fix. |
| 16 | Architecture / maintainability | Feature folders, App Router server boundaries, local validated data and isolated motion/scene ownership fit the task. `load-local.ts` verifies bundle/report/hash; dataset changes fail closed. Shared preferences wrap AudioProvider, which imports the engine/catalog, so route-independent audio/schema cost deserves profiling. The current single-context lifecycle works and was not relocated speculatively. Missing supported lint configuration is technical debt. |
| 17 | Error handling | Root/global error boundaries provide retry/return paths; chart geometry failure preserves written/table alternatives; audio fetch failure exposes an alert and archive links; WebGL loss returns to imagery with explicit retry. Latest tests cover failed audio, context loss and disabled WebGL. Root-error fault injection and every possible device/browser failure were not newly tested here. |
| 18 | Asset / data licensing | Inspected item ledgers and local receipt tests: images retain creator/license/modification metadata; six NPS audio clips retain source/processing hashes; local Archivo OFL file exists; generated terrain introduces no third-party model license. Existing source policy records distinguish published LPI outputs from restricted underlying databases and IUCN access. Rights are item-specific; external license pages were not comprehensively live-reverified in this audit. No new media or restricted dataset was acquired. |
| 19 | Functional completeness | All intended route families are generated or served: homepage, Explorer/six details, Soundscapes, Observatory, About, Sources, Credits, Privacy, 404. Search/facets, charts, audio, navigation and optional scenes have existing test coverage. Missing authorized facts/audio are visible evidence gaps, not fabricated “complete” content. Browser audio timekeeping had a real defect missed by earlier tests; this review adds regression coverage. |

Creative categories 1–10, 13 and 20 are covered in the [creative audit](final-creative-audit.md).

## Confirmed defect and correction

### Independent recording timing

Before correction, `AudioEngine.seek()` clamped every requested position to `snapshot.duration`, usually the ambience duration. Selecting the 7.557-second humpback waveform did not make the 6.627-second surf limit appropriate. A production browser reproduction requested 7.0 seconds and reported 6.8 seconds roughly 300 ms later, consistent with the incorrect clamp. Forest recordings provide a clearer boundary: the 7.139-second thrush must allow a 6-second seek despite the 5.078-second stream.

`toggleLayer()` and `pause()` also called the modulo display-position function. Once the default layer duration changed, this discarded full elapsed time and restarted other layers at the wrong point. The interface updated position only during playback, leaving Stop/focus states stale.

Changes:

- Added an unwrapped composition clock; modulo is applied only for individual recording display/playback.
- Seek now validates the recording ID against the active habitat, rejects non-finite input and bounds to that recording's actual duration.
- Pause/resume and layer changes preserve elapsed composition time.
- The waveform immediately synchronizes when playback/focus changes; its 250 ms timer runs only while playing. Reduced-sensory mode still provides position without analyser animation.
- Clarified shared-clock seeking and changed transport prose from “Play” to the visible “Sound on” action.
- Added three unit tests plus a browser regression spanning a long wind layer, short bird layer, pause/resume, Stop and a longer-than-ambience forest seek.

The existing AudioContext, gain ramps, source files, playback rate, consent and disposal rules are retained. No architectural rewrite was necessary.

### Documentation correction

The data methodology's historical “Media remains uncleared” sentence conflicted with acquired item ledgers. It now links the current photography/audio registers and explicitly distinguishes unacquired selected-species recordings. No license status was broadened.

## Newly executed verification

Commands below used the installed Node 24 binary on PATH:

```sh
export PATH="/home/salman/.npm/_npx/538786c08bcb9442/node_modules/node/bin:$PATH"
npm run typecheck
npm run test:foundation
npm run data:validate
npm run test:visualizations
npm run build
PLAYWRIGHT_JSON_OUTPUT_FILE=test-results/final-review.json \
  node node_modules/@playwright/test/cli.js test \
  --config=playwright.production.config.ts \
  tests/browser/soundscapes.spec.ts tests/browser/motion.spec.ts \
  tests/browser/immersive.spec.ts --reporter=list,json
# After the final adjustment to avoid polling while idle:
npm run build
PLAYWRIGHT_JSON_OUTPUT_FILE=test-results/final-review-audio.json \
  node node_modules/@playwright/test/cli.js test \
  --config=playwright.production.config.ts \
  tests/browser/soundscapes.spec.ts tests/browser/accessibility.spec.ts \
  --grep 'audio|layer, volume|failed audio|route exit closes|independent loop' \
  --reporter=list,json
```

| Check | Actual result |
| --- | --- |
| Standalone TypeScript | Passed; final production build also passed its TypeScript step after the timer adjustment |
| Foundation tests | **26/26 passed**, including three new clock tests, media hashes, preference parsing and all 8,192 species facet combinations |
| Processed data Zod validation | Passed: **366 index records, six species, two population records, six stories** |
| Visualization tests | **16/16 passed**, including independent raw-row comparisons and 9,282 supported annual series/range combinations |
| Initial corrected production build | Passed; build `rqcPOfZO68LZfCPTxWiUw` |
| Motion / WebGL / soundscape production regression | **23/23 passed in 1.4 minutes** on that build: 11 motion, seven scene, five soundscape tests |
| Final production build after idle-timer refinement | Passed; **17/17 static generation tasks**, final ID at top of report |
| Final soundscape / sensory-accessibility regression | **6/6 passed in 16.2 seconds**, including all five soundscape tests and the audio accessibility scenario; three enlarged-habitat axe scans had zero reported violations |

The full Python pipeline suite, full browser suite, four-route Lighthouse sweep and complete accessibility matrix were **not rerun** in this review. Unchanged systems use the prior QA evidence below. Current changes are covered by the narrower fresh checks. Browser JSON reports are local generated test artifacts; the results above remain in versioned documentation.

## Measured performance: distinguish the samples

### New direct scene observation

Local 1440×1000 Chromium, default available renderer selected the light configuration; no physical GPU claim. Activated mountain aperture reported **3 draw calls / 3 geometries / 0 textures / 9,218 triangles / 80 particles / DPR 0.62**. This is a complexity snapshot, not a frame-rate or sustained-memory benchmark. The new seven-scene regression also passed mobile constraints, fallback, context recovery, resize, offscreen disposal and route cleanup using SwiftShader.

### Previous QA Lighthouse results, unchanged evidence

Source: [QA performance report](../qa/performance-report.md), 2026-10-10, Lighthouse 13.5.0 mobile lab runs on local production. These are **not new measurements of the final audio-clock build**.

| Route | Performance | Accessibility | Best Practices | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 76 | 100 | 100 | 2.0 s | 0.002 | 1,010 ms |
| `/species` | 79 | 100 | 100 | 1.7 s | 0 | 880 ms |
| `/data` | 81 | 100 | 100 | 1.8 s | 0 | 680 ms |
| `/soundscapes` | 81 | 100 | 100 | 1.8 s | 0 | 690 ms |

Those samples met LCP ≤2.5 s and CLS ≤0.1, but performance scores/TBT leave substantial work. **INP ≤200 ms remains unmeasured**; TBT is not INP. Earlier constrained encoded-JS measurements were 240,259 B homepage, 224,198 B Explorer, 229,059 B Observatory and 190,459 B Soundscapes, against a 200,000 B target. Different profiles/builds must not be compared as a controlled optimization result.

Previous QA also reports 78/78 production browser tests, 126 normal responsive combinations, 54 text-spacing/enlargement combinations, 41 axe scans with zero reported violations, 76 successful internal links and 36 decoded images. See [QA report](../qa/test-report.md) and [responsive handoff](../development/responsive-accessibility.md). These are supporting historical evidence, not repeated final-review counts.

## Unresolved readiness conditions

- Profile startup work and shared bundles; remeasure after a focused optimization. Do not remove scientific validation merely to reduce bytes.
- Establish an ESLint configuration with supported peers. Prior QA documented installation conflicts; no forced installation or stack downgrade was attempted here.
- Verify physical mobile/desktop GPUs, sustained memory, Safari/Firefox, screen readers and real interaction latency. Emulation and zero automated violations are insufficient to close these items.
- Obtain appropriately licensed selected-species audio if the signature encounter is to include it; conduct real listening review of current loops.
- Maintain held population estimates, uncertain formal assessment dates and 2026 annual/methodology gaps as explicit gaps. Refresh source/asset rights before public reuse; authorization for restricted IUCN/BirdLife/underlying population data remains required where applicable.
- Retain the photo/table/text alternatives if canvas, motion, audio, JavaScript or optional assets fail. No major system replacement is justified by this review.

The ranked [ten improvements](final-improvements.md) and [creative audit](final-creative-audit.md) define the remaining work. This stage ends with a verified local correction and an honest handoff, not a deployment or submission.
