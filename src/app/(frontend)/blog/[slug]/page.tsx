import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Calendar, User, ArrowLeft, ArrowRight, Share2, Facebook, Twitter, Linkedin } from 'lucide-react'
import RichText from '@/components/RichText'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { Post } from '@/payload-types'
import { PageWrapper } from '@/components/PageWrapper'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { generatePostMeta } from '@/utilities/generateMeta'
import { getServerSideURL } from '@/utilities/getURL'

// Static generation with ISR - revalidated on-demand via hooks + fallback after 10 minutes
export const dynamic = 'force-static'
export const revalidate = 600

interface PageProps {
  params: Promise<{ slug: string }>
}

interface PostImage {
  url?: string | null
  alt?: string | null
}

interface PostCategory {
  id: string
  title?: string | null
  slug?: string | null
}

interface PostAuthor {
  id: string
  name?: string | null
  email?: string | null
}

// Format date
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  const post = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    limit: 1,
    depth: 2,
  })

  if (!post.docs[0]) {
    return {
      title: 'Articol negasit | Blog',
      description: 'Articolul cautat nu a fost gasit.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  // Use the improved generatePostMeta utility
  return generatePostMeta({ post: post.docs[0] })
}

export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
    collection: 'posts',
    where: {
      _status: { equals: 'published' },
    },
    limit: 100,
  })

  return posts.docs.map((post) => ({
    slug: post.slug,
  }))
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })

  // Fetch header globals
  const [headerData, logoData, businessInfo] = await Promise.all([
    getCachedGlobal('header'),
    getCachedGlobal('logo'),
    getCachedGlobal('business-info'),
  ])

  const post = await payload.find({
    collection: 'posts',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    limit: 1,
    depth: 2,
  })

  if (!post.docs[0]) {
    notFound()
  }

  const postData = post.docs[0]
  const featuredImage = postData.featuredImage as PostImage | null
  const category = postData.category as PostCategory | null
  const author = postData.author as PostAuthor | null

  // Get related posts
  let relatedPosts: Post[] = []
  if (postData.relatedPosts && Array.isArray(postData.relatedPosts) && postData.relatedPosts.length > 0) {
    // Use manually selected related posts (filter out string IDs, keep only populated objects)
    relatedPosts = postData.relatedPosts.filter(
      (p): p is Post => p !== null && typeof p === 'object' && 'slug' in p
    )
  } else if (category) {
    // Fallback to posts from same category
    const related = await payload.find({
      collection: 'posts',
      where: {
        and: [
          { category: { equals: category.id } },
          { id: { not_equals: postData.id } },
          { _status: { equals: 'published' } },
        ],
      },
      limit: 3,
      depth: 2,
    })
    relatedPosts = related.docs
  }

  const serverUrl = getServerSideURL()
  const postUrl = `${serverUrl}/blog/${postData.slug}`

  // JSON-LD Structured Data for Article (Schema.org)
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: postData.title,
    description: postData.excerpt || '',
    image: featuredImage?.url ? `${serverUrl}${featuredImage.url}` : undefined,
    datePublished: postData.publishedAt || postData.createdAt,
    dateModified: postData.updatedAt,
    author: author ? {
      '@type': 'Person',
      name: author.name || author.email,
    } : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Site Business',
      logo: {
        '@type': 'ImageObject',
        url: `${serverUrl}/og-image.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${serverUrl}/blog/${postData.slug}`,
    },
  }

  // JSON-LD Structured Data for BreadcrumbList (Schema.org)
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Acasă',
        item: serverUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${serverUrl}/blog`,
      },
      ...(category ? [{
        '@type': 'ListItem',
        position: 3,
        name: category.title,
        item: `${serverUrl}/blog?categorie=${category.slug}`,
      }] : []),
      {
        '@type': 'ListItem',
        position: category ? 4 : 3,
        name: postData.title,
      },
    ],
  }

  return (
    <PageWrapper
      headerData={headerData}
      logoData={logoData}
      businessInfoData={businessInfo}
    >
      {/* JSON-LD Structured Data - Article */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      {/* JSON-LD Structured Data - Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main className="py-8">
      {/* Hero/Header */}
      <article>
        {/* Featured Image */}
        {featuredImage?.url && (
          <div className="relative w-full h-[300px] md:h-[500px]">
            <Image
              src={featuredImage.url}
              alt={featuredImage.alt || postData.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="container mx-auto">
                {category && (
                  <Link
                    href={`/blog?categorie=${category.slug}`}
                    className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full mb-4"
                  >
                    {category.title}
                  </Link>
                )}
                <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 max-w-4xl">
                  {postData.title}
                </h1>
                <div className="flex items-center gap-6 text-white/90">
                  {postData.publishedAt && (
                    <span className="flex items-center gap-2">
                      <Calendar className="w-5 h-5" />
                      {formatDate(postData.publishedAt)}
                    </span>
                  )}
                  {author && (
                    <span className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      {author.name || author.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content without image header */}
        {!featuredImage?.url && (
          <div className="bg-theme-light py-16">
            <div className="container mx-auto px-4">
              {category && (
                <Link
                  href={`/blog?categorie=${category.slug}`}
                  className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full mb-4"
                >
                  {category.title}
                </Link>
              )}
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4 max-w-4xl">
                {postData.title}
              </h1>
              <div className="flex items-center gap-6 text-muted-foreground">
                {postData.publishedAt && (
                  <span className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    {formatDate(postData.publishedAt)}
                  </span>
                )}
                {author && (
                  <span className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    {author.name || author.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Article Content */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            {/* Excerpt */}
            {postData.excerpt && (
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
                {postData.excerpt}
              </p>
            )}

            {/* Main Content */}
            {postData.content && (
              <div className="prose prose-lg max-w-none">
                <RichText data={postData.content as SerializedEditorState} enableGutter={false} />
              </div>
            )}

            {/* Share buttons */}
            <div className="flex items-center gap-4 mt-12 pt-8 border-t border-gray-200">
              <span className="text-muted-foreground font-medium flex items-center gap-2">
                <Share2 className="w-5 h-5" />
                Distribuie:
              </span>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
                aria-label="Distribuie pe Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postData.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors"
                aria-label="Distribuie pe Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(postData.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-blue-700 text-white flex items-center justify-center hover:bg-blue-800 transition-colors"
                aria-label="Distribuie pe LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>

            {/* Back to blog */}
            <div className="mt-8">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-primary font-medium hover:underline"
              >
                <ArrowLeft className="w-4 h-4" />
                Inapoi la blog
              </Link>
            </div>
          </div>
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-theme-light py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">Articole similare</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => {
                const relatedImage = relatedPost.featuredImage as PostImage | null
                const relatedCategory = relatedPost.category as PostCategory | null

                return (
                  <article
                    key={relatedPost.id}
                    className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all"
                  >
                    {relatedImage?.url && (
                      <Link href={`/blog/${relatedPost.slug}`} className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={relatedImage.url}
                          alt={relatedImage.alt || relatedPost.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {relatedCategory && (
                          <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                            {relatedCategory.title}
                          </span>
                        )}
                      </Link>
                    )}
                    <div className="p-5">
                      <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        <Link href={`/blog/${relatedPost.slug}`}>{relatedPost.title}</Link>
                      </h3>
                      <Link
                        href={`/blog/${relatedPost.slug}`}
                        className="inline-flex items-center gap-1 text-primary text-sm font-medium"
                      >
                        Citeste
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      )}
      </main>
    </PageWrapper>
  )
}
