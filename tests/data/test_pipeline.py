"""Real snapshot tests and deliberate invalid mutations; no scientific fixture values invented."""
from copy import deepcopy
from datetime import date
import json
from pathlib import Path
import pytest
from scripts.data.models import Dataset, IndexObservation, Manifest, validate_population, validate_scientific_name
from scripts.data.pipeline import ROOT, build
from scripts.data.processing import (canonical_index, deduplicate, index_unit, normalize_date,
    number, owid_indices, read_rows, sha256, species_foundation, strict_json, year)

MANIFEST_PATH = ROOT / "data/sources/pipeline-manifest.json"

@pytest.fixture
def manifest():
    return Manifest.model_validate(strict_json(MANIFEST_PATH.read_text()))

@pytest.fixture
def endpoint(manifest):
    d = next(d for d in manifest.datasets if d.adapter == "endpoint")
    return d, read_rows(ROOT / d.input.path, d.format)[0]

@pytest.fixture
def snapshot(manifest):
    d = next(d for d in manifest.datasets if d.adapter == "species-foundation")
    rows = read_rows(ROOT / d.input.path, d.format, d.recordPath)
    registry = strict_json((ROOT / "data/sources/taxonomic-registry.json").read_text())
    return d, rows, registry

def test_real_csv_and_json_are_equivalent(endpoint):
    d, _ = endpoint
    csv_rows = read_rows(ROOT / d.input.path, "csv")
    json_rows = read_rows(ROOT / "data/raw/observations.json", "json")
    d_json = d.model_copy(update={"format": "json"})
    a = [canonical_index(r, d, i) for i, r in enumerate(csv_rows, 1)]
    b = [canonical_index(r, d_json, i) for i, r in enumerate(json_rows, 1)]
    strip = lambda r: {k:v for k,v in r.items() if k != "provenance"}
    assert list(map(strip, a)) == list(map(strip, b))
    assert len(a) == 9

def test_real_owid_bounds_and_units_preserved(manifest):
    d = next(d for d in manifest.datasets if d.adapter == "owid-index")
    rows = read_rows(ROOT / d.input.path, "csv")
    metadata = strict_json((ROOT / d.metadata.path).read_text())
    records = owid_indices(rows, d, metadata)
    assert len(records) == 357
    for r, raw in zip(records, rows):
        assert r["value"] == float(raw["lpi_final"]) * .01
        assert r["uncertainty"]["lower"] == float(raw["ci_low"]) * .01
        assert r["uncertainty"]["upper"] == float(raw["ci_high"]) * .01
        assert r["uncertainty"]["level"] is None
        assert r["provenance"][0]["rawRecord"] == raw
        assert r["provenance"][0]["originalUnit"] == "index-1970-100"
        assert r["edition"] == "LPR 2024"
    assert {r["period"]["endYear"] for r in records} == set(range(1970, 2021))

def test_exact_duplicates_keep_provenance(endpoint):
    d, raw = endpoint
    a, b = canonical_index(raw, d, 1), canonical_index(raw, d, 2)
    result, report = deduplicate([a,b])
    assert report == {"exactDuplicates":1,"conflicts":0}
    assert len(result) == 1 and len(result[0]["provenance"]) == 2

def test_conflicting_duplicates_fail(endpoint):
    d, raw = endpoint
    a = canonical_index(raw, d, 1)
    b = deepcopy(a); b["value"] = None; b["missingReason"] = "Deliberate invalid mutation for conflict test"
    with pytest.raises(ValueError, match="Conflicting duplicate"):
        deduplicate([a,b])

def test_edition_disagreement_fails(endpoint):
    d, raw = endpoint
    row=deepcopy(raw);row["edition"]="LPR 2024"
    with pytest.raises(ValueError, match="edition"):
        canonical_index(row,d,1)

def test_coverage_disagreement_fails(endpoint):
    d, raw = endpoint
    row=deepcopy(raw);row["period"]={"startYear":1970,"endYear":2020}
    with pytest.raises(ValueError, match="period differs"):
        canonical_index(row,d,1)

@pytest.mark.parametrize("token", ["", "NA", "null", "N/A", "  "])
def test_missing_values_stay_null(endpoint,token):
    d, raw=endpoint
    row=deepcopy(raw);row["value"]=token
    r=canonical_index(row,d,1)
    assert r["value"] is None and r["missingReason"] and r["provenance"][0]["originalValue"]==token

@pytest.mark.parametrize("invalid", ["NaN","Infinity",float("inf"),True,"1,898"])
def test_nonfinite_boolean_or_ambiguous_numeric_rejected(invalid):
    with pytest.raises((ValueError,TypeError)):
        number(invalid,[""])

