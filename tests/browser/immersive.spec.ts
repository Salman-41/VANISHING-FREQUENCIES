import { test, expect, chromium, type Page } from "@playwright/test";

test.use({ launchOptions: { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] } });
test.setTimeout(90_000);
test.use({ actionTimeout: 20_000 });
const controls = (page: Page, kind = "mountain") => page.locator(`[data-scene-control="${kind}"]`);
const frame = (page: Page, kind = "mountain") => page.locator(kind === "mountain" ? ".mountain-landscape .media-aperture" : ".ocean-portrait .media-aperture");
async function open(page: Page) {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.locator(".documentary")).toHaveAttribute("data-scroll-controller", "lenis");
  await expect(page.locator("canvas")).toHaveCount(0);
  await controls(page).getByRole("button", { name: "Explore in 3D" }).click();
  await expect(controls(page).getByRole("status")).toContainText("3D study ready", { timeout: 20_000 });
  await expect(page.locator("canvas")).toHaveCount(1);
}

test("optional 3D renders layered terrain, a reversible waterline and silent pulses within the existing frame", async ({ page }, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await open(page);
  const estimates = await page.locator(".doc-estimate").allTextContents();
  await expect(frame(page)).toHaveAttribute("data-scene-draw-calls", "3");
  await expect(frame(page)).toHaveAttribute("data-scene-textures", "0");
  await page.locator(".mountain-landscape").screenshot({ path: testInfo.outputPath("mountain.png") });
  await controls(page).getByRole("button", { name: "Follow the water" }).click();
  await expect(frame(page)).toHaveAttribute("data-scene-mix", "1.000");
  await page.locator(".mountain-landscape").screenshot({ path: testInfo.outputPath("waterline-ocean.png") });
  await controls(page).getByRole("button", { name: "Send a visual pulse" }).click();
  await page.waitForTimeout(2200); // finite 1.8s interaction must stop requesting frames
  const idle = await frame(page).getAttribute("data-scene-frames");
  await page.waitForTimeout(250);
  expect(await frame(page).getAttribute("data-scene-frames")).toBe(idle);
  await controls(page).getByRole("button", { name: "Resume scroll scene" }).focus();
  await page.keyboard.press("Enter");
  await expect(controls(page).getByRole("button", { name: "Follow the water" })).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("audio,video")).toHaveCount(0);
  expect(await page.locator(".doc-estimate").allTextContents()).toEqual(estimates);
  await controls(page).getByRole("button", { name: "Return to photographs" }).click();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".mountain-landscape img")).toBeVisible();
  expect(errors).toEqual([]);
});

test("scroll ownership, offscreen disposal, chapter handoff and route cleanup remain intact", async ({ page }) => {
  await open(page);
  const before = await frame(page).getAttribute("data-scene-progress");
  await page.mouse.wheel(0, -180);
  await expect.poll(() => frame(page).getAttribute("data-scene-progress")).not.toBe(before);
  await page.locator('.reading-margin a[href="#blue-whale"]').click();
  await expect(page.locator("#blue-whale")).toBeFocused();
  await controls(page, "ocean").scrollIntoViewIfNeeded();
  await expect(controls(page, "ocean").getByRole("status")).toContainText("3D study ready");
  await expect(page.locator("canvas")).toHaveCount(1);
  await expect(frame(page, "ocean")).toHaveAttribute("data-immersive", "active");
  await page.locator('.reading-margin a[href="#trends"]').click();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator(".documentary")).toHaveAttribute("data-scroll-controller", "lenis");
  await page.locator('.header-source').click();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(page.locator("main h1")).toHaveText("Follow the evidence.");
});

test("context loss returns to the photo and an explicit retry creates a working renderer", async ({ page }) => {
  await open(page);
  await page.locator("canvas").evaluate((canvas: HTMLCanvasElement) => {
    const extension = canvas.getContext("webgl2")?.getExtension("WEBGL_lose_context");
    if (!extension) throw new Error("Test requires the real context-loss extension");
    extension.loseContext();
  });
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(controls(page).getByRole("status")).toContainText("3D is unavailable");
  await expect(page.locator(".mountain-landscape img")).toBeVisible();
  await controls(page).getByRole("button", { name: "Retry 3D study" }).click();
  await expect(controls(page).getByRole("status")).toContainText("3D study ready");
  await expect(page.locator("canvas")).toHaveCount(1);
});

