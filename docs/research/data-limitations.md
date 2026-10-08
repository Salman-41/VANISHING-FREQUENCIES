# Data limitations and interpretation safeguards

## Living Planet Index

The Living Planet Index summarizes average relative change in monitored vertebrate population sizes over time. It is not a headcount of all animals. A reported 73% LPI decline (the 2024 edition's 1970–2020 result, as described by OWID) does **not** mean that 73% of animals disappeared. It also does not mean 73% of species or populations declined, or count extinctions. OWID's FAQ states that roughly half of the studied populations were stable or increasing while roughly half declined; large declines can outweigh gains in a geometric average.

Always show the index name, baseline and endpoint years, source edition, taxa/geography/sample coverage, uncertainty where available, and a short plain-language explanation. Do not relabel an index percentage as “wildlife lost.” The project must verify the 2026 report's actual result before using any 2026 figure; the 2024 result is not a proxy for it.

## Abundance versus observations

- GBIF and iNaturalist observations establish that an organism was recorded at a place/time; they do not directly measure how many organisms exist.
- Changes in records can reflect observer effort, access, reporting practices, taxonomy, platform growth, data mobilization, or georeferencing rather than biological change.
- Do not convert observation totals, photo counts, sound recordings, or map pins into population sizes or trends.
- Range occupancy trends may be estimated from occurrence data only with an explicit, validated sampling/effort model and appropriate uncertainty; label the result as occurrence/occupancy evidence, not abundance.

## Species-level records and units

- LPD population time series may represent a local or regional monitored population, not an entire species. Preserve study location, unit, method, and source.
- NOAA assessments are often stock-specific; a stock boundary may cover only part of a species' range. Preserve assessment year, confidence interval, and stock identity.
- IUCN categories and categorical population trends are assessments, not necessarily numeric time series. Assessment year and evidence quality vary; “unknown” is not “stable.”
- BirdLife estimates and categories vary in date, evidence, and access terms. Do not assume an estimate is repeated or globally comparable.

## Coverage and bias

Monitoring is uneven across taxa, regions, habitats, and years. A global average can hide strong geographic and taxonomic differences. Vertebrate-focused LPI does not represent plants, fungi, insects, or all biodiversity. Even within included taxa, monitored populations are a subset and may not be representative.

Aggregation choices matter. Geometric averages, baseline selection, population weighting, inclusion thresholds, missingness, taxonomic revisions, and model methods can affect the index. Use the edition-specific methods and sensitivity analysis; do not splice versions without documenting differences.

## Temporal and status uncertainty

Different sources update on different schedules. An assessment's publication year is not necessarily the data year; cite both when known. Store retrieval date and version. Missing, restricted, or unverified data must remain null/unknown, never be represented as zero or absence.

Threat categories, trend categories, stock assessments, and media metadata can become outdated. Verify the relevant species assessment and geography at acquisition time. Avoid combining incompatible species concepts, stocks, population units, and years into one trend without an explicit harmonization method.

## Media is not measurement

Sound archives and image libraries provide recordings, photos, and provenance. They do not constitute population monitoring. Recording availability reflects recorder access and effort, not animal abundance. Playback may be sped up or otherwise transformed; preserve original metadata and disclose transformations.

## Editorial safeguards

1. Attach a source ID and citation to every factual number.
2. Keep source-defined units and boundaries visible in analysis and presentation.
3. Show uncertainty and missingness where supplied; do not imply false precision.
4. Separate scientific result from editorial metaphor and clearly label reconstructed/illustrative visuals.
5. Recheck all rights and data versions before future publication or distribution.
