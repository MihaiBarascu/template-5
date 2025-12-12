import type { Payload } from 'payload'
import {
  createAdminUser,
  seedSiteTheme,
  seedBusinessInfo,
  seedSystemPages,
  seedLogo,
  seedHeader,
  seedFooter,
  seedTestimonials,
  seedFAQ,
  seedHomePage,
  seedPortfolio,
  uploadLocalSeedImages,
  seedProductCategories,
  seedProducts,
  seedPosts,
  seedNewsletterSubscribers,
  seedForms,
  formTemplates,
  createContactPageLayout,
} from '../helpers'
import { magazinImages, magazinData } from '../seed-data'
import { getVariant, getHeroOverlaySettings, type DesignVariant } from '../design-variants'

const VARIANT_INDEX = parseInt(process.env.DESIGN_VARIANT || '0', 10)

export async function seedMagazin(payload: Payload) {
  const variant = getVariant('magazin', VARIANT_INDEX)

  console.log('\n📍 Seeding: Magazin / Online Shop (eCommerce)')
  console.log(`🎨 Design Variant: ${variant.name} (${variant.id})`)
  console.log(`   ${variant.description}`)
  console.log('━'.repeat(50))

  await createAdminUser(payload)

  console.log('\n📸 Uploading images from local files...')
  const allImages = [
    ...magazinImages.hero,
    ...magazinImages.team,
    ...magazinImages.products,
    ...magazinImages.gallery,
    ...magazinImages.locations,
  ]
  const imageMap = await uploadLocalSeedImages(payload, allImages)

  const getImageId = (filename: string): string | undefined => imageMap.get(filename) || undefined

  // Configure theme - use universal variant based on business style
  // Magazin/Shop typically uses fresh-green (natural products) or minimal-black (fashion)
  console.log('\n🎨 Configuring site theme...')
  await seedSiteTheme(payload, {
    variant: 'fresh-green', // Best for shop/magazine - natural, eco-friendly
    borderRadius: variant.theme.borderRadius,
    shadows: variant.theme.shadows,
    sectionSpacing: 'normal',
    // Typography - use fonts from design variant
    headingFont: variant.theme.headingFont,
    bodyFont: variant.theme.bodyFont,
  })

  console.log('\n🏪 Setting up business info...')
  await seedBusinessInfo(payload, {
    name: magazinData.business.name,
    tagline: magazinData.business.tagline,
    description: magazinData.business.description,
    yearEstablished: magazinData.business.yearEstablished,
    phone: magazinData.business.phone,
    email: magazinData.business.email,
    whatsapp: magazinData.business.whatsapp,
    address: magazinData.business.address,
    workingHours: magazinData.business.workingHours,
    social: magazinData.business.social,
    stats: magazinData.business.stats,
    googleMapsEmbed:
      'https://www.google.com/maps?q=Bulevardul+Magheru+50,+Sector+1,+Bucuresti,+Romania&output=embed',
  })

  console.log('\n📄 Setting up system pages (shop config)...')
  await seedSystemPages(payload)

  console.log('\n🏷️ Setting up logo...')
  await seedLogo(payload, { type: 'text', text: 'EcoShop' })

  console.log('\n📋 Setting up header navigation...')
  await seedHeader(payload, {
    variant: 'standard',
    navItems: magazinData.navigation,
    ctaButton: { enabled: true, label: 'Cos', link: '/cos', variant: 'default' },
  })

  console.log('\n📋 Setting up footer...')
  await seedFooter(payload, {
    colorScheme: 'dark',
    variant: 'columns-4',
    columns: [
      { title: 'Despre Noi', type: 'text' },
      {
        title: 'Categorii',
        type: 'links',
        links: [
          { label: 'Cosmetice Naturale', type: 'custom', url: '/produse?categorie=cosmetice-naturale' },
          { label: 'Alimentatie Bio', type: 'custom', url: '/produse?categorie=alimentatie-bio' },
          { label: 'Suplimente', type: 'custom', url: '/produse?categorie=suplimente-nutritive' },
          { label: 'Casa & Gradina', type: 'custom', url: '/produse?categorie=casa-gradina' },
        ],
      },
      { title: 'Program', type: 'schedule' },
      { title: 'Contact', type: 'contact' },
    ],
  })

  console.log('\n📦 Creating product categories...')
  const categoryMap = await seedProductCategories(payload, magazinData.productCategories)

  console.log('\n🛒 Creating products...')
  const productsWithData = magazinData.products.map((product) => ({
    title: product.title,
    slug: product.slug,
    description: product.description,
    price: product.price,
    salePrice: product.salePrice,
    badge: product.badge,
    featured: product.featured,
    categoryId: categoryMap.get(product.category),
    imageId: getImageId(magazinImages.products[product.imageIndex]?.filename),
  }))
  await seedProducts(payload, productsWithData)

  console.log('\n⭐ Creating testimonials...')
  await seedTestimonials(payload, magazinData.testimonials)

  console.log('\n❓ Creating FAQ...')
  await seedFAQ(payload, magazinData.faq)

  console.log('\n🖼️ Creating gallery items...')
  const portfolioItems = magazinImages.gallery.map((img, index) => ({
    title: `Magazin ${index + 1}`,
    description: img.alt,
    imageId: getImageId(img.filename) || '',
    featured: index < 4,
    order: index + 1,
  }))
  await seedPortfolio(payload, portfolioItems)

  console.log('\n🏠 Creating homepage...')
  const heroImageId = getImageId(magazinImages.hero[0]?.filename)
  const homepageLayout = buildHomepageLayout(variant, getImageId)

  const overlaySettings = getHeroOverlaySettings(variant)
  await seedHomePage(payload, {
    heroType: variant.hero.type,
    hero: {
      headline: magazinData.hero.headline,
      subheadline: magazinData.hero.subheadline,
      ctaButtons: magazinData.hero.ctaButtons,
      imageId: heroImageId,
      ...overlaySettings,
    },
    layout: homepageLayout,
  })

  // Create forms
  console.log('\n📝 Creating forms...')
  const formsMap = await seedForms(payload, [
    formTemplates.contact(),
  ])

  console.log('\n📄 Creating additional pages...')
  await createAdditionalPages(payload, variant, formsMap)

  // Create blog posts
  console.log('\n📝 Creating blog posts...')
  if (magazinData.posts) {
    await seedPosts(payload, magazinData.posts)
  }

  // Sample newsletter subscribers for demo
  console.log('\n📧 Creating sample newsletter subscribers...')
  await seedNewsletterSubscribers(payload, [
    { email: 'cumparator1@mailinator.com', source: 'website' },
    { email: 'cumparator2@mailinator.com', source: 'footer' },
    { email: 'cumparator3@mailinator.com', source: 'popup' },
  ])

  // Note: Design variant global has been replaced by unified SiteTheme system
  // Theme is now configured at the start of seeding via seedSiteTheme()

  console.log('\n' + '━'.repeat(50))
  console.log('✅ Magazin seeding complete!')
  console.log(`🎨 Applied variant: ${variant.name}`)
  console.log('🛒 eCommerce enabled with shopping cart')
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
  showPrice?: boolean
  showSalePrice?: boolean
  showAddToCart?: boolean
  showRating?: boolean
  lightbox?: boolean
  defaultOpen?: string
  headline?: string
  subheadline?: string
  buttons?: Array<{ label: string; link: string; variant?: string }>
  ctaButton?: { enabled?: boolean; show?: boolean; label: string; link: string }
  backgroundColor?: string
  [key: string]: unknown
}

