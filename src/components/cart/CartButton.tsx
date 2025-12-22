'use client'

/**
 * @deprecated This component uses localStorage for cart storage.
 * Use `Cart` or `OpenCartButton` from `@/components/cart` instead,
 * which use the official Payload ecommerce plugin with database-stored cart.
 *
 * This file is kept for backward compatibility.
 * Will be removed in a future update.
 */

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { cn } from '@/utilities/cn'

interface CartItem {
  id: string
  quantity: number
}

interface CartButtonProps {
  className?: string
  variant?: 'default' | 'outline' | 'ghost'
  showLabel?: boolean
}

export function CartButton({
  className,
  variant = 'default',
  showLabel = false
}: CartButtonProps) {
  const [itemCount, setItemCount] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  // Load cart count on mount and listen for updates
  useEffect(() => {
    const updateCartCount = () => {
      try {
        const cart: CartItem[] = JSON.parse(localStorage.getItem('cart') || '[]')
        const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0)
        setItemCount(prev => {
          // Trigger animation if count increased
          if (count > prev) {
            setIsAnimating(true)
            setTimeout(() => setIsAnimating(false), 300)
          }
          return count
        })
      } catch {
        setItemCount(0)
      }
    }

    // Initial load
    updateCartCount()

    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCartCount)
    window.addEventListener('storage', updateCartCount)

    return () => {
      window.removeEventListener('cartUpdated', updateCartCount)
      window.removeEventListener('storage', updateCartCount)
    }
  }, [])

  const variantClasses = {
    default: 'bg-theme-primary text-theme-text-on-primary hover:bg-theme-primary/90',
    outline: 'border-2 border-theme-primary text-theme-primary hover:bg-theme-primary hover:text-theme-text-on-primary',
    ghost: 'text-theme-text hover:bg-theme-primary/10 hover:text-theme-primary',
  }

  return (
    <Link
      href="/cos"
      className={cn(
        'relative inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-theme-primary focus-visible:ring-offset-2',
        variantClasses[variant],
        isAnimating && 'scale-110',
        className
      )}
      aria-label={`Cos de cumparaturi${itemCount > 0 ? `, ${itemCount} produse` : ''}`}
    >
      {/* Cart Icon */}
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>

      {/* Label (optional) */}
      {showLabel && (
        <span className="hidden sm:inline">Cos</span>
      )}

      {/* Badge */}
      {itemCount > 0 && (
        <span
          className={cn(
            'absolute -top-1.5 -right-1.5 flex items-center justify-center',
            'min-w-[20px] h-5 px-1.5 rounded-full text-xs font-bold',
            'bg-theme-accent text-theme-text-on-accent',
            'transform transition-transform duration-200',
            isAnimating && 'scale-125'
          )}
        >
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  )
}

export default CartButton
