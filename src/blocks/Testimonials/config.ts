import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: 'Testimoniale',
    plural: 'Testimoniale',
  },
  imageURL: '/blocks/testimonials.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'carousel',
      options: [
        { label: 'Carousel', value: 'carousel' },
        { label: 'Grid', value: 'grid' },
        { label: 'Un testimonial mare', value: 'single-featured' },
        { label: 'Masonry', value: 'masonry' },
        { label: 'Carduri rotative', value: 'cards-rotating' },
        { label: 'Minimal (fara avatare)', value: 'minimal' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      defaultValue: 'Ce spun clientii nostri',
    },
    {
      name: 'subheading',
      type: 'textarea',
      label: 'Subtitlu sectiune',
    },
    {
      name: 'source',
      type: 'select',
      label: 'Sursa date',
      defaultValue: 'collection',
      options: [
        { label: 'Din colectia Testimoniale', value: 'collection' },
        { label: 'Selectie manuala', value: 'manual' },
      ],
    },
    {
      name: 'selectedTestimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      label: 'Testimoniale selectate',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'manual',
      },
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Numar maxim',
      defaultValue: 6,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'onlyFeatured',
      type: 'checkbox',
      label: 'Doar testimoniale featured',
      defaultValue: true,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    {
      name: 'showRating',
      type: 'checkbox',
      label: 'Afiseaza rating (stele)',
      defaultValue: true,
    },
    {
      name: 'showAvatar',
      type: 'checkbox',
      label: 'Afiseaza avatar',
      defaultValue: true,
    },
    {
      name: 'showSource',
      type: 'checkbox',
      label: 'Afiseaza sursa (Google, Facebook)',
      defaultValue: false,
    },
    {
      name: 'autoplay',
      type: 'checkbox',
      label: 'Autoplay (pentru carousel)',
      defaultValue: true,
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'carousel',
      },
    },
    {
      name: 'backgroundColor',
      type: 'select',
      label: 'Culoare fundal',
      defaultValue: 'light',
      options: [
        { label: 'Default', value: 'default' },
        { label: 'Light', value: 'light' },
        { label: 'Dark', value: 'dark' },
        { label: 'Primary', value: 'primary' },
      ],
    },
  ],
}
