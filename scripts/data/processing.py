"""Loss-aware normalization, adapters and duplicate detection using pandas."""
from copy import deepcopy
from datetime import date, datetime
import csv
import hashlib
import io
import json
import math
from pathlib import Path
import re
import unicodedata
from typing import Any
import pandas as pd
from .models import Dataset, IndexObservation, Manifest, Provenance, validate_population, validate_scientific_name

def strict_json(text: str):
    def invalid(value):
        raise ValueError(f"Nonfinite JSON constant {value}")
    def pairs(items):
        result = {}
        for k, v in items:
            if k in result:
                raise ValueError(f"Duplicate JSON key: {k}")
            result[k] = v
        return result
    return json.loads(text, parse_constant=invalid, object_pairs_hook=pairs)

def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()

def clean_text(value: str) -> str:
    return " ".join(unicodedata.normalize("NFC", value).strip().split())

def normalize_date(value: str | None, date_format="%Y-%m-%d") -> str | None:
    if value is None:
        return None
    text = clean_text(value)
    parsed = datetime.strptime(text, date_format).date()
    # Avoid platform strptime's lenient acceptance of incomplete ISO dates.
    if date_format == "%Y-%m-%d" and parsed.isoformat() != text:
        raise ValueError("Date must be full ISO YYYY-MM-DD")
    return parsed.isoformat()

def missing(value: Any, tokens: list[str]) -> bool:
    return value is None or (isinstance(value, str) and clean_text(value) in tokens)

def number(value: Any, tokens: list[str]) -> float | None:
    if missing(value, tokens):
        return None
    if isinstance(value, bool):
        raise ValueError("Boolean is not a scientific number")
    parsed = float(clean_text(value) if isinstance(value, str) else value)
    if not math.isfinite(parsed):
        raise ValueError("Nonfinite scientific number")
    return parsed

def year(value: Any) -> int:
    if isinstance(value, bool) or not re.fullmatch(r"[0-9]{4}", str(value).strip()):
        raise ValueError(f"Invalid year: {value!r}")
    parsed = int(value)
    if not 1500 <= parsed <= 2100:
        raise ValueError("Year outside supported range")
    return parsed

def verified_path(root: Path, entry) -> Path:
    path = (root / entry.path).resolve()
    if not path.is_relative_to(root.resolve()):
        raise ValueError("Input path escapes project root")
    if sha256(path) != entry.sha256:
        raise ValueError(f"Input checksum mismatch: {entry.path}")
    return path

def read_rows(path: Path, format: str, record_path: str | None = None) -> list[dict]:
    text = path.read_text(encoding="utf-8-sig")
    if format == "csv":
        raw = list(csv.reader(io.StringIO(text)))
        if not raw or len(set(raw[0])) != len(raw[0]) or len(set(clean_text(h) for h in raw[0])) != len(raw[0]):
            raise ValueError("Missing/duplicate CSV headers")
        if any(len(r) != len(raw[0]) for r in raw[1:]):
            raise ValueError("Ragged CSV row; no rows silently skipped")
        frame = pd.read_csv(io.StringIO(text), dtype=str, keep_default_na=False, na_filter=False, skip_blank_lines=False)
        return frame.to_dict(orient="records")
    obj = strict_json(text)
    if record_path:
        for key in record_path.strip("/").split("/"):
            obj = obj[key]
    if not isinstance(obj, list) or not all(isinstance(x, dict) for x in obj):
        raise ValueError("JSON import requires an array of records or an explicit recordPath")
    return obj

def mapped(row: dict, dataset: Dataset) -> dict:
    cleaned = {clean_text(k): clean_text(v) if isinstance(v, str) else v for k, v in row.items()}
    for destination, origin in dataset.columnMap.items():
        if origin not in cleaned:
            raise ValueError(f"Missing mapped column: {origin}")
        cleaned[destination] = cleaned[origin]
    return cleaned

