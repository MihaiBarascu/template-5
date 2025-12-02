'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface CartItem {
  id: string
  title: string
  price: number
  quantity: number
  image?: string
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const savedCart = localStorage.getItem('cart')
    if (savedCart) {
      setCartItems(JSON.parse(savedCart))
    }
    setIsLoading(false)
  }, [])

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity < 1) {
      removeItem(id)
      return
    }
    const updatedCart = cartItems.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    )
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem('cart', JSON.stringify(updatedCart))
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.removeItem('cart')
  }

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  if (isLoading) {
    return (
      <main className="py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="py-8">
      {/* Header */}
      <div className="bg-gray-50 py-12 mb-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Cosul Tau
          </h1>
          <p className="text-gray-600">
            {cartItems.length > 0
              ? `${cartItems.length} ${cartItems.length === 1 ? 'produs' : 'produse'} in cos`
              : 'Verifica produsele si finalizeaza comanda'}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map(item => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 bg-white border border-gray-200 rounded-lg"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                        Fara imagine
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">
                      {item.title}
                    </h3>
                    <p className="text-theme-primary font-bold mt-1">
                      {item.price} RON
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Item Total & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Sterge"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    <p className="font-bold text-gray-900">
                      {item.price * item.quantity} RON
                    </p>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="text-sm text-gray-500 hover:text-red-500 transition-colors"
              >
                Goleste cosul
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Sumar Comanda
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span>{total} RON</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Livrare</span>
                    <span>{total >= 200 ? 'Gratuita' : '25 RON'}</span>
                  </div>
                  {total < 200 && (
                    <p className="text-xs text-gray-500">
                      Mai adauga {200 - total} RON pentru livrare gratuita
                    </p>
                  )}
                  <hr className="border-gray-300" />
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span>{total >= 200 ? total : total + 25} RON</span>
                  </div>
                </div>

                <button className="w-full bg-theme-primary text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity">
                  Finalizeaza Comanda
                </button>

                <Link
                  href="/produse"
                  className="block text-center mt-4 text-theme-primary hover:underline"
                >
                  Continua cumparaturile
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Empty Cart */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Cosul tau este gol
            </h2>
            <p className="text-gray-600 mb-6">
              Adauga produse in cos pentru a continua cumparaturile
            </p>
            <Link
              href="/produse"
              className="inline-flex items-center gap-2 bg-theme-primary text-white py-3 px-6 rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              Vezi Produsele
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
