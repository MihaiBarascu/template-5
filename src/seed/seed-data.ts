/**
 * SEED DATA - Configurare Universala pentru toate tipurile de Business
 *
 * Template-5 este o platforma universala pentru site-uri de business.
 * Acest fisier contine datele pentru fiecare tip de business suportat.
 *
 * Tipuri suportate:
 * - barbershop/frizerie
 * - dentist/cabinet stomatologic
 * - avocat/cabinet juridic
 * - restaurant/cafenea
 * - auto-service/vulcanizare
 * - constructii/renovari
 * - salon/infrumusetare
 * - pensiune/turism
 * - magazin/retail
 *
 * IMPORTANT: Dupa modificari, ruleaza: pnpm seed:frizerie (sau alt tip)
 */

// =============================================================================
// BASE URL IMAGINI - Repo seed-assets pe GitHub
// =============================================================================

// Structura in seed-assets:
// template-5/
// ├── barbershop/
// │   ├── hero/
// │   ├── team/
// │   ├── gallery/
// │   └── services/
// ├── dentist/
// │   ├── hero/
// │   ├── team/
// │   ├── gallery/
// │   └── services/
// └── ... (alte nise)

export const IMAGE_BASE_URL =
  'https://raw.githubusercontent.com/MihaiBarascu/seed-assets/master/template-5/'

// =============================================================================
// IMAGINI BARBERSHOP / FRIZERIE
// =============================================================================

export const barbershopImages = {
  hero: [
    { filename: 'barbershop/hero/hero-main.jpg', alt: 'Interior barbershop modern' },
    { filename: 'barbershop/hero/hero-alt.jpg', alt: 'Barbershop atmosfera' },
  ],
  team: [
    { filename: 'barbershop/team/barber-1.jpg', alt: 'Master Barber' },
    { filename: 'barbershop/team/barber-2.jpg', alt: 'Senior Barber' },
    { filename: 'barbershop/team/barber-3.jpg', alt: 'Barber' },
    { filename: 'barbershop/team/barber-4.jpg', alt: 'Junior Barber' },
  ],
  gallery: [
    { filename: 'barbershop/gallery/gallery-1.jpg', alt: 'Scaune barbershop' },
    { filename: 'barbershop/gallery/gallery-2.jpg', alt: 'Instrumente barbering' },
    { filename: 'barbershop/gallery/gallery-3.jpg', alt: 'Tuns in proces' },
    { filename: 'barbershop/gallery/gallery-4.jpg', alt: 'Fade haircut' },
    { filename: 'barbershop/gallery/gallery-5.jpg', alt: 'Barbershop interior' },
    { filename: 'barbershop/gallery/gallery-6.jpg', alt: 'Detalii salon' },
  ],
  services: [
    { filename: 'barbershop/services/service-haircut.jpg', alt: 'Serviciu tuns' },
    { filename: 'barbershop/services/service-beard.jpg', alt: 'Serviciu barba' },
    { filename: 'barbershop/services/service-shave.jpg', alt: 'Serviciu ras' },
  ],
}

// =============================================================================
// CONFIGURARE BARBERSHOP / FRIZERIE
// =============================================================================

