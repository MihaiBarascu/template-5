import Link from 'next/link'
import type { TenantHeader, TenantLogo, TenantBusinessInfo } from '@/payload-types'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { PageWrapper } from '@/components/PageWrapper'
import { getCachedDocumentByDomain } from '@/utilities/getDocument'
import { getCachedTenantGlobalByDomain, getEffectiveTenantDomain } from '@/utilities/getTenantGlobal'

// Revalidate page every 60 seconds for ISR (fallback if tags not invalidated)
export const revalidate = 60

interface HomePageProps {
  params: Promise<{ tenantDomain: string }>
}

/**
 * Homepage - OFFICIAL PAYLOAD MULTI-TENANT PATTERN
 *
 * Receives tenantDomain from URL params (via Next.js rewrites)
 * instead of reading from Host headers directly.
 *
 * Reference: docs/MULTI-TENANT-OFFICIAL-REFERENCE.md
 */
export default async function HomePage({ params }: HomePageProps) {
  const { tenantDomain: urlEncodedDomain } = await params
  // Decode URL-encoded domain (e.g., "localhost%3A3100" -> "localhost:3100")
  const rawTenantDomain = decodeURIComponent(urlEncodedDomain)
  // Get effective tenant domain (handles localhost fallback in development)
  const tenantDomain = await getEffectiveTenantDomain(rawTenantDomain)

  const [pageData, headerData, logoData, businessInfo] = await Promise.all([
    getCachedDocumentByDomain('pages', 'home', tenantDomain, 2),
    getCachedTenantGlobalByDomain<TenantHeader>('header', tenantDomain),
    getCachedTenantGlobalByDomain<TenantLogo>('logo', tenantDomain),
    getCachedTenantGlobalByDomain<TenantBusinessInfo>('business-info', tenantDomain),
  ])

  if (!pageData) {
    // Render a default homepage if no page exists
    return (
      <PageWrapper
        headerData={headerData}
        logoData={logoData}
        businessInfoData={businessInfo}
      >
        <div className="container mx-auto py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Bine ai venit!</h1>
          <p className="text-lg text-theme-text-light mb-8">
            Site-ul este in curs de configurare.
          </p>
          <p className="text-sm text-theme-text-muted">
            Acceseaza{' '}
            <Link href="/admin" className="underline">
              panoul de administrare
            </Link>{' '}
            pentru a adauga continut.
          </p>
        </div>
      </PageWrapper>
    )
  }

  const social = businessInfo?.social || null

  return (
    <PageWrapper
      headerData={headerData}
      logoData={logoData}
      businessInfoData={businessInfo}
      pageHeaderSettings={pageData.headerSettings}
    >
      {pageData.heroType && pageData.heroType !== 'none' && pageData.hero && (
        <RenderHero type={pageData.heroType as string} data={pageData.hero} social={social} />
      )}
      {pageData.layout && <RenderBlocks blocks={pageData.layout} tenantDomain={tenantDomain} />}
    </PageWrapper>
  )
}

export async function generateMetadata({ params }: HomePageProps) {
  const { tenantDomain: urlEncodedDomain } = await params
  const rawTenantDomain = decodeURIComponent(urlEncodedDomain)
  const tenantDomain = await getEffectiveTenantDomain(rawTenantDomain)
  const pageData = await getCachedDocumentByDomain('pages', 'home', tenantDomain, 1)

  if (!pageData) {
    return {
      title: 'Acasa',
      description: 'Bine ai venit pe site-ul nostru',
    }
  }

  const { generateMeta } = await import('@/utilities/generateMeta')
  return generateMeta({ doc: pageData })
}
