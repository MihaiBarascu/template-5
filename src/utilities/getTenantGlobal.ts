import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { unstable_cache } from 'next/cache'
import { getTenantDomain } from './getTenantFromHeaders'

/**
 * Mapping from short names to actual tenant collection slugs
 */
const TENANT_COLLECTION_MAP: Record<string, string> = {
  'header': 'tenant-headers',
  'footer': 'tenant-footers',
  'logo': 'tenant-logos',
  'site-theme': 'tenant-site-themes',
  'business-info': 'tenant-business-info',
  'shop-settings': 'tenant-shop-settings',
  'system-pages': 'tenant-system-pages',
}

/**
 * Mapping from short names to TRUE Payload global slugs (fallback)
 * NOTE: No more true globals for settings - all are per-tenant now
 */
const TRUE_GLOBAL_MAP: Record<string, string> = {
  // All settings are now tenant-collections, no true globals
}

/**
 * Get tenant collection slug from short name or pass through if already full slug
 */
function getTenantCollectionSlug(shortName: string): string {
  return TENANT_COLLECTION_MAP[shortName] || shortName
}

/**
 * Get TRUE global slug from short name
 */
function getTrueGlobalSlug(shortName: string): string | null {
  return TRUE_GLOBAL_MAP[shortName] || null
}

/**
 * Strip port from domain (e.g., "frizerie.local:3100" -> "frizerie.local")
 * Domains in DB are stored without ports.
 */
function stripPort(domain: string): string {
  // Handle IPv6 addresses in brackets [::1]:3100
  if (domain.startsWith('[')) {
    const bracketEnd = domain.indexOf(']')
    if (bracketEnd > 0) {
      return domain.slice(0, bracketEnd + 1)
    }
  }
  // Standard domain:port
  const colonIndex = domain.lastIndexOf(':')
  if (colonIndex > 0) {
    // Check if what's after colon looks like a port number
    const afterColon = domain.slice(colonIndex + 1)
    if (/^\d+$/.test(afterColon)) {
      return domain.slice(0, colonIndex)
    }
  }
  return domain
}

/**
 * Normalize domain by stripping port for consistent cache keys and DB lookups.
 * @param domain - Domain that may include port (e.g., "frizerie.local:3100")
 * @returns Normalized domain without port (e.g., "frizerie.local")
 */
export function normalizeDomain(domain: string): string {
  return stripPort(domain)
}

/**
 * Internal: Lookup tenant ID by domain (uncached).
 * @internal Use getCachedTenantId for production code.
 */
async function lookupTenantIdByDomain(domainWithoutPort: string): Promise<string | null> {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.find({
      collection: 'tenants',
      where: { domain: { equals: domainWithoutPort } },
      limit: 1,
      depth: 0,
    })

    return result.docs[0]?.id || null
  } catch (error) {
    console.error(`[lookupTenantIdByDomain] Error looking up tenant for domain ${domainWithoutPort}:`, error)
    return null
  }
}

/**
 * Get tenant ID by domain with caching.
 * Reduces N+1 queries by caching tenant ID lookups for 10 minutes.
 *
 * @param tenantDomain - Domain (port will be stripped automatically)
 * @returns Tenant ID or null if not found
 */
export async function getTenantIdByDomain(tenantDomain: string): Promise<string | null> {
  const domainWithoutPort = stripPort(tenantDomain)

  return unstable_cache(
    () => lookupTenantIdByDomain(domainWithoutPort),
    [`tenant-id-${domainWithoutPort}`],
    {
      tags: ['tenants', `tenant_${domainWithoutPort}`],
      revalidate: 60 * 10, // 10 minutes - tenant IDs rarely change
    },
  )()
}

/**
 * Internal function that fetches tenant global by domain.
 * This is cacheable because it doesn't use headers() directly.
 *
 * Falls back to TRUE Payload global if tenant collection is empty.
 */
async function getTenantGlobalByDomainInternal<T>(
  collectionSlug: string,
  tenantDomain: string,
): Promise<T | null> {
  const payload = await getPayload({ config: configPromise })
  const actualSlug = getTenantCollectionSlug(collectionSlug)
  const trueGlobalSlug = getTrueGlobalSlug(collectionSlug)

  try {
    // First, lookup tenant ID by domain
    const tenantId = await getTenantIdByDomain(tenantDomain)

    if (tenantId) {
      // Query tenant-scoped collection by tenant ID (not tenant.domain)
      const result = await payload.find({
        collection: actualSlug as 'pages',
        where: { tenant: { equals: tenantId } },
        limit: 1,
        depth: 2,
      })

      if (result.docs[0]) {
        return result.docs[0] as T
      }
    }

    // No tenant document found - return null
    // (All settings are now tenant-collections, no more true globals as fallback)
    return null
  } catch (error) {
    console.error(`[getTenantGlobal] Error fetching ${actualSlug} for domain ${tenantDomain}:`, error)
    return null
  }
}

