'use client'

import { useEffect, useState, use } from 'react'
import { createClient } from '@/lib/supabase/client'
import { AudioRecorder } from '@/components/notes/audio-recorder'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Save, Loader2, Download, Pencil, Eye, Lock } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function markdownToHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .split('\n')
    .map((line) => `<p style="margin:3px 0">${line.trim() || '&nbsp;'}</p>`)
    .join('')
}

function exportToPDF(patientAlias: string, sessionDate: string, noteContent: string) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Note clinique — ${patientAlias}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: Georgia, 'Times New Roman', serif; max-width: 720px; margin: 48px auto; padding: 0 48px; color: #111827; }
    header { margin-bottom: 28px; }
    h1 { font-size: 20px; font-weight: 700; margin-bottom: 4px; }
    .meta { font-size: 13px; color: #6b7280; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 24px 0; }
    .content { font-size: 13.5px; line-height: 1.85; color: #1f2937; }
    .content p { margin: 3px 0; }
    strong { font-weight: 700; }
    footer { margin-top: 56px; font-size: 11px; color: #9ca3af; text-align: right; border-top: 1px solid #f3f4f6; padding-top: 12px; }
    @media print { body { margin: 0; padding: 32px 48px; } }
  </style>
</head>
<body>
  <header>
    <h1>${patientAlias}</h1>
    <p class="meta">Séance du ${sessionDate} &nbsp;·&nbsp; Note clinique confidentielle</p>
  </header>
  <hr>
  <div class="content">${markdownToHtml(noteContent)}</div>
  <footer>Document généré par NoteThéra</footer>
  <script>window.onload = () => { window.print(); }<\/script>
</body>
</html>`

  const win = window.open('', '_blank')
  if (!win) return
  win.document.write(html)
  win.document.close()
}

export default function NoteDetailPage({ params: paramsPromise }: { params: Promise<{ id: string }> }) {
  const params = use(paramsPromise)
  const [note, setNote] = useState<{
    id: string; session_date: string;
    transcript: string | null; note_content: string | null;
    title: string | null;
    patient: { alias: string } | null
  } | null>(null)
  const [noteContent, setNoteContent] = useState('')
  const [noteTitle, setNoteTitle] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
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
      const d = data as unknown as Record<string, unknown>
      setNote(data as unknown as typeof note)
      const content = d.note_content as string ?? ''
      setNoteContent(content)
      setNoteTitle(d.title as string | null ?? null)
      setEditing(!content)
      setLoading(false)
    }
    load()
  }, [params.id])

  const handleTranscribed = (content: string, title?: string) => {
    setNoteContent(content)
    setNoteTitle(title ?? null)
    setNote((prev) => prev ? { ...prev, note_content: content, title: title ?? null } : prev)
    setEditing(false)
  }

  const handleSave = async () => {
    setSaving(true)
    await supabase
      .from('session_notes')
      .update({ note_content: noteContent })
      .eq('id', params.id)
    setSaving(false)
    setEditing(false)
  }

  const handleExportPDF = () => {
    if (!note) return
    exportToPDF(note.patient?.alias ?? 'Patient', formatDate(note.session_date), noteContent)
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
          <h1 className="text-2xl font-bold text-gray-900">{noteTitle ?? note.patient?.alias}</h1>
          <p className="mt-1 text-sm text-gray-500">{note.patient?.alias} · Séance du {formatDate(note.session_date)}</p>
        </div>
        <div className="flex items-center gap-2">
          {noteContent && (
            <button
              onClick={handleExportPDF}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Download className="h-4 w-4" />
              Exporter en PDF
            </button>
          )}
          {editing ? (
            <Button onClick={handleSave} loading={saving} variant="secondary">
              <Save className="mr-2 h-4 w-4" />
              Sauvegarder
            </Button>
          ) : (
            noteContent && (
              <button
                onClick={() => setEditing(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <Pencil className="h-4 w-4" />
                Modifier
              </button>
            )
          )}
        </div>
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
          <p className="whitespace-pre-wrap border-t border-gray-100 px-4 py-3 text-sm text-gray-600">{note.transcript}</p>
        </details>
      )}

      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <h2 className="text-sm font-semibold text-gray-700">Note clinique</h2>
          {noteContent && (
            <button
              onClick={() => setEditing((e) => !e)}
              className="inline-flex items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-700"
            >
              {editing ? <><Eye className="h-3.5 w-3.5" /> Aperçu</> : <><Pencil className="h-3.5 w-3.5" /> Modifier</>}
            </button>
          )}
        </div>

        {editing ? (
          <textarea
            value={noteContent}
            onChange={(e) => setNoteContent(e.target.value)}
            placeholder="La note clinique apparaîtra ici après transcription. Vous pouvez aussi la rédiger manuellement."
            className="w-full min-h-[400px] resize-none rounded-b-xl p-4 text-sm text-gray-800 focus:outline-none"
            autoFocus
          />
        ) : noteContent ? (
          <div className="prose prose-sm prose-gray max-w-none p-6 [&_h1]:text-lg [&_h2]:text-base [&_h3]:text-sm [&_strong]:font-semibold [&_ol]:list-decimal [&_ul]:list-disc [&_li]:my-0.5">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {noteContent}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="p-4 text-sm text-gray-400">
            La note clinique apparaîtra ici après transcription. Vous pouvez aussi la rédiger manuellement.
          </p>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-1.5 text-xs text-gray-400">
        <Lock className="h-3 w-3" />
        <span>Données sécurisées · Conforme RGPD</span>
      </div>
    </div>
  )
}
