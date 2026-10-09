import { expect, test } from "@playwright/test";

test("audio requires consent, switches habitats, and stops on hidden tab", async ({ page }) => {
  const audioRequests: string[] = [];
  page.on("request", (request) => { if (request.url().includes("/audio/")) audioRequests.push(request.url()); });
  await page.goto("/soundscapes");
  await expect(page.getByRole("heading", { name: "A place has more than one voice." })).toBeVisible();
  expect(audioRequests).toEqual([]);
  await expect(page.getByText("The surf was recorded at the surface", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Play soundscape" }).click();
  await expect(page.getByRole("button", { name: "Stop soundscape" })).toBeVisible();
  expect(audioRequests.filter((url) => url.endsWith(".mp3")).length).toBe(2);
  await page.getByRole("button", { name: /Under the canopy/ }).click();
  await expect(page.getByRole("heading", { name: "Under the canopy." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Stop soundscape" })).toBeVisible();
  expect(audioRequests.some((url) => url.includes("forest-hermit-thrush.mp3"))).toBe(true);
  await expect.poll(async () => Number(await page.getByRole("slider", { name: /Seek within looping recording/ }).inputValue())).toBeGreaterThan(0);
  const beforePause = Number(await page.getByRole("slider", { name: /Seek within looping recording/ }).inputValue());
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.getByRole("button", { name: "Resume soundscape" })).toBeVisible();
  await expect(page.getByText("Listening paused")).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.getByRole("button", { name: "Resume soundscape" })).toBeVisible();
  await page.getByRole("button", { name: "Resume soundscape" }).click();
  await expect(page.getByRole("button", { name: "Stop soundscape" })).toBeVisible();
  expect(Number(await page.getByRole("slider", { name: /Seek within looping recording/ }).inputValue())).toBeGreaterThanOrEqual(beforePause);
});

test("layer, volume, mute and waveform controls work by keyboard at mobile width", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/soundscapes");
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  const mute = page.getByRole("button", { name: "Mute", exact: true });
  await mute.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Unmute" })).toHaveAttribute("aria-pressed", "true");
  const volume = page.getByRole("slider", { name: "Soundscape volume" });
  await volume.focus();
  await page.keyboard.press("ArrowLeft");
  await expect(volume).toHaveValue("64");
  await page.getByRole("checkbox", { name: /Humpback whale/ }).uncheck();
  await expect(page.getByRole("checkbox", { name: /Humpback whale/ })).not.toBeChecked();
  await page.getByRole("button", { name: "View waveform" }).last().click();
  await expect(page.getByText("Waveform / Humpback whale")).toBeVisible();
  await expect(page.getByRole("slider", { name: /Seek within looping recording/ })).toBeVisible();
});

test("failed audio leaves the written archive usable", async ({ page }) => {
  await page.route("**/audio/ocean-surf.mp3", (route) => route.fulfill({ status: 503, body: "Unavailable" }));
  await page.goto("/soundscapes");
  await page.getByRole("button", { name: "Play soundscape" }).click();
  await expect(page.locator("main [role='alert']")).toContainText("could not be loaded");
  await expect(page.getByRole("link", { name: "NPS recording page ↗" }).first()).toBeVisible();
  await expect(page.getByRole("heading", { name: "What the selected species sound like" })).toBeVisible();
});

test("route exit closes the active AudioContext", async ({ page }) => {
  await page.addInitScript(() => {
    const nativeClose = AudioContext.prototype.close;
    Object.assign(window, { vfCloseCount: 0 });
    AudioContext.prototype.close = function () {
      (window as unknown as { vfCloseCount: number }).vfCloseCount += 1;
      return nativeClose.call(this);
    };
  });
  await page.goto("/soundscapes");
  await page.getByRole("button", { name: "Play soundscape" }).click();
  await expect(page.getByRole("button", { name: "Stop soundscape" })).toBeVisible();
  await page.getByRole("link", { name: "About", exact: true }).first().click();
  await expect(page).toHaveURL(/\/about$/);
  await expect.poll(() => page.evaluate(() => (window as unknown as { vfCloseCount: number }).vfCloseCount)).toBeGreaterThan(0);
});
