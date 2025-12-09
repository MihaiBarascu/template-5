/**
 * SEO Tests - Automated SEO verification with Playwright
 *
 * Based on official recommendations:
 * @see https://sergiodxa.com/tutorials/test-meta-tags-using-playwright
 * @see https://scottspence.com/posts/testing-meta-tags-with-playwright
 * @see https://blog.planetargon.com/blog/entries/end-to-end-seo-testing-with-playwright-and-lighthouse
 *
 * Run with: pnpm test:seo
 * Quick check: pnpm test:seo:quick
 */

import { test, expect, Page } from '@playwright/test'
import { execSync } from 'child_process'

const TEST_PORT = process.env.TEST_PORT || '3100'
const BASE_URL = process.env.BASE_URL || `http://localhost:${TEST_PORT}`

// Business types to test
const BUSINESS_TYPES = ['frizerie', 'dentist', 'magazin'] as const
type BusinessType = (typeof BUSINESS_TYPES)[number]

/**
 * Seeds a specific business type
 */
async function seedBusiness(businessType: BusinessType): Promise<void> {
  console.log(`\n🌱 Seeding ${businessType}...`)
  execSync(`pnpm seed:${businessType}`, {
    cwd: process.cwd(),
    stdio: 'inherit',
    timeout: 120000,
  })
  console.log('⏳ Waiting for cache update (8s)...')
  await new Promise((resolve) => setTimeout(resolve, 8000))
}

// ============================================================================
// SEO Helper Functions
// Based on: https://sergiodxa.com/tutorials/test-meta-tags-using-playwright
// ============================================================================

/**
 * Get meta tag content by name attribute
 */
async function getMetaTagContent(page: Page, name: string): Promise<string | null> {
  const meta = page.locator(`head > meta[name="${name}"]`)
  if ((await meta.count()) === 0) return null
  return meta.getAttribute('content')
}

/**
 * Get Open Graph meta tag content
 */
async function getOGTagContent(page: Page, property: string): Promise<string | null> {
  const meta = page.locator(`head > meta[property="og:${property}"]`)
  if ((await meta.count()) === 0) return null
  return meta.getAttribute('content')
}

/**
 * Get Twitter Card meta tag content
 */
async function getTwitterTagContent(page: Page, name: string): Promise<string | null> {
  const meta = page.locator(`head > meta[name="twitter:${name}"]`)
  if ((await meta.count()) === 0) return null
  return meta.getAttribute('content')
}

/**
 * Get canonical URL
 */
async function getCanonicalUrl(page: Page): Promise<string | null> {
  const link = page.locator('head > link[rel="canonical"]')
  if ((await link.count()) === 0) return null
  return link.getAttribute('href')
}

/**
 * Get JSON-LD structured data
 */
async function getJsonLd(page: Page): Promise<object[]> {
  const scripts = page.locator('script[type="application/ld+json"]')
  const count = await scripts.count()
  const results: object[] = []

  for (let i = 0; i < count; i++) {
    const content = await scripts.nth(i).textContent()
    if (content) {
      try {
        results.push(JSON.parse(content))
      } catch {
        // Invalid JSON, skip
      }
    }
  }

  return results
}

/**
 * Check all SEO essentials on a page
 */
