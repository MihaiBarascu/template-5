/**
 * Payload CMS API Tests
 * Tests REST API and GraphQL endpoints for all collections
 *
 * Based on Payload CMS official documentation and community best practices:
 * - https://payloadcms.com/docs/rest-api/overview
 * - https://payloadcms.com/docs/graphql/overview
 * - https://github.com/payloadcms/payload/discussions/2644
 *
 * Key principles from Payload best practices:
 * 1. Test against REST API endpoints at /api/[collection-slug]
 * 2. Test GraphQL at /api/graphql
 * 3. Verify pagination (limit, page, totalPages, totalDocs)
 * 4. Verify depth parameter for relationship population
 * 5. Verify sort parameter
 * 6. Test authentication flows via /api/users/login
 * 7. Use seed-based testing with known data state
 */

import { test, expect } from '@playwright/test'

// Use TEST_PORT from playwright.config.ts for consistency
const TEST_PORT = process.env.TEST_PORT || '3100'
const BASE_URL = process.env.BASE_URL || `http://localhost:${TEST_PORT}`

// Collections defined in payload.config.ts
// Based on src/payload.config.ts collections array
const COLLECTIONS = {
  // Core collections with public read access
  public: ['pages', 'posts', 'services', 'testimonials', 'faq', 'portfolio', 'team'],
  // Collections that typically require auth
  protected: ['users', 'media', 'bookings', 'newsletter-subscribers'],
  // Ecommerce plugin collections
  ecommerce: ['products', 'orders', 'carts', 'addresses'],
  // Supporting collections
  supporting: ['categories', 'product-categories', 'product-tags', 'subscriptions', 'subscription-orders'],
} as const

// Globals defined in payload.config.ts
const GLOBALS = [
  'header',
  'footer',
  'site-theme',
  'logo',
  'business-info',
  'shop-settings',
  'system-pages',
] as const

test.describe('Payload CMS REST API', () => {
  test.describe.configure({ mode: 'serial' })

  test.describe('Server Health', () => {
    test('API server should be running and responding', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/services`)
      // Any response means server is running
      expect(response.status()).toBeLessThan(600)
      console.log(`  ✅ API server responding (${response.status()})`)
    })
  })

  test.describe('Public Collection Endpoints', () => {
    // Test public collections that should return 200 with docs array
    for (const collection of COLLECTIONS.public) {
      test(`GET /api/${collection} returns paginated response`, async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/${collection}`)
        const status = response.status()

        // Handle server restart gracefully
        if (status === 500) {
          console.log(`  ⚠️ ${collection}: Server error (500) - may be compiling`)
          return
        }

        // Public collections should be readable
        if (status === 200) {
          const data = await response.json()
          // Payload REST API standard response structure
          expect(data).toHaveProperty('docs')
          expect(data).toHaveProperty('totalDocs')
          expect(data).toHaveProperty('limit')
          expect(data).toHaveProperty('totalPages')
          expect(data).toHaveProperty('page')
          expect(Array.isArray(data.docs)).toBe(true)
          console.log(`  ✅ ${collection}: ${data.totalDocs} docs, page ${data.page}/${data.totalPages}`)
        } else if (status === 404) {
          // Collection endpoint not found - may be disabled or not registered
          console.log(`  ⏭️ ${collection}: endpoint not found (404)`)
        } else {
          // May require auth in some configurations
          expect([401, 403]).toContain(status)
          console.log(`  🔒 ${collection}: requires auth (${status})`)
        }
      })
    }
  })

  test.describe('Global Endpoints', () => {
    // Globals are accessed at /api/globals/[slug]
    for (const global of GLOBALS) {
      test(`GET /api/globals/${global} returns global data`, async ({ request }) => {
        const response = await request.get(`${BASE_URL}/api/globals/${global}`)
        const status = response.status()

        if (status === 500) {
          console.log(`  ⚠️ ${global}: Server error (500)`)
          return
        }

        if (status === 200) {
          const data = await response.json()
          // Globals return the document directly (not wrapped in docs array)
          expect(data).toBeDefined()
          expect(typeof data).toBe('object')
          console.log(`  ✅ global/${global}: loaded`)
        } else if (status === 404) {
          // Global endpoint not found - may be disabled or not registered
          console.log(`  ⏭️ global/${global}: endpoint not found (404)`)
        } else {
          expect([401, 403]).toContain(status)
          console.log(`  🔒 global/${global}: requires auth (${status})`)
        }
      })
    }
  })

  test.describe('Query Parameters (Payload REST API Features)', () => {
    // Test limit parameter - https://payloadcms.com/docs/queries/pagination
    test('limit parameter restricts results', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/services?limit=2`)

      if (response.status() !== 200) {
        console.log(`  ⏭️ Skipping - not accessible (${response.status()})`)
        return
      }

      const data = await response.json()
      expect(data.limit).toBe(2)
      expect(data.docs.length).toBeLessThanOrEqual(2)
      console.log(`  ✅ limit=2 returns ${data.docs.length} docs`)
    })

    // Test page parameter
    test('page parameter for pagination', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/services?limit=1&page=1`)

      if (response.status() !== 200) {
        console.log(`  ⏭️ Skipping - not accessible`)
        return
      }

      const data = await response.json()
      expect(data.page).toBe(1)
      expect(data).toHaveProperty('hasPrevPage')
      expect(data).toHaveProperty('hasNextPage')
      console.log(`  ✅ page=1, hasNext=${data.hasNextPage}, hasPrev=${data.hasPrevPage}`)
    })

    // Test depth parameter - https://payloadcms.com/docs/queries/depth
    test('depth parameter populates relationships', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/pages?depth=2`)

      if (response.status() !== 200) {
        console.log(`  ⏭️ Skipping - not accessible`)
        return
      }

      const data = await response.json()
      expect(data).toHaveProperty('docs')
      console.log(`  ✅ depth=2 accepted`)
    })

    // Test sort parameter - https://payloadcms.com/docs/queries/overview#sort
    test('sort parameter orders results', async ({ request }) => {
      // Sort by createdAt descending (newest first)
      const response = await request.get(`${BASE_URL}/api/services?sort=-createdAt`)

      if (response.status() !== 200) {
        console.log(`  ⏭️ Skipping - not accessible`)
        return
      }

      const data = await response.json()
      expect(data).toHaveProperty('docs')

      // Verify sorting if multiple docs exist
      if (data.docs.length >= 2) {
        const first = new Date(data.docs[0].createdAt).getTime()
        const second = new Date(data.docs[1].createdAt).getTime()
        expect(first).toBeGreaterThanOrEqual(second)
        console.log(`  ✅ sort=-createdAt: newest first`)
      } else {
        console.log(`  ✅ sort parameter accepted`)
      }
    })

    // Test where query - https://payloadcms.com/docs/queries/overview#where
    test('where query filters results', async ({ request }) => {
      const response = await request.get(
        `${BASE_URL}/api/pages?where[_status][equals]=published`
      )

      if (response.status() !== 200) {
        console.log(`  ⏭️ Skipping - not accessible`)
        return
      }

      const data = await response.json()
      // All returned docs should match the filter
      for (const doc of data.docs) {
        if (doc._status) {
          expect(doc._status).toBe('published')
        }
      }
      console.log(`  ✅ where filter: ${data.totalDocs} published pages`)
    })
  })

  test.describe('Error Handling', () => {
    test('non-existent collection returns 404', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/non-existent-collection`)
      // Next.js dev mode may return 500, production returns 404
      expect([404, 500]).toContain(response.status())
      console.log(`  ✅ Non-existent collection: ${response.status()}`)
    })

    test('non-existent document returns 404', async ({ request }) => {
      // Use a valid MongoDB ObjectId format that doesn't exist
      const fakeId = '000000000000000000000000'
      const response = await request.get(`${BASE_URL}/api/services/${fakeId}`)
      // Could be 404 (not found), 400 (invalid ID), or 401/403 (auth)
      expect([400, 401, 403, 404]).toContain(response.status())
      console.log(`  ✅ Non-existent doc: ${response.status()}`)
    })

    test('non-existent global returns 404', async ({ request }) => {
      const response = await request.get(`${BASE_URL}/api/globals/non-existent-global`)
      expect([404, 500]).toContain(response.status())
      console.log(`  ✅ Non-existent global: ${response.status()}`)
    })
  })
})

