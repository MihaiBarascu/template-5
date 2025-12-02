'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { cn } from '@/utilities/cn'

interface Testimonial {
  id: string
  name: string
  role?: string
  content: string
  rating?: string
  avatar?: {
    url: string
    alt?: string
  }
  source?: string
  featured?: boolean
}

interface TestimonialsBlockProps {
  variant?: string
  heading?: string
  subheading?: string
  source?: string
  limit?: number
  onlyFeatured?: boolean
  showRating?: boolean
  showAvatar?: boolean
  showSource?: boolean
  autoplay?: boolean
  backgroundColor?: string
  testimonials?: Testimonial[]
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={cn('w-5 h-5', star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300')}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export function TestimonialsBlock({
  variant = 'carousel',
  heading,
  subheading,
  showRating = true,
  showAvatar = true,
  autoplay = true,
  backgroundColor = 'light',
  testimonials = [],
}: TestimonialsBlockProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const bgClass = {
    default: 'bg-white',
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
    primary: 'bg-theme-primary text-white',
  }[backgroundColor] || 'bg-gray-50'

  useEffect(() => {
    if (variant === 'carousel' && autoplay && testimonials.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [variant, autoplay, testimonials.length])

  if (testimonials.length === 0) {
    return (
      <section className={cn('py-16', bgClass)}>
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-500">Nu sunt testimoniale disponibile.</p>
        </div>
      </section>
    )
  }

  const renderTestimonialCard = (testimonial: Testimonial, index: number) => (
    <div
      key={testimonial.id || index}
      className={cn(
        'p-6 rounded-lg',
        backgroundColor === 'dark' ? 'bg-gray-800' : 'bg-white shadow-md',
        variant === 'carousel' && 'max-w-2xl mx-auto'
      )}
    >
      {showRating && testimonial.rating && (
        <div className="mb-4">
          <StarRating rating={parseInt(testimonial.rating) || 5} />
        </div>
      )}
      <blockquote className={cn('text-lg mb-6', variant === 'carousel' && 'text-xl')}>
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>
      <div className="flex items-center gap-4">
        {showAvatar && (
          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {testimonial.avatar?.url ? (
              <Image
                src={testimonial.avatar.url}
                alt={testimonial.avatar.alt || testimonial.name}
                width={48}
                height={48}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-theme-primary text-white text-lg font-bold">
                {testimonial.name.charAt(0)}
              </div>
            )}
          </div>
        )}
        <div>
          <div className="font-semibold">{testimonial.name}</div>
          {testimonial.role && (
            <div className={cn('text-sm', backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
              {testimonial.role}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <section className={cn('py-16', bgClass)}>
      <div className="container mx-auto px-4">
        {(heading || subheading) && (
          <div className="text-center mb-12">
            {heading && (
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{heading}</h2>
            )}
            {subheading && (
              <p className={cn('text-lg max-w-2xl mx-auto', backgroundColor === 'dark' || backgroundColor === 'primary' ? 'text-white/80' : 'text-gray-600')}>
                {subheading}
              </p>
            )}
          </div>
        )}

        {variant === 'carousel' ? (
          <div className="relative">
            {renderTestimonialCard(testimonials[currentIndex], currentIndex)}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={cn(
                      'w-3 h-3 rounded-full transition-colors',
                      index === currentIndex
                        ? 'bg-theme-primary'
                        : backgroundColor === 'dark' || backgroundColor === 'primary'
                        ? 'bg-white/30'
                        : 'bg-gray-300'
                    )}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : variant === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => renderTestimonialCard(testimonial, index))}
          </div>
        ) : variant === 'single-featured' ? (
          <div className="max-w-3xl mx-auto text-center">
            {showRating && testimonials[0].rating && (
              <div className="flex justify-center mb-6">
                <StarRating rating={parseInt(testimonials[0].rating) || 5} />
              </div>
            )}
            <blockquote className="text-2xl md:text-3xl font-medium mb-8">
              &ldquo;{testimonials[0].content}&rdquo;
            </blockquote>
            <div className="flex items-center justify-center gap-4">
              {showAvatar && (
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  {testimonials[0].avatar?.url ? (
                    <Image
                      src={testimonials[0].avatar.url}
                      alt={testimonials[0].avatar.alt || testimonials[0].name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-theme-primary text-white text-xl font-bold">
                      {testimonials[0].name.charAt(0)}
                    </div>
                  )}
                </div>
              )}
              <div className="text-left">
                <div className="font-semibold text-lg">{testimonials[0].name}</div>
                {testimonials[0].role && (
                  <div className={cn('text-sm', backgroundColor === 'dark' || backgroundColor === 'primary' ? 'text-white/70' : 'text-gray-500')}>
                    {testimonials[0].role}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => renderTestimonialCard(testimonial, index))}
          </div>
        )}
      </div>
    </section>
  )
}

export default TestimonialsBlock