function buildHomepageLayout(variant: DesignVariant, getImageId: (filename: string) => string | undefined) {
  const sectionConfigs: Record<string, BlockConfig> = {
    // NEW: Trust Badges - ecommerce credibility (bar variant - ecommerce style)
    trustBadges: {
      blockType: 'trust-badges',
      variant: 'bar',
      source: 'preset',
      presets: ['free-shipping-threshold', 'return-30', 'secure-payment', 'eco-friendly'],
      customValues: {
        shippingThreshold: 200,
      },
      showDescriptions: true,
      iconSize: 'medium',
      backgroundColor: 'light',
    },
    // NEW: How It Works - shopping process (horizontal-cards variant - quick info)
    howItWorks: {
      blockType: 'how-it-works',
      variant: 'horizontal-cards',
      heading: 'Cum Comanzi',
      subheading: 'Shopping simplu si rapid',
      steps: [
        {
          title: 'Alege Produsele',
          description: 'Browse prin gama noastra si adauga in cos',
          icon: 'ShoppingCart',
        },
        {
          title: 'Finalizeaza Comanda',
          description: 'Completeaza datele de livrare si plata',
          icon: 'CreditCard',
        },
        {
          title: 'Livrare Rapida',
          description: 'Primesti coletul in 24-48h',
          icon: 'Truck',
        },
        {
          title: 'Bucura-te!',
          description: 'Produse naturale pentru tine si familia ta',
          icon: 'Heart',
        },
      ],
      showNumbers: true,
      ctaButton: {
        show: true,
        label: 'Incepe Shopping',
        link: '/produse',
      },
      backgroundColor: 'default',
    },
    // NEW: Newsletter for shop - using with-pattern variant for visual impact
    newsletter: {
      blockType: 'newsletter',
      variant: 'with-pattern',
      heading: '10% Reducere la Prima Comanda',
      subheading: 'Aboneaza-te si primesti cod de reducere instant',
      placeholder: 'Email-ul tau',
      buttonText: 'Vreau Reducerea',
      successMessage: 'Codul de reducere a fost trimis pe email!',
      privacyText: 'Nu trimitem spam. Te poti dezabona oricand.',
      benefits: [
        { text: 'Oferte exclusive' },
        { text: 'Produse noi' },
        { text: 'Sfaturi eco' },
      ],
      backgroundColor: 'primary',
    },
    // NEW: Opening Hours - program magazin/showroom
    openingHours: {
      blockType: 'openingHours',
      variant: 'card',
      heading: 'Program Showroom',
      subheading: 'Vizitează-ne și vezi produsele live',
      source: 'businessInfo',
      showCurrentStatus: true,
      backgroundColor: 'default',
    },
    // NEW: Locations - magazin fizic + puncte de ridicare
    locations: {
      blockType: 'locations',
      variant: 'grid-images',
      heading: 'Unde Ne Găsești',
      subheading: 'Showroom și puncte de ridicare comenzi',
      locations: [
        {
          name: 'EcoShop Showroom',
          address: 'Bulevardul Magheru 50',
          city: 'București',
          phone: '0722 444 555',
          email: 'showroom@ecoshop.ro',
          image: getImageId(magazinImages.locations[0]?.filename),
          schedule: [
            { days: 'Luni - Vineri', hours: '10:00 - 20:00' },
            { days: 'Sâmbătă', hours: '10:00 - 18:00' },
            { days: 'Duminică', hours: '12:00 - 18:00' },
          ],
          rating: 4.9,
          ctaButton: {
            label: 'Vezi pe Hartă',
            link: 'https://maps.google.com',
          },
        },
      ],
      showRating: true,
      showSchedule: true,
      backgroundColor: 'light',
    },
    // NEW: Brand Logos - branduri eco/naturale
    brandLogos: {
      blockType: 'brandLogos',
      variant: 'slider',
      heading: 'Branduri Partenere',
      subheading: 'Colaborăm cu producători certificați eco și bio',
      source: 'custom',
      logos: [],
      grayscale: false,
      autoplay: true,
      logoSize: 'medium',
      backgroundColor: 'default',
    },
    // NEW: Timeline - povestea magazinului
    timeline: {
      blockType: 'timeline',
      variant: 'horizontal',
      heading: 'Povestea EcoShop',
      subheading: 'Din pasiune pentru produse naturale',
      events: [
        {
          year: '2019',
          title: 'Lansare',
          description: 'Am lansat magazinul online cu 50 de produse eco',
          icon: 'Leaf',
        },
        {
          year: '2020',
          title: 'Creștere',
          description: 'Pandemia ne-a adus 10x mai mulți clienți conștienți',
          icon: 'TrendingUp',
        },
        {
          year: '2022',
          title: 'Showroom',
          description: 'Am deschis primul showroom fizic în București',
          icon: 'Store',
        },
        {
          year: '2024',
          title: 'Prezent',
          description: 'Peste 2000 de produse și 30.000 de clienți fericiți',
          icon: 'Star',
        },
      ],
      showConnector: true,
      backgroundColor: 'light',
    },
    // NEW: Announcement Bar - oferte si livrare
    announcementBar: {
      blockType: 'announcementBar',
      variant: 'slider',
      messages: [
        {
          text: '🚚 Livrare GRATUITĂ la comenzi peste 200 RON!',
          link: '/produse',
          linkText: 'Cumpără acum',
        },
        {
          text: '🌿 -20% la toate produsele BIO această săptămână!',
          link: '/produse?filter=bio',
          linkText: 'Vezi oferta',
        },
        {
          text: '⭐ Returnare gratuită în 30 de zile',
          link: '/politica-retur',
          linkText: 'Detalii',
        },
      ],
      icon: 'ShoppingBag',
      backgroundColor: 'primary',
      position: 'top',
      sticky: false,
    },
    products: {
      blockType: 'products',
      variant: 'grid-4',
      heading: 'Produse Populare',
      subheading: 'Cele mai vandute produse naturale',
      source: 'collection',
      onlyFeatured: true,
      limit: 8,
      showPrice: true,
      showSalePrice: true,
      showAddToCart: true,
      ctaButton: {
        enabled: true,
        label: 'Vezi toate produsele',
        link: '/produse',
      },
      backgroundColor: 'default',
    },
    stats: {
      blockType: 'stats',
      variant: 'grid-4',
      source: 'businessInfo',
      backgroundColor: 'primary',
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
      subheading: 'Magazinul nostru',
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
      subheading: 'Articole despre produse naturale si stil de viata sanatos',
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
      headline: 'Nu Rata Ofertele Speciale!',
      subheadline: 'Aboneaza-te la newsletter si primesti 10% reducere la prima comanda',
      buttons: [{ label: 'Vezi Ofertele', link: '/produse?filter=sale', variant: 'default' }],
      backgroundColor: 'dark',
    },
  }
  return variant.layout.sections.map((s) => sectionConfigs[s]).filter(Boolean)
}

