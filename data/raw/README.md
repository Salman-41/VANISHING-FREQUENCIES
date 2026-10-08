# Research inputs
Manually transcribed facts and original short paraphrases, checked 2026-10-08. These are research records, not downloaded raw institutional databases. URLs and exact source sections live in ../sources/catalog.json.

observations.json and observations.csv are equivalent representations of the same nine published endpoint summaries. The pipeline imports either file, never concatenates them. No annual series, confidence intervals or species population counts have been invented. Null means not verified/imported, not zero. Published summary facts remain flagged for redistribution review; no public download bundle is authorized by this folder.

Species categories reflect organizational summaries, not direct latest-assessment verification. Editorial and visual configuration are separate inputs. recovery.json is qualitative evidence, not a time series. Media fields are null until actual assets and rights have been checked.

## Verified processing stage — 2026-10-08

`public/` now contains acquired OWID 2024 published LPI annual CSV/metadata and the current ZSL policy, with retrieval/hash receipts. `species-foundation.json` is an immutable snapshot of the completed six-species research. The active import manifest is `../sources/pipeline-manifest.json`; unlisted legacy files are not ingested.

The nine 2026 endpoint values were rechecked against the official WWF-UK announcement in the processing stage. Their published-trend data reproduction permission is recorded under the current ZSL policy; the original `review-required` field remains in raw rows as acquisition history. This does not license press-release prose, media or underlying LPD records. The 2024 annual series and 2026 endpoints remain separate editions.

Use the validated `../processed/biodiversity.json` for development. The earlier `../processed/species.json` retains complete research and held values; the pipeline exports only eligible population records. See `../../docs/data/` for dictionaries, methodology, run instructions and access blockers. Raw snapshots must not be overwritten to silence validation failures.
