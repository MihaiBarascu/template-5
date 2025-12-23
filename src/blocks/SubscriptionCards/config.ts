import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, ctaButtonFields, displayOptionsGroup, advancedSettingsGroup } from '../_shared/commonFields'
import { subscriptionsSourceFields } from '../_shared/collectionSourceFields'

export const SubscriptionCardsBlock: Block = {
  slug: 'subscriptionCards',
  interfaceName: 'SubscriptionCardsBlock',
  labels: {
    singular: 'Carduri Abonamente',
    plural: 'Carduri Abonamente',
  },
  imageURL: '/blocks/subscription-cards.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'cards-3',
      options: [
        { label: 'Cards 3 coloane', value: 'cards-3' },
        { label: 'Cards 4 coloane', value: 'cards-4' },
        { label: 'Cards cu imagine overlay', value: 'cards-overlay' },
        { label: 'Lista compacta', value: 'list-compact' },
        { label: 'Tabele comparatie', value: 'table-compare' },
      ],
    },
    ...headingFields(),
    // Collection source fields
    ...subscriptionsSourceFields(),
    {
      name: 'filterByType',
      type: 'select',
      label: 'Filtreaza dupa tip',
      options: [
        { label: 'Toate', value: 'all' },
        { label: 'Sala / GYM', value: 'gym' },
        { label: 'SPA', value: 'spa' },
        { label: 'Solar', value: 'solar' },
        { label: 'Fitness + SPA', value: 'fitness-spa' },
        { label: 'Clase', value: 'classes' },
        { label: 'Personal Training', value: 'personal' },
        { label: 'Premium', value: 'premium' },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'collection',
      },
    },
    // === DISPLAY OPTIONS (collapsible) ===
    displayOptionsGroup({
      label: 'Optiuni afisare',
      collapsed: true,
      fields: [
        {
          name: 'showImage',
          type: 'checkbox',
          label: 'Afiseaza imagine',
          defaultValue: false,
        },
        {
          name: 'showFeatures',
          type: 'checkbox',
          label: 'Afiseaza beneficii',
          defaultValue: true,
        },
        {
          name: 'showOldPrice',
          type: 'checkbox',
          label: 'Afiseaza pret vechi (reduceri)',
          defaultValue: true,
        },
        {
          name: 'highlightStyle',
          type: 'select',
          label: 'Stil highlight',
          defaultValue: 'border',
          options: [
            { label: 'Chenar colorat', value: 'border' },
            { label: 'Fundal colorat', value: 'background' },
            { label: 'Efect ridicat', value: 'elevated' },
            { label: 'Badge', value: 'badge' },
          ],
        },
      ],
    }),
    // CTA Button
    ctaButtonFields({ defaultLabel: 'Vezi toate abonamentele', groupLabel: 'Buton CTA global' }),
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
    // Section wrapper fields for advanced layout options
    ...sectionWrapperFields,
  ],
}
