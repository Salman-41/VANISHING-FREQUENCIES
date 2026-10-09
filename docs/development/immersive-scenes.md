# Optional immersive environments

**Implemented 2026-10-09.** This stage adds interpretive scenery within the existing chapter image frames. It does not change the scientific narrative, source records, populations, chart values, approved photographs, routes, or the existing layout hierarchy.

## Experience and scientific boundaries

- Chapter 01: **Explore in 3D** replaces the image view with original generated relief, contour lines, three depth layers, distance fog, directional shading, snow caps and sparse snow points. The real Himalayan photograph remains the default, with its original caption and credit link.
- Chapter 02: the same renderer provides underwater depth, suspended points, soft mathematical caustic patterns and light shafts. **Send a visual pulse** draws a finite expanding ring. These are silent illustrations, not whale calls, hydrophone measurements, a sonar location, surveyed bathymetry or an environmental reconstruction.
- **Follow the water** in the mountain frame makes a reversible 600 ms transition: a feathered horizontal waterline, changing fog/light, flattened relief and a bounded camera path. **Resume scroll scene** restores the current scroll state; **Trace the source** provides the reverse study in the ocean chapter. The mountain also dissolves over its final 17% of frame travel. The ocean receives the underwater state. The editorial gap remains ordinary document flow, without another pinned section.
- **Return to photographs** removes the renderer. Captions explicitly identify the photograph view. The generated scenery is labeled independently; no fog, invented animal, terrain composite or simulated light is baked into the credited wildlife photograph.
- No anatomically reviewed, redistribution-cleared whale GLB is present in the approved asset inventory. The existing NOAA/Lisa Conger public-domain photograph remains the verified whale reference. A whale mesh was therefore not fabricated or downloaded from an unreviewed source. No GLTF/GLB payload or loader is required in this implementation.

## Ownership and lifecycle

| File | Responsibility |
| --- | --- |
| `src/features/immersive/experience.tsx` | Small client shell, explicit opt-in, shared visibility selection, controls, preference gating, error boundary, retry and photo fallback |
| `src/features/immersive/renderer.tsx` | Deferred R3F Canvas, Drei perspective camera, instanced terrain, points, scoped ScrollTrigger/GSAP, DPR adaptation, GPU lifecycle |
| `src/features/immersive/shaders.ts` | Original terrain, atmosphere/waterline and particle GLSL |
| `src/features/immersive/policy.ts` | Deterministic geometry inputs, quality limits and bounded scene interpolation |
| `src/styles/immersive.css` | Frame overlay, labeled controls, reserved space, responsive and preference fallbacks |
| `tests/browser/immersive.spec.ts` | Real software-WebGL browser checks, including disabled WebGL and actual context loss |
| `scripts/measure-scenes.mjs` | Reproducible, local-only production observation and screenshots |

The server `MediaFigure` explicitly opts in only the mountain landscape and ocean portrait. Repeated uses of the same photo in the opening, species list and closing remain untouched. A single enhancement owner discovers these two slots and mounts **at most one Canvas** into the most visible frame. Leaving both frames or hiding the document unmounts it. Entering the other chapter creates a fresh renderer; no global GPU cache accumulates across routes.

There is no additional Lenis instance, scroll listener loop, OrbitControls, scroller proxy or manual global ticker. A scoped `useGSAP` ScrollTrigger reads the same window position synchronized by the existing motion controller. It updates mutable camera/uniform inputs and requests an R3F demand frame. Canvas measurement disables scroll-driven bounds updates because this decorative scene performs no pointer raycasting. GSAP owns only the finite transition and pulse tweens. Their progress uses elapsed wall-clock time, so a GPU stall cannot extend the intended 600 ms / 1.8 s interactions through global ticker lag smoothing. All triggers, contexts, observer subscriptions, ready callbacks and control references are disposed on unmount. Application scroll callbacks mutate refs, not React state; visibility changes update React only at frame boundaries. Fiber retains ownership of its internal Canvas measurement.

The Canvas uses `frameloop="demand"`; idle scenery does not continuously animate. Snow/silt and caustic phase move with the reader's scroll position. The fullscreen navigation temporarily switches rendering to `never`, then invalidates one frame on close. The document's original motion controller retains all navigation and scroll ownership. No 3D object consumes wheel or touch events.

Declarative R3F geometries/materials are locally owned and automatically disposed. Installed Fiber 9.8.1 teardown disposes its owned renderer and calls `forceContextLoss`. The browser suite checks the old context actually becomes lost after returning to photos. No unmanaged texture, render target, external scene primitive or perpetual RAF is created. Shader uniforms are mutated through the **live material refs**, because constructor-prop uniform objects are not reliable runtime targets under reconciliation.

## Resource policy

