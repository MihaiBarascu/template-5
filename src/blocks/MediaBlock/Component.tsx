import React from 'react'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import type { MediaBlock as MediaBlockProps, Media as MediaType } from '@/payload-types'

type Props = MediaBlockProps & {
  className?: string
  imgClassName?: string
  captionClassName?: string
  enableGutter?: boolean
  disableInnerContainer?: boolean
}

export const MediaBlockComponent: React.FC<Props> = (props) => {
  const {
    className,
    imgClassName,
    captionClassName,
    enableGutter = true,
    media,
    disableInnerContainer,
  } = props

  // Type guard to check if media is an object (populated) vs string (ID only)
  const mediaObj = media && typeof media === 'object' ? (media as MediaType) : null
  const caption = mediaObj?.caption

  if (!mediaObj) return null

  return (
    <div
      className={cn(
        'my-8',
        {
          container: enableGutter,
        },
        className,
      )}
    >
      <div className="relative w-full aspect-video overflow-hidden rounded-xl">
        <Media
          resource={mediaObj}
          fill
          size="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
          imgClassName={cn('object-cover', imgClassName)}
        />
      </div>
      {caption && (
        <div
          className={cn(
            'mt-4 text-sm text-theme-text-muted text-center',
            {
              container: !disableInnerContainer,
            },
            captionClassName,
          )}
        >
          {caption}
        </div>
      )}
    </div>
  )
}

export { MediaBlockComponent as MediaBlock }
