import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { getInitials } from '@/lib/utils'
import Link from 'next/link'
import { ArrowLeft, FileText, Plus } from 'lucide-react'

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: patient }, { data: notes }] = await Promise.all([
    supabase.from('patients').select('*').eq('id', id).single(),
    supabase
      .from('session_notes')
      .select('id, session_date, title, note_content')
      .eq('patient_id', id)
      .order('session_date', { ascending: false }),
  ])

  if (!patient) notFound()

  return (
    <div className="p-8">
      <Link href="/patients" className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Retour aux patients
      </Link>

      <div className="mb-8 flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-100 text-lg font-semibold text-teal-700">
          {getInitials(patient.alias)}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{patient.alias}</h1>
          <p className="text-sm text-gray-500">Patient depuis le {formatDate(patient.created_at)}</p>
        </div>
      </div>

      <div className="mb-8">
        <div className="inline-flex rounded-xl bg-white border border-gray-100 p-4">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mr-2">Séances</p>
          <p className="text-sm font-semibold text-gray-900">{notes?.length ?? 0}</p>
        </div>
      </div>

      <div className="rounded-xl bg-white border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Notes de séance</h2>
          <Link
            href={`/notes?patient=${id}`}
            className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-teal-700"
          >
            <Plus className="h-3.5 w-3.5" />
            Nouvelle note
          </Link>
        </div>
        {notes?.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            Aucune note pour ce patient.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {notes?.map((note, i) => {
              const n = note as unknown as { id: string; session_date: string; title: string | null; note_content: string | null }
              const sessionNumber = (notes?.length ?? 0) - i
              return (
                <li key={n.id}>
                  <Link href={`/notes/${n.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
                      {sessionNumber}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {n.title ?? <span className="italic text-gray-400">Note sans titre</span>}
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(n.session_date)}</p>
                    </div>
                    <FileText className="h-4 w-4 shrink-0 text-gray-300" />
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </div>
  )
}
