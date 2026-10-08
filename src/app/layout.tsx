import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { SiteProviders } from "@/features/preferences/provider";
import { SITE_NAME, TAGLINE } from "@/lib/site";
import "./globals.css";

const archivo = localFont({
  src: [
    {
      path: "../assets/fonts/archivo-latin-standard-normal.woff2",
      weight: "100 900",
      style: "normal",
    },
  ],
  variable: "--font-archivo",
  display: "swap",
  fallback: ["Arial", "Helvetica", "sans-serif"],
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});
const archivoItalic = localFont({
  src: "../assets/fonts/archivo-latin-standard-italic.woff2",
  weight: "100 900",
  style: "italic",
  variable: "--font-archivo-italic",
  display: "swap",
  preload: false,
  fallback: ["Arial", "Helvetica", "sans-serif"],
  declarations: [{ prop: "font-stretch", value: "62% 125%" }],
});
export const metadata: Metadata = {
  title: { default: SITE_NAME, template: `%s | ${SITE_NAME}` },
  description: `${TAGLINE} An original wildlife documentary grounded in traceable scientific evidence.`,
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${archivoItalic.variable}`}>
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteProviders>
          <SiteHeader />
          <main id="main-content" className="shell" tabIndex={-1}>
            {children}
          </main>
          <SiteFooter />
        </SiteProviders>
      </body>
    </html>
  );
}
