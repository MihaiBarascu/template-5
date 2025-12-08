'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormItem } from '@/components/forms/FormItem'
import { useAuth } from '@/providers/Auth'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useRef, useState } from 'react'

type FormData = {
  email: string
  password: string
  passwordConfirm: string
}

type Props = {
  buttonText?: string
}

export const RegisterForm: React.FC<Props> = ({ buttonText = 'Creează cont' }) => {
  const searchParams = useSearchParams()
  const allParams = searchParams.toString() ? `?${searchParams.toString()}` : ''
  const redirect = useRef(searchParams.get('redirect'))
  const { create } = useAuth()
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    passwordConfirm: '',
  })

  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      setError(null)

      if (formData.password !== formData.passwordConfirm) {
        setError('Parolele nu coincid')
        return
      }

      if (formData.password.length < 6) {
        setError('Parola trebuie să aibă cel puțin 6 caractere')
        return
      }

      setIsLoading(true)

      try {
        await create(formData)
        if (redirect?.current) router.push(redirect.current)
        else router.push('/cont')
      } catch (err) {
        setError(err instanceof Error ? err.message : 'A apărut o eroare. Încercați din nou.')
      } finally {
        setIsLoading(false)
      }
    },
    [create, router, formData],
  )

  return (
    <form onSubmit={onSubmit}>
      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-6">
        <FormItem>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            placeholder="email@exemplu.ro"
          />
        </FormItem>

        <FormItem>
          <Label htmlFor="password">Parolă</Label>
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            placeholder="Minim 6 caractere"
          />
        </FormItem>

        <FormItem>
          <Label htmlFor="passwordConfirm">Confirmă parola</Label>
          <Input
            id="passwordConfirm"
            type="password"
            value={formData.passwordConfirm}
            onChange={(e) => setFormData({ ...formData, passwordConfirm: e.target.value })}
            required
            placeholder="Repetă parola"
          />
        </FormItem>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Button asChild variant="outline" className="flex-1">
          <Link href={`/cont/login${allParams}`}>
            Am deja cont
          </Link>
        </Button>
        <Button
          type="submit"
          className="flex-1 bg-theme-primary hover:bg-theme-primary-dark text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Se creează contul...' : buttonText}
        </Button>
      </div>
    </form>
  )
}
