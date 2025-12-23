import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, displayOptionsGroup, advancedSettingsGroup } from '../_shared/commonFields'

export const PricingKitsBlock: Block = {
  slug: 'pricing-kits',
  interfaceName: 'PricingKitsBlock',
  labels: {
    singular: 'Pricing Kits',
    plural: 'Pricing Kits',
  },
  imageURL: '/blocks/pricing-kits.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'cards',
      options: [
        { label: 'Carduri clasice', value: 'cards' },
        { label: 'Carduri cu imagine', value: 'cards-image' },
        { label: 'Compacte (tabel)', value: 'compact' },
      ],
    },
    ...headingFields(),
    {
      name: 'kits',
      type: 'array',
      label: 'Pachete / Kituri',
      minRows: 1,
      maxRows: 4,
      fields: [
        {
          name: 'name',
          type: 'text',
          label: 'Nume pachet',
          required: true,
        },
        {
          name: 'price',
          type: 'number',
          label: 'Pret',
          required: true,
        },
        {
          name: 'priceLabel',
          type: 'text',
          label: 'Eticheta pret',
          defaultValue: 'lei',
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Descriere scurta',
        },
        {
          name: 'features',
          type: 'array',
          label: 'Caracteristici incluse',
          fields: [
            {
              name: 'text',
              type: 'text',
              label: 'Caracteristica',
              required: true,
            },
          ],
        },
        {
          name: 'badge',
          type: 'select',
          label: 'Badge',
          defaultValue: 'none',
          options: [
            { label: 'Fara', value: 'none' },
            { label: 'Popular', value: 'popular' },
            { label: 'Recomandat', value: 'recommended' },
          ],
        },
        {
          name: 'cta',
          type: 'group',
          label: 'Buton CTA',
          fields: [
            {
              name: 'label',
              type: 'text',
              label: 'Text buton',
              defaultValue: 'Comanda',
            },
            {
              name: 'link',
              type: 'text',
              label: 'Link',
              required: true,
            },
          ],
        },
        {
          name: 'highlighted',
          type: 'checkbox',
          label: 'Evidentiat',
          defaultValue: false,
        },
      ],
    },
    // === DISPLAY OPTIONS (collapsible) ===
    displayOptionsGroup({
      label: 'Optiuni afisare',
      collapsed: true,
      fields: [
        {
          name: 'columns',
          type: 'select',
          label: 'Numar coloane',
          defaultValue: 'auto',
          options: [
            { label: 'Auto', value: 'auto' },
            { label: '2 coloane', value: '2' },
            { label: '3 coloane', value: '3' },
          ],
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
          defaultValue: 'light',
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
