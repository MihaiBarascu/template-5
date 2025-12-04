import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Config } from '@/payload-types'

type GlobalSlug = keyof Config['globals']

/**
 * Fetch a global by slug.
 * Uses Payload's Local API for direct database access.
 */
export async function getGlobal<T extends GlobalSlug>(
  slug: T,
  depth: number = 1,
): Promise<Config['globals'][T]> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.findGlobal({
    slug,
    depth,
  })

  return result as Config['globals'][T]
}

/**
 * Cached version of getGlobal.
 * Uses Next.js unstable_cache with semantic tags for revalidation.
 *
 * @example
 * const header = await getCachedGlobal('header')
 * const businessInfo = await getCachedGlobal('business-info')
 */
export function getCachedGlobal<T extends GlobalSlug>(
  slug: T,
  depth: number = 1,
) {
  return unstable_cache(
    async () => getGlobal(slug, depth),
    [`global_${slug}`],
    {
      tags: [`global_${slug}`],
      revalidate: 60, // Fallback revalidation in seconds
    },
  )()
}
