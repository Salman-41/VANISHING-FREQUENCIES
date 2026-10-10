# Targeted performance optimization

**Date:** 2026-10-10 · **Final production build:** `Lxt6luEThH1_5qGDhm-EA`  
**Environment:** Node 24.21.0, Next 16.4.0, React 19.3.0, Lighthouse 13.5.0, Chromium 156.0.8078.4. Local production on loopback ports 3002 (measurements) and 3001 (regression tests).

## Outcome and interpretation

The measured mobile startup JavaScript is below **200,000 encoded body bytes on all four routes**. The homepage has only **422 bytes of headroom**, so this is a sampled budget result, not a durable margin across devices or future changes.

Main-thread blocking improved in the homepage, Explorer and Soundscapes samples. Observatory blocking did **not** consistently improve: its clean repeat changed from 765 to 791 ms. A first optimized Observatory sample regressed to 3.11 s LCP / Performance 66; a repeat measured 1.91 s / 79. Both are retained. INP remains unmeasured, and these local lab runs do not establish field Core Web Vitals.

The visual system, scientific records, image delivery, page structures, audio files, renderer and animation choreography were retained. This stage changes module ownership, small-contract validation and redundant startup work; it does not introduce a new architecture, hosting or deployment.

## Measured startup JavaScript

The initial profile was taken before application changes. The unchanged original source was later rebuilt for a clean repeat because its first Explorer sample missed deferred GSAP and some timing samples were inconsistent. The table uses the repeat baseline, whose complete resource inventory matches the historical QA byte totals within 37–98 bytes. Both initial and repeated evidence remain available.

| Route | Original repeat | Optimized | Reduction | Optimized budget |
| --- | ---: | ---: | ---: | --- |
| `/` | 240,296 B | 199,578 B | 40,718 B / 16.9% | Below 200,000 B by 422 B |
| `/species` | 224,235 B | 188,316 B | 35,919 B / 16.0% | Below by 11,684 B |
| `/data` | 229,096 B | 193,177 B | 35,919 B / 15.7% | Below by 6,823 B |
| `/soundscapes` | 190,557 B | 176,334 B | 14,223 B / 7.5% | Below by 23,666 B |

These are Resource Timing `encodedBodySize` totals, including requested enhancement chunks during the observation window, excluding headers/transport overhead. Fresh Chromium context per route: **375×812, DPR 2, mobile/touch, 4× CPU slowdown, 200,000 B/s download, 93,750 B/s upload, 150 ms latency, cache disabled**. Wait for fonts, initial native homepage controller, network idle and another 1.5 seconds. V8 sampling and precise coverage were enabled identically in both phases; their overhead means CPU task values are diagnostic, not Lighthouse measurements.

Reports and load inventories: [first original profile](performance/before-startup.json), [repeat original profile](performance/before-repeat-startup.json), [optimized profile](performance/after-startup.json). Corresponding `.cpuprofile` files beside each report can be loaded into DevTools' JavaScript profiler. The repeat original and optimized samples contained no page errors, no startup audio requests and no canvas.

The first original Explorer profile recorded 187,032 B because its deferred GSAP requests had not appeared in that sample. It must not be compared with the complete 188,316 B optimized sample as an increase. The complete repeat original recorded 224,235 B. This illustrates the importance of retaining request inventories and conditional-enhancement timing alongside a byte total.

## Lighthouse: all results, same settings

Each phase ran the same four routes sequentially, with Lighthouse's mobile performance preset and the same browser binary. Two runs per phase are shown as **first / repeat**, not selectively chosen best scores. Builds/tests did not overlap the clean repeat audits. Some first baseline audits overlapped initial verification work; those timings are secondary evidence rather than the strongest comparison. A shared host remains variable even when task-owned processes are serialized: recorded Lighthouse CPU benchmark indices ranged from **402 to 1,238**. No statistical confidence or guaranteed causal percentage speedup is inferred from two samples.