/**
 * Get a "global" document for the current tenant (auto-detected from Host header)
 *
 * In multi-tenant architecture, what were previously globals become
 * collections with exactly ONE document per tenant.
 *
 * Uses `tenant.domain` filtering following Payload's official multi-tenant pattern.
 *
 * @param collectionSlug - Short name ('header', 'footer', 'logo') or full slug ('tenant-headers')
 * @returns The document or null if not found
 */
export async function getTenantGlobal<T>(collectionSlug: string): Promise<T | null> {
  const tenantDomain = await getTenantDomain()

  if (!tenantDomain) {
    // No tenant domain - try tenant collection first, then TRUE global
    const payload = await getPayload({ config: configPromise })
    const actualSlug = getTenantCollectionSlug(collectionSlug)
    const trueGlobalSlug = getTrueGlobalSlug(collectionSlug)

    try {
      const result = await payload.find({
        collection: actualSlug as 'pages',
        limit: 1,
        depth: 2,
      })
      if (result.docs[0]) {
        return result.docs[0] as T
      }
    } catch {
      // Collection might not exist
    }

    // No tenant document found - return null
    // (All settings are now tenant-collections, no more true globals as fallback)
    return null
  }

  return getTenantGlobalByDomainInternal<T>(collectionSlug, tenantDomain)
}

/**
 * Cached version of getTenantGlobal for better performance
 *
 * IMPORTANT: Tenant domain is fetched OUTSIDE the cache scope (headers() can't be
 * used inside unstable_cache), then passed in and included in the cache key.
 *
 * @param collectionSlug - Short name ('header', 'footer', 'logo') or full slug
 * @returns Cached document or null
 */
export async function getCachedTenantGlobal<T>(collectionSlug: string): Promise<T | null> {
  // Get tenant domain OUTSIDE the cache scope (headers() is dynamic)
  const tenantDomain = await getTenantDomain()
  // Normalize domain (strip port) for consistent cache keys
  const tenantKey = tenantDomain ? stripPort(tenantDomain) : 'default'
  const actualSlug = getTenantCollectionSlug(collectionSlug)
  const trueGlobalSlug = getTrueGlobalSlug(collectionSlug)

  if (!tenantDomain) {
    // No tenant domain - try tenant collection first, then TRUE global (development mode)
    return unstable_cache(
      async () => {
        const payload = await getPayload({ config: configPromise })

        // Try tenant collection
        try {
          const result = await payload.find({
            collection: actualSlug as 'pages',
            limit: 1,
            depth: 2,
          })
          if (result.docs[0]) {
            return result.docs[0] as T
          }
        } catch {
          // Collection might not exist
        }

        // No tenant document found - return null
        // (All settings are now tenant-collections, no more true globals as fallback)
        return null
      },
      [`tenant-global-${actualSlug}-default`],
      {
        tags: [actualSlug, `tenant_default`],
        revalidate: 60 * 5,
      },
    )()
  }

  return unstable_cache(
    () => getTenantGlobalByDomainInternal<T>(collectionSlug, tenantDomain),
    [`tenant-global-${actualSlug}-${tenantKey}`],
    {
      tags: [
        `tenant_${tenantKey}`,
        actualSlug,
        `${actualSlug}-${tenantKey}`,
      ],
      revalidate: 60 * 5, // 5 minutes fallback
    },
  )()
}

/**
 * Get multiple tenant "globals" in parallel (auto-detected from Host header)
 *
 * Efficient way to fetch all tenant configuration at once.
 *
 * @returns Object with all tenant globals
 */
export async function getTenantConfig() {
  const [siteTheme, businessInfo, header, footer, logo, shopSettings, systemPages] =
    await Promise.all([
      getCachedTenantGlobal('site-theme'),
      getCachedTenantGlobal('business-info'),
      getCachedTenantGlobal('header'),
      getCachedTenantGlobal('footer'),
      getCachedTenantGlobal('logo'),
      getCachedTenantGlobal('shop-settings'),
      getCachedTenantGlobal('system-pages'),
    ])

  return {
    siteTheme,
    businessInfo,
    header,
    footer,
    logo,
    shopSettings,
    systemPages,
  }
}

// ============================================================================
// Legacy API (with explicit tenantId) - kept for backwards compatibility
// ============================================================================

/**
 * @deprecated Use getTenantGlobal() without tenantId - it auto-detects from Host header
 */
export async function getTenantGlobalById<T>(
  collectionSlug: string,
  tenantId: string,
): Promise<T | null> {
  const payload = await getPayload({ config: configPromise })
  const actualSlug = getTenantCollectionSlug(collectionSlug)

  try {
    const result = await payload.find({
      collection: actualSlug as 'pages',
      where: { tenant: { equals: tenantId } },
      limit: 1,
      depth: 2,
    })

    return (result.docs[0] as T) || null
  } catch (error) {
    console.error(`[getTenantGlobalById] Error fetching ${actualSlug} for tenant ${tenantId}:`, error)
    return null
  }
}

/**
 * Invalidate cache for a tenant's global
 *
 * Call this from afterChange hooks to invalidate the cache.
 */
