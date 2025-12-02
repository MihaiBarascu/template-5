'use client'

import React, { useState } from 'react'
import { cn } from '@/utilities/cn'

interface CartProduct {
  id: string
  title: string
  price: number
  image?: string
}

interface AddToCartButtonProps {
  product: CartProduct
  className?: string
  disabled?: boolean
  quantity?: number
}

export function AddToCartButton({
  product,
  className,
  disabled = false,
  quantity = 1,
}: AddToCartButtonProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [added, setAdded] = useState(false)

  const handleAddToCart = async () => {
    if (disabled || isAdding) return

    setIsAdding(true)

    try {
      // Get current cart from localStorage
      const cart = JSON.parse(localStorage.getItem('cart') || '[]')
      const existingItem = cart.find((item: { id: string }) => item.id === product.id)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          quantity: quantity,
        })
      }

      localStorage.setItem('cart', JSON.stringify(cart))

      // Dispatch event for cart update
      window.dispatchEvent(new CustomEvent('cartUpdated'))

      setAdded(true)
      setTimeout(() => setAdded(false), 2000)
    } catch (error) {
      console.error('Error adding to cart:', error)
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={disabled || isAdding}
      className={cn(
        'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-medium transition-all',
        'bg-theme-primary text-white hover:bg-theme-primary-dark',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        added && 'bg-green-600 hover:bg-green-700',
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
  )
}

export default AddToCartButton
