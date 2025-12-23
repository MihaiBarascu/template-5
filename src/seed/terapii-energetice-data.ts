/**
 * TERAPII ENERGETICE DATA
 * Date extrase de pe https://www.terapiienergetice.ro/
 * Business: Revital Harmony - Centru de Terapii Energetice
 * Design inspirat de: https://www.plasturifototerapeutici.ro/
 */

import {
  createHeading,
  createParagraph,
  createParagraphWithLink,
  createList,
  createBanner,
  createRichTextRoot,
} from './helpers'

// =============================================================================
// BUSINESS INFO (Date reale de pe site)
// =============================================================================

export const terapiiEnergeticeData = {
  business: {
    name: 'Revital Harmony',
    tagline: 'Centru de Terapii Energetice',
    description:
      'Revital Harmony este un centru de terapii energetice în București, creat pentru a oferi soluții practice de regăsire a echilibrului interior - fizic, mental, emoțional și spiritual.',
    phone: '0774 512 905',
    email: 'office@terapiienergetice.ro',
    emailSecondary: 'monabatir12@gmail.com',
    whatsapp: '+40774512905',
    address: {
      street: 'Bulevardul Decebal Nr. 9',
      sector: 'Sector 3',
      city: 'București',
      country: 'România',
    },
    // Program de lucru - de completat de client
    workingHours: [
      { days: 'Cu programare', hours: 'Contactați-ne' },
    ],
    // Social media - linkuri generice (de actualizat de client)
    social: {
      facebook: 'https://www.facebook.com',
      instagram: 'https://www.instagram.com',
      youtube: 'https://www.youtube.com',
    },
    // Stats - ELIMINATE (nu sunt pe site-ul original)
    // Pot fi adăugate din admin dacă clientul dorește
    stats: [],
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
      // price: eliminat - nu e afișat pe site-ul original
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
      // Rich text description
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get description(): any {
        return createRichTextRoot([
          // Introducere
          createHeading('Ce este Terapia Bowen?', 'h2'),
          createParagraph(
            'Terapia Bowen, denumită după creatorul său Tom Bowen, este o formă de terapie manuală non-invazivă originară din Geelong, Australia. Această metodă holistică utilizează mișcări blânde și precise pe mușchi, tendoane, ligamente și fascie pentru a stimula capacitatea naturală de vindecare a corpului.',
          ),
          createParagraph(
            'Spre deosebire de alte terapii manuale, Bowen nu implică manipulări forțate sau presiune intensă. Mișcările sunt delicate, dar profund eficiente, adresându-se corpului la nivel fizic, emoțional și energetic.',
          ),

          // Cum funcționează
          createHeading('Cum Funcționează Terapia Bowen?', 'h2'),
          createParagraph(
            'Terapia operează prin mai multe mecanisme complementare care lucrează sinergic pentru a restabili echilibrul corpului:',
          ),
          createList([
            'Reflexul de stretching - țintește celulele Golgi din mușchi și tendoane pentru a modifica răspunsul corpului la durere și spasm',
            'Activarea proprioceptorilor articulari - influențează funcția articulațiilor și ligamentelor fără manipulare forțată',
            'Impactul asupra fasciei - afectează țesutul conjunctiv pentru a îmbunătăți postura și mobilitatea',
            'Reechilibrarea sistemului nervos - tranziție de la starea de stres (simpatic) la relaxare (parasimpatic)',
            'Alinierea cu meridianele energetice - corespunde punctelor de acupunctură pentru echilibrul organelor interne',
            'Recuperarea memoriei celulare - ajută la restaurarea stării naturale de sănătate a corpului',
            'Detoxifiere - susține regenerarea sistemului limfatic și imunitar',
          ]),
          createBanner(
            'Terapia Bowen este unică prin faptul că include pauze de 2-3 minute între seturile de mișcări, permițând corpului să proceseze și să răspundă la stimuli.',
            'info',
          ),

          // Beneficii
          createHeading('Beneficiile Terapiei Bowen', 'h2'),
          createParagraph(
            'Terapia Bowen oferă o gamă largă de beneficii terapeutice, fiind eficientă pentru diverse condiții:',
          ),
          createList([
            'Ameliorarea durerii musculare și articulare',
            'Reducerea tensiunii și îmbunătățirea circulației limfatice',
            'Diminuarea stresului și anxietății',
            'Suport pentru echilibrul hormonal',
            'Accelerarea vindecării post-traumă sau post-operatorie',
            'Îmbunătățirea funcției respiratorii și imunitare',
            'Gestionarea condițiilor neurologice și a alergiilor',
            'Tratament eficient pentru dureri de spate, sciatică și migrene',
          ]),

          // Pentru cine este
          createHeading('Cine Poate Beneficia?', 'h2'),
          createParagraph(
            'Terapia Bowen este accesibilă tuturor, indiferent de vârstă sau starea de sănătate. Este potrivită pentru:',
          ),
          createList([
            'Sugari și copii cu diverse afecțiuni',
            'Adulți cu dureri cronice sau acute',
            'Sportivi pentru recuperare și performanță',
            'Vârstnici pentru mobilitate și confort',
            'Persoane cu condiții cronice diverse',
            'Gravide (cu precauții specifice)',
          ]),

          // Desfășurarea ședinței
          createHeading('Cum se Desfășoară o Ședință?', 'h3'),
          createParagraph(
            'O ședință de Terapia Bowen durează între 30 și 60 de minute, personalizată în funcție de nevoile pacientului. Mișcările blânde și precise sunt aplicate direct pe piele sau peste haine subțiri, într-un mediu confortabil și igienic.',
          ),
          createParagraph(
            'Între seturile de mișcări se acordă pauze de 2-3 minute, timp în care terapeutul părăsește camera, permițând corpului să integreze informațiile primite și să inițieze procesul de autovindecare.',
          ),
          createBanner(
            'Programează-te pentru o ședință de Terapia Bowen și descoperă cum această metodă blândă poate aduce schimbări profunde în starea ta de sănătate.',
            'success',
          ),
        ])
      },
    },
    {
      title: 'Terapia Access Bars',
      shortDescription:
        'Access Bars este o metodă inovatoare de vindecare și eliberare energetică care utilizează atingerea cuantică a 32 de puncte specifice dispuse pe cap. Stimulează fluxul de energie prin sistemul nervos, eliberând tensiunea acumulată și blocajele.',
      icon: 'Brain',
      // price: eliminat - nu e afișat pe site-ul original
      duration: '60-90 min',
      featured: true,
      order: 2,
      features: [
        '32 de puncte energetice pe cap activate',
        'Eliberarea blocajelor mentale și emoționale',
        'Reducerea stresului și anxietății',
        'Îmbunătățirea clarității mentale și memoriei',
        'Suport pentru depresie și atacuri de panică',
        'Recunoscută internațional prin Access Consciousness',
      ],
      // Rich text description
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get description(): any {
        return createRichTextRoot([
          // Introducere
          createHeading('Ce este Terapia Access Bars?', 'h2'),
          createParagraph(
            'Terapia Access Bars este o metodă inovatoare de vindecare și eliberare energetică care țintește 32 de puncte specifice dispuse pe cap. Aceste puncte, numite "bare", sunt asociate cu diferite aspecte ale vieții, incluzând vindecarea, creativitatea, conștiința și multe altele.',
          ),
          createParagraph(
            'Dezvoltată ca parte a sistemului Access Consciousness, această terapie ajută la experimentarea unei stări profunde de relaxare și eliberare.',
          ),

          // Cum funcționează
          createHeading('Cum Funcționează Access Bars?', 'h2'),
          createParagraph(
            'Terapeutul aplică o presiune blândă pe canalele energetice numite "bare" de pe cap. Acest proces eliberează tensiunea acumulată și blocajele energetice din sistemul nervos, permițându-i să se relaxeze și să funcționeze mai eficient.',
          ),
          createParagraph(
            'Efectul poate fi comparat cu defragmentarea unui hard disk supraîncărcat - mintea devine mai clară, mai organizată și mai capabilă să proceseze informațiile.',
          ),
          createBanner(
            'În timpul tratamentului, undele cerebrale încetinesc, facilitând eliberarea tiparelor mentale limitative și a credințelor depășite.',
            'info',
          ),

          // Cele 32 de puncte
          createHeading('Cele 32 de Puncte Energetice', 'h3'),
          createParagraph(
            'Fiecare dintre cele 32 de puncte corespunde unor aspecte specifice ale experienței umane:',
          ),
          createList([
            'Vindecarea - capacitatea corpului de a se regenera',
            'Bucuria și tristețea - echilibrul emoțional',
            'Conștiința - nivelul de prezență și awareness',
            'Creativitatea - fluxul ideilor și inspirației',
            'Banii - relația cu abundența și prosperitatea',
            'Controlul - eliberarea nevoii de a controla',
            'Comunicarea - expresia autentică',
            'Timpul și spațiul - percepția realității',
          ]),

          // Beneficii
          createHeading('Beneficiile Terapiei Access Bars', 'h2'),
          createParagraph(
            'Access Bars oferă multiple beneficii pentru sănătatea mentală, emoțională și fizică:',
          ),
          createList([
            'Reducerea profundă a stresului, anxietății și oboselii',
            'Ameliorarea confuziei, atacurilor de panică și traumelor',
            'Îmbunătățirea clarității mentale, memoriei și concentrării',
            'Echilibrarea energetică și vitalitate fizică crescută',
            'Armonizarea chakrelor pentru relații interpersonale mai bune',
            'Eliberarea credințelor limitative și a tiparelor negative',
            'Somn mai profund și odihnitor',
            'Stare generală de bine și pace interioară',
          ]),

          // Experiența ședinței
          createHeading('Ce se Întâmplă în Timpul unei Ședințe?', 'h2'),
          createParagraph(
            'În timpul ședinței de Access Bars, vei sta întins confortabil în timp ce terapeutul atinge ușor punctele de pe capul tău. Mulți clienți descriu experiența ca fiind profund relaxantă, unii adormindu-se chiar în timpul sesiunii.',
          ),
          createParagraph(
            'Procesul de relaxare profundă crește conștientizarea în viața personală și profesională, ajutându-te să vezi noi posibilități și să faci alegeri mai înțelepte.',
          ),

          // Pentru cine este
          createHeading('Cine Poate Beneficia?', 'h2'),
          createParagraph(
            'Access Bars este potrivită pentru oricine dorește să experimenteze o stare profundă de relaxare și eliberare energetică. Este deosebit de benefică pentru:',
          ),
          createList([
            'Persoane care se confruntă cu stres cronic sau anxietate',
            'Cei care doresc să îmbunătățească sănătatea mentală și fizică',
            'Oameni care caută claritate și concentrare sporită',
            'Persoane în căutare de dezvoltare personală și spirituală',
            'Cei care doresc să elibereze traume sau blocaje vechi',
          ]),
          createBanner(
            'Cel mai rău lucru care se poate întâmpla după o ședință de Access Bars este că te vei simți ca după un masaj de relaxare extraordinar. Cel mai bun? Întreaga ta viață se poate schimba!',
            'success',
          ),
        ])
      },
    },
    {
      title: 'Facelift Energetic',
      shortDescription:
        'Access Facelift este o metodă de întinerire care inversează semnele îmbătrânirii prin mișcări delicate ce activează resursele celulare. Parte din sistemul Access Consciousness, restaurează corpul la forma sa originală.',
      icon: 'Sparkles',
      // price: eliminat - nu e afișat pe site-ul original
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
      // Rich text description
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get description(): any {
        return createRichTextRoot([
          // Introducere
          createHeading('Ce este Facelift-ul Energetic?', 'h2'),
          createParagraph(
            'Access Facelift este o metodă revoluționară de întinerire facială și corporală care inversează semnele îmbătrânirii fără intervenții chirurgicale, injecții sau tratamente costisitoare. Parte din sistemul Access Consciousness, această tehnică a fost creată de Gary Douglas acum 20 de ani și este practicată de peste 1.800 de facilitatori la nivel mondial.',
          ),
          createParagraph(
            'Prin mișcări delicate și atingeri precise, Facelift-ul Energetic activează resursele celulare ale corpului, stimulând memoria celulară să elibereze limitările acumulate și să restaureze aspectul natural și tineresc.',
          ),

          // Cum funcționează
          createHeading('Cum Funcționează Facelift-ul Energetic?', 'h2'),
          createParagraph(
            'Terapia utilizează 30 de energii diferite pentru a stimula sistemele musculare și a accelera vindecarea naturală. Prin angajarea energiilor din față și corp, se obține:',
          ),
          createList([
            'Fermitatea pielii și contracararea efectelor gravitației',
            'Stimularea memoriei celulare pentru eliberarea limitărilor',
            'Activarea proceselor naturale de regenerare',
            'Relaxare profundă care permite corpului să se vindece',
          ]),
          createBanner(
            'Cercetările de la Touch Research Institute din Miami demonstrează că atingerea reduce hormonii de stres, scade ritmul cardiac și îmbunătățește digestia.',
            'info',
          ),

          // Beneficii
          createHeading('Beneficiile Facelift-ului Energetic', 'h2'),
          createParagraph(
            'Facelift-ul Energetic oferă o gamă impresionantă de beneficii vizibile și senzoriale:',
          ),
          createList([
            'Luminozitate facială și claritate a ochilor',
            'Strălucire și vitalitate a părului',
            'Efecte de lifting pentru sâni și fese',
            'Energie și entuziasm crescut în viața de zi cu zi',
            'Relaxare profundă și reducerea stresului',
            'Stimă de sine îmbunătățită și încredere sporită',
            'Reducerea țesutului adipos',
            'Stabilitate dentară îmbunătățită',
            'Suport pentru recuperarea post-operatorie și post-AVC',
          ]),

          // Experiența ședinței
          createHeading('Cum se Desfășoară o Ședință?', 'h2'),
          createParagraph(
            'O ședință de Facelift Energetic durează între 60 și 90 de minute. În timpul sesiunii, vei sta întins confortabil în timp ce terapeutul aplică atingeri delicate pe față, gât și corp.',
          ),
          createParagraph(
            'Nu există un număr fix de ședințe recomandate - fiecare client alege frecvența în funcție de obiectivele personale de relaxare și estetice. Mulți observă îmbunătățiri vizibile chiar după prima sesiune.',
          ),

          // Pentru cine este
          createHeading('Cine Poate Beneficia?', 'h2'),
          createParagraph(
            'Facelift-ul Energetic este potrivit pentru oricine caută îmbunătățiri fizice non-invazive și revitalizare. Este o alternativă excelentă la:',
          ),
          createList([
            'Chirurgia estetică și procedurile invazive',
            'Injecțiile cu botox sau acid hialuronic',
            'Tratamentele cosmetice costisitoare',
            'Creme și seruri anti-îmbătrânire',
          ]),

          // Rezultate
          createHeading('Ce Rezultate Poți Aștepta?', 'h3'),
          createParagraph(
            'Clienții raportează frecvent că arată mai tineri, se simt mai energici și au o atitudine mai pozitivă față de viață. Efectele pot include o piele mai fermă și luminoasă, riduri mai puțin vizibile și o stare generală de bine.',
          ),
          createBanner(
            'Facelift-ul Energetic nu este doar despre aspect - este despre a te simți bine în pielea ta și a radia din interior spre exterior. Programează-te pentru o ședință și descoperă transformarea!',
            'success',
          ),
        ])
      },
    },
    {
      title: 'Terapia Reiki',
      shortDescription:
        'Reiki este o tehnică de vindecare spirituală care utilizează fluxul de energie universală pentru a promova echilibrul și vindecarea în corp și minte. Practicianul canalizează această energie prin mâini, direcționată de intenție și concentrare.',
      icon: 'Sun',
      // price: eliminat - nu e afișat pe site-ul original
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
      // Rich text description
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get description(): any {
        return createRichTextRoot([
          // Introducere
          createHeading('Ce este Terapia Reiki?', 'h2'),
          createParagraph(
            'Reiki este o tehnică de vindecare spirituală care utilizează fluxul de energie universală pentru a promova echilibrul și vindecarea în corp și minte. Termenul "Reiki" provine din japoneză: "Rei" (universal) și "Ki" (energie vitală).',
          ),
          createParagraph(
            'În timpul unei sesiuni Reiki, energia curge prin mâinile terapeutului, ghidată de intenție și concentrare, pentru a ajunge exact acolo unde este nevoie în corpul pacientului. Această energie nu este a terapeutului - el este doar un canal pentru energia universală.',
          ),

          // Rolul chakrelor
          createHeading('Rolul Chakrelor în Reiki', 'h2'),
          createParagraph(
            'Practica Reiki implică lucrul cu cele șapte centre energetice principale ale corpului, numite chakre. Fiecare chakră corespunde unor aspecte specifice ale sănătății fizice, emoționale și spirituale:',
          ),
          createList([
            'Chakra Rădăcină (Muladhara) - zona sacrală, culoare roșie - stabilitate și siguranță',
            'Chakra Sexuală (Svadhisthana) - sub buric, culoare portocalie - creativitate și emoții',
            'Chakra Plexului Solar (Manipura) - zona stomacului, culoare galbenă - putere personală',
            'Chakra Inimii (Anahata) - zona inimii, culoare verde și roz - iubire și compasiune',
            'Chakra Gâtului (Vishuddha) - zona tiroidei, culoare albastră - comunicare și expresie',
            'Chakra Celui de-al Treilea Ochi (Ajna) - centrul frunții, culoare violet - intuiție',
            'Chakra Coroanei (Sahasrara) - vârful capului, culoare alb-argintie - conexiune spirituală',
          ]),
          createBanner(
            'Chakrele blocate sau care nu funcționează corespunzător pot cauza dezechilibre fizice și emoționale. Reiki ajută la deblocarea și armonizarea acestor centre energetice.',
            'info',
          ),

          // Cum funcționează
          createHeading('Cum Funcționează Reiki?', 'h2'),
          createParagraph(
            'Terapeutul direcționează energia universală către chakrele blocate sau slăbite pentru a restabili fluxul energetic corect și a revitaliza aspectele corespunzătoare ale sănătății. Procesul este blând, non-invaziv și profund relaxant.',
          ),
          createParagraph(
            'Energia Reiki "știe" unde trebuie să meargă - inteligența universală o ghidează către zonele care au cea mai mare nevoie de vindecare și echilibrare.',
          ),

          // Beneficii
          createHeading('Beneficiile Terapiei Reiki', 'h2'),
          createList([
            'Eliberarea tensiunii emoționale și fizice acumulate',
            'Restabilirea echilibrului energetic și fizic',
            'Susținerea proceselor naturale de vindecare ale corpului',
            'Promovarea stării generale de bine și pace interioară',
            'Reducerea stresului, anxietății și depresiei',
            'Îmbunătățirea calității somnului',
            'Sprijin pentru recuperarea după boli sau operații',
            'Claritate mentală și echilibru emoțional',
          ]),

          // Pentru cine este
          createHeading('Cine Poate Beneficia?', 'h2'),
          createParagraph(
            'Reiki este potrivit pentru oricine caută îmbunătățirea sănătății, echilibru energetic interior și suport pentru vindecarea spirituală. Nu există contraindicații - terapia este sigură pentru persoane de toate vârstele, inclusiv copii, gravide și vârstnici.',
          ),

          // Notă importantă
          createHeading('Notă Importantă', 'h3'),
          createBanner(
            'Reiki completează - nu înlocuiește - tratamentul medical convențional. Este o terapie complementară care lucrează alături de medicina tradițională pentru a susține procesul de vindecare.',
            'warning',
          ),

          // Închidere
          createParagraph(
            'Dacă simți că viața ta are nevoie de mai mult echilibru și armonie, Reiki poate fi calea către o stare de bine profundă și durabilă.',
          ),
          createBanner(
            'Programează-te pentru o ședință de Reiki și experimentează puterea vindecătoare a energiei universale.',
            'success',
          ),
        ])
      },
    },
    {
      title: 'Corecția Bioenergetică',
      shortDescription:
        'Corecția Bioenergetică este o metodă terapeutică ce vizează normalizarea bioenergeticii corpului uman printr-o abordare integrativă a stării fizice, spirituale și psihice. Include masaj clasic, masaj punctiform, masaj terapeutic non-contact și metode de stretching.',
      icon: 'Zap',
      // price: eliminat - nu e afișat pe site-ul original
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
      // Rich text description
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get description(): any {
        return createRichTextRoot([
          // Introducere
          createHeading('Ce este Corecția Bioenergetică?', 'h2'),
          createParagraph(
            'Corecția Bioenergetică este o metodă terapeutică ce vizează normalizarea bioenergeticii corpului uman printr-o abordare integrativă a stării fizice, spirituale și psihice. Această terapie holistică tratează pacientul ca un întreg, nu doar simptomele izolate.',
          ),
          createParagraph(
            'Metoda combină mai multe tehnici terapeutice pentru a restabili echilibrul energetic natural al corpului și pentru a facilita procesele de autovindecare.',
          ),

          // Cum funcționează
          createHeading('Cum Funcționează Corecția Bioenergetică?', 'h2'),
          createParagraph(
            'Terapia implică mai multe etape și tehnici:',
          ),
          createList([
            'Evaluarea detaliată a pacientului și analiza psihologică',
            'Dezvoltarea unei strategii de intervenție personalizate',
            'Masaj clasic pentru relaxarea mușchilor',
            'Masaj punctiform pentru deblocarea punctelor energetice',
            'Masaj terapeutic non-contact pentru lucrul cu câmpul energetic',
            'Metode de stretching pentru flexibilitate și eliberare',
            'Schimbarea conștiinței prin comunicare și întrebări stimulative',
          ]),
          createBanner(
            'Ședința se desfășoară într-un mediu confortabil, pacientul stând întins pe patul de masaj cu ochii închiși, permițând o relaxare profundă.',
            'info',
          ),

          // Detalii ședință
          createHeading('Detalii despre Ședință', 'h3'),
          createParagraph(
            'O ședință de Corecție Bioenergetică durează între 30 și 60 de minute. Pentru rezultate optime, se recomandă ședințe zilnice timp de 7-10 zile, urmate de o pauză de 2-3 luni.',
          ),

          // Condiții tratate
          createHeading('Pentru Ce Condiții Este Recomandată?', 'h2'),
          createParagraph(
            'Corecția Bioenergetică este eficientă pentru o gamă largă de condiții fizice și psihice:',
          ),
          createList([
            'Stres cronic și atacuri de panică',
            'Depresie și tulburări de dispoziție',
            'Insomnie și tulburări de somn',
            'Oboseală cronică și epuizare',
            'Traume din copilărie și blocaje emoționale',
            'Infertilitate cauzată de stres',
            'Afecțiuni ale organelor interne',
            'Probleme ale sistemului osos și muscular',
            'Boli cronice diverse',
          ]),

          // Beneficii
          createHeading('Beneficii', 'h2'),
          createParagraph(
            'Terapia contribuie la:',
          ),
          createList([
            'Armonizarea energiilor pacientului',
            'Îmbunătățirea condiției fizice și psihice generale',
            'Reducerea tensiunii musculare',
            'Facilitarea proceselor naturale de vindecare și regenerare',
            'Echilibrarea stărilor emoționale',
            'Creșterea vitalității și energiei',
          ]),

          // Contraindicații
          createHeading('Contraindicații', 'h3'),
          createBanner(
            'Terapia nu este recomandată în următoarele situații: afecțiuni maligne ale sângelui, hemofilie, tumori active, gangrenă, tuberculoză activă, boli psihice severe, afecțiuni acute ale organelor, anevrisme cardiace, osteomielită acută.',
            'warning',
          ),

          // Închidere
          createParagraph(
            'Înainte de a începe terapia, este important să discutați cu terapeutul despre starea dumneavoastră de sănătate pentru a vă asigura că această metodă este potrivită pentru nevoile dumneavoastră.',
          ),
          createBanner(
            'Programează-te pentru o evaluare și descoperă cum Corecția Bioenergetică te poate ajuta să îți recâștigi echilibrul și vitalitatea.',
            'success',
          ),
        ])
      },
    },
    {
      title: 'Eliberarea Tensiunii Interioare',
      shortDescription:
        'Terapie specializată pentru eliberarea tensiunii și stresului acumulat. Contribuie la armonizarea energiilor, îmbunătățirea condiției fizice și psihologice, reducerea tensiunii musculare și facilitarea proceselor naturale de vindecare.',
      icon: 'Wind',
      // price: eliminat - nu e afișat pe site-ul original
      duration: '30-60 min',
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
      // Rich text description - eslint-disable needed for complex object structure
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get description(): any {
        return createRichTextRoot([
          // Introducere
          createHeading('Ce este Terapia de Eliberare a Tensiunii Interioare?', 'h2'),
          createParagraph(
            'Terapia de Eliberare a Tensiunii Interioare (TRE - Trauma Releasing Exercises) este o metodă terapeutică dezvoltată de Dr. David Berceli, bazată pe înțelegerea profundă a conexiunii dintre corp și psihic. Această tehnică revoluționară activează mecanismul natural al corpului de eliberare a stresului și tensiunii acumulate în mușchi.',
          ),
          createParagraph(
            'Metoda se bazează pe faptul că corpul nostru păstrează amintirea tuturor experiențelor traumatice și stresante, manifestându-se prin tensiune musculară cronică, dureri și disconfort. Prin exerciții specifice și tehnici de relaxare, corpul este ghidat să elibereze aceste tensiuni într-un mod sigur și controlat.',
          ),

          // Rolul unității dintre suflet și corp
          createHeading('Rolul Unității dintre Suflet și Corp', 'h2'),
          createParagraph(
            'Suntem ființe complexe în care corpul fizic, mintea și spiritul funcționează ca un întreg. Când sufletul nostru trece prin experiențe dificile - fie că este vorba de stres cronic, traumă sau emoții reprimate - corpul reacționează prin contractarea mușchilor și crearea unor tipare de tensiune.',
          ),
          createParagraph(
            'Această tensiune acumulată afectează nu doar starea fizică, ci și cea emoțională și mentală. De aceea, eliberarea tensiunii din corp are efecte profunde asupra întregii noastre ființe, aducând claritate mentală, echilibru emoțional și o stare generală de bine.',
          ),

          // Cum funcționează
          createHeading('Cum Funcționează Terapia?', 'h2'),
          createParagraph(
            'În timpul ședinței de terapie, clientul este ghidat printr-o serie de exerciții ușoare care activează un tremur muscular natural. Acest tremur, cunoscut și sub numele de "tremurul neurogen", este răspunsul natural al corpului pentru eliberarea tensiunii acumulate.',
          ),
          createParagraph(
            'Procesul se desfășoară într-un mediu sigur și relaxant, pe un pat de masaj, acompaniat de muzică de relaxare. Terapeutul ghidează întregul proces, asigurându-se că experiența este confortabilă și eficientă.',
          ),
          createBanner(
            'Tremurul neurogen este complet natural și sigur - este același mecanism pe care corpul îl folosește după un șoc sau o experiență stresantă pentru a reveni la echilibru.',
            'info',
          ),

          // Procesul terapeutic
          createHeading('Procesul Terapeutic', 'h3'),
          createList([
            'Ședința durează între 30 și 60 de minute',
            'Se desfășoară pe un pat de masaj confortabil',
            'Muzica de relaxare creează o atmosferă liniștitoare',
            'Terapeutul vă ghidează prin exerciții simple',
            'Corpul intră în mod natural în starea de eliberare',
            'Nu este necesară discutarea experiențelor traumatice',
          ]),

          // Durata și frecvența
          createHeading('Durata și Frecvența Recomandată', 'h2'),
          createParagraph(
            'Pentru rezultate optime, se recomandă un ciclu de 7-10 ședințe consecutive sau distribuite pe parcursul a 2-3 săptămâni. După acest ciclu inițial, se poate face o pauză de 2-3 luni, urmată de ședințe de întreținere după necesitate.',
          ),
          createParagraph(
            'Frecvența și numărul de ședințe pot varia în funcție de nevoile individuale ale fiecărui client și de severitatea tensiunii acumulate. Terapeutul va recomanda un plan personalizat după evaluarea inițială.',
          ),

          // Beneficii
          createHeading('Beneficiile Terapiei', 'h2'),
          createParagraph(
            'Terapia de Eliberare a Tensiunii Interioare oferă o gamă largă de beneficii pentru corp și minte:',
          ),
          createList([
            'Reducerea semnificativă a stresului și anxietății',
            'Îmbunătățirea calității somnului',
            'Ameliorarea simptomelor depresiei',
            'Reducerea tensiunii musculare cronice',
            'Îmbunătățirea flexibilității și mobilității',
            'Creșterea nivelului de energie',
            'Echilibrarea sistemului nervos',
            'Îmbunătățirea concentrării și clarității mentale',
            'Reducerea durerilor cronice',
            'Stare generală de calm și relaxare',
          ]),

          // Cine poate beneficia
          createHeading('Cine Poate Beneficia?', 'h2'),
          createParagraph(
            'Această terapie este potrivită pentru persoane de toate vârstele care se confruntă cu:',
          ),
          createList([
            'Stres cronic sau anxietate',
            'Tensiune musculară și dureri de spate',
            'Tulburări de somn sau insomnie',
            'Depresie sau stări depresive',
            'Oboseală cronică sau epuizare',
            'Atacuri de panică',
            'Traume emoționale sau fizice',
            'Sindrom post-traumatic (PTSD)',
            'Dureri cronice de cap sau migrene',
          ]),

          // Contraindicații
          createHeading('Contraindicații', 'h3'),
          createBanner(
            'Terapia nu este recomandată în următoarele situații: febră sau infecții acute, răni deschise, afecțiuni maligne active, boli psihiatrice severe necontrolate, sarcină (trimestrul I), intervenții chirurgicale recente.',
            'warning',
          ),

          // Închidere
          createParagraph(
            'Înainte de a începe terapia, este recomandat să discutați cu terapeutul despre starea dumneavoastră de sănătate pentru a vă asigura că această metodă este potrivită pentru dumneavoastră.',
          ),
          createBanner(
            'Programează-te pentru o ședință și descoperă beneficiile eliberării tensiunii interioare. Corpul tău are capacitatea naturală de a se vindeca - noi doar îl ajutăm să o facă.',
            'success',
          ),
        ])
      },
    },
    {
      title: 'Terapia cu Lumină',
      shortDescription:
        'Plasturi Fototerapeutici pentru Stimularea Celulelor Stem. O metodă inovatoare bazată pe nanotehnologie care folosește lumina corpului pentru a activa procesele naturale de vindecare și regenerare celulară.',
      icon: 'Lightbulb',
      // price: eliminat - nu e afișat pe site-ul original
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
      // Rich text description
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get description(): any {
        return createRichTextRoot([
          // Introducere
          createHeading('Ce este Terapia cu Lumină?', 'h2'),
          createParagraph(
            'Terapia cu Lumină utilizează plasturi fototerapeutici - dispozitive mici și discrete care emit lumină în spectrul infraroșu și vizibil. Această metodă inovatoare bazată pe nanotehnologie folosește lumina corpului pentru a activa procesele naturale de vindecare și regenerare celulară.',
          ),
          createParagraph(
            'Plasturii sunt aplicați pe piele, stimulând punctele de acupunctură strategice pentru a declanșa procesele naturale de vindecare și regenerare ale corpului.',
          ),

          // Cum funcționează
          createHeading('Cum Funcționează?', 'h2'),
          createParagraph(
            'Plasturii fototerapeutici emit lumină care penetrează pielea și stimulează puncte strategice de acupunctură. Această activare declanșează procese naturale de vindecare și regenerare la nivel celular.',
          ),
          createParagraph(
            'Un aspect cheie al terapiei este stimularea producției de celule stem proprii. Celulele stem joacă un rol crucial în regenerarea țesuturilor și menținerea sănătății optime, fiind esențiale pentru procesele de reparare ale corpului.',
          ),
          createBanner(
            'Tehnologia este non-invazivă, fără efecte secundare și poate fi combinată cu alte tratamente pentru rezultate îmbunătățite.',
            'info',
          ),

          // Beneficii
          createHeading('Beneficiile Terapiei cu Lumină', 'h2'),
          createList([
            'Stimularea celulelor stem proprii pentru regenerare tisulară',
            'Reducerea durerii acute și cronice prin activarea vindecării naturale',
            'Creșterea energiei și vitalității fără stimulanți',
            'Îmbunătățirea calității somnului pentru o odihnă mai profundă',
            'Accelerarea vindecării rănilor și recuperării țesutului cicatricial',
            'Detoxifiere și regenerare celulară la nivel profund',
            'Reducerea inflamației cronice',
            'Suport pentru sistemul imunitar',
          ]),

          // Tehnologie
          createHeading('Tehnologie Avansată LifeWave', 'h3'),
          createParagraph(
            'Plasturii folosesc tehnologia brevetată LifeWave, care a fost testată clinic și este folosită de milioane de oameni la nivel mondial. Această tehnologie nu introduce substanțe în corp - funcționează exclusiv prin stimularea punctelor energetice ale corpului.',
          ),

          // Rezultate
          createHeading('Ce Rezultate Poți Aștepta?', 'h2'),
          createParagraph(
            'Mulți pacienți raportează ameliorări semnificative după doar câteva sesiuni. Efectele pot include:',
          ),
          createList([
            'Reducerea vizibilă a durerii în primele zile',
            'Somn mai profund și odihnitor',
            'Energie crescută pe parcursul zilei',
            'Îmbunătățirea stării generale de bine',
            'Recuperare mai rapidă după efort fizic',
          ]),

          // Pentru cine este
          createHeading('Cine Poate Beneficia?', 'h2'),
          createParagraph(
            'Terapia cu Lumină este potrivită pentru persoane de toate vârstele care caută o metodă naturală și non-invazivă de îmbunătățire a sănătății. Este deosebit de benefică pentru:',
          ),
          createList([
            'Persoane cu dureri cronice sau acute',
            'Sportivi care doresc recuperare accelerată',
            'Cei care caută îmbunătățirea calității somnului',
            'Persoane cu oboseală cronică sau energie scăzută',
            'Oricine dorește să susțină procesele naturale de regenerare',
          ]),
          createBanner(
            'Descoperă puterea vindecătoare a luminii! Programează-te pentru o consultație și află cum plasturii fototerapeutici te pot ajuta să îți recapeți vitalitatea.',
            'success',
          ),
        ])
      },
    },
    {
      title: 'Termo Masaj Ceragem',
      shortDescription:
        'Patul de masaj cu pietre de jad pentru relaxare profundă și detoxifiere. Combină căldura infraroșie cu masajul pentru beneficii terapeutice complete, stimulând circulația și reducând tensiunea musculară.',
      icon: 'Flame',
      // price: eliminat - nu e afișat pe site-ul original
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
      // Rich text description
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get description(): any {
        return createRichTextRoot([
          // Introducere
          createHeading('Ce este Termo Masajul Ceragem?', 'h2'),
          createParagraph(
            'Termo Masajul Ceragem reprezintă o terapie inovatoare care combină masajul tradițional cu beneficiile pietrelor de jad încălzite. Tratamentul folosește un pat de masaj specializat echipat cu role din piatră de jad care se încălzesc la temperaturi optime pentru efect terapeutic.',
          ),
          createParagraph(
            'Această metodă unică îmbină înțelepciunea terapiilor orientale tradiționale cu tehnologia modernă pentru a oferi o experiență de relaxare profundă și vindecare.',
          ),

          // Cum funcționează
          createHeading('Cum Funcționează?', 'h2'),
          createParagraph(
            'Rolele din piatră de jad se deplasează de-a lungul coloanei vertebrale, urmând curbura naturală a corpului. Căldura din pietre penetrează profund în mușchi și articulații, activând proprietățile de emisie infraroșie care ajung la straturile tisulare de sub suprafață.',
          ),
          createList([
            'Pietrele de jad emit raze infraroșii cu lungime de undă benefică',
            'Căldura penetrează până la 5-7 cm adâncime în țesuturi',
            'Masajul urmărește automat curbura coloanei vertebrale',
            'Temperatura este controlată și ajustabilă pentru confort optim',
          ]),
          createBanner(
            'Jadul este cunoscut din antichitate pentru proprietățile sale vindecătoare și capacitatea de a echilibra energiile corpului.',
            'info',
          ),

          // Beneficii
          createHeading('Beneficiile Termo Masajului', 'h2'),
          createParagraph(
            'Terapia oferă multiple beneficii pentru sănătatea fizică și starea de bine:',
          ),
          createList([
            'Ameliorarea durerii și reducerea tensiunii musculare',
            'Relaxare profundă a mușchilor contracturați',
            'Stimularea circulației sanguine și oxigenarea țesuturilor',
            'Detoxifierea prin activarea sistemului limfatic',
            'Reducerea stresului și anxietății',
            'Îmbunătățirea posturii și corectarea problemelor de coloană',
            'Somn mai profund și odihnitor',
            'Creșterea flexibilității și mobilității',
          ]),

          // Experiența sesiunii
          createHeading('Experiența unei Sesiuni', 'h3'),
          createParagraph(
            'O sesiune de Termo Masaj Ceragem durează aproximativ 45 de minute. Te vei întinde confortabil pe patul de masaj, iar tehnologia avansată va face restul - rolele de jad încălzite se vor deplasa de-a lungul coloanei tale, oferind un masaj precis și eficient.',
          ),
          createParagraph(
            'Mulți clienți descriu experiența ca fiind extrem de relaxantă, unii adormindu-se în timpul sesiunii. Efectele benefice sunt resimțite imediat după sesiune și continuă să se amplifice în zilele următoare.',
          ),

          // Rezultate
          createHeading('Ce Rezultate Poți Aștepta?', 'h2'),
          createParagraph(
            'Mulți dintre clienții noștri simt o ameliorare semnificativă imediat după primele sesiuni. Efectele includ:',
          ),
          createList([
            'Reducerea imediată a tensiunii din spate și gât',
            'Senzație de ușurare și relaxare profundă',
            'Flexibilitate îmbunătățită a coloanei vertebrale',
            'Energie crescută și vitalitate',
            'Somn mai bun în noaptea după sesiune',
          ]),

          // Pentru cine este
          createHeading('Cine Poate Beneficia?', 'h2'),
          createParagraph(
            'Termo Masajul Ceragem este potrivit pentru persoane de toate vârstele care caută relaxare și ameliorarea durerii. Este deosebit de benefic pentru:',
          ),
          createList([
            'Persoane cu dureri de spate sau probleme de coloană',
            'Cei care petrec mult timp stând sau la birou',
            'Sportivi pentru recuperare musculară',
            'Persoane cu stres cronic sau tensiune musculară',
            'Oricine caută o metodă naturală de relaxare',
          ]),
          createBanner(
            'Experimentează puterea vindecătoare a jadului încălzit! Programează-te pentru o sesiune de Termo Masaj Ceragem și descoperă relaxarea profundă.',
            'success',
          ),
        ])
      },
    },
  ],

  // =============================================================================
  // COURSES (Cursuri - prețuri și detalii reale)
  // =============================================================================

  courses: [
    {
      title: 'Curs Access Bars',
      shortDescription:
        'Curs de o zi pentru a deveni practician certificat Access Bars. Învață să aplici tehnica celor 32 de puncte energetice pe tine și pe alții, cu certificare internațională.',
      price: 1460,
      priceRepeat: 730,
      priceAdolescent: 730,
      priceChild: 0,
      duration: '1 zi',
      certification: 'Certificat Internațional Access Consciousness',
      featured: true,
      nextDates: ['20 Decembrie 2025 – București', '17 Ianuarie 2026 – București', '21 Februarie 2026 – București'],
      features: [
        'Tehnici practice pentru auto-aplicare și lucrul cu clienții',
        'Înțelegerea celor 32 de puncte energetice de pe cap',
        'Instrumente de lucru și informații valoroase',
        'Training pentru a facilita vindecarea pentru tine și alții',
        'Certificat Internațional Access Consciousness',
        'Acces la comunitatea globală Access Bars',
      ],
      // Rich text description - CONȚINUT REAL de pe site-ul original
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get description(): any {
        return createRichTextRoot([
          // Ce este Access Bars?
          createHeading('Ce este Access Bars?', 'h2'),
          createParagraph(
            'Access Bars este o ramură din Access Consciousness, o tehnică de medicină alternativă implementată în peste 173 de țări din întreaga lume. Denumirea "Access Bars" tradusă literal înseamnă "Accesarea Conștiinței", relevând esența acestui concept – transformarea vieții pe toate planurile printr-o stare continuă de prezență și introspecție.',
          ),
          createParagraph(
            'Studiile arată că suntem 90% subconștient și doar 10% conștient, un procent insuficient pentru a canaliza și distribui resursele la un nivel optim de funcționare. Conștiința este poarta care ne permite accesul în lumea din umbra a subconștientului nostru, unde, asemenea unui computer, înmagazinăm informații atât din moși-strămoși, cât și din întreg parcursul vieții.',
          ),

          // Descoperirea Access Bars
          createHeading('Descoperirea Access Bars', 'h2'),
          createParagraph(
            'Fondatorul Access Consciousness, Gary Douglas, a identificat cheia accesului către cele mai ascunse zone ale minții noastre: cele 32 de bare dispuse pe cap. Aceste puncte, atunci când sunt atinse, emit unde electromagnetice care eliberează blocajele, emoțiile negative și constrângerile de orice natură.',
          ),

          // Beneficiile Cursului
          createHeading('Beneficiile Cursului Access Bars', 'h2'),
          createParagraph(
            'Acest curs oferă o perspectivă nouă și posibilitatea de a descoperi secretele identității tale. Îți permite să-ți fructifici potențialul inestimabil, aplicând această tehnică într-un mod inedit și simplu cu propriile energii. Vei primi informații valoroase și instrumente de lucru pentru a facilita acest drum, atât pentru tine, cât și pentru cei cu care interacționezi.',
          ),

          // Cine poate practica
          createHeading('Cine poate practica Access Bars?', 'h2'),
          createParagraph(
            'Oricine dorește să treacă de la intenții la certitudini, de la idei simpliste la filozofii complexe. Acest curs este ideal pentru cei care vor să exploreze și să exploateze într-un mod constructiv și benefic toate sursele de energie care duc către o nouă interpretare a vieții.',
          ),

          // Cui îi poți împărtăși
          createHeading('Cui îi poți împărtăși această bucurie?', 'h2'),
          createParagraph(
            'Terapia Access Bars este benefică pentru cei care suferă de afecțiuni precum:',
          ),
          createList([
            'Depresie și dificultăți de exprimare',
            'Tulburări de somn și anxietate',
            'Frigiditate și impotență',
            'Autism și dificultăți în relații',
            'Probleme financiare și probleme de greutate',
            'Recuperare post-operatorie',
          ]),
          createParagraph(
            'Aceste probleme sunt adesea cauzate de lipsa echilibrului interior și a energiei vitale, pe care această tehnică le poate restabili.',
          ),

          // Ce este minunat
          createHeading('Ce este minunat la Access Bars?', 'h2'),
          createParagraph(
            'Practica Access Bars crește aportul de energie, depășind blocajele existente. Energia ta și a clientului interferează, permițând fluidizarea câmpului magnetic, astfel ambii beneficiind de acest proces de corp.',
          ),

          // Durata și cost
          createHeading('Durata și Costul Cursului', 'h2'),
          createParagraph(
            'Cursul Access Bars se desfășoară pe parcursul unei singure zile, fiind concentrat și eficient în transmiterea informațiilor la nivel vibrațional. Efectele rapide ale tehnicii sunt comparabile cu multe alte terapii de lungă durată.',
          ),
          createList([
            'Prima participare: 1.460 RON',
            'Reluare curs: 730 RON',
            'Adolescenți (16-18 ani): 730 RON',
            'Copii (sub 16 ani, însoțiți de adult): GRATUIT',
          ]),

          // Date următoare
          createHeading('Program Cursuri Access Bars', 'h2'),
          createList([
            '20 Decembrie 2025 – București',
            '17 Ianuarie 2026 – București',
            '21 Februarie 2026 – București',
          ]),

          // Înscriere
          createHeading('Cum te poți înscrie?', 'h2'),
          createParagraph(
            'Pentru înscrieri, trimite un mesaj la numărul de telefon 0774512905, un email la monabatir12@gmail.com, sau completează formularul de contact.',
          ),

          createBanner(
            'Te invităm să descoperi Access Bars și să pornești pe drumul către o viață transformată. Înscrie-te la curs și experimentează puterea acestei tehnici incredibile!',
            'success',
          ),
        ])
      },
    },
    {
      title: 'Curs Facelift Energetic',
      shortDescription:
        'Curs de 2 zile pentru a deveni practician certificat Access Facelift. Învață procesul revoluționar care încorporează 30 de energii pentru a inversa semnele îmbătrânirii, cu diplomă internațională.',
      price: 1875,
      priceRepeat: 935,
      duration: '2 zile',
      certification: 'Diplomă Internațională Practician Access Facelift',
      featured: true,
      nextDates: ['21 Decembrie 2025 – București', '18 Ianuarie 2026 – București', '22 Februarie 2026 – București'],
      features: [
        'Două ședințe în care primești tratamentul Facelift',
        'Două ședințe în care oferi tratamentul altui participant',
        'Manual Access Facelift cu poziții și tehnici',
        'Fișă de lucru și instrumente Access Consciousness',
        'Prezentare video de la Dr. Dain Heer',
        'Diplomă Internațională Practician Access Facelift',
      ],
      // Rich text description
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get description(): any {
        return createRichTextRoot([
          // Introducere
          createHeading('Ce este Facelift Energetic Access?', 'h2'),
          createParagraph(
            'Facelift Energetic Access este un proces revoluționar care încorporează 30 de energii pentru a debloca tensiunile din mușchii faciali și corporali. Terapia inversează semnele îmbătrânirii, promovează vindecarea celulară și elimină emoțiile negative - fără intervenție chirurgicală sau produse scumpe.',
          ),

          // Cum funcționează
          createHeading('Cum Funcționează?', 'h2'),
          createParagraph(
            'Practicianul folosește atingeri delicate pe față și gât pentru a facilita curgerea energiei și a elibera blocajele și tensiunile musculare. Acest lucru reactivează celulele pentru regenerare, pe măsură ce convingerile limitative sunt eliberate.',
          ),

          // Beneficii
          createHeading('Beneficii Cheie', 'h2'),
          createList([
            'Îmbunătățirea ridurilor și a liniilor fine',
            'Fermitate și elasticitate a pielii',
            'Strălucire îmbunătățită a părului',
            'Niveluri crescute de energie',
            'Efecte de lifting pentru sâni și fese',
            'Recuperare rapidă post-operatorie',
            'Prevenirea degradării celulare',
            'Hidratare îmbunătățită a pielii și vedere mai clară',
          ]),

          // Ce primești
          createHeading('Ce Primești la Curs?', 'h2'),
          createList([
            'Două ședințe în care primești tratamentul Facelift Energetic',
            'Două ședințe în care oferi tratamentul altui participant',
            'Manual Access Facelift cu poziții și tehnici',
            'Fișă de lucru și instrumente Access Consciousness',
            'Prezentare video de la Dr. Dain Heer (fondatorul Access Consciousness)',
            'Diplomă Internațională de Practician Access Facelift (recunoscută global)',
          ]),

          createBanner(
            'Cursul se desfășoară pe parcursul a două zile de training intensiv. La finalul cursului primești Diplomă Internațională Practician Access Facelift.',
            'info',
          ),

          // Opțiuni de preț
          createHeading('Opțiuni de Preț', 'h2'),
          createList([
            'Prima participare: 1.875 RON',
            'Reluare curs (pentru practicieni certificați): 935 RON',
          ]),

          // Date următoare
          createHeading('Date Următoare', 'h2'),
          createList([
            '21 Decembrie 2025 – București',
            '18 Ianuarie 2026 – București',
            '22 Februarie 2026 – București',
          ]),

          createBanner(
            'Locurile sunt limitate! Rezervă-ți locul acum pentru următorul curs Facelift Energetic.',
            'success',
          ),
        ])
      },
    },
  ],

  // =============================================================================
  // TESTIMONIALS (Testimoniale reale de pe site)
  // =============================================================================

  testimonials: [
    // ==================== FACELIFT ENERGETIC ====================
    {
      content:
        'Pentru mine cursul de Facelift a fost extrem de interesant, un curs în care am găsit răspunsuri la multe întrebări. Am observat schimbări vizibile la nivelul tenului și o stare de bine extraordinară.',
      name: 'Roxana V.',
      role: 'Asistentă Medicală / Profesoară, București',
      rating: '5',
      featured: true,
      serviceNames: 'Facelift Energetic',
    },
    {
      content:
        'Experiențe extraordinare în care am descoperit o altă abordare a vieții cu mai multă prezență, calm și conștiință interioară. Recomand cu căldură!',
      name: 'Aida Ciobanu',
      role: 'Terapeut Bowen, Bacău',
      rating: '5',
      featured: false,
      serviceNames: 'Facelift Energetic',
    },
    {
      content:
        'Am adormit în timpul fiecărei ședințe și m-am trezit foarte relaxată. Tenul a devenit mai luminos și starea interioară s-a schimbat complet.',
      name: 'Irina P.',
      role: 'Profesoară, București',
      rating: '5',
      featured: false,
      serviceNames: 'Facelift Energetic',
    },
    {
      content:
        'După câteva ședințe de Facelift energetic, am observat că ridurile fine de pe gât și decolteu s-au estompat vizibil, tenul a devenit mai plin de viață. Starea interioară s-a schimbat.',
      name: 'Raluca I.',
      role: 'Chimist, București',
      rating: '5',
      featured: false,
      serviceNames: 'Facelift Energetic',
    },
    {
      content:
        'Terapia Facelift m-a ajutat să am mai multă încredere în mine. Tenul meu s-a schimbat complet. Am devenit mult mai veselă, mai plină de viață.',
      name: 'Ioana P.',
      role: 'Consilier Juridic, București',
      rating: '5',
      featured: false,
      serviceNames: 'Facelift Energetic',
    },

    // ==================== TERAPIA REIKI ====================
    {
      content:
        'În timpul ședinței de Reiki m-am relaxat profund. Am simțit cum plutesc, iar apăsarea pe care o simțeam la început în piept, a dispărut complet. O experiență transformatoare.',
      name: 'Larisa M.',
      role: 'Consilier Juridic, București',
      rating: '5',
      featured: true,
      serviceNames: 'Terapia Reiki',
    },
    {
      content:
        'Terapia Reiki m-a ajutat într-un moment critic din viață. Monica m-a adus înapoi la viață când eram complet blocată. Sunt recunoscătoare pentru această experiență.',
      name: 'Ionela S.',
      role: 'Economist, București',
      rating: '5',
      featured: false,
      serviceNames: 'Terapia Reiki',
    },

    // ==================== ELIBERAREA TENSIUNII INTERIOARE ====================
    {
      content:
        'În urma ședinței de terapie de eliberare a tensiunii interioare, m-am simțit mult mai ușoară, eliberată de stress, foarte liniștită, conectată la corpul meu. Recomand din suflet!',
      name: 'Ioana V.',
      role: 'Economist',
      rating: '5',
      featured: true,
      serviceNames: 'Eliberarea Tensiunii Interioare',
    },
    {
      content:
        'După 5 ședințe de eliberare emoțională, nu am mai avut atacuri de panică, am reușit să adorm noaptea fără medicamente. Parcă sunt un alt om.',
      name: 'Sorina B.',
      role: 'Referent',
      rating: '5',
      featured: false,
      serviceNames: 'Eliberarea Tensiunii Interioare',
    },
    {
      content:
        'Înainte de terapie făcusem un atac de panică. Eram foarte obosit și irascibil. În timpul terapiei am simțit cum tot stresul se dizolvă. Am plecat un alt om.',
      name: 'Radu A.',
      role: 'Manager Vânzări',
      rating: '5',
      featured: false,
      serviceNames: 'Eliberarea Tensiunii Interioare',
    },

    // ==================== ACCESS BARS ====================
    {
      content:
        'Am înțeles că totul este despre vibrație și energie. Access Bars m-a ajutat să eliberez blocaje pe care le aveam de ani de zile. Transformarea a fost incredibilă.',
      name: 'Violeta G.',
      role: 'Terapeut Holistic, Franța',
      rating: '5',
      featured: true,
      serviceNames: 'Access Bars',
    },
    {
      content:
        'După cursul Access Bars, am completat 25 de zile de auto-terapie și am înțeles cât de important este să fii prezent și conștient în viață.',
      name: 'Andreea',
      role: 'Barcelona',
      rating: '5',
      featured: false,
      serviceNames: 'Access Bars',
    },
    {
      content:
        'Access Bars mi-a deschis o lume nouă. Prin această metodă, am descoperit că sunt creatorul propriei mele realități și pot elibera emoțiile stocate.',
      name: 'Ioana Matei',
      role: 'Terapeut Maseor, Brașov',
      rating: '5',
      featured: false,
      serviceNames: 'Access Bars',
    },
    {
      content:
        'După 25 de ședințe de terapie, am deschis două cabinete de terapie și am ajutat un pacient cu tulburare bipolară să renunțe la medicația psihiatrică.',
      name: 'Gigi Peagu',
      role: 'Terapeut, București',
      rating: '5',
      featured: false,
      serviceNames: 'Access Bars',
    },
    {
      content:
        'După terapie, am simțit o pace profundă, relaxare și o stare de bine. M-am simțit mai puternică și recomand acest tratament cu căldură.',
      name: 'Adelina B.',
      role: 'Economist, București',
      rating: '5',
      featured: false,
      serviceNames: 'Access Bars',
    },
    {
      content:
        'Am început să merg la terapie Access Bars, în perioada când atacurile de panică s-au întetit, în special noaptea. După 5 ședințe de terapie, au dispărut complet. Somnul este profund.',
      name: 'Mihaela R.',
      role: 'Antreprenor, București',
      rating: '5',
      featured: false,
      serviceNames: 'Access Bars',
    },
    {
      content:
        'Aveam un examen de dat și foarte multe emoții. Eram convinsă că nu o să reușesc. După 3 ședințe de terapie, ceva s-a schimbat în interiorul meu. Rezultatul? Am luat examenul, a 2-a pe listă.',
      name: 'Carmen S.',
      role: 'Asistentă Medicală, București',
      rating: '5',
      featured: false,
      serviceNames: 'Access Bars',
    },
    {
      content:
        'Mă luptam cu depresia de 2 ani. Am început să merg regulat la terapia Access Bars. În 4 luni am renunțat la medicație. Zilnic îmi fac singură autoterapie. Mă simt extraordinar!',
      name: 'Simina V.',
      role: 'Artist Plastic, București',
      rating: '5',
      featured: false,
      serviceNames: 'Access Bars',
    },

    // ==================== CURS ACCESS BARS (Testimoniale Cursanți) ====================
    {
      content:
        'Știam de existența energiei, o simțeam la nivelul corpului meu dar niciodată nu am simțit-o în contact cu altă persoană la nivel atât de subtil. Monica Batir știe să transforme împărtășirea informației prin multe exemple din experiența personală și de cabinet. Beneficiile tehnicii au fost deja descrise, oferă-ți doar șansa să experimentezi!',
      name: 'Cristina Dimitrescu',
      role: 'Psihoterapeut, București',
      rating: '5',
      featured: true,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        'Între teama de a nu fi lăsați pe dinafară (fear of missing out) și nevoia de a ne proteja de prea multele informații neverificate care ne invadează agresiv din toate părțile, apar și lucruri cu adevărat importante, dăruite de oameni deosebiți. Aici se așază cursurile de Access Bars și de Facelift Energetic susținute de Monica Batir. Îndemn pe cei care acceptă, cred și înțeleg că totul este Vibrație și Energie, să urmeze aceste cursuri. Nu veți regreta investiția făcută. Veți dobândi un prieten adevărat, miracolul energetic al întineririi și, nu în ultimul rând, arta de a vă ajuta și de a-i ajuta și pe ceilalți, pătrunzând într-o lume în care vindecarea și frumusețea vin din interior.',
      name: 'Dr. Delia Miron',
      role: 'Medic, Botoșani',
      rating: '5',
      featured: true,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        'Am participat la cursul de Access Bars mai mult ca să-mi lărgesc portofoliul de terapii pe care le practic. Când însă am auzit că se organizează și cursul de Facelift Energetic mi-am zis că nu trebuie să-l ratez! Auzisem atâtea lucruri bune despre el! Și așa este! În primul rând l-am aplicat pe mine și rezultatele sunt vizibile: o față mai relaxată, un ten mai luminos, ca să nu mai spun de partea energetică a terapiei! La cabinet este o terapie pentru care multe cliente au deschidere și o adoră.',
      name: 'Mihaela Turcu',
      role: 'Terapeut, Târgu Mureș',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        'Bună ziua! Dacă vreți să primiți răspunsuri la întrebările frecvente din fiecare zi, Access vă ajută să înțelegeți cum UNIVERSUL poate schimba orice. Recomand la cât mai mulți oameni binecuvântați să schimbe din energia limitării. Succes noilor cursanți!',
      name: 'Dorica Căslaru',
      role: 'Terapeut, Botoșani',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        'Super și recomand să urmați Cursul de Access Bars! Vă oferă o schimbare în bine a întregului organism, a psihicului și sufletului! MINTE-TRUP-SUFLET! Mulțumesc Monica, pentru tot ceea ce am învățat la curs și după curs!',
      name: 'Agachi Simona',
      role: 'Asistentă Medicală, Iași',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        'Recomand din toată inima atât cursul cât și facilitatorul. Eu am urmat acest curs în ianuarie și consider că a fost una dintre cele mai bune investiții. Cel mai important mi se pare că pe lângă faptul că poți efectua această formă de terapie celor apropiați, clienților, îți poți efectua și autoterapie. Chiar se simte cum se echilibrează totul. Mulțumesc pentru tot Monica Batir!',
      name: 'Ana Damian',
      role: 'Iași',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        'Îmi aduc aminte că am ajuns la acest curs deși nu mă impresiona auzind de frumusețe și energie. Când auzim de frumusețe ne gândim doar la ce am fost învățați despre ea... machiaj, chirurgie, etc., ceea ce este greșit. Nu credeam în mișcarea energiilor însă prin această tehnică m-am șocat și chiar m-am ridicat în picioare când am simțit în degete un fel de curent iar pielea doamnei pe care lucram se mișca armonios. Monica Batir a început să râdă și să spună "Eh, vezi, energia există". Recomand cursul de Facelift Energetic și de Access Bars făcute cu Monica, nu veți regreta. În urma cursului de Bars, prin aplicare pe fetița mea cu strabism divergent... am primit vestea că ochiul respectiv și-a revenit și că nu se mai impune o operație.',
      name: 'Maria Vărasteanu',
      role: 'Terapeut Holistic, Mihăilești',
      rating: '5',
      featured: true,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        'Recomand cu mare drag, am făcut cursul și îl practic, rezultatele se văd și clientele sunt mulțumite. Mare mulțumire lui Monica și recunoștință pentru împărtășirea lui cu drag!',
      name: 'Angela Ștefan',
      role: 'Terapeut Maseur, Târgu Mureș',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        'Recomand cu mult drag atât cursul cât și facilitatorul! Este o terapie foarte simplă cu rezultate surprinzătoare și mai este și avantajul de a cunoaște un OM deosebit de frumos, de a cărui susținere te poți bucura în permanență și după parcurgerea cursului. Aștept cu drag să se alăture acestei comunități frumoase create de Monica Batir cât mai mulți doritori!',
      name: 'Mihaela Istrate',
      role: 'Antreprenor, București',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        'Access Bars este o terapie eficientă și integrativă prin care omul își poate rezolva afecțiuni fizice, traume emoționale și dezechilibre cerebrale. Nu mă credeți pe cuvânt, testați singuri. Monica Batir este terapeutul care vă poate ghida în acest proces.',
      name: 'Iulia Matei',
      role: 'Specialist IT, București',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        'Access Bars este tehnica prin care ne ajutăm în primul rând pe noi, dar și pe ceilalți. Este un proces de conștientizare, de a fi în prezent, dar este și un proces în care lucrăm cu subconștientul nostru. Și cum poate să fie mai bine decât atât când terapeutul lucrează neîncetat cu el? Monica Batir este acest terapeut minunat!',
      name: 'Violeta Antohi',
      role: 'Terapeut Holistic, Franța',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        'Access este o terapie pe care o poate face oricine cu puțină implicare. Este o metodă de deblocare, de eliberare a traumelor atât conștiente, cât și a celor inconștiente. Este o metodă de autovindecare fizică, mentală, spirituală.',
      name: 'Gabriela Roman',
      role: 'Ofițer, București',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        'Te felicit Monica pentru că duci la cât mai multă lume această tehnică minunată de a lucra cu mintea pentru claritate, liniște, focusare, rezultate bune în viață și prosperitate! Îți mulțumesc totdeauna pentru clipa când mi-ai oferit șansa de a învăța și practica această tehnică ușor de practicat și cu eficiență puternică în viață!',
      name: 'Gheorghe Peagu',
      role: 'Terapeut, București',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        'La un curs de Access Bars am avut bucuria să cunosc un strop de Lumină într-o lume ce inconștient își șterge culoarea. Monica Batir, un suflet care prin dorința de a fi viu și a trăi în Pace și armonie cu ea însăși și tot Universul, este mâna întinsă către alte suflete, arătându-le că se poate. Da, poți fi Om într-o lume atât de mare. Da, poți păstra Lumina în tine și să îi înveți și pe ceilalți să și-o țină nestinsă, indiferent în ce timp trăim. Îți mulțumesc cu recunoștință! Te îmbrățișez cu bucurie, om drag sufletului meu.',
      name: 'Mihaela Stoian',
      role: 'Antreprenor, București',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        'Bună Monica, voiam să îți trimit câteva observații "la cald", de la copii, după cursul de ieri. David căruia nu îi plăcea deloc sportul la școală, dimineața făceam ghiozdanul și când a auzit că are sport azi zice "Uuu, ora mea preferată". Și îl întreb "păi cum, parcă nu îți plăcea". David: "Am voie să mă răzgândesc: corpul meu, mintea mea, pot să mă răzgândesc când vreau. Doar la ideea că te iubesc mami, nu mă răzgândesc niciodată!" Amândoi s-au distrat și măcar că au învățat despre fluxul de energie, cum să fie recunoscători și cum să-și verbalizeze dorințele. Mulțumesc din suflet pentru tot ce ai făcut pentru ei.',
      name: 'Denisa',
      role: 'Mamă, București',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        'Dacă ai curajul să renunți la convingeri nesuportive, judecăți, frici, emoții reprimate, dacă îți dai voie să începi o nouă viață dintr-un alt nivel de conștiință, Access Bars este pentru tine! Monica Batir îți mulțumesc că m-ai lăsat să mă văd dincolo de măști, pentru bunătatea, dragostea, dăruirea și empatia cu care oferi din ceea ce ești, astfel încât să ne reîntoarcem la noi! Să fie trezire și vindecare aici, acum și mereu!',
      name: 'Gabriela Bocsi',
      role: 'Timișoara',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        '"Cum ar fi" să afli că există o terapie blândă prin care poți scăpa de tot bagajul emoțional pe care îl cari cu tine de ani și ani? Cum ar fi să afli că poți face asta atât pentru tine cât și pentru ceilalți cu "ușurință, bucurie și glorie"? Eu am aflat asta și muuult mai multe lucruri interesante și utile participând la Cursul Access Bars facilitat de Monica Batir. Mulțumesc cu recunoștință pentru tot ce ne-ai învățat și pentru tot ce ne-ai transmis!',
      name: 'Lioara Vanvu',
      role: 'Timișoara',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
    },
    {
      content:
        'Doamnă, te salut! Vreau doar să îți confirm că formula pe care ne-ai dat-o la cursul de Access Bars pentru învățare și nota perfectă, a funcționat strălucitor pentru mine! Am luat 79% din 100%, deci distincție, și formula m-a ajutat să dau, pur și simplu, peste materiale din cercetare care să îmi fie folositoare. M-a mai ajutat să conectez informația ușor, simplu, fluent, coerent! Eu cred în metodă doar atunci când văd rezultatele pe mine. Deci da, nu am avut speranță că voi reuși, pentru că înainte de a urma cursul Access Bars, îmi era extrem de greoi procesul de învățare. Funcționează, nu știu cum și de ce, dar funcționează, și asta este minunat!',
      name: 'Mirela',
      role: 'Studentă Științele Sănătății, Timișoara',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
    },

    // ==================== CURS ACCESS BARS - VIDEO TESTIMONIALE ====================
    {
      content:
        'Testimonial video despre experiența cu cursul Access Bars și beneficiile acestuia.',
      name: 'Mihai',
      role: '8 ani, Brașov',
      rating: '5',
      featured: true,
      serviceNames: 'Curs Access Bars',
      videoUrl: 'https://www.youtube.com/shorts/7xHey5IcEC0',
    },
    {
      content:
        'Testimonial video despre transformarea personală după cursul Access Bars.',
      name: 'Cursant Access Bars',
      role: 'București',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
      videoUrl: 'https://youtu.be/m3w6GgS1qeA',
    },
    {
      content:
        'Experiența mea cu tehnica Access Bars și cum m-a ajutat.',
      name: 'Cursant Access Bars',
      role: 'București',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
      videoUrl: 'https://youtu.be/TdaBjncyzXI',
    },
    {
      content:
        'Scurt testimonial despre beneficiile Access Bars.',
      name: 'Cursant Access Bars',
      role: 'România',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
      videoUrl: 'https://www.youtube.com/shorts/OjR1LxuuGZg',
    },
    {
      content:
        'Experiența mea de transformare cu Access Bars.',
      name: 'Cursant Access Bars',
      role: 'România',
      rating: '5',
      featured: false,
      serviceNames: 'Curs Access Bars',
      videoUrl: 'https://www.youtube.com/shorts/0LrphscODiI',
    },

    // ==================== CORECȚIE BIOENERGETICĂ ====================
    {
      content:
        'O cunosc pe doamna Monica Batir de ceva timp. Când am venit la ea, eram într-o stare emoțională precară. Mă supăram repede și des, făceam atacuri de panică în fiecare lună. Prin atingeri ușoare din care răzbătea duioșia ei față de oameni, reușea de fiecare dată să mă facă să mă simt bine. Are acest har. Dăruiește iubire, alină și vindecă sufletul, îți dă energie, încredere în propria persoană și poftă de viață.',
      name: 'Elena M.',
      role: 'Profesoară, București',
      rating: '5',
      featured: true,
      serviceNames: 'Corecție Bioenergetică',
    },
    {
      content:
        'Este incredibil ce eliberare poți simți cu adevărat după o ședință cu Monica Batir. Este atât la nivel fizic, cât și la nivel psihic și emoțional. Această terapie reușește să deblocheze incredibil atât de multe, încât experimentezi stări de la plâns eliberator, la liniște, pace și relaxare totală. Mulțumesc cu recunoștință, Monica!',
      name: 'Adrian C.',
      role: 'Specialist I.T., București',
      rating: '5',
      featured: false,
      serviceNames: 'Corecție Bioenergetică',
    },
    {
      content:
        'Monica Batir a dobândit experiență în domeniul terapiilor alternative, combinând sensibilitatea ei emoțională, cu pasiune, pentru a dărui din harul Divin primit. Monica ajută la echilibrarea armonioasă a chakrelor, meridianelor energetice. Este specialistă în aceste terapii extraordinare, pe care aplicându-le, îți va dărui toată puterea pierdută în stresul cotidian.',
      name: 'Maria P.',
      role: 'Pacient, București',
      rating: '5',
      featured: false,
      serviceNames: 'Corecție Bioenergetică',
    },

    // ==================== TERAPIA BOWEN ====================
    {
      content:
        'Îi mulțumesc lui Dumnezeu că a pus în calea mea o persoană atât de minunată ca Mona Batir. Deși nu știam nimic despre terapia Bowen, a funcționat extraordinar.',
      name: 'Maria T.',
      role: 'Pensionară, București',
      rating: '5',
      featured: true,
      serviceNames: 'Terapia Bowen',
    },
    {
      content:
        'Terapia Bowen mi-a redus atacurile de panică de la 2 pe zi la 2 pe săptămână, și m-a ajutat să fac față mult mai eficient episoadelor depresive. Simt că starea mea de bine se îmbunătățește de la o zi la alta.',
      name: 'Răzvan',
      role: 'Elev cls. a 12-a',
      rating: '5',
      featured: false,
      serviceNames: 'Terapia Bowen',
    },
    {
      content:
        'După ședințele de terapie Bowen, au încetat răcelile dese, mai ales la nivelul gâtului. Am scăpat de această problemă supărătoare și, de asemenea, problema ciclurilor menstruale dereglate s-a rezolvat.',
      name: 'Camelia D.',
      role: 'Economist',
      rating: '5',
      featured: false,
      serviceNames: 'Terapia Bowen',
    },
    {
      content:
        'Terapia Bowen și ședințele de eliberare a tensiunii interioare au fost foarte eficiente pentru starea de bine. M-au ajutat să mențin echilibrul interior.',
      name: 'Camelia I.',
      role: 'Psiholog',
      rating: '5',
      featured: false,
      serviceNames: 'Terapia Bowen',
    },
    {
      content:
        'Terapia Bowen mi-a ajutat organismul să se echilibreze. Obișnuiam să am hipertensiune aproape zilnic, împreună cu pulsul mărit și palpitații. De când am făcut terapie Bowen, se mai întâmplă foarte rar acum.',
      name: 'Beatrice D.',
      role: 'Elevă cls. 12-a',
      rating: '5',
      featured: false,
      serviceNames: 'Terapia Bowen',
    },
    {
      content:
        'Pe mine m-a ajutat foarte mult terapia Bowen pentru că eram foarte stresat de la școală. De la prima ședință m-am simțit foarte liniștit.',
      name: 'Dragoș C.',
      role: 'Elev cls. 12',
      rating: '5',
      featured: false,
      serviceNames: 'Terapia Bowen',
    },
    {
      content:
        'Terapia Bowen și Dna Monica Batir, atât prin optimismul dânsei, cât și prin efectele terapiei Bowen, mi-au redat starea de bine, energia. Durerile articulare și cele de cap provocate de sinuzită s-au ameliorat. Eu având probleme și cu vederea în urma radioterapiei, acum îmi este mult mai clară, și mi-am recăpătat încrederea de sine.',
      name: 'Marinela I.',
      role: 'Pacient',
      rating: '5',
      featured: false,
      serviceNames: 'Terapia Bowen',
    },
    {
      content:
        'Am ajuns la d-na Monica Batir la recomandarea unei cunoștințe. Am constatat ulterior că nu e doar o practiciantă bună, dar este și un doctor de suflet. Pe lângă terapie discutam și de ce avea nevoie sufletul meu. Ambele au făcut ca starea mea generală să se îmbunătățească, inclusiv micșorarea numărului atacurilor de panică, cât și dispariția durerilor de coloană.',
      name: 'Alexandru M.',
      role: 'Ofițer armată',
      rating: '5',
      featured: false,
      serviceNames: 'Terapia Bowen',
    },
    {
      content:
        'Mă numesc Daniela, și în urmă cu un an, din cauza durerilor de coloană vertebrală am apelat la dna terapeut-psiholog Batir Monica. După câteva ședințe, durerile au cedat și s-a instalat o stare de bine atât la nivel fizic cât și psihic. O recomand pe dna Monica Batir pentru dragostea, calmul și blândețea de care dă dovadă în această terapie.',
      name: 'Daniela A.',
      role: 'Asistentă Medicală',
      rating: '5',
      featured: false,
      serviceNames: 'Terapia Bowen',
    },
    {
      content:
        'Terapia bowen este o terapie care poate să facă numai bine - relaxare totală - liniște sufletească. Orice durere dispare în momentul terapiei. În timpul terapiei se reglează tensiunea arterială, corpul intră într-o relaxare profundă, echivalentul a 4 ore de somn. Am venit pentru dureri de coloană, umăr și stres. Toate au dispărut. D-na Mona Batir este terapeutul perfect!',
      name: 'Cristian V.',
      role: 'Ofițer armată',
      rating: '5',
      featured: false,
      serviceNames: 'Terapia Bowen',
    },
    {
      content:
        'În seara în care mi-am luxat piciorul la cursul de dans, am cerut ajutor. Monica Batir s-a oferit să mă ajute cu terapie Bowen. Nu a fost nevoie decât de două ședințe. Încă din prima zi piciorul s-a desumflat vizibil. A doua zi, după terapie, am mers fără nicio reținere. Într-o săptămână m-am întors în sala de dans. Monica are mâini și inimă de aur!',
      name: 'Ana R.',
      role: 'Dansatoare',
      rating: '5',
      featured: false,
      serviceNames: 'Terapia Bowen',
    },
    {
      content:
        'Citisem despre terapia Bowen și cum ar fi foarte benefică. Am descoperit un om deosebit care face cu pasiune această meserie, dna. Batir Monica. Organismul meu a început ușor să se echilibreze, să-mi revin și cu greutatea. Mi-am echilibrat și problema cu insomniile. Eliberarea tensiunii interioare a fost cu adevărat revelatoare, ca o gură de aer proaspăt.',
      name: 'Mihaela S.',
      role: 'Manager magazin',
      rating: '5',
      featured: false,
      serviceNames: 'Terapia Bowen',
    },
    {
      content:
        'În urmă cu un an m-am operat de hernie de disc. A 2-a zi după operație am beneficiat de terapie Bowen, în spital. Senzațiile de vomă, amețeală și durerea de cap au dispărut la 30 minute după terapie. Medicul m-a externat din spital mai repede cu 2 zile. Îi mulțumesc dnei Monica Batir pentru profesionalismul de care dă dovadă, și căldura cu care tratează oamenii.',
      name: 'Luminița N.',
      role: 'Confecționer',
      rating: '5',
      featured: false,
      serviceNames: 'Terapia Bowen',
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
      // Bio scurt pentru carduri și liste (bazat pe informații de pe site)
      bio: 'Psiholog, terapeut holistic și Reiki Master. Fondatoarea centrului Revital Harmony, specializată în terapii energetice pentru echilibrarea corpului, minții și sufletului.',
      // Descriere detaliată pentru pagina individuală (Lexical rich text)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get description(): any {
        return createRichTextRoot([
          // Introducere
          createHeading('Despre Mine', 'h2'),
          createParagraph(
            'Am creat Centrul Revital Harmony de Terapii Energetice pentru a vă oferi soluții practice de regăsire a echilibrului interior, atât fizic cât și mental, emoțional și spiritual, pentru a trăi zi de zi în armonie cu voi înșivă și cu cei din jur.',
          ),
          // Filozofie personală (text REAL de pe site-ul original)
          createHeading('Ce Mă Definește', 'h2'),
          createParagraph(
            'Dincolo de toate aceste titulaturi, ceea ce mă definește cel mai bine este că sunt un om pentru care iubirea este motorul tuturor activităților mele. În toți acești ani de studiu, am adunat din toate experiențele tot ce a fost mai valoros, astfel încât să pot împărtăși cu dăruire și profesionalism toate aceste informații.',
          ),
          createParagraph(
            'Diversitatea domeniilor în care am activat și interacțiunea cu oameni de toate categoriile m-au ajutat să pășesc dincolo de nevoile lor fiziologice, trecând în sfera acelor necesități la nivel subtil, acolo unde mulți dintre noi căutăm cel mai puțin.',
          ),
          createBanner(
            '"Te aștept cu drag să pășim împreună în această călătorie, privind viața dintr-un unghi al tuturor posibilităților!"',
            'info',
          ),

          // Calificări și certificări
          createHeading('Calificări și Certificări', 'h2'),
          createList([
            'Psiholog Licențiat',
            'Terapeut Holistic și Trainer (Terapia Bowen, eliberare emoțională, corecție bioenergetică)',
            'Reiki Master',
            'Fototerapeut',
            'Specialist Access Bars (eliberare blocaje emoționale, mentale și fizice)',
            'Specialist Facelift Energetic Access',
            'Absolventă Academia Internațională Access Consciousness',
            'Facilitator Access Bars și Facelift Access Energetic',
            'Nutriționist cu specializare în medicină Ayurvedică',
            'Practicant Yoga',
          ]),

          // De ce să alegi Revital Harmony
          createHeading('De Ce Să Alegi Revital Harmony?', 'h2'),
          createParagraph(
            'Centrul Revital Harmony se angajează să ofere ședințe personalizate care abordează nevoile individuale ale fiecărui client. Toate serviciile sunt oferite de practicieni calificați cu experiență vastă în terapii energetice.',
          ),
          createList([
            'Abordare holistică - tratăm persoana, nu doar simptomele',
            'Calificări multiple în psihologie și terapii holistice',
            'Certificări internaționale Access Consciousness',
            'Mediu relaxant și profesionist',
            'Program flexibil adaptat nevoilor clienților',
          ]),

          // Cum să începi
          createHeading('Cum Să Începi?', 'h2'),
          createParagraph(
            'Primul pas este să mă contactezi pentru o discuție despre nevoile tale. Împreună vom stabili ce tip de terapie este cel mai potrivit pentru situația ta și vom programa prima ședință.',
          ),
          createParagraphWithLink(
            '',
            'Programează-te acum pentru o consultație',
            '/contact',
            ' și descoperă cum terapiile energetice te pot ajuta să îți recapeți echilibrul și vitalitatea.',
          ),
        ])
      },
      // experience: eliminat - nu e menționat pe site-ul original
      featured: true,
      specializations: [
        { specialization: 'Terapia Bowen' },
        { specialization: 'Access Bars' },
        { specialization: 'Facelift Energetic' },
        { specialization: 'Reiki Master' },
        { specialization: 'Eliberare Emoțională' },
        { specialization: 'Corecție Bioenergetică' },
        { specialization: 'Nutriție Ayurvedică' },
      ],
      contact: {
        email: 'office@terapiienergetice.ro',
        phone: '0774 512 905',
        whatsapp: '+40774512905',
      },
      // Social media - linkuri generice (de actualizat de client cu cele reale)
      social: {
        facebook: 'https://www.facebook.com',
        instagram: 'https://www.instagram.com',
        linkedin: null,
        twitter: null,
      },
    },
  ],
}

