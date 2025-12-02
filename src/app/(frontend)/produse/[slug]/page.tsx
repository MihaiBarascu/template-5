import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import type { Metadata } from 'next'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import React from 'react'

// Revalidate page every 60 seconds for ISR
export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

// Safe rich text renderer - avoids dangerouslySetInnerHTML
interface LexicalNode {
  type: string
  children?: LexicalNode[]
  text?: string
  format?: number
  tag?: string
  listType?: string
  url?: string
  target?: string
}

function RichTextContent({ nodes }: { nodes: LexicalNode[] }) {
  return (
    <>
      {nodes.map((node, index) => {
        // Handle text nodes
        if (node.type === 'text') {
          let content: React.ReactNode = node.text || ''
          // Handle text formatting (bold, italic, underline)
          if (node.format) {
            if (node.format & 1) content = <strong key={`bold-${index}`}>{content}</strong>
            if (node.format & 2) content = <em key={`italic-${index}`}>{content}</em>
            if (node.format & 8) content = <u key={`underline-${index}`}>{content}</u>
            if (node.format & 16) content = <code key={`code-${index}`}>{content}</code>
          }
          return <React.Fragment key={index}>{content}</React.Fragment>
        }

        // Handle paragraph
        if (node.type === 'paragraph') {
          return (
            <p key={index}>
              {node.children ? <RichTextContent nodes={node.children} /> : null}
            </p>
          )
        }

        // Handle headings
        if (node.type === 'heading') {
          const tag = node.tag || 'h2'
          const HeadingTag = tag as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
          return (
            <HeadingTag key={index}>
              {node.children ? <RichTextContent nodes={node.children} /> : null}
            </HeadingTag>
          )
        }

        // Handle lists
        if (node.type === 'list') {
          const Tag = node.listType === 'number' ? 'ol' : 'ul'
          return (
            <Tag key={index}>
              {node.children ? <RichTextContent nodes={node.children} /> : null}
            </Tag>
          )
        }

        // Handle list items
        if (node.type === 'listitem') {
          return (
            <li key={index}>
              {node.children ? <RichTextContent nodes={node.children} /> : null}
            </li>
          )
        }

        // Handle links
        if (node.type === 'link') {
          return (
            <a
              key={index}
              href={node.url || '#'}
              target={node.target || undefined}
              rel={node.target === '_blank' ? 'noopener noreferrer' : undefined}
            >
              {node.children ? <RichTextContent nodes={node.children} /> : null}
            </a>
          )
        }

        // Handle quote/blockquote
        if (node.type === 'quote') {
          return (
            <blockquote key={index}>
              {node.children ? <RichTextContent nodes={node.children} /> : null}
            </blockquote>
          )
        }

        // Handle linebreak
        if (node.type === 'linebreak') {
          return <br key={index} />
        }

        // Default: try to render children if present
        if (node.children) {
          return <RichTextContent key={index} nodes={node.children} />
        }

        return null
      })}
    </>
  )
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

  const productData = product.docs[0] as any

  // Get related products from same category
  let relatedProducts: any[] = []
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

  const mainImage = productData.images?.[0]?.image
  const category = typeof productData.category === 'object' ? productData.category : null
  const hasDiscount = productData.salePrice && productData.salePrice < productData.price
  const discountPercent = hasDiscount
    ? Math.round((1 - productData.salePrice / productData.price) * 100)
    : 0

  return (
    <main className="py-8">
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 mb-8">
        <nav className="flex items-center gap-2 text-sm text-gray-600">
          <Link href="/" className="hover:text-theme-primary">Acasa</Link>
          <span>/</span>
          <Link href="/produse" className="hover:text-theme-primary">Produse</Link>
          {category && (
            <>
              <span>/</span>
              <Link href={`/categorii/${category.slug}`} className="hover:text-theme-primary">
                {category.title}
              </Link>
            </>
          )}
          <span>/</span>
          <span className="text-gray-900">{productData.title}</span>
        </nav>
      </div>

      {/* Product Details */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100">
              {mainImage?.url ? (
                <Image
                  src={mainImage.url}
                  alt={productData.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  Fara imagine
                </div>
              )}
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  -{discountPercent}%
                </div>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {productData.images && productData.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {productData.images.map((img: any, index: number) => (
                  <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 ring-theme-primary">
                    {img.image?.url && (
                      <Image
                        src={img.image.url}
                        alt={`${productData.title} - ${index + 1}`}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            {category && (
              <Link
                href={`/categorii/${category.slug}`}
                className="inline-block text-sm text-theme-primary hover:underline"
              >
                {category.title}
              </Link>
            )}

            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {productData.title}
            </h1>

            {productData.shortDescription && (
              <p className="text-lg text-gray-600">
                {productData.shortDescription}
              </p>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-bold text-red-600">
                    {productData.salePrice} RON
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    {productData.price} RON
                  </span>
                </>
              ) : (
                <span className="text-3xl font-bold text-gray-900">
                  {productData.price} RON
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2">
              {productData.stock > 0 ? (
                <>
                  <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                  <span className="text-green-600 font-medium">In stoc ({productData.stock} {productData.unit || 'buc'})</span>
                </>
              ) : (
                <>
                  <span className="w-3 h-3 bg-red-500 rounded-full"></span>
                  <span className="text-red-600 font-medium">Stoc epuizat</span>
                </>
              )}
            </div>

            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4">
              <AddToCartButton
                product={{
                  id: productData.id,
                  title: productData.title,
                  price: hasDiscount ? productData.salePrice : productData.price,
                  image: mainImage?.url,
                }}
                className="flex-1 py-4 text-lg"
                disabled={productData.stock <= 0}
              />
            </div>

            {/* SKU */}
            {productData.sku && (
              <p className="text-sm text-gray-500">
                Cod produs: <span className="font-medium">{productData.sku}</span>
              </p>
            )}

            {/* Specifications */}
            {productData.specifications && productData.specifications.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Specificatii</h3>
                <dl className="grid grid-cols-2 gap-4">
                  {productData.specifications.map((spec: any, index: number) => (
                    <div key={index}>
                      <dt className="text-sm text-gray-500">{spec.name}</dt>
                      <dd className="font-medium">{spec.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {productData.description && (
          <div className="mt-12 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Descriere</h2>
            <div className="prose max-w-none">
              {/* Render rich text description safely */}
              {typeof productData.description === 'object' && productData.description.root?.children ? (
                <RichTextContent nodes={productData.description.root.children} />
              ) : (
                <p>{String(productData.description)}</p>
              )}
            </div>
          </div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 border-t pt-12">
            <h2 className="text-2xl font-bold mb-8">Produse similare</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((related: any) => {
                const relatedImage = related.images?.[0]?.image
                const relatedHasDiscount = related.salePrice && related.salePrice < related.price

                return (
                  <Link
                    key={related.id}
                    href={`/produse/${related.slug}`}
                    className="group"
                  >
                    <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-3">
                      {relatedImage?.url ? (
                        <Image
                          src={relatedImage.url}
                          alt={related.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          Fara imagine
                        </div>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-theme-primary transition-colors line-clamp-2">
                      {related.title}
                    </h3>
                    <div className="mt-1">
                      {relatedHasDiscount ? (
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-red-600">{related.salePrice} RON</span>
                          <span className="text-sm text-gray-400 line-through">{related.price} RON</span>
                        </div>
                      ) : (
                        <span className="font-bold">{related.price} RON</span>
                      )}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </main>
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

  const productData = product.docs[0] as any

  return {
    title: `${productData.title} | EcoShop`,
    description: productData.shortDescription || `Cumpara ${productData.title} la cel mai bun pret`,
  }
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const products = await payload.find({
    collection: 'products',
    limit: 100,
  })

  return products.docs.map((product) => ({
    slug: (product as any).slug,
  }))
}