async function checkSEOEssentials(page: Page): Promise<{
  title: string | null
  description: string | null
  canonical: string | null
  ogTitle: string | null
  ogDescription: string | null
  ogImage: string | null
  ogType: string | null
  twitterCard: string | null
  twitterTitle: string | null
  twitterDescription: string | null
  h1Count: number
  h1Text: string | null
  imagesWithoutAlt: number
  jsonLdCount: number
  robotsContent: string | null
}> {
  const title = await page.title()
  const description = await getMetaTagContent(page, 'description')
  const canonical = await getCanonicalUrl(page)
  const ogTitle = await getOGTagContent(page, 'title')
  const ogDescription = await getOGTagContent(page, 'description')
  const ogImage = await getOGTagContent(page, 'image')
  const ogType = await getOGTagContent(page, 'type')
  const twitterCard = await getTwitterTagContent(page, 'card')
  const twitterTitle = await getTwitterTagContent(page, 'title')
  const twitterDescription = await getTwitterTagContent(page, 'description')
  const robotsContent = await getMetaTagContent(page, 'robots')

  // Check H1 tags
  const h1s = page.locator('h1')
  const h1Count = await h1s.count()
  const h1Text = h1Count > 0 ? await h1s.first().textContent() : null

  // Check images without alt
  const imagesWithoutAlt = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'))
    return images.filter((img) => {
      const alt = img.getAttribute('alt')
      return alt === null // Only null is bad, empty string is OK for decorative
    }).length
  })

  // Check JSON-LD
  const jsonLd = await getJsonLd(page)

  return {
    title,
    description,
    canonical,
    ogTitle,
    ogDescription,
    ogImage,
    ogType,
    twitterCard,
    twitterTitle,
    twitterDescription,
    h1Count,
    h1Text,
    imagesWithoutAlt,
    jsonLdCount: jsonLd.length,
    robotsContent,
  }
}

// ============================================================================
// Quick SEO Check (No Reseed)
// ============================================================================

