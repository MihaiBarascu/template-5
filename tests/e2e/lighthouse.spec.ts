/**
 * Lighthouse Performance & SEO Audit Tests
 *
 * Uses playwright-lighthouse to run Google Lighthouse audits
 * @see https://github.com/nicholasErasmo/playwright-lighthouse
 * @see https://blog.planetargon.com/blog/entries/end-to-end-seo-testing-with-playwright-and-lighthouse
 *
 * IMPORTANT: Lighthouse tests require:
 * - Single worker (--workers=1)
 * - Chromium browser only
 * - Port for remote debugging
 *
 * Run with: pnpm test:lighthouse
 */

import { test, devices } from '@playwright/test'
import { playAudit } from 'playwright-lighthouse'
import { chromium } from 'playwright'

const TEST_PORT = process.env.TEST_PORT || '3100'
const BASE_URL = process.env.BASE_URL || `http://localhost:${TEST_PORT}`

// Lighthouse thresholds (0-100)
// Adjust these based on your requirements
const THRESHOLDS = {
  performance: 50, // Lower for dev, increase for production
  accessibility: 70,
  'best-practices': 70,
  seo: 70,
}

// Stricter thresholds for production
const PRODUCTION_THRESHOLDS = {
  performance: 70,
  accessibility: 85,
  'best-practices': 85,
  seo: 85,
}

// Use production thresholds in CI
const activeThresholds = process.env.CI ? PRODUCTION_THRESHOLDS : THRESHOLDS


test.describe('Lighthouse Audits', () => {
  // Lighthouse needs a fresh browser with remote debugging
  test.describe.configure({ mode: 'serial' })

  test('homepage performance audit', async () => {
    // Launch browser with remote debugging port
    const browser = await chromium.launch({
      args: ['--remote-debugging-port=9222'],
    })

    const page = await browser.newPage()

    try {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

      // Run Lighthouse audit
      const result = await playAudit({
        page,
        port: 9222,
        thresholds: activeThresholds,
        reports: {
          formats: {
            html: true,
          },
          name: 'lighthouse-homepage',
          directory: './tests/e2e/lighthouse-reports',
        },
      })

      console.log('\n🔦 Lighthouse Scores (Homepage):')
      console.log(`   Performance: ${result.lhr.categories.performance?.score ? Math.round(result.lhr.categories.performance.score * 100) : 'N/A'}`)
      console.log(`   Accessibility: ${result.lhr.categories.accessibility?.score ? Math.round(result.lhr.categories.accessibility.score * 100) : 'N/A'}`)
      console.log(`   Best Practices: ${result.lhr.categories['best-practices']?.score ? Math.round(result.lhr.categories['best-practices'].score * 100) : 'N/A'}`)
      console.log(`   SEO: ${result.lhr.categories.seo?.score ? Math.round(result.lhr.categories.seo.score * 100) : 'N/A'}`)
    } finally {
      await browser.close()
    }
  })

  test('service page audit', async () => {
    const browser = await chromium.launch({
      args: ['--remote-debugging-port=9223'],
    })

    const page = await browser.newPage()

    try {
      // First go to homepage to find a service link
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

      const serviceLink = await page
        .locator('a[href*="/servicii/"]')
        .first()
        .getAttribute('href')
        .catch(() => null)

      if (!serviceLink) {
        console.log('⏭️ No service pages found, skipping audit')
        return
      }

      await page.goto(`${BASE_URL}${serviceLink}`, {
        waitUntil: 'domcontentloaded',
        timeout: 60000,
      })

      const result = await playAudit({
        page,
        port: 9223,
        thresholds: {
          ...activeThresholds,
          performance: activeThresholds.performance - 10, // Slightly lower for detail pages
        },
        reports: {
          formats: {
            html: true,
          },
          name: 'lighthouse-service',
          directory: './tests/e2e/lighthouse-reports',
        },
      })

      console.log('\n🔦 Lighthouse Scores (Service Page):')
      console.log(`   Performance: ${result.lhr.categories.performance?.score ? Math.round(result.lhr.categories.performance.score * 100) : 'N/A'}`)
      console.log(`   Accessibility: ${result.lhr.categories.accessibility?.score ? Math.round(result.lhr.categories.accessibility.score * 100) : 'N/A'}`)
      console.log(`   Best Practices: ${result.lhr.categories['best-practices']?.score ? Math.round(result.lhr.categories['best-practices'].score * 100) : 'N/A'}`)
      console.log(`   SEO: ${result.lhr.categories.seo?.score ? Math.round(result.lhr.categories.seo.score * 100) : 'N/A'}`)
    } finally {
      await browser.close()
    }
  })
})

