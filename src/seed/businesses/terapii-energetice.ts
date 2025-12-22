import type { Payload } from 'payload'
import {
  createAdminUser,
  seedSiteTheme,
  seedBusinessInfo,
  seedSystemPages,
  seedLogo,
  seedHeader,
  seedFooter,
  seedServiceCategories,
  seedServices,
  seedTestimonialCategories,
  seedTestimonials,
  seedFAQ,
  seedTeam,
  seedForms,
  formTemplates,
  createContactPageLayout,
  uploadLocalSeedImages,
} from '../helpers'
import { terapiiEnergeticeData, terapiiEnergeticeImages } from '../terapii-energetice-data'
import { getVariant, type DesignVariant } from '../design-variants'

const VARIANT_INDEX = parseInt(process.env.DESIGN_VARIANT || '0', 10)

export async function seedTerapiiEnergetice(payload: Payload) {
  const variant = getVariant('terapii-energetice', VARIANT_INDEX)

  console.log('\n📍 Seeding: Terapii Energetice (Wellness & Healing)')
  console.log(`🎨 Design Variant: ${variant.name} (${variant.id}) - PLASTURI DESIGN`)
  console.log(`   ${variant.description}`)
  console.log('━'.repeat(50))

  await createAdminUser(payload)

  // Upload all images first
  console.log('\n📸 Uploading images from local files...')
  const allImages = [
    ...terapiiEnergeticeImages.hero,
    terapiiEnergeticeImages.banner,
    ...terapiiEnergeticeImages.services,
    ...terapiiEnergeticeImages.courseImages,
    terapiiEnergeticeImages.logo,
    ...terapiiEnergeticeImages.team,
    ...terapiiEnergeticeImages.gallery,
    ...terapiiEnergeticeImages.therapies,
  ]
  const imageMap = await uploadLocalSeedImages(payload, allImages)

  // Helper to get image ID by filename
  const getImageId = (filename: string): string | undefined => imageMap.get(filename) || undefined

  // Create therapy image map by service title
  const therapyImageMap = new Map<string, string>()
  for (const therapy of terapiiEnergeticeImages.therapies) {
    const imageId = getImageId(therapy.filename)
    if (imageId) {
      therapyImageMap.set(therapy.serviceTitle, imageId)
    }
  }

  // Create course image map by course title
  const courseImageMap = new Map<string, string>()
  for (const course of terapiiEnergeticeImages.courseImages) {
    const imageId = getImageId(course.filename)
    if (imageId) {
      courseImageMap.set(course.courseTitle, imageId)
    }
  }

  // Configure theme using design variant - Gold & Navy colors from terapiienergetice.ro
  // PLASTURI DESIGN: Prompt font, light heading weight (400), pill buttons
  console.log('\n🎨 Configuring site theme (Gold & Navy - Plasturi Design)...')
  await seedSiteTheme(payload, {
    variant: 'revital-harmony',
    borderRadius: variant.theme.borderRadius,
    shadows: 'none', // Plasturi design - flat, no shadows
    sectionSpacing: 'spacious',
    headingScale: 'small',
    bodyTextSize: 'large',
    cardGap: 'spacious',
    animations: 'moderate',
    // Plasturi fonts - Prompt for headings, Open Sans for body
    headingFont: 'Prompt',
    bodyFont: 'Open_Sans',
    // Plasturi heading weight - light (400) for clean/flat look
    headingWeight: '400',
    // Plasturi button styling - pill buttons
    useCustomButtons: true,
    buttonRounding: 'pill',
    buttonTextTransform: 'none',
    buttonFontWeight: '500',
    buttonPadding: 'normal',
    // Colors
    useCustomColors: true,
    colors: variant.theme.colors,
  })

  console.log('\n🏢 Setting up business info...')
  await seedBusinessInfo(payload, {
    name: terapiiEnergeticeData.business.name,
    tagline: terapiiEnergeticeData.business.tagline,
    description: terapiiEnergeticeData.business.description,
    yearEstablished: terapiiEnergeticeData.business.yearEstablished,
    phone: terapiiEnergeticeData.business.phone,
    email: terapiiEnergeticeData.business.email,
    whatsapp: terapiiEnergeticeData.business.whatsapp,
    address: terapiiEnergeticeData.business.address,
    workingHours: terapiiEnergeticeData.business.workingHours,
    social: terapiiEnergeticeData.business.social,
    stats: terapiiEnergeticeData.business.stats,
    googleMapsEmbed:
      'https://www.google.com/maps?q=Bulevardul+Decebal+9,+Sector+3,+Bucuresti,+Romania&output=embed',
    whatsappFloat: {
      enabled: true,
      position: 'bottom-right',
      showOnMobile: true,
      defaultMessage: 'Buna! Doresc sa fac o programare pentru terapie.',
      tooltipText: 'Programeaza-te pe WhatsApp',
      pulseAnimation: true,
    },
    announcementBar: {
      enabled: false,
    },
    floatingCta: {
      enabled: true,
      text: 'Abonează-te Acum',
      href: '/contact',
      variant: 'gradient',
      icon: 'arrow',
      position: 'bottom-center',
      shape: 'rectangle', // Similar cu Plasturi - colțuri rotunjite, nu pill
      showOnMobile: true,
      pulseAnimation: true,
      dismissible: false, // Fără X, ca pe plasturi
      showAfterScroll: 300,
    },
  })

  console.log('\n📄 Setting up system pages...')
  await seedSystemPages(payload)

  console.log('\n🏷️ Setting up logo...')
  await seedLogo(payload, { type: 'text', text: 'Revital Harmony' })

  console.log('\n📋 Setting up header navigation (PLASTURI DESIGN full-width + Transparent)...')
  await seedHeader(payload, {
    variant: 'full-width', // Full-width header fără container, ca pe plasturi
    isTransparent: true, // Header transparent overlay peste Video Hero
    transparentTextColor: 'white', // Text alb pe fundal video întunecat
    navItems: terapiiEnergeticeData.navigation,
    ctaButton: { enabled: false }, // Fără buton CTA în header, ca pe plasturi
    topBar: {
      backgroundColor: 'dark',
      layout: 'social-left',
      showPhone: true,
      showEmail: true,
      showSocial: true,
      showWorkingHours: false,
      customText: '', // Explicitly clear any custom text
    },
  })

  console.log('\n📋 Setting up footer...')
  await seedFooter(payload, {
    colorScheme: 'dark',
    variant: 'columns-4',
    columns: [
      { title: 'Despre Noi', type: 'text' },
      {
        title: 'Terapii',
        type: 'links',
        links: [
          { label: 'Terapia Bowen', type: 'custom', url: '/terapii#bowen' },
          { label: 'Access Bars', type: 'custom', url: '/terapii#access-bars' },
          { label: 'Facelift Energetic', type: 'custom', url: '/terapii#facelift' },
          { label: 'Terapie Reiki', type: 'custom', url: '/terapii#reiki' },
        ],
      },
      {
        title: 'Cursuri',
        type: 'links',
        links: [
          { label: 'Curs Access Bars', type: 'custom', url: '/cursuri#access-bars' },
          { label: 'Curs Facelift', type: 'custom', url: '/cursuri#facelift' },
        ],
      },
      { title: 'Contact', type: 'contact' },
    ],
  })

  // Create service categories (Terapii and Cursuri)
  console.log('\n📁 Creating service categories...')
  const categoryMap = await seedServiceCategories(payload, [
    { title: 'Terapii', description: 'Terapii energetice pentru echilibru și vindecare', icon: 'Heart', order: 1 },
    { title: 'Cursuri', description: 'Cursuri de certificare internațională', icon: 'GraduationCap', order: 2 },
  ])
  const terapiiCategoryId = categoryMap.get('Terapii')
  const cursuriCategoryId = categoryMap.get('Cursuri')

  console.log('\n🛠️ Creating services (therapies)...')
  // Map services to include their images, category, and set displayStyle to card-image
  const servicesWithImages = terapiiEnergeticeData.services.map((service) => ({
    ...service,
    categoryId: terapiiCategoryId,
    imageId: therapyImageMap.get(service.title),
    displayStyle: 'card-image' as const, // Show service images in cards
    backLabel: '← Înapoi la terapii',
    backLink: '/terapii',
  }))
  await seedServices(payload, servicesWithImages)

  // Create course services from courses data (uses rich text description like therapies)
  console.log('\n📚 Creating services (courses)...')
  const courseServices = terapiiEnergeticeData.courses.map((course, index) => ({
    title: course.title,
    shortDescription: course.shortDescription,
    // Rich text description (same format as therapies via getter)
    description: course.description,
    icon: course.title.includes('Bars') ? 'Brain' : 'Sparkles',
    // Course image from original site
    imageId: courseImageMap.get(course.title),
    price: `${course.price} RON`,
    duration: course.duration,
    featured: course.featured,
    order: 100 + index, // After therapies
    categoryId: cursuriCategoryId,
    displayStyle: 'card-image' as const, // Show course images in cards
    // Course-specific attributes for pricing variations
    attributes: [
      ...(course.priceRepeat ? [{ label: 'Preț reluare', value: `${course.priceRepeat} RON`, icon: 'RefreshCw' }] : []),
      ...('priceAdolescent' in course && course.priceAdolescent ? [{ label: 'Adolescenți (16-18 ani)', value: `${course.priceAdolescent} RON`, icon: 'User' }] : []),
      ...('priceChild' in course && course.priceChild !== undefined ? [{ label: 'Copii (sub 16 ani)', value: course.priceChild === 0 ? 'GRATUIT' : `${course.priceChild} RON`, icon: 'Baby' }] : []),
      { label: 'Certificare', value: course.certification, icon: 'Award' },
    ],
    // Course features directly from data file
    features: course.features,
    ctaLabel: 'Înscrie-te la curs',
    ctaLink: '/contact',
    backLabel: '← Înapoi la cursuri',
    backLink: '/cursuri',
  }))
  await seedServices(payload, courseServices)

  // Create testimonial categories (for grouping testimonials by therapy type)
  console.log('\n📁 Creating testimonial categories...')
  const testimonialCategoryMap = await seedTestimonialCategories(payload, [
    { title: 'Facelift Energetic', icon: 'Sparkles', order: 1 },
    { title: 'Terapia Reiki', icon: 'Heart', order: 2 },
    { title: 'Eliberarea Tensiunii Interioare', icon: 'Leaf', order: 3 },
    { title: 'Access Bars', icon: 'Brain', order: 4 },
    { title: 'Corecție Bioenergetică', icon: 'Zap', order: 5 },
    { title: 'Terapia Bowen', icon: 'Hand', order: 6 },
  ])

  console.log('\n⭐ Creating testimonials...')
  // Map testimonials with their category IDs based on therapy field
  const testimonialsWithCategories = terapiiEnergeticeData.testimonials.map((testimonial) => {
    // Find category ID based on therapy name
    let categoryId: string | undefined
    if (testimonial.therapy) {
      // Try exact match first
      categoryId = testimonialCategoryMap.get(testimonial.therapy)
      // If no exact match, try partial match
      if (!categoryId) {
        for (const [categoryName, id] of testimonialCategoryMap.entries()) {
          if (testimonial.therapy.toLowerCase().includes(categoryName.toLowerCase()) ||
              categoryName.toLowerCase().includes(testimonial.therapy.toLowerCase())) {
            categoryId = id
            break
          }
        }
      }
    }
    return {
      name: testimonial.name,
      role: testimonial.role,
      content: testimonial.content,
      rating: testimonial.rating,
      featured: testimonial.featured,
      categoryId,
    }
  })
  await seedTestimonials(payload, testimonialsWithCategories)

  console.log('\n❓ Creating FAQ...')
  await seedFAQ(payload, terapiiEnergeticeData.faq)

  console.log('\n👥 Creating team...')
  // Map team members with their images
  const teamWithImages = terapiiEnergeticeData.team.map((member, index) => ({
    ...member,
    imageId: getImageId(terapiiEnergeticeImages.team[index]?.filename),
  }))
  await seedTeam(payload, teamWithImages)

  // Create homepage with PLASTURI DESIGN - VideoHero + ProcessSteps + Timeline
  console.log('\n🏠 Creating homepage with PLASTURI DESIGN...')
  await createPlasturiHomepage(payload, variant, getImageId, terapiiCategoryId, cursuriCategoryId)

  // Create forms
  console.log('\n📝 Creating forms...')
  const serviceOptions = terapiiEnergeticeData.services.map((s) => ({
    label: s.title,
    value: s.title,
  }))
  const formsMap = await seedForms(payload, [
    formTemplates.contact(),
    formTemplates.booking(serviceOptions),
  ])

  console.log('\n📄 Creating additional pages...')
  await createAdditionalPages(payload, variant, formsMap, getImageId, {
    terapiiCategoryId,
    cursuriCategoryId,
  })

  console.log('\n' + '━'.repeat(50))
  console.log('✅ Terapii Energetice seeding complete!')
  console.log(`🎨 Applied variant: ${variant.name}`)
  console.log('🌐 Wellness & healing website ready')
  console.log('━'.repeat(50))
}

