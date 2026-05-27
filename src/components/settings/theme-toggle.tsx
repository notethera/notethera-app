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
      className="flex items-center justify-between w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
    >
      <div className="flex items-center gap-2.5">
        {isDark ? <Moon className="h-4 w-4 text-teal-600" /> : <Sun className="h-4 w-4 text-teal-600" />}
        <span>{isDark ? 'Mode sombre activé' : 'Mode clair activé'}</span>
      </div>
      <div className={`relative h-5 w-9 rounded-full transition-colors ${isDark ? 'bg-teal-600' : 'bg-gray-300'}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${isDark ? 'translate-x-4' : 'translate-x-0.5'}`} />
      </div>
    </button>
  )
}
