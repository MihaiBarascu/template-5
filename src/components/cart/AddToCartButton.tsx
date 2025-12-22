'use client'

/**
 * @deprecated This component uses localStorage for cart storage.
 * Use `AddToCart` from `@/components/cart` instead, which uses
 * the official Payload ecommerce plugin with database-stored cart.
 *
 * This file is kept for backward compatibility with existing blocks.
 * Will be removed in a future update.
 */

import React, { useState } from 'react'
import { cn } from '@/utilities/cn'

interface CartProduct {
  id: string
  title: string
  price: number
  image?: string
  maxQuantity?: number // Stoc disponibil - se salvează în coș
}

interface AddToCartButtonProps {
  product: CartProduct
  className?: string
  disabled?: boolean
  quantity?: number
  maxQuantity?: number // Stoc disponibil
}

export function AddToCartButton({
  product,
  className,
  disabled = false,
  quantity = 1,
  maxQuantity,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAddToCart = async () => {
    if (disabled || isAdding) return

    setIsAdding(true)
    setError(null)

    try {
      // Get current cart from localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cart.find((item: { id: string }) => item.id === product.id)
      const currentQuantityInCart = existingItem?.quantity || 0
      const newTotalQuantity = currentQuantityInCart + quantity

      // Check stock limit if maxQuantity is provided
      if (maxQuantity !== undefined && newTotalQuantity > maxQuantity) {
        const canAdd = maxQuantity - currentQuantityInCart
        if (canAdd <= 0) {
          setError(`Ai deja ${currentQuantityInCart} în coș (stoc maxim: ${maxQuantity})`)
        } else {
          setError(`Poți adăuga doar ${canAdd} buc. (stoc disponibil: ${maxQuantity})`)
        }
        setIsAdding(false)
        setTimeout(() => setError(null), 3000)
        return
      }

      if (existingItem) {
        existingItem.quantity += quantity
        // Update maxQuantity in case it changed
        if (maxQuantity !== undefined) {
          existingItem.maxQuantity = maxQuantity
        }
      } else {
        cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: quantity,
          maxQuantity: maxQuantity,
        })
      }

      localStorage.setItem('cart', JSON.stringify(cart))

      // Dispatch event for cart update
      window.dispatchEvent(new CustomEvent('cartUpdated'))

      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (err) {
      console.error('Error adding to cart:', err)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="flex flex-col">
      <button
        onClick={handleAddToCart}
        disabled={disabled || isAdding}
        className={cn(
          'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
          'bg-theme-primary text-theme-text-on-primary hover:bg-theme-primary-dark',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          added && 'bg-green-600 hover:bg-green-700',
          error && 'bg-red-600 hover:bg-red-700',
          className
        )}
      >
        {isAdding ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Se adauga...
          </>
        ) : added ? (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Adaugat in cos!
          </>
        ) : error ? (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Stoc insuficient
          </>
        ) : disabled ? (
          'Indisponibil'
        ) : (
          <>
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Adauga in cos
          </>
        )}
      </button>
      {error && (
        <p className="text-red-600 text-sm mt-1 text-center">{error}</p>
      )}
    </div>
  )
}

export default AddToCartButton
