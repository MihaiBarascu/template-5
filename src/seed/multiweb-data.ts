/**
 * SEED DATA - MultiWebsite Agency
 *
 * Website de agenție web care prezintă demo-urile ca portofoliu.
 * Design modern și spectaculos cu efecte CSS avansate.
 */

// =============================================================================
// IMAGINI AGENCY (screenshots demo-uri + hero)
// =============================================================================

// Screenshots sunt în public/images/agency/ (copiate din docs/previews/agency/)
// Hero și gallery folosesc primele screenshot-uri ca fallback
export const multiwebImages = {
  hero: [
    { filename: 'agency/hero-agency.jpg', alt: 'Web design and development workspace' },
  ],
  portfolio: [
    { filename: 'agency/a-frizerie.png', alt: 'Barber Shop Premium - Website frizerie' },
    { filename: 'agency/b-dentist.png', alt: 'DentalMed Clinic - Website cabinet dentar' },
    { filename: 'agency/c-avocat.png', alt: 'Cabinet Avocat Ionescu - Website juridic' },
    { filename: 'agency/d-auto-service.png', alt: 'AutoPro Service - Website service auto' },
    { filename: 'agency/e-restaurant.png', alt: 'Restaurant La Copac - Website restaurant' },
    { filename: 'agency/f-magazin.png', alt: 'EcoShop Premium - Website magazin online' },
    { filename: 'agency/g-salon.png', alt: 'Beauty Studio Elena - Website salon' },
    { filename: 'agency/h-constructii.png', alt: 'BuildPro Construct - Website constructii' },
    { filename: 'agency/i-fitness.png', alt: 'Transilvania Fitness - Website fitness' },
  ],
  team: [
    // Folosim screenshot-uri ca placeholder pentru team
    { filename: 'agency/b-dentist.png', alt: 'Fondator & Lead Developer' },
    { filename: 'agency/c-avocat.png', alt: 'UI/UX Designer' },
    { filename: 'agency/g-salon.png', alt: 'Full Stack Developer' },
  ],
  gallery: [
    // Folosim screenshot-uri ca gallery (portofoliu vizual)
    { filename: 'agency/e-restaurant.png', alt: 'Restaurant website' },
    { filename: 'agency/h-constructii.png', alt: 'Construction website' },
    { filename: 'agency/i-fitness.png', alt: 'Fitness website' },
    { filename: 'agency/d-auto-service.png', alt: 'Auto service website' },
  ],
}

// =============================================================================
// CONFIGURARE MULTIWEB AGENCY
// =============================================================================

