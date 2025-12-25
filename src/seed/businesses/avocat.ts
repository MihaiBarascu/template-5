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
import { avocatImages, avocatData } from '../seed-data'
import { getVariant, getHeroOverlaySettings, type DesignVariant } from '../design-variants'

const VARIANT_INDEX = parseInt(process.env.DESIGN_VARIANT || '0', 10)

export async function seedAvocat(payload: Payload) {
  const variant = getVariant('avocat', VARIANT_INDEX)

  console.log('\n📍 Seeding: Cabinet Avocat / Law Office')
  console.log(`🎨 Design Variant: ${variant.name} (${variant.id})`)
  console.log(`   ${variant.description}`)
  console.log('━'.repeat(50))

  // 1. Create tenant admin for this business
  const tenantId = getCurrentSeedTenantId()
  await createTenantAdmin(payload, {
    email: 'admin@avocat.local',
    password: 'avocat123',
    name: 'Admin Cabinet Avocat',
    tenantId,
    tenantName: 'Cabinet Avocatură Demo',
  })

  console.log('\n📸 Uploading images from local files...')
  const allImages = [...avocatImages.hero, ...avocatImages.team, ...avocatImages.gallery]
  const imageMap = await uploadLocalSeedImages(payload, allImages)

  const getImageId = (filename: string): string | undefined => imageMap.get(filename) || undefined

  // Configure theme - use universal variant based on business style
  // Law firm typically uses classic-blue (professional, trustworthy) or dark-gold (elegant)
  console.log('\n🎨 Configuring site theme...')
  await seedSiteTheme(payload, {
    variant: 'classic-blue', // Best for law firm - professional, trustworthy
    borderRadius: variant.theme.borderRadius,
    shadows: variant.theme.shadows,
    sectionSpacing: variant.theme.sectionSpacing || 'normal',
    headingScale: variant.theme.headingScale || 'normal',
    bodyTextSize: variant.theme.bodyTextSize || 'normal',
    cardGap: variant.theme.cardGap || 'normal',
    animations: variant.theme.animations || 'subtle',
    // Typography - use fonts from design variant
    headingFont: variant.theme.headingFont,
    bodyFont: variant.theme.bodyFont,
  })

  console.log('\n🏪 Setting up business info...')
  await seedBusinessInfo(payload, {
    name: avocatData.business.name,
    tagline: avocatData.business.tagline,
    description: avocatData.business.description,
    yearEstablished: avocatData.business.yearEstablished,
    phone: avocatData.business.phone,
    email: avocatData.business.email,
    whatsapp: avocatData.business.whatsapp,
    address: avocatData.business.address,
    workingHours: avocatData.business.workingHours,
    social: avocatData.business.social,
    stats: avocatData.business.stats,
    googleMapsEmbed:
      'https://www.google.com/maps?q=Bulevardul+Decebal+78,+Sector+3,+Bucuresti,+Romania&output=embed',
    whatsappFloat: {
      enabled: true,
      position: 'bottom-right',
      showOnMobile: true,
      defaultMessage: 'Buna! Doresc o consultatie juridica.',
      tooltipText: 'Programeaza consultatie',
      pulseAnimation: true,
    },
    floatingCta: {
      enabled: true,
      text: 'Consultație Gratuită',
      href: '/contact',
      variant: 'gradient',
      icon: 'phone',
      position: 'bottom-center',
      shape: 'pill',
      showOnMobile: true,
      pulseAnimation: true,
      dismissible: true,
      showAfterScroll: 300,
    },
  })

  console.log('\n🏷️ Setting up logo...')
  await seedLogo(payload, { type: 'text', text: 'Avocat Ionescu' })

  console.log('\n📋 Setting up header navigation...')
  await seedHeader(payload, {
    variant: 'standard',
    navItems: avocatData.navigation,
    ctaButton: { enabled: true, label: 'Consultatie', link: '/contact', variant: 'default' },
  })

  console.log('\n📋 Setting up footer...')
  await seedFooter(payload, {
    colorScheme: 'dark',
    variant: 'columns-4',
    columns: [
      { title: 'Cabinetul', type: 'text' },
      { title: 'Servicii', type: 'links', links: [
        { label: 'Drept Civil', type: 'custom', url: '/servicii#civil' },
        { label: 'Drept Comercial', type: 'custom', url: '/servicii#comercial' },
        { label: 'Dreptul Familiei', type: 'custom', url: '/servicii#familie' },
        { label: 'Drept Penal', type: 'custom', url: '/servicii#penal' },
      ]},
      { title: 'Program', type: 'schedule' },
      { title: 'Contact', type: 'contact' },
    ],
  })

  console.log('\n⚖️ Creating services...')
  const createdServices = await seedServices(payload, avocatData.services)

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
  const teamWithImages = avocatData.team.map((member) => ({
    ...member,
    imageId: getImageId(avocatImages.team[member.imageIndex]?.filename),
  }))
  await seedTeam(payload, teamWithImages)

  console.log('\n⭐ Creating testimonials...')
  await seedTestimonials(payload, avocatData.testimonials)

  console.log('\n❓ Creating FAQ...')
  await seedFAQ(payload, avocatData.faq)

  console.log('\n🖼️ Creating gallery items...')
  const portfolioItems = avocatImages.gallery.map((img, index) => ({
    title: `Cabinet ${index + 1}`,
    description: img.alt,
    imageId: getImageId(img.filename) || '',
    featured: index < 4,
    order: index + 1,
  }))
  await seedPortfolio(payload, portfolioItems)

  console.log('\n🏠 Creating homepage...')
  const homepageLayout = buildHomepageLayout(variant, {
    galleryImages: avocatImages.gallery,
    getImageId,
  })
  const overlaySettings = getHeroOverlaySettings(variant)

  // Build hero data using helper (supports carousel/slider/split)
  // Extract years from stats (e.g. "20+" -> 20)
  const yearsStatValue = avocatData.business.stats?.find((s) => s.label.toLowerCase().includes('ani'))?.value
  const yearsExperience = yearsStatValue ? parseInt(yearsStatValue.replace(/\D/g, ''), 10) : 20

  const heroData = buildHeroData(
    variant.hero.type,
    {
      headline: avocatData.hero.headline,
      subheadline: avocatData.hero.subheadline,
      ctaButtons: avocatData.hero.ctaButtons,
    },
    overlaySettings,
    {
      heroImages: avocatImages.hero,
      galleryImages: avocatImages.gallery,
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
  if (avocatData.posts) {
    await seedPosts(payload, avocatData.posts)
  }

  // Sample newsletter subscribers for demo
  console.log('\n📧 Creating sample newsletter subscribers...')
  await seedNewsletterSubscribers(payload, [
    { email: 'client.juridic1@mailinator.com', source: 'website' },
    { email: 'client.juridic2@mailinator.com', source: 'footer' },
    { email: 'client.juridic3@mailinator.com', source: 'popup' },
  ])

  // Note: Design variant global has been replaced by unified SiteTheme system
  // Theme is now configured at the start of seeding via seedSiteTheme()

  console.log('\n' + '━'.repeat(50))
  console.log('✅ Avocat seeding complete!')
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
    galleryImages: typeof avocatImages.gallery
    getImageId: (filename: string) => string | undefined
  }
) {
  const sectionConfigs: Record<string, BlockConfig> = {
    // NEW: Trust Badges - law firm credibility (minimal variant - formal)
    trustBadges: {
      blockType: 'trust-badges',
      variant: 'minimal',
      source: 'preset',
      presets: ['experience-years', 'happy-customers', 'free-consultation', 'quality'],
      customValues: {
        experienceYears: 25,
        happyCustomersCount: '2000+',
      },
      showDescriptions: false,
      iconSize: 'small',
      backgroundColor: 'transparent',
    },
    // NEW: How It Works - legal process (timeline variant - formal, step by step)
    howItWorks: {
      blockType: 'how-it-works',
      variant: 'timeline',
      heading: 'Procesul de Colaborare',
      subheading: 'Pasi clari pentru rezolvarea cazului tau',
      steps: [
        {
          title: 'Consultatie Initiala',
          description: 'Programeaza o intalnire gratuita pentru evaluarea cazului tau',
          icon: 'Phone',
        },
        {
          title: 'Analiza Juridica',
          description: 'Studiem documentele si identificam solutiile legale optime',
          icon: 'FileText',
        },
        {
          title: 'Strategie si Contract',
          description: 'Stabilim strategia de actiune si semnam contractul de asistenta',
          icon: 'ClipboardCheck',
        },
        {
          title: 'Reprezentare si Rezolvare',
          description: 'Te reprezentam in instanta sau negociem pentru rezolvarea amiabila',
          icon: 'CheckCircle',
        },
      ],
      showNumbers: true,
      ctaButton: {
        show: true,
        label: 'Solicita Consultatie Gratuita',
        link: '/contact',
      },
      backgroundColor: 'light',
    },
    // NEW: Opening Hours - program cabinet avocat
    openingHours: {
      blockType: 'openingHours',
      variant: 'with-cta',
      heading: 'Program Consultații',
      subheading: 'Programează o întâlnire pentru a discuta cazul tău',
      source: 'businessInfo',
      showCurrentStatus: true,
      ctaButton: {
        show: true,
        label: 'Solicită Consultație',
        link: '/contact',
      },
      backgroundColor: 'default',
    },
    // NEW: Locations - sediu cabinet
    locations: {
      blockType: 'locations',
      variant: 'cards',
      heading: 'Sediul Cabinetului',
      subheading: 'Te așteptăm pentru consultații',
      locations: [
        {
          name: 'Cabinet Avocat Ionescu',
          address: 'Bulevardul Decebal 78, București',
          phone: '0722 999 000',
        },
      ],
    },
    // NEW: Brand Logos - asociatii profesionale
    brandLogos: {
      blockType: 'brandLogos',
      variant: 'row',
      heading: 'Membru în',
      subheading: 'Asociații și organizații profesionale',
      source: 'custom',
      logos: [],
      grayscale: true,
      logoSize: 'medium',
      backgroundColor: 'default',
    },
    // NEW: Timeline - cariera si experienta
    timeline: {
      blockType: 'timeline',
      variant: 'vertical-alternating',
      heading: 'Experiență și Recunoaștere',
      subheading: '25 de ani de practică juridică de succes',
      events: [
        {
          year: '1999',
          title: 'Admitere în Barou',
          description: 'Am obținut licența de avocat și am început practica individuală',
          icon: 'scale',
        },
        {
          year: '2008',
          title: 'Parteneriat',
          description: 'Am format un parteneriat cu specialiști în diverse ramuri ale dreptului',
          icon: 'Users',
        },
        {
          year: '2015',
          title: 'Cazuri de Referință',
          description: 'Am câștigat cazuri importante cu impact în jurisprudența românească',
          icon: 'Award',
        },
        {
          year: '2024',
          title: 'Prezent',
          description: 'Peste 2000 de clienți reprezentați cu succes în instanță',
          icon: 'Star',
        },
      ],
      showConnector: true,
      backgroundColor: 'light',
    },
    // NEW: Announcement Bar - consultatie gratuita
    announcementBar: {
      blockType: 'announcementBar',
      variant: 'with-button',
      messages: [
        {
          text: 'Prima consultație juridică este GRATUITĂ',
          link: '/contact',
        },
      ],
      ctaButton: {
        show: true,
        label: 'Solicită Consultație Gratuită',
        link: '/contact',
      },
      backgroundColor: 'primary',
    },
    services: {
      blockType: 'services',
      variant: variant.layout.servicesVariant,
      heading: 'Domenii de Practica',
      subheading: 'Consultanta juridica in toate domeniile dreptului',
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
      heading: 'Echipa de Avocati',
      subheading: 'Profesionisti dedicati drepturilor tale',
      source: 'collection',
      onlyFeatured: true,
      limit: 4,
      backgroundColor: 'default',
    },
    testimonials: {
      blockType: 'testimonials',
      variant: variant.layout.testimonialsVariant,
      heading: 'Ce Spun Clientii',
      subheading: 'Rezultate si satisfactie',
      source: 'collection',
      onlyFeatured: true,
      showRating: true,
      backgroundColor: 'light',
    },
    gallery: {
      blockType: 'gallery',
      variant: variant.layout.galleryVariant,
      heading: 'Cabinetul Nostru',
      subheading: 'Un spatiu profesional pentru consultari',
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
      subheading: 'Informatii utile pentru clienti',
      source: 'collection',
      limit: 10,
      defaultOpen: 'first',
      backgroundColor: 'default',
    },
    latestPosts: {
      blockType: 'latestPosts',
      variant: 'grid-3',
      heading: 'Din Blogul Nostru',
      subheading: 'Articole juridice si informatii legale utile',
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
      headline: 'Ai Nevoie de Consultanta Juridica?',
      subheadline: 'Contacteaza-ne pentru o evaluare gratuita a cazului tau',
      buttons: [{ label: 'Solicita Consultatie', link: '/contact', variant: 'default' }],
      backgroundColor: 'dark',
    },
  }
  return variant.layout.sections.map((s) => sectionConfigs[s]).filter(Boolean)
}

async function createAdditionalPages(payload: Payload, variant: DesignVariant, formsMap: Map<string, string>) {
  const contactFormId = formsMap.get('Formular de contact')

  await createSeederPage(payload, {
    title: 'Servicii',
    slug: 'servicii',
    heroType: 'minimal',
    hero: { headline: 'Domenii de Practica', subheadline: 'Servicii juridice complete' },
    layout: [
      { blockType: 'services', variant: variant.layout.servicesVariant, heading: 'Toate Serviciile', limit: 20, showPrices: true, showIcons: true, backgroundColor: 'default' },
      { blockType: 'cta', variant: 'centered', headline: 'Ai nevoie de ajutor juridic?', buttons: [{ label: 'Contacteaza-ne', link: '/contact', variant: 'default' }], backgroundColor: 'light' },
    ],
    // _status removed for multi-tenant
  })
  console.log('   Created Services page')

  await createSeederPage(payload, {
    title: 'Echipa',
    slug: 'echipa',
    heroType: 'minimal',
    hero: { headline: 'Echipa de Avocati', subheadline: 'Profesionisti cu experienta' },
    layout: [
      { blockType: 'team', variant: variant.layout.teamVariant, heading: 'Avocatii Nostri', limit: 20, backgroundColor: 'default' },
    ],
    // _status removed for multi-tenant
  })
  console.log('   Created Team page')

  await createSeederPage(payload, {
    title: 'Cazuri',
    slug: 'cazuri',
    heroType: 'minimal',
    hero: { headline: 'Cazuri Reprezentative', subheadline: 'Experiente si rezultate din practica noastra' },
    layout: [
      { blockType: 'gallery', variant: variant.layout.galleryVariant, heading: 'Domenii de Activitate', subheading: 'Cazuri rezolvate cu succes in diverse domenii juridice', limit: 20, backgroundColor: 'default' },
      { blockType: 'testimonials', variant: variant.layout.testimonialsVariant, heading: 'Feedback Clienti', subheading: 'Ce spun clientii despre colaborarea cu noi', backgroundColor: 'light' },
      { blockType: 'cta', variant: 'centered', headline: 'Ai un caz similar?', subheadline: 'Contacteaza-ne pentru o evaluare gratuita', buttons: [{ label: 'Solicita Consultatie', link: '/contact', variant: 'default' }], backgroundColor: 'dark' },
    ],
    // _status removed for multi-tenant
  })
  console.log('   Created Cases page')

  await createSeederPage(payload, {
    title: 'Contact',
    slug: 'contact',
    heroType: 'minimal',
    hero: { headline: 'Contact', subheadline: 'Programeaza o consultatie' },
    layout: createContactPageLayout(contactFormId) as FlexibleLayout,
    // _status removed for multi-tenant
  })
  console.log('   Created Contact page')
}
