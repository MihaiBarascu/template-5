import type { Payload } from 'payload'
import {
  createTenantAdmin,
  seedSiteTheme,
  seedBusinessInfo,
  seedLogo,
  seedHeader,
  seedFooter,
  seedServices,
  seedTeam,
  seedTestimonials,
  seedFAQ,
  seedHomePage,
  seedPortfolio,
  uploadLocalSeedImages,
  seedPosts,
  seedNewsletterSubscribers,
  seedForms,
  formTemplates,
  createContactPageLayout,
  buildHeroData,
  createSeederPage,
  type FlexibleLayout,
} from '../helpers'
import { getCurrentSeedTenantId } from '../tenant-helpers'
import { salonImages, salonData } from '../seed-data'
import { getVariant, getHeroOverlaySettings, type DesignVariant } from '../design-variants'

const VARIANT_INDEX = parseInt(process.env.DESIGN_VARIANT || '0', 10)

export async function seedSalon(payload: Payload) {
  const variant = getVariant('salon', VARIANT_INDEX)

  console.log('\n📍 Seeding: Salon Infrumusetare / Beauty Salon')
  console.log(`🎨 Design Variant: ${variant.name} (${variant.id})`)
  console.log(`   ${variant.description}`)
  console.log('━'.repeat(50))

  // 1. Create tenant admin for this business
  const tenantId = getCurrentSeedTenantId()
  await createTenantAdmin(payload, {
    email: 'admin@salon.local',
    password: 'salon123',
    name: 'Admin Salon',
    tenantId,
    tenantName: 'Salon Demo',
  })

  console.log('\n📸 Uploading images from local files...')
  const allImages = [...salonImages.hero, ...salonImages.team, ...salonImages.gallery]
  const imageMap = await uploadLocalSeedImages(payload, allImages)

  const getImageId = (filename: string): string | undefined => imageMap.get(filename) || undefined

  // Configure theme - use universal variant based on business style
  // Salon beauty typically uses pink-soft (feminine, delicate) or purple-premium (luxury)
  console.log('\n🎨 Configuring site theme...')
  await seedSiteTheme(payload, {
    variant: 'pink-soft', // Best for beauty salon - feminine, delicate, romantic
    borderRadius: variant.theme.borderRadius,
    shadows: variant.theme.shadows,
    sectionSpacing: variant.theme.sectionSpacing || 'spacious',
    headingScale: variant.theme.headingScale || 'normal',
    bodyTextSize: variant.theme.bodyTextSize || 'normal',
    cardGap: variant.theme.cardGap || 'spacious',
    animations: variant.theme.animations || 'moderate',
    // Typography - use fonts from design variant
    headingFont: variant.theme.headingFont,
    bodyFont: variant.theme.bodyFont,
  })

  console.log('\n🏪 Setting up business info...')
  await seedBusinessInfo(payload, {
    name: salonData.business.name,
    tagline: salonData.business.tagline,
    description: salonData.business.description,
    yearEstablished: salonData.business.yearEstablished,
    phone: salonData.business.phone,
    email: salonData.business.email,
    whatsapp: salonData.business.whatsapp,
    address: salonData.business.address,
    workingHours: salonData.business.workingHours,
    social: salonData.business.social,
    stats: salonData.business.stats,
    googleMapsEmbed:
      'https://www.google.com/maps?q=Bulevardul+Unirii+120,+Sector+3,+Bucuresti,+Romania&output=embed',
    whatsappFloat: {
      enabled: true,
      position: 'bottom-right',
      showOnMobile: true,
      defaultMessage: 'Buna! Doresc sa fac o programare la salon.',
      tooltipText: 'Programeaza-te pe WhatsApp',
      pulseAnimation: true,
    },
    floatingCta: {
      enabled: true,
      text: 'Rezervă Acum',
      href: '/contact',
      variant: 'gradient',
      icon: 'calendar',
      position: 'bottom-center',
      shape: 'pill',
      showOnMobile: true,
      pulseAnimation: true,
      dismissible: true,
      showAfterScroll: 300,
    },
  })

  console.log('\n🏷️ Setting up logo...')
  await seedLogo(payload, { type: 'text', text: 'Beauty Elena' })

  console.log('\n📋 Setting up header navigation...')
  await seedHeader(payload, {
    variant: 'standard',
    navItems: salonData.navigation,
    ctaButton: { enabled: true, label: 'Programeaza-te', link: '/programare', variant: 'default' },
  })

  console.log('\n📋 Setting up footer...')
  await seedFooter(payload, {
    colorScheme: 'dark',
    variant: 'columns-4',
    columns: [
      { title: 'Salonul', type: 'text' },
      { title: 'Servicii', type: 'links', links: [
        { label: 'Coafor', type: 'custom', url: '/servicii#coafor' },
        { label: 'Manichiura', type: 'custom', url: '/servicii#manichiura' },
        { label: 'Cosmetica', type: 'custom', url: '/servicii#cosmetica' },
        { label: 'Makeup', type: 'custom', url: '/servicii#makeup' },
      ]},
      { title: 'Program', type: 'schedule' },
      { title: 'Contact', type: 'contact' },
    ],
    // Footer fara textura - se poate adauga din admin
  })

  console.log('\n💅 Creating services...')
  const createdServices = await seedServices(payload, salonData.services)

  // Create forms using Form Builder
  console.log('\n📝 Creating forms...')
  const serviceOptions = Array.from(createdServices.entries()).map(([title]) => ({
    label: title,
    value: title.toLowerCase().replace(/\s+/g, '-'),
  }))
  const formsMap = await seedForms(payload, [
    formTemplates.contact(),
    formTemplates.booking(serviceOptions),
  ])

  console.log('\n👥 Creating team members...')
  const teamWithImages = salonData.team.map((member) => ({
    ...member,
    imageId: getImageId(salonImages.team[member.imageIndex]?.filename),
  }))
  await seedTeam(payload, teamWithImages)

  console.log('\n⭐ Creating testimonials...')
  await seedTestimonials(payload, salonData.testimonials)

  console.log('\n❓ Creating FAQ...')
  await seedFAQ(payload, salonData.faq)

  console.log('\n🖼️ Creating gallery items...')
  const portfolioItems = salonImages.gallery.map((img, index) => ({
    title: `Salon ${index + 1}`,
    description: img.alt,
    imageId: getImageId(img.filename) || '',
    featured: index < 4,
    order: index + 1,
  }))
  await seedPortfolio(payload, portfolioItems)

  console.log('\n🏠 Creating homepage...')
  const homepageLayout = buildHomepageLayout(variant, {
    galleryImages: salonImages.gallery,
    getImageId,
  })
  const overlaySettings = getHeroOverlaySettings(variant)

  // Build hero data using helper (supports carousel/slider/split)
  // Extract years from stats (e.g. "8+" -> 8)
  const yearsStatValue = salonData.business.stats?.find((s) => s.label.toLowerCase().includes('ani'))?.value
  const yearsExperience = yearsStatValue ? parseInt(yearsStatValue.replace(/\D/g, ''), 10) : 8

  const heroData = buildHeroData(
    variant.hero.type,
    {
      headline: salonData.hero.headline,
      subheadline: salonData.hero.subheadline,
      ctaButtons: salonData.hero.ctaButtons,
    },
    overlaySettings,
    {
      heroImages: salonImages.hero,
      galleryImages: salonImages.gallery,
      getImageId,
    },
    {
      yearsExperience,
    }
  )

  await seedHomePage(payload, {
    heroType: variant.hero.type,
    hero: heroData,
    layout: homepageLayout,
  })

  console.log('\n📄 Creating additional pages...')
  await createAdditionalPages(payload, variant, formsMap)

  // Create blog posts
  console.log('\n📝 Creating blog posts...')
  if (salonData.posts) {
    await seedPosts(payload, salonData.posts)
  }

  // Sample newsletter subscribers for demo
  console.log('\n📧 Creating sample newsletter subscribers...')
  await seedNewsletterSubscribers(payload, [
    { email: 'clienta1@mailinator.com', source: 'website' },
    { email: 'clienta2@mailinator.com', source: 'footer' },
    { email: 'clienta3@mailinator.com', source: 'popup' },
  ])

  // Note: Design variant global has been replaced by unified SiteTheme system
  // Theme is now configured at the start of seeding via seedSiteTheme()

  console.log('\n' + '━'.repeat(50))
  console.log('✅ Salon seeding complete!')
  console.log(`🎨 Applied variant: ${variant.name}`)
  console.log('━'.repeat(50))
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
  lightbox?: boolean
  defaultOpen?: string
  headline?: string
  subheadline?: string
  buttons?: Array<{ label: string; link: string; variant?: string }>
  backgroundColor?: string
  ctaButton?: { show: boolean; label: string; link: string }
  [key: string]: unknown
}

