import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath } from 'next/cache'

import type { Category } from '@/payload-types'

export const revalidateCategoryAfterChange: CollectionAfterChangeHook<Category> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating blog listing after category change: ${doc.title}`)

    try {
      // Revalidate blog listing page which shows categories
      revalidatePath('/blog')
    } catch (_e) {
      payload.logger.warn(`Could not revalidate /blog (likely running outside Next.js context)`)
    }
  }
  return doc
}

export const revalidateCategoryAfterDelete: CollectionAfterDeleteHook<Category> = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating blog listing after category deletion: ${doc?.title}`)

    try {
      revalidatePath('/blog')
    } catch (_e) {
      payload.logger.warn(`Could not revalidate /blog (likely running outside Next.js context)`)
    }
  }

  return doc
}
