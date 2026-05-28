'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Mic, Square, Upload, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'


interface AudioRecorderProps {
  noteId: string
  onTranscribed: (transcript: string, title?: string) => void
}

export function AudioRecorder({ noteId, onTranscribed }: AudioRecorderProps) {
  const [recording, setRecording] = useState(false)
  const [processing, setProcessing] = useState(false)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    const recorder = new MediaRecorder(stream)
    mediaRecorderRef.current = recorder
    chunksRef.current = []

    recorder.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data) }
    recorder.start()
    setRecording(true)
    setDuration(0)
    timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000)
  }

  const stopRecording = () => {
    if (!mediaRecorderRef.current) return
    mediaRecorderRef.current.onstop = () => processAudio(new Blob(chunksRef.current, { type: 'audio/webm' }))
    mediaRecorderRef.current.stop()
    mediaRecorderRef.current.stream.getTracks().forEach((t) => t.stop())
    if (timerRef.current) clearInterval(timerRef.current)
    setRecording(false)
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processAudio(file)
  }

  const processAudio = async (audio: Blob) => {
    setProcessing(true)
    setError(null)
    try {
      const form = new FormData()
      const filename = audio instanceof File ? audio.name : `session.${audio.type.split(';')[0].split('/')[1] || 'webm'}`
      form.append('audio', audio, filename)
      form.append('noteId', noteId)

      const res = await fetch('/api/transcribe', { method: 'POST', body: form })
      const transcribeData = await res.json()
      if (!res.ok) {
        setError(transcribeData.error ?? 'Erreur lors de la transcription.')
        return
      }

      const noteRes = await fetch('/api/generate-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ noteId, transcript: transcribeData.transcript }),
      })
      const noteData = await noteRes.json()
      if (!noteRes.ok) {
        setError(noteData.error ?? 'Erreur lors de la génération de la note.')
        return
      }

      onTranscribed(noteData.noteContent, noteData.title ?? undefined)
    } catch {
      setError('Une erreur inattendue est survenue. Vérifiez votre connexion.')
    } finally {
      setProcessing(false)
    }
  }

  const formatDuration = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-8">
      {error && (
        <div className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}
      {processing ? (
        <div className="flex flex-col items-center gap-3 text-center">
          <Loader2 className="h-10 w-10 animate-spin text-teal-600" />
          <p className="text-sm font-medium text-gray-700">Transcription en cours...</p>
          <p className="text-xs text-gray-500">Analyse de l'audio, puis rédaction de la note par Claude</p>
        </div>
      ) : (
        <>
          <div className={cn('flex h-16 w-16 items-center justify-center rounded-full', recording ? 'bg-red-100' : 'bg-teal-100')}>
            <Mic className={cn('h-7 w-7', recording ? 'text-red-600' : 'text-teal-600')} />
          </div>

          {recording && (
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-red-500" />
              <span className="text-sm font-mono font-medium text-gray-700">{formatDuration(duration)}</span>
            </div>
          )}

          <div className="flex gap-3">
            {recording ? (
              <Button variant="danger" onClick={stopRecording}>
                <Square className="mr-2 h-4 w-4" />
                Arrêter
              </Button>
            ) : (
              <>
                <Button onClick={startRecording}>
                  <Mic className="mr-2 h-4 w-4" />
                  Enregistrer
                </Button>
                <label className="inline-flex items-center justify-center h-10 px-4 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
                  <Upload className="mr-2 h-4 w-4" />
                  Importer un fichier
                  <input type="file" accept="audio/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </>
            )}
          </div>
          <p className="text-xs text-gray-500">Formats acceptés : MP3, WAV, M4A, WebM (max 25 Mo)</p>
        </>
      )}
    </div>
  )
}
