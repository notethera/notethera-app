import { createClient } from '@/lib/supabase/server'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user!.id)
    .single()

  return (
    <div className="p-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Paramètres</h1>
      <p className="mb-8 text-sm text-gray-500">Gérez vos informations personnelles.</p>

      <div className="max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
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
    </div>
  )
}
