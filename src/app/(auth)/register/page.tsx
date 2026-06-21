'use client'

import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { generateFingerprint } from '@/lib/fingerprint'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

function RegisterForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const refCode = searchParams.get('ref')
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Generate browser fingerprint and check trial eligibility before signup
    let fingerprint: string | undefined
    try {
      fingerprint = await generateFingerprint()
    } catch {
      // Non-blocking: proceed without fingerprint if crypto fails
    }

    const checkRes = await fetch('/api/check-trial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, fingerprint }),
    })
    const { blocked } = await checkRes.json()

    if (blocked) {
      setError("Un essai gratuit a déjà été utilisé depuis cet appareil ou cette adresse email. Vous pouvez vous abonner directement.")
      setLoading(false)
      return
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          ...(refCode ? { referred_by: refCode } : {}),
          ...(fingerprint ? { fingerprint_hash: fingerprint } : {}),
        },
      },
    })

    setLoading(false)

    if (error) {
      setError(error.message)
    } else {
      // Fire-and-forget: the welcome email isn't critical to the signup flow
      fetch('/api/welcome-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      }).catch(() => {})

      if (data.session) {
        router.push('/dashboard')
        router.refresh()
      } else {
        setEmailSent(true)
      }
    }
  }

  if (emailSent) {
    return (
      <div className="w-full max-w-sm">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal-100">
            <svg className="h-6 w-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="mb-2 text-xl font-bold text-gray-900">Vérifiez votre email</h1>
          <p className="text-sm text-gray-500">
            Un lien de confirmation a été envoyé à <span className="font-medium text-gray-700">{email}</span>.
            Cliquez dessus pour activer votre compte.
          </p>
          <p className="mt-4 text-xs text-gray-400">Pensez à vérifier vos spams.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-sm">
      <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-1 text-2xl font-bold text-gray-900">Créer un compte</h1>
        <p className="mb-6 text-sm text-gray-500">14 jours gratuits, sans carte bancaire.</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            id="fullName"
            type="text"
            label="Nom complet"
            placeholder="Dr. Marie Dupont"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
          <Input
            id="email"
            type="email"
            label="Email professionnel"
            placeholder="vous@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type="password"
            label="Mot de passe"
            placeholder="8 caractères minimum"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            minLength={8}
            required
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" loading={loading} className="mt-2 w-full">
            Créer mon compte
          </Button>
        </form>
      </div>
      <p className="mt-4 text-center text-sm text-gray-500">
        Déjà un compte ?{' '}
        <Link href="/login" className="font-medium text-teal-600 hover:text-teal-700">
          Se connecter
        </Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  )
}
