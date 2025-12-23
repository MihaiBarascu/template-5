import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, ctaButtonFields, displayOptionsGroup, advancedSettingsGroup } from '../_shared/commonFields'
import { servicesSourceFields } from '../_shared/collectionSourceFields'

export const ServicesBlock: Block = {
  slug: 'services',
  interfaceName: 'ServicesBlock',
  labels: {
    singular: 'Servicii',
    plural: 'Servicii',
  },
  imageURL: '/blocks/services.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'grid-3',
      options: [
        { label: 'Grid 3 coloane', value: 'grid-3' },
        { label: 'Grid 2 coloane', value: 'grid-2' },
        { label: 'Lista', value: 'list' },
        { label: 'Lista alternata (imagine stanga/dreapta)', value: 'list-alternating' },
        { label: 'Lista preturi', value: 'price-list' },
      ],
    },
    ...headingFields(),
    // Collection fields (limit, filterByCategory, onlyFeatured)
    ...servicesSourceFields(),
    // === DISPLAY OPTIONS (collapsible) ===
    displayOptionsGroup({
      label: 'Optiuni afisare',
      collapsed: true,
      fields: [
        {
          name: 'showPrices',
          type: 'checkbox',
          label: 'Afiseaza preturi',
          defaultValue: true,
        },
        {
          name: 'showIcons',
          type: 'checkbox',
          label: 'Afiseaza iconite',
          defaultValue: true,
        },
      ],
    }),
    // CTA Button
    ctaButtonFields({ defaultLabel: 'Vezi toate serviciile' }),
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
