import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { ServiceCategory } from '@/payload-types'

// Paths where categories or category-filtered services might be displayed
const CATEGORY_AFFECTED_PATHS = [
  '/servicii',
  '/terapii',
  '/cursuri',
  '/clase',
  '/tratamente',
  '/', // Homepage might have services block filtered by category
]

export const revalidateServiceCategoryAfterChange: CollectionAfterChangeHook<ServiceCategory> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    try {
      payload.logger.info(`Revalidating service category: ${doc.slug}`)

      // Revalidate both tags - categories affect services display
      revalidateTag('service-categories', 'max')
      revalidateTag('services', 'max')

      // Revalidate category listing and service listing pages
      for (const path of CATEGORY_AFFECTED_PATHS) {
        revalidatePath(path)
      }

      // Revalidate possible category detail paths
      const detailPaths = [
        `/servicii/categorie/${doc.slug}`,
        `/terapii/categorie/${doc.slug}`,
        `/cursuri/categorie/${doc.slug}`,
      ]

      for (const path of detailPaths) {
        revalidatePath(path)
      }

      // If slug changed, also revalidate old paths
      if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
        const oldDetailPaths = [
          `/servicii/categorie/${previousDoc.slug}`,
          `/terapii/categorie/${previousDoc.slug}`,
          `/cursuri/categorie/${previousDoc.slug}`,
        ]

        for (const path of oldDetailPaths) {
          revalidatePath(path)
        }
      }
    } catch (_e) {
      payload.logger.warn(
        `Could not revalidate service category ${doc.slug} (likely running outside Next.js context)`,
      )
    }
  }
  return doc
}

export const revalidateServiceCategoryAfterDelete: CollectionAfterDeleteHook<ServiceCategory> = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    try {
      payload.logger.info(`Revalidating deleted service category: ${doc?.slug}`)

      // Revalidate both tags
      revalidateTag('service-categories', 'max')
      revalidateTag('services', 'max')

      // Revalidate category listing pages
      for (const path of CATEGORY_AFFECTED_PATHS) {
        revalidatePath(path)
      }

      // Revalidate possible detail paths
      if (doc?.slug) {
        const detailPaths = [
          `/servicii/categorie/${doc.slug}`,
          `/terapii/categorie/${doc.slug}`,
          `/cursuri/categorie/${doc.slug}`,
        ]

        for (const path of detailPaths) {
          revalidatePath(path)
        }
      }
    } catch (_e) {
      payload.logger.warn(`Could not revalidate service category (likely running outside Next.js context)`)
    }
  }

  return doc
}
