import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import type { Metadata } from 'next'

// Revalidate page every 60 seconds for ISR
export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const [pageResult, businessInfo] = await Promise.all([
    payload.find({
      collection: 'pages',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    }),
    payload.findGlobal({
      slug: 'business-info',
    }).catch(() => null),
  ])

  if (!pageResult.docs[0]) {
    notFound()
  }

  const pageData = pageResult.docs[0]
  const social = businessInfo?.social || null

  return (
    <>
      {pageData.heroType && pageData.heroType !== 'none' && pageData.hero && (
        <RenderHero type={pageData.heroType as string} data={pageData.hero} social={social} />
      )}
      {pageData.layout && <RenderBlocks blocks={pageData.layout} />}
    </>
  )
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
    depth: 1,
  })

  if (!page.docs[0]) {
    return {
      title: 'Pagina nu a fost gasita',
    }
  }

  const { generateMeta } = await import('@/utilities/generateMeta')
  return generateMeta({ doc: page.docs[0] })
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })

    const pages = await payload.find({
      collection: 'pages',
      where: {
        slug: {
          not_equals: 'home',
        },
      },
      limit: 100,
    })

    return pages.docs.map((page) => ({
      slug: page.slug,
    }))
  } catch {
    // Return empty array during build when DB is not available
    // Pages will be generated on-demand with ISR
    return []
  }
}