@pytest.mark.parametrize("invalid", ["2020.0",True,"20","2020-01-01"])
def test_years_are_not_guessed(invalid):
    with pytest.raises(ValueError): year(invalid)

def test_explicit_dates():
    assert normalize_date("08/10/2026","%d/%m/%Y")=="2026-10-08"
    assert normalize_date(None) is None
    with pytest.raises(ValueError): normalize_date("08/10/2026")
    with pytest.raises(ValueError): normalize_date("2026-2-01")

def test_observation_counts_cannot_be_population_or_index(endpoint,snapshot):
    d, raw=endpoint
    row=deepcopy(raw);row["measure"]="occurrences";row["unit"]="records"
    with pytest.raises(ValueError,match="occurrence"):
        canonical_index(row,d,1)
    _,species,_=snapshot
    m=deepcopy(species[0]["measurements"][0]);m["unit"]="records"
    with pytest.raises(ValueError,match="Population unit"):
        validate_population(m,date(2026,10,8))

def test_unknown_unit_rejected():
    with pytest.raises(ValueError): index_unit("animals lost")

def test_negative_population_rejected(snapshot):
    _,species,_=snapshot
    m=deepcopy(species[0]["measurements"][0]);m["value"]["value"]=-1
    with pytest.raises(ValueError): validate_population(m,date(2026,10,8))

def test_impossible_index_rejected(endpoint):
    d,raw=endpoint
    row=deepcopy(raw);row["value"]=-101
    with pytest.raises(ValueError): canonical_index(row,d,1)

def test_reversed_population_period_rejected(snapshot):
    _,species,_=snapshot
    m=deepcopy(species[0]["measurements"][0]);m["measurementPeriod"]["startYear"]=2025
    with pytest.raises(ValueError): validate_population(m,date(2026,10,8))

def test_incomplete_bounds_rejected(endpoint):
    d,raw=endpoint
    row=deepcopy(raw);row.pop("uncertainty");row.update(lower="",upper="0")
    with pytest.raises(ValueError,match="Incomplete"):
        canonical_index(row,d,1)

def test_source_update_not_relabelled(manifest):
    d=next(d for d in manifest.datasets if d.adapter=="owid-index")
    rows=read_rows(ROOT/d.input.path,"csv")
    metadata=strict_json((ROOT/d.metadata.path).read_text())
    metadata["columns"]["lpi_final"]["conversionFactor"]=1
    with pytest.raises(ValueError,match="metadata"):
        owid_indices(rows,d,metadata)

def test_scientific_names_registry_and_synonyms(snapshot):
    d,rows,registry=snapshot
    valid,stories,provs,held=species_foundation(rows,d,registry,date(2026,10,8))
    assert len(valid)==6 and len(stories)==6 and len(held)==4
    assert sum(len(s["measurements"]) for s in valid)==2
    assert all(m["display"]["eligibility"]=="dated-context-only" for s in valid for m in s["measurements"])
    assert {x["speciesId"] for x in provs}=={s["id"] for s in valid}
    rows=deepcopy(rows);rows[0]["scientificName"]=" Uncia  uncia "
    corrected,_,_,_=species_foundation(rows,d,registry,date(2026,10,8))
    assert next(s for s in corrected if s["id"]=="snow-leopard")["scientificName"]=="Panthera uncia"
    with pytest.raises(ValueError): validate_scientific_name("Pongo abelii","Pongo","Pongo pygmaeus")

def test_species_csv_equivalent_and_preserves_original_name(snapshot,tmp_path):
    import csv
    d,rows,registry=snapshot
    path=tmp_path/"species.csv"
    nested=[k for k,v in rows[0].items() if isinstance(v,(dict,list)) or v is None]
    with path.open('w',newline='') as handle:
        writer=csv.DictWriter(handle,fieldnames=list(rows[0]));writer.writeheader()
        for raw in rows:
            writer.writerow({k:json.dumps(v) if k in nested else v for k,v in raw.items()})
    d_csv=d.model_copy(update={"format":"csv","options":{**d.options,"jsonColumns":nested}})
    parsed=read_rows(path,"csv")
    actual,stories,_,held=species_foundation(parsed,d_csv,registry,date(2026,10,8))
    expected,expected_stories,_,expected_held=species_foundation(rows,d,registry,date(2026,10,8))
    assert actual==expected and held==expected_held
    assert [{k:v for k,v in s.items() if k!='provenance'} for s in stories]==[{k:v for k,v in s.items() if k!='provenance'} for s in expected_stories]
    changed=deepcopy(rows);changed[0]["scientificName"]=" Uncia  uncia "
    _,_,provs,_=species_foundation(changed,d,registry,date(2026,10,8))
    assert provs[0]["provenance"][0]["originalValue"]==" Uncia  uncia "

