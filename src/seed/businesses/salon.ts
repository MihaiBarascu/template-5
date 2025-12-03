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
} from '../helpers'
import { salonImages, salonData } from '../seed-data'
import { getVariant, type DesignVariant } from '../design-variants'

const VARIANT_INDEX = parseInt(process.env.DESIGN_VARIANT || '0', 10)

export async function seedSalon(payload: Payload) {
  const variant = getVariant('salon', VARIANT_INDEX)

  console.log('\n📍 Seeding: Salon Infrumusetare / Beauty Salon')
  console.log(`🎨 Design Variant: ${variant.name} (${variant.id})`)
  console.log(`   ${variant.description}`)
  console.log('━'.repeat(50))

  await createAdminUser(payload)

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
    sectionSpacing: 'normal',
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
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8!2d26.09!3d44.43!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
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
  })

  console.log('\n💅 Creating services...')
  await seedServices(payload, salonData.services)

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
  const heroImageId = getImageId(salonImages.hero[0]?.filename)
  const homepageLayout = buildHomepageLayout(variant)

  await seedHomePage(payload, {
    heroType: variant.hero.type,
    hero: {
      headline: salonData.hero.headline,
      subheadline: salonData.hero.subheadline,
      ctaButtons: salonData.hero.ctaButtons,
      imageId: heroImageId,
    },
    layout: homepageLayout,
  })

  console.log('\n📄 Creating additional pages...')
  await createAdditionalPages(payload, variant)

  // Create blog posts
  console.log('\n📝 Creating blog posts...')
  if (salonData.posts) {
    await seedPosts(payload, salonData.posts)
  }

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
  [key: string]: unknown
}

function buildHomepageLayout(variant: DesignVariant) {
  const sectionConfigs: Record<string, BlockConfig> = {
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
      source: 'portfolio',
      limit: 6,
      
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

async function createAdditionalPages(payload: Payload, variant: DesignVariant) {
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Servicii',
      slug: 'servicii',
      heroType: 'centered',
      hero: { headline: 'Serviciile Noastre', subheadline: 'Servicii complete de infrumusetare' },
      layout: [
        { blockType: 'services', variant: variant.layout.servicesVariant, heading: 'Toate Serviciile', source: 'collection', limit: 20, showPrices: true, showIcons: true, backgroundColor: 'default' },
        { blockType: 'cta', variant: 'centered', headline: 'Programeaza-te', buttons: [{ label: 'Programeaza-te', link: '/programare', variant: 'default' }], backgroundColor: 'light' },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Services page')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Echipa',
      slug: 'echipa',
      heroType: 'centered',
      hero: { headline: 'Echipa Noastra', subheadline: 'Specialistele noastre' },
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
      title: 'Galerie',
      slug: 'galerie',
      heroType: 'centered',
      hero: { headline: 'Galerie', subheadline: 'Lucrarile noastre' },
      layout: [
        { blockType: 'gallery', variant: variant.layout.galleryVariant, heading: 'Galerie', source: 'portfolio', limit: 20,  backgroundColor: 'default' },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Gallery page')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Programare',
      slug: 'programare',
      heroType: 'centered',
      hero: { headline: 'Programeaza-te Online', subheadline: 'Alege serviciul si specialista preferata' },
      layout: [
        { blockType: 'booking', variant: 'full', heading: 'Cerere Programare', showServiceSelection: true, showTeamSelection: true, showDatePicker: true, showTimePicker: true, submitButtonText: 'Trimite Cererea', successMessage: 'Te vom contacta pentru confirmare.', backgroundColor: 'light' },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Booking page')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact',
      slug: 'contact',
      heroType: 'centered',
      hero: { headline: 'Contact', subheadline: 'Suntem aici pentru tine' },
      layout: [
        { blockType: 'contact', variant: 'split', heading: 'Contacteaza-ne', showForm: true, showContactInfo: true, showMap: true, mapPosition: 'bottom', backgroundColor: 'light' },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Contact page')
}
