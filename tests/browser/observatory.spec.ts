import { expect, test } from "@playwright/test";
import { readFile } from "node:fs/promises";
import type { BiodiversityDataset } from "../../data/schemas/biodiversity.schema";
const data = JSON.parse(await readFile("data/processed/biodiversity.json", "utf8")) as BiodiversityDataset;
const annual = data.indexObservations.filter(r => r.datasetId === "lpi-2024-owid");
const endpoints = data.indexObservations.filter(r => r.datasetId === "lpi-2026-endpoints");
const groups = [...new Map(annual.map(r => [r.seriesId, { scope: r.scope, id: r.seriesId }])).values()];

test("all seven annual routes and every displayed table/point match the validated records", async ({ page }) => {
  const errors: string[] = []; page.on("pageerror", e => errors.push(e.message));
  for (const group of groups) {
    await page.goto(`/data?edition=2024&scope=${group.scope}&series=${group.id}`);
    const records = annual.filter(r => r.seriesId === group.id);
    await expect(page.locator(".observatory-study")).toHaveAttribute("data-edition", "2024");
    await expect(page.locator("#selected-observations tbody tr")).toHaveCount(51);
    const rows = await page.locator("#selected-observations tbody tr").evaluateAll(elements => elements.map(el => ({ id: el.getAttribute("data-record-id"), cells: [...el.querySelectorAll("td[data-field]")].map(td => td.textContent) })));
    expect(rows).toEqual(records.map(r => ({ id: r.id, cells: [String(r.value), String(r.uncertainty!.lower), String(r.uncertainty!.upper)] })));
    const points = await page.locator(".observatory-svg-wide [data-record-id]").evaluateAll(elements => elements.map(el => ({ id: el.getAttribute("data-record-id"), value: Number(el.getAttribute("data-value")) })));
    expect(points).toEqual(records.map(r => ({ id: r.id, value: r.value })));
    await expect(page.locator(".observatory-provenance").first()).toContainText("2024-09-30");
    await expect(page.locator(".observatory-provenance").first()).toContainText("2026-10-08");
    await expect(page.locator(".observatory-provenance").first()).toContainText("Confidence level unverified");
    if (group.scope === "region") await expect(page.locator("[data-comparison-series]")).toHaveCount(5);
    if (group.scope === "ecosystem") await expect(page.getByRole("heading", { name: "One annual system, not three." })).toBeVisible();
  }
  expect(errors).toEqual([]);
});

test("all endpoint scopes preserve exact source values, dates and signed-scale geometry with keyboard tooltips", async ({ page }) => {
  for (const scope of ["global", "region", "ecosystem"]) {
    await page.goto(`/data?edition=2026&scope=${scope}`);
    const records = endpoints.filter(r => r.scope === scope).sort((a, b) => (scope === "ecosystem" ? a.ecosystem : a.geography).localeCompare(scope === "ecosystem" ? b.ecosystem : b.geography, "en"));
    await expect(page.getByLabel("From published year")).toHaveCount(0);
    await expect(page.locator(".observatory-annual")).toHaveCount(0);
    await expect(page.locator("#selected-observations tbody tr")).toHaveCount(records.length);
    for (const r of records) {
      const row = page.locator(`.observatory-endpoint-rows [data-record-id="${r.id}"]`);
      await expect(row).toHaveAttribute("data-value", String(r.value));
      const d = await row.locator(".observatory-endpoint-bar").getAttribute("d");
      const parts = d!.match(/M([\d.]+) 4H([\d.]+)/)!;
      expect(Number(parts[2]) - Number(parts[1])).toBeCloseTo(Math.abs(r.value!), 10);
      await row.getByRole("button").focus();
      await expect(page.getByRole("tooltip")).toContainText(`${r.value}% published index change`);
      await expect(page.getByRole("tooltip")).toContainText("1970–2022");
      await page.keyboard.press("Escape"); await expect(page.getByRole("tooltip")).toHaveCount(0);
    }
    await expect(page.locator(".observatory-provenance").first()).toContainText("No bounds supplied");
  }
});

