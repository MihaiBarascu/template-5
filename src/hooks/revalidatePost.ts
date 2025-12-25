import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Post } from '@/payload-types'

export const revalidatePostAfterChange: CollectionAfterChangeHook<Post> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    // Note: versions/drafts disabled for multi-tenant compatibility
    // All posts are effectively "published"
    const path = `/blog/${doc.slug}`

    payload.logger.info(`Revalidating post at path: ${path}`)

    // Only revalidate if we're in a Next.js context (not during seed)
    try {
      revalidatePath(path)
      revalidateTag('posts-sitemap', 'max')
      // Also revalidate blog listing and homepage (for LatestPosts block)
      revalidatePath('/blog')
      revalidatePath('/')
    } catch (_e) {
      payload.logger.warn(`Could not revalidate ${path} (likely running outside Next.js context)`)
    }

    // If slug changed, revalidate old path too
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldPath = `/blog/${previousDoc.slug}`

      payload.logger.info(`Revalidating old post at path: ${oldPath}`)

      try {
        revalidatePath(oldPath)
        revalidateTag('posts-sitemap', 'max')
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
      revalidateTag('posts-sitemap', 'max')
      // Also revalidate blog listing and homepage
      revalidatePath('/blog')
      revalidatePath('/')
    } catch (_e) {
      payload.logger.warn(`Could not revalidate ${path} (likely running outside Next.js context)`)
    }
  }

  return doc
}
