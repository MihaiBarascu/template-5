import type { Payload } from 'payload'
import {
  createAdminUser,
  seedSiteTheme,
  seedBusinessInfo,
  seedLogo,
  seedHeader,
  seedFooter,
  seedTestimonials,
  seedFAQ,
  seedHomePage,
  seedPortfolio,
  uploadLocalSeedImages,
  seedNewsletterSubscribers,
  seedServices,
  seedSubscriptions,
} from '../helpers'
import { fitnessImages, fitnessData } from '../fitness-data'
import { getVariant, getHeroOverlaySettings, type DesignVariant } from '../design-variants'

// Get variant from environment or default to 0 (Orange Energy)
const VARIANT_INDEX = parseInt(process.env.DESIGN_VARIANT || '0', 10)

export async function seedFitness(payload: Payload) {
  const variant = getVariant('fitness', VARIANT_INDEX)

  console.log('\n📍 Seeding: Fitness / Sala')
  console.log(`🎨 Design Variant: ${variant.name} (${variant.id})`)
  console.log(`   ${variant.description}`)
  console.log('━'.repeat(50))

  // 1. Create admin user
  await createAdminUser(payload)

  // 2. Upload all images first
  console.log('\n📸 Uploading images from local files...')
  const allImages = [
    ...fitnessImages.hero,
    ...fitnessImages.team,
    ...fitnessImages.gallery,
    ...fitnessImages.classes,
  ]
  const imageMap = await uploadLocalSeedImages(payload, allImages)

  // Helper to get image ID by filename
  const getImageId = (filename: string): string | undefined => {
    return imageMap.get(filename) || undefined
  }

  // 3. Configure theme - use fitness-orange variant with advanced settings
  console.log('\n🎨 Configuring site theme...')
  await seedSiteTheme(payload, {
    variant: 'fitness-orange', // Use the new fitness-orange theme
    borderRadius: variant.theme.borderRadius,
    shadows: variant.theme.shadows,
    sectionSpacing: 'normal',
  })

  // Update advanced typography and button styles
  await payload.updateGlobal({
    slug: 'site-theme',
    data: {
      // Typography Advanced (Tab 5)
      useAdvancedTypography: true,
      letterSpacing: 'normal',
      headingLineHeight: '1.1', // Compact like Template-2
      bodyLineHeight: '1.6',
      // Button Styles (Tab 6)
      useCustomButtons: true,
      buttonPadding: 'large', // 16px 32px like Template-2
      buttonTextTransform: 'uppercase',
      buttonFontWeight: '700', // Bold
      buttonLetterSpacing: 'wide',
    },
  })
  console.log('   Applied advanced typography and button styles')

  // 4. Business info
  console.log('\n🏪 Setting up business info...')
  await seedBusinessInfo(payload, {
    name: fitnessData.business.name,
    tagline: fitnessData.business.tagline,
    description: fitnessData.business.description,
    yearEstablished: fitnessData.business.yearEstablished,
    phone: fitnessData.business.phone,
    email: fitnessData.business.email,
    whatsapp: fitnessData.business.whatsapp,
    address: fitnessData.business.address,
    workingHours: fitnessData.business.workingHours,
    social: fitnessData.business.social,
    stats: fitnessData.business.stats,
    googleMapsEmbed:
      'https://www.google.com/maps?q=Strada+Memorandumului+10,+Cluj-Napoca,+Romania&output=embed',
    whatsappFloat: {
      enabled: true,
      position: 'bottom-right',
      showOnMobile: true,
      defaultMessage: 'Buna! Doresc informatii despre abonamentele de fitness.',
      tooltipText: 'Scrie-ne pe WhatsApp',
      pulseAnimation: true,
    },
  })

  // 5. Logo
  console.log('\n🏷️ Setting up logo...')
  await seedLogo(payload, {
    type: 'text',
    text: 'TRANSILVANIA FITNESS',
  })

  // 6. Header - standard (sticky e setat automat în seedHeader)
  console.log('\n📋 Setting up header navigation...')
  await seedHeader(payload, {
    variant: 'standard',
    navItems: fitnessData.navigation,
    ctaButton: {
      enabled: true,
      label: 'Inscrie-te',
      link: '/contact',
      variant: 'default',
    },
  })

  // 7. Footer
  console.log('\n📋 Setting up footer...')
  await seedFooter(payload, {
    variant: 'columns-4',
    columns: fitnessData.footer.columns,
    // Footer fara textura - se poate adauga din admin
  })

  // 8. Team with images
  console.log('\n👥 Creating team members (trainers)...')
  const teamWithImages = fitnessData.team.map((member) => ({
    ...member,
    imageId: getImageId(fitnessImages.team[member.imageIndex]?.filename),
  }))
  const createdTeam = await seedTeamAndGetIds(payload, teamWithImages)

  // 9. Fitness services (classes as services)
  console.log('\n🏋️ Creating fitness services (classes)...')
  const servicesFromClasses = fitnessData.classes.map((classItem, index) => ({
    title: classItem.title,
    shortDescription: classItem.shortDescription,
    icon: classItem.icon,
    displayStyle: classItem.displayStyle || 'card' as const,
    attributes: classItem.attributes,
    features: classItem.features,
    imageId: getImageId(fitnessImages.classes[index]?.filename),
    featured: classItem.featured,
    order: classItem.order,
    ctaLabel: classItem.ctaLabel,
    ctaLink: classItem.ctaLink,
    backLabel: classItem.backLabel,
    backLink: classItem.backLink,
    schedule: classItem.schedule,
  }))
  const createdServices = await seedServices(payload, servicesFromClasses)

  // 10. Subscriptions
  console.log('\n💳 Creating subscriptions...')
  await seedSubscriptions(payload, fitnessData.subscriptions)

  // 11. Testimonials
  console.log('\n⭐ Creating testimonials...')
  await seedTestimonials(payload, fitnessData.testimonials)

  // 12. FAQ
  console.log('\n❓ Creating FAQ...')
  await seedFAQ(payload, fitnessData.faq)

  // 13. Portfolio/Gallery with images
  console.log('\n🖼️ Creating gallery items...')
  const portfolioItems = fitnessImages.gallery.map((img, index) => ({
    title: `Galerie ${index + 1}`,
    description: img.alt,
    imageId: getImageId(img.filename) || '',
    featured: index < 4,
    order: index + 1,
  }))
  await seedPortfolio(payload, portfolioItems)

  // 14. Homepage with dynamic layout based on variant
  console.log('\n🏠 Creating homepage...')
  const heroImageId = getImageId(fitnessImages.hero[0]?.filename)
  const homepageLayout = buildHomepageLayout(variant)

  const overlaySettings = getHeroOverlaySettings(variant)
  await seedHomePage(payload, {
    heroType: variant.hero.type,
    hero: {
      headline: fitnessData.hero.headline,
      subheadline: fitnessData.hero.subheadline,
      ctaButtons: fitnessData.hero.ctaButtons,
      imageId: heroImageId,
      ...overlaySettings,
    },
    layout: homepageLayout,
  })

  // 15. Create additional pages (including individual service and trainer pages)
  console.log('\n📄 Creating additional pages...')
  await createAdditionalPages(
    payload,
    variant,
    fitnessData.classes,
    fitnessData.team,
    createdTeam,
    createdServices,
  )

  // 16. Sample newsletter subscribers for demo
  console.log('\n📧 Creating sample newsletter subscribers...')
  await seedNewsletterSubscribers(payload, [
    { email: 'fitness1@mailinator.com', source: 'website' },
    { email: 'fitness2@mailinator.com', source: 'footer' },
    { email: 'fitness3@mailinator.com', source: 'popup' },
  ])

  console.log('\n' + '━'.repeat(50))
  console.log('✅ Fitness seeding complete!')
  console.log(`🎨 Applied variant: ${variant.name}`)
  console.log('━'.repeat(50))
}

