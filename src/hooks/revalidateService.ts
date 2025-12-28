import {
  createContentRevalidateHook,
  createContentDeleteHook,
} from '@/hooks/revalidateTenantGlobal'

/**
 * Multi-tenant service revalidation hooks
 *
 * Uses tenant-specific cache tags instead of revalidatePath
 * because revalidatePath doesn't work with middleware in multi-tenant apps.
 *
 * @see https://github.com/vercel/next.js/issues/59825
 */

// Revalidate services collection for the specific tenant
export const revalidateServiceAfterChange = createContentRevalidateHook('services')
export const revalidateServiceAfterDelete = createContentDeleteHook('services')
