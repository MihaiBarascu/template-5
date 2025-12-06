/**
 * SEED DATA - Fitness / Sala
 *
 * Date complete pentru seeding-ul unui site de fitness/sala.
 * Basat pe design-ul Template-2 (Transilvania Fitness).
 */

// =============================================================================
// IMAGINI FITNESS
// =============================================================================

export const fitnessImages = {
  hero: [
    { filename: 'fitness/hero/hero-main.jpg', alt: 'Sala de fitness moderna' },
    { filename: 'fitness/hero/hero-alt.jpg', alt: 'Antrenament intens' },
  ],
  team: [
    { filename: 'fitness/team/trainer-1.jpg', alt: 'Antrenor personal' },
    { filename: 'fitness/team/trainer-2.jpg', alt: 'Instructor fitness' },
    { filename: 'fitness/team/trainer-3.jpg', alt: 'Antrenor cardio' },
    { filename: 'fitness/team/trainer-4.jpg', alt: 'Instructor yoga' },
  ],
  gallery: [
    { filename: 'fitness/gallery/gallery-1.jpg', alt: 'Zona cardio' },
    { filename: 'fitness/gallery/gallery-2.jpg', alt: 'Zona greutati' },
    { filename: 'fitness/gallery/gallery-3.jpg', alt: 'Sala de clase' },
    { filename: 'fitness/gallery/gallery-4.jpg', alt: 'Echipamente moderne' },
    { filename: 'fitness/gallery/gallery-5.jpg', alt: 'Vestiar' },
    { filename: 'fitness/gallery/gallery-6.jpg', alt: 'Zona relaxare' },
  ],
  classes: [
    { filename: 'fitness/classes/class-hiit.jpg', alt: 'Clasa HIIT' },
    { filename: 'fitness/classes/class-yoga.jpg', alt: 'Clasa Yoga' },
    { filename: 'fitness/classes/class-spinning.jpg', alt: 'Clasa Spinning' },
    { filename: 'fitness/classes/class-crossfit.jpg', alt: 'Clasa CrossFit' },
    { filename: 'fitness/classes/class-pilates.jpg', alt: 'Clasa Pilates' },
    { filename: 'fitness/classes/class-boxing.jpg', alt: 'Clasa Box' },
  ],
}

// =============================================================================
// CONFIGURARE FITNESS
// =============================================================================

