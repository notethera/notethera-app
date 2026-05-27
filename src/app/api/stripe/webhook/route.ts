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
        await supabase.from('profiles').update({
          subscription_status: sub.status,
          stripe_subscription_id: sub.id,
          trial_ends_at: sub.trial_end ? new Date(sub.trial_end * 1000).toISOString() : null,
        }).eq('id', userId)
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
  }

  return NextResponse.json({ received: true })
}
