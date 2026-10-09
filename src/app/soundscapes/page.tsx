import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/editorial";
import { Claim } from "@/features/research/evidence";
import { getResearch } from "@/features/research/server";
import { SoundscapeExperience } from "@/features/audio/soundscape-experience";
import { orderedSpecies } from "@/features/research/selectors";
export const metadata: Metadata = { title: "Soundscapes" };
export default async function Soundscapes() {
  const data = await getResearch();
  return (
    <>
      <PageIntro eyebrow="Soundscapes" title="A place has more than one voice.">
        <p>Listen to six credited National Park Service recordings as three optional habitat studies. Each blend combines independent clips and is an artistic composition, not a measured ecological reconstruction.</p>
      </PageIntro>
      <SoundscapeExperience />
      <section className="section" aria-labelledby="species-sound-heading">
        <p className="eyebrow">Species research / separate from the listening room</p>
        <h2 id="species-sound-heading">What the selected species sound like</h2>
        <p>The park recordings above feature a hermit thrush, ptarmigan, and humpback whale. They are not recordings of the documentary’s six selected species. The research below describes those species using cited sources.</p>
      </section>
      {orderedSpecies(data).map((s) => (
        <section key={s.id} className="section">
          <h2>{s.commonName}</h2>
          <p className="meta">
            <em>{s.scientificName}</em> ·{" "}
            {s.sound.knowledge.replaceAll("-", " ")}
          </p>
          <Claim data={data} claim={s.sound.information} />
          <p>{s.sound.designConstraint}</p>
          <p className="meta">{s.assets.audioLicensingNote}</p>
          <Link href={`/species/${s.id}#sound`}>
            Read {s.commonName.toLowerCase()} sound context
          </Link>
        </section>
      ))}
    </>
  );
}
