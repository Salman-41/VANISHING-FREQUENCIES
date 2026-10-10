import { expect, test } from "@playwright/test";

async function desktop(page: import("@playwright/test").Page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.goto("/");
  await expect(page.locator(".documentary")).toHaveAttribute(
    "data-scroll-controller",
    "lenis",
  );
}

test("mouse wheel, keyboard, anchor focus and reading position work without changing evidence", async ({
  page,
}) => {
  await desktop(page);
  const values = await page.locator(".doc-estimate").allTextContents();
  await page.mouse.move(800, 450);
  await page.mouse.wheel(0, 700);
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(450);
  const before = await page.evaluate(() => scrollY);
  await page.keyboard.press("PageDown");
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(before + 100);
  await page.locator('.reading-margin a[href="#trends"]').click();
  await expect(page).toHaveURL(/#trends$/);
  await expect(page.locator("#trends")).toBeFocused();
  await expect(
    page.locator('.reading-margin a[href="#trends"]'),
  ).toHaveAttribute("aria-current", "location");
  expect(await page.locator(".doc-estimate").allTextContents()).toEqual(values);
  await expect(page.locator("audio, canvas, video")).toHaveCount(0);
});

test("aperture is reversible, fixed scale, keyboard operable and interruptible", async ({
  page,
}) => {
  await desktop(page);
  await page.locator('.reading-margin a[href="#blue-whale"]').click();
  const button = page.locator(".aperture-control");
  const image = page.locator(".ocean-portrait img");
  const transform = await image.evaluate(
    (node) => getComputedStyle(node).transform,
  );
  await button.click();
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await button.click();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(button).toBeHidden();
  await expect(page.locator(".documentary")).not.toHaveAttribute(
    "data-motion-runtime",
    "active",
  );
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  expect(await image.evaluate((node) => getComputedStyle(node).transform)).toBe(
    transform,
  );
  await expect(page.locator(".ocean-portrait figcaption")).toBeVisible();
  expect(
    await page
      .locator(".ocean-portrait .scene-mask")
      .evaluateAll((nodes) =>
        nodes.every((node) => getComputedStyle(node).display === "none"),
      ),
  ).toBe(true);
});

test("aperture settles after a rapid reversal and returns fully open on resize", async ({ page }) => {
  await desktop(page);
  await page.locator('.reading-margin a[href="#blue-whale"]').click();
  const button = page.locator(".aperture-control");
  const masks = page.locator(".ocean-portrait .scene-mask");
  const openingHeight = () => page.locator(".ocean-portrait .media-aperture").evaluate(frame => {
    const top = frame.querySelector(".scene-mask-top")!.getBoundingClientRect();
    const bottom = frame.querySelector(".scene-mask-bottom")!.getBoundingClientRect();
    return bottom.top - top.bottom;
  });
  await button.click();
  await expect.poll(openingHeight).toBeCloseTo(96, 0);
  await button.press("Enter");
  await page.waitForTimeout(100);
  await button.press("Enter");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect.poll(openingHeight).toBeCloseTo(96, 0);
  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect.poll(() => masks.evaluateAll(nodes => nodes.every(node => node.getBoundingClientRect().height < 0.5))).toBe(true);
});

test("repeated preferences, route exits and history restore dispose the scroll owner", async ({
  page,
}) => {
  await desktop(page);
  const initialCount = await page
    .locator(".documentary")
    .getAttribute("data-motion-trigger-count");
  for (let i = 0; i < 3; i++) {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    await expect(page.locator(".documentary")).toHaveAttribute(
      "data-scroll-controller",
      "lenis",
    );
    await expect(page.locator(".documentary")).toHaveAttribute(
      "data-motion-trigger-count",
      initialCount!,
    );
    expect(await page.locator(".pin-spacer").count()).toBeLessThanOrEqual(1);
  }
  await page.locator('.reading-margin a[href="#trends"]').click();
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(page.getByRole("button", { name: "Close menu" })).toBeFocused();
  await page
    .getByRole("dialog")
    .getByRole("link", { name: "Sources", exact: true })
    .click();
  await expect(page).toHaveURL(/\/sources$/);
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator("main")).toBeFocused();
  await page.goBack();
  await expect(page).toHaveURL(/\/#trends$/);
  await expect(page.locator(".documentary")).toHaveAttribute(
    "data-scroll-controller",
    "lenis",
  );
  await expect(page.locator(".documentary")).toHaveAttribute(
    "data-motion-trigger-count",
    initialCount!,
  );
  await expect
    .poll(() =>
      page
        .locator("#trends")
        .evaluate((node) => Math.abs(node.getBoundingClientRect().top)),
    )
    .toBeLessThan(200);
});

test("resize removes pins and masks; fine-pointer feedback has a keyboard equivalent", async ({
  page,
}) => {
  await desktop(page);
  const link = page.locator(".opening-actions .doc-link").first();
  await link.hover();
  await expect
    .poll(() =>
      link.locator("span").evaluate((node) => getComputedStyle(node).transform),
    )
    .not.toBe("none");
  await link.focus();
  await expect(link).toBeFocused();
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".documentary")).toHaveAttribute(
    "data-scroll-controller",
    "native",
  );
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".aperture-control")).toBeHidden();
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
  await page.setViewportSize({ width: 1440, height: 700 });
  await expect(page.locator(".documentary")).toHaveAttribute(
    "data-scroll-controller",
    "native",
  );
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("touch swipe preserves native scrolling without a smooth-scroll owner", async ({
  browser,
}) => {
  const context = await browser.newContext({
    baseURL: test.info().project.use.baseURL,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
    reducedMotion: "no-preference",
  });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.locator(".documentary")).toHaveAttribute(
    "data-scroll-controller",
    "native",
  );
  const cdp = await context.newCDPSession(page);
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchStart",
    touchPoints: [{ x: 190, y: 700 }],
  });
  for (const y of [600, 480, 360, 240])
    await cdp.send("Input.dispatchTouchEvent", {
      type: "touchMove",
      touchPoints: [{ x: 190, y }],
    });
  await cdp.send("Input.dispatchTouchEvent", {
    type: "touchEnd",
    touchPoints: [],
  });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(200);
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        let previous = scrollY,
          stable = 0;
        const frame = () => {
          stable = Math.abs(scrollY - previous) < 0.5 ? stable + 1 : 0;
          previous = scrollY;
          if (stable >= 8) resolve();
          else requestAnimationFrame(frame);
        };
        requestAnimationFrame(frame);
      }),
  );
  await page.getByRole("button", { name: "Menu", exact: true }).tap();
  await page.getByRole("dialog").locator('a[href="/#trends"]').tap();
  await expect(page).toHaveURL(/#trends$/);
  await context.close();
});

