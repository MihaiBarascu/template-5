/**
 * TERAPII ENERGETICE DATA
 * Date extrase de pe https://www.terapiienergetice.ro/
 * Business: Revital Harmony - Centru de Terapii Energetice
 * Design inspirat de: https://www.plasturifototerapeutici.ro/
 */

// =============================================================================
// BUSINESS INFO (Date reale de pe site)
// =============================================================================

export const terapiiEnergeticeData = {
  business: {
    name: 'Revital Harmony',
    tagline: 'Centru de Terapii Energetice',
    description:
      'Revital Harmony este un centru de terapii energetice fondat în București pentru a ajuta clienții să-și recâștige echilibrul interior - fizic, mental, emoțional și spiritual. Cu experiență vastă în domenii multiple, Monica Batir oferă abordări care transcend nivelul fizic, ajungând în sfere subtile unde are loc vindecarea profundă.',
    yearEstablished: 2016,
    phone: '0774 512 905',
    email: 'office@terapiienergetice.ro',
    whatsapp: '+40774512905',
    address: {
      street: 'Bulevardul Decebal Nr. 9',
      sector: 'Sector 3',
      city: 'București',
      country: 'România',
      postalCode: '030964',
    },
    workingHours: [
      { days: 'Luni - Vineri', hours: '09:00 - 20:00' },
      { days: 'Sâmbătă', hours: '10:00 - 18:00' },
      { days: 'Duminică', hours: 'Cu programare' },
    ],
    social: {
      facebook: 'https://www.facebook.com/MonicaBatir.Terapeut/',
      instagram: 'https://www.instagram.com/monicabatir/',
      youtube: 'https://www.youtube.com/channel/UCfbLIINL3FZbu2uZLx-wjPg',
      twitter: 'https://www.twitter.com',
    },
    stats: [
      { value: '5000', label: 'Pacienți Ajutați', suffix: '+' },
      { value: '8', label: 'Ani Experiență', suffix: '+' },
      { value: '8', label: 'Tipuri de Terapii' },
      { value: '173', label: 'Țări Access Consciousness' },
    ],
  },

  // =============================================================================
  // NAVIGATION
  // =============================================================================

  navigation: [
    { label: 'Acasă', url: '/', type: 'custom' as const },
    { label: 'Despre Mine', url: '/despre', type: 'custom' as const },
    { label: 'Terapii', url: '/terapii', type: 'custom' as const },
    { label: 'Cursuri', url: '/cursuri', type: 'custom' as const },
    { label: 'Testimoniale', url: '/testimoniale', type: 'custom' as const },
    { label: 'Media', url: '/media', type: 'custom' as const },
    { label: 'Contact', url: '/contact', type: 'custom' as const },
  ],

  // =============================================================================
  // HERO
  // =============================================================================

  hero: {
    headline: 'Descoperă Terapiile Energetice',
    subheadline:
      'Terapii energetice aplicate de Monica Batir pentru echilibrarea corpului, minții și sufletului. Bowen, Access Bars, Facelift Energetic, Reiki și multe altele.',
    ctaButtons: [
      { label: 'Programează-te Acum', link: '/contact', variant: 'default' },
      { label: 'Descoperă Terapiile', link: '/terapii', variant: 'outline' },
    ],
  },

  // =============================================================================
  // SERVICES (Terapii - conținut real de pe site)
  // =============================================================================

  services: [
    {
      title: 'Terapia Bowen',
      shortDescription:
        'Terapia Bowen este o formă de terapie manuală non-invazivă care vizează restabilirea echilibrului. Originară din Geelong, Australia, abordează corpul holistic prin dimensiuni fizice, emoționale și energetice folosind mișcări delicate pe mușchi, tendoane, ligamente și fascie.',
      icon: 'Heart',
      price: 200,
      duration: '30-60 min',
      featured: true,
      order: 1,
      features: [
        'Reflexul de stretching - țintește celulele Golgi',
        'Activarea proprioceptorilor articulari',
        'Impactul asupra fasciei pentru aliniere posturală',
        'Reechilibrarea sistemului nervos (simpatic → parasimpatic)',
        'Detoxifiere și reducerea inflamației',
        'Tratament pentru dureri de spate, sciatică, migrene',
      ],
    },
    {
      title: 'Terapia Access Bars',
      shortDescription:
        'Access Bars este o metodă inovatoare de vindecare și eliberare energetică care utilizează atingerea cuantică a 32 de puncte specifice dispuse pe cap. Stimulează fluxul de energie prin sistemul nervos, eliberând tensiunea acumulată și blocajele.',
      icon: 'Brain',
      price: 200,
      duration: '60-90 min',
      featured: true,
      order: 2,
      features: [
        '32 de puncte energetice pe cap activate',
        'Eliberarea blocajelor mentale și emoționale',
        'Reducerea stresului și anxietății',
        'Îmbunătățirea clarității mentale și memoriei',
        'Suport pentru depresie și atacuri de panică',
        'Practicată în peste 173 de țări',
      ],
    },
    {
      title: 'Facelift Energetic',
      shortDescription:
        'Access Facelift este o metodă de întinerire care inversează semnele îmbătrânirii prin mișcări delicate ce activează resursele celulare. Parte din sistemul Access Consciousness, restaurează corpul la forma sa originală.',
      icon: 'Sparkles',
      price: 200,
      duration: '60-90 min',
      featured: true,
      order: 3,
      features: [
        'Luminozitate facială și claritate a ochilor',
        'Strălucire a părului',
        'Efecte de lifting pentru sâni și fese',
        'Energie și entuziasm crescut',
        'Relaxare profundă',
        'Stima de sine îmbunătățită',
        'Reducerea țesutului adipos',
      ],
    },
    {
      title: 'Terapia Reiki',
      shortDescription:
        'Reiki este o tehnică de vindecare spirituală care utilizează fluxul de energie universală pentru a promova echilibrul și vindecarea în corp și minte. Practicianul canalizează această energie prin mâini, direcționată de intenție și concentrare.',
      icon: 'Sun',
      price: 150,
      duration: '45-60 min',
      featured: true,
      order: 4,
      features: [
        'Echilibrarea celor 7 chakre principale',
        'Relaxare profundă și reducerea stresului',
        'Stimularea capacității naturale de autovindecare',
        'Eliberarea blocajelor energetice',
        'Armonizare corp-minte-spirit',
        'Suport pentru recuperare post-operatorie',
      ],
    },
    {
      title: 'Corecția Bioenergetică',
      shortDescription:
        'Corecția Bioenergetică este o metodă terapeutică ce vizează normalizarea bioenergeticii corpului uman printr-o abordare integrativă a stării fizice, spirituale și psihice. Include masaj clasic, masaj punctiform, masaj terapeutic non-contact și metode de stretching.',
      icon: 'Zap',
      price: 180,
      duration: '30-60 min',
      featured: false,
      order: 5,
      features: [
        'Masaj clasic și punctiform',
        'Masaj terapeutic non-contact',
        'Metode de stretching',
        'Tratament pentru stres și atacuri de panică',
        'Suport pentru depresie și insomnie',
        'Tratament pentru oboseală cronică',
      ],
    },
    {
      title: 'Eliberarea Tensiunii Interioare',
      shortDescription:
        'Terapie specializată pentru eliberarea tensiunii și stresului acumulat. Contribuie la armonizarea energiilor, îmbunătățirea condiției fizice și psihologice, reducerea tensiunii musculare și facilitarea proceselor naturale de vindecare.',
      icon: 'Wind',
      price: 180,
      duration: '60 min',
      featured: false,
      order: 6,
      features: [
        'Eliberarea stresului și tensiunii acumulate',
        'Armonizarea energiilor',
        'Reducerea tensiunii musculare',
        'Îmbunătățirea condiției psihologice',
        'Facilitarea proceselor naturale de vindecare',
        'Stare de relaxare profundă',
      ],
    },
    {
      title: 'Terapia cu Lumină',
      shortDescription:
        'Plasturi Fototerapeutici pentru Stimularea Celulelor Stem. O metodă inovatoare bazată pe nanotehnologie care folosește lumina corpului pentru a activa procesele naturale de vindecare și regenerare celulară.',
      icon: 'Lightbulb',
      price: 150,
      duration: '45 min',
      featured: false,
      order: 7,
      features: [
        'Stimularea celulelor stem proprii',
        'Reducerea inflamației și durerii',
        'Îmbunătățirea calității somnului',
        'Energie crescută fără cafeină',
        'Detoxifiere și regenerare celulară',
        'Tehnologie brevetată LifeWave',
      ],
    },
    {
      title: 'Termo Masaj Ceragem',
      shortDescription:
        'Patul de masaj cu pietre de jad pentru relaxare profundă și detoxifiere. Combină căldura infraroșie cu masajul pentru beneficii terapeutice complete, stimulând circulația și reducând tensiunea musculară.',
      icon: 'Flame',
      price: 100,
      duration: '45 min',
      featured: false,
      order: 8,
      features: [
        'Pietre de jad încălzite',
        'Căldură infraroșie terapeutică',
        'Masaj automat al coloanei vertebrale',
        'Relaxare profundă și detoxifiere',
        'Stimularea circulației sanguine',
        'Reducerea tensiunii musculare',
      ],
    },
  ],

  // =============================================================================
  // COURSES (Cursuri - prețuri și detalii reale)
  // =============================================================================

  courses: [
    {
      title: 'Curs Access Bars',
      description: `Access Bars este o ramură a Access Consciousness, o tehnică de medicină alternativă practicată în peste 173 de țări. Metoda se concentrează pe 32 de puncte de pe cap care, atunci când sunt atinse, eliberează unde electromagnetice pentru a curăța blocajele și emoțiile negative.

Ce primești la curs:
• Tehnici practice pentru auto-aplicare și lucrul cu clienții
• Înțelegerea celor 32 de puncte energetice de pe cap
• Instrumente de lucru și informații valoroase
• Training pentru a facilita vindecarea pentru tine și alții
• Acces la experiența și cunoștințele facilitatorului Monica Batir

Cursul durează o zi și include transfer eficient de informații la nivel vibrațional.`,
      price: 1460,
      priceRepeat: 730,
      priceAdolescent: 730,
      priceChild: 0,
      duration: '1 zi',
      certification: 'Certificat Internațional Access Consciousness',
      featured: true,
      nextDates: ['20 Decembrie 2025', '17 Ianuarie 2026', '21 Februarie 2026'],
    },
    {
      title: 'Curs Facelift Energetic',
      description: `Facelift Energetic Access este un proces revoluționar care încorporează 30 de energii pentru a elibera tensiunea și a inversa semnele îmbătrânirii fără intervenție fizică.

Ce primești la curs:
• Două ședințe în care primești tratamentul Facelift Energetic
• Două ședințe în care oferi tratamentul altui participant
• Manual Access Facelift cu poziții și tehnici
• Fișă de lucru și instrumente Access Consciousness
• Prezentare video de la Dr. Heer (fondatorul Access Consciousness)
• Diplomă Internațională de Practician Access Facelift (recunoscută global)

Cursul se desfășoară pe parcursul a două zile de training intensiv.`,
      price: 1875,
      priceRepeat: 935,
      duration: '2 zile',
      certification: 'Diplomă Internațională Practician Access Facelift',
      featured: true,
      nextDates: ['21 Decembrie 2025', '18 Ianuarie 2026', '22 Februarie 2026'],
    },
  ],

  // =============================================================================
  // TESTIMONIALS (Testimoniale reale de pe site)
  // =============================================================================

  testimonials: [
    // FACELIFT ENERGETIC
    {
      content:
        'Pentru mine cursul de Facelift a fost extrem de interesant, un curs în care am găsit răspunsuri la multe întrebări. Am observat schimbări vizibile la nivelul tenului și o stare de bine extraordinară.',
      name: 'Roxana V.',
      role: 'Asistentă Medicală / Profesoară, București',
      rating: '5',
      featured: true,
      therapy: 'Facelift Energetic',
    },
    // REIKI
    {
      content:
        'În timpul ședinței de Reiki m-am relaxat profund. Am simțit cum plutesc, iar apăsarea pe care o simțeam la început în piept, a dispărut complet. O experiență transformatoare.',
      name: 'Larisa M.',
      role: 'Consilier Juridic, București',
      rating: '5',
      featured: true,
      therapy: 'Terapia Reiki',
    },
    // ELIBERARE TENSIUNE
    {
      content:
        'În urma ședinței de terapie de eliberare a tensiunii interioare, m-am simțit mult mai ușoară, eliberată de stress, foarte liniștită, conectată la corpul meu. Recomand din suflet!',
      name: 'Ioana V.',
      role: 'Economist',
      rating: '5',
      featured: true,
      therapy: 'Eliberarea Tensiunii Interioare',
    },
    // ACCESS BARS
    {
      content:
        'Am înțeles că totul este despre vibrație și energie. Access Bars m-a ajutat să eliberez blocaje pe care le aveam de ani de zile. Transformarea a fost incredibilă.',
      name: 'Violeta G.',
      role: 'Terapeut Holistic, Franța',
      rating: '5',
      featured: true,
      therapy: 'Access Bars',
    },
    // BOWEN
    {
      content:
        'Terapia Bowen mi-a redus atacurile de panică de la 2 pe zi la 2 pe săptămână, și m-a ajutat să fac față mult mai eficient episoadelor depresive. Simt că starea mea de bine se îmbunătățește de la o zi la alta.',
      name: 'Răzvan',
      role: 'Elev cls. a 12-a',
      rating: '5',
      featured: false,
      therapy: 'Terapia Bowen',
    },
    {
      content:
        'După ședințele de terapie Bowen, au încetat răcelile dese, mai ales la nivelul gâtului. Am scăpat de această problemă supărătoare și, de asemenea, problema ciclurilor menstruale dereglate s-a rezolvat.',
      name: 'Camelia D.',
      role: 'Economist',
      rating: '5',
      featured: false,
      therapy: 'Terapia Bowen',
    },
    {
      content:
        'Terapia Bowen și ședințele de eliberare a tensiunii interioare au fost foarte eficiente pentru starea de bine. M-au ajutat să mențin echilibrul interior.',
      name: 'Camelia I.',
      role: 'Psiholog',
      rating: '5',
      featured: false,
      therapy: 'Terapia Bowen',
    },
    {
      content:
        'Terapia Bowen mi-a ajutat organismul să se echilibreze. Obișnuiam să am hipertensiune aproape zilnic, împreună cu pulsul mărit și palpitații. De când am făcut terapie Bowen, se mai întâmplă foarte rar acum.',
      name: 'Beatrice D.',
      role: 'Elevă cls. 12-a',
      rating: '5',
      featured: false,
      therapy: 'Terapia Bowen',
    },
    {
      content:
        'Pe mine m-a ajutat foarte mult terapia Bowen pentru că eram foarte stresat de la școală. De la prima ședință m-am simțit foarte liniștit.',
      name: 'Dragoș C.',
      role: 'Elev cls. 12',
      rating: '5',
      featured: false,
      therapy: 'Terapia Bowen',
    },
    {
      content:
        'Am început să merg la terapie Access Bars, în perioada când atacurile de panică s-au întetit, în special noaptea. După 5 ședințe de terapie, au dispărut complet. Somnul este profund.',
      name: 'Mihaela R.',
      role: 'Antreprenor',
      rating: '5',
      featured: false,
      therapy: 'Access Bars',
    },
    {
      content:
        'Aveam un examen de dat și foarte multe emoții. Eram convinsă că nu o să reușesc. După 3 ședințe de terapie, ceva s-a schimbat în interiorul meu. Rezultatul? Am luat examenul, a 2-a pe listă.',
      name: 'Carmen S.',
      role: 'Asistentă Medicală',
      rating: '5',
      featured: false,
      therapy: 'Access Bars',
    },
    {
      content:
        'Mă luptam cu depresia de 2 ani. Am început să merg regulat la terapia Access Bars. În 4 luni am renunțat la medicație. Zilnic îmi fac singură autoterapie. Mă simt extraordinar!',
      name: 'Simina V.',
      role: 'Artist Plastic',
      rating: '5',
      featured: false,
      therapy: 'Access Bars',
    },
    {
      content:
        'După câteva ședințe de Facelift energetic, am observat că ridurile fine de pe gât și decolteu s-au estompat vizibil, tenul a devenit mai plin de viață. Starea interioară s-a schimbat.',
      name: 'Raluca I.',
      role: 'Chimist',
      rating: '5',
      featured: false,
      therapy: 'Facelift Energetic',
    },
    {
      content:
        'Terapia Facelift m-a ajutat să am mai multă încredere în mine. Tenul meu s-a schimbat complet. Am devenit mult mai veselă, mai plină de viață.',
      name: 'Ioana P.',
      role: 'Consilier Juridic',
      rating: '5',
      featured: false,
      therapy: 'Facelift Energetic',
    },
    {
      content:
        'După 5 ședințe de eliberare emoțională, nu am mai avut atacuri de panică, am reușit să adorm noaptea fără medicamente. Parcă sunt un alt om.',
      name: 'Sorina B.',
      role: 'Referent',
      rating: '5',
      featured: false,
      therapy: 'Eliberarea Tensiunii',
    },
    {
      content:
        'Înainte de terapie făcusem un atac de panică. Eram foarte obosit și irascibil. În timpul terapiei am simțit cum tot stresul se dizolvă. Am plecat un alt om.',
      name: 'Radu A.',
      role: 'Manager Vânzări',
      rating: '5',
      featured: false,
      therapy: 'Eliberarea Tensiunii',
    },
  ],

  // =============================================================================
  // FAQ (Bazat pe conținutul real al site-ului)
  // =============================================================================

  faq: [
    {
      question: 'Ce este Terapia Bowen și cum funcționează?',
      answer:
        'Terapia Bowen este o formă de terapie manuală non-invazivă care vizează restabilirea echilibrului. Originară din Geelong, Australia (creată de Tom Bowen), abordează corpul holistic prin dimensiuni fizice, emoționale și energetice. Funcționează prin: reflexul de stretching (țintește celulele Golgi), activarea proprioceptorilor articulari, impactul asupra fasciei pentru aliniere posturală, reechilibrarea sistemului nervos (de la simpatic la parasimpatic) și detoxifiere.',
    },
    {
      question: 'Ce este Access Bars și pentru cine este recomandat?',
      answer:
        'Access Bars este o metodă inovatoare de vindecare și eliberare energetică care utilizează atingerea cuantică a 32 de puncte specifice dispuse pe cap. Este potrivită pentru oricine dorește să experimenteze o stare profundă de relaxare și eliberare energetică. Beneficii: reducerea stresului și anxietății, îmbunătățirea clarității mentale, memoriei și concentrării, armonizarea energetică și suport pentru condiții mentale și fizice.',
    },
    {
      question: 'Ce beneficii are Facelift-ul Energetic?',
      answer:
        'Access Facelift oferă multiple beneficii: luminozitate facială și claritate a ochilor, strălucire a părului, efecte de lifting pentru sâni și fese, energie și entuziasm crescut, relaxare profundă, stima de sine îmbunătățită, reducerea țesutului adipos, stabilitate dentară și suport pentru recuperarea post-operatorie și post-AVC.',
    },
    {
      question: 'Câte ședințe sunt necesare pentru a vedea rezultate?',
      answer:
        'Numărul de ședințe variază în funcție de condiția tratată și de răspunsul individual. Pentru Terapia Bowen, mulți pacienți observă îmbunătățiri după 2-3 ședințe. Pentru condiții cronice de corecție bioenergetică, se recomandă ideally zilnic timp de 7-10 zile, apoi o pauză de 2-3 luni. Pentru Facelift Energetic, nu există un număr fix - clienții aleg în funcție de nevoile personale.',
    },
    {
      question: 'Care sunt prețurile cursurilor de certificare?',
      answer:
        'Curs Access Bars: 1.460 RON pentru prima participare, 730 RON pentru reluare, 730 RON pentru adolescenți (16-18 ani), gratuit pentru copii sub 16 ani. Curs Facelift Energetic: 1.875 RON pentru prima participare, 935 RON pentru reluare. Toate cursurile includ materiale și certificare internațională.',
    },
    {
      question: 'Ce este Corecția Bioenergetică și când este contraindicată?',
      answer:
        'Corecția Bioenergetică este o metodă terapeutică ce vizează normalizarea bioenergeticii corpului uman printr-o abordare integrativă. Adresează: stres, atacuri de panică, depresie, insomnie, oboseală cronică, tulburări ale sistemului osos, probleme ale organelor interne. Contraindicații: afecțiuni maligne ale sângelui, tumori active, tuberculoză activă, afecțiuni psihiatrice severe, anevrisme cardiace, infecții acute.',
    },
    {
      question: 'Terapiile pot fi combinate cu tratamentele medicale convenționale?',
      answer:
        'Da, terapiile energetice sunt complementare și pot fi folosite alături de tratamentele medicale convenționale. Serviciul completează - nu înlocuiește - tratamentul medical convențional, ajutând la gestionarea stresului, ameliorarea durerii și promovarea unui stil de viață echilibrat și sănătos.',
    },
    {
      question: 'Cum mă pot programa pentru o ședință sau un curs?',
      answer:
        'Puteți contacta cabinetul telefonic la 0774 512 905, prin email la office@terapiienergetice.ro sau monabatir12@gmail.com, sau completând formularul de contact de pe site. Pentru cursuri, înscrierile se fac telefonic sau prin email, iar plata se poate face în ziua cursului.',
    },
  ],

  // =============================================================================
  // HOW IT WORKS
  // =============================================================================

  howItWorks: [
    {
      title: 'Contactează-ne',
      description: 'Sună la 0774 512 905 sau trimite un email pentru a stabili o programare.',
      icon: 'Phone',
    },
    {
      title: 'Evaluare Inițială',
      description: 'Discutăm despre nevoile tale și stabilim terapia potrivită pentru tine.',
      icon: 'ClipboardCheck',
    },
    {
      title: 'Ședința de Terapie',
      description: 'Experimentezi terapia într-un mediu relaxant și profesionist.',
      icon: 'Heart',
    },
    {
      title: 'Transformare',
      description: 'Urmărim progresul și continuăm până la atingerea obiectivelor tale.',
      icon: 'Star',
    },
  ],

  // =============================================================================
  // VIDEO GALLERY (YouTube - link-uri reale de pe terapiienergetice.ro/media)
  // =============================================================================

  videos: [
    {
      title: 'Legătura ascunsă dintre creier și intestin',
      videoUrl: 'https://www.youtube.com/watch?v=rpQ7Gxw24EQ',
      category: 'Educație',
      duration: '15:00',
    },
    {
      title: 'Dereglare hormonală remediată prin Terapie Access Bars',
      videoUrl: 'https://www.youtube.com/watch?v=kUydjMCBAe8',
      category: 'Access Bars',
      duration: '12:30',
    },
    {
      title: 'Life Stem Fototerapie cu Monica Batîr',
      videoUrl: 'https://www.youtube.com/watch?v=9R9p0_eNyrw',
      category: 'Fototerapie',
      duration: '45:00',
    },
    {
      title: 'Când trimitem corpul în concediu?',
      videoUrl: 'https://www.youtube.com/watch?v=g_WYobfnNbE',
      category: 'Educație',
      duration: '20:00',
    },
    {
      title: 'Cum putem susține vindecarea corpului nostru',
      videoUrl: 'https://www.youtube.com/watch?v=-l8dzRYwPg4',
      category: 'Educație',
      duration: '25:00',
    },
    {
      title: 'Ce este fototerapia și cum o putem folosi?',
      videoUrl: 'https://www.youtube.com/watch?v=LjYooa25Ibc',
      category: 'Fototerapie',
      duration: '18:00',
    },
    {
      title: 'Facelift Energetic',
      videoUrl: 'https://www.youtube.com/watch?v=NYZ6-VitAJo',
      category: 'Facelift Energetic',
      duration: '10:00',
    },
    {
      title: 'Cum să producem celule STEM sănătoase?',
      videoUrl: 'https://www.youtube.com/watch?v=MonPDzAlhCs',
      category: 'Educație',
      duration: '22:00',
    },
    {
      title: 'Metode și instrumente pentru regenerarea corpului',
      videoUrl: 'https://www.youtube.com/watch?v=9g1lWHOgPLo',
      category: 'Educație',
      duration: '30:00',
    },
    {
      title: 'Terapia Access Bars pentru blocajele mentale',
      videoUrl: 'https://www.youtube.com/watch?v=6M8ZbT9Ycqs',
      category: 'Access Bars',
      duration: '15:00',
    },
    {
      title: 'Sănătatea emoțională - Canal 33 România',
      videoUrl: 'https://www.youtube.com/watch?v=PgskKpwKVvM',
      category: 'Testimoniale',
      duration: '28:00',
    },
  ],

  // =============================================================================
  // TEAM (Informații reale despre Monica Batir)
  // =============================================================================

  team: [
    {
      name: 'Monica Batir',
      role: 'Fondator & Terapeut Principal',
      bio: `Monica Batir este fondatoarea centrului de terapii energetice Revital Harmony din București, creat pentru a ajuta clienții să-și recâștige echilibrul interior - fizic, mental, emoțional și spiritual.

Calificări și Certificări:
• Psiholog Licențiat
• Terapeut Holistic și Trainer (Terapia Bowen, eliberare emoțională, corecție bioenergetică)
• Reiki Master
• Fototerapeut
• Specialist Access Bars (eliberare blocaje emoționale, mentale și fizice)
• Specialist Facelift Access Energetic
• Absolventă Academia Internațională Access Consciousness
• Facilitator Access Bars și Facelift Access Energetic
• Nutriționist cu specializare în medicină Ayurvedică
• Practicant Yoga

"Sunt o persoană pentru care iubirea este forța motrice a tuturor activităților mele."`,
      featured: true,
    },
  ],
}

