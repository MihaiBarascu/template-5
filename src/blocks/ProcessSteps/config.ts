import type { Block } from 'payload'
import {
  headingFields,
  ctaButtonFields,
  backgroundColorField,
  allIconOptions,
  showNumbersField,
  showConnectorsField,
} from '../_shared/commonFields'

export const ProcessStepsBlock: Block = {
  slug: 'process-steps',
  interfaceName: 'ProcessStepsBlock',
  labels: {
    singular: 'Process Steps (Premium)',
    plural: 'Process Steps',
  },
  imageURL: '/blocks/process-steps.svg',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'zigzag',
      options: [
        { label: 'Zigzag (alternant stanga-dreapta)', value: 'zigzag' },
        { label: 'Timeline vertical', value: 'timeline' },
        { label: 'Carduri orizontale', value: 'horizontal' },
        { label: 'Grid 2x2', value: 'grid' },
        { label: 'Carousel (scroll orizontal)', value: 'carousel' },
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
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          label: 'Imagine',
          admin: {
            description: 'Imagine pentru acest pas (recomandat 600x400px)',
          },
        },
        {
          name: 'icon',
          type: 'select',
          label: 'Iconita (alternativa la imagine)',
          admin: {
            condition: (_, siblingData) => !siblingData?.image,
          },
          options: allIconOptions,
        },
        {
          name: 'badge',
          type: 'text',
          label: 'Badge / eticheta (optional)',
          admin: {
            description: 'Ex: "Pas 1", "Etapa initiala", etc.',
          },
        },
      ],
    },
    showNumbersField,
    showConnectorsField,
    {
      name: 'imagePosition',
      type: 'select',
      label: 'Pozitie imagine pentru primul pas',
      defaultValue: 'right',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'zigzag',
        description: 'Prima imagine va fi pe aceasta parte, urmatoarele alterneaza',
      },
      options: [
        { label: 'Dreapta', value: 'right' },
        { label: 'Stanga', value: 'left' },
      ],
    },
    ctaButtonFields(),
    backgroundColorField({ showDescriptions: true }),
  ],
}