test("selection controls support date crops, keyboard Apply, focus retention and browser history", async ({ page }) => {
  await page.goto("/data");
  await page.getByLabel("Evidence scope").selectOption("region");
  await page.getByLabel("Annual series").selectOption("lpi-2024-owid-asia-and-pacific");
  await page.getByLabel("From published year").selectOption("1990");
  await page.getByLabel("To published year").selectOption("2000");
  const apply = page.getByRole("button", { name: "Apply selection" });
  await apply.focus(); await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/start=1990&end=2000/);
  await expect(page.locator("#selected-observations tbody tr")).toHaveCount(11);
  await expect(apply).toBeFocused();
  await expect(page.locator(".observatory-study-header")).toContainText("Baseline remains 1970 = 1");
  await page.goBack(); await expect(page.getByLabel("Evidence scope")).toHaveValue("global");
  await expect(page.getByLabel("From published year")).toHaveValue("1970");
  await page.goForward(); await expect(page.getByLabel("From published year")).toHaveValue("1990");
  await page.getByRole("radio", { name: /2026/ }).check();
  await expect(page.getByLabel("From published year")).toHaveCount(0);
  await apply.click(); await expect(page.locator(".observatory-study")).toHaveAttribute("data-edition", "2026");
  await expect(page.locator("#selected-observations tbody tr")).toHaveCount(5);
});

test("published-year inspector supports keyboard, pointer, Escape and a single-year window", async ({ page }) => {
  await page.goto("/data");
  const inspect = page.getByLabel("Inspect a published year");
  await inspect.selectOption("1990"); await expect(page.locator(".observatory-readout")).toHaveAttribute("data-selected-year", "1990");
  const record = annual.find(r => r.scope === "global" && r.period.endYear === 1990)!;
  await expect(page.locator(".observatory-number")).toContainText(String(record.value));
  await page.getByRole("button", { name: "Next year" }).click();
  await expect(inspect).toHaveValue("1991"); await page.getByRole("button", { name: "Previous year" }).click(); await expect(inspect).toHaveValue("1990");
  const point = page.locator('.observatory-svg-wide [data-record-id="lpi-2024-owid-world-2000-2000"]');
  await point.hover(); await expect(page.getByRole("tooltip")).toContainText("2000");
  await page.getByRole("tooltip").hover(); await expect(page.getByRole("tooltip")).toBeVisible();
  await point.hover();
  await point.click(); await expect(inspect).toHaveValue("2000");
  await inspect.focus(); await page.keyboard.press("Escape"); await expect(page.getByRole("tooltip")).toHaveCount(0);
  await page.goto("/data?start=1995&end=1995");
  await expect(page.locator("#selected-observations tbody tr")).toHaveCount(1);
  await expect(page.getByRole("button", { name: "Previous year" })).toBeDisabled();
  await expect(page.getByRole("button", { name: "Next year" })).toBeDisabled();
  await expect(page.locator(".observatory-svg-wide .observatory-point")).toHaveCount(1);
});

test("bad URLs recover visibly and never reconstruct unsupported annual 2026 values", async ({ page }) => {
  await page.goto("/data?edition=2025&scope=reef&series=missing&start=2021&end=1970.5");
  await expect(page.getByRole("heading", { name: "Selection adjusted" })).toBeVisible();
  await expect(page.locator("#selected-observations tbody tr")).toHaveCount(51);
  await page.goto("/data?edition=2026&scope=ecosystem&start=1990&end=2022&year=2000");
  await expect(page.getByRole("heading", { name: "Selection adjusted" })).toBeVisible();
  await expect(page.locator("#selected-observations tbody tr")).toHaveCount(3);
  await expect(page.locator(".observatory-annual")).toHaveCount(0);
});

