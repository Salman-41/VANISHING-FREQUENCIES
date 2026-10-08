import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro, Note } from "@/components/editorial";
import { getResearch } from "@/features/research/server";
export const metadata: Metadata = { title: "Credits" };
export default async function Credits() {
  const data = await getResearch();
  return <><PageIntro eyebrow="Credits" title="The work behind each frame."><p>Credit follows the work actually used by the documentary.</p></PageIntro><Note title="Wildlife media"><p>No wildlife image or audio has been acquired or cleared for use. Research candidates are not credited as displayed assets.</p></Note><section className="section"><h2>Typography</h2><p>Archivo — Copyright 2020 The Archivo Project Authors (Omnibus-Type/Archivo). Local Latin variable upright and italic files are distributed under the SIL Open Font License 1.1.</p><p>Acquired from @fontsource-variable/archivo, version 5.3.0, on 2026-10-08. Font binaries are unmodified; the browser selects weight and width.</p><div className="actions"><a className="action" href="https://www.omnibus-type.com/fonts/archivo/">Archivo · Omnibus-Type</a><a className="action" href="/licenses/archivo-OFL.txt">Bundled font license</a></div></section><section className="section"><h2>Data attribution</h2>{data.datasets.filter((d) => d.id.startsWith("lpi-")).map((d) => <article key={d.id} className="note"><h3>{d.edition}</h3><p>{d.rights.attribution}</p><p>{d.version} · accessed {d.accessedDate}.</p><p><a href={d.rights.licenseUrl}>{d.rights.licenseId}</a>. {d.rights.notes}</p></article>)}<Link href="/sources">Scientific publications and source-specific reuse notes</Link></section></>;
}
