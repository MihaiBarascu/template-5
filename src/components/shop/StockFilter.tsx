'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'

interface StockFilterProps {
  label?: string
  className?: string
}

export function StockFilter({
  label = 'Doar produse in stoc',
  className
}: StockFilterProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const inStock = searchParams.get('in_stoc') === 'true'

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const params = new URLSearchParams(searchParams.toString())

    if (e.target.checked) {
      params.set('in_stoc', 'true')
    } else {
      params.delete('in_stoc')
    }

    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className={className}>
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={inStock}
          onChange={handleChange}
          className="w-4 h-4 rounded border-theme-border text-theme-primary focus:ring-theme-primary"
        />
        <span className="text-sm text-theme-text">{label}</span>
      </label>
    </div>
  )
}
