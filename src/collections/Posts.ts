import type { CollectionConfig } from 'payload'
import { authenticated, authenticatedOrPublished } from '@/access'
import { slugField } from '@/fields/slug'
import { revalidatePostAfterChange, revalidatePostAfterDelete } from '@/hooks/revalidatePost'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: 'Articol',
    plural: 'Articole',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'category', 'publishedAt', 'updatedAt'],
    useAsTitle: 'title',
    group: 'Blog',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      label: 'Titlu',
      required: true,
    },
    slugField('title'),
    {
      name: 'excerpt',
      type: 'textarea',
      label: 'Rezumat',
      admin: {
        description: 'Scurta descriere pentru listari si SEO',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagine principala',
    },
    {
      name: 'content',
      type: 'richText',
      label: 'Continut',
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'categories',
      label: 'Categorie',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      label: 'Autor',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'publishedAt',
      type: 'date',
      label: 'Data publicarii',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      relationTo: 'posts',
      hasMany: true,
      label: 'Articole similare',
      filterOptions: ({ id }) => ({
        id: { not_equals: id },
      }),
      admin: {
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidatePostAfterChange],
    afterDelete: [revalidatePostAfterDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 25,
  },
}
