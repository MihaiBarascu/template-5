import * as React from 'react'
import { cn } from '@/utilities/cn'

export const Width: React.FC<{
  children: React.ReactNode
  className?: string
  width?: number | string | null
}> = ({ children, className, width }) => {
  // Convert width to flex basis classes
  const numWidth = typeof width === 'string' ? parseInt(width, 10) : width
  const widthClass = numWidth
    ? numWidth <= 50
      ? 'w-full md:w-1/2'
      : 'w-full'
    : 'w-full'

  return (
    <div className={cn(widthClass, 'px-2 mb-4', className)}>
      {children}
    </div>
  )
}
