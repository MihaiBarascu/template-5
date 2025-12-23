import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, displayOptionsGroup, advancedSettingsGroup } from '../_shared/commonFields'
import { testimonialsSourceFields } from '../_shared/collectionSourceFields'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: {
    singular: 'Testimoniale',
    plural: 'Testimoniale',
  },
  imageURL: '/blocks/testimonials.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'carousel',
      options: [
        { label: 'Carousel', value: 'carousel' },
        { label: 'Grid', value: 'grid' },
        { label: 'Un testimonial mare', value: 'single-featured' },
      ],
    },
    ...headingFields({ headingDefault: 'Ce spun clientii nostri' }),
    // Collection fields (limit, filterByCategory, onlyFeatured)
    ...testimonialsSourceFields(),
    // === DISPLAY OPTIONS (collapsible) ===
    displayOptionsGroup({
      label: 'Optiuni afisare',
      collapsed: true,
      fields: [
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
      ],
    }),
    // === ADVANCED SETTINGS (collapsible) ===
    advancedSettingsGroup({
      label: 'Setari avansate',
      fields: [
        {
          name: 'backgroundColor',
          type: 'select',
          label: 'Culoare fundal',
          defaultValue: 'default',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Light', value: 'light' },
            { label: 'Dark', value: 'dark' },
          ],
        },
      ],
    }),
    // Section wrapper fields
    ...sectionWrapperFields,
  ],
}
