import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { TestimonialCategory } from '@/payload-types'

// Paths where testimonial categories might be displayed
const CATEGORY_AFFECTED_PATHS = [
  '/testimoniale',
  '/', // Homepage might have testimonials block filtered by category
]

export const revalidateTestimonialCategoryAfterChange: CollectionAfterChangeHook<TestimonialCategory> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    try {
      payload.logger.info(`Revalidating testimonial category: ${doc.slug}`)

      // Revalidate both tags - categories affect testimonials display
      revalidateTag('testimonial-categories', 'max')
      revalidateTag('testimonials', 'max')

      // Revalidate category listing and testimonial listing pages
      for (const path of CATEGORY_AFFECTED_PATHS) {
        revalidatePath(path)
      }

      // Revalidate possible category detail paths
      const detailPaths = [
        `/testimoniale/categorie/${doc.slug}`,
      ]

      for (const path of detailPaths) {
        revalidatePath(path)
      }

      // If slug changed, also revalidate old paths
      if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
        const oldDetailPaths = [
          `/testimoniale/categorie/${previousDoc.slug}`,
        ]

        for (const path of oldDetailPaths) {
          revalidatePath(path)
        }
      }
    } catch (_e) {
      payload.logger.warn(
        `Could not revalidate testimonial category ${doc.slug} (likely running outside Next.js context)`,
      )
    }
  }
  return doc
}

export const revalidateTestimonialCategoryAfterDelete: CollectionAfterDeleteHook<TestimonialCategory> = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    try {
      payload.logger.info(`Revalidating deleted testimonial category: ${doc?.slug}`)

      // Revalidate both tags
      revalidateTag('testimonial-categories', 'max')
      revalidateTag('testimonials', 'max')

      // Revalidate category listing pages
      for (const path of CATEGORY_AFFECTED_PATHS) {
        revalidatePath(path)
      }

      // Revalidate possible detail paths
      if (doc?.slug) {
        const detailPaths = [
          `/testimoniale/categorie/${doc.slug}`,
        ]

        for (const path of detailPaths) {
          revalidatePath(path)
        }
      }
    } catch (_e) {
      payload.logger.warn(`Could not revalidate testimonial category (likely running outside Next.js context)`)
    }
  }

  return doc
}
