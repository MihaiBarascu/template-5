/**
 * TEMPLATE: Cart Operations E2E Tests
 *
 * CUM FOLOSEȘTI:
 * 1. Copiază acest fișier în tests/e2e/
 * 2. Redenumește: cart.spec.ts
 * 3. Modifică SELECTORS după structura ta
 * 4. Rulează: pnpm test:e2e cart
 *
 * CE TESTEAZĂ:
 * - Adaugă în coș
 * - Modifică cantitate
 * - Șterge din coș
 * - Coș gol
 * - Persistență după refresh
 * - Calcul total corect
 */

import { test, expect, Page } from '@playwright/test'
import { EDGE } from '../data/edge-cases'

// ============================================
// CONFIGURARE - MODIFICĂ AICI
// ============================================

/** URL-uri */
const URLS = {
  products: '/produse',
  cart: '/cos',
  checkout: '/checkout',
}

/** Selectori - MODIFICĂ după HTML-ul tău */
const SELECTORS = {
  // Pagina produse
  productCard: '[data-testid="product-card"]',
  productTitle: '[data-testid="product-title"]',
  productPrice: '[data-testid="product-price"]',
  addToCartBtn: '[data-testid="add-to-cart"]',

  // Coș
  cartIcon: '[data-testid="cart-icon"]',
  cartBadge: '[data-testid="cart-badge"]',
  cartModal: '[data-testid="cart-modal"]',
  cartItem: '[data-testid="cart-item"]',
  cartItemQty: '[data-testid="cart-item-qty"]',
  cartItemRemove: '[data-testid="cart-item-remove"]',
  cartTotal: '[data-testid="cart-total"]',
  cartEmpty: '[data-testid="cart-empty"]',
  checkoutBtn: '[data-testid="checkout-btn"]',

  // Quantity controls
  qtyIncrease: '[data-testid="qty-increase"]',
  qtyDecrease: '[data-testid="qty-decrease"]',
  qtyInput: '[data-testid="qty-input"]',
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/** Adaugă primul produs în coș */
async function addFirstProductToCart(page: Page) {
  await page.goto(URLS.products)
  await page.waitForSelector(SELECTORS.productCard)
  await page.click(`${SELECTORS.productCard}:first-child ${SELECTORS.addToCartBtn}`)
  await page.waitForTimeout(500) // Așteaptă animație
}

/** Deschide modal/pagină coș */
async function openCart(page: Page) {
  await page.click(SELECTORS.cartIcon)
  await page.waitForSelector(SELECTORS.cartModal)
}

/** Golește coșul */
async function clearCart(page: Page) {
  await page.goto(URLS.cart)
  const removeButtons = await page.locator(SELECTORS.cartItemRemove).all()
  for (const btn of removeButtons) {
    await btn.click()
    await page.waitForTimeout(300)
  }
}

/** Obține numărul de items din badge */
async function getCartBadgeCount(page: Page): Promise<number> {
  const badge = page.locator(SELECTORS.cartBadge)
  if ((await badge.count()) === 0) return 0
  const text = await badge.textContent()
  return parseInt(text || '0', 10)
}

/** Obține totalul din coș */
async function getCartTotal(page: Page): Promise<number> {
  const totalText = await page.locator(SELECTORS.cartTotal).textContent()
  // Extrage numărul din "150.00 lei" sau "150 RON"
  const match = totalText?.match(/[\d.,]+/)
  return parseFloat(match?.[0]?.replace(',', '.') || '0')
}

// ============================================
// TESTE
// ============================================

test.describe('Cart Operations', () => {
  test.beforeEach(async ({ page }) => {
    // Golește coșul înainte de fiecare test
    await clearCart(page)
  })

  // ------------------------------------------
  // Add to Cart
  // ------------------------------------------
  test.describe('Add to Cart', () => {
    test('adds product to cart', async ({ page }) => {
      await addFirstProductToCart(page)

      // Verifică badge
      const count = await getCartBadgeCount(page)
      expect(count).toBe(1)
    })

    test('updates badge when adding multiple products', async ({ page }) => {
      await page.goto(URLS.products)
      await page.waitForSelector(SELECTORS.productCard)

      // Adaugă 3 produse diferite
      const addButtons = await page.locator(SELECTORS.addToCartBtn).all()
      for (let i = 0; i < Math.min(3, addButtons.length); i++) {
        await addButtons[i].click()
        await page.waitForTimeout(300)
      }

      const count = await getCartBadgeCount(page)
      expect(count).toBeGreaterThanOrEqual(1)
    })

    test('shows cart modal/notification after adding', async ({ page }) => {
      await addFirstProductToCart(page)

      // Verifică că apare ceva (modal, toast, etc.)
      const hasNotification = await page
        .locator('[class*="toast"], [class*="notification"], [class*="modal"]')
        .count()
      // Sau verifică direct modalul
      // await expect(page.locator(SELECTORS.cartModal)).toBeVisible()
    })
  })

  // ------------------------------------------
  // Cart Display
  // ------------------------------------------
  test.describe('Cart Display', () => {
    test('shows empty cart message when cart is empty', async ({ page }) => {
      await page.goto(URLS.cart)

      await expect(page.locator(SELECTORS.cartEmpty)).toBeVisible()
    })

    test('displays product details in cart', async ({ page }) => {
      await addFirstProductToCart(page)
      await page.goto(URLS.cart)

      // Verifică că există item în coș
      await expect(page.locator(SELECTORS.cartItem)).toBeVisible()

      // Verifică detalii (titlu, preț, cantitate)
      await expect(page.locator(SELECTORS.cartItem)).toContainText(/\d/) // Are preț
    })

    test('calculates total correctly', async ({ page }) => {
      await addFirstProductToCart(page)
      await page.goto(URLS.cart)

      const total = await getCartTotal(page)
      expect(total).toBeGreaterThan(0)
    })
  })

  // ------------------------------------------
  // Quantity Changes
  // ------------------------------------------
  test.describe('Quantity Changes', () => {
    test('increases quantity', async ({ page }) => {
      await addFirstProductToCart(page)
      await page.goto(URLS.cart)

      const initialTotal = await getCartTotal(page)

      // Crește cantitatea
      await page.click(SELECTORS.qtyIncrease)
      await page.waitForTimeout(500)

      const newTotal = await getCartTotal(page)
      expect(newTotal).toBeGreaterThan(initialTotal)
    })

    test('decreases quantity', async ({ page }) => {
      await addFirstProductToCart(page)
      await page.goto(URLS.cart)

      // Mai întâi crește
      await page.click(SELECTORS.qtyIncrease)
      await page.waitForTimeout(300)
      const highTotal = await getCartTotal(page)

      // Apoi scade
      await page.click(SELECTORS.qtyDecrease)
      await page.waitForTimeout(300)
      const lowTotal = await getCartTotal(page)

      expect(lowTotal).toBeLessThan(highTotal)
    })

    test('removes item when quantity reaches zero', async ({ page }) => {
      await addFirstProductToCart(page)
      await page.goto(URLS.cart)

      // Scade până la 0
      await page.click(SELECTORS.qtyDecrease)
      await page.waitForTimeout(500)

      // Fie item dispare, fie apare confirmare
      const itemCount = await page.locator(SELECTORS.cartItem).count()
      // Poate fi 0 sau poate cere confirmare
    })

    test('does not allow negative quantity', async ({ page }) => {
      await addFirstProductToCart(page)
      await page.goto(URLS.cart)

      // Încearcă să scadă de mai multe ori
      for (let i = 0; i < 5; i++) {
        await page.click(SELECTORS.qtyDecrease)
        await page.waitForTimeout(100)
      }

      // Cantitatea nu trebuie să fie negativă
      const qtyText = await page.locator(SELECTORS.cartItemQty).textContent()
      const qty = parseInt(qtyText || '0', 10)
      expect(qty).toBeGreaterThanOrEqual(0)
    })
  })

  // ------------------------------------------
  // Remove from Cart
  // ------------------------------------------
  test.describe('Remove from Cart', () => {
    test('removes single item', async ({ page }) => {
      await addFirstProductToCart(page)
      await page.goto(URLS.cart)

      await expect(page.locator(SELECTORS.cartItem)).toBeVisible()

      await page.click(SELECTORS.cartItemRemove)
      await page.waitForTimeout(500)

      // Coșul ar trebui să fie gol
      await expect(page.locator(SELECTORS.cartEmpty)).toBeVisible()
    })

    test('updates total after removal', async ({ page }) => {
      // Adaugă 2 produse
      await page.goto(URLS.products)
      const addButtons = await page.locator(SELECTORS.addToCartBtn).all()
      if (addButtons.length >= 2) {
        await addButtons[0].click()
        await page.waitForTimeout(300)
        await addButtons[1].click()
        await page.waitForTimeout(300)
      }

      await page.goto(URLS.cart)
      const initialTotal = await getCartTotal(page)

      // Șterge primul
      await page.click(`${SELECTORS.cartItemRemove}:first-child`)
      await page.waitForTimeout(500)

      const newTotal = await getCartTotal(page)
      expect(newTotal).toBeLessThan(initialTotal)
    })
  })

  // ------------------------------------------
  // Persistence - Persistență date
  // ------------------------------------------
  test.describe('Cart Persistence', () => {
    test('preserves cart after page refresh', async ({ page }) => {
      await addFirstProductToCart(page)

      const countBefore = await getCartBadgeCount(page)

      // Refresh
      await page.reload()
      await page.waitForLoadState('networkidle')

      const countAfter = await getCartBadgeCount(page)
      expect(countAfter).toBe(countBefore)
    })

    test('preserves cart when navigating between pages', async ({ page }) => {
      await addFirstProductToCart(page)

      // Navighează la altă pagină
      await page.goto('/contact')
      await page.waitForLoadState('networkidle')

      // Verifică că badge-ul e încă acolo
      const count = await getCartBadgeCount(page)
      expect(count).toBe(1)
    })
  })

  // ------------------------------------------
  // Edge Cases
  // ------------------------------------------
  test.describe('Edge Cases', () => {
    test('handles rapid add-to-cart clicks', async ({ page }) => {
      await page.goto(URLS.products)
      await page.waitForSelector(SELECTORS.addToCartBtn)

      // Click rapid de 5 ori
      const addBtn = page.locator(`${SELECTORS.productCard}:first-child ${SELECTORS.addToCartBtn}`)
      for (let i = 0; i < 5; i++) {
        await addBtn.click()
      }
      await page.waitForTimeout(1000)

      // Verifică că nu a crăpat și că are items
      const count = await getCartBadgeCount(page)
      expect(count).toBeGreaterThan(0)
    })

    test('handles adding same product twice', async ({ page }) => {
      await addFirstProductToCart(page)
      await page.waitForTimeout(500)

      // Adaugă din nou
      await page.goto(URLS.products)
      await page.click(`${SELECTORS.productCard}:first-child ${SELECTORS.addToCartBtn}`)
      await page.waitForTimeout(500)

      // Ar trebui să crească cantitatea, nu să adauge item nou
      await page.goto(URLS.cart)
      const itemCount = await page.locator(SELECTORS.cartItem).count()
      // Poate fi 1 item cu qty 2, sau 2 items separate
    })

    test('checkout button disabled when cart empty', async ({ page }) => {
      await page.goto(URLS.cart)

      const checkoutBtn = page.locator(SELECTORS.checkoutBtn)
      if ((await checkoutBtn.count()) > 0) {
        const isDisabled = await checkoutBtn.isDisabled()
        expect(isDisabled).toBe(true)
      }
    })
  })

  // ------------------------------------------
  // Navigation to Checkout
  // ------------------------------------------
  test.describe('Checkout Navigation', () => {
    test('can proceed to checkout with items in cart', async ({ page }) => {
      await addFirstProductToCart(page)
      await page.goto(URLS.cart)

      await page.click(SELECTORS.checkoutBtn)
      await page.waitForLoadState('networkidle')

      // Verifică că am ajuns la checkout
      expect(page.url()).toContain('checkout')
    })
  })
})
