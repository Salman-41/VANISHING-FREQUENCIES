# Local Next.js foundation

**Implemented 2026-10-08.** Continue in this existing repository. The rules' historical `./vanishing-frequencies` label does not require moving or nesting the workspace. Research, schema, raw input, citation and processed artifact files are preserved.

## Runtime and installation

Use Node **24.21.0 LTS**, npm **11.19.0** (the verified bundled toolchain). `.nvmrc` selects this Node version. Node 20 on this machine is too old for Drei's transitive `camera-controls@3.1.2`, which requires Node ≥22 and npm ≥10.5.1. Project engines select Node 24 and npm ≥11. Consult the [official Node release table](https://nodejs.org/en/about/previous-releases).

With an existing nvm installation:

```bash
nvm install
nvm use
npm ci --strict-peer-deps --engine-strict
npm run dev
```

Run these commands from the repository root. The development server binds only `127.0.0.1:3000`. No environment file, account, database, API key, hosting provider or deployment is required. Do not use `--force` or `--legacy-peer-deps` to hide compatibility errors.

This stage inspected official npm registry metadata before installing the pinned packages in `package.json`, then ran `npm install --strict-peer-deps --engine-strict` under the compatible runtime. Exact declarations, optional peers and verification date are in [dependency-compatibility.json](dependency-compatibility.json); transitive versions and integrity are in `package-lock.json`. React Native/Expo, Sass, OpenTelemetry, Vue, Nuxt and Immer peers are optional; they are not required by this web foundation. Next minimum engine alone does not describe every installed dependency's runtime requirement.

For this session, the official Node archive was extracted outside the repository at `/tmp/vf-node24/node-v24.21.0-linux-x64`. Commands used:

```bash
export PATH="/tmp/vf-node24/node-v24.21.0-linux-x64/bin:$PATH"
npm install --strict-peer-deps --engine-strict
npx playwright install chromium
```

The `/tmp` toolchain is session-local, not a permanent runtime installation. Future sessions should select the same Node version with their existing runtime manager. The first installation under Node 20 reported the camera-controls engine mismatch; the final strict installation under Node 24 passed. npm reported zero audit vulnerabilities at that point, not a permanent security guarantee.

## Local commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local development, native scroll, `.next-dev` output |
| `npm run build` | Local production compilation, built-in TypeScript check, prerendering; `.next` output |
| `npm run start -- --port 3001` | Local production server for review after building |
| `npm run typecheck` | Strict application, research contracts, scripts and test TypeScript |
| `npm run test:local` | Typecheck + existing Python/contracts/species tests + foundation unit tests |
| `npm run test:browser` | Chromium route, menu, citation, 404, mobile and preference checks |
| `npm run test:browser:production` | Build locally, then run the same checks against local production on port 3001 |
| `npm run check:dependencies` | Entire installed dependency tree / peer resolution |
| `npm run data:validate` | Validate the saved research export without rebuilding |

Browser tests start or reuse the server at `127.0.0.1:3000`. If a different local app occupies that port, stop that app or explicitly change the browser configuration and base URL together. One worker avoids unnecessary compilation contention. The multi-route cold-start check has an extended timeout. Browser traces are saved only on failure in ignored `test-results/`. Run `npx playwright install chromium` once when that browser is missing; system browser dependencies may also be necessary on a different machine.

The existing Python suite requires the project's `.venv` and pinned data preparation dependencies; see [pipeline instructions](../data/pipeline-instructions.md). It builds in temporary outputs. `npm run data:build` is a separate reviewed data preparation operation and changes the saved artifact; the frontend setup does not call it. Dependency-lock changes legitimately affect the next pipeline build fingerprint. The existing report still identifies its original verified artifact.

## Structure and boundaries

```text
src/app/                       App Router layouts, route foundations, error/loading/404
src/components/                Shared shell, navigation and editorial primitives
src/features/research/         Server access, deterministic selectors, evidence modules
src/features/preferences/      Per-tree Zustand store, Zod persistence, preference controls
src/features/observatory/      Edition-safe D3 coordinate utilities
src/features/audio/            Lazy Web Audio session interface and clearance gate
src/features/motion/           Opt-in GSAP/ScrollTrigger/Lenis import interface
src/styles/                    Reusable design token definitions
src/assets/fonts/              Local Archivo binaries, OFL, acquisition hashes
public/licenses/               Actual bundled font license
tests/foundation/              Loader, selector, preference and media gate tests
tests/browser/                 Browser regression checks
```

Pages, root layout, shell, footer, claims, status, estimates and source register are Server Components. Only the modal navigation, preferences and error retry controls use client components. Server children pass through the provider; the 966 KB bundle is not passed into a client provider or fetched by the browser. `server.ts` imports `server-only` and uses React request caching, preventing shared mutable request state.

`loadLocalResearch` reads only `data/processed/biodiversity.json` and its validation report. It applies the existing joint Zod/citation validator, requires report status `passed`, matching fingerprint, exact export SHA-256 and byte size. Missing or tampered evidence fails closed into the error boundary. No fallback guesses, legacy held records, occurrence-to-abundance conversion, remote API or database is introduced.