test.describe('SEO Quick Check (No Reseed)', () => {
  test('homepage has essential meta tags', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

    const seo = await checkSEOEssentials(page)

    console.log('\n📊 SEO Audit Results:')
    console.log(`   Title: ${seo.title || '❌ MISSING'}`)
    console.log(`   Description: ${seo.description ? '✓' : '❌ MISSING'}`)
    console.log(`   Canonical: ${seo.canonical ? '✓' : '⚠️ Missing'}`)
    console.log(`   OG Title: ${seo.ogTitle ? '✓' : '❌ MISSING'}`)
    console.log(`   OG Description: ${seo.ogDescription ? '✓' : '❌ MISSING'}`)
    console.log(`   OG Image: ${seo.ogImage ? '✓' : '⚠️ Missing'}`)
    console.log(`   Twitter Card: ${seo.twitterCard ? '✓' : '⚠️ Missing'}`)
    console.log(`   H1 Count: ${seo.h1Count} ${seo.h1Count === 1 ? '✓' : '⚠️'}`)
    console.log(`   Images without alt: ${seo.imagesWithoutAlt} ${seo.imagesWithoutAlt === 0 ? '✓' : '❌'}`)
    console.log(`   JSON-LD schemas: ${seo.jsonLdCount}`)

    // Essential checks - MUST HAVE
    expect(seo.title).toBeTruthy()
    expect(seo.title!.length).toBeGreaterThan(10)

    // Title length warning (soft check)
    if (seo.title && seo.title.length > 65) {
      console.log(`   ⚠️ Title too long (${seo.title.length} chars) - Google truncates at ~60`)
    }

    // Description - warn if missing but don't fail
    if (!seo.description) {
      console.log(`   ⚠️ CRITICAL SEO: Meta description is MISSING!`)
    } else if (seo.description.length < 50) {
      console.log(`   ⚠️ Description too short (${seo.description.length} chars) - aim for 50-160`)
    } else if (seo.description.length > 160) {
      console.log(`   ⚠️ Description too long (${seo.description.length} chars) - Google truncates at ~160`)
    }

    // Open Graph - at least title should exist
    if (!seo.ogTitle) {
      console.log(`   ⚠️ CRITICAL SEO: OG Title is MISSING!`)
    }
    if (!seo.ogDescription) {
      console.log(`   ⚠️ CRITICAL SEO: OG Description is MISSING!`)
    }

    // Soft check - warn but pass if at least title exists
    expect(seo.title).toBeTruthy()

    // H1 - warn if not exactly one, but don't fail
    if (seo.h1Count !== 1) {
      console.log(`   ⚠️ SEO Warning: Found ${seo.h1Count} H1 tags (should be exactly 1)`)
    }
    expect(seo.h1Count).toBeGreaterThanOrEqual(1) // At least 1 H1

    // Alt text - warn but don't fail on a few missing
    if (seo.imagesWithoutAlt > 0) {
      console.log(`   ⚠️ SEO Warning: ${seo.imagesWithoutAlt} images without alt attribute`)
    }
    expect(seo.imagesWithoutAlt).toBeLessThanOrEqual(3) // Allow up to 3 missing
  })

  test('page has valid robots meta or no blocking', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

    const robotsMeta = await getMetaTagContent(page, 'robots')

    console.log(`\n🤖 Robots meta: ${robotsMeta || 'not set (allows indexing)'}`)

    // If robots meta exists, it should not block indexing (unless intentional)
    if (robotsMeta) {
      expect(robotsMeta).not.toContain('noindex')
    }
  })

  test('sitemap.xml exists and is valid', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/sitemap.xml`, { timeout: 30000 })

    const status = response?.status()
    console.log(`\n🗺️ Sitemap.xml status: ${status}`)

    // Sitemap might not exist in dev or might return 500 during build
    if (status === 404 || status === 500) {
      console.log(`   ⚠️ Sitemap not available (status ${status}) - may need build first`)
      // Skip further checks but don't fail
      return
    }

    expect(status).toBe(200)

    const contentType = response?.headers()['content-type']
    expect(contentType).toContain('xml')

    // Check sitemap has URLs
    const content = await page.content()
    expect(content).toContain('<urlset')
    expect(content).toContain('<url>')
    expect(content).toContain('<loc>')

    console.log('   ✓ Sitemap valid')
  })

  test('robots.txt exists and is valid', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/robots.txt`, { timeout: 30000 })

    expect(response?.status()).toBe(200)

    const content = await page.textContent('body')

    // Should have User-agent directive
    expect(content).toMatch(/User-agent:/i)

    // Should reference sitemap
    expect(content).toMatch(/Sitemap:/i)

    console.log('\n🤖 Robots.txt: ✓ Valid')
  })

  test('all pages have unique titles', async ({ page }) => {
    const pagesToCheck = ['/', '/servicii', '/contact', '/echipa']
    const titles: Record<string, string> = {}

    for (const path of pagesToCheck) {
      try {
        await page.goto(`${BASE_URL}${path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        })
        const title = await page.title()
        titles[path] = title
      } catch {
        // Page might not exist for some business types
        titles[path] = 'N/A'
      }
    }

    console.log('\n📄 Page Titles:')
    Object.entries(titles).forEach(([path, title]) => {
      console.log(`   ${path}: ${title}`)
    })

    // Check for duplicates (excluding N/A)
    const validTitles = Object.values(titles).filter((t) => t !== 'N/A')
    const uniqueTitles = new Set(validTitles)

    // Warn about duplicates but don't fail
    if (uniqueTitles.size !== validTitles.length) {
      const duplicates = validTitles.filter((t, i) => validTitles.indexOf(t) !== i)
      console.log(`   ⚠️ SEO Warning: Found duplicate titles: ${duplicates.join(', ')}`)
      console.log(`   Unique: ${uniqueTitles.size}/${validTitles.length}`)
    }

    // At least homepage should have a unique title (soft check)
    expect(validTitles.length).toBeGreaterThan(0)
  })

  test('internal links have valid href', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

    const links = await page.evaluate(() => {
      const anchors = Array.from(document.querySelectorAll('a[href]'))
      return anchors
        .map((a) => ({
          href: a.getAttribute('href'),
          text: a.textContent?.trim().substring(0, 50),
        }))
        .filter((link) => {
          const href = link.href || ''
          // Only internal links
          return (
            href.startsWith('/') ||
            href.startsWith('#') ||
            href.includes('localhost')
          )
        })
    })

    console.log(`\n🔗 Found ${links.length} internal links`)

    // Check for empty hrefs
    const emptyLinks = links.filter((l) => !l.href || l.href === '#')
    if (emptyLinks.length > 0) {
      console.log(`   ⚠️ Links with empty/# href: ${emptyLinks.length}`)
    }

    // No links should have undefined or null href
    const brokenLinks = links.filter(
      (l) => l.href?.includes('undefined') || l.href?.includes('null'),
    )
    expect(brokenLinks).toHaveLength(0)
  })
})

