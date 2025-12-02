import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'

// Revalidate page every 60 seconds for ISR
export const revalidate = 60

export default async function HomePage() {
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
    limit: 1,
  })

  if (!page.docs[0]) {
    // Render a default homepage if no page exists
    return (
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
    )
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

export async function generateMetadata() {
  const payload = await getPayload({ config: configPromise })

  const page = await payload.find({
    collection: 'pages',
    where: {
      slug: {
        equals: 'home',
      },
    },
    limit: 1,
  })

  if (!page.docs[0]) {
    return {
      title: 'Acasa',
    }
  }

  return {
    title: page.docs[0].title || 'Acasa',
  }
}
