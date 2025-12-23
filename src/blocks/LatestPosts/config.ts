import type { Block } from 'payload'
import { sectionWrapperFields } from '../_shared/sectionWrapperFields'
import { headingFields, ctaButtonFields, advancedSettingsGroup } from '../_shared/commonFields'
import { postsSourceFields } from '../_shared/collectionSourceFields'

/**
 * LatestPosts Block - Displays latest blog posts
 * All post info (image, excerpt, date, category) is shown automatically
 */
export const LatestPostsBlock: Block = {
  slug: 'latestPosts',
  interfaceName: 'LatestPostsBlock',
  labels: {
    singular: 'Ultimele Articole',
    plural: 'Ultimele Articole',
  },
  imageURL: '/blocks/latest-posts.svg',
  fields: [
    // === ESSENTIAL FIELDS ===
    {
      name: 'variant',
      type: 'select',
      label: 'Varianta',
      defaultValue: 'grid-3',
      options: [
        { label: 'Grid 3 coloane', value: 'grid-3' },
        { label: 'Grid 2 coloane', value: 'grid-2' },
        { label: 'Carousel', value: 'carousel' },
        { label: 'Lista', value: 'list' },
      ],
    },
    ...headingFields({ headingDefault: 'Ultimele Articole' }),
    // Collection source fields (limit, filterByCategory)
    ...postsSourceFields(),
    // CTA Button
    ctaButtonFields({ defaultLabel: 'Vezi toate articolele', groupLabel: 'Buton CTA' }),
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
    // Section wrapper fields
    ...sectionWrapperFields,
  ],
}
