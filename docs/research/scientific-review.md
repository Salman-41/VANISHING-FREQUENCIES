# Scientific review and development handoff

**Reviewed:** 2026-10-08. This is a documented desk review by the research assistant, not independent expert or institutional approval.

## Evidence examined

Read the existing project rules, status, source inventory, licensing/limitations documents and legacy research data before changes. Browsed primary institutional sources: WWF, NOAA Fisheries, India's MoEFCC/PIB, IUCN public news, Snow Leopard Trust and Cornell; inspected the primary Oryx intervention study, ITIS/University of Michigan taxonomy pages, and individual Commons media metadata. Older educational accounts support only explicitly scoped taxonomy, feeding or vocalization statements, not current abundance.

`data/sources/species-citations.json` records publishers, authors, official/item URLs, publication metadata when supplied, access date, locators, reuse notes and limitations. Entries marked `search-result-only` or `inaccessible` are reading leads; the validator rejects their use as species evidence. No restricted Red List assessment/API/bulk data was imported. Public news/profile facts are brief original paraphrases with pointers; this does not license source prose, database extracts, figures or media.

## Decisions that affect scientific accuracy

| Issue | Decision and traceable evidence |
| --- | --- |
| Population versus detection | No GBIF occurrence counts or raw camera-trap detections are used as abundance. India's [official assessment release](https://www.pib.gov.in/PressReleasePage.aspx?PRID=2000545&lang=2&reg=48) describes an estimation framework; the estimate is distinguished from photographed individuals. |
| Stock versus species | [NOAA's blue whale assessment](https://www.fisheries.noaa.gov/s3/2024-12/2023-sar-blue-whale-enp.pdf), PDF p.2 / printed p.205, supports an Eastern North Pacific stock estimate from a historical data window. CV is dimensionless uncertainty, not a decline percentage or confidence interval. NOAA explicitly leaves current stock trend unknown. |
| Estimate revisions versus biological change | [IUCN's tiger reassessment news](https://iucn.org/press-release/202207/migratory-monarch-butterfly-now-endangered-iucn-red-list) attributes an upward revision partly to improved monitoring. It cannot supply a like-for-like growth rate. |
| National recovery versus global recovery | [Nepal's public census announcement](https://iucn.org/story/202607/tiger-census-nepals-tiger-number-increases-429) supports national recovery but also reports park differences. Original methods and uncertainty await verification. Do not calculate a cross-survey percentage yet. |
| Historical estimate versus forecast | [WWF's Borneo restoration story](https://www.worldwildlife.org/news/stories/restoring-orangutan-habitat-in-malaysia/) dates its historical estimate; its projected future count was excluded. Observations in restored habitat are not a standardized abundance trend. |
| Different population units | [NOAA hawksbill profile](https://www.fisheries.noaa.gov/species/hawksbill-turtle) discusses nesting females and nests. These are not interchangeable with all individuals or a global population total. No undated nesting statistic was imported. |
| Taxonomic scope | Bornean orangutan excludes other *Pongo* species; forest elephant excludes savanna elephant. Blue whale order Cetacea follows the cited ITIS treatment; alternate higher-rank systems are acknowledged. |
| Conservation categories versus legal listings | IUCN global categories and ESA legal status are separate systems. A WWF category check or IUCN news publication date cannot substitute for a formal assessment date or proof of the latest version. |
| Intervention outcomes versus population recovery | The [corral study](https://doi.org/10.1017/S0030605319000565) concerns reduced livestock losses, involving snow leopards and wolves. WhaleWatch supplies risk information. Neither establishes a measured species population recovery. |
| Sound versus silence | No verified hawksbill call is available in this review; that is an evidence gap, not proof of silence. [NOAA's whale example](https://www.fisheries.noaa.gov/national/science-data/sounds-ocean-mammals) is accelerated; transformed speed/pitch must be disclosed. [Cornell](https://www.birds.cornell.edu/ccb/elephant-listening-project/sound/) examples need species/context and rights checks. |

The Living Planet Index remains an index of average relative change in monitored vertebrate populations. It does not report the fraction of all individual animals that disappeared. No LPI-derived species decline or global animal-loss percentage was assigned to these records. See the existing [data limitations](data-limitations.md).

No global animal headcount, acoustic decline series, current global trend magnitude, or source-free annual population series was created. Lower audio volume or fewer calls must not be presented as a calibrated proxy for population decline. Underwater and airborne decibel figures cannot be compared without reference pressure, medium, distance and measurement context; such figures are excluded.

## Quantitative display review

Six research measurement records are retained. Two are eligible only in dated context: India's snow leopard estimate and NOAA's historical blue whale stock estimate. Four are held: the public historical global tiger range, Nepal's two announcements, and the historical Bornean estimate. These are not six current, comparable species totals.

Each measurement includes value kind, demographic unit, geographic/population scope, period or gap explanation, method and method verification, uncertainty or “not reported”, source publication year/edition, citation locator, verification date and display policy. An estimate range is not automatically a statistical interval. Missing uncertainty is not zero uncertainty. Publication, survey, reference and verification dates are distinct.

The current record uses public conservation summaries, so all formal assessment dates/years are `null`, with a reason and `latestAssessmentConfirmed: false`. This is an unresolved evidence/access requirement, not completion of exact assessment metadata. Do not display the verification date as the assessment year. Obtain approved access and exact metadata before showing assessment years or assessment-derived rationale.

## Data contract

| Layer | Contract | How to consume |
| --- | --- | --- |
| Scientific descriptions | `ScientificClaim`: text, evidence class, reference locator, verification date | Concise qualitative information. Numeric digits are rejected to keep statistics out of this layer. Spelled-out numerical claims still require human review. |
| Quantitative measurements | `PopulationMeasurement` | Render only eligible entries and their required context. Keep historical scope and uncertainty visible, and resolve citation IDs to links. |
| Trends | Scoped direction plus cited interpretation, period and limitations | Preserve qualifiers and “unknown”. Do not substitute a guessed decrease to match the tagline. |
| Conservation | Public-summary or authorized-assessment provenance | Public-summary cannot assert formal dates/latest-assessment confirmation. An authorized assessment requires date and authorization reference. |
| Editorial | `editorial-not-scientific-evidence` premise and linked description keys | Working chapter proposals; never substitute for evidence. |
| Assets | Candidate/license provenance, wild/captive context, playback-rate metadata, acquired/cleared flags | All current candidates remain unacquired/uncleared. Select only after final acquisition and rights review. |

TypeScript interfaces derive their field shapes from Zod to keep runtime checks and static types consistent. Strict objects reject unexpected fields. The joint validator checks source integrity, source/access dates, publication-year agreement, unique IDs, period ordering, estimate interval ordering, authorization metadata and asset clearance prerequisites. It cannot prove a source's truth, statistical comparability, license ownership, or correct downstream visual labeling; those still require review.

The development input is `data/processed/species.json`, validated together with `data/sources/species-citations.json` using `data/schemas/species.schema.ts`. The older `data/raw/species.json` and `data/schemas.ts` remain historical scaffold; do not merge or silently promote their unresolved fields. No data conversion of that scaffold is implied.

## Validation performed

- `npm run data:validate-species`: passed for six species, six measurement records, two eligible only with dated context.
- `npm run typecheck`: passed with strict TypeScript settings.
- `node --import tsx tests/species-foundation.test.ts`: eleven checks passed, including rejection of missing references, reversed/missing periods, unverified methods, public summaries posing as assessments, numeric narrative, uncleared media, duplicate species IDs, citation-year mismatch and unverified source leads.
- `npm run test:species`: passed. This stage does not claim that the older scaffold's separate build/test scripts are implemented.

Existing research dependencies were installed locally and locked in `package-lock.json`; no frontend packages or application code were added.

## Outstanding evidence and access

1. Approved IUCN access/appropriate authorization and exact current assessment metadata for all selected species; current status summaries are not a licensed assessment dataset.
2. Original Nepal reports: the official historical PDF timed out and an alternate official URL returned 404. Check original survey windows, sampled demographic units, model confidence intervals and cross-year comparability. No interval was reconstructed from observed tiger detections or sums of park intervals.
3. Original Bornean abundance model, its data period and uncertainty. The historical estimate must remain held.
4. Full inspection and rights review of the newer forest elephant status report, and any newer stock reports before claiming a current abundance figure. Forest-only global abundance and hawksbill global abundance remain unknown in this foundation.
5. Image acquisition/original-source verification, accurate final credits and share-alike handling for adapted CC BY-SA images. Captive portraits need explicit context. No WWF photo reuse rights are inferred.
6. Audio identity, creator, recording dates/context, compatible item-level rights and transcripts/descriptive alternatives. Permission is needed for the Cornell candidate unless another licensed recording is sourced. Normal-speed blue whale candidate provenance still needs confirmation.

**Handoff:** Ready for local development of explicit unknown/held/citation/media-unavailable states. Public scientific publication still requires resolving any evidence or asset clearance gaps for the material actually displayed. Stop this stage here; no frontend or hosting work is included.
