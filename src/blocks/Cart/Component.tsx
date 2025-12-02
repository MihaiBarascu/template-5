'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface CartItem {
  id: string
  title: string
  price: number
  image?: string | null
  quantity: number
}

interface CartBlockProps {
  variant?: 'full' | 'compact'
  heading?: string
  showQuantitySelector?: boolean
  showRemoveButton?: boolean
  showSubtotal?: boolean
  checkoutButtonText?: string
  checkoutLink?: string
  emptyCartMessage?: string
  continueShoppingLink?: string
  backgroundColor?: 'default' | 'light' | 'dark'
}

export function CartBlock({
  variant = 'full',
  heading = 'Cosul tau de cumparaturi',
  showQuantitySelector = true,
  showRemoveButton = true,
  showSubtotal = true,
  checkoutButtonText = 'Finalizeaza comanda',
  checkoutLink = '/checkout',
  emptyCartMessage = 'Cosul tau este gol.',
  continueShoppingLink = '/produse',
  backgroundColor = 'default',
}: CartBlockProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const bgClasses = {
    default: 'bg-white',
    light: 'bg-gray-50',
    dark: 'bg-gray-900 text-white',
  }

  useEffect(() => {
    const loadCart = () => {
      const savedCart = JSON.parse(localStorage.getItem('cart') || '[]')
      setCart(savedCart)
      setIsLoading(false)
    }

    loadCart()

    // Listen for cart updates
    const handleCartUpdate = () => loadCart()
    window.addEventListener('cartUpdated', handleCartUpdate)

    return () => window.removeEventListener('cartUpdated', handleCartUpdate)
  }, [])

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return

    const updatedCart = cart.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    )
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }

  const removeItem = (itemId: string) => {
    const updatedCart = cart.filter((item) => item.id !== itemId)
    setCart(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
    window.dispatchEvent(new CustomEvent('cartUpdated'))
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (isLoading) {
    return (
      <section className={`py-16 ${bgClasses[backgroundColor]}`}>
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </section>
    )
  }

  if (cart.length === 0) {
    return (
      <section className={`py-16 ${bgClasses[backgroundColor]}`}>
        <div className="container mx-auto px-4">
          {heading && (
            <h2
              className={`text-3xl font-bold mb-8 ${backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'}`}
            >
              {heading}
            </h2>
          )}
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <p className={`text-lg mb-6 ${backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              {emptyCartMessage}
            </p>
            <Link
              href={continueShoppingLink}
              className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
            >
              Continua cumparaturile
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-16 ${bgClasses[backgroundColor]}`}>
      <div className="container mx-auto px-4">
        {heading && (
          <h2
            className={`text-3xl font-bold mb-8 ${backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            {heading}
          </h2>
        )}

        <div className={`grid gap-8 ${variant === 'full' ? 'lg:grid-cols-3' : ''}`}>
          {/* Cart Items */}
          <div className={variant === 'full' ? 'lg:col-span-2' : ''}>
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-4 p-4 rounded-lg ${
                    backgroundColor === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
                  }`}
                >
                  {/* Image */}
                  <div className="w-20 h-20 relative rounded-md overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.title} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-grow min-w-0">
                    <h3
                      className={`font-semibold truncate ${
                        backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p className={`text-sm ${backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatPrice(item.price)} / buc
                    </p>
                  </div>

                  {/* Quantity */}
                  {showQuantitySelector && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={`w-8 h-8 rounded-md flex items-center justify-center ${
                          backgroundColor === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                        }`}
                      >
                        -
                      </button>
                      <span
                        className={`w-8 text-center font-medium ${
                          backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'
                        }`}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={`w-8 h-8 rounded-md flex items-center justify-center ${
                          backgroundColor === 'dark'
                            ? 'bg-gray-700 hover:bg-gray-600 text-white'
                            : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
                        }`}
                      >
                        +
                      </button>
                    </div>
                  )}

                  {/* Price */}
                  <div
                    className={`font-bold text-right min-w-[80px] ${
                      backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'
                    }`}
                  >
                    {formatPrice(item.price * item.quantity)}
                  </div>

                  {/* Remove */}
                  {showRemoveButton && (
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      aria-label="Remove item"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>

            <Link
              href={continueShoppingLink}
              className={`inline-flex items-center gap-2 mt-6 text-sm ${
                backgroundColor === 'dark' ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              ← Continua cumparaturile
            </Link>
          </div>

          {/* Summary */}
          {showSubtotal && variant === 'full' && (
            <div
              className={`p-6 rounded-lg h-fit ${
                backgroundColor === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
              }`}
            >
              <h3
                className={`text-lg font-semibold mb-4 ${
                  backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'
                }`}
              >
                Sumar comanda
              </h3>

              <div className="space-y-2 mb-4">
                <div
                  className={`flex justify-between ${
                    backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div
                  className={`flex justify-between ${
                    backgroundColor === 'dark' ? 'text-gray-300' : 'text-gray-600'
                  }`}
                >
                  <span>Transport</span>
                  <span>{subtotal >= 200 ? 'Gratuit' : formatPrice(20)}</span>
                </div>
              </div>

              <div
                className={`border-t pt-4 mb-6 ${
                  backgroundColor === 'dark' ? 'border-gray-700' : 'border-gray-200'
                }`}
              >
                <div className="flex justify-between font-bold text-lg">
                  <span className={backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'}>
                    Total
                  </span>
                  <span className={backgroundColor === 'dark' ? 'text-white' : 'text-gray-900'}>
                    {formatPrice(subtotal >= 200 ? subtotal : subtotal + 20)}
                  </span>
                </div>
                {subtotal < 200 && (
                  <p
                    className={`text-sm mt-2 ${
                      backgroundColor === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                  >
                    Mai adauga {formatPrice(200 - subtotal)} pentru transport gratuit!
                  </p>
                )}
              </div>

              <Link
                href={checkoutLink}
                className="w-full bg-primary text-white py-3 px-6 rounded-md hover:bg-primary/90 transition-colors font-medium text-center block"
              >
                {checkoutButtonText}
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default CartBlock
