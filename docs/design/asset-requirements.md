# Asset requirements and acquisition plan

**Blueprint v1 · 2026-10-08.** This is a production brief, not a cleared asset library. At the time of this design stage, all wildlife image/audio candidates were unacquired and uncleared. Candidate metadata is in [species research](../../data/processed/species.json) and [species citations](../../data/sources/species-citations.json). Later stages acquired seven homepage photographs and six separate NPS park recordings; the latter are itemized in the [audio ledger](../../data/sources/audio-assets.json) and are not recordings of the selected documentary species.

## 1. Asset ledger and clearance gates

Future acquisition must preserve the existing asset contract and add an asset ledger when implementation begins. Do not set existing `acquired` or `clearedForUse` flags from this brief. An archive's playback page, government hosting, or attribution alone does not establish reuse permission.

For each chosen item record:

- Stable asset ID; kind; chapter/slot; exact species or habitat; identification authority; wild/captive/unknown context; geographic scope and whether it documents the featured site.
- Creator/recordist and publisher; original source URL and item URL; capture date or explicit unknown; upload/publication dates separately; retrieval/verification date; original filename/hash and revision.
- Exact license name, version, URL and archived evidence; commercial and redistribution permission; adaptation/attribution/share-alike conditions; written authorization reference if needed; final credit text and links. Resolve conflicting metadata before clearance.
- Original dimensions/duration/channels/sample rate as applicable; delivery variants; crop focal point and safe regions; original/master relationship; actual edits, compression, normalization, playback speed or pitch transformation; derivative hashes.
- Caption, alt text, long description/transcript where needed; photographer/recordist confirmation of context where available; whether image and audio depict the same event or are separately sourced.
- Reviewer, review date and state: discovered → provenance checked → rights compatible → acquired → derivative/caption reviewed → cleared. A rejected or unresolved item remains unavailable to the frontend.

Retain the source license with redistributable assets and carry attribution into the site credits and relevant caption/player. Handle share-alike for adapted CC BY-SA media and published LPI data; do not claim the entire site has one license. NC, ND, restricted, or uncertain items require a compatible plan/permission before adaptation or commercial reuse. Do not import restricted IUCN assessment/API data as part of asset preparation. See [rights research](../research/data-licensing.md) and the newer [pipeline rights decisions](../data/methodology.md).

## 2. Image and scene briefs

Preferred acquisition originals: at least 2800 px along the long edge for a full-width desktop scene, with actual available quality reviewed before use. A smaller authentic source can occupy a smaller frame; do not invent detail with generative upscaling. Deliver responsive crops around 640/960/1440/1920 px as needed, with AVIF/WebP and a compatible fallback chosen later. Target ≤350 KB mobile / ≤650 KB desktop for scene images and ≤180 KB for a mobile portrait. These are budgets, not claims about files already acquired.

