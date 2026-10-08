import { expect, test } from "@playwright/test";
const chapters = [
  "opening",
  "snow-leopard",
  "blue-whale",
  "trends",
  "soundscapes",
  "species-at-risk",
  "conservation",
  "closing",
];
for (const width of [1440, 1024, 768, 390, 320]) {
  test(`static homepage reflows with readable chapters at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.locator("h1")).toHaveText(
      "The World Is Getting Quieter.",
    );
    expect(
      await page
        .locator("[data-chapter]")
        .evaluateAll((nodes) => nodes.map((n) => n.id)),
    ).toEqual(chapters);
    for (const id of chapters) {
      await page.locator(`#${id}-title`).scrollIntoViewIfNeeded();
      await expect(page.locator(`#${id}-title`)).toBeVisible();
      const size = await page.locator(`#${id}-title`).boundingBox();
      expect(size!.x).toBeGreaterThanOrEqual(0);
      expect(size!.x + size!.width).toBeLessThanOrEqual(width + 1);
    }
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await expect(page.locator("audio,video,canvas")).toHaveCount(0);
    await page.goto("/#trends");
    await page.locator(".chart-data summary").click();
    await expect(page.locator(".chart-data tbody tr")).toHaveCount(51);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth),
    ).toBe(width);
    await expect(
      page.locator(width < 768 ? ".index-plot-mobile" : ".index-plot-desktop"),
    ).toBeVisible();
  });
}
test("homepage photographs load locally with credits and exact evidence", async ({
  page,
}) => {
  const errors: string[] = [];
  const remote: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("request", (r) => {
    if (!/^(localhost|127\.0\.0\.1)$/.test(new URL(r.url()).hostname))
      remote.push(r.url());
  });
  await page.goto("/");
  for (const img of await page.locator("main img").all()) {
    await img.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        img.evaluate(
          (element: HTMLImageElement) =>
            element.complete && element.naturalWidth > 0,
        ),
      )
      .toBe(true);
    await expect(img).toHaveAttribute("alt", /.+/);
  }
  await expect(page.locator("main img")).toHaveCount(12);
  await expect(page.locator("#home-snow-india-spai")).toContainText(
    "2019–2023",
  );
  await expect(page.locator("#home-blue-enp-2018")).toContainText("CV 0.085");
  await expect(page.locator("#trends")).toContainText("0.27134067");
  await expect(page.locator("#soundscapes")).toContainText(
    "Missing audio is not evidence of silence",
  );
  await expect(page.locator("#home-snow-corrals")).toContainText(
    "not proof of increasing snow leopard abundance",
  );
  await page.goto("/credits");
  await expect(page.locator('[id^="image-"]')).toHaveCount(7);
  expect(errors).toEqual([]);
  expect(remote).toEqual([]);
});
test("homepage remains complete without JavaScript, including native evidence disclosures", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto(`${test.info().project.use.baseURL}/`);
  await expect(page.locator("[data-chapter]")).toHaveCount(8);
  await page.getByRole("link", { name: "Begin the documentary" }).click();
  await expect(page).toHaveURL(/#snow-leopard$/);
  await page.locator(".chart-data summary").click();
  await expect(page.locator(".chart-data tbody tr")).toHaveCount(51);
  await page.locator("#home-snow-corrals").scrollIntoViewIfNeeded();
  await expect(
    page.locator("#home-snow-corrals .inference-limit"),
  ).toBeVisible();
  await expect(
    page.locator("noscript").getByRole("link", { name: "Species Explorer" }),
  ).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await context.close();
});
