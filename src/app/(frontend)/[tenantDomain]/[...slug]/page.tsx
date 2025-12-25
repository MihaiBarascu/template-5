import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { ServiceDetail } from '@/components/ServiceDetail'
import { TeamDetail } from '@/components/TeamDetail'
import { PageWrapper } from '@/components/PageWrapper'
import { getCachedTenantGlobalByDomain, getEffectiveTenantDomain } from '@/utilities/getTenantGlobal'
import type { Metadata } from 'next'
import type { Service, Team, Testimonial, TenantBusinessInfo, TenantHeader, TenantLogo } from '@/payload-types'
import type { Where } from 'payload'

// Revalidate page every 60 seconds for ISR
export const revalidate = 60

interface PageProps {
  params: Promise<{ tenantDomain: string; slug: string[] }>
}

// Helper to get the full URL path from slug array
function getUrlFromSlug(slugArray: string[]): string {
  return '/' + slugArray.join('/')
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

// Helper to build tenant-aware where clause
function buildTenantWhere(baseConditions: Where[], tenantId: string | null): Where {
  if (tenantId) {
    return { and: [...baseConditions, { tenant: { equals: tenantId } }] }
  }
  return { and: baseConditions }
}

// Helper to find page by breadcrumbs or simple slug
async function findPage(payload: Awaited<ReturnType<typeof getPayload>>, url: string, lastSlug: string, slugArray: string[], tenantDomain: string | null) {
  // Get tenant ID from domain for proper filtering
  const tenantId = tenantDomain ? await getTenantIdFromDomain(payload, tenantDomain) : null

  // Query using breadcrumbs.url (from nested-docs plugin) + slug for accuracy
  const pageResult = await payload.find({
    collection: 'pages',
    where: buildTenantWhere([
      { 'breadcrumbs.url': { equals: url } },
      { slug: { equals: lastSlug } },
    ], tenantId),
    limit: 1,
    depth: 2,
  })

  if (pageResult.docs[0]) return pageResult.docs[0]

  // Fallback: try simple slug match for non-nested pages
  if (slugArray.length === 1) {
    const simpleResult = await payload.find({
      collection: 'pages',
      where: buildTenantWhere([{ slug: { equals: lastSlug } }], tenantId),
      limit: 1,
      depth: 2,
    })
    return simpleResult.docs[0] || null
  }

  return null
}

// Helper to find service by slug
async function findService(payload: Awaited<ReturnType<typeof getPayload>>, slug: string, tenantId: string | null): Promise<Service | null> {
  const serviceResult = await payload.find({
    collection: 'services',
    where: buildTenantWhere([
      { slug: { equals: slug } },
      { active: { equals: true } },
    ], tenantId),
    limit: 1,
    depth: 2,
  })

  return serviceResult.docs[0] || null
}

// Helper to find team member by slug
async function findTeamMember(payload: Awaited<ReturnType<typeof getPayload>>, slug: string, tenantId: string | null): Promise<Team | null> {
  const teamResult = await payload.find({
    collection: 'team',
    where: buildTenantWhere([{ slug: { equals: slug } }], tenantId),
    limit: 1,
    depth: 2,
  })

  return teamResult.docs[0] || null
}

// Helper to get services assigned to a team member
async function getTeamMemberServices(payload: Awaited<ReturnType<typeof getPayload>>, memberId: string, tenantId: string | null): Promise<Service[]> {
  const servicesResult = await payload.find({
    collection: 'services',
    where: buildTenantWhere([
      { assignedTeamMember: { equals: memberId } },
      { active: { equals: true } },
    ], tenantId),
    limit: 50,
    depth: 1,
  })

  return servicesResult.docs
}

// Helper to get related services (excluding current one)
async function getRelatedServices(payload: Awaited<ReturnType<typeof getPayload>>, currentServiceId: string, tenantId: string | null, limit: number = 3): Promise<Service[]> {
  const servicesResult = await payload.find({
    collection: 'services',
    where: buildTenantWhere([
      { id: { not_equals: currentServiceId } },
      { active: { equals: true } },
    ], tenantId),
    limit,
    depth: 1,
    sort: '-featured,order',
  })

  return servicesResult.docs
}

// Helper to get testimonials linked to a service (many-to-many)
async function getServiceTestimonials(payload: Awaited<ReturnType<typeof getPayload>>, serviceId: string, tenantId: string | null, limit: number = 10): Promise<Testimonial[]> {
  const testimonialsResult = await payload.find({
    collection: 'testimonials',
    where: buildTenantWhere([
      { services: { contains: serviceId } },
    ], tenantId),
    limit,
    depth: 1,
    sort: '-featured,order',
  })

  return testimonialsResult.docs
}

/**
 * Dynamic Page - OFFICIAL PAYLOAD MULTI-TENANT PATTERN
 *
 * Receives tenantDomain from URL params (via Next.js rewrites)
 * instead of reading from Host headers directly.
 *
 * Reference: docs/MULTI-TENANT-OFFICIAL-REFERENCE.md
 */
export default async function Page({ params }: PageProps) {
  const { tenantDomain: urlEncodedDomain, slug: slugArray } = await params
  // Decode URL-encoded domain (e.g., "localhost%3A3100" -> "localhost:3100")
  const rawTenantDomain = decodeURIComponent(urlEncodedDomain)
  // Get effective tenant domain (handles localhost fallback in development)
  const tenantDomain = await getEffectiveTenantDomain(rawTenantDomain)
  const url = getUrlFromSlug(slugArray)
  const lastSlug = slugArray[slugArray.length - 1]
  const payload = await getPayload({ config: configPromise })

  // Get tenant ID once for all queries
  const tenantId = tenantDomain ? await getTenantIdFromDomain(payload, tenantDomain) : null

  // Fetch tenant globals for header + page data
  const [headerData, logoData, businessInfo, pageData] = await Promise.all([
    getCachedTenantGlobalByDomain<TenantHeader>('header', tenantDomain),
    getCachedTenantGlobalByDomain<TenantLogo>('logo', tenantDomain),
    getCachedTenantGlobalByDomain<TenantBusinessInfo>('business-info', tenantDomain),
    findPage(payload, url, lastSlug, slugArray, tenantDomain),
  ])

  // If page found, render it with PageWrapper
  if (pageData) {
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

  // If not a page, check if it's a service or team member detail (pattern: /base-path/slug)
  // The base path is determined by the parent page (e.g., /clase, /servicii, /echipa, /antrenori)
  if (slugArray.length >= 2) {
    const itemSlug = lastSlug
    const basePath = '/' + slugArray.slice(0, -1).join('/')

    // Try service first
    const service = await findService(payload, itemSlug, tenantId)

    if (service) {
      const [relatedServices, testimonials] = await Promise.all([
        getRelatedServices(payload, service.id, tenantId, 3),
        getServiceTestimonials(payload, service.id, tenantId, 10),
      ])
      return (
        <PageWrapper
          headerData={headerData}
          logoData={logoData}
          businessInfoData={businessInfo}
          pageHeaderSettings={{ headerTransparency: 'solid' }}
        >
          <ServiceDetail
            service={service}
            backLink={service.backLink || basePath}
            backLabel={service.backLabel || 'Înapoi'}
            ctaLabel={service.ctaLabel || undefined}
            ctaLink={service.ctaLink || undefined}
            relatedServices={relatedServices}
            testimonials={testimonials}
          />
        </PageWrapper>
      )
    }

    // Try team member
    const teamMember = await findTeamMember(payload, itemSlug, tenantId)

    if (teamMember) {
      // Get services assigned to this team member
      const memberServices = await getTeamMemberServices(payload, teamMember.id, tenantId)

      // Determine back link label based on base path
      const backLabel = basePath.includes('antrenori')
        ? 'Înapoi la antrenori'
        : basePath.includes('medici') || basePath.includes('doctori')
        ? 'Înapoi la medici'
        : 'Înapoi la echipă'

      return (
        <PageWrapper
          headerData={headerData}
          logoData={logoData}
          businessInfoData={businessInfo}
          pageHeaderSettings={{ headerTransparency: 'solid' }}
        >
          <TeamDetail
            member={teamMember}
            backLink={basePath}
            backLabel={backLabel}
            services={memberServices}
          />
        </PageWrapper>
      )
    }
  }

  // Also check for service or team member at root level
  if (slugArray.length === 1) {
    // Try service first
    const service = await findService(payload, lastSlug, tenantId)
    if (service) {
      const [relatedServices, testimonials] = await Promise.all([
        getRelatedServices(payload, service.id, tenantId, 3),
        getServiceTestimonials(payload, service.id, tenantId, 10),
      ])
      return (
        <PageWrapper
          headerData={headerData}
          logoData={logoData}
          businessInfoData={businessInfo}
          pageHeaderSettings={{ headerTransparency: 'solid' }}
        >
          <ServiceDetail
            service={service}
            backLink={service.backLink || '/servicii'}
            backLabel={service.backLabel || 'Înapoi'}
            ctaLabel={service.ctaLabel || undefined}
            ctaLink={service.ctaLink || undefined}
            relatedServices={relatedServices}
            testimonials={testimonials}
          />
        </PageWrapper>
      )
    }

    // Try team member
    const teamMember = await findTeamMember(payload, lastSlug, tenantId)
    if (teamMember) {
      const memberServices = await getTeamMemberServices(payload, teamMember.id, tenantId)
      return (
        <PageWrapper
          headerData={headerData}
          logoData={logoData}
          businessInfoData={businessInfo}
          pageHeaderSettings={{ headerTransparency: 'solid' }}
        >
          <TeamDetail
            member={teamMember}
            backLink="/echipa"
            backLabel="Înapoi la echipă"
            services={memberServices}
          />
        </PageWrapper>
      )
    }
  }

  notFound()
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tenantDomain: urlEncodedDomain, slug: slugArray } = await params
  const rawTenantDomain = decodeURIComponent(urlEncodedDomain)
  const tenantDomain = await getEffectiveTenantDomain(rawTenantDomain)
  const url = getUrlFromSlug(slugArray)
  const lastSlug = slugArray[slugArray.length - 1]
  const payload = await getPayload({ config: configPromise })

  // Get tenant ID once for all queries
  const tenantId = tenantDomain ? await getTenantIdFromDomain(payload, tenantDomain) : null

  // Try to find page first
  const page = await findPage(payload, url, lastSlug, slugArray, tenantDomain)

  if (page) {
    const { generateMeta } = await import('@/utilities/generateMeta')
    return generateMeta({ doc: page })
  }

  // Try to find service
  const service = await findService(payload, lastSlug, tenantId)

  if (service) {
    return {
      title: service.title,
      description: service.shortDescription || undefined,
    }
  }

  // Try to find team member
  const teamMember = await findTeamMember(payload, lastSlug, tenantId)

  if (teamMember) {
    return {
      title: teamMember.name,
      description: teamMember.role || undefined,
    }
  }

  return {
    title: 'Pagina nu a fost gasita',
  }
}

// Type for breadcrumb from nested-docs plugin
interface Breadcrumb {
  url?: string | null
}

// Type for layout block
interface LayoutBlock {
  blockType?: string
  detailBasePath?: string | null
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })

    // Fetch pages, services, and team members in parallel
    const [pagesResult, servicesResult, teamResult] = await Promise.all([
      payload.find({
        collection: 'pages',
        where: { slug: { not_equals: 'home' } },
        limit: 100,
        depth: 0,
      }),
      payload.find({
        collection: 'services',
        where: { active: { equals: true } },
        limit: 100,
        depth: 0,
      }),
      payload.find({
        collection: 'team',
        limit: 100,
        depth: 0,
      }),
    ])

    const staticParams: { slug: string[] }[] = []

    // Add page params
    for (const page of pagesResult.docs) {
      if (!page.slug) continue

      const breadcrumbs = page.breadcrumbs as Breadcrumb[] | undefined
      if (breadcrumbs && breadcrumbs.length > 0) {
        const lastBreadcrumb = breadcrumbs[breadcrumbs.length - 1]
        if (lastBreadcrumb?.url) {
          staticParams.push({
            slug: lastBreadcrumb.url.replace(/^\//, '').split('/'),
          })
        }
      } else {
        staticParams.push({ slug: [page.slug] })
      }

      // Check if this page has a services or team block with detailBasePath
      // If so, generate detail routes under that path
      const layout = page.layout as LayoutBlock[] | undefined
      if (layout) {
        for (const block of layout) {
          if (block.blockType === 'services' && block.detailBasePath) {
            const basePath = block.detailBasePath.replace(/^\//, '')
            // Add all service slugs under this base path
            for (const service of servicesResult.docs) {
              if (service.slug) {
                staticParams.push({
                  slug: [...basePath.split('/'), service.slug],
                })
              }
            }
          }
          if (block.blockType === 'team' && block.detailBasePath) {
            const basePath = block.detailBasePath.replace(/^\//, '')
            // Add all team member slugs under this base path
            for (const member of teamResult.docs) {
              if (member.slug) {
                staticParams.push({
                  slug: [...basePath.split('/'), member.slug],
                })
              }
            }
          }
        }
      }
    }

    return staticParams
  } catch {
    return []
  }
}
