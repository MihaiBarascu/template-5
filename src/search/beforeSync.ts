import type { BeforeSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ searchDoc, originalDoc }) => {
  const typedDoc = originalDoc as { category?: { title?: string } }
  const categories = typedDoc?.category?.title ? [{ category: typedDoc.category.title }] : []

  return {
    ...searchDoc,
    categories,
  }
}
