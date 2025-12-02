import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { AddToCartButton } from '@/components/cart/AddToCartButton'

// Revalidate page every 60 seconds for ISR
export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  // Get product category
  const category = await payload.find({
    collection: 'product-categories',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!category.docs[0]) {
    notFound()
  }

  const categoryData = category.docs[0] as any

  // Get products in this category
  const products = await payload.find({
    collection: 'products',
    where: {
      category: {
        equals: categoryData.id,
      },
    },
    limit: 100,
    depth: 2,
  })

  return (
    <main className="py-8">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-theme-primary">Acasa</Link>
          <span>/</span>
          <Link href="/categorii" className="hover:text-theme-primary">Categorii</Link>
          <span>/</span>
          <span className="text-gray-900">{categoryData.title}</span>
        </nav>
      </div>

      {/* Category Header */}
      <div className="bg-gray-50 py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {categoryData.title}
          </h1>
          {categoryData.description && (
            <p className="text-lg text-gray-600 max-w-2xl">
              {categoryData.description}
            </p>
          )}
          <p className="text-sm text-gray-500 mt-2">
            {products.totalDocs} {products.totalDocs === 1 ? 'produs' : 'produse'}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container mx-auto px-4">
        {products.docs.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.docs.map((product: any) => {
              const productImage = product.images?.[0]?.image
              const hasDiscount = product.salePrice && product.salePrice < product.price
              const discountPercent = hasDiscount
                ? Math.round((1 - product.salePrice / product.price) * 100)
                : 0

              return (
                <div key={product.id} className="group">
                  <Link href={`/produse/${product.slug}`} className="block">
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                      {productImage?.url ? (
                        <Image
                          src={productImage.url}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Fara imagine
                        </div>
                      )}
                      {hasDiscount && (
                        <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
                          -{discountPercent}%
                        </span>
                      )}
                    </div>
                  </Link>

                  <Link href={`/produse/${product.slug}`}>
                    <h3 className="font-medium text-gray-900 group-hover:text-theme-primary transition-colors line-clamp-2 mb-1">
                      {product.title}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2 mb-3">
                    {hasDiscount ? (
                      <>
                        <span className="font-bold text-red-600">{product.salePrice} RON</span>
                        <span className="text-sm text-gray-400 line-through">{product.price} RON</span>
                      </>
                    ) : (
                      <span className="font-bold text-gray-900">{product.price} RON</span>
                    )}
                  </div>

                  <AddToCartButton
                    product={{
                      id: product.id,
                      title: product.title,
                      price: hasDiscount ? product.salePrice : product.price,
                      image: productImage?.url,
                    }}
                    className="w-full py-2 text-sm"
                    disabled={product.stock <= 0}
                  />
                </div>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">Nu exista produse in aceasta categorie.</p>
            <Link href="/produse" className="text-theme-primary hover:underline">
              Vezi toate produsele
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const category = await payload.find({
    collection: 'product-categories',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!category.docs[0]) {
    return {
      title: 'Categorie negasita',
    }
  }

  const categoryData = category.docs[0] as any

  return {
    title: `${categoryData.title} | EcoShop`,
    description: categoryData.description || `Produse din categoria ${categoryData.title}`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const categories = await payload.find({
    collection: 'product-categories',
    limit: 100,
  })

  return categories.docs.map((category) => ({
    slug: (category as any).slug,
  }))
}
