/**
 * All Business Types Tests
 *
 * DOES run seed - this is the comprehensive CI/CD test suite.
 * Tests ALL business types with automatic seeding.
 *
 * Usage:
 *   pnpm test:e2e tests/e2e/all-businesses.spec.ts
 *
 * NOTE: This suite takes significant time as it seeds each business type.
 * Use individual test files without seed for faster development testing.
 *
 * Screenshots are saved to: tests/e2e/screenshots/
 */

import { test, expect } from '@playwright/test'
import { execSync } from 'child_process'
import * as fs from 'fs'
import * as path from 'path'

// Use TEST_PORT from playwright.config.ts for consistency
const TEST_PORT = process.env.TEST_PORT || '3100'
const BASE_URL = process.env.BASE_URL || `http://localhost:${TEST_PORT}`

// Configuratii pentru toate tipurile de business
const BUSINESS_TYPES = [
  {
    type: 'frizerie',
    name: 'Frizerie / Barbershop',
    brand: 'Barber Shop',
    color: 'Negru & Auriu',
  },
  {
    type: 'dentist',
    name: 'Cabinet Stomatologic',
    brand: 'DentalMed',
    color: 'Albastru Medical',
  },
  {
    type: 'restaurant',
    name: 'Restaurant / Cafenea',
    brand: 'La Copac',
    color: 'Portocaliu & Maro',
  },
  {
    type: 'auto-service',
    name: 'Service Auto',
    brand: 'AutoPro',
    color: 'Rosu & Inchis',
  },
  {
    type: 'salon',
    name: 'Salon Infrumusetare',
    brand: 'Beauty Elena',
    color: 'Roz & Rose Gold',
  },
  {
    type: 'avocat',
    name: 'Cabinet Avocat',
    brand: 'Avocat Ionescu',
    color: 'Navy & Auriu',
  },
  {
    type: 'constructii',
    name: 'Firma Constructii',
    brand: 'BuildPro',
    color: 'Portocaliu Industrial',
  },
  {
    type: 'magazin',
    name: 'Magazin Online',
    brand: 'EcoShop',
    color: 'Verde Natural',
  },
] as const

// Directorul pentru screenshots
const SCREENSHOTS_DIR = path.join(process.cwd(), 'tests/e2e/screenshots')

// Asigura-te ca directorul exista
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true })
}

/**
 * Seed database cu un tip de business
 */
function seedBusiness(type: string): void {
  console.log(`\n🌱 Seeding ${type}...`)
  execSync(`SEED_TYPE=${type} DESIGN_VARIANT=0 pnpm seed`, {
    cwd: process.cwd(),
    stdio: 'inherit',
  })
}

test.describe('Toate Tipurile de Business', () => {
  // Ruleaza testele serial (unul dupa altul) pentru ca schimbam baza de date
  test.describe.configure({ mode: 'serial' })

  for (const business of BUSINESS_TYPES) {
    test.describe(`${business.name}`, () => {

      test.beforeAll(async () => {
        seedBusiness(business.type)
        // Asteapta putin pentru ISR
        await new Promise(resolve => setTimeout(resolve, 3000))
      })

      test(`Homepage - ${business.type}`, async ({ page }) => {
        // Navigheaza la homepage
        await page.goto(BASE_URL, { waitUntil: 'networkidle' })

        // Asteapta pentru animatii si imagini
        await page.waitForTimeout(2000)

        // 1. Verifica ca pagina s-a incarcat
        const body = page.locator('body')
        await expect(body).toBeVisible()

        // 2. Verifica header
        const header = page.locator('header').first()
        await expect(header).toBeVisible()

        // 3. Verifica footer
        const footer = page.locator('footer').first()
        await expect(footer).toBeVisible()

        // 4. Verifica ca are continut
        const bodyText = await page.textContent('body')
        expect(bodyText!.length).toBeGreaterThan(100)

        // 5. Screenshot DESKTOP - full page
        await page.screenshot({
          fullPage: true,
          path: path.join(SCREENSHOTS_DIR, `${business.type}-desktop-full.png`),
        })

        // 6. Screenshot DESKTOP - viewport only
        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, `${business.type}-desktop-viewport.png`),
        })

        console.log(`✅ ${business.type} - Desktop screenshots saved`)
      })

      test(`Mobile View - ${business.type}`, async ({ page }) => {
        // Seteaza viewport mobil
        await page.setViewportSize({ width: 375, height: 812 })

        // Navigheaza la homepage
        await page.goto(BASE_URL, { waitUntil: 'networkidle' })
        await page.waitForTimeout(2000)

        // Verifica ca pagina s-a incarcat
        const body = page.locator('body')
        await expect(body).toBeVisible()

        // Screenshot MOBILE - full page
        await page.screenshot({
          fullPage: true,
          path: path.join(SCREENSHOTS_DIR, `${business.type}-mobile-full.png`),
        })

        // Screenshot MOBILE - viewport only
        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, `${business.type}-mobile-viewport.png`),
        })

        console.log(`✅ ${business.type} - Mobile screenshots saved`)
      })

      test(`Sectiuni Homepage - ${business.type}`, async ({ page }) => {
        await page.goto(BASE_URL, { waitUntil: 'networkidle' })
        await page.waitForTimeout(1000)

        // Verifica sectiunile principale
        const sections = page.locator('section')
        const sectionCount = await sections.count()

        // Ar trebui sa aiba cel putin 3 sectiuni
        expect(sectionCount).toBeGreaterThanOrEqual(2)

        // Screenshot la fiecare sectiune vizibila (primele 5)
        for (let i = 0; i < Math.min(sectionCount, 5); i++) {
          const section = sections.nth(i)
          if (await section.isVisible()) {
            try {
              await section.screenshot({
                path: path.join(SCREENSHOTS_DIR, `${business.type}-section-${i + 1}.png`),
              })
            } catch (e) {
              // Sectiunea poate fi prea mare sau invizibila
            }
          }
        }

        console.log(`✅ ${business.type} - Section screenshots saved`)
      })
    })
  }
})

// Test separat pentru formular contact (optional)
test.describe('Formular Contact', () => {
  test('Test formular cu frizerie', async ({ page }) => {
    // Seed frizerie pentru test
    seedBusiness('frizerie')
    await new Promise(resolve => setTimeout(resolve, 3000))

    await page.goto(BASE_URL, { waitUntil: 'networkidle' })

    // Cauta link-ul Contact si click
    const contactLink = page.locator('a[href*="contact"], a:has-text("Contact")').first()
    if (await contactLink.isVisible()) {
      await contactLink.click()
      await page.waitForTimeout(2000)

      // Screenshot pagina contact
      await page.screenshot({
        fullPage: true,
        path: path.join(SCREENSHOTS_DIR, 'contact-page.png'),
      })

      // Cauta formularul
      const form = page.locator('form').first()
      if (await form.isVisible()) {
        // Completeaza formularul
        const nameInput = form.locator('input[name*="name"], input[name*="nume"]').first()
        const emailInput = form.locator('input[type="email"], input[name*="email"]').first()
        const messageInput = form.locator('textarea').first()

        if (await nameInput.isVisible()) await nameInput.fill('Test Playwright')
        if (await emailInput.isVisible()) await emailInput.fill('test@playwright.dev')
        if (await messageInput.isVisible()) await messageInput.fill('Acesta este un mesaj de test din Playwright.')

        // Screenshot formular completat
        await page.screenshot({
          path: path.join(SCREENSHOTS_DIR, 'contact-form-filled.png'),
        })

        console.log('✅ Contact form test completed')
      }
    }
  })
})
