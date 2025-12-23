import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import {
  headingFields,
  ctaButtonFields,
  displayOptionsGroup,
  advancedSettingsGroup,
} from '../_shared/commonFields'
import { portfolioSourceFields } from '../_shared/collectionSourceFields'

export const PortfolioBlock: Block = {
  slug: 'portfolio',
  interfaceName: 'PortfolioBlock',
  labels: {
    singular: 'Portofoliu',
    plural: 'Portofoliu',
  },
  imageURL: '/blocks/portfolio.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'grid-masonry',
      options: [
        { label: 'Grid masonry', value: 'grid-masonry' },
        { label: 'Grid uniform', value: 'grid-uniform' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Cu filtre pe categorii', value: 'filterable' },
        { label: 'Cu lightbox', value: 'lightbox' },
        { label: 'Case studies (carduri mari)', value: 'case-studies' },
      ],
    },
    ...headingFields({ headingDefault: 'Proiectele noastre' }),
    // Collection source fields
    ...portfolioSourceFields(),
    // === DISPLAY OPTIONS (collapsible) ===
    displayOptionsGroup({
      label: 'Optiuni afisare',
      collapsed: true,
      fields: [
        {
          name: 'showDescription',
          type: 'checkbox',
          label: 'Afiseaza descriere',
          defaultValue: true,
        },
        {
          name: 'showClient',
          type: 'checkbox',
          label: 'Afiseaza client',
          defaultValue: false,
        },
        {
          name: 'columns',
          type: 'select',
          label: 'Coloane',
          defaultValue: '3',
          options: [
            { label: '2 coloane', value: '2' },
            { label: '3 coloane', value: '3' },
            { label: '4 coloane', value: '4' },
          ],
        },
      ],
    }),
    // CTA Button
    ctaButtonFields({ defaultLabel: 'Vezi toate proiectele', groupLabel: 'Buton CTA' }),
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
