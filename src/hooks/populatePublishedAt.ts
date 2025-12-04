import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Automatically populates the publishedAt field when a document is first published.
 * This hook follows the official Payload website template pattern.
 */
export const populatePublishedAt: CollectionBeforeChangeHook = ({
  data,
  operation,
}) => {
  // Only set publishedAt if it's not already set and the document is being published
  if (operation === 'create' || operation === 'update') {
    if (data._status === 'published' && !data.publishedAt) {
      return {
        ...data,
        publishedAt: new Date().toISOString(),
      }
    }
  }

  return data
}