test("permitted JSON/CSV downloads work and contain complete separate-edition provenance", async ({ page, request }) => {
  await page.goto("/data?start=1990&end=1995");
  for (const [id, edition, count] of [["lpi-2024-owid", "2024", 357], ["lpi-2026-endpoints", "2026", 9]] as const) {
    const response = await request.get(`/data-downloads/${id}.json`); expect(response.status()).toBe(200);
    const json = await response.json(); expect(json.records).toHaveLength(count);
    expect(json.records.every((r: { edition: string }) => r.edition === `LPR ${edition}`)).toBe(true);
    expect(json.dataset.rights.licenseId).toBe("CC-BY-SA-4.0"); expect(json.records[0].provenance[0].inputSha256).toHaveLength(64);
    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("link", { name: `Download LPR ${edition} CSV`, exact: true }).click();
    const download = await downloadPromise; expect(download.suggestedFilename()).toBe(`${id}.csv`); expect(await download.failure()).toBe(null);
  }
});

test("no-JavaScript evidence, native GET date range, endpoint switch and full register remain usable", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false }); const page = await context.newPage();
  await page.goto(`${test.info().project.use.baseURL}/data`);
  await expect(page.locator(".observatory-svg-wide")).toBeVisible(); await expect(page.locator("#selected-observations tbody tr")).toHaveCount(51);
  await page.getByLabel("From published year").selectOption("1990"); await page.getByLabel("To published year").selectOption("2000");
  await page.getByRole("button", { name: "Apply selection" }).click(); await expect(page.locator("#selected-observations tbody tr")).toHaveCount(11);
  await page.getByRole("radio", { name: /2026/ }).check(); await page.getByLabel("Evidence scope").selectOption("ecosystem");
  await page.getByRole("button", { name: "Apply selection" }).click(); await expect(page.locator("#selected-observations tbody tr")).toHaveCount(3);
  await page.getByText("Read all nine 2026 endpoint summaries", { exact: true }).click();
  await expect(page.locator("#endpoint-observations")).toBeVisible(); await context.close();
});

test("mobile, touch, reduced motion and chart table regions reflow at 320, 390 and 768px", async ({ browser }) => {
  const context = await browser.newContext({ hasTouch: true, isMobile: true, reducedMotion: "reduce" });
  const page = await context.newPage();
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 820 });
    for (const query of ["", "?scope=region", "?scope=ecosystem", "?edition=2026&scope=region", "?edition=2026&scope=ecosystem"]) {
      await page.goto(`${test.info().project.use.baseURL}/data${query}`);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      expect(await page.locator("[data-chart-motion]").evaluateAll(elements => elements.every(el => !el.getAttribute("style")))).toBe(true);
    }
  }
  await page.setViewportSize({ width: 390, height: 820 }); await page.goto(`${test.info().project.use.baseURL}/data`);
  await page.locator('.observatory-svg-compact [data-record-id="lpi-2024-owid-world-2000-2000"]').tap();
  await expect(page.getByLabel("Inspect a published year")).toHaveValue("2000");
  await context.close();
});

test("live motion reduction reverts enhancements and route changes leave no chart/scroll state", async ({ page }) => {
  await page.goto("/data"); await page.waitForTimeout(200);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect.poll(() => page.locator("[data-chart-motion]").evaluateAll(elements => elements.every(el => !el.getAttribute("style")))).toBe(true);
  await expect(page.locator(".observatory-svg-wide")).toBeVisible();
  await page.getByRole("link", { name: "Explore the scoped species evidence" }).click();
  await expect(page).toHaveURL(/\/species$/); await expect(page.locator("[data-chart-motion], .pin-spacer")).toHaveCount(0);
});

test("delayed navigation announces loading and keeps previous evidence available", async ({ page }) => {
  await page.goto("/data");
  await page.route("**/data?*", async route => {
    if (route.request().headers()["rsc"] === "1") await new Promise(resolve => setTimeout(resolve, 600));
    await route.continue();
  });
  await page.getByRole("radio", { name: /2026/ }).check(); await page.getByRole("button", { name: "Apply selection" }).click();
  await expect(page.getByRole("button", { name: "Loading selection…" })).toBeVisible();
  await expect(page.locator("#observatory-evidence")).toHaveAttribute("aria-busy", "true");
  await expect(page.locator("#selected-observations tbody tr")).toHaveCount(51);
  await expect(page.locator(".observatory-study")).toHaveAttribute("data-edition", "2026");
});