/**
 * PLASTURI DESIGN - Homepage with VideoHero, ProcessSteps, Timeline
 * Design inspirat din Plasturi cu culorile Gold & Navy de pe terapiienergetice.ro
 */
async function createPlasturiHomepage(
  payload: Payload,
  variant: DesignVariant,
  getImageId: (filename: string) => string | undefined,
  terapiiCategoryId: string | undefined,
  cursuriCategoryId: string | undefined
) {
  // Layout array with all Plasturi design blocks
  const plasturiLayout = [
    // 1. VIDEO HERO SECTION - Carousel layout pentru Terapii + Cursuri
    {
      blockType: 'video-hero' as const,
      variant: 'carousel', // Carousel Hero pentru slideshow content
      videoSource: 'url',
      videoUrl: '/videos/hero-home.mp4', // Local meditation video from Mixkit
      overlayColor: 'rgba(26, 26, 46, 0.7)', // Navy overlay (mai intens pentru lizibilitate)
      overlayOpacity: 70,
      carouselSlides: [
        {
          headline: 'Cursuri Terapii Energetice',
          subheadline: 'Descopera Cursurile sustinute de Monica Batir! Suna Acum pentru Rezervare!',
          ctaButtons: [
            {
              label: 'Contacteaza-ne',
              link: '/contact',
              variant: 'primary',
              pillShape: true,
            },
          ],
        },
        {
          headline: 'Descopera Terapiile Energetice',
          subheadline: 'Descopera Terapiile Energetice aplicate de Monica Batir! Suna Acum pentru Programare!',
          ctaButtons: [
            {
              label: 'Mai Multe Informatii',
              link: '/terapii',
              variant: 'secondary',
              pillShape: true,
            },
          ],
        },
      ],
      // Carousel settings
      carouselAutoplay: true,
      carouselSpeed: 6000, // ms între slide-uri
      carouselShowNavigation: true, // ← → Săgeți stânga/dreapta
      carouselShowDots: false, // ● ○ ○ Indicatori jos (dezactivat)
      textAlignment: 'left',
      height: 'fullscreen',
      showScrollIndicator: true,
    },

    // 1.1 TRUST BADGES - PLASTURI DESIGN feature (sub VideoHero)
    {
      blockType: 'trust-badges' as const,
      variant: 'minimal',
      presets: ['certified', 'non-invasive', 'money-back-30'],
      backgroundColor: 'default',
    },

    // 2. ABOUT SECTION - Team featured
    {
      blockType: 'team' as const,
      variant: 'featured',
      heading: 'Bine ai venit la Revital Harmony',
      subheading: 'Sunt Monica Batir, psiholog și terapeut holistic cu peste 8 ani de experiență în vindecarea energetică. Cabinetul meu din București oferă un spațiu sigur pentru transformarea ta personală.',
      source: 'collection',
      onlyFeatured: true,
      backgroundColor: 'default',
      detailBasePath: '/echipa',
    },

    // 3. PROCESS STEPS - Zigzag layout (Plasturi signature)
    {
      blockType: 'process-steps' as const,
      variant: 'zigzag',
      heading: 'Cum Funcționează Terapia',
      subheading: 'Un proces simplu și relaxant pentru echilibru și vindecare',
      steps: [
        {
          title: 'Consultație Inițială',
          description:
            'Discutăm despre starea ta de sănătate, obiectivele tale și alegem împreună terapia potrivită. Prima consultație durează aproximativ 30 de minute și este GRATUITĂ.',
          icon: 'ClipboardCheck',
          badge: 'Pasul 1',
        },
        {
          title: 'Ședința de Terapie',
          description:
            'Te relaxezi pe masă în timp ce lucrez cu energia corpului tău. Ședința durează între 60-90 minute. Nu trebuie să faci nimic - doar să te lași purtat de energie.',
          icon: 'Heart',
          badge: 'Pasul 2',
        },
        {
          title: 'Integrare și Echilibru',
          description:
            'După ședință, corpul continuă procesul de vindecare. Îți ofer recomandări personalizate și stabilim împreună următorii pași pentru a menține echilibrul energetic.',
          icon: 'Star',
          badge: 'Pasul 3',
        },
      ],
      showNumbers: true,
      showConnectors: true,
      imagePosition: 'right',
      ctaButton: {
        enabled: true,
        label: 'Programează Consultația Gratuită',
        link: '/contact',
      },
      backgroundColor: 'light',
    },

    // 3.1 DOWNLOAD LINKS - Materiale informative (Plasturi style)
    {
      blockType: 'download-links' as const,
      variant: 'buttons',
      links: [
        {
          label: 'Descarcă Ghidul Terapiilor',
          linkType: 'external',
          url: '#', // TODO: Add actual PDF URL
          icon: 'pdf',
          openInNewTab: true,
        },
        {
          label: 'Descarcă Ghidul Cursurilor',
          linkType: 'external',
          url: '#', // TODO: Add actual PDF URL
          icon: 'pdf',
          openInNewTab: true,
        },
      ],
      alignment: 'center',
      backgroundColor: 'default',
    },

    // 4. SERVICES GRID - Terapii principale (filtered by Terapii category)
    {
      blockType: 'services' as const,
      variant: 'grid-3',
      heading: 'Terapii Energetice',
      subheading: 'Descoperă terapiile care te pot ajuta să-ți regăsești echilibrul',
      source: 'collection',
      filterByCategory: terapiiCategoryId ? [terapiiCategoryId] : undefined,
      onlyFeatured: true,
      limit: 6,
      showPrices: true,
      showIcons: false,
      showDuration: true,
      showBookButton: false,
      detailBasePath: '/terapii',
      ctaButton: {
        enabled: true,
        label: 'Vezi toate terapiile',
        link: '/terapii',
      },
      hoverEffect: 'lift',
      backgroundColor: 'default',
    },

    // 5. STATS SECTION - Rezultate
    {
      blockType: 'stats' as const,
      variant: 'grid-4',
      source: 'businessInfo',
      backgroundColor: 'primary',
    },

    // 6. TIMELINE - Experiență și certificări
    {
      blockType: 'timeline' as const,
      variant: 'vertical-alternating',
      heading: 'Experiența Mea',
      subheading: 'O călătorie de peste un deceniu în vindecarea holistică',
      events: [
        {
          year: '2015',
          title: 'Începutul Călătoriei',
          description:
            'Am descoperit terapiile energetice și am început formarea în Reiki, obținând nivelul de Master.',
          icon: 'Lightbulb',
        },
        {
          year: '2017',
          title: 'Certificare Access Bars',
          description:
            'Am devenit Facilitator Certificat Access Bars, una dintre cele mai puternice tehnici de eliberare energetică.',
          icon: 'Star',
        },
        {
          year: '2019',
          title: 'Tehnica Bowen',
          description:
            'Am absolvit cursul de Terapeut Bowen, o terapie manual-energetică cu rezultate remarcabile.',
          icon: 'Star',
        },
        {
          year: '2021',
          title: 'Facelift Energetic',
          description:
            'Am obținut certificarea internațională pentru Access Facelift - tratament energetic anti-îmbătrânire.',
          icon: 'Heart',
        },
        {
          year: '2023',
          title: 'Revital Harmony',
          description:
            'Am deschis cabinetul Revital Harmony, un spațiu dedicat vindecării holistice în inima Bucureștiului.',
          icon: 'Home',
        },
      ],
      showConnector: true,
      backgroundColor: 'light',
      conclusion: {
        enabled: true,
        quote:
          'Fiecare persoană are capacitatea de a se vindeca. Eu sunt aici doar să te ghidez în această călătorie minunată.',
        author: 'Monica Batir',
        role: 'Fondator Revital Harmony',
      },
    },

    // 7. TESTIMONIALS - Experiențe reale
    {
      blockType: 'testimonials' as const,
      variant: 'carousel',
      heading: 'Ce Spun Pacienții',
      subheading: 'Experiențe reale de la persoane care au beneficiat de terapii',
      source: 'collection',
      onlyFeatured: true,
      limit: 8,
      showRating: true,
      backgroundColor: 'default',
    },

    // 8. VIDEO TESTIMONIALS
    {
      blockType: 'videoGallery' as const,
      variant: 'grid-3',
      heading: 'Testimoniale Video',
      subheading: 'Ascultă experiențele pacienților care au beneficiat de terapiile noastre',
      videos: [
        {
          videoUrl: 'https://www.youtube.com/watch?v=kUydjMCBAe8',
          title: 'Dereglare hormonală remediată prin Terapie Access Bars',
          category: 'Access Bars',
          duration: '12:30',
        },
        {
          videoUrl: 'https://www.youtube.com/watch?v=PgskKpwKVvM',
          title: 'Sănătatea emoțională - Canal 33 România',
          category: 'Testimoniale',
          duration: '28:00',
        },
        {
          videoUrl: 'https://www.youtube.com/watch?v=6M8ZbT9Ycqs',
          title: 'Terapia Access Bars pentru blocajele mentale',
          category: 'Access Bars',
          duration: '15:00',
        },
      ],
      showTitles: true,
      showDuration: true,
      showCategories: true,
      backgroundColor: 'dark',
    },

    // 9. COURSES SECTION - List alternating style (same as /cursuri page)
    {
      blockType: 'services' as const,
      variant: 'list-alternating',
      heading: 'Cursuri de Certificare',
      subheading: 'Devino practician certificat internațional',
      source: 'collection',
      filterByCategory: cursuriCategoryId ? [cursuriCategoryId] : undefined,
      limit: 4,
      showPrices: true,
      showIcons: true,
      showDuration: true,
      showBookButton: false,
      detailBasePath: '/cursuri',
      ctaButton: {
        enabled: true,
        label: 'Vezi toate cursurile',
        link: '/cursuri',
      },
      hoverEffect: 'lift',
      backgroundColor: 'light',
    },

    // 10. FAQ SECTION
    {
      blockType: 'faq' as const,
      variant: 'accordion',
      heading: 'Întrebări Frecvente',
      subheading: 'Răspunsuri la cele mai comune întrebări despre terapii',
      source: 'collection',
      limit: 6,
      defaultOpen: 'first',
      backgroundColor: 'default',
    },

    // 11. CONTACT SECTION - wrapped in Content block for extra padding
    {
      blockType: 'content' as const,
      columns: [
        {
          width: '100',
          alignment: 'top',
          contentType: 'blocks',
          blocks: [
            {
              blockType: 'contact' as const,
              variant: 'full',
              heading: 'Programează o Ședință',
              subheading: 'Contactează-ne pentru o programare sau pentru mai multe informații',
            },
          ],
        },
      ],
      backgroundColor: 'light',
      paddingTop: 'large',
      paddingBottom: 'large',
    },

    // 12. BENEFITS CAROUSEL - ProcessSteps carousel variant (PLASTURI DESIGN)
    {
      blockType: 'process-steps' as const,
      variant: 'carousel', // Horizontal scrollable cards
      heading: 'Beneficiile Terapiilor Energetice',
      subheading: 'Descoperă cum te pot ajuta terapiile noastre',
      steps: [
        {
          title: 'Reducerea Stresului',
          description: 'Eliberează tensiunea acumulată și experimentează o stare profundă de relaxare și calm interior.',
          icon: 'Leaf',
          badge: 'Popular',
        },
        {
          title: 'Ameliorarea Durerii',
          description: 'Tehnicile noastre ajută la reducerea durerii cronice și acute fără medicamente sau intervenții invazive.',
          icon: 'Heart',
        },
        {
          title: 'Claritate Mentală',
          description: 'Eliberează blocajele mentale și experimentează o gândire mai clară și o concentrare îmbunătățită.',
          icon: 'Lightbulb',
        },
        {
          title: 'Energie Crescută',
          description: 'Reechilibrează fluxul energetic și simte-te mai energic și vital pe tot parcursul zilei.',
          icon: 'Zap',
        },
        {
          title: 'Echilibru Emoțional',
          description: 'Procesează și eliberează emoțiile negative pentru o stare de bine durabilă.',
          icon: 'Sun',
        },
        {
          title: 'Somn Îmbunătățit',
          description: 'Experimentează un somn mai profund și odihnitor după ședințele de terapie.',
          icon: 'Clock',
        },
      ],
      showNumbers: false,
      showConnectors: false,
      backgroundColor: 'light',
    },

    // 13. NEWSLETTER - Cu GDPR checkbox și pattern organic (ca plasturi.ro)
    {
      blockType: 'newsletter' as const,
      variant: 'with-pattern',
      heading: 'Abonează-te la Newsletter',
      subheading: 'Primește sfaturi despre sănătate, noutăți despre cursuri și oferte speciale direct în inbox.',
      placeholder: 'Adresa ta de email',
      buttonText: 'Abonează-te',
      successMessage: 'Mulțumim! Te-ai abonat cu succes la newsletter.',
      privacyText: 'Datele tale sunt în siguranță. Nu facem spam.',
      showPrivacyLink: true,
      // GDPR checkbox - nou adăugat
      requireConsent: true,
      consentText: 'Da, sunt de acord să primesc newsletter-ul și accept politica de confidențialitate.',
      benefits: [
        { text: 'Sfaturi săptămânale despre sănătate' },
        { text: 'Reduceri exclusive la cursuri' },
        { text: 'Noutăți despre terapii' },
      ],
      // Pattern bubbles organic - ca pe plasturi.ro
      pattern: {
        enabled: true,
        type: 'bubbles',
        position: 'left',
        color: 'white',
        opacity: '40', // Increased to 40% for better visibility
        size: 'lg',
        animated: false,
      },
    },

    // 14. FINAL CTA
    {
      blockType: 'cta' as const,
      variant: 'centered',
      headline: 'Pregătit să-ți Transformi Viața?',
      subheadline:
        'Fă primul pas către echilibru și vindecare. Programează o ședință de evaluare gratuită.',
      buttons: [
        { label: 'Programează-te Acum', link: '/contact', variant: 'default' },
        { label: 'Află Mai Multe', link: '/terapii', variant: 'outline' },
      ],
      backgroundColor: 'dark',
    },
  ]

  // Create homepage with Plasturi design
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Acasă',
      slug: 'home',
      _status: 'published',
      heroType: 'none', // No traditional hero, using video-hero block instead
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      layout: plasturiLayout as any,
      meta: {
        title: 'Revital Harmony - Terapii Energetice București | Access Bars, Bowen, Reiki',
        description:
          'Cabinet de terapii energetice în București. Oferim Access Bars, Tehnica Bowen, Facelift Energetic, Reiki și cursuri de certificare. Programează o consultație gratuită.',
      },
    },
  })
}