def test_canonical_column_mapping_and_explicit_row_date(endpoint):
    d,raw=endpoint
    row=deepcopy(raw);row['published_change']=row.pop('value');row['lastVerified']='08/10/2026'
    mapped=d.model_copy(update={'columnMap':{'value':'published_change'},'dateFormat':'%d/%m/%Y'})
    result=canonical_index(row,mapped,1)
    assert result['value']==float(row['published_change'])
    assert result['provenance'][0]['originalValue']==row['published_change']

def test_interval_contract_preserves_input_without_promoting_hold(snapshot):
    # This checks structural preservation by reclassifying an existing real range as an invalid/nonproduction test input.
    _,rows,_=snapshot
    original=next(s for s in rows if s['id']=='tiger')['measurements'][0]
    m=deepcopy(original)
    m['uncertainty']={'kind':'credible-interval','lower':m['value']['lower'],'upper':m['value']['upper'],'level':.95,'explanation':'Deliberate contract fixture; not evidence of an actual tiger interval.'}
    before=deepcopy(m)
    validate_population(m,date(2026,10,8))
    assert m==before

@pytest.mark.parametrize("category",["Endangered","UNKNOWN","EXX"])
def test_status_codes_not_guessed(snapshot,category):
    d,rows,registry=snapshot
    rows=deepcopy(rows);rows[0]["conservation"]["category"]=category
    with pytest.raises(ValueError): species_foundation(rows,d,registry,date(2026,10,8))

def test_assessment_metadata_not_promoted(snapshot):
    d,rows,registry=snapshot
    rows=deepcopy(rows);rows[0]["conservation"]["assessmentYear"]=2026
    with pytest.raises(ValueError,match="formal assessment"):
        species_foundation(rows,d,registry,date(2026,10,8))

def test_json_rejects_nonfinite_and_duplicate_keys():
    with pytest.raises(ValueError): strict_json('{"value":NaN}')
    with pytest.raises(ValueError): strict_json('{"year":1970,"year":2020}')

def test_csv_does_not_skip_ragged_rows_or_duplicate_headers(tmp_path):
    path=tmp_path/"bad.csv";path.write_text("id,id\na,b\n")
    with pytest.raises(ValueError): read_rows(path,"csv")
    path.write_text("id,value\na,1,extra\n")
    with pytest.raises(ValueError): read_rows(path,"csv")

def test_reproducible_real_pipeline_and_no_interpolation(tmp_path):
    first=build(MANIFEST_PATH,tmp_path/"a",tmp_path/"reports-a")
    second=build(MANIFEST_PATH,tmp_path/"b",tmp_path/"reports-b")
    assert first["status"]==second["status"]=="passed"
    assert (tmp_path/"a/biodiversity.json").read_bytes()==(tmp_path/"b/biodiversity.json").read_bytes()
    assert first["outputs"]==second["outputs"]
    assert first["counts"]=={"indexObservations":366,"indexMissingValues":0,"series":16,"species":6,"populationRecords":2,"heldPopulationRecords":4,"successStories":6}
    data=json.loads((tmp_path/"a/biodiversity.json").read_text())
    assert data["availability"]["annualIndexEditions"]==["LPR 2024"]
    assert data["availability"]["endpointEditions"]==["LPR 2026"]
    assert all(len(s["measurements"])<=1 for s in data["speciesFoundation"]["species"])

@pytest.mark.parametrize("fault",["checksum","rights","missing-source","missing-population-rights"])
def test_failed_build_keeps_previous_export(tmp_path,fault):
    raw=json.loads(MANIFEST_PATH.read_text())
    if fault=="checksum": raw["datasets"][0]["input"]["sha256"]="0"*64
    if fault=="rights": raw["datasets"][0]["rights"]["commercialUse"]="permission-required"
    if fault=="missing-source": raw["datasets"][0]["sourceId"]="missing-source"
    if fault=="missing-population-rights": raw["datasets"][2]["options"]["populationSourceRights"]={}
    path=tmp_path/"manifest.json";path.write_text(json.dumps(raw))
    out=tmp_path/"out";out.mkdir();(out/"biodiversity.json").write_text("previous artifact")
    report=build(path,out,tmp_path/"reports")
    assert report["status"]=="failed" and report["errors"]
    assert (out/"biodiversity.json").read_text()=="previous artifact"
    assert json.loads((tmp_path/"reports/validation-report.json").read_text())["status"]=="failed"
