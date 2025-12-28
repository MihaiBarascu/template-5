import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  Payload,
} from 'payload'
import { revalidateTag } from 'next/cache'

/**
 * Multi-tenant cache revalidation utilities
 *
 * Strategy based on:
 * - Next.js GitHub Issue #59825: revalidatePath() doesn't work with middleware rewrites
 * - Community recommendation: Use revalidateTag() with tenant-specific tags
 * - Payload official pattern: Check context.disableRevalidate for seeding
 *
 * IMPORTANT: We use ONLY revalidateTag (not revalidatePath) because in multi-tenant:
 * - revalidatePath('/test') invalidates ALL tenants (bug)
 * - revalidatePath('/domain/test') doesn't work at all (bug)
 * - revalidateTag('collection-domain') works correctly per-tenant
 *
 * @see https://github.com/vercel/next.js/issues/59825
 */

/**
 * Internal: Get tenant domain from document
 */
async function getTenantDomainFromDoc(
  doc: Record<string, unknown>,
  payload: Payload,
): Promise<string | null> {
  const tenant = doc.tenant as { domain?: string } | string | undefined

  if (typeof tenant === 'object' && tenant?.domain) {
    return tenant.domain
  }

  if (typeof tenant === 'string') {
    try {
      const tenantDoc = await payload.findByID({
        collection: 'tenants',
        id: tenant,
        depth: 0,
      })
      return (tenantDoc as { domain?: string })?.domain || null
    } catch {
      return null
    }
  }

  return null
}

/**
 * Build tenant-specific cache tags
 *
 * Tags MUST match the cache tags in getTenantGlobal.ts:
 * - `tenant_${tenantKey}` - All data for this tenant
 * - `actualSlug` - Global collection tag
 * - `${actualSlug}-${tenantKey}` - This collection for this tenant
 *
 * @param collectionSlug - The collection slug (e.g., 'pages', 'posts', 'tenant-site-themes')
 * @param tenantDomain - The tenant domain (e.g., 'frizerie.local')
 * @param additionalTags - Optional extra tags (e.g., 'sitemap')
 */
function buildTenantTags(
  collectionSlug: string,
  tenantDomain: string | null,
  additionalTags: string[] = [],
): string[] {
  const tags: string[] = []

  if (tenantDomain) {
    // Tenant-specific tags - MUST match tags in getTenantGlobal.ts cache
    tags.push(
      `tenant_${tenantDomain}`,           // All data for this tenant
      collectionSlug,                      // Global collection tag (matches cache)
      `${collectionSlug}-${tenantDomain}` // This collection for this tenant
    )
    // Add additional tags with tenant suffix
    for (const tag of additionalTags) {
      tags.push(`${tag}-${tenantDomain}`)
    }
  } else {
    // Fallback to collection-level (shouldn't happen in production)
    tags.push(collectionSlug)
    tags.push(...additionalTags)
  }

  return tags
}

/**
 * Internal: Revalidate cache tags directly using Next.js revalidateTag
 *
 * Uses { expire: 0 } for immediate invalidation (not stale-while-revalidate)
 * This is appropriate for CMS content changes where we want fresh data immediately.
 *
 * @see https://nextjs.org/docs/app/api-reference/functions/revalidateTag
 */
function revalidateTags(
  tags: string[],
  payload: Payload,
  context: string,
): void {
  if (tags.length === 0) return

  try {
    // Direct revalidateTag calls - faster than API route, works in same process
    // Using { expire: 0 } for immediate invalidation per Next.js 15+ docs
    for (const tag of tags) {
      revalidateTag(tag, { expire: 0 })
    }
    payload.logger.info(`[Revalidate] ${context} - tags: ${tags.join(', ')}`)
  } catch (error) {
    // Log but don't throw - revalidation failure shouldn't break the save
    payload.logger.error(`[Revalidate] Failed for ${context}: ${String(error)}`)
  }
}

/**
 * Check if document is a draft (should skip revalidation)
 *
 * Based on Payload GitHub Discussion #4616:
 * - afterChange fires on EVERY save including draft saves
 * - We should skip revalidation for drafts to avoid unnecessary cache busting
 */
function isDraft(doc: Record<string, unknown>): boolean {
  return doc._status === 'draft'
}

/**
 * Create afterChange hook for tenant-scoped collections (globals-like)
 *
 * @param collectionSlug - The tenant collection slug (e.g., 'tenant-site-themes')
 */
export function createTenantRevalidateHook(collectionSlug: string): CollectionAfterChangeHook {
  return async ({ doc, req }) => {
    const { payload, context } = req

    // Skip revalidation during seeding
    if (context?.disableRevalidate) {
      return doc
    }

    // Skip revalidation for draft saves (only revalidate published content)
    if (isDraft(doc)) {
      payload.logger.debug(`[Revalidate] Skipping draft for ${collectionSlug}`)
      return doc
    }

    const tenantDomain = await getTenantDomainFromDoc(doc, payload)

    if (!tenantDomain) {
      payload.logger.warn(`[Revalidate] No tenant domain found for ${collectionSlug}`)
    }

    const tags = buildTenantTags(collectionSlug, tenantDomain)
    revalidateTags(tags, payload, `${collectionSlug} for tenant: ${tenantDomain || 'unknown'}`)

    return doc
  }
}

/**
 * Create afterChange hook for content collections (pages, posts, services, etc.)
 *
 * @param collectionSlug - The collection slug (e.g., 'pages', 'posts')
 * @param additionalTags - Optional extra tags to revalidate (e.g., ['sitemap'])
 */
export function createContentRevalidateHook(
  collectionSlug: string,
  additionalTags: string[] = [],
): CollectionAfterChangeHook {
  return async ({ doc, req }) => {
    const { payload, context } = req

    // Skip revalidation during seeding
    if (context?.disableRevalidate) {
      return doc
    }

    // Skip revalidation for draft saves (only revalidate published content)
    if (isDraft(doc)) {
      payload.logger.debug(`[Revalidate] Skipping draft for ${collectionSlug}`)
      return doc
    }

    const tenantDomain = await getTenantDomainFromDoc(doc, payload)

    if (!tenantDomain) {
      payload.logger.warn(`[Revalidate] No tenant domain found for ${collectionSlug}`)
    }

    const tags = buildTenantTags(collectionSlug, tenantDomain, additionalTags)
    revalidateTags(tags, payload, `${collectionSlug} for tenant: ${tenantDomain || 'unknown'}`)

    return doc
  }
}

/**
 * Create afterDelete hook for content collections
 *
 * @param collectionSlug - The collection slug (e.g., 'pages', 'posts')
 * @param additionalTags - Optional extra tags to revalidate (e.g., ['sitemap'])
 */
export function createContentDeleteHook(
  collectionSlug: string,
  additionalTags: string[] = [],
): CollectionAfterDeleteHook {
  return async ({ doc, req }) => {
    const { payload, context } = req

    // Skip revalidation during seeding
    if (context?.disableRevalidate) {
      return doc
    }

    // Note: No draft check for delete - always revalidate when content is deleted

    const tenantDomain = await getTenantDomainFromDoc(doc as Record<string, unknown>, payload)

    if (!tenantDomain) {
      payload.logger.warn(`[Revalidate] No tenant domain found for deleted ${collectionSlug}`)
    }

    const tags = buildTenantTags(collectionSlug, tenantDomain, additionalTags)
    revalidateTags(tags, payload, `deleted ${collectionSlug} for tenant: ${tenantDomain || 'unknown'}`)

    return doc
  }
}
