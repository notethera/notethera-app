'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import type { Patient } from '@/types'
import { Plus, FileText, Search } from 'lucide-react'
import Link from 'next/link'
import { Suspense } from 'react'

function extractResumeSnippet(content: string | null): string | null {
  if (!content) return null
  // Find first paragraph after the "Résumé" heading
  const match = content.match(/Résumé[^\n]*\n+([\s\S]*?)(?=\n\d+\.\s*\*\*|\n#{1,3}\s|\s*$)/)
  if (!match) return null
  const firstLine = match[1].trim().split('\n')[0].trim()
  return firstLine.length > 10 ? firstLine.slice(0, 130) : null
}

function InlineBold({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/)
  return (
    <>
      {parts.map((part, i) =>
        /^\*\*[^*]+\*\*$/.test(part)
          ? <strong key={i} className="font-semibold text-gray-800">{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </>
  )
}

function NotesPageInner() {
  const [notes, setNotes] = useState<Array<{
    id: string; session_date: string;
    note_content: string | null;
    title: string | null;
    patient: { id: string; alias: string } | null
  }>>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [creating, setCreating] = useState(false)
  const [selectedPatient, setSelectedPatient] = useState('')
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().split('T')[0])
  const [userId, setUserId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const preselectedPatient = searchParams.get('patient')
  const supabase = createClient()

  useEffect(() => {
    if (preselectedPatient) setSelectedPatient(preselectedPatient)
  }, [preselectedPatient])

  const loadData = async () => {
    const [{ data: { user } }, { data: notesData }, { data: patientsData }] = await Promise.all([
      supabase.auth.getUser(),
      supabase
        .from('session_notes')
        .select('id, session_date, note_content, title, patient:patients(id, alias)')
        .order('created_at', { ascending: false }),
      supabase.from('patients').select('*').order('alias'),
    ])
    setUserId(user?.id ?? null)
    setNotes((notesData ?? []) as unknown as typeof notes)
    setPatients(patientsData ?? [])
  }

  useEffect(() => { loadData() }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setCreating(true)
    const { data } = await supabase
      .from('session_notes')
      .insert({ patient_id: selectedPatient, session_date: sessionDate, therapist_id: userId })
      .select('id')
      .single()
    setCreating(false)
    if (data) router.push(`/notes/${data.id}`)
  }

  const filtered = notes.filter((note) => {
    if (selectedPatient && note.patient?.id !== selectedPatient) return false
    if (!search) return true
    const q = search.toLowerCase()
    return (
      note.patient?.alias?.toLowerCase().includes(q) ||
      note.title?.toLowerCase().includes(q)
    )
  })

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notes de séance</h1>
          <p className="mt-1 text-sm text-gray-500">
            {(search || selectedPatient) ? `${filtered.length} / ${notes.length}` : notes.length} note{notes.length > 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="mb-6 flex items-end gap-3 rounded-xl bg-white border border-gray-200 p-4 shadow-sm">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Patient</label>
          <select
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
            required
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Sélectionner un patient</option>
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.alias}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">Date de séance</label>
          <input
            type="date"
            value={sessionDate}
            onChange={(e) => setSessionDate(e.target.value)}
            className="h-10 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>
        <Button type="submit" loading={creating}>
          <Plus className="mr-2 h-4 w-4" />
          Créer la note
        </Button>
      </form>

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher par patient ou titre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="rounded-xl bg-white border border-gray-100 shadow-sm">
        {notes.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            Aucune note. Créez votre première note de séance ci-dessus.
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            Aucune note ne correspond à votre recherche.
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((note) => {
              const snippet = !note.title ? extractResumeSnippet(note.note_content) : null
              return (
                <li key={note.id}>
                  <Link href={`/notes/${note.id}`} className="flex items-center gap-3 px-6 py-4 hover:bg-gray-50">
                    <FileText className="h-4 w-4 flex-shrink-0 text-gray-400" />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {note.title ?? note.patient?.alias}
                      </p>
                      <p className="text-xs text-gray-500">{note.patient?.alias} · {formatDate(note.session_date)}</p>
                      {snippet && (
                        <p className="mt-0.5 truncate text-xs text-gray-500">
                          <InlineBold text={snippet} />
                        </p>
                      )}
                    </div>
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

export default function NotesPage() {
  return (
    <Suspense>
      <NotesPageInner />
    </Suspense>
  )
}
