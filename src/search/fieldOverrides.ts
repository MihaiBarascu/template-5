import type { Field } from 'payload'

export const searchFields: Field[] = [
  {
    name: 'categories',
    type: 'array',
    admin: {
      readOnly: true,
    },
    fields: [
      {
        name: 'category',
        type: 'text',
      },
    ],
  },
]
