import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateGlobal: GlobalAfterChangeHook = ({ doc, req, global }) => {
  req.payload.logger.info(`Revalidating ${global.slug}`)

  // Only revalidate if we're in a Next.js context (not during seed)
  try {
    revalidateTag(global.slug)
  } catch (_e) {
    // Ignore revalidation errors during seeding
    req.payload.logger.warn(`Could not revalidate ${global.slug} (likely running outside Next.js context)`)
  }

  return doc
}
