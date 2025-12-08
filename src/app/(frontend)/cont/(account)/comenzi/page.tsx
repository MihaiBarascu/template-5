import type { Metadata } from 'next'

import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import type { Order, SystemPage } from '@/payload-types'

export default async function OrdersPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  // Fetch system pages config
  const systemPages = await payload.findGlobal({ slug: 'system-pages' }).catch(() => null) as SystemPage | null
  const account = systemPages?.accountPages || {}

  let orders: Order[] = []

  if (user) {
    try {
      const ordersResult = await payload.find({
        collection: 'orders',
        limit: 50,
        user,
        overrideAccess: false,
        where: {
          customer: {
            equals: user.id,
          },
        },
        sort: '-createdAt',
      })
      orders = ordersResult?.docs || []
    } catch {
      // Silently handle error
    }
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

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border">
        <h1 className="text-2xl font-bold mb-2 text-theme-text">
          {account.ordersTitle || 'Comenzile mele'}
        </h1>
        <p className="text-theme-text-muted">
          {account.ordersDescription || 'Istoricul tuturor comenzilor tale. Click pe o comandă pentru detalii.'}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="p-8 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border text-center">
          <svg
            className="w-16 h-16 mx-auto mb-4 text-theme-text-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-lg text-theme-text-muted mb-4">
            {account.noOrdersMessage || 'Nu ai comenzi încă.'}
          </p>
          <Link
            href="/produse"
            className="inline-flex items-center gap-2 bg-theme-primary text-white px-6 py-3 rounded-[var(--radius-button)] hover:bg-theme-primary-dark transition-colors"
          >
            Descoperă produsele
            <span>→</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = getStatusLabel(order.status || 'pending')
            return (
              <Link
                key={order.id}
                href={`/cont/comenzi/${order.id}`}
                className="block p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border hover:border-theme-primary transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-theme-text">
                        Comanda #{typeof order.id === 'string' ? order.id.slice(-8).toUpperCase() : order.id}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${status.class}`}>
                        {status.text}
                      </span>
                    </div>
                    <div className="text-sm text-theme-text-muted">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-theme-text">
                      {formatPrice(order.amount || 0)}
                    </div>
                    <div className="text-sm text-theme-text-muted">
                      {order.items?.length || 0} produse
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const systemPages = await payload.findGlobal({ slug: 'system-pages' }).catch(() => null) as SystemPage | null
  const account = systemPages?.accountPages || {}

  return {
    title: `${account.ordersTitle || 'Comenzile mele'} | Contul meu`,
    description: account.ordersDescription || 'Vezi istoricul comenzilor tale.',
  }
}
