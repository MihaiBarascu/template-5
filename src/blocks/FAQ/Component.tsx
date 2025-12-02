'use client'

import React, { useState } from 'react'
import { cn } from '@/utilities/cn'

interface LexicalContent {
  root?: {
    children?: LexicalNode[]
  }
}

interface LexicalNode {
  type?: string
  text?: string
  children?: LexicalNode[]
}

interface FAQ {
  id: string
  question: string
  answer: LexicalContent
}

interface FAQBlockProps {
  variant?: string
  heading?: string
  subheading?: string
  source?: string
  limit?: number
  defaultOpen?: string
  backgroundColor?: string
  faqs?: FAQ[]
}

function RichTextContent({ content }: { content: LexicalContent }) {
  // Simple rich text renderer - extracts text from Lexical format
  if (!content?.root?.children) {
    return null
  }

  const extractText = (node: LexicalNode): string => {
    if (node.text) return node.text
    if (node.children) {
      return node.children.map(extractText).join('')
    }
    return ''
  }

  return (
    <>
      {content.root.children.map((node: LexicalNode, index: number) => {
        const text = extractText(node)
        if (node.type === 'paragraph') {
          return <p key={index} className="mb-2 last:mb-0">{text}</p>
        }
        return <span key={index}>{text}</span>
      })}
    </>
  )
}

export function FAQBlock({
  variant = 'accordion',
  heading,
  subheading,
  defaultOpen = 'first',
  backgroundColor = 'default',
  faqs = [],
}: FAQBlockProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(() => {
    const initial = new Set<number>()
    if (defaultOpen === 'first' && faqs.length > 0) {
      initial.add(0)
    } else if (defaultOpen === 'all') {
      faqs.forEach((_, index) => initial.add(index))
    }
    return initial
  })

  const bgClass = {
    default: 'bg-white',
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
  }[backgroundColor] || 'bg-white'

  const toggleItem = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  if (faqs.length === 0) {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500">Nu sunt intrebari frecvente disponibile.</p>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('py-16', bgClass)}>
      <div className="container mx-auto px-4">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
            )}
            {subheading && (
              <p className={cn('text-lg max-w-2xl mx-auto', backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {variant === 'two-columns' ? (
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {faqs.map((faq, index) => (
              <div
                key={faq.id || index}
                className={cn(
                  'p-6 rounded-lg border',
                  backgroundColor === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
                )}
              >
                <h3 className="text-lg font-semibold mb-3">{faq.question}</h3>
                <div className={cn('text-sm', backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                  <RichTextContent content={faq.answer} />
                </div>
              </div>
            ))}
          </div>
        ) : variant === 'numbered' ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={faq.id || index}
                className="flex gap-4"
              >
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0',
                  backgroundColor === 'dark' ? 'bg-gray-700 text-white' : 'bg-theme-primary text-white'
                )}>
                  {index + 1}
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                  <div className={cn('text-sm', backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                    <RichTextContent content={faq.answer} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Default accordion
          <div className="max-w-3xl mx-auto divide-y divide-gray-200">
            {faqs.map((faq, index) => (
              <div key={faq.id || index} className="py-4">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between text-left"
                >
                  <span className="text-lg font-semibold pr-4">{faq.question}</span>
                  <svg
                    className={cn(
                      'w-5 h-5 flex-shrink-0 transition-transform',
                      openItems.has(index) && 'rotate-180'
                    )}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className={cn(
                    'overflow-hidden transition-all duration-300',
                    openItems.has(index) ? 'max-h-96 mt-4' : 'max-h-0'
                  )}
                >
                  <div className={cn('text-sm', backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
                    <RichTextContent content={faq.answer} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default FAQBlock