function buildHomepageLayout(
  variant: DesignVariant,
  imageOptions?: {
    galleryImages: typeof salonImages.gallery
    getImageId: (filename: string) => string | undefined
  }
) {
  const sectionConfigs: Record<string, BlockConfig> = {
    // NEW: Trust Badges - beauty salon credibility (cards variant - elegant)
    trustBadges: {
      blockType: 'trust-badges',
      variant: 'cards',
      source: 'preset',
      presets: ['quality', 'experience-years', 'happy-customers', 'online-booking'],
      customValues: {
        experienceYears: 8,
        happyCustomersCount: '15000+',
      },
      showDescriptions: true,
      iconSize: 'large',
      backgroundColor: 'light',
    },
    // NEW: How It Works - beauty experience (icons variant - feminine)
    howItWorks: {
      blockType: 'how-it-works',
      variant: 'icons',
      heading: 'Experienta Ta de Frumusete',
      subheading: 'Procesul simplu pentru a stralucii',
      steps: [
        {
          title: 'Alege Serviciul',
          description: 'Consulta lista noastra de tratamente si alege ce ti se potriveste',
          icon: 'Scissors',
        },
        {
          title: 'Programeaza Online',
          description: 'Selecteaza data, ora si stilista preferata din calendarul nostru',
          icon: 'Calendar',
        },
        {
          title: 'Relaxeaza-te',
          description: 'Vino la salon si bucura-te de o experienta de rasfat',
          icon: 'Heart',
        },
        {
          title: 'Straluceste',
          description: 'Pleaca cu un look nou si incredere sporita',
          icon: 'Star',
        },
      ],
      showNumbers: false,
      ctaButton: {
        show: true,
        label: 'Programeaza-te Acum',
        link: '/programare',
      },
      backgroundColor: 'default',
    },
    // NEW: Before After for transformations
    beforeAfter: {
      blockType: 'beforeAfter',
      variant: 'grid',
      heading: 'Transformari Spectaculoase',
      subheading: 'Vezi diferenta pe care o facem',
      backgroundColor: 'light',
    },
    // NEW: Opening Hours - program salon
    openingHours: {
      blockType: 'openingHours',
      variant: 'card',
      heading: 'Program Salon',
      subheading: 'Alege ora potrivită pentru tine',
      source: 'businessInfo',
      showCurrentStatus: true,
      backgroundColor: 'default',
    },
    // NEW: Locations - locatii salon
    locations: {
      blockType: 'locations',
      variant: 'grid-images',
      heading: 'Saloanele Noastre',
      subheading: 'Spații elegante și relaxante pentru răsfățul tău',
      locations: [
        {
          name: 'Beauty Elena - Universitate',
          address: 'Bulevardul Unirii 120, București',
          phone: '0722 555 666',
        },
      ],
    },
    // NEW: Brand Logos - branduri cosmetice
    brandLogos: {
      blockType: 'brandLogos',
      variant: 'slider',
      heading: 'Branduri Premium',
      subheading: 'Folosim doar produse cosmetice de calitate superioară',
      source: 'custom',
      logos: [],
      grayscale: true,
      autoplay: true,
      logoSize: 'medium',
      backgroundColor: 'default',
    },
    // NEW: Timeline - istoria salonului
    timeline: {
      blockType: 'timeline',
      variant: 'vertical',
      heading: 'Povestea Beauty Elena',
      subheading: 'Pasiune pentru frumusețe din 2015',
      events: [
        {
          year: '2015',
          title: 'Începutul',
          description: 'Am deschis primul salon cu doar 2 stiliste pasionate',
          icon: 'Heart',
        },
        {
          year: '2018',
          title: 'Creștere',
          description: 'Echipa a crescut la 8 specialiste și am adăugat servicii noi',
          icon: 'Users',
        },
        {
          year: '2021',
          title: 'Premium',
          description: 'Am lansat linia de tratamente premium și parteneriate internaționale',
          icon: 'Award',
        },
        {
          year: '2024',
          title: 'Prezent',
          description: 'Peste 15.000 de cliente mulțumite și servicii complete de beauty',
          icon: 'Star',
        },
      ],
      showConnector: true,
      backgroundColor: 'light',
    },
    // NEW: Announcement Bar - promotii
    announcementBar: {
      blockType: 'announcementBar',
      variant: 'simple',
      messages: [
        {
          text: '-30% la manichiură semipermanentă în această lună!',
          link: '/programare',
        },
      ],
      backgroundColor: 'primary',
    },
    services: {
      blockType: 'services',
      variant: variant.layout.servicesVariant,
      heading: 'Serviciile Noastre',
      subheading: 'Servicii complete de infrumusetare',
      source: 'collection',
      onlyFeatured: true,
      limit: 6,
      showPrices: true,
      showIcons: true,
      backgroundColor: 'light',
      detailBasePath: '/servicii',
    },
    stats: {
      blockType: 'stats',
      variant: 'grid-4',
      source: 'businessInfo',
      backgroundColor: 'dark',
    },
    team: {
      blockType: 'team',
      variant: variant.layout.teamVariant,
      heading: 'Echipa Noastra',
      subheading: 'Specialiste dedicate frumusetii tale',
      source: 'collection',
      onlyFeatured: true,
      limit: 4,
      backgroundColor: 'default',
    },
    testimonials: {
      blockType: 'testimonials',
      variant: variant.layout.testimonialsVariant,
      heading: 'Ce Spun Clientele',
      subheading: 'Pareri reale de la clientele noastre',
      source: 'collection',
      onlyFeatured: true,
      showRating: true,
      backgroundColor: 'light',
    },
    gallery: {
      blockType: 'gallery',
      variant: variant.layout.galleryVariant,
      heading: 'Galeria Noastra',
      subheading: 'Lucrarile si salonul nostru',
      images: imageOptions?.galleryImages
        ?.slice(0, 6)
        .map((img) => ({
          image: imageOptions.getImageId(img.filename),
          caption: img.alt,
        }))
        .filter((item) => item.image) || [],
      backgroundColor: 'default',
    },
    faq: {
      blockType: 'faq',
      variant: 'accordion',
      heading: 'Intrebari Frecvente',
      subheading: 'Raspunsuri utile',
      source: 'collection',
      limit: 10,
      defaultOpen: 'first',
      backgroundColor: 'default',
    },
    latestPosts: {
      blockType: 'latestPosts',
      variant: 'grid-3',
      heading: 'Din Blogul Nostru',
      subheading: 'Tendinte si sfaturi pentru frumusetea ta',
      source: 'collection',
      limit: 3,
      showImage: true,
      showCategory: true,
      showDate: true,
      showExcerpt: true,
      ctaButton: {
        show: true,
        label: 'Vezi toate articolele',
        link: '/blog',
      },
      backgroundColor: 'light',
    },
    cta: {
      blockType: 'cta',
      variant: 'centered',
      headline: 'Gata pentru o Schimbare?',
      subheadline: 'Programeaza-te acum si lasa-ne sa avem grija de tine',
      buttons: [{ label: 'Programeaza-te Acum', link: '/programare', variant: 'default' }],
      backgroundColor: 'dark',
    },
  }
  return variant.layout.sections.map((s) => sectionConfigs[s]).filter(Boolean)
}

