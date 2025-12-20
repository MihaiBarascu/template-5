import type { Block } from 'payload'
import {
  headingFields,
  ctaButtonFields,
  backgroundColorField,
  allIconOptions,
  showNumbersField,
} from '../_shared/commonFields'

export const HowItWorksBlock: Block = {
  slug: 'how-it-works',
  interfaceName: 'HowItWorksBlock',
  labels: {
    singular: 'Cum Functioneaza',
    plural: 'Cum Functioneaza',
  },
  imageURL: '/blocks/how-it-works.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'numbered',
      options: [
        { label: 'Numerotate (1, 2, 3...)', value: 'numbered' },
        { label: 'Cu iconite', value: 'icons' },
        { label: 'Timeline vertical', value: 'timeline' },
        { label: 'Carduri orizontale', value: 'horizontal-cards' },
        { label: 'Cu conectori (linii)', value: 'connected' },
        { label: 'Alternant (zig-zag)', value: 'alternating' },
      ],
    },
    ...headingFields({ headingDefault: 'Cum functioneaza' }),
    {
      name: 'steps',
      type: 'array',
      label: 'Pasi',
      minRows: 2,
      maxRows: 8,
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Titlu pas',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descriere',
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Iconita',
          admin: {
            condition: (_, { variant } = {}) => variant === 'icons' || variant === 'connected',
          },
          options: allIconOptions,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagine (optional)',
          admin: {
            condition: (_, { variant } = {}) => variant === 'alternating',
          },
        },
      ],
    },
    showNumbersField,
    ctaButtonFields(),
    backgroundColorField(),
  ],
}
