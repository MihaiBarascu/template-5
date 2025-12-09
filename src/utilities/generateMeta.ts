import type { Metadata } from 'next'
import type { Media, Page, Post, Product, Service, Config } from '../payload-types'
import { mergeOpenGraph } from './mergeOpenGraph'
import { getServerSideURL } from './getURL'

/**
 * Generate SEO metadata for Next.js pages
 * Following Payload CMS official best practices
 * https://payloadcms.com/docs/plugins/seo
 */

// Type for documents with SEO meta field (added by seoPlugin)
interface WithMeta {
  meta?: {
    title?: string | null
    description?: string | null
    image?: Media | string | null
  } | null
}

// Type for the doc parameter - union of all supported document types
type SEODocument = (Partial<Page> | Partial<Post> | Partial<Product> | Partial<Service>) & WithMeta

/**
 * Get the URL for an image, preferring OG-optimized sizes
 */
const getImageURL = (image?: Media | Config['db']['defaultIDType'] | null): string => {
  const serverUrl = getServerSideURL()
  const defaultImage = `${serverUrl}/og-image.png`

  if (!image || typeof image !== 'object' || !('url' in image)) {
    return defaultImage
  }

  // Prefer OG-sized images (1200x630 recommended for social)
  // Fallback to hero -> card -> original
  const sizes = image.sizes as Record<string, { url?: string | null }> | undefined
  const ogUrl = sizes?.hero?.url || sizes?.card?.url

  if (ogUrl) {
    return `${serverUrl}${ogUrl}`
  }

  return image.url ? `${serverUrl}${image.url}` : defaultImage
}

/**
 * Get canonical URL for a document
 */
const getCanonicalURL = (doc: SEODocument, collectionSlug?: string): string => {
  const serverUrl = getServerSideURL()

  // Get slug - handle both string and array slugs
  const slugValue = doc.slug
  const slug = Array.isArray(slugValue) ? slugValue.join('/') : slugValue

  if (!slug || slug === 'home') {
    return serverUrl
  }

  // Different URL patterns based on collection
  switch (collectionSlug) {
    case 'posts':
      return `${serverUrl}/blog/${slug}`
    case 'products':
      return `${serverUrl}/produse/${slug}`
    case 'services':
      return `${serverUrl}/servicii/${slug}`
    default:
      return `${serverUrl}/${slug}`
  }
}

/**
 * Extract plain text from Lexical rich text
 */
const extractTextFromRichText = (richText: unknown, maxLength = 160): string => {
  if (!richText || typeof richText !== 'object') return ''

  const root = (richText as { root?: { children?: unknown[] } })?.root
  if (!root?.children) return ''

  const extractText = (nodes: unknown[]): string => {
    let text = ''
    for (const node of nodes) {
      if (typeof node !== 'object' || !node) continue
      const n = node as { text?: string; children?: unknown[] }
      if (n.text) {
        text += n.text + ' '
      }
      if (n.children && Array.isArray(n.children)) {
        text += extractText(n.children)
      }
    }
    return text
  }

  const fullText = extractText(root.children).trim()
  if (fullText.length <= maxLength) return fullText
  return fullText.slice(0, maxLength - 3).trim() + '...'
}

/**
 * Get description from document
 */
const getDescription = (doc: SEODocument): string => {
  // First try meta.description (from SEO plugin)
  if (doc.meta?.description) {
    return doc.meta.description
  }

  // Try excerpt (Posts)
  if ('excerpt' in doc && doc.excerpt) {
    return doc.excerpt
  }

  // Try shortDescription (Products, Services)
  if ('shortDescription' in doc && doc.shortDescription) {
    return doc.shortDescription
  }

  // Try to extract from hero subheadline (Pages)
  if ('hero' in doc && doc.hero) {
    const hero = doc.hero as { subheadline?: string; headline?: string }
    if (hero.subheadline && typeof hero.subheadline === 'string') {
      return hero.subheadline.slice(0, 160)
    }
    // Fallback to headline if no subheadline
    if (hero.headline && typeof hero.headline === 'string') {
      return hero.headline.slice(0, 160)
    }
  }

  // Try to extract from first Content block (columns[].richText)
  if ('layout' in doc && Array.isArray(doc.layout)) {
    for (const block of doc.layout) {
      if (block.blockType === 'content') {
        const contentBlock = block as { columns?: Array<{ richText?: unknown }> }
        if (contentBlock.columns) {
          for (const col of contentBlock.columns) {
            if (col.richText) {
              const extracted = extractTextFromRichText(col.richText)
              if (extracted) return extracted
            }
          }
        }
      }
    }
  }

  return ''
}

