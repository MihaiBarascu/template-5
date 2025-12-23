import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, advancedSettingsGroup } from '../_shared/commonFields'
import { teamSourceFields } from '../_shared/collectionSourceFields'

export const TeamBlock: Block = {
  slug: 'team',
  interfaceName: 'TeamBlock',
  labels: {
    singular: 'Echipa',
    plural: 'Echipa',
  },
  imageURL: '/blocks/team.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'grid',
      options: [
        { label: 'Grid carduri', value: 'grid' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Featured (profil mare)', value: 'featured' },
      ],
    },
    ...headingFields({ headingDefault: 'Echipa noastra' }),
    // Collection fields (limit, onlyFeatured)
    ...teamSourceFields(),
    // === ADVANCED SETTINGS (collapsible) ===
    advancedSettingsGroup({
      label: 'Setari avansate',
      fields: [
        {
          name: 'detailBasePath',
          type: 'text',
          label: 'Calea paginii de detalii',
          admin: {
            description: 'Ex: /echipa - permite click pe card pentru a vedea profilul complet',
          },
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
    }),
    // Section wrapper fields
    ...sectionWrapperFields,
  ],
}