export function revalidateTenantGlobal(
  collectionSlug: string,
  tenantDomain: string,
): void {
  // Note: In production, use revalidateTag from 'next/cache'
  // This is a placeholder - actual implementation depends on deployment
  console.log(`[Cache] Revalidating ${collectionSlug} for tenant ${tenantDomain}`)
}

// ============================================================================
// Params-based API (for multi-tenant rewrites pattern)
// ============================================================================

/**
 * Get a "global" document for a tenant by explicit domain.
 *
 * This is the OFFICIAL Payload multi-tenant pattern where tenant is received
 * from URL params (via Next.js rewrites) instead of headers.
 *
 * Reference: docs/MULTI-TENANT-OFFICIAL-REFERENCE.md
 *
 * @param collectionSlug - Short name ('header', 'footer', 'logo') or full slug
 * @param tenantDomain - The tenant domain from params (e.g., 'frizerie.local')
 * @returns Cached document or null
 */
export async function getCachedTenantGlobalByDomain<T>(
  collectionSlug: string,
  tenantDomain: string,
): Promise<T | null> {
  const actualSlug = getTenantCollectionSlug(collectionSlug)
  // Normalize domain (strip port) for consistent cache keys
  const normalizedDomain = stripPort(tenantDomain)

  return unstable_cache(
    () => getTenantGlobalByDomainInternal<T>(collectionSlug, normalizedDomain),
    [`tenant-global-${actualSlug}-${normalizedDomain}`],
    {
      tags: [
        `tenant_${normalizedDomain}`,
        actualSlug,
        `${actualSlug}-${normalizedDomain}`,
      ],
      revalidate: 60 * 5, // 5 minutes fallback
    },
  )()
}

/**
 * Get multiple tenant "globals" in parallel by explicit domain.
 *
 * @param tenantDomain - The tenant domain from params
 * @returns Object with all tenant globals
 */
export async function getTenantConfigByDomain(tenantDomain: string) {
  const [siteTheme, businessInfo, header, footer, logo, shopSettings, systemPages] =
    await Promise.all([
      getCachedTenantGlobalByDomain('site-theme', tenantDomain),
      getCachedTenantGlobalByDomain('business-info', tenantDomain),
      getCachedTenantGlobalByDomain('header', tenantDomain),
      getCachedTenantGlobalByDomain('footer', tenantDomain),
      getCachedTenantGlobalByDomain('logo', tenantDomain),
      getCachedTenantGlobalByDomain('shop-settings', tenantDomain),
      getCachedTenantGlobalByDomain('system-pages', tenantDomain),
    ])

  return {
    siteTheme,
    businessInfo,
    header,
    footer,
    logo,
    shopSettings,
    systemPages,
  }
}

/**
 * Validate that a tenant exists in the database.
 *
 * In development (localhost), if no tenant matches, returns true anyway
 * to allow testing without /etc/hosts configuration.
 *
 * @param tenantDomain - The tenant domain to validate
 * @returns true if tenant exists, false otherwise
 */
export async function validateTenant(tenantDomain: string): Promise<boolean> {
  // Strip port for consistent domain handling (DB stores domains without ports)
  const domainWithoutPort = stripPort(tenantDomain)

  const tenantId = await getTenantIdByDomain(domainWithoutPort)
  if (tenantId !== null) {
    return true
  }

  // Localhost fallback: always allow localhost domains for local development
  // (even when NODE_ENV=production, which happens with `pnpm start`)
  const isLocalhost = domainWithoutPort.includes('localhost') || domainWithoutPort.includes('127.0.0.1')
  if (isLocalhost) {
    return true
  }

  return false
}

/**
 * Get the effective tenant domain, with localhost fallback for development.
 *
 * In development, if the domain is localhost, it returns the first available
 * tenant's domain from the database.
 *
 * @param tenantDomain - The tenant domain from URL params
 * @returns Effective tenant domain to use for queries
 */
export async function getEffectiveTenantDomain(tenantDomain: string): Promise<string> {
  // Strip port for consistent domain handling (DB stores domains without ports)
  const domainWithoutPort = stripPort(tenantDomain)

  // Check if tenant exists with this domain
  const tenantId = await getTenantIdByDomain(domainWithoutPort)
  if (tenantId !== null) {
    return domainWithoutPort
  }

  // Localhost fallback: use first available tenant (oldest by createdAt)
  // Works even when NODE_ENV=production (e.g., `pnpm start` for local testing)
  const isLocalhost = domainWithoutPort.includes('localhost') || domainWithoutPort.includes('127.0.0.1')
  if (isLocalhost) {
    const payload = await getPayload({ config: configPromise })
    // Sort by createdAt ascending to get the oldest (first seeded) tenant
    const firstTenant = await payload.find({
      collection: 'tenants',
      limit: 1,
      depth: 0,
      sort: 'createdAt',
    })
    if (firstTenant.docs[0]?.domain) {
      console.log(`[Multi-tenant] Localhost fallback: using tenant ${firstTenant.docs[0].domain}`)
      return firstTenant.docs[0].domain
    }
  }

  return domainWithoutPort
}
