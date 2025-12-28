import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PageWrapper } from '@/components/PageWrapper'
import { getCachedTenantGlobalByDomain, getEffectiveTenantDomain } from '@/utilities/getTenantGlobal'
import type { TenantHeader, TenantLogo, TenantBusinessInfo, TenantShopSetting } from '@/payload-types'

// Revalidate page every 60 seconds for ISR
export const revalidate = 60

interface PageProps {
  params: Promise<{ tenantDomain: string }>
}

// Helper to get tenant ID from domain
async function getTenantIdFromDomain(payload: Awaited<ReturnType<typeof getPayload>>, domain: string): Promise<string | null> {
  const result = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: domain } },
    limit: 1,
    depth: 0,
  })
  return result.docs[0]?.id || null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tenantDomain: urlEncodedDomain } = await params
  const rawTenantDomain = decodeURIComponent(urlEncodedDomain)
  const tenantDomain = await getEffectiveTenantDomain(rawTenantDomain)
  const businessInfo = await getCachedTenantGlobalByDomain<TenantBusinessInfo>('business-info', tenantDomain)

  return {
    title: `Categorii Produse | ${businessInfo?.name || 'Magazin'}`,
    description: 'Exploreaza toate categoriile de produse naturale si organice',
  }
}

export default async function CategoriesPage({ params }: PageProps) {
  const { tenantDomain: urlEncodedDomain } = await params
  // Decode URL-encoded domain (e.g., "localhost%3A3100" -> "localhost:3100")
  const rawTenantDomain = decodeURIComponent(urlEncodedDomain)
  // Get effective tenant domain (handles localhost fallback in development)
  const tenantDomain = await getEffectiveTenantDomain(rawTenantDomain)
  const payload = await getPayload({ config: configPromise })

  // Get tenant ID for filtering
  const tenantId = await getTenantIdFromDomain(payload, tenantDomain)

  // Fetch header globals and shop settings (all per-tenant now)
  const [headerData, logoData, businessInfo, shopSettings] = await Promise.all([
    getCachedTenantGlobalByDomain<TenantHeader>('header', tenantDomain),
    getCachedTenantGlobalByDomain<TenantLogo>('logo', tenantDomain),
    getCachedTenantGlobalByDomain<TenantBusinessInfo>('business-info', tenantDomain),
    getCachedTenantGlobalByDomain<TenantShopSetting>('shop-settings', tenantDomain),
  ])

  // Get all product categories for this tenant
  const categories = await payload.find({
    collection: 'product-categories',
    where: tenantId ? { tenant: { equals: tenantId } } : {},
    limit: 100,
    sort: 'order',
  })

  // Get product count for each category
  const categoriesWithCount = await Promise.all(
    categories.docs.map(async (category) => {
      const products = await payload.find({
        collection: 'products',
        where: {
          and: [
            { category: { equals: category.id } },
            ...(tenantId ? [{ tenant: { equals: tenantId } }] : []),
          ],
        },
        limit: 0,
      })
      return {
        ...category,
        productCount: products.totalDocs,
      }
    })
  )

  return (
    <PageWrapper
      headerData={headerData}
      logoData={logoData}
      businessInfoData={businessInfo}
      showCart={shopSettings?.enabled ?? false}
    >
      <main className="py-8">
        {/* Hero */}
        <div className="bg-theme-light py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-theme-text mb-4">
            Categorii Produse
          </h1>
          <p className="text-lg text-theme-text-light max-w-2xl mx-auto">
            Exploreaza gama noastra de produse naturale organizate pe categorii
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-16">
        {categoriesWithCount.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoriesWithCount.map((category) => (
              <Link
                key={category.id}
                href={`/produse?categorie=${category.slug}`}
                className="group block p-6 bg-theme-surface border border-theme-border rounded-xl hover:border-theme-primary hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-theme-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-theme-primary/20 transition-colors">
                  <svg className="w-6 h-6 text-theme-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>

                <h2 className="text-xl font-semibold text-theme-text mb-2 group-hover:text-theme-primary transition-colors">
                  {category.title}
                </h2>

                {category.description && (
                  <p className="text-sm text-theme-text-light mb-3 line-clamp-2">
                    {category.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-sm text-theme-text-muted">
                    {category.productCount} {category.productCount === 1 ? 'produs' : 'produse'}
                  </span>
                  <span className="text-theme-primary group-hover:translate-x-1 transition-transform">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-theme-text-muted">Nu exista categorii momentan.</p>
          </div>
        )}
        </div>
      </main>
    </PageWrapper>
  )
}
