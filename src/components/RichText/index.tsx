import { cn } from '@/utilities/cn'
import React from 'react'

import {
  type JSXConvertersFunction,
  RichText as PayloadRichText,
} from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

type Props = {
  className?: string
  data: SerializedEditorState | null | undefined
  enableGutter?: boolean
  enableProse?: boolean
}

// Custom converters for internal links
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
          <a href={href} className="text-primary hover:underline">
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
        className="text-primary hover:underline"
      >
        {children}
      </a>
    )
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
          'max-w-none prose dark:prose-invert prose-headings:font-bold prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-li:text-muted-foreground': enableProse,
        },
        className,
      )}
      converters={jsxConverters}
      data={data}
    />
  )
}
