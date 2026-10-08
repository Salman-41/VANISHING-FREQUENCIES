# Offline processing methodology

**Pipeline version:** 1.0.0 · **Research date:** 2026-10-08.

## Real datasets used

| Dataset | Version / coverage | What is exported |
| --- | --- | --- |
| [OWID LPI chart](https://ourworldindata.org/grapher/global-living-planet-index) | WWF/ZSL 2024 edition; OWID update 2024-09-30; acquired 2026-10-08; 1970–2020 | 357 published annual index records: global, five regions, freshwater. Bounds preserved. No terrestrial/marine annual series was in this acquired chart. |
| [WWF-UK 2026 release](https://www.wwf.org.uk/press-release/living-planet-report-2026) | Published 2026-10-08; 1970–2022 endpoint period | Nine rounded endpoint changes: global, five regions, three ecosystem systems. No intermediate years or confidence intervals reconstructed. |
| Completed species foundation | Project research schema 1.0.0, verified 2026-10-08; field-level source editions retained | Six species; two eligible historical population estimates; six qualitative intervention/recovery stories. Four held estimates excluded. |

The 2026 announcement and its endpoints were independently rechecked in this stage. Earlier research documents' unresolved 2026 announcement status is superseded by this check; an official 2026 annual export and full technical-method review are still outstanding. The separate 2024 series was not relabeled as 2026.

## Rights and source boundaries

The current ZSL [2026 policy](https://www.livingplanetindex.org/documents/LPI_Data_Use_Policy_2026.pdf), clause 3, permits reproduction of **published LPI trends** under CC BY-SA 4.0. Its underlying Living Planet Database has separate conservation/research-only, financial-gain and redistribution restrictions. Only published results were acquired. Retain ZSL/WWF credit, edition, retrieval date, OWID processing attribution and share-alike obligations for adapted LPI data. This does not license report prose, figures, logos or underlying monitoring records, and does not imply endorsement.

The historical blue whale scientific result comes from a NOAA-authored stock report; [NOAA's report policy](https://www.noaa.gov/organization/administration/nao-205-17a-information-access-dissemination), Section 2, supports public-domain report use. The India snow leopard release follows the [PIB reproduction policy](https://www.pib.gov.in/content/186_2_Copyright-Policy.aspx?lang=1&reg=5): accurate reproduction and prominent attribution, excluding third-party material. Those permissions are recorded per statistic source and do not grant media rights.

Species narratives are the project's brief original factual paraphrases, with the original scientific citations retained. No third-party source prose or restricted assessment dataset is copied or relicensed. Public category summaries are not formal Red List imports. The project-authored curation rights entry cannot authorize IUCN/API/bulk data, media or source figures. Media remains uncleared. There is no blanket license for every component of the bundle.

## Processing sequence

1. Validate the manifest, dates, dataset identities and active input rights. A blocked input has no active file; unresolved/noncommercial/redistribution-restricted rights fail the build.
2. Verify SHA-256 for every raw input, metadata snapshot and supporting catalog/registry/policy file. Paths cannot escape the project root. No wildcard import or runtime network fetch.
3. Read UTF-8 CSV with pandas as strings, automatic NA inference disabled. Check headers and row widths first; no silently skipped rows. Read JSON with duplicate-key and NaN/Infinity rejection and an explicit record array path.
4. Normalize whitespace and Unicode NFC, explicit column mappings, numeric fields and declared date formats. Preserve original representations. Decimal-comma/thousands punctuation, unknown units and ambiguous years are rejected instead of guessed.
5. Use explicit missing tokens only. Keep missing numeric values null with an explanation; do not forward-fill, backward-fill, zero-fill, smooth, extrapolate or generate missing historical years.
6. Normalize only approved unit aliases. Divide 1970=100 published indices and their bounds by 100 using metadata; preserve the original units and values. Keep demographic units distinct. CV, range and interval definitions remain separate.
7. Validate periods, publication/access dates, unit/metric compatibility, finite/range values, uncertainty ordering and estimate containment. Validate scientific names against the reviewed registry and conservation codes/provenance. Public summaries cannot be promoted to exact assessment metadata.
8. Detect duplicates with pandas by dataset, edition, series and period. Collapse exact normalized duplicates only, retaining all source-row provenance. Conflicting duplicates fail; values are never averaged. Series IDs cannot cross dataset/edition boundaries.
9. Retain eligible species measurements only. Record held IDs/reasons in the report. Keep qualitative stories and their inference limits; remove links to excluded numeric records. Do not infer causal success or global recovery from site narratives.
10. Build deterministic JSON and run the independent TypeScript/Zod contract and reference checks on the original research snapshot and the candidate frontend bundle. Commit the frontend file atomically only on success; always write the validation report.

## Scientific interpretation

LPI is average relative change in monitored vertebrate populations, not the share of individual animals that disappeared. An index value is not a global headcount, an extinction fraction or a count of declining species. Geographic and taxonomic monitoring biases and baseline differences persist. Regional/ecosystem comparisons are published indexed results, not rankings of current absolute biodiversity abundance.

Successive report editions use different coverage and data windows; they are not a comparable panel by default. The 2024 and 2026 series have different IDs, editions, temporal meanings and provenance. Consumers must choose an edition, label its baseline/endpoint and uncertainty, and never connect an endpoint to another edition's annual curve.

The annual LPI values are already modeled/aggregated publisher estimates. This pipeline reproduces published values and does not recompute their statistical methodology or create population-level interpolation. Species estimates remain their original country/stock/geographic measurements. No source observations, GBIF occurrences, photographs, sound detections, nests or nesting females become total population abundance.

The dataset does not measure a worldwide decline in acoustic activity. The tagline and chapter proposals remain editorial. No audio volume or playback speed is generated from population values.

## Reproducibility and failure behavior

Dependencies are pinned in Python requirements/lock files and npm lockfile. The report records Python, pandas and Pydantic versions; the fingerprint includes inputs, manifest, processing/contract code, relevant dependency locks and environment. No wall-clock generation timestamp enters exported JSON. Two builds with the same pinned inputs, code and environment must have identical bytes and output hashes; the automated test verifies this.

A changed source byte, mapping, metadata version, license record or relevant code changes the fingerprint or fails verification. Do not update a checksum automatically to silence a failure: reacquisition must receive scientific/rights review and a new descriptor/version. The original CSV/JSON representations and source dates remain recoverable from raw snapshots and row provenance.

Failed processing or Zod validation exits nonzero, writes an error report and preserves the previous valid frontend artifact. It is therefore possible for an older valid artifact to remain on disk after a failure: do not treat file existence as proof of a current successful build. Check report status/fingerprint before use.

## Validation scope and remaining gaps

Automated checks test shape, reproducibility, arithmetic bounds, identity, source integrity and declared rights. They do not establish the truth of every source statement, independently audit population estimation models, grant licenses or prove cross-survey comparability. Human scientific/rights review remains necessary at acquisition and before publication.

Formal IUCN dates/authorization, original held-species methods, 2026 annual results, full current methodology review, licensed BirdLife data and media clearance remain unresolved. Import adapters describe the shape of eligible future data; their existence does not authorize a restricted dataset. See the active manifest's `blockedSources` and project status.
