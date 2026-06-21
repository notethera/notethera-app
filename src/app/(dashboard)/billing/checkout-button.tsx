'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'

type PlanId = 'solo' | 'pro' | 'pro_annual'

interface CheckoutButtonProps {
  planId: PlanId
  label: string
  variant?: 'primary' | 'secondary'
  className?: string
}

export function CheckoutButton({ planId, label, variant = 'primary', className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleClick = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      })
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
      <Button onClick={handleClick} loading={loading} variant={variant} className={className ?? 'w-full'}>
        {label}
      </Button>
      {error && <p className="mt-2 text-center text-xs text-red-600">{error}</p>}
    </div>
  )
}
