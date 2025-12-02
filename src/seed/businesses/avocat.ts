// @ts-nocheck
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
import { avocatImages, avocatData } from '../seed-data'
import { getVariant, type DesignVariant } from '../design-variants'

const VARIANT_INDEX = parseInt(process.env.DESIGN_VARIANT || '0', 10)

export async function seedAvocat(payload: Payload) {
  const variant = getVariant('avocat', VARIANT_INDEX)

  console.log('\n📍 Seeding: Cabinet Avocat / Law Office')
  console.log(`🎨 Design Variant: ${variant.name} (${variant.id})`)
  console.log(`   ${variant.description}`)
  console.log('━'.repeat(50))

  await createAdminUser(payload)

  console.log('\n📸 Uploading images from local files...')
  const allImages = [...avocatImages.hero, ...avocatImages.team, ...avocatImages.gallery]
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
    googleMapsEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8!2d26.09!3d44.43!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
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
  await seedServices(payload, avocatData.services)

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
  const heroImageId = getImageId(avocatImages.hero[0]?.filename)
  const homepageLayout = buildHomepageLayout(variant)

  await seedHomePage(payload, {
    heroType: variant.hero.type,
    hero: {
      headline: avocatData.hero.headline,
      subheadline: avocatData.hero.subheadline,
      ctaButtons: avocatData.hero.ctaButtons,
      imageId: heroImageId,
    },
    layout: homepageLayout,
  })

  console.log('\n📄 Creating additional pages...')
  await createAdditionalPages(payload, variant)

  // Create blog posts
  console.log('\n📝 Creating blog posts...')
  if (avocatData.posts) {
    await seedPosts(payload, avocatData.posts)
  }

  // Set design variant global
  console.log('\n🎨 Setting design variant global...')
  await seedDesignVariant(payload, {
    businessType: 'avocat',
    variantIndex: VARIANT_INDEX,
    variantName: variant.name,
    variantDescription: variant.description,
  })

  console.log('\n' + '━'.repeat(50))
  console.log('✅ Avocat seeding complete!')
  console.log(`🎨 Applied variant: ${variant.name}`)
  console.log('━'.repeat(50))
}

function buildHomepageLayout(variant: DesignVariant) {
  const sectionConfigs: Record<string, any> = {
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
      source: 'portfolio',
      limit: 6,
      lightbox: true,
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

async function createAdditionalPages(payload: Payload, variant: DesignVariant) {
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Servicii',
      slug: 'servicii',
      heroType: 'centered',
      hero: { headline: 'Domenii de Practica', subheadline: 'Servicii juridice complete' },
      layout: [
        { blockType: 'services', variant: variant.layout.servicesVariant, heading: 'Toate Serviciile', source: 'collection', limit: 20, showPrices: true, showIcons: true, backgroundColor: 'default' },
        { blockType: 'cta', variant: 'centered', headline: 'Ai nevoie de ajutor juridic?', buttons: [{ label: 'Contacteaza-ne', link: '/contact', variant: 'default' }], backgroundColor: 'light' },
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
      hero: { headline: 'Echipa de Avocati', subheadline: 'Profesionisti cu experienta' },
      layout: [
        { blockType: 'team', variant: variant.layout.teamVariant, heading: 'Avocatii Nostri', source: 'collection', limit: 20, showRole: true, showBio: true, backgroundColor: 'default' },
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
      heroType: 'centered',
      hero: { headline: 'Contact', subheadline: 'Programeaza o consultatie' },
      layout: [
        { blockType: 'contact', variant: 'split', heading: 'Contacteaza-ne', showForm: true, formFields: { showName: true, showEmail: true, showPhone: true, showSubject: true, showMessage: true }, showContactInfo: true, showMap: true, mapPosition: 'bottom', backgroundColor: 'light' },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Contact page')
}
