'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { getInitials, formatDate } from '@/lib/utils'
import type { Patient } from '@/types'
import { Plus, Search, X } from 'lucide-react'
import Link from 'next/link'

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ alias: '' })
  const [userId, setUserId] = useState<string | null>(null)
  const supabase = createClient()

  const loadPatients = async () => {
    const { data } = await supabase
      .from('patients')
      .select('*, session_notes(count)')
      .order('alias', { ascending: true })
    setPatients((data ?? []) as unknown as Patient[])
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUserId(user?.id ?? null))
    loadPatients()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    setLoading(true)
    const { error } = await supabase.from('patients').insert({ ...form, therapist_id: userId })
    if (!error) {
      setForm({ alias: '' })
      setShowForm(false)
      await loadPatients()
    }
    setLoading(false)
  }

  const filtered = patients.filter((p) =>
    p.alias.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="mt-1 text-sm text-gray-500">{patients.length} patient{patients.length > 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un patient
        </Button>
      </div>

      {showForm && (
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Nouveau patient</h2>
            <button onClick={() => setShowForm(false)}><X className="h-4 w-4 text-gray-400" /></button>
          </div>
          <form onSubmit={handleCreate} className="flex flex-col gap-4">
            <Input label="Alias / Prénom" value={form.alias} onChange={(e) => setForm({ alias: e.target.value })} required />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Annuler</Button>
              <Button type="submit" loading={loading}>Créer</Button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un patient..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-10 w-full rounded-lg border border-gray-300 bg-white pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm">
        {filtered.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-500">
            {search ? 'Aucun patient ne correspond à votre recherche.' : 'Aucun patient. Ajoutez votre premier patient.'}
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {filtered.map((patient) => (
              <li key={patient.id}>
                <Link href={`/patients/${patient.id}`} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-semibold text-teal-700">
                    {getInitials(patient.alias)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{patient.alias}</p>
                    {(() => {
                      const count = Number((patient as unknown as { session_notes: { count: number }[] }).session_notes?.[0]?.count ?? 0)
                      return <p className="text-xs text-gray-500">{count} séance{count !== 1 ? 's' : ''}</p>
                    })()}
                  </div>
                  <p className="text-xs text-gray-400">Depuis le {formatDate(patient.created_at)}</p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
