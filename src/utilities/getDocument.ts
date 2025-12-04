import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Config } from '@/payload-types'

type CollectionSlug = keyof Config['collections']

/**
 * Fetch a single document from a collection by slug.
 * Uses Payload's Local API for direct database access.
 */
export async function getDocument<T extends CollectionSlug>(
  collection: T,
  slug: string,
  depth: number = 1,
): Promise<Config['collections'][T] | null> {
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection,
    depth,
    limit: 1,
    pagination: false,
    where: {
      slug: { equals: slug },
    },
  })

  return (result.docs?.[0] as Config['collections'][T]) || null
}

/**
 * Cached version of getDocument.
 * Uses Next.js unstable_cache with semantic tags for revalidation.
 *
 * @example
 * const page = await getCachedDocument('pages', 'about')
 */
export function getCachedDocument<T extends CollectionSlug>(
  collection: T,
  slug: string,
  depth: number = 1,
) {
  return unstable_cache(
    async () => getDocument(collection, slug, depth),
    [`${collection}_${slug}`],
    {
      tags: [`${collection}_${slug}`, collection],
      revalidate: 60, // Fallback revalidation in seconds
    },
  )()
}

/**
 * Fetch a document by ID.
 */
export async function getDocumentById<T extends CollectionSlug>(
  collection: T,
  id: string,
  depth: number = 1,
): Promise<Config['collections'][T] | null> {
  const payload = await getPayload({ config: configPromise })

  try {
    const result = await payload.findByID({
      collection,
      id,
      depth,
    })

    return result as Config['collections'][T]
  } catch {
    return null
  }
}

/**
 * Cached version of getDocumentById.
 */
export function getCachedDocumentById<T extends CollectionSlug>(
  collection: T,
  id: string,
  depth: number = 1,
) {
  return unstable_cache(
    async () => getDocumentById(collection, id, depth),
    [`${collection}_id_${id}`],
    {
      tags: [`${collection}_id_${id}`, collection],
      revalidate: 60,
    },
  )()
}
