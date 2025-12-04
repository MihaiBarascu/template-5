import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedOrPublished } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidatePageAfterChange, revalidatePageAfterDelete } from '@/hooks/revalidatePage'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    singular: 'Pagina',
    plural: 'Pagini',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = data?.slug === 'home' ? '' : data?.slug
        return `${req.protocol}//${req.host}/${path}`
      },
    },
    preview: (data, { req }) => {
      const path = data?.slug === 'home' ? '' : data?.slug
      return `${req.protocol}//${req.host}/api/preview?url=/${path}&secret=${process.env.PREVIEW_SECRET}`
    },
    useAsTitle: 'title',
    group: 'Continut',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titlu',
      required: true,
    },
    slugField('title'),
    {
      name: 'heroType',
      type: 'select',
      label: 'Tip Hero',
      defaultValue: 'none',
      options: [
        { label: 'Fara hero', value: 'none' },
        { label: 'Minimal', value: 'minimal' },
        { label: 'Centrat', value: 'centered' },
        { label: 'Cu imagine', value: 'withImage' },
        { label: 'Fullscreen', value: 'fullscreen' },
        { label: 'Split', value: 'split' },
        { label: 'Video', value: 'video' },
        { label: 'Slider', value: 'slider' },
      ],
    },
    {
      name: 'hero',
      type: 'group',
      label: 'Hero',
      admin: {
        condition: (_, siblingData) => siblingData?.heroType && siblingData.heroType !== 'none',
      },
      fields: [
        {
          name: 'headline',
          type: 'text',
          label: 'Titlu principal',
        },
        {
          name: 'subheadline',
          type: 'textarea',
          label: 'Subtitlu',
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagine',
          admin: {
            condition: (data) =>
              ['withImage', 'fullscreen', 'split'].includes(data?.heroType),
          },
        },
        {
          name: 'videoUrl',
          type: 'text',
          label: 'URL Video (YouTube/Vimeo)',
          admin: {
            condition: (data) => data?.heroType === 'video',
          },
        },
        {
          name: 'ctaButtons',
          type: 'array',
          label: 'Butoane CTA',
          maxRows: 2,
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Text',
              required: true,
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link',
              required: true,
            },
            {
              name: 'variant',
              type: 'select',
              label: 'Stil',
              defaultValue: 'default',
              options: [
                { label: 'Primary', value: 'default' },
                { label: 'Outline', value: 'outline' },
                { label: 'Ghost', value: 'ghost' },
              ],
            },
          ],
        },
        {
          type: 'row',
          fields: [
            {
              name: 'showSocialIcons',
              type: 'checkbox',
              label: 'Afiseaza iconite social media',
              defaultValue: true,
              admin: { width: '50%' },
            },
            {
              name: 'socialIconsPosition',
              type: 'select',
              label: 'Pozitie iconite social',
              defaultValue: 'left',
              options: [
                { label: 'Stanga', value: 'left' },
                { label: 'Dreapta', value: 'right' },
              ],
              admin: {
                width: '50%',
                condition: (_, siblingData) => siblingData?.showSocialIcons,
              },
            },
          ],
        },
        {
          name: 'height',
          type: 'select',
          label: 'Inaltime Hero',
          defaultValue: 'large',
          options: [
            { label: 'Mica', value: 'small' },
            { label: 'Medie', value: 'medium' },
            { label: 'Mare', value: 'large' },
            { label: 'Fullscreen', value: 'fullscreen' },
          ],
        },
        {
          name: 'badge',
          type: 'text',
          label: 'Badge (optional)',
          admin: {
            description: 'Ex: Premium Quality, Since 2015',
          },
        },
        {
          name: 'showScrollIndicator',
          type: 'checkbox',
          label: 'Afiseaza indicator scroll',
          defaultValue: false,
        },
        // Overlay settings for image/video hero
        {
          name: 'overlayEnabled',
          type: 'checkbox',
          label: 'Activeaza overlay peste imagine',
          defaultValue: true,
          admin: {
            description: 'Adauga un strat peste imagine pentru a face textul mai lizibil',
            condition: (data) =>
              ['withImage', 'fullscreen', 'video', 'slider'].includes(data?.heroType),
          },
        },
        {
          type: 'row',
          admin: {
            condition: (data, siblingData) =>
              siblingData?.overlayEnabled && ['withImage', 'fullscreen', 'video', 'slider'].includes(data?.heroType),
          },
          fields: [
            {
              name: 'overlayOpacity',
              type: 'select',
              label: 'Opacitate overlay',
              defaultValue: '60',
              options: [
                { label: 'Subtil (30%)', value: '30' },
                { label: 'Usor (40%)', value: '40' },
                { label: 'Mediu (50%)', value: '50' },
                { label: 'Standard (60%)', value: '60' },
                { label: 'Puternic (70%)', value: '70' },
                { label: 'Intens (80%)', value: '80' },
                { label: 'Foarte intens (90%)', value: '90' },
              ],
              admin: { width: '50%' },
            },
            {
              name: 'overlayStyle',
              type: 'select',
              label: 'Stil overlay',
              defaultValue: 'gradient',
              options: [
                { label: 'Gradient (de jos in sus)', value: 'gradient' },
                { label: 'Uniform inchis', value: 'dark' },
                { label: 'Culoare primara', value: 'primary' },
                { label: 'Culoare secundara', value: 'secondary' },
                { label: 'Gradient radial (centru)', value: 'radial' },
              ],
              admin: { width: '50%' },
            },
          ],
        },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      label: 'Continut pagina',
      blocks: [],  // Populated in payload.config.ts
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidatePageAfterChange],
    afterDelete: [revalidatePageAfterDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
