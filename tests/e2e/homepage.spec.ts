/**
 * Homepage tests for all business types
 * Tests that each business type renders correctly
 */

import { test, expect } from '@playwright/test'
import { BUSINESS_CONFIGS, BusinessConfig } from './fixtures/business-types'
import {
  seedBusiness,
  goToHomepage,
  assertNoPageErrors,
  assertHeaderExists,
  assertFooterExists,
  assertHeroExists,
  assertCSSLoaded,
} from './fixtures/test-helpers'

test.describe('Homepage - All Business Types', () => {
  // Run tests sequentially since we're changing the database
  test.describe.configure({ mode: 'serial' })

  for (const config of BUSINESS_CONFIGS) {
    test.describe(`${config.name} (${config.type})`, () => {
      test.beforeAll(async () => {
        await seedBusiness(config.type, 0)
      })

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
        await assertHeroExists(page)
      })

      test('should have footer', async ({ page }) => {
        await goToHomepage(page)
        await assertFooterExists(page)
      })

      test('should display brand name or business content', async ({ page }) => {
        await goToHomepage(page)

        // Check page has relevant content
        const pageText = await page.textContent('body')
        expect(pageText).toBeTruthy()
        expect(pageText!.length).toBeGreaterThan(100)
      })

      // Products test only for magazin
      if (config.hasProducts) {
        test('should display products section', async ({ page }) => {
          await goToHomepage(page)

          // Look for products grid or list
          const productsSection = page.locator('section').filter({
            hasText: /produse|popular|catalog/i,
          })
          await expect(productsSection.first()).toBeVisible()
        })
      }

      // Portfolio test only for constructii
      if (config.hasPortfolio) {
        test('should display portfolio section', async ({ page }) => {
          await goToHomepage(page)

          // Look for portfolio/projects section
          const portfolioSection = page.locator('section').filter({
            hasText: /portofoliu|proiecte/i,
          })
          await expect(portfolioSection.first()).toBeVisible()
        })
      }
    })
  }
})
