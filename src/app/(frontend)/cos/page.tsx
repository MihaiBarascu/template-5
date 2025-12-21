import type { Metadata } from 'next'
import { CartPage } from '@/components/cart'
import { PageWrapper } from '@/components/PageWrapper'
import { getCachedGlobal } from '@/utilities/getGlobals'

export const metadata: Metadata = {
  title: 'Coșul meu',
  description: 'Verifică produsele din coș și finalizează comanda',
}

export default async function CosPage() {
  const [headerData, logoData, businessInfo, shopSettings] = await Promise.all([
    getCachedGlobal('header'),
    getCachedGlobal('logo'),
    getCachedGlobal('business-info'),
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
