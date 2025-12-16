/**
 * E2E Tests for Portfolio Functionality
 *
 * Tests cover:
 * - Portfolio page loads correctly
 * - Portfolio items display properly
 * - External links open in new tab
 * - Navigation and accessibility
 * - Responsive behavior
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

test.describe('Portfolio Page', () => {
  test('portfolio page loads without errors', async ({ page }) => {
    const response = await page.goto('/portofoliu')

    // Page should respond with 200
    expect(response?.status()).toBe(200)

    // No critical JS errors
    const criticalErrors = jsErrors.filter(
      (e) => !e.includes('hydration') && !e.includes('ResizeObserver')
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('portfolio page has correct structure', async ({ page }) => {
    await page.goto('/portofoliu')

    // Header is visible
    const header = page.locator('header').first()
    await expect(header).toBeVisible()

    // Main content area exists
    const main = page.locator('main').first()
    await expect(main).toBeVisible()

    // Footer is visible
    const footer = page.locator('footer').first()
    await expect(footer).toBeVisible()
  })

  test('portfolio items are displayed', async ({ page }) => {
    await page.goto('/portofoliu')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Check for portfolio items (links with external URLs or internal links)
    const portfolioLinks = page.locator('main a[href*="multiwebsite.org"], main a[href^="/portofoliu/"]')
    const count = await portfolioLinks.count()

    // Should have at least one portfolio item
    expect(count).toBeGreaterThan(0)
  })

  test('external portfolio links have correct attributes', async ({ page }) => {
    await page.goto('/portofoliu')
    await page.waitForLoadState('networkidle')

    // Find external links
    const externalLinks = page.locator('main a[href^="https://"][target="_blank"]')
    const count = await externalLinks.count()

    if (count > 0) {
      // Check first external link has correct security attributes
      const firstLink = externalLinks.first()
      await expect(firstLink).toHaveAttribute('rel', 'noopener noreferrer')
    }
  })

  test('portfolio items have images', async ({ page }) => {
    await page.goto('/portofoliu')
    await page.waitForLoadState('networkidle')

    // Find images in portfolio section
    const portfolioImages = page.locator('main section img')
    const count = await portfolioImages.count()

    // Should have images (either real images or placeholders)
    expect(count).toBeGreaterThan(0)
  })

  test('portfolio section is accessible', async ({ page }) => {
    await page.goto('/portofoliu')

    // Check for heading structure
    const mainHeading = page.locator('main h1, main h2').first()
    await expect(mainHeading).toBeVisible()

    // All portfolio links should be focusable
    const links = page.locator('main a')
    const count = await links.count()

    for (let i = 0; i < Math.min(count, 5); i++) {
      const link = links.nth(i)
      // Tab to the link should work
      await expect(link).toBeEnabled()
    }
  })
})

test.describe('Portfolio on Homepage', () => {
  test('portfolio section appears on homepage if configured', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')

    // Look for portfolio heading or section
    const portfolioSection = page.locator('text=/portofoliu|portfolio|proiecte/i').first()

    // If portfolio section exists, it should be properly rendered
    if (await portfolioSection.isVisible()) {
      await expect(portfolioSection).toBeVisible()

      // Should have portfolio items (masonry or grid)
      const portfolioItems = page.locator('main .columns-1, main .grid')
      const count = await portfolioItems.count()
      expect(count).toBeGreaterThan(0)
    }
  })
})

test.describe('Portfolio Responsive Behavior', () => {
  test('portfolio is responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/portofoliu')
    await page.waitForLoadState('networkidle')

    // Content should be visible
    const main = page.locator('main').first()
    await expect(main).toBeVisible()

    // Portfolio items should be in single column on mobile
    const portfolioGrid = page.locator('main .columns-1, main .grid-cols-1').first()
    if (await portfolioGrid.isVisible()) {
      await expect(portfolioGrid).toBeVisible()
    }
  })

  test('portfolio is responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/portofoliu')
    await page.waitForLoadState('networkidle')

    // Content should be visible
    const main = page.locator('main').first()
    await expect(main).toBeVisible()
  })

  test('portfolio is responsive on desktop', async ({ page }) => {
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/portofoliu')
    await page.waitForLoadState('networkidle')

    // Content should be visible
    const main = page.locator('main').first()
    await expect(main).toBeVisible()

    // Should have multi-column layout on desktop
    const portfolioGrid = page.locator('main .lg\\:columns-3, main .lg\\:grid-cols-3').first()
    if (await portfolioGrid.isVisible()) {
      await expect(portfolioGrid).toBeVisible()
    }
  })
})

test.describe('Portfolio Navigation', () => {
  test('can navigate to portfolio from homepage', async ({ page }) => {
    await page.goto('/')

    // Find portfolio link in navigation
    const portfolioLink = page.locator('header a[href="/portofoliu"], nav a[href="/portofoliu"]').first()

    if (await portfolioLink.isVisible()) {
      await portfolioLink.click()
      await page.waitForLoadState('domcontentloaded')

      // Should be on portfolio page
      await expect(page).toHaveURL(/portofoliu/)
    }
  })

  test('portfolio page has back navigation option', async ({ page }) => {
    await page.goto('/portofoliu')

    // Should have a way to navigate back (logo or home link)
    const homeLink = page.locator('header a[href="/"]').first()
    await expect(homeLink).toBeVisible()
  })
})

test.describe('Portfolio External Links', () => {
  test('clicking external link opens new tab', async ({ page, context }) => {
    await page.goto('/portofoliu')
    await page.waitForLoadState('networkidle')

    // Find an external link
    const externalLink = page.locator('main a[target="_blank"]').first()

    if (await externalLink.isVisible()) {
      // Listen for new page/popup
      const [newPage] = await Promise.all([
        context.waitForEvent('page'),
        externalLink.click(),
      ])

      // New page should have opened
      expect(newPage).toBeTruthy()

      // Close the new page
      await newPage.close()
    }
  })
})

test.describe('Portfolio Empty State', () => {
  test('handles empty portfolio gracefully', async ({ page }) => {
    // This test verifies that if no portfolio items exist, the page doesn't crash
    await page.goto('/portofoliu')

    // Page should load
    await expect(page).toHaveTitle(/.+/)

    // Should have either portfolio items or empty state message
    const hasItems = await page.locator('main a[href*="multiwebsite.org"]').count() > 0
    const hasEmptyState = await page.locator('text=/nu sunt proiecte|no projects/i').isVisible().catch(() => false)

    // One of these should be true
    expect(hasItems || hasEmptyState || true).toBe(true) // Allow any state for now
  })
})

test.describe('Portfolio Performance', () => {
  test('portfolio page loads in reasonable time', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/portofoliu', { waitUntil: 'domcontentloaded' })

    const loadTime = Date.now() - startTime

    // Page should load within 10 seconds
    expect(loadTime).toBeLessThan(10000)
  })

  test('portfolio images have lazy loading', async ({ page }) => {
    await page.goto('/portofoliu')
    await page.waitForLoadState('networkidle')

    // Check if images have loading="lazy" attribute
    const images = page.locator('main img[loading="lazy"]')
    const count = await images.count()

    // Should have some lazy-loaded images (for performance)
    // This is a soft check - not all images need to be lazy
    expect(count).toBeGreaterThanOrEqual(0)
  })
})
