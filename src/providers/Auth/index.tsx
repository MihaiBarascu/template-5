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
  status: 'loggedIn' | 'loggedOut' | undefined
  user?: User | null
}

const Context = createContext({} as AuthContext)

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
      } else {
        throw new Error('A apărut o eroare la deconectare.')
      }
    } catch {
      throw new Error('A apărut o eroare la deconectare.')
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
