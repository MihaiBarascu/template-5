import type { Metadata } from 'next'

import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import type { Order, Product, Media } from '@/payload-types'

type Props = {
  params: Promise<{ id: string }>
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  let order: Order | null = null

  if (user) {
    try {
      order = await payload.findByID({
        collection: 'orders',
        id,
        user,
        overrideAccess: false,
        depth: 2,
      })

      // Verify ownership
      const customerId = typeof order?.customer === 'object' ? order.customer?.id : order?.customer
      if (customerId !== user.id) {
        order = null
      }
    } catch {
      // Order not found or access denied
    }
  }

  if (!order) {
    notFound()
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusLabel = (status: string | null | undefined) => {
    const labels: Record<string, { text: string; class: string }> = {
      processing: { text: 'În procesare', class: 'bg-blue-100 text-blue-700' },
      completed: { text: 'Finalizată', class: 'bg-green-100 text-green-700' },
      cancelled: { text: 'Anulată', class: 'bg-red-100 text-red-700' },
      refunded: { text: 'Rambursată', class: 'bg-yellow-100 text-yellow-700' },
    }
    return labels[status || ''] || { text: status || 'Necunoscut', class: 'bg-gray-100 text-gray-700' }
  }

  const status = getStatusLabel(order.status)

  return (
    <div className="space-y-6">
      {/* Back Link */}
      <Link
        href="/cont/comenzi"
        className="inline-flex items-center gap-2 text-theme-text-muted hover:text-theme-primary transition-colors"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Înapoi la comenzi
      </Link>

      {/* Order Header */}
      <div className="p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-theme-text">
              Comanda #{typeof order.id === 'string' ? order.id.slice(-8).toUpperCase() : order.id}
            </h1>
            <p className="text-theme-text-muted">{formatDate(order.createdAt)}</p>
          </div>
          <span className={`text-sm px-3 py-1.5 rounded-full ${status.class}`}>
            {status.text}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border">
        <h2 className="text-lg font-bold mb-4 text-theme-text">Produse comandate</h2>
        <div className="space-y-4">
          {order.items?.map((item, index) => {
            const product = item.product as Product | undefined
            if (!product || typeof product !== 'object') return null

            const firstImage = product.images?.[0]?.image as Media | undefined
            const imageUrl = firstImage?.url

            return (
              <div key={index} className="flex gap-4 pb-4 border-b border-theme-border last:border-0 last:pb-0">
                <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0 bg-theme-surface border border-theme-border">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={product.title || ''}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-theme-text-muted">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-medium text-theme-text">{product.title}</h3>
                  <p className="text-sm text-theme-text-muted">
                    Cantitate: {item.quantity}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-medium text-theme-text">
                    {formatPrice((product.priceInRON || 0) * (item.quantity || 1))}
                  </div>
                  <div className="text-sm text-theme-text-muted">
                    {formatPrice(product.priceInRON || 0)} / buc
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border">
        <h2 className="text-lg font-bold mb-4 text-theme-text">Sumar comandă</h2>
        <div className="space-y-2">
          <div className="flex justify-between text-lg font-bold text-theme-text">
            <span>Total</span>
            <span>{formatPrice(order.amount || 0)}</span>
          </div>
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && typeof order.shippingAddress === 'object' && (
        <div className="p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border">
          <h2 className="text-lg font-bold mb-4 text-theme-text">Adresa de livrare</h2>
          <div className="text-theme-text-muted">
            <p className="font-medium text-theme-text">
              {order.shippingAddress.firstName} {order.shippingAddress.lastName}
            </p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            {order.shippingAddress.phone && <p>Tel: {order.shippingAddress.phone}</p>}
          </div>
        </div>
      )}
    </div>
  )
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  return {
    title: `Comanda #${id.slice(-8).toUpperCase()} | Contul meu`,
    description: 'Detaliile comenzii tale.',
  }
}
