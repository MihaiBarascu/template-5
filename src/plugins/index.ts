import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { processFormSubmission } from '@/hooks/processFormSubmission'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { searchFields } from '@/search/fieldOverrides'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { importExportPlugin } from '@payloadcms/plugin-import-export'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { s3Storage } from '@payloadcms/storage-s3'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Plugin } from 'payload'

import type { Page, Post } from '@/payload-types'
import { getServerSideURL } from '@/utilities/getURL'

// S3/R2 Storage configuration (optional - for production)
const s3StoragePlugin: Plugin | null =
  process.env.R2_BUCKET &&
  process.env.R2_ACCESS_KEY_ID &&
  process.env.R2_SECRET_ACCESS_KEY &&
  process.env.R2_ENDPOINT
    ? s3Storage({
        collections: {
          media: {
            prefix: 'media',
          },
        },
        bucket: process.env.R2_BUCKET,
        config: {
          credentials: {
            accessKeyId: process.env.R2_ACCESS_KEY_ID,
            secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
          },
          region: 'auto',
          endpoint: process.env.R2_ENDPOINT,
          forcePathStyle: true,
        },
      })
    : null

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Site Business` : 'Site Business Romania'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  const url = getServerSideURL()
  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts'],
    overrides: {
      // @ts-expect-error - This is a valid override
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'Trebuie sa reconstruiesti site-ul dupa modificarea acestui camp.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
      // Add custom date field
      date: {
        fields: [
          {
            name: 'name',
            type: 'text',
            label: 'Nume camp (slug)',
            required: true,
            admin: {
              description: 'Ex: date, dataPreferata',
            },
          },
          {
            name: 'label',
            type: 'text',
            label: 'Label',
          },
          {
            name: 'width',
            type: 'number',
            label: 'Latime (%)',
            defaultValue: 100,
            min: 25,
            max: 100,
          },
          {
            name: 'required',
            type: 'checkbox',
            label: 'Obligatoriu',
          },
        ],
      },
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        // Add formType field at the beginning
        const formTypeField = {
          name: 'formType',
          type: 'select' as const,
          label: 'Tip Formular',
          required: true,
          defaultValue: 'contact',
          options: [
            { label: 'Contact', value: 'contact' },
            { label: 'Newsletter', value: 'newsletter' },
            { label: 'Rezervare', value: 'booking' },
            { label: 'Comanda', value: 'order' },
            { label: 'Feedback', value: 'feedback' },
            { label: 'Altele', value: 'other' },
          ],
          admin: {
            description:
              'Tipul formularului determina cum sunt procesate trimiterile (email-uri, salvare newsletter, etc.)',
          },
        }

        return [
          formTypeField,
          ...defaultFields.map((field) => {
            if ('name' in field && field.name === 'confirmationMessage') {
              return {
                ...field,
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      FixedToolbarFeature(),
                      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    ]
                  },
                }),
              }
            }
            return field
          }),
        ]
      },
    },
    formSubmissionOverrides: {
      hooks: {
        afterChange: [processFormSubmission],
      },
    },
  }),
  searchPlugin({
    collections: ['posts'],
    beforeSync: beforeSyncWithSearch,
    searchOverrides: {
      fields: ({ defaultFields }) => {
        return [...defaultFields, ...searchFields]
      },
    },
  }),
  // Import/Export plugin - permite backup si migrare continut
  // Admin-ul poate exporta colectii in JSON si le poate reimporta
  importExportPlugin({
    collections: [
      // Content collections
      'pages',
      'posts',
      'services',
      'team',
      'portfolio',
      'testimonials',
      'faq',
      'subscriptions',
      'categories',
      // Operational collections
      'bookings',
      'subscription-orders',
      'newsletter-subscribers',
    ],
  }),
  // S3/R2 storage for production (optional - only if env vars are set)
  ...(s3StoragePlugin ? [s3StoragePlugin] : []),
]
