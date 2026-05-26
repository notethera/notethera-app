'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      if (error.code === 'email_not_confirmed') {
        setError('Veuillez confirmer votre email avant de vous connecter. Vérifiez votre boîte mail (et vos spams).')
      } else {
        setError('Email ou mot de passe incorrect.')
      }
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">Connexion</h1>
        <p className="mb-6 text-sm text-gray-500">Bienvenue, connectez-vous à votre compte.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="email"
            type="email"
            label="Email"
            placeholder="vous@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type="password"
            label="Mot de passe"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" loading={loading} className="mt-2 w-full">
            Se connecter
          </Button>
        </form>
      </div>
      <p className="mt-4 text-center text-sm text-gray-500">
        Pas encore de compte ?{' '}
        <Link href="/register" className="font-medium text-teal-600 hover:text-teal-700">
          Créer un compte
        </Link>
      </p>
    </div>
  )
}
