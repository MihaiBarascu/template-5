import type { Metadata } from 'next'
import { getServerSideURL } from './getURL'

const defaultOpenGraph: Metadata['openGraph'] = {
  type: 'website',
  description: 'Platforma web pentru afaceri din Romania.',
  images: [
    {
      url: `${getServerSideURL()}/og-image.png`,
    },
  ],
  siteName: 'Site Business',
  title: 'Site Business Romania',
  locale: 'ro_RO',
}

/**
 * Filter out undefined values from an object
 * This prevents undefined from overriding defaults when spreading
 */
const filterUndefined = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, value]) => value !== undefined)
  ) as Partial<T>
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  // Filter out undefined values to preserve defaults
  const filteredOg = og ? filterUndefined(og as Record<string, unknown>) : {}

  return {
    ...defaultOpenGraph,
    ...filteredOg,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
