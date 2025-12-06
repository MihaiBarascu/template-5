import React from 'react'
import Image from 'next/image'
import { cn } from '@/utilities/cn'
import type { MediaBlock as MediaBlockProps, Media } from '@/payload-types'

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
  const mediaObj = media && typeof media === 'object' ? (media as Media) : null
  const caption = mediaObj?.caption

  if (!mediaObj?.url) return null

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
        <Image
          src={mediaObj.url}
          alt={mediaObj.alt || ''}
          fill
          className={cn('object-cover', imgClassName)}
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
