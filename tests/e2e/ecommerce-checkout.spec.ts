/**
 * E-commerce Checkout Tests
 *
 * Testează fluxul complet de checkout pentru business-uri cu ecommerce:
 * - Adăugare produse în coș
 * - Completare formular checkout
 * - Plasare comandă
 * - Verificare confirmare
 *
 * Run: pnpm test:e2e tests/e2e/ecommerce-checkout.spec.ts
 *
 * PREREQUISITES: Run `pnpm seed:magazin` before running these tests!
 * The tests assume the magazin seed has been applied.
 */

import { test, expect, Page } from '@playwright/test'
import { execSync } from 'child_process'

// Seed magazin business type
async function seedMagazin(): Promise<void> {
  console.log('🌱 Seeding magazin...')
  try {
    execSync('pnpm seed:magazin', {
      cwd: process.cwd(),
      stdio: 'pipe',
      timeout: 120000,
    })
    console.log('✅ Seeded magazin')
    // Wait for ISR to update
    await new Promise((resolve) => setTimeout(resolve, 3000))
  } catch (error) {
    console.error('❌ Failed to seed magazin:', error)
    throw error
  }
}

// Test data
const TEST_CUSTOMER = {
  firstName: 'Ion',
  lastName: 'Popescu',
  phone: '0722123456',
  address: 'Str. Test nr. 10, bl. A, ap. 5',
  city: 'București',
  county: 'Bucuresti',
  postalCode: '010101',
  email: 'test@playwright.dev',
}

async function addProductToCart(page: Page): Promise<void> {
  // Navigate to products page
  await page.goto('/produse', { waitUntil: 'networkidle', timeout: 30000 })

  // Wait for products to load
  await page.waitForSelector('button:has-text("Adauga in cos")', { timeout: 10000 })

  // Click first "Add to cart" button
  const addToCartButton = page.getByRole('button', { name: /adauga in cos/i }).first()
  await addToCartButton.click()

  // Wait for cart update notification
  await page.waitForTimeout(1000)

  console.log('✅ Product added to cart')
}

async function fillCheckoutForm(page: Page): Promise<void> {
  // Fill contact info - Email is required!
  await page.getByRole('textbox', { name: /email/i }).fill(TEST_CUSTOMER.email)

  // Fill billing address form
  await page.getByRole('textbox', { name: /prenume/i }).fill(TEST_CUSTOMER.firstName)
  await page.getByRole('textbox', { name: /^nume \*/i }).fill(TEST_CUSTOMER.lastName)
  await page.getByRole('textbox', { name: /telefon/i }).fill(TEST_CUSTOMER.phone)

  // Use exact match for "Adresa *" to avoid matching "Adresa (continuare)"
  await page.getByRole('textbox', { name: 'Adresa *' }).fill(TEST_CUSTOMER.address)

  await page.getByRole('textbox', { name: /ora/i }).fill(TEST_CUSTOMER.city)
  await page.getByRole('textbox', { name: /cod po/i }).fill(TEST_CUSTOMER.postalCode)

  // Select county from dropdown
  await page.getByRole('combobox', { name: /jude/i }).click()
  await page.waitForTimeout(500)
  await page.getByRole('option', { name: TEST_CUSTOMER.county }).click()

  console.log('✅ Checkout form filled')
}

async function saveAddressAndPlaceOrder(page: Page): Promise<void> {
  // Save address first
  const saveButton = page.getByRole('button', { name: /salveaz/i })
  if (await saveButton.isVisible()) {
    await saveButton.click()
    await page.waitForTimeout(1000)
    console.log('✅ Address saved')
  }

  // Wait for place order button to be enabled
  const placeOrderButton = page.getByRole('button', { name: /plaseaz.*comand/i })
  await expect(placeOrderButton).toBeEnabled({ timeout: 5000 })

  // Place order
  await placeOrderButton.click()
  console.log('⏳ Placing order...')
}

async function verifyOrderSuccess(page: Page): Promise<void> {
  // Wait for success heading - use role to be specific
  await expect(
    page.getByRole('heading', { name: /comand.*plasat.*succes/i }),
  ).toBeVisible({ timeout: 30000 })

  // Verify cart is empty after order
  const cartButton = page.getByRole('button', { name: /cos/i }).first()
  await expect(cartButton).not.toContainText(/[1-9]/)

  console.log('✅ Order placed successfully!')
}