test("stored reading and lighter-media preferences do not boot motion", async ({
  browser,
}) => {
  for (const key of ["readWithoutMotion", "lighterMedia"]) {
    const context = await browser.newContext({
      baseURL: test.info().project.use.baseURL,
      viewport: { width: 1440, height: 900 },
    });
    await context.addInitScript(
      (selected) =>
        localStorage.setItem(
          "vf.preferences.v1",
          JSON.stringify({
            version: 1,
            readWithoutMotion: selected === "readWithoutMotion",
            lighterMedia: selected === "lighterMedia",
          }),
        ),
      key,
    );
    const page = await context.newPage();
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute(
      key === "readWithoutMotion" ? "data-motion" : "data-media",
      key === "readWithoutMotion" ? "reduced" : "lighter",
    );
    await expect(page.locator(".reading-margin")).toBeHidden();
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
    await expect(page.locator(".pin-spacer")).toHaveCount(0);
    await expect(page.locator("h1")).toBeVisible();
    await context.close();
  }
});

test("one fitting mountain image pins briefly while text and credit links remain unpinned", async ({
  page,
}) => {
  await desktop(page);
  await expect(page.locator(".snow-portrait .pin-spacer")).toHaveCount(1);
  const image = page.locator(".snow-portrait .media-aperture");
  const geometry = await image.evaluate((node) => {
    const panel = node as HTMLElement;
    const spacer = panel.parentElement!;
    return {
      travel: spacer.offsetHeight - panel.offsetHeight,
      height: innerHeight,
      top: panel.getBoundingClientRect().top + scrollY,
    };
  });
  expect(geometry.travel).toBeGreaterThan(0);
  expect(geometry.travel).toBeLessThanOrEqual(geometry.height);
  expect(
    await page
      .locator(".snow-portrait figcaption")
      .evaluate((node) => Boolean(node.closest(".pin-spacer"))),
  ).toBe(false);
  expect(
    await page
      .locator(".estimate-margin")
      .evaluateAll((nodes) =>
        nodes.some((node) => node.closest(".pin-spacer")),
      ),
  ).toBe(false);
  await page.evaluate((top) => scrollTo(0, top - 48 + 20), geometry.top);
  await expect
    .poll(() =>
      image.evaluate((node) => Math.abs(node.getBoundingClientRect().top - 48)),
    )
    .toBeLessThan(2);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(page.locator(".snow-portrait figcaption")).toBeVisible();
});

