import type { Payload } from 'payload'
import {
  createAdminUser,
  seedTheme,
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
  seedDesignVariant,
  seedPosts,
} from '../helpers'
import { autoServiceImages, autoServiceData } from '../seed-data'
import { getVariant, type DesignVariant } from '../design-variants'

const VARIANT_INDEX = parseInt(process.env.DESIGN_VARIANT || '0', 10)

export async function seedAutoService(payload: Payload) {
  const variant = getVariant('auto-service', VARIANT_INDEX)

  console.log('\n📍 Seeding: Service Auto / Auto Service')
  console.log(`🎨 Design Variant: ${variant.name} (${variant.id})`)
  console.log(`   ${variant.description}`)
  console.log('━'.repeat(50))

  await createAdminUser(payload)

  console.log('\n📸 Uploading images from local files...')
  const allImages = [...autoServiceImages.hero, ...autoServiceImages.team, ...autoServiceImages.gallery]
  const imageMap = await uploadLocalSeedImages(payload, allImages)

  const getImageId = (filename: string): string | undefined => imageMap.get(filename) || undefined

  console.log('\n🎨 Configuring theme...')
  await seedTheme(payload, {
    preset: variant.theme.preset,
    colors: variant.theme.colors,
    fontPreset: variant.theme.fontPreset,
    stylePreset: variant.theme.stylePreset,
    borderRadius: variant.theme.borderRadius,
    shadows: variant.theme.shadows,
    sectionSpacing: 'normal',
  })

  console.log('\n🏪 Setting up business info...')
  await seedBusinessInfo(payload, {
    name: autoServiceData.business.name,
    tagline: autoServiceData.business.tagline,
    description: autoServiceData.business.description,
    yearEstablished: autoServiceData.business.yearEstablished,
    phone: autoServiceData.business.phone,
    email: autoServiceData.business.email,
    whatsapp: autoServiceData.business.whatsapp,
    address: autoServiceData.business.address,
    workingHours: autoServiceData.business.workingHours,
    social: autoServiceData.business.social,
    stats: autoServiceData.business.stats,
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8!2d26.09!3d44.43!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
  })

  console.log('\n🏷️ Setting up logo...')
  await seedLogo(payload, { type: 'text', text: 'AutoPro' })

  console.log('\n📋 Setting up header navigation...')
  await seedHeader(payload, {
    variant: 'standard',
    navItems: autoServiceData.navigation,
    ctaButton: { enabled: true, label: 'Programeaza-te', link: '/programare', variant: 'default' },
  })

  console.log('\n📋 Setting up footer...')
  await seedFooter(payload, {
    variant: 'columns-4',
    columns: [
      { title: 'Service Auto', type: 'text' },
      { title: 'Servicii', type: 'links', links: [
        { label: 'Diagnoza', type: 'custom', url: '/servicii#diagnoza' },
        { label: 'Frane', type: 'custom', url: '/servicii#frane' },
        { label: 'Vulcanizare', type: 'custom', url: '/servicii#vulcanizare' },
        { label: 'ITP', type: 'custom', url: '/servicii#itp' },
      ]},
      { title: 'Program', type: 'schedule' },
      { title: 'Contact', type: 'contact' },
    ],
  })

  console.log('\n🔧 Creating services...')
  await seedServices(payload, autoServiceData.services)

  console.log('\n👥 Creating team members...')
  const teamWithImages = autoServiceData.team.map((member) => ({
    ...member,
    imageId: getImageId(autoServiceImages.team[member.imageIndex]?.filename),
  }))
  await seedTeam(payload, teamWithImages)

  console.log('\n⭐ Creating testimonials...')
  await seedTestimonials(payload, autoServiceData.testimonials)

  console.log('\n❓ Creating FAQ...')
  await seedFAQ(payload, autoServiceData.faq)

  console.log('\n🖼️ Creating gallery items...')
  const portfolioItems = autoServiceImages.gallery.map((img, index) => ({
    title: `Service ${index + 1}`,
    description: img.alt,
    imageId: getImageId(img.filename) || '',
    featured: index < 4,
    order: index + 1,
  }))
  await seedPortfolio(payload, portfolioItems)

  console.log('\n🏠 Creating homepage...')
  const heroImageId = getImageId(autoServiceImages.hero[0]?.filename)
  const homepageLayout = buildHomepageLayout(variant)

  await seedHomePage(payload, {
    heroType: variant.hero.type,
    hero: {
      headline: autoServiceData.hero.headline,
      subheadline: autoServiceData.hero.subheadline,
      ctaButtons: autoServiceData.hero.ctaButtons,
      imageId: heroImageId,
    },
    layout: homepageLayout,
  })

  console.log('\n📄 Creating additional pages...')
  await createAdditionalPages(payload, variant)

  // Create blog posts
  console.log('\n📝 Creating blog posts...')
  if (autoServiceData.posts) {
    await seedPosts(payload, autoServiceData.posts)
  }

  // Set design variant global
  console.log('\n🎨 Setting design variant global...')
  await seedDesignVariant(payload, {
    businessType: 'auto-service',
    variantIndex: VARIANT_INDEX,
    variantName: variant.name,
    variantDescription: variant.description,
  })

  console.log('\n' + '━'.repeat(50))
  console.log('✅ Auto Service seeding complete!')
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
      subheading: 'Reparatii complete pentru toate tipurile de masini',
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
      heading: 'Echipa de Mecanici',
      subheading: 'Profesionisti cu experienta si dedicare',
      source: 'collection',
      onlyFeatured: true,
      limit: 4,
      backgroundColor: 'default',
    },
    testimonials: {
      blockType: 'testimonials',
      variant: variant.layout.testimonialsVariant,
      heading: 'Parerea Clientilor',
      subheading: 'Ce spun clientii despre noi',
      source: 'collection',
      onlyFeatured: true,
      showRating: true,
      backgroundColor: 'light',
    },
    gallery: {
      blockType: 'gallery',
      variant: variant.layout.galleryVariant,
      heading: 'Galeria Noastra',
      subheading: 'Echipamente si spatii moderne',
      source: 'portfolio',
      limit: 6,
      
      backgroundColor: 'default',
    },
    faq: {
      blockType: 'faq',
      variant: 'accordion',
      heading: 'Intrebari Frecvente',
      subheading: 'Raspunsuri la cele mai comune intrebari',
      source: 'collection',
      limit: 10,
      defaultOpen: 'first',
      backgroundColor: 'default',
    },
    cta: {
      blockType: 'cta',
      variant: 'centered',
      headline: 'Ai Nevoie de Service Auto?',
      subheadline: 'Programeaza-te online sau suna-ne pentru o consultatie',
      buttons: [{ label: 'Programeaza Online', link: '/programare', variant: 'default' }],
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
      hero: { headline: 'Servicii Auto Complete', subheadline: 'De la revizie la reparatii majore' },
      layout: [
        { blockType: 'services', variant: variant.layout.servicesVariant, heading: 'Lista Servicii', source: 'collection', limit: 20, showPrices: true, showIcons: true, backgroundColor: 'default' },
        { blockType: 'cta', variant: 'centered', headline: 'Ai nevoie de ajutor?', subheadline: 'Programeaza-te acum', buttons: [{ label: 'Programeaza-te', link: '/programare', variant: 'default' }], backgroundColor: 'light' },
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
      hero: { headline: 'Echipa Noastra', subheadline: 'Mecanici profesionisti' },
      layout: [
        { blockType: 'team', variant: variant.layout.teamVariant, heading: 'Mecanicii Nostri', source: 'collection', limit: 20, showRole: true, showBio: true, backgroundColor: 'default' },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Team page')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Programare',
      slug: 'programare',
      heroType: 'centered',
      hero: { headline: 'Programeaza-te Online', subheadline: 'Completeaza formularul' },
      layout: [
        { blockType: 'booking', variant: 'full', heading: 'Cerere Programare', showServiceSelection: true, showTeamSelection: false, showDatePicker: true, showTimePicker: true, submitButtonText: 'Trimite', successMessage: 'Te vom contacta pentru confirmare.', backgroundColor: 'light' },
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
      hero: { headline: 'Contact', subheadline: 'Suntem aici sa te ajutam' },
      layout: [
        { blockType: 'contact', variant: 'split', heading: 'Contacteaza-ne', showForm: true, showContactInfo: true, showMap: true, mapPosition: 'bottom', backgroundColor: 'light' },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Contact page')
}
