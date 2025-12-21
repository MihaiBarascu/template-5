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
  seedForms,
  formTemplates,
  createContactPageLayout,
  buildHeroData,
} from '../helpers'
import { autoServiceImages, autoServiceData } from '../seed-data'
import { getVariant, getHeroOverlaySettings, type DesignVariant } from '../design-variants'

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

  // Configure theme - use universal variant based on business style
  // Auto service typically uses modern-red (bold, energetic) or minimal-black (professional)
  console.log('\n🎨 Configuring site theme...')
  await seedSiteTheme(payload, {
    variant: 'modern-red', // Best for auto service - bold, energetic, powerful
    borderRadius: variant.theme.borderRadius,
    shadows: variant.theme.shadows,
    sectionSpacing: variant.theme.sectionSpacing || 'normal',
    headingScale: variant.theme.headingScale || 'normal',
    bodyTextSize: variant.theme.bodyTextSize || 'normal',
    cardGap: variant.theme.cardGap || 'normal',
    animations: variant.theme.animations || 'dynamic',
    // Typography - use fonts from design variant
    headingFont: variant.theme.headingFont,
    bodyFont: variant.theme.bodyFont,
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
    googleMapsEmbed:
      'https://www.google.com/maps?q=Soseaua+Colentina+250,+Sector+2,+Bucuresti,+Romania&output=embed',
    whatsappFloat: {
      enabled: true,
      position: 'bottom-right',
      showOnMobile: true,
      defaultMessage: 'Buna! Doresc sa fac o programare pentru service auto.',
      tooltipText: 'Programeaza-te pe WhatsApp',
      pulseAnimation: true,
    },
    floatingCta: {
      enabled: true,
      text: 'Programează-te',
      href: '/programare',
      variant: 'gradient',
      icon: 'calendar',
      position: 'bottom-center',
      shape: 'pill',
      showOnMobile: true,
      pulseAnimation: true,
      dismissible: true,
      showAfterScroll: 300,
    },
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
    colorScheme: 'dark',
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
    // Footer fara textura - se poate adauga din admin
  })

  console.log('\n🔧 Creating services...')
  const createdServices = await seedServices(payload, autoServiceData.services)

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
  const homepageLayout = buildHomepageLayout(variant)
  const overlaySettings = getHeroOverlaySettings(variant)

  // Build hero data using helper (supports carousel/slider/split)
  // Extract years from stats (e.g. "15+" -> 15)
  const yearsStatValue = autoServiceData.business.stats?.find((s) => s.label.toLowerCase().includes('ani'))?.value
  const yearsExperience = yearsStatValue ? parseInt(yearsStatValue.replace(/\D/g, ''), 10) : 15

  const heroData = buildHeroData(
    variant.hero.type,
    {
      headline: autoServiceData.hero.headline,
      subheadline: autoServiceData.hero.subheadline,
      ctaButtons: autoServiceData.hero.ctaButtons,
    },
    overlaySettings,
    {
      heroImages: autoServiceImages.hero,
      galleryImages: autoServiceImages.gallery,
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
  if (autoServiceData.posts) {
    await seedPosts(payload, autoServiceData.posts)
  }

  // Sample newsletter subscribers for demo
  console.log('\n📧 Creating sample newsletter subscribers...')
  await seedNewsletterSubscribers(payload, [
    { email: 'sofer1@mailinator.com', source: 'website' },
    { email: 'sofer2@mailinator.com', source: 'footer' },
    { email: 'sofer3@mailinator.com', source: 'popup' },
  ])

  // Note: Design variant global has been replaced by unified SiteTheme system
  // Theme is now configured at the start of seeding via seedSiteTheme()

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
  ctaButton?: { show: boolean; label: string; link: string }
  [key: string]: unknown
}

function buildHomepageLayout(variant: DesignVariant) {
  const sectionConfigs: Record<string, BlockConfig> = {
    // NEW: Trust Badges - auto service credibility (grid-3 variant - industrial)
    trustBadges: {
      blockType: 'trust-badges',
      variant: 'grid-3',
      source: 'preset',
      presets: ['warranty', 'experience-years', 'quality', 'fair-price'],
      customValues: {
        experienceYears: 20,
        warrantyPeriod: '2 ani garantie lucrari',
      },
      showDescriptions: true,
      iconSize: 'medium',
      backgroundColor: 'dark',
    },
    // NEW: How It Works - service process (numbered variant - technical)
    howItWorks: {
      blockType: 'how-it-works',
      variant: 'numbered',
      heading: 'Cum Lucram',
      subheading: 'Proces transparent de la receptie la predare',
      steps: [
        {
          title: 'Programare si Receptie',
          description: 'Programeaza-te online sau telefonic, apoi adu masina la service',
          icon: 'Calendar',
        },
        {
          title: 'Diagnoza Computerizata',
          description: 'Verificam masina cu echipamente de ultima generatie',
          icon: 'Settings',
        },
        {
          title: 'Oferta si Aprobare',
          description: 'Primesti deviz detaliat si decizi ce lucrari se executa',
          icon: 'FileText',
        },
        {
          title: 'Reparatie si Predare',
          description: 'Executa lucrarile si predare cu garantie scrisa',
          icon: 'CheckCircle',
        },
      ],
      showNumbers: true,
      ctaButton: {
        show: true,
        label: 'Programeaza Service',
        link: '/programare',
      },
      backgroundColor: 'light',
    },
    // NEW: Logo Cloud - brands we service
    logoCloud: {
      blockType: 'logo-cloud',
      variant: 'simple',
      heading: 'Marci Auto cu care Lucram',
      subheading: 'Experienta cu toate marcile populare',
      logos: [],
      logoSize: 'large',
      columns: '6',
      grayscale: true,
      backgroundColor: 'default',
    },
    // NEW: Opening Hours - program service auto
    openingHours: {
      blockType: 'openingHours',
      variant: 'simple',
      heading: 'Program Service',
      subheading: 'Te așteptăm cu mașina ta',
      source: 'businessInfo',
      showCurrentStatus: true,
      backgroundColor: 'default',
    },
    // NEW: Locations - locatii service
    locations: {
      blockType: 'locations',
      variant: 'cards',
      heading: 'Service-urile Noastre',
      subheading: 'Echipamente moderne și personal calificat',
      locations: [
        {
          name: 'AutoPro - Colentina',
          address: 'Șoseaua Colentina 250',
          city: 'București',
          phone: '0722 777 888',
          email: 'service@autopro.ro',
          schedule: [
            { days: 'Luni - Vineri', hours: '08:00 - 18:00' },
            { days: 'Sâmbătă', hours: '08:00 - 14:00' },
            { days: 'Duminică', hours: 'Închis' },
          ],
          rating: 4.8,
          ctaButton: {
            label: 'Programează Service',
            link: '/programare',
          },
        },
      ],
      showRating: true,
      showSchedule: true,
      backgroundColor: 'light',
    },
    // NEW: Brand Logos - marci auto
    brandLogos: {
      blockType: 'brandLogos',
      variant: 'titled',
      heading: 'Mărci cu care Lucrăm',
      subheading: 'Experiență cu toate mărcile populare din România',
      source: 'custom',
      logos: [],
      grayscale: true,
      logoSize: 'large',
      backgroundColor: 'default',
    },
    // NEW: Timeline - istoria service-ului
    timeline: {
      blockType: 'timeline',
      variant: 'compact',
      heading: 'De 20 de Ani în Slujba Șoferilor',
      subheading: 'Evoluția AutoPro',
      events: [
        {
          year: '2004',
          title: 'Înființare',
          description: 'Am deschis primul service cu 2 rampe',
          icon: 'Wrench',
        },
        {
          year: '2010',
          title: 'Expansiune',
          description: 'Am investit în echipamente de diagnoză computerizată',
          icon: 'Settings',
        },
        {
          year: '2018',
          title: 'ITP Autorizat',
          description: 'Am obținut autorizația pentru inspecții tehnice periodice',
          icon: 'CheckCircle',
        },
        {
          year: '2024',
          title: 'Prezent',
          description: 'Peste 50.000 de mașini reparate cu garanție',
          icon: 'Star',
        },
      ],
      showConnector: true,
      backgroundColor: 'light',
    },
    // NEW: Announcement Bar - oferte service
    announcementBar: {
      blockType: 'announcementBar',
      variant: 'simple',
      messages: [
        {
          text: '🔧 Verificare GRATUITĂ înainte de drum lung!',
          link: '/programare',
          linkText: 'Programează verificarea',
        },
      ],
      icon: 'fire',
      backgroundColor: 'red',
      position: 'top',
      sticky: false,
    },
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
    latestPosts: {
      blockType: 'latestPosts',
      variant: 'grid-3',
      heading: 'Din Blogul Nostru',
      subheading: 'Sfaturi si informatii pentru masina ta',
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
      headline: 'Ai Nevoie de Service Auto?',
      subheadline: 'Programeaza-te online sau suna-ne pentru o consultatie',
      buttons: [{ label: 'Programeaza Online', link: '/programare', variant: 'default' }],
      backgroundColor: 'dark',
    },
  }
  return variant.layout.sections.map((s) => sectionConfigs[s]).filter(Boolean)
}

async function createAdditionalPages(payload: Payload, variant: DesignVariant, formsMap: Map<string, string>) {
  const contactFormId = formsMap.get('Formular de contact')
  const bookingFormId = formsMap.get('Cerere programare')

  await payload.create({
    collection: 'pages',
    data: {
      title: 'Servicii',
      slug: 'servicii',
      heroType: 'minimal',
      hero: { headline: 'Servicii Auto Complete', subheadline: 'De la revizie la reparatii majore' },
      layout: [
        { blockType: 'services', variant: variant.layout.servicesVariant, heading: 'Lista Servicii', source: 'collection', limit: 20, showPrices: true, showIcons: true, backgroundColor: 'default', detailBasePath: '/servicii' },
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
      heroType: 'minimal',
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
      title: 'Preturi',
      slug: 'preturi',
      heroType: 'minimal',
      hero: { headline: 'Lista de Preturi', subheadline: 'Tarife transparente pentru toate serviciile auto' },
      layout: [
        { blockType: 'priceListDotted', variant: 'two-columns', heading: 'Preturi Servicii Auto', source: 'services', limit: 20, showDuration: true, dotStyle: 'dotted', currency: 'RON', backgroundColor: 'default', ctaButton: { show: false } },
        { blockType: 'cta', variant: 'centered', headline: 'Ai nevoie de o oferta personalizata?', subheadline: 'Contacteaza-ne pentru diagnosticare si deviz gratuit', buttons: [{ label: 'Programeaza-te', link: '/programare', variant: 'default' }], backgroundColor: 'light' },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Prices page')

  // Booking page - using FormBlock
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Programare',
      slug: 'programare',
      heroType: 'minimal',
      hero: { headline: 'Programeaza-te Online', subheadline: 'Completeaza formularul' },
      layout: [
        ...(bookingFormId ? [{
          blockType: 'formBlock' as const,
          form: bookingFormId,
          enableIntro: true,
          introContent: {
            root: {
              type: 'root' as const,
              children: [
                { type: 'heading' as const, tag: 'h3' as const, children: [{ type: 'text' as const, text: 'Cerere Programare', format: 0, detail: 0, mode: 'normal' as const, style: '', version: 1 }], direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 },
                { type: 'paragraph' as const, children: [{ type: 'text' as const, text: 'Completeaza formularul si te vom contacta pentru confirmare.', format: 0, detail: 0, mode: 'normal' as const, style: '', version: 1 }], direction: 'ltr' as const, format: '' as const, indent: 0, textFormat: 0, version: 1 },
              ],
              direction: 'ltr' as const,
              format: '' as const,
              indent: 0,
              version: 1,
            },
          },
        }] : []),
        { blockType: 'contact' as const, variant: 'minimal' as const, heading: 'Informatii Service', contactInfoItems: { showAddress: true, showPhone: true, showEmail: true, showWorkingHours: true, showSocial: false }, backgroundColor: 'light' as const },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Booking page')

  // Contact page - 2-column layout
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact',
      slug: 'contact',
      heroType: 'minimal',
      hero: { headline: 'Contact', subheadline: 'Suntem aici sa te ajutam' },
      layout: createContactPageLayout(contactFormId),
      _status: 'published',
    },
  })
  console.log('   Created Contact page')
}
