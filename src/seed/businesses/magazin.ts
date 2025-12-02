import type { Payload } from 'payload'
import {
  createAdminUser,
  seedTheme,
  seedBusinessInfo,
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
  seedDesignVariant,
  seedPosts,
} from '../helpers'
import { magazinImages, magazinData } from '../seed-data'
import { getVariant, type DesignVariant } from '../design-variants'

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
  ]
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
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8!2d26.09!3d44.43!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1',
  })

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
    variant: 'columns-4',
    columns: [
      { title: 'Despre Noi', type: 'text' },
      {
        title: 'Categorii',
        type: 'links',
        links: [
          { label: 'Cosmetice Naturale', type: 'custom', url: '/categorii/cosmetice-naturale' },
          { label: 'Alimentatie Bio', type: 'custom', url: '/categorii/alimentatie-bio' },
          { label: 'Suplimente', type: 'custom', url: '/categorii/suplimente-nutritive' },
          { label: 'Casa & Gradina', type: 'custom', url: '/categorii/casa-gradina' },
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
  const homepageLayout = buildHomepageLayout(variant)

  await seedHomePage(payload, {
    heroType: variant.hero.type,
    hero: {
      headline: magazinData.hero.headline,
      subheadline: magazinData.hero.subheadline,
      ctaButtons: magazinData.hero.ctaButtons,
      imageId: heroImageId,
    },
    layout: homepageLayout,
  })

  console.log('\n📄 Creating additional pages...')
  await createAdditionalPages(payload, variant)

  // Create blog posts
  console.log('\n📝 Creating blog posts...')
  if (magazinData.posts) {
    await seedPosts(payload, magazinData.posts)
  }

  console.log('\n🎨 Setting design variant global...')
  await seedDesignVariant(payload, {
    businessType: 'magazin',
    variantIndex: VARIANT_INDEX,
    variantName: variant.name,
    variantDescription: variant.description,
  })

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
  ctaButton?: { enabled: boolean; label: string; link: string }
  backgroundColor?: string
  [key: string]: unknown
}

function buildHomepageLayout(variant: DesignVariant) {
  const sectionConfigs: Record<string, BlockConfig> = {
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

async function createAdditionalPages(payload: Payload, variant: DesignVariant) {
  // Products page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Produse',
      slug: 'produse',
      heroType: 'centered',
      hero: { headline: 'Produsele Noastre', subheadline: 'Descopera gama completa de produse naturale' },
      layout: [
        {
          blockType: 'products',
          variant: 'grid-4',
          heading: 'Toate Produsele',
          source: 'collection',
          limit: 24,
          showPrice: true,
          showSalePrice: true,
          showAddToCart: true,
          backgroundColor: 'default',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Products page')

  // Categories page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Categorii',
      slug: 'categorii',
      heroType: 'centered',
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
                      children: [{ text: 'Alege o categorie pentru a vedea produsele disponibile.', version: 1 }],
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
      heroType: 'centered',
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
                          text: 'EcoShop a fost fondat in 2019 cu o misiune simpla: sa oferim produse naturale, organice si eco-friendly la preturi accesibile. Credem ca fiecare dintre noi poate face alegeri mai bune pentru sanatatea noastra si a planetei.',
                          version: 1,
                        },
                      ],
                      version: 1,
                    },
                    {
                      type: 'paragraph',
                      children: [
                        {
                          text: 'Toate produsele noastre sunt selectate cu grija, de la producatori certificati care respecta standardele cele mai inalte de calitate si sustenabilitate.',
                          version: 1,
                        },
                      ],
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
      heroType: 'centered',
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
      heroType: 'centered',
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

  // Contact page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact',
      slug: 'contact',
      heroType: 'centered',
      hero: { headline: 'Contact', subheadline: 'Suntem aici pentru tine' },
      layout: [
        {
          blockType: 'contact',
          variant: 'split',
          heading: 'Contacteaza-ne',
          showForm: true,
          showContactInfo: true,
          showMap: true,
          mapPosition: 'bottom',
          backgroundColor: 'light',
        },
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
