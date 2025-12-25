import type { Metadata } from 'next'
import { CartPage } from '@/components/cart'
import { PageWrapper } from '@/components/PageWrapper'
import { getCachedTenantGlobalByDomain, getEffectiveTenantDomain } from '@/utilities/getTenantGlobal'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { TenantHeader, TenantLogo, TenantBusinessInfo } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Coșul meu',
  description: 'Verifică produsele din coș și finalizează comanda',
}

interface PageProps {
  params: Promise<{ tenantDomain: string }>
}

export default async function CosPage({ params }: PageProps) {
  const { tenantDomain: urlEncodedDomain } = await params
  // Decode URL-encoded domain (e.g., "localhost%3A3100" -> "localhost:3100")
  const rawTenantDomain = decodeURIComponent(urlEncodedDomain)
  // Get effective tenant domain (handles localhost fallback in development)
  const tenantDomain = await getEffectiveTenantDomain(rawTenantDomain)

  const [headerData, logoData, businessInfo, shopSettings] = await Promise.all([
    getCachedTenantGlobalByDomain<TenantHeader>('header', tenantDomain),
    getCachedTenantGlobalByDomain<TenantLogo>('logo', tenantDomain),
    getCachedTenantGlobalByDomain<TenantBusinessInfo>('business-info', tenantDomain),
    getCachedGlobal('shop-settings'),
  ])

  return (
    <PageWrapper
      headerData={headerData}
      logoData={logoData}
      businessInfoData={businessInfo}
      showCart={shopSettings?.enabled ?? false}
    >
      <CartPage />
    </PageWrapper>
  )
}
