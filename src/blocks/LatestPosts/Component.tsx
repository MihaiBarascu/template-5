'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { ChevronLeft, ChevronRight, Calendar, User, Tag, ArrowRight } from 'lucide-react'

interface PostImage {
  url?: string | null
  alt?: string | null
}

interface PostCategory {
  id: string
  title?: string | null
  slug?: string | null
}

interface PostAuthor {
  id: string
  name?: string | null
  email?: string | null
}

interface Post {
  id: string
  title: string
  slug: string
  excerpt?: string | null
  featuredImage?: PostImage | string | null
  publishedAt?: string | null
  category?: PostCategory | string | null
  author?: PostAuthor | string | null
}

interface LatestPostsBlockProps {
  variant?: string
  heading?: string
  subheading?: string
  showImage?: boolean
  showExcerpt?: boolean
  showDate?: boolean
  showCategory?: boolean
  showAuthor?: boolean
  showReadMore?: boolean
  readMoreText?: string
  ctaButton?: {
    enabled?: boolean | null
    label?: string | null
    link?: string | null
  } | null
  backgroundColor?: string
  posts?: Post[]
}

// Helper to check if image is valid Media object
function isValidMedia(image: unknown): image is MediaType {
  return typeof image === 'object' && image !== null && 'url' in image
}

// Helper function to get category
function getCategoryData(category: PostCategory | string | null | undefined): PostCategory | null {
  if (!category) return null
  if (typeof category === 'string') return null
  return category
}

// Helper function to get author
function getAuthorData(author: PostAuthor | string | null | undefined): PostAuthor | null {
  if (!author) return null
  if (typeof author === 'string') return null
  return author
}

