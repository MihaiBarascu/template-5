import {
  createContentRevalidateHook,
  createContentDeleteHook,
} from '@/hooks/revalidateTenantGlobal'

/**
 * Multi-tenant post revalidation hooks
 *
 * Uses tenant-specific cache tags instead of revalidatePath
 * because revalidatePath doesn't work with middleware in multi-tenant apps.
 *
 * @see https://github.com/vercel/next.js/issues/59825
 */

// Revalidate posts collection and sitemap for the specific tenant
export const revalidatePostAfterChange = createContentRevalidateHook('posts', ['posts-sitemap'])
export const revalidatePostAfterDelete = createContentDeleteHook('posts', ['posts-sitemap'])
