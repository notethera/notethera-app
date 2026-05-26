'use client'

import { useEffect, useState, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AudioRecorder } from '@/components/notes/audio-recorder'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default function NoteDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise)
  const [note, setNote] = useState<{
    id: string; session_date: string;
    transcript: string | null; note_content: string | null;
    patient: { alias: string } | null
  } | null>(null)
  const [noteContent, setNoteContent] = useState('')
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('session_notes')
        .select('*, patient:patients(alias)')
        .eq('id', params.id)
        .single()
      console.log('[note] data:', data, 'error:', error)
      if (!data) { setLoading(false); return }
      setNote(data as unknown as typeof note)
      setNoteContent((data as unknown as Record<string, unknown>).note_content as string ?? '')
      setLoading(false)
    }
    load()
  }, [params.id])

  const handleTranscribed = (content: string) => {
    setNoteContent(content)
    setNote((prev) => prev ? { ...prev, note_content: content } : prev)
  }

  const handleSave = async () => {
    setSaving(true)
    await supabase
      .from('session_notes')
      .update({ note_content: noteContent })
      .eq('id', params.id)
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    )
  }

  if (!note) return notFound()

  return (
    <div className="p-8">
      <Link href="/notes" className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900">
        <ArrowLeft className="h-4 w-4" />
        Retour aux notes
      </Link>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {note.patient?.alias}
          </h1>
          <p className="mt-1 text-sm text-gray-500">Séance du {formatDate(note.session_date)}</p>
        </div>
        <Button onClick={handleSave} loading={saving} variant="secondary">
          <Save className="mr-2 h-4 w-4" />
          Sauvegarder
        </Button>
      </div>

      {!note.note_content && (
        <div className="mb-6">
          <h2 className="mb-3 text-sm font-semibold text-gray-700">Enregistrer ou importer la séance</h2>
          <AudioRecorder noteId={params.id} onTranscribed={handleTranscribed} />
        </div>
      )}

      {note.transcript && (
        <details className="mb-4 rounded-lg border border-gray-200 bg-white">
          <summary className="cursor-pointer px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50">
            Transcription brute
          </summary>
          <p className="px-4 py-3 text-sm text-gray-600 whitespace-pre-wrap border-t border-gray-100">{note.transcript}</p>
        </details>
      )}

      <div className="rounded-xl bg-white border border-gray-200 shadow-sm">
        <div className="border-b border-gray-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-700">Note clinique</h2>
        </div>
        <textarea
          value={noteContent}
          onChange={(e) => setNoteContent(e.target.value)}
          placeholder="La note clinique apparaîtra ici après transcription. Vous pouvez aussi la rédiger manuellement."
          className="w-full min-h-[400px] resize-none rounded-b-xl p-4 text-sm text-gray-800 focus:outline-none"
        />
      </div>
    </div>
  )
}
