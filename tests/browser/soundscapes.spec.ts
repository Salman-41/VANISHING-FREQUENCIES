import { expect, test } from "@playwright/test";

test("audio requires consent, switches habitats, and stops on hidden tab", async ({ page }) => {
  const audioRequests: string[] = [];
  page.on("request", (request) => { if (request.url().includes("/audio/")) audioRequests.push(request.url()); });
  await page.goto("/soundscapes");
  await expect(page.getByRole("heading", { name: "A place has more than one voice." })).toBeVisible();
  expect(audioRequests).toEqual([]);
  await expect(page.getByText("The surf was recorded at the surface", { exact: false })).toBeVisible();
  await page.getByRole("button", { name: "Sound on ↗" }).click();
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
  expect(audioRequests.filter((url) => url.endsWith(".mp3")).length).toBe(2);
  await page.getByRole("button", { name: /Under the canopy/ }).click();
  await expect(page.getByRole("heading", { name: "Under the canopy." })).toBeVisible();
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
  expect(audioRequests.some((url) => url.includes("forest-hermit-thrush.mp3"))).toBe(true);
  await expect.poll(async () => Number(await page.getByRole("slider", { name: /Seek within looping recording/ }).inputValue())).toBeGreaterThan(0);
  const beforePause = Number(await page.getByRole("slider", { name: /Seek within looping recording/ }).inputValue());
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.getByRole("button", { name: "Resume audio ↗" })).toBeVisible();
  await expect(page.getByText("Listening paused")).toBeVisible();
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.getByRole("button", { name: "Resume audio ↗" })).toBeVisible();
  await page.getByRole("button", { name: "Resume audio ↗" }).click();
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
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
  await page.getByRole("button", { name: "View waveform for Humpback whale" }).click();
  await expect(page.getByText("Waveform / Humpback whale")).toBeVisible();
  await expect(page.getByRole("slider", { name: /Seek within looping recording/ })).toBeVisible();
});

test("failed audio leaves the written archive usable", async ({ page }) => {
  await page.route("**/audio/ocean-surf.mp3", (route) => route.fulfill({ status: 503, body: "Unavailable" }));
  await page.goto("/soundscapes");
  await page.getByRole("button", { name: "Sound on ↗" }).click();
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
  await page.getByRole("button", { name: "Sound on ↗" }).click();
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
  await page.getByRole("link", { name: "About", exact: true }).first().click();
  await expect(page).toHaveURL(/\/about$/);
  await expect.poll(() => page.evaluate(() => (window as unknown as { vfCloseCount: number }).vfCloseCount)).toBeGreaterThan(0);
});

test("independent loop clocks survive seeking, layer changes, pause and stop", async ({ page }) => {
  await page.addInitScript(() => {
    const original = AudioBufferSourceNode.prototype.start;
    Object.assign(window, { vfStarts: [] });
    AudioBufferSourceNode.prototype.start = function (when = 0, offset = 0, duration?: number) {
      (window as unknown as { vfStarts: number[] }).vfStarts.push(offset);
      return original.call(this, when, offset, duration);
    };
  });
  await page.goto("/soundscapes");
  await page.getByRole("button", { name: /Above the tree line/ }).click();
  const seek = page.getByRole("slider", { name: /Seek within looping recording/ });
  await seek.fill("300");
  await page.getByRole("button", { name: "Sound on ↗" }).click();
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
  // Removing the long ambience changes the default duration to the short bird clip.
  const wind = page.getByRole("checkbox", { name: /Wind/ });
  await wind.uncheck();
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
  await wind.check();
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
  await expect.poll(async () => Number(await seek.inputValue())).toBeGreaterThanOrEqual(300);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, get: () => true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await expect(page.getByRole("button", { name: "Resume audio ↗" })).toBeVisible();
  await page.evaluate(() => Object.defineProperty(document, "hidden", { configurable: true, get: () => false }));
  await page.getByRole("button", { name: "Resume audio ↗" }).click();
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
  const lastPair = await page.evaluate(() => (window as unknown as { vfStarts: number[] }).vfStarts.slice(-2));
  expect(lastPair[0]).toBeGreaterThanOrEqual(30);
  await page.getByRole("button", { name: "Stop audio" }).click();
  await expect(seek).toHaveValue("0");
  await page.getByRole("button", { name: /Under the canopy/ }).click();
  await page.getByRole("button", { name: "View waveform for Hermit thrush" }).click();
  await seek.fill("60");
  await expect(seek).toHaveValue("60");
  await page.getByRole("button", { name: "Sound on ↗" }).click();
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
  const forestPair = await page.evaluate(() => (window as unknown as { vfStarts: number[] }).vfStarts.slice(-2));
  expect(forestPair[1]).toBe(6);
});

test("audio code loads on a late listening-room visit and preferences survive navigation", async ({ page }) => {
  const scripts: Promise<string>[] = [];
  page.on("response", response => {
    if (new URL(response.url()).pathname.endsWith(".js")) scripts.push(response.text());
  });
  await page.goto("/about");
  await page.waitForLoadState("networkidle");
  expect((await Promise.all(scripts)).some(text => text.includes("ocean-humpback"))).toBe(false);
  await page.getByRole("link", { name: "Soundscapes", exact: true }).first().click();
  await expect(page.getByRole("button", { name: "Sound on ↗" })).toBeVisible();
  await page.getByRole("button", { name: /Under the canopy/ }).click();
  await page.getByRole("slider", { name: "Soundscape volume" }).fill("32");
  await page.getByRole("button", { name: "Sound on ↗" }).click();
  await expect(page.getByRole("button", { name: "Stop audio" })).toBeVisible();
  await page.getByRole("link", { name: "About", exact: true }).first().click();
  await page.getByRole("link", { name: "Soundscapes", exact: true }).first().click();
  await expect(page.getByRole("heading", { name: "Under the canopy." })).toBeVisible();
  await expect(page.getByRole("slider", { name: "Soundscape volume" })).toHaveValue("32");
  await expect(page.getByRole("button", { name: "Sound on ↗" })).toBeVisible();
});
