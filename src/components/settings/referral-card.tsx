'use client'

import { useState } from 'react'
import { Copy, Check, Users, Euro, Clock } from 'lucide-react'

interface ReferralCardProps {
  code: string
  referralCount: number
  totalCents: number
  pendingCents: number
}

function formatEuros(cents: number) {
  return (cents / 100).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })
}

export function ReferralCard({ code, referralCount, totalCents, pendingCents }: ReferralCardProps) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/register?ref=${code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-1 text-base font-semibold text-gray-900">Affiliation</h2>
      <p className="mb-4 text-xs text-gray-500">
        Gagnez <span className="font-semibold text-teal-600">30 %</span> sur chaque abonnement souscrit via votre lien.
      </p>

      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 mb-4">
        <span className="flex-1 truncate font-mono text-sm text-gray-700">
          /register?ref={code}
        </span>
        <button
          onClick={copy}
          className="flex-shrink-0 rounded-md p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
          title="Copier le lien"
        >
          {copied ? <Check className="h-4 w-4 text-teal-600" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-start gap-1 rounded-xl bg-gray-50 p-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50">
            <Users className="h-3.5 w-3.5 text-teal-600" />
          </div>
          <p className="text-sm font-semibold text-gray-900">{referralCount}</p>
          <p className="text-xs text-gray-500">filleul{referralCount !== 1 ? 's' : ''}</p>
        </div>

        <div className="flex flex-col items-start gap-1 rounded-xl bg-gray-50 p-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50">
            <Euro className="h-3.5 w-3.5 text-teal-600" />
          </div>
          <p className="text-sm font-semibold text-gray-900">{formatEuros(totalCents)}</p>
          <p className="text-xs text-gray-500">total gagné</p>
        </div>

        <div className="flex flex-col items-start gap-1 rounded-xl bg-gray-50 p-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50">
            <Clock className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <p className="text-sm font-semibold text-gray-900">{formatEuros(pendingCents)}</p>
          <p className="text-xs text-gray-500">à percevoir</p>
        </div>
      </div>

      {pendingCents > 0 && (
        <p className="mt-4 text-xs text-gray-400">
          Pour recevoir vos gains, contactez-nous à{' '}
          <a href="mailto:hello@notethera.fr" className="text-teal-600 underline underline-offset-2">
            hello@notethera.fr
          </a>
        </p>
      )}
    </div>
  )
}
