import type { Metadata } from 'next'

import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import Link from 'next/link'
import type { Order, SystemPage } from '@/payload-types'

export default async function AccountPage() {
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
        limit: 5,
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
    })
  }

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('ro-RO', {
      style: 'currency',
      currency: 'RON',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border">
        <h1 className="text-2xl font-bold mb-2 text-theme-text">
          {account.dashboardTitle || 'Contul meu'}
        </h1>
        <p className="text-theme-text-muted">
          {account.dashboardDescription || 'Din contul tău poți vedea comenzile recente, gestiona adresele de livrare și actualiza informațiile contului.'}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border text-center">
          <div className="text-3xl font-bold text-theme-primary">{orders.length}</div>
          <div className="text-sm text-theme-text-muted">Comenzi recente</div>
        </div>
        <Link
          href="/cont/comenzi"
          className="p-4 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border text-center hover:border-theme-primary transition-colors"
        >
          <div className="text-lg font-medium text-theme-text">Vezi comenzile</div>
          <div className="text-sm text-theme-text-muted">Istoric complet</div>
        </Link>
        <Link
          href="/cont/adrese"
          className="p-4 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border text-center hover:border-theme-primary transition-colors"
        >
          <div className="text-lg font-medium text-theme-text">Adrese salvate</div>
          <div className="text-sm text-theme-text-muted">Gestionează adresele</div>
        </Link>
      </div>

      {/* Recent Orders */}
      <div className="p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-theme-text">Comenzi recente</h2>
          <Link
            href="/cont/comenzi"
            className="text-sm text-theme-primary hover:underline"
          >
            Vezi toate →
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-12 h-12 mx-auto mb-4 text-theme-text-muted"
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
            <p className="text-theme-text-muted mb-4">{account.noOrdersMessage || 'Nu ai comenzi încă.'}</p>
            <Link
              href="/produse"
              className="inline-flex items-center gap-2 bg-theme-primary text-theme-text-on-primary px-4 py-2 rounded-[var(--radius-button)] hover:bg-theme-primary-dark transition-colors"
            >
              Descoperă produsele
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/cont/comenzi/${order.id}`}
                className="block p-4 rounded-lg border border-theme-border hover:border-theme-primary transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-theme-text">
                      Comanda #{typeof order.id === 'string' ? order.id.slice(-8) : order.id}
                    </div>
                    <div className="text-sm text-theme-text-muted">
                      {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-theme-text">
                      {formatPrice(order.amount || 0)}
                    </div>
                    <div className={`text-sm px-2 py-0.5 rounded-full inline-block ${
                      order.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : order.status === 'processing'
                        ? 'bg-blue-100 text-blue-700'
                        : order.status === 'cancelled'
                        ? 'bg-red-100 text-red-700'
                        : order.status === 'refunded'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status === 'completed' ? 'Finalizată' :
                       order.status === 'processing' ? 'În procesare' :
                       order.status === 'cancelled' ? 'Anulată' :
                       order.status === 'refunded' ? 'Rambursată' :
                       order.status || 'Necunoscut'}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const systemPages = await payload.findGlobal({ slug: 'system-pages' }).catch(() => null) as SystemPage | null
  const account = systemPages?.accountPages || {}

  return {
    title: account.dashboardTitle || 'Contul meu',
    description: account.dashboardDescription || 'Gestionează contul tău, vezi comenzile și adresele salvate.',
  }
}
