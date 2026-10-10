# QA known issues and limits

**Updated:** 2026-10-10

## Open issues

1. **ESLint is not configured.** No project lint script/dependency/config exists. The system ESLint is 6.4.0 and cannot run without a config. The installed Next 16.4 guide's supported flat config was investigated, but strict installation was blocked by dependency peer ranges: ESLint 10 conflicts with `eslint-plugin-import`'s current declared peer range; ESLint 9 encounters an optional `@typescript-eslint/utils` TypeScript `<6.1` peer range while the project uses TypeScript 7.0.2. Avoiding forced peer installation left the repository dependency manifest unchanged for this check. Establishing a supported TypeScript 7-compatible lint stack is follow-up work.

2. **Performance needs follow-up.** Final Lighthouse mobile scores are 76–81; TBT is 680–1,010 ms. Latest sampled LCP/CLS pass the targets, but a homepage run varied between 2.6 s and 2.0 s around the priority-hint fix. The score and timings are lab samples, not a stable field measurement. Initial JavaScript exceeded the 200 KB project budget on homepage, Explorer, and Observatory in the preceding constrained audit.

3. **INP and field Web Vitals are unverified.** Lighthouse's local lab run did not measure INP. No CrUX/PageSpeed/hosted source or real-user telemetry was used, consistent with the local-only requirement.

4. **Physical device and assistive-technology coverage is outstanding.** Browser tests used Chromium/Playwright emulation. Safari, Firefox, physical phones/tablets, VoiceOver, NVDA, TalkBack, switch control, formal conformance review, and prolonged low-memory/GPU testing remain open. Automated accessibility scans are not a certification.

5. **GPU performance is functionally exercised, not benchmarked on hardware.** Browser tests verify light scene budgets, fallback, context loss/recovery, offscreen disposal and route cleanup. Physical GPU frame cadence and long-duration memory pressure remain unmeasured.

6. **External citations and rights were not all live-revalidated.** The website exposes sourced citations and credits; this local pass checks internal links and attribution completeness represented by the existing tests. External institutions' links, current policies and live rights pages were not comprehensively retested.

## Fixed during QA

- Added a Next.js app icon using an original waveform SVG; removed the browser's missing `/favicon.ico` 404.
- Aligned the soundscape transport button's programmatic name with its visible label, including the loading, playing, and paused states. Updated associated browser expectations.
- Improved LCP resource discovery for the homepage Himalayan hero image using eager loading and `fetchPriority="high"`, as prescribed by the installed Next.js 16 image documentation. The post-change Lighthouse sample met the 2.5 s LCP target.
- Confirmed all 76 same-origin links from the audited routes resolved and all 36 rendered page images loaded with descriptive alternatives in the local audit.
