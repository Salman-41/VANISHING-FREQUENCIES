import { expect, test } from "@playwright/test";
const ids = ["snow-leopard", "blue-whale", "tiger", "bornean-orangutan", "hawksbill-turtle", "african-forest-elephant"];
const names = ["Snow leopard", "Blue whale", "Tiger", "Bornean orangutan", "Hawksbill sea turtle", "African forest elephant"];
const renderedIds = async (page: import("@playwright/test").Page) => page.locator(".explorer-card").evaluateAll((cards) => cards.map((card) => card.getAttribute("data-species-id")));

test("search uses both common and scientific names, sorting and browser history preserve URL state", async ({ page }) => {
  await page.goto("/species");
  await expect(page.locator(".explorer-card")).toHaveCount(6);
  await page.getByRole("searchbox", { name: "Search common or scientific name" }).fill("PANTHERA");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page).toHaveURL(/q=PANTHERA/);
  await expect.poll(() => renderedIds(page)).toEqual(["snow-leopard", "tiger"]);
  await expect(page.getByRole("button", { name: "Apply filters" })).toBeFocused();
  await page.getByRole("combobox", { name: "Sort records" }).selectOption("name-desc");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect.poll(() => renderedIds(page)).toEqual(["tiger", "snow-leopard"]);
  await expect(page.getByRole("combobox", { name: "Sort records" })).toHaveValue("name-desc");
  await page.goBack();
  await expect.poll(() => renderedIds(page)).toEqual(["snow-leopard", "tiger"]);
  await expect(page.getByRole("combobox", { name: "Sort records" })).toHaveValue("narrative");
  await page.getByRole("searchbox").fill("blue whale");
  await page.getByRole("searchbox").press("Enter");
  await expect.poll(() => renderedIds(page)).toEqual(["blue-whale"]);
  await expect(page.getByRole("searchbox")).toBeFocused();
});

test("every individual facet and representative intersections return the expected records", async ({ page }) => {
  const cases: [string, string[]][] = [
    ["status=VU", ["snow-leopard"]], ["status=EN", ["blue-whale", "tiger"]], ["status=CR", ["bornean-orangutan", "hawksbill-turtle", "african-forest-elephant"]],
    ["group=Mammalia", ids.filter((id) => id !== "hawksbill-turtle")], ["group=Reptilia", ["hawksbill-turtle"]],
    ["habitat=mountain", ["snow-leopard"]], ["habitat=open-ocean", ["blue-whale"]], ["habitat=forest", ["tiger", "bornean-orangutan", "african-forest-elephant"]],
    ["habitat=grassland", ["tiger"]], ["habitat=reef-coast", ["hawksbill-turtle"]],
    ["region=asia", ["snow-leopard", "tiger", "bornean-orangutan"]], ["region=africa", ["african-forest-elephant"]], ["region=ocean", ["blue-whale", "hawksbill-turtle"]],
    ["habitat=forest&habitat=grassland", ["tiger", "bornean-orangutan", "african-forest-elephant"]],
    ["status=CR&group=Mammalia&habitat=forest&region=asia", ["bornean-orangutan"]],
    ["q=panthera&habitat=forest&region=asia", ["tiger"]],
  ];
  for (const [query, expectedIds] of cases) {
    await page.goto(`/species?${query}`);
    await expect.poll(() => renderedIds(page), { message: query }).toEqual(expectedIds);
  }
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
});

test("keyboard multi-select controls apply, clear and restore checked selections", async ({ page }) => {
  await page.goto("/species");
  await page.locator(".species-filter-groups summary").filter({ hasText: "Habitat" }).click();
  const forest = page.getByRole("checkbox", { name: /^Forest/ });
  await forest.focus(); await page.keyboard.press("Space");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect.poll(() => renderedIds(page)).toEqual(["tiger", "bornean-orangutan", "african-forest-elephant"]);
  await expect(forest).toBeChecked();
  await page.getByRole("link", { name: "Clear filters", exact: true }).click();
  await expect(page.locator(".explorer-card")).toHaveCount(6);
  await page.goBack();
  await expect(forest).toBeChecked();
  await expect(page.locator(".explorer-card")).toHaveCount(3);
});

test("no-results and invalid URL values stay explicit and recoverable", async ({ page }) => {
  await page.goto("/species?status=CR&habitat=mountain");
  await expect(page.getByRole("heading", { name: "No matching species." })).toBeVisible();
  await expect(page.locator(".species-result-summary")).toContainText("0 records");
  await page.getByRole("link", { name: "Clear all filters" }).click();
  await expect(page.locator(".explorer-card")).toHaveCount(6);
  await page.goto("/species?status=bogus&sort=population");
  await expect(page.getByRole("heading", { name: "Some URL values were not recognized" })).toBeVisible();
  await expect(page.locator(".explorer-card")).toHaveCount(6);
});