| Route | Performance before | Performance after | TBT before (ms) | TBT after (ms) | LCP before (s) | LCP after (s) |
| --- | --- | --- | --- | --- | --- | --- |
| `/` | 67 / 68 | 77 / 75 | 1,982 / 1,588 | 845 / 1,006 | 2.51 / 2.44 | 2.16 / 2.21 |
| `/species` | 67 / 53 | 84 / 73 | 2,149 / 1,958 | 601 / 1,473 | 2.39 / 3.72 | 1.70 / 1.83 |
| `/data` | 78 / 80 | 66 / 79 | 894 / 765 | 995 / 791 | 1.80 / 1.83 | 3.11 / 1.91 |
| `/soundscapes` | 80 / 78 | 90 / 82 | 688 / 876 | 388 / 668 | 1.99 / 1.84 | 1.71 / 1.78 |

**Accessibility and Best Practices: 100 for every run.** CLS: homepage **0.001616**, other three routes **0**, unchanged across all runs. No Lighthouse console errors were reported. The latest repeat LCP/CLS samples meet 2.5 s / 0.1, but the failing first optimized Observatory LCP remains a recorded limitation. TBT remains high; TBT is not INP.

The user's historical 76 / 79 / 81 / 81 scores came from an earlier QA build and host sample. The new original-build measurements above establish this stage's baseline; the earlier scores are not silently treated as paired measurements.

Retained numeric evidence, including exact timings, settings, script execution, unused-JS diagnostics and CPU benchmark indices: [first comparison](performance/lighthouse-first-comparison.json), [repeat comparison](performance/lighthouse-repeat-comparison.json). Full raw Lighthouse files are local `/tmp/vf-perf-{before,after,before-repeat,after-repeat}/<route>.json`; `/tmp` evidence is ephemeral, so the versioned summaries preserve the important fields.

### Observatory investigation

The first optimized run's LCP was the unchanged scientific premise paragraph. Its breakdown recorded **451 ms TTFB and 2,661 ms render delay**, with roughly **1,588 ms Style & Layout** versus 371 ms in the first original run. The stylesheet URLs/sizes and paragraph identity remained the same, and no console error occurred. Its repeat recovered to 1.91 s LCP. The data do not establish a persistent code-induced layout regression, nor do they prove the cause was only host noise. A future trace on a controlled machine should investigate layout/font/hydration scheduling if this recurs. No data, chart geometry or page layout was rewritten to hide this result.

## Profiling findings and surgical changes

### Audio ownership

Before changes, the root preference provider imported AudioProvider, which imported AudioEngine and the parsed recording catalogue. The original shared chunk was **123,643 decoded bytes / 36,192 encoded bytes** and appeared on all four routes. V8 samples assigned self-time to this chunk; it was a measurable shared startup cost, although not the only or dominant source of all blocking.

AudioProvider now imports the engine **type only**. It retains one persistent owner and the same route/visibility/disposal behavior. Soundscapes supplies the constructor synchronously when its controls first use audio, so the engine/catalogue code belongs to that route. Volume, mute, chosen habitat and layers remain on the persistent engine across client navigation; route exit still closes playback/context/buffers. No asynchronous import was inserted between a play gesture and `AudioContext.resume()`.

