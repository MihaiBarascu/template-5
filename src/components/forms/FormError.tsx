'use client'

/**
 * FormError Component - Based on official Payload template
 * Adapted for theme system
 */

import { cn } from '@/utilities/cn'

type Props = {
  message?: string
  as?: 'p' | 'span'
  className?: string
}

export const FormError: React.FC<Props> = ({ message, as, className }) => {
  const Element = as || 'p'

  if (!message) {
    return null
  }

  return <Element className={cn('text-red-500 text-sm', className)}>{message}</Element>
}
