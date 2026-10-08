import type { Metadata } from "next";
import { PageIntro, Note } from "@/components/editorial";
import { SpeciesCard } from "@/features/research/evidence";
import { getResearch } from "@/features/research/server";
import { orderedSpecies } from "@/features/research/selectors";
export const metadata: Metadata = { title: "Species Explorer" };
export default async function SpeciesExplorer() {
  const data = await getResearch();
  return (
    <>
      <PageIntro
        eyebrow="Species Explorer"
        title="Six lives. Different pressures."
      >
        <p>
          Meet the documentary’s selected species, from mountain habitats to the
          open ocean.
        </p>
      </PageIntro>
      <Note title="The scope of this collection">
        <p>
          These species were chosen for evidence quality, habitat diversity, and
          storytelling potential. They are not a representative global sample.
          Categories are verified public summaries; formal assessment dates
          remain unverified.
        </p>
      </Note>
      <ul className="species-list">
        {orderedSpecies(data).map((s) => (
          <li key={s.id}>
            <SpeciesCard data={data} species={s} />
          </li>
        ))}
      </ul>
    </>
  );
}