The catalogue keeps strict validation, including six entries, habitat pairs, IDs, dates, hashes, local-path restrictions, positive durations/bytes, URLs and waveform ranges. Its implementation uses [Zod Mini's functional API](https://zod.dev/packages/mini) from the already installed Zod 4.6.5 to permit unused schema code to be eliminated. Scientific dataset/species schemas and their server-side validation remain regular Zod.

A new browser regression checks that an About visit does not load recording metadata, a later Soundscapes visit can play, and volume/habitat survive leaving and returning. Existing tests cover explicit consent, hidden-tab pause, seek/loop clocks, failure and context closure.

### Preferences and hydration

The stored preference document has exactly three fields. Its browser reader now checks that it is an object with exactly those fields, version 1 and two booleans; malformed, unknown, incomplete and stale inputs still return defaults. The equivalent strict Zod reference is retained in `features/preferences/contract.ts` and imported only as a type by the browser store. Tests compare the lightweight reader with that reference across valid combinations and invalid representations.

On a fresh/default visit the provider no longer publishes an identical default state during hydration. Saved differing preferences still hydrate and apply, OS media listeners still work, storage remains optional, and controls retain their semantics. This avoids a redundant notification/render of all subscribed preference consumers; it does not remove accessibility preferences or their validation.

### GSAP, ScrollTrigger and Lenis

GSAP and ScrollTrigger stay in the homepage controller because the existing progress, masks, transitions and native-scroll enhancements need them. Chart and species fades retain their current conditional GSAP loading. No motion was disabled simply to improve a score.

Lenis is imported only when the existing desktop eligibility conditions are met: width ≥1024, height ≥800, fine/hover pointer and allowed motion. Mobile/compact viewports already use native scrolling and now avoid downloading Lenis. A media-query generation guard prevents stale import completion; the existing GSAP context owns cleanup and reinitializes when the constructor becomes available. Ordinary scrolling works immediately while enhancement loads. There is still one scroll owner and one GSAP ticker connection, with no second RAF or scroller proxy.

### Three.js, R3F, Drei and shaders

The large scene renderer remains behind the existing explicit “Explore in 3D” activation. Type-only scene references and the small portal shell do not import Three.js/R3F/Drei at startup. The original large renderer bundle was approximately 927 KB decoded, so preserving its separate ownership matters. No scene geometry, shader, adaptive DPR, context-loss recovery or fallback was replaced. Both startup profiles confirm zero canvas; the production scene regressions exercise activation, resize, low-resource mode, context loss and offscreen/route cleanup.

### Images, fonts and expensive render paths

The Himalayan opening image retains eager loading and `fetchPriority="high"`; other imagery stays responsive/lazy through Next Image. The local normal Archivo font remains preloaded, italic remains unpreloaded. No image, font, preload, quality, crop or CSS token was changed. The captured Lighthouse render-blocking CSS inventory is unchanged.

React/Next framework chunks account for approximately **119,821 encoded bytes** before route code in the profiles. Replacing hydration boundaries broadly to remove that framework cost would exceed this focused stage. Server editorial children already remain server components. Observatory geometry uses D3 modules and a bounded 51-point series; pointer inspection and sound waveform updates are interaction work rather than the measured no-input startup. No speculative memoization, virtualization, delayed reading UI or blanket scroll-controller delay was introduced.

### Elephant wording

Verified `data/processed/species.json` and the homepage's selected `african-forest-elephant` record: **African forest elephant, Loxodonta cyclotis**. Its image and cited communication paragraph already used that species. Corrected only the inconsistent “Asian elephant” phrase in the unavailable-recording note.

## ESLint investigation

Read the installed Next 16.4 ESLint guide and current primary [typescript-eslint support documentation](https://typescript-eslint.io/users/dependency-versions/). Read-only npm metadata found:

| Package | Current relevant constraint |
| --- | --- |
| ESLint 9.39.5 | Supports this Node 24 runtime |
| eslint-config-next 16.4.0 | ESLint ≥9; depends on typescript-eslint ^8.56 |
| @typescript-eslint/parser latest 8.71.1 | TypeScript ≥4.8.4 **<6.1.0**; project is **7.0.2** |

[Exact metadata receipt](performance/lint-peer-metadata.json). The maintained parser does not declare compatibility with the installed compiler. A supported complete TS/TSX lint gate is therefore still unresolved. No forced peers, legacy peer flags, dependency downgrades, installation, package-manifest change or lockfile change occurred.

Once the parser declares support for this compiler, the appropriate configuration is Next's flat `eslint-config-next/core-web-vitals` plus `eslint-config-next/typescript`, ignoring generated `.next`, `.next-dev`, Python environments and raw data. A JS-only linter would not fulfill the missing TSX gate; an unexecutable config was not added to imply completion. TypeScript, contract tests and the React review checklist provide current verification but do not replace linting.

## Verification and reproducibility

The final optimized build compiled successfully, passed its TypeScript step and completed **17/17 static generation tasks**, retaining every route and six generated species details. A subsequent original-source build was used only for the repeat baseline; the optimized source and its matching build were preserved in `/tmp`, checked for concurrent changes and restored before final tests.

- Standalone `npm run typecheck`: passed.
- Foundation assertions: **28/28 passed**, including the new preference/reference equivalence and 17 malformed-catalogue mutations. `npm run test:foundation` also passed; Node's process-isolated output summarized eight files, so `--test-isolation=none` was used to retain individual assertion counts.
- Scientific bundle validation: passed, **366 index records, six species, two population records, six stories**.
- Visualization assertions: **16/16 passed**, including independent raw CSV comparisons and all 9,282 supported series/date-range combinations.
- `git diff --check`: passed. Scientific export SHA-256 remains **36b87bf96cf579f6bcf5e9b97157573e897de62e65c7829bb9b3b460017d670c**; no `data/`, media or font asset changes.

### Commands

Use the existing Node 24 installation on PATH (the environment's default Node is older):

```sh
export PATH="/home/salman/.npm/_npx/538786c08bcb9442/node_modules/node/bin:$PATH"
npm run build
npm run start -- --port 3002
node scripts/profile-startup.mjs http://127.0.0.1:3002 <output.json>
```

Lighthouse command, run sequentially for `/`, `/species`, `/data`, `/soundscapes`:

```sh
CHROME_PATH="/home/salman/.cache/ms-playwright/chromium-1248/chrome-linux64/chrome" \
node /home/salman/.npm/_npx/1722e863ebfd623b/node_modules/lighthouse/cli/index.js \
  http://127.0.0.1:3002/<route> --preset=perf --form-factor=mobile \
  --only-categories=performance,accessibility,best-practices \
  --output=json --output-path=<report.json> --quiet \
  --chrome-flags="--headless --no-sandbox"
node scripts/summarize-performance.mjs <before-directory> <after-directory> <summary.json>
```

Checks:

```sh
npm run typecheck
npm run test:foundation
node --import tsx --test --test-isolation=none tests/foundation/*.test.ts
npm run data:validate
node --import tsx --test --test-isolation=none tests/visualizations/*.test.ts
PLAYWRIGHT_JSON_OUTPUT_FILE=test-results/performance-optimization.json \
  node node_modules/@playwright/test/cli.js test \
  --config=playwright.production.config.ts \
  --output=test-results/performance-optimization --reporter=list,json
```

Initial sandboxed builds/server starts failed with local-port `EPERM`; a cached Turbopack error persisted on the first retry. Local-process access and clearing only generated `.next/cache` allowed the builds and browser tools to run. These environment failures are not counted as passing builds. Lighthouse's initial overlapping attempt was stopped and replaced by a completed sequential run. A sandboxed visualization run stalled at the Python stdin cross-check after 13 assertions; it was stopped, then all 16 assertions passed with local-process access. No failed or incomplete attempt is counted as a successful full suite.

## Remaining limits

- Startup byte savings are verified, but the homepage has minimal headroom and eligible desktop sessions additionally load Lenis. This is a mobile-profile budget result.
- Blocking remains material, especially variable Explorer and Observatory layout/hydration work. Investigate on a controlled machine before declaring a sustained timing improvement.
- INP, physical-device GPU/thermal behavior, Safari/Firefox and real assistive-technology sessions remain unverified.
- ESLint's compiler compatibility gap remains open; scientific/asset authorization gaps documented in the earlier audit remain unchanged.

## Final browser verification and stop state

**80/80 production Playwright tests passed in 7.0 minutes**, with zero failed, skipped or flaky tests. The run covers all routes/six species details, filters/history, data charts/downloads, static fallback/reflow, keyboard/modal focus, reduced-sensory preferences, audio consent/clocks/navigation persistence, Lenis ownership and WebGL activation/recovery/cleanup. Result file: `test-results/performance-optimization.json`.

The new late-visit regression confirms that recording code is absent from an initial About visit and that the same audio engine retains habitat and volume after visiting another route. All 15 accessibility scenarios passed, including the route/state axe scans and seven viewport reflow checks. These automated results do not certify formal WCAG conformance.

The final source and build are the optimized versions, not the temporary repeat-baseline source. Review-owned production servers were stopped. This targeted stage is complete; no hosting, deployment or follow-on redesign was performed.
