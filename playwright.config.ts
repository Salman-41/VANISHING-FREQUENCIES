import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/browser", fullyParallel: false, workers: 1,
  timeout: 60_000, reporter: "list",
  use: { baseURL: "http://127.0.0.1:3000", browserName: "chromium", trace: "retain-on-failure" },
  // Reuses only the local development server. No external service or deployment.
  webServer: { command: "npm run dev", url: "http://127.0.0.1:3000", reuseExistingServer: !process.env.CI, timeout: 120_000 },
});
