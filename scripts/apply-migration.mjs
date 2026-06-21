/**
 * Applique la migration 008 (colonne subscription_plan) sur Supabase.
 * Usage: SUPABASE_ACCESS_TOKEN=sbp_... node --env-file=.env.local scripts/apply-migration.mjs
 *
 * Le token personnel est disponible sur :
 * https://supabase.com/dashboard/account/tokens
 */
import { readFileSync } from 'fs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const projectRef = supabaseUrl?.match(/https:\/\/([^.]+)\./)?.[1]
const token = process.env.SUPABASE_ACCESS_TOKEN
const sql = readFileSync('supabase/migrations/008_add_subscription_plan.sql', 'utf8')

if (!token) {
  console.log('Aucun SUPABASE_ACCESS_TOKEN fourni.')
  console.log(`\nCollez ce SQL dans l'éditeur Supabase :\n`)
  console.log(`  https://supabase.com/dashboard/project/${projectRef}/sql/new\n`)
  console.log('──────────────────────────────────────')
  console.log(sql)
  console.log('──────────────────────────────────────')
  process.exit(0)
}

console.log(`Application de la migration sur le projet ${projectRef}...`)

const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ query: sql }),
})

if (res.ok) {
  console.log('Migration appliquée avec succès.')
} else {
  const body = await res.text()
  console.error('Erreur lors de la migration :', body)
  process.exit(1)
}
