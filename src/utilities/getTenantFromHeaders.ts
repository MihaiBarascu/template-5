import { headers } from 'next/headers'
import { getTenantIdByDomain } from './getTenantGlobal'

/**
 * Get tenant domain from request headers.
 *
 * Following Payload's official multi-tenant pattern:
 * - In production: uses Host header (e.g., "frizerie.local")
 * - In development: uses X-Tenant-Domain header or defaults to first tenant
 *
 * @returns The tenant domain (without port)
 */
export async function getTenantDomain(): Promise<string | null> {
  const headersList = await headers()

  // Check for explicit tenant header (useful for testing/development)
  const explicitTenant = headersList.get('x-tenant-domain')
  if (explicitTenant) {
    return explicitTenant
  }

  // Get from Host header
  const host = headersList.get('host') || ''

  // Skip for localhost - return null to indicate no tenant filtering
  if (host.startsWith('localhost:') || host.startsWith('127.0.0.1:')) {
    return null
  }

  // Extract domain without port
  const domain = host.split(':')[0]
  return domain || null
}

/**
 * Build a where clause that includes tenant filtering BY ID.
 *
 * Best practice: Always filter by tenant ID, not by nested `tenant.domain`.
 * This is more performant and avoids issues with relationship population.
 *
 * @param baseWhere - The base where clause
 * @param tenantDomain - Optional explicit tenant domain (if not provided, uses headers)
 * @returns Where clause with tenant ID filter added
 *
 * @example
 * const pages = await payload.find({
 *   collection: 'pages',
 *   where: await withTenantFilter({ slug: { equals: 'home' } }),
 * })
 */
export async function withTenantFilter<T extends Record<string, unknown>>(
  baseWhere: T,
  tenantDomain?: string | null
): Promise<T & { tenant?: { equals: string } }> {
  // Use provided domain or get from headers
  const domain = tenantDomain ?? await getTenantDomain()

  if (!domain) {
    // No tenant domain - return base where clause unchanged
    return baseWhere
  }

  // Get tenant ID from domain (cached)
  const tenantId = await getTenantIdByDomain(domain)

  if (!tenantId) {
    // Tenant not found - return base where clause unchanged
    return baseWhere
  }

  // Add tenant ID filter (best practice - filter by ID, not nested field)
  return {
    ...baseWhere,
    tenant: { equals: tenantId },
  }
}

/**
 * Build an AND where clause with tenant filtering BY ID.
 *
 * @param conditions - Array of where conditions
 * @param tenantDomain - Optional explicit tenant domain
 * @returns AND where clause with tenant ID filter
 *
 * @example
 * const pages = await payload.find({
 *   collection: 'pages',
 *   where: await withTenantFilterAnd([
 *     { slug: { equals: 'home' } },
 *     { _status: { equals: 'published' } }
 *   ]),
 * })
 */
export async function withTenantFilterAnd(
  conditions: Array<Record<string, unknown>>,
  tenantDomain?: string | null
): Promise<{ and: Array<Record<string, unknown>> }> {
  // Use provided domain or get from headers
  const domain = tenantDomain ?? await getTenantDomain()

  if (!domain) {
    return { and: conditions }
  }

  // Get tenant ID from domain (cached)
  const tenantId = await getTenantIdByDomain(domain)

  if (!tenantId) {
    return { and: conditions }
  }

  // Add tenant ID filter
  const allConditions = [...conditions, { tenant: { equals: tenantId } }]

  return { and: allConditions }
}
