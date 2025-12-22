import type { ReactNode } from 'react'

import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import { AccountNav } from '@/components/account/AccountNav'
import { PageWrapper } from '@/components/PageWrapper'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { SystemPage } from '@/payload-types'

export default async function AccountLayout({ children }: { children: ReactNode }) {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect('/cont/login?redirect=/cont')
  }

  // Fetch header globals + system pages config + shop settings
  const [headerData, logoData, businessInfo, systemPages, shopSettings] = await Promise.all([
    getCachedGlobal('header'),
    getCachedGlobal('logo'),
    getCachedGlobal('business-info'),
    payload.findGlobal({ slug: 'system-pages' }).catch(() => null) as Promise<SystemPage | null>,
    getCachedGlobal('shop-settings'),
  ])
  const account = systemPages?.accountPages || {}

  const navLabels = {
    menuDashboard: account.menuDashboard,
    menuOrders: account.menuOrders,
    menuAddresses: account.menuAddresses,
    menuLogout: account.menuLogout,
  }

  return (
    <PageWrapper
      headerData={headerData}
      logoData={logoData}
      businessInfoData={businessInfo}
      showCart={shopSettings?.enabled ?? false}
    >
      <section className="py-8 md:py-16 bg-theme-surface min-h-screen">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Navigation */}
            <aside className="md:w-64 flex-shrink-0">
              <div className="p-4 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border sticky top-24">
                <div className="mb-4 pb-4 border-b border-theme-border">
                  <p className="text-sm text-theme-text-muted">Conectat ca</p>
                  <p className="font-medium text-theme-text truncate">{user.email}</p>
                </div>
                <AccountNav labels={navLabels} />
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow">
              {children}
            </main>
          </div>
        </div>
      </section>
    </PageWrapper>
  )
}
