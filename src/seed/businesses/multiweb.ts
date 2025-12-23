import type { Payload } from 'payload'
import {
  createAdminUser,
  seedSiteTheme,
  seedBusinessInfo,
  seedSystemPages,
  seedLogo,
  seedHeader,
  seedFooter,
  seedServices,
  seedTestimonials,
  seedFAQ,
  seedHomePage,
  seedPortfolio,
  uploadLocalSeedImages,
  seedPosts,
  seedForms,
  formTemplates,
  createContactPageLayout,
  buildHeroData,
  createSeederPage,
  type FlexibleLayout,
} from '../helpers'
import { multiwebImages, multiwebData } from '../multiweb-data'
import { getVariant, getHeroOverlaySettings, type DesignVariant } from '../design-variants'

const VARIANT_INDEX = parseInt(process.env.DESIGN_VARIANT || '0', 10)

export async function seedMultiweb(payload: Payload) {
  const variant = getVariant('multiweb', VARIANT_INDEX)

  console.log('\n📍 Seeding: MultiWebsite Agency (Web Development)')
  console.log(`🎨 Design Variant: ${variant.name} (${variant.id})`)
  console.log(`   ${variant.description}`)
  console.log('━'.repeat(50))

  await createAdminUser(payload)

  console.log('\n📸 Uploading images from local files...')
  const allImages = [
    ...multiwebImages.hero,
    ...multiwebImages.portfolio,
    ...multiwebImages.team,
    ...multiwebImages.gallery,
  ]
  const imageMap = await uploadLocalSeedImages(payload, allImages)

  const getImageId = (filename: string): string | undefined => imageMap.get(filename) || undefined

  // Configure theme using design variant
  console.log('\n🎨 Configuring site theme...')
  await seedSiteTheme(payload, {
    variant: 'purple-premium', // Modern agency look (closest to indigo)
    borderRadius: variant.theme.borderRadius,
    shadows: variant.theme.shadows,
    sectionSpacing: variant.theme.sectionSpacing || 'spacious',
    headingScale: variant.theme.headingScale || 'large',
    bodyTextSize: variant.theme.bodyTextSize || 'normal',
    cardGap: variant.theme.cardGap || 'spacious',
    animations: variant.theme.animations || 'dynamic',
    // Typography - use fonts from design variant
    headingFont: variant.theme.headingFont,
    bodyFont: variant.theme.bodyFont,
  })

  console.log('\n🏢 Setting up business info...')
  await seedBusinessInfo(payload, {
    name: multiwebData.business.name,
    tagline: multiwebData.business.tagline,
    description: multiwebData.business.description,
    yearEstablished: multiwebData.business.yearEstablished,
    phone: multiwebData.business.phone,
    email: multiwebData.business.email,
    whatsapp: multiwebData.business.whatsapp,
    address: multiwebData.business.address,
    workingHours: multiwebData.business.workingHours,
    social: multiwebData.business.social,
    stats: multiwebData.business.stats,
    // WhatsApp Float settings
    whatsappFloat: {
      enabled: true,
      position: 'bottom-right',
      showOnMobile: true,
      defaultMessage: 'Buna! Doresc informatii despre serviciile de web development.',
      tooltipText: 'Scrie-ne pe WhatsApp',
      pulseAnimation: true,
    },
    // Floating CTA Button
    floatingCta: {
      enabled: true,
      text: 'Solicită Ofertă',
      href: '/contact',
      variant: 'gradient',
      icon: 'arrow',
      position: 'bottom-center',
      shape: 'pill',
      showOnMobile: true,
      pulseAnimation: true,
      dismissible: true,
      showAfterScroll: 400,
    },
  })

  console.log('\n📄 Setting up system pages...')
  await seedSystemPages(payload)

  console.log('\n🏷️ Setting up logo...')
  await seedLogo(payload, { type: 'text', text: 'MultiWebsite' })

  console.log('\n📋 Setting up header navigation...')
  await seedHeader(payload, {
    variant: 'standard',
    navItems: multiwebData.navigation,
    ctaButton: { enabled: true, label: 'Solicită Ofertă', link: '/contact', variant: 'default' },
  })

  console.log('\n📋 Setting up footer...')
  await seedFooter(payload, {
    colorScheme: 'dark',
    variant: 'columns-4',
    columns: [
      { title: 'Despre Noi', type: 'text' },
      {
        title: 'Servicii',
        type: 'links',
        links: [
          { label: 'Website Prezentare', type: 'custom', url: '/servicii#prezentare' },
          { label: 'Magazin Online', type: 'custom', url: '/servicii#ecommerce' },
          { label: 'Website Premium', type: 'custom', url: '/servicii#premium' },
          { label: 'Mentenanță', type: 'custom', url: '/servicii#mentenanta' },
        ],
      },
      {
        title: 'Portofoliu',
        type: 'links',
        links: [
          { label: 'Toate Proiectele', type: 'custom', url: '/portofoliu' },
          { label: 'Frizerii', type: 'custom', url: '/portofoliu?cat=frizerie' },
          { label: 'Restaurante', type: 'custom', url: '/portofoliu?cat=restaurant' },
          { label: 'Magazine', type: 'custom', url: '/portofoliu?cat=ecommerce' },
        ],
      },
      { title: 'Contact', type: 'contact' },
    ],
  })

  console.log('\n🛠️ Creating services...')
  await seedServices(payload, multiwebData.services)

  console.log('\n⭐ Creating testimonials...')
  await seedTestimonials(payload, multiwebData.testimonials)

  console.log('\n❓ Creating FAQ...')
  await seedFAQ(payload, multiwebData.faq)

  console.log('\n🖼️ Creating portfolio items (demo websites)...')
  const portfolioItems = multiwebData.portfolioItems.map((item, index) => ({
    title: item.title,
    description: item.description,
    imageId: getImageId(multiwebImages.portfolio[item.imageIndex]?.filename) || '',
    featured: item.featured,
    order: index + 1,
    // Additional portfolio fields if available
    category: item.category,
    externalUrl: item.externalUrl,
    tags: item.tags,
  }))
  await seedPortfolio(payload, portfolioItems)

  console.log('\n🏠 Creating homepage...')
  const homepageLayout = buildHomepageLayout(variant, getImageId)
  const overlaySettings = getHeroOverlaySettings(variant)

  // Build hero data
  const heroData = buildHeroData(
    variant.hero.type,
    {
      headline: multiwebData.hero.headline,
      subheadline: multiwebData.hero.subheadline,
      ctaButtons: multiwebData.hero.ctaButtons,
    },
    overlaySettings,
    {
      heroImages: multiwebImages.hero,
      galleryImages: multiwebImages.gallery,
      getImageId,
    },
    {
      yearsExperience: new Date().getFullYear() - multiwebData.business.yearEstablished,
    }
  )

  await seedHomePage(payload, {
    heroType: variant.hero.type,
    hero: heroData,
    layout: homepageLayout,
  })

  // Create forms
  console.log('\n📝 Creating forms...')
  const formsMap = await seedForms(payload, [
    formTemplates.contact(),
  ])

  console.log('\n📄 Creating additional pages...')
  await createAdditionalPages(payload, variant, formsMap, getImageId)

  // Create blog posts
  console.log('\n📝 Creating blog posts...')
  if (multiwebData.posts) {
    await seedPosts(payload, multiwebData.posts)
  }

  console.log('\n' + '━'.repeat(50))
  console.log('✅ MultiWebsite Agency seeding complete!')
  console.log(`🎨 Applied variant: ${variant.name}`)
  console.log('🌐 Agency website with portfolio showcase')
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
  defaultOpen?: string
  headline?: string
  subheadline?: string
  buttons?: Array<{ label: string; link: string; variant?: string }>
  ctaButton?: { enabled?: boolean; show?: boolean; label: string; link: string }
  backgroundColor?: string
  steps?: Array<{ title: string; description: string; icon?: string }>
  showNumbers?: boolean
  showRating?: boolean
  showImage?: boolean
  showCategory?: boolean
  showDate?: boolean
  showExcerpt?: boolean
  [key: string]: unknown
}

