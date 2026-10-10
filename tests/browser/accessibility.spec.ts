import { expect, test, type Page } from "@playwright/test";
import { writeFile } from "node:fs/promises";
import AxeBuilder from "@axe-core/playwright";

const species = ["snow-leopard", "blue-whale", "tiger", "bornean-orangutan", "hawksbill-turtle", "african-forest-elephant"];
const routes = ["/", "/species", ...species.map(slug => `/species/${slug}`), "/soundscapes", "/data", "/about", "/sources", "/credits", "/privacy", "/audit-missing-page"];
const views = [...routes, "/data?edition=2026&scope=ecosystem", "/data?edition=2024&scope=region", "/species?q=unmatched-species"];
const widths = [320, 375, 430, 768, 1024, 1440, 1920];
const tags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function report(name: string, result: unknown) {
  const path = test.info().outputPath(`${name}.json`);
  await writeFile(path, JSON.stringify(result, null, 2));
  await test.info().attach(name, { path, contentType: "application/json" });
}

async function settle(page: Page) {
  await page.evaluate(() => document.fonts.ready);
  await expect(page.locator("main h1")).toHaveCount(1);
}

for (const width of widths) {
  test(`all routes reflow and preserve reading at ${width}px`, async ({ page }) => {
    test.setTimeout(120_000);
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", e => errors.push(e.message));
    const failures: unknown[] = [];
    for (const route of views) {
      await page.goto(route);
      await settle(page);
      const layout = await page.evaluate(() => {
        const width = document.documentElement.clientWidth;
        return {
          width, scrollWidth: document.documentElement.scrollWidth,
          overflowing: Array.from(document.querySelectorAll("main h1,main h2,main h3,main p,main button,main label,header,footer"))
            .filter(node => {
              if (node.closest(".table-scroll,[aria-hidden='true'],dialog:not([open])")) return false;
              const r = node.getBoundingClientRect();
              return r.width > 0 && (r.left < -1 || r.right > width + 1);
            }).map(node => ({ tag: node.tagName, class: node.className, text: node.textContent?.slice(0, 100) })),
        };
      });
      if (layout.scrollWidth > width + 1 || layout.overflowing.length) failures.push({ route, ...layout });
    }
    await report(`reflow-${width}`, { failures, errors, views: views.length });
    expect(failures).toEqual([]);
    expect(errors).toEqual([]);
  });
}

for (const width of [375, 1440]) {
  test(`WCAG 2.2 AA automated route audit at ${width}px`, async ({ page }) => {
    test.setTimeout(180_000);
    await page.setViewportSize({ width, height: 900 });
    const results = [];
    for (const route of routes) {
      await page.goto(route);
      await settle(page);
      const result = await new AxeBuilder({ page }).withTags(tags).analyze();
      results.push({ route, violations: result.violations, incomplete: result.incomplete });
    }
    await report(`axe-${width}`, results);
    expect(results.filter(result => result.violations.length)).toEqual([]);
  });
}

test("opened navigation and interactive evidence states pass automated checks", async ({ page }) => {
  test.setTimeout(120_000);
  const results = [];
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await page.getByRole("button", { name: "Menu", exact: true }).click();
    results.push({ state: `menu-${width}`, ...(await new AxeBuilder({ page }).withTags(tags).analyze()) });
    await page.keyboard.press("Escape");
    await page.goto("/species");
    for (const detail of await page.locator(".species-filter-groups details").all()) await detail.evaluate(node => node.setAttribute("open", ""));
    results.push({ state: `filters-${width}`, ...(await new AxeBuilder({ page }).withTags(tags).analyze()) });
    await page.goto("/data?edition=2026&scope=ecosystem");
    await page.locator(".observatory-endpoint-track").first().focus();
    results.push({ state: `endpoints-${width}`, ...(await new AxeBuilder({ page }).withTags(tags).analyze()) });
    await page.goto("/soundscapes");
    await page.getByRole("button", { name: /Under the canopy/ }).click();
    results.push({ state: `forest-${width}`, ...(await new AxeBuilder({ page }).withTags(tags).analyze()) });
  }
  await report("axe-interactions", results.map(({ state, violations, incomplete }) => ({ state, violations, incomplete })));
  expect(results.filter(result => result.violations.length).map(({ state, violations }) => ({ state, violations }))).toEqual([]);
});

test("text spacing and 200 percent type enlargement keep reading and controls available", async ({ page }) => {
  test.setTimeout(120_000);
  const failures = [];
  for (const profile of [{ width: 320, enlarged: false }, { width: 320, enlarged: true }, { width: 768, enlarged: true }]) {
    await page.setViewportSize({ width: profile.width, height: 900 });
    for (const route of routes) {
      await page.goto(route);
      await settle(page);
      await page.addStyleTag({ content: `html { ${profile.enlarged ? "font-size: 200% !important;" : ""} } * { line-height: 1.5 !important; letter-spacing: .12em !important; word-spacing: .16em !important; } p { margin-bottom: 2em !important; }` });
      const overflow = await page.evaluate(() => ({ width: document.documentElement.clientWidth, scrollWidth: document.documentElement.scrollWidth }));
      if (overflow.scrollWidth > overflow.width + 1) failures.push({ ...profile, route, ...overflow });
    }
  }
  await report("text-reflow", failures);
  expect(failures).toEqual([]);
});

