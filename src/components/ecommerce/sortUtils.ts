/**
 * Sort Utilities - Server-compatible
 *
 * Funcții helper pentru sortare care pot fi folosite
 * atât pe server cât și pe client.
 */

export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'

/**
 * Funcție helper pentru a genera parametrii de sortare pentru query Payload
 */
export function getSortParams(sort: SortOption | null): string {
  switch (sort) {
    case 'price_asc':
      return 'price'
    case 'price_desc':
      return '-price'
    case 'name_asc':
      return 'title'
    case 'name_desc':
      return '-title'
    case 'newest':
    default:
      return '-createdAt'
  }
}
