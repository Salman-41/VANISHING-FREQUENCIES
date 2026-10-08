import Link from "next/link";
import { Navigation } from "./navigation";
import { PreferenceControls } from "@/features/preferences/controls";
import { SITE_NAME, siteRoutes } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header shell">
      <Link href="/" className="wordmark" aria-label={SITE_NAME}>
        <span className="brand-word">VANISHING</span>{" "}
        <span className="brand-word">FREQUENCIES</span>
      </Link>
      <div className="header-actions">
        <nav className="header-explore" aria-label="Quick exploration">
          <Link href="/species">Species</Link>
          <Link href="/data">Data</Link>
        </nav>
        <Link className="header-source action" href="/sources">
          Sources
        </Link>
        <Navigation />
      </div>
      <noscript>
        <style>{".menu-opener,.preferences{display:none}"}</style>
        <nav className="no-js-nav" aria-label="Main navigation">
          {siteRoutes.map((r) => (
            <Link key={r.href} href={r.href} className="action">
              {r.label}
            </Link>
          ))}
        </nav>
      </noscript>
    </header>
  );
}
export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell">
        <p className="wordmark">{SITE_NAME}</p>
        <p className="muted">
          An original documentary about wildlife, evidence, and attention.
        </p>
        <nav aria-label="Footer">
          <ul className="footer-links">
            {siteRoutes.map((r) => (
              <li key={r.href}>
                <Link href={r.href}>{r.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <PreferenceControls />
        <p className="meta">
          Sound starts only when requested. Reading preferences never hide
          evidence.
        </p>
      </div>
    </footer>
  );
}