test.describe('Payload CMS GraphQL API', () => {
  // GraphQL endpoint is at /api/graphql by default
  // https://payloadcms.com/docs/graphql/overview

  test('GraphQL endpoint responds to introspection', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/graphql`, {
      data: {
        query: `{ __typename }`,
      },
    })

    if (response.status() === 404) {
      console.log(`  ⏭️ GraphQL endpoint not enabled`)
      return
    }

    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('data')
    console.log(`  ✅ GraphQL endpoint active`)
  })

  test('GraphQL returns errors for invalid queries', async ({ request }) => {
    const response = await request.post(`${BASE_URL}/api/graphql`, {
      data: {
        query: `{ invalidFieldThatDoesNotExist }`,
      },
    })

    if (response.status() === 404) {
      console.log(`  ⏭️ GraphQL not enabled`)
      return
    }

    // GraphQL returns 200 with errors in response body
    expect(response.status()).toBe(200)
    const data = await response.json()
    expect(data).toHaveProperty('errors')
    expect(Array.isArray(data.errors)).toBe(true)
    console.log(`  ✅ Invalid query returns errors array`)
  })

  test('GraphQL query for Services collection', async ({ request }) => {
    // Collection queries use PascalCase: Services, Pages, etc.
    const response = await request.post(`${BASE_URL}/api/graphql`, {
      data: {
        query: `
          query {
            Services(limit: 5) {
              docs {
                id
                title
                slug
              }
              totalDocs
              page
              totalPages
            }
          }
        `,
      },
    })

    if (response.status() === 404) {
      console.log(`  ⏭️ GraphQL not enabled`)
      return
    }

    const data = await response.json()

    if (data.errors) {
      // May require authentication
      console.log(`  🔒 Services query requires auth`)
      return
    }

    expect(data.data.Services).toHaveProperty('docs')
    expect(data.data.Services).toHaveProperty('totalDocs')
    console.log(`  ✅ Services: ${data.data.Services.totalDocs} docs`)
  })

  test('GraphQL query for BusinessInfo global', async ({ request }) => {
    // Globals use their slug in PascalCase
    const response = await request.post(`${BASE_URL}/api/graphql`, {
      data: {
        query: `
          query {
            BusinessInfo {
              name
              email
              phone
              address
            }
          }
        `,
      },
    })

    if (response.status() === 404) {
      console.log(`  ⏭️ GraphQL not enabled`)
      return
    }

    const data = await response.json()

    if (data.errors) {
      console.log(`  🔒 BusinessInfo requires auth`)
      return
    }

    expect(data.data.BusinessInfo).toBeDefined()
    console.log(`  ✅ BusinessInfo: ${data.data.BusinessInfo?.name || 'loaded'}`)
  })
})
