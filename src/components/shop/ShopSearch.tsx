'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search } from 'lucide-react'
import { cn } from '@/utilities/cn'

interface ShopSearchProps {
  placeholder?: string
  className?: string
}

export function ShopSearch({
  placeholder = 'Cauta produse...',
  className
}: ShopSearchProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get('q') as string

    const params = new URLSearchParams(searchParams.toString())

    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }

    // Reset to first page when searching
    params.delete('page')

    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative w-full', className)}
    >
      <input
        type="text"
        name="q"
        defaultValue={searchParams.get('q') || ''}
        placeholder={placeholder}
        className="w-full px-4 py-3 pr-12 rounded-lg border border-theme-border bg-theme-surface text-theme-text placeholder:text-theme-text-muted focus:outline-none focus:ring-2 focus:ring-theme-primary"
        autoComplete="off"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 text-theme-text-muted hover:text-theme-primary transition-colors"
      >
        <Search className="w-5 h-5" />
      </button>
    </form>
  )
}
