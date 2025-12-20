import type { Block } from 'payload'
import {
  backgroundColorField,
  allIconOptions,
  showDescriptionsField,
  iconSizeField,
} from '../_shared/commonFields'

export const TrustBadgesBlock: Block = {
  slug: 'trust-badges',
  interfaceName: 'TrustBadgesBlock',
  labels: {
    singular: 'Trust Badges',
    plural: 'Trust Badges',
  },
  imageURL: '/blocks/trust-badges.svg',
  fields: [
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
        { label: 'Minimal (doar iconite)', value: 'minimal' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      admin: {
        description: 'Optional - lasa gol pentru a afisa doar badge-urile',
      },
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
        description: 'Alege badge-urile pe care vrei sa le afisezi',
      },
      options: [
        { label: 'Livrare gratuita', value: 'free-shipping' },
        { label: 'Livrare rapida 24h', value: 'fast-shipping' },
        { label: 'Retur 30 zile', value: 'return-30' },
        { label: 'Retur 14 zile', value: 'return-14' },
        { label: 'Plata securizata', value: 'secure-payment' },
        { label: 'Garantie', value: 'warranty' },
        { label: 'Suport 24/7', value: 'support-24-7' },
        { label: 'Calitate garantata', value: 'quality' },
        { label: 'Pret corect', value: 'fair-price' },
        { label: 'Transport gratuit peste X lei', value: 'free-shipping-threshold' },
        { label: 'Experienta de peste X ani', value: 'experience-years' },
        { label: 'Clienti multumiti', value: 'happy-customers' },
        { label: 'Produse romanesti', value: 'romanian-products' },
        { label: 'Eco-friendly', value: 'eco-friendly' },
        { label: 'Consultatie gratuita', value: 'free-consultation' },
        { label: 'Programare online', value: 'online-booking' },
      ],
    },
    {
      name: 'customValues',
      type: 'group',
      label: 'Valori personalizate',
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'preset',
        description: 'Completeaza valorile pentru badge-urile selectate (daca e cazul)',
      },
      fields: [
        {
          name: 'shippingThreshold',
          type: 'number',
          label: 'Transport gratuit de la (lei)',
          defaultValue: 150,
        },
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
        {
          name: 'warrantyPeriod',
          type: 'text',
          label: 'Perioada garantie',
          defaultValue: '2 ani',
        },
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
    {
      name: 'showDescriptions',
      type: 'checkbox',
      label: 'Afiseaza descrierile',
      defaultValue: true,
      admin: {
        description: 'Debifati pentru a afisa doar iconitele si titlurile',
      },
    },
    iconSizeField,
    backgroundColorField({ includeTransparent: true, defaultValue: 'light' }),
  ],
}
