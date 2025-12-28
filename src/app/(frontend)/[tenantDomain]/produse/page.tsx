import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Suspense } from 'react'
import type { Metadata } from 'next'

import { PageWrapper } from '@/components/PageWrapper'
import { getCachedTenantGlobalByDomain, getEffectiveTenantDomain } from '@/utilities/getTenantGlobal'
import { Breadcrumbs } from '@/components/ecommerce/Breadcrumbs'
import { ProductCard } from '@/components/ecommerce/ProductCard'
import { ProductSort } from '@/components/ecommerce/ProductSort'
import { ShopSearch, ShopFilters, ActiveFilters, MobileFilters, getSortField } from '@/components/shop'
import type { SortOption } from '@/components/shop'
import type { Product, ProductTag, Media, TenantHeader, TenantLogo, TenantBusinessInfo, TenantShopSetting, TenantSystemPage } from '@/payload-types'
import type { Where } from 'payload'

// Helper to calculate display price on server
function calculateDisplayPrice(
  priceInDb: number,
  shopSettings: TenantShopSetting | null,
  taxCategory?: 'standard' | 'reduced' | 'zero' | null
): number {
  if (!shopSettings || !shopSettings.vatEnabled) {
    return priceInDb
  }
  if (shopSettings.pricesIncludeVat) {
    return priceInDb
  }
  const category = taxCategory || shopSettings.defaultVatRate || 'standard'
  const vatRates = shopSettings.vatRates || { standard: 21, reduced: 11 }
  const vatRate = category === 'zero' ? 0 : (vatRates as Record<string, number>)[category] || (vatRates as Record<string, number>).standard || 21
  return priceInDb * (1 + vatRate / 100)
}

export const revalidate = 60

interface SearchParams {
  q?: string
  categorie?: string
  sort?: SortOption
  pret_min?: string
  pret_max?: string
  in_stoc?: string
  page?: string
}