// Helper to seed team and return IDs
async function seedTeamAndGetIds(
  payload: Payload,
  members: Array<{
    name: string
    role: string
    experience?: string
    featured?: boolean
    order?: number
    specializations?: string[]
    imageId?: string
  }>,
): Promise<Map<string, string>> {
  const teamMap = new Map<string, string>()

  for (const member of members) {
    const created = await payload.create({
      collection: 'team',
      data: {
        name: member.name,
        slug: member.name
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w-]/g, ''),
        role: member.role,
        experience: member.experience,
        featured: member.featured || false,
        order: member.order || 0,
        specializations: member.specializations?.map((s) => ({
          specialization: s,
        })),
        image: member.imageId || undefined,
      },
    })
    teamMap.set(member.name, created.id)
  }
  console.log(`   Created ${members.length} team members`)
  return teamMap
}

// Block configuration type for homepage layout
interface BlockConfig {
  blockType: string
  variant?: string
  heading?: string
  subheading?: string
  source?: string
  onlyFeatured?: boolean
  limit?: number
  showPrices?: boolean
  showIcons?: boolean
  showRating?: boolean
  showDuration?: boolean
  showDifficulty?: boolean
  showTrainer?: boolean
  defaultOpen?: string
  headline?: string
  subheadline?: string
  buttons?: Array<{ label: string; link: string; variant?: string }>
  backgroundColor?: string
  filterByCategory?: string
  ctaButton?: { enabled?: boolean; label?: string; link?: string }
  [key: string]: unknown
}

