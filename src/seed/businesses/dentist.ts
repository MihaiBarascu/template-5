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
import { dentistImages, dentistData } from '../seed-data'
import { getVariant, getHeroOverlaySettings, type DesignVariant } from '../design-variants'

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

  // 3. Configure theme - use universal variant based on business style
  // Dentist/Medical typically uses teal-modern (fresh, medical) or classic-blue (professional)
  console.log('\n🎨 Configuring site theme...')
  await seedSiteTheme(payload, {
    variant: 'teal-modern', // Best for dental/medical - fresh, clean, professional
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

  const overlaySettings = getHeroOverlaySettings(variant)
  await seedHomePage(payload, {
    heroType: variant.hero.type,
    hero: {
      headline: dentistData.hero.headline,
      subheadline: dentistData.hero.subheadline,
      ctaButtons: dentistData.hero.ctaButtons,
      imageId: heroImageId,
      ...overlaySettings,
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

  // Sample newsletter subscribers for demo
  console.log('\n📧 Creating sample newsletter subscribers...')
  await seedNewsletterSubscribers(payload, [
    { email: 'pacient1@mailinator.com', source: 'website' },
    { email: 'pacient2@mailinator.com', source: 'footer' },
    { email: 'pacient3@mailinator.com', source: 'popup' },
  ])

  // Note: Design variant global has been replaced by unified SiteTheme system
  // Theme is now configured at the start of seeding via seedSiteTheme()

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
  ctaButton?: { show: boolean; label: string; link: string }
  [key: string]: unknown
}

// Build homepage layout based on variant configuration
function buildHomepageLayout(variant: DesignVariant, _data: typeof dentistData) {
  const sectionConfigs: Record<string, BlockConfig> = {
    // NEW: Trust Badges - medical credibility (grid-4 variant, different from barbershop)
    trustBadges: {
      blockType: 'trust-badges',
      variant: 'grid-4',
      source: 'preset',
      presets: ['quality', 'experience-years', 'happy-customers', 'secure-payment'],
      customValues: {
        experienceYears: 10,
        happyCustomersCount: '10000+',
      },
      showDescriptions: true,
      iconSize: 'medium',
      backgroundColor: 'primary',
    },
    // NEW: How It Works - patient journey (timeline variant - different from barbershop)
    howItWorks: {
      blockType: 'how-it-works',
      variant: 'timeline',
      heading: 'Drumul Tau Catre un Zambet Perfect',
      subheading: 'Pasi simpli pentru tratamentul stomatologic',
      steps: [
        {
          title: 'Programare Consultatie',
          description: 'Suna sau completeaza formularul online pentru o consultatie initiala',
          icon: 'Calendar',
        },
        {
          title: 'Diagnostic Complet',
          description: 'Evaluare detaliata cu radiografii digitale si plan de tratament personalizat',
          icon: 'ClipboardCheck',
        },
        {
          title: 'Tratament Profesional',
          description: 'Proceduri realizate cu tehnologie de ultima generatie si materiale premium',
          icon: 'Heart',
        },
        {
          title: 'Zambet Sanatos',
          description: 'Rezultate de durata si sfaturi pentru mentinerea sanatatii orale',
          icon: 'Star',
        },
      ],
      showNumbers: true,
      ctaButton: {
        show: true,
        label: 'Programeaza Consultatie',
        link: '/programare',
      },
      backgroundColor: 'light',
    },
    // NEW: Newsletter for dental tips
    newsletter: {
      blockType: 'newsletter',
      variant: 'simple',
      heading: 'Sfaturi pentru Sanatatea Orala',
      subheading: 'Primeste sfaturi de la medicii nostri direct in inbox',
      placeholder: 'Email-ul tau',
      buttonText: 'Aboneaza-te',
      successMessage: 'Te-ai abonat cu succes!',
      privacyText: 'Respectam confidentialitatea datelor tale.',
      benefits: [
        { text: 'Sfaturi de preventie' },
        { text: 'Promotii exclusive' },
        { text: 'Noutati in stomatologie' },
      ],
    },
    // NEW: Opening Hours - program functionare
    openingHours: {
      blockType: 'openingHours',
      variant: 'with-cta',
      heading: 'Program Consultații',
      subheading: 'Suntem disponibili în următoarele intervale orare',
      source: 'businessInfo',
      showCurrentStatus: true,
      ctaButton: {
        show: true,
        label: 'Programează Consultație',
        link: '/programare',
      },
      backgroundColor: 'default',
    },
    // NEW: Locations - locatii clinica
    locations: {
      blockType: 'locations',
      variant: 'cards',
      heading: 'Clinicile Noastre',
      subheading: 'Găsește clinica cea mai aproape de tine',
      locations: [
        {
          name: 'Clinica Centrală',
          address: 'Bulevardul Unirii 25',
          city: 'București',
          phone: '0722 111 222',
          email: 'contact@dentalmed.ro',
          schedule: [
            { days: 'Luni - Vineri', hours: '09:00 - 20:00' },
            { days: 'Sâmbătă', hours: '09:00 - 14:00' },
            { days: 'Duminică', hours: 'Închis' },
          ],
          rating: 4.9,
          ctaButton: {
            label: 'Programează-te',
            link: '/programare',
          },
        },
      ],
      showRating: true,
      showSchedule: true,
      backgroundColor: 'light',
    },
    // NEW: Brand Logos - echipamente si branduri medicale
    brandLogos: {
      blockType: 'brandLogos',
      variant: 'row',
      heading: 'Echipamente de Ultima Generație',
      subheading: 'Folosim doar echipamente și materiale certificate',
      source: 'custom',
      logos: [],
      grayscale: true,
      logoSize: 'medium',
      backgroundColor: 'default',
    },
    // NEW: Timeline - istoria clinicii
    timeline: {
      blockType: 'timeline',
      variant: 'vertical-alternating',
      heading: 'Istoria Clinicii',
      subheading: 'Evoluția noastră de-a lungul anilor',
      events: [
        {
          year: '2010',
          title: 'Înființarea',
          description: 'Am deschis prima clinică stomatologică cu viziunea de a oferi servicii de excelență',
          icon: 'Building',
        },
        {
          year: '2015',
          title: 'Extindere',
          description: 'Am investit în echipamente de ultimă generație și am extins echipa',
          icon: 'Users',
        },
        {
          year: '2020',
          title: 'Certificări',
          description: 'Am obținut certificări internaționale pentru calitatea serviciilor',
          icon: 'Award',
        },
        {
          year: '2024',
          title: 'Prezent',
          description: 'Peste 10.000 de pacienți mulțumiți și servicii complete de stomatologie',
          icon: 'Star',
        },
      ],
      showConnector: true,
      backgroundColor: 'light',
    },
    // NEW: Announcement Bar - anunturi promotii
    announcementBar: {
      blockType: 'announcementBar',
      variant: 'with-button',
      messages: [
        {
          text: 'Consultație GRATUITĂ pentru pacienții noi!',
          link: '/programare',
          linkText: 'Programează acum',
        },
      ],
      ctaButton: {
        show: true,
        label: 'Programează Consultație',
        link: '/programare',
      },
      icon: 'Gift',
      backgroundColor: 'primary',
      position: 'top',
      sticky: false,
    },
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
    latestPosts: {
      blockType: 'latestPosts',
      variant: 'grid-3',
      heading: 'Din Blogul Nostru',
      subheading: 'Sfaturi si informatii pentru sanatatea dentara',
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
      heroType: 'minimal',
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
      heroType: 'minimal',
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
      heroType: 'minimal',
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
      heroType: 'minimal',
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
      heroType: 'minimal',
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
