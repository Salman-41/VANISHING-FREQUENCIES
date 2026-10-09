// Local production observation, not a hardware performance certification.
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { cpus } from "node:os";
import { gzipSync } from "node:zlib";

const base = process.argv[2] ?? "http://127.0.0.1:3001";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Local URL required");
const directory = "docs/development/review";
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const observations = [];
try {
  for (const profile of [
    { name: "desktop-balanced", width: 1440, height: 900, scale: 1.5, cpu: 1, cores: 8, mobile: false },
    { name: "mobile-constrained", width: 390, height: 844, scale: 2, cpu: 4, cores: 2, mobile: true },
  ]) {
    const context = await browser.newContext({ viewport: { width: profile.width, height: profile.height },
      deviceScaleFactor: profile.scale, isMobile: profile.mobile, hasTouch: profile.mobile });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: profile.cpu });
    await cdp.send("Emulation.setHardwareConcurrencyOverride", { hardwareConcurrency: profile.cores });
    const scripts = new Map();
    const pending = [];
    let phase = "before-activation";
    page.on("response", (response) => {
      if (!response.url().includes("/_next/static/") || !response.url().endsWith(".js")) return;
      const at = phase;
      pending.push(response.body().then((body) => scripts.set(response.url(), {
        phase: at, decodedBytes: body.length, gzipEstimateBytes: gzipSync(body).length,
        containsRenderer: body.includes(Buffer.from("WebGLRenderer")),
      })));
    });
    await page.goto(base);
    const controls = page.locator('[data-scene-control="mountain"]');
    await controls.getByRole("button", { name: "Explore in 3D" }).waitFor();
    await page.waitForTimeout(600);
    phase = "after-activation";
    await controls.getByRole("button", { name: "Explore in 3D" }).click();
    await page.waitForFunction(() => document.querySelector('[data-scene-control="mountain"] .immersive-status')?.textContent?.includes("3D study ready"));
    if (profile.mobile) await controls.getByRole("combobox").selectOption("light");
    await page.waitForFunction(() => document.querySelector('[data-scene-control="mountain"] .immersive-status')?.textContent?.includes("3D study ready"));
    const scene = page.locator(".mountain-landscape .media-aperture");
    await scene.scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await scene.screenshot({ path: `${directory}/webgl-${profile.name}-mountain.jpg`, type: "jpeg", quality: 85 });
    await controls.getByRole("button", { name: "Follow the water" }).click();
    await page.waitForFunction(() => document.querySelector('.mountain-landscape .media-aperture')?.getAttribute("data-scene-mix") === "1.000");
    await scene.scrollIntoViewIfNeeded();
    const measurement = await page.evaluate(async () => {
      const frame = document.querySelector(".mountain-landscape .media-aperture");
      const gl = document.querySelector("canvas").getContext("webgl2");
      const debug = gl.getExtension("WEBGL_debug_renderer_info");
      const gpu = debug ? gl.getParameter(debug.UNMASKED_RENDERER_WEBGL) : "Unavailable";
      const before = { ...frame.dataset };
      const intervals = [], longTasksMs = [];
      const observer = new PerformanceObserver((entries) => entries.getEntries().forEach((e) => longTasksMs.push(e.duration)));
      observer.observe({ type: "longtask" });
      document.querySelector('[data-scene-control="mountain"] button:last-child').click();
      await new Promise((resolve) => {
        const start = performance.now(); let previous = 0;
        function sample(time) {
          if (previous) intervals.push(time - previous);
          previous = time;
          if (time - start < 1800) requestAnimationFrame(sample); else resolve();
        }
        requestAnimationFrame(sample);
      });
      observer.disconnect();
      const sorted = [...intervals].sort((a, b) => a - b);
      return { gpu, before, after: { ...frame.dataset }, intervals, longTasksMs,
        medianIntervalMs: sorted[Math.floor(sorted.length / 2)],
        p95IntervalMs: sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))],
        maxIntervalMs: sorted.at(-1), intervalsAbove33_3ms: intervals.filter((v) => v > 33.3).length };
    });
    await page.waitForTimeout(400);
    const idleBefore = await scene.getAttribute("data-scene-frames");
    await page.waitForTimeout(350);
    const idleAfter = await scene.getAttribute("data-scene-frames");
    await scene.screenshot({ path: `${directory}/webgl-${profile.name}-ocean.jpg`, type: "jpeg", quality: 85 });
    await Promise.all(pending);
    const bytes = {};
    for (const at of ["before-activation", "after-activation"]) {
      const items = [...scripts.values()].filter((item) => item.phase === at);
      bytes[at] = { chunks: items.length, decodedBytes: items.reduce((n, i) => n + i.decodedBytes, 0),
        gzipEstimateBytes: items.reduce((n, i) => n + i.gzipEstimateBytes, 0), rendererChunks: items.filter((i) => i.containsRenderer).length };
    }
    observations.push({ profile, ...measurement, idleRenderedFrames: Number(idleAfter) - Number(idleBefore), javascript: bytes });
    await context.close();
  }
  const report = { date: new Date().toISOString(), build: "local production", browser: browser.version(),
    hostCpu: cpus()[0]?.model, method: "One 1.8-second silent visual pulse after warming each scene. Browser rAF intervals and long tasks; not isolated GPU timing. SwiftShader software rendering, emulated capability hints. Gzip sizes are recompressed JS body estimates, not transfer measurements.", observations };
  await writeFile(`${directory}/webgl-observation.json`, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(observations.map(({ profile, medianIntervalMs, p95IntervalMs, maxIntervalMs, idleRenderedFrames, after, javascript }) => ({ profile, medianIntervalMs, p95IntervalMs, maxIntervalMs, idleRenderedFrames, after, javascript })), null, 2));
} finally { await browser.close(); }
