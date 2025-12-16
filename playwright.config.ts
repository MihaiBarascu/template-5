import { defineConfig, devices } from '@playwright/test'

import 'dotenv/config'

// Use port 3100 to avoid conflicts with other services (e.g., Dokploy on 3000, dev servers on 3005)
const TEST_PORT = process.env.TEST_PORT || '3100'
const BASE_URL = process.env.BASE_URL || `http://localhost:${TEST_PORT}`

export default defineConfig({
  testDir: './tests/e2e',
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Use 1 worker to avoid parallel seed conflicts (tests modify shared database)
  workers: 1,
  reporter: 'html',
  timeout: 90000, // 90 seconds per test (increased for seeding)
  expect: {
    timeout: 15000, // 15 seconds for assertions
  },
  use: {
    trace: 'on-first-retry',
    baseURL: BASE_URL,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  // Server must be started manually: pnpm start (port 3100)
  // webServer disabled - we control when to start/stop
})
