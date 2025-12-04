import type { Block } from 'payload'

export const CartBlock: Block = {
  slug: 'cart',
  labels: {
    singular: 'Cos de cumparaturi',
    plural: 'Cos de cumparaturi',
  },
  imageURL: '/blocks/cart.svg',
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
      defaultValue: 'Cosul tau de cumparaturi',
    },
    {
      name: 'showQuantitySelector',
      type: 'checkbox',
      label: 'Afiseaza selector cantitate',
      defaultValue: true,
    },
    {
      name: 'showRemoveButton',
      type: 'checkbox',
      label: 'Afiseaza buton stergere',
      defaultValue: true,
    },
    {
      name: 'showSubtotal',
      type: 'checkbox',
      label: 'Afiseaza subtotal',
      defaultValue: true,
    },
    {
      name: 'checkoutButtonText',
      type: 'text',
      label: 'Text buton checkout',
      defaultValue: 'Finalizeaza comanda',
    },
    {
      name: 'checkoutLink',
      type: 'text',
      label: 'Link checkout',
      defaultValue: '/checkout',
    },
    {
      name: 'emptyCartMessage',
      type: 'text',
      label: 'Mesaj cos gol',
      defaultValue: 'Cosul tau este gol.',
    },
    {
      name: 'continueShoppingLink',
      type: 'text',
      label: 'Link continua cumparaturile',
      defaultValue: '/produse',
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
