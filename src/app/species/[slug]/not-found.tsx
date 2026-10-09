import Link from "next/link";
export default function SpeciesNotFound() {
  return <section className="feedback"><p className="eyebrow">Species record unavailable</p><h1>This page is outside the documentary</h1><p>No reviewed species record matches this address. Explore the six selected species to continue.</p><Link className="action" href="/species">Open Species Explorer</Link></section>;
}
