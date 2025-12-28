import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

/**
 * @deprecated This hook is for Payload Globals, but in multi-tenant architecture
 * we use tenant-scoped collections instead (tenant-site-themes, tenant-business-info, etc.).
 *
 * The globals array in payload.config.ts is empty: `globals: []`
 *
 * For tenant-scoped settings, use:
 * - createTenantRevalidateHook() from @/hooks/revalidateTenantGlobal
 *
 * This file is kept for backwards compatibility only.
 *
 * IMPORTANT: revalidatePath() doesn't work with middleware in multi-tenant apps.
 * @see https://github.com/vercel/next.js/issues/59825
 */
export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req, global }) => {
  req.payload.logger.warn(
    `[Deprecated] revalidateGlobal called for ${global.slug}. ` +
    `Use tenant-scoped collections with createTenantRevalidateHook instead.`
  )

  // Only revalidate if we're in a Next.js context (not during seed)
  try {
    // Revalidate the cache tag for this global
    // Note: This doesn't work well in multi-tenant - use tenant collections instead
    const cacheTag = `global_${global.slug}`
    revalidateTag(cacheTag, { expire: 0 })
    req.payload.logger.info(`Revalidated cache tag: ${cacheTag}`)
  } catch (_e) {
    // Ignore revalidation errors during seeding or generate:types
    req.payload.logger.warn(`Could not revalidate ${global.slug} (likely running outside Next.js context)`)
  }

  return doc
}
