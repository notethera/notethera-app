/**
 * Backfill subscription_plan pour les abonnés existants sans plan renseigné.
 * Interroge Stripe pour chaque subscription_id et mappe le price_id vers le bon plan.
 *
 * Usage: node --env-file=.env.local scripts/backfill-subscription-plan.mjs
 */
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const planMap = {
  [process.env.STRIPE_PRICE_ID_SOLO]: 'solo',
  [process.env.STRIPE_PRICE_ID_PRO]: 'pro',
  [process.env.STRIPE_PRICE_ID_PRO_ANNUAL]: 'pro_annual',
}

// Fetch all profiles with an active/trialing subscription but no plan set
const { data: profiles, error } = await supabase
  .from('profiles')
  .select('id, stripe_subscription_id, subscription_status')
  .in('subscription_status', ['active', 'trialing'])
  .is('subscription_plan', null)

if (error) {
  console.error('Erreur Supabase:', error.message)
  process.exit(1)
}

if (!profiles?.length) {
  console.log('Aucun profil à mettre à jour.')
  process.exit(0)
}

console.log(`${profiles.length} profil(s) à mettre à jour...\n`)

let updated = 0
let skipped = 0

for (const profile of profiles) {
  const subId = profile.stripe_subscription_id
  if (!subId) {
    console.log(`  [skip] ${profile.id} — pas de stripe_subscription_id`)
    skipped++
    continue
  }

  let plan
  try {
    const sub = await stripe.subscriptions.retrieve(subId)
    const priceId = sub.items.data[0]?.price?.id ?? ''
    plan = planMap[priceId]

    if (!plan) {
      // Price ID inconnu (ex: ancien plan avant la refonte) → on met 'pro' par défaut
      console.log(`  [fallback→pro] ${profile.id} — price_id inconnu : ${priceId}`)
      plan = 'pro'
    }
  } catch (err) {
    console.log(`  [skip] ${profile.id} — subscription Stripe introuvable : ${err.message}`)
    skipped++
    continue
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ subscription_plan: plan })
    .eq('id', profile.id)

  if (updateError) {
    console.log(`  [erreur] ${profile.id} — ${updateError.message}`)
  } else {
    console.log(`  [ok] ${profile.id} → ${plan}`)
    updated++
  }
}

console.log(`\nTerminé : ${updated} mis à jour, ${skipped} ignorés.`)
