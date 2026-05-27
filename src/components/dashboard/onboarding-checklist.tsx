import Link from 'next/link'
import { CheckCircle2, Circle } from 'lucide-react'

interface OnboardingChecklistProps {
  hasPatient: boolean
  hasNote: boolean
  hasGeneratedNote: boolean
  totalNotes: number
}

export function OnboardingChecklist({ hasPatient, hasNote, hasGeneratedNote, totalNotes }: OnboardingChecklistProps) {
  const allDone = hasPatient && hasNote && hasGeneratedNote
  if (allDone || totalNotes >= 3) return null

  const steps = [
    { label: 'Créer votre premier patient', done: hasPatient, href: '/patients', linkText: 'Ajouter un patient' },
    { label: 'Enregistrer votre première séance', done: hasNote, href: '/notes', linkText: 'Créer une note' },
    { label: 'Générer votre première note clinique', done: hasGeneratedNote, href: '/notes', linkText: 'Voir les notes' },
  ]

  const completedCount = steps.filter((s) => s.done).length

  return (
    <div className="mb-8 rounded-xl border border-teal-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Premiers pas</h2>
          <p className="text-sm text-gray-500">{completedCount} / 3 étapes complétées</p>
        </div>
        <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-600">
          {completedCount}/3
        </span>
      </div>

      <div className="mb-5 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-teal-500 transition-all duration-500"
          style={{ width: `${(completedCount / 3) * 100}%` }}
        />
      </div>

      <ul className="space-y-3">
        {steps.map((step) => (
          <li key={step.label} className="flex items-center gap-3">
            {step.done ? (
              <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-teal-600" />
            ) : (
              <Circle className="h-5 w-5 flex-shrink-0 text-gray-300" />
            )}
            <span className={`flex-1 text-sm ${step.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
              {step.label}
            </span>
            {!step.done && (
              <Link href={step.href} className="text-xs font-medium text-teal-600 hover:text-teal-700">
                {step.linkText} →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
