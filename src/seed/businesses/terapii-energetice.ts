import type { Payload } from 'payload';
import { getVariant, type DesignVariant } from '../design-variants';
import {
  createAdminUser,
  createContactPageLayout,
  createSeederPage,
  formTemplates,
  seedBusinessInfo,
  seedFAQ,
  seedFooter,
  seedForms,
  seedHeader,
  seedLogo,
  seedServiceCategories,
  seedServices,
  seedSiteTheme,
  seedSystemPages,
  seedTeam,
  seedTestimonialCategories,
  seedTestimonials,
  uploadLocalSeedImages,
  type FlexibleLayout,
} from '../helpers';
import {
  terapiiEnergeticeData,
  terapiiEnergeticeImages,
} from '../terapii-energetice-data';

const VARIANT_INDEX = parseInt(process.env.DESIGN_VARIANT || '0', 10);

export async function seedTerapiiEnergetice(payload: Payload) {
  const variant = getVariant('terapii-energetice', VARIANT_INDEX);

  console.log('\n📍 Seeding: Terapii Energetice (Wellness & Healing)');
  console.log(
    `🎨 Design Variant: ${variant.name} (${variant.id}) - PLASTURI DESIGN`,
  );
  console.log(`   ${variant.description}`);
  console.log('━'.repeat(50));

  await createAdminUser(payload);

  // Upload all images first
  console.log('\n📸 Uploading images from local files...');
  const allImages = [
    ...terapiiEnergeticeImages.hero,
    terapiiEnergeticeImages.banner,
    ...terapiiEnergeticeImages.services,
    ...terapiiEnergeticeImages.courseImages,
    terapiiEnergeticeImages.logo,
    ...terapiiEnergeticeImages.team,
    ...terapiiEnergeticeImages.gallery,
    ...terapiiEnergeticeImages.therapies,
    ...(terapiiEnergeticeImages.about || []),
  ];
  const imageMap = await uploadLocalSeedImages(payload, allImages);

  // Helper to get image ID by filename
  const getImageId = (filename: string): string | undefined =>
    imageMap.get(filename) || undefined;

  // Create therapy image map by service title
  const therapyImageMap = new Map<string, string>();
  for (const therapy of terapiiEnergeticeImages.therapies) {
    const imageId = getImageId(therapy.filename);
    if (imageId) {
      therapyImageMap.set(therapy.serviceTitle, imageId);
    }
  }

  // Create course image map by course title
  const courseImageMap = new Map<string, string>();
  for (const course of terapiiEnergeticeImages.courseImages) {
    const imageId = getImageId(course.filename);
    if (imageId) {
      courseImageMap.set(course.courseTitle, imageId);
    }
  }

  // Configure theme using design variant - Gold & Navy colors from terapiienergetice.ro
  // PLASTURI DESIGN: Prompt font, light heading weight (400), pill buttons
  console.log('\n🎨 Configuring site theme (Gold & Navy - Plasturi Design)...');
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
  });

  console.log('\n🏢 Setting up business info...');
  await seedBusinessInfo(payload, {
    name: terapiiEnergeticeData.business.name,
    tagline: terapiiEnergeticeData.business.tagline,
    description: terapiiEnergeticeData.business.description,
    // yearEstablished: eliminat - nu e menționat pe site-ul original
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
  });

  console.log('\n📄 Setting up system pages...');
  await seedSystemPages(payload);

  console.log('\n🏷️ Setting up logo...');
  const logoImageId = getImageId(terapiiEnergeticeImages.logo.filename);
  await seedLogo(payload, {
    type: logoImageId ? 'image' : 'text',
    text: 'Revital Harmony',
    imageId: logoImageId,
    height: 80,
    heightMobile: 60,
  });

  console.log(
    '\n📋 Setting up header navigation (PLASTURI DESIGN full-width + Transparent)...',
  );
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
  });

  console.log('\n📋 Setting up footer...');
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
          {
            label: 'Facelift Energetic',
            type: 'custom',
            url: '/terapii#facelift',
          },
          { label: 'Terapie Reiki', type: 'custom', url: '/terapii#reiki' },
        ],
      },
      {
        title: 'Cursuri',
        type: 'links',
        links: [
          {
            label: 'Curs Access Bars',
            type: 'custom',
            url: '/cursuri#access-bars',
          },
          { label: 'Curs Facelift', type: 'custom', url: '/cursuri#facelift' },
        ],
      },
      { title: 'Contact', type: 'contact' },
    ],
  });

  // Create service categories (Terapii and Cursuri)
  console.log('\n📁 Creating service categories...');
  const categoryMap = await seedServiceCategories(payload, [
    {
      title: 'Terapii',
      description: 'Terapii energetice pentru echilibru și vindecare',
      icon: 'Heart',
      order: 1,
    },
    {
      title: 'Cursuri',
      description: 'Cursuri de certificare internațională',
      icon: 'GraduationCap',
      order: 2,
    },
  ]);
  const terapiiCategoryId = categoryMap.get('Terapii');
  const cursuriCategoryId = categoryMap.get('Cursuri');

  console.log('\n🛠️ Creating services (therapies)...');
  // Map services to include their images, category, and set displayStyle to card-image
  const servicesWithImages = terapiiEnergeticeData.services.map(service => ({
    ...service,
    categoryId: terapiiCategoryId,
    imageId: therapyImageMap.get(service.title),
    displayStyle: 'card-image' as const, // Show service images in cards
    backLabel: '← Înapoi la terapii',
    backLink: '/terapii',
  }));
  const therapyServiceMap = await seedServices(payload, servicesWithImages);

  // Create course services from courses data (uses rich text description like therapies)
  console.log('\n📚 Creating services (courses)...');
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
      ...(course.priceRepeat
        ? [
            {
              label: 'Preț reluare',
              value: `${course.priceRepeat} RON`,
              icon: 'RefreshCw',
            },
          ]
        : []),
      ...('priceAdolescent' in course && course.priceAdolescent
        ? [
            {
              label: 'Adolescenți (16-18 ani)',
              value: `${course.priceAdolescent} RON`,
              icon: 'User',
            },
          ]
        : []),
      ...('priceChild' in course && course.priceChild !== undefined
        ? [
            {
              label: 'Copii (sub 16 ani)',
              value:
                course.priceChild === 0
                  ? 'GRATUIT'
                  : `${course.priceChild} RON`,
              icon: 'Baby',
            },
          ]
        : []),
      { label: 'Certificare', value: course.certification, icon: 'Award' },
    ],
    // Course features directly from data file
    features: course.features,
    ctaLabel: 'Înscrie-te la curs',
    ctaLink: '/contact',
    backLabel: '← Înapoi la cursuri',
    backLink: '/cursuri',
  }));
  const courseServiceMap = await seedServices(payload, courseServices);

  // Combine service maps for testimonial linking
  const allServicesMap = new Map([...therapyServiceMap, ...courseServiceMap]);

  // Create testimonial categories (for grouping testimonials by therapy type)
  console.log('\n📁 Creating testimonial categories...');
  const testimonialCategoryMap = await seedTestimonialCategories(payload, [
    { title: 'Facelift Energetic', icon: 'Sparkles', order: 1 },
    { title: 'Terapia Reiki', icon: 'Heart', order: 2 },
    { title: 'Eliberarea Tensiunii Interioare', icon: 'Leaf', order: 3 },
    { title: 'Access Bars', icon: 'Brain', order: 4 },
    { title: 'Corecție Bioenergetică', icon: 'Zap', order: 5 },
    { title: 'Terapia Bowen', icon: 'Hand', order: 6 },
  ]);

  console.log('\n⭐ Creating testimonials...');
  // Map testimonials with their category IDs and service IDs based on serviceNames field
  const serviceMatchCounts = new Map<string, number>();
  const testimonialsWithCategories = terapiiEnergeticeData.testimonials.map(
    testimonial => {
      // Find category ID based on first service name
      let categoryId: string | undefined;
      const serviceIds: string[] = [];
      const matchedServiceNames: string[] = [];

      // Get service names (can be string or array)
      const serviceNames = testimonial.serviceNames
        ? Array.isArray(testimonial.serviceNames)
          ? testimonial.serviceNames
          : [testimonial.serviceNames]
        : [];

      // Find category based on first service name
      if (serviceNames.length > 0) {
        const firstServiceName = serviceNames[0];
        // Try exact match first for category
        categoryId = testimonialCategoryMap.get(firstServiceName);
        // If no exact match, try partial match
        if (!categoryId) {
          for (const [categoryName, id] of testimonialCategoryMap.entries()) {
            if (
              firstServiceName
                .toLowerCase()
                .includes(categoryName.toLowerCase()) ||
              categoryName
                .toLowerCase()
                .includes(firstServiceName.toLowerCase())
            ) {
              categoryId = id;
              break;
            }
          }
        }
      }

      // Find matching service IDs for all service names
      for (const serviceName of serviceNames) {
        // Try exact match first
        let serviceId = allServicesMap.get(serviceName);
        let matchedName = serviceName;

        // If no exact match, try partial match
        if (!serviceId) {
          for (const [svcName, id] of allServicesMap.entries()) {
            if (
              serviceName.toLowerCase().includes(svcName.toLowerCase()) ||
              svcName.toLowerCase().includes(serviceName.toLowerCase())
            ) {
              serviceId = id;
              matchedName = svcName;
              break;
            }
          }
        }

        if (serviceId) {
          serviceIds.push(serviceId);
          matchedServiceNames.push(matchedName);
          // Track which services got testimonials
          serviceMatchCounts.set(
            matchedName,
            (serviceMatchCounts.get(matchedName) || 0) + 1,
          );
        }
      }

      return {
        name: testimonial.name,
        role: testimonial.role,
        content: testimonial.content,
        rating: testimonial.rating,
        featured: testimonial.featured,
        categoryId,
        serviceIds: serviceIds.length > 0 ? serviceIds : undefined,
        videoUrl: testimonial.videoUrl,
      };
    },
  );
  await seedTestimonials(payload, testimonialsWithCategories);

  // Log service-testimonial mapping summary
  console.log('   📊 Testimonials linked to services:');
  for (const [serviceName, count] of serviceMatchCounts.entries()) {
    console.log(`      - ${serviceName}: ${count} testimoniale`);
  }

  console.log('\n❓ Creating FAQ...');
  await seedFAQ(payload, terapiiEnergeticeData.faq);

  console.log('\n👥 Creating team...');
  // Map team members with their images
  const teamWithImages = terapiiEnergeticeData.team.map((member, index) => ({
    ...member,
    imageId: getImageId(terapiiEnergeticeImages.team[index]?.filename),
  }));
  await seedTeam(payload, teamWithImages);

  // Create homepage with PLASTURI DESIGN - VideoHero + ProcessSteps + Timeline
  console.log('\n🏠 Creating homepage with PLASTURI DESIGN...');
  await createPlasturiHomepage(
    payload,
    variant,
    getImageId,
    terapiiCategoryId,
    cursuriCategoryId,
  );

  // Create forms
  console.log('\n📝 Creating forms...');
  const serviceOptions = terapiiEnergeticeData.services.map(s => ({
    label: s.title,
    value: s.title,
  }));
  const formsMap = await seedForms(payload, [
    formTemplates.contact(),
    formTemplates.booking(serviceOptions),
  ]);

  console.log('\n📄 Creating additional pages...');
  // Create gallery image IDs array for the gallery page
  const galleryImageIds = terapiiEnergeticeImages.gallery
    .map(img => ({
      id: getImageId(img.filename),
      caption: img.alt,
      category: (img as { category?: string }).category || 'General',
    }))
    .filter(
      (img): img is { id: string; caption: string; category: string } =>
        img.id !== undefined,
    );

  await createAdditionalPages(payload, variant, formsMap, getImageId, {
    terapiiCategoryId,
    cursuriCategoryId,
    galleryImageIds,
  });

  console.log('\n' + '━'.repeat(50));
  console.log('✅ Terapii Energetice seeding complete!');
  console.log(`🎨 Applied variant: ${variant.name}`);
  console.log('🌐 Wellness & healing website ready');
  console.log('━'.repeat(50));
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
  cursuriCategoryId: string | undefined,
) {
  // Layout array - simplified to match original terapiienergetice.ro
  const plasturiLayout = [
    // 1. VIDEO HERO SECTION - Carousel layout pentru Terapii + Cursuri
    {
      blockType: 'video-hero' as const,
      variant: 'carousel',
      videoSource: 'url',
      videoUrl: '/videos/hero-home.mp4',
      overlayOpacity: 70,
      carouselSlides: [
        {
          headline: 'Cursuri Terapii Energetice',
          subheadline:
            'Descopera Cursurile sustinute de Monica Batir! Suna Acum pentru Rezervare!',
          ctaButtons: [
            {
              label: 'Contacteaza-ne',
              link: '/contact',
              variant: 'primary',
            },
          ],
        },
        {
          headline: 'Descopera Terapiile Energetice',
          subheadline:
            'Descopera Terapiile Energetice aplicate de Monica Batir! Suna Acum pentru Programare!',
          ctaButtons: [
            {
              label: 'Mai Multe Informatii',
              link: '/terapii',
              variant: 'secondary',
            },
          ],
        },
      ],
      carouselAutoplay: true,
      carouselSpeed: 6000,
      textAlignment: 'left',
      height: 'fullscreen',
      showScrollIndicator: true,
    },

    // 2. ABOUT SECTION - Team featured (Welcome section)
    {
      blockType: 'content',

      columns: [
        {
          width: '100',
          alignment: 'top',
          contentType: 'richText',

          richText: {
            root: {
              children: [
                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'Centrul de Terapii Energetice Bowen, Access Bars și Facelift Energetic Reiki - Revital Harmony',
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: null,
                  format: '',
                  indent: 0,
                  type: 'heading',
                  version: 1,
                  tag: 'h2',
                },

                {
                  children: [
                    {
                      detail: 0,
                      format: 1,
                      mode: 'normal',
                      style: '',
                      text: 'TERAPIA BOWEN | ACCESS BARS și FACELIFT ENERGETIC | REIKI | CORECȚIE BIOENERGETICĂ și ELIBERARE EMOȚIONALĂ',
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: null,
                  format: '',
                  indent: 0,
                  type: 'paragraph',
                  version: 1,
                  textFormat: 1,
                  textStyle: '',
                },

                {
                  children: [
                    {
                      detail: 0,
                      format: 0,
                      mode: 'normal',
                      style: '',
                      text: 'Bine ai venit la Revital Harmony, centrul tău de terapii energetice alternative din București, dedicat să te ajute să atingi echilibrul perfect între corp, minte și spirit. Ne mândrim cu o gamă variată de terapii care îți oferă posibilitatea de a-ți revitaliza viața într-un mod natural și armonios.',
                      type: 'text',
                      version: 1,
                    },
                  ],
                  direction: null,
                  format: '',
                  indent: 0,
                  type: 'paragraph',
                  version: 1,
                  textFormat: 0,
                  textStyle: '',
                },

                {
                  children: [],
                  direction: null,
                  format: '',
                  indent: 0,
                  type: 'paragraph',
                  version: 1,
                  textFormat: 0,
                  textStyle: '',
                },
              ],
              direction: null,
              format: '',
              indent: 0,
              type: 'root',
              version: 1,
            },
          },

          blocks: [],
        },
      ],
      backgroundColor: 'light',
      paddingTop: 'medium',
      paddingBottom: 'medium',
      blockName: 'BIne ai venit',
    },

    // 3. DE CE SĂ ALEGI REVITAL HARMONY - Secțiune din site-ul original
    {
      blockType: 'process-steps' as const,
      variant: 'grid',
      heading: 'De ce să Alegi Revital Harmony?',
      subheading:
        'La Revital Harmony, ne dedicăm în totalitate bunăstării tale',
      steps: [
        {
          title: 'Terapeuți Calificați',
          description:
            'Echipa noastră de terapeuți calificați are experiență vastă în domeniul terapiilor energetice și este pregătită să te sprijine în călătoria ta către vindecare și echilibru.',
          icon: 'Award',
        },
        {
          title: 'Sesiuni Personalizate',
          description:
            'Fiecare sesiune este personalizată în funcție de nevoile tale specifice, asigurându-ți o experiență unică și eficientă.',
          icon: 'Heart',
        },
        {
          title: 'Abordare Holistică',
          description:
            'Tratăm persoana, nu doar simptomele. Abordăm aspectele fizice, emoționale și energetice pentru o vindecare completă.',
          icon: 'Star',
        },
        {
          title: 'Drum Către Armonie',
          description:
            'Pasul tău către o viață mai echilibrată și armonioasă începe cu un simplu contact. Suntem aici pentru a răspunde la orice întrebări.',
          icon: 'Target',
        },
      ],
      showNumbers: false,
      showConnectors: false,
      ctaButton: {
        enabled: true,
        label: 'Contactează-ne Acum',
        link: '/contact',
      },
      backgroundColor: 'default',
    },

    // 4. SERVICES GRID - Terapii principale
    {
      blockType: 'services' as const,
      variant: 'grid-3',
      heading: 'Terapii Energetice',
      subheading:
        'Descoperă terapiile care te pot ajuta să-ți regăsești echilibrul',
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

    // 5. COURSES SECTION
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

    // 6. TESTIMONIALS - Ce spun clienții
    {
      blockType: 'testimonials' as const,
      variant: 'carousel',
      heading: 'Ce Spun Clienții Noștri',
      subheading:
        'Experiențe reale de la persoane care și-au transformat viața',
      source: 'collection',
      onlyFeatured: true,
      limit: 8,
      showRating: true,
      showAvatar: true,
      autoplay: true,
      backgroundColor: 'default',
    },

    // 7. VIDEO GALLERY - Video-uri reale din site-ul original
    {
      blockType: 'videoGallery' as const,
      variant: 'featured',
      heading: 'Descoperă Terapiile în Acțiune',
      subheading: 'Urmărește prezentări și testimoniale video',
      videos: terapiiEnergeticeData.videos.slice(0, 3), // Primele 3 video-uri din datele reale
      showTitles: true,
      showCategories: true,
      backgroundColor: 'dark',
    },

    // 8. OPENING HOURS
    {
      blockType: 'openingHours' as const,
      variant: 'with-cta',
      heading: 'Program',
      subheading: 'Ședințele se fac doar cu programare prealabilă',
      source: 'businessInfo',
      showCurrentStatus: false,
      ctaButton: {
        show: true,
        label: 'Programează-te Acum',
        link: '/contact',
      },
      backgroundColor: 'light',
    },

    // 9. CUM SĂ ÎNCEPI - How It Works section from original site
    {
      blockType: 'how-it-works' as const,
      variant: 'timeline',
      heading: 'Cum să Începi',
      subheading:
        'Pasul tău către o viață mai echilibrată și armonioasă începe cu un simplu contact',
      steps: [
        {
          title: 'Contactează-ne',
          description:
            'Suntem aici pentru a răspunde la orice întrebări. Sună la 0774 512 905 sau trimite un email pentru a stabili o programare.',
          icon: 'Phone',
        },
        {
          title: 'Evaluare Personalizată',
          description:
            'Discutăm despre nevoile tale și stabilim împreună un plan de terapie personalizat pentru situația ta.',
          icon: 'ClipboardCheck',
        },
        {
          title: 'Ședința de Terapie',
          description:
            'Experimentezi terapia într-un mediu relaxant și profesionist, adaptată nevoilor tale individuale.',
          icon: 'Heart',
        },
        {
          title: 'Transformare',
          description:
            'Te ajutăm cu drag și dedicare să-ți recapeți echilibrul și vitalitatea. Începe călătoria ta către revitalizare!',
          icon: 'Star',
        },
      ],
      ctaButton: {
        enabled: true,
        label: 'Contactează-ne Acum',
        link: '/contact',
      },
      backgroundColor: 'light',
    },

    // 10. MAP - Locație
    {
      blockType: 'map' as const,
      variant: 'with-info',
      heading: 'Găsește-ne',
      source: 'businessInfo',
      height: 'medium',
      showDirectionsButton: true,
    },

    // 11. FINAL CTA
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
  ];

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
        title:
          'Revital Harmony - Terapii Energetice București | Access Bars, Bowen, Reiki',
        description:
          'Cabinet de terapii energetice în București. Oferim Access Bars, Tehnica Bowen, Facelift Energetic, Reiki și cursuri de certificare. Programează o consultație gratuită.',
      },
    },
  });
}