test("short mobile navigation traps focus, scrolls to each destination and restores the opener", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/");
  const opener = page.getByRole("button", { name: "Menu", exact: true });
  await opener.focus();
  await page.keyboard.press("Enter");
  await expect(opener).toHaveAttribute("aria-expanded", "true");
  const dialog = page.getByRole("dialog");
  const close = dialog.getByRole("button", { name: "Close menu" });
  await expect(close).toBeFocused();
  await page.keyboard.press("Shift+Tab");
  const last = dialog.getByRole("link").last();
  await expect(last).toBeFocused();
  const box = await last.boundingBox();
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.y + box!.height).toBeLessThanOrEqual(568);
  await page.keyboard.press("Tab");
  await expect(close).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(opener).toBeFocused();
  await expect(opener).toHaveAttribute("aria-expanded", "false");
  await page.emulateMedia({ forcedColors: "active" });
  const outline = await opener.evaluate(el => getComputedStyle(el).outlineWidth);
  expect(parseFloat(outline)).toBeGreaterThanOrEqual(2);
  await page.keyboard.press("Enter");
  await dialog.getByRole("link", { name: "About", exact: true }).click();
  await expect(page.locator("main")).toBeFocused();
  await expect(page.locator("main h1")).toHaveText("A documentary about attention.");
});

test("audio touch targets and live reduced sensory preferences keep playback controls usable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 812 });
  await page.addInitScript(() => {
    const sample = AnalyserNode.prototype.getByteFrequencyData;
    Object.assign(window, { vfSamples: 0 });
    AnalyserNode.prototype.getByteFrequencyData = function (array) {
      (window as unknown as { vfSamples: number }).vfSamples++;
      return sample.call(this, array);
    };
  });
  await page.goto("/soundscapes");
  for (const control of await page.locator("main button,main input[type='range']").all()) {
    const box = await control.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
  }
  await expect(page.getByRole("group", { name: "Choose a habitat" })).toBeVisible();
  await expect(page.getByRole("button", { name: "View waveform for Coastal surf" })).toBeVisible();
  await page.addStyleTag({ content: "html{font-size:200%!important}" });
  const habitatAudits = [];
  for (const name of [/Under the canopy/, /Above the tree line/, /Edge of the ocean/]) {
    await page.getByRole("button", { name }).click();
    const audit = await new AxeBuilder({ page }).withTags(tags).analyze();
    habitatAudits.push({ habitat: name.source, violations: audit.violations, incomplete: audit.incomplete });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
  }
  await report("axe-enlarged-habitats", habitatAudits);
  expect(habitatAudits.filter(result => result.violations.length)).toEqual([]);
  await page.getByRole("button", { name: "Play soundscape" }).click();
  await expect.poll(() => page.evaluate(() => (window as unknown as { vfSamples: number }).vfSamples)).toBeGreaterThan(0);
  await page.getByRole("checkbox", { name: "Read without motion", exact: true }).check();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  const samples = await page.evaluate(() => (window as unknown as { vfSamples: number }).vfSamples);
  const seek = page.getByRole("slider", { name: /Seek within looping recording/ });
  const position = await seek.inputValue();
  await page.waitForTimeout(600);
  expect(await page.evaluate(() => (window as unknown as { vfSamples: number }).vfSamples)).toBe(samples);
  expect(await seek.inputValue()).not.toBe(position);
  await page.getByRole("checkbox", { name: "Lighter media", exact: true }).check();
  await page.getByRole("checkbox", { name: "Read without motion", exact: true }).uncheck();
  const lighterSamples = await page.evaluate(() => (window as unknown as { vfSamples: number }).vfSamples);
  await page.waitForTimeout(350);
  expect(await page.evaluate(() => (window as unknown as { vfSamples: number }).vfSamples)).toBe(lighterSamples);
  await expect(page.getByRole("button", { name: "Stop soundscape" })).toBeEnabled();
});

test("all routes retain semantic reading paths with JavaScript disabled", async ({ browser, baseURL }) => {
  test.setTimeout(90_000);
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 320, height: 812 } });
  try {
    const page = await context.newPage();
    for (const route of routes) {
      await page.goto(`${baseURL}${route}`);
      await expect(page.locator("main h1")).toHaveCount(1);
      await expect(page.getByRole("link", { name: "Skip to content" })).toHaveAttribute("href", "#main-content");
      await expect(page.getByRole("navigation", { name: "Main navigation", exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(320);
    }
    await page.goto(`${baseURL}/soundscapes`);
    await expect(page.getByRole("button", { name: "Play soundscape" })).not.toBeVisible();
    await expect(page.getByText("Audio controls require JavaScript", { exact: false })).toBeVisible();
    expect(await page.locator("main").ariaSnapshot()).toContain("Audio controls require JavaScript");
    await page.goto(`${baseURL}/data`);
    await expect(page.locator("table").first()).toBeAttached();
  } finally { await context.close(); }
});
