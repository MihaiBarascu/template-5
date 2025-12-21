import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { ServiceDetail } from '@/components/ServiceDetail'
import { TeamDetail } from '@/components/TeamDetail'
import { PageWrapper } from '@/components/PageWrapper'
import { getCachedGlobal } from '@/utilities/getGlobals'
import type { Metadata } from 'next'
import type { Service, Team } from '@/payload-types'

// Revalidate page every 60 seconds for ISR
export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string[] }>
}

// Helper to get the full URL path from slug array
function getUrlFromSlug(slugArray: string[]): string {
  return '/' + slugArray.join('/')
}

// Helper to find page by breadcrumbs or simple slug
async function findPage(payload: Awaited<ReturnType<typeof getPayload>>, url: string, lastSlug: string, slugArray: string[]) {
  // Query using breadcrumbs.url (from nested-docs plugin) + slug for accuracy
  const pageResult = await payload.find({
    collection: 'pages',
    where: {
      and: [
        { 'breadcrumbs.url': { equals: url } },
        { slug: { equals: lastSlug } },
      ],
    },
    limit: 1,
    depth: 2,
  })

  if (pageResult.docs[0]) return pageResult.docs[0]

  // Fallback: try simple slug match for non-nested pages
  if (slugArray.length === 1) {
    const simpleResult = await payload.find({
      collection: 'pages',
      where: { slug: { equals: lastSlug } },
      limit: 1,
      depth: 2,
    })
    return simpleResult.docs[0] || null
  }

  return null
}

// Helper to find service by slug
async function findService(payload: Awaited<ReturnType<typeof getPayload>>, slug: string): Promise<Service | null> {
  const serviceResult = await payload.find({
    collection: 'services',
    where: {
      and: [
        { slug: { equals: slug } },
        { active: { equals: true } },
      ],
    },
    limit: 1,
    depth: 2,
  })

  return serviceResult.docs[0] || null
}

// Helper to find team member by slug
async function findTeamMember(payload: Awaited<ReturnType<typeof getPayload>>, slug: string): Promise<Team | null> {
  const teamResult = await payload.find({
    collection: 'team',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 2,
  })

  return teamResult.docs[0] || null
}

// Helper to get services assigned to a team member
async function getTeamMemberServices(payload: Awaited<ReturnType<typeof getPayload>>, memberId: string): Promise<Service[]> {
  const servicesResult = await payload.find({
    collection: 'services',
    where: {
      and: [
        { assignedTeamMember: { equals: memberId } },
        { active: { equals: true } },
      ],
    },
    limit: 50,
    depth: 1,
  })

  return servicesResult.docs
}

// Helper to get related services (excluding current one)
async function getRelatedServices(payload: Awaited<ReturnType<typeof getPayload>>, currentServiceId: string, limit: number = 3): Promise<Service[]> {
  const servicesResult = await payload.find({
    collection: 'services',
    where: {
      and: [
        { id: { not_equals: currentServiceId } },
        { active: { equals: true } },
      ],
    },
    limit,
    depth: 1,
    sort: '-featured,order',
  })

  return servicesResult.docs
}

export default async function Page({ params }: PageProps) {
  const { slug: slugArray } = await params
  const url = getUrlFromSlug(slugArray)
  const lastSlug = slugArray[slugArray.length - 1]
  const payload = await getPayload({ config: configPromise })

  // Fetch globals for header + page data
  const [headerData, logoData, businessInfo, pageData] = await Promise.all([
    getCachedGlobal('header'),
    getCachedGlobal('logo'),
    getCachedGlobal('business-info'),
    findPage(payload, url, lastSlug, slugArray),
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
        {pageData.layout && <RenderBlocks blocks={pageData.layout} />}
      </PageWrapper>
    )
  }

  // If not a page, check if it's a service or team member detail (pattern: /base-path/slug)
  // The base path is determined by the parent page (e.g., /clase, /servicii, /echipa, /antrenori)
  if (slugArray.length >= 2) {
    const itemSlug = lastSlug
    const basePath = '/' + slugArray.slice(0, -1).join('/')

    // Try service first
    const service = await findService(payload, itemSlug)

    if (service) {
      const relatedServices = await getRelatedServices(payload, service.id, 3)
      return (
        <PageWrapper
          headerData={headerData}
          logoData={logoData}
          businessInfoData={businessInfo}
        >
          <ServiceDetail
            service={service}
            backLink={service.backLink || basePath}
            backLabel={service.backLabel || 'Înapoi'}
            ctaLabel={service.ctaLabel || undefined}
            ctaLink={service.ctaLink || undefined}
            relatedServices={relatedServices}
          />
        </PageWrapper>
      )
    }

    // Try team member
    const teamMember = await findTeamMember(payload, itemSlug)

    if (teamMember) {
      // Get services assigned to this team member
      const memberServices = await getTeamMemberServices(payload, teamMember.id)

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
    const service = await findService(payload, lastSlug)
    if (service) {
      const relatedServices = await getRelatedServices(payload, service.id, 3)
      return (
        <PageWrapper
          headerData={headerData}
          logoData={logoData}
          businessInfoData={businessInfo}
        >
          <ServiceDetail
            service={service}
            backLink={service.backLink || '/servicii'}
            backLabel={service.backLabel || 'Înapoi'}
            ctaLabel={service.ctaLabel || undefined}
            ctaLink={service.ctaLink || undefined}
            relatedServices={relatedServices}
          />
        </PageWrapper>
      )
    }

    // Try team member
    const teamMember = await findTeamMember(payload, lastSlug)
    if (teamMember) {
      const memberServices = await getTeamMemberServices(payload, teamMember.id)
      return (
        <PageWrapper
          headerData={headerData}
          logoData={logoData}
          businessInfoData={businessInfo}
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
  const { slug: slugArray } = await params
  const url = getUrlFromSlug(slugArray)
  const lastSlug = slugArray[slugArray.length - 1]
  const payload = await getPayload({ config: configPromise })

  // Try to find page first
  const page = await findPage(payload, url, lastSlug, slugArray)

  if (page) {
    const { generateMeta } = await import('@/utilities/generateMeta')
    return generateMeta({ doc: page })
  }

  // Try to find service
  const service = await findService(payload, lastSlug)

  if (service) {
    return {
      title: service.title,
      description: service.shortDescription || undefined,
    }
  }

  // Try to find team member
  const teamMember = await findTeamMember(payload, lastSlug)

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
