import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  // Global setup:
  globalSetup: "./setup/auth.setup.ts",
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [["html", { open: "never" }], ["list"]],
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    baseURL: process.env.BASE_URL,
    storageState: `.auth/user.json`,
  },
  projects: [
    {
      name: "chromium-desktop",
      use: { ...devices["Desktop Chrome"] },
    },
    // Chromium engine, Pixel 9 viewport/UA
    {
      name: "chromium-pixel9",
      use: {
        ...devices["Pixel 9"],
      },
    },
    // WebKit engine, iPhone 16 viewport/UA
    {
      name: "webkit-iphone16",
      use: {
        ...devices["iPhone 16"],
      },
    },
  ],
});
