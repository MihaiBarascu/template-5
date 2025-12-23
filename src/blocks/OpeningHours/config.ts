import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, advancedSettingsGroup } from '../_shared/commonFields'

export const OpeningHoursBlock: Block = {
  slug: 'openingHours',
  labels: {
    singular: 'Program Functionare',
    plural: 'Program Functionare',
  },
  interfaceName: 'OpeningHoursBlock',
  imageURL: '/blocks/opening-hours.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'simple',
      options: [
        { label: 'Simplu (lista)', value: 'simple' },
        { label: 'Cu imagine lateral', value: 'with-image' },
        { label: 'Card compact', value: 'card' },
        { label: 'Cu buton programare', value: 'with-cta' },
        { label: 'Inline (o singura linie)', value: 'inline' },
      ],
    },
    ...headingFields({ headingDefault: 'Program' }),
    {
      name: 'source',
      type: 'select',
      label: 'Sursa date',
      defaultValue: 'businessInfo',
      options: [
        { label: 'Din BusinessInfo (automat)', value: 'businessInfo' },
        { label: 'Custom', value: 'custom' },
      ],
    },
    {
      name: 'schedule',
      type: 'array',
      label: 'Program',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'custom',
      },
      fields: [
        {
          name: 'days',
          type: 'text',
          label: 'Zile',
          required: true,
          admin: { placeholder: 'Ex: Luni - Vineri' },
        },
        {
          name: 'hours',
          type: 'text',
          label: 'Ore',
          required: true,
          admin: { placeholder: 'Ex: 09:00 - 18:00' },
        },
      ],
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'with-image',
      },
    },
    // CTA Button - for 'with-cta' variant
    {
      name: 'ctaButton',
      type: 'group',
      label: 'Buton CTA',
      admin: {
        condition: (_, siblingData) => siblingData?.variant === 'with-cta',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          label: 'Text buton',
          defaultValue: 'Fa o programare',
        },
        {
          name: 'link',
          type: 'text',
          label: 'Link',
          defaultValue: '/contact',
        },
      ],
    },
    // === ADVANCED SETTINGS (collapsible) ===
    advancedSettingsGroup({
      label: 'Setari avansate',
      fields: [
        {
          name: 'showCurrentStatus',
          type: 'checkbox',
          label: 'Afiseaza status curent (Deschis/Inchis)',
          defaultValue: true,
        },
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
