"""Reproducible offline build with fail-closed provenance and rights checks."""
import argparse
import hashlib
import json
import os
from pathlib import Path
import platform
import subprocess
import tempfile
from importlib.metadata import version as installed_version
import pandas as pd
import pydantic
from .models import Manifest, Rights
from .processing import (deduplicate, canonical_index, owid_indices, read_rows,
                         sha256, species_foundation, strict_json, verified_path)

ROOT = Path(__file__).resolve().parents[2]
VERSION = "1.0.0"

def dump(value) -> bytes:
    return (json.dumps(value, indent=2, sort_keys=True, ensure_ascii=False, allow_nan=False) + "\n").encode()

def references(node) -> set[str]:
    result = set()
    if isinstance(node, dict):
        if "sourceId" in node:
            result.add(node["sourceId"])
        for v in node.values():
            result |= references(v)
    elif isinstance(node, list):
        for v in node:
            result |= references(v)
    return result

def build(manifest_path: Path, output: Path, report_dir: Path, root: Path = ROOT) -> dict:
    report = {"pipelineVersion": VERSION, "status": "failed", "errors": [], "warnings": [], "datasets": [], "validation": {}}
    report_dir.mkdir(parents=True, exist_ok=True)
    try:
        manifest = Manifest.model_validate(strict_json(manifest_path.read_text()))
        report["verifiedOn"] = manifest.verifiedOn.isoformat()
        fingerprints = []
        for entry in manifest.supportingFiles:
            verified_path(root, entry)
            fingerprints.append(entry.model_dump())
        catalog_path = root / "data/sources/species-citations.json"
        catalog = strict_json(catalog_path.read_text())
        extra_catalog = strict_json((root / "data/sources/pipeline-citations.json").read_text())
        all_sources = catalog["citations"] + extra_catalog["citations"]
        source_map = {c["id"]: c for c in all_sources}
        if len(source_map) != len(all_sources):
            raise ValueError("Duplicate citation IDs across catalogs")
        registry = strict_json((root / "data/sources/taxonomic-registry.json").read_text())
        observations, species, stories, species_provenance, held = [], [], [], [], []
        source_rights = {}
        for dataset in manifest.datasets:
            if dataset.rights.commercialUse != "allowed" or not dataset.rights.redistribution:
                raise ValueError(f"Rights unresolved: {dataset.id}. Configure a blocked source, not an active input")
            if "-NC" in dataset.rights.licenseId.upper() or "/by-nc" in dataset.rights.licenseUrl or dataset.rights.licenseId in ("restricted", "unverified"):
                raise ValueError(f"License unsuitable for frontend redistribution: {dataset.id}")
            citation = source_map.get(dataset.sourceId)
            if not citation or citation["verification"] != "page-read" or citation["url"] != dataset.sourceUrl:
                raise ValueError(f"Unverified/mismatched dataset source: {dataset.sourceId}")
            source_rights[dataset.sourceId] = dataset.rights.model_dump(mode="json")
            path = verified_path(root, dataset.input)
            fingerprints.append(dataset.input.model_dump())
            metadata = None
            if dataset.metadata:
                metadata = strict_json(verified_path(root, dataset.metadata).read_text())
                fingerprints.append(dataset.metadata.model_dump())
            rows = read_rows(path, dataset.format, dataset.recordPath)
            if not rows:
                raise ValueError(f"Empty active dataset: {dataset.id}")
            if dataset.adapter != "species-foundation" and dataset.coveragePeriod is None:
                raise ValueError("Index import requires an explicit edition coveragePeriod")
            before = len(observations)
            if dataset.adapter == "species-foundation":
                if species:
                    raise ValueError("Multiple species snapshots require explicit reconciliation")
                species, stories, species_provenance, held = species_foundation(rows, dataset, registry, manifest.verifiedOn)
                population_rights = dataset.options.get("populationSourceRights", {})
                for s in species:
                    for m in s["measurements"]:
                        for ref in m["references"]:
                            rights = Rights.model_validate(population_rights.get(ref["sourceId"], {}))
                            if rights.commercialUse != "allowed" or not rights.redistribution or rights.verifiedOn > manifest.verifiedOn or "-NC" in rights.licenseId.upper() or "/by-nc" in rights.licenseUrl:
                                raise ValueError("Population source rights unresolved")
                            source_rights[ref["sourceId"]] = rights.model_dump(mode="json")
            elif dataset.adapter == "owid-index":
                if metadata is None:
                    raise ValueError("OWID adapter requires metadata")
                observations.extend(owid_indices(rows, dataset, metadata))
            else:
                observations.extend(canonical_index(row, dataset, n) for n, row in enumerate(rows, 1))
            report["datasets"].append({"id": dataset.id, "inputRecords": len(rows), "indexRecords": len(observations) - before,
                "version": dataset.version, "edition": dataset.edition, "inputSha256": dataset.input.sha256})
        observations, duplicates = deduplicate(observations)
        if len(species) != 6:
            raise ValueError("This project requires its selected six-species foundation")
        report["duplicates"] = duplicates
        report["heldMeasurements"] = sorted(held, key=lambda x: x["measurementId"])
        report["blockedSources"] = [b.model_dump() for b in manifest.blockedSources]
        report["warnings"] += ["LPI measures average relative change in monitored populations, not individual animals lost.",
            "2024 annual index and 2026 endpoint summaries are separate editions and must not be spliced.",
            "Unverified bound confidence levels remain null; source bounds are preserved.",
            "Formal IUCN assessment metadata and media clearance remain unresolved."]
        # No process timestamps: deterministic output for the same inputs, code, locks and environment.
        code_paths = list((ROOT / "scripts/data").glob("*.py")) + list((ROOT / "scripts/data").glob("*.ts")) + list((ROOT / "data/schemas").glob("*.ts"))
        code_paths += [ROOT / "scripts/data/requirements.txt", ROOT / "scripts/data/requirements.lock.txt", ROOT / "package-lock.json", ROOT / "tsconfig.json"]
        code_hashes = [{"path": str(p.relative_to(ROOT)), "sha256": sha256(p)} for p in sorted(code_paths)]
        node_version = subprocess.run(["node", "--version"], capture_output=True, text=True, check=True).stdout.strip()
        zod_version = strict_json((ROOT / "node_modules/zod/package.json").read_text())["version"]
        environment = {"python": platform.python_version(), "pandas": pd.__version__, "pydantic": pydantic.__version__,
                       "numpy": installed_version("numpy"), "node": node_version, "zod": zod_version}
        fingerprint = hashlib.sha256(dump({"manifest": manifest.model_dump(mode="json"), "files": fingerprints,
                                         "code": code_hashes, "environment": environment})).hexdigest()
        for r in observations:
            if r["uncertainty"] is None:
                report["warnings"].append(f"No uncertainty supplied: {r['id']}")
        dataset_summaries = [{"id": d.id, "version": d.version, "edition": d.edition,
            "sourceId": d.sourceId, "sourceDate": d.sourceDate.isoformat() if d.sourceDate else None,
            "accessedDate": d.accessedDate.isoformat(), "rights": d.rights.model_dump(mode="json")} for d in manifest.datasets]
        bundle = {"schemaVersion": "1.0.0", "pipelineVersion": VERSION, "verifiedOn": manifest.verifiedOn.isoformat(),
            "buildFingerprint": fingerprint, "datasets": dataset_summaries, "indexObservations": observations,
            "sourceRights": [{"sourceId": id, "rights": rights} for id, rights in sorted(source_rights.items())],
            "speciesFoundation": {"schemaVersion": "1.0.0", "project": "VANISHING FREQUENCIES", "lastVerified": manifest.verifiedOn.isoformat(), "species": species},
            "speciesProvenance": species_provenance, "successStories": stories,
            "availability": {"annualIndexEditions": sorted({x["edition"] for x in observations if x["metric"] == "relative-index"}),
                "endpointEditions": sorted({x["edition"] for x in observations if x["metric"] == "index-percent-change"}),
                "speciesPopulationRecords": sum(len(s["measurements"]) for s in species),
                "heldPopulationRecords": len(held), "blockedSources": report["blockedSources"]},
            "citations": []}
        used = references(bundle)
        for id in used:
            source = source_map.get(id)
            if not source or source["verification"] != "page-read":
                raise ValueError(f"Missing/unverified citation used: {id}")
        bundle["citations"] = sorted([source_map[id] for id in used], key=lambda x: x["id"])
        output.mkdir(parents=True, exist_ok=True)
        with tempfile.TemporaryDirectory(prefix=".vf-stage-", dir=output) as stage_name:
            stage = Path(stage_name)
            candidate = stage / "biodiversity.json"
            candidate.write_bytes(dump(bundle))
            # Validate original research snapshot as well as the filtered frontend bundle.
            species_input = next(d for d in manifest.datasets if d.adapter == "species-foundation")
            result = subprocess.run(["node", "--import", "tsx", str(ROOT / "scripts/data/validate-export.ts"),
                                     str(candidate), str(root / species_input.input.path), str(catalog_path)],
                                    cwd=ROOT, capture_output=True, text=True, check=False)
            if result.returncode:
                raise ValueError("Zod validation failed: " + result.stdout + result.stderr)
            report["validation"]["zod"] = result.stdout.strip()
            report["status"] = "passed"
            report["buildFingerprint"] = fingerprint
            report["inputs"] = fingerprints
            report["code"] = code_hashes
            report["environment"] = environment
            report["counts"] = {"indexObservations": len(observations), "indexMissingValues": sum(r["value"] is None for r in observations),
                "series": len({r["seriesId"] for r in observations}), "species": len(species),
                "populationRecords": bundle["availability"]["speciesPopulationRecords"], "heldPopulationRecords": len(held), "successStories": len(stories)}
            report["coverage"] = [{"datasetId": d.id, "seriesId": series,
                "years": sorted({r["period"]["endYear"] for r in observations if r["seriesId"] == series}),
                "meaning": "published values only; no new interpolation"}
                for d in manifest.datasets for series in sorted({r["seriesId"] for r in observations if r["datasetId"] == d.id})]
            report["outputs"] = {"biodiversity.json": {"sha256": sha256(candidate), "bytes": candidate.stat().st_size}}
            # One atomic frontend bundle commit, only after every Python and Zod check passed.
            os.replace(candidate, output / "biodiversity.json")
    except Exception as exc:
        report["errors"].append(str(exc))
    report_bytes = dump(report)
    report_tmp = report_dir / ".validation-report.json.tmp"
    report_tmp.write_bytes(report_bytes)
    os.replace(report_tmp, report_dir / "validation-report.json")
    markdown = ["# Pipeline validation report", "", f"**Status:** {report['status']}", "", f"Pipeline: {VERSION}", ""]
    for key, value in report.get("counts", {}).items():
        markdown.append(f"- {key}: {value}")
    markdown += ["", "## Errors", ""] + (["- " + x for x in report["errors"]] or ["None."])
    markdown += ["", "## Warnings", ""] + ["- " + x for x in report["warnings"]]
    (report_dir / "validation-report.md").write_text("\n".join(markdown) + "\n")
    return report

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", type=Path, default=ROOT / "data/sources/pipeline-manifest.json")
    parser.add_argument("--output", type=Path, default=ROOT / "data/processed")
    parser.add_argument("--reports", type=Path, default=ROOT / "data/processed/reports")
    args = parser.parse_args()
    report = build(args.manifest, args.output, args.reports)
    print(json.dumps({"status": report["status"], "counts": report.get("counts"), "errors": report["errors"]}, indent=2))
    raise SystemExit(0 if report["status"] == "passed" else 1)

if __name__ == "__main__":
    main()
