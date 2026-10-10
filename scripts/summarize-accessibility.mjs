import { readdir, readFile, writeFile } from "node:fs/promises";

const results = "test-results/production";
const report = JSON.parse(await readFile("test-results/responsive-final.json", "utf8"));
const scans = [];
for (const entry of await readdir(results, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  for (const file of await readdir(`${results}/${entry.name}`)) {
    if (!/^axe-.*\.json$/.test(file)) continue;
    const records = JSON.parse(await readFile(`${results}/${entry.name}/${file}`, "utf8"));
    scans.push(...records.map(record => ({
      report: file, view: record.route ?? record.state ?? record.habitat,
      violations: record.violations.map(rule => ({ id: rule.id, nodes: rule.nodes.length })),
      incomplete: record.incomplete.map(rule => ({ id: rule.id, nodes: rule.nodes.map(node => ({
        targets: node.target, html: node.html,
        reasons: [...node.any, ...node.all, ...node.none].map(check => check.message),
      })) })),
    })));
  }
}
if (scans.length !== 41) throw new Error(`Expected 41 current audit scans; found ${scans.length}. Run the full production suite first.`);
if (report.stats.unexpected || report.stats.flaky || report.stats.skipped) throw new Error("Full regression contains failed, flaky or skipped checks");
if (scans.some(scan => scan.violations.length)) throw new Error("Automated audit violations need review");
const summary = { date: new Date().toISOString(), buildId: (await readFile(".next/BUILD_ID", "utf8")).trim(),
  tool: "@axe-core/playwright 4.13.0", tags: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"],
  browserTests: report.stats, scanCount: scans.length, automatedViolations: 0,
  reflow: { views: 18, widths: [320, 375, 430, 768, 1024, 1440, 1920], combinations: 126 },
  textSpacing: { views: 18, profiles: ["320px with text spacing", "320px with text spacing and 200% root text size", "768px with text spacing and 200% root text size"], combinations: 54 },
  qualification: "Automated results and Chromium interaction/reading checks do not certify WCAG conformance or physical assistive-technology compatibility. Incomplete results remain explicit; manual dispositions and device limits are in docs/development/responsive-accessibility.md.", scans };
await writeFile("docs/development/review/accessibility-summary.json", JSON.stringify(summary, null, 2) + "\n");
console.log(JSON.stringify({ browserTests: report.stats, scans: scans.length, automatedViolations: 0,
  incompleteRuleIds: [...new Set(scans.flatMap(scan => scan.incomplete.map(rule => rule.id)))] }, null, 2));
