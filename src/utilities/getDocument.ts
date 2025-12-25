import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import configPromise from '@payload-config'
import type { Config } from '@/payload-types'
import { getTenantDomain } from './getTenantFromHeaders'

type CollectionSlug = keyof Config['collections']

// Collections that have tenant field and need filtering
const TENANT_COLLECTIONS: CollectionSlug[] = [
  'pages',
  'posts',
  'services',
  'team',
  'testimonials',
  'portfolio',
  'subscriptions',
  'products',
  'categories',
  'service-categories',
  'testimonial-categories',
  'product-categories',
  'faq',
  'forms',
]

/**
 * Get tenant ID from domain
 */
async function getTenantIdFromDomain(
  payload: Awaited<ReturnType<typeof getPayload>>,
  domain: string,
): Promise<string | null> {
  const result = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: domain } },
    limit: 1,
    depth: 0,
  })
  return result.docs[0]?.id || null
}

/**
 * Internal function that fetches document with explicit tenant domain.
 * This is cacheable because it doesn't use headers() directly.
 */
async function getDocumentInternal<T extends CollectionSlug>(
  collection: T,
  slug: string,
  depth: number,
  tenantDomain: string | null,
): Promise<Config['collections'][T] | null> {
  const payload = await getPayload({ config: configPromise })

  // Build where clause with optional tenant filtering
  const whereConditions: Where[] = [{ slug: { equals: slug } }]

  // Add tenant filter for multi-tenant collections (by tenant ID, not domain)
  if (tenantDomain && TENANT_COLLECTIONS.includes(collection)) {
    const tenantId = await getTenantIdFromDomain(payload, tenantDomain)
    if (tenantId) {
      whereConditions.push({ tenant: { equals: tenantId } })
    }
  }

  const whereClause: Where = whereConditions.length > 1
    ? { and: whereConditions }
    : whereConditions[0]

  const result = await payload.find({
    collection,
    depth,
    limit: 1,
    pagination: false,
    where: whereClause,
  })

  return (result.docs?.[0] as Config['collections'][T]) || null
}

/**
 * Fetch a single document from a collection by slug.
 * Uses Payload's Local API for direct database access.
 *
 * For multi-tenant collections, automatically filters by tenant.domain
 * based on the Host header (following Payload's official pattern).
 */
export async function getDocument<T extends CollectionSlug>(
  collection: T,
  slug: string,
  depth: number = 1,
): Promise<Config['collections'][T] | null> {
  const tenantDomain = await getTenantDomain()
  return getDocumentInternal(collection, slug, depth, tenantDomain)
}

/**
 * Cached version of getDocument.
 * Uses Next.js unstable_cache with semantic tags for revalidation.
 *
 * IMPORTANT: Tenant domain is fetched OUTSIDE the cache scope (headers() can't be
 * used inside unstable_cache), then passed in and included in the cache key.
 *
 * @example
 * const page = await getCachedDocument('pages', 'about')
 */
export async function getCachedDocument<T extends CollectionSlug>(
  collection: T,
  slug: string,
  depth: number = 1,
) {
  // Get tenant domain OUTSIDE the cache scope (headers() is dynamic)
  const tenantDomain = await getTenantDomain()
  const tenantKey = tenantDomain || 'default'

  return unstable_cache(
    async () => getDocumentInternal(collection, slug, depth, tenantDomain),
    [`${collection}_${slug}_${tenantKey}`],
    {
      tags: [`${collection}_${slug}`, collection, `tenant_${tenantKey}`],
      revalidate: 60, // Fallback revalidation in seconds
    },
  )()
}

/**
 * Fetch a document by ID.
 */
export async function getDocumentById<T extends CollectionSlug>(
  collection: T,
  id: string,
  depth: number = 1,
): Promise<Config['collections'][T] | null> {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.findByID({
      collection,
      id,
      depth,
    })

    return result as Config['collections'][T]
  } catch {
    return null
  }
}

/**
 * Cached version of getDocumentById.
 */
export function getCachedDocumentById<T extends CollectionSlug>(
  collection: T,
  id: string,
  depth: number = 1,
) {
  return unstable_cache(
    async () => getDocumentById(collection, id, depth),
    [`${collection}_id_${id}`],
    {
      tags: [`${collection}_id_${id}`, collection],
      revalidate: 60,
    },
  )()
}

// ============================================================================
// Params-based API (for multi-tenant rewrites pattern)
// ============================================================================

/**
 * Cached version of getDocument with explicit tenant domain.
 *
 * This is the OFFICIAL Payload multi-tenant pattern where tenant is received
 * from URL params (via Next.js rewrites) instead of headers.
 *
 * Reference: docs/MULTI-TENANT-OFFICIAL-REFERENCE.md
 *
 * @param collection - Collection slug
 * @param slug - Document slug
 * @param tenantDomain - The tenant domain from params (e.g., 'frizerie.local')
 * @param depth - Query depth (default 1)
 */
export function getCachedDocumentByDomain<T extends CollectionSlug>(
  collection: T,
  slug: string,
  tenantDomain: string,
  depth: number = 1,
) {
  return unstable_cache(
    async () => getDocumentInternal(collection, slug, depth, tenantDomain),
    [`${collection}_${slug}_${tenantDomain}`],
    {
      tags: [`${collection}_${slug}`, collection, `tenant_${tenantDomain}`],
      revalidate: 60, // Fallback revalidation in seconds
    },
  )()
}
