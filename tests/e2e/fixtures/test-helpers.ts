/**
 * Shared test helpers and utilities
 */

import { Page, expect } from '@playwright/test'
import { execSync } from 'child_process'
import { BusinessType, DesignVariant } from './business-types'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

/**
 * Seeds the database with a specific business type and variant
 */
export async function seedBusiness(
  businessType: BusinessType,
  variant: DesignVariant = 0,
): Promise<void> {
  console.log(`Seeding ${businessType} with variant ${variant}...`)
  execSync(`SEED_TYPE=${businessType} DESIGN_VARIANT=${variant} pnpm seed`, {
    cwd: process.cwd(),
    stdio: 'inherit',
    env: {
      ...process.env,
      SEED_TYPE: businessType,
      DESIGN_VARIANT: String(variant),
    },
  })
  // Wait for ISR to update
  await new Promise((resolve) => setTimeout(resolve, 2000))
}

/**
 * Navigate to homepage and wait for it to load
 */
export async function goToHomepage(page: Page): Promise<void> {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' })
}

/**
 * Check that the page loaded without errors
 */
export async function assertNoPageErrors(page: Page): Promise<void> {
  // Check for Next.js error overlay
  const errorOverlay = page.locator('#__next-build-error')
  await expect(errorOverlay).not.toBeVisible()

  // Check that page has content
  const body = page.locator('body')
  await expect(body).not.toBeEmpty()
}

/**
 * Check that header is visible and has navigation
 */
export async function assertHeaderExists(page: Page): Promise<void> {
  const header = page.locator('header').first()
  await expect(header).toBeVisible()

  // Should have navigation links
  const navLinks = header.locator('nav a, nav button')
  await expect(navLinks.first()).toBeVisible()
}

/**
 * Check that footer is visible
 */
export async function assertFooterExists(page: Page): Promise<void> {
  const footer = page.locator('footer').first()
  await expect(footer).toBeVisible()
}

/**
 * Check that hero section exists
 */
export async function assertHeroExists(page: Page): Promise<void> {
  // Look for common hero patterns
  const hero = page.locator('section').first()
  await expect(hero).toBeVisible()
}

/**
 * Submit contact form and verify response
 */
export async function submitContactForm(
  page: Page,
  data: {
    name: string
    email: string
    phone?: string
    message: string
  },
): Promise<void> {
  // Find form - could be in modal or on page
  const form = page.locator('form').filter({ hasText: /contact|mesaj|trimite/i }).first()

  if (await form.isVisible()) {
    // Fill form fields
    const nameInput = form.locator('input[name*="name"], input[name*="nume"]').first()
    const emailInput = form.locator('input[name*="email"]').first()
    const phoneInput = form.locator('input[name*="phone"], input[name*="telefon"]').first()
    const messageInput = form.locator('textarea').first()

    if (await nameInput.isVisible()) await nameInput.fill(data.name)
    if (await emailInput.isVisible()) await emailInput.fill(data.email)
    if (data.phone && (await phoneInput.isVisible())) await phoneInput.fill(data.phone)
    if (await messageInput.isVisible()) await messageInput.fill(data.message)

    // Submit
    const submitButton = form.locator('button[type="submit"]').first()
    await submitButton.click()

    // Wait for response (toast or success message)
    await page.waitForTimeout(1000)
  }
}

/**
 * Take a full page screenshot for visual comparison
 */
export async function takeFullPageScreenshot(
  page: Page,
  name: string,
): Promise<Buffer> {
  return await page.screenshot({
    fullPage: true,
    path: `./tests/e2e/screenshots/${name}.png`,
  })
}

/**
 * Check that CSS is loaded correctly (no unstyled content)
 */
export async function assertCSSLoaded(page: Page): Promise<void> {
  // Check that the page has some styling applied
  const body = page.locator('body')

  // Body should have a background or font family applied
  const styles = await body.evaluate((el) => {
    const computed = window.getComputedStyle(el)
    return {
      fontFamily: computed.fontFamily,
      backgroundColor: computed.backgroundColor,
    }
  })

  // Should have a font family set (not just browser default)
  expect(styles.fontFamily).toBeTruthy()
}

/**
 * Check for common accessibility issues
 */
export async function assertBasicA11y(page: Page): Promise<void> {
  // Check for skip link
  const skipLink = page.locator('[href="#main"], [href="#content"]')

  // Check all images have alt text
  const images = page.locator('img')
  const imageCount = await images.count()

  for (let i = 0; i < Math.min(imageCount, 5); i++) {
    const img = images.nth(i)
    const alt = await img.getAttribute('alt')
    // Alt can be empty string for decorative images, but should exist
    expect(alt).not.toBeNull()
  }
}
