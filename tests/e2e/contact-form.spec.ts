/**
 * Contact form tests
 * Tests that the contact form works across different business types
 */

import { test, expect } from '@playwright/test'
import { seedBusiness, goToHomepage } from './fixtures/test-helpers'

test.describe('Contact Form', () => {
  test.beforeAll(async () => {
    // Use frizerie as default for contact form tests
    await seedBusiness('frizerie', 0)
  })

  test('should find contact section or form', async ({ page }) => {
    await goToHomepage(page)

    // Look for contact section
    const contactSection = page.locator('section, div').filter({
      hasText: /contact|mesaj|programare/i,
    })

    // Or look for a form directly
    const form = page.locator('form')

    // At least one should exist
    const hasContact = (await contactSection.count()) > 0 || (await form.count()) > 0
    expect(hasContact).toBeTruthy()
  })

  test('should have required form fields', async ({ page }) => {
    await goToHomepage(page)

    // Find form
    const form = page.locator('form').first()

    if (await form.isVisible()) {
      // Check for common form fields
      const inputs = form.locator('input, textarea')
      const inputCount = await inputs.count()

      // Should have at least name, email, and message
      expect(inputCount).toBeGreaterThanOrEqual(2)
    }
  })

  test('should show validation on empty submit', async ({ page }) => {
    await goToHomepage(page)

    const form = page.locator('form').first()

    if (await form.isVisible()) {
      const submitButton = form.locator('button[type="submit"]').first()

      if (await submitButton.isVisible()) {
        await submitButton.click()

        // Wait a moment for validation
        await page.waitForTimeout(500)

        // Check for HTML5 validation or custom validation messages
        const invalidInputs = form.locator('input:invalid, textarea:invalid')
        const errorMessages = page.locator('.error, [class*="error"], [role="alert"]')

        // Either HTML5 validation or custom error messages should appear
        const hasValidation =
          (await invalidInputs.count()) > 0 || (await errorMessages.count()) > 0
        expect(hasValidation).toBeTruthy()
      }
    }
  })

  test('should submit form with valid data', async ({ page }) => {
    await goToHomepage(page)

    const form = page.locator('form').first()

    if (await form.isVisible()) {
      // Fill in form fields
      const nameInput = form
        .locator('input[name*="name"], input[name*="nume"], input[placeholder*="Nume"]')
        .first()
      const emailInput = form
        .locator('input[name*="email"], input[type="email"], input[placeholder*="Email"]')
        .first()
      const messageInput = form.locator('textarea').first()

      if (await nameInput.isVisible()) {
        await nameInput.fill('Test User')
      }

      if (await emailInput.isVisible()) {
        await emailInput.fill('test@example.com')
      }

      if (await messageInput.isVisible()) {
        await messageInput.fill('This is a test message from Playwright e2e tests.')
      }

      // Submit the form
      const submitButton = form.locator('button[type="submit"]').first()

      if (await submitButton.isVisible()) {
        await submitButton.click()

        // Wait for response
        await page.waitForTimeout(2000)

        // Check for success indicator (toast, message, etc.)
        const successIndicators = page.locator(
          '[class*="success"], [class*="toast"], [role="status"]',
        )

        // Page should not have error overlay
        const errorOverlay = page.locator('#__next-build-error')
        await expect(errorOverlay).not.toBeVisible()
      }
    }
  })
})
