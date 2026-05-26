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
      .select('id, session_date, note_content')
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
          <p className="text-sm font-semibold text-gray-900">{patient.session_count}</p>
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
            {notes?.map((note) => (
              <li key={note.id}>
                <Link href={`/notes/${note.id}`} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                  <div className="flex items-center gap-3">
                    <FileText className="h-4 w-4 text-gray-400" />
                    <p className="text-sm text-gray-900">{formatDate(note.session_date)}</p>
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