interface PageProps {
  params: Promise<{ tenantDomain: string }>
  searchParams: Promise<SearchParams>
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

export default async function ShopPage({ params, searchParams }: PageProps) {
  const { tenantDomain: urlEncodedDomain } = await params
  // Decode URL-encoded domain (e.g., "localhost%3A3100" -> "localhost:3100")
  const rawTenantDomain = decodeURIComponent(urlEncodedDomain)
  // Get effective tenant domain (handles localhost fallback in development)
  const tenantDomain = await getEffectiveTenantDomain(rawTenantDomain)
  const searchParamsData = await searchParams
  const payload = await getPayload({ config: configPromise })

  // Get tenant ID for filtering
  const tenantId = await getTenantIdFromDomain(payload, tenantDomain)

  // Fetch header globals + system pages config and shop settings (all per-tenant now)
  const [headerData, logoData, businessInfo, systemPages, shopSettings] = await Promise.all([
    getCachedTenantGlobalByDomain<TenantHeader>('header', tenantDomain),
    getCachedTenantGlobalByDomain<TenantLogo>('logo', tenantDomain),
    getCachedTenantGlobalByDomain<TenantBusinessInfo>('business-info', tenantDomain),
    getCachedTenantGlobalByDomain<TenantSystemPage>('system-pages', tenantDomain),
    getCachedTenantGlobalByDomain<TenantShopSetting>('shop-settings', tenantDomain),
  ])
  const config = systemPages?.productsPage || {}
  const labels = systemPages?.labels || {}

  // Fetch categories for filter (tenant-scoped)
  const categoriesResult = await payload.find({
    collection: 'product-categories',
    where: tenantId ? { tenant: { equals: tenantId } } : {},
    sort: 'title',
    limit: 100,
  })
  const categories = categoriesResult.docs.map(cat => ({
    id: cat.id,
    title: cat.title,
    slug: cat.slug,
  }))

  // Build product query
  const whereConditions: Where[] = []

  // Tenant filter
  if (tenantId) {
    whereConditions.push({ tenant: { equals: tenantId } })
  }

  // Search query
  if (searchParamsData.q) {
    whereConditions.push({
      or: [
        { title: { like: searchParamsData.q } },
        { shortDescription: { like: searchParamsData.q } },
      ],
    })
  }

  // Category filter
  if (searchParamsData.categorie) {
    const category = categories.find(c => c.slug === searchParamsData.categorie)
    if (category) {
      whereConditions.push({ category: { equals: category.id } })
    }
  }

  // Price filter
  if (searchParamsData.pret_min) {
    whereConditions.push({ priceInRON: { greater_than_equal: Number(searchParamsData.pret_min) } })
  }
  if (searchParamsData.pret_max) {
    whereConditions.push({ priceInRON: { less_than_equal: Number(searchParamsData.pret_max) } })
  }

  // Stock filter
  if (searchParamsData.in_stoc === 'true') {
    whereConditions.push({ inventory: { greater_than: 0 } })
  }

  // Sorting
  const sortField = getSortField(searchParamsData.sort || (config.defaultSort as SortOption) || 'newest')

  // Fetch products
  const products = await payload.find({
    collection: 'products',
    where: whereConditions.length > 0 ? { and: whereConditions } : {},
    sort: sortField,
    limit: config.productsPerPage || 24,
    depth: 2,
  })

  // Prepare product data with pre-calculated display prices
  const productCards = products.docs.map((product: Product) => {
    const firstImage = product.images?.[0]?.image as Media | undefined
    const imageUrl = firstImage?.url ?? null
    const secondImage = product.images?.[1]?.image as Media | undefined
    const secondaryImageUrl = secondImage?.url ?? null

    const tags = Array.isArray(product.tags)
      ? product.tags
          .filter((tag): tag is ProductTag =>
            typeof tag === 'object' && tag !== null
          )
          .map((tag) => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
          }))
      : []

    const priceInRON = product.priceInRON ?? 0
    const displayPrice = calculateDisplayPrice(priceInRON, shopSettings, product.taxCategory)

    return {
      id: product.id,
      slug: product.slug,
      title: product.title,
      priceInRON,
      displayPrice,
      imageUrl,
      secondaryImageUrl,
      badge: product.badge ?? null,
      tags,
      stock: product.inventory ?? 0,
      brand: product.brand ?? null,
      taxCategory: product.taxCategory ?? null,
    }
  })

  // Grid columns class
  const gridCols = (config.gridColumns || '4') as '2' | '3' | '4'
  const gridClasses: Record<'2' | '3' | '4', string> = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4',
  }
  const gridClass = gridClasses[gridCols] || 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'

  const resultsText = (labels.resultsText || 'Afisam {count} din {total} produse')
    .replace('{count}', String(products.docs.length))
    .replace('{total}', String(products.totalDocs))

  return (
    <PageWrapper
      headerData={headerData}
      logoData={logoData}
      businessInfoData={businessInfo}
      showCart={shopSettings?.enabled ?? false}
    >
      <div className="min-h-screen bg-theme-surface">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumbs items={[{ label: config.title || 'Produse' }]} />
        </div>

      <div className="bg-theme-light py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-theme-text mb-2">
            {config.title || 'Produsele Noastre'}
          </h1>
          {config.description && (
            <p className="text-lg text-theme-text-light max-w-2xl">
              {config.description}
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16">
        {config.showSearch !== false && (
          <div className="mb-8">
            <Suspense fallback={<div className="h-12 bg-theme-light rounded-lg animate-pulse" />}>
              <ShopSearch placeholder={labels.searchPlaceholder || 'Cauta produse...'} />
            </Suspense>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {config.showFilters !== false && (
            <div className="hidden lg:block w-64 flex-shrink-0">
              <ShopFilters
                categories={categories}
                labels={labels}
                filterOptions={config.filterOptions}
              />
            </div>
          )}

          <div className="flex-1">
            <Suspense fallback={null}>
              <ActiveFilters
                categories={categories}
                clearAllText={labels.clearFiltersText ?? undefined}
                className="mb-4"
              />
            </Suspense>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-theme-border">
              <div className="flex items-center gap-4">
                {config.showFilters !== false && (
                  <Suspense fallback={null}>
                    <MobileFilters
                      categories={categories}
                      labels={labels}
                      filterOptions={config.filterOptions}
                      buttonText={labels.mobileFiltersButton ?? undefined}
                      applyText={labels.mobileApplyFilters ?? undefined}
                    />
                  </Suspense>
                )}
                <p className="text-sm text-theme-text-light">{resultsText}</p>
              </div>

              {config.showSort !== false && (
                <Suspense fallback={<div className="h-11 w-48 bg-theme-light rounded animate-pulse" />}>
                  <ProductSort />
                </Suspense>
              )}
            </div>

            {productCards.length > 0 ? (
              <div className={`grid gap-4 md:gap-6 ${gridClass}`}>
                {productCards.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    showQuickView={false}
                    showWishlist={false}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-theme-light rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-theme-text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                </div>
                <p className="text-theme-text mb-2">{labels.noResultsText || 'Nu am gasit produse.'}</p>
                <p className="text-sm text-theme-text-muted">
                  Incercati sa modificati filtrele sau cautarea.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      </div>
    </PageWrapper>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tenantDomain: urlEncodedDomain } = await params
  const rawTenantDomain = decodeURIComponent(urlEncodedDomain)
  const tenantDomain = await getEffectiveTenantDomain(rawTenantDomain)
  const businessInfo = await getCachedTenantGlobalByDomain<TenantBusinessInfo>('business-info', tenantDomain)

  return {
    title: `Produse | ${businessInfo?.name || 'Magazin'}`,
    description: `Produse disponibile la ${businessInfo?.name || 'noi'}`,
  }
}
