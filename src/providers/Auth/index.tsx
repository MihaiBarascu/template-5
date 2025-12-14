'use client'

import type { User } from '@/payload-types'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

type ResetPassword = (args: {
  password: string
  passwordConfirm: string
  token: string
}) => Promise<void>

type ForgotPassword = (args: { email: string }) => Promise<void>

type Create = (args: { email: string; password: string; passwordConfirm: string }) => Promise<void>

type Login = (args: { email: string; password: string }) => Promise<User>

type Logout = () => Promise<void>

type AuthContext = {
  create: Create
  forgotPassword: ForgotPassword
  login: Login
  logout: Logout
  resetPassword: ResetPassword
  setUser: (user: User | null) => void
  refreshUser: () => Promise<User | null>
  status: 'loggedIn' | 'loggedOut' | undefined
  user?: User | null
}

const Context = createContext({} as AuthContext)

// Sync user's active (not purchased) cart ID to localStorage (plugin workaround)
// Plugin bug: requests select[carts]=true but reads user.cart?.docs
async function syncCartToLocalStorage(): Promise<void> {
  if (typeof window === 'undefined') return
  try {
    const res = await fetch('/api/users/me?select[cart]=true', {
      credentials: 'include',
    })
    if (res.ok) {
      const data = await res.json()
      // Find first cart that is NOT purchased
      const carts = data.user?.cart?.docs || []
      const activeCart = carts.find((cart: { id: string; purchasedAt?: string | null }) => !cart.purchasedAt)
      if (activeCart?.id) {
        localStorage.setItem('cart', activeCart.id)
      }
    }
  } catch {
    // Silently fail
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>()
  const [status, setStatus] = useState<'loggedIn' | 'loggedOut' | undefined>()

  const login = useCallback<Login>(async (args) => {
    try {
      const res = await fetch(`/api/users/login`, {
        body: JSON.stringify({
          email: args.email,
          password: args.password,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        const { errors, user } = await res.json()
        if (errors) throw new Error(errors[0].message)

        // Sync cart to localStorage before setting user state
        await syncCartToLocalStorage()

        setUser(user)
        setStatus('loggedIn')

        return user
      }

      throw new Error('Email sau parolă incorecte')
    } catch (e) {
      throw e instanceof Error ? e : new Error('A apărut o eroare la autentificare.')
    }
  }, [])

  const create = useCallback<Create>(async (args) => {
    try {
      const res = await fetch(`/api/users`, {
        body: JSON.stringify({
          email: args.email,
          password: args.password,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        const { errors } = await res.json()
        if (errors) throw new Error(errors[0].message)
        // Auto login after registration
        await login({ email: args.email, password: args.password })
      } else {
        const { errors } = await res.json()
        throw new Error(errors?.[0]?.message || 'Înregistrarea a eșuat')
      }
    } catch (e) {
      throw e instanceof Error ? e : new Error('A apărut o eroare la înregistrare.')
    }
  }, [login])

  const logout = useCallback<Logout>(async () => {
    try {
      const res = await fetch(`/api/users/logout`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        setUser(null)
        setStatus('loggedOut')
        // Clear cart localStorage so user gets fresh cart after logout
        // Plugin stores: 'cart' (cart ID) and 'cart_secret' (guest cart secret)
        if (typeof window !== 'undefined') {
          localStorage.removeItem('cart')
          localStorage.removeItem('cart_secret')
        }
      } else {
        throw new Error('A apărut o eroare la deconectare.')
      }
    } catch {
      throw new Error('A apărut o eroare la deconectare.')
    }
  }, [])

  // Refresh user session - useful when session becomes stale
  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const res = await fetch(`/api/users/me`, {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'GET',
      })

      if (res.ok) {
        const { user: meUser } = await res.json()
        setUser(meUser || null)
        setStatus(meUser ? 'loggedIn' : 'loggedOut')
        return meUser || null
      } else {
        setUser(null)
        setStatus('loggedOut')
        return null
      }
    } catch {
      setUser(null)
      setStatus('loggedOut')
      return null
    }
  }, [])

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch(`/api/users/me`, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          method: 'GET',
        })

        if (res.ok) {
          const { user: meUser } = await res.json()
          setUser(meUser || null)
          setStatus(meUser ? 'loggedIn' : undefined)

          // Sync cart if user is logged in and no cart in localStorage
          if (meUser && !localStorage.getItem('cart')) {
            await syncCartToLocalStorage()
          }
        } else {
          setUser(null)
        }
      } catch {
        setUser(null)
      }
    }

    void fetchMe()
  }, [])

  const forgotPassword = useCallback<ForgotPassword>(async (args) => {
    try {
      const res = await fetch(`/api/users/forgot-password`, {
        body: JSON.stringify({
          email: args.email,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (!res.ok) {
        throw new Error('A apărut o eroare.')
      }
    } catch {
      throw new Error('A apărut o eroare la resetarea parolei.')
    }
  }, [])

  const resetPassword = useCallback<ResetPassword>(async (args) => {
    try {
      const res = await fetch(`/api/users/reset-password`, {
        body: JSON.stringify({
          password: args.password,
          token: args.token,
        }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
      })

      if (res.ok) {
        const { errors, user } = await res.json()
        if (errors) throw new Error(errors[0].message)
        setUser(user)
        setStatus(user ? 'loggedIn' : undefined)
      } else {
        throw new Error('Token invalid sau expirat')
      }
    } catch (e) {
      throw e instanceof Error ? e : new Error('A apărut o eroare la resetarea parolei.')
    }
  }, [])

  return (
    <Context.Provider
      value={{
        create,
        forgotPassword,
        login,
        logout,
        refreshUser,
        resetPassword,
        setUser,
        status,
        user,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useAuth = () => useContext(Context)
