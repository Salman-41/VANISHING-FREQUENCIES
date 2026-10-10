import type { Metadata } from "next";
import Link from "next/link";
import { ActionLink, PageIntro } from "@/components/editorial";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What this local documentary app stores in your browser and how its optional media behaves.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <>
      <PageIntro eyebrow="Privacy" title="A quiet page, by design.">
        <p>
          This page describes the behavior implemented in this application. It
          does not promise anything about a future host, browser extension, or
          network environment.
        </p>
      </PageIntro>

      <section className="section">
        <h2>Reading the documentary</h2>
        <p>
          The app contains no analytics, advertising, social-media embeds, user
          accounts, or data-entry forms. It does not set or read cookies. The
          project code does not send reading activity or preference values to
          an analytics service.
        </p>
        <p>
          On this local development app, pages and bundled media are requested
          from the local application server. External publisher pages are
          ordinary links; following one takes you to that publisher and its
          own privacy practices.
        </p>
      </section>

      <section className="section">
        <h2>Reading preferences</h2>
        <p>
          The optional “Read without motion” and “Lighter media” controls are
          stored in this browser’s local storage under{" "}
          <code>vf.preferences.v1</code>. The saved value contains only the
          version and the two on/off choices. It stays in this browser and is
          not sent to the app. If browser storage is unavailable, the controls
          work for the current session only. System reduced-motion and
          reduced-data preferences are read from browser media queries and are
          not stored by this app.
        </p>
      </section>

      <section className="section">
        <h2>Optional sound</h2>
        <p>
          Audio does not start until you press Play. The player fetches the
          selected recording from this app’s local audio files, plays it in the
          browser, and does not request microphone access. Playback pauses when
          the tab becomes inactive and stops when you leave the soundscapes
          page. No audio is uploaded by the application.
        </p>
        <p>
          Sound can remain off; the recording descriptions and citations are
          available as text on <Link href="/soundscapes">Soundscapes</Link> and
          in the <Link href="/credits">Credits</Link>.
        </p>
      </section>

      <section className="section">
        <h2>Changes to this description</h2>
        <p>
          This description should be reviewed if the application adds data
          collection, analytics, remote media, or account features. Questions
          about an asset’s source or reuse can be followed through the{" "}
          <Link href="/sources">Sources</Link> and <Link href="/credits">Credits</Link>
          pages.
        </p>
      </section>

      <div className="actions">
        <ActionLink href="/about">About the documentary</ActionLink>
        <ActionLink href="/">Return to the documentary</ActionLink>
      </div>
    </>
  );
}
