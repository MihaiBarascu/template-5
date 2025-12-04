import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Calendar, User, Tag, ArrowRight } from 'lucide-react'

// Static generation with ISR - revalidated on-demand via hooks + fallback after 10 minutes
export const dynamic = 'force-static'
export const revalidate = 600

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const businessInfo = await payload.findGlobal({ slug: 'business-info' })

  return {
    title: `Blog | ${businessInfo.name}`,
    description: `Articole si informatii utile de la ${businessInfo.name}`,
  }
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

export default async function BlogPage() {
  const payload = await getPayload({ config: configPromise })

  // Get all published posts
  const posts = await payload.find({
    collection: 'posts',
    where: {
      _status: { equals: 'published' },
    },
    limit: 20,
    sort: '-publishedAt',
    depth: 2,
  })

  // Get all categories for filter
  const categories = await payload.find({
    collection: 'categories',
    limit: 50,
    sort: 'title',
  })

  return (
    <main className="py-8">
      {/* Hero */}
      <div className="bg-theme-light py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Articole, noutati si informatii utile
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Categories Filter */}
        {categories.docs.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            <Link
              href="/blog"
              className="px-4 py-2 rounded-full text-sm font-medium bg-primary text-white"
            >
              Toate
            </Link>
            {categories.docs.map((category) => (
              <Link
                key={category.id}
                href={`/blog?categorie=${category.slug}`}
                className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                {category.title}
              </Link>
            ))}
          </div>
        )}

        {/* Posts Grid */}
        {posts.docs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.docs.map((post) => {
              const featuredImage = post.featuredImage as PostImage | null
              const category = post.category as PostCategory | null
              const author = post.author as PostAuthor | null

              return (
                <article
                  key={post.id}
                  className="group flex flex-col overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-all border border-gray-100"
                >
                  {/* Image */}
                  {featuredImage?.url && (
                    <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden">
                      <Image
                        src={featuredImage.url}
                        alt={featuredImage.alt || post.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      {category && (
                        <span className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-xs font-medium rounded-full">
                          {category.title}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Content */}
                  <div className="flex flex-col flex-grow p-6">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      {post.publishedAt && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(post.publishedAt)}
                        </span>
                      )}
                      {author && (
                        <span className="flex items-center gap-1">
                          <User className="w-4 h-4" />
                          {author.name || author.email}
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h2 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-muted-foreground text-sm flex-grow line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Read more */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-primary font-medium group/link"
                    >
                      Citeste mai mult
                      <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Nu exista articole momentan</h3>
            <p className="text-gray-500">Revino mai tarziu pentru articole noi.</p>
          </div>
        )}
      </div>
    </main>
  )
}
