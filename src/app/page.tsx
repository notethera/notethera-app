import Link from 'next/link'
import { FileText, Mic, Zap, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">NoteThéra</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900">
              Se connecter
            </Link>
            <Link
              href="/register"
              className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700"
            >
              Essai gratuit
            </Link>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col">
        <section className="mx-auto max-w-4xl px-6 py-24 text-center">
          <span className="mb-4 inline-flex items-center rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
            14 jours d'essai gratuit · Sans carte bancaire
          </span>
          <h1 className="mt-4 text-5xl font-bold tracking-tight text-gray-900">
            Vos notes cliniques,<br />
            <span className="text-teal-600">rédigées en secondes</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-500">
            NoteThéra transcrit vos séances avec Whisper et génère automatiquement des notes cliniques structurées en français. Passez moins de temps à écrire, plus de temps à soigner.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Link
              href="/register"
              className="rounded-lg bg-teal-600 px-6 py-3 text-base font-medium text-white hover:bg-teal-700"
            >
              Commencer gratuitement
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
            >
              Se connecter
            </Link>
          </div>
        </section>

        <section className="bg-gray-50 py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              {[
                {
                  icon: Mic,
                  title: 'Enregistrement & transcription',
                  desc: 'Enregistrez directement depuis votre navigateur ou importez un fichier audio. Whisper transcrit fidèlement en français.',
                },
                {
                  icon: Zap,
                  title: 'Note clinique générée',
                  desc: 'GPT-4 rédige une note structurée : résumé, observations, interventions, plan de suivi.',
                },
                {
                  icon: Shield,
                  title: 'Données sécurisées',
                  desc: 'Hébergement en Europe, chiffrement de bout en bout, conformité RGPD. La confidentialité de vos patients est préservée.',
                },
              ].map(({ icon: Icon, title, desc }) => (
                <div key={title} className="rounded-xl bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                    <Icon className="h-5 w-5 text-teal-600" />
                  </div>
                  <h3 className="mb-2 text-base font-semibold text-gray-900">{title}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Tarification simple et transparente</h2>
              <p className="mt-4 text-gray-500">14 jours d&apos;essai gratuit sur tous les plans · Sans carte bancaire</p>
            </div>
            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">

              {/* Solo */}
              <div className="rounded-2xl border border-gray-200 bg-white p-8">
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Solo</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-bold text-gray-900">19€</span>
                  <span className="mb-1 text-sm text-gray-500">/mois</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">15 notes cliniques par mois</p>
                <ul className="mt-6 space-y-2.5">
                  {[
                    '15 notes/mois',
                    'Transcription Whisper',
                    'Génération par IA',
                    'Gestion des patients',
                    'Export PDF',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-teal-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="mt-8 block rounded-lg border border-teal-600 py-2.5 text-center text-sm font-medium text-teal-600 hover:bg-teal-50"
                >
                  Commencer l&apos;essai gratuit
                </Link>
              </div>

              {/* Pro – le plus populaire */}
              <div className="relative rounded-2xl border-2 border-teal-600 bg-white p-8 shadow-lg">
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <span className="rounded-full bg-teal-600 px-4 py-1 text-xs font-semibold text-white">
                    Le plus populaire
                  </span>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">Pro</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-bold text-gray-900">49€</span>
                  <span className="mb-1 text-sm text-gray-500">/mois</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">Notes illimitées</p>
                <ul className="mt-6 space-y-2.5">
                  {[
                    'Notes illimitées',
                    'Transcription Whisper',
                    'Génération par IA',
                    'Gestion des patients',
                    'Export PDF',
                    'Support prioritaire',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-teal-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="mt-8 block rounded-lg bg-teal-600 py-2.5 text-center text-sm font-medium text-white hover:bg-teal-700"
                >
                  Démarrer l&apos;essai gratuit
                </Link>
              </div>

              {/* Pro Annuel – meilleure valeur */}
              <div className="relative rounded-2xl border border-gray-200 bg-gray-50 p-8">
                <div className="absolute -top-3.5 right-5">
                  <span className="rounded-full bg-amber-500 px-4 py-1 text-xs font-semibold text-white">
                    Économisez 20%
                  </span>
                </div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">Pro Annuel</p>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-bold text-gray-900">39€</span>
                  <span className="mb-1 text-sm text-gray-500">/mois</span>
                </div>
                <p className="mt-1 text-sm text-gray-500">Facturé 468€/an</p>
                <ul className="mt-6 space-y-2.5">
                  {[
                    'Notes illimitées',
                    'Transcription Whisper',
                    'Génération par IA',
                    'Gestion des patients',
                    'Export PDF',
                    'Support prioritaire',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-teal-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  className="mt-8 block rounded-lg border border-gray-300 bg-white py-2.5 text-center text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Démarrer l&apos;essai gratuit
                </Link>
              </div>

            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} NoteThéra · Conçu pour les thérapeutes francophones</p>
        <div className="mt-2 flex justify-center gap-4">
          <Link href="/cgv" className="hover:text-gray-600">CGV &amp; Mentions légales</Link>
          <Link href="/confidentialite" className="hover:text-gray-600">Politique de confidentialité</Link>
        </div>
      </footer>
    </div>
  )
}
