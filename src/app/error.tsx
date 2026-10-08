"use client";
import Link from "next/link";
export default function ErrorBoundary({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <section className="feedback" role="alert"><h1>This page could not be loaded</h1><p>The evidence is temporarily unavailable. Please retry or return to the documentary.</p><div className="actions"><button type="button" className="control" onClick={reset}>Retry page</button><Link className="action" href="/">Return to the documentary</Link></div></section>;
}
