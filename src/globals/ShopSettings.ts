import type { GlobalConfig } from 'payload'
import { authenticated } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidateGlobal'

export const ShopSettings: GlobalConfig = {
  slug: 'shop-settings',
  label: 'Setari Magazin',
  access: {
    read: () => true,
    update: authenticated,
  },
  hooks: {
    afterChange: [revalidateGlobal],
  },
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
          label: 'TVA',
          fields: [
            {
              name: 'vatEnabled',
              type: 'checkbox',
              label: 'Activare TVA',
              defaultValue: true,
              admin: {
                description: 'Activeaza calculul si afisarea TVA pe site',
              },
            },
            {
              name: 'pricesIncludeVat',
              type: 'checkbox',
              label: 'Preturile introduse includ TVA',
              defaultValue: true,
              admin: {
                description: 'RECOMANDAT pentru B2C Romania: ON. Preturile introduse in admin sunt preturile finale (cu TVA inclus) afisate clientilor.',
              },
            },
            {
              name: 'displayPricesWithVat',
              type: 'checkbox',
              label: 'Afiseaza preturi cu TVA inclus',
              defaultValue: true,
              admin: {
                description: 'Pentru B2C (clienti persoane fizice) este obligatoriu sa afisezi pretul final cu TVA',
              },
            },
            {
              name: 'vatRates',
              type: 'group',
              label: 'Cote TVA',
              admin: {
                description: 'Cotele TVA aplicabile in Romania (din august 2025)',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'standard',
                      type: 'number',
                      label: 'Cota standard (%)',
                      defaultValue: 21,
                      required: true,
                      min: 0,
                      max: 100,
                      admin: {
                        width: '33%',
                        description: 'TVA standard Romania: 21%',
                      },
                    },
                    {
                      name: 'reduced',
                      type: 'number',
                      label: 'Cota redusa (%)',
                      defaultValue: 11,
                      required: true,
                      min: 0,
                      max: 100,
                      admin: {
                        width: '33%',
                        description: 'TVA redus Romania: 11%',
                      },
                    },
                    {
                      name: 'zero',
                      type: 'number',
                      label: 'Scutit TVA (%)',
                      defaultValue: 0,
                      admin: {
                        width: '33%',
                        description: 'Pentru produse scutite',
                        readOnly: true,
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: 'defaultVatRate',
              type: 'select',
              label: 'Cota TVA implicita',
              defaultValue: 'standard',
              options: [
                { label: 'Standard (21%)', value: 'standard' },
                { label: 'Redusa (11%)', value: 'reduced' },
                { label: 'Scutit (0%)', value: 'zero' },
              ],
              admin: {
                description: 'Cota aplicata produselor fara categorie TVA specificata',
              },
            },
            {
              name: 'showVatBreakdown',
              type: 'checkbox',
              label: 'Afiseaza detalii TVA in cos/checkout',
              defaultValue: true,
              admin: {
                description: 'Afiseaza subtotal, TVA si total separat',
              },
            },
            {
              name: 'vatNumber',
              type: 'text',
              label: 'Cod fiscal (CUI/CIF)',
              admin: {
                description: 'Codul fiscal al firmei pentru facturi',
              },
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