async function createAdditionalPages(payload: Payload, variant: DesignVariant, formsMap: Map<string, string>) {
  const contactFormId = formsMap.get('Formular de contact')
  const bookingFormId = formsMap.get('Cerere programare')

  await createSeederPage(payload, {
    title: 'Servicii',
    slug: 'servicii',
    heroType: 'minimal',
    hero: { headline: 'Serviciile Noastre', subheadline: 'Servicii complete de infrumusetare' },
    layout: [
      { blockType: 'services', variant: variant.layout.servicesVariant, heading: 'Toate Serviciile', limit: 20, showPrices: true, showIcons: true, backgroundColor: 'default' },
      { blockType: 'cta', variant: 'centered', headline: 'Programeaza-te', buttons: [{ label: 'Programeaza-te', link: '/programare', variant: 'default' }], backgroundColor: 'light' },
    ],
    // _status removed for multi-tenant
  })
  console.log('   Created Services page')

  await createSeederPage(payload, {
    title: 'Echipa',
    slug: 'echipa',
    heroType: 'minimal',
    hero: { headline: 'Echipa Noastra', subheadline: 'Specialistele noastre' },
    layout: [
      { blockType: 'team', variant: variant.layout.teamVariant, heading: 'Echipa', limit: 20, backgroundColor: 'default' },
    ],
    // _status removed for multi-tenant
  })
  console.log('   Created Team page')

  await createSeederPage(payload, {
    title: 'Galerie',
    slug: 'galerie',
    heroType: 'minimal',
    hero: { headline: 'Galerie', subheadline: 'Lucrarile noastre' },
    layout: [
      { blockType: 'gallery', variant: variant.layout.galleryVariant, heading: 'Galerie', limit: 20, backgroundColor: 'default' },
    ],
    // _status removed for multi-tenant
  })
  console.log('   Created Gallery page')

  await createSeederPage(payload, {
    title: 'Preturi',
    slug: 'preturi',
    heroType: 'minimal',
    hero: { headline: 'Lista de Preturi', subheadline: 'Preturi transparente pentru toate serviciile' },
    layout: [
      { blockType: 'priceListDotted', variant: 'single-column', heading: 'Lista de Preturi', limit: 20, backgroundColor: 'default' },
      { blockType: 'cta', variant: 'centered', headline: 'Preturi speciale pentru pachete', subheadline: 'Contacteaza-ne pentru oferte personalizate', buttons: [{ label: 'Programeaza-te', link: '/programare', variant: 'default' }], backgroundColor: 'light' },
    ],
    // _status removed for multi-tenant
  })
  console.log('   Created Prices page')

  await createSeederPage(payload, {
    title: 'Programare',
    slug: 'programare',
    heroType: 'minimal',
    hero: { headline: 'Programeaza-te Online', subheadline: 'Alege serviciul si specialista preferata' },
    layout: [
      ...(bookingFormId ? [{ blockType: 'formBlock', form: bookingFormId, enableIntro: true, heading: 'Cerere Programare', subheading: 'Completeaza formularul si te vom contacta pentru confirmare.' }] : []),
      { blockType: 'contact', variant: 'compact', heading: 'Informatii Salon', backgroundColor: 'light' },
    ],
    // _status removed for multi-tenant
  })
  console.log('   Created Booking page')

  await createSeederPage(payload, {
    title: 'Contact',
    slug: 'contact',
    heroType: 'minimal',
    hero: { headline: 'Contact', subheadline: 'Suntem aici pentru tine' },
    layout: createContactPageLayout(contactFormId) as FlexibleLayout,
    // _status removed for multi-tenant
  })
  console.log('   Created Contact page')
}
