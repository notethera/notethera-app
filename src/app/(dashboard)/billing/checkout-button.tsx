'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

export function CheckoutButton() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClick = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/create-checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Une erreur est survenue.')
        setLoading(false)
      }
    } catch {
      setError('Une erreur est survenue.')
      setLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={handleClick} loading={loading} className="w-full">
        S&apos;abonner – 49 €/mois
      </Button>
      <p className="mt-2 text-center text-xs text-gray-500">
        {error ? <span className="text-red-600">{error}</span> : '14 jours gratuits · Annulation à tout moment'}
      </p>
    </div>
  )
}