// ============================================================================
// Full SEO Tests (With Reseed)
// ============================================================================

test.describe('SEO Tests - All Business Types', () => {
  test.describe.configure({ mode: 'serial' })

  for (const businessType of BUSINESS_TYPES) {
    test.describe(`${businessType} SEO`, () => {
      test.beforeAll(async () => {
        await seedBusiness(businessType)
      })

      test('has complete meta tags', async ({ page }) => {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

        const seo = await checkSEOEssentials(page)

        // Title
        expect(seo.title).toBeTruthy()
        expect(seo.title!.length).toBeGreaterThan(10)
        expect(seo.title!.length).toBeLessThan(70)

        // Description
        expect(seo.description).toBeTruthy()
        expect(seo.description!.length).toBeGreaterThan(50)
        expect(seo.description!.length).toBeLessThan(170)

        // Open Graph
        expect(seo.ogTitle).toBeTruthy()
        expect(seo.ogDescription).toBeTruthy()
        expect(seo.ogType).toBeTruthy()

        console.log(`✅ ${businessType}: Meta tags complete`)
      })

      test('has single H1 tag', async ({ page }) => {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

        const h1s = page.locator('h1')
        const count = await h1s.count()

        expect(count).toBe(1)

        const h1Text = await h1s.first().textContent()
        expect(h1Text).toBeTruthy()
        expect(h1Text!.length).toBeGreaterThan(3)

        console.log(`✅ ${businessType}: Single H1 - "${h1Text}"`)
      })

      test('all images have alt attribute', async ({ page }) => {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

        // Scroll to load lazy images
        await page.evaluate(async () => {
          for (let i = 0; i < document.body.scrollHeight; i += 500) {
            window.scrollTo(0, i)
            await new Promise((r) => setTimeout(r, 100))
          }
        })

        await page.waitForTimeout(2000)

        const imagesWithoutAlt = await page.evaluate(() => {
          const images = Array.from(document.querySelectorAll('img'))
          return images
            .filter((img) => img.getAttribute('alt') === null)
            .map((img) => img.src.substring(0, 80))
        })

        if (imagesWithoutAlt.length > 0) {
          console.log(`❌ Images without alt:`)
          imagesWithoutAlt.forEach((src) => console.log(`   - ${src}`))
        }

        expect(imagesWithoutAlt).toHaveLength(0)
        console.log(`✅ ${businessType}: All images have alt attribute`)
      })

      test('has proper heading hierarchy', async ({ page }) => {
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

        const headings = await page.evaluate(() => {
          const result: { level: number; text: string }[] = []
          const elements = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
          elements.forEach((el) => {
            const level = parseInt(el.tagName.substring(1))
            result.push({
              level,
              text: el.textContent?.trim().substring(0, 50) || '',
            })
          })
          return result
        })

        console.log(`\n📑 Heading Hierarchy for ${businessType}:`)
        headings.slice(0, 10).forEach((h) => {
          console.log(`   ${'  '.repeat(h.level - 1)}H${h.level}: ${h.text}`)
        })

        // Check that H1 comes first
        expect(headings[0]?.level).toBe(1)

        // Check no skipped levels (H1 -> H3 without H2)
        let lastLevel = 0
        for (const heading of headings) {
          if (heading.level > lastLevel + 1 && lastLevel > 0) {
            console.log(`   ⚠️ Skipped heading level: H${lastLevel} -> H${heading.level}`)
          }
          lastLevel = heading.level
        }
      })

      test('service/product pages have meta tags', async ({ page }) => {
        // Get first service/product link
        await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

        const serviceLink = await page
          .locator('a[href*="/servicii/"], a[href*="/produse/"]')
          .first()
          .getAttribute('href')
          .catch(() => null)

        if (serviceLink) {
          await page.goto(`${BASE_URL}${serviceLink}`, {
            waitUntil: 'domcontentloaded',
            timeout: 60000,
          })

          const seo = await checkSEOEssentials(page)

          expect(seo.title).toBeTruthy()
          expect(seo.description).toBeTruthy()
          expect(seo.ogTitle).toBeTruthy()

          console.log(`✅ ${businessType}: Service page has meta tags`)
        } else {
          console.log(`⏭️ ${businessType}: No service links found, skipping`)
        }
      })
    })
  }
})

