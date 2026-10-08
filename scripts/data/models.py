"""Strict preparation contracts; frontend contracts are independently checked by Zod."""
from datetime import date
import math
import re
from typing import Any, Literal
from pydantic import BaseModel, ConfigDict, Field, model_validator

class StrictModel(BaseModel):
    model_config = ConfigDict(extra="forbid", allow_inf_nan=False)

class Period(StrictModel):
    startYear: int = Field(ge=1500, le=2100)
    endYear: int = Field(ge=1500, le=2100)
    @model_validator(mode="after")
    def ordered(self):
        if self.startYear > self.endYear:
            raise ValueError("Reversed period")
        return self

class Bounds(StrictModel):
    kind: Literal["source-bounds", "confidence-interval", "credible-interval"]
    lower: float
    upper: float
    level: float | None = Field(default=None, gt=0, lt=1)
    @model_validator(mode="after")
    def ordered(self):
        if self.lower > self.upper:
            raise ValueError("Reversed uncertainty bounds")
        return self

class Rights(StrictModel):
    licenseId: str = Field(min_length=1)
    licenseUrl: str = Field(pattern=r"^(https://|urn:vanishing-frequencies:)")
    evidenceUrl: str = Field(pattern=r"^(https://|urn:vanishing-frequencies:)")
    verifiedOn: date
    commercialUse: Literal["allowed", "permission-required", "unverified"]
    redistribution: bool
    attribution: str = Field(min_length=1)
    notes: str = Field(min_length=1)
    authorizationReference: str | None = None

class InputFile(StrictModel):
    path: str
    sha256: str = Field(pattern=r"^[0-9a-f]{64}$")

class Dataset(StrictModel):
    id: str = Field(pattern=r"^[a-z0-9-]+$")
    adapter: Literal["owid-index", "endpoint", "species-foundation", "canonical-index"]
    input: InputFile
    format: Literal["csv", "json"]
    version: str
    edition: str
    sourceId: str
    sourceUrl: str = Field(pattern=r"^(https://|urn:vanishing-frequencies:)")
    sourceDate: date | None
    accessedDate: date
    rights: Rights
    metadata: InputFile | None = None
    recordPath: str | None = None
    dateFormat: str = "%Y-%m-%d"
    missingTokens: list[str] = Field(default_factory=lambda: ["", "null", "NA", "N/A"])
    columnMap: dict[str, str] = Field(default_factory=dict)
    options: dict[str, Any] = Field(default_factory=dict)
    coveragePeriod: Period | None = None

class Blocker(StrictModel):
    id: str
    sourceUrl: str = Field(pattern=r"^https://")
    reason: str
    requirements: list[str] = Field(min_length=1)
    importAdapter: Literal["canonical-index", "species-foundation"]

class Manifest(StrictModel):
    schemaVersion: Literal["1.0.0"]
    verifiedOn: date
    datasets: list[Dataset] = Field(min_length=1)
    supportingFiles: list[InputFile]
    blockedSources: list[Blocker]
    @model_validator(mode="after")
    def unique(self):
        ids = [x.id for x in self.datasets]
        if len(set(ids)) != len(ids):
            raise ValueError("Duplicate dataset IDs")
        for d in self.datasets:
            if d.accessedDate > self.verifiedOn or d.rights.verifiedOn > self.verifiedOn:
                raise ValueError("Access/rights verification after manifest date")
            if d.sourceDate and d.sourceDate > d.accessedDate:
                raise ValueError("Source date after access")
        return self

class Provenance(StrictModel):
    datasetId: str
    datasetVersion: str
    sourceId: str
    sourceUrl: str
    sourceDate: date | None
    sourceEdition: str
    accessedDate: date
    inputPath: str
    inputSha256: str
    rowNumber: int = Field(ge=1)
    jsonPointer: str | None
    locator: str
    originalUnit: str | None
    originalValue: Any
    originalUncertainty: Any
    rawRecord: dict[str, Any]
    transformations: list[str]

