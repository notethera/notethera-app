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
      className="flex items-center justify-between w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-60"
    >
      <div className="flex items-center gap-2.5">
        <Bell className="h-4 w-4 text-teal-600" />
        <div className="text-left">
          <p>{isEnabled ? 'Rappels activés' : 'Rappels désactivés'}</p>
          <p className="text-xs text-gray-500 mt-0.5">Email 24h avant chaque séance planifiée</p>
        </div>
      </div>
      <div className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${isEnabled ? 'bg-teal-600' : 'bg-gray-300'}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${isEnabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
    </button>
  )
}
