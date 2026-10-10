// Local production observations. Emulation is not physical-device certification.
import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.argv[2] ?? "http://127.0.0.1:3002";
if (!["localhost", "127.0.0.1"].includes(new URL(base).hostname)) throw new Error("Local URL required");
const directory = "docs/development/review";
await mkdir(directory, { recursive: true });
const browser = await chromium.launch();
const observations = [];
try {
  for (const route of ["/", "/species", "/soundscapes", "/data"]) {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send("Network.enable");
    await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
    await cdp.send("Network.emulateNetworkConditions", { offline: false, latency: 150, downloadThroughput: 200_000, uploadThroughput: 93_750 });
    await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
    await page.addInitScript(() => {
      window.vfAudit = { lcp: null, cls: 0, longTasks: [] };
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) window.vfAudit.lcp = entry.startTime;
      }).observe({ type: "largest-contentful-paint", buffered: true });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.vfAudit.cls += entry.value;
      }).observe({ type: "layout-shift", buffered: true });
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) window.vfAudit.longTasks.push(entry.duration);
      }).observe({ type: "longtask", buffered: true });
    });
    await page.goto(`${base}${route}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1500);
    observations.push(await page.evaluate(route => {
      const nav = performance.getEntriesByType("navigation")[0];
      const resources = performance.getEntriesByType("resource");
      const js = resources.filter(item => new URL(item.name).pathname.endsWith(".js"));
      return { route, ...window.vfAudit, loadMs: nav.loadEventEnd, domContentLoadedMs: nav.domContentLoadedEventEnd,
        javascriptEncodedBytes: js.reduce((sum, item) => sum + item.encodedBodySize, 0),
        totalEncodedBytes: resources.reduce((sum, item) => sum + item.encodedBodySize, nav.encodedBodySize),
        resources: resources.map(item => ({ url: new URL(item.name).pathname, encodedBytes: item.encodedBodySize })),
        externalRequests: resources.filter(item => new URL(item.name).origin !== location.origin).map(item => item.name),
        audioRequested: resources.some(item => item.name.includes("/audio/")), canvases: document.querySelectorAll("canvas").length,
        width: innerWidth, scrollWidth: document.documentElement.scrollWidth };
    }, route));
    await context.close();
  }
  const page = await browser.newPage();
  await page.emulateMedia({ reducedMotion: "reduce" });
  const captures = [
    ...[320, 375, 430, 768, 1024, 1440, 1920].map(width => ({ name: `opening-${width}`, width, route: "/", target: ".doc-opening" })),
    { name: "mountain-768", width: 768, route: "/", target: ".mountain-spread" },
    { name: "ocean-1024", width: 1024, route: "/", target: ".ocean-spread" },
    { name: "filters-430", width: 430, route: "/species", target: ".species-filters", expand: true },
    { name: "species-768", width: 768, route: "/species/blue-whale", target: ".species-hero" },
    { name: "sound-320", width: 320, route: "/soundscapes", target: "[aria-label='Choose a habitat']" },
    { name: "sound-1440", width: 1440, route: "/soundscapes", target: "[aria-label='Choose a habitat']" },
    { name: "chart-375", width: 375, route: "/data", target: ".observatory-chart-motion" },
    { name: "chart-1440", width: 1440, route: "/data", target: ".observatory-chart-motion" },
    { name: "endpoint-375", width: 375, route: "/data?edition=2026&scope=ecosystem", target: ".observatory-endpoint-rows" },
  ];
  for (const capture of captures) {
    await page.setViewportSize({ width: capture.width, height: 900 });
    await page.goto(`${base}${capture.route}`);
    await page.evaluate(() => document.fonts.ready);
    if (capture.expand) for (const detail of await page.locator(".species-filter-groups details").all()) await detail.evaluate(node => node.setAttribute("open", ""));
    await page.locator(capture.target).first().scrollIntoViewIfNeeded();
    await page.waitForTimeout(150);
    await page.screenshot({ path: `${directory}/responsive-${capture.name}.jpg`, type: "jpeg", quality: 80 });
  }
  const report = { date: new Date().toISOString(), browser: browser.version(), build: "local production", profile: { viewport: "375×812", dpr: 2, cpuSlowdown: 4, downloadBytesPerSecond: 200000, uploadBytesPerSecond: 93750, latencyMs: 150, cache: "disabled, fresh context per route" },
    method: "One cold local navigation per route, observations through load plus 1.5 seconds and font readiness. Encoded resource-body sizes from Resource Timing; not total network overhead. LCP is the last candidate during this sample; CLS is summed non-input shifts, not the field-session window metric. Long tasks are main-thread tasks above 50ms. No physical GPU, battery, field percentile or bandwidth guarantee.", observations, screenshots: captures.map(capture => `responsive-${capture.name}.jpg`) };
  await writeFile(`${directory}/responsive-performance.json`, JSON.stringify(report, null, 2) + "\n");
  console.log(JSON.stringify(observations.map(({ route, lcp, cls, longTasks, javascriptEncodedBytes, totalEncodedBytes, loadMs, audioRequested, canvases }) => ({ route, lcp, cls, longestTaskMs: Math.max(0, ...longTasks), javascriptEncodedBytes, totalEncodedBytes, loadMs, audioRequested, canvases })), null, 2));
} finally { await browser.close(); }
