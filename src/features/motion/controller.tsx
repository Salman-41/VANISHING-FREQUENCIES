"use client";

import { useEffect, useState, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motionTokens as duration, pinTravel } from "./policy";

gsap.registerPlugin(ScrollTrigger, useGSAP);
type LenisConstructor = typeof import("lenis").default;

export function MotionController({
  root,
}: {
  root: RefObject<HTMLDivElement | null>;
}) {
  const [viewport, setViewport] = useState("");
  const [LenisClass, setLenisClass] = useState<LenisConstructor | null>(null);
  useEffect(() => {
    const media = matchMedia("(min-width: 1024px) and (min-height: 800px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    let cancelled = false;
    let generation = 0;
    const sync = () => {
      const run = ++generation;
      if (!media.matches) { setLenisClass(null); return; }
      void import("lenis").then(module => {
        if (!cancelled && run === generation) setLenisClass(() => module.default);
      }).catch(() => { /* Native scrolling remains functional if enhancement cannot load. */ });
    };
    sync();
    media.addEventListener("change", sync);
    return () => { cancelled = true; ++generation; media.removeEventListener("change", sync); };
  }, []);
  useEffect(() => {
    let timer = 0;
    const resize = () => {
      clearTimeout(timer);
      timer = window.setTimeout(
        () => setViewport(`${innerWidth}:${innerHeight}`),
        150,
      );
    };
    window.addEventListener("resize", resize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", resize);
    };
  }, []);
  useGSAP(
    () => {
      const el = root.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(
        {
          desktop: "(min-width: 1024px) and (min-height: 800px)",
          pointer: "(hover: hover) and (pointer: fine)",
          allowed: "(prefers-reduced-motion: no-preference)",
        },
        (context) => {
          if (!context.conditions?.allowed) return;
          const desktop = Boolean(
            context.conditions.desktop && context.conditions.pointer,
          );
          const pointer = Boolean(context.conditions.pointer);
          const disposers: (() => void)[] = [];
          const listen = (
            target: EventTarget,
            type: string,
            handler: EventListener,
            options?: AddEventListenerOptions,
          ) => {
            target.addEventListener(type, handler, options);
            disposers.push(() =>
              target.removeEventListener(type, handler, options),
            );
          };
          // Event-created tweens belong to this matchMedia context, so breakpoint changes also revert them.
          let callbackId = 0;
          const safe = <T extends (...args: never[]) => unknown>(fn: T) =>
            context.add(`callback${callbackId++}`, fn) as T;
          const chapters = Array.from(
            el.querySelectorAll<HTMLElement>("[data-chapter]"),
          );
          // Preserve an already restored/hash-linked reading position when enhancement adds a spacer.
          const readingAnchor =
            chapters
              .filter(
                (chapter) =>
                  chapter.getBoundingClientRect().top <= innerHeight * 0.4,
              )
              .at(-1) ?? chapters[0]!;
          const anchorTop = readingAnchor.getBoundingClientRect().top;
          const preserveReading = window.scrollY > 0;
          const margin = el.querySelector<HTMLElement>(".reading-margin")!;
          const links = Array.from(
            el.querySelectorAll<HTMLAnchorElement>(
              ".reading-margin a, .chapter-index a",
            ),
          );
          const fills = Array.from(
            el.querySelectorAll<HTMLElement>(".reading-fill"),
          );
          const readingLine = el.querySelector<HTMLElement>(".reading-line")!;
          margin.hidden = false;
          readingLine.hidden = false;
          el.dataset.motionRuntime = "active";
          let current = -1;
          let chapterTops: number[] = [];
          let documentTop = 0;
          let documentHeight = 1;
          const measurePosition = () => {
            chapterTops = chapters.map(
              (chapter) => chapter.getBoundingClientRect().top + window.scrollY,
            );
            documentTop = el.getBoundingClientRect().top + window.scrollY;
            documentHeight = el.offsetHeight;
            updatePosition();
          };
          const updatePosition = () => {
            const line = window.scrollY + window.innerHeight * 0.4;
            let index = 0;
            chapterTops.forEach((top, i) => {
              if (top <= line) index = i;
            });
            if (index !== current) {
              current = index;
              links.forEach((link) => {
                if (link.hash === `#${chapters[index]!.id}`)
                  link.setAttribute("aria-current", "location");
                else link.removeAttribute("aria-current");
              });
            }
            const length = Math.max(1, documentHeight - window.innerHeight);
            fills.forEach((fill) =>
              fill.style.setProperty(
                "--reading-progress",
                String(
                  Math.max(
                    0,
                    Math.min(1, (window.scrollY - documentTop) / length),
                  ),
                ),
              ),
            );
            margin.style.visibility =
              documentTop + documentHeight - window.scrollY < innerHeight - 128
                ? "hidden"
                : "";
          };
          ScrollTrigger.create({
            id: "vf:reading",
            trigger: el,
            start: "top top",
            // Keep updating through the footer so the fixed margin cannot cover its controls.
            end: "max",
            onUpdate: updatePosition,
            onRefresh: measurePosition,
          });
          updatePosition();
          // Native root scroll: no scrollerProxy, transformed wrapper, normalizeScroll, or second RAF.
          const lenis =
            desktop && pointer && LenisClass
              ? new LenisClass({
                  autoRaf: false,
                  smoothWheel: true,
                  lerp: 0.16,
                  syncTouch: false,
                  anchors: false,
                  prevent: (node) =>
                    Boolean(node.closest("dialog, .chart-data")),
                })
              : null;
          el.dataset.scrollController = lenis ? "lenis" : "native";
          const tick = () => lenis?.raf(performance.now());
          if (lenis) {
            lenis.on("scroll", ScrollTrigger.update);
            gsap.ticker.add(tick);
          }
          // A real clock avoids changing GSAP's shared lagSmoothing policy after a background tab.
          const settle = () => {
            if (!lenis) return;
            // Native focus can jump into newly expanded content before Lenis' debounced resize.
            // Refresh its limit first so settling never clamps that position to a stale page height.
            const wasStopped = lenis.isStopped;
            // stop() cancels a pending wheel tween before resize changes its target.
            lenis.stop();
            lenis.resize();
            if (!wasStopped) lenis.start();
          };
          listen(window, "hashchange", settle);
          listen(window, "popstate", settle);
          listen(document, "keydown", ((event: KeyboardEvent) => {
            if (
              [
                "Tab",
                "ArrowDown",
                "ArrowUp",
                "PageDown",
                "PageUp",
                "Home",
                "End",
                " ",
              ].includes(event.key)
            )
              settle();
          }) as EventListener);
          listen(document, "focusin", settle);
          // Anchors commit immediately with native history semantics and explicit target focus.
          let anchorFrame = 0;
          listen(document, "click", ((event: MouseEvent) => {
            if (
              event.button !== 0 ||
              event.metaKey ||
              event.ctrlKey ||
              event.shiftKey ||
              event.altKey
            )
              return;
            const a = (event.target as Element)?.closest<HTMLAnchorElement>(
              "a[href]",
            );
            if (!a) return;
            const url = new URL(a.href);
            if (
              url.origin !== location.origin ||
              url.pathname !== location.pathname ||
              !url.hash
            )
              return;
            const target = document.getElementById(
              decodeURIComponent(url.hash.slice(1)),
            );
            if (!target) return;
            settle();
            // Run after Next/native hash navigation without preventing or delaying it.
            cancelAnimationFrame(anchorFrame);
            anchorFrame = requestAnimationFrame(() => {
              if (el.isConnected) {
                target.focus({ preventScroll: true });
                settle();
              }
            });
          }) as EventListener);
          const dialog =
            document.querySelector<HTMLDialogElement>("#site-navigation");
          const modalObserver = new MutationObserver(() => {
            if (dialog?.open) lenis?.stop();
            else lenis?.start();
          });
          if (dialog)
            modalObserver.observe(dialog, {
              attributes: true,
              attributeFilter: ["open"],
            });
          if (dialog?.open) lenis?.stop();
          const visibility = () => {
            if (document.hidden) {
              settle();
              gsap.ticker.remove(tick);
              lenis?.stop();
            } else {
              if (!dialog?.open) lenis?.start();
              if (lenis) gsap.ticker.add(tick);
              ScrollTrigger.refresh();
            }
          };
          listen(document, "visibilitychange", visibility);
          if (document.hidden) visibility();

          chapters.forEach((chapter) => {
            const title = chapter.querySelector("h1, h2");
            const rule = chapter.querySelector(".chapter-register");
            // All scientific text is opaque throughout. Only editorial titles move 12px.
            const entrance = gsap.timeline({
              scrollTrigger: {
                id: `vf:${chapter.id}:entry`,
                trigger: chapter,
                start: "top 88%",
                toggleActions: "play none none none",
              },
            });
            if (title && desktop)
              entrance.from(title, {
                y: duration.entry,
                duration: duration.content,
                ease: "power3.out",
              });
            if (rule) {
              entrance.from(
                rule,
                { borderColor: "#0b0d0d", duration: duration.content },
                0,
              );
              gsap
                .timeline({
                  scrollTrigger: {
                    id: `vf:${chapter.id}:exit`,
                    trigger: chapter,
                    start: "bottom 35%",
                    end: "bottom top",
                    scrub: true,
                  },
                })
                .to(rule, { borderColor: "#24372d", ease: "none" });
            }
          });
          if (desktop) {
            const opening = el.querySelector<HTMLElement>(
              ".opening-aperture .media-aperture",
            )!;
            const openingMasks = opening.querySelectorAll(".scene-mask");
            gsap.set(openingMasks, {
              display: "block",
              scaleY: () =>
                Math.max(0, (opening.clientHeight - 96) / opening.clientHeight),
            });
            gsap.to(openingMasks, {
              scaleY: 0,
              ease: "none",
              scrollTrigger: {
                id: "vf:opening",
                trigger: opening,
                start: "top 50%",
                end: () => `+=${window.innerHeight * 0.2}`,
                scrub: true,
                invalidateOnRefresh: true,
              },
            });
            // Landscape-only parallax; no animal pan/zoom or movement of statistical marks.
            const landscape = el.querySelector(".mountain-landscape img");
            gsap.fromTo(
              landscape,
              { y: -6 },
              {
                y: 6,
                ease: "none",
                scrollTrigger: {
                  id: "vf:landscape",
                  trigger: landscape,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: true,
                },
              },
            );
            const portrait = el.querySelector<HTMLElement>(
              ".snow-portrait .media-aperture",
            )!;
            const evidence = el.querySelector<HTMLElement>(
              ".mountain-spread .estimate-margin",
            )!;
            const travel = () =>
              pinTravel(
                window.innerWidth,
                window.innerHeight,
                portrait.offsetHeight,
                evidence.offsetHeight - portrait.offsetHeight - 48,
              );
            if (travel() > 0)
              ScrollTrigger.create({
                id: "vf:snow-pin",
                trigger: portrait,
                start: "top 48px",
                end: () => `+=${travel()}`,
                pin: portrait,
                pinSpacing: true,
                invalidateOnRefresh: true,
              });
            const ocean = el.querySelector<HTMLElement>(
              ".ocean-portrait .media-aperture",
            )!;
            const masks = ocean.querySelectorAll(".scene-mask");
            const button =
              el.querySelector<HTMLButtonElement>(".aperture-control")!;
            button.hidden = false;
            let expanded = true;
            const aperture = gsap
              .timeline({ paused: true })
              .fromTo(
                masks,
                {
                  display: "block",
                  scaleY: () =>
                    Math.max(0, (ocean.clientHeight - 96) / ocean.clientHeight),
                },
                { scaleY: 0, duration: duration.scene, ease: "power3.out" },
              )
              .progress(1);
            const toggle = safe(() => {
              expanded = !expanded;
              button.setAttribute("aria-expanded", String(expanded));
              button.textContent = expanded
                ? "Close the listening aperture"
                : "Open the listening aperture";
              expanded ? aperture.play() : aperture.reverse();
            });
            listen(button, "click", toggle);
            // A resized image always returns to its accessible fully open state.
            const resize = safe(() => {
              expanded = true;
              aperture.progress(1).pause();
              button.setAttribute("aria-expanded", "true");
              button.textContent = "Close the listening aperture";
            });
            listen(window, "resize", resize);
            disposers.push(() => {
              if (document.activeElement === button)
                document
                  .getElementById("blue-whale")
                  ?.focus({ preventScroll: true });
              button.hidden = true;
              button.setAttribute("aria-expanded", "true");
              button.textContent = "Close the listening aperture";
            });
          }
          if (pointer) {
            el.querySelectorAll<HTMLElement>(".doc-link").forEach((link) => {
              const arrow = link.querySelector("span[aria-hidden]");
              if (!arrow) return;
              const hover = gsap.timeline({ paused: true }).to(arrow, {
                x: 3,
                y: -3,
                duration: duration.state,
              });
              const enter = safe(() => {
                hover.play();
              });
              const exit = safe(() => {
                hover.reverse();
              });
              listen(link, "pointerenter", enter);
              listen(link, "pointerleave", exit);
              listen(link, "focus", enter);
              listen(link, "blur", exit);
            });
          }
          // Refresh reserved image geometry once, and on actual media/font completion; no polling.
          el.querySelectorAll<HTMLImageElement>("img").forEach((image) => {
            if (!image.complete)
              listen(image, "load", () => ScrollTrigger.refresh(), {
                once: true,
              });
          });
          let alive = true;
          void document.fonts.ready.then(() => {
            if (alive) ScrollTrigger.refresh();
          });
          ScrollTrigger.refresh();
          lenis?.resize();
          if (preserveReading) {
            window.scrollBy(
              0,
              readingAnchor.getBoundingClientRect().top - anchorTop,
            );
            settle();
            ScrollTrigger.update();
          }
          el.dataset.motionTriggerCount = String(
            ScrollTrigger.getAll().filter((trigger) =>
              trigger.vars.id?.startsWith("vf:"),
            ).length,
          );
          let geometryFrame = 0;
          let previousHeight = el.offsetHeight;
          const geometryObserver = new ResizeObserver(() => {
            const height = el.offsetHeight;
            if (height === previousHeight) return;
            previousHeight = height;
            cancelAnimationFrame(geometryFrame);
            geometryFrame = requestAnimationFrame(() => {
              ScrollTrigger.refresh();
              settle();
            });
          });
          geometryObserver.observe(el);
          return () => {
            alive = false;
            cancelAnimationFrame(anchorFrame);
            cancelAnimationFrame(geometryFrame);
            geometryObserver.disconnect();
            disposers.forEach((dispose) => dispose());
            modalObserver.disconnect();
            gsap.ticker.remove(tick);
            lenis?.off("scroll", ScrollTrigger.update);
            lenis?.destroy();
            const active = document.activeElement as HTMLElement | null;
            if (active && margin.contains(active)) {
              const target = active.getAttribute("href")?.slice(1);
              if (target)
                document.getElementById(target)?.focus({ preventScroll: true });
            }
            margin.hidden = true;
            readingLine.hidden = true;
            links.forEach((link) => link.removeAttribute("aria-current"));
            fills.forEach((fill) =>
              fill.style.removeProperty("--reading-progress"),
            );
            margin.style.removeProperty("visibility");
            delete el.dataset.motionRuntime;
            delete el.dataset.scrollController;
            delete el.dataset.motionTriggerCount;
          };
        },
      );
      return () => mm.revert();
    },
    { scope: root, dependencies: [viewport, LenisClass], revertOnUpdate: true },
  );
  return null;
}
