import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import type { BiodiversityDataset } from "../../../data/schemas/biodiversity.schema";
import type {
  ScientificClaim,
  ScientificReference,
  PopulationMeasurement,
} from "../../../data/schemas/species.schema";
import { resolveReferences } from "@/features/research/selectors";
import { homepageAsset } from "./media";

export function Chapter({
  id,
  number,
  label,
  className = "",
  children,
}: {
  id: string;
  number: string;
  label: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      tabIndex={-1}
      className={`doc-chapter ${className}`}
      aria-labelledby={`${id}-title`}
      data-chapter={id}
      data-scene="static"
    >
      <div className="chapter-register">
        <p>
          <span>{number}</span> / {label}
        </p>
        <a href="#chapter-index">
          Chapter index <span aria-hidden="true">↑</span>
        </a>
      </div>
      {children}
    </section>
  );
}

export function TextLink({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`doc-link ${primary ? "doc-link-primary" : ""}`}
    >
      {children}
      <span aria-hidden="true">↗</span>
    </Link>
  );
}

export function MediaFigure({
  id,
  className = "",
  preload = false,
  sizes = "(min-width: 1024px) 65vw, 100vw",
}: {
  id: string;
  className?: string;
  preload?: boolean;
  sizes?: string;
}) {
  const a = homepageAsset(id);
  return (
    <figure className={`media-figure ${className}`} data-media={id}>
      <div className="media-aperture" data-scene-layer="photograph">
        <Image
          src={a.localPath}
          alt={a.alt}
          width={a.width}
          height={a.height}
          sizes={sizes}
          preload={preload}
        />
      </div>
      <figcaption>
        <span>
          {a.location} · {a.captureDate ?? "Capture date unverified"}
          {a.setting === "rehabilitation-site"
            ? " · Rehabilitation-site context"
            : a.setting === "wild"
              ? " · Wild"
              : ""}
        </span>
        <span>
          <Link href={`/credits#image-${id}`}>
            {a.creator} · {a.license}
          </Link>{" "}
          · Viewport crop;{" "}
          <Link href={`/credits#image-${id}`}>image notes</Link>
        </span>
      </figcaption>
    </figure>
  );
}

export function Evidence({
  data,
  references,
  verifiedOn,
}: {
  data: BiodiversityDataset;
  references: ScientificReference[];
  verifiedOn: string;
}) {
  const resolved = resolveReferences(data, references);
  return (
    <div className="doc-evidence">
      <p>
        {resolved.map(({ citation }, i) => (
          <span key={`${citation.id}-${i}`}>
            <Link href={`/sources#${citation.id}`}>{citation.publisher}</Link> ·{" "}
            {citation.publicationDate ??
              citation.publicationYear ??
              "Publication date not reported"}
            {i < resolved.length - 1 ? "; " : "."}
          </span>
        ))}{" "}
        Checked <time dateTime={verifiedOn}>{verifiedOn}</time>.
      </p>
      <details>
        <summary>Source details</summary>
        <ul>
          {resolved.map(({ citation, reference }, i) => (
            <li key={`${citation.id}-${i}`}>
              <a href={citation.url}>{citation.title}</a> — {reference.locator}.
              Accessed {citation.accessedDate}.
            </li>
          ))}
        </ul>
      </details>
    </div>
  );
}

export function CitedText({
  data,
  claim,
}: {
  data: BiodiversityDataset;
  claim: ScientificClaim;
}) {
  return (
    <div className="doc-claim">
      <p>{claim.text}</p>
      <Evidence
        data={data}
        references={claim.references}
        verifiedOn={claim.lastVerified}
      />
    </div>
  );
}

export function HistoricalEstimate({
  data,
  measurement: m,
}: {
  data: BiodiversityDataset;
  measurement: PopulationMeasurement;
}) {
  if (
    m.display.eligibility !== "dated-context-only" ||
    !m.measurementPeriod ||
    m.value.kind !== "point"
  )
    throw new Error("Homepage requires a reviewed, dated point estimate");
  return (
    <aside
      className="estimate-margin"
      id={`home-${m.id}`}
      aria-label={`Historical estimate: ${m.geography}`}
    >
      <p className="eyebrow">A dated population estimate</p>
      <p className="doc-estimate">
        {new Intl.NumberFormat("en-US").format(m.value.value)}
        <span>{m.unit}</span>
      </p>
      <p>{m.display.requiredContext}</p>
      <dl>
        <div>
          <dt>Measurement</dt>
          <dd>
            {m.measurementPeriod.startYear}–{m.measurementPeriod.endYear} ·{" "}
            {m.geography}
          </dd>
        </div>
        <div>
          <dt>Method</dt>
          <dd>{m.method}</dd>
        </div>
        <div>
          <dt>Uncertainty</dt>
          <dd>
            {m.uncertainty.kind === "coefficient-of-variation"
              ? `CV ${m.uncertainty.value}. ${m.uncertainty.explanation}`
              : m.uncertainty.kind === "not-reported"
                ? m.uncertainty.explanation
                : "See original measurement record."}
          </dd>
        </div>
        <div>
          <dt>Source edition</dt>
          <dd>{m.sourceEdition}</dd>
        </div>
      </dl>
      <Evidence
        data={data}
        references={m.references}
        verifiedOn={m.lastVerified}
      />
    </aside>
  );
}

// Original, fixed editorial mark. It is neither a recording nor a wildlife measurement.
export function WaveformMotif({ compact = false }: { compact?: boolean }) {
  const segments = [
    7, 13, 6, 19, 28, 9, 35, 18, 7, 47, 24, 38, 11, 60, 31, 14, 42, 67, 23, 54,
    19, 35, 12, 26, 49, 21, 9, 32, 15, 38, 8, 18, 29, 11, 22, 7, 16, 9, 24, 13,
    6, 19, 8, 28, 12, 21, 6, 15, 27, 9, 18, 7, 22, 12, 5, 16, 9, 20, 7, 13,
  ];
  return (
    <figure
      className={`waveform-motif ${compact ? "waveform-compact" : ""}`}
      data-scene-layer="editorial-motif"
    >
      <svg viewBox="0 0 1200 140" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 70H1200" className="motif-axis" />
        {segments.map((height, i) => (
          <path key={i} d={`M${i * 20 + 10} ${70 - height}v${height * 2}`} />
        ))}
      </svg>
      <figcaption>
        Editorial sound motif · no recording or acoustic measurement
      </figcaption>
    </figure>
  );
}
