export const beforeSyncWithSearch = async ({ originalDoc, searchDoc }: any) => {
  const categories = originalDoc?.category?.title ? [{ category: originalDoc.category.title }] : []

  return {
    ...searchDoc,
    categories,
  }
}
