# Research source catalog

Research checked **2026-10-08**. “Not verified” means the relevant page or terms could not be confirmed in this pass; it is not a claim that access is unavailable. Source page dates and dataset coverage differ. Always pin a version/retrieval date when acquiring data.

## WWF Living Planet Report 2026

- **Publisher / URL:** WWF; [WWF Living Planet Report hub](https://livingplanet.panda.org/) and [WWF-UK 2026 announcement](https://www.wwf.org.uk/press-release/living-planet-report-2026). The announcement is a regional publisher page, not a substitute for the report.
- **Data:** Report findings, methods, graphics, and potentially supplementary tables. 2026 report contents and downloadable data were **not independently verified** here; do not import figures based on an announcement alone.
- **Date / coverage:** 2026 edition is announced for 2026-10-08 in the existing project catalog. Its population monitoring period, taxa, geography, and sample size remain unverified until the actual report and supplement are inspected.
- **Acquisition:** Start at the official report hub; download the report and any cited technical supplement/data files. Record edition, file checksum, access date, page/table, and source data. No confirmed API.
- **Rights / citation:** WWF report text, figures, and data are not assumed open just because they are downloadable. Check the report's copyright and any data-specific terms. Cite WWF, report title, year, publisher/place, page or figure, and underlying data sources as directed by the report.
- **Reliability / limits:** Primary institutional synthesis. Interpret only within its methods and coverage; an index is not a census of all wildlife.
- **Species-level population trends?** Reported aggregate LPI is not a per-species series. Underlying LPD may contain population time series, subject to access terms.
- **Access:** Report likely public; underlying data access and reuse requirements unverified.

## Living Planet Index / Living Planet Database (ZSL and WWF)

- **Publisher / URLs:** Zoological Society of London (ZSL) and WWF; [LPI portal](https://livingplanetindex.org/data_portal), [latest results](https://livingplanetindex.org/latest_results), [data-use policy](https://livingplanetindex.org/data_use_policy).
- **Data:** The portal describes tens of thousands of vertebrate population time series and a public LPD version from 1970–2020 with confidential records removed; it links open calculation code. Published index results include aggregate trends and uncertainty/sensitivity information.
- **Date / coverage:** Portal page checked 2026-10-08; stated series coverage 1970–2020. The downloaded file's exact edition/version must be captured at acquisition. This description may not represent a later report's dataset.
- **Acquisition:** Browse results without download; for database download, provide name, email, intended use, and agree to the portal's data-use agreement. Calculation code: [ZSL rlpi on GitHub](https://github.com/Zoological-Society-of-London/rlpi). No bulk data acquired.
- **Rights / citation:** Published trend outputs and underlying population records can have different terms. Read the current agreement before use or redistribution; do not rely on stale URLs or presume raw records are CC BY. Cite ZSL/WWF, LPI/LPD version and access date, plus original studies/source records where required.
- **Reliability / limits:** Authoritative synthesis of monitored population time series. Sampling is uneven across species, places, taxa, and time; it is not a representative census of all wildlife.
- **Critical interpretation:** The LPI measures **average relative change in monitored wildlife populations**. A 73% average index decline does **not** mean 73% of animals disappeared. It is not the number of animals lost, percentage of populations/species declining, or count of extinctions. See [OWID's LPI FAQ](https://ourworldindata.org/faq-living-planet-index).
- **Species-level population trends?** The underlying database includes individual monitored population time series; access/data-use conditions apply. A global index is not itself a species-level trend.
- **Access:** Results are browsable; bulk LPD download requires a stated use and agreement. Exact terms and availability must be reconfirmed at acquisition.

## IUCN Red List of Threatened Species

- **Publisher / URLs:** International Union for Conservation of Nature (IUCN); [Red List](https://www.iucnredlist.org/), [API v4](https://api.iucnredlist.org/), [terms of use](https://www.iucnredlist.org/terms/terms-of-use).
- **Data:** Taxonomy, assessment category/criteria, rationale, population trend field, range, habitat, threats, and conservation measures, depending on species assessment.
- **Date / coverage:** Assessments are updated in assessment cycles, not continuously. Pin the Red List version and per-assessment year; verify each species' latest assessment at request time. API docs checked 2026-10-08.
- **Acquisition:** Request an API token at the official API; use documented endpoints and cache only if permissions allow. Public website can be searched manually. No scraping or bulk extraction.
- **Rights / commercial restrictions:** Official API states commercial use is strictly forbidden; commercial users should consider IBAT. API use is bound by Red List terms. Do not use restricted IUCN data without suitable authorization. Project's commercial status is unresolved, so no Red List data should be integrated until clarified/authorized.
- **Citation:** API documentation requests: `IUCN 2026. IUCN Red List of Threatened Species. Version 2026-1 <www.iucnredlist.org>` (use the actual version at acquisition), plus assessment citation where supplied.
- **Reliability / limits:** Global expert assessment standard; categories depend on evidence and criteria, and assessment dates/coverage vary. “Population trend” may be inferred or unknown and is not necessarily a numeric abundance time series.
- **Species-level population trends?** Sometimes categorical trend assessments (increasing/decreasing/stable/unknown); generally not a continuous species abundance time series through the API.
- **Access:** Token required for API; noncommercial restrictions and rate limits apply. API docs caution against extraction/scraping and some unrelated visualization use.

## GBIF

- **Publisher / URLs:** Global Biodiversity Information Facility; [GBIF](https://www.gbif.org/), [Occurrence API documentation](https://techdocs.gbif.org/en/openapi/v1/occurrence), [download guide](https://techdocs.gbif.org/en/data-use/download-formats).
- **Data:** Taxonomic and occurrence records (observed/specimen/research records), locations, dates, dataset provenance, and record-level license metadata.
- **Date / coverage:** Continuously updated aggregator; global, across many taxa and years. Coverage and effort vary strongly across geography, taxa, institutions, and time. Save download DOI and request date.
- **Acquisition:** Search API for modest queries. Bulk occurrence download is asynchronous and requires a registered GBIF account, username/password authentication, and email delivery/link retrieval; downloads have complexity/resource limits.
- **Rights / citation:** License is dataset/record specific, commonly CC0, CC BY, or CC BY-NC. Check each record and data provider terms. Cite using the download's generated citation/DOI and include individual dataset citations where provided. Commercial use is incompatible with NC records.
- **Reliability / limits:** Valuable biodiversity occurrence infrastructure but not a standardized sampling program. Duplicate, georeference, taxonomic, and effort biases exist. **Observation counts are not abundance estimates** and cannot establish population decline without a defensible design/model.
- **Species-level population trends?** No general population-trend measure. It may support occurrence/range analyses; trends in records must not be called population trends.
- **Access:** Search generally public; account/authentication required for bulk downloads. API requests are rate-limited and bulk jobs monitored.

## Our World in Data (OWID)

- **Publisher / URLs:** Global Change Data Lab; [OWID](https://ourworldindata.org/), [LPI FAQ](https://ourworldindata.org/faq-living-planet-index), [OWID Data API](https://docs.owid.io/projects/etl/api/).
- **Data:** Curated datasets, charts, articles, and LPI explanatory content. LPI FAQ currently explains the 2024 report edition and its 1970–2020 study period; it reports 34,836 populations across 5,495 species and clearly cautions against interpreting 73% as wildlife lost.
- **Date / coverage:** FAQ first published October 2022, updated October 2024; pages/data update independently. Retrieve current chart metadata and underlying source documentation for each chosen dataset.
- **Acquisition:** Download CSV/metadata via chart pages/GitHub data repository or use the documented API when suitable. The page's “reuse our work” link explains reuse. Do not use chart scraping when a data download exists.
- **Rights / citation:** OWID-produced content is generally CC BY; third-party data retains its own source license. Credit authors, OWID, link, and underlying data/source; inspect chart metadata and third-party terms. CC BY permits commercial reuse with attribution, but underlying data may not.
- **Reliability / limits:** Strong documentation and transparent provenance, but a secondary curator; underlying sources determine data limits. FAQ is interpretation, not an independent abundance dataset.
- **Species-level population trends?** The LPI chart is aggregate; underlying linked dataset might expose aggregate series only. Verify chart metadata. OWID is not a substitute for the LPD population series.
- **Access:** Public browsing/download; no account generally required for chart data/API.

## NOAA Fisheries

- **Publisher / URLs:** U.S. National Oceanic and Atmospheric Administration, National Marine Fisheries Service; [Science & Data](https://www.fisheries.noaa.gov/science-and-data), [species pages](https://www.fisheries.noaa.gov/species), [Sounds in the Ocean](https://www.fisheries.noaa.gov/national/science-data/sounds-ocean-mammals).
- **Data:** U.S. marine species profiles, stock assessments, abundance estimates, status/trends, fisheries interactions, research datasets, and selected sounds/media.
- **Date / coverage:** Assessments are stock-, region-, and publication-year specific; use the assessment's actual year, stock boundaries, and confidence interval. Not a global all-species data source.
- **Acquisition:** Download linked stock assessment reports/data from each species or science page; check source dataset and method. No single universal API confirmed for all relevant records.
- **Rights / citation:** U.S. federal works may be public domain, but NOAA pages can include third-party images/audio and partner materials. Verify item-level rights and attribution; cite assessment/report authors, year, stock, and NOAA page. NOAA sound page includes recordings whose playback may be altered; preserve metadata and original speed context.
- **Reliability / limits:** Primary agency assessments with explicit stock boundaries/methods; not comparable across all species or regions without harmonization. Population estimates can be uncertain and dated.
- **Species-level population trends?** Yes for assessed stocks/species in selected datasets, but a stock is not necessarily a whole species/global population.
- **Access:** Most pages public; some datasets or tools may require separate access. Verify per assessment.

## BirdLife International

- **Publisher / URLs:** BirdLife International; [Data Zone](https://datazone.birdlife.org/), [species factsheets](https://datazone.birdlife.org/species).
- **Data:** Bird taxonomy, range/distribution, global Red List categories and criteria, population estimates/trends for some species, Important Bird and Biodiversity Areas, and conservation data.
- **Date / coverage:** Global bird coverage with assessment update cycles; individual factsheets/assessments have dates. Dataset edition and freshness must be recorded.
- **Acquisition:** Browse public factsheets; use official Data Zone download/licensing information or request access for datasets. No general public API/download entitlement verified in this pass.
- **Rights / citation:** BirdLife's proprietary database/data products can have restrictions and licensing fees. Do not bulk scrape or redistribute; obtain written permission and cite the supplied dataset/product and assessment metadata.
- **Reliability / limits:** Specialist global authority on birds; estimates and trend confidence differ by species, and assessment categories are not direct counts.
- **Species-level population trends?** Often a qualitative trend category and sometimes population estimates; numeric repeated time series availability varies.
- **Access:** Public species browsing; bulk/derived datasets may require registration, permission, or paid license. Confirm exact terms.

## Wildlife sound archives

### xeno-canto

- **Publisher / URL:** xeno-canto community archive; [site](https://xeno-canto.org/), [API](https://xeno-canto.org/explore/api), [terms](https://xeno-canto.org/about/terms).
- **Data:** Bird sound recordings, recordist, location/date, species identification, quality tags, and recording metadata.
- **Date / coverage:** Continuously contributed worldwide; bird-focused and uneven in geography, species, and effort.
- **Acquisition:** Search site/API; record-level audio download. Check the license displayed for each recording and any download/API conditions.
- **Rights / citation:** Licenses vary by recording (including Creative Commons variants); some restrict commercial use or derivatives. Follow the recording's exact license, attribution, and share-alike requirements. Do not assume all archive content is commercially reusable.
- **Reliability / limits:** Useful sound evidence, not population monitoring. Identifications, recording quality, playback speed, and provenance vary.
- **Species-level population trends?** No.
- **Access:** Public search/API; rate/terms apply; individual item licensing must be checked.

### Cornell Lab Macaulay Library

- **Publisher / URL:** Cornell Lab of Ornithology; [Macaulay Library](https://www.macaulaylibrary.org/).
- **Data:** Large audio/video/photo archive with detailed wildlife media metadata.
- **Date / coverage:** Ongoing archive, worldwide but uneven; item capture dates are record-specific.
- **Acquisition:** Search item pages; download/reuse permission is handled through item-level license/permissions, not presumed from viewing.
- **Rights / citation:** Creator/Cornell rights and reuse permissions vary. Obtain explicit license/permission for documentary or commercial use and follow the item credit line.
- **Reliability / limits:** Strong provenance-rich media archive; not a population monitoring source.
- **Species-level population trends?** No.
- **Access:** Browsing is public; high-resolution files/reuse may require permission or account.

## Reusable image sources

### Wikimedia Commons

- **Publisher / URL:** Wikimedia Commons; [reuse guidance](https://commons.wikimedia.org/wiki/Commons:Reusing_content_outside_Wikimedia), [API](https://commons.wikimedia.org/wiki/API:Main_page).
- **Data:** Searchable community media repository; item pages expose author, source, license, and download links.
- **Date / coverage:** Continuously updated; broad but uneven and user-contributed.
- **Acquisition:** Search/API or download original from the file page. Verify the specific file page and provenance.
- **Rights / citation:** File-by-file licenses (often CC BY/CC BY-SA or public domain); satisfy author credit, license link, modifications, and share-alike conditions as required. Commons warns it does not warrant license accuracy; check jurisdiction-specific rights.
- **Reliability / limits:** Useful source discovery, not an institutional rights guarantee; subject identification and provenance can be wrong.
- **Species-level population trends?** No.
- **Access:** Public; no account typically needed for downloads/API.

### iNaturalist

- **Publisher / URL:** iNaturalist; [API/developer guidance](https://www.inaturalist.org/pages/developers), [license help](https://www.inaturalist.org/pages/help#licensing).
- **Data:** Community observations with date/location/taxon and separately licensed media.
- **Date / coverage:** Continuous and global, highly variable sampling effort and participation.
- **Acquisition:** API for focused queries; use downloads for large research datasets. Check the license of each photo/sound separately from the observation's license.
- **Rights / citation:** Media licenses are selected by contributors and vary; default or common CC BY-NC content is not suitable for commercial use. Obtain assets only where item-level license permits intended use and provide creator credit. API terms and rate limits apply.
- **Reliability / limits:** Helpful for natural history and asset discovery; observations are presence records with strong observer/effort biases, not abundance. Misidentifications and obscured sensitive locations are possible.
- **Species-level population trends?** No reliable general trend product; record counts do not equal abundance.
- **Access:** Public API; credentials may be needed for some functions/exports. Respect rate limits and user-selected licenses.

### U.S. Fish & Wildlife Service media library

- **Publisher / URL:** U.S. Fish & Wildlife Service; [media library](https://www.fws.gov/media).
- **Data:** Agency photos, videos, audio, and captions.
- **Date / coverage:** Asset-level capture dates and scope; U.S.-focused with some international work.
- **Acquisition:** Download from item pages and inspect rights/credit notes.
- **Rights / citation:** Many U.S. government-created works are public domain, but not all hosted content is government-owned. Follow each item's copyright/credit statement; third-party materials require permission.
- **Reliability / limits:** Agency provenance is helpful; image labels and species/location details should still be confirmed. Media is not population data.
- **Species-level population trends?** No.
- **Access:** Public browsing/download; rights vary per file.

## Acquisition order

1. Confirm whether the documentary/product will be used commercially. This determines whether IUCN API, CC BY-NC media, and other noncommercial materials are usable.
2. Obtain actual 2026 WWF report and supplement; distinguish report summary from source datasets.
3. Request LPD access and retain a copy of the accepted data-use agreement and data version.
4. For numeric species trends, prioritize LPD population time series and NOAA stock assessments where the specific unit/method is appropriate; use BirdLife data only under approved terms.
5. Use GBIF/iNaturalist for documented occurrences/ranges, never as direct abundance counts.
6. Clear media one item at a time and maintain a credit/license ledger before incorporating any asset.
