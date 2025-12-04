import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { getServerSideURL } from '@/utilities/getURL'
import type { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payload = await getPayload({ config: configPromise })
  const serverURL = getServerSideURL()

  const sitemap: MetadataRoute.Sitemap = [
    {
      url: serverURL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
  ]

  // Add pages
  const pages = await payload.find({
    collection: 'pages',
    where: {
      _status: { equals: 'published' },
    },
    limit: 1000,
    depth: 0,
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  for (const page of pages.docs) {
    if (page.slug === 'home') continue // Already added as root
    sitemap.push({
      url: `${serverURL}/${page.slug}`,
      lastModified: page.updatedAt ? new Date(page.updatedAt) : new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })
  }

  // Add blog posts
  const posts = await payload.find({
    collection: 'posts',
    where: {
      _status: { equals: 'published' },
    },
    limit: 1000,
    depth: 0,
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  for (const post of posts.docs) {
    sitemap.push({
      url: `${serverURL}/blog/${post.slug}`,
      lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    })
  }

  // Add services
  const services = await payload.find({
    collection: 'services',
    limit: 1000,
    depth: 0,
    select: {
      slug: true,
      updatedAt: true,
    },
  })

  for (const service of services.docs) {
    sitemap.push({
      url: `${serverURL}/servicii/${service.slug}`,
      lastModified: service.updatedAt ? new Date(service.updatedAt) : new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    })
  }

  // Add products if they exist
  try {
    const products = await payload.find({
      collection: 'products',
      limit: 1000,
      depth: 0,
      select: {
        slug: true,
        updatedAt: true,
      },
    })

    for (const product of products.docs) {
      sitemap.push({
        url: `${serverURL}/produse/${product.slug}`,
        lastModified: product.updatedAt ? new Date(product.updatedAt) : new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
      })
    }
  } catch {
    // Products collection may not exist
  }

  return sitemap
}
