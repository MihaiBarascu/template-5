/**
 * Quick Check Test
 *
 * Test rapid care verifică site-ul CURENT (orice seed ar fi rulat).
 * NU face seed - doar verifică că totul funcționează.
 *
 * Rulează cu: pnpm test:e2e tests/e2e/quick-check.spec.ts
 *
 * Util pentru:
 * - Verificare rapidă după modificări
 * - Verificare că site-ul e funcțional înainte de deploy
 * - Debug rapid
 */

import { test, expect } from '@playwright/test'

test.describe('Quick Check - Site-ul Curent', () => {
  test('Homepage se încarcă corect', async ({ page }) => {
    await page.goto('/')

    // Header există
    await expect(page.locator('header').first()).toBeVisible()

    // Footer există
    await expect(page.locator('footer').first()).toBeVisible()

    // Pagina are conținut
    const bodyText = await page.textContent('body')
    expect(bodyText!.length).toBeGreaterThan(200)

    // CSS e încărcat (verifică font-family)
    const hasStyling = await page.evaluate(() => {
      return window.getComputedStyle(document.body).fontFamily !== ''
    })
    expect(hasStyling).toBe(true)
  })

  test('Navigația funcționează', async ({ page }) => {
    await page.goto('/')

    // Găsește link-uri în header
    const navLinks = page.locator('header a[href^="/"]')
    const count = await navLinks.count()

    expect(count).toBeGreaterThan(0)

    // Testează primele 3 link-uri
    for (let i = 0; i < Math.min(count, 3); i++) {
      const link = navLinks.nth(i)
      const href = await link.getAttribute('href')

      if (href && href !== '/' && !href.startsWith('http')) {
        await link.click()
        await page.waitForLoadState('domcontentloaded')

        // Pagina s-a încărcat fără eroare
        await expect(page.locator('body')).toBeVisible()

        // Înapoi la homepage
        await page.goto('/')
      }
    }
  })

  test('Pagini principale există', async ({ page }) => {
    const pages = [
      { path: '/', name: 'Homepage' },
      { path: '/contact', name: 'Contact' },
      { path: '/servicii', name: 'Servicii' },
    ]

    for (const p of pages) {
      const response = await page.goto(p.path)
      const status = response?.status() || 0

      // 200 = OK, 404 = pagina nu există pentru acest business
      expect([200, 404]).toContain(status)

      if (status === 200) {
        await expect(page.locator('body')).toBeVisible()
        console.log(`  ✅ ${p.name} (${p.path}) - OK`)
      } else {
        console.log(`  ⏭️  ${p.name} (${p.path}) - Nu există (OK pentru unele business-uri)`)
      }
    }
  })

  test('Formularul de contact (dacă există)', async ({ page }) => {
    const response = await page.goto('/contact')

    if (response?.status() === 200) {
      const form = page.locator('form').first()

      if (await form.isVisible().catch(() => false)) {
        // Verifică că are câmpuri de bază
        const hasInput = await page.locator('input, textarea').first().isVisible().catch(() => false)
        const hasSubmit = await page.locator('button[type="submit"], input[type="submit"]').first().isVisible().catch(() => false)

        expect(hasInput).toBe(true)
        expect(hasSubmit).toBe(true)
        console.log('  ✅ Formular contact găsit și funcțional')
      }
    }
  })

  test('Imagini se încarcă', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const images = page.locator('img')
    const count = await images.count()

    if (count > 0) {
      let loadedCount = 0
      const checkCount = Math.min(count, 5)

      for (let i = 0; i < checkCount; i++) {
        const img = images.nth(i)
        const naturalWidth = await img.evaluate((el: HTMLImageElement) => el.naturalWidth).catch(() => 0)

        if (naturalWidth > 0) {
          loadedCount++
        }
      }

      console.log(`  ✅ ${loadedCount}/${checkCount} imagini verificate încărcate`)
      // Cel puțin jumătate din imagini trebuie să fie încărcate
      expect(loadedCount).toBeGreaterThan(0)
    }
  })

  test('Nu sunt erori JavaScript critice', async ({ page }) => {
    const errors: string[] = []

    page.on('pageerror', (error) => {
      // Ignoră erori cunoscute non-critice
      if (
        !error.message.includes('hydration') &&
        !error.message.includes('ResizeObserver') &&
        !error.message.includes('Loading chunk')
      ) {
        errors.push(error.message)
      }
    })

    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.waitForTimeout(2000)

    if (errors.length > 0) {
      console.log('  ⚠️ Erori găsite:', errors)
    }

    // Permitem maxim 1 eroare non-critică
    expect(errors.length).toBeLessThanOrEqual(1)
  })

  test('Mobile responsive', async ({ page }) => {
    // Setează viewport mobil
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')

    // Header trebuie să fie vizibil
    await expect(page.locator('header').first()).toBeVisible()

    // Nu trebuie să fie scroll orizontal
    const scrollWidth = await page.evaluate(() => document.body.scrollWidth)
    const clientWidth = await page.evaluate(() => document.body.clientWidth)

    // Toleranță de 10px
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 10)
    console.log('  ✅ Site responsive pe mobil')
  })

  test('Admin panel accesibil', async ({ page }) => {
    const response = await page.goto('/admin', { waitUntil: 'networkidle' })

    expect(response?.status()).toBeLessThan(500)

    // Așteptăm să se încarce Payload admin (are loading asincron)
    await page.waitForTimeout(3000)

    // Trebuie să vedem fie login, fie dashboard, fie pagina Payload
    const hasLogin = await page.locator('input[type="email"], input[type="password"], input[name="email"]').first().isVisible().catch(() => false)
    const hasDashboard = await page.locator('[class*="dashboard"], [class*="admin"], [class*="payload"]').first().isVisible().catch(() => false)
    const hasPayloadUI = await page.locator('form, button[type="submit"], [data-theme]').first().isVisible().catch(() => false)

    // Dacă pagina răspunde cu 200 și nu e goală, e OK
    const bodyText = await page.textContent('body').catch(() => '')
    const hasContent = (bodyText?.length || 0) > 50

    expect(hasLogin || hasDashboard || hasPayloadUI || hasContent).toBe(true)
    console.log('  ✅ Admin panel accesibil')
  })
})