// Build homepage layout based on variant configuration
function buildHomepageLayout(variant: DesignVariant) {
  const sectionConfigs: Record<string, BlockConfig> = {
    stats: {
      blockType: 'stats',
      variant: 'grid-4',
      source: 'businessInfo',
      backgroundColor: 'primary',
    },
    classesGrid: {
      blockType: 'classesGrid',
      variant: 'grid-3',
      heading: 'Clasele Noastre',
      subheading: 'Alege din varietatea de clase fitness pentru toate nivelurile',
      source: 'collection',
      onlyFeatured: true,
      limit: 6,
      showDuration: true,
      showDifficulty: true,
      showTrainer: true,
      showPrice: true,
      backgroundColor: 'default',
      ctaButton: {
        enabled: true,
        label: 'Vezi toate clasele',
        link: '/clase',
      },
    },
    scheduleTable: {
      blockType: 'scheduleTable',
      variant: 'table-week',
      heading: 'Programul Saptamanal',
      subheading: 'Gaseste clasa potrivita pentru tine',
      source: 'collection',
      showTrainer: true,
      showDuration: true,
      showRoom: true,
      showCategoryFilter: true,
      highlightToday: true,
      startHour: 7,
      endHour: 22,
      backgroundColor: 'light',
      ctaButton: {
        enabled: true,
        label: 'Inscrie-te acum',
        link: '/contact',
      },
    },
    subscriptionCards: {
      blockType: 'subscriptionCards',
      variant: 'cards-3',
      heading: 'Abonamente',
      subheading: 'Alege abonamentul potrivit pentru tine',
      source: 'collection',
      limit: 4,
      showFeatures: true,
      showOldPrice: true,
      backgroundColor: 'default',
    },
    team: {
      blockType: 'team',
      variant: variant.layout.teamVariant,
      heading: 'Antrenorii Nostri',
      subheading: 'Profesionisti certificati care te vor ghida spre rezultate',
      source: 'collection',
      onlyFeatured: true,
      limit: 4,
      backgroundColor: 'light',
    },
    gallery: {
      blockType: 'gallery',
      variant: variant.layout.galleryVariant,
      heading: 'Galerie',
      subheading: 'Descopera spatiul nostru modern si echipamentele premium',
      source: 'portfolio',
      limit: 6,
      backgroundColor: 'default',
    },
    testimonials: {
      blockType: 'testimonials',
      variant: variant.layout.testimonialsVariant,
      heading: 'Ce Spun Membrii',
      subheading: 'Rezultate reale de la membrii nostri',
      source: 'collection',
      onlyFeatured: true,
      showRating: true,
      backgroundColor: 'light',
    },
    faq: {
      blockType: 'faq',
      variant: 'accordion',
      heading: 'Intrebari Frecvente',
      subheading: 'Tot ce trebuie sa stii despre sala noastra',
      source: 'collection',
      limit: 10,
      defaultOpen: 'first',
      backgroundColor: 'default',
    },
    cta: {
      blockType: 'cta',
      variant: 'centered',
      headline: 'Gata sa incepi transformarea?',
      subheadline: 'Inscrie-te acum si beneficiaza de prima sedinta gratuita!',
      buttons: [
        { label: 'Inscrie-te Acum', link: '/contact', variant: 'default' },
        { label: 'Vezi Abonamentele', link: '/abonamente', variant: 'outline' },
      ],
      backgroundColor: 'primary',
    },
  }

  // Build layout based on variant section order
  return variant.layout.sections
    .map((sectionName) => sectionConfigs[sectionName])
    .filter(Boolean)
}

// Type for class data
interface ClassData {
  title: string
  shortDescription: string
  icon?: string
  displayStyle?: 'card' | 'card-image' | 'list' | 'pricing' | 'detailed' | 'menu-item'
  attributes?: Array<{ label: string; value: string; icon?: string }>
  features?: string[]
  featured?: boolean
  order?: number
  ctaLabel?: string
  ctaLink?: string
  backLabel?: string
  backLink?: string
}

// Type for team data
interface TeamData {
  name: string
  role: string
  experience?: string
  featured?: boolean
  order?: number
  specializations?: string[]
  imageIndex: number
}

// Helper to create a proper Lexical text node
function createTextNode(text: string, format: number = 0) {
  return {
    type: 'text',
    text,
    format,
    detail: 0,
    mode: 'normal',
    style: '',
    version: 1,
  }
}

