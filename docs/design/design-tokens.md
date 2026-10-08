# Design tokens — VANISHING FREQUENCIES

**System v1 · 2026-10-08 · specification only.** This document translates [The Listening Margin](creative-direction.md) and [art direction](art-direction.md) into shared names and values. Dimensions describe the interface, not scientific measurements. No CSS application, font binary, or Figma file is created in this stage.

## Naming and ownership

Use slash paths in Figma and kebab case in future CSS: `color/text/primary` → `--vf-color-text-primary`. Prefix future component names with `VF/`; use PascalCase for the corresponding TypeScript symbol. Primitive tokens hold literal values; semantic tokens alias primitives; components consume semantic tokens. Do not bake a raw hex or duration into a component variant.

| Planned Figma collection | Modes | Content |
| --- | --- | --- |
| `VF / Primitives` | `Default` | Palette, spacing, weights, stroke widths, dimensions |
| `VF / Semantic` | `Dark`, `Conservation`, `Paper` | Surface/text/link/focus aliases with valid contrast pairs |
| `VF / Responsive` | `Compact`, `Tablet`, `Desktop`, `Wide` | Reference grid and typography numbers; frames use the matching mode |
| `VF / Motion` | `Standard`, `Reduced` | Duration and distance numbers; easing strings are documented metadata if unsupported as native variables |

Figma modes represent reference states; they do not execute CSS `clamp()` or automatically determine breakpoints. Keep min/preferred/max expressions in token descriptions and use resolved values in text styles for each reference frame. Record unit/type/alias/description per token. Export colors as color values, dimensions as value+unit, durations as ms, and easing as strings; never discard units during conversion. This is a tool-independent naming plan, not a claim that an exporter/plugin is installed.

## Font families, weights and legal delivery

| Token | Value | Use |
| --- | --- | --- |
| `font/family/editorial` | `"Archivo", Arial, Helvetica, sans-serif` | All display and body text |
| `font/family/system` | `Arial, Helvetica, sans-serif` | Explicit unavailable-font fallback |
| `font/weight/regular` | 400 | Body, metadata and genuine italic scientific names |
| `font/weight/medium` | 500 | Display, links/controls, tabular estimates |
| `font/weight/emphasis` | 600 | Small table headings and short error labels; sparingly |
| `font/width/display` | 85 | Opening title |
| `font/width/chapter` | 90 | Chapter titles |
| `font/width/species` | 95 | Species headings |
| `font/width/reading` | 100 | Body, metadata and controls |

