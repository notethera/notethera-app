export type SubscriptionStatus = 'active' | 'trialing' | 'past_due' | 'canceled' | 'incomplete'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  avatar_url: string | null
  stripe_customer_id: string | null
  subscription_status: SubscriptionStatus | null
  subscription_id: string | null
  trial_ends_at: string | null
  created_at: string
  updated_at: string
}

export interface Patient {
  id: string
  therapist_id: string
  alias: string
  session_count: number
  created_at: string
}

export interface SessionNote {
  id: string
  therapist_id: string
  patient_id: string
  patient?: Patient
  session_date: string
  transcript: string | null
  note_content: string | null
  title: string | null
  created_at: string
}
