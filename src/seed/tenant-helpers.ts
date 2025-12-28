/**
 * Multi-Tenant Seeding Helpers
 *
 * Provides utilities for creating and managing tenants during seeding.
 * The default tenant is created once and reused across all seed operations.
 */

import type { Payload } from 'payload'
import type { Tenant } from '@/payload-types'

// Global cache for current seed tenant ID
let currentSeedTenantId: string | null = null

/**
 * Get or create the default tenant for seeding.
 * The tenant is created with a consistent slug so it can be reused.
 */
export async function getOrCreateSeedTenant(
  payload: Payload,
  options?: {
    name?: string
    slug?: string
    domain?: string
  }
): Promise<Tenant> {
  const tenantSlug = options?.slug || 'default'
  const tenantName = options?.name || 'Default Tenant'
  const tenantDomain = options?.domain || 'localhost'

  // Check if tenant already exists
  const existing = await payload.find({
    collection: 'tenants',
    where: {
      slug: { equals: tenantSlug },
    },
    limit: 1,
  })

  if (existing.docs.length > 0) {
    const tenant = existing.docs[0]
    currentSeedTenantId = tenant.id
    console.log(`   Using existing tenant: ${tenant.name} (${tenant.id})`)
    return tenant
  }

  // Create new tenant
  const tenant = await payload.create({
    collection: 'tenants',
    data: {
      name: tenantName,
      slug: tenantSlug,
      domain: tenantDomain,
      allowPublicRead: true,
      status: 'active',
      plan: 'pro',
    },
  })

  currentSeedTenantId = tenant.id
  console.log(`   Created tenant: ${tenant.name} (${tenant.id})`)
  return tenant
}

/**
 * Get the current seed tenant ID.
 * Must call getOrCreateSeedTenant first.
 */
export function getCurrentSeedTenantId(): string {
  if (!currentSeedTenantId) {
    throw new Error('No seed tenant set. Call getOrCreateSeedTenant() first.')
  }
  return currentSeedTenantId
}

/**
 * Check if we have a current seed tenant.
 */
export function hasSeedTenant(): boolean {
  return currentSeedTenantId !== null
}

/**
 * Clear the current seed tenant (for testing/reset).
 */
export function clearSeedTenant(): void {
  currentSeedTenantId = null
}

/**
 * Set an existing tenant ID for seeding content.
 * Use this when seeding content for a tenant that was created via Admin UI.
 *
 * @example
 * // In seed/index.ts when TENANT_ID is provided:
 * setSeedTenantId(existingTenantId)
 * await seedFrizerie(payload) // Will use the existing tenant
 */
export function setSeedTenantId(tenantId: string): void {
  currentSeedTenantId = tenantId
}

/**
 * Get tenant by ID and set it as current seed tenant.
 * Validates that tenant exists before setting.
 */
export async function useExistingTenant(
  payload: Payload,
  tenantId: string
): Promise<Tenant> {
  const tenant = await payload.findByID({
    collection: 'tenants',
    id: tenantId,
  })

  if (!tenant) {
    throw new Error(`Tenant not found: ${tenantId}`)
  }

  currentSeedTenantId = tenant.id
  console.log(`   Using existing tenant: ${tenant.name} (${tenant.id})`)
  console.log(`   Slug: ${tenant.slug}`)
  console.log(`   Domain: ${tenant.domain}`)

  return tenant
}

/**
 * Helper to add tenant field to data object if tenant is set.
 * This makes it easy to add tenant to payload.create() calls.
 *
 * @example
 * await payload.create({
 *   collection: 'services',
 *   data: withTenant({
 *     title: 'My Service',
 *     slug: 'my-service',
 *   }),
 * })
 */
export function withTenant<T extends Record<string, unknown>>(data: T): T & { tenant?: string } {
  if (currentSeedTenantId) {
    return { ...data, tenant: currentSeedTenantId }
  }
  return data
}

/**
 * Delete tenant and all its data.
 * Use with caution - this permanently removes the tenant and associated content.
 */
export async function deleteTenantWithData(
  payload: Payload,
  tenantId: string
): Promise<void> {
  // Collections that have tenant field
  const tenantCollections = [
    'pages',
    'posts',
    'services',
    'service-categories',
    'team',
    'portfolio',
    'testimonials',
    'testimonial-categories',
    'faq',
    'subscriptions',
    'subscription-orders',
    'bookings',
    'newsletter-subscribers',
    'categories',
    'media',
    'product-categories',
    'product-tags',
    // Ecommerce plugin collections
    'products',
    'orders',
    'carts',
    'addresses',
    // Tenant globals
    'tenant-site-themes',
    'tenant-business-info',
    'tenant-headers',
    'tenant-footers',
    'tenant-logos',
  ] as const

  console.log(`   Deleting data for tenant ${tenantId}...`)

  for (const collection of tenantCollections) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const docs = await payload.find({
        collection: collection as any,
        where: {
          tenant: { equals: tenantId },
        },
        limit: 1000,
      })

      for (const doc of docs.docs) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await payload.delete({
          collection: collection as any,
          id: doc.id,
        })
      }

      if (docs.docs.length > 0) {
        console.log(`   Deleted ${docs.docs.length} ${collection}`)
      }
    } catch (_e) {
      // Collection might not have tenant field or other error, skip
    }
  }

  // Delete the tenant itself
  await payload.delete({
    collection: 'tenants',
    id: tenantId,
  })

  console.log(`   Tenant ${tenantId} deleted`)

  // Clear cached tenant ID if it was the deleted one
  if (currentSeedTenantId === tenantId) {
    currentSeedTenantId = null
  }
}