| ID / priority | Chapters and framing | Required content and provenance | Candidate / present state | If not cleared |
| --- | --- | --- | --- | --- |
| **M01 · P0** | 00, 01, 04, 07; wide landscape with useful 96 px central crop and a mobile 3:2 crop | Documented Himalayan/trans-Himalayan mountain location, genuine atmosphere, no animal compositing. Keep a clear horizon/rock structure through the aperture. | No item acquired or selected; new licensed landscape needed. | Typographic title/field note and plain rule; no invented coordinates. |
| **M02 · P0** | 01, 05; wide wild snow leopard image and optional real detail crop | *Panthera uncia* visibly within mountain habitat; exact country/setting, known wild status. Preserve full source frame. | [Snow Leopard 13.jpg](https://commons.wikimedia.org/wiki/File:Snow_Leopard_13.jpg), Ltshears, listed CC BY-SA 3.0: **Louisville Zoo captive**, inconsistent capture-date metadata. Does not satisfy wild hero brief. | Full species text; a separately cleared captive reference can only be explicitly labeled as such. |
| **M03 · P0** | 02, 04, 05; wide ocean/whale composition with space ahead of movement | Confirm blue whale identity; preserve natural ocean and scale cues. Stock/location must be verified before linking image to ENP. | [Blue-whale.jpg](https://commons.wikimedia.org/wiki/File:Blue-whale.jpg), NOAA Fisheries/Lisa Conger, listed federal public domain; original agency provenance/location to confirm. | Typographic listening note; general cleared species portrait labeled separately from stock estimate. |
| **M04 · P1** | 05; 3:2 tiger portrait in habitat | Wild *Panthera tigris*, forest/grassland context; Nepal association only if documented. | [Panthera tigris (TIGER).jpg](https://commons.wikimedia.org/wiki/File:Panthera_tigris_(TIGER).jpg), V sai harshita, CC BY-SA 4.0: captive Bannerghatta setting, watermark. Replacement preferred. | Text species spread. Do not remove watermark or imply a Nepal encounter. |
| **M05 · P1** | 04, 05; canopy context and 3:2 portrait | Confirm *Pongo pygmaeus*, Borneo provenance, ordinary feeding/travel/nesting behavior. No substitution of another orangutan species. | [Pongo pygmaeus 01 Pengo.jpg](https://commons.wikimedia.org/wiki/File:Pongo_pygmaeus_01_Pengo.jpg), Peter Halasz, listed CC BY-SA 3.0 option: **Tennoji Zoo captive**. New wild image needed. | Text species/forest note; captive reference clearly identified only after clearance. |
| **M06 · P1** | 04, 05; wide reef/3:2 hawksbill | Confirm *Eretmochelys imbricata*, wild setting and location. Do not present a turtle image as proof of local nesting recovery. | [Hawksbill sea turtle.jpg](https://commons.wikimedia.org/wiki/File:Hawksbill_sea_turtle.jpg), Colin Johnson/Cmjohns6, author public-domain dedication; BVI wild, color-adjusted. Not Arnavon. | Text reef note; later reuse with exact BVI/context/edit credit if cleared. |
| **M07 · P1** | 04, 05; forest clearing and forest elephant | Confirm *Loxodonta cyclotis*, forest setting, photographed location and original attribution. No savanna image substitution. | [Loxodontacyclotis.jpg](https://commons.wikimedia.org/wiki/File:Loxodontacyclotis.jpg), Thomas Breuer, CC BY 2.5; Mbeli Bai/Nouabalé-Ndoki, Republic of Congo; check PLOS original and capture date. | Text species note. Do not label as a particular stabilized population without evidence. |
| **M08 · P1** | 06 Tost field note; landscape 3:2 | Real night corral intervention in Tost, Mongolia; identify what was installed and who is pictured only with documented context/permissions. | No cleared candidate; request/licensed-source discovery later. Study citation does not grant figure/photo rights. | Full-width text field note; source and place heading. |
| **M09 · P1** | 06 Nepal field note; landscape 3:2 | Actual Terai Arc monitoring/coexistence/protection work with date, site and participant context; agency accurately credited. | No cleared candidate. Captive tiger portrait is unsuitable as intervention documentation. | Full-width text field note. |
| **M10 · P1** | 06 Arnavon field note; landscape 3:2 | Actual Arnavon monitoring/nesting protection, Solomon Islands; site and species confirmed. Avoid disturbance or sensitive nest coordinates. | No cleared candidate. BVI turtle image is unsuitable as Arnavon evidence. | Full-width text field note. |

P0 supplies the visual identity; P1 enriches the other species and conservation chapters. Every chapter remains fully readable without these assets. None of the priorities authorizes purchasing an image, contacting a creator, or substituting an unidentified animal. Such actions belong to a later acquisition task.

Optional secondary-story photographs for WhaleWatch, Bukit Piton and managed forest elephant areas follow the same site-specific requirements. They are not required to complete the planned narrative. No video is required. A later optional silent landscape video must have a licensed still fallback, visible play/pause, no autoplay, and a delivery budget ≤3 MB; it must add genuine information or atmosphere worth its cost.

## 3. Recording briefs

Preserve an acquired original/master with original metadata. Prepare short excerpts only when rights permit adaptation; record exact source start/end points. A target excerpt of 15–40 seconds is a delivery preference, not a manufactured duration or reconstructed sound. Longer calls may require a longer excerpt to preserve meaning, subject to a reviewed budget. Do not loop a short clip to imply continuous calling.

| ID / priority | Intended role | Evidence / candidate | Clearance and scientific requirements |
| --- | --- | --- | --- |
| **A01 · P1** | Mountain habitat ambience, 00/01/04 | No licensed item identified | Verify actual place/date/recordist. Label as ambience. No synthesized wind/bird collage presented as field evidence. |
| **A02 · P1** | Snow leopard voice, 01/04 | No licensed item identified; [Snow Leopard Trust behavior](https://snowleopard.org/snow-leopard-facts/behavior/) supports written description | Confirm species and call/context; captive recording allowed only with visible label. Never substitute a tiger roar. |
| **A03 · P0 for audio** | Blue whale, primary Listening Aperture, 02/04 | [Blue whale atlantic3 1x.oga](https://commons.wikimedia.org/wiki/File:Blue_whale_atlantic3_1x.oga); listed NOAA recording, CC0, normal 1× | Reconfirm original NOAA link, attribution, file identity, location/capture date and actual rate. Explicitly Atlantic, separate from ENP estimate. |
| **A04 · alternate** | Blue whale example, 02/04 | [NOAA Sounds in the Ocean](https://www.fisheries.noaa.gov/national/science-data/sounds-ocean-mammals); source example 8× accelerated | Recording-specific rights unverified. Confirm creator/original permission, retain “8× source playback” label. Do not describe transformed pitch as natural. |
| **A05 · P2** | Tiger voice, 04 | No licensed item identified | Species/context/recordist verification; no unidentified commercial stock roar. Separate from any Nepal conservation imagery. |
| **A06 · P1** | Bornean orangutan long call, 04 | No licensed item identified; existing `adw-orangutan` supports description | Confirm Bornean species, caller/context, date and rights. Do not merge orangutan taxa. |
| **A07 · P1** | Forest elephant rumbles, 04 | [Cornell Elephant Listening Project](https://www.birds.cornell.edu/ccb/elephant-listening-project/sound/) | Permission unresolved; distinguish forest from savanna examples. Record any speed/pitch transformations and source provenance. Do not derive abundance from call counts. |
| **A08 · P1** | Tropical reef habitat ambience, 04 | No licensed item identified | Location/date and underwater recording context required. Label habitat ambience; no verified hawksbill call currently exists in the project. |

Archive discovery may use [Macaulay Library](https://www.macaulaylibrary.org/), [xeno-canto](https://xeno-canto.org/), Commons, NOAA, or recordists, subject to item-specific rights. A repository name is a lead, not a license. Cornell audio remains permission-dependent; no permission request has been sent.

Delivery budget: ≤1 MB per compressed excerpt where practical; browser-compatible variants chosen after real source acquisition. Preserve natural rate as primary when available. Do not resample to create an unreported pitch transformation. Any gain adjustment serves consistent listening comfort, is logged, and destroys any implied calibrated amplitude comparison; the interface must never compare species' sound pressure from those files. Retain recorded channels unless a documented downmix is necessary. Do not add stereo placement that implies a measured animal location.

Before clearance, listen to the entire excerpt, confirm species identification with appropriate evidence, describe meaningful sounds and background context, disclose cuts and rate changes, and prepare a transcript if intelligible speech is included. Do not invent an acoustic description from an item title. Normalize only after preserving the original and record the processing. No soundtrack, Foley, synthesized sonar, reconstructed historical chorus, or microphone capture is required.

## 4. Original graphics, fonts and data assets

| ID | Deliverable / derivation | Restrictions and fallback |
| --- | --- | --- |
| **G01** | Original editorial line motif for 00/07; small SVG, no numeric axes | Label editorial if waveform-like; no simulated population change. Plain rule is sufficient. |
| **G02** | Static peak envelope from each exact cleared delivered recording, duration and transformation metadata preserved | Relative amplitude only; no invented frequency/dB axis. No cleared audio means no evidentiary waveform. |
| **G03** | Original SVG/HTML LPI charts from validated index records | Retain bounds, baseline, geography, edition, period, attribution and share-alike terms. Never trace a copyrighted report figure or splice editions. |
| **G04** | Original field-note bracket and dividers | Editorial graphic with no geographic/quantitative meaning; readable text does not depend on it. |
| **F01** | Archivo upright/italic, locally served later | [Publisher](https://github.com/Omnibus-Type/Archivo), [OFL 1.1 file](https://github.com/google/fonts/blob/main/ofl/archivo/OFL.txt); pin revision, preserve copyright/license and record subset changes. Binary not acquired in this stage. System sans fallback. |
| **D01** | Published LPI subsets and their citations from `biodiversity.json` | 2024 annual curves and 2026 endpoints remain distinct. Published-trend CC BY-SA 4.0 is recorded in the pipeline; underlying LPD is excluded. |
| **D02** | Eligible species measurements and six conservation stories from the same bundle | Exactly two contextual historical estimates currently eligible; four held figures excluded. Status summaries retain unknown formal assessment dates. |
| **D03** | Source/rights metadata and final media ledger for credits | Source citations already exist; final media credits depend on acquisition. Do not claim a candidate is credited/cleared before review. |

No map geometry or occurrence dataset is required for v1. Named place labels avoid inventing distribution boundaries, stock borders, sensitive coordinates, or representative monitoring coverage. If a map is proposed later, source geometry and biological range/stock boundaries separately and document uncertainty and rights.

## 5. Acquisition sequence and delivery review

1. Confirm M01/M02/M03 and A03 first. Inspect original provenance, exact commercial/derivative rights and final context; find replacements when the current candidate cannot serve the brief. Do not lower rights standards to fill a visual slot.
2. Prepare final crops and source-derived waveform for the selected blue whale recording. Review the Atlantic/ENP distinction at the intended layout, plus natural/accelerated playback labels. This is the asset-dependent core of the strongest signature.
3. Source wild tiger/Bornean portraits and review hawksbill/forest elephant candidates. Create accurate mobile crops, captions and descriptions. Captive photos may remain references with explicit context but do not fulfill wild scene requirements.
4. Acquire forest, mountain and reef recordings independently; maintain a complete written fallback for every missing clip. Do not assemble unrelated records into one implied simultaneous soundscape.
5. Source the three named conservation-site images. If unavailable, proceed later with the specified text field notes. License photos independently of research papers/pages.
6. Review derivatives at desktop/mobile sizes: focal point, legibility, crop truthfulness, credit visibility, documented transformations, byte budget and accessible equivalent. Archive rights evidence beside the ledger before any clearance flag changes.

The blueprint is ready for implementation planning. Visual/media production readiness remains conditional on these acquisitions; scientific assessment dates, held species estimates, 2026 annual data and applicable access authorizations remain the gaps documented in [status](../STATUS.md). No hosting or deployment work is part of this plan.
