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
  seedPricePackages,
  seedHomePage,
  seedPortfolio,
  uploadLocalSeedImages,
  seedPosts,
} from '../helpers'
import { barbershopImages, barbershopData } from '../seed-data'
import { getVariant, type DesignVariant } from '../design-variants'

// Get variant from environment or default to 0
const VARIANT_INDEX = parseInt(process.env.DESIGN_VARIANT || '0', 10)

export async function seedFrizerie(payload: Payload) {
  const variant = getVariant('barbershop', VARIANT_INDEX)

  console.log('\n📍 Seeding: Frizerie / Barbershop')
  console.log(`🎨 Design Variant: ${variant.name} (${variant.id})`)
  console.log(`   ${variant.description}`)
  console.log('━'.repeat(50))

  // 1. Create admin user
  await createAdminUser(payload)

  // 2. Upload all images first
  console.log('\n📸 Uploading images from local files...')
  const allImages = [
    ...barbershopImages.hero,
    ...barbershopImages.team,
    ...barbershopImages.gallery,
    ...barbershopImages.services,
  ]
  const imageMap = await uploadLocalSeedImages(payload, allImages)

  // Helper to get image ID by filename
  const getImageId = (filename: string): string | undefined => {
    return imageMap.get(filename) || undefined
  }

  // 3. Configure theme - use universal variant based on business style
  // Barbershop/Frizerie typically uses dark-gold (elegant, masculine) or brown-vintage (traditional)
  console.log('\n🎨 Configuring site theme...')
  await seedSiteTheme(payload, {
    variant: 'dark-gold', // Best for barbershop - elegant, premium, masculine
    borderRadius: variant.theme.borderRadius,
    shadows: variant.theme.shadows,
    sectionSpacing: 'normal',
  })

  // 4. Business info
  console.log('\n🏪 Setting up business info...')
  await seedBusinessInfo(payload, {
    name: barbershopData.business.name,
    tagline: barbershopData.business.tagline,
    description: barbershopData.business.description,
    yearEstablished: barbershopData.business.yearEstablished,
    phone: barbershopData.business.phone,
    email: barbershopData.business.email,
    whatsapp: barbershopData.business.whatsapp,
    address: barbershopData.business.address,
    workingHours: barbershopData.business.workingHours,
    social: barbershopData.business.social,
    stats: barbershopData.business.stats,
    googleMapsEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8444388671917!2d26.0976553!3d44.4379832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDI2JzE2LjciTiAyNsKwMDUnNTEuNiJF!5e0!3m2!1sen!2sro!4v1234567890',
    // WhatsApp Float settings
    whatsappFloat: {
      enabled: true,
      position: 'bottom-right',
      showOnMobile: true,
      defaultMessage: 'Buna! Doresc sa fac o programare la frizerie.',
      tooltipText: 'Programeaza-te pe WhatsApp',
      pulseAnimation: true,
    },
  })

  // 5. Logo
  console.log('\n🏷️ Setting up logo...')
  await seedLogo(payload, {
    type: 'text',
    text: 'BARBER SHOP',
  })

  // 6. Header
  console.log('\n📋 Setting up header navigation...')
  await seedHeader(payload, {
    variant: 'standard',
    navItems: barbershopData.navigation,
    ctaButton: {
      enabled: true,
      label: 'Programeaza-te',
      link: '/programare',
      variant: 'default',
    },
  })

  // 7. Footer
  console.log('\n📋 Setting up footer...')
  await seedFooter(payload, {
    variant: 'columns-4',
    columns: barbershopData.footer.columns,
  })

  // 8. Services
  console.log('\n✂️ Creating services...')
  await seedServices(payload, barbershopData.services)

  // 9. Team with images
  console.log('\n👥 Creating team members with photos...')
  const teamWithImages = barbershopData.team.map((member) => ({
    ...member,
    imageId: getImageId(barbershopImages.team[member.imageIndex]?.filename),
  }))
  await seedTeam(payload, teamWithImages)

  // 10. Testimonials
  console.log('\n⭐ Creating testimonials...')
  await seedTestimonials(payload, barbershopData.testimonials)

  // 11. FAQ
  console.log('\n❓ Creating FAQ...')
  await seedFAQ(payload, barbershopData.faq)

  // 12. Price Packages
  console.log('\n💰 Creating price packages...')
  await seedPricePackages(payload, barbershopData.pricePackages)

  // 13. Portfolio/Gallery with images
  console.log('\n🖼️ Creating gallery items...')
  const portfolioItems = barbershopImages.gallery.map((img, index) => ({
    title: `Galerie ${index + 1}`,
    description: img.alt,
    imageId: getImageId(img.filename) || '',
    featured: index < 4,
    order: index + 1,
  }))
  await seedPortfolio(payload, portfolioItems)

  // 14. Homepage with dynamic layout based on variant
  console.log('\n🏠 Creating homepage...')
  const heroImageId = getImageId(barbershopImages.hero[0]?.filename)
  const homepageLayout = buildHomepageLayout(variant, barbershopData)

  await seedHomePage(payload, {
    heroType: variant.hero.type,
    hero: {
      headline: barbershopData.hero.headline,
      subheadline: barbershopData.hero.subheadline,
      ctaButtons: barbershopData.hero.ctaButtons,
      imageId: heroImageId,
    },
    layout: homepageLayout,
  })

  // 15. Create blog posts
  console.log('\n📝 Creating blog posts...')
  if (barbershopData.posts) {
    await seedPosts(payload, barbershopData.posts)
  }

  // 16. Create additional pages
  console.log('\n📄 Creating additional pages...')
  await createAdditionalPages(payload, variant)

  // Note: Design variant global has been replaced by unified SiteTheme system
  // Theme is now configured at the start of seeding via seedSiteTheme()

  console.log('\n' + '━'.repeat(50))
  console.log('✅ Frizerie seeding complete!')
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
  videoUrl?: string
  showDuration?: boolean
  dotStyle?: string
  currency?: string
  ctaButton?: { show: boolean; label: string; link: string }
  [key: string]: unknown
}

