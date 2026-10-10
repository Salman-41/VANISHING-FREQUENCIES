import { expect, test } from "@playwright/test";

const pages = [
  { path: "/about", title: "About", heading: "A documentary about attention." },
  { path: "/sources", title: "Sources", heading: "Follow the evidence." },
  { path: "/credits", title: "Credits", heading: "The work behind each frame." },
  { path: "/privacy", title: "Privacy", heading: "A quiet page, by design." },
];

for (const width of [1440, 390, 320]) {
  test(`informational routes retain their content and reflow at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const item of pages) {
      const response = await page.goto(item.path);
      expect(response?.status(), `${item.path} response`).toBe(200);
      await expect(page.locator("main h1")).toHaveText(item.heading);
      await expect(page).toHaveTitle(new RegExp(`${item.title}.*VANISHING FREQUENCIES`));
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      await expect(page.getByRole("link", { name: "Privacy", exact: true })).toBeVisible();
    }
  });
}

test("sources and credits expose dated citations and actual licensed media", async ({ page }) => {
  await page.goto("/sources");
  expect(await page.locator(".citation-list > li").count()).toBeGreaterThan(0);
  await expect(page.locator("#wwf-lpr-2026")).toContainText("WWF");
  await expect(page.locator("main")).toContainText("A source-page review is not a reuse license");

  await page.goto("/credits");
  await expect(page.locator('[id^="image-"]')).toHaveCount(7);
  await expect(page.locator('[id^="audio-"]')).toHaveCount(6);
  await expect(page.locator("#audio-ocean-humpback")).toContainText("not a blue whale");
  await expect(page.locator("#audio-mountain-wind")).toContainText("45 seconds");
  await expect(page.getByRole("link", { name: "Bundled font license" })).toHaveAttribute("href", "/licenses/archivo-OFL.txt");
});

test("privacy matches the implemented browser behavior", async ({ page }) => {
  await page.goto("/privacy");
  await expect(page.locator("main")).toContainText("vf.preferences.v1");
  await expect(page.locator("main")).toContainText("does not set or read cookies");
  await expect(page.locator("main")).toContainText("does not request microphone access");
  await expect(page.getByRole("link", { name: "Credits", exact: true }).first()).toBeVisible();
});

test("unknown routes return a useful noindex 404", async ({ page }) => {
  const response = await page.goto("/this-page-does-not-exist");
  expect(response?.status()).toBe(404);
  await expect(page.locator("main h1")).toHaveText("This page is outside the documentary");
  await expect(page.getByRole("link", { name: "Open the Biodiversity Observatory" })).toBeVisible();
  await expect(page.locator('meta[name="robots"]').first()).toHaveAttribute("content", /noindex/);
});

test("informational page links resolve to local resources", async ({ page, request }) => {
  const base = test.info().project.use.baseURL as string;
  const hrefs = new Set<string>();
  for (const item of pages) {
    await page.goto(item.path);
    for (const href of await page.locator("main a[href^='/']").evaluateAll((nodes) =>
      nodes.map((node) => (node as HTMLAnchorElement).getAttribute("href")!),
    )) hrefs.add(href);
  }
  for (const href of hrefs) {
    const url = new URL(href, base);
    const response = await request.get(`${url.origin}${url.pathname}${url.search}`);
    expect(response.status(), href).toBe(200);
    if (url.hash) {
      await page.goto(`${url.origin}${url.pathname}${url.search}${url.hash}`);
      await expect(page.locator(url.hash)).toHaveCount(1);
    }
  }
});

test("documentary and species photography has descriptive alternative text", async ({ page }) => {
  for (const path of ["/", "/species", "/species/snow-leopard", "/species/blue-whale"]) {
    await page.goto(path);
    for (const image of await page.locator("main img").all()) {
      await expect(image).toHaveAttribute("alt", /\S+/);
    }
  }
});
