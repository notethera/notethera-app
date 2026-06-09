export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/settings/theme-toggle'
import { RemindersToggle } from '@/components/settings/reminders-toggle'
import { ReferralCard } from '@/components/settings/referral-card'
import { revalidatePath } from 'next/cache'

async function updateProfileAction(formData: FormData) {
  'use server'
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  await supabase.from('profiles').update({
    full_name: formData.get('full_name') as string,
  }).eq('id', user!.id)
  revalidatePath('/settings')
}

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [{ data: profile }, { data: referralCount }, { data: affiliateStats }] = await Promise.all([
    supabase.from('profiles').select('full_name, email, reminder_email_enabled, referral_code').eq('id', user!.id).single(),
    supabase.rpc('get_referral_count'),
    supabase.rpc('get_affiliate_stats'),
  ])

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Paramètres</h1>
      <p className="mb-8 text-sm text-gray-500">Gérez vos informations et préférences.</p>

      <div className="flex flex-col gap-6 max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Profil</h2>
          <form action={updateProfileAction} className="flex flex-col gap-4">
            <Input
              id="full_name"
              name="full_name"
              label="Nom complet"
              defaultValue={profile?.full_name ?? ''}
            />
            <Input
              id="email"
              type="email"
              label="Email"
              defaultValue={profile?.email ?? ''}
              disabled
            />
            <Button type="submit">Sauvegarder</Button>
          </form>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <p className="text-sm font-semibold text-gray-900">Apparence</p>
              <p className="text-xs text-gray-500 mt-0.5">Choisissez le thème de l'interface</p>
            </div>
            <ThemeToggle />
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="min-w-0 mr-6">
              <p className="text-sm font-semibold text-gray-900">Rappels de séances</p>
              <p className="text-xs text-gray-500 mt-0.5">Email 24h avant chaque séance planifiée</p>
            </div>
            <RemindersToggle
              userId={user!.id}
              enabled={profile?.reminder_email_enabled ?? false}
            />
          </div>
        </div>

        {profile?.referral_code && (
          <ReferralCard
            code={profile.referral_code}
            referralCount={referralCount ?? 0}
            totalCents={affiliateStats?.total_cents ?? 0}
            pendingCents={affiliateStats?.pending_cents ?? 0}
          />
        )}
      </div>
    </div>
  )
}
