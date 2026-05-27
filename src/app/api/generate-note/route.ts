import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const NOTE_SYSTEM_PROMPT = `Tu es un assistant spécialisé pour les psychothérapeutes francophones.
À partir de la transcription d'une séance de thérapie, génère une note clinique structurée et professionnelle en français.

Règle absolue : tu génères TOUJOURS une note, quelle que soit la longueur ou la qualité de la transcription. Si le contenu est limité, incomplet ou peu clair, utilise ce qui est disponible et indique « Information limitée » pour les sections sans données suffisantes. Ne refuse jamais de générer une note.

La note doit inclure :
1. **Résumé de la séance** – Thèmes principaux abordés
2. **Observations cliniques** – Affect, comportement, cognitions du patient
3. **Interventions thérapeutiques** – Techniques et approches utilisées
4. **Progrès et points clés** – Avancées ou difficultés observées
5. **Plan pour la prochaine séance** – Objectifs et sujets à explorer

Respecte la confidentialité : utilise « le patient » ou « la patiente » plutôt que des noms.
La note doit être concise, objective et conforme aux pratiques cliniques françaises.`

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { noteId, transcript } = await request.json()

  if (!noteId || !transcript) {
    return NextResponse.json({ error: 'Missing noteId or transcript' }, { status: 400 })
  }

  console.log('[generate-note] transcript:', transcript)

  // Get patient_id to count sessions
  const { data: noteData } = await supabase
    .from('session_notes')
    .select('patient_id')
    .eq('id', noteId)
    .single()

  const { count: sessionCount } = await supabase
    .from('session_notes')
    .select('*', { count: 'exact', head: true })
    .eq('patient_id', noteData?.patient_id)

  const sessionNumber = sessionCount ?? 1

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  const transcriptPreview = transcript.slice(0, 800)

  // Generate note content and title in parallel
  const [message, titleMessage] = await Promise.all([
    anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1500,
      system: NOTE_SYSTEM_PROMPT,
      messages: [
        { role: 'user', content: `Voici la transcription de la séance :\n\n${transcript}` },
      ],
    }),
    anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 30,
      messages: [{
        role: 'user',
        content: `À partir de cette transcription de séance de thérapie, génère un titre court en français (3-5 mots) qui résume le thème principal, au format "Thème principal - Séance ${sessionNumber}". Réponds UNIQUEMENT avec le titre, sans guillemets ni ponctuation finale.\n\nTranscription : ${transcriptPreview}`,
      }],
    }),
  ])

  const noteContent = message.content[0].type === 'text' ? message.content[0].text : ''
  const title = titleMessage.content[0].type === 'text'
    ? titleMessage.content[0].text.trim()
    : `Séance ${sessionNumber}`

  await supabase
    .from('session_notes')
    .update({ note_content: noteContent, title })
    .eq('id', noteId)
    .eq('therapist_id', user.id)

  return NextResponse.json({ noteContent, title })
}
