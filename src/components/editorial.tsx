import Link from "next/link";
import type { ReactNode } from "react";

export function PageIntro({
  eyebrow,
  title,
  children,
  variant = "page",
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
  variant?: "page" | "species";
}) {
  return (
    <header className="page-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className={variant === "species" ? "title-species" : undefined}>{title}</h1>
      <div className="lead">{children}</div>
    </header>
  );
}
export function ActionLink({
  href,
  children,
  primary = false,
}: {
  href: string;
  children: ReactNode;
  primary?: boolean;
}) {
  return (
    <Link href={href} className={`action${primary ? " action-primary" : ""}`}>
      {children}
    </Link>
  );
}
export function Note({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="note">
      <h3>{title}</h3>
      {children}
    </aside>
  );
}
export function Feedback({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="feedback">
      <h1>{title}</h1>
      {children}
    </section>
  );
}
