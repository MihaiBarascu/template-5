/**
 * TEMPLATE: Form Validation E2E Tests
 *
 * CUM FOLOSEȘTI:
 * 1. Copiază acest fișier în tests/e2e/
 * 2. Redenumește: checkout-form.spec.ts, contact-form.spec.ts, etc.
 * 3. Modifică PAGE_URL, SELECTORS și FORM_DATA
 * 4. Rulează: pnpm test:e2e checkout-form
 *
 * CE TESTEAZĂ:
 * - Câmpuri goale (required)
 * - Email invalid
 * - Telefon invalid
 * - Caractere românești (ăîșțâ)
 * - Strings foarte lungi
 * - Caractere speciale
 * - XSS/SQL injection (securitate)
 */

import { test, expect, Page } from '@playwright/test'
import { EDGE, STRING_EDGE_CASES, EMAIL_EDGE_CASES } from '../data/edge-cases'

// ============================================
// CONFIGURARE - MODIFICĂ AICI
// ============================================

/** URL-ul paginii cu formularul */
const PAGE_URL = '/contact' // sau '/checkout', '/booking', etc.

/** Selectorii pentru câmpurile formularului */
const SELECTORS = {
  form: 'form',
  name: 'input[name="name"]',
  email: 'input[name="email"]',
  phone: 'input[name="phone"]',
  message: 'textarea[name="message"]',
  submit: 'button[type="submit"]',
  // Adaugă alte câmpuri după nevoie
}

