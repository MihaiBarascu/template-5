import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ProductDetails } from './ProductDetails'
import { generateProductMeta } from '@/utilities/generateMeta'
import { getServerSideURL } from '@/utilities/getURL'

// Revalidate page every 60 seconds for ISR
export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const product = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!product.docs[0]) {
    notFound()
  }

  const productData = product.docs[0]

  // Get related products from same category
  let relatedProducts: typeof product.docs = []
  if (productData.category) {
    const categoryId = typeof productData.category === 'object' ? productData.category.id : productData.category
    const related = await payload.find({
      collection: 'products',
      where: {
        and: [
          {
            category: {
              equals: categoryId,
            },
          },
          {
            id: {
              not_equals: productData.id,
            },
          },
        ],
      },
      limit: 4,
    })
    relatedProducts = related.docs
  }

  const category = typeof productData.category === 'object' ? productData.category : null

  // Prepare related products data
  const relatedProductsData = relatedProducts.map((related) => {
    const relatedImage = related.images?.[0]?.image
    const relatedImageUrl = relatedImage && typeof relatedImage !== 'string' ? relatedImage.url : null

    return {
      id: related.id,
      slug: related.slug,
      title: related.title,
      priceInRON: related.priceInRON ?? 0,
      imageUrl: relatedImageUrl ?? null,
    }
  })

  // Get image URL for structured data
  const firstImage = productData.images?.[0]?.image
  const imageUrl = firstImage && typeof firstImage !== 'string' ? firstImage.url : null
  const serverUrl = getServerSideURL()

  // JSON-LD Structured Data for Product (Schema.org)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productData.title,
    description: (productData as { shortDescription?: string }).shortDescription || '',
    image: imageUrl ? `${serverUrl}${imageUrl}` : undefined,
    sku: (productData as { sku?: string }).sku || productData.id,
    brand: (productData as { brand?: string }).brand ? {
      '@type': 'Brand',
      name: (productData as { brand?: string }).brand,
    } : undefined,
    offers: {
      '@type': 'Offer',
      url: `${serverUrl}/produse/${productData.slug}`,
      priceCurrency: 'RON',
      price: productData.priceInRON ?? 0,
      availability: (productData.inventory ?? 0) > 0
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  }

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductDetails
        product={productData}
        category={category ? { title: category.title, slug: category.slug } : null}
        relatedProducts={relatedProductsData}
      />
    </>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const product = await payload.find({
    collection: 'products',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 2, // Fetch related media for OG images
  })

  if (!product.docs[0]) {
    return {
      title: 'Produs negasit | Magazin',
      description: 'Produsul cautat nu a fost gasit.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  // Use the improved generateProductMeta utility
  return generateProductMeta({ product: product.docs[0] })
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })

    const products = await payload.find({
      collection: 'products',
      limit: 100,
      where: {
        slug: {
          exists: true,
        },
      },
    })

    return products.docs
      .filter((product) => product.slug)
      .map((product) => ({
        slug: product.slug,
      }))
  } catch {
    // Return empty array during build when DB is not available
    // Pages will be generated on-demand with ISR
    return []
  }
}
