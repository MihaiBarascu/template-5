import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'

export const BusinessInfo: GlobalConfig = {
  slug: 'business-info',
  label: 'Informatii Business',
  admin: {
    group: 'Setari Site',
    description: 'Informatii despre afacere: contact, program, social media',
  },
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Numele afacerii',
              required: true,
            },
            {
              name: 'tagline',
              type: 'text',
              label: 'Slogan',
              admin: {
                description: 'Ex: Frumusete cu pasiune de peste 10 ani',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Descriere scurta',
              admin: {
                description: 'Folosit pentru SEO si despre noi',
              },
            },
            {
              name: 'yearEstablished',
              type: 'number',
              label: 'An infiintare',
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'address',
              type: 'group',
              label: 'Adresa',
              fields: [
                {
                  name: 'street',
                  type: 'text',
                  label: 'Strada',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'city',
                      type: 'text',
                      label: 'Oras',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'county',
                      type: 'text',
                      label: 'Judet',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'postalCode',
                      type: 'text',
                      label: 'Cod postal',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'country',
                      type: 'text',
                      label: 'Tara',
                      defaultValue: 'Romania',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Telefon principal',
                  admin: { width: '50%' },
                },
                {
                  name: 'phoneSecondary',
                  type: 'text',
                  label: 'Telefon secundar',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'email',
                  type: 'email',
                  label: 'Email',
                  admin: { width: '50%' },
                },
                {
                  name: 'whatsapp',
                  type: 'text',
                  label: 'WhatsApp',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'whatsappFloat',
              type: 'group',
              label: 'Buton WhatsApp Floating',
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Activeaza buton WhatsApp floating',
                  defaultValue: true,
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'position',
                      type: 'select',
                      label: 'Pozitie',
                      defaultValue: 'bottom-right',
                      options: [
                        { label: 'Dreapta jos', value: 'bottom-right' },
                        { label: 'Stanga jos', value: 'bottom-left' },
                      ],
                      admin: { width: '50%' },
                    },
                    {
                      name: 'showOnMobile',
                      type: 'checkbox',
                      label: 'Afiseaza pe mobil',
                      defaultValue: true,
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'defaultMessage',
                  type: 'textarea',
                  label: 'Mesaj predefinit',
                  admin: {
                    description: 'Mesajul care va fi pre-completat in WhatsApp',
                  },
                },
                {
                  name: 'tooltipText',
                  type: 'text',
                  label: 'Text tooltip',
                  defaultValue: 'Scrie-ne pe WhatsApp',
                },
                {
                  name: 'pulseAnimation',
                  type: 'checkbox',
                  label: 'Animatie puls',
                  defaultValue: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Program',
          fields: [
            {
              name: 'workingHours',
              type: 'array',
              label: 'Program de lucru',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'days',
                      type: 'text',
                      label: 'Zile',
                      admin: {
                        width: '50%',
                        description: 'Ex: Luni - Vineri',
                      },
                    },
                    {
                      name: 'hours',
                      type: 'text',
                      label: 'Ore',
                      admin: {
                        width: '50%',
                        description: 'Ex: 09:00 - 18:00 sau Inchis',
                      },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Social Media',
          fields: [
            {
              name: 'social',
              type: 'group',
              label: 'Link-uri social media',
              fields: [
                {
                  name: 'facebook',
                  type: 'text',
                  label: 'Facebook',
                },
                {
                  name: 'instagram',
                  type: 'text',
                  label: 'Instagram',
                },
                {
                  name: 'tiktok',
                  type: 'text',
                  label: 'TikTok',
                },
                {
                  name: 'youtube',
                  type: 'text',
                  label: 'YouTube',
                },
                {
                  name: 'linkedin',
                  type: 'text',
                  label: 'LinkedIn',
                },
                {
                  name: 'twitter',
                  type: 'text',
                  label: 'Twitter/X',
                },
              ],
            },
          ],
        },
        {
          label: 'Harta',
          fields: [
            {
              name: 'googleMapsEmbed',
              type: 'textarea',
              label: 'Google Maps Embed Code',
              admin: {
                description: 'Copiaza codul iframe de la Google Maps',
              },
            },
            {
              name: 'googleMapsLink',
              type: 'text',
              label: 'Link Google Maps',
              admin: {
                description: 'Link direct catre locatie pe Google Maps',
              },
            },
            {
              name: 'coordinates',
              type: 'group',
              label: 'Coordonate GPS',
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'lat',
                      type: 'number',
                      label: 'Latitudine',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'lng',
                      type: 'number',
                      label: 'Longitudine',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Statistici',
          fields: [
            {
              name: 'stats',
              type: 'array',
              label: 'Statistici afacere',
              admin: {
                description: 'Ex: 10+ ani experienta, 500+ clienti, etc.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'value',
                      type: 'text',
                      label: 'Valoare',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Eticheta',
                      admin: { width: '50%' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Legal',
          fields: [
            {
              name: 'legal',
              type: 'group',
              label: 'Informatii legale',
              fields: [
                {
                  name: 'companyName',
                  type: 'text',
                  label: 'Denumire firma',
                },
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'cui',
                      type: 'text',
                      label: 'CUI',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'regCom',
                      type: 'text',
                      label: 'Nr. Reg. Com.',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'bankAccount',
                  type: 'text',
                  label: 'Cont bancar (IBAN)',
                },
                {
                  name: 'bank',
                  type: 'text',
                  label: 'Banca',
                },
              ],
            },
          ],
        },
        {
          label: 'Widgeturi',
          fields: [
            {
              name: 'announcementBar',
              type: 'group',
              label: 'Bara Anunturi (Header)',
              admin: {
                description: 'Bara pentru promotii sau anunturi importante in header',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Activeaza bara de anunturi',
                  defaultValue: false,
                },
                {
                  name: 'message',
                  type: 'text',
                  label: 'Mesaj',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                },
                {
                  type: 'row',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                  fields: [
                    {
                      name: 'linkText',
                      type: 'text',
                      label: 'Text link',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'linkUrl',
                      type: 'text',
                      label: 'URL link',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                  fields: [
                    {
                      name: 'backgroundColor',
                      type: 'select',
                      label: 'Culoare fundal',
                      defaultValue: 'primary',
                      options: [
                        { label: 'Primary', value: 'primary' },
                        { label: 'Secondary', value: 'secondary' },
                        { label: 'Accent', value: 'accent' },
                        { label: 'Dark', value: 'dark' },
                        { label: 'Gradient', value: 'gradient' },
                      ],
                      admin: { width: '50%' },
                    },
                    {
                      name: 'icon',
                      type: 'select',
                      label: 'Iconi\u0163a',
                      defaultValue: 'megaphone',
                      options: [
                        { label: 'Megafon', value: 'megaphone' },
                        { label: 'Cadou', value: 'gift' },
                        { label: 'Stea', value: 'star' },
                        { label: 'Foc', value: 'fire' },
                        { label: 'Sclipiri', value: 'sparkles' },
                        { label: 'Fara', value: 'none' },
                      ],
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'dismissible',
                  type: 'checkbox',
                  label: 'Permite inchiderea',
                  defaultValue: true,
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                },
              ],
            },
            {
              name: 'floatingCta',
              type: 'group',
              label: 'Buton CTA Flotant',
              admin: {
                description: 'Buton call-to-action flotant (stil Plasturi)',
              },
              fields: [
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Activează buton CTA flotant',
                  defaultValue: false,
                },
                {
                  type: 'row',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                  fields: [
                    {
                      name: 'text',
                      type: 'text',
                      label: 'Text buton',
                      defaultValue: 'Programează-te Acum',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'href',
                      type: 'text',
                      label: 'Link (URL)',
                      defaultValue: '/contact',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                  fields: [
                    {
                      name: 'variant',
                      type: 'select',
                      label: 'Variantă culoare',
                      defaultValue: 'primary',
                      options: [
                        { label: 'Primary', value: 'primary' },
                        { label: 'Accent', value: 'accent' },
                        { label: 'Secondary', value: 'secondary' },
                        { label: 'Dark', value: 'dark' },
                        { label: 'Gradient (Primary → Accent)', value: 'gradient' },
                      ],
                      admin: { width: '50%' },
                    },
                    {
                      name: 'icon',
                      type: 'select',
                      label: 'Iconiță',
                      defaultValue: 'arrow',
                      options: [
                        { label: 'Săgeată', value: 'arrow' },
                        { label: 'Telefon', value: 'phone' },
                        { label: 'Mesaj', value: 'message' },
                        { label: 'Calendar', value: 'calendar' },
                        { label: 'Fără', value: 'none' },
                      ],
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                  fields: [
                    {
                      name: 'position',
                      type: 'select',
                      label: 'Poziție',
                      defaultValue: 'bottom-center',
                      options: [
                        { label: 'Jos dreapta', value: 'bottom-right' },
                        { label: 'Jos stânga', value: 'bottom-left' },
                        { label: 'Jos centru', value: 'bottom-center' },
                        { label: 'Dreapta centru (vertical)', value: 'right-center' },
                        { label: 'Stânga centru (vertical)', value: 'left-center' },
                      ],
                      admin: { width: '50%' },
                    },
                    {
                      name: 'shape',
                      type: 'select',
                      label: 'Formă buton',
                      defaultValue: 'pill',
                      options: [
                        { label: 'Pill (rotunjit complet)', value: 'pill' },
                        { label: 'Dreptunghi (colțuri rotunjite)', value: 'rectangle' },
                      ],
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                  fields: [
                    {
                      name: 'showOnMobile',
                      type: 'checkbox',
                      label: 'Afișează pe mobil',
                      defaultValue: true,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'pulseAnimation',
                      type: 'checkbox',
                      label: 'Animație puls',
                      defaultValue: true,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'dismissible',
                      type: 'checkbox',
                      label: 'Permite închiderea',
                      defaultValue: true,
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  name: 'showAfterScroll',
                  type: 'number',
                  label: 'Afișează după scroll (px)',
                  defaultValue: 500,
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    description: 'Butonul apare după ce utilizatorul derulează X pixeli',
                  },
                },
                {
                  name: 'hideOnPaths',
                  type: 'text',
                  label: 'Ascunde pe pagini (căi separate prin virgulă)',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    description: 'Ex: /contact, /programare - pagini unde butonul nu apare',
                  },
                },
              ],
            },
            {
              name: 'cookieConsent',
              type: 'group',
              label: 'Cookie Consent (GDPR)',
              admin: {
                description: 'Configurare banner cookie conform GDPR și Legea 506/2004 România',
              },
              fields: [
                // General Settings
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Activează banner cookies',
                  defaultValue: true,
                },

                // Main Banner Texts
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titlu banner',
                  defaultValue: 'Respectăm confidențialitatea ta',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Descriere',
                  defaultValue: 'Folosim cookie-uri pentru a îmbunătăți experiența ta pe site, pentru a analiza traficul și pentru a personaliza conținutul. Poți alege ce categorii de cookie-uri să accepți.',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                },
                {
                  name: 'privacyPolicyUrl',
                  type: 'text',
                  label: 'Link politică confidențialitate',
                  defaultValue: '/politica-confidentialitate',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                },

                // Button Texts
                {
                  type: 'row',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                  fields: [
                    {
                      name: 'acceptButtonText',
                      type: 'text',
                      label: 'Text buton acceptă toate',
                      defaultValue: 'Acceptă toate',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'rejectButtonText',
                      type: 'text',
                      label: 'Text buton respinge',
                      defaultValue: 'Respinge opționale',
                      admin: { width: '50%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                  fields: [
                    {
                      name: 'customizeButtonText',
                      type: 'text',
                      label: 'Text buton personalizează',
                      defaultValue: 'Personalizează',
                      admin: { width: '50%' },
                    },
                    {
                      name: 'saveButtonText',
                      type: 'text',
                      label: 'Text buton salvează',
                      defaultValue: 'Salvează preferințe',
                      admin: { width: '50%' },
                    },
                  ],
                },

                // Cookie Categories
                {
                  type: 'collapsible',
                  label: 'Texte categorii cookies',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                  fields: [
                    // Necessary Cookies
                    {
                      name: 'necessaryTitle',
                      type: 'text',
                      label: 'Titlu cookies necesare',
                      defaultValue: 'Cookie-uri necesare',
                    },
                    {
                      name: 'necessaryDescription',
                      type: 'textarea',
                      label: 'Descriere cookies necesare',
                      defaultValue: 'Aceste cookie-uri sunt esențiale pentru funcționarea corectă a site-ului și nu pot fi dezactivate. Ele sunt folosite pentru securitate, navigare și gestionarea sesiunilor.',
                    },

                    // Analytics Cookies
                    {
                      name: 'analyticsTitle',
                      type: 'text',
                      label: 'Titlu cookies analiză',
                      defaultValue: 'Cookie-uri de analiză',
                    },
                    {
                      name: 'analyticsDescription',
                      type: 'textarea',
                      label: 'Descriere cookies analiză',
                      defaultValue: 'Ne ajută să înțelegem cum interacționezi cu site-ul nostru. Informațiile colectate sunt anonimizate și folosite pentru a îmbunătăți experiența utilizatorilor.',
                    },

                    // Marketing Cookies
                    {
                      name: 'marketingTitle',
                      type: 'text',
                      label: 'Titlu cookies marketing',
                      defaultValue: 'Cookie-uri de marketing',
                    },
                    {
                      name: 'marketingDescription',
                      type: 'textarea',
                      label: 'Descriere cookies marketing',
                      defaultValue: 'Folosite pentru a afișa reclame relevante pentru tine. Ne ajută să măsurăm eficiența campaniilor publicitare și să personalizăm conținutul.',
                    },

                    // Preferences Cookies
                    {
                      name: 'preferencesTitle',
                      type: 'text',
                      label: 'Titlu cookies preferințe',
                      defaultValue: 'Cookie-uri de preferințe',
                    },
                    {
                      name: 'preferencesDescription',
                      type: 'textarea',
                      label: 'Descriere cookies preferințe',
                      defaultValue: 'Permit site-ului să memoreze alegerile tale (limba, regiunea, etc.) pentru a-ți oferi o experiență personalizată și mai relevantă.',
                    },
                  ],
                },

                // Analytics Integrations
                {
                  type: 'collapsible',
                  label: 'Integrări Analytics & Tracking',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                    description: 'ID-uri pentru platformele de analytics și marketing. Completează doar pentru cele pe care le folosești.',
                  },
                  fields: [
                    {
                      name: 'googleAnalyticsId',
                      type: 'text',
                      label: 'Google Analytics 4 ID',
                      admin: {
                        description: 'Format: G-XXXXXXXXXX',
                        placeholder: 'G-XXXXXXXXXX',
                      },
                    },
                    {
                      name: 'googleTagManagerId',
                      type: 'text',
                      label: 'Google Tag Manager ID',
                      admin: {
                        description: 'Format: GTM-XXXXXXX',
                        placeholder: 'GTM-XXXXXXX',
                      },
                    },
                    {
                      name: 'facebookPixelId',
                      type: 'text',
                      label: 'Facebook Pixel ID',
                      admin: {
                        description: 'ID numeric Facebook Pixel',
                        placeholder: '1234567890',
                      },
                    },
                    {
                      name: 'tiktokPixelId',
                      type: 'text',
                      label: 'TikTok Pixel ID',
                      admin: {
                        description: 'ID TikTok Pixel pentru tracking conversii',
                        placeholder: 'XXXXXXXXXXXXX',
                      },
                    },
                    {
                      name: 'hotjarId',
                      type: 'text',
                      label: 'Hotjar Site ID',
                      admin: {
                        description: 'ID numeric Hotjar pentru heatmaps și session recordings',
                        placeholder: '1234567',
                      },
                    },
                  ],
                },

                // Advanced Settings
                {
                  type: 'collapsible',
                  label: 'Setări avansate',
                  admin: {
                    condition: (_, siblingData) => siblingData?.enabled,
                  },
                  fields: [
                    {
                      name: 'consentExpiry',
                      type: 'number',
                      label: 'Expirare consimțământ (zile)',
                      defaultValue: 365,
                      admin: {
                        description: 'Număr de zile până când utilizatorul va fi întrebat din nou',
                      },
                    },
                    {
                      name: 'showFloatingButton',
                      type: 'checkbox',
                      label: 'Afișează buton floating pentru modificare preferințe',
                      defaultValue: true,
                      admin: {
                        description: 'Buton discret în colț pentru a permite utilizatorilor să-și schimbe preferințele',
                      },
                    },
                    {
                      name: 'position',
                      type: 'select',
                      label: 'Poziție banner',
                      defaultValue: 'bottom',
                      options: [
                        { label: 'Jos (lățime completă)', value: 'bottom' },
                        { label: 'Jos stânga', value: 'bottom-left' },
                        { label: 'Jos dreapta', value: 'bottom-right' },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
