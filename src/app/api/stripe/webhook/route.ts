import { NextRequest, NextResponse } from 'next/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  const supabase = createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const getUserIdByCustomer = async (customerId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('stripe_customer_id', customerId)
      .single()
    return data?.id
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.mode !== 'subscription') break
      const userId = await getUserIdByCustomer(session.customer as string)
      if (userId) {
        await supabase.from('profiles').update({
          subscription_status: 'active',
          stripe_subscription_id: session.subscription as string,
        }).eq('id', userId)
      }
      break
    }
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const sub = event.data.object as Stripe.Subscription
      const userId = await getUserIdByCustomer(sub.customer as string)
      if (userId) {
        const priceId = sub.items.data[0]?.price?.id ?? ''
        const planMap: Record<string, 'solo' | 'pro' | 'pro_annual'> = {
          [process.env.STRIPE_PRICE_ID_SOLO ?? '']: 'solo',
          [process.env.STRIPE_PRICE_ID_PRO ?? '']: 'pro',
          [process.env.STRIPE_PRICE_ID_PRO_ANNUAL ?? '']: 'pro_annual',
        }
        const subscriptionPlan = planMap[priceId] ?? 'pro'

        await supabase.from('profiles').update({
          subscription_status: sub.status,
          stripe_subscription_id: sub.id,
          trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
          subscription_plan: subscriptionPlan,
        }).eq('id', userId)

        // Mark trial as used the first time a trialing subscription is created
        if (sub.status === 'trialing' && event.type === 'customer.subscription.created') {
          await supabase.from('profiles')
            .update({ trial_used_at: new Date().toISOString() })
            .eq('id', userId)
            .is('trial_used_at', null)
        }
      }
      break
    }
    case 'customer.subscription.deleted': {
      const sub = event.data.object as Stripe.Subscription
      const userId = await getUserIdByCustomer(sub.customer as string)
      if (userId) {
        await supabase.from('profiles').update({
          subscription_status: 'canceled',
          stripe_subscription_id: null,
          subscription_plan: null,
        }).eq('id', userId)
      }
      break
    }
    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice
      const userId = await getUserIdByCustomer(invoice.customer as string)
      if (userId) {
        await supabase.from('profiles').update({
          subscription_status: 'past_due',
        }).eq('id', userId)
      }
      break
    }
    case 'invoice.payment_succeeded': {
      const invoice = event.data.object as Stripe.Invoice & { subscription?: string | null }
      // Skip free invoices (trial periods)
      if (!invoice.subscription || invoice.amount_paid === 0) break

      const userId = await getUserIdByCustomer(invoice.customer as string)
      if (!userId) break

      const { data: profile } = await supabase
        .from('profiles')
        .select('referred_by')
        .eq('id', userId)
        .single()

      if (!profile?.referred_by) break

      const { data: affiliate } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', profile.referred_by)
        .single()

      if (!affiliate) break

      const commissionCents = Math.round(invoice.amount_paid * 0.30)

      await supabase.from('affiliate_commissions').upsert({
        affiliate_id: affiliate.id,
        referred_user_id: userId,
        stripe_invoice_id: invoice.id,
        amount_cents: invoice.amount_paid,
        commission_cents: commissionCents,
        status: 'pending',
      }, { onConflict: 'stripe_invoice_id', ignoreDuplicates: true })

      break
    }
  }

  return NextResponse.json({ received: true })
}
