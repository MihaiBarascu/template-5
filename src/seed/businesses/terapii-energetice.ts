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
    ...terapiiEnergeticeImages.courses,
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

  // Configure theme using design variant - Gold & Navy colors from terapiienergetice.ro
  console.log('\n🎨 Configuring site theme (Gold & Navy - Plasturi Design)...')
  await seedSiteTheme(payload, {
    variant: 'revital-harmony',
    borderRadius: variant.theme.borderRadius,
    shadows: variant.theme.shadows,
    sectionSpacing: 'spacious',
    headingScale: 'large',
    bodyTextSize: 'large',
    cardGap: 'spacious',
    animations: 'moderate',
    headingFont: variant.theme.headingFont,
    bodyFont: variant.theme.bodyFont,
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
  })

  console.log('\n📄 Setting up system pages...')
  await seedSystemPages(payload)

  console.log('\n🏷️ Setting up logo...')
  await seedLogo(payload, { type: 'text', text: 'Revital Harmony' })

  console.log('\n📋 Setting up header navigation...')
  await seedHeader(payload, {
    variant: 'standard',
    navItems: terapiiEnergeticeData.navigation,
    ctaButton: { enabled: true, label: 'Programează-te', link: '/contact', variant: 'default' },
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

  console.log('\n🛠️ Creating services (therapies)...')
  // Map services to include their images and set displayStyle to card-image
  const servicesWithImages = terapiiEnergeticeData.services.map((service) => ({
    ...service,
    imageId: therapyImageMap.get(service.title),
    displayStyle: 'card-image' as const, // Show service images in cards
  }))
  await seedServices(payload, servicesWithImages)

  console.log('\n⭐ Creating testimonials...')
  await seedTestimonials(payload, terapiiEnergeticeData.testimonials)

  console.log('\n❓ Creating FAQ...')
  await seedFAQ(payload, terapiiEnergeticeData.faq)

  console.log('\n👥 Creating team...')
  await seedTeam(payload, terapiiEnergeticeData.team)

  // Create homepage with PLASTURI DESIGN - VideoHero + ProcessSteps + Timeline
  console.log('\n🏠 Creating homepage with PLASTURI DESIGN...')
  await createPlasturiHomepage(payload, variant, getImageId)

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
  await createAdditionalPages(payload, variant, formsMap, getImageId)

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
  getImageId: (filename: string) => string | undefined
) {
  // Layout array with all Plasturi design blocks
  const plasturiLayout = [
    // 1. VIDEO HERO SECTION - Fullscreen with overlay (Local MP4)
    {
      blockType: 'video-hero' as const,
      videoSource: 'url',
      videoUrl: '/videos/hero-home.mp4', // Local meditation video from Mixkit
      overlayColor: 'rgba(26, 26, 46, 0.6)', // Navy overlay
      overlayOpacity: 60,
      headline: terapiiEnergeticeData.hero.headline,
      subheadline: terapiiEnergeticeData.hero.subheadline,
      ctaButtons: [
        { label: 'Programează o Ședință', link: '/contact', variant: 'primary', pillShape: true },
        { label: 'Descoperă Terapiile', link: '/terapii', variant: 'secondary', pillShape: true },
      ],
      textAlignment: 'center',
      height: 'fullscreen',
      showScrollIndicator: true,
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

    // 4. SERVICES GRID - Terapii principale
    {
      blockType: 'services' as const,
      variant: 'grid-3',
      heading: 'Terapii Energetice',
      subheading: 'Descoperă terapiile care te pot ajuta să-ți regăsești echilibrul',
      source: 'collection',
      onlyFeatured: true,
      limit: 6,
      showPrices: true,
      showIcons: true,
      showDuration: true,
      showBookButton: true,
      bookButtonText: 'Programează-te',
      bookButtonLink: '/contact',
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

    // 9. PRICING KITS - Cursuri
    {
      blockType: 'pricing-kits' as const,
      variant: 'highlighted',
      heading: 'Cursuri de Certificare',
      subheading: 'Devino practician certificat internațional',
      kits: [
        {
          name: 'Curs Access Bars',
          price: 1460,
          priceLabel: 'RON',
          description: 'Curs de o zi cu certificare internațională Access Consciousness',
          badge: 'popular',
          features: [
            { text: 'Tehnici practice pentru auto-aplicare', included: true },
            { text: 'Înțelegerea celor 32 de puncte energetice', included: true },
            { text: 'Certificat Internațional', included: true },
            { text: 'Acces la comunitatea Access Bars', included: true },
          ],
          cta: { label: 'Înscrie-te', link: '/cursuri' },
          highlighted: true,
        },
        {
          name: 'Curs Facelift Energetic',
          price: 1875,
          priceLabel: 'RON',
          description: 'Curs de 2 zile pentru tratament anti-îmbătrânire',
          badge: 'none',
          features: [
            { text: 'Două ședințe în care primești tratamentul', included: true },
            { text: 'Două ședințe în care oferi tratamentul', included: true },
            { text: 'Manual Access Facelift', included: true },
            { text: 'Diplomă Internațională Practician', included: true },
          ],
          cta: { label: 'Înscrie-te', link: '/cursuri' },
          highlighted: false,
        },
      ],
      columns: '2',
      showCompareFeatures: false,
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

    // 11. CONTACT SECTION
    {
      blockType: 'contact' as const,
      variant: 'full',
      heading: 'Programează o Ședință',
      subheading: 'Contactează-ne pentru o programare sau pentru mai multe informații',
      backgroundColor: 'light',
    },

    // 12. FINAL CTA
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
  getImageId: (filename: string) => string | undefined
) {
  const contactFormId = formsMap.get('Formular de contact')
  const bookingFormId = formsMap.get('Formular de programare')

  // Terapii (Services) page - PLASTURI DESIGN with ProcessSteps
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Terapii',
      slug: 'terapii',
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
        // All services in grid
        {
          blockType: 'services' as const,
          variant: 'grid-3',
          heading: 'Toate Terapiile Noastre',
          subheading: 'Selectează terapia care rezonează cu nevoile tale',
          source: 'collection',
          limit: 20,
          showPrices: true,
          showIcons: true,
          showDuration: true,
          showBookButton: true,
          bookButtonText: 'Programează-te',
          bookButtonLink: '/contact',
          hoverEffect: 'lift',
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

  // Cursuri page - PLASTURI DESIGN with video-hero and PricingKits
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Cursuri',
      slug: 'cursuri',
      heroType: 'none',
      layout: [
        // Video hero for courses page (Local MP4)
        {
          blockType: 'video-hero' as const,
          videoSource: 'url',
          videoUrl: '/videos/hero-cursuri.mp4', // Local candles video from Mixkit
          overlayColor: 'rgba(26, 26, 46, 0.7)',
          overlayOpacity: 70,
          headline: 'Cursuri de Certificare',
          subheadline: 'Învață să practici terapii energetice și obține certificare internațională recunoscută în 173 de țări',
          ctaButtons: [
            { label: 'Curs Access Bars - 1460 RON', link: '#access-bars', variant: 'primary', pillShape: true },
            { label: 'Curs Facelift - 1875 RON', link: '#facelift', variant: 'secondary', pillShape: true },
          ],
          textAlignment: 'center',
          height: 'medium',
          showScrollIndicator: true,
        },
        // Process steps for courses
        {
          blockType: 'process-steps' as const,
          variant: 'horizontal',
          heading: 'De Ce Să Devii Practician Certificat',
          subheading: 'Beneficiile certificării internaționale',
          steps: [
            {
              title: 'Carieră Flexibilă',
              description: 'Poți practica independent sau în colaborare cu centre de wellness. Certificatul este recunoscut în 173 de țări.',
              icon: 'Rocket',
            },
            {
              title: 'Venituri Suplimentare',
              description: 'O ședință Access Bars se tarifează între 150-300 RON. Poți practica full-time sau part-time.',
              icon: 'CreditCard',
            },
            {
              title: 'Dezvoltare Personală',
              description: 'Învățând să ajuți pe alții, te vindeci și pe tine. Terapia începe cu cel care o practică.',
              icon: 'Heart',
            },
          ],
          showNumbers: false,
          showConnectors: false,
          backgroundColor: 'light',
        },
        // ACCESS BARS - Pricing Kit
        {
          blockType: 'pricing-kits' as const,
          variant: 'highlighted',
          heading: 'Curs Access Bars',
          subheading: 'Access Bars este o tehnică de medicină alternativă practicată în peste 173 de țări. Metoda se concentrează pe 32 de puncte de pe cap care, atunci când sunt atinse, eliberează blocajele și emoțiile negative.',
          kits: [
            {
              name: 'Prima Participare',
              price: 1460,
              priceLabel: 'RON',
              description: 'Curs complet de o zi cu certificare internațională',
              badge: 'popular',
              features: [
                { text: 'Tehnici practice pentru auto-aplicare', included: true },
                { text: 'Înțelegerea celor 32 de puncte energetice', included: true },
                { text: 'Instrumente de lucru și materiale', included: true },
                { text: 'Training pentru facilitare clienți', included: true },
                { text: 'Certificat Internațional Access Consciousness', included: true },
                { text: 'Acces la comunitatea Access Bars', included: true },
              ],
              cta: { label: 'Înscrie-te Acum', link: '/contact' },
              highlighted: true,
            },
            {
              name: 'Reluare Curs',
              price: 730,
              priceLabel: 'RON',
              description: 'Pentru practicieni certificați',
              badge: 'none',
              features: [
                { text: 'Tehnici practice pentru auto-aplicare', included: true },
                { text: 'Înțelegerea celor 32 de puncte energetice', included: true },
                { text: 'Instrumente de lucru și materiale', included: true },
                { text: 'Training pentru facilitare clienți', included: true },
                { text: 'Actualizare certificat', included: true },
                { text: 'Acces la comunitatea Access Bars', included: true },
              ],
              cta: { label: 'Înscrie-te', link: '/contact' },
              highlighted: false,
            },
            {
              name: 'Adolescenți (16-18 ani)',
              price: 730,
              priceLabel: 'RON',
              description: 'Preț special pentru tineri',
              badge: 'new',
              features: [
                { text: 'Tehnici practice pentru auto-aplicare', included: true },
                { text: 'Înțelegerea celor 32 de puncte energetice', included: true },
                { text: 'Instrumente de lucru și materiale', included: true },
                { text: 'Training pentru facilitare', included: true },
                { text: 'Certificat Internațional', included: true },
                { text: 'Acces la comunitate', included: true },
              ],
              cta: { label: 'Înscrie-te', link: '/contact' },
              highlighted: false,
            },
            {
              name: 'Copii (sub 16 ani)',
              price: 0,
              priceLabel: 'GRATUIT',
              description: 'Însoțiți de un adult participant',
              badge: 'best-value',
              features: [
                { text: 'Tehnici practice pentru auto-aplicare', included: true },
                { text: 'Înțelegerea punctelor energetice', included: true },
                { text: 'Materiale de lucru', included: true },
                { text: 'Însoțit de adult participant', included: true },
                { text: 'Certificat de participare', included: true },
                { text: 'Acces la comunitate', included: true },
              ],
              cta: { label: 'Contactează-ne', link: '/contact' },
              highlighted: false,
            },
          ],
          columns: 'auto',
          showCompareFeatures: false,
          backgroundColor: 'default',
        },
        // Date cursuri Access Bars
        {
          blockType: 'cta' as const,
          variant: 'minimal',
          headline: 'Date Curs Access Bars 2025-2026',
          subheadline: '20 Decembrie 2025 • 17 Ianuarie 2026 • 21 Februarie 2026 • 14 Martie 2026',
          buttons: [{ label: 'Rezervă Locul', link: '/contact', variant: 'default' }],
          backgroundColor: 'primary',
        },
        // FACELIFT - Pricing Kit
        {
          blockType: 'pricing-kits' as const,
          variant: 'highlighted',
          heading: 'Curs Facelift Energetic',
          subheading: 'Facelift Energetic Access este un proces revoluționar care încorporează 30 de energii pentru a elibera tensiunea și a inversa semnele îmbătrânirii fără intervenție fizică. Curs de 2 zile.',
          kits: [
            {
              name: 'Prima Participare',
              price: 1875,
              priceLabel: 'RON',
              description: 'Curs complet de 2 zile cu diplomă internațională',
              badge: 'popular',
              features: [
                { text: 'Două ședințe în care primești tratamentul', included: true },
                { text: 'Două ședințe în care oferi tratamentul', included: true },
                { text: 'Manual Access Facelift cu poziții și tehnici', included: true },
                { text: 'Fișă de lucru și instrumente Access', included: true },
                { text: 'Prezentare video de la Dr. Dain Heer', included: true },
                { text: 'Diplomă Internațională Practician', included: true },
              ],
              cta: { label: 'Înscrie-te Acum', link: '/contact' },
              highlighted: true,
            },
            {
              name: 'Reluare Curs',
              price: 935,
              priceLabel: 'RON',
              description: 'Pentru practicieni certificați',
              badge: 'none',
              features: [
                { text: 'Două ședințe în care primești tratamentul', included: true },
                { text: 'Două ședințe în care oferi tratamentul', included: true },
                { text: 'Actualizare manual și tehnici', included: true },
                { text: 'Instrumente noi Access Consciousness', included: true },
                { text: 'Prezentare video actualizată', included: true },
                { text: 'Reînnoire diplomă', included: true },
              ],
              cta: { label: 'Înscrie-te', link: '/contact' },
              highlighted: false,
            },
          ],
          columns: '2',
          showCompareFeatures: false,
          backgroundColor: 'default',
        },
        // Date cursuri Facelift
        {
          blockType: 'cta' as const,
          variant: 'minimal',
          headline: 'Date Curs Facelift Energetic 2025-2026',
          subheadline: '21-22 Decembrie 2025 • 18-19 Ianuarie 2026 • 22-23 Februarie 2026',
          buttons: [{ label: 'Rezervă Locul', link: '/contact', variant: 'default' }],
          backgroundColor: 'primary',
        },
        // Video testimoniale cursuri
        {
          blockType: 'videoGallery' as const,
          variant: 'grid-3',
          heading: 'Experiențe de la Cursuri',
          subheading: 'Ascultă ce spun participanții despre cursurile noastre',
          videos: [
            {
              videoUrl: 'https://www.youtube.com/watch?v=kUydjMCBAe8',
              title: 'Dereglare hormonală remediată prin Terapie Access Bars',
              category: 'Access Bars',
              duration: '12:30',
            },
            {
              videoUrl: 'https://www.youtube.com/watch?v=NYZ6-VitAJo',
              title: 'Facelift Energetic - Experiența mea',
              category: 'Facelift',
              duration: '10:00',
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
        // CTA final
        {
          blockType: 'cta' as const,
          variant: 'centered',
          headline: 'Pregătit să Devii Practician Certificat?',
          subheadline: 'Locurile sunt limitate. Rezervă-ți locul acum pentru următorul curs.',
          buttons: [
            { label: 'Contactează-ne', link: '/contact', variant: 'default' },
            { label: 'Sună: 0722 000 000', link: 'tel:+40722000000', variant: 'outline' },
          ],
          backgroundColor: 'dark',
        },
      ],
      meta: {
        title: 'Cursuri Access Bars (1460 RON) și Facelift Energetic (1875 RON) | Revital Harmony București',
        description:
          'Cursuri de certificare Access Bars și Facelift Energetic cu certificare internațională recunoscută în 173 de țări. Date: decembrie 2025, ianuarie, februarie 2026.',
      },
    },
  })

  // Media page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Media',
      slug: 'media',
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

  // Testimoniale page
  await payload.create({
    collection: 'pages',
    data: {
      title: 'Testimoniale',
      slug: 'testimoniale',
      heroType: 'minimal',
      hero: {
        headline: 'Testimoniale',
        subheadline: 'Ce spun pacienții despre experiența lor cu terapiile noastre',
      },
      layout: [
        {
          blockType: 'testimonials' as const,
          variant: 'masonry',
          source: 'collection',
          limit: 50,
          showRating: true,
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
        // About section with Team featured
        {
          blockType: 'team' as const,
          variant: 'featured',
          heading: 'Bine ai venit!',
          subheading: 'Sunt Monica Batir, psiholog și terapeut holistic cu peste 8 ani de experiență în vindecarea energetică. Sunt certificată internațional în Access Bars, Facelift Energetic, Tehnica Bowen și Reiki Master.',
          source: 'collection',
          onlyFeatured: true,
          backgroundColor: 'default',
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
