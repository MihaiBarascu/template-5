import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Page } from '@/payload-types'

export const revalidatePageAfterChange: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = doc.slug === 'home' ? '/' : `/${doc.slug}`

      payload.logger.info(`Revalidating page at path: ${path}`)

      // Only revalidate if we're in a Next.js context (not during seed)
      try {
        revalidatePath(path)
        revalidateTag('pages-sitemap')
      } catch (e) {
        payload.logger.warn(`Could not revalidate ${path} (likely running outside Next.js context)`)
      }
    }

    // If the page was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = previousDoc.slug === 'home' ? '/' : `/${previousDoc.slug}`

      payload.logger.info(`Revalidating old page at path: ${oldPath}`)

      try {
        revalidatePath(oldPath)
        revalidateTag('pages-sitemap')
      } catch (e) {
        payload.logger.warn(`Could not revalidate ${oldPath} (likely running outside Next.js context)`)
      }
    }
  }
  return doc
}

export const revalidatePageAfterDelete: CollectionAfterDeleteHook<Page> = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    const path = doc?.slug === 'home' ? '/' : `/${doc?.slug}`

    payload.logger.info(`Revalidating deleted page at path: ${path}`)

    try {
      revalidatePath(path)
      revalidateTag('pages-sitemap')
    } catch (e) {
      payload.logger.warn(`Could not revalidate ${path} (likely running outside Next.js context)`)
    }
  }

  return doc
}
