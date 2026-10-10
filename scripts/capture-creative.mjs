// Local visual review evidence; generated environments are interpretive, not mapped data.
import { chromium } from '@playwright/test';
import { mkdir, writeFile } from 'node:fs/promises';

const base = process.argv[2] ?? 'http://127.0.0.1:3002';
const phase = process.argv[3] ?? 'before';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname) || !['before', 'after'].includes(phase)) throw new Error('Use a local URL and before/after phase');
const directory = `docs/review/creative/${phase}`;
await mkdir(directory, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const observations = [];
try {
  for (const mobile of [false, true]) {
    const profile = mobile ? 'mobile' : 'desktop';
    const context = await browser.newContext({ viewport: mobile ? { width: 375, height: 812 } : { width: 1440, height: 1000 }, deviceScaleFactor: 1, isMobile: mobile, hasTouch: mobile });
    await context.addInitScript(() => Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 }));
    const page = await context.newPage();
    const cdp = await context.newCDPSession(page);
    await cdp.send('Emulation.setHardwareConcurrencyOverride', { hardwareConcurrency: 8 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const shot = name => page.screenshot({ path: `${directory}/${profile}-${name}.jpg`, type: 'jpeg', quality: 85 });
    const settle = async () => { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(700); };
    const at = async selector => {
      await page.locator(selector).evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - 32));
      await settle();
    };
    for (const route of ['species', 'soundscapes']) {
      await page.goto(`${base}/${route}`); await settle(); await shot(`${route}-opening`);
      observations.push({ profile, route, layout: await page.evaluate(() => {
        const top = selector => { const el = document.querySelector(selector); return el ? Math.round(el.getBoundingClientRect().top + scrollY) : null; };
        return { title: top('h1'), firstPortrait: top('.explorer-card .species-photo-frame'), filters: top('.species-filters'), habitatSelector: top('[aria-label="Choose a habitat"]'), transport: top('button[aria-label="Sound on ↗"]'), height: document.documentElement.scrollHeight };
      }) });
    }
    await page.goto(base); await settle();
    await page.waitForFunction(() => document.querySelector('.documentary')?.dataset.scrollController);
    await shot('opening');
    const layout = await page.evaluate(() => ({ height: document.documentElement.scrollHeight, chapters: [...document.querySelectorAll('[data-chapter]')].map(el => ({ id: el.id, top: Math.round(el.getBoundingClientRect().top + scrollY), height: Math.round(el.getBoundingClientRect().height) })) }));
    for (const [name, selector] of [['mountain-photo', '#snow-leopard'], ['ocean-photo', '#blue-whale'], ['trends', '#trends']]) { await at(selector); await shot(name); }
    // Capture the interval around a chapter join, including the outgoing scientific caveat.
    await page.locator('#blue-whale').evaluate(el => window.scrollTo(0, el.getBoundingClientRect().top + scrollY - innerHeight * .45));
    await settle(); await shot('chapter-join');
    const controls = page.locator('[data-scene-control="mountain"]');
    const frame = page.locator('.mountain-landscape .media-aperture');
    await controls.getByRole('button', { name: 'Explore in 3D' }).click();
    await page.waitForFunction(() => document.querySelector('[data-scene-control="mountain"] .immersive-status')?.textContent.includes('3D study ready'));
    const scenes = [];
    for (const quality of mobile ? ['light'] : ['balanced', 'light']) {
      await controls.getByRole('combobox').selectOption(quality);
      await page.waitForFunction(() => document.querySelector('[data-scene-control="mountain"] .immersive-status')?.textContent.includes('3D study ready'));
      await at('.mountain-landscape .media-aperture');
      await frame.screenshot({ path: `${directory}/${profile}-${quality}-mountain.jpg`, type: 'jpeg', quality: 90 });
      const terrain = await frame.evaluate(el => ({ ...el.dataset }));
      // DOM click avoids moving the camera while capturing the fixed aperture.
      await controls.getByRole('button', { name: 'Follow the water' }).evaluate(el => el.click());
      await page.waitForTimeout(280);
      await frame.screenshot({ path: `${directory}/${profile}-${quality}-transition.jpg`, type: 'jpeg', quality: 90 });
      await page.waitForFunction(() => document.querySelector('.mountain-landscape .media-aperture')?.dataset.sceneMix === '1.000');
      await frame.screenshot({ path: `${directory}/${profile}-${quality}-ocean.jpg`, type: 'jpeg', quality: 90 });
      const cadence = await page.evaluate(async () => {
        const frame = document.querySelector('.mountain-landscape .media-aperture');
        const intervals = []; let previous = 0;
        document.querySelector('[data-scene-control="mountain"] button:last-child').click();
        await new Promise(resolve => { const start = performance.now(); function sample(time) { if (previous) intervals.push(time - previous); previous = time; if (time - start < 1800) requestAnimationFrame(sample); else resolve(); } requestAnimationFrame(sample); });
        const sorted = intervals.toSorted((a,b) => a-b);
        return { medianMs: sorted[Math.floor(sorted.length / 2)], p95Ms: sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * .95))], frames: intervals.length, counters: { ...frame.dataset } };
      });
      await page.waitForTimeout(500);
      const idle = await frame.getAttribute('data-scene-frames');
      await page.waitForTimeout(300);
      scenes.push({ quality, terrain, cadence, idleFrames: Number(await frame.getAttribute('data-scene-frames')) - Number(idle) });
      await controls.getByRole('button', { name: 'Resume scroll scene' }).evaluate(el => el.click());
      await page.waitForTimeout(750);
    }
    await controls.getByRole('button', { name: 'Return to photographs' }).evaluate(el => el.click());
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await at('.mountain-landscape .media-aperture'); await shot('reduced-photo');
    observations.push({ profile, route: 'home', layout, scenes, errors });
    await context.close();
  }
  await writeFile(`${directory}/observations.json`, JSON.stringify({ date: new Date().toISOString(), browser: browser.version(), method: 'Production, SwiftShader, DPR1, 8 emulated cores; 1440x1000 desktop and 375x812 touch. Unthrottled CPU. A 1.8 s pulse measures browser rAF cadence, not isolated GPU cost or hardware FPS.', observations }, null, 2) + '\n');
  console.log(JSON.stringify(observations.map(({profile,route,layout,scenes,errors}) => ({profile,route,layout,scenes:scenes?.map(({quality,terrain,cadence,idleFrames})=>({quality,terrain,cadence,idleFrames})),errors})), null, 2));
} finally { await browser.close(); }
