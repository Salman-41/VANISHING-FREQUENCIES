"use client";
import Link from "next/link";
export default function ObservatoryError({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return <section className="feedback" role="alert"><p className="eyebrow">Observatory evidence unavailable</p><h1>The evidence could not be loaded.</h1><p>The checked dataset is unavailable or failed validation. No substitute observations are displayed. Retry the page or read the scientific source register.</p><div className="actions"><button className="control" type="button" onClick={retry}>Retry Observatory</button><Link className="action" href="/sources">Read the sources</Link></div></section>;
}