function buildHomepageLayout(variant: DesignVariant, getImageId: (filename: string) => string | undefined) {
  const sectionConfigs: Record<string, BlockConfig> = {
    // Stats - showcase numbers
    stats: {
      blockType: 'stats',
      variant: 'grid-4',
      source: 'businessInfo',
      backgroundColor: 'dark',
    },
    // Portfolio - showcase demo websites
    portfolio: {
      blockType: 'portfolio',
      variant: 'grid-masonry',
      heading: 'Portofoliul Nostru',
      subheading: 'Website-uri realizate pentru clienți din diverse industrii',
      source: 'collection',
      onlyFeatured: true,
      limit: 6,
      showDescription: true,
      ctaButton: {
        enabled: true,
        label: 'Vezi toate proiectele',
        link: '/portofoliu',
      },
      backgroundColor: 'light',
    },
    // Services
    services: {
      blockType: 'services',
      variant: variant.layout.servicesVariant,
      heading: 'Serviciile Noastre',
      subheading: 'Soluții complete de web development pentru afacerea ta',
      source: 'collection',
      onlyFeatured: true,
      limit: 4,
      ctaButton: {
        enabled: true,
        label: 'Vezi toate serviciile',
        link: '/servicii',
      },
      backgroundColor: 'default',
    },
    // How It Works - process steps
    howItWorks: {
      blockType: 'how-it-works',
      variant: 'horizontal-cards',
      heading: 'Cum Funcționează',
      subheading: 'Procesul nostru simplu și transparent',
      steps: multiwebData.howItWorks,
      showNumbers: true,
      ctaButton: {
        show: true,
        label: 'Contactează-ne',
        link: '/contact',
      },
      backgroundColor: 'light',
    },
    // Testimonials
    testimonials: {
      blockType: 'testimonials',
      variant: variant.layout.testimonialsVariant,
      heading: 'Ce Spun Clienții',
      subheading: 'Feedback de la afaceri care ne-au ales',
      source: 'collection',
      onlyFeatured: true,
      showRating: true,
      backgroundColor: 'default',
    },
    // FAQ
    faq: {
      blockType: 'faq',
      variant: 'accordion',
      heading: 'Întrebări Frecvente',
      subheading: 'Răspunsuri la cele mai comune întrebări',
      source: 'collection',
      limit: 6,
      defaultOpen: 'first',
      backgroundColor: 'light',
    },
    // Latest Posts
    latestPosts: {
      blockType: 'latestPosts',
      variant: 'grid-3',
      heading: 'Din Blogul Nostru',
      subheading: 'Articole și sfaturi despre web development',
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
      backgroundColor: 'default',
    },
    // CTA
    cta: {
      blockType: 'cta',
      variant: 'centered',
      headline: 'Pregătit pentru un Website Nou?',
      subheadline: 'Discută cu noi despre proiectul tău. Consultația este gratuită!',
      buttons: [
        { label: 'Solicită Ofertă Gratuită', link: '/contact', variant: 'default' },
        { label: 'Vezi Portofoliul', link: '/portofoliu', variant: 'outline' },
      ],
      backgroundColor: 'dark',
    },
  }

  return variant.layout.sections.map((s) => sectionConfigs[s]).filter(Boolean)
}

