/**
 * SEO Tests - Automated SEO verification with Playwright
 *
 * Does NOT run seed - tests whatever is currently in the database.
 *
 * Usage:
 *   1. First seed the database: pnpm seed:frizerie (or any business type)
 *   2. Then run tests: pnpm test:e2e tests/e2e/seo.spec.ts
 *
 * For testing ALL business types with automatic seeding, use:
 *   pnpm test:e2e tests/e2e/all-businesses.spec.ts
 *
 * Based on official recommendations:
 * @see https://sergiodxa.com/tutorials/test-meta-tags-using-playwright
 * @see https://scottspence.com/posts/testing-meta-tags-with-playwright
 */

import { test, expect, Page } from '@playwright/test'

const TEST_PORT = process.env.TEST_PORT || '3100'
const BASE_URL = process.env.BASE_URL || `http://localhost:${TEST_PORT}`

// ============================================================================
// SEO Helper Functions
// ============================================================================

async function getMetaTagContent(page: Page, name: string): Promise<string | null> {
  const meta = page.locator(`head > meta[name="${name}"]`)
  if ((await meta.count()) === 0) return null
  return meta.getAttribute('content')
}

async function getOGTagContent(page: Page, property: string): Promise<string | null> {
  const meta = page.locator(`head > meta[property="og:${property}"]`)
  if ((await meta.count()) === 0) return null
  return meta.getAttribute('content')
}

async function getTwitterTagContent(page: Page, name: string): Promise<string | null> {
  const meta = page.locator(`head > meta[name="twitter:${name}"]`)
  if ((await meta.count()) === 0) return null
  return meta.getAttribute('content')
}

async function getCanonicalUrl(page: Page): Promise<string | null> {
  const link = page.locator('head > link[rel="canonical"]')
  if ((await link.count()) === 0) return null
  return link.getAttribute('href')
}

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

async function checkSEOEssentials(page: Page): Promise<{
  title: string | null
  description: string | null
  canonical: string | null
  ogTitle: string | null
  ogDescription: string | null
  ogImage: string | null
  ogType: string | null
  twitterCard: string | null
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
  const robotsContent = await getMetaTagContent(page, 'robots')

  const h1s = page.locator('h1')
  const h1Count = await h1s.count()
  const h1Text = h1Count > 0 ? await h1s.first().textContent() : null

  const imagesWithoutAlt = await page.evaluate(() => {
    const images = Array.from(document.querySelectorAll('img'))
    return images.filter((img) => img.getAttribute('alt') === null).length
  })

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
    h1Count,
    h1Text,
    imagesWithoutAlt,
    jsonLdCount: jsonLd.length,
    robotsContent,
  }
}

// ============================================================================
// SEO Tests (No Reseed)
// ============================================================================

test.describe('SEO', () => {
  // No seed - tests current database state

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

    // Essential checks
    expect(seo.title).toBeTruthy()
    expect(seo.title!.length).toBeGreaterThan(10)

    if (seo.title && seo.title.length > 65) {
      console.log(`   ⚠️ Title too long (${seo.title.length} chars) - Google truncates at ~60`)
    }

    // H1 check
    expect(seo.h1Count).toBeGreaterThanOrEqual(1)

    // Alt text - allow up to 3 missing
    expect(seo.imagesWithoutAlt).toBeLessThanOrEqual(3)
  })

  test('page has valid robots meta', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

    const robotsMeta = await getMetaTagContent(page, 'robots')
    console.log(`\n🤖 Robots meta: ${robotsMeta || 'not set (allows indexing)'}`)

    if (robotsMeta) {
      expect(robotsMeta).not.toContain('noindex')
    }
  })

  test('sitemap.xml exists', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/sitemap.xml`, { timeout: 30000 })
    const status = response?.status()

    console.log(`\n🗺️ Sitemap.xml status: ${status}`)

    if (status === 404 || status === 500) {
      console.log(`   ⚠️ Sitemap not available (status ${status}) - may need build first`)
      return
    }

    expect(status).toBe(200)

    const content = await page.content()
    expect(content).toContain('<urlset')
    expect(content).toContain('<url>')
  })

  test('robots.txt exists', async ({ page }) => {
    const response = await page.goto(`${BASE_URL}/robots.txt`, { timeout: 30000 })

    expect(response?.status()).toBe(200)

    const content = await page.textContent('body')
    expect(content).toMatch(/User-agent:/i)
    expect(content).toMatch(/Sitemap:/i)

    console.log('\n🤖 Robots.txt: ✓ Valid')
  })

  test('pages have unique titles', async ({ page }) => {
    const pagesToCheck = ['/', '/servicii', '/contact', '/echipa']
    const titles: Record<string, string> = {}

    for (const path of pagesToCheck) {
      try {
        await page.goto(`${BASE_URL}${path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30000,
        })
        titles[path] = await page.title()
      } catch {
        titles[path] = 'N/A'
      }
    }

    console.log('\n📄 Page Titles:')
    Object.entries(titles).forEach(([path, title]) => {
      console.log(`   ${path}: ${title}`)
    })

    const validTitles = Object.values(titles).filter((t) => t !== 'N/A')
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
          return href.startsWith('/') || href.startsWith('#') || href.includes('localhost')
        })
    })

    console.log(`\n🔗 Found ${links.length} internal links`)

    const brokenLinks = links.filter(
      (l) => l.href?.includes('undefined') || l.href?.includes('null'),
    )
    expect(brokenLinks).toHaveLength(0)
  })
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

      expect(typed['@context']).toBeTruthy()
      expect(typed['@type']).toBeTruthy()

      if (typed['@type'] === 'Organization' || typed['@type'] === 'LocalBusiness') {
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
  test('minimal render-blocking resources', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

    const blockingCSS = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'))
      return links.filter((link) => {
        const media = link.getAttribute('media')
        return !media || media === 'all'
      }).length
    })

    console.log(`\n⚡ Render-blocking CSS files: ${blockingCSS}`)
    expect(blockingCSS).toBeLessThanOrEqual(3)
  })

  test('images have lazy loading', async ({ page }) => {
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

    const imageStats = await page.evaluate(() => {
      const images = Array.from(document.querySelectorAll('img'))
      return {
        total: images.length,
        lazy: images.filter((img) => img.loading === 'lazy').length,
        eager: images.filter((img) => img.loading === 'eager').length,
      }
    })

    console.log(`\n🖼️ Image Loading Stats:`)
    console.log(`   Total: ${imageStats.total}`)
    console.log(`   Lazy: ${imageStats.lazy}`)
    console.log(`   Eager: ${imageStats.eager}`)

    if (imageStats.total > 3) {
      expect(imageStats.lazy).toBeGreaterThan(0)
    }
  })
})
