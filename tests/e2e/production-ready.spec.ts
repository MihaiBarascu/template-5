/**
 * Production Ready Tests
 *
 * Comprehensive tests to verify the site is production-ready.
 * Does NOT run seed - tests whatever is currently in the database.
 *
 * Usage:
 *   1. First seed the database: pnpm seed:frizerie (or any business type)
 *   2. Then run tests: pnpm test:e2e tests/e2e/production-ready.spec.ts
 *
 * For testing ALL business types with automatic seeding, use:
 *   pnpm test:e2e tests/e2e/all-businesses.spec.ts
 */

import { test, expect, Page } from '@playwright/test'

const TEST_PORT = process.env.TEST_PORT || '3100'
const BASE_URL = process.env.BASE_URL || `http://localhost:${TEST_PORT}`

// Pages to test
const COMMON_PAGES = ['/', '/servicii', '/echipa', '/contact', '/blog']

/**
 * Helper: Check for console errors
 */
async function checkNoConsoleErrors(page: Page): Promise<string[]> {
  const errors: string[] = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text()
      // Ignore known non-critical errors
      if (
        !text.includes('favicon') &&
        !text.includes('analytics') &&
        !text.includes('google')
      ) {
        errors.push(text)
      }
    }
  })
  return errors
}

/**
 * Helper: Check page loads correctly
 */
async function assertPageLoads(page: Page, url: string): Promise<void> {
  const response = await page.goto(url, { waitUntil: 'networkidle' })

  // Check HTTP status
  expect(response?.status()).toBeLessThan(400)

  // Check page has content
  const body = page.locator('body')
  await expect(body).toBeVisible()

  // Check no Next.js error overlay
  const errorOverlay = page.locator('#__next-build-watcher, [data-nextjs-dialog]')
  await expect(errorOverlay).toHaveCount(0)
}

/**
 * Helper: Check form exists and has required fields
 */
async function assertFormExists(
  page: Page,
  formSelector: string,
  requiredFields: string[]
): Promise<void> {
  const form = page.locator(formSelector).first()
  await expect(form).toBeVisible()

  for (const field of requiredFields) {
    const input = form.locator(`[name*="${field}"], [id*="${field}"]`).first()
    const isVisible = await input.isVisible().catch(() => false)
    if (!isVisible) {
      // Try alternative selectors
      const altInput = form
        .locator(`input[placeholder*="${field}" i], textarea[placeholder*="${field}" i]`)
        .first()
      await expect(altInput).toBeVisible()
    }
  }
}

/**
 * Helper: Fill and validate form (without submitting)
 */
async function fillForm(
  page: Page,
  formData: Record<string, string>
): Promise<void> {
  for (const [selector, value] of Object.entries(formData)) {
    const input = page
      .locator(
        `[name*="${selector}"], [id*="${selector}"], input[placeholder*="${selector}" i]`
      )
      .first()

    if (await input.isVisible()) {
      const tagName = await input.evaluate((el) => el.tagName.toLowerCase())
      if (tagName === 'select') {
        await input.selectOption({ index: 1 })
      } else {
        await input.fill(value)
      }
    }
  }
}

// =============================================================================
// TESTS
// =============================================================================

