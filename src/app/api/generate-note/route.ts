import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

const SYSTEM_PROMPT = `Tu es un assistant spécialisé pour les psychothérapeutes francophones.
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

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

  const message = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1500,
    system: SYSTEM_PROMPT,
    messages: [
      { role: 'user', content: `Voici la transcription de la séance :\n\n${transcript}` },
    ],
  })

  const noteContent = message.content[0].type === 'text' ? message.content[0].text : ''

  await supabase
    .from('session_notes')
    .update({ note_content: noteContent })
    .eq('id', noteId)
    .eq('therapist_id', user.id)

  return NextResponse.json({ noteContent })
}
