import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Service } from '@/payload-types'

// Common paths where services might be displayed
const SERVICE_LISTING_PATHS = [
  '/servicii',
  '/terapii',
  '/cursuri',
  '/clase',
  '/tratamente',
  '/', // Homepage might have services block
]

export const revalidateServiceAfterChange: CollectionAfterChangeHook<Service> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    try {
      payload.logger.info(`Revalidating service: ${doc.slug}`)

      // Revalidate the services tag (used by services blocks)
      revalidateTag('services', 'max')

      // Revalidate common service listing pages
      for (const path of SERVICE_LISTING_PATHS) {
        revalidatePath(path)
      }

      // Revalidate possible detail paths for this service
      // Services can appear under different base paths
      const detailPaths = [
        `/servicii/${doc.slug}`,
        `/terapii/${doc.slug}`,
        `/cursuri/${doc.slug}`,
        `/clase/${doc.slug}`,
        `/tratamente/${doc.slug}`,
      ]

      for (const path of detailPaths) {
        revalidatePath(path)
      }

      // If slug changed, also revalidate old paths
      if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
        const oldDetailPaths = [
          `/servicii/${previousDoc.slug}`,
          `/terapii/${previousDoc.slug}`,
          `/cursuri/${previousDoc.slug}`,
          `/clase/${previousDoc.slug}`,
          `/tratamente/${previousDoc.slug}`,
        ]

        for (const path of oldDetailPaths) {
          revalidatePath(path)
        }
      }
    } catch (_e) {
      payload.logger.warn(`Could not revalidate service ${doc.slug} (likely running outside Next.js context)`)
    }
  }
  return doc
}

export const revalidateServiceAfterDelete: CollectionAfterDeleteHook<Service> = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    try {
      payload.logger.info(`Revalidating deleted service: ${doc?.slug}`)

      // Revalidate the services tag
      revalidateTag('services', 'max')

      // Revalidate common service listing pages
      for (const path of SERVICE_LISTING_PATHS) {
        revalidatePath(path)
      }

      // Revalidate possible detail paths
      if (doc?.slug) {
        const detailPaths = [
          `/servicii/${doc.slug}`,
          `/terapii/${doc.slug}`,
          `/cursuri/${doc.slug}`,
          `/clase/${doc.slug}`,
          `/tratamente/${doc.slug}`,
        ]

        for (const path of detailPaths) {
          revalidatePath(path)
        }
      }
    } catch (_e) {
      payload.logger.warn(`Could not revalidate service (likely running outside Next.js context)`)
    }
  }

  return doc
}
