import React from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { getBgClasses, isDarkBackground } from '@/blocks/_shared/themeHelpers'
import { Download, FileText, File, ExternalLink } from 'lucide-react'
import type { Media as MediaType } from '@/payload-types'

interface DownloadLink {
  label: string
  description?: string | null
  linkType?: 'upload' | 'external' | null
  file?: MediaType | string | null
  url?: string | null
  icon?: 'download' | 'pdf' | 'document' | 'external-link' | 'none' | null
  openInNewTab?: boolean | null
}

interface DownloadLinksBlockProps {
  variant?: 'buttons' | 'list' | 'cards' | 'inline'
  heading?: string | null
  links?: DownloadLink[]
  alignment?: 'left' | 'center' | 'right'
  backgroundColor?: 'default' | 'light' | 'dark' | 'primary'
}

export function DownloadLinksBlock({
  variant = 'buttons',
  heading,
  links = [],
  alignment = 'center',
  backgroundColor = 'default',
}: DownloadLinksBlockProps) {
  if (links.length === 0) return null

  const bgClass = getBgClasses(backgroundColor)
  const isDark = isDarkBackground(backgroundColor)

  const alignmentClasses = {
    left: 'justify-start text-left',
    center: 'justify-center text-center',
    right: 'justify-end text-right',
  }

  // Get icon component
  const getIcon = (icon?: string | null) => {
    switch (icon) {
      case 'download':
        return Download
      case 'pdf':
        return FileText
      case 'document':
        return File
      case 'external-link':
        return ExternalLink
      default:
        return null
    }
  }

  // Get URL from link
  const getUrl = (link: DownloadLink): string => {
    if (link.linkType === 'external' && link.url) {
      return link.url
    }
    if (link.linkType === 'upload' && link.file) {
      const file = typeof link.file === 'object' ? link.file : null
      return file?.url || '#'
    }
    return link.url || '#'
  }

  // Render buttons variant
  const renderButtons = () => (
    <div className={cn('flex flex-wrap gap-4', alignmentClasses[alignment])}>
      {links.map((link, index) => {
        const IconComponent = getIcon(link.icon)
        const url = getUrl(link)

        return (
          <Link
            key={index}
            href={url}
            target={link.openInNewTab ? '_blank' : undefined}
            rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
            className={cn(
              'inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-button)] font-medium transition-all hover-lift',
              isDark
                ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                : 'bg-theme-primary/10 text-theme-primary hover:bg-theme-primary/20 border border-theme-primary/20'
            )}
          >
            {IconComponent && <IconComponent className="w-5 h-5" />}
            <span>{link.label}</span>
          </Link>
        )
      })}
    </div>
  )

  // Render list variant
  const renderList = () => (
    <ul className={cn('space-y-3', alignmentClasses[alignment])}>
      {links.map((link, index) => {
        const IconComponent = getIcon(link.icon)
        const url = getUrl(link)

        return (
          <li key={index}>
            <Link
              href={url}
              target={link.openInNewTab ? '_blank' : undefined}
              rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
              className={cn(
                'inline-flex items-center gap-2 transition-colors',
                isDark
                  ? 'text-white/80 hover:text-white'
                  : 'text-theme-primary hover:text-theme-primary-dark'
              )}
            >
              {IconComponent && <IconComponent className="w-4 h-4" />}
              <span className="underline underline-offset-4">{link.label}</span>
            </Link>
          </li>
        )
      })}
    </ul>
  )

  // Render cards variant
  const renderCards = () => (
    <div className={cn(
      'grid gap-4',
      links.length <= 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    )}>
      {links.map((link, index) => {
        const IconComponent = getIcon(link.icon)
        const url = getUrl(link)

        return (
          <Link
            key={index}
            href={url}
            target={link.openInNewTab ? '_blank' : undefined}
            rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
            className={cn(
              'flex items-start gap-4 p-4 rounded-[var(--radius-card)] transition-all hover-lift',
              isDark
                ? 'bg-white/5 hover:bg-white/10 border border-white/10'
                : 'bg-theme-surface hover:bg-theme-light border border-theme-border'
            )}
          >
            {IconComponent && (
              <div className={cn(
                'shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                isDark ? 'bg-theme-primary/20' : 'bg-theme-primary/10'
              )}>
                <IconComponent className={cn(
                  'w-5 h-5',
                  isDark ? 'text-theme-primary-light' : 'text-theme-primary'
                )} />
              </div>
            )}
            <div>
              <span className={cn(
                'font-medium block',
                isDark ? 'text-white' : 'text-theme-text'
              )}>
                {link.label}
              </span>
              {link.description && (
                <span className={cn(
                  'text-sm mt-1 block',
                  isDark ? 'text-white/60' : 'text-theme-text-light'
                )}>
                  {link.description}
                </span>
              )}
            </div>
          </Link>
        )
      })}
    </div>
  )

  // Render inline variant
  const renderInline = () => (
    <div className={cn('flex flex-wrap items-center gap-x-6 gap-y-2', alignmentClasses[alignment])}>
      {links.map((link, index) => {
        const IconComponent = getIcon(link.icon)
        const url = getUrl(link)

        return (
          <React.Fragment key={index}>
            <Link
              href={url}
              target={link.openInNewTab ? '_blank' : undefined}
              rel={link.openInNewTab ? 'noopener noreferrer' : undefined}
              className={cn(
                'inline-flex items-center gap-1.5 transition-colors',
                isDark
                  ? 'text-white/80 hover:text-white'
                  : 'text-theme-primary hover:text-theme-primary-dark'
              )}
            >
              {IconComponent && <IconComponent className="w-4 h-4" />}
              <span className="underline underline-offset-4">{link.label}</span>
            </Link>
            {index < links.length - 1 && (
              <span className={cn('hidden md:inline', isDark ? 'text-white/30' : 'text-theme-border')}>
                |
              </span>
            )}
          </React.Fragment>
        )
      })}
    </div>
  )

  // Choose render function
  const renderContent = () => {
    switch (variant) {
      case 'list':
        return renderList()
      case 'cards':
        return renderCards()
      case 'inline':
        return renderInline()
      default:
        return renderButtons()
    }
  }

  return (
    <section className={cn('py-8 md:py-12', bgClass)}>
      <div className="container mx-auto px-4">
        {heading && (
          <h3 className={cn(
            'text-xl font-semibold mb-6',
            alignmentClasses[alignment],
            isDark ? 'text-white' : 'text-theme-text'
          )}>
            {heading}
          </h3>
        )}
        {renderContent()}
      </div>
    </section>
  )
}
