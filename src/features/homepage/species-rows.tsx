import Link from "next/link";
import type { BiodiversityDataset } from "../../../data/schemas/biodiversity.schema";
import type { ConservationStatus } from "../../../data/schemas/species.schema";
import { orderedSpecies } from "@/features/research/selectors";
import { CitedText, Evidence, MediaFigure, TextLink } from "./primitives";

const labels: Record<ConservationStatus["category"], string> = {
  LC: "Least Concern",
  NT: "Near Threatened",
  VU: "Vulnerable",
  EN: "Endangered",
  CR: "Critically Endangered",
  EW: "Extinct in the Wild",
  EX: "Extinct",
  DD: "Data Deficient",
  NE: "Not Evaluated",
};
export function SpeciesRows({ data }: { data: BiodiversityDataset }) {
  return (
    <div className="species-register">
      {orderedSpecies(data).map((species, i) => (
        <article
          key={species.id}
          className={`species-entry species-entry-${i}`}
        >
          <div className="species-identity">
            <p className="eyebrow">
              {String(i + 1).padStart(2, "0")} / {species.conservation.category}
            </p>
            <h3>
              <Link href={`/species/${species.id}`}>{species.commonName}</Link>
            </h3>
            <em>{species.scientificName}</em>
            <p className="species-category">
              {labels[species.conservation.category]}
            </p>
            <Evidence
              data={data}
              references={species.conservation.references}
              verifiedOn={species.conservation.lastVerified}
            />
          </div>
          <MediaFigure
            id={species.id}
            className="species-portrait"
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
          />
          <div className="species-context">
            <p className="eyebrow">In the ecosystem</p>
            <CitedText
              data={data}
              claim={species.descriptions.ecologicalRole}
            />
            <p className="eyebrow">Under pressure</p>
            <CitedText data={data} claim={species.descriptions.threats[0]!} />
            <TextLink href={`/species/${species.id}`}>
              Read the species record
            </TextLink>
          </div>
        </article>
      ))}
    </div>
  );
}
