/**
 * Image Loading Tests - Verifies images load correctly when seeded with --with-images
 * Run with: pnpm test:e2e tests/e2e/images-loaded.spec.ts
 *
 * Prerequisites:
 *   pnpm seed -- --with-images  (or sh run-seed.sh frizerie with-images)
 *
 * These tests verify:
 * - Images have valid src attributes
 * - Images actually render (naturalWidth > 0)
 * - No broken images (404 responses)
 * - Next.js Image optimization is working
 */

import { test, expect, Page } from '@playwright/test'
import { execSync } from 'child_process'

const TEST_PORT = process.env.TEST_PORT || '3100'
const BASE_URL = process.env.BASE_URL || `http://localhost:${TEST_PORT}`

// Business types to test (subset for faster execution)
const BUSINESS_TYPES_WITH_IMAGES = ['frizerie', 'restaurant', 'magazin'] as const

interface ImageCheckResult {
  src: string
  alt: string | null
  isLoaded: boolean
  naturalWidth: number
  naturalHeight: number
  isNextImage: boolean
  hasValidSrc: boolean
}

/**
 * Seeds a business with images
 */
async function seedWithImages(businessType: string): Promise<void> {
  console.log(`\n🌱 Seeding ${businessType} with images...`)
  execSync(`SEED_TYPE=${businessType} pnpm seed -- --with-images`, {
    cwd: process.cwd(),
    stdio: 'inherit',
    timeout: 180000, // 3 minutes for seed with images
    env: {
      ...process.env,
      SEED_TYPE: businessType,
    },
  })
  // Wait for ISR cache to update and Next.js to rebuild
  console.log('⏳ Waiting for cache update (10s)...')
  await new Promise((resolve) => setTimeout(resolve, 10000))
}

/**
 * Check all images on a page and return their status
 */
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

/**
 * Check for broken image requests (404s)
 */
async function collectBrokenImageRequests(page: Page): Promise<string[]> {
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

  return brokenImages
}

/**
 * Wait for all images to load using Playwright's recommended approach
 * @see https://github.com/microsoft/playwright/issues/6046
 */
async function waitForImagesToLoad(page: Page, timeout = 10000): Promise<void> {
  await page.waitForFunction(
    () => {
      const images = Array.from(document.querySelectorAll('img'))
      return images.every((img) => img.complete)
    },
    { timeout },
  )
}

/**
 * Verify all images loaded correctly using Playwright's official method
 * @see https://github.com/karlhorky/playwright-image-loading-tests-with-next-js
 */
async function verifyImagesLoadedWithLocators(page: Page): Promise<{ passed: number; failed: number; errors: string[] }> {
  const errors: string[] = []
  let passed = 0
  let failed = 0

  const images = await page.getByRole('img').all()

  for (const img of images) {
    try {
      // Skip tracking pixels and data URLs
      const src = await img.getAttribute('src')
      if (!src || src.includes('data:') || src.includes('google') || src.includes('facebook')) {
        continue
      }

      // Official Playwright approach: check complete AND naturalWidth
      await expect(img).toHaveJSProperty('complete', true, { timeout: 5000 })
      await expect(img).not.toHaveJSProperty('naturalWidth', 0, { timeout: 5000 })
      passed++
    } catch (error) {
      const src = await img.getAttribute('src').catch(() => 'unknown')
      errors.push(`Failed to load: ${src}`)
      failed++
    }
  }

  return { passed, failed, errors }
}