async function createAdditionalPages(payload: Payload, variant: DesignVariant, formsMap: Map<string, string>) {
  const contactFormId = formsMap.get('Formular de contact')
  // Note: Products page (/produse) is now a dedicated route with filters
  // No need to create it via CMS pages

  // Categories page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Categorii',
      slug: 'categorii',
      heroType: 'minimal',
      hero: { headline: 'Categorii Produse', subheadline: 'Exploreaza pe categorii' },
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
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text: 'Alege o categorie pentru a vedea produsele disponibile.',
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
      ],
      _status: 'published',
    },
  })
  console.log('   Created Categories page')

  // About page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Despre Noi',
      slug: 'despre',
      heroType: 'minimal',
      hero: { headline: 'Despre EcoShop', subheadline: 'Povestea noastra' },
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
                      type: 'paragraph',
                      children: [
                        {
                          type: 'text',
                          text: 'EcoShop a fost fondat in 2019 cu o misiune simpla: sa oferim produse naturale, organice si eco-friendly la preturi accesibile. Credem ca fiecare dintre noi poate face alegeri mai bune pentru sanatatea noastra si a planetei.',
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
                          text: 'Toate produsele noastre sunt selectate cu grija, de la producatori certificati care respecta standardele cele mai inalte de calitate si sustenabilitate.',
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
          source: 'businessInfo',
          backgroundColor: 'light',
        },
        {
          blockType: 'testimonials',
          variant: variant.layout.testimonialsVariant,
          heading: 'Ce Spun Clientii',
          source: 'collection',
          onlyFeatured: true,
          showRating: true,
          backgroundColor: 'default',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created About page')

  // Cart page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Cos de Cumparaturi',
      slug: 'cos',
      heroType: 'minimal',
      hero: { headline: 'Cosul Tau', subheadline: 'Verifica produsele si finalizeaza comanda' },
      layout: [
        {
          blockType: 'cart',
          variant: 'full',
          heading: 'Produsele din cos',
          showQuantitySelector: true,
          showRemoveButton: true,
          showSubtotal: true,
          checkoutButtonText: 'Finalizeaza Comanda',
          checkoutLink: '/checkout',
          emptyCartMessage: 'Cosul tau este gol. Adauga produse pentru a continua.',
          continueShoppingLink: '/produse',
          backgroundColor: 'default',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Cart page')

  // Checkout page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Finalizare Comanda',
      slug: 'checkout',
      heroType: 'minimal',
      hero: { headline: 'Finalizare Comanda', subheadline: 'Completeaza datele pentru livrare' },
      layout: [
        {
          blockType: 'checkout',
          variant: 'full',
          heading: 'Detalii Comanda',
          showOrderSummary: true,
          showShippingOptions: true,
          showPaymentOptions: true,
          submitButtonText: 'Plaseaza Comanda',
          successMessage: 'Multumim pentru comanda! Vei primi un email de confirmare.',
          backgroundColor: 'light',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Checkout page')

  // Contact page - 2-column layout
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact',
      slug: 'contact',
      heroType: 'minimal',
      hero: { headline: 'Contact', subheadline: 'Suntem aici pentru tine' },
      layout: [
        ...(createContactPageLayout(contactFormId) || []),
        {
          blockType: 'faq',
          variant: 'accordion',
          heading: 'Intrebari Frecvente',
          source: 'collection',
          limit: 5,
          defaultOpen: 'first',
          backgroundColor: 'default',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Contact page')
}
