import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, ctaButtonFields, displayOptionsGroup, advancedSettingsGroup } from '../_shared/commonFields'

export const PriceListDottedBlock: Block = {
  slug: 'priceListDotted',
  labels: {
    singular: 'Lista Preturi cu Puncte',
    plural: 'Liste Preturi',
  },
  interfaceName: 'PriceListDottedBlock',
  imageURL: '/blocks/price-list.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'single-column',
      options: [
        { label: 'O coloana', value: 'single-column' },
        { label: 'Doua coloane', value: 'two-columns' },
      ],
    },
    ...headingFields(),
    {
      name: 'source',
      type: 'select',
      label: 'Sursa date',
      defaultValue: 'services',
      options: [
        { label: 'Din Servicii', value: 'services' },
        { label: 'Lista custom', value: 'custom' },
      ],
    },
    {
      name: 'limit',
      type: 'number',
      label: 'Numar maxim servicii',
      defaultValue: 12,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'services',
      },
    },
    {
      name: 'items',
      type: 'array',
      label: 'Servicii',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'custom',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'name',
              type: 'text',
              label: 'Nume serviciu',
              required: true,
              admin: { width: '50%' },
            },
            {
              name: 'price',
              type: 'text',
              label: 'Pret',
              required: true,
              admin: { width: '25%' },
            },
            {
              name: 'duration',
              type: 'text',
              label: 'Durata',
              admin: { width: '25%' },
            },
          ],
        },
      ],
    },
    // CTA Button
    ctaButtonFields({ defaultLabel: 'Programeaza-te' }),
    // === DISPLAY OPTIONS (collapsible) ===
    displayOptionsGroup({
      label: 'Optiuni afisare',
      collapsed: true,
      fields: [
        {
          name: 'showDuration',
          type: 'checkbox',
          label: 'Afiseaza durata',
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