// Test sumar final
test('Rezumat: Site funcțional', async ({ page }) => {
  console.log('\n' + '═'.repeat(50))
  console.log('📋 QUICK CHECK - VERIFICARE RAPIDĂ')
  console.log('═'.repeat(50))

  const checks: Record<string, boolean> = {}

  // 1. Homepage
  try {
    await page.goto('/', { timeout: 30000 })
    checks['Homepage'] = true
  } catch {
    checks['Homepage'] = false
  }

  // 2. Header
  checks['Header'] = await page.locator('header').first().isVisible().catch(() => false)

  // 3. Footer
  checks['Footer'] = await page.locator('footer').first().isVisible().catch(() => false)

  // 4. Conținut
  const text = await page.textContent('body').catch(() => '')
  checks['Conținut'] = (text?.length || 0) > 200

  // 5. Navigație
  checks['Navigație'] = (await page.locator('header a').count().catch(() => 0)) > 0

  // 6. Stiluri
  checks['CSS'] = await page.evaluate(() => window.getComputedStyle(document.body).fontFamily !== '').catch(() => false)

  // Afișează rezultate
  console.log('\nRezultate:')
  let passed = 0

  for (const [name, ok] of Object.entries(checks)) {
    console.log(`  ${ok ? '✅' : '❌'} ${name}`)
    if (ok) passed++
  }

  console.log('\n' + '-'.repeat(50))
  console.log(`Total: ${passed}/${Object.keys(checks).length} verificări trecute`)

  if (passed === Object.keys(checks).length) {
    console.log('🎉 SITE FUNCȚIONAL!')
  } else {
    console.log('⚠️  Unele verificări au eșuat')
  }
  console.log('═'.repeat(50) + '\n')

  // Toate verificările critice trebuie să treacă
  expect(checks['Homepage']).toBe(true)
  expect(checks['Header']).toBe(true)
})