export const barbershopData = {
  // Business Info
  business: {
    name: 'Barber Shop Premium',
    tagline: 'Grooming de exceptie pentru barbati moderni',
    description:
      'Suntem un barbershop modern care combina tehnicile traditionale cu tendintele actuale. Oferim servicii complete de ingrijire pentru barbati intr-o atmosfera relaxata si masculina.',
    yearEstablished: 2018,
    phone: '0722 123 456',
    email: 'contact@barbershop.ro',
    whatsapp: '40722123456',
    address: {
      street: 'Calea Victoriei 45',
      city: 'Bucuresti',
      county: 'Sector 1',
      postalCode: '010061',
      country: 'Romania',
    },
    workingHours: [
      { days: 'Luni - Vineri', hours: '10:00 - 20:00' },
      { days: 'Sambata', hours: '10:00 - 18:00' },
      { days: 'Duminica', hours: 'Inchis' },
    ],
    social: {
      facebook: 'https://facebook.com/barbershop',
      instagram: 'https://instagram.com/barbershop',
      tiktok: 'https://tiktok.com/@barbershop',
    },
    stats: [
      { value: '5000+', label: 'Clienti multumiti' },
      { value: '6+', label: 'Ani experienta' },
      { value: '15+', label: 'Premii castigate' },
      { value: '4.9', label: 'Rating Google' },
    ],
  },

  // Tema
  theme: {
    preset: 'bold' as const,
    colors: {
      primary: '#1a1a1a',
      secondary: '#c9a227',
      accent: '#d4af37',
      dark: '#0d0d0d',
      light: '#f5f5f5',
      surface: '#ffffff',
      text: '#1a1a1a',
      textLight: '#666666',
      border: '#e5e5e5',
    },
    fontPreset: 'bold' as const,
    stylePreset: 'bold' as const,
    borderRadius: 'small' as const,
    shadows: 'moderate' as const,
  },

  // Servicii
  services: [
    {
      title: 'Tuns Clasic',
      shortDescription: 'Tuns profesional cu foarfeca sau masina, adaptat stilului tau',
      price: 50,
      duration: '30 min',
      icon: 'scissors',
      featured: true,
      order: 1,
      features: ['Consultanta stil', 'Spalat', 'Tuns', 'Styling'],
      ctaLabel: 'Programează-te',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Tuns + Barba',
      shortDescription: 'Pachet complet pentru un look impecabil',
      price: 80,
      duration: '45 min',
      icon: 'scissors',
      featured: true,
      order: 2,
      features: ['Tuns profesional', 'Conturare barba', 'Ras la cutit', 'Styling'],
      ctaLabel: 'Programează-te',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Aranjat Barba',
      shortDescription: 'Conturare si ingrijire barba cu prosop cald',
      price: 40,
      duration: '20 min',
      icon: 'beard',
      featured: true,
      order: 3,
      features: ['Prosop cald', 'Conturare', 'Ulei de barba', 'Styling'],
      ctaLabel: 'Programează-te',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Ras Traditional',
      shortDescription: 'Experienta clasica de barbershop cu brici',
      price: 60,
      duration: '30 min',
      icon: 'razor',
      featured: false,
      order: 4,
      features: ['Prosop cald', 'Spuma premium', 'Ras cu brici', 'After shave'],
      ctaLabel: 'Programează-te',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Tratament Par',
      shortDescription: 'Tratament intensiv pentru par sanatos si stralucitor',
      price: 70,
      duration: '40 min',
      icon: 'sparkles',
      featured: false,
      order: 5,
      features: ['Analiza par', 'Tratament keratina', 'Masaj scalp', 'Styling'],
      ctaLabel: 'Programează-te',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Pachet VIP',
      shortDescription: 'Experienta completa de grooming pentru barbati',
      price: 150,
      duration: '90 min',
      icon: 'crown',
      featured: true,
      order: 6,
      features: ['Tuns', 'Barba', 'Tratament facial', 'Masaj', 'Bautura inclusa'],
      ctaLabel: 'Programează-te',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
  ],

  // Echipa
  team: [
    {
      name: 'Alexandru Popescu',
      role: 'Master Barber & Fondator',
      experience: '12 ani experienta',
      featured: true,
      order: 1,
      imageIndex: 0,
      specializations: ['Tunsori clasice', 'Fade', 'Barba traditionala'],
    },
    {
      name: 'Mihai Ionescu',
      role: 'Senior Barber',
      experience: '8 ani experienta',
      featured: true,
      order: 2,
      imageIndex: 1,
      specializations: ['Tunsori moderne', 'Design barba', 'Colorare'],
    },
    {
      name: 'Andrei Dumitrescu',
      role: 'Barber',
      experience: '5 ani experienta',
      featured: true,
      order: 3,
      imageIndex: 2,
      specializations: ['Fade', 'Skin fade', 'Linii artistice'],
    },
    {
      name: 'George Stanescu',
      role: 'Junior Barber',
      experience: '2 ani experienta',
      featured: false,
      order: 4,
      imageIndex: 3,
      specializations: ['Tunsori de baza', 'Spalat', 'Styling'],
    },
  ],

  // Testimoniale
  testimonials: [
    {
      name: 'Radu M.',
      role: 'Client fidel',
      content:
        'Cel mai bun barbershop din oras! Atmosfera e super, baietii sunt profesionisti si mereu plec multumit. Recomand cu incredere!',
      rating: '5',
      featured: true,
    },
    {
      name: 'Cristian P.',
      role: 'Client',
      content:
        'Am incercat multe frizerii dar aici am gasit exact ce cautam. Atentie la detalii, produse de calitate si un serviciu impecabil.',
      rating: '5',
      featured: true,
    },
    {
      name: 'Dan V.',
      role: 'Client',
      content:
        'Pachetul VIP merita fiecare leu! O experienta completa de relaxare si grooming. Ma simt ca nou dupa fiecare vizita.',
      rating: '5',
      featured: true,
    },
    {
      name: 'Florin A.',
      role: 'Client',
      content:
        'Profesionalism de nota 10. Sunt client de 3 ani si nu m-am gandit niciodata sa schimb. Bravo baietilor!',
      rating: '5',
      featured: true,
    },
  ],

  // FAQ
  faq: [
    {
      question: 'Trebuie sa fac programare?',
      answer:
        'Recomandam programarea pentru a va asigura un loc. Acceptam si clienti fara programare in limita locurilor disponibile.',
      order: 1,
    },
    {
      question: 'Cat dureaza o sedinta de tuns?',
      answer:
        'Un tuns clasic dureaza aproximativ 30 de minute. Pentru servicii complete (tuns + barba) alocam 45-60 de minute.',
      order: 2,
    },
    {
      question: 'Ce metode de plata acceptati?',
      answer: 'Acceptam plata cash si cu cardul (Visa, Mastercard). De asemenea, acceptam si vouchere cadou.',
      order: 3,
    },
    {
      question: 'Oferiti servicii pentru copii?',
      answer: 'Da, oferim servicii de tuns pentru copii cu varsta peste 5 ani. Pretul este de 35 RON.',
      order: 4,
    },
    {
      question: 'Aveti parcare?',
      answer: 'Avem cateva locuri de parcare in fata salonului. De asemenea, exista parcare publica la 100m.',
      order: 5,
    },
  ],

  // Pachete de pret
  pricePackages: [
    {
      title: 'Pachet Basic',
      subtitle: 'Pentru incepatori',
      description: 'Ideal pentru cei care vor servicii de baza',
      price: 50,
      period: 'unic' as const,
      features: [
        { feature: 'Tuns clasic', included: true },
        { feature: 'Spalat', included: true },
        { feature: 'Styling de baza', included: true },
        { feature: 'Barba', included: false },
        { feature: 'Tratament', included: false },
      ],
      order: 1,
    },
    {
      title: 'Pachet Standard',
      subtitle: 'Cel mai popular',
      description: 'Combinatia perfecta pentru un look complet',
      price: 80,
      oldPrice: 90,
      period: 'unic' as const,
      features: [
        { feature: 'Tuns clasic', included: true },
        { feature: 'Spalat', included: true },
        { feature: 'Aranjat barba', included: true },
        { feature: 'Styling premium', included: true },
        { feature: 'Tratament', included: false },
      ],
      highlighted: true,
      highlightLabel: 'Cel mai popular',
      order: 2,
    },
    {
      title: 'Pachet VIP',
      subtitle: 'Experienta completa',
      description: 'Tot ce ai nevoie pentru o transformare totala',
      price: 150,
      period: 'unic' as const,
      features: [
        { feature: 'Tuns premium', included: true },
        { feature: 'Spalat cu masaj', included: true },
        { feature: 'Aranjat barba cu prosop cald', included: true },
        { feature: 'Tratament facial', included: true },
        { feature: 'Bautura inclusa', included: true },
      ],
      order: 3,
    },
    {
      title: 'Abonament Lunar',
      subtitle: 'Economiseste 20%',
      description: '4 tunsori pe luna la pret redus',
      price: 160,
      oldPrice: 200,
      period: 'luna' as const,
      features: [
        { feature: '4 tunsori pe luna', included: true },
        { feature: 'Prioritate la programare', included: true },
        { feature: '10% reducere la alte servicii', included: true },
        { feature: 'Produse de ingrijire incluse', included: true },
      ],
      order: 4,
    },
  ],

  // Navigare Header
  navigation: [
    { label: 'Acasa', type: 'custom' as const, url: '/' },
    { label: 'Servicii', type: 'custom' as const, url: '/servicii' },
    { label: 'Echipa', type: 'custom' as const, url: '/echipa' },
    { label: 'Galerie', type: 'custom' as const, url: '/galerie' },
    { label: 'Preturi', type: 'custom' as const, url: '/preturi' },
    { label: 'Blog', type: 'custom' as const, url: '/blog' },
    { label: 'Contact', type: 'custom' as const, url: '/contact' },
  ],

  // Footer
  footer: {
    columns: [
      {
        title: 'Despre noi',
        type: 'text' as const,
      },
      {
        title: 'Servicii',
        type: 'links' as const,
        links: [
          { label: 'Tuns clasic', type: 'custom' as const, url: '/servicii#tuns' },
          { label: 'Barba', type: 'custom' as const, url: '/servicii#barba' },
          { label: 'Tratamente', type: 'custom' as const, url: '/servicii#tratamente' },
        ],
      },
      {
        title: 'Program',
        type: 'schedule' as const,
      },
      {
        title: 'Contact',
        type: 'contact' as const,
      },
    ],
  },

  // Hero Homepage
  hero: {
    headline: 'Grooming de Exceptie',
    subheadline: 'Descopera experienta unui barbershop premium unde traditia intalneste stilul modern',
    ctaButtons: [
      { label: 'Programeaza-te', link: '/programare', variant: 'default' },
      { label: 'Vezi Serviciile', link: '/servicii', variant: 'outline' },
    ],
  },

  // Blog Posts
  posts: [
    {
      title: 'Cum sa alegi tunsoarea potrivita pentru forma fetei tale',
      excerpt: 'Ghid complet pentru a gasi stilul perfect care iti pune in valoare trasaturile.',
      content: `Alegerea tunsorii potrivite poate face o diferenta enorma in aspectul tau general. Forma fetei este primul factor de luat in considerare cand alegi o noua tunsoare.

Pentru o fata ovala, aproape orice stil functioneaza bine. Poti experimenta cu tunsori scurte, medii sau lungi.

Daca ai fata rotunda, opteaza pentru tunsori care adauga inaltime si lungime. Un fade lateral sau un pompadour sunt alegeri excelente.

Pentru fetele patrate, tunsorile care inmoaie colturile sunt ideale. Barba bine aranjata poate echilibra trasaturile.

Cei cu fata dreptunghiulara ar trebui sa evite tunsorile foarte scurte pe laterale si sa opteze pentru mai mult volum.

Viziteaza-ne pentru o consultatie gratuita si te ajutam sa gasesti stilul perfect pentru tine!`,
      publishedAt: '2024-11-15T10:00:00Z',
    },
    {
      title: 'Ingrijirea barbii: 5 sfaturi esentiale',
      excerpt: 'Descopera secretele unei barbi bine ingrijite direct de la expertii nostri.',
      content: `O barba bine ingrijita poate transforma complet aspectul unui barbat. Iata cele mai importante sfaturi pentru o barba sanatoasa si atragatoare.

1. Spalare regulata - Foloseste un sampon special pentru barba de 2-3 ori pe saptamana. Evita samponul obisnuit care usuca parul facial.

2. Hidratare zilnica - Aplica ulei de barba in fiecare dimineata pentru a mentine parul moale si a hidrata pielea de dedesubt.

3. Pieptanare si modelare - Foloseste un pieptan de calitate pentru a directiona firele de par si a preveni incalcirea.

4. Conturare profesionala - Viziteaza un barber la fiecare 2-3 saptamani pentru a mentine forma barbii.

5. Alimentatie si hidratare - O dieta echilibrata si suficienta apa contribuie la o crestere sanatoasa a barbii.

Vino la noi pentru produse premium de ingrijire si sfaturi personalizate!`,
      publishedAt: '2024-11-10T10:00:00Z',
    },
    {
      title: 'Tendinte in stilul masculin pentru 2024',
      excerpt: 'Ce tunsori si stiluri de barba sunt la moda in acest an.',
      content: `Anul 2024 vine cu tendinte interesante in materie de stil masculin. De la tunsori clasice reinterpretate la stiluri indraznete, iata ce este in trend.

Fade-ul continua sa domine, dar acum cu variatii mai subtile. Low fade si mid fade raman populare, oferind un aspect curat si modern.

Textured crop este una dintre cele mai cerute tunsori. Ofera un look relaxat dar ingrijit, perfect pentru barbatii care vor un stil usor de intretinut.

Barba medie, bine conturata, este la moda. Nu mai sunt populare barbile foarte lungi sau cele prea scurte - echilibrul este cheia.

Mullet-ul a revenit, dar intr-o versiune moderna, mai scurta si mai eleganta decat cea din anii 80.

Pentru cei care prefera un look clasic, side part si slick back raman alegeri sigure care nu se demodeaza niciodata.

Programeaza-te pentru o consultatie si descopera ce stil ti se potriveste cel mai bine!`,
      publishedAt: '2024-11-05T10:00:00Z',
    },
  ],

  // Layout Homepage (blocuri)
  homepageLayout: [
    {
      blockType: 'services',
      variant: 'grid-3',
      heading: 'Serviciile Noastre',
      subheading: 'Servicii profesionale de frizerie si barbering',
      source: 'collection',
      onlyFeatured: true,
      limit: 6,
      showPrices: true,
      showIcons: true,
      backgroundColor: 'light',
    },
    {
      blockType: 'stats',
      variant: 'grid-4',
      source: 'businessInfo',
      backgroundColor: 'primary',
    },
    {
      blockType: 'team',
      variant: 'grid',
      heading: 'Echipa Noastra',
      subheading: 'Profesionisti pasionati de meseria lor',
      source: 'collection',
      onlyFeatured: true,
      limit: 4,
      backgroundColor: 'default',
    },
    {
      blockType: 'testimonials',
      variant: 'carousel',
      heading: 'Ce Spun Clientii',
      subheading: 'Pareri reale de la clientii nostri fideli',
      source: 'collection',
      onlyFeatured: true,
      showRating: true,
      showAvatar: true,
      autoplay: true,
      backgroundColor: 'light',
    },
    {
      blockType: 'faq',
      variant: 'accordion',
      heading: 'Intrebari Frecvente',
      subheading: 'Raspunsuri la cele mai comune intrebari',
      source: 'collection',
      limit: 10,
      defaultOpen: 'first',
      backgroundColor: 'default',
    },
    {
      blockType: 'cta',
      variant: 'centered',
      headline: 'Gata pentru o Transformare?',
      subheadline: 'Programeaza-te acum si descopera diferenta unui barbershop premium',
      buttons: [{ label: 'Programeaza-te Acum', link: '/programare', variant: 'default' }],
      backgroundColor: 'dark',
    },
  ],
}

// =============================================================================
// IMAGINI DENTIST / CABINET STOMATOLOGIC
// =============================================================================

export const dentistImages = {
  hero: [
    { filename: 'dentist/hero/hero-main.jpg', alt: 'Cabinet stomatologic modern' },
    { filename: 'dentist/hero/hero-alt.jpg', alt: 'Echipament dentar' },
  ],
  team: [
    { filename: 'dentist/team/doctor-1.jpg', alt: 'Medic stomatolog' },
    { filename: 'dentist/team/doctor-2.jpg', alt: 'Medic specialist' },
    { filename: 'dentist/team/doctor-3.jpg', alt: 'Asistent medical' },
    { filename: 'dentist/team/doctor-4.jpg', alt: 'Receptioner' },
  ],
  gallery: [
    // Note: gallery-1.jpg was corrupted, removed. Only include valid images.
    { filename: 'dentist/gallery/gallery-2.jpg', alt: 'Sala tratament' },
    { filename: 'dentist/gallery/gallery-3.jpg', alt: 'Echipament modern' },
    { filename: 'dentist/gallery/gallery-4.jpg', alt: 'Receptie clinica' },
  ],
  services: [
    // Note: services folder is empty, no images to include
  ],
}

// =============================================================================
// CONFIGURARE DENTIST / CABINET STOMATOLOGIC
// =============================================================================

export const dentistData = {
  // Business Info
  business: {
    name: 'DentalMed Clinic',
    tagline: 'Zambetul tau, prioritatea noastra',
    description:
      'Clinica DentalMed ofera servicii stomatologice complete folosind cele mai avansate tehnologii si materiale. Echipa noastra de specialisti va asigura cele mai bune tratamente intr-o atmosfera relaxanta.',
    yearEstablished: 2015,
    phone: '0723 456 789',
    email: 'contact@dentalmed.ro',
    whatsapp: '40723456789',
    address: {
      street: 'Bulevardul Unirii 120',
      city: 'Bucuresti',
      county: 'Sector 3',
      postalCode: '030167',
      country: 'Romania',
    },
    workingHours: [
      { days: 'Luni - Vineri', hours: '09:00 - 19:00' },
      { days: 'Sambata', hours: '09:00 - 14:00' },
      { days: 'Duminica', hours: 'Inchis' },
    ],
    social: {
      facebook: 'https://facebook.com/dentalmed',
      instagram: 'https://instagram.com/dentalmed',
    },
    stats: [
      { value: '10000+', label: 'Pacienti multumiti' },
      { value: '8+', label: 'Ani experienta' },
      { value: '5', label: 'Medici specialisti' },
      { value: '4.9', label: 'Rating Google' },
    ],
  },

  // Tema
  theme: {
    preset: 'modern' as const,
    colors: {
      primary: '#0ea5e9',
      secondary: '#06b6d4',
      accent: '#14b8a6',
      dark: '#0c4a6e',
      light: '#f0f9ff',
      surface: '#ffffff',
      text: '#0c4a6e',
      textLight: '#64748b',
      border: '#e2e8f0',
    },
    fontPreset: 'modern' as const,
    stylePreset: 'modern' as const,
    borderRadius: 'medium' as const,
    shadows: 'subtle' as const,
  },

  // Servicii
  services: [
    {
      title: 'Consultatie si Diagnostic',
      shortDescription: 'Evaluare completa a sanatatii orale cu radiografie digitala',
      price: 100,
      duration: '30 min',
      icon: 'stethoscope',
      featured: true,
      order: 1,
      features: ['Examinare completa', 'Radiografie digitala', 'Plan de tratament', 'Consultanta'],
      ctaLabel: 'Programează consultație',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Detartraj si Igienizare',
      shortDescription: 'Curatare profesionala pentru dinti sanatosi si gingii sanatoase',
      price: 200,
      duration: '45 min',
      icon: 'sparkles',
      featured: true,
      order: 2,
      features: ['Detartraj ultrasonic', 'Air-flow', 'Periaj profesional', 'Sfaturi ingrijire'],
      ctaLabel: 'Programează tratament',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Obturatii Estetice',
      shortDescription: 'Plombe din materiale composite de ultima generatie',
      price: 250,
      priceFrom: true,
      duration: '45 min',
      icon: 'tooth',
      featured: true,
      order: 3,
      features: ['Material compozit', 'Aspect natural', 'Durabilitate', 'Fara durere'],
      ctaLabel: 'Programează tratament',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Implant Dentar',
      shortDescription: 'Solutia permanenta pentru dintii lipsa',
      price: 2500,
      priceFrom: true,
      duration: '60 min',
      icon: 'implant',
      featured: true,
      order: 4,
      features: ['Implant premium', 'Coroana ceramica', 'Garantie 10 ani', 'CT 3D inclus'],
      ctaLabel: 'Programează consultație',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Albire Dentara',
      shortDescription: 'Zambeste cu incredere cu dinti albi stralucitori',
      price: 800,
      duration: '60 min',
      icon: 'sun',
      featured: false,
      order: 5,
      features: ['Albire LED', 'Pana la 8 nuante', 'Rezultat imediat', 'Kit intretinere'],
      ctaLabel: 'Programează tratament',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Ortodontie',
      shortDescription: 'Aparate dentare moderne pentru un zambet perfect',
      price: 3500,
      priceFrom: true,
      duration: '45 min',
      icon: 'alignment',
      featured: false,
      order: 6,
      features: ['Aparat metalic/ceramic', 'Invisalign', 'Consultatie gratuita', 'Plan tratament'],
      ctaLabel: 'Programează consultație',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
  ],

  // Echipa
  team: [
    {
      name: 'Dr. Maria Popescu',
      role: 'Medic Primar Stomatolog',
      experience: '15 ani experienta',
      featured: true,
      order: 1,
      imageIndex: 0,
      specializations: ['Implantologie', 'Chirurgie orala', 'Estetica dentara'],
    },
    {
      name: 'Dr. Andrei Ionescu',
      role: 'Medic Specialist Ortodont',
      experience: '10 ani experienta',
      featured: true,
      order: 2,
      imageIndex: 1,
      specializations: ['Ortodontie', 'Invisalign', 'Aparate dentare'],
    },
    {
      name: 'Dr. Elena Stanescu',
      role: 'Medic Stomatolog',
      experience: '8 ani experienta',
      featured: true,
      order: 3,
      imageIndex: 2,
      specializations: ['Endodontie', 'Estetica', 'Parodontologie'],
    },
    {
      name: 'Ana Marinescu',
      role: 'Asistent Medical',
      experience: '6 ani experienta',
      featured: false,
      order: 4,
      imageIndex: 3,
      specializations: ['Asistenta tratamente', 'Sterilizare', 'Relatie pacienti'],
    },
  ],

  // Testimoniale
  testimonials: [
    {
      name: 'Ioana M.',
      role: 'Pacienta',
      content:
        'Am avut o experienta excelenta la DentalMed! Doctorul a fost foarte atent si m-a facut sa ma simt confortabil pe tot parcursul tratamentului.',
      rating: '5',
      featured: true,
    },
    {
      name: 'George P.',
      role: 'Pacient',
      content:
        'Dupa multi ani de frica de dentist, aici am gasit o echipa care m-a ajutat sa depasesc aceasta teama. Recomand cu incredere!',
      rating: '5',
      featured: true,
    },
    {
      name: 'Alexandra D.',
      role: 'Pacienta',
      content:
        'Implantul meu arata si se simte ca un dinte natural. Sunt foarte multumita de rezultat si de profesionalismul echipei.',
      rating: '5',
      featured: true,
    },
  ],

  // FAQ
  faq: [
    {
      question: 'Este necesara programare?',
      answer:
        'Da, recomandam programarea telefonica sau online pentru a va asigura ca primiti atentia necesara la momentul vizitei.',
      order: 1,
    },
    {
      question: 'Acceptati asigurari medicale?',
      answer:
        'Da, colaboram cu majoritatea companiilor de asigurari medicale. Va rugam sa ne contactati pentru detalii despre asigurarea dvs.',
      order: 2,
    },
    {
      question: 'Tratamentele sunt dureroase?',
      answer:
        'Folosim tehnici moderne de anestezie care asigura confort maxim. Majoritatea pacientilor nostri nu simt disconfort in timpul tratamentelor.',
      order: 3,
    },
    {
      question: 'Oferiti plata in rate?',
      answer: 'Da, oferim posibilitatea de plata in rate fara dobanda pentru tratamente mai complexe.',
      order: 4,
    },
  ],

  // Navigare Header
  navigation: [
    { label: 'Acasa', type: 'custom' as const, url: '/' },
    { label: 'Servicii', type: 'custom' as const, url: '/servicii' },
    { label: 'Echipa', type: 'custom' as const, url: '/echipa' },
    { label: 'Galerie', type: 'custom' as const, url: '/galerie' },
    { label: 'Preturi', type: 'custom' as const, url: '/preturi' },
    { label: 'Blog', type: 'custom' as const, url: '/blog' },
    { label: 'Contact', type: 'custom' as const, url: '/contact' },
  ],

  // Hero Homepage
  hero: {
    headline: 'Zambetul tau, prioritatea noastra',
    subheadline: 'Clinica stomatologica moderna cu echipa de specialisti dedicati sanatatii tale orale',
    ctaButtons: [
      { label: 'Programeaza Consultatie', link: '/programare', variant: 'default' },
      { label: 'Vezi Serviciile', link: '/servicii', variant: 'outline' },
    ],
  },

  // Blog Posts
  posts: [
    {
      title: 'Cat de des ar trebui sa mergi la dentist?',
      excerpt: 'Afla frecventa ideala a vizitelor la stomatolog pentru o sanatate orala optima.',
      content: `Vizitele regulate la dentist sunt esentiale pentru mentinerea sanatatii orale. Dar cat de des ar trebui sa mergi?

Pentru majoritatea adultilor, recomandam vizite la fiecare 6 luni pentru control si igienizare profesionala. Aceasta frecventa permite depistarea timpurie a problemelor.

Unele persoane pot avea nevoie de vizite mai frecvente, la 3-4 luni. Acestea includ: fumatorii, persoanele cu diabet, cei cu probleme de gingii sau cei predispusi la carii.

Copiii ar trebui sa mearga la dentist la fiecare 6 luni, incepand de la varsta de 1 an sau de la aparitia primului dinte.

Intre vizite, mentine o igiena orala riguroasa: periaj de doua ori pe zi, folosirea atei dentare si a apei de gura.

Programeaza-te pentru un control si asigura-te ca zambetul tau ramane sanatos!`,
      publishedAt: '2024-11-20T10:00:00Z',
    },
    {
      title: 'Tot ce trebuie sa stii despre implanturile dentare',
      excerpt: 'Ghid complet despre implanturi: procedura, beneficii si ingrijire.',
      content: `Implanturile dentare sunt solutia moderna si permanenta pentru inlocuirea dintilor lipsa. Iata ce trebuie sa stii inainte de a lua o decizie.

Ce este un implant dentar? Este o radacina artificiala din titan care se insereaza in os si sustine o coroana dentara. Arata si functioneaza ca un dinte natural.

Procedura se desfasoara in etape: 1) Insertia implantului, 2) Perioada de vindecare (3-6 luni), 3) Montarea coroanei finale.

Avantajele implanturilor: durabilitate de peste 20 ani, aspect natural, nu afecteaza dintii vecini, previne resorbita osoasa.

Cine poate beneficia? Majoritatea adultilor cu sanatate generala buna sunt candidati potriviti. Densitatea osoasa poate fi imbunatatita prin proceduri suplimentare.

Ingrijirea este simpla: periaj normal, ata dentara si vizite regulate la dentist.

Vino pentru o consultatie gratuita si afla daca implanturile sunt potrivite pentru tine!`,
      publishedAt: '2024-11-15T10:00:00Z',
    },
    {
      title: 'Albirile dentare: mit vs realitate',
      excerpt: 'Descopera adevarul despre albirea dentara profesionala.',
      content: `Albirea dentara este una dintre cele mai populare proceduri estetice. Dar ce este mit si ce este realitate?

MIT: Albirea dauneaza smaltului. REALITATE: Procedurile profesionale folosesc geluri special formulate care sunt sigure pentru smalt.

MIT: Rezultatele sunt permanente. REALITATE: Albirea dureaza 1-3 ani, in functie de dieta si igiena orala. Pot fi necesare retusuri.

MIT: Toate petele pot fi eliminate. REALITATE: Petele externe (cafea, vin, tutun) raspund bine. Petele intrinseci pot necesita alte tratamente.

MIT: Kiturile de acasa sunt la fel de eficiente. REALITATE: Produsele profesionale contin concentratii mai mari si sunt aplicate controlat.

Ce poti astepta: albirea profesionala poate deschide nuanta cu 5-8 tonuri intr-o singura sedinta de aproximativ 60 de minute.

Programeaza-te pentru o consultatie si descopera ce optiune de albire ti se potriveste!`,
      publishedAt: '2024-11-10T10:00:00Z',
    },
  ],

  // Layout Homepage
  homepageLayout: [
    {
      blockType: 'services',
      variant: 'grid-3',
      heading: 'Serviciile Noastre',
      subheading: 'Tratamente stomatologice complete pentru intreaga familie',
      source: 'collection',
      onlyFeatured: true,
      limit: 6,
      showPrices: true,
      showIcons: true,
      backgroundColor: 'light',
    },
    {
      blockType: 'stats',
      variant: 'grid-4',
      source: 'businessInfo',
      backgroundColor: 'primary',
    },
    {
      blockType: 'team',
      variant: 'grid',
      heading: 'Echipa Medicala',
      subheading: 'Specialisti cu experienta dedicati sanatatii tale',
      source: 'collection',
      onlyFeatured: true,
      limit: 4,
      backgroundColor: 'default',
    },
    {
      blockType: 'testimonials',
      variant: 'carousel',
      heading: 'Pareri Pacienti',
      subheading: 'Ce spun pacientii nostri despre experienta lor',
      source: 'collection',
      onlyFeatured: true,
      showRating: true,
      showAvatar: true,
      autoplay: true,
      backgroundColor: 'light',
    },
    {
      blockType: 'faq',
      variant: 'accordion',
      heading: 'Intrebari Frecvente',
      subheading: 'Raspunsuri la cele mai comune intrebari',
      source: 'collection',
      limit: 10,
      defaultOpen: 'first',
      backgroundColor: 'default',
    },
    {
      blockType: 'cta',
      variant: 'centered',
      headline: 'Zambeste cu Incredere',
      subheadline: 'Programeaza-te pentru o consultatie si descopera cum te putem ajuta',
      buttons: [{ label: 'Programeaza Acum', link: '/programare', variant: 'default' }],
      backgroundColor: 'dark',
    },
  ],
}

// =============================================================================
// IMAGINI RESTAURANT / CAFENEA
// =============================================================================

export const restaurantImages = {
  hero: [
    { filename: 'restaurant/hero/hero-main.jpg', alt: 'Interior restaurant' },
    { filename: 'restaurant/hero/hero-alt.jpg', alt: 'Preparate culinare' },
  ],
  team: [
    { filename: 'restaurant/team/chef-1.jpg', alt: 'Bucatar sef' },
    { filename: 'restaurant/team/chef-2.jpg', alt: 'Sous chef' },
  ],
  gallery: [
    { filename: 'restaurant/gallery/gallery-1.jpg', alt: 'Preparate restaurant' },
    { filename: 'restaurant/gallery/gallery-2.jpg', alt: 'Interior restaurant' },
    { filename: 'restaurant/gallery/gallery-3.jpg', alt: 'Desert' },
    { filename: 'restaurant/gallery/gallery-4.jpg', alt: 'Vin' },
  ],
  // Footer decorative element (optional)
  footer: [{ filename: 'textures/restaurant-decorative.png', alt: 'Restaurant decorative element' }],
}

// =============================================================================
// CONFIGURARE RESTAURANT
// =============================================================================

export const restaurantData = {
  business: {
    name: 'La Copac Restaurant',
    tagline: 'Unde gustul intalneste traditia',
    description:
      'Restaurant traditional romanesc cu preparate autentice gatite dupa retete mostenite din generatie in generatie. Ingrediente proaspete, atmosfera calda si ospitalitate de exceptie.',
    yearEstablished: 2010,
    phone: '0724 567 890',
    email: 'rezervari@lacopac.ro',
    whatsapp: '40724567890',
    address: {
      street: 'Strada Lipscani 45',
      city: 'Bucuresti',
      county: 'Sector 3',
      postalCode: '030033',
      country: 'Romania',
    },
    workingHours: [
      { days: 'Luni - Joi', hours: '12:00 - 23:00' },
      { days: 'Vineri - Sambata', hours: '12:00 - 01:00' },
      { days: 'Duminica', hours: '12:00 - 22:00' },
    ],
    social: {
      facebook: 'https://facebook.com/lacopac',
      instagram: 'https://instagram.com/lacopac',
      tiktok: 'https://tiktok.com/@lacopac',
    },
    stats: [
      { value: '50000+', label: 'Clienti serviti' },
      { value: '14+', label: 'Ani experienta' },
      { value: '150', label: 'Locuri' },
      { value: '4.8', label: 'Rating Google' },
    ],
  },

  theme: {
    preset: 'classic' as const,
    colors: {
      primary: '#8b4513',
      secondary: '#d2691e',
      accent: '#f4a460',
      dark: '#2c1810',
      light: '#fdf5e6',
      surface: '#ffffff',
      text: '#2c1810',
      textLight: '#6b4423',
      border: '#deb887',
    },
    fontPreset: 'elegant' as const,
    stylePreset: 'classic' as const,
    borderRadius: 'small' as const,
    shadows: 'moderate' as const,
  },

  services: [
    {
      title: 'Meniu Traditional',
      shortDescription: 'Preparate romanesti autentice din ingrediente proaspete',
      icon: 'UtensilsCrossed',
      featured: true,
      order: 1,
      displayStyle: 'menu-item' as const,
      attributes: [
        { label: 'Preț', value: 'de la 50 RON', icon: 'Banknote' },
      ],
      ctaLabel: 'Rezervă o masă',
      ctaLink: '/rezervare',
      backLabel: 'Înapoi la meniu',
      backLink: '/meniu',
    },
    {
      title: 'Meniu Degustare',
      shortDescription: '7 feluri de mancare cu vinuri selectate',
      icon: 'Wine',
      featured: true,
      order: 2,
      displayStyle: 'menu-item' as const,
      attributes: [
        { label: 'Preț', value: '250 RON', icon: 'Banknote' },
        { label: 'Feluri', value: '7 feluri', icon: 'ChefHat' },
      ],
      ctaLabel: 'Rezervă o masă',
      ctaLink: '/rezervare',
      backLabel: 'Înapoi la meniu',
      backLink: '/meniu',
    },
    {
      title: 'Evenimente Private',
      shortDescription: 'Organizare evenimente pentru 20-150 persoane',
      icon: 'PartyPopper',
      featured: true,
      order: 3,
      displayStyle: 'card' as const,
      attributes: [
        { label: 'Preț', value: 'de la 100 RON/pers', icon: 'Banknote' },
        { label: 'Capacitate', value: '20-150 pers', icon: 'Users' },
      ],
      ctaLabel: 'Solicită ofertă',
      ctaLink: '/contact',
      backLabel: 'Înapoi la meniu',
      backLink: '/meniu',
    },
    {
      title: 'Catering',
      shortDescription: 'Servicii de catering pentru evenimente',
      icon: 'Truck',
      featured: false,
      order: 4,
      displayStyle: 'card' as const,
      attributes: [
        { label: 'Preț', value: 'de la 80 RON/pers', icon: 'Banknote' },
      ],
      ctaLabel: 'Solicită ofertă',
      ctaLink: '/contact',
      backLabel: 'Înapoi la meniu',
      backLink: '/meniu',
    },
  ],

  navigation: [
    { label: 'Acasa', type: 'custom' as const, url: '/' },
    { label: 'Meniu', type: 'custom' as const, url: '/meniu' },
    { label: 'Galerie', type: 'custom' as const, url: '/galerie' },
    { label: 'Despre Noi', type: 'custom' as const, url: '/despre' },
    { label: 'Blog', type: 'custom' as const, url: '/blog' },
    { label: 'Contact', type: 'custom' as const, url: '/contact' },
  ],

  hero: {
    headline: 'Unde gustul intalneste traditia',
    subheadline: 'Descopera aromele autentice ale bucatariei romanesti intr-o atmosfera calda si primitoare',
    ctaButtons: [
      { label: 'Rezerva Masa', link: '/rezervare', variant: 'default' },
      { label: 'Vezi Meniul', link: '/meniu', variant: 'outline' },
    ],
  },

  // Blog Posts
  posts: [
    {
      title: 'Secretele bucatariei traditionale romanesti',
      excerpt: 'Descopera ingredientele si tehnicile care fac bucataria noastra speciala.',
      content: `Bucataria traditionala romaneasca este o comoara culinara care se transmite din generatie in generatie. La restaurantul nostru, pastram vie aceasta traditie.

Ingredientele proaspete sunt baza oricarui preparat exceptional. Colaboram cu producatori locali pentru legume de sezon, carne de calitate si lactate artizanale.

Tehnicile traditionale fac diferenta: gatitul lent in cuptor, marinatul, afumatul natural. Nu ne grabim - savoarea are nevoie de timp.

Retetele noastre au povesti. Fiecare fel de mancare vine cu o istorie, pastrata cu sfintenie de bucatarii nostri care au invatat de la bunicile lor.

Atmosfera conteaza la fel de mult ca si mancarea. Am creat un spatiu cald, primitor, unde te simti ca acasa.

Te asteptam sa descoperi aromele autentice ale Romaniei!`,
      publishedAt: '2024-11-18T10:00:00Z',
    },
    {
      title: 'Cum sa organizezi petrecerea perfecta la restaurant',
      excerpt: 'Sfaturi pentru evenimente memorabile - de la meniuri la decoratiuni.',
      content: `Organizarea unui eveniment la restaurant poate fi simpla daca stii ce intrebari sa pui si ce sa ceri.

Stabileste bugetul din start. Noi oferim pachete flexibile care pot fi adaptate nevoilor tale, de la meniuri fixe la bufet suedez.

Alege meniul cu grija. Pentru evenimente mari, recomandam 3-4 feluri de mancare si optiuni pentru persoanele cu restrictii alimentare.

Decoratiunile fac diferenta. Putem personaliza spatiul conform temei evenimentului tau - de la nunti elegante la petreceri corporate.

Nu uita de bauturi! Oferim selectii de vinuri locale si internationale, plus optiuni non-alcoolice creative.

Rezerva din timp, mai ales in weekend si in sezonul evenimentelor (mai-septembrie, decembrie).

Contacteaza-ne pentru o intalnire de planificare gratuita!`,
      publishedAt: '2024-11-12T10:00:00Z',
    },
    {
      title: 'Vinuri romanesti pe care trebuie sa le incerci',
      excerpt: 'Ghid pentru cele mai bune vinuri autohtone, selectate de somelierul nostru.',
      content: `Romania are o traditie viticola de mii de ani, iar vinurile noastre merita sa fie descoperite. Iata recomandarile somelierului nostru.

Feteasca Neagra - Regele vinurilor rosii romanesti. Un vin rosu elegant, cu arome de fructe de padure si condimente, perfect langa fripturi.

Feteasca Regala - Pentru iubitorii de vinuri albe aromate. Note florale si de fructe exotice, ideal ca aperitiv sau langa peste.

Tamaioasa Romaneasca - Un vin aromat unic in lume. Perfect pentru deserturi sau ca vin de meditatie.

Negru de Dragasani - Un rosu puternic din soiul autohton, cu potential de invechire. Excelent langa vanat si branzeturi maturate.

Cramposie - Un alb racoritor, perfect pentru zilele de vara. Se aseaza bine langa salate si fructe de mare.

Vino sa descoperi aceste comori in selectia noastra de vinuri!`,
      publishedAt: '2024-11-05T10:00:00Z',
    },
  ],
}

// =============================================================================
// IMAGINI AUTO SERVICE
// =============================================================================

export const autoServiceImages = {
  hero: [
    { filename: 'auto-service/hero/hero-main.jpg', alt: 'Service auto modern' },
    { filename: 'auto-service/hero/hero-alt.jpg', alt: 'Atelier mecanic' },
  ],
  team: [
    { filename: 'auto-service/team/mechanic-1.jpg', alt: 'Mecanic sef' },
    { filename: 'auto-service/team/mechanic-2.png', alt: 'Mecanic auto' },
    { filename: 'auto-service/team/mechanic-3.jpg', alt: 'Electrician auto' },
    { filename: 'auto-service/team/mechanic-4.jpg', alt: 'Vulcanizator' },
  ],
  gallery: [
    { filename: 'auto-service/gallery/gallery-1.jpg', alt: 'Hala service' },
    { filename: 'auto-service/gallery/gallery-2.jpg', alt: 'Echipamente diagnoza' },
    { filename: 'auto-service/gallery/gallery-3.jpg', alt: 'Reparatie motor' },
    { filename: 'auto-service/gallery/gallery-4.jpg', alt: 'Vulcanizare' },
    { filename: 'auto-service/gallery/gallery-5.jpg', alt: 'ITP' },
    { filename: 'auto-service/gallery/gallery-6.jpg', alt: 'Zona asteptare' },
  ],
}

// =============================================================================
// CONFIGURARE AUTO SERVICE
// =============================================================================

export const autoServiceData = {
  business: {
    name: 'AutoPro Service',
    tagline: 'Service auto de incredere',
    description:
      'Service auto complet cu echipamente moderne si mecanici cu experienta. Oferim reparatii, intretinere, diagnoza computerizata si vulcanizare pentru toate marcile auto.',
    yearEstablished: 2008,
    phone: '0722 555 666',
    email: 'contact@autopro.ro',
    whatsapp: '40722555666',
    address: {
      street: 'Soseaua Colentina 250',
      city: 'Bucuresti',
      county: 'Sector 2',
      postalCode: '021187',
      country: 'Romania',
    },
    workingHours: [
      { days: 'Luni - Vineri', hours: '08:00 - 18:00' },
      { days: 'Sambata', hours: '09:00 - 14:00' },
      { days: 'Duminica', hours: 'Inchis' },
    ],
    social: {
      facebook: 'https://facebook.com/autopro',
      instagram: 'https://instagram.com/autopro',
    },
    stats: [
      { value: '16+', label: 'Ani experienta' },
      { value: '25000+', label: 'Masini reparate' },
      { value: '8', label: 'Posturi lucru' },
      { value: '4.8', label: 'Rating Google' },
    ],
  },

  services: [
    {
      title: 'Diagnoza Computerizata',
      shortDescription: 'Identificam rapid problemele cu echipamente profesionale',
      price: 80,
      duration: '30 min',
      icon: 'cpu',
      featured: true,
      order: 1,
      features: ['Citire coduri eroare', 'Testare senzori', 'Reset adaptari', 'Raport complet'],
      ctaLabel: 'Programează-te',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Schimb Ulei si Filtre',
      shortDescription: 'Intretinere de baza pentru motor sanatos',
      price: 150,
      priceFrom: true,
      duration: '45 min',
      icon: 'droplet',
      featured: true,
      order: 2,
      features: ['Ulei premium', 'Filtru ulei', 'Filtru aer', 'Verificare nivele'],
      ctaLabel: 'Programează-te',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Reparatii Frane',
      shortDescription: 'Siguranta ta pe drum este prioritatea noastra',
      price: 200,
      priceFrom: true,
      duration: '1-2 ore',
      icon: 'shield',
      featured: true,
      order: 3,
      features: ['Inlocuire placute', 'Inlocuire discuri', 'Reglaj frane', 'Schimb lichid frana'],
      ctaLabel: 'Programează-te',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Vulcanizare',
      shortDescription: 'Montaj, echilibrare si reparatii anvelope',
      price: 60,
      priceFrom: true,
      duration: '30 min',
      icon: 'tire',
      featured: true,
      order: 4,
      features: ['Montaj/demontaj', 'Echilibrare', 'Reparatii pana', 'Hotel anvelope'],
      ctaLabel: 'Programează-te',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Reparatii Suspensie',
      shortDescription: 'Confort si stabilitate in mers',
      price: 300,
      priceFrom: true,
      duration: '2-4 ore',
      icon: 'car',
      featured: false,
      order: 5,
      features: ['Amortizoare', 'Arcuri', 'Brate suspensie', 'Geometrie roti'],
      ctaLabel: 'Programează-te',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'ITP',
      shortDescription: 'Inspectie tehnica periodica autorizata RAR',
      price: 150,
      duration: '30 min',
      icon: 'check-circle',
      featured: true,
      order: 6,
      features: ['Autoturisme', 'Autoutilitare', 'Eliberare certificat', 'Programare rapida'],
      ctaLabel: 'Programează ITP',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
  ],

  team: [
    {
      name: 'Mihai Stanescu',
      role: 'Mecanic Sef / Fondator',
      experience: '20 ani experienta',
      featured: true,
      order: 1,
      imageIndex: 0,
      specializations: ['Motoare diesel', 'Diagnoza avansata', 'Cutii automate'],
    },
    {
      name: 'Adrian Popescu',
      role: 'Mecanic Auto',
      experience: '15 ani experienta',
      featured: true,
      order: 2,
      imageIndex: 1,
      specializations: ['Sisteme de franare', 'Suspensie', 'Directie'],
    },
    {
      name: 'George Ionescu',
      role: 'Electrician Auto',
      experience: '12 ani experienta',
      featured: true,
      order: 3,
      imageIndex: 2,
      specializations: ['Instalatii electrice', 'Clima auto', 'Diagnoza'],
    },
    {
      name: 'Florin Dumitru',
      role: 'Vulcanizator',
      experience: '8 ani experienta',
      featured: false,
      order: 4,
      imageIndex: 3,
      specializations: ['Anvelope', 'Jante', 'Geometrie 3D'],
    },
  ],

  testimonials: [
    {
      name: 'Alexandru M.',
      role: 'VW Golf GTI',
      content:
        'Service serios si profesionist! Mi-au rezolvat o problema pe care alte service-uri nu au reusit sa o identifice. Preturi corecte, recomand!',
      rating: '5',
      featured: true,
    },
    {
      name: 'Maria P.',
      role: 'BMW X3',
      content:
        'Am fost pentru schimb distributie si revizie completa. Lucru curat, termene respectate si preturi corecte.',
      rating: '5',
      featured: true,
    },
    {
      name: 'Dan V.',
      role: 'Dacia Duster',
      content:
        'Vin aici de 5 ani pentru toate problemele masinii. Sunt de incredere, lucreaza repede si bine.',
      rating: '5',
      featured: true,
    },
  ],

  faq: [
    {
      question: 'Trebuie sa fac programare?',
      answer:
        'Recomandam programarea pentru a va asigura un loc. Pentru urgente, incercam sa va primim si fara programare.',
      order: 1,
    },
    {
      question: 'Ce marci auto reparati?',
      answer:
        'Reparam toate marcile auto, de la europene (VW, BMW, Mercedes) pana la asiatice si romanesti.',
      order: 2,
    },
    {
      question: 'Oferiti garantie?',
      answer:
        'Da, oferim garantie pentru toate lucrarile si piesele montate (6-24 luni in functie de interventie).',
      order: 3,
    },
    {
      question: 'Aveti piese in stoc?',
      answer: 'Avem piese uzuale in stoc. Pentru piese speciale, le comandam in 1-2 zile.',
      order: 4,
    },
  ],

  navigation: [
    { label: 'Acasa', type: 'custom' as const, url: '/' },
    { label: 'Servicii', type: 'custom' as const, url: '/servicii' },
    { label: 'Preturi', type: 'custom' as const, url: '/preturi' },
    { label: 'Echipa', type: 'custom' as const, url: '/echipa' },
    { label: 'Blog', type: 'custom' as const, url: '/blog' },
    { label: 'Contact', type: 'custom' as const, url: '/contact' },
  ],

  hero: {
    headline: 'Service Auto de Incredere',
    subheadline:
      'Reparatii auto profesionale, diagnoza computerizata si ITP. Peste 16 ani de experienta.',
    ctaButtons: [
      { label: 'Programeaza-te', link: '/programare', variant: 'default' },
      { label: 'Vezi Serviciile', link: '/servicii', variant: 'outline' },
    ],
  },

  // Blog Posts
  posts: [
    {
      title: 'Cand sa schimbi uleiul si filtrele la masina',
      excerpt: 'Ghid complet pentru intretinerea corecta a motorului tau.',
      content: `Schimbul de ulei la timp este esential pentru viata lunga a motorului. Dar cand ar trebui sa-l faci?

Regula generala: schimba uleiul la fiecare 10.000-15.000 km sau o data pe an, in functie de ce se intampla mai intai.

Pentru condus urban (opriri frecvente, distante scurte), recomand schimbul la 10.000 km sau chiar mai devreme. Motorul nu ajunge la temperatura optima si uleiul se contamineaza mai repede.

Pentru condus preponderent pe autostrada, poti extinde la 15.000 km, deoarece motorul functioneaza in conditii optime.

Filtrele sunt la fel de importante: filtrul de ulei se schimba la fiecare schimb de ulei, filtrul de aer la 20.000-30.000 km, iar filtrul de habitaclu anual.

Foloseste intotdeauna ulei de calitate, recomandat de producatorul masinii. Economisirea la ulei se va plati scump in reparatii.

Programeaza-te pentru revizie si ai grija de motorul tau!`,
      publishedAt: '2024-11-20T10:00:00Z',
    },
    {
      title: '5 semne ca trebuie sa schimbi franele',
      excerpt: 'Nu ignora aceste semnale de alarma pentru siguranta ta pe drum.',
      content: `Sistemul de franare este cel mai important sistem de siguranta al masinii. Iata semnele care indica ca e timpul pentru o verificare.

1. Zgomot la franare - Daca auzi un sunet ascutit metalic, placutele sunt uzate. Acesta este un indicator incorporat in placute pentru a te avertiza.

2. Vibratii in pedala sau volan - Discurile deformate sau uzate neuniform cauzeaza vibratii la franare.

3. Masina trage intr-o parte la franare - Poate indica uzura neuniforma a placutelor sau probleme cu etrierele.

4. Pedala de frana moale sau trebuie apasata mai mult - Poate semnala aer in sistemul hidraulic sau probleme cu pompa de frana.

5. Indicator luminos pe bord - Nu ignora niciodata lumina de avertizare pentru frane!

Nu astepta pana devine o urgenta. Verificarea franelor ia doar cateva minute si poate salva vieti.

Vino pentru o inspectie gratuita a sistemului de franare!`,
      publishedAt: '2024-11-15T10:00:00Z',
    },
    {
      title: 'Pregatirea masinii pentru iarna',
      excerpt: 'Lista completa pentru un sezon rece fara probleme.',
      content: `Iarna pune la incercare masina ta. O pregatire corespunzatoare iti va asigura calatorii sigure si fara surprize.

Anvelopele de iarna sunt obligatorii! Montaza-le cand temperatura scade constant sub 7°C. Verifica profilul si presiunea lunar.

Bateria sufera cel mai mult iarna. Testeaza-o inainte de sezonul rece - o baterie mai veche de 4 ani poate ceda oricand.

Antigel si lichid de parbriz - Verifica concentratia de antigel si foloseste lichid de parbriz cu protectie la inghet pana la -20°C.

Stergatoarele trebuie sa fie in stare buna. Inlocuieste-le daca lasa dara sau sare.

Luminile trebuie sa functioneze perfect. Zilele scurte si vremea rea necesita vizibilitate maxima.

Kit de urgenta: patura, lanterna, cablu de tractare, lopata mica, antigel de rezerva.

Programeaza-te pentru verificarea de iarna si calatoreste in siguranta!`,
      publishedAt: '2024-11-01T10:00:00Z',
    },
  ],
}

// =============================================================================
// IMAGINI SALON INFRUMUSETARE
// =============================================================================

export const salonImages = {
  hero: [
    { filename: 'salon/hero/hero-main.jpg', alt: 'Salon infrumusetare modern' },
    { filename: 'salon/hero/hero-alt.jpg', alt: 'Interior salon' },
  ],
  team: [
    { filename: 'salon/team/stylist-1.jpg', alt: 'Hair stylist' },
    { filename: 'salon/team/stylist-2.jpg', alt: 'Nail artist' },
    { filename: 'salon/team/stylist-3.jpg', alt: 'Cosmetician' },
    { filename: 'salon/team/stylist-4.jpg', alt: 'Makeup artist' },
  ],
  gallery: [
    { filename: 'salon/gallery/gallery-1.jpg', alt: 'Coafor' },
    { filename: 'salon/gallery/gallery-2.jpg', alt: 'Manichiura' },
    { filename: 'salon/gallery/gallery-3.jpg', alt: 'Tratament facial' },
    { filename: 'salon/gallery/gallery-4.jpg', alt: 'Makeup' },
    { filename: 'salon/gallery/gallery-5.jpg', alt: 'Interior salon' },
    { filename: 'salon/gallery/gallery-6.jpg', alt: 'Produse' },
  ],
}

// =============================================================================
// CONFIGURARE SALON INFRUMUSETARE
// =============================================================================

export const salonData = {
  business: {
    name: 'Beauty Studio Elena',
    tagline: 'Frumusetea ta, pasiunea noastra',
    description:
      'Salon de infrumusetare modern cu servicii complete: coafor, manichiura, pedichiura, cosmetica si tratamente SPA.',
    yearEstablished: 2016,
    phone: '0722 111 333',
    email: 'contact@beautyelena.ro',
    whatsapp: '40722111333',
    address: {
      street: 'Bulevardul Unirii 120',
      city: 'Bucuresti',
      county: 'Sector 3',
      postalCode: '030167',
      country: 'Romania',
    },
    workingHours: [
      { days: 'Luni - Vineri', hours: '10:00 - 20:00' },
      { days: 'Sambata', hours: '10:00 - 18:00' },
      { days: 'Duminica', hours: 'Inchis' },
    ],
    social: {
      facebook: 'https://facebook.com/beautyelena',
      instagram: 'https://instagram.com/beautyelena',
      tiktok: 'https://tiktok.com/@beautyelena',
    },
    stats: [
      { value: '8+', label: 'Ani experienta' },
      { value: '10000+', label: 'Cliente multumite' },
      { value: '6', label: 'Specialiste' },
      { value: '4.9', label: 'Rating' },
    ],
  },

  services: [
    {
      title: 'Coafor',
      shortDescription: 'Tuns, vopsit, coafat, tratamente par',
      price: 80,
      priceFrom: true,
      duration: '60 min',
      icon: 'scissors',
      featured: true,
      order: 1,
      features: ['Tuns', 'Vopsit', 'Coafat', 'Tratamente keratina'],
      ctaLabel: 'Programează-te',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Manichiura',
      shortDescription: 'Clasica, semipermanenta, gel, arta unghii',
      price: 60,
      priceFrom: true,
      duration: '45 min',
      icon: 'sparkles',
      featured: true,
      order: 2,
      features: ['Clasica', 'Semipermanenta', 'Gel', 'Arta unghii'],
      ctaLabel: 'Programează-te',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Pedichiura',
      shortDescription: 'Ingrijire completa pentru picioare',
      price: 80,
      priceFrom: true,
      duration: '60 min',
      icon: 'footprint',
      featured: true,
      order: 3,
      features: ['Clasica', 'SPA', 'Medicala', 'Semipermanenta'],
      ctaLabel: 'Programează-te',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Cosmetica',
      shortDescription: 'Tratamente faciale, curatare, anti-aging',
      price: 100,
      priceFrom: true,
      duration: '60 min',
      icon: 'heart',
      featured: true,
      order: 4,
      features: ['Curatare ten', 'Hidratare', 'Anti-aging', 'Mezoterapie'],
      ctaLabel: 'Programează tratament',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Makeup',
      shortDescription: 'Machiaj zi, seara, mireasa',
      price: 150,
      priceFrom: true,
      duration: '60 min',
      icon: 'brush',
      featured: true,
      order: 5,
      features: ['Zi', 'Seara', 'Mireasa', 'Editorial'],
      ctaLabel: 'Programează-te',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Gene & Sprancene',
      shortDescription: 'Extensii gene, laminare, microblading',
      price: 200,
      priceFrom: true,
      duration: '90 min',
      icon: 'eye',
      featured: true,
      order: 6,
      features: ['Extensii gene', 'Laminare', 'Microblading', 'Pensat'],
      ctaLabel: 'Programează-te',
      ctaLink: '/programare',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
  ],

  team: [
    {
      name: 'Elena Popescu',
      role: 'Fondator & Hair Stylist',
      experience: '15 ani experienta',
      featured: true,
      order: 1,
      imageIndex: 0,
      specializations: ['Coloristica', 'Tunsori moderne', 'Tratamente keratina'],
    },
    {
      name: 'Maria Ionescu',
      role: 'Nail Artist',
      experience: '10 ani experienta',
      featured: true,
      order: 2,
      imageIndex: 1,
      specializations: ['Gel', 'Arta unghii', 'Semipermanent'],
    },
    {
      name: 'Ana Dumitrescu',
      role: 'Cosmetician',
      experience: '8 ani experienta',
      featured: true,
      order: 3,
      imageIndex: 2,
      specializations: ['Tratamente faciale', 'Anti-aging', 'Mezoterapie'],
    },
    {
      name: 'Diana Stan',
      role: 'Makeup Artist',
      experience: '7 ani experienta',
      featured: true,
      order: 4,
      imageIndex: 3,
      specializations: ['Makeup mireasa', 'Editorial', 'Permanent makeup'],
    },
  ],

  testimonials: [
    {
      name: 'Ioana M.',
      role: 'Clienta',
      content:
        'Cel mai bun salon din oras! Elena este o adevarata artista a parului. Vin aici de 5 ani si nu as schimba pentru nimic.',
      rating: '5',
      featured: true,
    },
    {
      name: 'Alexandra P.',
      role: 'Clienta',
      content:
        'Manichiura perfecta de fiecare data. Maria are rabdare si talent. Recomand cu incredere!',
      rating: '5',
      featured: true,
    },
    {
      name: 'Cristina V.',
      role: 'Clienta',
      content:
        'Am facut extensii gene si sunt superbe! Arata foarte natural si tin perfect.',
      rating: '5',
      featured: true,
    },
  ],

  faq: [
    {
      question: 'Trebuie programare?',
      answer:
        'Da, recomandam programarea pentru a va asigura locul. Puteti programa online sau telefonic.',
      order: 1,
    },
    {
      question: 'Cat tine manichiura semipermanenta?',
      answer: 'In medie 2-3 saptamani, in functie de tipul de unghie si activitatea zilnica.',
      order: 2,
    },
    {
      question: 'Oferiti pachete pentru mirese?',
      answer:
        'Da! Avem pachete speciale care includ proba, coafura, machiaj si manichiura in ziua nuntii.',
      order: 3,
    },
  ],

  navigation: [
    { label: 'Acasa', type: 'custom' as const, url: '/' },
    { label: 'Servicii', type: 'custom' as const, url: '/servicii' },
    { label: 'Echipa', type: 'custom' as const, url: '/echipa' },
    { label: 'Galerie', type: 'custom' as const, url: '/galerie' },
    { label: 'Preturi', type: 'custom' as const, url: '/preturi' },
    { label: 'Blog', type: 'custom' as const, url: '/blog' },
    { label: 'Contact', type: 'custom' as const, url: '/contact' },
  ],

  hero: {
    headline: 'Frumusetea Ta, Pasiunea Noastra',
    subheadline:
      'Salon de infrumusetare cu servicii premium. Coafor, manichiura, cosmetica si SPA.',
    ctaButtons: [
      { label: 'Programeaza-te', link: '/programare', variant: 'default' },
      { label: 'Vezi Serviciile', link: '/servicii', variant: 'outline' },
    ],
  },

  // Blog Posts
  posts: [
    {
      title: 'Tendinte in coloristica parului pentru 2024',
      excerpt: 'Descopera cele mai populare nuante si tehnici de vopsire din acest an.',
      content: `Coloristica parului evolueaza constant, iar 2024 aduce tendinte interesante. Iata ce este in moda si ce ti se potriveste.

Balayage ramane regina tehnicilor de colorare. Tranzitiile naturale si efectul de par sarut de soare sunt intotdeauna elegante si usor de intretinut.

Nuantele calde revin in forta: cupru, caramel, miere. Acestea lumineaza tenul si adauga caldura chipului.

Blonde champagne este nuanta perfecta pentru cele care vor un blond elegant, nu prea rece si nici prea cald.

Brunette cu reflexe subtile - pentru cele care vor sa ramana brunete dar sa adauge dimensiune si stralucire parului.

Cherry red si alte nuante vibrante pentru cele indraznete care vor sa iasa in evidenta.

Important: consultatia este esentiala! Nuanta potrivita depinde de tonul pielii, culoarea ochilor si stilul de viata.

Programeaza-te pentru o consultatie de coloristica gratuita!`,
      publishedAt: '2024-11-22T10:00:00Z',
    },
    {
      title: 'Ingrijirea parului acasa: rutina completa',
      excerpt: 'Sfaturi de la stilistii nostri pentru par sanatos intre vizite.',
      content: `Un par frumos necesita ingrijire constanta, nu doar vizite la salon. Iata rutina recomandata de stilistii nostri.

Spalatul: 2-3 ori pe saptamana este suficient pentru majoritatea tipurilor de par. Spalatul zilnic poate usca parul si scalpul.

Samponul potrivit face diferenta. Alege unul formulat pentru tipul tau de par (gras, uscat, vopsit) si evita produsele cu sulfati agresivi.

Balsamul se aplica de la jumatatea lungimii spre varfuri, evitand radacinile. Lasa sa actioneze 2-3 minute.

Masca de par - o data pe saptamana pentru hidratare intensa. Alege formule cu keratina sau uleiuri naturale.

Protectie termica - obligatorie inainte de placa sau ondulator! Caldura excesiva distruge structura parului.

Tunsul varfurilor la 6-8 saptamani previne despicarea si pastreaza forma tunsorii.

Vino la salon pentru o consultatie personalizata si recomandari de produse!`,
      publishedAt: '2024-11-15T10:00:00Z',
    },
    {
      title: 'Manichiura semipermanenta: tot ce trebuie sa stii',
      excerpt: 'Avantaje, dezavantaje si cum sa o intretii pentru rezultate optime.',
      content: `Manichiura semipermanenta a revolutionat ingrijirea unghiilor. Iata ce trebuie sa stii inainte de a o incerca.

Ce este: un lac special care se usuca sub lampa LED/UV si rezista 2-3 saptamani fara sa se cojeasca sau juleasca.

Avantaje: rezistenta superioara, stralucire de oglinda care nu se micsoreaza, uscare instantanee, nu se juleste ca lacul obisnuit.

Dezavantaje: necesita indepartare profesionala, poate subtia unghiile daca se face prea frecvent, este ceva mai scump decat manichiura clasica.

Pentru rezultate optime: evita contactul prelungit cu apa in prima ora, foloseste manusi la curatenie, nu incerca sa il indepartezi singura.

Cat dureaza: 45-60 minute pentru manichiura completa cu pregatire si aplicare.

Cand sa faci pauza: la fiecare 3-4 aplicari, lasa unghiile sa "respire" 2 saptamani cu un tratament intaritor.

Programeaza-te pentru o manichiura semipermanenta impecabila!`,
      publishedAt: '2024-11-08T10:00:00Z',
    },
  ],
}

// =============================================================================
// IMAGINI AVOCAT / CABINET JURIDIC
// =============================================================================

export const avocatImages = {
  hero: [
    { filename: 'avocat/hero/hero-main.jpg', alt: 'Cabinet avocat' },
    { filename: 'avocat/hero/hero-alt.jpg', alt: 'Sala conferinte' },
  ],
  team: [
    { filename: 'avocat/team/lawyer-1.jpg', alt: 'Avocat partener' },
    { filename: 'avocat/team/lawyer-2.jpg', alt: 'Avocat senior' },
    { filename: 'avocat/team/lawyer-3.jpg', alt: 'Avocat' },
    { filename: 'avocat/team/lawyer-4.jpg', alt: 'Paralegal' },
  ],
  gallery: [
    { filename: 'avocat/gallery/gallery-1.jpg', alt: 'Birou avocat' },
    { filename: 'avocat/gallery/gallery-2.jpg', alt: 'Sala intalniri' },
    // Note: gallery-3.jpg was corrupted, skipped
    { filename: 'avocat/gallery/gallery-4.jpg', alt: 'Receptie' },
    { filename: 'avocat/gallery/gallery-5.jpg', alt: 'Cabinet' },
    { filename: 'avocat/gallery/gallery-6.jpg', alt: 'Documente' },
  ],
}

// =============================================================================
// CONFIGURARE AVOCAT / CABINET JURIDIC
// =============================================================================

export const avocatData = {
  business: {
    name: 'Cabinet Avocat Ionescu',
    tagline: 'Dreptatea ta, prioritatea noastra',
    description:
      'Cabinet de avocatura cu experienta in drept civil, comercial, penal si al familiei. Oferim consultanta juridica profesionala si reprezentare in instanta.',
    yearEstablished: 2010,
    phone: '0722 999 888',
    email: 'contact@avocat-ionescu.ro',
    whatsapp: '40722999888',
    address: {
      street: 'Bulevardul Magheru 50',
      city: 'Bucuresti',
      county: 'Sector 1',
      postalCode: '010336',
      country: 'Romania',
    },
    workingHours: [
      { days: 'Luni - Vineri', hours: '09:00 - 18:00' },
      { days: 'Sambata', hours: 'Cu programare' },
      { days: 'Duminica', hours: 'Inchis' },
    ],
    social: {
      facebook: 'https://facebook.com/avocat-ionescu',
      linkedin: 'https://linkedin.com/company/avocat-ionescu',
    },
    stats: [
      { value: '14+', label: 'Ani experienta' },
      { value: '2000+', label: 'Cazuri rezolvate' },
      { value: '95%', label: 'Rata succes' },
      { value: '4', label: 'Avocati' },
    ],
  },

  services: [
    {
      title: 'Drept Civil',
      shortDescription: 'Contracte, proprietate, succesiuni, obligatii',
      icon: 'scale',
      featured: true,
      order: 1,
      displayStyle: 'card' as const,
      attributes: [
        { label: 'Preț', value: 'de la 300 RON', icon: 'Banknote' },
        { label: 'Tip', value: 'Consultație', icon: 'MessageSquare' },
      ],
      features: ['Contracte', 'Proprietate', 'Succesiuni', 'Despagubiri'],
      ctaLabel: 'Solicită consultație',
      ctaLink: '/contact',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Drept Comercial',
      shortDescription: 'Infiintare firme, contracte comerciale, litigii',
      icon: 'Briefcase',
      featured: true,
      order: 2,
      displayStyle: 'card' as const,
      attributes: [
        { label: 'Preț', value: 'de la 500 RON', icon: 'Banknote' },
        { label: 'Tip', value: 'Consultație', icon: 'MessageSquare' },
      ],
      features: ['Infiintare SRL', 'Contracte', 'Insolventa', 'Fuziuni'],
      ctaLabel: 'Solicită consultație',
      ctaLink: '/contact',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Dreptul Familiei',
      shortDescription: 'Divorturi, custodie, partaje, pensie alimentara',
      icon: 'Home',
      featured: true,
      order: 3,
      displayStyle: 'card' as const,
      attributes: [
        { label: 'Preț', value: 'de la 400 RON', icon: 'Banknote' },
        { label: 'Tip', value: 'Consultație', icon: 'MessageSquare' },
      ],
      features: ['Divort', 'Custodie', 'Partaj', 'Pensie alimentara'],
      ctaLabel: 'Solicită consultație',
      ctaLink: '/contact',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Drept Penal',
      shortDescription: 'Aparare in dosare penale, plangeri, reprezentare',
      icon: 'Shield',
      featured: true,
      order: 4,
      displayStyle: 'card' as const,
      attributes: [
        { label: 'Preț', value: 'de la 1000 RON', icon: 'Banknote' },
        { label: 'Tip', value: 'Urgență', icon: 'AlertCircle' },
      ],
      features: ['Aparare', 'Plangeri penale', 'Reprezentare', 'Consultanta'],
      ctaLabel: 'Solicită consultație urgentă',
      ctaLink: '/contact',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Dreptul Muncii',
      shortDescription: 'Conflicte de munca, contracte, concedieri',
      icon: 'Users',
      featured: false,
      order: 5,
      displayStyle: 'card' as const,
      attributes: [
        { label: 'Preț', value: 'de la 350 RON', icon: 'Banknote' },
        { label: 'Tip', value: 'Consultație', icon: 'MessageSquare' },
      ],
      features: ['Contracte munca', 'Concedieri', 'Litigii', 'Negocieri'],
      ctaLabel: 'Solicită consultație',
      ctaLink: '/contact',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Consultanta Juridica',
      shortDescription: 'Consultanta pentru persoane fizice si juridice',
      icon: 'MessageCircle',
      featured: true,
      order: 6,
      displayStyle: 'card' as const,
      attributes: [
        { label: 'Preț', value: '200 RON', icon: 'Banknote' },
        { label: 'Durată', value: '60 min', icon: 'Clock' },
      ],
      features: ['Analiza documente', 'Recomandari', 'Strategie', 'Preventie'],
      ctaLabel: 'Programează consultație',
      ctaLink: '/contact',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
  ],

  team: [
    {
      name: 'Av. Alexandru Ionescu',
      role: 'Avocat Partener Fondator',
      experience: '20 ani experienta',
      featured: true,
      order: 1,
      imageIndex: 0,
      specializations: ['Drept civil', 'Drept comercial', 'Litigii complexe'],
    },
    {
      name: 'Av. Maria Popescu',
      role: 'Avocat Senior',
      experience: '15 ani experienta',
      featured: true,
      order: 2,
      imageIndex: 1,
      specializations: ['Dreptul familiei', 'Succesiuni', 'Proprietate'],
    },
    {
      name: 'Av. Andrei Dumitrescu',
      role: 'Avocat',
      experience: '10 ani experienta',
      featured: true,
      order: 3,
      imageIndex: 2,
      specializations: ['Drept penal', 'Dreptul muncii', 'Contencios'],
    },
    {
      name: 'Elena Stan',
      role: 'Paralegal',
      experience: '8 ani experienta',
      featured: false,
      order: 4,
      imageIndex: 3,
      specializations: ['Documentatie', 'Cercetare', 'Relatii clienti'],
    },
  ],

  testimonials: [
    {
      name: 'Mihai D.',
      role: 'Client',
      content:
        'Profesionalism de exceptie! Au castigat procesul meu de proprietate dupa ani de litigii cu alti avocati. Recomand cu incredere!',
      rating: '5',
      featured: true,
    },
    {
      name: 'Ana M.',
      role: 'Clienta',
      content:
        'M-au ajutat enorm in procesul de divort. Au fost discreti, profesionisti si mi-au obtinut custodia copiilor.',
      rating: '5',
      featured: true,
    },
    {
      name: 'SC Construct SRL',
      role: 'Client corporativ',
      content:
        'Colaboram de 5 ani pentru toate problemele juridice ale firmei. Raspuns rapid, solutii eficiente.',
      rating: '5',
      featured: true,
    },
  ],

  faq: [
    {
      question: 'Cat costa o consultatie?',
      answer:
        'Consultatia initiala este de 200 RON pentru 60 minute. In functie de complexitatea cazului, putem oferi si pachete de consultanta.',
      order: 1,
    },
    {
      question: 'Cum ma pot programa?',
      answer:
        'Puteti programa o intalnire telefonic, prin email sau completand formularul de pe site. Va vom contacta in maxim 24 de ore.',
      order: 2,
    },
    {
      question: 'Reprezentati in instanta?',
      answer:
        'Da, oferim reprezentare completa in instanta pentru toate tipurile de cauze civile, penale si comerciale.',
      order: 3,
    },
    {
      question: 'Oferiti asistenta juridica pro bono?',
      answer:
        'Da, in anumite cazuri oferim asistenta juridica gratuita pentru persoane defavorizate. Contactati-ne pentru detalii.',
      order: 4,
    },
  ],

  navigation: [
    { label: 'Acasa', type: 'custom' as const, url: '/' },
    { label: 'Servicii', type: 'custom' as const, url: '/servicii' },
    { label: 'Echipa', type: 'custom' as const, url: '/echipa' },
    { label: 'Cazuri', type: 'custom' as const, url: '/cazuri' },
    { label: 'Blog', type: 'custom' as const, url: '/blog' },
    { label: 'Contact', type: 'custom' as const, url: '/contact' },
  ],

  hero: {
    headline: 'Dreptatea Ta, Prioritatea Noastra',
    subheadline:
      'Cabinet de avocatura cu experienta. Consultanta juridica profesionala si reprezentare in instanta.',
    ctaButtons: [
      { label: 'Consultatie Gratuita', link: '/contact', variant: 'default' },
      { label: 'Vezi Serviciile', link: '/servicii', variant: 'outline' },
    ],
  },

  // Blog Posts
  posts: [
    {
      title: 'Ce trebuie sa stii despre divort in Romania',
      excerpt: 'Ghid complet despre procedura de divort: tipuri, documente necesare si costuri.',
      content: `Divortul este o procedura complexa din punct de vedere emotional si juridic. Iata ce trebuie sa stii daca te afli in aceasta situatie.

Tipuri de divort in Romania:
1. Divort prin acordul sotilor - cel mai rapid si simplu, daca ambii soti sunt de acord
2. Divort din vina unuia dintre soti - cand unul dintre soti a gresit grav
3. Divort prin separare in fapt - dupa minim 2 ani de separare

Documente necesare: certificat de casatorie, certificate de nastere, acte de proprietate, dovezi de venituri.

Aspecte importante de negociat: partajul bunurilor comune, custodia copiilor, pensia alimentara, locuinta.

Durata procedurii: divortul prin acord poate dura 1-2 luni, cel contencios poate lua 6-12 luni sau mai mult.

Sfatul nostru: chiar si in cazul unui divort amiabil, consultanta juridica este recomandata pentru a va proteja interesele.

Contactati-ne pentru o consultatie confidentiala!`,
      publishedAt: '2024-11-20T10:00:00Z',
    },
    {
      title: 'Cum sa infiintezi o firma SRL in 2024',
      excerpt: 'Pasi, costuri si documente pentru inregistrarea unei societati cu raspundere limitata.',
      content: `Infiintarea unui SRL este cea mai populara forma de business in Romania. Iata tot ce trebuie sa stii pentru a incepe.

Avantaje SRL: raspundere limitata la capitalul social, credibilitate in fata partenerilor, posibilitatea de a avea mai multi asociati.

Capital social minim: 1 leu (dar recomandam minim 200 lei pentru credibilitate).

Pasii de urmat:
1. Alegerea denumirii firmei si verificarea disponibilitatii
2. Stabilirea sediului social
3. Redactarea actului constitutiv
4. Depunerea capitalului social
5. Inregistrarea la Registrul Comertului
6. Obtinerea certificatului de inregistrare

Documente necesare: acte de identitate, dovada sediului social, declaratii pe proprie raspundere, specimen de semnatura.

Durata: 3-5 zile lucratoare cu procedura simplificata.

Costuri: 100-350 lei taxe + onorariu avocat pentru redactarea actelor.

Contactati-ne pentru asistenta completa la infiintarea firmei!`,
      publishedAt: '2024-11-12T10:00:00Z',
    },
    {
      title: 'Drepturile tale in cazul unui accident rutier',
      excerpt: 'Ce sa faci imediat dupa un accident si cum sa iti recuperezi daunele.',
      content: `Un accident rutier poate fi traumatizant, dar cunoasterea drepturilor tale face diferenta in obtinerea despagubirilor.

Imediat dupa accident:
1. Asigura-te ca esti in siguranta si cheama ambulanta daca e necesar
2. Cheama politia pentru constatare
3. Fotografiaza locul accidentului, daunele, numere de inmatriculare
4. Ia datele martorilor
5. Nu recunoaste vreo vina la fata locului

Despagubiri la care ai dreptul:
- Reparatia vehiculului sau valoarea de inlocuire
- Cheltuieli medicale si de recuperare
- Venituri pierdute pe perioada incapacitatii
- Daune morale pentru suferinta
- Cheltuieli de transport alternativ

Termenul de prescriptie: 3 ani de la data accidentului pentru actiuni civile.

Important: nu accepta ofertele asiguratorului fara consultanta juridica. Acestea sunt adesea sub valoarea reala a daunelor.

Contacteaza-ne pentru evaluarea gratuita a cazului tau!`,
      publishedAt: '2024-11-05T10:00:00Z',
    },
  ],
}

// =============================================================================
// IMAGINI CONSTRUCTII / RENOVARI
// =============================================================================

export const constructiiImages = {
  hero: [
    { filename: 'constructii/hero/hero-main.jpg', alt: 'Proiect constructie' },
    { filename: 'constructii/hero/hero-alt.jpg', alt: 'Renovare casa' },
  ],
  team: [
    { filename: 'constructii/team/worker-1.jpg', alt: 'Inginer sef' },
    { filename: 'constructii/team/worker-2.jpg', alt: 'Arhitect' },
    { filename: 'constructii/team/worker-3.jpg', alt: 'Maistru' },
    { filename: 'constructii/team/worker-4.jpg', alt: 'Electrician' },
  ],
  gallery: [
    { filename: 'constructii/gallery/gallery-1.jpg', alt: 'Casa finalizata' },
    { filename: 'constructii/gallery/gallery-2.jpg', alt: 'Renovare apartament' },
    { filename: 'constructii/gallery/gallery-3.jpg', alt: 'Constructie noua' },
    { filename: 'constructii/gallery/gallery-4.jpg', alt: 'Interior modern' },
    { filename: 'constructii/gallery/gallery-5.jpg', alt: 'Fatada' },
    { filename: 'constructii/gallery/gallery-6.jpg', alt: 'Gradina amenajata' },
  ],
}

// =============================================================================
// CONFIGURARE CONSTRUCTII / RENOVARI
// =============================================================================

export const constructiiData = {
  business: {
    name: 'BuildPro Construct',
    tagline: 'Construim viitorul, renovam prezentul',
    description:
      'Firma de constructii si renovari cu experienta in constructii rezidentiale, comerciale si renovari complete. Calitate, seriozitate si termene respectate.',
    yearEstablished: 2005,
    phone: '0722 777 888',
    email: 'contact@buildpro.ro',
    whatsapp: '40722777888',
    address: {
      street: 'Bulevardul Theodor Pallady 100',
      city: 'Bucuresti',
      county: 'Sector 3',
      postalCode: '032266',
      country: 'Romania',
    },
    workingHours: [
      { days: 'Luni - Vineri', hours: '08:00 - 17:00' },
      { days: 'Sambata', hours: '09:00 - 13:00' },
      { days: 'Duminica', hours: 'Inchis' },
    ],
    social: {
      facebook: 'https://facebook.com/buildpro',
      instagram: 'https://instagram.com/buildpro',
    },
    stats: [
      { value: '19+', label: 'Ani experienta' },
      { value: '500+', label: 'Proiecte finalizate' },
      { value: '50+', label: 'Echipa' },
      { value: '4.9', label: 'Rating' },
    ],
  },

  services: [
    {
      title: 'Constructii Case',
      shortDescription: 'Constructii rezidentiale la cheie',
      price: 800,
      priceFrom: true,
      icon: 'home',
      featured: true,
      order: 1,
      features: ['Proiectare', 'Fundatie', 'Structura', 'Finisaje'],
      ctaLabel: 'Cere ofertă',
      ctaLink: '/contact',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Renovari Complete',
      shortDescription: 'Renovam apartamente si case complet',
      price: 300,
      priceFrom: true,
      icon: 'refresh',
      featured: true,
      order: 2,
      features: ['Demolari', 'Instalatii', 'Finisaje', 'Mobilare'],
      ctaLabel: 'Cere ofertă',
      ctaLink: '/contact',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Amenajari Interioare',
      shortDescription: 'Design interior si executie',
      price: 200,
      priceFrom: true,
      icon: 'layout',
      featured: true,
      order: 3,
      features: ['Design', 'Pardoseli', 'Zugraveli', 'Mobila custom'],
      ctaLabel: 'Cere ofertă',
      ctaLink: '/contact',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Instalatii',
      shortDescription: 'Electrice, sanitare, termice',
      price: 100,
      priceFrom: true,
      icon: 'bolt',
      featured: true,
      order: 4,
      features: ['Electrice', 'Sanitare', 'Termice', 'Climatizare'],
      ctaLabel: 'Cere ofertă',
      ctaLink: '/contact',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Fatade si Izolatie',
      shortDescription: 'Termoizolatie si fatade ventilate',
      price: 150,
      priceFrom: true,
      icon: 'layers',
      featured: false,
      order: 5,
      features: ['Polistiren', 'Vata minerala', 'Fatade ventilate', 'Tencuieli'],
      ctaLabel: 'Cere ofertă',
      ctaLink: '/contact',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
    {
      title: 'Acoperisuri',
      shortDescription: 'Montaj si reparatii acoperisuri',
      price: 200,
      priceFrom: true,
      icon: 'umbrella',
      featured: true,
      order: 6,
      features: ['Tigla', 'Tabla', 'Hidroizolatie', 'Mansardari'],
      ctaLabel: 'Cere ofertă',
      ctaLink: '/contact',
      backLabel: 'Înapoi la servicii',
      backLink: '/servicii',
    },
  ],

  team: [
    {
      name: 'Ing. Mihai Popescu',
      role: 'Director General / Inginer Sef',
      experience: '25 ani experienta',
      featured: true,
      order: 1,
      imageIndex: 0,
      specializations: ['Constructii civile', 'Management proiect', 'Structuri'],
    },
    {
      name: 'Arh. Elena Ionescu',
      role: 'Arhitect Sef',
      experience: '15 ani experienta',
      featured: true,
      order: 2,
      imageIndex: 1,
      specializations: ['Design interior', 'Proiectare', 'Amenajari'],
    },
    {
      name: 'George Stanescu',
      role: 'Maistru General',
      experience: '20 ani experienta',
      featured: true,
      order: 3,
      imageIndex: 2,
      specializations: ['Executie', 'Coordonare echipe', 'Control calitate'],
    },
    {
      name: 'Adrian Dumitru',
      role: 'Sef Instalatii',
      experience: '18 ani experienta',
      featured: false,
      order: 4,
      imageIndex: 3,
      specializations: ['Electrice', 'Sanitare', 'HVAC'],
    },
  ],

  testimonials: [
    {
      name: 'Familie Popescu',
      role: 'Casa la cheie',
      content:
        'Ne-au construit casa de la zero. Calitate excelenta, termene respectate si comunicare foarte buna pe tot parcursul proiectului.',
      rating: '5',
      featured: true,
    },
    {
      name: 'Andrei M.',
      role: 'Renovare apartament',
      content:
        'Am renovat complet un apartament de 3 camere. Au fost foarte profesionisti, curati si au terminat la timp.',
      rating: '5',
      featured: true,
    },
    {
      name: 'SC Office Plus SRL',
      role: 'Amenajare birouri',
      content:
        'Au amenajat 500mp de birouri pentru firma noastra. Rezultat impresionant, recomand!',
      rating: '5',
      featured: true,
    },
  ],

  faq: [
    {
      question: 'Oferiti garantie?',
      answer:
        'Da, oferim garantie de 2-5 ani pentru toate lucrarile, in functie de tipul interventiei. Materialele au garantia producatorului.',
      order: 1,
    },
    {
      question: 'Cum se face devizul?',
      answer:
        'Venim la locatie pentru evaluare gratuita. In 2-3 zile primiti devizul detaliat cu materiale si manopera.',
      order: 2,
    },
    {
      question: 'Asigurati materialele?',
      answer:
        'Da, putem asigura toate materialele de la furnizori de incredere. Puteti opta si pentru materiale proprii.',
      order: 3,
    },
    {
      question: 'Cat dureaza o renovare completa?',
      answer:
        'Depinde de suprafata si complexitate. Un apartament 2-3 camere: 4-6 saptamani. O casa: 3-6 luni.',
      order: 4,
    },
  ],

  navigation: [
    { label: 'Acasa', type: 'custom' as const, url: '/' },
    { label: 'Servicii', type: 'custom' as const, url: '/servicii' },
    { label: 'Portofoliu', type: 'custom' as const, url: '/portofoliu' },
    { label: 'Echipa', type: 'custom' as const, url: '/echipa' },
    { label: 'Blog', type: 'custom' as const, url: '/blog' },
    { label: 'Contact', type: 'custom' as const, url: '/contact' },
  ],

  hero: {
    headline: 'Construim Viitorul, Renovam Prezentul',
    subheadline:
      'Constructii si renovari de calitate. Case la cheie, renovari complete, amenajari interioare.',
    ctaButtons: [
      { label: 'Cere Oferta', link: '/contact', variant: 'default' },
      { label: 'Vezi Portofoliu', link: '/portofoliu', variant: 'outline' },
    ],
  },

  // Blog Posts
  posts: [
    {
      title: 'Cum sa alegi constructorul potrivit pentru casa ta',
      excerpt: 'Criterii esentiale pentru selectarea unei firme de constructii de incredere.',
      content: `Alegerea constructorului potrivit este una dintre cele mai importante decizii cand construiesti o casa. Iata cum sa faci alegerea corecta.

Verificari esentiale:
1. Experienta si portofoliu - cere sa vezi proiecte finalizate, viziteaza-le daca e posibil
2. Referinte de la clienti anteriori - vorbeste direct cu ei despre experienta avuta
3. Autorizatii si asigurari - verifica ca firma are toate documentele legale
4. Contract detaliat - un constructor serios va avea contracte clare si transparente

Semne de alarma:
- Preturi mult sub media pietei (taieri de calitate sau costuri ascunse)
- Refuzul de a semna contract detaliat
- Cererea de avans foarte mare (peste 30%)
- Lipsa de referinte sau portofoliu

Ce sa incluzi in contract:
- Detalii tehnice complete si lista de materiale
- Termen de executie cu penalitati pentru intarzieri
- Grafic de plati corelat cu etapele de lucru
- Garantie pentru lucrari (minim 2 ani)

Noi oferim consultanta gratuita si deviz detaliat. Contacteaza-ne!`,
      publishedAt: '2024-11-22T10:00:00Z',
    },
    {
      title: 'Renovarea apartamentului: pasi si costuri',
      excerpt: 'Ghid complet pentru o renovare reusita, de la planificare la finisare.',
      content: `Renovarea unui apartament poate fi o provocare, dar cu planificare corecta devine un proiect de succes. Iata pasii de urmat.

1. Planificarea - Stabileste ce vrei sa renovezi, bugetul disponibil si termenul dorit. Lasa o rezerva de 15-20% pentru surprize.

2. Autorizatii - Pentru modificari structurale sau la fatada ai nevoie de autorizatie de la primarie. Verificam noi ce e necesar.

3. Demolarile - Prima etapa de lucru. Include inlaturarea finisajelor vechi, eventual modificarea peretilor.

4. Instalatii - Electrica si sanitara se fac inainte de finisaje. E momentul pentru modernizare completa.

5. Tencuieli si glet - Pregatirea suprafetelor pentru vopsit sau tapet.

6. Pardoseli - Parchet, gresie sau alte finisaje de podea.

7. Mobilare - Etapa finala, dupa curatenia de santier.

Costuri orientative 2024:
- Renovare simpla (finisaje): 200-350 EUR/mp
- Renovare medie (+ instalatii): 350-500 EUR/mp
- Renovare completa (la rosu): 500-700 EUR/mp

Contacteaza-ne pentru un deviz personalizat!`,
      publishedAt: '2024-11-15T10:00:00Z',
    },
    {
      title: 'Termoizolatia casei: economii si confort',
      excerpt: 'Tot ce trebuie sa stii despre izolarea termica: materiale, costuri, beneficii.',
      content: `Termoizolatia este cea mai buna investitie pentru casa ta. Reduce facturile si creste confortul. Iata ce trebuie sa stii.

Beneficii imediate:
- Reducerea facturilor cu 30-50%
- Confort termic vara si iarna
- Eliminarea condensului si mucegaiului
- Cresterea valorii proprietatii

Materiale populare:
1. Polistiren expandat (EPS) - cel mai accesibil, bun pentru pereti
2. Vata minerala - excelenta izolare fonica si termica, rezistenta la foc
3. Polistiren extrudat (XPS) - pentru socluri si zone umede
4. Spuma poliuretanica - pentru aplicatii speciale

Grosimi recomandate pentru Romania:
- Pereti exteriori: 10-15 cm
- Acoperis: 15-20 cm
- Planseu subsol: 10 cm

Costuri orientative 2024:
- Polistiren 10cm + tencuiala: 70-90 EUR/mp
- Vata minerala 10cm + finisaj: 80-110 EUR/mp

Exista programe de finantare precum Casa Verde sau credite cu dobanda subventionata.

Contacteaza-ne pentru evaluare gratuita si oferta personalizata!`,
      publishedAt: '2024-11-08T10:00:00Z',
    },
  ],
}

// =============================================================================
// IMAGINI MAGAZIN / SHOP
// =============================================================================

export const magazinImages = {
  hero: [
    { filename: 'magazin/hero/hero-main.jpg', alt: 'Interior magazin modern' },
    { filename: 'magazin/hero/hero-alt.jpg', alt: 'Produse expuse' },
  ],
  team: [
    { filename: 'magazin/team/staff-1.jpg', alt: 'Manager magazin' },
    { filename: 'magazin/team/staff-2.jpg', alt: 'Consultant vanzari' },
    { filename: 'magazin/team/staff-3.jpg', alt: 'Specialist produse' },
    { filename: 'magazin/team/staff-4.jpg', alt: 'Casier' },
  ],
  products: [
    { filename: 'magazin/products/product-1.jpg', alt: 'Produs 1' },
    { filename: 'magazin/products/product-2.jpg', alt: 'Produs 2' },
    { filename: 'magazin/products/product-3.jpg', alt: 'Produs 3' },
    { filename: 'magazin/products/product-4.jpg', alt: 'Produs 4' },
    { filename: 'magazin/products/product-5.jpg', alt: 'Produs 5' },
    { filename: 'magazin/products/product-6.jpg', alt: 'Produs 6' },
    { filename: 'magazin/products/product-7.jpg', alt: 'Produs 7' },
    { filename: 'magazin/products/product-8.jpg', alt: 'Produs 8' },
    { filename: 'magazin/products/product-9.jpg', alt: 'Produs 9' },
    { filename: 'magazin/products/product-10.jpg', alt: 'Produs 10' },
    { filename: 'magazin/products/product-11.jpg', alt: 'Produs 11' },
    { filename: 'magazin/products/product-12.jpg', alt: 'Produs 12' },
  ],
  gallery: [
    { filename: 'magazin/gallery/gallery-1.jpg', alt: 'Interior magazin' },
    { filename: 'magazin/gallery/gallery-2.jpg', alt: 'Rafturi produse' },
    { filename: 'magazin/gallery/gallery-3.jpg', alt: 'Zona cumparaturi' },
    { filename: 'magazin/gallery/gallery-4.jpg', alt: 'Vitrina' },
    { filename: 'magazin/gallery/gallery-5.jpg', alt: 'Detalii magazin' },
    { filename: 'magazin/gallery/gallery-6.jpg', alt: 'Ambianta magazin' },
  ],
  locations: [
    { filename: 'magazin/locations/showroom.jpg', alt: 'EcoShop Showroom București' },
  ],
}

// =============================================================================
// CONFIGURARE MAGAZIN / SHOP (cu eCommerce)
// =============================================================================

export const magazinData = {
  business: {
    name: 'EcoShop Premium',
    tagline: 'Produse naturale pentru o viata sanatoasa',
    description:
      'Magazin specializat in produse naturale, organice si eco-friendly. Oferim o gama larga de produse selectate cu grija pentru sanatatea ta si a familiei tale. Livrare rapida in toata tara.',
    yearEstablished: 2019,
    phone: '0722 333 444',
    email: 'comenzi@ecoshop.ro',
    whatsapp: '40722333444',
    address: {
      street: 'Bulevardul Decebal 78',
      city: 'Bucuresti',
      county: 'Sector 3',
      postalCode: '030967',
      country: 'Romania',
    },
    workingHours: [
      { days: 'Luni - Vineri', hours: '09:00 - 20:00' },
      { days: 'Sambata', hours: '10:00 - 18:00' },
      { days: 'Duminica', hours: '11:00 - 16:00' },
    ],
    social: {
      facebook: 'https://facebook.com/ecoshop',
      instagram: 'https://instagram.com/ecoshop',
      tiktok: 'https://tiktok.com/@ecoshop',
    },
    stats: [
      { value: '5+', label: 'Ani experienta' },
      { value: '10000+', label: 'Clienti multumiti' },
      { value: '500+', label: 'Produse' },
      { value: '4.9', label: 'Rating' },
    ],
  },

  // Categorii de produse
  productCategories: [
    {
      title: 'Cosmetice Naturale',
      description: 'Produse cosmetice 100% naturale, fara chimicale daunatoare',
      order: 1,
    },
    {
      title: 'Alimentatie Bio',
      description: 'Alimente organice certificate, de la producatori locali',
      order: 2,
    },
    {
      title: 'Suplimente Nutritive',
      description: 'Vitamine si minerale din surse naturale',
      order: 3,
    },
    {
      title: 'Casa & Gradina',
      description: 'Produse eco pentru casa si gradina ta',
      order: 4,
    },
    {
      title: 'Pentru Copii',
      description: 'Produse sigure si naturale pentru cei mici',
      order: 5,
    },
  ],

  // Produse (vor fi create prin eCommerce plugin)
  products: [
    {
      title: 'Crema Hidratanta cu Aloe Vera',
      slug: 'crema-hidratanta-aloe-vera',
      description: 'Crema hidratanta naturala cu extract de Aloe Vera pentru ten uscat si sensibil. Formula non-grasa, absorbtie rapida.',
      price: 89,
      salePrice: 69,
      badge: 'Reducere',
      featured: true,
      category: 'Cosmetice Naturale',
      imageIndex: 0,
    },
    {
      title: 'Ulei de Cocos Extra Virgin',
      slug: 'ulei-cocos-extra-virgin',
      description: 'Ulei de cocos organic, presat la rece. Ideal pentru gatit, cosmetica si ingrijirea parului.',
      price: 45,
      featured: true,
      category: 'Alimentatie Bio',
      imageIndex: 1,
    },
    {
      title: 'Complex Vitamina C + Zinc',
      slug: 'complex-vitamina-c-zinc',
      description: 'Supliment pentru imunitate cu vitamina C din surse naturale si zinc. 60 capsule vegetale.',
      price: 129,
      featured: true,
      category: 'Suplimente Nutritive',
      imageIndex: 2,
    },
    {
      title: 'Sampon Natural cu Lavanda',
      slug: 'sampon-natural-lavanda',
      description: 'Sampon delicat cu extract de lavanda, fara sulfati si parabeni. Pentru par normal si gras.',
      price: 55,
      salePrice: 45,
      badge: '-18%',
      featured: true,
      category: 'Cosmetice Naturale',
      imageIndex: 3,
    },
    {
      title: 'Miere de Manuka MGO 400+',
      slug: 'miere-manuka-mgo-400',
      description: 'Miere de Manuka premium din Noua Zeelanda. Proprietati antibacteriene certificate.',
      price: 189,
      featured: true,
      category: 'Alimentatie Bio',
      imageIndex: 4,
    },
    {
      title: 'Detergent Eco pentru Rufe',
      slug: 'detergent-eco-rufe',
      description: 'Detergent lichid biodegradabil, hipoalergenic, pentru toate tipurile de tesaturi. 2L.',
      price: 65,
      featured: false,
      category: 'Casa & Gradina',
      imageIndex: 5,
    },
    {
      title: 'Omega 3 din Ulei de Peste',
      slug: 'omega-3-ulei-peste',
      description: 'Acizi grasi esentiali EPA si DHA pentru sanatatea inimii si creierului. 90 capsule.',
      price: 95,
      featured: false,
      category: 'Suplimente Nutritive',
      imageIndex: 6,
    },
    {
      title: 'Gel de Dus pentru Copii',
      slug: 'gel-dus-copii',
      description: 'Gel de dus delicat cu extract de musetel, fara coloranti artificiali. pH neutru.',
      price: 35,
      featured: true,
      category: 'Pentru Copii',
      imageIndex: 7,
    },
    {
      title: 'Ceai Verde Organic',
      slug: 'ceai-verde-organic',
      description: 'Ceai verde premium din plantatii organice. 100g frunze intregi, bogat in antioxidanti.',
      price: 42,
      salePrice: 35,
      badge: 'Oferta',
      featured: false,
      category: 'Alimentatie Bio',
      imageIndex: 8,
    },
    {
      title: 'Crema de Fata Anti-Aging',
      slug: 'crema-fata-anti-aging',
      description: 'Formula avansata cu retinol vegetal si acid hialuronic pentru reducerea ridurilor.',
      price: 159,
      featured: true,
      category: 'Cosmetice Naturale',
      imageIndex: 9,
    },
    {
      title: 'Seminte de Chia Organic',
      slug: 'seminte-chia-organic',
      description: 'Seminte de chia 100% organice, bogate in omega-3 si fibre. 500g.',
      price: 38,
      featured: false,
      category: 'Alimentatie Bio',
      imageIndex: 10,
    },
    {
      title: 'Spray Dezinfectant Natural',
      slug: 'spray-dezinfectant-natural',
      description: 'Dezinfectant multi-suprafete cu uleiuri esentiale. Fara chimicale agresive. 500ml.',
      price: 29,
      featured: false,
      category: 'Casa & Gradina',
      imageIndex: 11,
    },
  ],

  // Testimoniale
  testimonials: [
    {
      name: 'Maria C.',
      role: 'Client fidel',
      content:
        'Comand de aici de peste 2 ani. Produsele sunt de calitate superioara, iar livrarea este mereu rapida. Recomand cu incredere!',
      rating: '5',
      featured: true,
    },
    {
      name: 'Andrei P.',
      role: 'Client',
      content:
        'Am descoperit acest magazin cautand produse naturale pentru copii. Sunt foarte multumit de calitate si pret.',
      rating: '5',
      featured: true,
    },
    {
      name: 'Elena D.',
      role: 'Clienta',
      content:
        'Cosmeticele naturale de aici m-au ajutat enorm cu problemele de piele. Personalul este foarte amabil si ofera sfaturi utile.',
      rating: '5',
      featured: true,
    },
    {
      name: 'Florin M.',
      role: 'Client',
      content:
        'Cel mai bun magazin de produse bio din oras! Preturi corecte si produse autentice.',
      rating: '5',
      featured: true,
    },
  ],

  // FAQ
  faq: [
    {
      question: 'Cum pot comanda online?',
      answer:
        'Adaugati produsele dorite in cos, completati datele de livrare si plasati comanda. Veti primi confirmarea pe email.',
      order: 1,
    },
    {
      question: 'Care sunt metodele de plata acceptate?',
      answer:
        'Acceptam plata cu cardul (Visa, Mastercard), transfer bancar, si ramburs la livrare.',
      order: 2,
    },
    {
      question: 'Cat dureaza livrarea?',
      answer:
        'Livrarea in Bucuresti: 1-2 zile lucratoare. In tara: 2-4 zile lucratoare. Comanda peste 200 lei = transport gratuit.',
      order: 3,
    },
    {
      question: 'Pot returna un produs?',
      answer:
        'Da, acceptam retururi in 14 zile de la primire pentru produsele nesigilate, in ambalajul original.',
      order: 4,
    },
    {
      question: 'Produsele sunt certificate?',
      answer:
        'Toate produsele organice sunt certificate de organisme acreditate. Certificarile sunt afisate pe fiecare produs.',
      order: 5,
    },
  ],

  // Navigare Header
  navigation: [
    { label: 'Acasa', type: 'custom' as const, url: '/' },
    { label: 'Produse', type: 'custom' as const, url: '/produse' },
    { label: 'Categorii', type: 'custom' as const, url: '/categorii' },
    { label: 'Despre Noi', type: 'custom' as const, url: '/despre' },
    { label: 'Blog', type: 'custom' as const, url: '/blog' },
    { label: 'Contact', type: 'custom' as const, url: '/contact' },
  ],

  // Hero Homepage
  hero: {
    headline: 'Produse Naturale pentru o Viata Sanatoasa',
    subheadline: 'Descopera gama noastra de produse organice, eco-friendly si 100% naturale. Livrare gratuita la comenzi peste 200 lei.',
    ctaButtons: [
      { label: 'Vezi Produsele', link: '/produse', variant: 'default' },
      { label: 'Oferte Speciale', link: '/produse?filter=sale', variant: 'outline' },
    ],
  },

  // Blog Posts
  posts: [
    {
      title: 'De ce sa alegi produse naturale si organice',
      excerpt: 'Beneficiile produselor eco-friendly pentru sanatatea ta si a planetei.',
      content: `Trecerea la produse naturale nu este doar o moda, ci o alegere care aduce beneficii reale. Iata de ce merita sa faci aceasta schimbare.

Pentru sanatatea ta:
- Fara chimicale sintetice, pesticide sau aditivi artificiali
- Nutrienti mai multi si mai bine absorbit de organism
- Risc redus de alergii si intoleranfe
- Beneficii pe termen lung pentru sistemul imunitar

Pentru mediu:
- Agricultura organica protejeaza solul si apa
- Biodiversitate mentinuta prin practici durabile
- Ambalaje reciclabile sau biodegradabile
- Amprenta de carbon redusa

Pentru comunitate:
- Sustinerea producatorilor locali
- Practici de comert echitabil
- Transparenta in lantul de productie

Cum sa incepi:
1. Inlocuieste treptat - nu trebuie sa schimbi totul dintr-o data
2. Citeste etichetele - cauta certificari precum ECO, BIO, ORGANIC
3. Alege local cand e posibil - produse mai proaspete, transport redus

Descopera selectia noastra de produse certificate!`,
      publishedAt: '2024-11-25T10:00:00Z',
    },
    {
      title: 'Ghid de ingrijire naturala a pielii',
      excerpt: 'Cum sa ai o piele sanatoasa folosind doar ingrediente naturale.',
      content: `Pielea este cel mai mare organ si merita ingrijire atenta cu ingrediente pe care le intelegi. Iata ghidul nostru pentru skincare natural.

Rutina de baza:
1. Curatare - dimineata si seara cu un gel delicat, fara sulfati
2. Tonifiere - apa de trandafiri sau hamamelis pentru echilibrarea pH-ului
3. Hidratare - crema cu aloe vera, ulei de jojoba sau unt de shea
4. Protectie solara - zilnic, chiar si iarna!

Ingrediente star:
- Aloe Vera - hidratare si calmare
- Ulei de cocos - nutritie profunda
- Vitamina C - stralucire si anti-aging
- Acid hialuronic - hidratare intensiva
- Ulei de macese - regenerare si anti-pete

Ce sa eviti:
- Parabeni si ftalati
- Sulfati agresivi (SLS, SLES)
- Parfumuri sintetice
- Alcool denaturat in concentratii mari

Reteta rapida DIY:
Masca hidratanta: 1 lingura miere + 1 lingura iaurt + cateva picaturi de ulei de cocos. Aplica 15 minute si clateste.

Descopera gama noastra de cosmetice naturale certificate!`,
      publishedAt: '2024-11-18T10:00:00Z',
    },
    {
      title: 'Top 10 superfoods pe care sa le ai in bucatarie',
      excerpt: 'Alimente nutritive care iti pot transforma sanatatea.',
      content: `Superfoods sunt alimente bogate in nutrienti care ofera beneficii exceptionale. Iata care nu ar trebui sa lipseasca din dieta ta.

1. Seminte de chia - omega-3, fibre, proteine. Adauga in smoothie-uri sau cereale.

2. Quinoa - proteina completa cu toti aminoacizii esentiali. Inlocuitor excelent pentru orez.

3. Avocado - grasimi sanatoase, potasiu, vitamine. Perfect in salate sau pe paine.

4. Afine - antioxidanti puternici pentru creier. Proaspete sau congelate.

5. Curcuma - antiinflamator natural. Adauga in mancaruri sau lapte de aur.

6. Kale (varza kale) - vitamine, fibre, calciu. In salate, smoothie-uri sau chips-uri.

7. Miere de Manuka - proprietati antibacteriene. Pentru imunitate si digestie.

8. Nuci - omega-3, magneziu, proteine. Snack perfect sau in deserturi.

9. Ceai verde Matcha - antioxidanti, energie sustinuta. Ca bautura sau in retete.

10. Ghimbir - digestie, antiinflamator, imunitate. Proaspat sau uscat.

Cum sa le introduci:
Incepe cu 2-3 si adauga treptat. Varietatea este cheia unei diete echilibrate.

Gasesti toate aceste superfoods in magazinul nostru!`,
      publishedAt: '2024-11-10T10:00:00Z',
    },
  ],
}
