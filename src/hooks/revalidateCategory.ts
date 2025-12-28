import {
  createContentRevalidateHook,
  createContentDeleteHook,
} from '@/hooks/revalidateTenantGlobal'

/**
 * Multi-tenant category (blog) revalidation hooks
 *
 * Uses tenant-specific cache tags instead of revalidatePath
 * because revalidatePath doesn't work with middleware in multi-tenant apps.
 *
 * When categories change, we also revalidate posts since they display category info.
 *
 * @see https://github.com/vercel/next.js/issues/59825
 */

// Revalidate categories collection and related posts for the specific tenant
export const revalidateCategoryAfterChange = createContentRevalidateHook('categories', ['posts'])
export const revalidateCategoryAfterDelete = createContentDeleteHook('categories', ['posts'])