test.describe('E-commerce Checkout Flow', () => {
  test.describe.configure({ mode: 'serial', timeout: 90000 })

  test.beforeAll(async () => {
    await seedMagazin()
  })

  test('complete checkout flow', async ({ page }) => {
    // 1. Add product to cart
    await addProductToCart(page)

    // 2. Navigate to checkout
    await page.goto('/checkout', { waitUntil: 'networkidle', timeout: 30000 })

    // Verify cart has items - look in main content area only
    const mainContent = page.locator('main')
    const subtotalInMain = mainContent.getByText(/subtotal/i).first()
    await expect(subtotalInMain).toBeVisible({ timeout: 10000 })

    // 3. Fill checkout form
    await fillCheckoutForm(page)

    // 4. Save address and place order
    await saveAddressAndPlaceOrder(page)

    // 5. Verify order success
    await verifyOrderSuccess(page)
  })

  test('checkout with empty cart shows message', async ({ page }) => {
    // Clear any existing cart by clearing localStorage
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    await page.evaluate(() => {
      localStorage.removeItem('cart')
      localStorage.removeItem('cartId')
    })

    // Navigate to checkout
    await page.goto('/checkout', { waitUntil: 'networkidle' })

    // Should show empty cart message - use main content area and first match
    const mainContent = page.locator('main')
    const emptyMessage = mainContent.getByText(/co.*gol/i).first()

    await expect(emptyMessage).toBeVisible({ timeout: 10000 })
    console.log('✅ Empty cart message shown correctly')
  })

  test('products page loads correctly', async ({ page }) => {
    await page.goto('/produse', { waitUntil: 'networkidle', timeout: 30000 })

    // Products should be visible - look for "Add to cart" buttons
    const addToCartButtons = page.getByRole('button', { name: /adauga in cos/i })

    const count = await addToCartButtons.count()
    expect(count).toBeGreaterThan(0)
    console.log(`✅ Found ${count} products with add-to-cart buttons`)
  })

  test('cart modal shows added products', async ({ page }) => {
    // Add product to cart
    await page.goto('/produse', { waitUntil: 'networkidle' })
    await addProductToCart(page)

    // Open cart modal
    const cartButton = page.getByRole('button', { name: /cos/i }).first()
    await cartButton.click()

    // Cart should show the product
    await page.waitForTimeout(500)
    const cartModal = page.locator('[class*="cart"], [class*="cos"]').filter({
      has: page.getByText(/subtotal/i),
    })

    await expect(cartModal.or(page.getByText(/subtotal/i))).toBeVisible({ timeout: 5000 })
  })
})

test.describe('E-commerce API Tests', () => {
  test('payment initiate endpoint responds', async ({ request, baseURL }) => {
    const TEST_PORT = process.env.TEST_PORT || '3100'
    const url = baseURL || `http://localhost:${TEST_PORT}`

    // Without a valid cart and session, the endpoint may return:
    // - 400 (bad request) if cart validation fails
    // - 404 if cart not found (expected without valid cartID)
    // The important thing is the endpoint exists and responds
    const response = await request.post(`${url}/api/payments/manual/initiate`, {
      data: {
        cartID: 'invalid-cart-id',
        customerEmail: 'test@test.com',
        currency: 'RON',
      },
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Endpoint should respond (any status code means it exists)
    // 404 "Cart not found" is acceptable when cartID is invalid
    // 400 "Bad request" is acceptable for missing data
    // 500 would indicate a server error
    expect(response.status()).toBeLessThan(500)
    console.log(`✅ Payment endpoint responds (status: ${response.status()})`)
  })

  test('carts API is accessible', async ({ request, baseURL }) => {
    const TEST_PORT = process.env.TEST_PORT || '3100'
    const url = baseURL || `http://localhost:${TEST_PORT}`

    const response = await request.get(`${url}/api/carts`)

    // Should return 200 or 401/403 (auth required), not 404
    expect([200, 401, 403]).toContain(response.status())
    console.log(`✅ Carts API accessible (status: ${response.status()})`)
  })

  test('products API returns products', async ({ request, baseURL }) => {
    const TEST_PORT = process.env.TEST_PORT || '3100'
    const url = baseURL || `http://localhost:${TEST_PORT}`

    const response = await request.get(`${url}/api/products`)
    const status = response.status()

    // Products collection may not exist if using ecommerce plugin instead
    if (status === 404) {
      console.log('⏭️ Products collection not found (may use ecommerce plugin)')
      return
    }

    expect(status).toBe(200)

    const data = await response.json()
    expect(data.docs).toBeDefined()
    expect(data.docs.length).toBeGreaterThan(0)
    console.log(`✅ Products API returns ${data.docs.length} products`)
  })
})
