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

Research remains in `data/` and `docs/research/`. Application code is under `src/`. Wildlife media is not cleared; the routes show factual text and evidence gaps. No hosting or deployment is configured.