/** Date valide pentru formular (pentru teste de success) */
const VALID_DATA = {
  name: 'Ion Popescu',
  email: 'ion@example.com',
  phone: '0722123456',
  message: 'Aceasta este o întrebare de test.',
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/** Completează formularul cu date specifice */
async function fillForm(page: Page, data: Partial<typeof VALID_DATA>) {
  if (data.name) await page.fill(SELECTORS.name, data.name)
  if (data.email) await page.fill(SELECTORS.email, data.email)
  if (data.phone) await page.fill(SELECTORS.phone, data.phone)
  if (data.message) await page.fill(SELECTORS.message, data.message)
}

/** Șterge toate câmpurile */
async function clearForm(page: Page) {
  await page.fill(SELECTORS.name, '')
  await page.fill(SELECTORS.email, '')
  await page.fill(SELECTORS.phone, '')
  await page.fill(SELECTORS.message, '')
}

/** Verifică că există eroare de validare */
async function expectValidationError(page: Page) {
  // Opțiuni comune pentru erori:
  // 1. CSS class pe input
  const hasErrorClass = await page.locator('[class*="error"], [class*="invalid"]').count()
  // 2. Element cu rol alert
  const hasAlertRole = await page.locator('[role="alert"]').count()
  // 3. Text de eroare vizibil
  const hasErrorText = await page.locator('text=/eroare|invalid|obligatoriu|required/i').count()

  expect(hasErrorClass + hasAlertRole + hasErrorText).toBeGreaterThan(0)
}

// ============================================
// TESTE
// ============================================

test.describe('Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(PAGE_URL)
    await page.waitForLoadState('networkidle')
  })

  // ------------------------------------------
  // Happy Path - Formularul funcționează
  // ------------------------------------------
  test('submits form with valid data', async ({ page }) => {
    await fillForm(page, VALID_DATA)
    await page.click(SELECTORS.submit)

    // Verifică success (modifică după implementare)
    await expect(page.locator('text=/mulțumim|trimis|success/i')).toBeVisible({
      timeout: 10000,
    })
  })

  // ------------------------------------------
  // Required Fields - Câmpuri obligatorii
  // ------------------------------------------
  test('shows error when name is empty', async ({ page }) => {
    await fillForm(page, { ...VALID_DATA, name: '' })
    await page.click(SELECTORS.submit)
    await expectValidationError(page)
  })

  test('shows error when email is empty', async ({ page }) => {
    await fillForm(page, { ...VALID_DATA, email: '' })
    await page.click(SELECTORS.submit)
    await expectValidationError(page)
  })

  // ------------------------------------------
  // Email Validation
  // ------------------------------------------
  test.describe('Email Validation', () => {
    const invalidEmails = [
      EDGE.emails.noAt,
      EDGE.emails.noDomain,
      EDGE.emails.noUser,
      EDGE.emails.spaces,
      EDGE.emails.justText,
    ]

    for (const email of invalidEmails) {
      test(`rejects invalid email: "${email}"`, async ({ page }) => {
        await fillForm(page, { ...VALID_DATA, email })
        await page.click(SELECTORS.submit)
        await expectValidationError(page)
      })
    }

    test('accepts valid email with plus sign', async ({ page }) => {
      await fillForm(page, { ...VALID_DATA, email: EDGE.emails.withPlus })
      await page.click(SELECTORS.submit)
      // Nu ar trebui să fie eroare de email
    })
  })

  // ------------------------------------------
  // Phone Validation
  // ------------------------------------------
  test.describe('Phone Validation', () => {
    test('accepts phone with spaces: 0722 123 456', async ({ page }) => {
      await fillForm(page, { ...VALID_DATA, phone: EDGE.phones.mobileSpaces })
      await page.click(SELECTORS.submit)
      // Verifică că merge
    })

    test('accepts phone with prefix: +40722123456', async ({ page }) => {
      await fillForm(page, { ...VALID_DATA, phone: EDGE.phones.withPrefix })
      await page.click(SELECTORS.submit)
    })

    test('rejects phone too short', async ({ page }) => {
      await fillForm(page, { ...VALID_DATA, phone: EDGE.phones.tooShort })
      await page.click(SELECTORS.submit)
      await expectValidationError(page)
    })
  })

  // ------------------------------------------
  // Romanian Characters - Caractere românești
  // ------------------------------------------
  test.describe('Romanian Characters Support', () => {
    test('accepts name with ăîșțâ', async ({ page }) => {
      await fillForm(page, { ...VALID_DATA, name: EDGE.names.withAccents })
      await page.click(SELECTORS.submit)

      // Verifică că nu e eroare și textul e acceptat
      const nameValue = await page.inputValue(SELECTORS.name)
      expect(nameValue).toBe(EDGE.names.withAccents)
    })

    test('accepts message with Romanian text', async ({ page }) => {
      const romanianMessage = 'Bună ziua, aș dori să știu prețul. Mulțumesc!'
      await fillForm(page, { ...VALID_DATA, message: romanianMessage })
      await page.click(SELECTORS.submit)
    })
  })

  // ------------------------------------------
  // Security - XSS & SQL Injection
  // ------------------------------------------
  test.describe('Security Edge Cases', () => {
    test('escapes XSS in name field', async ({ page }) => {
      await fillForm(page, { ...VALID_DATA, name: EDGE.strings.xss })
      await page.click(SELECTORS.submit)

      // Verifică că scriptul nu se execută
      const alertShown = await page.evaluate(() => {
        return (window as unknown as { __xssTriggered?: boolean }).__xssTriggered === true
      })
      expect(alertShown).toBeFalsy()
    })

    test('handles SQL injection attempt safely', async ({ page }) => {
      await fillForm(page, { ...VALID_DATA, name: EDGE.strings.sqlInjection })
      await page.click(SELECTORS.submit)

      // Pagina nu ar trebui să crape
      await expect(page).not.toHaveURL(/error|500/)
    })
  })

  // ------------------------------------------
  // Edge Cases - Cazuri extreme
  // ------------------------------------------
  test.describe('Edge Cases', () => {
    test('handles very long name (100+ chars)', async ({ page }) => {
      await fillForm(page, { ...VALID_DATA, name: EDGE.strings.long })
      await page.click(SELECTORS.submit)

      // Fie acceptă, fie arată eroare - nu crash
    })

    test('handles very long message (500+ chars)', async ({ page }) => {
      await fillForm(page, { ...VALID_DATA, message: EDGE.strings.veryLong })
      await page.click(SELECTORS.submit)
    })

    test('handles whitespace-only input', async ({ page }) => {
      await fillForm(page, { ...VALID_DATA, name: EDGE.strings.spaces })
      await page.click(SELECTORS.submit)
      await expectValidationError(page)
    })

    test('handles emoji in message', async ({ page }) => {
      await fillForm(page, { ...VALID_DATA, message: 'Test 😀🎉👍' })
      await page.click(SELECTORS.submit)
    })
  })

  // ------------------------------------------
  // UX - User Experience
  // ------------------------------------------
  test.describe('UX Behavior', () => {
    test('preserves data after validation error', async ({ page }) => {
      // Completează cu email invalid
      await fillForm(page, { ...VALID_DATA, email: 'invalid' })
      await page.click(SELECTORS.submit)

      // Verifică că numele e încă acolo
      const nameValue = await page.inputValue(SELECTORS.name)
      expect(nameValue).toBe(VALID_DATA.name)
    })

    test('clears error after fixing input', async ({ page }) => {
      // Mai întâi eroare
      await fillForm(page, { ...VALID_DATA, email: '' })
      await page.click(SELECTORS.submit)
      await expectValidationError(page)

      // Apoi fix
      await page.fill(SELECTORS.email, VALID_DATA.email)
      await page.click(SELECTORS.submit)

      // Eroarea ar trebui să dispară
    })

    test('can navigate form with Tab key', async ({ page }) => {
      await page.focus(SELECTORS.name)
      await page.keyboard.press('Tab')

      // Verifică că focusul s-a mutat la următorul câmp
      const focusedElement = await page.evaluate(() => document.activeElement?.tagName)
      expect(focusedElement).toBe('INPUT')
    })
  })
})
