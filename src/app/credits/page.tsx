import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, Note } from "@/components/editorial";
import { getResearch } from "@/features/research/server";
import { homepageAssets } from "@/features/homepage/media";
import { audioCatalog } from "@/features/audio/catalog";
export const metadata: Metadata = {
  title: "Credits",
  description:
    "Creators, licenses, and modifications for the photographs, recordings, type, and data used in VANISHING FREQUENCIES.",
  alternates: { canonical: "/credits" },
};
export default async function Credits() {
  const data = await getResearch();
  return (
    <>
      <PageIntro eyebrow="Credits" title="The work behind each frame.">
        <p>
          Creator, source, license, and changes follow the assets actually used
          by the documentary. Candidate material is not listed as a credit.
        </p>
      </PageIntro>
      <Note title="How the soundscapes are composed">
        <p>
          The opening waveform is an original editorial drawing. The listening
          room uses six National Park Service recordings under the public-domain
          notices on the linked NPS pages; NPS credit is requested and provided
          below. Habitat mixes join separate recordings and are not a measured
          single-place soundscape. No clip is identified as a snow leopard or
          blue whale recording.
        </p>
      </Note>
      <section className="section">
        <h2>Photography used in the documentary</h2>
        <p>
          These seven photographs appear across the documentary and species
          pages. Each local derivative retains the source license. Attribution
          does not imply contributor endorsement. Image descriptions are
          supplied next to each image in the interface.
        </p>
        <ul className="citation-list">
          {homepageAssets.map((asset) => (
            <li id={`image-${asset.id}`} key={asset.id}>
              <h3>{asset.title}</h3>
              <p>
                {asset.creator} · {asset.location} ·{" "}
                {asset.setting.replaceAll("-", " ")}.
              </p>
              <p>
                Capture date: {asset.captureDate ?? "not documented"}. {asset.notes}
              </p>
              <p>{asset.changes}</p>
              <p>
                <a href={asset.sourceUrl} rel="noreferrer">Source item and attribution</a> ·{" "}
                <a href={asset.licenseUrl} rel="noreferrer">{asset.license}</a> ·{" "}
                <a href={asset.localPath}>Local derivative</a>
              </p>
              {asset.originalPublication ? (
                <p>
                  Original publication:{" "}
                  <a href={asset.originalPublication}>
                    Gross (2007), PLOS Biology, e115; photograph by Thomas
                    Breuer
                  </a>
                  .
                </p>
              ) : null}
              <p className="meta">
                Acquired and reviewed {asset.verifiedOn}.{" "}
                {asset.acquiredRepresentation}. {asset.rightsEvidence}
              </p>
            </li>
          ))}
        </ul>
      </section>
      <section className="section">
        <h2>Sound recordings</h2>
        <p>
          Each item below links to the original NPS source and its rights
          statement. Capture dates are shown only where the NPS source records
          them. These recordings provide place-specific examples, not evidence
          of a long-term acoustic or wildlife trend.
        </p>
        <ul className="citation-list">
          {audioCatalog.clips.map((clip) => (
            <li id={`audio-${clip.id}`} key={clip.id}>
              <p className="eyebrow">
                {clip.habitat} · {clip.kind}
              </p>
              <h3>{clip.title}</h3>
              <p>{clip.description}</p>
              <p>
                Recorded at {clip.place}. Creator: {clip.creator}; requested
                credit: {clip.credit}. Capture date: {clip.capturedOn ?? "not reported"}.
              </p>
              <p>
                <a href={clip.sourcePage} rel="noreferrer">NPS recording page</a> ·{" "}
                <a href={clip.licensePage} rel="noreferrer">NPS sound rights</a>
              </p>
              <p className="meta">
                Retrieved {clip.retrievedOn}. {clip.processing} The habitat
                composition is an editorial mix of independently recorded
                clips; it is not a field recording from one location.
              </p>
            </li>
          ))}
        </ul>
      </section>
      <section className="section">
        <h2>Typography</h2>
        <p>
          Archivo — Copyright 2020 The Archivo Project Authors
          (Omnibus-Type/Archivo). Local Latin variable upright and italic files
          are distributed under the SIL Open Font License 1.1.
        </p>
        <p>
          Acquired from @fontsource-variable/archivo, version 5.3.0, on
          2026-10-08. Font binaries are unmodified; the browser selects weight
          and width.
        </p>
        <p>
          The included SIL Open Font License 1.1 permits embedding and
          redistribution with the font and license notices included; the font
          is not sold separately.
        </p>
        <div className="actions">
          <a
            className="action"
            href="https://www.omnibus-type.com/fonts/archivo/"
          >
            Archivo · Omnibus-Type
          </a>
          <a className="action" href="/licenses/archivo-OFL.txt">
            Bundled font license
          </a>
        </div>
      </section>
      <section className="section">
        <h2>Data attribution</h2>
        {data.datasets
          .filter((d) => d.id.startsWith("lpi-"))
          .map((d) => (
            <article key={d.id} className="note">
              <h3>{d.edition}</h3>
              <p>{d.rights.attribution}</p>
              <p>
                {d.version} · accessed {d.accessedDate}.
              </p>
              <p>
                <a href={d.rights.licenseUrl}>{d.rights.licenseId}</a>.{" "}
                {d.rights.notes}
              </p>
            </article>
          ))}
        <Link href="/sources">
          Scientific publications and source-specific reuse notes
        </Link>
        <p>
          Charts and visual layouts are original project presentations of
          published, attributed values. They do not add observations or
          transform the Living Planet Index into an animal-loss percentage.
          No third-party 3D wildlife model is used; the immersive landscapes
          are procedural project artwork.
        </p>
      </section>
      <div className="actions">
        <Link className="action action-primary" href="/soundscapes">
          Listen to the credited recordings
        </Link>
        <Link className="action" href="/data">
          Explore attributed measurements
        </Link>
        <Link className="action" href="/species">
          Visit the Species Explorer
        </Link>
      </div>
    </>
  );
}
