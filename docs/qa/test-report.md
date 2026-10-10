# Local QA test report

**Date:** 2026-10-10  
**Environment:** Node 24.21.0, npm 11.19.0, Next.js 16.4.0, React 19.3.0, Playwright 1.64.0, Chromium 156.0.8078.4.  
**Scope:** Local production build and localhost only. No hosting, deployment, cloud services, or external data requests.

## Commands and results

| Command / check | Result |
| --- | --- |
| `npm run typecheck` | Passed before and after QA fixes. |
| `npm run test:local` | Passed: 105 tests (43 Python data pipeline, 12 data contracts, 11 species records, 23 foundation, 16 visualization); TypeScript and Observatory download freshness check passed. |
| `npm run data:validate` | Passed: 366 index records, 6 species, 2 population records and 6 stories validated. |
| `npm run data:validate-species` | Passed: 6 species and 6 measurements validated; 2 estimates eligible only with dated context. |
| `npm run build` | Passed after final changes; all app routes and six selected-species detail paths generated. `icon.svg` also generated through the Next app icon convention. |
| `npm run test:browser:production` | Passed: **78/78** production Chromium tests in 8.6 minutes. Includes scientific data/citations, filters, charts, audio, motion, navigation, responsive layouts, and WebGL fallback/context recovery. |
| `npm run test:accessibility` | Passed: **15/15** scenarios in 3 minutes. Fresh axe reports contain **41 WCAG 2.2 A/AA-tagged scans and 0 violations** (30 route scans, 8 interactive states, 3 enlarged soundscape states). `aria-valid-attr-value` and `color-contrast` remain axe incomplete results and were not counted as passes. |
| Informational and soundscape regression after the icon/accessibility fix | **8 informational tests passed** and **4 soundscape tests passed** on the final code. An intermediate run exposed outdated test names after the accessible button name changed; selectors were corrected and the final four soundscape tests passed. |
| Homepage and motion regression after the final LCP loading change | **18/18** production tests passed. |
| Site-wide local link/image pass | 14 intended routes checked (all standard routes and six selected-species details); 76 same-origin links returned below 400, 36 rendered images decoded with non-empty alt text, the app icon returned 200, and there were no page errors. The Playwright 404 test separately confirms that an unknown route returns the intentional not-found status. |
| Lighthouse mobile checks | Four representative routes measured locally. See [performance report](performance-report.md). |
| ESLint | **Not run successfully.** There is no repository ESLint script, package, or configuration. `eslint --version` reports system ESLint 6.4.0; `eslint --print-config src/app/page.tsx` reports no configuration. Strict installs of `eslint@10.12.0` and `eslint@9.39.5` with `eslint-config-next@16.4.0` failed peer resolution (the latter includes an optional `@typescript-eslint/utils` TypeScript `<6.1` peer while this project uses TypeScript 7.0.2). The install was not forced, and no lint dependencies/config were left in the project. |

## Coverage and observations

The production browser suite visits every route and species detail, verifies working source/media links, exact annual/endpoint charts and tables, date/filter query behavior, audio consent/lifecycle, reduced motion, keyboard/touch controls, loading/failure states, and WebGL loading, disposal, context loss, retry and fallback. Existing accessibility scenarios also exercise text enlargement, small/mobile layouts, no-JavaScript reading paths, fullscreen navigation focus, and reduced sensory preferences.

The responsive tests cover 18 route/state views at 320, 375, 430, 768, 1024, 1440 and 1920 px (126 combinations), plus 54 text-spacing/200% text-size combinations. They check document and content overflow, readability and interactive controls.

The route/asset pass was performed against the corrected production build. Internal links and images had no failures. The one expected HTTP 404 was the deliberately requested unknown route. Lighthouse initially surfaced a missing favicon and a soundscape button accessible-name mismatch. Both were fixed; final Lighthouse audits report no console errors and no such name mismatch. The homepage's LCP image was also given an eager high-priority request after its initial measurement; see measured follow-up below.

Scientific inputs were validated from the versioned local records; no observation counts were treated as abundance. Dataset hash and deterministic permitted download files were checked by `test:local`. No research data, citations, or source assets were changed.

## Not verified in this local stage

Physical iOS/Android devices, Safari/Firefox, formal assistive-technology certification, field INP, long-duration heap/GPU memory pressure, and sustained physical-device frame cadence were not measured. Test coverage of disposal and context loss is not a substitute for real-device memory profiling. External publisher links were checked for attribution presence and local destination handling, not revalidated against every external publisher during the offline browser runs.
