import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'

export const BusinessInfo: GlobalConfig = {
  slug: 'business-info',
  label: 'Informatii Business',
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
      ],
    },
  ],
}
