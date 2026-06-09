import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(request: NextRequest) {
  try {
    const priceId = process.env.STRIPE_PRICE_ID_PRO
    if (!priceId) {
      return NextResponse.json({ error: 'Stripe price not configured' }, { status: 500 })
    }

    const stripe = getStripe()
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, email, full_name, registration_ip, fingerprint_hash, trial_used_at')
      .eq('id', user.id)
      .single()

    let customerId = profile?.stripe_customer_id

    if (customerId) {
      try {
        await stripe.customers.retrieve(customerId)
      } catch {
        customerId = null
      }
    }

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile?.email ?? user.email!,
        name: profile?.full_name ?? undefined,
        metadata: { supabase_user_id: user.id },
      })
      customerId = customer.id
      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id)
    }

    // Determine trial eligibility
    const ip = getClientIp(request)
    let trialDays: number | undefined = 14

    // Store IP on first checkout if not yet recorded
    if (!profile?.registration_ip && ip !== 'unknown') {
      await supabase.from('profiles').update({ registration_ip: ip }).eq('id', user.id)
    }

    if (profile?.trial_used_at) {
      // This account already used a trial
      trialDays = undefined
    } else {
      // Check if another account from the same IP or fingerprint already used a trial
      const svc = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
      )

      const checkAbuse = async (column: string, value: string) => {
        const { data } = await svc
          .from('profiles')
          .select('id')
          .eq(column, value)
          .not('trial_used_at', 'is', null)
          .neq('id', user.id)
          .limit(1)
          .maybeSingle()
        return !!data
      }

      if (ip !== 'unknown' && await checkAbuse('registration_ip', ip)) {
        trialDays = undefined
      } else if (profile?.fingerprint_hash && await checkAbuse('fingerprint_hash', profile.fingerprint_hash)) {
        trialDays = undefined
      }
    }

    const proto = request.headers.get('x-forwarded-proto') ?? 'https'
    const host = request.headers.get('host') ?? ''
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL?.startsWith('http')
      ? process.env.NEXT_PUBLIC_APP_URL
      : `${proto}://${host}`

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card', 'link'],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/dashboard?upgrade=success`,
      cancel_url: `${baseUrl}/billing`,
      subscription_data: {
        ...(trialDays ? { trial_period_days: trialDays } : {}),
        metadata: { supabase_user_id: user.id },
      },
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Internal server error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