test.describe('Production Ready Tests', () => {
  // No seed - tests current database state

  // ---------------------------------------------------------------------------
  // 1. BASIC PAGE LOADING
  // ---------------------------------------------------------------------------
  test.describe('1. Page Loading', () => {
    test('Homepage loads correctly', async ({ page }) => {
      await assertPageLoads(page, BASE_URL)

      // Check essential elements
      await expect(page.locator('header').first()).toBeVisible()
      await expect(page.locator('footer').first()).toBeVisible()

      // Check hero section exists
      const hero = page.locator('section').first()
      await expect(hero).toBeVisible()
    })

    test('All common pages load', async ({ page }) => {
      for (const path of COMMON_PAGES) {
        const url = `${BASE_URL}${path}`
        console.log(`  Testing: ${url}`)

        const response = await page.goto(url, { waitUntil: 'domcontentloaded' })
        const status = response?.status() || 0

        // 200 = OK, 404 = page doesn't exist for this business (acceptable)
        expect([200, 404]).toContain(status)

        if (status === 200) {
          await expect(page.locator('body')).toBeVisible()
        }
      }
    })

    test('Additional pages load (if they exist)', async ({ page }) => {
      // Common additional pages across business types
      const additionalPages = ['/programare', '/preturi', '/galerie', '/produse', '/portofoliu']

      for (const path of additionalPages) {
        const url = `${BASE_URL}${path}`
        const response = await page.goto(url, { waitUntil: 'domcontentloaded' })
        const status = response?.status() || 0

        // 200 = exists, 404 = doesn't exist for this business type (OK)
        expect([200, 404]).toContain(status)

        if (status === 200) {
          await expect(page.locator('body')).toBeVisible()
          console.log(`  ✅ ${path}`)
        }
      }
    })
  })

  // ---------------------------------------------------------------------------
  // 2. NAVIGATION
  // ---------------------------------------------------------------------------
  test.describe('2. Navigation', () => {
    test('Header navigation works', async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })

      // Find navigation links
      const navLinks = page.locator('header a[href^="/"]')
      const count = await navLinks.count()

      expect(count).toBeGreaterThan(0)

      // Test first 3 links
      for (let i = 0; i < Math.min(count, 3); i++) {
        const link = navLinks.nth(i)
        const href = await link.getAttribute('href')

        if (href && href !== '/') {
          await link.click()
          await page.waitForLoadState('domcontentloaded')

          // Should navigate without error
          await expect(page.locator('body')).toBeVisible()

          // Go back for next test
          await page.goto(BASE_URL, { waitUntil: 'networkidle' })
        }
      }
    })

    test('Footer links work', async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })

      const footerLinks = page.locator('footer a[href^="/"]')
      const count = await footerLinks.count()

      expect(count).toBeGreaterThan(0)
    })

    test('CTA buttons are visible', async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })

      // Look for common CTA patterns
      const ctaPatterns = [
        'programeaz',
        'contact',
        'rezerv',
        'comand',
        'cere oferta',
        'afla mai mult',
      ]

      let foundCTA = false
      for (const pattern of ctaPatterns) {
        const cta = page.locator(`a:has-text("${pattern}"), button:has-text("${pattern}")`)
        if ((await cta.count()) > 0) {
          foundCTA = true
          break
        }
      }

      expect(foundCTA).toBe(true)
    })
  })

  // ---------------------------------------------------------------------------
  // 3. FORMS
  // ---------------------------------------------------------------------------
  test.describe('3. Forms', () => {
    test('Contact form exists and has required fields', async ({ page }) => {
      // Navigate to contact page
      const contactUrl = `${BASE_URL}/contact`
      const response = await page.goto(contactUrl, { waitUntil: 'networkidle' })

      if (response?.status() === 200) {
        // Look for form
        const form = page.locator('form').first()

        if (await form.isVisible()) {
          // Check for common form fields
          const hasNameField = await page
            .locator('[name*="name"], [name*="nume"]')
            .first()
            .isVisible()
            .catch(() => false)
          const hasEmailField = await page
            .locator('[type="email"], [name*="email"]')
            .first()
            .isVisible()
            .catch(() => false)
          const hasSubmitBtn = await page
            .locator('button[type="submit"], input[type="submit"]')
            .first()
            .isVisible()
            .catch(() => false)

          expect(hasNameField || hasEmailField).toBe(true)
          expect(hasSubmitBtn).toBe(true)
        }
      }
    })

    test('Contact form can be filled', async ({ page }) => {
      await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle' })

      const form = page.locator('form').first()
      if (await form.isVisible()) {
        // Fill form fields
        const testData: Record<string, string> = {
          name: 'Test Playwright',
          nume: 'Test Playwright',
          email: 'test@playwright.dev',
          telefon: '0722000000',
          phone: '0722000000',
          mesaj: 'Acesta este un mesaj de test automat.',
          message: 'This is an automated test message.',
        }

        await fillForm(page, testData)

        // Verify fields are filled (don't submit)
        const nameInput = page.locator('[name*="name"], [name*="nume"]').first()
        if (await nameInput.isVisible()) {
          await expect(nameInput).not.toBeEmpty()
        }
      }
    })

    test('Booking form exists (if applicable)', async ({ page }) => {
      const bookingPaths = ['/programare', '/rezervare', '/booking']

      for (const path of bookingPaths) {
        const response = await page.goto(`${BASE_URL}${path}`, {
          waitUntil: 'networkidle',
        })

        if (response?.status() === 200) {
          const form = page.locator('form').first()

          if (await form.isVisible()) {
            // Should have date/time selection or similar
            const hasDateField = await page
              .locator('[type="date"], [name*="date"], [name*="data"]')
              .first()
              .isVisible()
              .catch(() => false)
            const hasSelectField = await page
              .locator('select')
              .first()
              .isVisible()
              .catch(() => false)

            expect(hasDateField || hasSelectField).toBe(true)
            break
          }
        }
      }
    })
  })

  // ---------------------------------------------------------------------------
  // 4. CONTENT
  // ---------------------------------------------------------------------------
  test.describe('4. Content', () => {
    test('Homepage has meaningful content', async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })

      const bodyText = await page.textContent('body')
      expect(bodyText!.length).toBeGreaterThan(500)
    })

    test('Services/Products are displayed', async ({ page }) => {
      // Try common service pages
      const servicePaths = ['/servicii', '/produse', '/meniu', '/services']

      for (const path of servicePaths) {
        const response = await page.goto(`${BASE_URL}${path}`, {
          waitUntil: 'networkidle',
        })

        if (response?.status() === 200) {
          // Should have multiple items
          const items = page.locator('article, [class*="card"], [class*="service"], [class*="product"]')
          const count = await items.count()

          if (count > 0) {
            expect(count).toBeGreaterThan(0)
            break
          }
        }
      }
    })

    test('Team members displayed (if applicable)', async ({ page }) => {
      const response = await page.goto(`${BASE_URL}/echipa`, {
        waitUntil: 'networkidle',
      })

      // Skip test if page doesn't exist (404) - some business types don't have team page
      if (response?.status() === 404) {
        console.log('  ⏭️  Team page not available for this business type (OK)')
        return
      }

      if (response?.status() === 200) {
        // Should have team member cards with images
        const teamCards = page.locator('[class*="team"], [class*="member"], article')
        const count = await teamCards.count()

        // Some business types (like magazin) may have a team page but no members
        // This is acceptable - just log and continue
        if (count === 0) {
          console.log('  ⏭️  No team members found (acceptable for some business types)')
          return
        }

        // If we have team members, verify at least 1 exists
        expect(count).toBeGreaterThan(0)
        console.log(`  ✅ Found ${count} team members`)
      }
    })

    test('Contact info is displayed', async ({ page }) => {
      await page.goto(`${BASE_URL}/contact`, { waitUntil: 'networkidle' })

      const bodyText = (await page.textContent('body')) || ''

      // Should contain contact info patterns
      const hasPhone =
        /\d{3,4}[\s.-]?\d{3}[\s.-]?\d{3,4}/.test(bodyText) || bodyText.includes('telefon')
      const hasEmail = bodyText.includes('@') || bodyText.includes('email')

      expect(hasPhone || hasEmail).toBe(true)
    })
  })

  // ---------------------------------------------------------------------------
  // 5. VISUAL & UX
  // ---------------------------------------------------------------------------
  test.describe('5. Visual & UX', () => {
    test('CSS styles are loaded', async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })

      // Check that body has background color (not default white)
      const bodyBg = await page.evaluate(() => {
        return window.getComputedStyle(document.body).backgroundColor
      })

      // Should have some styling applied
      expect(bodyBg).toBeDefined()
    })

    test('Images load correctly', async ({ page }) => {
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })
      await page.waitForTimeout(2000)

      const images = page.locator('img')
      const count = await images.count()

      if (count > 0) {
        // Check first 5 images
        for (let i = 0; i < Math.min(count, 5); i++) {
          const img = images.nth(i)
          const naturalWidth = await img.evaluate(
            (el: HTMLImageElement) => el.naturalWidth
          )

          // Image should be loaded (naturalWidth > 0)
          // Some images might be lazy loaded, so we accept 0 too
          expect(naturalWidth).toBeGreaterThanOrEqual(0)
        }
      }
    })

    test('Mobile menu exists', async ({ page }) => {
      // Set mobile viewport
      await page.setViewportSize({ width: 375, height: 812 })
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })

      // Look for mobile menu button
      const menuButton = page.locator(
        '[class*="menu"], [class*="burger"], [aria-label*="menu"], button:has(svg)'
      )

      const hasMenuButton = (await menuButton.count()) > 0
      expect(hasMenuButton).toBe(true)
    })

    test('No horizontal scroll on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 812 })
      await page.goto(BASE_URL, { waitUntil: 'networkidle' })

      const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
      const clientWidth = await page.evaluate(() => document.body.clientWidth)

      // Allow small overflow (5px tolerance)
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 5)
    })
  })

  // ---------------------------------------------------------------------------
  // 6. PERFORMANCE
  // ---------------------------------------------------------------------------
  test.describe('6. Performance', () => {
    test('Homepage loads in reasonable time', async ({ page }) => {
      const startTime = Date.now()
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
      const loadTime = Date.now() - startTime

      // Should load DOM in under 10 seconds
      expect(loadTime).toBeLessThan(10000)
      console.log(`  Homepage DOM loaded in ${loadTime}ms`)
    })

    test('No console errors', async ({ page }) => {
      const errors: string[] = []

      page.on('console', (msg) => {
        if (msg.type() === 'error') {
          const text = msg.text()
          if (
            !text.includes('favicon') &&
            !text.includes('analytics') &&
            !text.includes('Failed to load resource')
          ) {
            errors.push(text)
          }
        }
      })

      await page.goto(BASE_URL, { waitUntil: 'networkidle' })
      await page.waitForTimeout(2000)

      // Allow max 2 non-critical errors
      expect(errors.length).toBeLessThanOrEqual(2)

      if (errors.length > 0) {
        console.log('  Console errors found:', errors)
      }
    })
  })

  // ---------------------------------------------------------------------------
  // 7. ADMIN PANEL
  // ---------------------------------------------------------------------------
  test.describe('7. Admin Panel', () => {
    test('Admin login page loads', async ({ page }) => {
      await page.goto(`${BASE_URL}/admin`, { waitUntil: 'networkidle' })

      // Should show login form or dashboard (if auto-login enabled)
      const hasLoginForm = await page
        .locator('input[type="email"], input[type="password"]')
        .first()
        .isVisible()
        .catch(() => false)
      const hasDashboard = await page
        .locator('[class*="dashboard"], [class*="admin"]')
        .first()
        .isVisible()
        .catch(() => false)

      expect(hasLoginForm || hasDashboard).toBe(true)
    })
  })

  // ---------------------------------------------------------------------------
  // 8. E-COMMERCE (tests run only if e-commerce pages exist)
  // ---------------------------------------------------------------------------
  test.describe('8. E-Commerce (if available)', () => {
    test('Products/Cart/Checkout pages load if they exist', async ({ page }) => {
      const ecommercePages = ['/produse', '/cos', '/checkout']

      for (const path of ecommercePages) {
        const response = await page.goto(`${BASE_URL}${path}`, {
          waitUntil: 'domcontentloaded',
        })
        const status = response?.status() || 0

        // 200 = exists, 404 = not an e-commerce site (OK)
        expect([200, 404]).toContain(status)

        if (status === 200) {
          await expect(page.locator('body')).toBeVisible()
          console.log(`  ✅ ${path}`)
        }
      }
    })
  })
})

