import type { Metadata } from 'next'
import { CheckoutPage as CheckoutPageComponent } from '@/components/checkout'
import { PageWrapper } from '@/components/PageWrapper'
import { getCachedTenantGlobalByDomain, getEffectiveTenantDomain } from '@/utilities/getTenantGlobal'
import type { TenantHeader, TenantLogo, TenantBusinessInfo, TenantShopSetting } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Finalizare comandă',
  description: 'Finalizează comanda ta',
}

interface PageProps {
  params: Promise<{ tenantDomain: string }>
}

export default async function CheckoutPage({ params }: PageProps) {
  const { tenantDomain: urlEncodedDomain } = await params
  // Decode URL-encoded domain (e.g., "localhost%3A3100" -> "localhost:3100")
  const rawTenantDomain = decodeURIComponent(urlEncodedDomain)
  // Get effective tenant domain (handles localhost fallback in development)
  const tenantDomain = await getEffectiveTenantDomain(rawTenantDomain)

  const [headerData, logoData, businessInfo, shopSettings] = await Promise.all([
    getCachedTenantGlobalByDomain<TenantHeader>('header', tenantDomain),
    getCachedTenantGlobalByDomain<TenantLogo>('logo', tenantDomain),
    getCachedTenantGlobalByDomain<TenantBusinessInfo>('business-info', tenantDomain),
    getCachedTenantGlobalByDomain<TenantShopSetting>('shop-settings', tenantDomain),
  ])

  return (
    <PageWrapper
      headerData={headerData}
      logoData={logoData}
      businessInfoData={businessInfo}
      showCart={shopSettings?.enabled ?? false}
    >
      <div className="min-h-screen bg-theme-surface">
        <CheckoutPageComponent />
      </div>
    </PageWrapper>
  )
}
