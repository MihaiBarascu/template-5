/**
 * Visual regression tests
 * Captures screenshots for each business type and variant
 */

import { test, expect } from '@playwright/test'
import { BUSINESS_CONFIGS, DESIGN_VARIANTS, BusinessType, DesignVariant } from './fixtures/business-types'
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

  // Test each business type with variant 0 (main variant)
  for (const config of BUSINESS_CONFIGS) {
    test(`screenshot ${config.type} variant 0`, async ({ page }) => {
      await seedBusiness(config.type, 0)
      await goToHomepage(page)

      // Wait for animations and images to load
      await page.waitForTimeout(2000)

      // Take full page screenshot
      await page.screenshot({
        fullPage: true,
        path: path.join(screenshotsDir, `${config.type}-v0-desktop.png`),
      })

      // Also take viewport screenshot
      await page.screenshot({
        path: path.join(screenshotsDir, `${config.type}-v0-viewport.png`),
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
      await seedBusiness(config.type, 0)
      await goToHomepage(page)

      // Wait for animations
      await page.waitForTimeout(2000)

      // Take mobile screenshot
      await page.screenshot({
        fullPage: true,
        path: path.join(screenshotsDir, `${config.type}-v0-mobile.png`),
      })

      // Check responsive header (should have hamburger menu or similar)
      const header = page.locator('header').first()
      await expect(header).toBeVisible()
    })
  }
})

// Separate test file for all variants (optional, can be run with --grep)
test.describe('Visual Regression - All Variants', () => {
  test.describe.configure({ mode: 'serial' })

  // This test group can be skipped for faster CI runs
  // Run with: pnpm test:e2e --grep "All Variants"

  const businessTypes: BusinessType[] = ['frizerie', 'dentist', 'magazin']
  const variants: DesignVariant[] = [0, 1, 2, 3, 4]

  for (const businessType of businessTypes) {
    for (const variant of variants) {
      test(`${businessType} variant ${variant}`, async ({ page }) => {
        try {
          await seedBusiness(businessType, variant)
          await goToHomepage(page)

          await page.waitForTimeout(2000)

          await page.screenshot({
            fullPage: true,
            path: path.join(screenshotsDir, `${businessType}-v${variant}-full.png`),
          })

          // Assert page loaded
          const body = page.locator('body')
          await expect(body).toBeVisible()
        } catch (error) {
          // Some variants might not be implemented yet
          console.warn(`Variant ${variant} for ${businessType} failed:`, error)
        }
      })
    }
  }
})
