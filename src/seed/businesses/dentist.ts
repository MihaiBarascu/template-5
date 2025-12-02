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
import { dentistImages, dentistData } from '../seed-data'
import { getVariant, type DesignVariant } from '../design-variants'

// Get variant from environment or default to 0
const VARIANT_INDEX = parseInt(process.env.DESIGN_VARIANT || '0', 10)

export async function seedDentist(payload: Payload) {
  const variant = getVariant('dentist', VARIANT_INDEX)

  console.log('\n📍 Seeding: Cabinet Stomatologic / Dental Clinic')
  console.log(`🎨 Design Variant: ${variant.name} (${variant.id})`)
  console.log(`   ${variant.description}`)
  console.log('━'.repeat(50))

  // 1. Create admin user
  await createAdminUser(payload)

  // 2. Upload all images first
  console.log('\n📸 Uploading images from local files...')
  const allImages = [
    ...dentistImages.hero,
    ...dentistImages.team,
    ...dentistImages.gallery,
    ...dentistImages.services,
  ]
  const imageMap = await uploadLocalSeedImages(payload, allImages)

  // Helper to get image ID by filename
  const getImageId = (filename: string): string | undefined => {
    return imageMap.get(filename) || undefined
  }

  // 3. Configure theme based on variant
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

  // 4. Business info
  console.log('\n🏪 Setting up business info...')
  await seedBusinessInfo(payload, {
    name: dentistData.business.name,
    tagline: dentistData.business.tagline,
    description: dentistData.business.description,
    yearEstablished: dentistData.business.yearEstablished,
    phone: dentistData.business.phone,
    email: dentistData.business.email,
    whatsapp: dentistData.business.whatsapp,
    address: dentistData.business.address,
    workingHours: dentistData.business.workingHours,
    social: dentistData.business.social,
    stats: dentistData.business.stats,
    googleMapsEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8444388671917!2d26.0976553!3d44.4379832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDI2JzE2LjciTiAyNsKwMDUnNTEuNiJF!5e0!3m2!1sen!2sro!4v1234567890',
  })

  // 5. Logo
  console.log('\n🏷️ Setting up logo...')
  await seedLogo(payload, {
    type: 'text',
    text: 'DentalMed',
  })

  // 6. Header
  console.log('\n📋 Setting up header navigation...')
  await seedHeader(payload, {
    variant: 'standard',
    navItems: dentistData.navigation,
    ctaButton: {
      enabled: true,
      label: 'Programare',
      link: '/programare',
      variant: 'default',
    },
  })

  // 7. Footer
  console.log('\n📋 Setting up footer...')
  await seedFooter(payload, {
    variant: 'columns-4',
    columns: [
      {
        title: 'Clinica',
        type: 'text',
      },
      {
        title: 'Servicii',
        type: 'links',
        links: [
          { label: 'Consultatie', type: 'custom', url: '/servicii#consultatie' },
          { label: 'Implant', type: 'custom', url: '/servicii#implant' },
          { label: 'Ortodontie', type: 'custom', url: '/servicii#ortodontie' },
          { label: 'Albire', type: 'custom', url: '/servicii#albire' },
        ],
      },
      {
        title: 'Program',
        type: 'schedule',
      },
      {
        title: 'Contact',
        type: 'contact',
      },
    ],
  })

  // 8. Services
  console.log('\n🦷 Creating services...')
  await seedServices(payload, dentistData.services)

  // 9. Team with images
  console.log('\n👥 Creating team members with photos...')
  const teamWithImages = dentistData.team.map((member) => ({
    ...member,
    imageId: getImageId(dentistImages.team[member.imageIndex]?.filename),
  }))
  await seedTeam(payload, teamWithImages)

  // 10. Testimonials
  console.log('\n⭐ Creating testimonials...')
  await seedTestimonials(payload, dentistData.testimonials)

  // 11. FAQ
  console.log('\n❓ Creating FAQ...')
  await seedFAQ(payload, dentistData.faq)

  // 12. Portfolio/Gallery with images
  console.log('\n🖼️ Creating gallery items...')
  const portfolioItems = dentistImages.gallery.map((img, index) => ({
    title: `Clinica ${index + 1}`,
    description: img.alt,
    imageId: getImageId(img.filename) || '',
    featured: index < 4,
    order: index + 1,
  }))
  await seedPortfolio(payload, portfolioItems)

  // 13. Homepage with dynamic layout based on variant
  console.log('\n🏠 Creating homepage...')
  const heroImageId = getImageId(dentistImages.hero[0]?.filename)
  const homepageLayout = buildHomepageLayout(variant, dentistData)

  await seedHomePage(payload, {
    heroType: variant.hero.type,
    hero: {
      headline: dentistData.hero.headline,
      subheadline: dentistData.hero.subheadline,
      ctaButtons: dentistData.hero.ctaButtons,
      imageId: heroImageId,
    },
    layout: homepageLayout,
  })

  // 14. Create blog posts
  console.log('\n📝 Creating blog posts...')
  if (dentistData.posts) {
    await seedPosts(payload, dentistData.posts)
  }

  // 15. Create additional pages
  console.log('\n📄 Creating additional pages...')
  await createAdditionalPages(payload, variant)

  // 16. Set design variant global
  console.log('\n🎨 Setting design variant global...')
  await seedDesignVariant(payload, {
    businessType: 'dentist',
    variantIndex: VARIANT_INDEX,
    variantName: variant.name,
    variantDescription: variant.description,
  })

  console.log('\n' + '━'.repeat(50))
  console.log('✅ Dentist seeding complete!')
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

// Build homepage layout based on variant configuration
function buildHomepageLayout(variant: DesignVariant, _data: typeof dentistData) {
  const sectionConfigs: Record<string, BlockConfig> = {
    services: {
      blockType: 'services',
      variant: variant.layout.servicesVariant,
      heading: 'Serviciile Noastre',
      subheading: 'Tratamente stomatologice complete pentru intreaga familie',
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
      heading: 'Echipa Medicala',
      subheading: 'Specialisti cu experienta dedicati sanatatii tale',
      source: 'collection',
      onlyFeatured: true,
      limit: 4,
      backgroundColor: 'default',
    },
    testimonials: {
      blockType: 'testimonials',
      variant: variant.layout.testimonialsVariant,
      heading: 'Pareri Pacienti',
      subheading: 'Ce spun pacientii nostri despre experienta lor',
      source: 'collection',
      onlyFeatured: true,
      showRating: true,
      backgroundColor: 'light',
    },
    gallery: {
      blockType: 'gallery',
      variant: variant.layout.galleryVariant,
      heading: 'Clinica Noastra',
      subheading: 'Echipamente moderne si spatii prietenoase',
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
      headline: 'Zambeste cu Incredere',
      subheadline: 'Programeaza-te pentru o consultatie si descopera cum te putem ajuta',
      buttons: [{ label: 'Programeaza Acum', link: '/programare', variant: 'default' }],
      backgroundColor: 'dark',
    },
  }

  // Build layout based on variant section order
  return variant.layout.sections.map((sectionName) => sectionConfigs[sectionName]).filter(Boolean)
}

// Create additional pages
async function createAdditionalPages(payload: Payload, variant: DesignVariant) {
  // Services page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Servicii',
      slug: 'servicii',
      heroType: 'centered',
      hero: {
        headline: 'Servicii Stomatologice',
        subheadline: 'Tratamente complete pentru sanatatea si estetica zambetului tau',
      },
      layout: [
        {
          blockType: 'services',
          variant: variant.layout.servicesVariant,
          heading: 'Lista Completa Servicii',
          source: 'collection',
          limit: 20,
          showPrices: true,
          showIcons: true,
          backgroundColor: 'default',
        },
        {
          blockType: 'cta',
          variant: 'centered',
          headline: 'Vrei sa te programezi?',
          subheadline: 'Alege serviciul dorit si programeaza-te online',
          buttons: [{ label: 'Programeaza-te', link: '/programare', variant: 'default' }],
          backgroundColor: 'light',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Services page')

  // Team page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Echipa',
      slug: 'echipa',
      heroType: 'centered',
      hero: {
        headline: 'Echipa Medicala',
        subheadline: 'Cunoaste specialistii care vor avea grija de zambetul tau',
      },
      layout: [
        {
          blockType: 'team',
          variant: variant.layout.teamVariant,
          heading: 'Medicii Nostri',
          subheading: 'Fiecare membru al echipei noastre este un specialist dedicat',
          source: 'collection',
          limit: 20,
          showRole: true,
          showBio: true,
          backgroundColor: 'default',
        },
        {
          blockType: 'cta',
          variant: 'centered',
          headline: 'Alege-ti Medicul',
          subheadline: 'Programeaza-te la specialistul potrivit pentru nevoile tale',
          buttons: [{ label: 'Programeaza-te', link: '/programare', variant: 'default' }],
          backgroundColor: 'dark',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Team page')

  // Gallery page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Galerie',
      slug: 'galerie',
      heroType: 'centered',
      hero: {
        headline: 'Galerie',
        subheadline: 'Descopera clinica noastra moderna',
      },
      layout: [
        {
          blockType: 'gallery',
          variant: variant.layout.galleryVariant,
          heading: 'Clinica si Echipamente',
          subheading: 'Tehnologie de ultima generatie pentru cele mai bune rezultate',
          source: 'portfolio',
          limit: 20,
          
          backgroundColor: 'default',
        },
        {
          blockType: 'cta',
          variant: 'centered',
          headline: 'Vino sa ne vizitezi!',
          subheadline: 'Programeaza o consultatie si convinge-te de calitatea serviciilor noastre',
          buttons: [{ label: 'Programeaza-te', link: '/programare', variant: 'default' }],
          backgroundColor: 'primary',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Gallery page')

  // Booking page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Programare',
      slug: 'programare',
      heroType: 'centered',
      hero: {
        headline: 'Programeaza-te Online',
        subheadline: 'Completeaza formularul si te vom contacta pentru confirmare',
      },
      layout: [
        {
          blockType: 'booking',
          variant: 'full',
          heading: 'Cerere de Programare',
          subheading: 'Alege serviciul dorit, iar noi te vom contacta pentru confirmare',
          showServiceSelection: true,
          showTeamSelection: true,
          showDatePicker: true,
          showTimePicker: true,
          submitButtonText: 'Trimite Cererea',
          successMessage:
            'Cererea ta a fost trimisa! Te vom contacta in cel mai scurt timp pentru confirmare.',
          showWhatsappOption: true,
          showPhoneOption: true,
          backgroundColor: 'light',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Booking page')

  // Contact page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact',
      slug: 'contact',
      heroType: 'centered',
      hero: {
        headline: 'Contact',
        subheadline: 'Suntem aici pentru zambetul tau. Contacteaza-ne pentru programari.',
      },
      layout: [
        {
          blockType: 'contact',
          variant: 'split',
          heading: 'Contacteaza-ne',
          subheading: 'Trimite-ne un mesaj sau vino direct la clinica',
          showForm: true,
          formFields: {
            showName: true,
            showEmail: true,
            showPhone: true,
            showSubject: false,
            showService: true,
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
}