| Resource | Balanced desktop | Mobile / constrained / Lighter 3D |
| --- | --- | --- |
| Terrain grid | 96 × 64 cells, instanced three times | 48 × 32 cells, instanced three times |
| Rendered triangles | 36,866 including sky quad | 9,218 including sky quad |
| Particles | 240 points in one draw | 80 points in one draw |
| Draw calls / geometries | 3 / 3 | 3 / 3 |
| Textures / render targets | 0 / 0 | 0 / 0 |
| DPR ceiling | 1.5, with a 1.6M-pixel target | 1, with a 450K-pixel target |
| Camera travel | Small translation, no zoom flight | Reduced translation |

The quality policy also considers memory/CPU hints conservatively. These hints do not measure GPU speed. Recognized software renderers (SwiftShader, llvmpipe, softpipe) additionally cap DPR at 0.75 and target 300K pixels. Active frame intervals can reduce DPR in 25% steps down to 0.5; quality does not oscillate upward during an interaction. The pixel targets apply within the existing capped page frame; the 0.5 DPR floor can exceed a target on an unusually large external frame. Resize recalculates the budget. The Canvas DPR prop has one React state owner, updated only when a budget or measured quality tier changes; this prevents Canvas reconciliation from resetting imperative DPR changes during a control action. The **Lighter 3D** selector is independent of the site's **Lighter media** setting: the latter disables this optional payload entirely.

No shadow maps, postprocessing chain, environment maps, downloaded textures, video, model decoder or offscreen compositing targets are used. A single instanced relief draw changes its shape/material with the waterline, instead of rendering two full scenes to textures. Custom GLSL is justified for contours, fog, the shared waterline, caustic-inspired patterns and the finite pulse. Drei supplies the aspect-aware camera only.

## Failure and accessibility behavior

- JavaScript disabled: the complete existing documentary, photos, links, citations and data table remain server rendered. No Canvas is present.
- No opt-in: no Three/R3F/Drei rendering code is requested. A failed import or renderer is isolated from the document by its own error boundary.
- Reduced motion, reduced data, Read without motion or Lighter media: the renderer is absent. Preference changes remove it immediately and restore the photo. Unavailable interaction focus returns to its chapter or the retained photo control.
- GPU creation is verified through the real WebGL2 renderer, live context and capabilities. Creation errors, shader failures or context loss return to the photo and expose a polite status plus **Retry 3D study**. Context loss uses an explicit fresh-mount recovery, avoiding automatic restart loops on exhausted devices.
- Controls are native buttons/selects, have keyboard/touch behavior and retain the site's focus treatment. The Canvas is decorative and outside the accessibility tree. Information is never conveyed solely by the shader, sound or color. Frame dimensions remain reserved; enabling controls may expand normal flow after a user action.
- Pointer events pass through the scene. There is no dragging requirement, camera pointer tracking, audio, flash, fake depth/temperature scale, scientific value interpolation or statistics animation.

## Local reproduction

Use the existing Node 24.21.x/npm 11 toolchain. No dependencies were added or upgraded.

```bash
npm run test:local
npm run test:scenes
npm run test:browser:production
```

For the optional observation, build and start a local production server in one terminal, then measure from another:

```bash
npm run build
npm run start -- --port 3001
# separate terminal
npm run measure:scenes -- http://127.0.0.1:3001
```

The script accepts localhost/127.0.0.1 only. It writes four screenshots and [the raw observation](review/webgl-observation.json). It records the actual browser/GPU, profile, frame intervals, long tasks, DPR, draw counts, idle frames and estimated compressed JS sizes. The desktop profile emulates eight logical cores to exercise the balanced branch; the mobile profile emulates two cores, touch and 4× CPU throttling. Both use **SwiftShader software WebGL**, not physical mobile GPUs. The measurements are browser frame cadence, not isolated GPU timer-query results or Core Web Vitals certification. Exact completed results belong in [STATUS](../STATUS.md).

### Further qualification and asset gate

Physical integrated-GPU/mobile testing and Safari/Firefox WebGL review remain outstanding. Software-rendering success does not establish universal 60 fps. Initial JS and opt-in payload observations must be compared against the earlier design targets; a passed build does not prove the targets were met. The installed R3F implementation currently emits Three's upstream `Clock` deprecation warning; application code does not instantiate Clock, and the dependency tree was not patched.

A future whale GLB requires a recorded official source, redistribution/commercial rights, creator/license attribution, anatomical review and provenance receipt before use. Optimize its topology and textures, include a photographed fallback, and measure it on the same constrained profile. Do not silently replace the verified photograph with an unreviewed animal model. Future real bathymetry/elevation or wildlife audio would separately require licensed acquisition and a scientific review; this original scenery supplies none of those measurements.

## Implementation references checked

Reviewed [R3F demand rendering and scaling](https://r3f.docs.pmnd.rs/advanced/scaling-performance), [Canvas API](https://r3f.docs.pmnd.rs/api/canvas), and [Drei PerspectiveCamera](https://drei.docs.pmnd.rs/cameras/perspective-camera). Installed Next 16 lazy-loading and server/client guides were read before code changes, as `AGENTS.md` requires. Installed Three 0.186.1 renderer/capabilities and Fiber 9.8.1 ownership/disposal code were checked directly. The Three online cleanup manual returned a tool fetch error/404; its current web contents were **not verified**.
