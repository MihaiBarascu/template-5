import { getServerSideURL } from '@/utilities/getURL'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const serverURL = getServerSideURL()

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${serverURL}/sitemap.xml`,
  }
}