async function createAdditionalPages(
  payload: Payload,
  variant: DesignVariant,
  formsMap: Map<string, string>,
  getImageId: (filename: string) => string | undefined,
  categoryIds: {
    terapiiCategoryId: string | undefined;
    cursuriCategoryId: string | undefined;
    galleryImageIds: Array<{ id: string; caption: string; category: string }>;
  },
) {
  const contactFormId = formsMap.get('Formular de contact');
  const bookingFormId = formsMap.get('Formular de programare');
  const { terapiiCategoryId, cursuriCategoryId, galleryImageIds } = categoryIds;

  // Terapii (Services) page - PLASTURI DESIGN with ProcessSteps
  await createSeederPage(payload, {
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
          subheadline:
            'Descoperă toate terapiile disponibile și alege-o pe cea potrivită pentru tine',
          ctaButtons: [
            {
              label: 'Vezi Terapiile',
              link: '#terapii',
              variant: 'primary',
              pillShape: true,
            },
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
              description:
                'Analizăm starea ta energetică, fizică și emoțională pentru a identifica dezechilibrele și blocajele care îți afectează bunăstarea.',
              icon: 'Search',
              badge: 'Pas 1',
            },
            {
              title: 'Terapie Personalizată',
              description:
                'Selectăm și aplicăm tehnicile cele mai potrivite pentru situația ta: Bowen pentru dureri fizice, Access Bars pentru stres mental, Reiki pentru echilibru general.',
              icon: 'Heart',
              badge: 'Pas 2',
            },
            {
              title: 'Rezultate Vizibile',
              description:
                'Majoritatea clienților resimt ameliorări încă de la prima ședință. Cu fiecare sesiune, corpul și mintea ta se echilibrează tot mai mult.',
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
        // Booking block - programare online
        {
          blockType: 'booking' as const,
          variant: 'with-service',
          heading: 'Programează-te Online',
          subheading:
            'Alege terapia dorită și trimite-ne cererea ta de programare',
          showServiceSelection: true,
          showTeamSelection: false,
          showDatePicker: true,
          showTimePicker: true,
          requiredFields: {
            name: true,
            email: true,
            phone: true,
            notes: false,
          },
          submitButtonText: 'Trimite Cererea',
          successMessage:
            'Mulțumim! Te vom contacta în curând pentru confirmarea programării.',
          showWhatsappOption: true,
          showPhoneOption: true,
          backgroundColor: 'default',
        },
        // CTA to book
        {
          blockType: 'cta' as const,
          variant: 'centered',
          headline: 'Pregătit să Începi?',
          subheadline:
            'Programează o consultație gratuită și descoperă terapia potrivită pentru tine.',
          buttons: [
            {
              label: 'Programează Consultația',
              link: '/contact',
              variant: 'default',
            },
            {
              label: `Sună: ${terapiiEnergeticeData.business.phone}`,
              link: `tel:${terapiiEnergeticeData.business.phone.replace(/\s/g, '')}`,
              variant: 'outline',
            },
          ],
          backgroundColor: 'dark',
        },
      ],
      meta: {
        title: 'Terapii Energetice | Revital Harmony București',
        description:
          'Descoperă terapiile energetice: Tehnica Bowen, Access Bars, Facelift Energetic, Reiki și multe altele. Consultație gratuită în București.',
      },
  });

  // Cursuri page - uses services block filtered by Cursuri category (data from seeder)
  await createSeederPage(payload, {
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
          headline:
            terapiiEnergeticeData.navigation.find(n => n.label === 'Cursuri')
              ?.label || 'Cursuri de Certificare',
          subheadline:
            'Învață să practici terapii energetice și obține certificare internațională',
          ctaButtons: [
            {
              label: 'Vezi Cursurile',
              link: '#cursuri',
              variant: 'primary',
              pillShape: true,
            },
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
            .filter(
              v =>
                v.category === 'Access Bars' ||
                v.category === 'Facelift Energetic',
            )
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
          subheading:
            'Primește notificări despre noi date de cursuri, oferte speciale și materiale gratuite.',
          placeholder: 'Email-ul tău',
          buttonText: 'Înscriere Newsletter',
          successMessage:
            'Perfect! Vei primi notificări despre cursurile viitoare.',
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
            {
              label: `Sună: ${terapiiEnergeticeData.business.phone}`,
              link: `tel:${terapiiEnergeticeData.business.phone.replace(/\s/g, '')}`,
              variant: 'outline',
            },
          ],
          backgroundColor: 'dark',
        },
      ],
      meta: {
        title: 'Cursuri de Certificare | Revital Harmony București',
        description:
          'Cursuri de certificare Access Bars și Facelift Energetic cu certificare internațională.',
      },
  });

  // Media page
  await createSeederPage(payload, {
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
        subheadline:
          'Video-uri, testimoniale și prezentări ale terapiilor noastre',
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
  });

  // Galerie Foto page - Photos from original site
  if (galleryImageIds.length > 0) {
    await createSeederPage(payload, {
      title: 'Galerie Foto',
        slug: 'galerie',
        _status: 'published',
        headerSettings: {
          headerVariant: 'inherit',
          headerTransparency: 'solid',
          headerTextColor: 'inherit',
          headerTopBar: 'inherit',
        },
        heroType: 'minimal',
        hero: {
          headline: 'Galerie Foto',
          subheadline: 'Imagini din cabinetul nostru și ședințele de terapie',
        },
        layout: [
          {
            blockType: 'gallery' as const,
            variant: 'masonry',
            heading: 'Imagini din Cabinet',
            subheading: 'Explorați spațiul nostru de vindecare și relaxare',
            images: galleryImageIds.map(img => ({
              image: img.id,
              caption: img.caption,
            })),
          },
          {
            blockType: 'cta' as const,
            variant: 'centered',
            headline: 'Vino să ne cunoști!',
            subheadline:
              'Programează o vizită în cabinetul nostru și experimentează atmosfera relaxantă.',
            buttons: [
              {
                label: 'Programează Vizită',
                link: '/contact',
                variant: 'default',
              },
            ],
            backgroundColor: 'light',
          },
        ],
        meta: {
          title: 'Galerie Foto | Revital Harmony',
          description:
            'Galerie foto cu imagini din cabinetul de terapii energetice.',
        },
    });
  }

  // Testimoniale page - Grupate pe categorii (ca pe site-ul original)
  await createSeederPage(payload, {
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
        subheadline:
          'Ce spun pacienții despre experiența lor cu terapiile noastre',
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
  });

  // Despre Mine page - PLASTURI DESIGN with Timeline
  await createSeederPage(payload, {
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
          subheadline:
            'Fondatoarea Revital Harmony - O călătorie de peste un deceniu în vindecarea holistică',
          ctaButtons: [
            {
              label: 'Programează Consultație',
              link: '/contact',
              variant: 'primary',
              pillShape: true,
            },
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
          subheading:
            'Sunt Monica Batir, psiholog și terapeut holistic. Sunt certificată internațional în Access Bars, Facelift Energetic, Tehnica Bowen și Reiki Master.',
          source: 'collection',
          onlyFeatured: true,
          backgroundColor: 'default',
          detailBasePath: '/echipa',
        },
        // Certificări - process steps (certificări reale menționate pe site)
        {
          blockType: 'process-steps' as const,
          variant: 'grid',
          heading: 'Certificări și Specializări',
          subheading: 'Formări internaționale recunoscute global',
          steps: [
            {
              title: 'Reiki Master',
              description:
                'Certificat de Master Reiki - nivel avansat pentru transmiterea energiei universale de vindecare.',
              icon: 'Star',
            },
            {
              title: 'Access Bars Facilitator',
              description:
                'Certificare Access Consciousness pentru facilitarea ședințelor și cursurilor Access Bars.',
              icon: 'Star',
            },
            {
              title: 'Practician Bowen',
              description:
                'Terapeut certificat în Tehnica Bowen pentru tratamentul dezechilibrelor musculo-scheletale.',
              icon: 'CheckCircle',
            },
            {
              title: 'Access Facelift',
              description:
                'Diplomă internațională de Practician Access Facelift pentru tratamente anti-îmbătrânire.',
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
          subheading:
            'Experiențe reale de la persoane care și-au transformat viața',
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
          subheadline:
            'Programează o consultație gratuită și descoperă cum te pot ajuta.',
          buttons: [
            {
              label: 'Programează Consultația',
              link: '/contact',
              variant: 'default',
            },
            { label: 'Vezi Terapiile', link: '/terapii', variant: 'outline' },
          ],
          backgroundColor: 'dark',
        },
      ],
      meta: {
        title:
          'Despre Monica Batir - Terapeut Holistic | Revital Harmony București',
        description:
          'Monica Batir - Psiholog, Terapeut Holistic, Reiki Master, Specialist Access Bars și Facelift Energetic.',
      },
  });

  // Contact page
  const contactLayout = createContactPageLayout(contactFormId);
  await createSeederPage(payload, {
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
      subheadline:
        'Suntem aici să te ajutăm. Programează o ședință sau trimite-ne un mesaj.',
    },
    layout: contactLayout || [],
    meta: {
      title: 'Contact | Revital Harmony',
      description:
        'Contactează Revital Harmony pentru programări și informații.',
    },
  });
}
