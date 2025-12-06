import React from 'react'
import Image from 'next/image'
import { cn } from '@/utilities/cn'
import RichText from '@/components/RichText'
import type { Page } from '@/payload-types'

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

const widthClasses: Record<string, string> = {
  full: 'w-full',
  'three-quarters': 'w-full md:w-3/4',
  'two-thirds': 'w-full md:w-2/3',
  half: 'w-full md:w-1/2',
  'one-third': 'w-full md:w-1/3',
  'one-quarter': 'w-full md:w-1/4',
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

export const ContentBlock: React.FC<ContentBlockProps> = ({
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
        <div className="flex flex-wrap -mx-4">
          {columns.map((column, index) => {
            const width = column.width || 'full'
            const alignment = column.alignment || 'top'

            return (
              <div
                key={column.id || index}
                className={cn(
                  'px-4 mb-8 last:mb-0',
                  widthClasses[width],
                  alignmentClasses[alignment]
                )}
              >
                {column.contentType === 'richText' && column.richText && (
                  <RichText data={column.richText} enableGutter={false} />
                )}

                {column.contentType === 'image' && column.image && (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    {typeof column.image === 'object' && 'url' in column.image && column.image.url && (
                      <Image
                        src={column.image.url}
                        alt={(column.image as { alt?: string }).alt || ''}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                )}

                {column.contentType === 'video' && column.videoUrl && (
                  <div className="relative aspect-video rounded-lg overflow-hidden">
                    {column.videoUrl.includes('youtube') || column.videoUrl.includes('youtu.be') ? (
                      <iframe
                        src={getYouTubeEmbedUrl(column.videoUrl)}
                        className="absolute inset-0 w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : column.videoUrl.includes('vimeo') ? (
                      <iframe
                        src={getVimeoEmbedUrl(column.videoUrl)}
                        className="absolute inset-0 w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        src={column.videoUrl}
                        className="absolute inset-0 w-full h-full object-cover"
                        controls
                      />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Helper functions for video embeds
function getYouTubeEmbedUrl(url: string): string {
  const videoId = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1]
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url
}

function getVimeoEmbedUrl(url: string): string {
  const videoId = url.match(/vimeo\.com\/(\d+)/)?.[1]
  return videoId ? `https://player.vimeo.com/video/${videoId}` : url
}

export default ContentBlock
