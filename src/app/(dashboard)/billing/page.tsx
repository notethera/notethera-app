import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CheckCircle2, AlertCircle } from 'lucide-react'

async function startCheckoutAction() {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, email, full_name')
    .eq('id', user.id)
    .single()

  let customerId = profile?.stripe_customer_id
  if (!customerId) {
    const customer = await stripe.customers.create({
      email: profile?.email ?? user.email!,
      name: profile?.full_name ?? undefined,
      metadata: { supabase_user_id: user.id },
    })
    customerId = customer.id
    await supabase.from('profiles').update({ stripe_customer_id: customerId }).eq('id', user.id)
  }

  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: 'subscription',
    line_items: [{ price: process.env.STRIPE_PRICE_ID_PRO!, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/billing`,
    subscription_data: {
      trial_period_days: 14,
      metadata: { supabase_user_id: user.id },
    },
  })

  if (session.url) redirect(session.url)
}

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('subscription_status, trial_ends_at')
    .eq('id', user!.id)
    .single()

  const isActive = profile?.subscription_status === 'active' || profile?.subscription_status === 'trialing'

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Abonnement</h1>
      <p className="mb-8 text-sm text-gray-500">Gérez votre abonnement NoteThéra.</p>

      <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          {isActive ? (
            <CheckCircle2 className="h-5 w-5 text-green-600" />
          ) : (
            <AlertCircle className="h-5 w-5 text-yellow-500" />
          )}
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {profile?.subscription_status === 'trialing' ? 'Essai gratuit en cours' :
               profile?.subscription_status === 'active' ? 'Abonnement actif' :
               profile?.subscription_status === 'past_due' ? 'Paiement en retard' :
               profile?.subscription_status === 'canceled' ? 'Abonnement annulé' :
               'Aucun abonnement'}
            </p>
            {profile?.trial_ends_at && (
              <p className="text-xs text-gray-500">
                Essai jusqu&apos;au {new Date(profile.trial_ends_at).toLocaleDateString('fr-FR')}
              </p>
            )}
          </div>
        </div>

        {!isActive && (
          <form action={startCheckoutAction}>
            <Button type="submit" className="w-full">
              S&apos;abonner – 49 €/mois
            </Button>
            <p className="mt-2 text-center text-xs text-gray-500">14 jours gratuits · Annulation à tout moment</p>
          </form>
        )}

        {isActive && (
          <p className="text-sm text-gray-600">
            Pour gérer ou annuler votre abonnement, contactez{' '}
            <a href="mailto:support@notethera.fr" className="text-teal-600 hover:underline">
              support@notethera.fr
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
