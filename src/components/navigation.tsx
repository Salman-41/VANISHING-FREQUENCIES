"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { chapters, siteRoutes } from "@/lib/site";

export function Navigation() {
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement>(null);
  const [open, setOpen] = useState(false);
  const pendingFocus = useRef(false);
  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [pathname]);
  function close(restore = true) {
    dialog.current?.close();
    setOpen(false);
    if (restore) opener.current?.focus({ preventScroll: true });
  }
  function navigate(href: string) {
    close(false);
    // A route change focuses the new main region after commit; same-page chapters keep their anchor.
    pendingFocus.current = !href.includes("#") && href !== pathname;
    if (!pendingFocus.current && !href.includes("#"))
      document.getElementById("main-content")?.focus({ preventScroll: true });
  }
  return (
    <>
      <button
        ref={opener}
        className="control"
        type="button"
        aria-haspopup="dialog"
        aria-controls="site-navigation"
        aria-expanded={open}
        onClick={() => {
          dialog.current?.showModal();
          setOpen(true);
        }}
      >
        Menu
      </button>
      <dialog
        ref={dialog}
        id="site-navigation"
        className="menu-dialog"
        aria-labelledby="navigation-title"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>(
            "a[href], button:not([disabled])",
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onCancel={() => {
          setOpen(false);
          opener.current?.focus({ preventScroll: true });
        }}
        onClose={() => setOpen(false)}
      >
        <div className="menu-scroll">
          <div className="shell">
            <div className="menu-top">
              <h2 id="navigation-title">Explore the documentary</h2>
              <button
                autoFocus
                className="control"
                onClick={() => close()}
                type="button"
              >
                Close menu
              </button>
            </div>
            <nav aria-label="Main navigation" className="menu-grid">
              <div>
                <h3 className="eyebrow">Pages</h3>
                <ul className="menu-pages">
                  {siteRoutes.map((route) => (
                    <li key={route.href}>
                      <Link
                        href={route.href}
                        prefetch={false}
                        aria-current={
                          pathname === route.href ? "page" : undefined
                        }
                        onClick={() => navigate(route.href)}
                      >
                        {route.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="eyebrow">Documentary chapters</h3>
                <ul>
                  {chapters.map((chapter, i) => (
                    <li key={chapter.id}>
                      <Link
                        href={`/#${chapter.id}`}
                        prefetch={false}
                        onClick={() => navigate(`/#${chapter.id}`)}
                      >
                        <span className="chapter-number">
                          {String(i).padStart(2, "0")}
                        </span>{" "}
                        — {chapter.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </dialog>
    </>
  );
}
