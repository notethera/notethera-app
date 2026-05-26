import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
  console.warn('[transcribe] OPENAI_API_KEY not configured — transcription will return 503')
}

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
    return NextResponse.json(
      { error: 'La transcription audio n\'est pas disponible. Veuillez configurer une clé OpenAI pour utiliser cette fonctionnalité.' },
      { status: 503 }
    )
  }

  console.log('[transcribe] OPENAI_API_KEY present:', !!process.env.OPENAI_API_KEY)

  const formData = await request.formData()
  const audioFile = formData.get('audio') as File
  const noteId = formData.get('noteId') as string

  if (!audioFile || !noteId) {
    return NextResponse.json({ error: 'Missing audio or noteId' }, { status: 400 })
  }

  console.log('[transcribe] file name:', audioFile.name, 'size:', audioFile.size, 'type:', audioFile.type)

  try {
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'fr',
      response_format: 'text',
    })

    await supabase
      .from('session_notes')
      .update({ transcript: transcription })
      .eq('id', noteId)
      .eq('therapist_id', user.id)

    console.log('[transcribe] success, length:', String(transcription).length)
    return NextResponse.json({ transcript: transcription })
  } catch (err) {
    console.error('[transcribe] OpenAI error:', err)
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