export const multiwebData = {
  // Business Info
  business: {
    name: 'MultiWebsite',
    tagline: 'Website-uri profesionale pentru afacerea ta',
    description:
      'Creăm site-uri web moderne și funcționale pentru afaceri mici din România. Fiecare website este optimizat pentru conversii, rapid și ușor de administrat. Oferim suport complet și mentenanță inclusă.',
    yearEstablished: 2020,
    phone: '0722 456 789',
    email: 'contact@multiwebsite.org',
    whatsapp: '40722456789',
    address: {
      street: 'Strada Victoriei 100',
      city: 'București',
      county: 'Sector 1',
      postalCode: '010093',
      country: 'România',
    },
    workingHours: [
      { days: 'Luni - Vineri', hours: '09:00 - 18:00' },
      { days: 'Sâmbătă', hours: 'La cerere' },
      { days: 'Duminică', hours: 'Închis' },
    ],
    social: {
      facebook: 'https://facebook.com/multiwebsite',
      instagram: 'https://instagram.com/multiwebsite',
      linkedin: 'https://linkedin.com/company/multiwebsite',
      github: 'https://github.com/multiwebsite',
    },
    stats: [
      { value: '100%', label: 'Control din admin' },
      { value: '0 lei', label: 'Costuri pentru modificări' },
      { value: '24h', label: 'Răspuns garantat' },
      { value: '4.9★', label: 'Rating clienți' },
    ],
  },

  // Hero
  hero: {
    headline: 'Website Profesional. Control Total. Fără Bătăi de Cap.',
    subheadline:
      'Site-uri moderne, rapide și optimizate pentru conversii. Cu MultiWebsite îți gestionezi singur website-ul din admin - modifici orice, oricând, fără programator și fără costuri extra.',
    ctaButtons: [
      { label: 'Vezi Portofoliul', link: '/portofoliu', variant: 'default' },
      { label: 'Solicită Ofertă', link: '/contact', variant: 'outline' },
    ],
  },

  // Navigation
  navigation: [
    { label: 'Acasă', type: 'custom' as const, url: '/' },
    { label: 'Portofoliu', type: 'custom' as const, url: '/portofoliu' },
    { label: 'Servicii', type: 'custom' as const, url: '/servicii' },
    { label: 'Despre', type: 'custom' as const, url: '/despre' },
    { label: 'Blog', type: 'custom' as const, url: '/blog' },
    { label: 'Contact', type: 'custom' as const, url: '/contact' },
  ],

  // Servicii
  services: [
    {
      title: 'Website de Prezentare',
      shortDescription: 'Site profesional pentru afaceri locale cu design modern și funcționalități complete',
      icon: 'Globe',
      featured: true,
      order: 1,
      features: [
        'Design responsive',
        'SEO optimizat',
        '5-7 pagini incluse',
        'Formular de contact',
        'Integrare Google Maps',
        'Certificat SSL gratuit',
      ],
      ctaLabel: 'Solicită Ofertă',
      ctaLink: '/contact',
    },
    {
      title: 'Magazin Online',
      shortDescription: 'Platformă e-commerce completă cu coș de cumpărături și management produse',
      icon: 'ShoppingCart',
      featured: true,
      order: 2,
      features: [
        'Catalog produse nelimitat',
        'Coș de cumpărături',
        'Checkout simplificat',
        'Management comenzi',
        'Integrare plăți online',
        'Notificări email',
      ],
      ctaLabel: 'Solicită Ofertă',
      ctaLink: '/contact',
    },
    {
      title: 'Website Premium',
      shortDescription: 'Soluție completă cu design personalizat și funcționalități avansate',
      icon: 'Star',
      featured: true,
      order: 3,
      features: [
        'Design custom 100%',
        'Funcționalități la cerere',
        'Sistem de programări',
        'Blog integrat',
        'Optimizare Core Web Vitals',
        'Training administrare',
      ],
      ctaLabel: 'Solicită Ofertă',
      ctaLink: '/contact',
    },
    {
      title: 'Mentenanță Web',
      shortDescription: 'Actualizări, backup-uri și suport tehnic pentru site-ul tău',
      icon: 'Settings',
      featured: false,
      order: 4,
      features: [
        'Actualizări de securitate',
        'Backup automat zilnic',
        'Monitorizare uptime',
        'Suport tehnic prioritar',
        'Rapoarte lunare',
        'Optimizări continue',
      ],
      ctaLabel: 'Află Mai Multe',
      ctaLink: '/contact',
    },
  ],

  // Portfolio Items (Demo websites)
  portfolioItems: [
    {
      title: 'Barber Shop Premium',
      category: 'Frizerie / Barbershop',
      description: 'Website modern pentru frizerie cu sistem de programări online, galerie de lucrări și prezentare echipă.',
      imageIndex: 0,
      externalUrl: 'https://a.multiwebsite.org',
      tags: ['Programări', 'Servicii', 'Echipă'],
      featured: true,
    },
    {
      title: 'DentalMed Clinic',
      category: 'Cabinet Stomatologic',
      description: 'Prezentare profesională pentru cabinet dentar cu booking online și informații servicii.',
      imageIndex: 1,
      externalUrl: 'https://b.multiwebsite.org',
      tags: ['Medical', 'Programări', 'Servicii'],
      featured: true,
    },
    {
      title: 'Cabinet Avocat Ionescu',
      category: 'Juridic / Avocat',
      description: 'Website elegant pentru cabinet de avocatură cu prezentare domenii de practică.',
      imageIndex: 2,
      externalUrl: 'https://c.multiwebsite.org',
      tags: ['Juridic', 'Consultații', 'Contact'],
      featured: false,
    },
    {
      title: 'AutoPro Service',
      category: 'Service Auto',
      description: 'Prezentare completă pentru service auto cu prețuri și servicii detaliate.',
      imageIndex: 3,
      externalUrl: 'https://d.multiwebsite.org',
      tags: ['Auto', 'Servicii', 'Prețuri'],
      featured: false,
    },
    {
      title: 'Restaurant La Copac',
      category: 'Restaurant / HoReCa',
      description: 'Website apetisant pentru restaurant cu meniu, galerie și sistem de rezervări.',
      imageIndex: 4,
      externalUrl: 'https://e.multiwebsite.org',
      tags: ['Meniu', 'Rezervări', 'Galerie'],
      featured: true,
    },
    {
      title: 'EcoShop Premium',
      category: 'Magazin Online',
      description: 'E-commerce complet pentru produse naturale cu coș de cumpărături și checkout.',
      imageIndex: 5,
      externalUrl: 'https://f.multiwebsite.org',
      tags: ['E-commerce', 'Produse', 'Coș'],
      featured: true,
    },
    {
      title: 'Beauty Studio Elena',
      category: 'Salon Înfrumusețare',
      description: 'Website elegant pentru salon beauty cu programări și prezentare servicii.',
      imageIndex: 6,
      externalUrl: 'https://g.multiwebsite.org',
      tags: ['Beauty', 'Programări', 'Servicii'],
      featured: false,
    },
    {
      title: 'BuildPro Construct',
      category: 'Construcții / Renovări',
      description: 'Prezentare solidă pentru firmă de construcții cu portofoliu proiecte.',
      imageIndex: 7,
      externalUrl: 'https://h.multiwebsite.org',
      tags: ['Construcții', 'Portofoliu', 'Ofertă'],
      featured: false,
    },
    {
      title: 'Transilvania Fitness',
      category: 'Fitness / Gym',
      description: 'Website energic pentru sală de fitness cu abonamente și prezentare clase.',
      imageIndex: 8,
      externalUrl: 'https://i.multiwebsite.org',
      tags: ['Fitness', 'Abonamente', 'Clase'],
      featured: false,
    },
  ],

  // Testimoniale
  testimonials: [
    {
      name: 'Andrei M.',
      role: 'Proprietar Frizerie',
      content:
        'Am ales MultiWebsite pentru frizeria mea și a fost cea mai bună decizie. Site-ul arată profesional, clienții pot face programări online și am primit multe review-uri pozitive despre cât de ușor e de folosit.',
      rating: '5',
      featured: true,
    },
    {
      name: 'Dr. Maria P.',
      role: 'Medic Dentist',
      content:
        'Site-ul nostru nou a crescut numărul de programări cu 40%. Pacienții apreciază că pot vedea toate serviciile și prețurile online. Echipa MultiWebsite a fost foarte profesionistă.',
      rating: '5',
      featured: true,
    },
    {
      name: 'Elena S.',
      role: 'Proprietar Salon',
      content:
        'Design-ul e exact ce mi-am dorit - elegant și feminin. Sistemul de programări funcționează perfect și am economisit mult timp. Recomand cu încredere!',
      rating: '5',
      featured: true,
    },
    {
      name: 'Dan V.',
      role: 'Manager Restaurant',
      content:
        'Site-ul nostru de restaurant arată fantastic! Meniul e ușor de actualizat, galeria e super, iar rezervările vin non-stop. Investiție care se amortizează rapid.',
      rating: '5',
      featured: true,
    },
  ],

  // FAQ
  faq: [
    {
      question: 'Cât durează realizarea unui website?',
      answer:
        'Un website standard de prezentare se livrează în 5-7 zile lucrătoare. Pentru magazine online sau proiecte custom, termenul este de 2-4 săptămâni, în funcție de complexitate.',
      order: 1,
    },
    {
      question: 'Ce include prețul afișat?',
      answer:
        'Prețurile includ: design responsive, optimizare SEO de bază, hosting pentru primul an, certificat SSL, training de administrare și suport tehnic 30 de zile. Domeniile .ro/.com sunt achiziționate separat.',
      order: 2,
    },
    {
      question: 'Pot să îmi actualizez singur site-ul?',
      answer:
        'Da! Toate site-urile noastre au un panou de administrare ușor de folosit. Poți modifica texte, imagini, prețuri și orice alt conținut fără cunoștințe tehnice. Oferim și training gratuit.',
      order: 3,
    },
    {
      question: 'Site-ul va fi optimizat pentru mobil?',
      answer:
        'Absolut. Toate website-urile noastre sunt 100% responsive și optimizate pentru mobile-first. Le testăm pe multiple dispozitive înainte de livrare.',
      order: 4,
    },
    {
      question: 'Oferiți mentenanță și suport?',
      answer:
        'Da, oferim pachete lunare de mentenanță care includ actualizări de securitate, backup-uri automate, monitorizare uptime și suport tehnic prioritar.',
      order: 5,
    },
    {
      question: 'Pot avea un design complet personalizat?',
      answer:
        'Desigur! Pachetul Premium include design custom 100% realizat după specificațiile tale. Discutăm împreună fiecare detaliu pentru a obține exact ce îți dorești.',
      order: 6,
    },
  ],

  // Blog posts
  posts: [
    {
      title: 'De ce are nevoie afacerea ta de un website în 2024',
      excerpt:
        'Descoperă beneficiile unui website profesional pentru orice tip de afacere - de la credibilitate crescută până la clienți noi 24/7.',
      content: 'Un website profesional este esențial pentru orice afacere modernă.\n\nÎn era digitală, prezența online nu mai este un lux, ci o necesitate. Clienții caută informații despre produse și servicii pe internet înainte de a lua o decizie de cumpărare.\n\nUn website bine realizat oferă credibilitate, accesibilitate 24/7 și posibilitatea de a ajunge la clienți noi. Este investiția care se amortizează cel mai rapid.',
      featured: true,
    },
    {
      title: 'Cum să alegi template-ul potrivit pentru afacerea ta',
      excerpt:
        'Sfaturi practice pentru alegerea designului perfect care reprezintă brandul tău și atrage clienții potriviți.',
      content: 'Alegerea template-ului potrivit poate face diferența între succes și eșec.\n\nPrimul pas este să identifici publicul țintă. Un cabinet de avocatură are nevoie de un design diferit față de o frizerie sau un restaurant.\n\nCulorile, fonturile și layout-ul trebuie să reflecte personalitatea brandului tău. Un design bun nu este doar frumos, ci și funcțional.',
      featured: true,
    },
    {
      title: 'Website pentru frizerie: funcționalități esențiale',
      excerpt:
        'Ce trebuie să includă un site de succes pentru un barbershop modern: de la programări online la galerie de lucrări.',
      content: 'Un website de frizerie trebuie să fie practic și atractiv.\n\nFuncționalitățile esențiale includ: sistem de programări online, galerie cu lucrări recente, prezentarea echipei și lista de prețuri.\n\nDesignul trebuie să fie masculin dar modern, cu imagini de calitate care să inspire încredere clienților potențiali.',
      featured: false,
    },
    {
      title: 'E-commerce pentru afaceri mici: ghid complet',
      excerpt:
        'Cum să începi să vinzi online fără investiții mari. Tot ce trebuie să știi despre platformele de e-commerce.',
      content: 'Vânzarea online nu trebuie să fie complicată sau scumpă.\n\nCu platforma potrivită, poți avea un magazin online funcțional în câteva zile. Important este să alegi o soluție care să crească odată cu afacerea ta.\n\nNu uita de aspectele legale: GDPR, politica de returnare și termeni și condiții sunt obligatorii pentru orice magazin online din România.',
      featured: false,
    },
    {
      title: 'SEO pentru afaceri locale: primii pași',
      excerpt:
        'Cum să fii găsit de clienți în zona ta geografică. Tehnici simple de SEO local pentru afaceri mici.',
      content: 'SEO local te ajută să fii găsit de clienții din zona ta.\n\nPrimul pas este să îți creezi un profil Google Business și să îl completezi cu toate informațiile relevante: adresă, program, fotografii.\n\nPe website, asigură-te că ai menționat orașul și zona în care activezi. Recenziile pozitive de la clienți sunt esențiale pentru clasamentul local.',
      featured: false,
    },
  ],

  // How It Works steps
  howItWorks: [
    {
      title: 'Discuție Inițială',
      description: 'Analizăm nevoile afacerii tale și stabilim obiectivele website-ului.',
      icon: 'MessageSquare' as const,
    },
    {
      title: 'Design & Dezvoltare',
      description: 'Creăm design-ul și implementăm toate funcționalitățile necesare.',
      icon: 'Settings' as const,
    },
    {
      title: 'Revizuire & Feedback',
      description: 'Îți prezentăm rezultatul și facem ajustările necesare.',
      icon: 'CheckCircle' as const,
    },
    {
      title: 'Lansare & Training',
      description: 'Publicăm site-ul și te învățăm cum să-l administrezi.',
      icon: 'Star' as const,
    },
  ],
}