export const fitnessData = {
  // Business Info
  business: {
    name: 'Transilvania Fitness',
    tagline: 'Transforma-ti viata. Transforma-ti corpul.',
    description:
      'Cea mai moderna sala de fitness din Transilvania, cu echipamente de ultima generatie, antrenori certificati si o comunitate dedicata stilului de viata sanatos.',
    yearEstablished: 2018,
    phone: '0722 456 789',
    email: 'contact@transilvaniafitness.ro',
    whatsapp: '40722456789',
    address: {
      street: 'Strada Memorandumului 10',
      city: 'Cluj-Napoca',
      county: 'Cluj',
      postalCode: '400114',
      country: 'Romania',
    },
    workingHours: [
      { days: 'Luni - Vineri', hours: '06:00 - 23:00' },
      { days: 'Sambata', hours: '08:00 - 20:00' },
      { days: 'Duminica', hours: '09:00 - 18:00' },
    ],
    social: {
      facebook: 'https://facebook.com/transilvaniafitness',
      instagram: 'https://instagram.com/transilvaniafitness',
      youtube: 'https://youtube.com/@transilvaniafitness',
    },
    stats: [
      { value: '2000+', label: 'Membri activi' },
      { value: '50+', label: 'Clase pe saptamana' },
      { value: '15+', label: 'Antrenori certificati' },
      { value: '4.9', label: 'Rating Google' },
    ],
  },

  // Hero
  hero: {
    headline: 'Transforma-ti Viata Prin Miscare',
    subheadline:
      'Alatura-te celei mai moderne sali de fitness din Transilvania. Echipamente premium, antrenori profesionisti si o comunitate care te sustine.',
    ctaButtons: [
      { label: 'Inscrie-te Acum', link: '/clase/inscriere', variant: 'default' },
      { label: 'Vezi Abonamentele', link: '/abonamente', variant: 'outline' },
    ],
  },

  // Navigation - with dropdown submenus
  navigation: [
    { label: 'Acasa', type: 'custom' as const, url: '/' },
    {
      label: 'Clase',
      type: 'custom' as const,
      url: '/clase',
      hasSubmenu: true,
      submenu: [
        { label: 'Toate Clasele', type: 'custom' as const, url: '/clase', description: 'Vezi toate clasele disponibile' },
        { label: 'HIIT Extreme', type: 'custom' as const, url: '/clase/hiit-extreme', description: 'Antrenament de inalta intensitate' },
        { label: 'Yoga Flow', type: 'custom' as const, url: '/clase/yoga-flow', description: 'Flexibilitate si relaxare' },
        { label: 'Spinning Power', type: 'custom' as const, url: '/clase/spinning-power', description: 'Cardio intens pe bicicleta' },
        { label: 'CrossFit WOD', type: 'custom' as const, url: '/clase/crossfit-wod', description: 'Workout of the Day' },
      ],
    },
    { label: 'Program', type: 'custom' as const, url: '/program' },
    { label: 'Abonamente', type: 'custom' as const, url: '/abonamente' },
    {
      label: 'Antrenori',
      type: 'custom' as const,
      url: '/antrenori',
      hasSubmenu: true,
      submenu: [
        { label: 'Echipa Noastra', type: 'custom' as const, url: '/antrenori', description: 'Vezi toti antrenorii' },
        { label: 'Andrei Muresan', type: 'custom' as const, url: '/antrenori/andrei-muresan', description: 'Head Trainer & Manager' },
        { label: 'Elena Popescu', type: 'custom' as const, url: '/antrenori/elena-popescu', description: 'Instructor Yoga & Pilates' },
        { label: 'Mihai Ionescu', type: 'custom' as const, url: '/antrenori/mihai-ionescu', description: 'Personal Trainer' },
        { label: 'Ana Dragomir', type: 'custom' as const, url: '/antrenori/ana-dragomir', description: 'Instructor Cardio & Dans' },
      ],
    },
    { label: 'Galerie', type: 'custom' as const, url: '/galerie' },
    { label: 'Contact', type: 'custom' as const, url: '/contact' },
  ],

  // Footer
  footer: {
    columns: [
      {
        title: 'Navigare',
        type: 'links' as const,
        links: [
          { label: 'Acasa', type: 'custom' as const, url: '/' },
          { label: 'Clase', type: 'custom' as const, url: '/clase' },
          { label: 'Abonamente', type: 'custom' as const, url: '/abonamente' },
          { label: 'Contact', type: 'custom' as const, url: '/contact' },
        ],
      },
      {
        title: 'Clase',
        type: 'links' as const,
        links: [
          { label: 'HIIT Extreme', type: 'custom' as const, url: '/clase/hiit-extreme' },
          { label: 'Yoga Flow', type: 'custom' as const, url: '/clase/yoga-flow' },
          { label: 'Spinning Power', type: 'custom' as const, url: '/clase/spinning-power' },
          { label: 'CrossFit WOD', type: 'custom' as const, url: '/clase/crossfit-wod' },
        ],
      },
      {
        title: 'Contact',
        type: 'contact' as const,
      },
      {
        title: 'Program',
        type: 'schedule' as const,
      },
    ],
  },

  // Team (Trainers)
  team: [
    {
      name: 'Andrei Muresan',
      role: 'Head Trainer & Manager',
      experience: '10 ani experienta',
      featured: true,
      order: 1,
      specializations: ['CrossFit', 'HIIT', 'Antrenament Functional'],
      imageIndex: 0,
    },
    {
      name: 'Elena Popescu',
      role: 'Instructor Yoga & Pilates',
      experience: '8 ani experienta',
      featured: true,
      order: 2,
      specializations: ['Yoga Vinyasa', 'Pilates', 'Meditatie'],
      imageIndex: 1,
    },
    {
      name: 'Mihai Ionescu',
      role: 'Personal Trainer',
      experience: '6 ani experienta',
      featured: true,
      order: 3,
      specializations: ['Bodybuilding', 'Powerlifting', 'Nutritie Sportiva'],
      imageIndex: 2,
    },
    {
      name: 'Ana Dragomir',
      role: 'Instructor Cardio & Dans',
      experience: '5 ani experienta',
      featured: true,
      order: 4,
      specializations: ['Spinning', 'Zumba', 'Dance Fitness'],
      imageIndex: 3,
    },
  ],

  // Classes (now using dynamic attributes)
  classes: [
    {
      title: 'HIIT Extreme',
      shortDescription: 'Antrenament de inalta intensitate pentru arderea maxima a caloriilor',
      icon: 'Flame',
      featured: true,
      order: 1,
      displayStyle: 'card' as const,
      attributes: [
        { label: 'Preț', value: '50 RON/ședință', icon: 'Banknote' },
        { label: 'Durată', value: '45 min', icon: 'Clock' },
        { label: 'Nivel', value: 'Avansat', icon: 'TrendingUp' },
        { label: 'Locuri', value: '20', icon: 'Users' },
      ],
      features: ['Ardere maxima de calorii', 'Rezistență cardiovasculară', 'Tonifiere corp'],
      ctaLabel: 'Înscrie-te la clasă',
      ctaLink: '/contact',
      backLabel: 'Înapoi la clase',
      backLink: '/clase',
      schedule: [
        { day: 'monday' as const, startTime: '07:00', endTime: '07:45', room: 'Sala 1' },
        { day: 'monday' as const, startTime: '18:00', endTime: '18:45', room: 'Sala 1' },
        { day: 'wednesday' as const, startTime: '07:00', endTime: '07:45', room: 'Sala 1' },
        { day: 'wednesday' as const, startTime: '19:00', endTime: '19:45', room: 'Sala 1' },
        { day: 'friday' as const, startTime: '07:00', endTime: '07:45', room: 'Sala 1' },
        { day: 'friday' as const, startTime: '18:00', endTime: '18:45', room: 'Sala 1' },
      ],
    },
    {
      title: 'Yoga Flow',
      shortDescription: 'Sesiune de yoga pentru flexibilitate si relaxare profunda',
      icon: 'Leaf',
      featured: true,
      order: 2,
      displayStyle: 'card' as const,
      attributes: [
        { label: 'Preț', value: '45 RON/ședință', icon: 'Banknote' },
        { label: 'Durată', value: '60 min', icon: 'Clock' },
        { label: 'Nivel', value: 'Toate nivelurile', icon: 'TrendingUp' },
        { label: 'Locuri', value: '15', icon: 'Users' },
      ],
      features: ['Flexibilitate crescută', 'Reducerea stresului', 'Echilibru mental'],
      ctaLabel: 'Înscrie-te la clasă',
      ctaLink: '/contact',
      backLabel: 'Înapoi la clase',
      backLink: '/clase',
      schedule: [
        { day: 'monday' as const, startTime: '08:00', endTime: '09:00', room: 'Sala 2' },
        { day: 'tuesday' as const, startTime: '10:00', endTime: '11:00', room: 'Sala 2' },
        { day: 'thursday' as const, startTime: '08:00', endTime: '09:00', room: 'Sala 2' },
        { day: 'thursday' as const, startTime: '19:00', endTime: '20:00', room: 'Sala 2' },
        { day: 'saturday' as const, startTime: '10:00', endTime: '11:00', room: 'Sala 2' },
      ],
    },
    {
      title: 'Spinning Power',
      shortDescription: 'Antrenament intens pe bicicleta pentru cardio de exceptie',
      icon: 'Bike',
      featured: true,
      order: 3,
      displayStyle: 'card' as const,
      attributes: [
        { label: 'Preț', value: '40 RON/ședință', icon: 'Banknote' },
        { label: 'Durată', value: '50 min', icon: 'Clock' },
        { label: 'Nivel', value: 'Intermediar', icon: 'TrendingUp' },
        { label: 'Locuri', value: '25', icon: 'Users' },
      ],
      features: ['Cardio intens', 'Ardere de grăsimi', 'Tonifierea picioarelor'],
      ctaLabel: 'Înscrie-te la clasă',
      ctaLink: '/contact',
      backLabel: 'Înapoi la clase',
      backLink: '/clase',
      schedule: [
        { day: 'monday' as const, startTime: '17:00', endTime: '17:50', room: 'Sala Spinning' },
        { day: 'tuesday' as const, startTime: '07:00', endTime: '07:50', room: 'Sala Spinning' },
        { day: 'tuesday' as const, startTime: '18:00', endTime: '18:50', room: 'Sala Spinning' },
        { day: 'wednesday' as const, startTime: '17:00', endTime: '17:50', room: 'Sala Spinning' },
        { day: 'friday' as const, startTime: '17:00', endTime: '17:50', room: 'Sala Spinning' },
        { day: 'saturday' as const, startTime: '09:00', endTime: '09:50', room: 'Sala Spinning' },
      ],
    },
    {
      title: 'CrossFit WOD',
      shortDescription: 'Workout of the Day - antrenament functional complet',
      icon: 'Dumbbell',
      featured: true,
      order: 4,
      displayStyle: 'card' as const,
      attributes: [
        { label: 'Preț', value: '55 RON/ședință', icon: 'Banknote' },
        { label: 'Durată', value: '60 min', icon: 'Clock' },
        { label: 'Nivel', value: 'Intermediar', icon: 'TrendingUp' },
        { label: 'Locuri', value: '12', icon: 'Users' },
      ],
      features: ['Forță funcțională', 'Condiție fizică generală', 'Comunitate motivantă'],
      ctaLabel: 'Înscrie-te la clasă',
      ctaLink: '/contact',
      backLabel: 'Înapoi la clase',
      backLink: '/clase',
      schedule: [
        { day: 'monday' as const, startTime: '09:00', endTime: '10:00', room: 'Box CrossFit' },
        { day: 'tuesday' as const, startTime: '17:00', endTime: '18:00', room: 'Box CrossFit' },
        { day: 'wednesday' as const, startTime: '09:00', endTime: '10:00', room: 'Box CrossFit' },
        { day: 'thursday' as const, startTime: '17:00', endTime: '18:00', room: 'Box CrossFit' },
        { day: 'friday' as const, startTime: '09:00', endTime: '10:00', room: 'Box CrossFit' },
        { day: 'saturday' as const, startTime: '11:00', endTime: '12:00', room: 'Box CrossFit' },
      ],
    },
    {
      title: 'Pilates Mat',
      shortDescription: 'Intarirea musculaturii core prin exercitii controlate',
      icon: 'Activity',
      featured: false,
      order: 5,
      displayStyle: 'card' as const,
      attributes: [
        { label: 'Preț', value: '45 RON/ședință', icon: 'Banknote' },
        { label: 'Durată', value: '55 min', icon: 'Clock' },
        { label: 'Nivel', value: 'Începător', icon: 'TrendingUp' },
        { label: 'Locuri', value: '15', icon: 'Users' },
      ],
      features: ['Core puternic', 'Flexibilitate', 'Postură corectă'],
      ctaLabel: 'Înscrie-te la clasă',
      ctaLink: '/contact',
      backLabel: 'Înapoi la clase',
      backLink: '/clase',
      schedule: [
        { day: 'tuesday' as const, startTime: '09:00', endTime: '09:55', room: 'Sala 2' },
        { day: 'wednesday' as const, startTime: '11:00', endTime: '11:55', room: 'Sala 2' },
        { day: 'thursday' as const, startTime: '10:00', endTime: '10:55', room: 'Sala 2' },
        { day: 'friday' as const, startTime: '11:00', endTime: '11:55', room: 'Sala 2' },
        { day: 'sunday' as const, startTime: '10:00', endTime: '10:55', room: 'Sala 2' },
      ],
    },
    {
      title: 'Box Fitness',
      shortDescription: 'Antrenament de box pentru forta si coordonare',
      icon: 'Target',
      featured: false,
      order: 6,
      displayStyle: 'card' as const,
      attributes: [
        { label: 'Preț', value: '50 RON/ședință', icon: 'Banknote' },
        { label: 'Durată', value: '60 min', icon: 'Clock' },
        { label: 'Nivel', value: 'Intermediar', icon: 'TrendingUp' },
        { label: 'Locuri', value: '16', icon: 'Users' },
      ],
      features: ['Forță și putere', 'Coordonare îmbunătățită', 'Stres relief'],
      ctaLabel: 'Înscrie-te la clasă',
      ctaLink: '/contact',
      backLabel: 'Înapoi la clase',
      backLink: '/clase',
      schedule: [
        { day: 'monday' as const, startTime: '19:00', endTime: '20:00', room: 'Sala Box' },
        { day: 'wednesday' as const, startTime: '18:00', endTime: '19:00', room: 'Sala Box' },
        { day: 'wednesday' as const, startTime: '20:00', endTime: '21:00', room: 'Sala Box' },
        { day: 'friday' as const, startTime: '19:00', endTime: '20:00', room: 'Sala Box' },
        { day: 'saturday' as const, startTime: '12:00', endTime: '13:00', room: 'Sala Box' },
      ],
    },
  ],

  // Subscriptions
  subscriptions: [
    {
      title: 'Basic',
      subtitle: 'Pentru incepatori',
      type: 'gym' as const,
      price: 149,
      period: '/luna',
      features: [
        { text: 'Acces la sala de fitness', included: true },
        { text: 'Echipamente cardio si greutati', included: true },
        { text: 'Vestiar cu dus', included: true },
        { text: 'Clase de grup', included: false },
        { text: 'Antrenor personal', included: false },
        { text: 'Acces weekend', included: false },
      ],
      cta: { label: 'Alege Basic', url: '/contact' },
      highlighted: false,
      order: 1,
    },
    {
      title: 'Standard',
      subtitle: 'Cel mai popular',
      type: 'fitness-spa' as const,
      price: 199,
      oldPrice: 249,
      period: '/luna',
      features: [
        { text: 'Acces la sala de fitness', included: true },
        { text: 'Echipamente cardio si greutati', included: true },
        { text: 'Vestiar cu dus', included: true },
        { text: 'Clase de grup nelimitate', included: true },
        { text: 'Acces weekend', included: true },
        { text: 'Antrenor personal', included: false },
      ],
      cta: { label: 'Alege Standard', url: '/contact' },
      highlighted: true,
      highlightLabel: 'Cel mai popular',
      order: 2,
    },
    {
      title: 'Premium',
      subtitle: 'Experienta completa',
      type: 'premium' as const,
      price: 299,
      period: '/luna',
      features: [
        { text: 'Acces la sala de fitness', included: true },
        { text: 'Echipamente cardio si greutati', included: true },
        { text: 'Vestiar VIP cu prosop', included: true },
        { text: 'Clase de grup nelimitate', included: true },
        { text: 'Acces weekend', included: true },
        { text: '4 sedinte antrenor personal/luna', included: true },
      ],
      cta: { label: 'Alege Premium', url: '/contact' },
      highlighted: false,
      order: 3,
    },
    {
      title: 'Anual Premium',
      subtitle: 'Cel mai bun pret',
      type: 'premium' as const,
      price: 1990,
      oldPrice: 2388,
      period: '/an',
      features: [
        { text: 'Tot ce include Premium', included: true },
        { text: 'Echivalent 166 lei/luna', included: true },
        { text: 'Consultatie nutritionala', included: true },
        { text: 'Program personalizat', included: true },
        { text: 'Acces prioritar la clase', included: true },
        { text: 'Parkare gratuita', included: true },
      ],
      cta: { label: 'Alege Anual', url: '/contact' },
      highlighted: false,
      highlightLabel: 'Economisesti 400 lei',
      order: 4,
    },
  ],

  // Testimonials
  testimonials: [
    {
      name: 'Maria Constantinescu',
      role: 'Membru de 2 ani',
      content:
        'De cand am devenit membra la Transilvania Fitness, viata mea s-a schimbat complet. Am slabit 15 kg si am mai multa energie ca niciodata. Antrenorii sunt exceptionale!',
      rating: '5',
      featured: true,
    },
    {
      name: 'Alexandru Pop',
      role: 'Membru de 1 an',
      content:
        'Cele mai bune echipamente din oras si o atmosfera motivanta. Clasele de CrossFit cu Andrei sunt fantastic - rezultatele se vad!',
      rating: '5',
      featured: true,
    },
    {
      name: 'Ioana Moldovan',
      role: 'Membru de 6 luni',
      content:
        'Cautam o sala cu clase de yoga de calitate si am gasit exact ce aveam nevoie. Elena este un instructor exceptional, iar spatiul este perfect pentru practica.',
      rating: '5',
      featured: true,
    },
    {
      name: 'Radu Stanescu',
      role: 'Membru de 3 ani',
      content:
        'Am incercat multe sali in Cluj, dar Transilvania Fitness este de departe cea mai buna. Curatenie impecabila, echipamente mereu functionale si personal prietenos.',
      rating: '5',
      featured: true,
    },
  ],

  // FAQ
  faq: [
    {
      question: 'Care sunt orele de functionare ale salii?',
      answer:
        'Sala este deschisa Luni-Vineri intre orele 06:00-23:00, Sambata 08:00-20:00 si Duminica 09:00-18:00.',
      order: 1,
    },
    {
      question: 'Pot incerca sala inainte de a ma abona?',
      answer:
        'Da! Oferim o sedinta de proba gratuita pentru toti vizitatorii noi. Pur si simplu vino la receptie sau contacteaza-ne pentru programare.',
      order: 2,
    },
    {
      question: 'Ce echipament am nevoie pentru clase?',
      answer:
        'Pentru majoritatea claselor ai nevoie doar de haine sportive confortabile si incaltaminte de interior curata. Pentru yoga/pilates, te rugam sa aduci si un prosop. Covoarele sunt asigurate de noi.',
      order: 3,
    },
    {
      question: 'Pot ingheta abonamentul?',
      answer:
        'Da, abonamentele pot fi inghetate pana la 30 de zile pe an. Contacteaza receptia pentru mai multe detalii.',
      order: 4,
    },
    {
      question: 'Oferiti antrenament personal?',
      answer:
        'Da, avem antrenori certificati care ofera sesiuni personalizate. Pachetul Premium include 4 sedinte pe luna, sau poti achizitiona sesiuni individuale.',
      order: 5,
    },
    {
      question: 'Aveti parcare?',
      answer:
        'Da, avem parcare gratuita pentru membrii cu abonament anual. Pentru celelalte abonamente, parcarea este disponibila contra cost.',
      order: 6,
    },
    {
      question: 'Cum pot anula o rezervare la clasa?',
      answer:
        'Rezervarile pot fi anulate cu minim 2 ore inainte de inceperea clasei prin aplicatia noastra sau la receptie.',
      order: 7,
    },
    {
      question: 'Exista vestiare si dusuri?',
      answer:
        'Da, avem vestiare separate pentru barbati si femei, echipate cu dusuri, uscatoare de par si dulapuri cu cheie.',
      order: 8,
    },
  ],
}
