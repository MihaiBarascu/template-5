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
import { constructiiImages, constructiiData } from '../seed-data'
import { getVariant, type DesignVariant } from '../design-variants'

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

  await seedHomePage(payload, {
    heroType: variant.hero.type,
    hero: {
      headline: constructiiData.hero.headline,
      subheadline: constructiiData.hero.subheadline,
      ctaButtons: constructiiData.hero.ctaButtons,
      imageId: heroImageId,
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

  // Set design variant global
  console.log('\n🎨 Setting design variant global...')
  await seedDesignVariant(payload, {
    businessType: 'constructii',
    variantIndex: VARIANT_INDEX,
    variantName: variant.name,
    variantDescription: variant.description,
  })

  console.log('\n' + '━'.repeat(50))
  console.log('✅ Constructii seeding complete!')
  console.log(`🎨 Applied variant: ${variant.name}`)
  console.log('━'.repeat(50))
}

function buildHomepageLayout(variant: DesignVariant) {
  const sectionConfigs: Record<string, any> = {
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
      lightbox: true,
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
      heroType: 'centered',
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
      heroType: 'centered',
      hero: { headline: 'Portofoliu', subheadline: 'Proiecte realizate' },
      layout: [
        { blockType: 'gallery', variant: variant.layout.galleryVariant, heading: 'Proiectele Noastre', source: 'portfolio', limit: 20, lightbox: true, backgroundColor: 'default' },
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
      heroType: 'centered',
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
      heroType: 'centered',
      hero: { headline: 'Contact', subheadline: 'Cere o oferta gratuita' },
      layout: [
        { blockType: 'contact', variant: 'split', heading: 'Contacteaza-ne', showForm: true, formFields: { showName: true, showEmail: true, showPhone: true, showSubject: true, showMessage: true }, showContactInfo: true, showMap: true, mapPosition: 'bottom', backgroundColor: 'light' },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Contact page')
}
