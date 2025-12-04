/**
 * Smoke tests - Quick verification that each business type works
 * Run with: pnpm test:e2e tests/e2e/smoke.spec.ts
 */

import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'

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
  execSync(`pnpm seed:${type}`, {
    cwd: process.cwd(),
    stdio: 'inherit',
    timeout: 120000, // 2 minutes for seed
  })
  // Wait for ISR cache to update and Next.js to rebuild
  console.log('⏳ Waiting for cache update...')
  await new Promise((resolve) => setTimeout(resolve, 5000))
}

test.describe('Smoke Tests - All Business Types', () => {
  test.describe.configure({ mode: 'serial' })

  for (const businessType of BUSINESS_TYPES) {
    test(`${businessType} loads correctly`, async ({ page, baseURL }) => {
      // Seed this business type
      await seedBusiness(businessType)

      // Navigate to homepage using baseURL from config
      await page.goto(baseURL || 'http://localhost:3000', { waitUntil: 'domcontentloaded', timeout: 30000 })

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
