import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import {
  headingFields,
  ctaButtonFields,
  allIconOptions,
  displayOptionsGroup,
  advancedSettingsGroup,
} from '../_shared/commonFields'

export const ProcessStepsBlock: Block = {
  slug: 'process-steps',
  interfaceName: 'ProcessStepsBlock',
  labels: {
    singular: 'Pasi Proces',
    plural: 'Pasi Proces',
  },
  imageURL: '/blocks/process-steps.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
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
      ],
    },
    // === DISPLAY OPTIONS (collapsible) ===
    displayOptionsGroup({
      label: 'Optiuni afisare',
      collapsed: true,
      fields: [
        {
          name: 'showNumbers',
          type: 'checkbox',
          label: 'Afiseaza numerele pasilor',
          defaultValue: true,
        },
        {
          name: 'showConnectors',
          type: 'checkbox',
          label: 'Afiseaza linii conectoare',
          defaultValue: true,
        },
        {
          name: 'imagePosition',
          type: 'select',
          label: 'Pozitie imagine pentru primul pas',
          defaultValue: 'right',
          admin: {
            condition: (_, siblingData) => siblingData?.variant === 'zigzag',
          },
          options: [
            { label: 'Dreapta', value: 'right' },
            { label: 'Stanga', value: 'left' },
          ],
        },
      ],
    }),
    // CTA Button
    ctaButtonFields(),
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
            { label: 'Primary', value: 'primary' },
          ],
        },
      ],
    }),
    // Section wrapper fields
    ...sectionWrapperFields,
  ],
}
