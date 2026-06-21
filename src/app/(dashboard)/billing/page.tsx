export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { CheckoutButton } from './checkout-button'
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react'

const PLANS = [
  {
    id: 'solo' as const,
    name: 'Solo',
    price: '19€',
    period: '/mois',
    description: 'Pour démarrer en douceur',
    limit: '15 notes par mois',
    features: [
      '15 notes cliniques/mois',
      'Transcription Whisper',
      'Génération par IA',
      'Gestion des patients',
      'Export PDF',
    ],
    highlight: false,
    badge: null,
  },
  {
    id: 'pro' as const,
    name: 'Pro',
    price: '49€',
    period: '/mois',
    description: 'Notes illimitées',
    limit: null,
    features: [
      'Notes illimitées',
      'Transcription Whisper',
      'Génération par IA',
      'Gestion des patients',
      'Export PDF',
      'Support prioritaire',
    ],
    highlight: true,
    badge: 'Le plus populaire',
  },
  {
    id: 'pro_annual' as const,
    name: 'Pro Annuel',
    price: '39€',
    period: '/mois',
    description: 'Facturé 468€/an',
    limit: null,
    features: [
      'Notes illimitées',
      'Transcription Whisper',
      'Génération par IA',
      'Gestion des patients',
      'Export PDF',
      'Support prioritaire',
    ],
    highlight: false,
    badge: 'Économisez 20%',
  },
]

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, trial_ends_at')
    .eq('id', user!.id)
    .single()

  const status = profile?.subscription_status
  const isActive = status === 'active' || status === 'trialing'

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Abonnement</h1>
      <p className="mb-8 text-sm text-gray-500">Gérez votre abonnement NoteThéra.</p>

      {/* Statut actuel */}
      <div className="mb-8 flex items-start gap-3 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm max-w-md">
        {isActive ? (
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-600" />
        ) : status === 'past_due' ? (
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-yellow-500" />
        ) : (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-gray-400" />
        )}
        <div>
          <p className="text-sm font-semibold text-gray-900">
            {status === 'trialing' ? 'Essai gratuit en cours' :
             status === 'active' ? 'Abonnement actif' :
             status === 'past_due' ? 'Paiement en retard' :
             status === 'canceled' ? 'Abonnement annulé' :
             'Aucun abonnement actif'}
          </p>
          {profile?.trial_ends_at && status === 'trialing' && (
            <p className="mt-0.5 text-xs text-gray-500">
              Essai jusqu&apos;au {new Date(profile.trial_ends_at).toLocaleDateString('fr-FR')}
            </p>
          )}
          {isActive && (
            <p className="mt-1 text-sm text-gray-500">
              Pour modifier ou annuler votre abonnement, contactez{' '}
              <a href="mailto:support@notethera.fr" className="text-teal-600 hover:underline">
                support@notethera.fr
              </a>
            </p>
          )}
          {status === 'past_due' && (
            <p className="mt-1 text-sm text-gray-500">
              Un problème de paiement a été détecté. Contactez{' '}
              <a href="mailto:support@notethera.fr" className="text-teal-600 hover:underline">
                support@notethera.fr
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Plans tarifaires – affichés uniquement si pas d'abonnement actif */}
      {!isActive && (
        <>
          <h2 className="mb-6 text-lg font-semibold text-gray-900">Choisissez votre plan</h2>
          <p className="mb-8 text-sm text-gray-500">14 jours d&apos;essai gratuit · Sans carte bancaire · Annulation à tout moment</p>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-6 ${
                  plan.highlight
                    ? 'border-2 border-teal-600 bg-white shadow-lg'
                    : 'border border-gray-200 bg-white'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span
                      className={`rounded-full px-3 py-0.5 text-xs font-semibold text-white ${
                        plan.id === 'pro_annual' ? 'bg-amber-500' : 'bg-teal-600'
                      }`}
                    >
                      {plan.badge}
                    </span>
                  </div>
                )}

                <p className={`text-xs font-semibold uppercase tracking-wide ${plan.highlight ? 'text-teal-600' : 'text-gray-500'}`}>
                  {plan.name}
                </p>
                <div className="mt-3 flex items-end gap-1">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="mb-1 text-sm text-gray-500">{plan.period}</span>
                </div>
                <p className="mt-1 text-xs text-gray-500">{plan.description}</p>

                <ul className="mt-5 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-teal-500">✓</span> {f}
                    </li>
                  ))}
                </ul>

                <div className="mt-6">
                  <CheckoutButton
                    planId={plan.id}
                    label={plan.highlight ? `S'abonner – ${plan.price}/mois` : `Choisir ${plan.name}`}
                    variant={plan.highlight ? 'primary' : 'secondary'}
                  />
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