test("live reduced motion releases WebGL and restores native content", async ({ page }) => {
  await open(page);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect(controls(page).getByRole("status")).toContainText("Still photographs");
  await expect(controls(page).getByRole("button", { name: "Explore in 3D" })).toBeDisabled();
  await expect(page.locator(".mountain-landscape img")).toBeVisible();
  await expect(page.locator(".pin-spacer")).toHaveCount(0);
});

test("mobile touch and the lighter configuration use a small rendering budget", async ({ browser }, testInfo) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const cdp = await context.newCDPSession(page);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await page.goto("/");
  await controls(page).getByRole("button", { name: "Explore in 3D" }).tap();
  await expect(controls(page).getByRole("status")).toContainText("3D study ready");
  await controls(page).getByRole("combobox").selectOption("light");
  await expect(controls(page).getByRole("status")).toContainText("3D study ready");
  await expect(frame(page)).toHaveAttribute("data-scene-quality", "light");
  await controls(page).getByRole("button", { name: "Follow the water" }).tap();
  await expect(frame(page)).toHaveAttribute("data-scene-mix", "1.000");
  expect(Number(await frame(page).getAttribute("data-scene-dpr"))).toBeLessThanOrEqual(1);
  expect(Number(await frame(page).getAttribute("data-scene-triangles"))).toBeLessThanOrEqual(9220);
  await expect(frame(page)).toHaveAttribute("data-scene-points", "80");
  await page.screenshot({ path: testInfo.outputPath("mobile-light.png") });
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  const y = await page.evaluate(() => scrollY);
  await cdp.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 180, y: 600 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x: 180, y: 200 }] });
  await cdp.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect.poll(() => page.evaluate(() => scrollY)).toBeGreaterThan(y + 100);
  await context.close();
});

test("disabled WebGL falls back without breaking evidence or navigation", async ({ baseURL }) => {
  const browser = await chromium.launch({ args: ["--disable-webgl"] });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    await page.goto(baseURL!);
    await controls(page).getByRole("button", { name: "Explore in 3D" }).click();
    await expect(controls(page).getByRole("status")).toContainText("3D is unavailable");
    await expect(page.locator("canvas")).toHaveCount(0);
    await expect(page.locator(".mountain-landscape img")).toBeVisible();
    await page.locator('.reading-margin a[href="#trends"]').click();
    await page.locator(".chart-data summary").click();
    await expect(page.locator(".chart-data tbody tr")).toHaveCount(51);
  } finally { await browser.close(); }
});

test("balanced geometry adapts on resize, pauses under navigation and releases its GPU context", async ({ page }) => {
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Emulation.setHardwareConcurrencyOverride", { hardwareConcurrency: 8 });
  await page.addInitScript(() => Object.defineProperty(navigator, "deviceMemory", { get: () => 8 }));
  await open(page);
  await expect(frame(page)).toHaveAttribute("data-scene-quality", "balanced");
  await expect(frame(page)).toHaveAttribute("data-scene-points", "240");
  await expect(frame(page)).toHaveAttribute("data-scene-triangles", "36866");
  await page.locator(".menu-opener").click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.waitForTimeout(250);
  const paused = await frame(page).getAttribute("data-scene-frames");
  await page.waitForTimeout(250);
  expect(await frame(page).getAttribute("data-scene-frames")).toBe(paused);
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 600, height: 850 });
  await controls(page).scrollIntoViewIfNeeded();
  await expect(frame(page)).toHaveAttribute("data-scene-quality", "light");
  await expect(frame(page)).toHaveAttribute("data-scene-points", "80");
  await expect(frame(page)).toHaveAttribute("data-scene-geometries", "3");
  const context = await page.locator("canvas").evaluateHandle((canvas: HTMLCanvasElement) => canvas.getContext("webgl2")!);
  await controls(page).getByRole("button", { name: "Return to photographs" }).click();
  await expect(page.locator("canvas")).toHaveCount(0);
  await expect.poll(() => context.evaluate((gl) => gl.isContextLost())).toBe(true);
  await context.dispose();
});
