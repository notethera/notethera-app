'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { LayoutDashboard, Users, FileText, Settings, CreditCard, LogOut, Menu, X, ChevronDown, UserCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const TRIAL_DAYS = 14

const navItems = [
  { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/patients', label: 'Patients', icon: Users },
  { href: '/notes', label: 'Notes', icon: FileText },
  { href: '/billing', label: 'Abonnement', icon: CreditCard },
  { href: '/settings', label: 'Paramètres', icon: Settings },
]

function NavLinks({ onClick }: { onClick?: () => void }) {
  const pathname = usePathname()
  return (
    <nav className="flex flex-1 flex-col gap-1 p-4">
      {navItems.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            href={href}
            onClick={onClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
              isActive
                ? 'bg-teal-50 text-teal-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            )}
            style={{ fontWeight: isActive ? 700 : 500 }}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        )
      })}
    </nav>
  )
}

interface UserInfo {
  email: string
  firstName: string
  initial: string
  trialDaysLeft: number | null
}

function useUserInfo(supabase: ReturnType<typeof createClient>) {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null)

  useEffect(() => {
    async function load() {
      const { data: authData } = await supabase.auth.getUser()
      if (!authData.user) return

      const fullName = authData.user.user_metadata?.full_name as string | undefined
      const firstName = fullName?.split(' ')[0] ?? authData.user.email?.split('@')[0] ?? ''

      const { data: profile } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('id', authData.user.id)
        .single()

      const isActive = profile?.subscription_status === 'active'

      let trialDaysLeft: number | null = null
      if (!isActive) {
        const createdAt = new Date(authData.user.created_at)
        const daysSince = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
        trialDaysLeft = Math.max(0, TRIAL_DAYS - daysSince)
      }

      setUserInfo({
        email: authData.user.email ?? '',
        firstName,
        initial: firstName[0]?.toUpperCase() ?? '?',
        trialDaysLeft,
      })
    }
    load()
  }, [])

  return userInfo
}

function UserAvatar({ initial }: { initial: string }) {
  return (
    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
      {initial}
    </div>
  )
}

function TrialBadge({ daysLeft }: { daysLeft: number }) {
  const urgent = daysLeft <= 3
  return (
    <p className={cn('truncate text-xs font-medium', urgent ? 'text-red-500' : 'text-teal-600')}>
      {daysLeft === 0
        ? 'Essai expiré'
        : `${daysLeft} jour${daysLeft > 1 ? 's' : ''} d'essai restant${daysLeft > 1 ? 's' : ''}`}
    </p>
  )
}

function UserMenu({ supabase, onSignOut }: { supabase: ReturnType<typeof createClient>; onSignOut: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const userInfo = useUserInfo(supabase)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initial = userInfo?.initial ?? '?'

  return (
    <div ref={ref} className="relative border-t border-gray-200 p-4">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-gray-50"
      >
        <UserAvatar initial={initial} />
        <div className="min-w-0 flex-1 text-left">
          <p className="truncate text-sm font-medium text-gray-900">{userInfo?.firstName ?? '…'}</p>
          <p className="truncate text-xs text-gray-500">{userInfo?.email ?? ''}</p>
          {userInfo?.trialDaysLeft !== null && userInfo?.trialDaysLeft !== undefined && (
            <TrialBadge daysLeft={userInfo.trialDaysLeft} />
          )}
        </div>
        <ChevronDown className={cn('h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-150', open && 'rotate-180')} />
      </button>

      {open && (
        <div className="absolute bottom-full left-4 right-4 mb-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-xs font-medium text-gray-900">{userInfo?.email}</p>
            {userInfo?.trialDaysLeft !== null && userInfo?.trialDaysLeft !== undefined && (
              <TrialBadge daysLeft={userInfo.trialDaysLeft} />
            )}
          </div>
          <button
            onClick={() => { setOpen(false); onSignOut() }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <UserCircle2 className="h-4 w-4 text-gray-400" />
            Changer de compte
          </button>
          <div className="border-t border-gray-100" />
          <button
            onClick={() => { setOpen(false); onSignOut() }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  )
}

function MobileUserMenu({ supabase, onSignOut, onClose }: { supabase: ReturnType<typeof createClient>; onSignOut: () => void; onClose: () => void }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const userInfo = useUserInfo(supabase)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const initial = userInfo?.initial ?? '?'

  return (
    <div ref={ref} className="relative ml-auto">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-8 w-8 items-center justify-center rounded-full"
        aria-label="Menu utilisateur"
      >
        <UserAvatar initial={initial} />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="border-b border-gray-100 px-4 py-3">
            <p className="truncate text-xs font-medium text-gray-900">{userInfo?.email}</p>
            {userInfo?.trialDaysLeft !== null && userInfo?.trialDaysLeft !== undefined && (
              <TrialBadge daysLeft={userInfo.trialDaysLeft} />
            )}
          </div>
          <button
            onClick={() => { setOpen(false); onClose(); onSignOut() }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50"
          >
            <UserCircle2 className="h-4 w-4 text-gray-400" />
            Changer de compte
          </button>
          <div className="border-t border-gray-100" />
          <button
            onClick={() => { setOpen(false); onClose(); onSignOut() }}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </button>
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const close = () => setIsOpen(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden h-full w-64 flex-col border-r border-gray-200 bg-white md:flex">
        <div className="flex h-16 items-center border-b border-gray-200 px-6">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">NoteThéra</span>
          </Link>
        </div>
        <NavLinks />
        <UserMenu supabase={supabase} onSignOut={handleSignOut} />
      </aside>

      {/* Mobile top bar */}
      <div className="fixed inset-x-0 top-0 z-20 flex h-14 items-center border-b border-gray-200 bg-white px-4 md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/dashboard" className="ml-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600">
            <FileText className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-base font-semibold text-gray-900">NoteThéra</span>
        </Link>
        <MobileUserMenu supabase={supabase} onSignOut={handleSignOut} onClose={close} />
      </div>

      {/* Mobile backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 md:hidden" onClick={close} />
      )}

      {/* Mobile slide-in sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform duration-200 md:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-gray-200 px-4">
          <Link href="/dashboard" onClick={close} className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600">
              <FileText className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-base font-semibold text-gray-900">NoteThéra</span>
          </Link>
          <button onClick={close} className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100" aria-label="Fermer le menu">
            <X className="h-5 w-5" />
          </button>
        </div>
        <NavLinks onClick={close} />
      </aside>
    </>
  )
}
