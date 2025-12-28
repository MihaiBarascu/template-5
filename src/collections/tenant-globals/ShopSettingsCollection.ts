import type { CollectionConfig } from 'payload'
import { superAdminOrTenantAdminAccess } from '@/access/multiTenant'
import { createTenantRevalidateHook } from '@/hooks/revalidateTenantGlobal'

/**
 * ShopSettings Collection (converted from Global)
 * Each tenant has their own shop settings (currency, VAT, shipping, payments).
 */
export const ShopSettingsCollection: CollectionConfig = {
  slug: 'tenant-shop-settings',
  labels: {
    singular: 'Setari Magazin',
    plural: 'Setari Magazin',
  },
  admin: {
    useAsTitle: 'shopName',
    group: 'Shop',
    description: 'Moneda, TVA, livrare, plati',
    defaultColumns: ['tenant', 'enabled', 'currency', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: superAdminOrTenantAdminAccess,
    update: superAdminOrTenantAdminAccess,
    delete: superAdminOrTenantAdminAccess,
  },
  hooks: {
    afterChange: [createTenantRevalidateHook('tenant-shop-settings')],
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
            },
            {
              name: 'pricesIncludeVat',
              type: 'checkbox',
              label: 'Preturile introduse includ TVA',
              defaultValue: true,
              admin: {
                description: 'RECOMANDAT pentru B2C Romania: ON',
              },
            },
            {
              name: 'displayPricesWithVat',
              type: 'checkbox',
              label: 'Afiseaza preturi cu TVA inclus',
              defaultValue: true,
            },
            {
              name: 'vatRates',
              type: 'group',
              label: 'Cote TVA',
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
                      admin: { width: '33%' },
                    },
                    {
                      name: 'reduced',
                      type: 'number',
                      label: 'Cota redusa (%)',
                      defaultValue: 11,
                      required: true,
                      min: 0,
                      max: 100,
                      admin: { width: '33%' },
                    },
                    {
                      name: 'zero',
                      type: 'number',
                      label: 'Scutit TVA (%)',
                      defaultValue: 0,
                      admin: { width: '33%', readOnly: true },
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
            },
            {
              name: 'showVatBreakdown',
              type: 'checkbox',
              label: 'Afiseaza detalii TVA in cos/checkout',
              defaultValue: true,
            },
            {
              name: 'vatNumber',
              type: 'text',
              label: 'Cod fiscal (CUI/CIF)',
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
                description: 'Lasa gol pentru fara minim',
              },
            },
            {
              name: 'freeShippingThreshold',
              type: 'number',
              label: 'Transport Gratuit de la (RON)',
            },
            {
              name: 'shippingCost',
              type: 'number',
              label: 'Cost Transport Standard (RON)',
              defaultValue: 20,
            },
            {
              name: 'shippingMethods',
              type: 'array',
              label: 'Metode de Livrare',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'id', type: 'text', label: 'ID (unic)', required: true, admin: { width: '30%' } },
                    { name: 'enabled', type: 'checkbox', label: 'Activ', defaultValue: true, admin: { width: '20%' } },
                  ],
                },
                { name: 'label', type: 'text', label: 'Nume afisat', required: true },
                { name: 'deliveryTime', type: 'text', label: 'Timp livrare' },
                {
                  type: 'row',
                  fields: [
                    { name: 'price', type: 'number', label: 'Pret (RON)', required: true, defaultValue: 0, admin: { width: '50%' } },
                    { name: 'freeAbove', type: 'number', label: 'Gratuit peste (RON)', admin: { width: '50%' } },
                  ],
                },
              ],
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
                { name: 'enabled', type: 'checkbox', label: 'Activ', defaultValue: true },
                { name: 'instructions', type: 'textarea', label: 'Instructiuni' },
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
            },
            {
              name: 'sendCustomerConfirmation',
              type: 'checkbox',
              label: 'Trimite Confirmare Client',
              defaultValue: true,
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
            { name: 'addToCartText', type: 'text', label: 'Text Buton Adauga in Cos', defaultValue: 'Adauga in cos' },
            { name: 'viewCartText', type: 'text', label: 'Text Buton Vezi Cos', defaultValue: 'Vezi cosul' },
            { name: 'checkoutText', type: 'text', label: 'Text Buton Finalizeaza', defaultValue: 'Finalizeaza comanda' },
            { name: 'emptyCartMessage', type: 'text', label: 'Mesaj Cos Gol', defaultValue: 'Cosul tau este gol' },
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
  timestamps: true,
}
