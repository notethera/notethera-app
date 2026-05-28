export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Users, FileText, Plus, Clock } from 'lucide-react'
import { OnboardingChecklist } from '@/components/dashboard/onboarding-checklist'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { count: patientCount }, { data: recentNotes }, { count: noteCount }, { count: generatedNoteCount }] = await Promise.all([
    supabase.from('profiles').select('full_name, subscription_status, email').eq('id', user!.id).single(),
    supabase.from('patients').select('*', { count: 'exact', head: true }).eq('therapist_id', user!.id),
    supabase
      .from('session_notes')
      .select('id, session_date, title, patient:patients(alias)')
      .eq('therapist_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('session_notes').select('*', { count: 'exact', head: true }).eq('therapist_id', user!.id),
    supabase.from('session_notes').select('*', { count: 'exact', head: true }).eq('therapist_id', user!.id).not('note_content', 'is', null),
  ])

  // Prénom : profil → métadonnées auth → fallback
  const metaName = (user?.user_metadata?.full_name ?? user?.user_metadata?.name) as string | undefined
  const rawName = profile?.full_name ?? metaName ?? ''
  // Prend le premier mot qui ressemble à un prénom (> 1 char, pas tout en majuscules)
  const nameParts = rawName.trim().split(/\s+/)
  const firstName = (nameParts.find((p: string) => p.length > 1 && p !== p.toUpperCase())
    ?? nameParts[0]
    ?? '') || 'Docteur'

  console.log('firstName:', firstName)

  const generatedCount = generatedNoteCount ?? 0
  const savedMinutes = generatedCount * 20
  const savedTime = savedMinutes === 0
    ? '—'
    : savedMinutes < 60
      ? `${savedMinutes} min`
      : savedMinutes % 60 === 0
        ? `${savedMinutes / 60}h`
        : `${Math.floor(savedMinutes / 60)}h${String(savedMinutes % 60).padStart(2, '0')}`

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1>Bonjour, Dr. {firstName}</h1>
        <p className="mt-1 text-sm text-gray-500">Voici un aperçu de votre activité</p>
      </div>

      <OnboardingChecklist
        hasPatient={(patientCount ?? 0) > 0}
        hasNote={(noteCount ?? 0) > 0}
        hasGeneratedNote={(generatedNoteCount ?? 0) > 0}
        totalNotes={noteCount ?? 0}
      />

      <div className="mb-8 grid grid-cols-3 gap-4">
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
              <Users className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{patientCount ?? 0}</p>
              <p className="text-sm text-gray-500">Patients</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
              <FileText className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{noteCount ?? 0}</p>
              <p className="text-sm text-gray-500">Notes de séance</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
              <Clock className="h-5 w-5 text-teal-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{savedTime}</p>
              <p className="text-sm text-gray-500">Temps économisé</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-xl bg-white shadow-sm border border-gray-100">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Notes récentes</h2>
          <Link
            href="/notes"
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Nouvelle note
          </Link>
        </div>
        {recentNotes?.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            Aucune note pour le moment. Créez votre première note de séance.
          </div>
        ) : (
          <>
            <ul className="divide-y divide-gray-100">
              {recentNotes?.map((note) => {
                const n = note as unknown as { id: string; session_date: string; title: string | null; patient: { alias: string } | null }
                return (
                  <li key={n.id}>
                    <Link href={`/notes/${n.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-gray-900">
                          {n.title ?? n.patient?.alias}
                        </p>
                        <p className="text-xs text-gray-500">{n.patient?.alias} · {formatDate(n.session_date)}</p>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
            <div className="border-t border-gray-100 px-6 py-3">
              <Link href="/notes" className="text-sm font-medium text-teal-600 hover:text-teal-700">
                Voir toutes les notes →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