async function createAdditionalPages(
  payload: Payload,
  variant: DesignVariant,
  formsMap: Map<string, string>,
  getImageId: (filename: string) => string | undefined,
  categoryIds: {
    terapiiCategoryId: string | undefined
    cursuriCategoryId: string | undefined
  }
) {
  const contactFormId = formsMap.get('Formular de contact')
  const bookingFormId = formsMap.get('Formular de programare')
  const { terapiiCategoryId, cursuriCategoryId } = categoryIds

  // Terapii (Services) page - PLASTURI DESIGN with ProcessSteps
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Terapii',
      slug: 'terapii',
      _status: 'published',
      heroType: 'none',
      layout: [
        // Mini video hero for services page (Local MP4)
        {
          blockType: 'video-hero' as const,
          videoSource: 'url',
          videoUrl: '/videos/hero-terapii.mp4', // Local spa massage video from Mixkit
          overlayColor: 'rgba(26, 26, 46, 0.7)',
          overlayOpacity: 70,
          headline: 'Terapii Energetice',
          subheadline: 'Descoperă toate terapiile disponibile și alege-o pe cea potrivită pentru tine',
          ctaButtons: [
            { label: 'Vezi Terapiile', link: '#terapii', variant: 'primary', pillShape: true },
          ],
          textAlignment: 'center',
          height: 'medium',
          showScrollIndicator: true,
        },
        // Trust badges pentru Terapii page (separate block)
        {
          blockType: 'trust-badges' as const,
          variant: 'minimal',
          presets: ['non-invasive', 'patented', 'certified'],
          backgroundColor: 'default',
        },
        // Process steps explaining how therapies work
        {
          blockType: 'process-steps' as const,
          variant: 'zigzag',
          heading: 'Cum Te Ajută Terapiile Energetice',
          subheading: 'Fiecare terapie este adaptată nevoilor tale individuale',
          steps: [
            {
              title: 'Evaluare Holistică',
              description: 'Analizăm starea ta energetică, fizică și emoțională pentru a identifica dezechilibrele și blocajele care îți afectează bunăstarea.',
              icon: 'Search',
              badge: 'Pas 1',
            },
            {
              title: 'Terapie Personalizată',
              description: 'Selectăm și aplicăm tehnicile cele mai potrivite pentru situația ta: Bowen pentru dureri fizice, Access Bars pentru stres mental, Reiki pentru echilibru general.',
              icon: 'Heart',
              badge: 'Pas 2',
            },
            {
              title: 'Rezultate Vizibile',
              description: 'Majoritatea clienților resimt ameliorări încă de la prima ședință. Cu fiecare sesiune, corpul și mintea ta se echilibrează tot mai mult.',
              icon: 'Star',
              badge: 'Pas 3',
            },
          ],
          showNumbers: true,
          showConnectors: true,
          imagePosition: 'right',
          ctaButton: {
            enabled: true,
            label: 'Programează Evaluare Gratuită',
            link: '/contact',
          },
          backgroundColor: 'light',
        },
        // All therapies in grid (filtered by Terapii category)
        {
          blockType: 'services' as const,
          variant: 'grid-3',
          heading: 'Toate Terapiile Noastre',
          subheading: 'Selectează terapia care rezonează cu nevoile tale',
          source: 'collection',
          filterByCategory: terapiiCategoryId ? [terapiiCategoryId] : undefined,
          limit: 20,
          showPrices: true,
          showIcons: true,
          showDuration: true,
          showBookButton: true,
          bookButtonText: 'Programează-te',
          bookButtonLink: '/contact',
          hoverEffect: 'lift',
          detailBasePath: '/terapii',
          backgroundColor: 'default',
        },
        // FAQ specific to therapies
        {
          blockType: 'faq' as const,
          variant: 'accordion',
          heading: 'Întrebări despre Terapii',
          subheading: 'Tot ce trebuie să știi înainte de prima ședință',
          source: 'collection',
          limit: 6,
          defaultOpen: 'first',
          backgroundColor: 'light',
        },
        // CTA to book
        {
          blockType: 'cta' as const,
          variant: 'centered',
          headline: 'Pregătit să Începi?',
          subheadline: 'Programează o consultație gratuită și descoperă terapia potrivită pentru tine.',
          buttons: [
            { label: 'Programează Consultația', link: '/contact', variant: 'default' },
            { label: 'Sună: 0722 000 000', link: 'tel:+40722000000', variant: 'outline' },
          ],
          backgroundColor: 'primary',
        },
      ],
      meta: {
        title: 'Terapii Energetice | Revital Harmony București',
        description:
          'Descoperă terapiile energetice: Tehnica Bowen, Access Bars, Facelift Energetic, Reiki și multe altele. Consultație gratuită în București.',
      },
    },
  })

  // Cursuri page - uses services block filtered by Cursuri category (data from seeder)
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Cursuri',
      slug: 'cursuri',
      _status: 'published',
      heroType: 'none',
      layout: [
        // Video hero for courses page (Local MP4)
        {
          blockType: 'video-hero' as const,
          videoSource: 'url',
          videoUrl: '/videos/hero-cursuri.mp4',
          overlayColor: 'rgba(26, 26, 46, 0.7)',
          overlayOpacity: 70,
          headline: terapiiEnergeticeData.navigation.find(n => n.label === 'Cursuri')?.label || 'Cursuri de Certificare',
          subheadline: 'Învață să practici terapii energetice și obține certificare internațională',
          ctaButtons: [
            { label: 'Vezi Cursurile', link: '#cursuri', variant: 'primary', pillShape: true },
          ],
          textAlignment: 'center',
          height: 'medium',
          showScrollIndicator: true,
        },
        // Trust badges pentru cursuri - certificare internațională
        {
          blockType: 'trust-badges' as const,
          variant: 'minimal',
          presets: ['certified', 'patented'],
          backgroundColor: 'default',
        },
        // All courses as services (filtered by Cursuri category)
        {
          blockType: 'services' as const,
          variant: 'list-alternating',
          heading: 'Cursuri de Certificare',
          subheading: 'Devino practician certificat internațional',
          source: 'collection',
          filterByCategory: cursuriCategoryId ? [cursuriCategoryId] : undefined,
          limit: 10,
          showPrices: true,
          showIcons: true,
          showDuration: true,
          showBookButton: false,
          hoverEffect: 'lift',
          detailBasePath: '/cursuri',
          backgroundColor: 'default',
        },
        // Video testimoniale cursuri (from data file)
        {
          blockType: 'videoGallery' as const,
          variant: 'grid-3',
          heading: 'Experiențe de la Cursuri',
          subheading: 'Ascultă ce spun participanții despre cursurile noastre',
          videos: terapiiEnergeticeData.videos
            .filter(v => v.category === 'Access Bars' || v.category === 'Facelift Energetic')
            .slice(0, 3),
          showTitles: true,
          showDuration: true,
          showCategories: true,
          backgroundColor: 'dark',
        },
        // Testimoniale cursuri
        {
          blockType: 'testimonials' as const,
          variant: 'carousel',
          heading: 'Ce Spun Cursanții Noștri',
          source: 'collection',
          onlyFeatured: true,
          limit: 6,
          showRating: true,
          backgroundColor: 'light',
        },
        // Newsletter pentru cursuri cu GDPR
        {
          blockType: 'newsletter' as const,
          variant: 'dark',
          heading: 'Fii la Curent cu Cursurile Noastre',
          subheading: 'Primește notificări despre noi date de cursuri, oferte speciale și materiale gratuite.',
          placeholder: 'Email-ul tău',
          buttonText: 'Înscriere Newsletter',
          successMessage: 'Perfect! Vei primi notificări despre cursurile viitoare.',
          privacyText: 'Respectăm confidențialitatea datelor tale.',
          showPrivacyLink: true,
          requireConsent: true,
          consentText: 'Accept să primesc informații despre cursuri și oferte.',
          benefits: [
            { text: 'Notificări despre noi cursuri' },
            { text: 'Oferte early-bird' },
            { text: 'Materiale educaționale gratuite' },
          ],
        },
        // CTA final
        {
          blockType: 'cta' as const,
          variant: 'centered',
          headline: 'Pregătit să Devii Practician Certificat?',
          subheadline: 'Contactează-ne pentru înscriere și detalii.',
          buttons: [
            { label: 'Contactează-ne', link: '/contact', variant: 'default' },
            { label: `Sună: ${terapiiEnergeticeData.business.phone}`, link: `tel:${terapiiEnergeticeData.business.phone.replace(/\s/g, '')}`, variant: 'outline' },
          ],
          backgroundColor: 'primary',
        },
      ],
      meta: {
        title: 'Cursuri de Certificare | Revital Harmony București',
        description: 'Cursuri de certificare Access Bars și Facelift Energetic cu certificare internațională.',
      },
    },
  })

  // Media page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Media',
      slug: 'media',
      _status: 'published',
      headerSettings: {
        headerVariant: 'inherit',
        headerTransparency: 'solid',
        headerTextColor: 'inherit',
        headerTopBar: 'inherit',
      },
      heroType: 'minimal',
      hero: {
        headline: 'Media',
        subheadline: 'Video-uri, testimoniale și prezentări ale terapiilor noastre',
      },
      layout: [
        {
          blockType: 'videoGallery' as const,
          variant: 'grid-3',
          heading: 'Video-uri',
          videos: terapiiEnergeticeData.videos,
          showTitles: true,
          showDuration: true,
          showCategories: true,
          backgroundColor: 'default',
        },
      ],
      meta: {
        title: 'Media | Revital Harmony',
        description: 'Video-uri și materiale despre terapiile energetice.',
      },
    },
  })

  // Testimoniale page - Grupate pe categorii (ca pe site-ul original)
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Testimoniale',
      slug: 'testimoniale',
      _status: 'published',
      headerSettings: {
        headerVariant: 'inherit',
        headerTransparency: 'solid',
        headerTextColor: 'inherit',
        headerTopBar: 'inherit',
      },
      heroType: 'minimal',
      hero: {
        headline: 'Testimoniale',
        subheadline: 'Ce spun pacienții despre experiența lor cu terapiile noastre',
      },
      layout: [
        {
          blockType: 'testimonials' as const,
          variant: 'grid', // Grid variant works best with groupByCategory
          heading: 'Ce spun clienții noștri',
          source: 'collection',
          limit: 100, // Higher limit to get all testimonials for grouping
          onlyFeatured: false, // Afișează TOATE testimonialele, nu doar cele featured
          showRating: true,
          showAvatar: true,
          groupByCategory: true, // Grupează testimonialele pe categorii
          backgroundColor: 'default',
        },
      ],
      meta: {
        title: 'Testimoniale | Revital Harmony',
        description:
          'Citește experiențele pacienților care au beneficiat de terapiile energetice.',
      },
    },
  })

  // Despre Mine page - PLASTURI DESIGN with Timeline
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Despre Mine',
      slug: 'despre',
      _status: 'published',
      heroType: 'none',
      layout: [
        // Video hero for about page (Local MP4)
        {
          blockType: 'video-hero' as const,
          videoSource: 'url',
          videoUrl: '/videos/hero-despre.mp4', // Local waterfall nature video from Mixkit
          overlayColor: 'rgba(26, 26, 46, 0.6)',
          overlayOpacity: 60,
          headline: 'Despre Monica Batir',
          subheadline: 'Fondatoarea Revital Harmony - O călătorie de peste un deceniu în vindecarea holistică',
          ctaButtons: [
            { label: 'Programează Consultație', link: '/contact', variant: 'primary', pillShape: true },
          ],
          textAlignment: 'center',
          height: 'medium',
          showScrollIndicator: true,
        },
        // Trust badges sub video hero
        {
          blockType: 'trust-badges' as const,
          variant: 'minimal',
          presets: ['certified', 'money-back-30'],
          backgroundColor: 'default',
        },
        // About section with Team featured
        {
          blockType: 'team' as const,
          variant: 'featured',
          heading: 'Bine ai venit!',
          subheading: 'Sunt Monica Batir, psiholog și terapeut holistic cu peste 8 ani de experiență în vindecarea energetică. Sunt certificată internațional în Access Bars, Facelift Energetic, Tehnica Bowen și Reiki Master.',
          source: 'collection',
          onlyFeatured: true,
          backgroundColor: 'default',
          detailBasePath: '/echipa',
        },
        // Stats
        {
          blockType: 'stats' as const,
          variant: 'grid-4',
          source: 'businessInfo',
          backgroundColor: 'primary',
        },
        // Timeline - experiența mea
        {
          blockType: 'timeline' as const,
          variant: 'vertical-alternating',
          heading: 'Călătoria Mea în Vindecare',
          subheading: 'De la descoperirea terapiilor energetice la fondarea Revital Harmony',
          events: [
            {
              year: '2015',
              title: 'Descoperirea Reiki',
              description: 'Am descoperit puterea vindecării energetice și am obținut certificarea de Reiki Master. A fost începutul unei transformări profunde.',
              icon: 'Lightbulb',
            },
            {
              year: '2017',
              title: 'Access Bars',
              description: 'Am devenit Facilitator Certificat Access Bars, una dintre cele mai eficiente tehnici de eliberare a blocajelor mentale și emoționale.',
              icon: 'Star',
            },
            {
              year: '2018',
              title: 'Terapia Bowen',
              description: 'Am absolvit formarea în Tehnica Bowen, o terapie manual-energetică cu rezultate excepționale pentru dureri fizice.',
              icon: 'Star',
            },
            {
              year: '2020',
              title: 'Facelift Energetic',
              description: 'Am obținut certificarea internațională pentru Access Facelift - un tratament non-invaziv pentru întinerire și relaxare.',
              icon: 'Heart',
            },
            {
              year: '2022',
              title: 'Revital Harmony',
              description: 'Am deschis propriul cabinet în București, un spațiu dedicat vindecării holistice și dezvoltării personale.',
              icon: 'Home',
            },
          ],
          showConnector: true,
          backgroundColor: 'light',
          conclusion: {
            enabled: true,
            quote: 'Fiecare persoană pe care o ajut îmi confirmă că am ales drumul corect. Vindecarea nu este doar profesia mea, ci misiunea mea.',
            author: 'Monica Batir',
            role: 'Fondator Revital Harmony',
          },
        },
        // Certificări - process steps
        {
          blockType: 'process-steps' as const,
          variant: 'grid',
          heading: 'Certificări și Specializări',
          subheading: 'Formări internaționale recunoscute global',
          steps: [
            {
              title: 'Reiki Master',
              description: 'Certificat de Master Reiki - nivel avansat pentru transmiterea energiei universale de vindecare.',
              icon: 'Star',
            },
            {
              title: 'Access Bars Facilitator',
              description: 'Certificare Access Consciousness pentru facilitarea ședințelor și cursurilor Access Bars.',
              icon: 'Star',
            },
            {
              title: 'Practician Bowen',
              description: 'Terapeut certificat în Tehnica Bowen pentru tratamentul dezechilibrelor musculo-scheletale.',
              icon: 'CheckCircle',
            },
            {
              title: 'Access Facelift',
              description: 'Diplomă internațională de Practician Access Facelift pentru tratamente anti-îmbătrânire.',
              icon: 'Heart',
            },
          ],
          showNumbers: false,
          showConnectors: false,
          backgroundColor: 'default',
        },
        // Testimoniale
        {
          blockType: 'testimonials' as const,
          variant: 'carousel',
          heading: 'Ce Spun Pacienții',
          subheading: 'Experiențe reale de la persoane care și-au transformat viața',
          source: 'collection',
          onlyFeatured: true,
          limit: 8,
          showRating: true,
          backgroundColor: 'light',
        },
        // CTA
        {
          blockType: 'cta' as const,
          variant: 'centered',
          headline: 'Pregătit pentru Transformare?',
          subheadline: 'Programează o consultație gratuită și descoperă cum te pot ajuta.',
          buttons: [
            { label: 'Programează Consultația', link: '/contact', variant: 'default' },
            { label: 'Vezi Terapiile', link: '/terapii', variant: 'outline' },
          ],
          backgroundColor: 'dark',
        },
      ],
      meta: {
        title: 'Despre Monica Batir - Terapeut Holistic | Revital Harmony București',
        description:
          'Monica Batir - Psiholog, Terapeut Holistic, Reiki Master, Specialist Access Bars și Facelift Energetic. Peste 8 ani experiență în vindecarea holistică.',
      },
    },
  })

  // Contact page
  const contactLayout = createContactPageLayout(contactFormId)
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Contact',
      slug: 'contact',
      _status: 'published',
      headerSettings: {
        headerVariant: 'inherit',
        headerTransparency: 'solid',
        headerTextColor: 'inherit',
        headerTopBar: 'inherit',
      },
      heroType: 'minimal',
      hero: {
        headline: 'Contactează-ne',
        subheadline: 'Suntem aici să te ajutăm. Programează o ședință sau trimite-ne un mesaj.',
      },
      layout: contactLayout,
      meta: {
        title: 'Contact | Revital Harmony',
        description: 'Contactează Revital Harmony pentru programări și informații.',
      },
    },
  })
}

