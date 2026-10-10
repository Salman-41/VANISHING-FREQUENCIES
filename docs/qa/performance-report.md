# Local performance report

**Date:** 2026-10-10  
**Build:** Local Next.js production build, served at `127.0.0.1:3002`.  
**Audit:** Lighthouse 13.5.0, Chromium 156.0.8078.4, mobile performance preset, localhost only. The selected categories were Performance, Accessibility, and Best Practices. Lighthouse ran without a hosted endpoint or analytics service.

Lighthouse 13.5.0 was invoked ephemerally with `npm exec --yes --package=lighthouse@13.5.0 -- lighthouse --version`; it was not added to the project dependencies. Reproduction used `npm run start -- --port 3002`, then the CLI against each localhost URL:

```sh
CHROME_PATH="<Playwright Chromium binary>" node "<Lighthouse 13.5.0 CLI>" http://127.0.0.1:3002/<route> \
  --preset=perf --form-factor=mobile \
  --only-categories=performance,accessibility,best-practices \
  --output=json --output-path=/tmp/vf-lighthouse-<route>-final.json \
  --quiet --chrome-flags="--headless --no-sandbox"
```

The final post-priority homepage sample is `/tmp/vf-lighthouse-home-final2.json`; the other route files are `/tmp/vf-lighthouse-species-final.json`, `/tmp/vf-lighthouse-data-final.json`, and `/tmp/vf-lighthouse-soundscapes-final.json`. These raw reports remain in the local `/tmp` directory rather than the project tree.

## Lighthouse measurements

Scores are Lighthouse's 0–100 mobile lab scores from one completed run per route. The homepage received an additional run after its LCP image was prioritized; the table uses that latest run.

| Route | Performance | Accessibility | Best Practices | LCP | CLS | TBT |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| `/` | 76 | 100 | 100 | 2.0 s | 0.002 | 1,010 ms |
| `/species` | 79 | 100 | 100 | 1.7 s | 0 | 880 ms |
| `/data` | 81 | 100 | 100 | 1.8 s | 0 | 680 ms |
| `/soundscapes` | 81 | 100 | 100 | 1.8 s | 0 | 690 ms |

The latest observed lab LCP and CLS values meet the requested 2.5 s and 0.1 limits on these four sample pages. Lighthouse does not provide field INP in this local run, so the **INP ≤200 ms target is unverified**. Total Blocking Time is a separate lab diagnostic, not INP; the 680–1,010 ms results indicate substantial main-thread work remains. Scores are modest on Performance despite acceptable latest LCP/CLS samples.

The homepage's first run after the icon/accessibility fix reported LCP 2.6 s and performance 71. Inspection identified the opening Himalayan image as LCP and reported that its preload was not priority hinted. Using the installed Next.js 16 Image guide, the image was changed to eager loading with `fetchPriority="high"` (instead of a separate preload). A repeat run measured LCP 2.0 s and performance 76; Lighthouse confirmed the resource is discoverable and priority hinted. Lighthouse runs vary, so the 0.6 s difference is an observed before/after sample, not a controlled statistical guarantee.

The missing favicon and soundscape button name issue found during the initial audits were corrected. On the final four-route sample there were no Lighthouse console errors, Accessibility scored 100 on every route, and the label-content-name mismatch audit had no failing nodes. Best Practices scored 100 on every route.

## Other recorded performance evidence

The preceding responsive audit recorded isolated constrained Chromium cold-load observations at 375×812, DPR 2, 4× CPU slowdown, 200,000 B/s down, 93,750 B/s up, 150 ms latency and disabled cache. Those observations used build `Tsam_SASQOvzU-0mVQfo-` before the small QA fixes, so they are retained as historical context rather than presented as a new measurement:

| Route | LCP candidate | Non-input shift sum | Encoded JavaScript | All encoded bodies | Longest startup task |
| --- | ---: | ---: | ---: | ---: | ---: |
| `/` | 1.056 s | 0 | 240,259 B | 545,699 B | 325 ms |
| `/species` | 0.764 s | 0 | 224,198 B | 518,357 B | 312 ms |
| `/soundscapes` | 0.840 s | 0 | 190,459 B | 422,269 B | 297 ms |
| `/data` | 0.716 s | 0.002836 | 229,059 B | 378,637 B | 357 ms |

The homepage, Explorer and Observatory exceeded the documented 200,000 B initial-JavaScript ceiling by 40,259 B, 24,198 B and 29,059 B respectively. These historical metrics use a distinct observer/profile from Lighthouse and are not field Core Web Vitals. The shift sum is not a full field-session CLS measurement.

## Performance issues to address in a later engineering pass

- Lighthouse reports high blocking work on all four pages, with 1.01 s homepage TBT in the latest run. The lab INP target cannot be judged from these runs.
- Lighthouse identifies unused JavaScript and image byte savings on some routes. Reducing shared client bundles and auditing image delivery require careful profiling to avoid regressing the interactive documentary.
- Lighthouse browser cache diagnostics on `/species` and `/data` report `Cache-Control: no-store` behavior. These are dynamic routes and the current local QA did not alter response caching policy.
- The constrained profile and WebGL tests do not establish performance or memory behavior on physical low-end devices. No long-duration heap snapshot or real GPU benchmark was performed.

No passing score or field Core Web Vital is inferred from a lab score. Run reports were written to temporary files outside the project workspace; the exact profile, route, build and measurements are recorded here.
