import Link from "next/link";
import type { ReactNode } from "react";
import type { BiodiversityDataset } from "../../../data/schemas/biodiversity.schema";
import type { SpeciesRecord } from "../../../data/schemas/species.schema";
import { homepageAssets } from "../homepage/media";
import { CitedText, Evidence } from "../homepage/primitives";
import { conservationLabels } from "../research/labels";
import { buildSpeciesIndex, facetLabel, relatedSpecies, type SpeciesIndexEntry } from "./model";
import { PortraitImage } from "./portrait-image";

export function SpeciesPortrait({ species, variant = "card", preload = false }: {
  species: SpeciesRecord; variant?: "hero" | "card" | "related"; preload?: boolean;
}) {
  const image = homepageAssets.find((asset) => asset.id === species.id && asset.clearedForUse);
  if (!image) return <div className="species-photo-missing"><p className="eyebrow">Image unavailable</p><p>No cleared photograph is available for this record.</p></div>;
  return <figure className={`species-photo species-photo-${variant}`} data-media={image.id}>
    <div className="species-photo-frame" style={{ aspectRatio: `${image.width} / ${image.height}` }}>
      <PortraitImage key={image.id} src={image.localPath} alt={image.alt} width={image.width} height={image.height} preload={preload}
        sizes={variant === "hero" ? "(min-width: 900px) 55vw, 100vw" : variant === "related" ? "(min-width: 768px) 35vw, 100vw" : "(min-width: 1100px) 32vw, (min-width: 700px) 45vw, 100vw"} />
    </div>
    <figcaption>
      <span>{image.location} · {image.captureDate ?? "Capture date unverified"}{image.setting === "rehabilitation-site" ? " · Rehabilitation-site context; individual history unverified" : ""}</span>
      <span><Link href={`/credits#image-${image.id}`}>{image.creator} · {image.license}</Link> · Local resize and compression; <Link href={`/credits#image-${image.id}`}>image notes</Link></span>
    </figcaption>
  </figure>;
}
export function ExplorerCard({ data, species, entry }: { data: BiodiversityDataset; species: SpeciesRecord; entry: SpeciesIndexEntry }) {
  return <article className="explorer-card" data-species-id={species.id}>
    <div className="explorer-identity">
      <p className="eyebrow">{String(entry.order + 1).padStart(2, "0")} / {facetLabel("group", entry.group)}</p>
      <h2><Link href={`/species/${species.id}`}>{species.commonName}</Link></h2>
      <p className="explorer-scientific"><em>{species.scientificName}</em></p>
      <p className="explorer-category"><span aria-hidden="true">◦</span> {conservationLabels[species.conservation.category]}</p>
      <p className="meta">Verified public summary. Formal assessment date unverified.</p>
      <Evidence data={data} references={species.conservation.references} verifiedOn={species.conservation.lastVerified} />
    </div>
    <SpeciesPortrait species={species} />
    <div className="explorer-context">
      <p className="eyebrow">Habitat / {entry.habitat.map((value) => facetLabel("habitat", value)).join(" + ")}</p>
      <CitedText data={data} claim={species.descriptions.habitat} />
      <p className="eyebrow">In the ecosystem</p>
      <CitedText data={data} claim={species.descriptions.ecologicalRole} />
      <Link className="species-record-link" href={`/species/${species.id}`}>Explore {species.commonName.toLowerCase()} <span aria-hidden="true">↗</span></Link>
    </div>
  </article>;
}
export function SpeciesSection({ id, number, title, children, className = "" }: {
  id: string; number: string; title: string; children: ReactNode; className?: string;
}) {
  return <section id={id} className={`species-section ${className}`} aria-labelledby={`${id}-heading`}>
    <header><p className="eyebrow">{number} / field record</p><h2 id={`${id}-heading`}>{title}</h2></header>
    <div className="species-section-content">{children}</div>
  </section>;
}
export function RelatedSpecies({ data, species, all }: { data: BiodiversityDataset; species: SpeciesRecord; all: SpeciesRecord[] }) {
  const index = buildSpeciesIndex(all);
  const related = relatedSpecies(index, species.id);
  return <section className="species-related" aria-labelledby="related-heading">
    <header><p className="eyebrow">Continue the collection</p><h2 id="related-heading">Other lives. Other pressures.</h2><p>Related by broad navigation tags or animal group. These links do not imply a shared ecological encounter.</p></header>
    <div className="species-related-grid">{related.map((entry) => {
      const record = all.find((item) => item.id === entry.id)!;
      return <article key={entry.id}>
        <SpeciesPortrait species={record} variant="related" />
        <p className="eyebrow">{entry.reason}</p>
        <h3><Link href={`/species/${record.id}`}>{record.commonName} <span aria-hidden="true">↗</span></Link></h3>
        <p><em>{record.scientificName}</em></p>
        <p>{conservationLabels[record.conservation.category]}</p>
        <Evidence data={data} references={record.conservation.references} verifiedOn={record.conservation.lastVerified} />
      </article>;
    })}</div>
  </section>;
}
