import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { ArrowLeft, ShoppingCart, Tag, Package, Check } from 'lucide-react'
import RichText from '@/components/RichText'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Product, TenantHeader, TenantLogo, TenantBusinessInfo, Media } from '@/payload-types'
import { PageWrapper } from '@/components/PageWrapper'
import { getCachedTenantGlobalByDomain, getEffectiveTenantDomain } from '@/utilities/getTenantGlobal'
import { getServerSideURL } from '@/utilities/getURL'

// Static generation with ISR
export const dynamic = 'force-static'
export const revalidate = 600

interface PageProps {
  params: Promise<{ tenantDomain: string; slug: string }>
}

interface ProductImage {
  image?: Media | string | null
}

interface ProductCategory {
  id: string
  title?: string | null
  slug?: string | null
}

// Helper to get tenant ID from domain
async function getTenantIdFromDomain(
  payload: Awaited<ReturnType<typeof getPayload>>,
  domain: string
): Promise<string | null> {
  const result = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: domain } },
    limit: 1,
    depth: 0,
  })
  return result.docs[0]?.id || null
}

// Format price in RON
function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) return ''
  return new Intl.NumberFormat('ro-RO', {
    style: 'currency',
    currency: 'RON',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

// Get image URL from media object
function getImageUrl(media: Media | string | null | undefined): string | null {
  if (!media) return null
  if (typeof media === 'string') return null
  return media.url || null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tenantDomain: urlEncodedDomain, slug } = await params
  const rawTenantDomain = decodeURIComponent(urlEncodedDomain)
  const tenantDomain = await getEffectiveTenantDomain(rawTenantDomain)
  const payload = await getPayload({ config: configPromise })
  const tenantId = await getTenantIdFromDomain(payload, tenantDomain)

  const product = await payload.find({
    collection: 'products',
    where: {
      and: [
        { slug: { equals: slug } },
        ...(tenantId ? [{ tenant: { equals: tenantId } }] : []),
      ],
    },
    limit: 1,
    depth: 2,
  })

  if (!product.docs[0]) {
    return {
      title: 'Produs negasit | Shop',
      description: 'Produsul cautat nu a fost gasit.',
      robots: { index: false, follow: false },
    }
  }

  const productData = product.docs[0]
  const firstImage = productData.images?.[0] as ProductImage | undefined
  const imageUrl = getImageUrl(firstImage?.image)
  const serverUrl = getServerSideURL()

  return {
    title: `${productData.title} | Shop`,
    description: productData.shortDescription || `Cumpara ${productData.title}`,
    openGraph: {
      title: productData.title,
      description: productData.shortDescription || undefined,
      images: imageUrl ? [{ url: `${serverUrl}${imageUrl}` }] : [],
    },
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

export default async function ProductPage({ params }: PageProps) {
  const { tenantDomain: urlEncodedDomain, slug } = await params
  const rawTenantDomain = decodeURIComponent(urlEncodedDomain)
  const tenantDomain = await getEffectiveTenantDomain(rawTenantDomain)
  const payload = await getPayload({ config: configPromise })

  // Get tenant ID for filtering
  const tenantId = await getTenantIdFromDomain(payload, tenantDomain)

  // Fetch tenant globals
  const [headerData, logoData, businessInfo] = await Promise.all([
    getCachedTenantGlobalByDomain<TenantHeader>('header', tenantDomain),
    getCachedTenantGlobalByDomain<TenantLogo>('logo', tenantDomain),
    getCachedTenantGlobalByDomain<TenantBusinessInfo>('business-info', tenantDomain),
  ])

  const product = await payload.find({
    collection: 'products',
    where: {
      and: [
        { slug: { equals: slug } },
        ...(tenantId ? [{ tenant: { equals: tenantId } }] : []),
      ],
    },
    limit: 1,
    depth: 2,
  })

  if (!product.docs[0]) {
    notFound()
  }

  const productData = product.docs[0]
  const category = productData.category as ProductCategory | null
  const images = (productData.images || []) as ProductImage[]
  const firstImage = images[0]
  const firstImageUrl = getImageUrl(firstImage?.image)

  // Get price - check for priceInRON first, then prices array
  const price = (productData as Product & { priceInRON?: number }).priceInRON || null

  // Get related products from same category
  let relatedProducts: Product[] = []
  if (category) {
    const related = await payload.find({
      collection: 'products',
      where: {
        and: [
          { category: { equals: category.id } },
          { id: { not_equals: productData.id } },
          ...(tenantId ? [{ tenant: { equals: tenantId } }] : []),
        ],
      },
      limit: 4,
      depth: 2,
    })
    relatedProducts = related.docs
  }

  const serverUrl = getServerSideURL()
  const productUrl = `${serverUrl}/produse/${productData.slug}`

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productData.title,
    description: productData.shortDescription || '',
    image: firstImageUrl ? `${serverUrl}${firstImageUrl}` : undefined,
    sku: productData.sku || undefined,
    brand: productData.brand ? { '@type': 'Brand', name: productData.brand } : undefined,
    offers: price
      ? {
          '@type': 'Offer',
          price: price,
          priceCurrency: 'RON',
          availability: 'https://schema.org/InStock',
        }
      : undefined,
  }

  return (
    <PageWrapper
      headerData={headerData}
      logoData={logoData}
      businessInfoData={businessInfo}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-theme-text-muted">
              <li>
                <Link href="/" className="hover:text-theme-primary">
                  Acasa
                </Link>
              </li>
              <li>/</li>
              <li>
                <Link href="/produse" className="hover:text-theme-primary">
                  Produse
                </Link>
              </li>
              {category && (
                <>
                  <li>/</li>
                  <li>
                    <Link
                      href={`/categorii/${category.slug}`}
                      className="hover:text-theme-primary"
                    >
                      {category.title}
                    </Link>
                  </li>
                </>
              )}
              <li>/</li>
              <li className="text-theme-text font-medium">{productData.title}</li>
            </ol>
          </nav>

          {/* Product Detail */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Images */}
            <div className="space-y-4">
              {firstImageUrl && (
                <div className="relative aspect-square rounded-xl overflow-hidden bg-theme-light">
                  <Image
                    src={firstImageUrl}
                    alt={productData.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.slice(0, 4).map((img, index) => {
                    const imgUrl = getImageUrl(img.image)
                    if (!imgUrl) return null
                    return (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg overflow-hidden bg-theme-light"
                      >
                        <Image
                          src={imgUrl}
                          alt={`${productData.title} - ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {category && (
                <Link
                  href={`/categorii/${category.slug}`}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-theme-light text-theme-text-muted text-sm rounded-full hover:bg-theme-primary hover:text-theme-text-on-primary transition-colors"
                >
                  <Tag className="w-3 h-3" />
                  {category.title}
                </Link>
              )}

              <h1 className="text-3xl md:text-4xl font-bold text-theme-text">
                {productData.title}
              </h1>

              {productData.shortDescription && (
                <p className="text-lg text-theme-text-muted">
                  {productData.shortDescription}
                </p>
              )}

              {price && (
                <div className="text-3xl font-bold text-theme-primary">
                  {formatPrice(price)}
                </div>
              )}

              {/* Product attributes */}
              <div className="space-y-3 py-4 border-t border-b border-theme-border">
                {productData.sku && (
                  <div className="flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4 text-theme-text-muted" />
                    <span className="text-theme-text-muted">Cod:</span>
                    <span className="font-medium">{productData.sku}</span>
                  </div>
                )}
                {productData.brand && (
                  <div className="flex items-center gap-2 text-sm">
                    <Tag className="w-4 h-4 text-theme-text-muted" />
                    <span className="text-theme-text-muted">Brand:</span>
                    <span className="font-medium">{productData.brand}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <Check className="w-4 h-4" />
                  <span>In stoc</span>
                </div>
              </div>

              {/* Add to cart button */}
              <button
                type="button"
                className="w-full md:w-auto px-8 py-4 bg-theme-primary text-theme-text-on-primary font-semibold rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Adauga in cos
              </button>

              {/* Description */}
              {productData.description && (
                <div className="pt-6">
                  <h2 className="text-xl font-semibold text-theme-text mb-4">
                    Descriere
                  </h2>
                  <div className="prose prose-lg max-w-none text-theme-text-muted">
                    <RichText
                      data={productData.description as SerializedEditorState}
                      enableGutter={false}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Back link */}
          <div className="mt-12">
            <Link
              href="/produse"
              className="inline-flex items-center gap-2 text-theme-primary font-medium hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Inapoi la produse
            </Link>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="bg-theme-light py-16 mt-16">
            <div className="container mx-auto px-4">
              <h2 className="text-2xl font-bold text-theme-text mb-8">
                Produse similare
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => {
                  const relatedImages = (relatedProduct.images || []) as ProductImage[]
                  const relatedImageUrl = getImageUrl(relatedImages[0]?.image)
                  const relatedPrice = (relatedProduct as Product & { priceInRON?: number }).priceInRON

                  return (
                    <Link
                      key={relatedProduct.id}
                      href={`/produse/${relatedProduct.slug}`}
                      className="group bg-theme-surface rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all"
                    >
                      {relatedImageUrl && (
                        <div className="relative aspect-square overflow-hidden">
                          <Image
                            src={relatedImageUrl}
                            alt={relatedProduct.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold text-theme-text group-hover:text-theme-primary transition-colors line-clamp-2">
                          {relatedProduct.title}
                        </h3>
                        {relatedPrice && (
                          <p className="mt-2 text-lg font-bold text-theme-primary">
                            {formatPrice(relatedPrice)}
                          </p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}
      </main>
    </PageWrapper>
  )
}
