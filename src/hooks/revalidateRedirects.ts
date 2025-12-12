import type { CollectionAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating redirects`)
  try {
    revalidateTag('redirects', 'max')
  } catch (_e) {
    payload.logger.warn(`Could not revalidate redirects (likely running outside Next.js context)`)
  }
  return doc
}
