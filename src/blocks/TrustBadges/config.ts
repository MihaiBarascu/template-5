import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { allIconOptions, displayOptionsGroup, advancedSettingsGroup } from '../_shared/commonFields'

export const TrustBadgesBlock: Block = {
  slug: 'trust-badges',
  interfaceName: 'TrustBadgesBlock',
  labels: {
    singular: 'Trust Badges',
    plural: 'Trust Badges',
  },
  imageURL: '/blocks/trust-badges.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'bar',
      options: [
        { label: 'Bara orizontala', value: 'bar' },
        { label: 'Grid 3 coloane', value: 'grid-3' },
        { label: 'Grid 4 coloane', value: 'grid-4' },
        { label: 'Iconite inline', value: 'inline' },
        { label: 'Carduri cu fundal', value: 'cards' },
        { label: 'Minimal', value: 'minimal' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
    },
    {
      name: 'source',
      type: 'select',
      label: 'Sursa date',
      defaultValue: 'preset',
      options: [
        { label: 'Preset-uri comune', value: 'preset' },
        { label: 'Continut custom', value: 'custom' },
      ],
    },
    {
      name: 'presets',
      type: 'select',
      label: 'Selecteaza badge-uri',
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'preset',
      },
      options: [
        { label: 'Livrare gratuita', value: 'free-shipping' },
        { label: 'Livrare rapida 24h', value: 'fast-shipping' },
        { label: 'Retur 30 zile', value: 'return-30' },
        { label: 'Plata securizata', value: 'secure-payment' },
        { label: 'Garantie', value: 'warranty' },
        { label: 'Suport 24/7', value: 'support-24-7' },
        { label: 'Calitate garantata', value: 'quality' },
        { label: 'Experienta de peste X ani', value: 'experience-years' },
        { label: 'Clienti multumiti', value: 'happy-customers' },
        { label: 'Consultatie gratuita', value: 'free-consultation' },
        { label: 'Programare online', value: 'online-booking' },
        { label: 'Non-invaziv', value: 'non-invasive' },
        { label: 'Tehnica patentata', value: 'patented' },
        { label: 'Certificat international', value: 'certified' },
        { label: 'Garantie 30 zile', value: 'money-back-30' },
      ],
    },
    {
      name: 'badges',
      type: 'array',
      label: 'Badge-uri custom',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'custom',
      },
      fields: [
        {
          name: 'icon',
          type: 'select',
          label: 'Iconita',
          required: true,
          options: allIconOptions,
        },
        {
          name: 'title',
          type: 'text',
          label: 'Titlu',
          required: true,
        },
        {
          name: 'description',
          type: 'text',
          label: 'Descriere scurta',
        },
      ],
    },
    // === DISPLAY OPTIONS (collapsible) ===
    displayOptionsGroup({
      label: 'Optiuni afisare',
      collapsed: true,
      fields: [
        {
          name: 'showDescriptions',
          type: 'checkbox',
          label: 'Afiseaza descrierile',
          defaultValue: true,
        },
        {
          name: 'iconSize',
          type: 'select',
          label: 'Dimensiune iconite',
          defaultValue: 'medium',
          options: [
            { label: 'Mica', value: 'small' },
            { label: 'Medie', value: 'medium' },
            { label: 'Mare', value: 'large' },
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
            { label: 'Transparent', value: 'transparent' },
          ],
        },
        {
          name: 'customValues',
          type: 'group',
          label: 'Valori personalizate',
          admin: {
            condition: (_, siblingData) => siblingData?.source === 'preset',
          },
          fields: [
            {
              name: 'experienceYears',
              type: 'number',
              label: 'Ani de experienta',
              defaultValue: 10,
            },
            {
              name: 'happyCustomersCount',
              type: 'text',
              label: 'Numar clienti multumiti',
              defaultValue: '5000+',
            },
          ],
        },
      ],
    }),
    // Section wrapper fields
    ...sectionWrapperFields,
  ],
}