async function createAdditionalPages(
  payload: Payload,
  variant: DesignVariant,
  formsMap: Map<string, string>,
  getImageId: (filename: string) => string | undefined
) {
  const contactFormId = formsMap.get('Formular de contact')

  // Portfolio page
  await createSeederPage(payload, {
    title: 'Portofoliu',
    slug: 'portofoliu',
    heroType: 'minimal',
    hero: {
      headline: 'Portofoliul Nostru',
      subheadline: 'Website-uri realizate pentru clienți din diverse industrii',
    },
    layout: [
      {
        blockType: 'portfolio',
        variant: 'grid-masonry',
        showDescription: true,
        limit: 20,
        backgroundColor: 'default',
      },
      {
        blockType: 'cta',
        variant: 'centered',
        headline: 'Îți place ce vezi?',
        subheadline: 'Hai să discutăm despre proiectul tău',
        buttons: [{ label: 'Solicită Ofertă', link: '/contact', variant: 'default' }],
        backgroundColor: 'dark',
      },
    ],
    _status: 'published',
  })
  console.log('   Created Portfolio page')

  // Services page
  await createSeederPage(payload, {
    title: 'Servicii',
    slug: 'servicii',
    heroType: 'minimal',
    hero: {
      headline: 'Serviciile Noastre',
      subheadline: 'Soluții complete de web development pentru orice tip de afacere',
    },
    layout: [
      {
        blockType: 'services',
        variant: 'grid-2',
        limit: 10,
        backgroundColor: 'default',
      },
      {
        blockType: 'how-it-works',
        variant: 'horizontal-cards',
        heading: 'Procesul Nostru',
        subheading: 'De la idee la website funcțional',
        steps: multiwebData.howItWorks,
        showNumbers: true,
        backgroundColor: 'light',
      },
      {
        blockType: 'faq',
        variant: 'accordion',
        heading: 'Întrebări Frecvente',
        limit: 6,
        backgroundColor: 'default',
      },
      {
        blockType: 'cta',
        variant: 'centered',
        headline: 'Pregătit să Începem?',
        subheadline: 'Consultația inițială este gratuită',
        buttons: [{ label: 'Contactează-ne', link: '/contact', variant: 'default' }],
        backgroundColor: 'dark',
      },
    ],
    _status: 'published',
  })
  console.log('   Created Services page')

  // About page
  await createSeederPage(payload, {
    title: 'Despre Noi',
    slug: 'despre',
    heroType: 'minimal',
    hero: {
      headline: 'Despre MultiWebsite',
      subheadline: 'Echipa din spatele website-urilor de succes',
    },
    layout: [
      {
        blockType: 'content',
        columns: [
          {
            width: 'full',
            contentType: 'richText',
            richText: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'heading',
                    tag: 'h2',
                    children: [
                      {
                        type: 'text',
                        text: 'Misiunea Noastră',
                        format: 0,
                        detail: 0,
                        mode: 'normal',
                        style: '',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    version: 1,
                  },
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'La MultiWebsite, credem că fiecare afacere merită un website profesional care să o reprezinte corect în mediul online. Suntem pasionați de web development și dedicați să oferim soluții accesibile pentru afaceri mici și medii din România.',
                        format: 0,
                        detail: 0,
                        mode: 'normal',
                        style: '',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    textFormat: 0,
                    version: 1,
                  },
                  {
                    type: 'paragraph',
                    children: [
                      {
                        type: 'text',
                        text: 'Cu experiență în dezvoltarea de website-uri pentru diverse industrii - de la frizerii și cabinete medicale până la restaurante și magazine online - înțelegem nevoile specifice ale fiecărui tip de afacere.',
                        format: 0,
                        detail: 0,
                        mode: 'normal',
                        style: '',
                        version: 1,
                      },
                    ],
                    direction: 'ltr',
                    format: '',
                    indent: 0,
                    textFormat: 0,
                    version: 1,
                  },
                ],
                direction: 'ltr',
                format: '',
                indent: 0,
                version: 1,
              },
            },
          },
        ],
        backgroundColor: 'default',
      },
      {
        blockType: 'stats',
        variant: 'grid-4',
        backgroundColor: 'dark',
      },
      {
        blockType: 'testimonials',
        variant: variant.layout.testimonialsVariant,
        heading: 'Ce Spun Clienții',
        onlyFeatured: true,
        backgroundColor: 'light',
      },
      {
        blockType: 'cta',
        variant: 'centered',
        headline: 'Vrei să Lucrăm Împreună?',
        subheadline: 'Discută cu noi despre proiectul tău',
        buttons: [{ label: 'Contactează-ne', link: '/contact', variant: 'default' }],
        backgroundColor: 'dark',
      },
    ],
    _status: 'published',
  })
  console.log('   Created About page')

  // Contact page
  await createSeederPage(payload, {
    title: 'Contact',
    slug: 'contact',
    heroType: 'minimal',
    hero: {
      headline: 'Contactează-ne',
      subheadline: 'Suntem aici să răspundem la întrebările tale',
    },
    layout: [
      ...(createContactPageLayout(contactFormId) || []),
      {
        blockType: 'faq',
        variant: 'accordion',
        heading: 'Întrebări Frecvente',
        limit: 5,
        backgroundColor: 'default',
      },
    ],
    _status: 'published',
  })
  console.log('   Created Contact page')
}