// Format date
function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('ro-RO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export function LatestPostsBlock({
  variant = 'grid-3',
  heading,
  subheading,
  showImage = true,
  showExcerpt = true,
  showDate = true,
  showCategory = true,
  showAuthor = false,
  showReadMore = true,
  readMoreText = 'Citeste mai mult',
  ctaButton,
  backgroundColor = 'default',
  posts = [],
}: LatestPostsBlockProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Background classes
  const bgClasses: Record<string, string> = {
    default: 'bg-theme-surface',
    light: 'bg-theme-light',
    dark: 'bg-theme-dark',
    primary: 'bg-theme-primary',
  }

  const isDark = backgroundColor === 'dark' || backgroundColor === 'primary'

  // Carousel navigation
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % posts.length)
  }, [posts.length])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + posts.length) % posts.length)
  }, [posts.length])

  // Auto-advance carousel
  useEffect(() => {
    if (variant !== 'carousel' || posts.length <= 1) return
    const timer = setInterval(nextSlide, 5000)
    return () => clearInterval(timer)
  }, [variant, posts.length, nextSlide])

  if (posts.length === 0) {
    return null
  }

  // Grid columns based on variant
  const getGridCols = () => {
    switch (variant) {
      case 'grid-2':
        return 'md:grid-cols-2'
      case 'grid-4':
        return 'md:grid-cols-2 lg:grid-cols-4'
      default:
        return 'md:grid-cols-2 lg:grid-cols-3'
    }
  }

  // Post card component
  const PostCard = ({ post, featured = false }: { post: Post; featured?: boolean }) => {
    const hasImage = isValidMedia(post.featuredImage)
    const category = getCategoryData(post.category)
    const author = getAuthorData(post.author)

    return (
      <article
        className={cn(
          'group flex flex-col overflow-hidden rounded-[var(--radius-card)] transition-all duration-300',
          'bg-theme-surface shadow-sm hover:shadow-lg border border-theme-border',
          featured && 'md:flex-row md:col-span-2',
        )}
      >
        {/* Image */}
        {showImage && hasImage && (
          <Link
            href={`/blog/${post.slug}`}
            className={cn(
              'relative overflow-hidden',
              featured ? 'md:w-1/2 aspect-[16/10] md:aspect-auto' : 'aspect-[16/10]',
            )}
          >
            <Media
              resource={post.featuredImage as MediaType}
              fill
              size={featured ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'}
              imgClassName="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {showCategory && category && (
              <span className="absolute top-4 left-4 px-3 py-1 bg-theme-primary text-white text-xs font-medium rounded-full">
                {category.title}
              </span>
            )}
          </Link>
        )}

        {/* Content */}
        <div className={cn('flex flex-col flex-grow p-5', featured && 'md:w-1/2 md:p-8')}>
          {/* Category (if no image) */}
          {showCategory && category && !showImage && (
            <span className="inline-flex items-center gap-1 text-xs text-theme-primary font-medium mb-2">
              <Tag className="w-3 h-3" />
              {category.title}
            </span>
          )}

          {/* Meta info */}
          <div className="flex items-center gap-4 text-sm text-theme-text-muted mb-3">
            {showDate && post.publishedAt && (
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {formatDate(post.publishedAt)}
              </span>
            )}
            {showAuthor && author && (
              <span className="flex items-center gap-1">
                <User className="w-4 h-4" />
                {author.name || author.email}
              </span>
            )}
          </div>

          {/* Title */}
          <h3
            className={cn(
              'font-semibold text-theme-text mb-2 group-hover:text-theme-primary transition-colors',
              featured ? 'text-xl md:text-2xl' : 'text-lg',
            )}
          >
            <Link href={`/blog/${post.slug}`}>{post.title}</Link>
          </h3>

          {/* Excerpt */}
          {showExcerpt && post.excerpt && (
            <p
              className={cn(
                'text-theme-text-light flex-grow',
                featured ? 'text-base line-clamp-4' : 'text-sm line-clamp-3',
              )}
            >
              {post.excerpt}
            </p>
          )}

          {/* Read more button */}
          {showReadMore && (
            <Link
              href={`/blog/${post.slug}`}
              className="inline-flex items-center gap-2 text-theme-primary font-medium mt-4 group/link"
            >
              {readMoreText}
              <ArrowRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
            </Link>
          )}
        </div>
      </article>
    )
  }

  // Minimal variant
  const MinimalPostItem = ({ post }: { post: Post }) => {
    const category = getCategoryData(post.category)
    return (
      <article className="group py-4 border-b border-theme-border last:border-0">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-grow">
            {showCategory && category && (
              <span className="text-xs text-theme-primary font-medium">{category.title}</span>
            )}
            <h3 className="font-medium text-theme-text group-hover:text-theme-primary transition-colors">
              <Link href={`/blog/${post.slug}`}>{post.title}</Link>
            </h3>
          </div>
          {showDate && post.publishedAt && (
            <span className="text-sm text-theme-text-muted whitespace-nowrap">
              {formatDate(post.publishedAt)}
            </span>
          )}
        </div>
      </article>
    )
  }

  // Render content based on variant
  const renderContent = () => {
    switch (variant) {
      case 'carousel':
        return (
          <div className="relative">
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-500"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {posts.map((post) => (
                  <div key={post.id} className="w-full flex-shrink-0 px-2">
                    <PostCard post={post} />
                  </div>
                ))}
              </div>
            </div>
            {posts.length > 1 && (
              <>
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 rounded-full bg-theme-surface shadow-lg flex items-center justify-center hover:bg-theme-light transition-colors text-theme-text"
                  aria-label="Articolul anterior"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 rounded-full bg-theme-surface shadow-lg flex items-center justify-center hover:bg-theme-light transition-colors text-theme-text"
                  aria-label="Articolul urmator"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                {/* Dots */}
                <div className="flex justify-center gap-2 mt-6">
                  {posts.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={cn(
                        'w-2 h-2 rounded-full transition-all',
                        index === currentSlide ? 'bg-theme-primary w-6' : 'bg-theme-border hover:bg-theme-text-muted',
                      )}
                      aria-label={`Mergi la articolul ${index + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        )

      case 'featured':
        const [featuredPost, ...otherPosts] = posts
        return (
          <div className="grid gap-6 md:grid-cols-2">
            {featuredPost && <PostCard post={featuredPost} featured />}
            {otherPosts.length > 0 && (
              <div className="flex flex-col gap-6">
                {otherPosts.slice(0, 2).map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            )}
          </div>
        )

      case 'list':
        return (
          <div className="space-y-6">
            {posts.map((post) => (
              <PostCard key={post.id} post={post} featured />
            ))}
          </div>
        )

      case 'minimal':
        return (
          <div className="max-w-2xl mx-auto">
            {posts.map((post) => (
              <MinimalPostItem key={post.id} post={post} />
            ))}
          </div>
        )

      default:
        return (
          <div className={cn('grid gap-6', getGridCols())}>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )
    }
  }

  return (
    <section
      className={cn(
        'py-16 md:py-24 transition-opacity duration-500',
        bgClasses[backgroundColor] || bgClasses.default,
        isLoaded ? 'opacity-100' : 'opacity-0',
      )}
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2
                className={cn(
                  'text-3xl md:text-4xl font-bold mb-4',
                  isDark ? 'text-white' : 'text-theme-text',
                )}
              >
                {heading}
              </h2>
            )}
            {subheading && (
              <p
                className={cn(
                  'text-lg max-w-2xl mx-auto',
                  isDark ? 'text-white/80' : 'text-theme-text-light',
                )}
              >
                {subheading}
              </p>
            )}
          </div>
        )}

        {/* Posts */}
        {renderContent()}

        {/* CTA Button */}
        {ctaButton?.enabled && ctaButton.link && (
          <div className="text-center mt-12">
            <Link
              href={ctaButton.link}
              className={cn(
                'inline-flex items-center gap-2 px-6 py-3 rounded-[var(--radius-button)] font-medium transition-colors',
                isDark
                  ? 'bg-white text-theme-dark hover:bg-white/90'
                  : 'bg-theme-primary text-white hover:bg-theme-secondary',
              )}
            >
              {ctaButton.label || 'Vezi toate articolele'}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
