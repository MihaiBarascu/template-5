import {
  createContentRevalidateHook,
  createContentDeleteHook,
} from '@/hooks/revalidateTenantGlobal'

/**
 * Multi-tenant service category revalidation hooks
 *
 * Uses tenant-specific cache tags instead of revalidatePath
 * because revalidatePath doesn't work with middleware in multi-tenant apps.
 *
 * When service categories change, we also revalidate services since they display category info.
 *
 * @see https://github.com/vercel/next.js/issues/59825
 */

// Revalidate service-categories collection and related services for the specific tenant
export const revalidateServiceCategoryAfterChange = createContentRevalidateHook('service-categories', ['services'])
export const revalidateServiceCategoryAfterDelete = createContentDeleteHook('service-categories', ['services'])
