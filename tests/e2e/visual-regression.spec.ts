/**
 * Visual Regression Tests
 *
 * Captures screenshots for each business type.
 * DOES run seed - this file tests ALL business types.
 *
 * Usage:
 *   pnpm test:e2e tests/e2e/visual-regression.spec.ts
 *
 * NOTE: This test suite runs seed for each business type to capture
 * screenshots. It will take significant time.
 *
 * DESIGN_VARIANT system has been removed.
 * Configuration is now defined directly in src/seed/seeder-config.ts
 */

import { test, expect } from '@playwright/test'
import { BUSINESS_CONFIGS, BusinessType } from './fixtures/business-types'
import { seedBusiness, goToHomepage } from './fixtures/test-helpers'
import * as fs from 'fs'
import * as path from 'path'

// Ensure screenshots directory exists
const screenshotsDir = path.join(process.cwd(), 'tests/e2e/screenshots')
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true })
}

test.describe('Visual Regression - Screenshots', () => {
  test.describe.configure({ mode: 'serial' })

  // Test each business type
  for (const config of BUSINESS_CONFIGS) {
    test(`screenshot ${config.type}`, async ({ page }) => {
      await seedBusiness(config.type)
      await goToHomepage(page)

      // Wait for animations and images to load
      await page.waitForTimeout(2000)

      // Take full page screenshot
      await page.screenshot({
        fullPage: true,
        path: path.join(screenshotsDir, `${config.type}-desktop.png`),
      })

      // Also take viewport screenshot
      await page.screenshot({
        path: path.join(screenshotsDir, `${config.type}-viewport.png`),
      })

      // Basic visual assertion - page should have content
      const body = page.locator('body')
      await expect(body).toBeVisible()
    })
  }
})

test.describe('Visual Regression - Mobile', () => {
  test.describe.configure({ mode: 'serial' })
  test.use({ viewport: { width: 375, height: 667 } })

  // Test mobile view for each business type
  for (const config of BUSINESS_CONFIGS) {
    test(`mobile screenshot ${config.type}`, async ({ page }) => {
      await seedBusiness(config.type)
      await goToHomepage(page)

      // Wait for animations
      await page.waitForTimeout(2000)

      // Take mobile screenshot
      await page.screenshot({
        fullPage: true,
        path: path.join(screenshotsDir, `${config.type}-mobile.png`),
      })

      // Check responsive header (should have hamburger menu or similar)
      const header = page.locator('header').first()
      await expect(header).toBeVisible()
    })
  }
})
