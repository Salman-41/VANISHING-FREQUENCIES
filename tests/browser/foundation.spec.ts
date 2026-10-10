import { expect, test } from "@playwright/test";

const routes = [
  ["/", "The World Is Getting Quieter."],
  ["/species", "Six lives. Different pressures."],
  ["/species/snow-leopard", "Snow leopard"],
  ["/species/blue-whale", "Blue whale"],
  ["/species/tiger", "Tiger"],
  ["/species/bornean-orangutan", "Bornean orangutan"],
  ["/species/hawksbill-turtle", "Hawksbill sea turtle"],
  ["/species/african-forest-elephant", "African forest elephant"],
  ["/soundscapes", "A place has more than one voice."],
  ["/data", "Read the change. Keep the context."],
  ["/about", "A documentary about attention."],
  ["/sources", "Follow the evidence."],
  ["/credits", "The work behind each frame."],
] as const;

test("every route loads with one heading, local fonts and no hydration errors", async ({
  page,
}) => {
  test.slow(); // First local compilation visits thirteen URLs, not one warm page.
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (
      message.type() === "error" ||
      /hydration|hydrated.*match/i.test(message.text())
    )
      errors.push(message.text());
  });
  const remote: string[] = [];
  page.on("request", (r) => {
    if (!new URL(r.url()).hostname.match(/^(127\.0\.0\.1|localhost)$/))
      remote.push(r.url());
  });
  for (const [route, heading] of routes) {
    const response = await page.goto(route);
    expect(response?.status(), route).toBe(200);
    await expect(page.locator("main h1")).toHaveText(heading);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("main")).toBeVisible();
  }
  expect(errors).toEqual([]);
  expect(remote).toEqual([]);
});
test("navigation traps focus, closes with Escape and restores focus", async ({
  page,
}) => {
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu", exact: true });
  await menu.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(
    dialog.getByRole("button", { name: "Close menu" }),
  ).toBeFocused();
  for (let i = 0; i < 20; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => !!document.activeElement?.closest("dialog")),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(menu).toBeFocused();
  await menu.click();
  await dialog
    .getByRole("link", { name: "Species Explorer", exact: true })
    .click();
  await expect(page).toHaveURL(/\/species$/);
  await expect(dialog).not.toBeVisible();
  await expect(page.locator("main")).toBeFocused();
});
test("scientific records retain context, citations and separate editions", async ({
  page,
}) => {
  await page.goto("/species/blue-whale");
  const measurement = page.locator("#blue-enp-2018");
  await expect(measurement).toContainText("1,898 individuals");
  for (const context of [
    "Eastern North Pacific",
    "2015–2018",
    "0.085",
    "2023 stock assessment",
    "2026-10-08",
  ])
    await expect(measurement).toContainText(context);
  await expect(
    measurement.locator('a[href="/sources#noaa-blue-stock"]'),
  ).toBeVisible();
  await page.goto("/species/tiger");
  await expect(
    page.getByRole("heading", {
      name: "No verified population estimate available in this documentary",
    }),
  ).toBeVisible();
  await page.goto("/data");
  await expect(page.locator("tbody").first().locator("tr")).toHaveCount(51);
  await expect(page.locator("tbody").nth(1).locator("tr")).toHaveCount(9);
  await expect(page.locator("main")).toContainText(
    "does not measure the percentage of individual animals",
  );
  await page.goto("/sources#noaa-blue-stock");
  await expect(page.locator("#noaa-blue-stock")).toContainText("2024-05-14");
});
test("unknown slugs and routes return helpful 404s", async ({ page }) => {
  for (const route of ["/species/invented-animal", "/missing-page"]) {
    const response = await page.goto(route);
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", {
        name: "This page is outside the documentary",
      }),
    ).toBeVisible();
  }
});
test("320px pages reflow and OS reduced motion wins over user toggle", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const [route] of routes) {
    await page.goto(route);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      route,
    ).toBe(true);
  }
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await page.getByLabel("Read without motion").check();
  await page.getByLabel("Read without motion").uncheck();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await page.getByLabel("Lighter media").check();
  await page.reload();
  await expect(page.getByLabel("Lighter media")).toBeChecked();
  await expect(page.locator("html")).toHaveAttribute("data-media", "lighter");
  await expect(page.locator("audio, video, canvas")).toHaveCount(0);
});
test("essential evidence and navigation remain readable without JavaScript", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${test.info().project.use.baseURL}/species/snow-leopard`);
  await expect(page.locator("#snow-india-spai")).toContainText(
    "718 individuals",
  );
  await expect(
    page.getByRole("navigation", { name: "Main navigation", exact: true }).getByRole("link", { name: "Species Explorer" }),
  ).toBeVisible();
  await context.close();
});
