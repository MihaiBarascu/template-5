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
}

export const mergeOpenGraph = (og?: Metadata['openGraph']): Metadata['openGraph'] => {
  return {
    ...defaultOpenGraph,
    ...og,
    images: og?.images ? og.images : defaultOpenGraph.images,
  }
}
