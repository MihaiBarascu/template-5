import type { BeforeSync } from '@payloadcms/plugin-search/types'

export const beforeSyncWithSearch: BeforeSync = async ({ searchDoc, originalDoc }) => {
  const typedDoc = originalDoc as {
    category?: { title?: string }
    tenant?: string | { id: string }
  }
  const categories = typedDoc?.category?.title ? [{ category: typedDoc.category.title }] : []

  // Multi-tenant: copy tenant field from original document to search document
  // This is required because the search collection is tenant-scoped
  const tenantId = typeof typedDoc?.tenant === 'string'
    ? typedDoc.tenant
    : typedDoc?.tenant?.id

  return {
    ...searchDoc,
    categories,
    // Include tenant if present on original document
    ...(tenantId && { tenant: tenantId }),
  }
}