// =============================================================================
// IMAGES - Local seed images
// =============================================================================

export const terapiiEnergeticeImages = {
  hero: [
    { filename: 'terapii/hero-1.png', alt: 'Terapii Energetice - Cabinet' },
    { filename: 'terapii/hero-2.png', alt: 'Ședință de terapie' },
  ],
  banner: { filename: 'terapii/hero-banner.png', alt: 'Terapii Energetice Banner' },
  services: [
    { filename: 'terapii/service-bowen.png', alt: 'Terapia Bowen' },
    { filename: 'terapii/service-eliberare.png', alt: 'Eliberare Emoțională' },
    { filename: 'terapii/service-bowen-alt.png', alt: 'Terapia Bowen' },
  ],
  // Course images - mapped by course title (original from terapiienergetice.ro)
  courseImages: [
    { filename: 'terapii/curs-access-bars-original.png', alt: 'Curs Access Bars', courseTitle: 'Curs Access Bars' },
    { filename: 'terapii/curs-facelift.png', alt: 'Curs Facelift Energetic', courseTitle: 'Curs Facelift Energetic' },
  ],
  logo: { filename: 'terapii/logo.png', alt: 'Revital Harmony Logo' },
  team: [{ filename: 'team/monica-batir.jpg', alt: 'Monica Batir - Fondator și Terapeut Principal' }],
  // Gallery images - from original site
  gallery: [
    { filename: 'terapii/galerie-1.jpg', alt: 'Cabinet de terapie', category: 'Cabinet' },
    { filename: 'terapii/galerie-2.jpg', alt: 'Sala de tratament', category: 'Cabinet' },
    { filename: 'terapii/monica-about.jpg', alt: 'Monica Batir în cabinet', category: 'Terapeut' },
    { filename: 'terapii/hero-1.png', alt: 'Terapie energetică', category: 'Terapii' },
    { filename: 'terapii/hero-2.png', alt: 'Ședință de relaxare', category: 'Terapii' },
    { filename: 'terapii/terapie-bowen.png', alt: 'Terapia Bowen', category: 'Terapii' },
    { filename: 'terapii/terapie-facelift.png', alt: 'Facelift Energetic', category: 'Terapii' },
  ],
  // About section images
  about: [
    { filename: 'terapii/monica-about.jpg', alt: 'Monica Batir - Fondator Revital Harmony' },
  ],
  // Therapy images - mapped by service title (original from terapiienergetice.ro)
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
