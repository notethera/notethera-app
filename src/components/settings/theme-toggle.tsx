'use client'

import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Passer en mode clair' : 'Passer en mode sombre'}
      className="flex shrink-0 items-center gap-2 hover:opacity-80 transition-opacity"
    >
      {isDark ? <Moon className="h-4 w-4 text-teal-600" /> : <Sun className="h-4 w-4 text-teal-600" />}
      <div style={{ width: 44, height: 24, borderRadius: 12, background: isDark ? '#0d9488' : '#d1d5db', display: 'flex', alignItems: 'center', transition: 'background 0.2s', flexShrink: 0 }}>
        <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#fff', margin: 2, transform: isDark ? 'translateX(20px)' : 'translateX(0)', transition: 'transform 0.2s' }} />
      </div>
    </button>
  )
}
