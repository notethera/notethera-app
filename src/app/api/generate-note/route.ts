import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const NOTE_SYSTEM_PROMPT = `Tu es un assistant spécialisé pour les psychothérapeutes francophones. Tu génères des notes cliniques professionnelles à partir de transcriptions de séances.

RÈGLES ABSOLUES — sans exception :
- Tu génères TOUJOURS une note complète avec les 5 sections, même si la transcription dure 5 secondes ou contient très peu d'informations.
- Tu ne commentes JAMAIS la qualité ou la longueur de la transcription dans la note.
- Tu n'écris JAMAIS « transcription trop courte », « information insuffisante », « contenu limité » ou toute formulation similaire.
- Pour chaque section sans donnée exploitable, tu écris exactement : « À compléter par le thérapeute »
- Tu exploites le moindre mot, ton, ou fragment disponible pour rédiger chaque section.

STRUCTURE OBLIGATOIRE — toujours ces 5 sections, dans cet ordre :

## 1. Résumé de la séance
Thèmes et sujets abordés pendant la séance. Si la transcription est fragmentaire, décris ce qui a été capturé et laisse le reste « À compléter par le thérapeute ».

## 2. Observations cliniques
Affect apparent, comportement verbal et non-verbal, état émotionnel et cognitif du patient tel qu'il ressort de la transcription.

## 3. Interventions thérapeutiques
Techniques, approches ou interventions utilisées par le thérapeute. Si non identifiables, indiquer « À compléter par le thérapeute ».

## 4. Progrès et points clés
Avancées, résistances, prises de conscience ou difficultés observées durant la séance.

## 5. Plan pour la prochaine séance
Objectifs, sujets à approfondir ou tâches à proposer pour la prochaine rencontre.

Utilise « le patient » ou « la patiente » (jamais de noms propres). Rédige en français, de façon concise et objective, conforme aux pratiques cliniques.`

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
