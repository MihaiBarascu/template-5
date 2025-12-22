import Link from 'next/link'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { PageWrapper } from '@/components/PageWrapper'
import { getCachedDocument } from '@/utilities/getDocument'
import { getCachedGlobal } from '@/utilities/getGlobals'

// Revalidate page every 60 seconds for ISR (fallback if tags not invalidated)
export const revalidate = 60

export default async function HomePage() {
  const [pageData, headerData, logoData, businessInfo] = await Promise.all([
    getCachedDocument('pages', 'home', 2),
    getCachedGlobal('header'),
    getCachedGlobal('logo'),
    getCachedGlobal('business-info'),
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
      {pageData.layout && <RenderBlocks blocks={pageData.layout} />}
    </PageWrapper>
  )
}

export async function generateMetadata() {
  const pageData = await getCachedDocument('pages', 'home', 1)

  if (!pageData) {
    return {
      title: 'Acasa',
      description: 'Bine ai venit pe site-ul nostru',
    }
  }

  const { generateMeta } = await import('@/utilities/generateMeta')
  return generateMeta({ doc: pageData })
}
