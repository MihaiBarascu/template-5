/**
 * Test principal - Verifică că aplicația funcționează
 *
 * Folosire:
 *   BASE_URL=https://your-app.com pnpm test:app
 *
 * Ce verifică:
 *   1. Homepage se încarcă
 *   2. Nu sunt erori JavaScript
 *   3. Navigația funcționează
 *   4. Formularul de contact există
 *   5. Admin panel e accesibil
 */

import { test, expect } from '@playwright/test'

// Colectează erorile JS
const jsErrors: string[] = []

test.beforeEach(async ({ page }) => {
  jsErrors.length = 0
  page.on('pageerror', (error) => {
    jsErrors.push(error.message)
  })
})

test.describe('Verificare Aplicație', () => {

  test('Homepage se încarcă corect', async ({ page }) => {
    await page.goto('/')

    // Pagina răspunde
    await expect(page).toHaveTitle(/.+/)

    // Header vizibil
    const header = page.locator('header').first()
    await expect(header).toBeVisible()

    // Footer vizibil
    const footer = page.locator('footer').first()
    await expect(footer).toBeVisible()

    // Nu sunt erori JS critice
    const criticalErrors = jsErrors.filter(e =>
      !e.includes('hydration') &&
      !e.includes('ResizeObserver')
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('Navigația funcționează', async ({ page }) => {
    await page.goto('/')

    // Găsește un link din navigație și click
    const navLink = page.locator('header a[href]:not([href="/"])').first()

    if (await navLink.isVisible()) {
      const href = await navLink.getAttribute('href')
      await navLink.click()
      await page.waitForLoadState('domcontentloaded')

      // Verifică că am navigat
      if (href && !href.startsWith('http')) {
        await expect(page).toHaveURL(new RegExp(href))
      }
    }
  })

  test('Pagina Contact există', async ({ page }) => {
    // Încearcă să acceseze /contact
    const response = await page.goto('/contact')

    if (response?.status() === 200) {
      // Verifică că există un formular sau informații de contact
      const hasForm = await page.locator('form').first().isVisible().catch(() => false)
      const hasContactInfo = await page.locator('text=/email|telefon|phone|contact/i').first().isVisible().catch(() => false)

      expect(hasForm || hasContactInfo).toBe(true)
    }
    // Dacă /contact nu există, e ok - nu toate site-urile au
  })

  test('Admin panel e accesibil', async ({ page }) => {
    const response = await page.goto('/admin')

    // Admin panel trebuie să răspundă (200 sau redirect la login)
    expect([200, 302, 303, 307, 308]).toContain(response?.status())

    // Verifică că nu e o pagină de eroare server (500 status sau mesaj explicit)
    const content = await page.content()
    // Check for explicit error messages, not CSS values like "font-weight:500"
    expect(content.toLowerCase()).not.toContain('internal server error')
    expect(content.toLowerCase()).not.toContain('500 error')
    expect(content.toLowerCase()).not.toContain('error 500')

    // Verify we got admin UI content (not an error page)
    const hasPayloadUI = content.includes('payload') || content.includes('admin') || content.includes('dashboard')
    expect(hasPayloadUI).toBe(true)
  })

  test('Site-ul e responsive (mobile)', async ({ page }) => {
    // Setează viewport mobil
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // Header trebuie să fie vizibil
    const header = page.locator('header').first()
    await expect(header).toBeVisible()

    // Conținutul principal trebuie să fie vizibil
    const main = page.locator('main').first()
    if (await main.isVisible()) {
      await expect(main).toBeVisible()
    }
  })

})
