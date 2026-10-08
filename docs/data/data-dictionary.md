# Biodiversity data dictionary

**Contract version:** 1.0.0 · **Verified:** 2026-10-08. Runtime frontend contracts are in `data/schemas/biodiversity.schema.ts` and `species.schema.ts`. Python import/observation JSON Schemas are generated from Pydantic models in `scripts/data/models.py`; cross-record rules require the executable validators, not JSON Schema alone.

## Files and ownership

| File | Role |
| --- | --- |
| `data/raw/public/owid-lpi-2024.csv` | Immutable acquired public CSV: published 2024 LPI annual estimates and source bounds; not underlying population observations. |
| `data/raw/public/owid-lpi-2024.metadata.json` | Acquired chart metadata: variables, conversion factor, source update, coverage and citation. |
| `data/raw/public/LPI_Data_Use_Policy_2026.pdf` | Acquired current license/access evidence; separate published results and restricted database terms. |
| `data/raw/public/acquisition-receipts.json` | URLs, retrieval date, byte sizes and checksums of acquired files. |
| `data/raw/observations.csv` / `.json` | Existing equivalent nine-row factual endpoint transcriptions. Only CSV is active by default; do not concatenate both. |
| `data/raw/species-foundation.json` | Immutable snapshot of completed species research, including held measurements and original claim citations. |
| `data/sources/pipeline-manifest.json` | Explicit active inputs, adapters, versions/editions, coverage, hashes, rights, mappings and blockers. |
| `data/sources/taxonomic-registry.json` | Reviewed selected names, authority references and explicit accepted synonyms. |
| `data/sources/species-citations.json` / `pipeline-citations.json` | Versioned original scientific references and new acquisition/curation references. |
| `data/processed/biodiversity.json` | Atomic validated frontend bundle. This is the pipeline output. |
| `data/processed/species.json` | Earlier complete research record, not overwritten by this build; includes held research values. |
| `data/processed/reports/validation-report.json` / `.md` | Machine/human build reports, input/code hashes, environment, counts, coverage, warnings, exclusions and blockers. |

Legacy `data/raw/species.json`, `recovery.json`, editorial/visual files and `data/schemas.ts` are not active inputs. There is no wildcard ingestion: adding a file does not authorize its import.

## Frontend bundle

| Field | Type | Meaning |
| --- | --- | --- |
| `schemaVersion`, `pipelineVersion` | Version strings | Shape and processing code version; distinct from report/dataset editions. |
| `verifiedOn` | ISO calendar date | Research verification date; not an observation date or assessment date. |
| `buildFingerprint` | SHA-256 | Manifest, pinned inputs/supporting files, processing/contract code, dependency locks and tool environment. |
| `datasets` | Metadata array | Dataset ID/version, source edition, source/access dates and applicable rights. |
| `sourceRights` | Source/right records | Additional scientific statistic rights, including NOAA and PIB population records. |
| `indexObservations` | `IndexObservation[]` | Published annual index values and endpoint changes; explicitly different metrics/editions. |
| `speciesFoundation` | `SpeciesDataset` | All six species with only the eligible population measurements retained. Original scientific/editorial separation remains. |
| `speciesProvenance` | Species ID + provenance | Raw snapshot hash, record pointer and processing notes for each selected species. |
| `successStories` | `ConservationStory[]` | Cited local intervention/recovery narratives, with inference limits; not a numerical recovery series. |
| `citations` | `SpeciesCitation[]` | Only referenced, page-read source records. Search-only/inaccessible sources cannot support export. |
| `availability` | Availability object | Present editions, eligible/held population counts, and access/evidence blockers. Missing products remain unavailable. |

## Index observation fields

