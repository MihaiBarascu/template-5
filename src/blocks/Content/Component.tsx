import React from 'react'
import { cn } from '@/utilities/cn'
import RichText from '@/components/RichText'
import { LazyVideo } from '@/components/LazyVideo'
import { Media } from '@/components/Media'
import type { Page, Media as MediaType } from '@/payload-types'
import { RenderBlocks } from '../RenderBlocks'

// Extract ContentBlock type from Page layout
type LayoutBlock = NonNullable<Page['layout']>[number]
type ContentBlockType = Extract<LayoutBlock, { blockType: 'content' }>
type Column = NonNullable<ContentBlockType['columns']>[number]

interface ContentBlockProps {
  columns?: Column[]
  backgroundColor?: 'default' | 'light' | 'dark'
  paddingTop?: 'none' | 'small' | 'medium' | 'large'
  paddingBottom?: 'none' | 'small' | 'medium' | 'large'
}

// Percentage-based widths (new system)
const percentageWidthClasses: Record<string, string> = {
  '100': 'w-full',
  '90': 'w-full lg:w-[90%]',
  '80': 'w-full lg:w-4/5',
  '75': 'w-full lg:w-3/4',
  '70': 'w-full lg:w-[70%]',
  '66': 'w-full lg:w-2/3',
  '60': 'w-full lg:w-[60%]',
  '50': 'w-full lg:w-1/2',
  '40': 'w-full lg:w-[40%]',
  '33': 'w-full lg:w-1/3',
  '30': 'w-full lg:w-[30%]',
  '25': 'w-full lg:w-1/4',
  '20': 'w-full lg:w-1/5',
}

// Legacy width classes (for backwards compatibility)
const legacyWidthClasses: Record<string, string> = {
  full: 'w-full',
  'three-quarters': 'w-full lg:w-3/4',
  'two-thirds': 'w-full lg:w-2/3',
  half: 'w-full lg:w-1/2',
  'one-third': 'w-full lg:w-1/3',
  'one-quarter': 'w-full lg:w-1/4',
}

// Combined width classes
const getWidthClass = (width: string): string => {
  // Check percentage widths first
  if (percentageWidthClasses[width]) {
    return percentageWidthClasses[width]
  }
  // Fall back to legacy values
  if (legacyWidthClasses[width]) {
    return legacyWidthClasses[width]
  }
  // Default to full width
  return 'w-full'
}

const alignmentClasses: Record<string, string> = {
  top: 'self-start',
  center: 'self-center',
  bottom: 'self-end',
}

const paddingClasses: Record<string, string> = {
  none: '',
  small: 'py-4',
  medium: 'py-8 md:py-12',
  large: 'py-12 md:py-20',
}

const bgClasses: Record<string, string> = {
  default: 'bg-background',
  light: 'bg-muted/30',
  dark: 'bg-foreground text-background',
}

export const ContentBlock: React.FC<ContentBlockProps> = async ({
  columns = [],
  backgroundColor = 'default',
  paddingTop = 'medium',
  paddingBottom = 'medium',
}) => {
  if (!columns || columns.length === 0) {
    return null
  }

  // Combine padding classes
  const topPadding = paddingTop === 'none' ? '' : paddingClasses[paddingTop]?.replace('py-', 'pt-').replace('md:py-', 'md:pt-') || ''
  const bottomPadding = paddingBottom === 'none' ? '' : paddingClasses[paddingBottom]?.replace('py-', 'pb-').replace('md:py-', 'md:pb-') || ''

  return (
    <section className={cn(bgClasses[backgroundColor], topPadding, bottomPadding)}>
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4 items-start">
          {await Promise.all(columns.map(async (column, index) => {
            const width = column.width || 'full'
            const alignment = column.alignment || 'top'

            return (
              <div
                key={column.id || index}
                className={cn(
                  'px-4 mb-8 last:mb-0',
                  getWidthClass(width),
                  alignmentClasses[alignment]
                )}
              >
                {column.contentType === 'richText' && column.richText && (
                  <RichText data={column.richText} enableGutter={false} />
                )}

                {column.contentType === 'image' && column.image && (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    {typeof column.image === 'object' && 'url' in column.image && (
                      <Media
                        resource={column.image as MediaType}
                        fill
                        size="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 800px"
                        imgClassName="object-cover"
                      />
                    )}
                  </div>
                )}

                {column.contentType === 'video' && column.videoUrl && (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    <LazyVideo videoUrl={column.videoUrl} title="Video content" />
                  </div>
                )}

                {column.contentType === 'blocks' && column.blocks && column.blocks.length > 0 && (
                  <div className="[&>*:first-child]:mt-0 [&>section]:py-0">
                    <RenderBlocks blocks={column.blocks as LayoutBlock[]} />
                  </div>
                )}
              </div>
            )
          }))}
        </div>
      </div>
    </section>
  )
}

export default ContentBlock
