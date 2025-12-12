/**
 * Image Loading Tests
 *
 * Verifies that images load correctly on the current site.
 * Does NOT run seed - tests whatever is currently in the database.
 *
 * Usage:
 *   1. First seed the database: pnpm seed:frizerie (or any business type)
 *   2. Then run tests: pnpm test:e2e tests/e2e/images-loaded.spec.ts
 *
 * For testing with real images:
 *   pnpm seed -- --with-images
 */

import { test, expect, Page } from '@playwright/test'

const TEST_PORT = process.env.TEST_PORT || '3100'
const BASE_URL = process.env.BASE_URL || `http://localhost:${TEST_PORT}`

interface ImageCheckResult {
  src: string
  alt: string | null
  isLoaded: boolean
  naturalWidth: number
  naturalHeight: number
  isNextImage: boolean
  hasValidSrc: boolean
}

async function checkImagesOnPage(page: Page): Promise<ImageCheckResult[]> {
  return await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'))
    return images.map((img) => ({
      src: img.src || img.getAttribute('data-src') || '',
      alt: img.alt,
      isLoaded: img.complete && img.naturalWidth > 0,
      naturalWidth: img.naturalWidth,
      naturalHeight: img.naturalHeight,
      isNextImage: img.hasAttribute('data-nimg') || img.closest('[data-nimg]') !== null,
      hasValidSrc: !!(img.src && img.src.length > 0 && !img.src.includes('undefined')),
    }))
  })
}

async function verifyImagesLoadedWithLocators(
  page: Page,
): Promise<{ passed: number; failed: number; errors: string[] }> {
  const errors: string[] = []
  let passed = 0
  let failed = 0

  const images = await page.getByRole('img').all()

  for (const img of images) {
    try {
      const src = await img.getAttribute('src')
      if (!src || src.includes('data:') || src.includes('google') || src.includes('facebook')) {
        continue
      }

      await expect(img).toHaveJSProperty('complete', true, { timeout: 5000 })
      await expect(img).not.toHaveJSProperty('naturalWidth', 0, { timeout: 5000 })
      passed++
    } catch {
      const src = await img.getAttribute('src').catch(() => 'unknown')
      errors.push(`Failed to load: ${src}`)
      failed++
    }
  }

  return { passed, failed, errors }
}

test.describe('Image Loading', () => {
  // No seed - tests current database state

  test('homepage images load correctly', async ({ page }) => {
    const brokenImages: string[] = []
    page.on('response', (response) => {
      const url = response.url()
      if (
        (url.includes('/media/') || url.includes('/_next/image')) &&
        response.status() >= 400
      ) {
        brokenImages.push(`${response.status()}: ${url}`)
      }
    })

    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000)

    // Scroll through the page to trigger lazy loading
    await page.evaluate(async () => {
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
      for (let i = 0; i < document.body.scrollHeight; i += 300) {
        window.scrollTo(0, i)
        await delay(200)
      }
    })

    await page.waitForTimeout(3000)

    const images = await checkImagesOnPage(page)
    console.log(`Found ${images.length} images on homepage`)

    const contentImages = images.filter(
      (img) =>
        img.hasValidSrc && !img.src.includes('data:') && !img.src.includes('google') && !img.src.includes('facebook'),
    )

    console.log(`Content images: ${contentImages.length}`)

    if (contentImages.length > 0) {
      const loadedImages = contentImages.filter((img) => img.isLoaded)
      const loadRate = loadedImages.length / contentImages.length

      console.log(`Loaded: ${loadedImages.length}/${contentImages.length} (${(loadRate * 100).toFixed(1)}%)`)

      // At least 70% of images should be loaded
      expect(loadRate).toBeGreaterThanOrEqual(0.7)
    }

    // No broken images (404s)
    expect(brokenImages).toHaveLength(0)
  })

  test('images have valid src attributes', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000)

    const invalidImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'))
      return images
        .filter((img) => {
          const src = img.src || img.getAttribute('data-src') || ''
          return !src || src === '' || src.includes('undefined') || src.includes('null') || src === 'about:blank'
        })
        .map((img) => ({
          src: img.src,
          alt: img.alt,
          className: img.className,
        }))
    })

    if (invalidImages.length > 0) {
      console.log('Invalid images found:')
      invalidImages.forEach((img) => {
        console.log(`  src="${img.src}" alt="${img.alt}" class="${img.className}"`)
      })
    }

    expect(invalidImages).toHaveLength(0)
  })

  test('Next.js image optimization works', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000)

    const nextImages = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'))
      return images.filter(
        (img) =>
          img.src.includes('/_next/image') || img.hasAttribute('data-nimg') || img.srcset?.includes('/_next/image'),
      ).length
    })

    console.log(`Next.js optimized images: ${nextImages}`)

    // Should have at least some Next.js optimized images
    expect(nextImages).toBeGreaterThan(0)
  })

  test('images use Playwright verification method', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
    await page.waitForTimeout(3000)

    // Scroll to trigger lazy loading
    await page.evaluate(async () => {
      const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
      for (let i = 0; i < document.body.scrollHeight; i += 400) {
        window.scrollTo(0, i)
        await delay(150)
      }
    })

    await page.waitForTimeout(3000)

    const result = await verifyImagesLoadedWithLocators(page)

    console.log(`\n📸 Image Verification:`)
    console.log(`   Passed: ${result.passed}`)
    console.log(`   Failed: ${result.failed}`)

    if (result.errors.length > 0) {
      console.log(`   Errors:`)
      result.errors.slice(0, 5).forEach((e) => console.log(`     - ${e}`))
    }

    expect(result.passed).toBeGreaterThan(0)
    // Allow max 2 failures (tracking pixels)
    expect(result.failed).toBeLessThanOrEqual(2)
  })
})

test.describe('Media API', () => {
  test('/api/media endpoint works', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/media?limit=5`)

    expect(response.status()).toBeLessThan(400)

    const data = await response.json()
    console.log(`\n📁 Media API Response:`)
    console.log(`   Total docs: ${data.totalDocs || 0}`)
    console.log(`   Has docs: ${(data.docs?.length || 0) > 0}`)

    if (data.docs?.length > 0) {
      console.log(`   First item: ${data.docs[0].filename}`)
    }
  })
})
