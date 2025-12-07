export type SortOption = 'newest' | 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc'

export interface SortFilterItem {
  value: SortOption
  label: string
  sort: string // Payload sort field
}

export const sortingOptions: SortFilterItem[] = [
  { value: 'newest', label: 'Cele mai noi', sort: '-createdAt' },
  { value: 'price_asc', label: 'Pret: mic la mare', sort: 'priceInRON' },
  { value: 'price_desc', label: 'Pret: mare la mic', sort: '-priceInRON' },
  { value: 'name_asc', label: 'Nume: A-Z', sort: 'title' },
  { value: 'name_desc', label: 'Nume: Z-A', sort: '-title' },
]

export function getSortField(sortOption: SortOption | null): string {
  const option = sortingOptions.find(o => o.value === sortOption)
  return option?.sort || '-createdAt'
}
