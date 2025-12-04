import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')
  const collection = searchParams.get('collection') || 'pages'

  // Validate secret
  if (secret !== process.env.PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  if (!slug) {
    return new Response('Missing slug parameter', { status: 400 })
  }

  const payload = await getPayload({ config: configPromise })

  // Verify the document exists
  try {
    const docs = await payload.find({
      collection: collection as 'pages' | 'posts',
      where: {
        slug: {
          equals: slug,
        },
      },
      draft: true,
      limit: 1,
    })

    if (docs.docs.length === 0) {
      return new Response('Document not found', { status: 404 })
    }

    // Enable Draft Mode
    const draft = await draftMode()
    draft.enable()

    // Redirect to the page
    const path = collection === 'posts' ? `/blog/${slug}` : `/${slug === 'home' ? '' : slug}`
    redirect(path)
  } catch (error) {
    console.error('Preview error:', error)
    return new Response('Error fetching document', { status: 500 })
  }
}
