import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  if (req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return NextResponse.json({ error: 'RESEND_API_KEY not set' }, { status: 503 })

  const supabase = await createClient()

  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const tomorrowStr = tomorrow.toISOString().split('T')[0]

  // All sessions scheduled for tomorrow
  const { data: sessions, error } = await supabase
    .from('session_notes')
    .select('id, session_date, title, therapist_id, patient:patients(alias)')
    .eq('session_date', tomorrowStr)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!sessions || sessions.length === 0) return NextResponse.json({ sent: 0 })

  // Get therapist IDs with reminders enabled
  const therapistIds = [...new Set(sessions.map((s) => s.therapist_id))]
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .in('id', therapistIds)
    .eq('reminder_email_enabled', true)

  if (!profiles || profiles.length === 0) return NextResponse.json({ sent: 0 })

  const enabledMap = new Map(profiles.map((p) => [p.id, p]))
  const resend = new Resend(resendKey)

  let sent = 0
  for (const session of sessions) {
    const therapist = enabledMap.get(session.therapist_id)
    if (!therapist?.email) continue

    const patientAlias = (session.patient as unknown as { alias: string } | null)?.alias ?? 'Patient'
    const noteTitle = session.title ?? `Séance — ${patientAlias}`

    const { error: resendError } = await resend.emails.send({
      // TODO: revert to NoteThéra <rappels@notethera.fr> once the domain is purchased and verified on Resend
      from: 'NoteThéra <onboarding@resend.dev>',
      to: therapist.email,
      subject: `Rappel : séance demain avec ${patientAlias}`,
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1f2937">
          <h2 style="color:#0d9488;margin-bottom:4px">Rappel de séance</h2>
          <p style="color:#6b7280;font-size:14px;margin-top:0">NoteThéra</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
          <p>Bonjour ${therapist.full_name ?? ''},</p>
          <p>Vous avez une séance prévue <strong>demain</strong> avec <strong>${patientAlias}</strong>.</p>
          ${noteTitle ? `<p style="color:#6b7280;font-size:14px">Note : ${noteTitle}</p>` : ''}
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">
          <p style="font-size:12px;color:#9ca3af">Pour désactiver ces rappels, rendez-vous dans Paramètres → Rappels de séances.</p>
        </div>
      `,
    })

    if (resendError) {
      console.error('[cron/reminders] Resend rejected the send:', resendError)
      continue
    }

    sent++
  }

  return NextResponse.json({ sent, total: sessions.length })
}
