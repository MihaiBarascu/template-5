import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, ctaButtonFields, advancedSettingsGroup } from '../_shared/commonFields'
import { productsSourceFields } from '../_shared/collectionSourceFields'

export const ProductsBlock: Block = {
  slug: 'products',
  interfaceName: 'ProductsBlock',
  labels: {
    singular: 'Produse',
    plural: 'Produse',
  },
  imageURL: '/blocks/products.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'grid-4',
      options: [
        { label: 'Grid 4 coloane', value: 'grid-4' },
        { label: 'Grid 3 coloane', value: 'grid-3' },
        { label: 'Carousel', value: 'carousel' },
      ],
    },
    ...headingFields({ headingDefault: 'Produsele noastre' }),
    // Collection fields (limit, filterByCategory, onlyFeatured)
    ...productsSourceFields(),
    // CTA Button
    ctaButtonFields({ defaultLabel: 'Vezi toate produsele' }),
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
