'use client'

import React, { useEffect, useRef, useState } from 'react'
import { cn } from '@/utilities/cn'

type AnimationType =
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip-up'
  | 'flip-down'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'bounce'
  | 'none'

interface ScrollAnimationProps {
  children: React.ReactNode
  animation?: AnimationType
  delay?: number // in ms
  duration?: number // in ms
  threshold?: number // 0 to 1
  once?: boolean // animate only once
  className?: string
  as?: React.ElementType
}

export function ScrollAnimation({
  children,
  animation = 'fade-up',
  delay = 0,
  duration = 600,
  threshold = 0.1,
  once = true,
  className,
  as: Component = 'div',
}: ScrollAnimationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          if (once && ref.current) {
            observer.unobserve(ref.current)
          }
        } else if (!once) {
          setIsVisible(false)
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px', // Trigger slightly before element is in view
      }
    )

    const currentRef = ref.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [threshold, once])

  const getAnimationStyles = (): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      transitionProperty: 'opacity, transform',
      transitionDuration: `${duration}ms`,
      transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      transitionDelay: `${delay}ms`,
    }

    if (!isVisible) {
      switch (animation) {
        case 'fade-up':
          return { ...baseStyles, opacity: 0, transform: 'translateY(40px)' }
        case 'fade-down':
          return { ...baseStyles, opacity: 0, transform: 'translateY(-40px)' }
        case 'fade-left':
          return { ...baseStyles, opacity: 0, transform: 'translateX(40px)' }
        case 'fade-right':
          return { ...baseStyles, opacity: 0, transform: 'translateX(-40px)' }
        case 'zoom-in':
          return { ...baseStyles, opacity: 0, transform: 'scale(0.9)' }
        case 'zoom-out':
          return { ...baseStyles, opacity: 0, transform: 'scale(1.1)' }
        case 'flip-up':
          return { ...baseStyles, opacity: 0, transform: 'perspective(1000px) rotateX(45deg)' }
        case 'flip-down':
          return { ...baseStyles, opacity: 0, transform: 'perspective(1000px) rotateX(-45deg)' }
        case 'slide-up':
          return { ...baseStyles, transform: 'translateY(100%)' }
        case 'slide-down':
          return { ...baseStyles, transform: 'translateY(-100%)' }
        case 'slide-left':
          return { ...baseStyles, transform: 'translateX(100%)' }
        case 'slide-right':
          return { ...baseStyles, transform: 'translateX(-100%)' }
        case 'bounce':
          return { ...baseStyles, opacity: 0, transform: 'translateY(40px) scale(0.95)' }
        case 'none':
        default:
          return baseStyles
      }
    }

    return {
      ...baseStyles,
      opacity: 1,
      transform: 'none',
    }
  }

  return React.createElement(
    Component,
    {
      ref,
      className: cn(className),
      style: getAnimationStyles(),
    },
    children
  )
}

// Staggered animation wrapper for lists/grids
interface StaggeredAnimationProps {
  children: React.ReactNode[]
  animation?: AnimationType
  staggerDelay?: number // delay between each child in ms
  duration?: number
  threshold?: number
  once?: boolean
  className?: string
  childClassName?: string
}

export function StaggeredAnimation({
  children,
  animation = 'fade-up',
  staggerDelay = 100,
  duration = 600,
  threshold = 0.1,
  once = true,
  className,
  childClassName,
}: StaggeredAnimationProps) {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <ScrollAnimation
          animation={animation}
          delay={index * staggerDelay}
          duration={duration}
          threshold={threshold}
          once={once}
          className={childClassName}
        >
          {child}
        </ScrollAnimation>
      ))}
    </div>
  )
}

export default ScrollAnimation
