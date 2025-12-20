import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import {
  headingFields,
  backgroundColorField,
  showRatingField,
  showAvatarField,
} from '../_shared/commonFields'

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
        { label: 'Video Testimonials', value: 'video-grid' },
      ],
    },
    ...headingFields({ headingDefault: 'Ce spun clientii nostri' }),
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
    showRatingField,
    showAvatarField,
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
    backgroundColorField({ defaultValue: 'light' }),
    // Section wrapper fields for advanced layout options
    ...sectionWrapperFields,
  ],
}
