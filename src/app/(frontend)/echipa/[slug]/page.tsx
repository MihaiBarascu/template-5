import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { PageWrapper } from '@/components/PageWrapper'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getServerSideURL } from '@/utilities/getURL'
import { TeamMemberDetailBlock } from '@/blocks/TeamMemberDetail/Component'
import type { Team, Media as MediaType } from '@/payload-types'

// Static generation with ISR - revalidated on-demand via hooks + fallback after 10 minutes
export const dynamic = 'force-static'
export const revalidate = 600

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const serverUrl = getServerSideURL()

  const result = await payload.find({
    collection: 'team',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    depth: 1,
  })

  if (!result.docs[0]) {
    return {
      title: 'Membru echipa negasit',
      description: 'Membrul echipei cautat nu a fost gasit.',
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const member = result.docs[0]
  const image = member.image as MediaType | null

  return {
    title: `${member.name} - ${member.role || 'Echipa'}`,
    description: member.role
      ? `${member.name} - ${member.role}. Afla mai multe despre experienta si specializarile noastre.`
      : `Afla mai multe despre ${member.name} si experienta noastra.`,
    openGraph: {
      title: `${member.name} - ${member.role || 'Echipa'}`,
      description: member.role
        ? `${member.name} - ${member.role}`
        : `Afla mai multe despre ${member.name}`,
      url: `${serverUrl}/echipa/${member.slug}`,
      images: image?.url ? [{ url: `${serverUrl}${image.url}` }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${member.name} - ${member.role || 'Echipa'}`,
      description: member.role
        ? `${member.name} - ${member.role}`
        : `Afla mai multe despre ${member.name}`,
      images: image?.url ? [`${serverUrl}${image.url}`] : [],
    },
  }
}

export async function generateStaticParams() {
  try {
    const payload = await getPayload({ config: configPromise })

    const members = await payload.find({
      collection: 'team',
      limit: 100,
      where: {
        slug: { exists: true },
      },
    })

    return members.docs
      .filter((member) => member.slug)
      .map((member) => ({
        slug: member.slug,
      }))
  } catch {
    // Return empty array during build when DB is not available
    return []
  }
}

export default async function TeamMemberPage({ params }: PageProps) {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const serverUrl = getServerSideURL()

  // Fetch header globals
  const [headerData, logoData, businessInfo] = await Promise.all([
    getCachedGlobal('header'),
    getCachedGlobal('logo'),
    getCachedGlobal('business-info'),
  ])

  // Fetch the team member
  const result = await payload.find({
    collection: 'team',
    where: {
      slug: { equals: slug },
    },
    limit: 1,
    depth: 2,
  })

  if (!result.docs[0]) {
    notFound()
  }

  const member = result.docs[0]

  // Fetch related team members (exclude current member)
  const relatedResult = await payload.find({
    collection: 'team',
    where: {
      id: { not_equals: member.id },
    },
    limit: 3,
    depth: 1,
  })

  const relatedMembers = relatedResult.docs

  // Get image URL for structured data
  const image = member.image as MediaType | null
  const imageUrl = image?.url ? `${serverUrl}${image.url}` : null

  // JSON-LD Structured Data for Person (Schema.org)
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: member.name,
    jobTitle: member.role || undefined,
    image: imageUrl || undefined,
    url: `${serverUrl}/echipa/${member.slug}`,
    ...(member.contact?.email && { email: member.contact.email }),
    ...(member.contact?.phone && { telephone: member.contact.phone }),
    sameAs: [
      member.social?.facebook,
      member.social?.instagram,
      member.social?.linkedin,
      member.social?.twitter,
    ].filter(Boolean),
    worksFor: {
      '@type': 'Organization',
      name: businessInfo?.name || 'Business',
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
        name: 'Acasa',
        item: serverUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Echipa',
        item: `${serverUrl}/echipa`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: member.name,
      },
    ],
  }

  return (
    <PageWrapper
      headerData={headerData}
      logoData={logoData}
      businessInfoData={businessInfo}
      pageHeaderSettings={{ headerTransparency: 'solid' }}
    >
      {/* JSON-LD Structured Data - Person */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      {/* JSON-LD Structured Data - Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <main>
        <TeamMemberDetailBlock
          variant="full"
          showBreadcrumb={true}
          showExperience={true}
          showSpecializations={true}
          showContact={true}
          showSocialMedia={true}
          showSchedule={true}
          showCTA={true}
          showRelatedMembers={relatedMembers.length > 0}
          relatedMembersTitle="Alti membri ai echipei"
          backgroundColor="default"
          memberData={member}
          relatedMembers={relatedMembers}
          labels={{
            breadcrumbHome: 'Acasa',
            breadcrumbTeam: 'Echipa',
            experienceTitle: 'Ani experienta',
            specializationsTitle: 'Specializari',
            scheduleTitle: 'Program',
            contactTitle: 'Contact',
            ctaTitle: 'Vrei sa programezi o sedinta cu {name}?',
            ctaDescription: 'Contacteaza-ne pentru a programa o sedinta sau pentru mai multe informatii despre serviciile noastre.',
            ctaButtonText: 'Programeaza acum',
            ctaSecondaryButtonText: 'Vezi serviciile',
            viewAllTeamText: 'Vezi toata echipa',
            notFoundMessage: 'Membrul echipei nu a fost gasit',
          }}
          links={{
            teamBasePath: '/echipa',
            contactPath: '/contact',
            classesPath: '/terapii',
            bookingPath: '/contact',
          }}
        />
      </main>
    </PageWrapper>
  )
}
