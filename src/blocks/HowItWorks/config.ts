import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import {
  headingFields,
  ctaButtonFields,
  allIconOptions,
  displayOptionsGroup,
  advancedSettingsGroup,
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
    // === ESSENTIAL FIELDS ===
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
