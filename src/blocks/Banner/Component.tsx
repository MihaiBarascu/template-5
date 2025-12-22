import React from 'react'
import { cn } from '@/utilities/cn'
import RichText from '@/components/RichText'
import type { BannerBlock as BannerBlockProps } from '@/payload-types'
import { getAlertClasses } from '@/blocks/_shared/themeHelpers'

type Props = {
  className?: string
} & BannerBlockProps

export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  // Info style uses theme tokens, semantic states (warning, error, success) use standard colors
  const styleClass = style === 'info'
    ? 'border-theme-border bg-theme-light text-theme-text'
    : getAlertClasses(style || 'info')

  return (
    <div className={cn('mx-auto my-8 w-full', className)}>
      <div
        className={cn(
          'py-3 px-6 flex items-center',
          styleClass
        )}
      >
        <RichText data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}
