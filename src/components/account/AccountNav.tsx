'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/Auth'
import { useRouter } from 'next/navigation'

export type AccountNavLabels = {
  menuDashboard?: string | null
  menuOrders?: string | null
  menuAddresses?: string | null
  menuLogout?: string | null
}

type Props = {
  className?: string
  labels?: AccountNavLabels
}

const getNavItems = (labels: AccountNavLabels) => [
  { href: '/cont', label: labels.menuDashboard || 'Contul meu', icon: 'user' },
  { href: '/cont/comenzi', label: labels.menuOrders || 'Comenzile mele', icon: 'orders' },
  { href: '/cont/adrese', label: labels.menuAddresses || 'Adresele mele', icon: 'address' },
]

const icons = {
  user: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  orders: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
    </svg>
  ),
  address: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  ),
  logout: (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
    </svg>
  ),
}

export const AccountNav: React.FC<Props> = ({ className = '', labels = {} }) => {
  const pathname = usePathname()
  const { logout } = useAuth()
  const router = useRouter()
  const navItems = getNavItems(labels)

  const handleLogout = async () => {
    try {
      await logout()
      router.refresh()
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <nav className={className}>
      <ul className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== '/cont' && pathname.startsWith(item.href))

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-theme-primary/10 text-theme-primary font-medium'
                    : 'text-theme-text-muted hover:bg-theme-surface-secondary hover:text-theme-text'
                }`}
              >
                {icons[item.icon as keyof typeof icons]}
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>

      <hr className="my-4 border-theme-border" />

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left text-theme-text-muted hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        {icons.logout}
        {labels.menuLogout || 'Deconectare'}
      </button>
    </nav>
  )
}
