/**
 * Script de création des produits et prix Stripe pour NoteThéra.
 * Usage: STRIPE_SECRET_KEY=sk_... node scripts/setup-stripe.mjs
 */
import Stripe from 'stripe'

const key = process.env.STRIPE_SECRET_KEY
if (!key || key.startsWith('your_')) {
  console.error('Erreur: définissez STRIPE_SECRET_KEY avant de lancer ce script.')
  process.exit(1)
}

const stripe = new Stripe(key)

async function main() {
  console.log('Création des produits Stripe pour NoteThéra...\n')

  // Produit Solo
  const soloProduct = await stripe.products.create({
    name: 'NoteThéra Solo',
    description: 'Idéal pour démarrer – 15 notes cliniques par mois',
    metadata: { plan: 'solo' },
  })
  const soloPrice = await stripe.prices.create({
    product: soloProduct.id,
    unit_amount: 1900,
    currency: 'eur',
    recurring: { interval: 'month' },
    metadata: { plan: 'solo' },
  })
  console.log(`Solo créé     : ${soloPrice.id}`)

  // Produit Pro (mensuel)
  const proProduct = await stripe.products.create({
    name: 'NoteThéra Pro',
    description: 'Notes illimitées, toutes les fonctionnalités',
    metadata: { plan: 'pro' },
  })
  const proPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 4900,
    currency: 'eur',
    recurring: { interval: 'month' },
    metadata: { plan: 'pro' },
  })
  console.log(`Pro créé      : ${proPrice.id}`)

  // Pro Annuel (même produit, facturation annuelle à 468 €/an soit 39 €/mois)
  const proAnnualPrice = await stripe.prices.create({
    product: proProduct.id,
    unit_amount: 46800,
    currency: 'eur',
    recurring: { interval: 'year' },
    metadata: { plan: 'pro_annual' },
  })
  console.log(`Pro Annuel créé: ${proAnnualPrice.id}`)

  console.log('\nAjoutez ces lignes dans votre .env.local et dans Vercel:\n')
  console.log(`STRIPE_PRICE_ID_SOLO=${soloPrice.id}`)
  console.log(`STRIPE_PRICE_ID_PRO=${proPrice.id}`)
  console.log(`STRIPE_PRICE_ID_PRO_ANNUAL=${proAnnualPrice.id}`)
}

main().catch((err) => {
  console.error(err.message)
  process.exit(1)
})
