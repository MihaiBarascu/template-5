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
  seedNewsletterSubscribers,
  seedForms,
  formTemplates,
  createContactPageLayout,
} from '../helpers'
import { barbershopImages, barbershopData } from '../seed-data'
import { getVariant, getHeroOverlaySettings, type DesignVariant } from '../design-variants'

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
      'https://www.google.com/maps?q=Calea+Victoriei+45,+Sector+1,+Bucuresti,+Romania&output=embed',
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
    // Footer fara textura - se poate adauga din admin
  })

  // 8. Services
  console.log('\n✂️ Creating services...')
  const createdServices = await seedServices(payload, barbershopData.services)

  // 8.5 Create forms using Form Builder
  console.log('\n📝 Creating forms...')
  const serviceOptions = Array.from(createdServices.entries()).map(([title]) => ({
    label: title,
    value: title.toLowerCase().replace(/\s+/g, '-'),
  }))
  const formsMap = await seedForms(payload, [
    formTemplates.contact(),
    formTemplates.booking(serviceOptions),
  ])

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

  const overlaySettings = getHeroOverlaySettings(variant)
  await seedHomePage(payload, {
    heroType: variant.hero.type,
    hero: {
      headline: barbershopData.hero.headline,
      subheadline: barbershopData.hero.subheadline,
      ctaButtons: barbershopData.hero.ctaButtons,
      imageId: heroImageId,
      ...overlaySettings,
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
  await createAdditionalPages(payload, variant, formsMap)

  // 17. Sample newsletter subscribers for demo
  console.log('\n📧 Creating sample newsletter subscribers...')
  await seedNewsletterSubscribers(payload, [
    { email: 'client1@mailinator.com', source: 'website' },
    { email: 'client2@mailinator.com', source: 'footer' },
    { email: 'client3@mailinator.com', source: 'popup' },
  ])

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
      variant: 'slider',
      heading: 'Transformari Spectaculoase',
      subheading: 'Vezi diferenta dintre inainte si dupa la clientii nostri',
      sliderPosition: 50,
      backgroundColor: 'default',
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
    // New: Trust Badges - credibility indicators
    trustBadges: {
      blockType: 'trust-badges',
      variant: 'bar',
      source: 'preset',
      presets: ['secure-payment', 'support-24-7', 'quality', 'experience-years'],
      customValues: {
        experienceYears: 6,
      },
      showDescriptions: true,
      iconSize: 'medium',
      backgroundColor: 'light',
    },
    // New: Opening Hours - program functionare
    openingHours: {
      blockType: 'openingHours',
      variant: 'simple',
      heading: 'Program',
      subheading: 'Suntem aici pentru tine in urmatoarele intervale orare',
      source: 'businessInfo',
      showCurrentStatus: true,
      backgroundColor: 'default',
    },
    // New: Locations - locatii multiple
    locations: {
      blockType: 'locations',
      variant: 'cards',
      heading: 'Locatiile Noastre',
      subheading: 'Gaseste salonul cel mai aproape de tine',
      locations: [
        {
          name: 'Sediul Central',
          address: 'Calea Victoriei 45',
          city: 'Bucuresti',
          phone: '0722 123 456',
          email: 'contact@barbershop.ro',
          schedule: [
            { days: 'Luni - Vineri', hours: '10:00 - 20:00' },
            { days: 'Sambata', hours: '10:00 - 18:00' },
            { days: 'Duminica', hours: 'Inchis' },
          ],
          rating: 4.9,
          ctaButton: {
            label: 'Programeaza-te',
            link: '/programare',
          },
        },
      ],
      showRating: true,
      showSchedule: true,
      backgroundColor: 'light',
    },
    // New: Brand Logos - logo-uri parteneri/produse
    brandLogos: {
      blockType: 'brandLogos',
      variant: 'row',
      heading: 'Produse Premium',
      subheading: 'Folosim doar branduri de top pentru ingrijirea ta',
      source: 'custom',
      logos: [],
      grayscale: true,
      logoSize: 'medium',
      backgroundColor: 'default',
    },
    // New: Timeline - istoria companiei
    timeline: {
      blockType: 'timeline',
      variant: 'vertical',
      heading: 'Povestea Noastra',
      subheading: 'De la inceput pana in prezent',
      events: [
        {
          year: '2018',
          title: 'Fondarea',
          description: 'Am deschis primul nostru salon in inima Bucurestiului',
          icon: 'Building',
        },
        {
          year: '2020',
          title: 'Extindere',
          description: 'Am deschis a doua locatie si am crescut echipa',
          icon: 'Users',
        },
        {
          year: '2022',
          title: 'Premii',
          description: 'Am castigat premiul pentru cel mai bun barbershop din oras',
          icon: 'Award',
        },
        {
          year: '2024',
          title: 'Prezent',
          description: 'Continuam sa oferim servicii de exceptie clientilor nostri',
          icon: 'Star',
        },
      ],
      showConnector: true,
      backgroundColor: 'light',
    },
    // New: Announcement Bar - bara anunturi/promotii
    announcementBar: {
      blockType: 'announcementBar',
      variant: 'simple',
      messages: [
        {
          text: 'Reducere 20% la prima vizita!',
          link: '/programare',
          linkText: 'Programeaza-te acum',
        },
      ],
      icon: 'Percent',
      backgroundColor: 'primary',
      position: 'top',
      sticky: false,
    },
    // New: How It Works - customer journey steps
    howItWorks: {
      blockType: 'how-it-works',
      variant: 'connected',
      heading: 'Cum Functioneaza',
      subheading: 'Procesul simplu de la programare la rezultat',
      steps: [
        {
          title: 'Programeaza Online',
          description: 'Alege data si ora care ti se potriveste direct din site',
          icon: 'Calendar',
        },
        {
          title: 'Vino la Salon',
          description: 'Te asteptam la adresa noastra in ziua aleasa',
          icon: 'Store',
        },
        {
          title: 'Consultatie',
          description: 'Discutam despre stilul dorit si recomandarile noastre',
          icon: 'MessageSquare',
        },
        {
          title: 'Rezultat Perfect',
          description: 'Pleci cu un look nou si incredere sporita',
          icon: 'Star',
        },
      ],
      showNumbers: true,
      ctaButton: {
        show: true,
        label: 'Programeaza-te Acum',
        link: '/programare',
      },
      backgroundColor: 'default',
    },
    // New: Logo Cloud - partner brands
    logoCloud: {
      blockType: 'logo-cloud',
      variant: 'grayscale',
      heading: 'Produse Premium',
      subheading: 'Folosim doar branduri de top pentru ingrijirea ta',
      // Note: logos will need actual uploaded images, for now using placeholders
      logos: [],
      logoSize: 'medium',
      columns: '5',
      grayscale: true,
      backgroundColor: 'light',
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
      detailBasePath: '/servicii',
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
    latestPosts: {
      blockType: 'latestPosts',
      variant: 'grid-3',
      heading: 'Din Blogul Nostru',
      subheading: 'Sfaturi si noutati despre ingrijirea parului si barbii',
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
async function createAdditionalPages(payload: Payload, variant: DesignVariant, formsMap: Map<string, string>) {
  // Services page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Servicii',
      slug: 'servicii',
      heroType: 'minimal',
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
          detailBasePath: '/servicii',
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
      heroType: 'minimal',
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
      heroType: 'minimal',
      hero: {
        headline: 'Preturi',
        subheadline: 'Tarife transparente pentru toate serviciile noastre',
      },
      layout: [
        {
          blockType: 'subscriptionCards',
          variant: 'cards-3',
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
          detailBasePath: '/servicii',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Pricing page')

  // Booking page - uses Form Builder
  const bookingFormId = formsMap.get('Cerere programare')
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
      layout: bookingFormId
        ? [
            {
              blockType: 'formBlock',
              form: bookingFormId,
              variant: 'card',
              enableIntro: true,
              heading: 'Cerere de Programare',
              subheading: 'Alege serviciul dorit, iar noi te vom contacta pentru confirmare',
              backgroundColor: 'light',
            },
          ]
        : [],
      _status: 'published',
    },
  })
  console.log('   Created Booking page')

  // Contact page - uses Form Builder with 2-column layout
  const contactFormId = formsMap.get('Formular de contact')
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact',
      slug: 'contact',
      heroType: 'minimal',
      hero: {
        headline: 'Contact',
        subheadline: 'Suntem aici sa te ajutam. Contacteaza-ne pentru programari sau intrebari.',
      },
      layout: createContactPageLayout(contactFormId),
      _status: 'published',
    },
  })
  console.log('   Created Contact page')
}
