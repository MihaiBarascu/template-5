import { getPayload } from 'payload'
import configPromise from '@payload-config'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'
import { Calendar, User, Tag, ArrowRight } from 'lucide-react'
import { PageWrapper } from '@/components/PageWrapper'
import { getCachedTenantGlobalByDomain, getEffectiveTenantDomain } from '@/utilities/getTenantGlobal'
import type { TenantHeader, TenantLogo, TenantBusinessInfo } from '@/payload-types'

// Static generation with ISR
export const dynamic = 'force-static'
export const revalidate = 600

interface PageProps {
  params: Promise<{ tenantDomain: string }>
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

// Helper to get tenant ID from domain
async function getTenantIdFromDomain(payload: Awaited<ReturnType<typeof getPayload>>, domain: string): Promise<string | null> {
  const result = await payload.find({
    collection: 'tenants',
    where: { domain: { equals: domain } },
    limit: 1,
    depth: 0,
  })
  return result.docs[0]?.id || null
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tenantDomain: urlEncodedDomain } = await params
  const rawTenantDomain = decodeURIComponent(urlEncodedDomain)
  const tenantDomain = await getEffectiveTenantDomain(rawTenantDomain)
  const businessInfo = await getCachedTenantGlobalByDomain<TenantBusinessInfo>('business-info', tenantDomain)

  return {
    title: `Blog | ${businessInfo?.name || 'Site'}`,
    description: `Articole si informatii utile de la ${businessInfo?.name || 'noi'}`,
  }
}

export default async function BlogPage({ params }: PageProps) {
  const { tenantDomain: urlEncodedDomain } = await params
  // Decode URL-encoded domain (e.g., "localhost%3A3100" -> "localhost:3100")
  const rawTenantDomain = decodeURIComponent(urlEncodedDomain)
  // Get effective tenant domain (handles localhost fallback in development)
  const tenantDomain = await getEffectiveTenantDomain(rawTenantDomain)
  const payload = await getPayload({ config: configPromise })

  // Get tenant ID for filtering
  const tenantId = await getTenantIdFromDomain(payload, tenantDomain)

  // Fetch tenant globals
  const [headerData, logoData, businessInfo] = await Promise.all([
    getCachedTenantGlobalByDomain<TenantHeader>('header', tenantDomain),
    getCachedTenantGlobalByDomain<TenantLogo>('logo', tenantDomain),
    getCachedTenantGlobalByDomain<TenantBusinessInfo>('business-info', tenantDomain),
  ])

  // Get all posts for this tenant
  const posts = await payload.find({
    collection: 'posts',
    where: tenantId ? { tenant: { equals: tenantId } } : {},
    limit: 20,
    sort: '-publishedAt',
    depth: 2,
  })

  // Get all categories for this tenant
  const categories = await payload.find({
    collection: 'categories',
    where: tenantId ? { tenant: { equals: tenantId } } : {},
    limit: 50,
    sort: 'title',
  })

  return (
    <PageWrapper
      headerData={headerData}
      logoData={logoData}
      businessInfoData={businessInfo}
    >
      <main className="py-8">
        {/* Hero */}
        <div className="bg-theme-light py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-theme-text mb-4">Blog</h1>
          <p className="text-lg text-theme-text-light max-w-2xl mx-auto">
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
              className="px-4 py-2 rounded-full text-sm font-medium bg-theme-primary text-theme-text-on-primary"
            >
              Toate
            </Link>
            {categories.docs.map((category) => (
              <Link
                key={category.id}
                href={`/blog?categorie=${category.slug}`}
                className="px-4 py-2 rounded-full text-sm font-medium bg-theme-light text-theme-text hover:bg-theme-border transition-colors"
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
                  className="group flex flex-col overflow-hidden rounded-xl bg-theme-surface shadow-sm hover:shadow-lg transition-all border border-theme-border"
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
                        <span className="absolute top-4 left-4 px-3 py-1 bg-theme-primary text-theme-text-on-primary text-xs font-medium rounded-full">
                          {category.title}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Content */}
                  <div className="flex flex-col flex-grow p-6">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-sm text-theme-text-muted mb-3">
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
                    <h2 className="text-xl font-semibold text-theme-text mb-2 group-hover:text-theme-primary transition-colors">
                      <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                    </h2>

                    {/* Excerpt */}
                    {post.excerpt && (
                      <p className="text-theme-text-light text-sm flex-grow line-clamp-3 mb-4">
                        {post.excerpt}
                      </p>
                    )}

                    {/* Read more */}
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-theme-primary font-medium group/link"
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
            <div className="w-16 h-16 bg-theme-light rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-theme-text-muted" />
            </div>
            <h3 className="text-xl font-semibold text-theme-text mb-2">Nu exista articole momentan</h3>
            <p className="text-theme-text-light">Revino mai tarziu pentru articole noi.</p>
          </div>
        )}
        </div>
      </main>
    </PageWrapper>
  )
}
