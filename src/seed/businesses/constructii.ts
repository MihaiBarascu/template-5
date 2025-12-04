import type { Payload } from 'payload'
import {
  createAdminUser,
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
} from '../helpers'
import { constructiiImages, constructiiData } from '../seed-data'
import { getVariant, getHeroOverlaySettings, type DesignVariant } from '../design-variants'

const VARIANT_INDEX = parseInt(process.env.DESIGN_VARIANT || '0', 10)

export async function seedConstructii(payload: Payload) {
  const variant = getVariant('constructii', VARIANT_INDEX)

  console.log('\n📍 Seeding: Constructii / Construction')
  console.log(`🎨 Design Variant: ${variant.name} (${variant.id})`)
  console.log(`   ${variant.description}`)
  console.log('━'.repeat(50))

  await createAdminUser(payload)

  console.log('\n📸 Uploading images from local files...')
  const allImages = [...constructiiImages.hero, ...constructiiImages.team, ...constructiiImages.gallery]
  const imageMap = await uploadLocalSeedImages(payload, allImages)

  const getImageId = (filename: string): string | undefined => imageMap.get(filename) || undefined

  // Configure theme - use universal variant based on business style
  // Construction typically uses warm-orange (strong, reliable) or modern-red (bold, powerful)
  console.log('\n🎨 Configuring site theme...')
  await seedSiteTheme(payload, {
    variant: 'warm-orange', // Best for construction - strong, reliable, professional
    borderRadius: variant.theme.borderRadius,
    shadows: variant.theme.shadows,
    sectionSpacing: 'normal',
  })

  console.log('\n🏪 Setting up business info...')
  await seedBusinessInfo(payload, {
    name: constructiiData.business.name,
    tagline: constructiiData.business.tagline,
    description: constructiiData.business.description,
    yearEstablished: constructiiData.business.yearEstablished,
    phone: constructiiData.business.phone,
    email: constructiiData.business.email,
    whatsapp: constructiiData.business.whatsapp,
    address: constructiiData.business.address,
    workingHours: constructiiData.business.workingHours,
    social: constructiiData.business.social,
    stats: constructiiData.business.stats,
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8!2d26.09!3d44.43!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
  })

  console.log('\n🏷️ Setting up logo...')
  await seedLogo(payload, { type: 'text', text: 'BuildPro' })

  console.log('\n📋 Setting up header navigation...')
  await seedHeader(payload, {
    variant: 'standard',
    navItems: constructiiData.navigation,
    ctaButton: { enabled: true, label: 'Cere Oferta', link: '/contact', variant: 'default' },
  })

  console.log('\n📋 Setting up footer...')
  await seedFooter(payload, {
    variant: 'columns-4',
    columns: [
      { title: 'Firma', type: 'text' },
      { title: 'Servicii', type: 'links', links: [
        { label: 'Constructii', type: 'custom', url: '/servicii#constructii' },
        { label: 'Renovari', type: 'custom', url: '/servicii#renovari' },
        { label: 'Instalatii', type: 'custom', url: '/servicii#instalatii' },
        { label: 'Acoperisuri', type: 'custom', url: '/servicii#acoperisuri' },
      ]},
      { title: 'Program', type: 'schedule' },
      { title: 'Contact', type: 'contact' },
    ],
  })

  console.log('\n🏗️ Creating services...')
  await seedServices(payload, constructiiData.services)

  console.log('\n👥 Creating team members...')
  const teamWithImages = constructiiData.team.map((member) => ({
    ...member,
    imageId: getImageId(constructiiImages.team[member.imageIndex]?.filename),
  }))
  await seedTeam(payload, teamWithImages)

  console.log('\n⭐ Creating testimonials...')
  await seedTestimonials(payload, constructiiData.testimonials)

  console.log('\n❓ Creating FAQ...')
  await seedFAQ(payload, constructiiData.faq)

  console.log('\n🖼️ Creating gallery items...')
  const portfolioItems = constructiiImages.gallery.map((img, index) => ({
    title: `Proiect ${index + 1}`,
    description: img.alt,
    imageId: getImageId(img.filename) || '',
    featured: index < 4,
    order: index + 1,
  }))
  await seedPortfolio(payload, portfolioItems)

  console.log('\n🏠 Creating homepage...')
  const heroImageId = getImageId(constructiiImages.hero[0]?.filename)
  const homepageLayout = buildHomepageLayout(variant)

  const overlaySettings = getHeroOverlaySettings(variant)
  await seedHomePage(payload, {
    heroType: variant.hero.type,
    hero: {
      headline: constructiiData.hero.headline,
      subheadline: constructiiData.hero.subheadline,
      ctaButtons: constructiiData.hero.ctaButtons,
      imageId: heroImageId,
      ...overlaySettings,
    },
    layout: homepageLayout,
  })

  console.log('\n📄 Creating additional pages...')
  await createAdditionalPages(payload, variant)

  // Create blog posts
  console.log('\n📝 Creating blog posts...')
  if (constructiiData.posts) {
    await seedPosts(payload, constructiiData.posts)
  }

  // Sample newsletter subscribers for demo
  console.log('\n📧 Creating sample newsletter subscribers...')
  await seedNewsletterSubscribers(payload, [
    { email: 'constructor1@mailinator.com', source: 'website' },
    { email: 'constructor2@mailinator.com', source: 'footer' },
    { email: 'constructor3@mailinator.com', source: 'popup' },
  ])

  // Note: Design variant global has been replaced by unified SiteTheme system
  // Theme is now configured at the start of seeding via seedSiteTheme()

  console.log('\n' + '━'.repeat(50))
  console.log('✅ Constructii seeding complete!')
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

function buildHomepageLayout(variant: DesignVariant) {
  const sectionConfigs: Record<string, BlockConfig> = {
    // NEW: Trust Badges - construction credibility (bar variant - professional)
    trustBadges: {
      blockType: 'trust-badges',
      variant: 'bar',
      source: 'preset',
      presets: ['warranty', 'experience-years', 'happy-customers', 'quality'],
      customValues: {
        experienceYears: 15,
        happyCustomersCount: '500+',
        warrantyPeriod: '10 ani garantie lucrari',
      },
      showDescriptions: true,
      iconSize: 'medium',
      backgroundColor: 'primary',
    },
    // NEW: How It Works - construction process (connected variant - project flow)
    howItWorks: {
      blockType: 'how-it-works',
      variant: 'connected',
      heading: 'Etapele Proiectului',
      subheading: 'Procesul nostru transparent de lucru',
      steps: [
        {
          title: 'Consultatie si Evaluare',
          description: 'Vizita la locatie, masuratori si discutie despre nevoi',
          icon: 'ClipboardCheck',
        },
        {
          title: 'Proiect si Oferta',
          description: 'Proiect tehnic detaliat cu materiale si costuri',
          icon: 'FileText',
        },
        {
          title: 'Executie Profesionala',
          description: 'Echipa experimentata cu materiale de calitate',
          icon: 'Settings',
        },
        {
          title: 'Receptie si Garantie',
          description: 'Verificare finala si garantie scrisa pe lucrari',
          icon: 'CheckCircle',
        },
      ],
      showNumbers: true,
      ctaButton: {
        show: true,
        label: 'Cere Oferta Gratuita',
        link: '/contact',
      },
      backgroundColor: 'light',
    },
    // NEW: Logo Cloud - certifications and partners
    logoCloud: {
      blockType: 'logo-cloud',
      variant: 'grayscale',
      heading: 'Certificari si Parteneriate',
      subheading: 'Lucram doar cu materiale de calitate',
      logos: [],
      logoSize: 'medium',
      columns: '5',
      grayscale: true,
      backgroundColor: 'default',
    },
    // NEW: Opening Hours - program firma constructii
    openingHours: {
      blockType: 'openingHours',
      variant: 'inline',
      heading: 'Program de Lucru',
      subheading: 'Contactează-ne pentru evaluări și oferte',
      source: 'businessInfo',
      showCurrentStatus: true,
      backgroundColor: 'default',
    },
    // NEW: Locations - sediu firma + santiere
    locations: {
      blockType: 'locations',
      variant: 'cards',
      heading: 'Sediul și Aria de Acoperire',
      subheading: 'Executăm lucrări în București și împrejurimi',
      locations: [
        {
          name: 'BuildPro - Sediu Central',
          address: 'Strada Constructorilor 100',
          city: 'București',
          phone: '0722 111 333',
          email: 'office@buildpro.ro',
          schedule: [
            { days: 'Luni - Vineri', hours: '07:00 - 17:00' },
            { days: 'Sâmbătă', hours: '08:00 - 13:00' },
            { days: 'Duminică', hours: 'Închis' },
          ],
          rating: 4.9,
          ctaButton: {
            label: 'Cere Ofertă',
            link: '/contact',
          },
        },
      ],
      showRating: true,
      showSchedule: true,
      backgroundColor: 'light',
    },
    // NEW: Brand Logos - furnizori materiale
    brandLogos: {
      blockType: 'brandLogos',
      variant: 'sectioned',
      heading: 'Parteneri și Furnizori',
      subheading: 'Colaborăm cu cei mai buni furnizori de materiale',
      source: 'sections',
      sections: [
        {
          title: 'Materiale de Construcții',
          logos: [],
        },
        {
          title: 'Echipamente',
          logos: [],
        },
      ],
      grayscale: true,
      logoSize: 'medium',
      backgroundColor: 'default',
    },
    // NEW: Timeline - proiecte majore
    timeline: {
      blockType: 'timeline',
      variant: 'vertical',
      heading: '15 Ani de Construcții de Calitate',
      subheading: 'Proiecte și realizări',
      events: [
        {
          year: '2009',
          title: 'Înființare',
          description: 'Am început cu renovări de apartamente în București',
          icon: 'Building',
        },
        {
          year: '2013',
          title: 'Extindere',
          description: 'Am trecut la construcții rezidențiale complete',
          icon: 'Home',
        },
        {
          year: '2018',
          title: 'Proiecte Comerciale',
          description: 'Am finalizat primul proiect comercial major - 2000 mp',
          icon: 'Building2',
        },
        {
          year: '2024',
          title: 'Prezent',
          description: 'Peste 500 de proiecte finalizate cu garanție 10 ani',
          icon: 'Star',
        },
      ],
      showConnector: true,
      backgroundColor: 'light',
    },
    // NEW: Announcement Bar - oferta evaluare
    announcementBar: {
      blockType: 'announcementBar',
      variant: 'simple',
      messages: [
        {
          text: '📐 Evaluare GRATUITĂ la fața locului pentru orice proiect!',
          link: '/contact',
          linkText: 'Solicită evaluare',
        },
      ],
      icon: 'HardHat',
      backgroundColor: 'primary',
      position: 'top',
      sticky: false,
    },
    services: {
      blockType: 'services',
      variant: variant.layout.servicesVariant,
      heading: 'Serviciile Noastre',
      subheading: 'Constructii si renovari de calitate',
      source: 'collection',
      onlyFeatured: true,
      limit: 6,
      showPrices: true,
      showIcons: true,
      backgroundColor: 'light',
    },
    stats: {
      blockType: 'stats',
      variant: 'grid-4',
      source: 'businessInfo',
      backgroundColor: 'primary',
    },
    team: {
      blockType: 'team',
      variant: variant.layout.teamVariant,
      heading: 'Echipa Noastra',
      subheading: 'Profesionisti cu experienta',
      source: 'collection',
      onlyFeatured: true,
      limit: 4,
      backgroundColor: 'default',
    },
    testimonials: {
      blockType: 'testimonials',
      variant: variant.layout.testimonialsVariant,
      heading: 'Ce Spun Clientii',
      subheading: 'Proiecte finalizate cu succes',
      source: 'collection',
      onlyFeatured: true,
      showRating: true,
      backgroundColor: 'light',
    },
    gallery: {
      blockType: 'gallery',
      variant: variant.layout.galleryVariant,
      heading: 'Portofoliu',
      subheading: 'Proiecte realizate',
      source: 'portfolio',
      limit: 6,
      backgroundColor: 'default',
    },
    faq: {
      blockType: 'faq',
      variant: 'accordion',
      heading: 'Intrebari Frecvente',
      subheading: 'Informatii utile',
      source: 'collection',
      limit: 10,
      defaultOpen: 'first',
      backgroundColor: 'default',
    },
    latestPosts: {
      blockType: 'latestPosts',
      variant: 'grid-3',
      heading: 'Din Blogul Nostru',
      subheading: 'Sfaturi si tendinte in constructii si renovari',
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
      headline: 'Ai un Proiect in Minte?',
      subheadline: 'Contacteaza-ne pentru o evaluare gratuita',
      buttons: [{ label: 'Cere Oferta Gratuita', link: '/contact', variant: 'default' }],
      backgroundColor: 'dark',
    },
  }
  return variant.layout.sections.map((s) => sectionConfigs[s]).filter(Boolean)
}

async function createAdditionalPages(payload: Payload, variant: DesignVariant) {
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Servicii',
      slug: 'servicii',
      heroType: 'minimal',
      hero: { headline: 'Serviciile Noastre', subheadline: 'Constructii si renovari complete' },
      layout: [
        { blockType: 'services', variant: variant.layout.servicesVariant, heading: 'Toate Serviciile', source: 'collection', limit: 20, showPrices: true, showIcons: true, backgroundColor: 'default' },
        { blockType: 'cta', variant: 'centered', headline: 'Cere Oferta', buttons: [{ label: 'Contacteaza-ne', link: '/contact', variant: 'default' }], backgroundColor: 'light' },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Services page')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Portofoliu',
      slug: 'portofoliu',
      heroType: 'minimal',
      hero: { headline: 'Portofoliu', subheadline: 'Proiecte realizate' },
      layout: [
        { blockType: 'gallery', variant: variant.layout.galleryVariant, heading: 'Proiectele Noastre', source: 'portfolio', limit: 20,  backgroundColor: 'default' },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Portfolio page')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Echipa',
      slug: 'echipa',
      heroType: 'minimal',
      hero: { headline: 'Echipa Noastra', subheadline: 'Profesionisti cu experienta' },
      layout: [
        { blockType: 'team', variant: variant.layout.teamVariant, heading: 'Echipa', source: 'collection', limit: 20, showRole: true, showBio: true, backgroundColor: 'default' },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Team page')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact',
      slug: 'contact',
      heroType: 'minimal',
      hero: { headline: 'Contact', subheadline: 'Cere o oferta gratuita' },
      layout: [
        { blockType: 'contact', variant: 'split', heading: 'Contacteaza-ne', showForm: true, formFields: { showName: true, showEmail: true, showPhone: true, showSubject: true, showMessage: true }, showContactInfo: true, showMap: true, mapPosition: 'bottom', backgroundColor: 'light' },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Contact page')
}
