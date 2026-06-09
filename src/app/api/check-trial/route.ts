import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

function normalizeEmail(email: string): string {
  const lower = email.toLowerCase()
  const [localRaw, domain] = lower.split('@')
  if (!domain) return lower
  let local = localRaw.split('+')[0]
  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    local = local.replace(/\./g, '')
  }
  return `${local}@${domain}`
}

export async function POST(request: NextRequest) {
  const { fingerprint, email } = await request.json()
  const ip = getClientIp(request)

  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const hasTrialUsed = async (column: string, value: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq(column, value)
      .not('trial_used_at', 'is', null)
      .limit(1)
      .maybeSingle()
    return !!data
  }

  // 1. Check normalized email
  if (email) {
    const normalized = normalizeEmail(email)
    if (await hasTrialUsed('normalized_email', normalized)) {
      return NextResponse.json({ blocked: true })
    }
  }

  // 2. Check IP
  if (ip !== 'unknown') {
    if (await hasTrialUsed('registration_ip', ip)) {
      return NextResponse.json({ blocked: true })
    }
  }

  // 3. Check fingerprint
  if (fingerprint) {
    if (await hasTrialUsed('fingerprint_hash', fingerprint)) {
      return NextResponse.json({ blocked: true })
    }
  }

  return NextResponse.json({ blocked: false })
}