/**
 * Get title from document
 */
const getTitle = (doc: SEODocument, suffix = 'Site Business'): string => {
  // First try meta.title (from SEO plugin)
  if (doc.meta?.title) {
    return doc.meta.title
  }

  // Try title field
  if ('title' in doc && doc.title) {
    return `${doc.title} | ${suffix}`
  }

  // Try name field (for Team members)
  if ('name' in doc && doc.name) {
    return `${doc.name} | ${suffix}`
  }

  return suffix
}

/**
 * Main function to generate metadata for a document
 */
export const generateMeta = async (args: {
  doc: SEODocument | null
  collectionSlug?: string
}): Promise<Metadata> => {
  const { doc, collectionSlug } = args

  if (!doc) {
    return {
      title: 'Pagina nu a fost gasita | Site Business',
      description: 'Pagina cautata nu exista.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const title = getTitle(doc)
  const description = getDescription(doc)
  const ogImage = getImageURL(doc.meta?.image as Media | undefined)
  const canonicalUrl = getCanonicalURL(doc, collectionSlug)

  // Determine OG type based on collection
  // Note: 'product' is not a valid OG type in Next.js, use 'website' for products
  const ogType: 'website' | 'article' = collectionSlug === 'posts' ? 'article' : 'website'

  return {
    title,
    description: description || undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: mergeOpenGraph({
      title,
      description: description || undefined,
      type: ogType,
      url: canonicalUrl,
      images: ogImage
        ? [
            {
              url: ogImage,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : undefined,
    }),
    twitter: {
      card: 'summary_large_image',
      title,
      description: description || undefined,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

/**
 * Generate metadata for product pages with additional product-specific fields
 */
export const generateProductMeta = async (args: {
  product: Product | null
}): Promise<Metadata> => {
  const { product } = args

  if (!product) {
    return generateMeta({ doc: null })
  }

  const baseMeta = await generateMeta({
    doc: product as SEODocument,
    collectionSlug: 'products',
  })

  // Add product-specific meta via openGraph for products
  // Using og:product namespace for product metadata
  return {
    ...baseMeta,
    openGraph: {
      ...baseMeta.openGraph,
      // Product-specific OG tags will be handled by JSON-LD instead
    },
  }
}

/**
 * Generate metadata for service pages
 */
export const generateServiceMeta = async (args: {
  service: Service | null
}): Promise<Metadata> => {
  const { service } = args

  if (!service) {
    return generateMeta({ doc: null })
  }

  return generateMeta({
    doc: service as SEODocument,
    collectionSlug: 'services',
  })
}

/**
 * Generate metadata for post pages
 */
export const generatePostMeta = async (args: {
  post: Post | null
}): Promise<Metadata> => {
  const { post } = args

  if (!post) {
    return generateMeta({ doc: null })
  }

  const baseMeta = await generateMeta({
    doc: post as SEODocument,
    collectionSlug: 'posts',
  })

  // Get author name if available
  const author = post.author
  const authorName = author && typeof author === 'object' && 'name' in author
    ? author.name
    : undefined

  // Add article-specific meta via openGraph
  return {
    ...baseMeta,
    openGraph: {
      ...baseMeta.openGraph,
      type: 'article',
      // Article-specific OG tags
      publishedTime: post.publishedAt || post.createdAt,
      modifiedTime: post.updatedAt,
      authors: authorName ? [authorName] : undefined,
    },
  }
}
