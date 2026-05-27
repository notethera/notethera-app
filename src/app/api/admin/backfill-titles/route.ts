import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Fetch notes with content but no title, ordered by patient + created_at
  const { data: notes, error } = await supabase
    .from('session_notes')
    .select('id, patient_id, transcript, note_content, created_at')
    .eq('therapist_id', user.id)
    .is('title', null)
    .not('note_content', 'is', null)
    .order('patient_id')
    .order('created_at')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!notes || notes.length === 0) return NextResponse.json({ updated: 0 })

  // Build session number map per patient
  const sessionCountByPatient: Record<string, number> = {}

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  let updated = 0
  for (const note of notes) {
    sessionCountByPatient[note.patient_id] = (sessionCountByPatient[note.patient_id] ?? 0) + 1
    const sessionNumber = sessionCountByPatient[note.patient_id]
    const source = (note.transcript ?? note.note_content ?? '').slice(0, 800)

    try {
      const titleMessage = await anthropic.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 30,
        messages: [{
          role: 'user',
          content: `À partir de ce contenu de séance de thérapie, génère un titre court en français (3-5 mots) qui résume le thème principal, au format "Thème principal - Séance ${sessionNumber}". Réponds UNIQUEMENT avec le titre, sans guillemets ni ponctuation finale.\n\nContenu : ${source}`,
        }],
      })

      const title = titleMessage.content[0].type === 'text'
        ? titleMessage.content[0].text.trim()
        : `Séance ${sessionNumber}`

      await supabase
        .from('session_notes')
        .update({ title })
        .eq('id', note.id)
        .eq('therapist_id', user.id)

      updated++
    } catch {
      // Skip on error, continue with next note
    }
  }

  return NextResponse.json({ updated, total: notes.length })
}
