import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Team } from '@/payload-types'

// Common paths where team members might be displayed
const TEAM_LISTING_PATHS = [
  '/echipa',
  '/despre',
  '/antrenori',
  '/', // Homepage might have team block
]

export const revalidateTeamAfterChange: CollectionAfterChangeHook<Team> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    try {
      payload.logger.info(`Revalidating team member: ${doc.slug}`)

      // Revalidate the team tag (used by team blocks)
      revalidateTag('team', 'max')

      // Revalidate common team listing pages
      for (const path of TEAM_LISTING_PATHS) {
        revalidatePath(path)
      }

      // Revalidate possible detail paths for this team member
      const detailPaths = [
        `/echipa/${doc.slug}`,
        `/antrenori/${doc.slug}`,
      ]

      for (const path of detailPaths) {
        revalidatePath(path)
      }

      // If slug changed, also revalidate old paths
      if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
        const oldDetailPaths = [
          `/echipa/${previousDoc.slug}`,
          `/antrenori/${previousDoc.slug}`,
        ]

        for (const path of oldDetailPaths) {
          revalidatePath(path)
        }
      }
    } catch (_e) {
      payload.logger.warn(`Could not revalidate team member ${doc.slug} (likely running outside Next.js context)`)
    }
  }
  return doc
}

export const revalidateTeamAfterDelete: CollectionAfterDeleteHook<Team> = ({
  doc,
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    try {
      payload.logger.info(`Revalidating deleted team member: ${doc?.slug}`)

      // Revalidate the team tag
      revalidateTag('team', 'max')

      // Revalidate common team listing pages
      for (const path of TEAM_LISTING_PATHS) {
        revalidatePath(path)
      }

      // Revalidate possible detail paths
      if (doc?.slug) {
        const detailPaths = [
          `/echipa/${doc.slug}`,
          `/antrenori/${doc.slug}`,
        ]

        for (const path of detailPaths) {
          revalidatePath(path)
        }
      }
    } catch (_e) {
      payload.logger.warn(`Could not revalidate team member (likely running outside Next.js context)`)
    }
  }

  return doc
}