test("fullscreen menu suspends wheel scrolling and releases focus immediately", async ({
  page,
}) => {
  await desktop(page);
  await page.getByRole("button", { name: "Menu", exact: true }).click();
  await expect(page.locator("html")).toHaveClass(/lenis-stopped/);
  const position = await page.evaluate(() => scrollY);
  await page.mouse.move(1200, 700);
  await page.mouse.wheel(0, 300);
  expect(await page.evaluate(() => scrollY)).toBe(position);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(
    page.getByRole("button", { name: "Menu", exact: true }),
  ).toBeFocused();
  await expect(page.locator("html")).not.toHaveClass(/lenis-stopped/);
  await page.mouse.wheel(0, 300);
  await expect
    .poll(() => page.evaluate(() => scrollY))
    .toBeGreaterThan(position + 100);
});

test("user reading preference removes active work and restores native controls", async ({
  page,
}) => {
  await desktop(page);
  const checkbox = page.getByRole("checkbox", { name: "Read without motion" });
  await checkbox.check();
  await expect(page.locator("html")).toHaveAttribute("data-motion", "reduced");
  await expect(page.locator("html")).not.toHaveClass(/lenis/);
  await expect(page.locator(".reading-margin")).toBeHidden();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
  await expect(checkbox).toBeFocused();
  await checkbox.uncheck();
  await expect(page.locator(".documentary")).toHaveAttribute(
    "data-scroll-controller",
    "lenis",
  );
  await expect(page.locator(".pin-spacer")).toHaveCount(1);
});

test("native evidence expansion refreshes chapter geometry without animating chart values", async ({
  page,
}) => {
  await desktop(page);
  await page.locator('.reading-margin a[href="#trends"]').click();
  await expect(page).toHaveURL(/#trends$/);
  const path = await page
    .locator(".index-plot-desktop .chart-estimate")
    .getAttribute("points");
  await page.locator(".chart-data summary").click();
  await expect(page.locator(".chart-data tbody tr")).toHaveCount(51);
  await page.locator('.reading-margin a[href="#soundscapes"]').click();
  await expect(page).toHaveURL(/#soundscapes$/);
  await expect(
    page.locator('.reading-margin a[href="#soundscapes"]'),
  ).toHaveAttribute("aria-current", "location");
  expect(
    await page
      .locator(".index-plot-desktop .chart-estimate")
      .getAttribute("points"),
  ).toBe(path);
});

test("chapter controls stay in the desktop gutter and compact progress does not cover copy", async ({
  page,
}) => {
  await desktop(page);
  const main = await page.locator("main").boundingBox();
  const margin = await page.locator(".reading-margin").boundingBox();
  expect(margin!.x).toBeGreaterThanOrEqual(main!.x + main!.width);
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.locator(".reading-margin")).toBeHidden();
  await expect(page.locator(".reading-line")).toBeVisible();
  expect((await page.locator(".reading-line").boundingBox())!.height).toBe(1);
  expect(
    await page
      .locator(".reading-line")
      .evaluate((node) => getComputedStyle(node).pointerEvents),
  ).toBe("none");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator(".reading-line")).toBeHidden();
});
