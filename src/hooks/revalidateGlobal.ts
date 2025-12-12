import type { GlobalAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Revalidate global hook - triggers Next.js cache invalidation when globals change
 *
 * Uses revalidatePath for layout-affecting globals (theme, header, footer, etc.)
 * This ensures the frontend immediately reflects admin changes.
 *
 * @see https://payloadcms.com/community-help/discord/using-next-payload-how-to-revalidate
 * @see https://nextjs.org/docs/app/api-reference/functions/revalidatePath
 */
export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req, global }) => {
  req.payload.logger.info(`Revalidating global: ${global.slug}`)

  // Only revalidate if we're in a Next.js context (not during seed)
  try {
    // Globals that affect the entire layout need full path revalidation
    const layoutGlobals = ['site-theme', 'header', 'footer', 'logo', 'business-info', 'shop-settings']

    // Always revalidate the cache tag for this global (matches getCachedGlobal tags)
    const cacheTag = `global_${global.slug}`
    revalidateTag(cacheTag)
    req.payload.logger.info(`Revalidated cache tag: ${cacheTag}`)

    if (layoutGlobals.includes(global.slug)) {
      // Revalidate entire layout - all pages will re-render with new global data
      revalidatePath('/', 'layout')
      req.payload.logger.info(`Revalidated entire layout for global: ${global.slug}`)
    }
  } catch (_e) {
    // Ignore revalidation errors during seeding or generate:types
    req.payload.logger.warn(`Could not revalidate ${global.slug} (likely running outside Next.js context)`)
  }

  return doc
}