// Helper to create Lexical richText from simple text (kept for potential future use)
function _createRichText(text: string) {
  return {
    root: {
      type: 'root',
      children: text.split('\n\n').map((paragraph) => ({
        type: 'paragraph',
        children: [createTextNode(paragraph)],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

// Helper to create rich content with headings and lists for class pages (kept for potential future use)
function _createClassPageContent(classItem: ClassData & { benefits?: string[], duration?: number, difficulty?: string, capacity?: number, trainerName?: string, pricing?: { dropIn?: number; monthly?: number } }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const children: any[] = []

  // Description paragraph
  if (classItem.shortDescription) {
    children.push({
      type: 'paragraph',
      children: [createTextNode(classItem.shortDescription)],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      textFormat: 0,
      version: 1,
    })
  }

  // Benefits section
  if (classItem.benefits && classItem.benefits.length > 0) {
    // Heading for benefits
    children.push({
      type: 'heading',
      tag: 'h3',
      children: [createTextNode('Beneficii', 1)],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    })
    // List items
    for (const benefit of classItem.benefits) {
      children.push({
        type: 'listitem',
        children: [createTextNode(benefit)],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
        listType: 'bullet',
      })
    }
  }

  // Details section
  children.push({
    type: 'heading',
    tag: 'h3',
    children: [createTextNode('Detalii', 1)],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  })

  const details = []
  details.push(`Durata: ${classItem.duration} minute`)
  details.push(`Nivel: ${classItem.difficulty === 'all-levels' ? 'Toate nivelurile' : classItem.difficulty === 'beginner' ? 'Incepator' : classItem.difficulty === 'intermediate' ? 'Intermediar' : 'Avansat'}`)
  if (classItem.capacity) details.push(`Capacitate: ${classItem.capacity} persoane`)
  if (classItem.trainerName) details.push(`Instructor: ${classItem.trainerName}`)

  for (const detail of details) {
    children.push({
      type: 'paragraph',
      children: [createTextNode(detail)],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      textFormat: 0,
      version: 1,
    })
  }

  // Pricing section
  if (classItem.pricing) {
    children.push({
      type: 'heading',
      tag: 'h3',
      children: [createTextNode('Preturi', 1)],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    })
    children.push({
      type: 'paragraph',
      children: [createTextNode(`Sedinta: ${classItem.pricing.dropIn} RON`)],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      textFormat: 0,
      version: 1,
    })
    children.push({
      type: 'paragraph',
      children: [createTextNode(`Abonament lunar: ${classItem.pricing.monthly} RON`)],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      textFormat: 0,
      version: 1,
    })
  }

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

// Create additional pages
async function createAdditionalPages(
  payload: Payload,
  variant: DesignVariant,
  classesData: ClassData[],
  teamData: TeamData[],
  teamIdMap: Map<string, string>,
  serviceIdMap: Map<string, string>,
) {
  // ============================================
  // CLASSES PARENT PAGE
  // ============================================
  const clasesPage = await payload.create({
    collection: 'pages',
    data: {
      title: 'Clase',
      slug: 'clase',
      heroType: 'minimal',
      hero: {
        headline: 'Clasele Noastre',
        subheadline: 'De la cardio intens la yoga relaxanta - avem clasa perfecta pentru tine',
      },
      layout: [
        {
          blockType: 'services',
          variant: 'grid-3',
          heading: 'Toate Clasele',
          subheading: 'Exploreaza varietatea de clase fitness disponibile',
          limit: 20,
          showPrices: true,
          showIcons: true,
          backgroundColor: 'default',
          detailBasePath: '/clase',
          labels: {
            currencySymbol: 'RON',
            fromLabel: 'de la',
          },
        },
        {
          blockType: 'cta',
          variant: 'centered',
          headline: 'Vrei sa incerci o clasa?',
          subheadline: 'Inscrie-te pentru o sedinta de proba gratuita',
          buttons: [{ label: 'Inscrie-te', link: '/contact', variant: 'default' }],
          backgroundColor: 'primary',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Classes page')

  // ============================================
  // INDIVIDUAL CLASS/SERVICE PAGES (nested under /clase/)
  // Using the new ServiceDetail block for rich display
  // ============================================
  console.log('\n📄 Creating individual class pages with ServiceDetail block...')
  for (const classItem of classesData) {
    const slug = classItem.title
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

    // Get the service ID from the map (keyed by title)
    const serviceId = serviceIdMap.get(classItem.title)

    if (!serviceId) {
      console.warn(`   Warning: Service "${classItem.title}" not found in serviceIdMap, skipping page creation`)
      continue
    }

    await payload.create({
      collection: 'pages',
      data: {
        title: classItem.title,
        slug,
        parent: clasesPage.id, // Nested under Clase
        // Manually set breadcrumbs since nested-docs plugin hooks may not trigger via Local API
        breadcrumbs: [
          { label: 'Clase', url: '/clase', doc: clasesPage.id },
          { label: classItem.title, url: `/clase/${slug}` },
        ],
        heroType: 'none', // No hero - ServiceDetail block handles the display
        layout: [
          {
            blockType: 'serviceDetail',
            service: serviceId as string, // Use relationship ID
            variant: 'full',
            showBreadcrumb: true,
            showSchedule: true,
            showPricing: true,
            showTeamMember: true,
            showBenefits: true,
            showFeatures: true,
            showRequirements: true,
            showRelatedServices: true,
            relatedServicesCount: 3,
            relatedServicesTitle: 'Alte clase similare',
            ctaButtonText: 'Rezerva acum',
            ctaButtonLink: `/clase/inscriere?clasa=${encodeURIComponent(classItem.title)}`,
            backgroundColor: 'light',
            labels: {
              breadcrumbHome: 'Acasa',
              breadcrumbServices: 'Clase',
              benefitsTitle: 'Beneficii',
              scheduleTitle: 'Program',
              pricingTitle: 'Preturi',
              teamMemberTitle: 'Antrenor',
              viewAllServicesText: 'Vezi toate clasele',
            },
            links: {
              servicesBasePath: '/clase',
              teamBasePath: '/antrenori',
              bookingPath: '/clase/inscriere',
            },
          },
        ],
        _status: 'published',
      },
    })
    console.log(`   Created class page: /clase/${slug}`)
  }

  // Schedule page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Program',
      slug: 'program',
      heroType: 'minimal',
      hero: {
        headline: 'Programul Claselor',
        subheadline: 'Gaseste clasa perfecta in programul nostru saptamanal',
      },
      layout: [
        {
          blockType: 'scheduleTable',
          variant: 'table-week',
          heading: 'Program Saptamanal',
          source: 'collection',
          showTrainer: true,
          showDuration: true,
          showRoom: true,
          showCategoryFilter: true,
          highlightToday: true,
          startHour: 7,
          endHour: 22,
          backgroundColor: 'default',
          ctaButton: {
            enabled: true,
            label: 'Inscrie-te la o clasa',
            link: '/contact',
          },
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Schedule page')

  // Subscriptions page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Abonamente',
      slug: 'abonamente',
      heroType: 'minimal',
      hero: {
        headline: 'Abonamente',
        subheadline: 'Alege abonamentul potrivit pentru stilul tau de viata',
      },
      layout: [
        {
          blockType: 'subscriptionCards',
          variant: 'cards-3',
          heading: 'Pachetele Noastre',
          subheading: 'Flexibilitate si valoare pentru orice buget',
          source: 'collection',
          limit: 10,
          showFeatures: true,
          showOldPrice: true,
          backgroundColor: 'default',
        },
        {
          blockType: 'faq',
          variant: 'accordion',
          heading: 'Intrebari despre Abonamente',
          source: 'collection',
          limit: 5,
          backgroundColor: 'light',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Subscriptions page')

  // ============================================
  // TRAINERS PARENT PAGE
  // ============================================
  const antrenoriPage = await payload.create({
    collection: 'pages',
    data: {
      title: 'Antrenori',
      slug: 'antrenori',
      heroType: 'minimal',
      hero: {
        headline: 'Echipa de Antrenori',
        subheadline: 'Profesionisti pasionati care te vor ajuta sa iti atingi obiectivele',
      },
      layout: [
        {
          blockType: 'team',
          variant: variant.layout.teamVariant,
          heading: 'Antrenorii Nostri',
          subheading:
            'Fiecare antrenor este certificat si dedicat sa te ajute sa obtii rezultate',
          source: 'collection',
          limit: 20,
          showRole: true,
          showBio: true,
          backgroundColor: 'default',
        },
        {
          blockType: 'cta',
          variant: 'centered',
          headline: 'Vrei o sedinta personalizata?',
          subheadline: 'Contacteaza-ne pentru a programa o sesiune cu un antrenor',
          buttons: [{ label: 'Programeaza-te', link: '/contact', variant: 'default' }],
          backgroundColor: 'primary',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Trainers page')

  // ============================================
  // INDIVIDUAL TRAINER PAGES (nested under /antrenori/)
  // ============================================
  console.log('\n📄 Creating individual trainer pages...')
  for (const member of teamData) {
    const slug = member.name
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '')

    // Get the team member ID from the map (keyed by name)
    const memberId = teamIdMap.get(member.name)

    if (!memberId) {
      console.warn(`   Warning: Team member "${member.name}" not found in teamIdMap, skipping page creation`)
      continue
    }

    await payload.create({
      collection: 'pages',
      data: {
        title: member.name,
        slug,
        parent: antrenoriPage.id, // Nested under Antrenori
        // Manually set breadcrumbs since nested-docs plugin hooks may not trigger via Local API
        breadcrumbs: [
          { label: 'Antrenori', url: '/antrenori', doc: antrenoriPage.id },
          { label: member.name, url: `/antrenori/${slug}` },
        ],
        heroType: 'none', // No hero - TeamMemberDetail block handles everything
        layout: [
          {
            blockType: 'teamMemberDetail',
            member: memberId as string, // Use relationship ID instead of slug
            variant: 'full',
            showBreadcrumb: true,
            showExperience: true,
            showSpecializations: true,
            showContact: false, // No individual contact for trainers
            showSocialMedia: false,
            showSchedule: false,
            showCTA: true,
            showRelatedMembers: true,
            relatedMembersCount: 3,
            relatedMembersTitle: 'Alti antrenori',
            backgroundColor: 'default',
            labels: {
              breadcrumbHome: 'Acasa',
              breadcrumbTeam: 'Antrenori',
              experienceTitle: 'Ani experienta',
              specializationsTitle: 'Specializari',
              ctaTitle: `Vrei sa lucrezi cu ${member.name.split(' ')[0]}?`,
              ctaDescription: 'Contacteaza-ne pentru a programa o sesiune de antrenament sau pentru mai multe informatii despre serviciile noastre.',
              ctaButtonText: 'Programeaza-te',
              ctaSecondaryButtonText: 'Vezi clasele disponibile',
              viewAllTeamText: 'Vezi toti antrenorii',
            },
            links: {
              teamBasePath: '/antrenori',
              contactPath: '/contact',
              classesPath: '/clase',
              bookingPath: '/clase/inscriere',
            },
          },
        ],
        _status: 'published',
      },
    })
    console.log(`   Created trainer page: /antrenori/${slug}`)
  }

  // Gallery page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Galerie',
      slug: 'galerie',
      heroType: 'minimal',
      hero: {
        headline: 'Galerie',
        subheadline: 'Descopera spatiul nostru si atmosfera de antrenament',
      },
      layout: [
        {
          blockType: 'gallery',
          variant: variant.layout.galleryVariant,
          heading: 'Sala Noastra',
          subheading: 'Echipamente moderne intr-un spatiu amenajat pentru performanta',
          source: 'portfolio',
          limit: 20,
          backgroundColor: 'default',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Gallery page')

  // Contact page - standard contact form
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact',
      slug: 'contact',
      heroType: 'minimal',
      hero: {
        headline: 'Contact',
        subheadline: 'Suntem aici sa te ajutam. Contacteaza-ne pentru orice intrebare.',
      },
      layout: [
        {
          blockType: 'contact',
          variant: 'split',
          heading: 'Contacteaza-ne',
          subheading: 'Trimite-ne un mesaj sau vino direct la sala',
          showForm: true,
          formType: 'standard',
          formFields: {
            showName: true,
            showEmail: true,
            showPhone: true,
            showSubject: true,
            showService: false,
            showMessage: true,
          },
          submitButtonText: 'Trimite Mesajul',
          successMessage:
            'Multumim! Mesajul tau a fost trimis. Te vom contacta in cel mai scurt timp.',
          showContactInfo: true,
          contactInfoItems: {
            showAddress: true,
            showPhone: true,
            showEmail: true,
            showWorkingHours: true,
            showSocial: true,
          },
          showMap: true,
          mapPosition: 'bottom',
          backgroundColor: 'light',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Contact page')

  // Class Registration page - nested under /clase/inscriere
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Inscriere Clase',
      slug: 'inscriere',
      parent: clasesPage.id, // Nested under Clase
      // Manually set breadcrumbs since nested-docs plugin hooks may not trigger via Local API
      breadcrumbs: [
        { label: 'Clase', url: '/clase', doc: clasesPage.id },
        { label: 'Inscriere Clase', url: '/clase/inscriere' },
      ],
      heroType: 'minimal',
      hero: {
        headline: 'Inscrie-te la Clase',
        subheadline: 'Alege clasa preferata si programeaza-te pentru o sedinta.',
      },
      layout: [
        {
          blockType: 'contact',
          variant: 'split',
          heading: 'Formular de Inscriere',
          subheading: 'Completeaza formularul pentru a te inscrie la clasele noastre de fitness',
          showForm: true,
          formType: 'custom',
          customFields: [
            {
              fieldType: 'text',
              name: 'name',
              label: 'Nume complet',
              placeholder: 'Ion Popescu',
              required: true,
              halfWidth: false,
            },
            {
              fieldType: 'email',
              name: 'email',
              label: 'Email',
              placeholder: 'email@exemplu.ro',
              required: true,
              halfWidth: true,
            },
            {
              fieldType: 'tel',
              name: 'phone',
              label: 'Telefon',
              placeholder: '0722 123 456',
              required: true,
              halfWidth: true,
            },
            {
              fieldType: 'select',
              name: 'preferredClass',
              label: 'Clasa preferata',
              placeholder: 'Selecteaza o clasa',
              required: true,
              halfWidth: true,
              options: [
                { label: 'HIIT Extreme', value: 'hiit-extreme' },
                { label: 'Yoga Flow', value: 'yoga-flow' },
                { label: 'Spinning Power', value: 'spinning-power' },
                { label: 'CrossFit WOD', value: 'crossfit-wod' },
                { label: 'Pilates Mat', value: 'pilates-mat' },
                { label: 'Box Fitness', value: 'box-fitness' },
              ],
            },
            {
              fieldType: 'select',
              name: 'experienceLevel',
              label: 'Nivel experienta',
              placeholder: 'Selecteaza nivelul',
              required: true,
              halfWidth: true,
              options: [
                { label: 'Incepator - nu am mai facut fitness', value: 'beginner' },
                { label: 'Intermediar - am ceva experienta', value: 'intermediate' },
                { label: 'Avansat - fac fitness regulat', value: 'advanced' },
              ],
            },
            {
              fieldType: 'select',
              name: 'preferredSchedule',
              label: 'Program preferat',
              placeholder: 'Cand preferi sa te antrenezi?',
              required: false,
              halfWidth: true,
              options: [
                { label: 'Dimineata (06:00 - 10:00)', value: 'morning' },
                { label: 'Pranz (10:00 - 14:00)', value: 'noon' },
                { label: 'Dupa-amiaza (14:00 - 18:00)', value: 'afternoon' },
                { label: 'Seara (18:00 - 22:00)', value: 'evening' },
                { label: 'Flexibil', value: 'flexible' },
              ],
            },
            {
              fieldType: 'select',
              name: 'subscription',
              label: 'Tip abonament dorit',
              placeholder: 'Selecteaza abonamentul',
              required: false,
              halfWidth: true,
              options: [
                { label: 'Basic (149 RON/luna)', value: 'basic' },
                { label: 'Standard (199 RON/luna)', value: 'standard' },
                { label: 'Premium (299 RON/luna)', value: 'premium' },
                { label: 'Anual Premium (1990 RON/an)', value: 'annual' },
                { label: 'Nu stiu inca', value: 'undecided' },
              ],
            },
            {
              fieldType: 'checkbox',
              name: 'trialSession',
              label: 'Doresc o sedinta de proba gratuita',
              required: false,
              halfWidth: false,
            },
            {
              fieldType: 'textarea',
              name: 'message',
              label: 'Mesaj sau obiective fitness',
              placeholder: 'Spune-ne despre obiectivele tale sau orice intrebari ai avea...',
              required: false,
              halfWidth: false,
            },
          ],
          submitButtonText: 'Inscrie-te Acum',
          successMessage:
            'Multumim pentru inscriere! Te vom contacta in cel mai scurt timp pentru a confirma programarea.',
          showContactInfo: true,
          contactInfoItems: {
            showAddress: true,
            showPhone: true,
            showEmail: true,
            showWorkingHours: true,
            showSocial: true,
          },
          showMap: true,
          mapPosition: 'bottom',
          backgroundColor: 'light',
          labels: {
            formTitle: 'Formular de Inscriere',
            contactInfoTitle: 'Vino la Sala',
            addressLabel: 'Locatie',
            phoneLabel: 'Suna-ne',
            emailLabel: 'Scrie-ne',
            scheduleLabel: 'Program Sala',
            socialLabel: 'Urmareste-ne',
            selectPlaceholder: 'Selecteaza o optiune',
            requiredText: '*',
            submittingText: 'Se trimite inscrierea...',
            errorMessage: 'A aparut o eroare. Te rugam sa incerci din nou sau sa ne contactezi telefonic.',
          },
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Class Registration page (/clase/inscriere)')

  // Subscription Order page - nested under /abonamente/comanda
  // First we need the subscriptions page ID
  const abonamentePage = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'abonamente' } },
    limit: 1,
  })
  const abonamentePageId = abonamentePage.docs[0]?.id

  if (abonamentePageId) {
    await payload.create({
      collection: 'pages',
      data: {
        title: 'Comanda Abonament',
        slug: 'comanda',
        parent: abonamentePageId, // Nested under Abonamente -> /abonamente/comanda
        // Manually set breadcrumbs since nested-docs plugin hooks may not trigger via Local API
        breadcrumbs: [
          { label: 'Abonamente', url: '/abonamente', doc: abonamentePageId },
          { label: 'Comanda Abonament', url: '/abonamente/comanda' },
        ],
        heroType: 'minimal',
        hero: {
          headline: 'Comanda Abonament',
          subheadline: 'Completeaza datele pentru a comanda abonamentul dorit.',
        },
        layout: [
          {
            blockType: 'contact',
            variant: 'centered',
            heading: 'Formular Comanda Abonament',
            subheading: 'Completeaza datele si te vom contacta pentru finalizarea comenzii',
            showForm: true,
            formType: 'custom',
            customFields: [
              {
                fieldType: 'text',
                name: 'name',
                label: 'Nume complet',
                placeholder: 'Ion Popescu',
                required: true,
                halfWidth: false,
              },
              {
                fieldType: 'email',
                name: 'email',
                label: 'Email',
                placeholder: 'email@exemplu.ro',
                required: true,
                halfWidth: true,
              },
              {
                fieldType: 'tel',
                name: 'phone',
                label: 'Telefon',
                placeholder: '0722 123 456',
                required: true,
                halfWidth: true,
              },
              {
                fieldType: 'select',
                name: 'subscription',
                label: 'Abonament dorit',
                placeholder: 'Selecteaza abonamentul',
                required: true,
                halfWidth: false,
                options: [
                  { label: 'Basic - 149 RON/luna', value: 'basic' },
                  { label: 'Standard - 199 RON/luna (Popular)', value: 'standard' },
                  { label: 'Premium - 299 RON/luna', value: 'premium' },
                  { label: 'Anual Premium - 1990 RON/an (Economisesti 400 RON)', value: 'annual' },
                ],
              },
              {
                fieldType: 'select',
                name: 'paymentMethod',
                label: 'Metoda de plata preferata',
                placeholder: 'Selecteaza metoda',
                required: true,
                halfWidth: true,
                options: [
                  { label: 'Card bancar', value: 'card' },
                  { label: 'Transfer bancar', value: 'transfer' },
                  { label: 'Numerar la sala', value: 'cash' },
                ],
              },
              {
                fieldType: 'select',
                name: 'startDate',
                label: 'Cand doresti sa incepi',
                placeholder: 'Selecteaza perioada',
                required: false,
                halfWidth: true,
                options: [
                  { label: 'Cat mai curand', value: 'asap' },
                  { label: 'Inceputul lunii viitoare', value: 'next-month' },
                  { label: 'Alta data (specifica in mesaj)', value: 'other' },
                ],
              },
              {
                fieldType: 'checkbox',
                name: 'wantsTour',
                label: 'Doresc un tur al salii inainte de achizitie',
                required: false,
                halfWidth: false,
              },
              {
                fieldType: 'textarea',
                name: 'message',
                label: 'Mesaj sau intrebari',
                placeholder: 'Ai intrebari despre abonament sau alte cerinte speciale?',
                required: false,
                halfWidth: false,
              },
            ],
            submitButtonText: 'Trimite Comanda',
            successMessage:
              'Multumim pentru comanda! Te vom contacta in cel mai scurt timp pentru confirmare si detalii de plata.',
            showContactInfo: true,
            contactInfoItems: {
              showAddress: false,
              showPhone: true,
              showEmail: true,
              showWorkingHours: true,
              showSocial: false,
            },
            showMap: false,
            backgroundColor: 'light',
            labels: {
              formTitle: 'Comanda Abonament',
              contactInfoTitle: 'Ai intrebari?',
              phoneLabel: 'Suna-ne',
              emailLabel: 'Scrie-ne',
              scheduleLabel: 'Program',
              selectPlaceholder: 'Selecteaza o optiune',
              requiredText: '*',
              submittingText: 'Se trimite comanda...',
              errorMessage: 'A aparut o eroare. Te rugam sa incerci din nou sau sa ne contactezi telefonic.',
            },
          },
        ],
        _status: 'published',
      },
    })
    console.log('   Created Subscription Order page (/abonamente/comanda)')
  }
}