The original schema's Node-style `./species.schema.js` specifier is mapped to its existing TypeScript source in `next.config.ts`, using [Turbopack resolveAlias](https://nextjs.org/docs/app/api-reference/config/next-config-js/turbopack#resolving-aliases). The research schema itself is unchanged. Keep the default Turbopack commands; an unconfigured Webpack command would need its own equivalent alias. No type errors are ignored. Next may regenerate `next-env.d.ts` and generated route typings during dev/build; these are framework-owned outputs. The generated `AGENTS.md` points future agents to the installed version's documentation.

## Route scope

- `/`: readable opening and eight chapter anchors, cited habitat and intervention samples, exploration links. The single static line is decorative, not an acoustic waveform measurement.
- `/species`: all six reviewed species in narrative order, sourced status and ecological descriptions. Filters are a later feature.
- `/species/[slug]`: one reusable template and six static parameters; unknown slugs return 404 before streamed content. Habitat, threats, historical population evidence/gaps, qualitative scoped trends, sound knowledge, conservation and evidence gaps remain readable.
- `/soundscapes`: source-backed sound descriptions and clear unavailable-recording states; no fake Play controls, audio, waveform or archive embed.
- `/data`: semantic global 2024 annual table and separate 2026 endpoint table; edition, baseline, scope, bounds/gaps, versions, source dates and licenses. Other licensed annual regional/freshwater series remain in the validated bundle for later controls. No chart interpolation, edition delta or sonification. Table display limits decimal places; original values are untouched.
- `/about`: original editorial premise, methods, selection limits, review date and exploration links.
- `/sources`: every referenced page-read citation in the bundle, stable citation-ID anchors, publication/access dates, reviewed locations, reuse notes and unresolved access requirements.
- `/credits`: actual bundled Archivo license and data attribution; no invented contributors or candidate media presented as used assets.

These are usable route foundations, not completion of the cinematic documentary, signature interactions, searchable explorers or interactive charts.

## Design, accessibility and performance

The Listening Margin palette, fluid typography, content margins, 4/8/12-column tokens, space scale, focus ring and motion tokens come from the existing design system. Native scrolling is the baseline. Archivo Latin upright is preloaded locally; the real italic is loaded on use. Font files are unmodified and have source/version/hash records. Other writing systems use fallbacks pending any reviewed additional subset acquisition.

Navigation uses a named native modal dialog with ordinary links, explicit Tab/Shift-Tab wrapping, Escape/Close, native inert background, scrollable long content and restored opener focus. Route navigation focuses the newly committed main region; chapter links retain normal anchor behavior. A `noscript` navigation preserves page access without hydration. All pages have language, unique metadata, a skip link, one H1 and semantic landmarks. Source disclosures are native details; essential date, context and source links are outside them. Standalone controls target 48 px; tables scroll within a labeled region. Text and controls use opaque high-contrast palette pairs.

Preferences default to no autoplay and native scroll. CSS handles OS reduced motion before hydration; OS reduction or user “Read without motion” wins. Media and motion choices are independent. Versioned storage rejects malformed settings and fails safely when storage is blocked. No visual motion runs before reading preferences are established. A future enhancement must check preferences, remove its own listeners/tickers/pinning on interruption, and preserve native keyboard/touch/anchor behavior.

GSAP, @gsap/react, ScrollTrigger and Lenis are available through lazy feature imports; the loader registers GSAP plugins but starts no global animation or Lenis instance. Three.js/Fiber/Drei are installed for later reviewed features and absent from the foundation entry graph. D3 modules provide pure observed-year scales and reject mixed edition/series input; this is not a population generator.

The Web Audio interface creates no context/request on import and requires explicit user invocation plus acquired, cleared, item-licensed audio and a local path. It cancels pending playback, stops on hidden documents and disposes its context/listener. Future player components must also dispose on route/chapter exit, implement volume/pause/stop, expose descriptive equivalents and credit, and bind the local path to a reviewed media ledger. No current recording satisfies clearance; no playback UI is active. Live decoding, screen-reader audit and motion/WebGL performance await those later features.

## Review story and limits

User story: open the documentary, navigate to a selected animal, read the scoped evidence and follow its publication; inspect separate index editions; leave through an accessible menu/footer. Trace: browser route → Server Component → local checked file/report → existing Zod + citation integrity → deterministic selector → semantic HTML → ordinary citation link. No backend service is needed.

The Chromium suite checks the populated URLs, console/hydration errors, absence of remote page requests, focus containment/restore, 404s, dated measurements, source links, table records, 320 px reflow, reduced-motion precedence, persisted lighter-media choice and evidence without JavaScript. These results do not certify full WCAG conformance, assistive technology behavior across devices, audio playback or GPU performance. Error components are implemented; the loader's failure paths are unit-tested. A browser fault-injection audit of error recovery remains separate future work.

Read [STATUS](../STATUS.md) for the exact completed command results. No hosting, deployment, domains, cloud integrations, paid services or scientific input changes belong to this foundation.
