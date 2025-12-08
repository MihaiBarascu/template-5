import type { Metadata } from 'next'

import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import { AddressListing } from '@/components/addresses/AddressListing'
import { CreateAddressModal } from '@/components/addresses/CreateAddressModal'
import type { SystemPage } from '@/payload-types'

export default async function AddressesPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (!user) {
    redirect(`/cont/autentificare?redirect=/cont/adrese`)
  }

  // Fetch system pages config
  const systemPages = await payload.findGlobal({ slug: 'system-pages' }).catch(() => null) as SystemPage | null
  const account = systemPages?.accountPages || {}

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border">
        <h1 className="text-2xl font-bold mb-2 text-theme-text">
          {account.addressesTitle || 'Adresele mele'}
        </h1>
        <p className="text-theme-text-muted">
          {account.addressesDescription || 'Gestionează adresele tale de livrare și facturare salvate.'}
        </p>
      </div>

      <div className="p-6 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border">
        <AddressListing />

        <div className="mt-6">
          <CreateAddressModal />
        </div>
      </div>
    </div>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const systemPages = await payload.findGlobal({ slug: 'system-pages' }).catch(() => null) as SystemPage | null
  const account = systemPages?.accountPages || {}

  return {
    title: `${account.addressesTitle || 'Adresele mele'} | Contul meu`,
    description: account.addressesDescription || 'Gestionează adresele tale de livrare și facturare.',
  }
}
