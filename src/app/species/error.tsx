"use client";
import Link from "next/link";
export default function SpeciesError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <section className="feedback" role="alert"><p className="eyebrow">Species evidence unavailable</p><h1>This collection could not be loaded.</h1><p>The validated records are temporarily unavailable. Retry the page or return to the documentary.</p><div className="actions"><button type="button" className="control" onClick={retry}>Retry species page</button><Link className="action" href="/">Return to the documentary</Link></div></section>;
}
