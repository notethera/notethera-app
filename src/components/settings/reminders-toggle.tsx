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
      <div style={{ width: 44, height: 24, borderRadius: 12, background: isEnabled ? '#0d9488' : '#d1d5db', display: 'flex', alignItems: 'center', transition: 'background 0.2s', flexShrink: 0 }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', margin: 2, transform: isEnabled ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
      </div>
    </button>
  )
}
