/**
 * TEMPLATE: API Testing E2E
 *
 * CUM FOLOSEȘTI:
 * 1. Copiază acest fișier în tests/e2e/
 * 2. Redenumește: api-products.spec.ts, api-orders.spec.ts, etc.
 * 3. Modifică COLLECTION și BASE_URL
 * 4. Rulează: pnpm test:e2e api-products
 *
 * CE TESTEAZĂ:
 * - GET list (cu paginare)
 * - GET single item
 * - POST create (dacă public)
 * - Edge cases: limite, sortare, filtrare
 * - Error handling: 404, invalid params
 */

import { test, expect, request, APIRequestContext } from '@playwright/test'
import { EDGE } from '../data/edge-cases'

// ============================================
// CONFIGURARE - MODIFICĂ AICI
// ============================================

const BASE_URL = 'http://localhost:3100'
const API_BASE = `${BASE_URL}/api`

/** Colecția de testat */
const COLLECTION = 'products' // sau 'pages', 'posts', 'cart', etc.

/** Endpoint-uri */
const ENDPOINTS = {
  list: `${API_BASE}/${COLLECTION}`,
  single: (id: string) => `${API_BASE}/${COLLECTION}/${id}`,
  // Custom endpoints
  // search: `${API_BASE}/${COLLECTION}/search`,
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/** Creează request context */
async function createApiContext(): Promise<APIRequestContext> {
  return await request.newContext({
    baseURL: BASE_URL,
    extraHTTPHeaders: {
      Accept: 'application/json',
    },
  })
}

// ============================================
// TESTE
// ============================================

test.describe(`API: ${COLLECTION}`, () => {
  let api: APIRequestContext

  test.beforeAll(async () => {
    api = await createApiContext()
  })

  test.afterAll(async () => {
    await api.dispose()
  })

  // ------------------------------------------
  // GET List - Listare
  // ------------------------------------------
  test.describe('GET List', () => {
    test('returns list of items', async () => {
      const response = await api.get(ENDPOINTS.list)

      expect(response.status()).toBe(200)

      const data = await response.json()
      expect(data).toHaveProperty('docs')
      expect(Array.isArray(data.docs)).toBe(true)
    })

    test('includes pagination info', async () => {
      const response = await api.get(ENDPOINTS.list)
      const data = await response.json()

      expect(data).toHaveProperty('totalDocs')
      expect(data).toHaveProperty('page')
      expect(data).toHaveProperty('limit')
      expect(data).toHaveProperty('totalPages')
    })

    test('respects limit parameter', async () => {
      const limit = 5
      const response = await api.get(`${ENDPOINTS.list}?limit=${limit}`)
      const data = await response.json()

      expect(data.docs.length).toBeLessThanOrEqual(limit)
      expect(data.limit).toBe(limit)
    })

    test('respects page parameter', async () => {
      const response = await api.get(`${ENDPOINTS.list}?page=2&limit=1`)
      const data = await response.json()

      expect(data.page).toBe(2)
    })
  })

  // ------------------------------------------
  // GET Single - Item individual
  // ------------------------------------------
  test.describe('GET Single', () => {
    test('returns single item by ID', async () => {
      // Mai întâi obține un ID valid
      const listResponse = await api.get(`${ENDPOINTS.list}?limit=1`)
      const listData = await listResponse.json()

      if (listData.docs.length === 0) {
        test.skip() // Skip dacă nu există items
        return
      }

      const itemId = listData.docs[0].id

      // Apoi obține itemul
      const response = await api.get(ENDPOINTS.single(itemId))

      expect(response.status()).toBe(200)

      const data = await response.json()
      expect(data.id).toBe(itemId)
    })

    test('returns 404 for non-existent ID', async () => {
      const fakeId = 'non-existent-id-12345'
      const response = await api.get(ENDPOINTS.single(fakeId))

      expect(response.status()).toBe(404)
    })
  })

  // ------------------------------------------
  // Sorting - Sortare
  // ------------------------------------------
  test.describe('Sorting', () => {
    test('sorts by createdAt ascending', async () => {
      const response = await api.get(`${ENDPOINTS.list}?sort=createdAt`)
      const data = await response.json()

      if (data.docs.length >= 2) {
        const first = new Date(data.docs[0].createdAt).getTime()
        const second = new Date(data.docs[1].createdAt).getTime()
        expect(first).toBeLessThanOrEqual(second)
      }
    })

    test('sorts by createdAt descending', async () => {
      const response = await api.get(`${ENDPOINTS.list}?sort=-createdAt`)
      const data = await response.json()

      if (data.docs.length >= 2) {
        const first = new Date(data.docs[0].createdAt).getTime()
        const second = new Date(data.docs[1].createdAt).getTime()
        expect(first).toBeGreaterThanOrEqual(second)
      }
    })
  })

  // ------------------------------------------
  // Filtering - Filtrare
  // ------------------------------------------
  test.describe('Filtering', () => {
    test('filters by field value', async () => {
      // Exemplu: filtrare după status
      const response = await api.get(`${ENDPOINTS.list}?where[status][equals]=published`)
      const data = await response.json()

      // Toate rezultatele ar trebui să aibă status=published
      for (const doc of data.docs) {
        if (doc.status) {
          expect(doc.status).toBe('published')
        }
      }
    })

    // Adaugă mai multe filtre specifice colecției tale
  })

  // ------------------------------------------
  // Edge Cases - Cazuri extreme
  // ------------------------------------------
  test.describe('Edge Cases', () => {
    test('handles limit=0', async () => {
      const response = await api.get(`${ENDPOINTS.list}?limit=0`)

      // Payload CMS ar trebui să returneze 200 cu limit default sau eroare
      expect([200, 400]).toContain(response.status())
    })

    test('handles negative limit', async () => {
      const response = await api.get(`${ENDPOINTS.list}?limit=-5`)

      expect([200, 400]).toContain(response.status())
    })

    test('handles very large limit', async () => {
      const response = await api.get(`${ENDPOINTS.list}?limit=999999`)

      expect(response.status()).toBe(200)
      // Payload CMS ar trebui să aplice un limit maxim
    })

    test('handles page=0', async () => {
      const response = await api.get(`${ENDPOINTS.list}?page=0`)

      expect([200, 400]).toContain(response.status())
    })

    test('handles negative page', async () => {
      const response = await api.get(`${ENDPOINTS.list}?page=-1`)

      expect([200, 400]).toContain(response.status())
    })

    test('handles page beyond total pages', async () => {
      const response = await api.get(`${ENDPOINTS.list}?page=99999`)

      expect(response.status()).toBe(200)
      const data = await response.json()
      expect(data.docs).toHaveLength(0) // Pagină goală
    })

    test('handles invalid sort field', async () => {
      const response = await api.get(`${ENDPOINTS.list}?sort=nonExistentField`)

      // Nu ar trebui să crape
      expect([200, 400]).toContain(response.status())
    })

    test('handles invalid filter syntax', async () => {
      const response = await api.get(`${ENDPOINTS.list}?where=invalid`)

      expect([200, 400]).toContain(response.status())
    })

    test('handles special characters in query', async () => {
      const response = await api.get(`${ENDPOINTS.list}?where[title][contains]=${encodeURIComponent('<script>')}`)

      expect([200, 400]).toContain(response.status())
    })
  })

  // ------------------------------------------
  // Response Structure - Structură răspuns
  // ------------------------------------------
  test.describe('Response Structure', () => {
    test('returns consistent structure for empty results', async () => {
      // Folosește un filtru care probabil nu returnează nimic
      const response = await api.get(`${ENDPOINTS.list}?where[id][equals]=impossible-id-xyz`)
      const data = await response.json()

      expect(data).toHaveProperty('docs')
      expect(data.docs).toHaveLength(0)
      expect(data).toHaveProperty('totalDocs', 0)
    })

    test('includes required fields in each document', async () => {
      const response = await api.get(`${ENDPOINTS.list}?limit=1`)
      const data = await response.json()

      if (data.docs.length > 0) {
        const doc = data.docs[0]

        // Câmpuri standard Payload CMS
        expect(doc).toHaveProperty('id')
        expect(doc).toHaveProperty('createdAt')
        expect(doc).toHaveProperty('updatedAt')
      }
    })
  })

  // ------------------------------------------
  // Performance - Performanță
  // ------------------------------------------
  test.describe('Performance', () => {
    test('responds within 2 seconds', async () => {
      const start = Date.now()
      const response = await api.get(ENDPOINTS.list)
      const duration = Date.now() - start

      expect(response.status()).toBe(200)
      expect(duration).toBeLessThan(2000)
    })

    test('handles multiple concurrent requests', async () => {
      const requests = Array(5)
        .fill(null)
        .map(() => api.get(ENDPOINTS.list))

      const responses = await Promise.all(requests)

      for (const response of responses) {
        expect(response.status()).toBe(200)
      }
    })
  })
})

// ============================================
// TEMPLATE PENTRU POST/PUT/DELETE
// (Decomentează dacă API-ul permite)
// ============================================

/*
test.describe('POST Create', () => {
  test('creates new item', async () => {
    const newItem = {
      title: 'Test Item',
      // ... alte câmpuri
    }

    const response = await api.post(ENDPOINTS.list, {
      data: newItem,
    })

    expect(response.status()).toBe(201)
    const data = await response.json()
    expect(data.doc.title).toBe(newItem.title)
  })

  test('validates required fields', async () => {
    const response = await api.post(ENDPOINTS.list, {
      data: {}, // Empty
    })

    expect(response.status()).toBe(400)
  })

  test('rejects XSS in title', async () => {
    const response = await api.post(ENDPOINTS.list, {
      data: {
        title: EDGE.strings.xss,
      },
    })

    // Fie respinge, fie sanitizează
    if (response.status() === 201) {
      const data = await response.json()
      expect(data.doc.title).not.toContain('<script>')
    }
  })
})
*/
