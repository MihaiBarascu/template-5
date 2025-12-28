import type { CollectionConfig } from 'payload'
import { superAdminOrTenantAdminAccess } from '@/access/multiTenant'
import { createTenantRevalidateHook } from '@/hooks/revalidateTenantGlobal'

/**
 * BusinessInfo Collection (converted from Global)
 * Each tenant has their own business information.
 */
export const BusinessInfoCollection: CollectionConfig = {
  slug: 'tenant-business-info',
  labels: {
    singular: 'Informatii Afacere',
    plural: 'Informatii Afacere',
  },
  admin: {
    useAsTitle: 'name',
    group: 'Setari',
    description: 'Contact, program, social media',
    defaultColumns: ['tenant', 'name', 'phone', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  hooks: {
    afterChange: [createTenantRevalidateHook('tenant-business-info')],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'name', type: 'text', label: 'Numele afacerii', required: true },
            { name: 'tagline', type: 'text', label: 'Slogan' },
            { name: 'description', type: 'textarea', label: 'Descriere scurta' },
            { name: 'yearEstablished', type: 'number', label: 'An infiintare' },
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
                { name: 'street', type: 'text', label: 'Strada' },
                {
                  type: 'row',
                  fields: [
                    { name: 'city', type: 'text', label: 'Oras', admin: { width: '50%' } },
                    { name: 'county', type: 'text', label: 'Judet', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'postalCode', type: 'text', label: 'Cod postal', admin: { width: '50%' } },
                    { name: 'country', type: 'text', label: 'Tara', defaultValue: 'Romania', admin: { width: '50%' } },
                  ],
                },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'phone', type: 'text', label: 'Telefon principal', admin: { width: '50%' } },
                { name: 'phoneSecondary', type: 'text', label: 'Telefon secundar', admin: { width: '50%' } },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', label: 'Email', admin: { width: '50%' } },
                { name: 'whatsapp', type: 'text', label: 'WhatsApp', admin: { width: '50%' } },
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
                    { name: 'days', type: 'text', label: 'Zile', admin: { width: '50%' } },
                    { name: 'hours', type: 'text', label: 'Ore', admin: { width: '50%' } },
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
              fields: [
                { name: 'facebook', type: 'text', label: 'Facebook' },
                { name: 'instagram', type: 'text', label: 'Instagram' },
                { name: 'tiktok', type: 'text', label: 'TikTok' },
                { name: 'youtube', type: 'text', label: 'YouTube' },
                { name: 'linkedin', type: 'text', label: 'LinkedIn' },
                { name: 'twitter', type: 'text', label: 'Twitter/X' },
              ],
            },
          ],
        },
        {
          label: 'Harta',
          fields: [
            { name: 'googleMapsEmbed', type: 'textarea', label: 'Google Maps Embed Code' },
            { name: 'googleMapsLink', type: 'text', label: 'Link Google Maps' },
            {
              name: 'coordinates',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'lat', type: 'number', label: 'Latitudine', admin: { width: '50%' } },
                    { name: 'lng', type: 'number', label: 'Longitudine', admin: { width: '50%' } },
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
              fields: [
                { name: 'companyName', type: 'text', label: 'Denumire firma' },
                {
                  type: 'row',
                  fields: [
                    { name: 'cui', type: 'text', label: 'CUI', admin: { width: '50%' } },
                    { name: 'regCom', type: 'text', label: 'Nr. Reg. Com.', admin: { width: '50%' } },
                  ],
                },
                { name: 'bankAccount', type: 'text', label: 'Cont bancar (IBAN)' },
                { name: 'bank', type: 'text', label: 'Banca' },
              ],
            },
          ],
        },
        {
          label: 'Statistici',
          description: 'Statistici afisate in blocul Stats (ex: 10+ ani experienta)',
          fields: [
            {
              name: 'stats',
              type: 'array',
              label: 'Statistici',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'value', type: 'text', label: 'Valoare', required: true, admin: { width: '40%' } },
                    { name: 'label', type: 'text', label: 'Eticheta', required: true, admin: { width: '60%' } },
                  ],
                },
              ],
              admin: {
                description: 'Adauga statistici (ex: "10+" - "ani experienta", "500+" - "clienti multumiti")',
              },
            },
          ],
        },
      ],
    },
  ],
  timestamps: true,
}
