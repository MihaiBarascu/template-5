import {
  createContentRevalidateHook,
  createContentDeleteHook,
} from '@/hooks/revalidateTenantGlobal'

/**
 * Multi-tenant page revalidation hooks
 *
 * Uses tenant-specific cache tags instead of revalidatePath
 * because revalidatePath doesn't work with middleware in multi-tenant apps.
 *
 * @see https://github.com/vercel/next.js/issues/59825
 */

// Revalidate pages collection and sitemap for the specific tenant
export const revalidatePageAfterChange = createContentRevalidateHook('pages', ['pages-sitemap'])
export const revalidatePageAfterDelete = createContentDeleteHook('pages', ['pages-sitemap'])
