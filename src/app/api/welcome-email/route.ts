import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function welcomeEmailHtml(firstName: string | null, baseUrl: string) {
  const teal = '#0F6E56'
  const greeting = firstName ? `Bonjour ${firstName},` : 'Bonjour,'

  return `
    <div style="font-family:sans-serif;max-width:520px;margin:0 auto;color:#1f2937">
      <h2 style="color:${teal};margin-bottom:4px">Bienvenue sur NoteThéra</h2>
      <p style="color:#6b7280;font-size:14px;margin-top:0">Votre espace est prêt</p>
      <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0">

      <p>${greeting}</p>
      <p>
        Merci d'avoir créé votre compte. Nous sommes ravis de vous accompagner au quotidien
        dans le suivi de vos patients — votre espace est déjà prêt à l'emploi.
      </p>

      <p style="margin-top:24px;font-weight:600;color:#111827">Pour bien démarrer, voici les 3 premières étapes :</p>
      <table role="presentation" style="width:100%;border-collapse:collapse;margin-top:12px">
        <tr>
          <td style="padding:10px 0;vertical-align:top;width:32px">
            <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:50%;background:${teal};color:#ffffff;font-size:13px;font-weight:600">1</span>
          </td>
          <td style="padding:10px 0;vertical-align:top">
            <strong>Créez votre premier patient</strong>
            <div style="color:#6b7280;font-size:14px">Un alias suffit, pas besoin d'informations identifiantes.</div>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;vertical-align:top;width:32px">
            <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:50%;background:${teal};color:#ffffff;font-size:13px;font-weight:600">2</span>
          </td>
          <td style="padding:10px 0;vertical-align:top">
            <strong>Enregistrez une séance</strong>
            <div style="color:#6b7280;font-size:14px">Lancez l'enregistrement directement depuis votre navigateur.</div>
          </td>
        </tr>
        <tr>
          <td style="padding:10px 0;vertical-align:top;width:32px">
            <span style="display:inline-block;width:24px;height:24px;line-height:24px;text-align:center;border-radius:50%;background:${teal};color:#ffffff;font-size:13px;font-weight:600">3</span>
          </td>
          <td style="padding:10px 0;vertical-align:top">
            <strong>Générez votre première note</strong>
            <div style="color:#6b7280;font-size:14px">Votre compte-rendu de séance est prêt en quelques instants.</div>
          </td>
        </tr>
      </table>

      <div style="text-align:center;margin:32px 0">
        <a href="${baseUrl}/dashboard" style="display:inline-block;background:${teal};color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 28px;border-radius:8px">
          Accéder à mon espace
        </a>
      </div>

      <p style="background:#f0fdfa;border:1px solid #ccfbf1;border-radius:8px;padding:12px 16px;font-size:14px;color:#115e59">
        Votre essai gratuit de <strong>14 jours</strong> a commencé, sans carte bancaire. Vous pouvez explorer
        NoteThéra à votre rythme.
      </p>

      <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
      <p style="font-size:14px;color:#6b7280">
        Une question ? Notre <a href="${baseUrl}/faq" style="color:${teal};font-weight:500">FAQ</a> répond aux
        demandes les plus fréquentes. Vous pouvez aussi simplement répondre à cet email, nous lisons chaque message.
      </p>
      <p style="font-size:12px;color:#9ca3af;margin-top:24px">À très vite, l'équipe NoteThéra</p>
    </div>
  `
}

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'email is required' }, { status: 400 })
  }

  const resendKey = process.env.RESEND_API_KEY
  if (!resendKey) return NextResponse.json({ error: 'RESEND_API_KEY not set' }, { status: 503 })

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, email, full_name')
    .ilike('email', email)
    .maybeSingle()

  if (!profile) return NextResponse.json({ sent: false, reason: 'not_found' })

  const { data: alreadySent } = await supabase
    .from('profiles')
    .select('welcome_email_sent_at')
    .eq('id', profile.id)
    .single()

  if (alreadySent?.welcome_email_sent_at) {
    return NextResponse.json({ sent: false, reason: 'already_sent' })
  }

  const proto = req.headers.get('x-forwarded-proto') ?? 'https'
  const host = req.headers.get('host') ?? ''
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.startsWith('http')
    ? process.env.NEXT_PUBLIC_APP_URL
    : `${proto}://${host}`

  const firstName = profile.full_name?.trim().split(' ')[0] || null
  const resend = new Resend(resendKey)

  const { error: resendError } = await resend.emails.send({
    // TODO: revert to NoteThéra <bienvenue@notethera.fr> once the domain is purchased and verified on Resend
    from: 'NoteThéra <onboarding@resend.dev>',
    to: profile.email,
    subject: 'Bienvenue sur NoteThéra',
    html: welcomeEmailHtml(firstName, baseUrl),
  })

  if (resendError) {
    console.error('[welcome-email] Resend rejected the send:', resendError)
    return NextResponse.json({ sent: false, reason: 'resend_error', error: resendError.message }, { status: 502 })
  }

  // Mark as sent only once Resend has actually accepted it — a request that only
  // claimed the slot and then failed must not block a future retry.
  await supabase
    .from('profiles')
    .update({ welcome_email_sent_at: new Date().toISOString() })
    .eq('id', profile.id)
    .is('welcome_email_sent_at', null)

  return NextResponse.json({ sent: true })
}
