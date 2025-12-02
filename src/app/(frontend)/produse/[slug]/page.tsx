import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ProductDetails } from './ProductDetails'

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

  // Extract image URLs for the gallery
  const images = (productData.images || [])
    .map((img) => {
      const imgData = img.image && typeof img.image !== 'string' ? img.image : null
      return imgData?.url || null
    })
    .filter((url): url is string => url !== null)

  const category = typeof productData.category === 'object' ? productData.category : null
  const salePrice = productData.salePrice ?? 0
  const hasDiscount = salePrice > 0 && salePrice < productData.price

  // Prepare related products data
  const relatedProductsData = relatedProducts.map((related) => {
    const relatedImage = related.images?.[0]?.image
    const relatedImageUrl = relatedImage && typeof relatedImage !== 'string' ? relatedImage.url : null
    const relatedSalePrice = related.salePrice ?? 0
    const relatedHasDiscount = relatedSalePrice > 0 && relatedSalePrice < related.price

    return {
      id: related.id,
      slug: related.slug,
      title: related.title,
      price: related.price,
      salePrice: relatedSalePrice,
      hasDiscount: relatedHasDiscount,
      imageUrl: relatedImageUrl ?? null,
    }
  })

  return (
    <ProductDetails
      product={{
        id: productData.id,
        title: productData.title,
        price: productData.price,
        salePrice,
        hasDiscount,
        inventory: productData.inventory ?? 0,
        badge: productData.badge || undefined,
        description: productData.description,
        images,
      }}
      category={category ? { title: category.title, slug: category.slug } : null}
      relatedProducts={relatedProductsData}
    />
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
  })

  if (!product.docs[0]) {
    return {
      title: 'Produs negasit',
    }
  }

  const productData = product.docs[0]

  return {
    title: `${productData.title} | EcoShop`,
    description: (productData as { shortDescription?: string }).shortDescription || `Cumpara ${productData.title} la cel mai bun pret`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    limit: 100,
  })

  return products.docs.map((product) => ({
    slug: product.slug,
  }))
}
