'use client'

import { useState } from 'react'
import { Copy, Check, Users } from 'lucide-react'

interface ReferralCardProps {
  code: string
  count: number
}

export function ReferralCard({ code, count }: ReferralCardProps) {
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/register?ref=${code}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const months = count
  const gainsLabel = months === 0
    ? 'Aucun gain pour le moment'
    : `${months} mois offert${months > 1 ? 's' : ''}`

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-1 text-base font-semibold text-gray-900">Parrainage</h2>
      <p className="mb-4 text-xs text-gray-500">Chaque filleul vous offre 1 mois gratuit.</p>

      <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
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

      <div className="mt-4 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50">
            <Users className="h-4 w-4 text-teal-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{count}</p>
            <p className="text-xs text-gray-500">filleul{count !== 1 ? 's' : ''}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-50">
            <span className="text-sm font-bold text-teal-600">+</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">{gainsLabel}</p>
            <p className="text-xs text-gray-500">gains cumulés</p>
          </div>
        </div>
      </div>
    </div>
  )
}