| Field | Type / units | Rule |
| --- | --- | --- |
| `id` | String | Unique observation identifier; duplicate identities/conflicts are checked separately. |
| `datasetId`, `seriesId`, `edition` | Strings | Series IDs cannot be reused across datasets/editions. Group and label by all three fields. |
| `metric` | `relative-index` or `index-percent-change` | Neither metric represents individual animals lost. |
| `value` | Finite number or null | Relative index is nonnegative; percent change cannot be below −100. No artificial upper cap on an increasing index. |
| `unit` | `index-1970-1` or `percent` | Annual indices standardized to 1970=1. Endpoint changes retain percent units. |
| `baselineYear` | 1970 | Baseline explicitly fixed for these LPI products. Other baselines need a new contract/adapter. |
| `period` | `{startYear, endYear}` | Annual values refer to one year; endpoint values refer to the edition's entire verified period. Ordered integer years. |
| `geography`, `ecosystem`, `scope` | Strings / scope enum | `global`, `region` or `ecosystem`; cannot turn a regional observation into a global one. |
| `taxon` | String | Monitored vertebrates; not all biodiversity. |
| `uncertainty` | Bounds or null | `kind`, `lower`, `upper`, `level`; preserve source bounds, reject reversal/outside estimate/incomplete pair. |
| `uncertainty.level` | Fraction between zero and one, or null | Null for the acquired OWID chart: the metadata does not verify an interval level. No assumed 95% level. |
| `uncertaintyGap` | String or null | Explicit absence/definition gap. Endpoint release provides no bounds. |
| `missingReason` | String or null | Required if value is null; missing is never zero or stable. |
| `temporalMeaning` | Enum | `published-annual-index` versus `published-endpoint-change`. Published annual estimates are not raw animal detections. |
| `provenance` | Nonempty array | Retains all original rows if exact duplicates collapse. |

The OWID chart CSV has baseline 100; its metadata documents conversionFactor=100 and underlying units 1970=1. Central values and both bounds are divided by 100 together. `originalUnit`, original values and the original CSV remain available. This is a unit conversion, not interpolation or recalculation of the LPI.

## Provenance

`RecordProvenance` preserves dataset/source IDs and versions, source edition, source date (nullable when unknown), access date, raw input path/hash, logical record number, JSON pointer (for JSON inputs), exact locator, original unit/value/uncertainty, original row representation and transformations.

CSV record numbers exclude the header and count parsed records, not physical lines inside quoted multiline cells. Large species records are referenced by a hashed snapshot/pointer rather than repeated in the bundle. Population measurements retain their own claim references, source publication year/edition, verification date, measurement period, method, original demographic unit and uncertainty. The two retained estimates keep “not reported” uncertainty or a CV exactly as researched; CV is not converted into a confidence interval.

## Species and story details

The existing `SpeciesRecord` includes taxonomy, public conservation summaries, descriptions, measurements, scoped qualitative trends, interventions, sound knowledge, asset candidates, editorial proposals and evidence gaps. Scientific names must match the reviewed registry and genus; only explicitly reviewed synonyms can normalize. No fuzzy matching or species merging.

IUCN global codes: LC, NT, VU, EN, CR, EW, EX, DD, NE. They are distinct from ESA legal categories. Formal assessment dates/years remain null for public-summary records; their reasons and latest-assessment flags remain intact. “Unknown” trend is not “stable.”

Population units supported by the species contract: individuals, mature individuals, adult individuals and nesting females. They are separate units, not conversion factors. No densities, observations, nests, photo counts or recordings are silently relabeled as individuals. Value ranges and uncertainty intervals have distinct meanings.

Each `ConservationStory` retains species identity, geography, `documented-recovery` or `documented-intervention` kind, cited description/outcome, inference limit and eligible measurement links. Habitat use, reduced livestock losses, risk information and local stabilization must not become global abundance increases.

Asset metadata remains discovery information. All current candidates are unacquired/uncleared; the pipeline does not download or license media. The frontend must honor clearance and wild/captive context. Numeric statistics must come from eligible measurements/index records with their dates, units and citations, never from editorial copy.
