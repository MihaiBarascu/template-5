import type { Metadata } from 'next'

import Link from 'next/link'
import { headers as getHeaders } from 'next/headers'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/account/LoginForm'
import type { SystemPage } from '@/payload-types'

export default async function LoginPage() {
  const headers = await getHeaders()
  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers })

  if (user) {
    redirect('/cont')
  }

  // Fetch system pages config
  const systemPages = await payload.findGlobal({ slug: 'system-pages' }).catch(() => null) as SystemPage | null
  const account = systemPages?.accountPages || {}

  return (
    <section className="py-16 bg-theme-surface min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <div className="p-8 rounded-[var(--radius-card)] bg-theme-surface-secondary border border-theme-border">
            <h1 className="text-2xl font-bold mb-2 text-theme-text">
              {account.loginTitle || 'Autentificare'}
            </h1>
            <p className="text-theme-text-muted mb-8">
              {account.loginDescription || 'Conectează-te la contul tău pentru a vedea comenzile și a gestiona adresele salvate.'}
            </p>
            <LoginForm buttonText={account.loginButton || 'Autentificare'} />
          </div>

          <p className="text-center mt-6 text-sm text-theme-text-muted">
            Nu ai un cont?{' '}
            <Link href="/cont/register" className="text-theme-primary hover:underline">
              Înregistrează-te gratuit
            </Link>
          </p>
        </div>
      </div>
    </section>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const payload = await getPayload({ config: configPromise })
  const systemPages = await payload.findGlobal({ slug: 'system-pages' }).catch(() => null) as SystemPage | null
  const account = systemPages?.accountPages || {}

  return {
    title: `${account.loginTitle || 'Autentificare'} | Contul meu`,
    description: account.loginDescription || 'Conectează-te la contul tău pentru a accesa comenzile și setările.',
  }
}
