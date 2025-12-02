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

  const page = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: slug,
      },
    },
    limit: 1,
  })

  if (!page.docs[0]) {
    notFound()
  }

  const pageData = page.docs[0]

  return (
    <>
      {pageData.heroType && pageData.heroType !== 'none' && pageData.hero && (
        <RenderHero type={pageData.heroType as string} data={pageData.hero} />
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
  })

  if (!page.docs[0]) {
    return {
      title: 'Pagina nu a fost gasita',
    }
  }

  const pageData = page.docs[0]

  const meta = (pageData as { meta?: { title?: string; description?: string } }).meta
  return {
    title: meta?.title || pageData.title,
    description: meta?.description,
  }
}

export async function generateStaticParams() {
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
}
