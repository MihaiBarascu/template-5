import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '@/payload-types'

export const revalidatePostAfterChange: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/blog/${doc.slug}`

      payload.logger.info(`Revalidating post at path: ${path}`)

      // Only revalidate if we're in a Next.js context (not during seed)
      try {
        revalidatePath(path)
        revalidateTag('posts-sitemap')
        // Also revalidate blog listing and homepage (for LatestPosts block)
        revalidatePath('/blog')
        revalidatePath('/')
      } catch (_e) {
        payload.logger.warn(`Could not revalidate ${path} (likely running outside Next.js context)`)
      }
    }

    // If the post was previously published, we need to revalidate the old path
    if (previousDoc?._status === 'published' && doc._status !== 'published') {
      const oldPath = `/blog/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      try {
        revalidatePath(oldPath)
        revalidateTag('posts-sitemap')
        // Also revalidate blog listing and homepage
        revalidatePath('/blog')
        revalidatePath('/')
      } catch (_e) {
        payload.logger.warn(`Could not revalidate ${oldPath} (likely running outside Next.js context)`)
      }
    }
  }
  return doc
}

export const revalidatePostAfterDelete: CollectionAfterDeleteHook<Post> = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    const path = `/blog/${doc?.slug}`

    payload.logger.info(`Revalidating deleted post at path: ${path}`)

    try {
      revalidatePath(path)
      revalidateTag('posts-sitemap')
      // Also revalidate blog listing and homepage
      revalidatePath('/blog')
      revalidatePath('/')
    } catch (_e) {
      payload.logger.warn(`Could not revalidate ${path} (likely running outside Next.js context)`)
    }
  }

  return doc
}
