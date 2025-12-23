import type { GlobalConfig } from 'payload'

export const SystemPages: GlobalConfig = {
  slug: 'system-pages',
  label: 'Pagini Sistem',
  admin: {
    group: 'Setari Site',
    description: 'Configurare pagini sistem (produse, cos, checkout)',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // TAB 1: PAGINA PRODUSE
        {
          label: 'Produse',
          description: 'Setari pentru pagina /produse',
          fields: [
            {
              name: 'productsPage',
              type: 'group',
              fields: [
                // Header
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titlu pagina',
                  defaultValue: 'Produsele Noastre',
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Descriere',
                  defaultValue: 'Descopera intreaga gama de produse',
                },
                // Display
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'productsPerPage',
                      type: 'number',
                      label: 'Produse per pagina',
                      defaultValue: 24,
                      min: 4,
                      max: 100,
                      admin: { width: '50%' },
                    },
                    {
                      name: 'gridColumns',
                      type: 'select',
                      label: 'Coloane grid (desktop)',
                      defaultValue: '4',
                      options: [
                        { label: '2 coloane', value: '2' },
                        { label: '3 coloane', value: '3' },
                        { label: '4 coloane', value: '4' },
                      ],
                      admin: { width: '50%' },
                    },
                  ],
                },
                // Sorting
                {
                  name: 'defaultSort',
                  type: 'select',
                  label: 'Sortare implicita',
                  defaultValue: 'newest',
                  options: [
                    { label: 'Cele mai noi', value: 'newest' },
                    { label: 'Pret: mic la mare', value: 'price_asc' },
                    { label: 'Pret: mare la mic', value: 'price_desc' },
                    { label: 'Nume: A-Z', value: 'name_asc' },
                    { label: 'Nume: Z-A', value: 'name_desc' },
                  ],
                },
                // Features
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'showFilters',
                      type: 'checkbox',
                      label: 'Afiseaza filtre',
                      defaultValue: true,
                      admin: { width: '33%' },
                    },
                    {
                      name: 'showSearch',
                      type: 'checkbox',
                      label: 'Afiseaza cautare',
                      defaultValue: true,
                      admin: { width: '33%' },
                    },
                    {
                      name: 'showSort',
                      type: 'checkbox',
                      label: 'Afiseaza sortare',
                      defaultValue: true,
                      admin: { width: '33%' },
                    },
                  ],
                },
                // Filter options
                {
                  name: 'filterOptions',
                  type: 'group',
                  label: 'Optiuni filtre',
                  admin: {
                    condition: (data, siblingData) => siblingData?.showFilters,
                  },
                  fields: [
                    {
                      type: 'row',
                      fields: [
                        {
                          name: 'showCategoryFilter',
                          type: 'checkbox',
                          label: 'Filtru categorii',
                          defaultValue: true,
                          admin: { width: '33%' },
                        },
                        {
                          name: 'showPriceFilter',
                          type: 'checkbox',
                          label: 'Filtru pret',
                          defaultValue: true,
                          admin: { width: '33%' },
                        },
                        {
                          name: 'showStockFilter',
                          type: 'checkbox',
                          label: 'Filtru stoc',
                          defaultValue: true,
                          admin: { width: '33%' },
                        },
                      ],
                    },
                  ],
                },
                // SEO
                {
                  name: 'seo',
                  type: 'group',
                  label: 'SEO',
                  fields: [
                    {
                      name: 'metaTitle',
                      type: 'text',
                      label: 'Meta Title',
                      defaultValue: 'Produse | {siteName}',
                      admin: {
                        description: 'Foloseste {siteName} pentru numele site-ului',
                      },
                    },
                    {
                      name: 'metaDescription',
                      type: 'textarea',
                      label: 'Meta Description',
                      defaultValue: 'Descopera toate produsele noastre. Livrare rapida, preturi competitive.',
                    },
                  ],
                },
              ],
            },
          ],
        },
        // TAB 2: LABELS/TEXTE
        {
          label: 'Texte',
          description: 'Texte si etichete pentru interfata',
          fields: [
            {
              name: 'labels',
              type: 'group',
              fields: [
                // Filters
                {
                  name: 'filtersTitle',
                  type: 'text',
                  label: 'Titlu sectiune filtre',
                  defaultValue: 'Filtre',
                },
                {
                  name: 'categoriesTitle',
                  type: 'text',
                  label: 'Titlu filtre categorii',
                  defaultValue: 'Categorii',
                },
                {
                  name: 'priceTitle',
                  type: 'text',
                  label: 'Titlu filtru pret',
                  defaultValue: 'Pret',
                },
                {
                  name: 'stockTitle',
                  type: 'text',
                  label: 'Titlu filtru stoc',
                  defaultValue: 'Disponibilitate',
                },
                {
                  name: 'inStockLabel',
                  type: 'text',
                  label: 'Label "In stoc"',
                  defaultValue: 'Doar produse in stoc',
                },
                // Sort
                {
                  name: 'sortLabel',
                  type: 'text',
                  label: 'Label sortare',
                  defaultValue: 'Sorteaza:',
                },
                // Results
                {
                  name: 'resultsText',
                  type: 'text',
                  label: 'Text rezultate',
                  defaultValue: 'Afisam {count} din {total} produse',
                  admin: {
                    description: 'Placeholders: {count}, {total}',
                  },
                },
                {
                  name: 'noResultsText',
                  type: 'text',
                  label: 'Text fara rezultate',
                  defaultValue: 'Nu am gasit produse care sa corespunda filtrelor.',
                },
                {
                  name: 'clearFiltersText',
                  type: 'text',
                  label: 'Text sterge filtre',
                  defaultValue: 'Sterge toate filtrele',
                },
                // Search
                {
                  name: 'searchPlaceholder',
                  type: 'text',
                  label: 'Placeholder cautare',
                  defaultValue: 'Cauta produse...',
                },
                // Mobile
                {
                  name: 'mobileFiltersButton',
                  type: 'text',
                  label: 'Buton filtre mobile',
                  defaultValue: 'Filtre',
                },
                {
                  name: 'mobileApplyFilters',
                  type: 'text',
                  label: 'Buton aplica filtre mobile',
                  defaultValue: 'Aplica filtre',
                },
              ],
            },
          ],
        },
        // TAB 3: PAGINA COS (pentru viitor)
        {
          label: 'Cos',
          description: 'Setari pentru pagina /cos',
          fields: [
            {
              name: 'cartPage',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titlu pagina',
                  defaultValue: 'Cosul tau',
                },
                {
                  name: 'emptyCartMessage',
                  type: 'text',
                  label: 'Mesaj cos gol',
                  defaultValue: 'Cosul tau este gol.',
                },
                {
                  name: 'continueShoppingText',
                  type: 'text',
                  label: 'Text continua cumparaturile',
                  defaultValue: 'Continua cumparaturile',
                },
                {
                  name: 'continueShoppingLink',
                  type: 'text',
                  label: 'Link continua cumparaturile',
                  defaultValue: '/produse',
                },
              ],
            },
          ],
        },
        // TAB 4: PAGINA CHECKOUT (pentru viitor)
        {
          label: 'Checkout',
          description: 'Setari pentru pagina /checkout',
          fields: [
            {
              name: 'checkoutPage',
              type: 'group',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Titlu pagina',
                  defaultValue: 'Finalizare comanda',
                },
                {
                  name: 'successMessage',
                  type: 'textarea',
                  label: 'Mesaj succes',
                  defaultValue: 'Multumim pentru comanda! Vei primi un email de confirmare.',
                },
              ],
            },
          ],
        },
        // TAB 5: PAGINI CONT
        {
          label: 'Cont',
          description: 'Setari pentru paginile de cont utilizator',
          fields: [
            {
              name: 'accountPages',
              type: 'group',
              fields: [
                // Dashboard
                {
                  name: 'dashboardTitle',
                  type: 'text',
                  label: 'Titlu Dashboard',
                  defaultValue: 'Contul meu',
                },
                {
                  name: 'dashboardDescription',
                  type: 'text',
                  label: 'Descriere Dashboard',
                  defaultValue: 'Bine ai revenit! Gestioneaza contul tau de aici.',
                },
                // Addresses
                {
                  name: 'addressesTitle',
                  type: 'text',
                  label: 'Titlu pagina Adrese',
                  defaultValue: 'Adresele mele',
                },
                {
                  name: 'addressesDescription',
                  type: 'text',
                  label: 'Descriere pagina Adrese',
                  defaultValue: 'Gestioneaza adresele tale de livrare si facturare salvate.',
                },
                // Orders
                {
                  name: 'ordersTitle',
                  type: 'text',
                  label: 'Titlu pagina Comenzi',
                  defaultValue: 'Comenzile mele',
                },
                {
                  name: 'ordersDescription',
                  type: 'text',
                  label: 'Descriere pagina Comenzi',
                  defaultValue: 'Vezi istoricul comenzilor tale.',
                },
                {
                  name: 'noOrdersMessage',
                  type: 'text',
                  label: 'Mesaj fara comenzi',
                  defaultValue: 'Nu ai nicio comanda inca.',
                },
                // Login
                {
                  name: 'loginTitle',
                  type: 'text',
                  label: 'Titlu pagina Login',
                  defaultValue: 'Autentificare',
                },
                {
                  name: 'loginDescription',
                  type: 'text',
                  label: 'Descriere Login',
                  defaultValue: 'Intra in contul tau pentru a vedea comenzile si adresele salvate.',
                },
                {
                  name: 'loginButton',
                  type: 'text',
                  label: 'Text buton Login',
                  defaultValue: 'Autentificare',
                },
                // Register
                {
                  name: 'registerTitle',
                  type: 'text',
                  label: 'Titlu pagina Inregistrare',
                  defaultValue: 'Creeaza cont',
                },
                {
                  name: 'registerDescription',
                  type: 'text',
                  label: 'Descriere Inregistrare',
                  defaultValue: 'Creeaza un cont pentru a beneficia de avantaje exclusive.',
                },
                {
                  name: 'registerButton',
                  type: 'text',
                  label: 'Text buton Inregistrare',
                  defaultValue: 'Creeaza cont',
                },
                // Sidebar menu labels
                {
                  name: 'menuDashboard',
                  type: 'text',
                  label: 'Menu: Dashboard',
                  defaultValue: 'Dashboard',
                },
                {
                  name: 'menuOrders',
                  type: 'text',
                  label: 'Menu: Comenzi',
                  defaultValue: 'Comenzile mele',
                },
                {
                  name: 'menuAddresses',
                  type: 'text',
                  label: 'Menu: Adrese',
                  defaultValue: 'Adrese',
                },
                {
                  name: 'menuLogout',
                  type: 'text',
                  label: 'Menu: Deconectare',
                  defaultValue: 'Deconectare',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
