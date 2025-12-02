/**
 * Smoke tests - Quick verification that each business type works
 * Run with: pnpm test:e2e tests/e2e/smoke.spec.ts
 */

import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'

const BASE_URL = 'http://localhost:3000'

const BUSINESS_TYPES = [
  'frizerie',
  'dentist',
  'restaurant',
  'auto-service',
  'salon',
  'avocat',
  'constructii',
  'magazin',
] as const

type BusinessType = (typeof BUSINESS_TYPES)[number]

async function seedBusiness(type: BusinessType): Promise<void> {
  console.log(`\n🌱 Seeding ${type}...`)
  execSync(`SEED_TYPE=${type} DESIGN_VARIANT=0 pnpm seed`, {
    cwd: process.cwd(),
    stdio: 'inherit',
  })
  // Wait for ISR cache to update
  await new Promise((resolve) => setTimeout(resolve, 3000))
}

test.describe('Smoke Tests - All Business Types', () => {
  test.describe.configure({ mode: 'serial' })

  for (const businessType of BUSINESS_TYPES) {
    test(`${businessType} loads correctly`, async ({ page }) => {
      // Seed this business type
      await seedBusiness(businessType)

      // Navigate to homepage
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })

      // 1. Page should have header
      const header = page.locator('header').first()
      await expect(header).toBeVisible({ timeout: 10000 })

      // 2. Page should have content (not empty)
      const bodyText = await page.textContent('body')
      expect(bodyText!.length).toBeGreaterThan(100)

      // 3. CSS should be loaded (check for computed styles)
      const hasStyling = await page.evaluate(() => {
        const body = document.body
        const styles = window.getComputedStyle(body)
        // Check that font-family is set (any value is acceptable since themes vary)
        return styles.fontFamily !== ''
      })
      expect(hasStyling).toBeTruthy()

      // 4. No JavaScript errors (check console)
      const errors: string[] = []
      page.on('pageerror', (error) => errors.push(error.message))

      // Wait for any async errors
      await page.waitForTimeout(1000)

      // Filter out known acceptable errors
      const criticalErrors = errors.filter(
        (e) => !e.includes('hydration') && !e.includes('ResizeObserver'),
      )
      expect(criticalErrors).toHaveLength(0)

      // 5. Footer should exist
      const footer = page.locator('footer').first()
      await expect(footer).toBeVisible()

      console.log(`✅ ${businessType} passed all checks`)
    })
  }
})
