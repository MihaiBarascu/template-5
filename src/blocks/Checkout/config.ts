import type { Block } from 'payload'

export const CheckoutBlock: Block = {
  slug: 'checkout',
  labels: {
    singular: 'Checkout',
    plural: 'Checkout',
  },
  imageURL: '/blocks/checkout.png',
  fields: [
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'full',
      options: [
        { label: 'Full page', value: 'full' },
        { label: 'Compact', value: 'compact' },
      ],
    },
    {
      name: 'heading',
      type: 'text',
      label: 'Titlu sectiune',
      defaultValue: 'Finalizare comanda',
    },
    {
      name: 'showOrderSummary',
      type: 'checkbox',
      label: 'Afiseaza sumar comanda',
      defaultValue: true,
    },
    {
      name: 'showShippingOptions',
      type: 'checkbox',
      label: 'Afiseaza optiuni livrare',
      defaultValue: true,
    },
    {
      name: 'showPaymentOptions',
      type: 'checkbox',
      label: 'Afiseaza optiuni plata',
      defaultValue: true,
    },
    {
      name: 'submitButtonText',
      type: 'text',
      label: 'Text buton plasare comanda',
      defaultValue: 'Plaseaza comanda',
    },
    {
      name: 'successMessage',
      type: 'textarea',
      label: 'Mesaj succes',
      defaultValue: 'Multumim pentru comanda! Vei primi un email de confirmare.',
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
      ],
    },
  ],
}
