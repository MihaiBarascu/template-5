import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'
import { slugField } from '@/fields/slug'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: {
    singular: 'Produs',
    plural: 'Produse',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'price', 'stock', 'featured'],
    useAsTitle: 'title',
    group: 'Business',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Denumire produs',
      required: true,
    },
    slugField('title'),
    {
      name: 'shortDescription',
      type: 'textarea',
      label: 'Descriere scurta',
    },
    {
      name: 'description',
      type: 'richText',
      label: 'Descriere detaliata',
    },
    {
      name: 'images',
      type: 'array',
      label: 'Imagini',
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'price',
          type: 'number',
          label: 'Pret (RON)',
          required: true,
          admin: {
            width: '33%',
          },
        },
        {
          name: 'salePrice',
          type: 'number',
          label: 'Pret redus (RON)',
          admin: {
            width: '33%',
          },
        },
        {
          name: 'sku',
          type: 'text',
          label: 'Cod produs (SKU)',
          admin: {
            width: '33%',
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'stock',
          type: 'number',
          label: 'Stoc',
          defaultValue: 0,
          admin: {
            width: '50%',
          },
        },
        {
          name: 'unit',
          type: 'text',
          label: 'Unitate masura',
          admin: {
            width: '50%',
            description: 'Ex: buc, kg, l, pachet',
          },
        },
      ],
    },
    {
      name: 'specifications',
      type: 'array',
      label: 'Specificatii',
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Specificatie',
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          label: 'Valoare',
          required: true,
        },
      ],
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      label: 'Categorie',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Produs recomandat',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Ordine afisare',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
