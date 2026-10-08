import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, Note } from "@/components/editorial";
import { Claim } from "@/features/research/evidence";
import { getResearch } from "@/features/research/server";
import { orderedSpecies } from "@/features/research/selectors";
export const metadata: Metadata = { title: "Soundscapes" };
export default async function Soundscapes() {
  const data = await getResearch();
  return (
    <>
      <PageIntro eyebrow="Soundscapes" title="A place has more than one voice.">
        <p>Sound knowledge is available even when a recording is not.</p>
      </PageIntro>
      <Note title="No cleared recordings">
        <p>
          No wildlife recording has been acquired or cleared for playback. The
          research descriptions below are not audio transcripts. Unavailable
          sound never means an animal or habitat is silent.
        </p>
      </Note>
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