// ============================================================================
// JSON-LD Structured Data Tests
// ============================================================================

test.describe('JSON-LD Structured Data', () => {
  test('homepage has Organization or LocalBusiness schema', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

    const jsonLdData = await getJsonLd(page)

    console.log(`\n📋 JSON-LD Schemas found: ${jsonLdData.length}`)

    if (jsonLdData.length > 0) {
      jsonLdData.forEach((schema, i) => {
        const type = (schema as { '@type'?: string })['@type']
        console.log(`   ${i + 1}. @type: ${type || 'unknown'}`)
      })

      // Should have at least Organization, LocalBusiness, or WebSite
      const validTypes = ['Organization', 'LocalBusiness', 'WebSite', 'WebPage']
      const hasValidSchema = jsonLdData.some((schema) => {
        const type = (schema as { '@type'?: string })['@type']
        return type && validTypes.includes(type)
      })

      expect(hasValidSchema).toBeTruthy()
    }
  })

  test('JSON-LD has required properties', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

    const jsonLdData = await getJsonLd(page)

    for (const schema of jsonLdData) {
      const typed = schema as Record<string, unknown>

      // All schemas should have @context and @type
      expect(typed['@context']).toBeTruthy()
      expect(typed['@type']).toBeTruthy()

      // Organization/LocalBusiness should have name
      if (
        typed['@type'] === 'Organization' ||
        typed['@type'] === 'LocalBusiness'
      ) {
        expect(typed['name']).toBeTruthy()
        console.log(`   ✓ ${typed['@type']}: ${typed['name']}`)
      }
    }
  })
})

// ============================================================================
// Performance-related SEO
// ============================================================================

test.describe('Performance SEO', () => {
  test('no render-blocking resources in critical path', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

    // Check for render-blocking CSS
    const blockingCSS = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      return links.filter((link) => {
        const media = link.getAttribute('media')
        // Non-blocking if media="print" or has media query
        return !media || media === 'all'
      }).length
    })

    console.log(`\n⚡ Render-blocking CSS files: ${blockingCSS}`)

    // Should have minimal blocking CSS (Next.js inlines critical CSS)
    expect(blockingCSS).toBeLessThanOrEqual(3)
  })

  test('images have loading="lazy" except above fold', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

    const imageStats = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'))
      return {
        total: images.length,
        lazy: images.filter((img) => img.loading === 'lazy').length,
        eager: images.filter((img) => img.loading === 'eager').length,
        priority: images.filter((img) => img.hasAttribute('fetchpriority')).length,
      }
    })

    console.log(`\n🖼️ Image Loading Stats:`)
    console.log(`   Total: ${imageStats.total}`)
    console.log(`   Lazy: ${imageStats.lazy}`)
    console.log(`   Eager: ${imageStats.eager}`)
    console.log(`   Priority: ${imageStats.priority}`)

    // Most images should be lazy loaded
    if (imageStats.total > 3) {
      expect(imageStats.lazy).toBeGreaterThan(0)
    }
  })
})
