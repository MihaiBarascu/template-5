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
    default: 'bg-theme-surface',
    light: 'bg-theme-light',
    dark: 'bg-theme-dark text-white',
  }[backgroundColor] || 'bg-theme-surface'

  const isDark = backgroundColor === 'dark'

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
      <section className={cn('py-section', bgClass)}>
        <div className="container mx-auto px-4">
          <div className={cn(
            'text-center py-16 border-2 border-dashed rounded-xl',
            isDark ? 'border-white/20' : 'border-theme-border'
          )}>
            <svg className={cn('w-16 h-16 mx-auto mb-4', isDark ? 'text-white/40' : 'text-theme-text-muted')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className={isDark ? 'text-white/60' : 'text-theme-text-muted'}>Nu sunt întrebări frecvente disponibile.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={cn('py-section', bgClass)}>
      <div className="container mx-auto px-4">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className={cn(
                'text-3xl md:text-4xl font-bold mb-4',
                isDark ? 'text-white' : 'text-theme-text'
              )}>{heading}</h2>
            )}
            {subheading && (
              <p className={cn('text-lg max-w-2xl mx-auto', isDark ? 'text-white/70' : 'text-theme-text-light')}>
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
                  'p-6 rounded-[var(--radius-card)] border',
                  isDark ? 'border-white/10 bg-white/5' : 'border-theme-border bg-white'
                )}
              >
                <h3 className={cn('text-lg font-semibold mb-3', isDark ? 'text-white' : 'text-theme-text')}>{faq.question}</h3>
                <div className={cn('text-sm', isDark ? 'text-white/70' : 'text-theme-text-light')}>
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
                  isDark ? 'bg-white/10 text-white' : 'bg-theme-primary text-white'
                )}>
                  {index + 1}
                </div>
                <div>
                  <h3 className={cn('text-lg font-semibold mb-2', isDark ? 'text-white' : 'text-theme-text')}>{faq.question}</h3>
                  <div className={cn('text-sm', isDark ? 'text-white/70' : 'text-theme-text-light')}>
                    <RichTextContent content={faq.answer} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Default accordion
          <div className={cn('max-w-3xl mx-auto divide-y', isDark ? 'divide-white/10' : 'divide-theme-border')}>
            {faqs.map((faq, index) => (
              <div key={faq.id || index} className="py-4">
                <button
                  onClick={() => toggleItem(index)}
                  className="w-full flex items-center justify-between text-left group"
                >
                  <span className={cn(
                    'text-lg font-semibold pr-4 transition-colors',
                    isDark ? 'text-white group-hover:text-theme-accent' : 'text-theme-text group-hover:text-theme-primary'
                  )}>{faq.question}</span>
                  <svg
                    className={cn(
                      'w-5 h-5 flex-shrink-0 transition-transform',
                      isDark ? 'text-white/60' : 'text-theme-text-muted',
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
                  <div className={cn('text-sm', isDark ? 'text-white/70' : 'text-theme-text-light')}>
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
