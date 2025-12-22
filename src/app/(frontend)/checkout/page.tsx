import type { Metadata } from 'next'
import { CheckoutPage as CheckoutPageComponent } from '@/components/checkout'
import { PageWrapper } from '@/components/PageWrapper'
import { getCachedGlobal } from '@/utilities/getGlobals'

export const metadata: Metadata = {
  title: 'Finalizare comandă',
  description: 'Finalizează comanda ta',
}

export default async function CheckoutPage() {
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
      <div className="min-h-screen bg-theme-surface">
        <CheckoutPageComponent />
      </div>
    </PageWrapper>
  )
}
