# VANISHING FREQUENCIES

**The World Is Getting Quieter.** Local wildlife documentary foundation with reviewed scientific data.

Start with [project rules](docs/PROJECT_RULES.md), [current status](docs/STATUS.md), and the [local development handoff](docs/development/foundation.md).

```bash
nvm install
nvm use
npm ci --strict-peer-deps --engine-strict
npm run dev
```

Open **http://127.0.0.1:3000**. Node 24.21.0 and npm 11 are required by the pinned stack. nvm is optional; another runtime manager can select the same version.

```bash
npm run test:local
npx playwright install chromium
npm run test:browser
npm run build
```

Research remains in `data/` and `docs/research/`. Application code is under `src/`.
The complete static homepage includes eight editorial chapters, seven individually
licensed photographs, a sourced index figure and conservation field notes.
Read the [static homepage handoff](docs/development/static-homepage.md) for media
credits, integration hooks and verification. Audio remains unavailable.
The homepage now adds preference-aware GSAP/ScrollTrigger/Lenis motion, an
explicit whale aperture, bounded image pinning and a reading margin. Read the
[motion handoff](docs/development/motion-system.md) for lifecycle ownership,
native/reduced-motion fallbacks and local input checks.
No hosting or deployment is configured.
