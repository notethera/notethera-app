'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export function RemindersToggle({ userId, enabled }: { userId: string; enabled: boolean }) {
  const [isEnabled, setIsEnabled] = useState(enabled)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const toggle = async () => {
    const next = !isEnabled
    setSaving(true)
    setIsEnabled(next)
    await supabase.from('profiles').update({ reminder_email_enabled: next }).eq('id', userId)
    setSaving(false)
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={saving}
      aria-label={isEnabled ? 'Désactiver les rappels' : 'Activer les rappels'}
      className="flex shrink-0 items-center hover:opacity-80 transition-opacity disabled:opacity-50"
    >
      <div className={`relative h-5 w-9 rounded-full transition-colors ${isEnabled ? 'bg-teal-600' : 'bg-gray-300'}`}>
        <span
          className="absolute top-0.5 left-0 h-4 w-4 rounded-full bg-white transition-transform duration-200"
          style={{ transform: `translateX(${isEnabled ? '18px' : '2px'})` }}
        />
      </div>
    </button>
  )
}
