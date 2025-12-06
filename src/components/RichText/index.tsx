import { cn } from '@/utilities/cn'
import React from 'react'

import {
  type JSXConvertersFunction,
  RichText as PayloadRichText,
} from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import type { BannerBlock as BannerBlockProps, MediaBlock as MediaBlockProps } from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'

type Props = {
  className?: string
  data: SerializedEditorState | null | undefined
  enableGutter?: boolean
  enableProse?: boolean
}

// Custom converters for internal links and blocks
const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,
  link: ({ node, nodesToJSX }) => {
    const { fields } = node
    const children = nodesToJSX({ nodes: node.children })

    if (fields.linkType === 'internal') {
      const doc = fields.doc?.value
      if (doc && typeof doc === 'object') {
        const slug = 'slug' in doc ? doc.slug : ''
        const collection = fields.doc?.relationTo

        let href = `/${slug}`
        if (collection === 'posts') {
          href = `/blog/${slug}`
        }

        return (
          <a href={href} className="text-theme-primary hover:underline">
            {children}
          </a>
        )
      }
    }

    return (
      <a
        href={fields.url || '#'}
        target={fields.newTab ? '_blank' : undefined}
        rel={fields.newTab ? 'noopener noreferrer' : undefined}
        className="text-theme-primary hover:underline"
      >
        {children}
      </a>
    )
  },
  blocks: {
    banner: ({ node }: { node: { fields: BannerBlockProps } }) => (
      <BannerBlock className="col-start-2 mb-4" {...node.fields} />
    ),
    mediaBlock: ({ node }: { node: { fields: MediaBlockProps } }) => (
      <MediaBlock
        className="col-start-1 col-span-3"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
  },
})

export default function RichText({
  className,
  data,
  enableGutter = true,
  enableProse = true,
}: Props) {
  if (!data) return null

  return (
    <PayloadRichText
      className={cn(
        {
          'container': enableGutter,
          'max-w-none prose dark:prose-invert prose-headings:font-bold prose-headings:text-theme-text prose-p:text-theme-text-light prose-a:text-theme-primary prose-strong:text-theme-text prose-li:text-theme-text-light': enableProse,
        },
        className,
      )}
      converters={jsxConverters}
      data={data}
    />
  )
}