class IndexObservation(StrictModel):
    id: str
    datasetId: str
    seriesId: str
    metric: Literal["relative-index", "index-percent-change"]
    value: float | None
    unit: Literal["index-1970-1", "percent"]
    period: Period
    geography: str = Field(min_length=1)
    ecosystem: str = Field(min_length=1)
    scope: Literal["global", "region", "ecosystem"]
    taxon: str = Field(min_length=1)
    edition: str
    baselineYear: Literal[1970]
    uncertainty: Bounds | None
    missingReason: str | None
    uncertaintyGap: str | None
    temporalMeaning: Literal["published-annual-index", "published-endpoint-change"]
    provenance: list[Provenance] = Field(min_length=1)
    @model_validator(mode="after")
    def scientific_checks(self):
        if self.metric == "relative-index":
            if self.unit != "index-1970-1" or self.temporalMeaning != "published-annual-index":
                raise ValueError("Index unit/temporal meaning mismatch")
            if self.period.startYear != self.period.endYear:
                raise ValueError("Annual index must refer to one year")
        elif self.unit != "percent" or self.temporalMeaning != "published-endpoint-change":
            raise ValueError("Endpoint unit/temporal meaning mismatch")
        if self.metric == "index-percent-change" and self.period.startYear != self.baselineYear:
            raise ValueError("Endpoint baseline year mismatch")
        minimum = -100 if self.metric == "index-percent-change" else 0
        if self.value is not None and self.value < minimum:
            raise ValueError("Impossible index value")
        if self.value is None and not self.missingReason:
            raise ValueError("Missing value needs explanation")
        if self.value is not None and self.missingReason:
            raise ValueError("Nonmissing value has missing reason")
        if self.uncertainty is None and not self.uncertaintyGap:
            raise ValueError("Absent uncertainty needs explanation")
        if self.uncertainty:
            if self.uncertainty.lower < minimum:
                raise ValueError("Impossible uncertainty bound")
            if self.value is not None and not (self.uncertainty.lower <= self.value <= self.uncertainty.upper):
                raise ValueError("Estimate outside uncertainty bounds")
        for p in self.provenance:
            if p.datasetId != self.datasetId or p.sourceEdition != self.edition:
                raise ValueError("Provenance dataset/edition mismatch")
            if self.period.endYear > p.accessedDate.year:
                raise ValueError("Measurement after access year")
            if p.sourceDate and self.period.endYear > p.sourceDate.year:
                raise ValueError("Measurement after publication year")
        return self

class Value(StrictModel):
    kind: Literal["point", "range"]
    value: float | None = None
    lower: float | None = None
    upper: float | None = None
    @model_validator(mode="after")
    def valid(self):
        if self.kind == "point":
            if self.value is None or self.value < 0 or self.lower is not None or self.upper is not None:
                raise ValueError("Invalid point estimate")
        elif self.lower is None or self.upper is None or self.lower < 0 or self.lower > self.upper or self.value is not None:
            raise ValueError("Invalid estimate range")
        return self

def validate_population(m: dict, verified_on: date):
    """Retain original contract; reject scientific errors before the Zod structural check."""
    Value.model_validate(m["value"])
    if m["sourcePublicationYear"] > verified_on.year:
        raise ValueError("Population source publication after verification year")
    allowed = {"individuals", "mature-individuals", "adult-individuals", "nesting-females"}
    if m["unit"] not in allowed or m["metric"] != "population-estimate":
        raise ValueError("Population unit/metric mismatch (observations cannot be abundance)")
    if m["measurementPeriod"]:
        period = Period.model_validate({k: m["measurementPeriod"][k] for k in ("startYear", "endYear")})
        if period.endYear > m["sourcePublicationYear"] or period.endYear > verified_on.year:
            raise ValueError("Population measurement after publication/verification")
    elif not m["periodGap"]:
        raise ValueError("Missing measurement period explanation")
    uncertainty = m["uncertainty"]
    if uncertainty["kind"] in ("confidence-interval", "credible-interval"):
        b = Bounds.model_validate({k: uncertainty[k] for k in ("kind", "lower", "upper", "level")})
        if b.lower < 0 or (m["value"]["kind"] == "point" and not b.lower <= m["value"]["value"] <= b.upper):
            raise ValueError("Population interval invalid")
    elif uncertainty["kind"] == "coefficient-of-variation":
        if not isinstance(uncertainty["value"], (float, int)) or not math.isfinite(uncertainty["value"]) or uncertainty["value"] < 0:
            raise ValueError("Invalid coefficient of variation")
    elif uncertainty["kind"] != "not-reported" or not uncertainty["explanation"]:
        raise ValueError("Unrecognized/missing uncertainty")
    if m["display"]["eligibility"] == "dated-context-only" and (not m["measurementPeriod"] or m["methodVerification"] != "verified"):
        raise ValueError("Population not eligible for display")

def validate_scientific_name(name: str, genus: str, expected: str):
    if not re.fullmatch(r"[A-Z][a-z]+ [a-z]+", name) or name.split()[0] != genus or name != expected:
        raise ValueError(f"Scientific name inconsistent: {name}; expected {expected}")
