import type { GlobalConfig } from 'payload'

export const ShopSettings: GlobalConfig = {
  slug: 'shop-settings',
  label: 'Setari Magazin',
  admin: {
    group: 'Shop',
    description: 'Configureaza functionalitatea de magazin/cos cumparaturi',
  },
  fields: [
    {
      name: 'enabled',
      type: 'checkbox',
      label: 'Activare Magazin',
      defaultValue: false,
      admin: {
        description: 'Activeaza functionalitatea de magazin cu cos de cumparaturi',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            {
              name: 'shopName',
              type: 'text',
              label: 'Nume Magazin',
              admin: {
                description: 'Ex: Magazin Online, Shop, Produse',
              },
            },
            {
              name: 'currency',
              type: 'select',
              label: 'Moneda',
              defaultValue: 'RON',
              options: [
                { label: 'RON (Lei)', value: 'RON' },
                { label: 'EUR (Euro)', value: 'EUR' },
                { label: 'USD (Dolari)', value: 'USD' },
              ],
            },
            {
              name: 'currencySymbol',
              type: 'text',
              label: 'Simbol Moneda',
              defaultValue: 'lei',
              admin: {
                description: 'Ex: lei, €, $',
              },
            },
            {
              name: 'pricePosition',
              type: 'radio',
              label: 'Pozitie Pret',
              defaultValue: 'after',
              options: [
                { label: 'Inainte (€100)', value: 'before' },
                { label: 'Dupa (100 lei)', value: 'after' },
              ],
            },
          ],
        },
        {
          label: 'Comanda',
          fields: [
            {
              name: 'orderMinimum',
              type: 'number',
              label: 'Comanda Minima (RON)',
              admin: {
                description: 'Valoarea minima pentru a putea plasa comanda. Lasa gol pentru fara minim.',
              },
            },
            {
              name: 'freeShippingThreshold',
              type: 'number',
              label: 'Transport Gratuit de la (RON)',
              admin: {
                description: 'Valoarea de la care transportul devine gratuit. Lasa gol daca nu se aplica.',
              },
            },
            {
              name: 'shippingCost',
              type: 'number',
              label: 'Cost Transport Standard (RON)',
              defaultValue: 20,
            },
            {
              name: 'paymentMethods',
              type: 'array',
              label: 'Metode de Plata',
              fields: [
                {
                  name: 'method',
                  type: 'select',
                  label: 'Metoda',
                  required: true,
                  options: [
                    { label: 'Ramburs (la livrare)', value: 'cod' },
                    { label: 'Card Online (Stripe)', value: 'stripe' },
                    { label: 'Transfer Bancar', value: 'bank' },
                  ],
                },
                {
                  name: 'enabled',
                  type: 'checkbox',
                  label: 'Activ',
                  defaultValue: true,
                },
                {
                  name: 'instructions',
                  type: 'textarea',
                  label: 'Instructiuni',
                  admin: {
                    description: 'Instructiuni afisate clientului pentru aceasta metoda',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Notificari',
          fields: [
            {
              name: 'orderNotificationEmail',
              type: 'email',
              label: 'Email Notificare Comenzi',
              admin: {
                description: 'Adresa unde primesti notificari pentru comenzi noi',
              },
            },
            {
              name: 'sendCustomerConfirmation',
              type: 'checkbox',
              label: 'Trimite Confirmare Client',
              defaultValue: true,
              admin: {
                description: 'Trimite email de confirmare automat catre client',
              },
            },
            {
              name: 'confirmationEmailSubject',
              type: 'text',
              label: 'Subiect Email Confirmare',
              defaultValue: 'Comanda ta a fost inregistrata',
            },
          ],
        },
        {
          label: 'Texte',
          fields: [
            {
              name: 'addToCartText',
              type: 'text',
              label: 'Text Buton Adauga in Cos',
              defaultValue: 'Adauga in cos',
            },
            {
              name: 'viewCartText',
              type: 'text',
              label: 'Text Buton Vezi Cos',
              defaultValue: 'Vezi cosul',
            },
            {
              name: 'checkoutText',
              type: 'text',
              label: 'Text Buton Finalizeaza',
              defaultValue: 'Finalizeaza comanda',
            },
            {
              name: 'emptyCartMessage',
              type: 'text',
              label: 'Mesaj Cos Gol',
              defaultValue: 'Cosul tau este gol',
            },
            {
              name: 'orderSuccessMessage',
              type: 'textarea',
              label: 'Mesaj Succes Comanda',
              defaultValue: 'Multumim pentru comanda! Vei primi un email de confirmare in curand.',
            },
          ],
        },
      ],
    },
  ],
}
