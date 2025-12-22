'use client'

/**
 * Add to Cart Button - Based on official Payload ecommerce template
 * Styling adapted to use theme system
 */

import type { Product, Variant } from '@/payload-types'
import { useCart } from '@payloadcms/plugin-ecommerce/client/react'
import { cn } from '@/utilities/cn'
import { useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'
import { useToast } from '@/components/Toast'

type Props = {
  product: Product
  className?: string
}

export function AddToCart({ product, className }: Props) {
  const { addItem, cart, isLoading: cartLoading } = useCart()
  const { showToast } = useToast()
  const searchParams = useSearchParams()
  const [isAdding, setIsAdding] = useState(false)
  const isLoading = cartLoading || isAdding

  const selectedVariant = useMemo<Variant | undefined>(() => {
    const variants = product.variants?.docs || []
    if (product.enableVariants && variants.length) {
      const variantId = searchParams.get('variant')

      const validVariant = variants.find((variant) => {
        if (typeof variant === 'object') {
          return String(variant.id) === variantId
        }
        return String(variant) === variantId
      })

      if (validVariant && typeof validVariant === 'object') {
        return validVariant
      }
    }

    return undefined
  }, [product.enableVariants, product.variants?.docs, searchParams])

  const addToCart = useCallback(
    async (e: React.FormEvent<HTMLButtonElement>) => {
      e.preventDefault()
      setIsAdding(true)

      try {
        await addItem({
          product: product.id,
          variant: selectedVariant?.id ?? undefined,
        })
        showToast(`${product.title} a fost adaugat in cos!`, 'success')
      } catch (error) {
        console.error('Error adding to cart:', error)
        showToast('A aparut o eroare. Incercati din nou.', 'error')
      } finally {
        setIsAdding(false)
      }
    },
    [addItem, product, selectedVariant, showToast],
  )

  const disabled = useMemo<boolean>(() => {
    const existingItem = cart?.items?.find((item) => {
      const productID = typeof item.product === 'object' ? item.product?.id : item.product
      const variantID = item.variant
        ? typeof item.variant === 'object'
          ? item.variant?.id
          : item.variant
        : undefined

      if (productID === product.id) {
        if (product.enableVariants) {
          return variantID === selectedVariant?.id
        }
        return true
      }
    })

    if (existingItem) {
      const existingQuantity = existingItem.quantity

      if (product.enableVariants) {
        return existingQuantity >= (selectedVariant?.inventory || 0)
      }
      return existingQuantity >= (product.inventory || 0)
    }

    if (product.enableVariants) {
      if (!selectedVariant) {
        return true
      }

      if (selectedVariant.inventory === 0) {
        return true
      }
    } else {
      if (product.inventory === 0) {
        return true
      }
    }

    return false
  }, [selectedVariant, cart?.items, product])

  // Determine button text
  const buttonText = useMemo(() => {
    if (isLoading) return 'Se incarca...'
    if (product.inventory === 0 || (selectedVariant && selectedVariant.inventory === 0)) {
      return 'Stoc epuizat'
    }
    if (product.enableVariants && !selectedVariant) {
      return 'Selecteaza varianta'
    }
    return 'Adauga in cos'
  }, [isLoading, product, selectedVariant])

  return (
    <button
      aria-label="Adauga in cos"
      className={cn(
        'inline-flex items-center justify-center gap-2 px-6 py-3 rounded-[var(--radius-button)] font-medium transition-all',
        'bg-theme-primary text-theme-text-on-primary hover:bg-theme-primary-dark hover:opacity-90',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className
      )}
      disabled={disabled || isLoading}
      onClick={addToCart}
      type="submit"
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )}
      {buttonText}
    </button>
  )
}

export default AddToCart