// Build homepage layout based on variant configuration
function buildHomepageLayout(variant: DesignVariant, _data: typeof barbershopData) {
  const sectionConfigs: Record<string, BlockConfig> = {
    // New: Price list with dotted lines (barbershop specific)
    priceList: {
      blockType: 'priceListDotted',
      variant: 'two-columns',
      heading: 'Lista de Preturi',
      subheading: 'Tarife transparente pentru toate serviciile noastre',
      source: 'services',
      limit: 12,
      showDuration: true,
      dotStyle: 'dotted',
      currency: 'RON',
      backgroundColor: 'light',
      ctaButton: {
        show: true,
        label: 'Programeaza-te',
        link: '/programare',
      },
    },
    // New: Video presentation
    video: {
      blockType: 'videoEmbed',
      variant: 'centered',
      heading: 'Descopera Salonul Nostru',
      subheading: 'Un scurt tur al spatiului si echipei noastre',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      backgroundColor: 'dark',
    },
    // New: Before/After slider for transformations
    beforeAfter: {
      blockType: 'beforeAfter',
      variant: 'horizontal',
      heading: 'Transformari Spectaculoase',
      subheading: 'Vezi diferenta dintre inainte si dupa la clientii nostri',
      layout: 'grid-2',
      initialPosition: 50,
      showLabels: true,
      backgroundColor: 'default',
      ctaButton: {
        show: true,
        label: 'Vreau si eu o transformare',
        link: '/programare',
      },
    },
    // New: Newsletter subscription
    newsletter: {
      blockType: 'newsletter',
      variant: 'dark',
      heading: 'Ramai la Curent',
      subheading: 'Aboneaza-te pentru oferte exclusive si sfaturi de ingrijire',
      placeholder: 'Adresa ta de email',
      buttonText: 'Aboneaza-te',
      successMessage: 'Multumim! Te-ai abonat cu succes.',
      privacyText: 'Datele tale sunt in siguranta. Nu facem spam.',
      showPrivacyLink: true,
      benefits: [
        { text: 'Oferte exclusive' },
        { text: 'Sfaturi de ingrijire' },
        { text: 'Noutati despre servicii' },
      ],
    },
    services: {
      blockType: 'services',
      variant: variant.layout.servicesVariant,
      heading: 'Serviciile Noastre',
      subheading: 'Servicii profesionale de frizerie si barbering',
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
      subheading: 'Profesionisti pasionati de meseria lor',
      source: 'collection',
      onlyFeatured: true,
      limit: 4,
      backgroundColor: 'default',
    },
    testimonials: {
      blockType: 'testimonials',
      variant: variant.layout.testimonialsVariant,
      heading: 'Ce Spun Clientii',
      subheading: 'Pareri reale de la clientii nostri fideli',
      source: 'collection',
      onlyFeatured: true,
      showRating: true,
      backgroundColor: 'light',
    },
    gallery: {
      blockType: 'gallery',
      variant: variant.layout.galleryVariant,
      heading: 'Galeria Noastra',
      subheading: 'Rezultate din activitatea noastra',
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
      headline: 'Gata pentru o Transformare?',
      subheadline: 'Programeaza-te acum si descopera diferenta unui barbershop premium',
      buttons: [{ label: 'Programeaza-te Acum', link: '/programare', variant: 'default' }],
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
        headline: 'Serviciile Noastre',
        subheadline: 'De la tunsori clasice la tratamente premium, oferim tot ce ai nevoie',
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
        headline: 'Echipa Noastra',
        subheadline: 'Cunoaste profesionistii care vor avea grija de tine',
      },
      layout: [
        {
          blockType: 'team',
          variant: variant.layout.teamVariant,
          heading: 'Barberii Nostri',
          subheading: 'Fiecare membru al echipei noastre este un profesionist dedicat meseriei sale',
          source: 'collection',
          limit: 20,
          showRole: true,
          showBio: true,
          backgroundColor: 'default',
        },
        {
          blockType: 'cta',
          variant: 'centered',
          headline: 'Alege-ti Barberul Preferat',
          subheadline: 'Programeaza-te acum si alege cu cine vrei sa lucrezi',
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
        subheadline: 'Vezi rezultatele muncii noastre',
      },
      layout: [
        {
          blockType: 'gallery',
          variant: variant.layout.galleryVariant,
          heading: 'Lucrarile Noastre',
          subheading: 'De la tunsori clasice la stiluri moderne, fiecare client pleaca multumit',
          source: 'portfolio',
          limit: 20,
          
          backgroundColor: 'default',
        },
        {
          blockType: 'cta',
          variant: 'centered',
          headline: 'Iti place ce vezi?',
          subheadline: 'Programeaza-te si arata-ne ce stil iti doresti',
          buttons: [{ label: 'Programeaza-te', link: '/programare', variant: 'default' }],
          backgroundColor: 'primary',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Gallery page')

  // Pricing page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Preturi',
      slug: 'preturi',
      heroType: 'centered',
      hero: {
        headline: 'Preturi',
        subheadline: 'Tarife transparente pentru toate serviciile noastre',
      },
      layout: [
        {
          blockType: 'pricing',
          variant: variant.layout.pricingVariant,
          heading: 'Pachete si Abonamente',
          subheading: 'Alege pachetul potrivit pentru tine',
          source: 'collection',
          limit: 4,
          showFeatures: true,
          showOldPrice: true,
          backgroundColor: 'default',
        },
        {
          blockType: 'services',
          variant: 'price-list',
          heading: 'Lista Completa Preturi Servicii',
          subheading: 'Toate serviciile noastre cu preturi detaliate',
          source: 'collection',
          limit: 20,
          showPrices: true,
          backgroundColor: 'light',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Pricing page')

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
          subheading: 'Alege serviciul si persoana dorita, iar noi te vom contacta pentru confirmare',
          showServiceSelection: true,
          showTeamSelection: true,
          showDatePicker: true,
          showTimePicker: true,
          submitButtonText: 'Trimite Cererea',
          successMessage: 'Cererea ta a fost trimisa! Te vom contacta in cel mai scurt timp pentru confirmare.',
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
        subheadline: 'Suntem aici sa te ajutam. Contacteaza-ne pentru programari sau intrebari.',
      },
      layout: [
        {
          blockType: 'contact',
          variant: 'split',
          heading: 'Contacteaza-ne',
          subheading: 'Trimite-ne un mesaj sau vino direct la salon',
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
          successMessage: 'Multumim! Mesajul tau a fost trimis. Te vom contacta in cel mai scurt timp.',
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
