export const dynamic = 'force-dynamic'

import { createClient } from '@/lib/supabase/server'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'
import { Users, FileText, Plus } from 'lucide-react'
import { OnboardingChecklist } from '@/components/dashboard/onboarding-checklist'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: profile }, { count: patientCount }, { data: recentNotes }, { count: noteCount }, { count: generatedNoteCount }] = await Promise.all([
    supabase.from('profiles').select('full_name, subscription_status').eq('id', user!.id).single(),
    supabase.from('patients').select('*', { count: 'exact', head: true }).eq('therapist_id', user!.id),
    supabase
      .from('session_notes')
      .select('id, session_date, patient:patients(alias)')
      .eq('therapist_id', user!.id)
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('session_notes').select('*', { count: 'exact', head: true }).eq('therapist_id', user!.id),
    supabase.from('session_notes').select('*', { count: 'exact', head: true }).eq('therapist_id', user!.id).not('note_content', 'is', null),
  ])

  const firstName = profile?.full_name?.split(' ')[0] ?? 'Docteur'

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Bonjour, {firstName}</h1>
        <p className="mt-1 text-sm text-gray-500">Voici un aperçu de votre activité</p>
      </div>

      <OnboardingChecklist
        hasPatient={(patientCount ?? 0) > 0}
        hasNote={(noteCount ?? 0) > 0}
        hasGeneratedNote={(generatedNoteCount ?? 0) > 0}
        totalNotes={noteCount ?? 0}
      />

      <div className="mb-8 grid grid-cols-2 gap-4">
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
              <p className="text-sm text-gray-500">Notes récentes</p>
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
          <ul className="divide-y divide-gray-100">
            {recentNotes?.map((note) => (
              <li key={note.id}>
                <Link href={`/notes/${note.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {(note.patient as unknown as { alias: string } | null)?.alias}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(note.session_date)}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
