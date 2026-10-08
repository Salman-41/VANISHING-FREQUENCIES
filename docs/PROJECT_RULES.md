# VANISHING FREQUENCIES — Project Rules

**Tagline:** The World Is Getting Quieter.  
**Project location:** `./vanishing-frequencies` (this workspace)  
**Execution:** local development only.

## Product and technical direction

- Framework: Next.js 16, React 19, TypeScript, Tailwind CSS 4.
- Motion: GSAP, ScrollTrigger, and Lenis.
- 3D: Three.js, React Three Fiber, and Drei.
- Sound: Web Audio API; use D3 where it materially helps data visualization.
- Art direction: original, dark editorial wildlife documentary. Do not copy another site's visual identity or use unlicensed assets.
- Use real, traceable scientific information only. Keep source, date, geography, method, and uncertainty with every statistic. Never fill missing values with guesses.
- The Living Planet Index (LPI) is an index of average relative change in monitored vertebrate populations. A reported percentage decline in the index is not the percentage of individual animals that disappeared, nor the share of populations or species declining.
- Occurrence/observation counts are records of observations, not abundance estimates. Do not present them as population sizes or trends without a validated abundance method.
- Do not use restricted IUCN Red List data without appropriate authorization. Do not infer permission from public visibility or API access.

## Accessibility and performance

- Meet WCAG 2.2 AA as the target: keyboard operation, visible focus, semantic structure, sufficient contrast, captions/transcripts for audio/video, and reduced-motion support.
- No essential information may depend only on sound, animation, color, or 3D interaction.
- Provide a low-motion and low-bandwidth experience; avoid autoplay audio and provide clear playback controls.
- Keep data and media payloads bounded, lazy-load noncritical media, optimize responsive images/audio, and profile animation/rendering on representative mobile hardware.

## Workflow constraints

- No hosting, deployment, domain, or cloud setup tasks.
- Before changing anything, each future agent must inspect the existing files and current project state.
- Each project stage must update `docs/STATUS.md` with completed work, evidence, limitations, and next access needs.
- Keep source data provenance and asset rights metadata alongside acquired data. Recheck each asset's specific license before use.
