// Summarize existing local Lighthouse reports; does not generate or alter measurements.
import { readFile, writeFile } from 'node:fs/promises';
const beforeDir = process.argv[2] ?? '/tmp/vf-perf-before';
const afterDir = process.argv[3] ?? '/tmp/vf-perf-after';
const output = process.argv[4] ?? 'docs/review/performance/lighthouse-comparison.json';
const phases = {};
for (const [phase, directory] of [['before', beforeDir], ['after', afterDir]]) {
  phases[phase] = [];
  for (const route of ['home', 'species', 'data', 'soundscapes']) {
    const report = JSON.parse(await readFile(`${directory}/${route}.json`, 'utf8'));
    phases[phase].push({ route:route === 'home' ? '/' : `/${route}`, lighthouseVersion:report.lighthouseVersion, fetchTime:report.fetchTime,
      settings:report.configSettings, benchmarkIndex:report.environment.benchmarkIndex, performance:report.categories.performance.score*100,
      accessibility:report.categories.accessibility.score*100, bestPractices:report.categories['best-practices'].score*100,
      lcpMs:report.audits['largest-contentful-paint'].numericValue, cls:report.audits['cumulative-layout-shift'].numericValue,
      tbtMs:report.audits['total-blocking-time'].numericValue,
      mainThread:report.audits['mainthread-work-breakdown'].details?.items,
      scriptExecution:report.audits['bootup-time'].details?.items,
      unusedJs:report.audits['unused-javascript'].details?.items,
      consoleErrors:report.audits['errors-in-console'].details?.items,
      rawReport:`${directory}/${route}.json` });
  }
}
await writeFile(output,JSON.stringify({ date:'2026-10-10', ...phases },null,2)+'\n');
console.log(JSON.stringify(phases,null,2));
