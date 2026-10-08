"use client";
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <html lang="en"><body style={{ margin: "2rem", background: "#0B0D0D", color: "#ECEAE4", fontFamily: "Arial, sans-serif" }}><main role="alert"><h1>The documentary could not be loaded</h1><p>Please retry. Your research files have not been changed.</p><button onClick={reset} style={{ minHeight: 48, padding: "1rem" }}>Retry</button><p><a href="/" style={{ color: "inherit" }}>Return home</a></p></main></body></html>;
}