// ============================================================================
// Mobile Performance Test
// ============================================================================

test.describe('Lighthouse Mobile Audits', () => {
  test.describe.configure({ mode: 'serial' })

  test('homepage mobile performance', async () => {
    const browser = await chromium.launch({
      args: ['--remote-debugging-port=9224'],
    })

    const context = await browser.newContext({
      ...devices['Pixel 5'],
    })

    const page = await context.newPage()

    try {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

      const result = await playAudit({
        page,
        port: 9224,
        thresholds: {
          ...activeThresholds,
          performance: activeThresholds.performance - 15, // Mobile is slower
        },
        reports: {
          formats: {
            html: true,
          },
          name: 'lighthouse-mobile',
          directory: './tests/e2e/lighthouse-reports',
        },
      })

      console.log('\n📱 Lighthouse Mobile Scores:')
      console.log(`   Performance: ${result.lhr.categories.performance?.score ? Math.round(result.lhr.categories.performance.score * 100) : 'N/A'}`)
      console.log(`   Accessibility: ${result.lhr.categories.accessibility?.score ? Math.round(result.lhr.categories.accessibility.score * 100) : 'N/A'}`)
      console.log(`   Best Practices: ${result.lhr.categories['best-practices']?.score ? Math.round(result.lhr.categories['best-practices'].score * 100) : 'N/A'}`)
      console.log(`   SEO: ${result.lhr.categories.seo?.score ? Math.round(result.lhr.categories.seo.score * 100) : 'N/A'}`)
    } finally {
      await browser.close()
    }
  })
})

// ============================================================================
// Quick Lighthouse Check (No Thresholds - Just Report)
// ============================================================================

test.describe('Lighthouse Quick Report', () => {
  test('generate report without failing', async () => {
    const browser = await chromium.launch({
      args: ['--remote-debugging-port=9225'],
    })

    const page = await browser.newPage()

    try {
      await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 })

      // Run with minimal thresholds (1) - just generate report, never fail
      const result = await playAudit({
        page,
        port: 9225,
        thresholds: {
          performance: 1,
          accessibility: 1,
          'best-practices': 1,
          seo: 1,
        },
        reports: {
          formats: {
            html: true,
            json: true,
          },
          name: `lighthouse-report-${new Date().toISOString().split('T')[0]}`,
          directory: './tests/e2e/lighthouse-reports',
        },
      })

      const scores = {
        performance: result.lhr.categories.performance?.score
          ? Math.round(result.lhr.categories.performance.score * 100)
          : 0,
        accessibility: result.lhr.categories.accessibility?.score
          ? Math.round(result.lhr.categories.accessibility.score * 100)
          : 0,
        bestPractices: result.lhr.categories['best-practices']?.score
          ? Math.round(result.lhr.categories['best-practices'].score * 100)
          : 0,
        seo: result.lhr.categories.seo?.score
          ? Math.round(result.lhr.categories.seo.score * 100)
          : 0,
      }

      console.log('\n🔦 Lighthouse Report Generated:')
      console.log('┌─────────────────┬───────┐')
      console.log(`│ Performance     │  ${scores.performance.toString().padStart(3)}  │`)
      console.log(`│ Accessibility   │  ${scores.accessibility.toString().padStart(3)}  │`)
      console.log(`│ Best Practices  │  ${scores.bestPractices.toString().padStart(3)}  │`)
      console.log(`│ SEO             │  ${scores.seo.toString().padStart(3)}  │`)
      console.log('└─────────────────┴───────┘')
      console.log('\n📄 Reports saved to: tests/e2e/lighthouse-reports/')

      // Warn about low scores but don't fail
      if (scores.performance < 50) {
        console.log('⚠️ Performance score is low - consider optimization')
      }
      if (scores.accessibility < 70) {
        console.log('⚠️ Accessibility score is low - check contrast and ARIA')
      }
      if (scores.seo < 70) {
        console.log('⚠️ SEO score is low - check meta tags and structure')
      }
    } finally {
      await browser.close()
    }
  })
})
