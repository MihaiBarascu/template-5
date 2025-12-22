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
            'Dezvoltată ca parte a sistemului Access Consciousness, această terapie este practicată în peste 173 de țări la nivel mondial, ajutând milioane de oameni să experimenteze o stare profundă de relaxare și eliberare.',
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
      price: 180,
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
        'Curs de o zi pentru a deveni practician certificat Access Bars. Învață să aplici tehnica celor 32 de puncte energetice pe tine și pe alții, cu certificare internațională recunoscută în 173 de țări.',
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
      // Rich text description
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get description(): any {
        return createRichTextRoot([
          // Introducere
          createHeading('Ce este Access Bars?', 'h2'),
          createParagraph(
            'Access Bars este o ramură a Access Consciousness, o tehnică de medicină alternativă practicată în peste 173 de țări. Metoda se concentrează pe 32 de puncte de pe cap care, atunci când sunt atinse, eliberează unde electromagnetice pentru a curăța blocajele și emoțiile negative.',
          ),
          createParagraph(
            'Conform cercetărilor, oamenii sunt „90% subconștient și doar 10% conștient". Access Bars permite accesarea nivelurilor mentale mai profunde, unde informațiile stocate pot fi procesate și eliberate.',
          ),

          // Ce înveți
          createHeading('Ce Înveți la Curs?', 'h2'),
          createParagraph(
            'Cursul Access Bars îți oferă toate cunoștințele și abilitățile practice pentru a deveni practician certificat:',
          ),
          createList([
            'Să aplici tehnica pe tine și pe alții',
            'Să facilitezi fluxul de energie și să elimini constrângerile mentale/emoționale',
            'Să abordezi probleme precum depresia, tulburările de somn, anxietatea, dificultățile de relație',
            'Să obții rezultate comparabile cu terapiile pe termen lung, într-un format de o singură zi',
          ]),

          // Ce primești
          createHeading('Ce Primești la Curs?', 'h2'),
          createList([
            'Tehnici practice pentru auto-aplicare și lucrul cu clienții',
            'Înțelegerea celor 32 de puncte energetice de pe cap',
            'Instrumente de lucru și informații valoroase',
            'Training pentru a facilita vindecarea pentru tine și alții',
            'Acces la experiența și cunoștințele facilitatorului Monica Batir',
            'Certificat Internațional Access Consciousness',
          ]),

          createBanner(
            'Cursul durează o zi și include transfer eficient de informații la nivel vibrațional. La finalul cursului primești Certificat Internațional Access Consciousness, recunoscut în 173 de țări.',
            'info',
          ),

          // Opțiuni de preț
          createHeading('Opțiuni de Preț', 'h2'),
          createList([
            'Prima participare: 1.460 RON',
            'Reluare curs (pentru practicieni certificați): 730 RON',
            'Adolescenți (16-18 ani): 730 RON',
            'Copii (sub 16 ani, însoțiți de adult participant): GRATUIT',
          ]),

          // Date următoare
          createHeading('Date Următoare', 'h2'),
          createList([
            '20 Decembrie 2025 – București',
            '17 Ianuarie 2026 – București',
            '21 Februarie 2026 – București',
          ]),

          createBanner(
            'Locurile sunt limitate! Rezervă-ți locul acum pentru următorul curs Access Bars.',
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
      therapy: 'Facelift Energetic',
    },
    {
      content:
        'Experiențe extraordinare în care am descoperit o altă abordare a vieții cu mai multă prezență, calm și conștiință interioară. Recomand cu căldură!',
      name: 'Aida Ciobanu',
      role: 'Terapeut Bowen, Bacău',
      rating: '5',
      featured: false,
      therapy: 'Facelift Energetic',
    },
    {
      content:
        'Am adormit în timpul fiecărei ședințe și m-am trezit foarte relaxată. Tenul a devenit mai luminos și starea interioară s-a schimbat complet.',
      name: 'Irina P.',
      role: 'Profesoară, București',
      rating: '5',
      featured: false,
      therapy: 'Facelift Energetic',
    },
    {
      content:
        'După câteva ședințe de Facelift energetic, am observat că ridurile fine de pe gât și decolteu s-au estompat vizibil, tenul a devenit mai plin de viață. Starea interioară s-a schimbat.',
      name: 'Raluca I.',
      role: 'Chimist, București',
      rating: '5',
      featured: false,
      therapy: 'Facelift Energetic',
    },
    {
      content:
        'Terapia Facelift m-a ajutat să am mai multă încredere în mine. Tenul meu s-a schimbat complet. Am devenit mult mai veselă, mai plină de viață.',
      name: 'Ioana P.',
      role: 'Consilier Juridic, București',
      rating: '5',
      featured: false,
      therapy: 'Facelift Energetic',
    },

    // ==================== TERAPIA REIKI ====================
    {
      content:
        'În timpul ședinței de Reiki m-am relaxat profund. Am simțit cum plutesc, iar apăsarea pe care o simțeam la început în piept, a dispărut complet. O experiență transformatoare.',
      name: 'Larisa M.',
      role: 'Consilier Juridic, București',
      rating: '5',
      featured: true,
      therapy: 'Terapia Reiki',
    },
    {
      content:
        'Terapia Reiki m-a ajutat într-un moment critic din viață. Monica m-a adus înapoi la viață când eram complet blocată. Sunt recunoscătoare pentru această experiență.',
      name: 'Ionela S.',
      role: 'Economist, București',
      rating: '5',
      featured: false,
      therapy: 'Terapia Reiki',
    },

    // ==================== ELIBERAREA TENSIUNII INTERIOARE ====================
    {
      content:
        'În urma ședinței de terapie de eliberare a tensiunii interioare, m-am simțit mult mai ușoară, eliberată de stress, foarte liniștită, conectată la corpul meu. Recomand din suflet!',
      name: 'Ioana V.',
      role: 'Economist',
      rating: '5',
      featured: true,
      therapy: 'Eliberarea Tensiunii Interioare',
    },
    {
      content:
        'După 5 ședințe de eliberare emoțională, nu am mai avut atacuri de panică, am reușit să adorm noaptea fără medicamente. Parcă sunt un alt om.',
      name: 'Sorina B.',
      role: 'Referent',
      rating: '5',
      featured: false,
      therapy: 'Eliberarea Tensiunii Interioare',
    },
    {
      content:
        'Înainte de terapie făcusem un atac de panică. Eram foarte obosit și irascibil. În timpul terapiei am simțit cum tot stresul se dizolvă. Am plecat un alt om.',
      name: 'Radu A.',
      role: 'Manager Vânzări',
      rating: '5',
      featured: false,
      therapy: 'Eliberarea Tensiunii Interioare',
    },

    // ==================== ACCESS BARS ====================
    {
      content:
        'Am înțeles că totul este despre vibrație și energie. Access Bars m-a ajutat să eliberez blocaje pe care le aveam de ani de zile. Transformarea a fost incredibilă.',
      name: 'Violeta G.',
      role: 'Terapeut Holistic, Franța',
      rating: '5',
      featured: true,
      therapy: 'Access Bars',
    },
    {
      content:
        'După cursul Access Bars, am completat 25 de zile de auto-terapie și am înțeles cât de important este să fii prezent și conștient în viață.',
      name: 'Andreea',
      role: 'Barcelona',
      rating: '5',
      featured: false,
      therapy: 'Access Bars',
    },
    {
      content:
        'Access Bars mi-a deschis o lume nouă. Prin această metodă, am descoperit că sunt creatorul propriei mele realități și pot elibera emoțiile stocate.',
      name: 'Ioana Matei',
      role: 'Terapeut Maseor, Brașov',
      rating: '5',
      featured: false,
      therapy: 'Access Bars',
    },
    {
      content:
        'După 25 de ședințe de terapie, am deschis două cabinete de terapie și am ajutat un pacient cu tulburare bipolară să renunțe la medicația psihiatrică.',
      name: 'Gigi Peagu',
      role: 'Terapeut, București',
      rating: '5',
      featured: false,
      therapy: 'Access Bars',
    },
    {
      content:
        'După terapie, am simțit o pace profundă, relaxare și o stare de bine. M-am simțit mai puternică și recomand acest tratament cu căldură.',
      name: 'Adelina B.',
      role: 'Economist, București',
      rating: '5',
      featured: false,
      therapy: 'Access Bars',
    },
    {
      content:
        'Am început să merg la terapie Access Bars, în perioada când atacurile de panică s-au întetit, în special noaptea. După 5 ședințe de terapie, au dispărut complet. Somnul este profund.',
      name: 'Mihaela R.',
      role: 'Antreprenor, București',
      rating: '5',
      featured: false,
      therapy: 'Access Bars',
    },
    {
      content:
        'Aveam un examen de dat și foarte multe emoții. Eram convinsă că nu o să reușesc. După 3 ședințe de terapie, ceva s-a schimbat în interiorul meu. Rezultatul? Am luat examenul, a 2-a pe listă.',
      name: 'Carmen S.',
      role: 'Asistentă Medicală, București',
      rating: '5',
      featured: false,
      therapy: 'Access Bars',
    },
    {
      content:
        'Mă luptam cu depresia de 2 ani. Am început să merg regulat la terapia Access Bars. În 4 luni am renunțat la medicație. Zilnic îmi fac singură autoterapie. Mă simt extraordinar!',
      name: 'Simina V.',
      role: 'Artist Plastic, București',
      rating: '5',
      featured: false,
      therapy: 'Access Bars',
    },

    // ==================== CORECȚIE BIOENERGETICĂ ====================
    {
      content:
        'O cunosc pe doamna Monica Batir de ceva timp. Când am venit la ea, eram într-o stare emoțională precară. Terapia m-a ajutat să-mi recapăt echilibrul și energia.',
      name: 'Elena M.',
      role: 'Profesoară, București',
      rating: '5',
      featured: true,
      therapy: 'Corecție Bioenergetică',
    },

    // ==================== TERAPIA BOWEN ====================
    {
      content:
        'Îi mulțumesc lui Dumnezeu că a pus în calea mea o persoană atât de minunată ca Mona Batir. Deși nu știam nimic despre terapia Bowen, a funcționat extraordinar.',
      name: 'Maria T.',
      role: 'Pensionară, București',
      rating: '5',
      featured: true,
      therapy: 'Terapia Bowen',
    },
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
      // Bio scurt pentru carduri și liste
      bio: 'Psiholog, terapeut holistic și Reiki Master cu peste 15 ani experiență. Fondatoarea centrului Revital Harmony, specializată în terapii energetice pentru echilibrarea corpului, minții și sufletului.',
      // Descriere detaliată pentru pagina individuală (Lexical rich text)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      get description(): any {
        return createRichTextRoot([
          // Introducere
          createHeading('Despre Mine', 'h2'),
          createParagraph(
            'Am creat Centrul Revital Harmony de Terapii Energetice pentru a vă oferi soluții practice de regăsire a echilibrului interior, atât fizic cât și mental, emoțional și spiritual, pentru a trăi zi de zi în armonie cu voi înșivă și cu cei din jur.',
          ),
          createParagraph(
            'Cu o experiență vastă în domenii multiple - de la psihologie la terapii holistice și nutriție - am capacitatea de a aborda nevoile clienților mei atât la nivel fiziologic, cât și la nivel subtil, acolo unde are loc vindecarea profundă.',
          ),

          // Filozofie personală
          createHeading('Ce Mă Definește', 'h2'),
          createParagraph(
            'Dincolo de toate calificările și certificările mele, ceea ce mă definește cel mai bine este că sunt un om pentru care iubirea este motorul tuturor activităților mele. Cred cu tărie că fiecare dintre noi are capacitatea de a se vindeca și de a-și transforma viața.',
          ),
          createBanner(
            '"Rolul meu este să ghidez și să facilitez procesul de redescoperire a echilibrului interior. Fiecare client este unic, și abordarea mea este întotdeauna personalizată."',
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
            'Experiență de peste 15 ani în domeniul terapiilor energetice',
            'Certificări internaționale recunoscute în 173 de țări',
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
      experience: '15+ ani',
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
      social: {
        facebook: 'https://www.facebook.com/MonicaBatir.Terapeut/',
        instagram: 'https://www.instagram.com/monicabatir/',
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
    { filename: 'hero-1.png', alt: 'Terapii Energetice - Cabinet' },
    { filename: 'hero-2.png', alt: 'Ședință de terapie' },
  ],
  banner: { filename: 'hero-banner.png', alt: 'Terapii Energetice Banner' },
  services: [
    { filename: 'service-bowen.png', alt: 'Terapia Bowen' },
    { filename: 'service-eliberare.png', alt: 'Eliberare Emoțională' },
    { filename: 'service-bowen-alt.png', alt: 'Terapia Bowen' },
  ],
  // Course images - mapped by course title
  courseImages: [
    { filename: 'curs-access-bars.png', alt: 'Curs Access Bars', courseTitle: 'Curs Access Bars' },
    { filename: 'curs-facelift.png', alt: 'Curs Facelift Energetic', courseTitle: 'Curs Facelift Energetic' },
  ],
  logo: { filename: 'logo.png', alt: 'Revital Harmony Logo' },
  team: [{ filename: 'team/monica-batir.jpg', alt: 'Monica Batir - Fondator și Terapeut Principal' }],
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