Archivo remains the chosen grotesk; originality comes from composition, width, scale and editorial rhythm. Its metadata exposes width 62–125 and weight 100–900; the distributed family is OFL 1.1. Rechecked 2026-10-08: [official distribution metadata](https://raw.githubusercontent.com/google/fonts/main/ofl/archivo/METADATA.pb), [license file](https://github.com/google/fonts/blob/main/ofl/archivo/OFL.txt). Retain copyright/license and pin the actual revision at acquisition. Use real upright and italic files; no synthesized italic or horizontal transform. Preserve the license for redistributed font derivatives. No wildlife asset rights follow from font licensing.

Future delivery: local WOFF2, swap behavior, needed language coverage only, original masters/license retained. Preload only a font needed above the fold; do not remotely embed Google Fonts or download fonts in this stage. Fallback text must wrap rather than be clipped. Set weight/width through their supported axes without simultaneously applying conflicting width settings. Use tabular lining figures for measurements/table columns; scientific names remain italic.

## Fluid type

These expressions are documentation examples for later implementation. Assumptions: root **16 px**, fluid interval **390–1440 CSS px**. Every preferred expression includes `rem`; minimum and maximum remain `rem`. Do not force the browser root to 16 px, disable zoom, or give text containers fixed heights. User font changes intentionally alter the computed scale. Formula: preferred pixel size = mobile size + (desktop−mobile) × (viewport−390)/1050, then convert the intercept to rem.

| Size token / Figma style family | CSS expression | 390 → 1440 px | Line height; weight; width; tracking |
| --- | --- | --- | --- |
| `type/size/opening` / `VF/Display/Opening` | `clamp(3.5rem, 1.4571rem + 8.3810vw, 9rem)` | 56 → 144 | 0.98 compact / 0.94 desktop; 500; 85; −0.035em |
| `type/size/chapter` / `VF/Display/Chapter` | `clamp(2.75rem, 1.5429rem + 4.9524vw, 6rem)` | 44 → 96 | 1.04 / 1.00; 500; 90; −0.025em |
| `type/size/page` / `VF/Display/Page` | `clamp(2.5rem, 1.5714rem + 3.8095vw, 5rem)` | 40 → 80 | 1.08 / 1.00; 500; 90; −0.025em |
| `type/size/species` / `VF/Heading/Species` | `clamp(2.25rem, 1.6rem + 2.6667vw, 4rem)` | 36 → 64 | 1.08 / 1.04; 500; 95; −0.02em |
| `type/size/species-row` / `VF/Heading/SpeciesRow` | `clamp(2.25rem, 1.9714rem + 1.1429vw, 3rem)` | 36 → 48 | 1.08; 500; 95; −0.02em |
| `type/size/section` / `VF/Heading/Section` | `clamp(1.75rem, 1.6571rem + 0.3810vw, 2rem)` | 28 → 32 | 1.18 / 1.15; 500; 100; −0.01em |
| `type/size/estimate` / `VF/Data/Estimate` | `clamp(3rem, 2.6286rem + 1.5238vw, 4rem)` | 48 → 64 | 1.05 / 1.00; 500; 100; tabular |
| `type/size/lead` / `VF/Reading/Lead` | `clamp(1.25rem, 1.1571rem + 0.3810vw, 1.5rem)` | 20 → 24 | 1.45 / 1.40; 400; 100; normal |
| `type/size/body` / `VF/Reading/Body` | `clamp(1.0625rem, 1.0393rem + 0.0952vw, 1.125rem)` | 17 → 18 | 1.55; 400; 100; normal |
| `type/size/meta` / `VF/Reading/Meta` | `0.875rem` | 14 → 14 | 1.50; 400; 100; normal |
| `type/size/control` / `VF/Control/Label` | `1rem` | 16 → 16 | 1.25; 500; 100; normal |
| `type/size/label` / `VF/Control/ChapterLabel` | `0.875rem` | 14 → 14 | 1.40; 500; 100; +0.08em |

Only wordmark/chapter labels are uppercase. Body links are underlined. Source labels remain at least 14 px at default settings. Limit prose to 62ch and prefer 48–62 characters; metadata wraps. Fluid typography is not evidence of accessible zoom: verify browser zoom and text-only enlargement later. A reading preference may use rem-only sizes and expanded scenes if a fluid/sticky composition cannot fit.

## Palette primitives and semantic aliases

| Primitive | Value |
| --- | --- |
| `color/palette/obsidian` | `#0B0D0D` |
| `color/palette/ivory` | `#ECEAE4` |
| `color/palette/stone` | `#A4A197` |
| `color/palette/forest` | `#24372D` |
| `color/palette/rust` | `#CF5A3D` |

| Semantic path | Dark | Conservation | Paper |
| --- | --- | --- | --- |
| `color/surface/page` | Obsidian | Forest | Ivory |
| `color/surface/inset` | Obsidian | Obsidian | Ivory |
| `color/text/primary` | Ivory | Ivory | Obsidian |
| `color/text/secondary` | Stone | Stone | Forest |
| `color/link/default` | Ivory | Ivory | Forest |
| `color/link/active` | Rust | Ivory + underline | Forest + underline |
| `color/border/control` | Stone | Stone | Forest |
| `color/focus/ring` | Ivory | Ivory | Forest |
| `color/focus/gap` | Obsidian | Forest | Ivory |
| `color/state/error-text` | Rust | Ivory | Forest |
| `color/state/notice-text` | Stone | Stone | Forest |
| `color/state/confirmation-text` | Ivory | Ivory | Forest |

In Conservation/Paper, error states use words and an explicit error icon, not rust body text. All interactive fields and primary buttons use the Dark control surface so their state colors have one tested pairing. Semantic colors never encode conservation categories, population directions, or ecological success by themselves.

Action aliases: `color/action/primary/background=Rust`, `foreground=Obsidian`, `border=Rust`; hover/pressed background `Ivory`, foreground `Obsidian`, with pressed inset line. Secondary: background `Obsidian`, foreground `Ivory`, border `Stone`; hover uses an ivory underline/inset rather than a low-contrast fill. Text action: no fill, mode-aware link color, underline. Disabled: solid readable text/border in secondary colors plus explicit disabled state/reason; no blanket opacity reduction on essential copy.

Chart aliases in Dark: `color/chart/estimate=Ivory`, `bounds=Stone`, `selected=Rust`, `background=Obsidian`, `grid=Stone at 24%` (decorative only), `bounds-fill=Stone at 12%` (decorative only). Bound lines and HTML values remain full-opacity. Waveform aliases: `line=Ivory`, `cursor=Rust`, `background=Obsidian`. No palette of six threat colors.

Solid pair ratios: ivory/obsidian **16.20:1**; stone/obsidian **7.54:1**; rust/obsidian **4.81:1**; ivory/forest **10.52:1**; stone/forest **4.90:1**; forest/ivory **10.52:1**. Disallowed normal text: ivory/rust **3.37:1**, rust/forest **3.12:1**, stone/ivory **2.15:1**. Contrast over images/transparency requires actual composition review. See [accessibility design](accessibility-design.md).

## Space, grid, shape and layers

`space/{n}` uses n px at the reference root and n/16 rem in future CSS: **0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 144**. The 20/40 steps support controls/layout; 80 preserves the existing mobile section spacing. They extend the earlier scale deliberately. No unbounded arbitrary margins per page.

| Semantic dimension | Value / rule |
| --- | --- |
| `space/role/section` | `clamp(5rem, 3.5143rem + 6.0952vw, 9rem)`; 80 → 144 px |
| `space/role/heading-body` | 24 compact / 32 desktop |
| `space/role/source` | 16 |
| `space/role/control-gap` | 12 |
| `layout/content/max` | 1560 px equivalent / 97.5rem |
| `layout/grid/columns` | 4 compact; 8 tablet; 12 desktop/wide |
| `layout/grid/gutter` | 12 compact; 20 tablet/desktop; 24 wide |
| `layout/page/margin` | 16 ≤359 px; 20 compact; 32 tablet; 40 desktop; 60 wide |
| `layout/header/min-height` | 64 compact/tablet; 72 desktop/wide; grows with text |
| `layout/reading/max` | 62ch |
| `size/control/min-target` | 44 px equivalent / 2.75rem |
| `size/control/standard` | 48 px equivalent / 3rem minimum height |
| `stroke/rule` | 1 CSS px |
| `stroke/chart` | 2 CSS px |
| `stroke/focus` | 2 CSS px + 2 CSS px contrasting gap |
| `radius/surface`, `radius/control` | 0 |
| `radius/radio` | 50%; only intrinsically round controls/point markers |
| `shadow/surface` | none; opaque surfaces and explicit borders define layers |

Reference grid at 1440: 1320 content, twelve 88 px columns, eleven 24 px gutters. At 390: 350 content, four 78.5 px columns, three 12 px gutters. Breakpoint and short-height behavior is defined in [responsive specifications](responsive-specifications.md), including the exact margin/gutter switches.

Illustrative layer names: `layer/content=0`, `sticky=10`, `tooltip=20`, `backdrop=30`, `dialog=40`, `dialog-tooltip=50`. Native modal top-layer behavior takes precedence over CSS z-index; these numbers organize ordinary stacking contexts and Figma mockups. Decorative masks cannot cover controls or focus. Backdrop is obsidian at 84%; dialog/nav surfaces are opaque obsidian, so content contrast does not depend on underlying imagery.

Motion aliases and reduced values live in [motion tokens](motion-tokens.md); component names/variants in [component system](component-system.md). Future additions require a documented purpose, contrast check, responsive behavior, and a status update.
