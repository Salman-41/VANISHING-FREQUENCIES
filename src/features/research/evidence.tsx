import Link from "next/link";
import type {
  BiodiversityDataset,
  ConservationStory,
} from "../../../data/schemas/biodiversity.schema";
import type {
  ConservationStatus,
  PopulationMeasurement,
  ScientificClaim,
  ScientificReference,
  SpeciesRecord,
} from "../../../data/schemas/species.schema";
import { resolveReferences } from "./selectors";
import { conservationLabels } from "./labels";

export function SourceReferences({
  data,
  references,
  verifiedOn,
}: {
  data: BiodiversityDataset;
  references: ScientificReference[];
  verifiedOn: string;
}) {
  const sources = resolveReferences(data, references);
  return (
    <div className="source-disclosure">
      <p>
        Evidence checked <time dateTime={verifiedOn}>{verifiedOn}</time>.{" "}
        {sources.map(({ citation }, i) => (
          <span key={`${citation.id}-${i}`}>
            <Link href={`/sources#${citation.id}`}>
              {citation.publisher}: {citation.title}
            </Link>
            {i < sources.length - 1 ? "; " : "."}
          </span>
        ))}
      </p>
      <details>
        <summary>Source locations and publication dates</summary>
        <ul>
          {sources.map(({ citation, reference }, i) => (
            <li key={`${citation.id}-${i}`}>
              <a href={citation.url}>{citation.title}</a> — {reference.locator}.
              Published{" "}
              {citation.publicationDate ??
                citation.publicationYear ??
                "date not reported"}
              ; accessed {citation.accessedDate}.
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}
export function Claim({
  data,
  claim,
}: {
  data: BiodiversityDataset;
  claim: ScientificClaim;
}) {
  return (
    <div className="claim">
      <p>{claim.text}</p>
      <SourceReferences
        data={data}
        references={claim.references}
        verifiedOn={claim.lastVerified}
      />
    </div>
  );
}
export function Status({
  data,
  status,
}: {
  data: BiodiversityDataset;
  status: ConservationStatus;
}) {
  return (
    <div>
      <p>
        <strong>{conservationLabels[status.category]}</strong> —{" "}
        {status.system === "IUCN-global"
          ? "IUCN global category"
          : status.system}
        ,{" "}
        {status.verification === "public-summary"
          ? "verified public summary"
          : "authorized assessment"}
        .
      </p>
      <p className="meta">
        {status.assessmentDate ? <span>Assessment date: <time dateTime={status.assessmentDate}>{status.assessmentDate}</time>.</span>
          : status.assessmentYear === null
            ? "Formal assessment date is unverified; the latest assessment has not been confirmed."
            : `Assessment year: ${status.assessmentYear}.`}{" "}
        Verification date below is not an assessment date.
      </p>
      <SourceReferences
        data={data}
        references={status.references}
        verifiedOn={status.lastVerified}
      />
    </div>
  );
}
export function Measurement({
  data,
  measurement: m,
}: {
  data: BiodiversityDataset;
  measurement: PopulationMeasurement;
}) {
  if (m.display.eligibility !== "dated-context-only" || !m.measurementPeriod)
    throw new Error("Held or undated estimate cannot be rendered");
  const number = new Intl.NumberFormat("en-US", { maximumFractionDigits: 6 });
  const value =
    m.value.kind === "point"
      ? number.format(m.value.value)
      : `${number.format(m.value.lower)}–${number.format(m.value.upper)}`;
  const period = `${m.measurementPeriod.startYear}–${m.measurementPeriod.endYear}`;
  const uncertainty =
    m.uncertainty.kind === "not-reported"
      ? m.uncertainty.explanation
      : m.uncertainty.kind === "coefficient-of-variation"
        ? `Coefficient of variation: ${m.uncertainty.value}. ${m.uncertainty.explanation}`
        : `${m.uncertainty.kind}: ${m.uncertainty.lower}–${m.uncertainty.upper}, level ${m.uncertainty.level}. ${m.uncertainty.explanation}`;
  return (
    <article className="measurement" id={m.id}>
      <h3>Historical population estimate</h3>
      <p className="measurement-value">
        {value} {m.unit.replaceAll("-", " ")}
      </p>
      <p>{m.display.requiredContext}</p>
      <dl className="facts">
        <div>
          <dt>Population and scope</dt>
          <dd>
            {m.population} ({m.scope})
          </dd>
        </div>
        <div>
          <dt>Geography</dt>
          <dd>{m.geography}</dd>
        </div>
        <div>
          <dt>Measurement period</dt>
          <dd>
            {period} · {m.measurementPeriod.basis.replaceAll("-", " ")}
          </dd>
        </div>
        <div>
          <dt>Publication / edition</dt>
          <dd>
            {m.sourcePublicationYear} · {m.sourceEdition}
          </dd>
        </div>
        <div>
          <dt>Method</dt>
          <dd>{m.method}</dd>
        </div>
        <div>
          <dt>Uncertainty</dt>
          <dd>{uncertainty}</dd>
        </div>
      </dl>
      {m.caveats.map((c) => (
        <p className="meta" key={c}>
          {c}
        </p>
      ))}
      <SourceReferences
        data={data}
        references={m.references}
        verifiedOn={m.lastVerified}
      />
    </article>
  );
}
export function SpeciesCard({
  data,
  species,
}: {
  data: BiodiversityDataset;
  species: SpeciesRecord;
}) {
  return (
    <article className="species-card">
      <div>
        <h2>
          <Link href={`/species/${species.id}`}>{species.commonName}</Link>
        </h2>
        <em className="scientific">{species.scientificName}</em>
        <Status data={data} status={species.conservation} />
      </div>
      <div>
        <Claim data={data} claim={species.descriptions.ecologicalRole} />
        <Link className="action" href={`/species/${species.id}`}>
          Explore {species.commonName.toLowerCase()}
        </Link>
      </div>
    </article>
  );
}
export function FieldNote({
  data,
  story,
}: {
  data: BiodiversityDataset;
  story: ConservationStory;
}) {
  return (
    <article className="note" id={story.id}>
      <p className="eyebrow">
        {story.kind.replaceAll("-", " ")} · {story.geography}
      </p>
      <h3>{story.title}</h3>
      <h4>Action</h4>
      <Claim data={data} claim={story.description} />
      <h4>Documented outcome</h4>
      <Claim data={data} claim={story.outcome} />
      <h4>What this does not establish</h4>
      <p>{story.inferenceLimit}</p>
    </article>
  );
}
