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
import { restaurantImages, restaurantData } from '../seed-data'
import { getVariant, type DesignVariant } from '../design-variants'

// Get variant from environment or default to 0
const VARIANT_INDEX = parseInt(process.env.DESIGN_VARIANT || '0', 10)

export async function seedRestaurant(payload: Payload) {
  const variant = getVariant('restaurant', VARIANT_INDEX)

  console.log('\n📍 Seeding: Restaurant / Cafenea')
  console.log(`🎨 Design Variant: ${variant.name} (${variant.id})`)
  console.log(`   ${variant.description}`)
  console.log('━'.repeat(50))

  // 1. Create admin user
  await createAdminUser(payload)

  // 2. Upload all images first
  console.log('\n📸 Uploading images from local files...')
  const allImages = [...restaurantImages.hero, ...restaurantImages.team, ...restaurantImages.gallery]
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
    name: restaurantData.business.name,
    tagline: restaurantData.business.tagline,
    description: restaurantData.business.description,
    yearEstablished: restaurantData.business.yearEstablished,
    phone: restaurantData.business.phone,
    email: restaurantData.business.email,
    whatsapp: restaurantData.business.whatsapp,
    address: restaurantData.business.address,
    workingHours: restaurantData.business.workingHours,
    social: restaurantData.business.social,
    stats: restaurantData.business.stats,
    googleMapsEmbed:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2848.8444388671917!2d26.0976553!3d44.4379832!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDTCsDI2JzE2LjciTiAyNsKwMDUnNTEuNiJF!5e0!3m2!1sen!2sro!4v1234567890',
  })

  // 5. Logo
  console.log('\n🏷️ Setting up logo...')
  await seedLogo(payload, {
    type: 'text',
    text: 'La Copac',
  })

  // 6. Header
  console.log('\n📋 Setting up header navigation...')
  await seedHeader(payload, {
    variant: 'standard',
    navItems: restaurantData.navigation,
    ctaButton: {
      enabled: true,
      label: 'Rezerva Masa',
      link: '/rezervare',
      variant: 'default',
    },
  })

  // 7. Footer
  console.log('\n📋 Setting up footer...')
  await seedFooter(payload, {
    variant: 'columns-4',
    columns: [
      {
        title: 'Restaurantul',
        type: 'text',
      },
      {
        title: 'Meniu',
        type: 'links',
        links: [
          { label: 'Mic dejun', type: 'custom', url: '/meniu#micDejun' },
          { label: 'Pranz', type: 'custom', url: '/meniu#pranz' },
          { label: 'Cina', type: 'custom', url: '/meniu#cina' },
          { label: 'Deserturi', type: 'custom', url: '/meniu#deserturi' },
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

  // 8. Services (Menu categories)
  console.log('\n🍽️ Creating menu categories...')
  await seedServices(payload, restaurantData.services)

  // 9. Team with images (if available)
  console.log('\n👥 Creating team members...')
  const teamData = [
    {
      name: 'Chef Alexandru',
      role: 'Bucatar Sef',
      experience: '15 ani experienta',
      featured: true,
      order: 1,
      imageIndex: 0,
      specializations: ['Bucatarie traditionala', 'Fusion', 'Deserturi'],
    },
    {
      name: 'Maria Ionescu',
      role: 'Sous Chef',
      experience: '10 ani experienta',
      featured: true,
      order: 2,
      imageIndex: 1,
      specializations: ['Patiserie', 'Paste proaspete', 'Sosuri'],
    },
    {
      name: 'Andrei Pop',
      role: 'Manager Restaurant',
      experience: '8 ani experienta',
      featured: true,
      order: 3,
      imageIndex: 2,
      specializations: ['Ospitalitate', 'Vinuri', 'Evenimente'],
    },
  ]
  const teamWithImages = teamData.map((member) => ({
    ...member,
    imageId: getImageId(restaurantImages.team[member.imageIndex]?.filename),
  }))
  await seedTeam(payload, teamWithImages)

  // 10. Testimonials
  console.log('\n⭐ Creating testimonials...')
  const testimonials = [
    {
      name: 'Elena M.',
      role: 'Client fidel',
      content:
        'Restaurantul nostru preferat! Mancarea este mereu delicioasa si servirea impecabila. Atmosfera calda ne face sa revenim mereu.',
      rating: '5',
      featured: true,
    },
    {
      name: 'Mihai & Ana',
      role: 'Clienti',
      content:
        'Am sarbatorit aici aniversarea noastra si a fost perfect. Meniul de degustare a fost o experienta culinara de neuitat.',
      rating: '5',
      featured: true,
    },
    {
      name: 'George P.',
      role: 'Client',
      content:
        'Cel mai bun raport calitate-pret din zona. Ingrediente proaspete, portii generoase si preturi corecte. Recomand!',
      rating: '5',
      featured: true,
    },
  ]
  await seedTestimonials(payload, testimonials)

  // 11. FAQ
  console.log('\n❓ Creating FAQ...')
  const faq = [
    {
      question: 'Este necesara rezervarea?',
      answer:
        'Pentru weekend recomandam rezervarea cu cel putin o zi inainte. In timpul saptamanii, de obicei avem locuri disponibile.',
      order: 1,
    },
    {
      question: 'Aveti optiuni pentru alergii alimentare?',
      answer:
        'Da, meniul nostru include informatii despre alergeni. Va rugam sa informati personalul despre orice alergie alimentara.',
      order: 2,
    },
    {
      question: 'Organizati evenimente private?',
      answer:
        'Da! Avem spatiu pentru evenimente de pana la 60 de persoane. Contactati-ne pentru meniuri personalizate.',
      order: 3,
    },
    {
      question: 'Faceti livrari?',
      answer:
        'Da, livram prin partenerii nostri Glovo si Bolt Food in zona metropolitana.',
      order: 4,
    },
  ]
  await seedFAQ(payload, faq)

  // 12. Portfolio/Gallery with images
  console.log('\n🖼️ Creating gallery items...')
  const portfolioItems = restaurantImages.gallery.map((img, index) => ({
    title: `Restaurant ${index + 1}`,
    description: img.alt,
    imageId: getImageId(img.filename) || '',
    featured: index < 4,
    order: index + 1,
  }))
  await seedPortfolio(payload, portfolioItems)

  // 13. Homepage with dynamic layout based on variant
  console.log('\n🏠 Creating homepage...')
  const heroImageId = getImageId(restaurantImages.hero[0]?.filename)
  const homepageLayout = buildHomepageLayout(variant, restaurantData)

  await seedHomePage(payload, {
    heroType: variant.hero.type,
    hero: {
      headline: restaurantData.hero.headline,
      subheadline: restaurantData.hero.subheadline,
      ctaButtons: restaurantData.hero.ctaButtons,
      imageId: heroImageId,
    },
    layout: homepageLayout,
  })

  // 14. Create blog posts
  console.log('\n📝 Creating blog posts...')
  if (restaurantData.posts) {
    await seedPosts(payload, restaurantData.posts)
  }

  // 15. Create additional pages
  console.log('\n📄 Creating additional pages...')
  await createAdditionalPages(payload, variant)

  // 16. Set design variant global
  console.log('\n🎨 Setting design variant global...')
  await seedDesignVariant(payload, {
    businessType: 'restaurant',
    variantIndex: VARIANT_INDEX,
    variantName: variant.name,
    variantDescription: variant.description,
  })

  console.log('\n' + '━'.repeat(50))
  console.log('✅ Restaurant seeding complete!')
  console.log(`🎨 Applied variant: ${variant.name}`)
  console.log('━'.repeat(50))
}

// Build homepage layout based on variant configuration
function buildHomepageLayout(variant: DesignVariant, data: typeof restaurantData) {
  const sectionConfigs: Record<string, any> = {
    services: {
      blockType: 'services',
      variant: variant.layout.servicesVariant,
      heading: 'Meniul Nostru',
      subheading: 'Preparate traditionale gatite cu pasiune',
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
      subheading: 'Profesionisti pasionati de arta culinara',
      source: 'collection',
      onlyFeatured: true,
      limit: 4,
      backgroundColor: 'default',
    },
    testimonials: {
      blockType: 'testimonials',
      variant: variant.layout.testimonialsVariant,
      heading: 'Ce Spun Oaspetii',
      subheading: 'Experiente culinare memorabile',
      source: 'collection',
      onlyFeatured: true,
      showRating: true,
      backgroundColor: 'light',
    },
    gallery: {
      blockType: 'gallery',
      variant: variant.layout.galleryVariant,
      heading: 'Galeria Noastra',
      subheading: 'Imagini din restaurantul nostru',
      source: 'portfolio',
      limit: 6,
      lightbox: true,
      backgroundColor: 'default',
    },
    faq: {
      blockType: 'faq',
      variant: 'accordion',
      heading: 'Intrebari Frecvente',
      subheading: 'Tot ce trebuie sa stii',
      source: 'collection',
      limit: 10,
      defaultOpen: 'first',
      backgroundColor: 'default',
    },
    cta: {
      blockType: 'cta',
      variant: 'centered',
      headline: 'Rezerva o Masa',
      subheadline: 'Te asteptam sa descoperi aromele noastre autentice',
      buttons: [{ label: 'Rezerva Acum', link: '/rezervare', variant: 'default' }],
      backgroundColor: 'dark',
    },
  }

  // Build layout based on variant section order
  return variant.layout.sections.map((sectionName) => sectionConfigs[sectionName]).filter(Boolean)
}

// Create additional pages
async function createAdditionalPages(payload: Payload, variant: DesignVariant) {
  // Menu page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Meniu',
      slug: 'meniu',
      heroType: 'centered',
      hero: {
        headline: 'Meniul Nostru',
        subheadline: 'Preparate traditionale si moderne pentru toate gusturile',
      },
      layout: [
        {
          blockType: 'services',
          variant: variant.layout.servicesVariant,
          heading: 'Toate Preparatele',
          source: 'collection',
          limit: 20,
          showPrices: true,
          showIcons: true,
          backgroundColor: 'default',
        },
        {
          blockType: 'cta',
          variant: 'centered',
          headline: 'Ai gasit ce iti doresti?',
          subheadline: 'Rezerva o masa si bucura-te de preparatele noastre',
          buttons: [{ label: 'Rezerva Masa', link: '/rezervare', variant: 'default' }],
          backgroundColor: 'light',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Menu page')

  // Gallery page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Galerie',
      slug: 'galerie',
      heroType: 'centered',
      hero: {
        headline: 'Galerie',
        subheadline: 'Imagini din restaurantul nostru',
      },
      layout: [
        {
          blockType: 'gallery',
          variant: variant.layout.galleryVariant,
          heading: 'Atmosfera Restaurantului',
          subheading: 'Un loc unde gustul intalneste eleganta',
          source: 'portfolio',
          limit: 20,
          lightbox: true,
          backgroundColor: 'default',
        },
        {
          blockType: 'cta',
          variant: 'centered',
          headline: 'Vino sa ne vizitezi!',
          subheadline: 'Rezerva o masa si descopera atmosfera noastra unica',
          buttons: [{ label: 'Rezerva Masa', link: '/rezervare', variant: 'default' }],
          backgroundColor: 'primary',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Gallery page')

  // About page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Despre Noi',
      slug: 'despre',
      heroType: 'centered',
      hero: {
        headline: 'Despre Noi',
        subheadline: 'Povestea noastra si pasiunea pentru gastronomie',
      },
      layout: [
        {
          blockType: 'team',
          variant: variant.layout.teamVariant,
          heading: 'Echipa Noastra',
          subheading: 'Oamenii din spatele preparatelor delicioase',
          source: 'collection',
          limit: 20,
          showRole: true,
          showBio: true,
          backgroundColor: 'default',
        },
        {
          blockType: 'stats',
          variant: 'grid-4',
          source: 'businessInfo',
          backgroundColor: 'primary',
        },
        {
          blockType: 'testimonials',
          variant: variant.layout.testimonialsVariant,
          heading: 'Pareri Clienti',
          subheading: 'Ce spun oaspetii nostri',
          source: 'collection',
          onlyFeatured: true,
          showRating: true,
          backgroundColor: 'light',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created About page')

  // Reservation page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Rezervare',
      slug: 'rezervare',
      heroType: 'centered',
      hero: {
        headline: 'Rezerva o Masa',
        subheadline: 'Completeaza formularul si te vom contacta pentru confirmare',
      },
      layout: [
        {
          blockType: 'booking',
          variant: 'full',
          heading: 'Formular Rezervare',
          subheading: 'Alege data si numarul de persoane',
          showServiceSelection: false,
          showTeamSelection: false,
          showDatePicker: true,
          showTimePicker: true,
          submitButtonText: 'Trimite Rezervarea',
          successMessage:
            'Rezervarea ta a fost trimisa! Te vom contacta pentru confirmare.',
          showWhatsappOption: true,
          showPhoneOption: true,
          backgroundColor: 'light',
        },
      ],
      _status: 'published',
    },
  })
  console.log('   Created Reservation page')

  // Contact page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact',
      slug: 'contact',
      heroType: 'centered',
      hero: {
        headline: 'Contact',
        subheadline: 'Suntem aici pentru tine. Contacteaza-ne pentru rezervari sau intrebari.',
      },
      layout: [
        {
          blockType: 'contact',
          variant: 'split',
          heading: 'Contacteaza-ne',
          subheading: 'Trimite-ne un mesaj sau vino direct la restaurant',
          showForm: true,
          formFields: {
            showName: true,
            showEmail: true,
            showPhone: true,
            showSubject: false,
            showService: false,
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