// =============================================================================
// IMAGES - Local seed images
// =============================================================================

export const terapiiEnergeticeImages = {
  hero: [
    { filename: 'hero-1.png', alt: 'Terapii Energetice - Cabinet' },
    { filename: 'hero-2.png', alt: 'Ședință de terapie' },
  ],
  banner: { filename: 'hero-banner.png', alt: 'Terapii Energetice Banner' },
  services: [
    { filename: 'service-bowen.png', alt: 'Terapia Bowen' },
    { filename: 'service-eliberare.png', alt: 'Eliberare Emoțională' },
    { filename: 'service-bowen-alt.png', alt: 'Terapia Bowen' },
  ],
  courses: [
    { filename: 'curs-access-bars.png', alt: 'Curs Access Bars' },
    { filename: 'curs-facelift.png', alt: 'Curs Facelift Energetic' },
  ],
  logo: { filename: 'logo.png', alt: 'Revital Harmony Logo' },
  team: [{ filename: 'hero-1.png', alt: 'Monica Batir - Terapeut' }],
  gallery: [
    { filename: 'hero-1.png', alt: 'Cabinet de terapie' },
    { filename: 'hero-2.png', alt: 'Sala de tratament' },
    { filename: 'service-bowen.png', alt: 'Ședință de terapie' },
  ],
  // Therapy images - mapped by service title
  therapies: [
    { filename: 'terapii/terapie-bowen.png', alt: 'Terapia Bowen', serviceTitle: 'Terapia Bowen' },
    { filename: 'terapii/terapie-access-bars.png', alt: 'Terapia Access Bars', serviceTitle: 'Terapia Access Bars' },
    { filename: 'terapii/terapie-facelift.png', alt: 'Facelift Energetic', serviceTitle: 'Facelift Energetic' },
    { filename: 'terapii/terapie-reiki.png', alt: 'Terapia Reiki', serviceTitle: 'Terapia Reiki' },
    { filename: 'terapii/terapie-bioenergetica.png', alt: 'Corecția Bioenergetică', serviceTitle: 'Corecția Bioenergetică' },
    { filename: 'terapii/terapie-eliberare.png', alt: 'Eliberarea Tensiunii Interioare', serviceTitle: 'Eliberarea Tensiunii Interioare' },
    { filename: 'terapii/terapie-lumina.png', alt: 'Terapia cu Lumină', serviceTitle: 'Terapia cu Lumină' },
    { filename: 'terapii/terapie-ceragem.png', alt: 'Termo Masaj Ceragem', serviceTitle: 'Termo Masaj Ceragem' },
  ],
}