test("all six detail routes preserve science, metadata, portraits, missing audio and related navigation", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const [i, id] of ids.entries()) {
    const response = await page.goto(`/species/${id}`);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveText(names[i]!);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator(".species-hero-status")).toContainText("Formal assessment date is unverified");
    const hero = page.locator(".species-photo-hero img");
    await expect(hero).toBeVisible();
    await expect.poll(() => hero.evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    for (const anchor of ["habitat", "population", "threats", "ecology", "sound", "conservation", "evidence"])
      await expect(page.locator(`#${anchor}`)).toBeVisible();
    await expect(page.locator("#sound")).toContainText("Recording unavailable for this species");
    await expect(page.locator("#conservation .note")).toHaveCount(1);
    await expect(page.locator(".species-reference-list li")).not.toHaveCount(0);
    await expect(page.locator(".species-related-grid article")).toHaveCount(2);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", new RegExp(`/species/${id}$`));
    expect(await page.title()).toContain(names[i]!);
    if (id === "snow-leopard") await expect(page.locator("#snow-india-spai")).toContainText("2019–2023");
    else if (id === "blue-whale") await expect(page.locator("#blue-enp-2018")).toContainText("Coefficient of variation: 0.085");
    else { await expect(page.locator(".measurement")).toHaveCount(0); await expect(page.getByRole("heading", { name: "No verified population estimate available in this documentary" })).toBeVisible(); }
    await expect(page.locator("audio,video,canvas")).toHaveCount(0);
  }
  expect(errors).toEqual([]);
});

test("explorer submits and species remain complete with JavaScript disabled", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${test.info().project.use.baseURL}/species`);
  await page.getByRole("searchbox").fill("Pongo pygmaeus");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page.locator(".explorer-card")).toHaveCount(1);
  await expect(page.locator(".explorer-card h2")).toHaveText("Bornean orangutan");
  await page.locator(".explorer-card h2 a").click();
  await expect(page.locator("#conservation")).toContainText("Forest restoration at Bukit Piton");
  await expect(page.locator("#evidence")).toBeVisible();
  await context.close();
});

test("explorer and every detail reflow at compact/tablet widths with reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [320, 390, 768]) {
    await page.setViewportSize({ width, height: 844 });
    for (const route of ["/species", ...ids.map((id) => `/species/${id}`)]) {
      await page.goto(route);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${width}: ${route}`).toBe(true);
      await expect(page.locator("[data-species-motion]")).toHaveAttribute("data-species-motion", "reduced");
      await expect(page.locator("main h1")).toBeVisible();
    }
  }
});

test("photograph load failure preserves identity, credits and scientific evidence", async ({ page }) => {
  await page.route("**/_next/image?**", async (route) => {
    if (new URL(route.request().url()).searchParams.get("url") === "/media/snow-leopard.webp") await route.fulfill({ status: 404, body: "Unavailable" });
    else await route.continue();
  });
  await page.goto("/species/snow-leopard");
  await expect(page.locator(".species-photo-hero .species-photo-error")).toContainText("Photograph unavailable");
  await expect(page.locator(".species-photo-hero figcaption")).toContainText("T. R. Shankar Raman");
  await expect(page.locator("#snow-india-spai")).toContainText("718 individuals");
});

test("pending filter navigation retains usable results and announces loading", async ({ page }) => {
  await page.goto("/species");
  await page.route("**/species?**", async (route) => {
    if (new URL(route.request().url()).searchParams.get("q") === "leopard") await new Promise((resolve) => setTimeout(resolve, 500));
    await route.continue();
  });
  await page.getByRole("searchbox").fill("leopard");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page.getByRole("button", { name: "Applying filters…" })).toBeDisabled();
  await expect(page.locator("#species-results")).toHaveAttribute("aria-busy", "true");
  await expect(page.locator(".explorer-card")).toHaveCount(6);
  await expect.poll(() => renderedIds(page)).toEqual(["snow-leopard"]);
});

test("live reduced-motion preference removes scoped photo transforms", async ({ page }) => {
  await page.goto("/species");
  await expect(page.locator("[data-species-motion]")).toHaveAttribute("data-species-motion", "enabled");
  await page.getByRole("searchbox").fill("Panthera");
  await page.getByRole("button", { name: "Apply filters" }).click();
  await expect(page.locator(".explorer-card")).toHaveCount(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-species-motion]")).toHaveAttribute("data-species-motion", "reduced");
  await expect.poll(() => page.locator("[data-species-image]").evaluateAll((images) => images.every((image) => !((image as HTMLElement).style.transform || (image as HTMLElement).style.opacity)))).toBe(true);
  await expect(page.locator(".explorer-card h2")).toHaveCount(2);
});
