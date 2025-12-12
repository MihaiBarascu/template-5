/**
 * Homepage Tests
 *
 * Tests homepage functionality on the current site.
 * Does NOT run seed - tests whatever is currently in the database.
 *
 * Usage:
 *   1. First seed the database: pnpm seed:frizerie (or any business type)
 *   2. Then run tests: pnpm test:e2e tests/e2e/homepage.spec.ts
 *
 * For testing ALL business types with automatic seeding, use:
 *   pnpm test:e2e tests/e2e/all-businesses.spec.ts
 */

import { test, expect } from '@playwright/test'
import {
  goToHomepage,
  assertNoPageErrors,
  assertHeaderExists,
  assertFooterExists,
  assertCSSLoaded,
} from './fixtures/test-helpers'

test.describe('Homepage', () => {
  // No seed - tests current database state

  test('should load homepage without errors', async ({ page }) => {
    await goToHomepage(page)
    await assertNoPageErrors(page)
  })

  test('should have CSS loaded correctly', async ({ page }) => {
    await goToHomepage(page)
    await assertCSSLoaded(page)
  })

  test('should have header with navigation', async ({ page }) => {
    await goToHomepage(page)
    await assertHeaderExists(page)
  })

  test('should have hero section', async ({ page }) => {
    await goToHomepage(page)

    // Look for hero - could be section, div with hero class, or first major section
    const heroSelectors = [
      'section:first-of-type',
      '[class*="hero"]',
      '[class*="Hero"]',
      'main > section:first-child',
      'main > div:first-child',
    ]

    let heroFound = false
    for (const selector of heroSelectors) {
      const hero = page.locator(selector).first()
      if (await hero.isVisible().catch(() => false)) {
        heroFound = true
        break
      }
    }

    expect(heroFound).toBeTruthy()
  })

  test('should have footer', async ({ page }) => {
    await goToHomepage(page)
    await assertFooterExists(page)
  })

  test('should display meaningful content', async ({ page }) => {
    await goToHomepage(page)

    const pageText = await page.textContent('body')
    expect(pageText).toBeTruthy()
    expect(pageText!.length).toBeGreaterThan(100)
  })

  test('should have navigation links', async ({ page }) => {
    await goToHomepage(page)

    const navLinks = page.locator('header a[href^="/"], nav a[href^="/"]')
    const count = await navLinks.count()

    expect(count).toBeGreaterThan(0)
    console.log(`  ✅ Found ${count} navigation links`)
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await goToHomepage(page)

    // Header should still be visible
    await assertHeaderExists(page)

    // No horizontal scroll
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const clientWidth = await page.evaluate(() => document.body.clientWidth)
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10)
  })
})