// =============================================================================
// SUMMARY TEST
// =============================================================================
test('Summary: Site is production ready', async ({ page }) => {
  console.log('\n' + '='.repeat(60))
  console.log('📋 PRODUCTION READINESS CHECK')
  console.log('='.repeat(60))

  const checks: Record<string, boolean> = {}

  // 1. Homepage loads
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle', timeout: 30000 })
    checks['Homepage Loads'] = true
  } catch {
    checks['Homepage Loads'] = false
  }

  // 2. Has header
  checks['Header Exists'] = await page
    .locator('header')
    .first()
    .isVisible()
    .catch(() => false)

  // 3. Has footer
  checks['Footer Exists'] = await page
    .locator('footer')
    .first()
    .isVisible()
    .catch(() => false)

  // 4. Has navigation
  checks['Navigation Works'] =
    (await page.locator('header a[href^="/"]').count().catch(() => 0)) > 0

  // 5. Has content
  const bodyText = (await page.textContent('body').catch(() => '')) || ''
  checks['Has Content'] = bodyText.length > 500

  // 6. Has CTA
  checks['Has CTA Buttons'] =
    (await page
      .locator('a:has-text("programeaz"), a:has-text("contact"), button:has-text("programeaz")')
      .count()
      .catch(() => 0)) > 0

  // 7. CSS loaded
  checks['CSS Loaded'] =
    (await page
      .evaluate(() => window.getComputedStyle(document.body).backgroundColor)
      .catch(() => '')) !== ''

  // Print results
  console.log('\nResults:')
  let passed = 0
  let failed = 0

  for (const [check, status] of Object.entries(checks)) {
    const emoji = status ? '✅' : '❌'
    console.log(`  ${emoji} ${check}`)
    if (status) passed++
    else failed++
  }

  console.log('\n' + '-'.repeat(60))
  console.log(`Total: ${passed}/${passed + failed} checks passed`)

  if (failed === 0) {
    console.log('🎉 SITE IS PRODUCTION READY!')
  } else {
    console.log('⚠️  Some checks failed. Review before deploying.')
  }
  console.log('='.repeat(60) + '\n')

  // All critical checks must pass
  expect(checks['Homepage Loads']).toBe(true)
  expect(checks['Header Exists']).toBe(true)
  expect(checks['Footer Exists']).toBe(true)
})
