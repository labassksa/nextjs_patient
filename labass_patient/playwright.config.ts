import { defineConfig } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config({ path: ".env.demo", override: false, quiet: true });

export default defineConfig({
  testDir: "./tests",
  outputDir: "test-results/playwright",
  timeout: 120_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["line"]],
  use: {
    baseURL: process.env.DEMO_BASE_URL ?? "https://app.test.labass.sa",
    viewport: { width: 432, height: 768 },
    isMobile: true,
    headless: true,
    locale: "en-SA",
    timezoneId: "Asia/Riyadh",
    colorScheme: "light",
    actionTimeout: 10_000,
    navigationTimeout: 20_000,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
});