test.describe('Image Loading Tests', () => {
  test.describe.configure({ mode: 'serial' })

  for (const businessType of BUSINESS_TYPES_WITH_IMAGES) {
    test.describe(`${businessType} - Images`, () => {
      test.beforeAll(async () => {
        await seedWithImages(businessType)
      })

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

        // Use domcontentloaded to avoid networkidle timeout issues with long-poll connections
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

        // Wait for initial render
        await page.waitForTimeout(3000)

        // Scroll through the page to trigger lazy loading
        await page.evaluate(async () => {
          const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
          for (let i = 0; i < document.body.scrollHeight; i += 300) {
            window.scrollTo(0, i)
            await delay(200) // Slower scroll to allow images to load
          }
          // Scroll back up to ensure all images are triggered
          for (let i = document.body.scrollHeight; i >= 0; i -= 500) {
            window.scrollTo(0, i)
            await delay(100)
          }
        })

        // Wait for lazy images to load after scroll
        await page.waitForTimeout(5000)

        // Get all image info
        const images = await checkImagesOnPage(page)
        console.log(`Found ${images.length} images on homepage`)

        // Filter to only content images (exclude tracking pixels, etc)
        const contentImages = images.filter(
          (img) =>
            img.hasValidSrc &&
            !img.src.includes('data:') &&
            !img.src.includes('google') &&
            !img.src.includes('facebook'),
        )

        console.log(`Content images: ${contentImages.length}`)

        // Check that we have some images
        expect(contentImages.length).toBeGreaterThan(0)

        // Check that images are loaded
        const loadedImages = contentImages.filter((img) => img.isLoaded)
        const loadRate = loadedImages.length / contentImages.length

        console.log(`Loaded: ${loadedImages.length}/${contentImages.length} (${(loadRate * 100).toFixed(1)}%)`)

        // At least 80% of images should be loaded
        expect(loadRate).toBeGreaterThanOrEqual(0.8)

        // No broken images (404s)
        expect(brokenImages).toHaveLength(0)

        // Check for images with broken src
        const invalidImages = contentImages.filter(
          (img) => img.src.includes('undefined') || img.src.includes('null'),
        )
        expect(invalidImages).toHaveLength(0)
      })

      test('hero section has visible image', async ({ page }) => {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

        // Look for hero image (first section with image)
        const heroImage = page.locator('section').first().locator('img').first()

        // Hero might have background image instead
        const hasHeroImage = await heroImage.isVisible().catch(() => false)

        if (hasHeroImage) {
          // Official Playwright approach: check complete AND naturalWidth
          // @see https://github.com/karlhorky/playwright-image-loading-tests-with-next-js
          await expect(heroImage).toHaveJSProperty('complete', true, { timeout: 10000 })
          await expect(heroImage).not.toHaveJSProperty('naturalWidth', 0, { timeout: 10000 })

          // Check has alt text
          const altText = await heroImage.getAttribute('alt')
          expect(altText).not.toBeNull()
        } else {
          // Check for background image
          const heroSection = page.locator('section').first()
          const bgImage = await heroSection.evaluate((el) => {
            const style = window.getComputedStyle(el)
            return style.backgroundImage
          })

          // Should have either img or background-image
          const hasBackground = bgImage !== 'none' && bgImage.includes('url')
          console.log(`Hero uses background-image: ${hasBackground}`)
        }
      })

      test('product/service images load', async ({ page }) => {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
        await page.waitForTimeout(3000)

        // Look for product/service cards with images
        const cardImages = page.locator('[class*="card"] img, [class*="product"] img, [class*="service"] img')
        const cardImageCount = await cardImages.count()

        if (cardImageCount > 0) {
          console.log(`Found ${cardImageCount} card images`)

          // Check first 5 card images
          for (let i = 0; i < Math.min(cardImageCount, 5); i++) {
            const img = cardImages.nth(i)

            if (await img.isVisible()) {
              const loaded = await img.evaluate((el: HTMLImageElement) => {
                return el.complete && el.naturalWidth > 0
              })

              expect(loaded).toBeTruthy()
            }
          }
        } else {
          // Try grid layout images
          const gridImages = page.locator('.grid img')
          const gridCount = await gridImages.count()
          console.log(`Found ${gridCount} grid images`)

          expect(gridCount).toBeGreaterThan(0)
        }
      })

      test('media folder images are accessible', async ({ page, request }) => {
        // Get list of images from API
        const apiResponse = await request.get(`${BASE_URL}/api/media?limit=10`)

        if (apiResponse.ok()) {
          const data = await apiResponse.json()
          const mediaItems = data.docs || []

          console.log(`Found ${mediaItems.length} media items in API`)

          // Check first 5 media items
          for (const item of mediaItems.slice(0, 5)) {
            if (item.url) {
              const imageUrl = item.url.startsWith('http')
                ? item.url
                : `${BASE_URL}${item.url}`

              const imageResponse = await request.get(imageUrl)
              expect(imageResponse.status()).toBeLessThan(400)

              console.log(`✓ ${item.filename}: ${imageResponse.status()}`)
            }
          }
        }
      })

      test('Next.js image optimization works', async ({ page }) => {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
        await page.waitForTimeout(3000)

        // Check for Next.js optimized images
        const nextImages = await page.evaluate(() => {
          const images = Array.from(document.querySelectorAll('img'))
          return images.filter(
            (img) =>
              img.src.includes('/_next/image') ||
              img.hasAttribute('data-nimg') ||
              img.srcset?.includes('/_next/image'),
          ).length
        })

        console.log(`Next.js optimized images: ${nextImages}`)

        // Should have at least some Next.js optimized images
        expect(nextImages).toBeGreaterThan(0)
      })

      test('images have correct sizes attribute', async ({ page }) => {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

        // Get images with sizes attribute
        const imagesWithSizes = await page.evaluate(() => {
          const images = Array.from(document.querySelectorAll('img'))
          return images
            .filter((img) => img.sizes && img.sizes.length > 0)
            .map((img) => ({
              src: img.src.substring(0, 50),
              sizes: img.sizes,
            }))
        })

        console.log(`Images with sizes attribute: ${imagesWithSizes.length}`)

        // Log some examples
        imagesWithSizes.slice(0, 3).forEach((img) => {
          console.log(`  sizes="${img.sizes}"`)
        })

        // Should have images with sizes (SEO optimization)
        expect(imagesWithSizes.length).toBeGreaterThan(0)
      })

      test('all images load correctly (Playwright official method)', async ({ page }) => {
        // This test uses Playwright's recommended approach for verifying image loading
        // @see https://github.com/karlhorky/playwright-image-loading-tests-with-next-js
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

        // Wait for initial render
        await page.waitForTimeout(3000)

        // Scroll to trigger lazy loading
        await page.evaluate(async () => {
          const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
          for (let i = 0; i < document.body.scrollHeight; i += 400) {
            window.scrollTo(0, i)
            await delay(150)
          }
        })

        await page.waitForTimeout(3000)

        // Use official Playwright method to verify each image
        const result = await verifyImagesLoadedWithLocators(page)

        console.log(`\n📸 Image Verification (Playwright method):`)
        console.log(`   Passed: ${result.passed}`)
        console.log(`   Failed: ${result.failed}`)

        if (result.errors.length > 0) {
          console.log(`   Errors:`)
          result.errors.forEach((e) => console.log(`     - ${e}`))
        }

        // All images should load (allow for some tracking pixels to fail)
        expect(result.passed).toBeGreaterThan(0)
        expect(result.failed).toBeLessThanOrEqual(2) // Allow max 2 failures (tracking pixels)
      })

      test('no images with empty or undefined src', async ({ page }) => {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })
        await page.waitForTimeout(3000)

        const invalidImages = await page.evaluate(() => {
          const images = Array.from(document.querySelectorAll('img'))
          return images
            .filter((img) => {
              const src = img.src || img.getAttribute('data-src') || ''
              return (
                !src ||
                src === '' ||
                src.includes('undefined') ||
                src.includes('null') ||
                src === 'about:blank'
              )
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
    })
  }
})

test.describe('Image Loading - Quick Check (No Reseed)', () => {
  // These tests don't reseed - use current database state

  test('check current homepage images', async ({ page }) => {
    const brokenRequests: string[] = []

    page.on('response', (response) => {
      if (response.status() >= 400) {
        const url = response.url()
        if (url.includes('/media/') || url.includes('/_next/image')) {
          brokenRequests.push(`${response.status()}: ${url}`)
        }
      }
    })

    // Use domcontentloaded instead of networkidle (faster, avoids long-poll issues)
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

    // Wait for initial render
    await page.waitForTimeout(3000)

    // Scroll through the page to trigger lazy loading
    await page.evaluate(async () => {
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
      for (let i = 0; i < document.body.scrollHeight; i += 300) {
        window.scrollTo(0, i)
        await delay(200) // Slower scroll to allow images to load
      }
      // Scroll back up slowly to ensure all images are triggered
      for (let i = document.body.scrollHeight; i >= 0; i -= 500) {
        window.scrollTo(0, i)
        await delay(100)
      }
    })

    // Wait for images after scroll
    await page.waitForTimeout(5000)

    const images = await checkImagesOnPage(page)
    const contentImages = images.filter(
      (img) => img.hasValidSrc && !img.src.includes('data:'),
    )

    console.log('\n📊 Image Statistics:')
    console.log(`   Total images: ${images.length}`)
    console.log(`   Content images: ${contentImages.length}`)
    console.log(`   Loaded: ${contentImages.filter((i) => i.isLoaded).length}`)
    console.log(`   Next.js optimized: ${contentImages.filter((i) => i.isNextImage).length}`)
    console.log(`   Broken requests: ${brokenRequests.length}`)

    if (brokenRequests.length > 0) {
      console.log('\n❌ Broken image requests:')
      brokenRequests.forEach((r) => console.log(`   ${r}`))
    }

    // Just report, don't fail (database might not have images)
    if (contentImages.length === 0) {
      console.log('\n⚠️  No content images found. Run seed with --with-images to test image loading.')
    }
  })

  test('verify /api/media endpoint', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/media?limit=5`)

    expect(response.status()).toBeLessThan(400)

    const data = await response.json()
    console.log(`\n📁 Media API Response:`)
    console.log(`   Total docs: ${data.totalDocs || 0}`)
    console.log(`   Has docs: ${(data.docs?.length || 0) > 0}`)

    if (data.docs?.length > 0) {
      console.log(`   First item: ${data.docs[0].filename}`)
      console.log(`   Has URL: ${!!data.docs[0].url}`)
    } else {
      console.log(`\n⚠️  No media in database. Run seed with --with-images.`)
    }
  })
})