def provenance(dataset: Dataset, row: dict, n: int, locator: str, original_unit=None,
               original_value=None, original_uncertainty=None, transformations=None, pointer=None) -> dict:
    return Provenance(datasetId=dataset.id, datasetVersion=dataset.version,
        sourceId=dataset.sourceId, sourceUrl=dataset.sourceUrl, sourceDate=dataset.sourceDate,
        sourceEdition=dataset.edition, accessedDate=dataset.accessedDate,
        inputPath=dataset.input.path, inputSha256=dataset.input.sha256,
        rowNumber=n, jsonPointer=pointer, locator=locator, originalUnit=original_unit,
        originalValue=original_value, originalUncertainty=original_uncertainty,
        rawRecord=row, transformations=transformations or []).model_dump(mode="json")

def slug(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")

def index_unit(unit: str) -> tuple[str, float]:
    aliases = {"index-1970-1": ("index-1970-1", 1), "index-1970-100": ("index-1970-1", .01),
               "percent": ("percent", 1), "%": ("percent", 1)}
    if unit not in aliases:
        raise ValueError(f"Unknown/unapproved index unit: {unit}")
    return aliases[unit]

def canonical_index(raw: dict, dataset: Dataset, n: int) -> dict:
    row = mapped(raw, dataset)
    metric = row.get("metric", row.get("measure"))
    if metric not in ("relative-index", "index-percent-change"):
        raise ValueError("Only published index values can use the index adapter; occurrence/abundance is not an index")
    if "edition" in row and row["edition"] != dataset.edition:
        raise ValueError("Record edition disagrees with pinned dataset")
    if "sourceIds" in row:
        ids = strict_json(row["sourceIds"]) if isinstance(row["sourceIds"], str) else row["sourceIds"]
        if ids != [dataset.sourceId]:
            raise ValueError("Record source IDs disagree with pinned source")
    if "period" in row:
        p = strict_json(row["period"]) if isinstance(row["period"], str) else row["period"]
        period = {"startYear": year(p["startYear"]), "endYear": year(p["endYear"])}
    elif metric == "relative-index":
        period = {"startYear": year(row["year"]), "endYear": year(row["year"])}
    else:
        period = {"startYear": year(row["startYear"]), "endYear": year(row["endYear"])}
    coverage = dataset.coveragePeriod
    if coverage and (period["startYear"] < coverage.startYear or period["endYear"] > coverage.endYear):
        raise ValueError("Measurement outside pinned dataset coverage")
    if dataset.adapter == "endpoint" and coverage and period != coverage.model_dump():
        raise ValueError("Endpoint period differs from pinned edition coverage")
    unit, factor = index_unit(row["unit"])
    value = number(row.get("value"), dataset.missingTokens)
    uncertainty = None
    original_bounds = None
    if "uncertainty" in row and not missing(row["uncertainty"], dataset.missingTokens):
        original_bounds = strict_json(row["uncertainty"]) if isinstance(row["uncertainty"], str) else row["uncertainty"]
        if original_bounds:
            uncertainty = {k: original_bounds[k] for k in ("kind", "lower", "upper", "level")}
    elif "lower" in row or "upper" in row:
        lower, upper = number(row.get("lower"), dataset.missingTokens), number(row.get("upper"), dataset.missingTokens)
        if (lower is None) != (upper is None):
            raise ValueError("Incomplete uncertainty interval")
        if lower is not None:
            original_bounds = {"kind": row.get("uncertaintyKind", "source-bounds"), "lower": lower,
                               "upper": upper, "level": number(row.get("uncertaintyLevel"), dataset.missingTokens)}
            uncertainty = deepcopy(original_bounds)
    if uncertainty:
        uncertainty["lower"] *= factor
        uncertainty["upper"] *= factor
    if "lastVerified" in row and date.fromisoformat(normalize_date(row["lastVerified"], dataset.dateFormat)) > dataset.accessedDate:
        raise ValueError("Row verification date after dataset access")
    geography, ecosystem = row["geography"], row["ecosystem"]
    scope = row.get("scope", "ecosystem" if ecosystem != "All" else "global" if geography in ("Global", "World") else "region")
    series = slug(row.get("seriesId", f"{dataset.id}-{geography}-{ecosystem}"))
    original_value = raw.get(dataset.columnMap.get("value", "value"))
    original_unit = raw.get(dataset.columnMap.get("unit", "unit"), row["unit"])
    transformations = ["Whitespace/NFC normalization; original row retained"]
    if factor != 1:
        transformations.append(f"Divide published 1970=100 index and bounds by 100; explicit metadata scale, not interpolation")
    if value is None:
        transformations.append("Configured missing token to null; no zero/imputation")
    result = dict(id=f"{series}-{period['startYear']}-{period['endYear']}", datasetId=dataset.id,
        seriesId=series, metric=metric, value=value * factor if value is not None else None, unit=unit,
        period=period, geography=geography, ecosystem=ecosystem, scope=scope,
        taxon=row.get("taxon", "Monitored vertebrates"), edition=dataset.edition, baselineYear=1970,
        uncertainty=uncertainty, missingReason="Missing in source; not imputed" if value is None else None,
        uncertaintyGap="No bounds supplied in source" if uncertainty is None else ("Interval confidence level not verified in chart metadata" if uncertainty.get("level") is None else None),
        temporalMeaning="published-annual-index" if metric == "relative-index" else "published-endpoint-change",
        provenance=[provenance(dataset, raw, n, row.get("sourceLocator", "Published CSV/JSON row"), original_unit,
                               original_value, original_bounds, transformations,
                               f"/{n-1}" if dataset.format == "json" else None)])
    return IndexObservation.model_validate(result).model_dump(mode="json")

def owid_indices(rows: list[dict], dataset: Dataset, metadata: dict) -> list[dict]:
    options = dataset.options
    for key in ("lpi_final", "ci_low", "ci_high"):
        col = metadata["columns"][key]
        if col["conversionFactor"] != 100 or col["timespan"] != "1970-2020" or col["lastUpdated"] != dataset.sourceDate.isoformat():
            raise ValueError("OWID metadata scale/period/source update mismatch; new releases need a new descriptor")
        if "(2024)" not in col["citationShort"] or col["unit"] != "(1970 = 1)":
            raise ValueError("OWID edition/unit metadata mismatch")
    if dataset.edition != "LPR 2024":
        raise ValueError("This pinned OWID adapter is for the 2024 edition only")
    result = []
    for n, raw in enumerate(rows, 1):
        r = mapped(raw, dataset)
        entity = options["entities"].get(r["entity"])
        if entity is None:
            raise ValueError(f"Unmapped OWID entity: {r['entity']}")
        y = year(r["year"])
        if not 1970 <= y <= 2020:
            raise ValueError("OWID observation outside pinned coverage")
        if y == 1970 and number(r["lpi_final"], dataset.missingTokens) != 100:
            raise ValueError("OWID baseline mismatch")
        normalized = dict(metric="relative-index", unit="index-1970-100", value=r["lpi_final"],
            lower=r["ci_low"], upper=r["ci_high"], uncertaintyKind="source-bounds", year=y,
            seriesId=f"{dataset.id}-{slug(r['entity'])}", taxon="Monitored vertebrates", **entity,
            sourceLocator="OWID lpi_final, ci_low, ci_high; conversionFactor=100; 2024 source edition")
        record = canonical_index(normalized, dataset, n)
        record["provenance"][0]["rawRecord"] = raw
        record["provenance"][0]["originalValue"] = raw[dataset.columnMap.get("lpi_final", "lpi_final")]
        record["provenance"][0]["originalUncertainty"] = {"ci_low": r["ci_low"], "ci_high": r["ci_high"], "confidenceLevel": None}
        result.append(record)
    return result

def deduplicate(records: list[dict]) -> tuple[list[dict], dict]:
    """Never average conflicts. Exact duplicates retain all provenance."""
    if not records:
        return [], {"exactDuplicates": 0, "conflicts": 0}
    frame = pd.DataFrame([{"key": (r["datasetId"], r["edition"], r["seriesId"], r["period"]["startYear"], r["period"]["endYear"]), "index": i} for i, r in enumerate(records)])
    found = {}
    exact = 0
    for key, group in frame.groupby("key", sort=False):
        indices = group["index"].tolist()
        first = deepcopy(records[indices[0]])
        compare = lambda r: {k: v for k, v in r.items() if k not in ("id", "provenance")}
        for i in indices[1:]:
            if compare(first) != compare(records[i]):
                raise ValueError(f"Conflicting duplicate observation: {key}")
            first["provenance"].extend(records[i]["provenance"])
            exact += 1
        found[key] = first
    result = sorted(found.values(), key=lambda x: (x["datasetId"], x["seriesId"], x["period"]["startYear"], x["period"]["endYear"]))
    series_versions = {}
    for r in result:
        identity = (r["datasetId"], r["edition"])
        if r["seriesId"] in series_versions and series_versions[r["seriesId"]] != identity:
            raise ValueError("Series ID reused across datasets/editions; would allow accidental splicing")
        series_versions[r["seriesId"]] = identity
    if len({x["id"] for x in result}) != len(result):
        raise ValueError("Observation ID collision across dataset versions")
    return result, {"exactDuplicates": exact, "conflicts": 0}

def species_foundation(rows: list[dict], dataset: Dataset, registry: dict, verified_on: date):
    cleaned, stories, records_provenance, held = [], [], [], []
    ids = set()
    for n, raw in enumerate(rows, 1):
        s = mapped(deepcopy(raw), dataset)
        if dataset.format == "csv":
            for column in dataset.options.get("jsonColumns", []):
                s[column] = strict_json(s[column])
        if s["id"] in ids:
            raise ValueError("Duplicate species ID")
        ids.add(s["id"])
        r = registry["species"].get(s["id"])
        if r is None:
            raise ValueError("Unregistered scientific taxon")
        original_name = raw[dataset.columnMap.get("scientificName", "scientificName")]
        name = clean_text(original_name)
        name = r["acceptedSynonyms"].get(name, name)
        validate_scientific_name(name, s["taxonomy"]["genus"], r["scientificName"])
        s["scientificName"] = name
        conservation = s["conservation"]
        if conservation["category"] not in {"LC", "NT", "VU", "EN", "CR", "EW", "EX", "DD", "NE"} or conservation["system"] != "IUCN-global":
            raise ValueError("Invalid conservation system/category")
        if conservation["verification"] == "public-summary" and (conservation["assessmentYear"] is not None or conservation["assessmentDate"] is not None or conservation["latestAssessmentConfirmed"]):
            raise ValueError("Public summary cannot become a formal assessment")
        if date.fromisoformat(s["lastVerified"]) > verified_on:
            raise ValueError("Species verification after build verification")
        eligible = []
        for m in s["measurements"]:
            validate_population(m, verified_on)
            if m["display"]["eligibility"] == "hold":
                held.append({"speciesId": s["id"], "measurementId": m["id"], "reason": m["display"]["holdReason"]})
            else:
                eligible.append(m)
        s["measurements"] = eligible
        keep = {m["id"] for m in eligible}
        for j, story in enumerate(s["interventions"]):
            original_story = deepcopy(story)
            story["measurementIds"] = [m for m in story["measurementIds"] if m in keep]
            stories.append({"id": story["id"], "speciesId": s["id"], "scientificName": name,
                "kind": story["kind"], "title": story["title"], "geography": story["geography"],
                "description": story["description"], "outcome": story["outcome"],
                "inferenceLimit": story["inferenceLimit"], "measurementIds": story["measurementIds"],
                "provenance": [provenance(dataset, original_story, n,
                    "Original project-authored factual intervention summary; citations embedded in claims",
                    pointer=f"/species/{n-1}/interventions/{j}" if dataset.format == "json" else None, transformations=["Removed links to held numerical measurements; outcome remains qualitative"])]})
        prov = provenance(dataset, raw, n, "Original project-authored scientific species record; claim-level sources retained",
            original_value=original_name, transformations=["Scientific name checked against versioned taxonomic registry", "Held measurements excluded from frontend export; raw snapshot preserved"], pointer=f"/species/{n-1}" if dataset.format == "json" else None)
        # Large raw records remain in the hashed raw snapshot, not duplicated in the frontend.
        prov["rawRecord"] = {"id": s["id"], "scientificName": original_name}
        records_provenance.append({"speciesId": s["id"], "provenance": [prov]})
        cleaned.append(s)
    return sorted(cleaned, key=lambda s: s["id"]), sorted(stories, key=lambda s: s["id"]), records_provenance, held
