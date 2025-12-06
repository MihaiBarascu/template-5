import React from 'react'
import { cn } from '@/utilities/cn'
import RichText from '@/components/RichText'
import type { BannerBlock as BannerBlockProps } from '@/payload-types'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  const styleClasses = {
    info: 'border-theme-border bg-theme-light text-theme-text',
    warning: 'border-amber-300 bg-amber-50 text-amber-900',
    error: 'border-red-300 bg-red-50 text-red-900',
    success: 'border-green-300 bg-green-50 text-green-900',
  }

  return (
    <div className={cn('mx-auto my-8 w-full', className)}>
      <div
        className={cn(
          'border py-3 px-6 flex items-center rounded-lg',
          styleClasses[style || 'info']
        )}
      >
        <RichText data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}
