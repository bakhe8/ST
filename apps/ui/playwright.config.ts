import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 120000,
  fullyParallel: false,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"], ["html", { open: "never" }]],
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "off",
  },
  webServer: [
    {
      command: "npm --workspace @vtdr/api run dev",
      url: "http://127.0.0.1:3001/api/health",
      reuseExistingServer: true,
      timeout: 180000,
      stdout: "pipe",
      stderr: "pipe",
    },
    {
      command:
        "npm --workspace vtdr-ui run dev -- --host 127.0.0.1 --port 3000",
      url: "http://127.0.0.1:3000",
      reuseExistingServer: true,
      timeout: 180000,
      stdout: "pipe",
      stderr: "pipe",
    },
  ],
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
