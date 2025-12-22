import type { CollectionConfig } from 'payload'
import { anyone, authenticated } from '@/access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  labels: {
    singular: 'Testimonial',
    plural: 'Testimoniale',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'role', 'rating', 'featured'],
    useAsTitle: 'name',
    group: 'Business',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Nume client',
      required: true,
    },
    {
      name: 'role',
      type: 'text',
      label: 'Functie / Companie',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Fotografie',
    },
    {
      name: 'content',
      type: 'textarea',
      label: 'Testimonial',
      required: true,
    },
    {
      name: 'rating',
      type: 'select',
      label: 'Rating',
      defaultValue: '5',
      options: [
        { label: '5 stele', value: '5' },
        { label: '4 stele', value: '4' },
        { label: '3 stele', value: '3' },
        { label: '2 stele', value: '2' },
        { label: '1 stea', value: '1' },
      ],
    },
    {
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
      label: 'Servicii asociate',
      index: true, // Index for efficient querying with 'contains' operator
      admin: {
        description: 'Testimonialul va apărea pe paginile acestor servicii/cursuri',
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'testimonial-categories',
      label: 'Categorie',
      admin: {
        description: 'Categorie pentru grupare (ex: Access Bars, Terapia Bowen)',
      },
      index: true,
    },
    {
      name: 'source',
      type: 'select',
      label: 'Sursa recenzie',
      options: [
        { label: 'Google', value: 'google' },
        { label: 'Facebook', value: 'facebook' },
        { label: 'Site', value: 'website' },
        { label: 'Altele', value: 'other' },
      ],
    },
    {
      name: 'videoUrl',
      type: 'text',
      label: 'URL Video Testimonial',
      admin: {
        description: 'YouTube, Vimeo sau URL direct la video. Optional - doar pentru varianta video-grid.',
      },
    },
    {
      name: 'videoPoster',
      type: 'upload',
      relationTo: 'media',
      label: 'Poster Video',
      admin: {
        description: 'Imagine de preview pentru video testimonial',
        condition: (_, siblingData) => !!siblingData?.videoUrl,
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      label: 'Afisat pe homepage',
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
