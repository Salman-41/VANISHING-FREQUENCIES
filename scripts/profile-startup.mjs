// Reproducible local cold-load profile; no application instrumentation or external requests.
import { chromium } from '@playwright/test';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
const base = process.argv[2] ?? 'http://127.0.0.1:3002';
const output = process.argv[3] ?? '/tmp/vf-startup.json';
if (!['localhost', '127.0.0.1'].includes(new URL(base).hostname)) throw new Error('Local URL required');
if (!output.endsWith('.json')) throw new Error('Output must be a JSON report path');
await mkdir(dirname(output), { recursive: true });
const browser = await chromium.launch();
const observations = [];
try {
  for (const route of ['/', '/species', '/data', '/soundscapes']) {
    const context = await browser.newContext({ viewport: { width: 375, height: 812 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const cdp = await context.newCDPSession(page);
    await cdp.send('Network.enable');
    await cdp.send('Network.setCacheDisabled', { cacheDisabled: true });
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 93750 });
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await cdp.send('Profiler.enable');
    await cdp.send('Profiler.startPreciseCoverage', { callCount: true, detailed: true });
    await cdp.send('Profiler.start');
    await page.addInitScript(() => {
      window.vfStartup = { lcp: null, cls: 0, longTasks: [] };
      new PerformanceObserver(list => { for (const e of list.getEntries()) window.vfStartup.lcp = e.startTime; }).observe({ type: 'largest-contentful-paint', buffered: true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) if (!e.hadRecentInput) window.vfStartup.cls += e.value; }).observe({ type: 'layout-shift', buffered: true });
      new PerformanceObserver(list => { for (const e of list.getEntries()) window.vfStartup.longTasks.push({ startMs: e.startTime, durationMs: e.duration }); }).observe({ type: 'longtask', buffered: true });
    });
    await page.goto(base + route);
    await page.evaluate(() => document.fonts.ready);
    if (route === '/') await page.waitForFunction(() => document.querySelector('.documentary')?.dataset.scrollController === 'native');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1500);
    const observation = await page.evaluate(route => {
      const js = performance.getEntriesByType('resource').filter(e => new URL(e.name).pathname.endsWith('.js'));
      return { route, ...window.vfStartup, javascriptEncodedBytes: js.reduce((n,e) => n + e.encodedBodySize,0), scripts: js.map(e => ({url:new URL(e.name).pathname,encodedBytes:e.encodedBodySize,decodedBytes:e.decodedBodySize})), canvases:document.querySelectorAll('canvas').length, audioRequested:performance.getEntriesByType('resource').some(e=>e.name.includes('/audio/')) };
    }, route);
    const { profile } = await cdp.send('Profiler.stop');
    const nodes = new Map(profile.nodes.map(n => [n.id,n.callFrame]));
    const byScript = new Map();
    for (let i=0;i<(profile.samples?.length ?? 0);i++) {
      const f = nodes.get(profile.samples[i]); if (!f?.url.startsWith(base)) continue;
      const key = new URL(f.url).pathname;
      byScript.set(key,(byScript.get(key) ?? 0)+(profile.timeDeltas?.[i] ?? 0)/1000);
    }
    observation.sampledSelfTimeMs = [...byScript].sort((a,b)=>b[1]-a[1]).map(([url,ms])=>({url,ms}));
    const coverage = await cdp.send('Profiler.takePreciseCoverage');
    observation.coverage = coverage.result.filter(s=>s.url.startsWith(base)&&s.url.includes('.js')).map(s=>({url:new URL(s.url).pathname,functions:s.functions.length,unusedFunctions:s.functions.filter(f=>f.ranges.every(r=>r.count===0)).length}));
    observation.errors = errors;
    await writeFile(output.replace(/\.json$/, `-${route === '/' ? 'home' : route.slice(1)}.cpuprofile`), JSON.stringify(profile));
    observations.push(observation);
    await context.close();
  }
  const report = { date: new Date().toISOString(), buildId:(await readFile('.next/BUILD_ID','utf8')).trim(), browser:browser.version(), profile:{viewport:'375×812',dpr:2,cpuSlowdown:4,downloadBytesPerSecond:200000,uploadBytesPerSecond:93750,latencyMs:150,cache:'disabled, fresh context per route',wait:'fonts, native homepage controller, network idle, 1500 ms',instrumentation:'V8 sampling + precise coverage enabled in both phases; timings are diagnostic, not Lighthouse or field INP'},observations };
  await writeFile(output,JSON.stringify(report,null,2)+'\n');
  console.log(JSON.stringify(observations.map(o=>({route:o.route,javascriptEncodedBytes:o.javascriptEncodedBytes,longestTaskMs:Math.max(0,...o.longTasks.map(t=>t.durationMs)),errors:o.errors})),null,2));
} finally { await browser.close(); }
