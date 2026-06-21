import Link from 'next/link'
import { FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Questions fréquentes – NoteThéra',
  description: 'Confidentialité des patients, conformité RGPD, fiabilité de la transcription, tarifs et résiliation : les réponses aux questions des thérapeutes sur NoteThéra.',
}

type FAQItem = { question: string; answer: string }
type FAQCategory = { id: string; title: string; items: FAQItem[] }

const CATEGORIES: FAQCategory[] = [
  {
    id: 'confidentialite',
    title: 'Confidentialité des données patients',
    items: [
      {
        question: 'Mes patients sont-ils identifiables dans NoteThéra ?',
        answer:
          "Non. NoteThéra est conçu pour ne jamais exiger l'identité réelle de vos patients. Vous attribuez à chacun un simple alias de votre choix (un prénom fictif, une initiale, un numéro) : c'est la seule donnée d'identification enregistrée. Vos transcriptions et vos notes sont rattachées à cet alias, jamais à un nom complet.",
      },
      {
        question: 'Qui peut accéder à mes notes et transcriptions ?',
        answer:
          "Vous seul(e). Chaque compte est strictement cloisonné : aucun autre thérapeute, et a fortiori aucune personne extérieure, ne peut consulter vos patients, vos séances ou vos notes. Ce cloisonnement est appliqué directement au niveau de la base de données, pas seulement dans l'interface.",
      },
    ],
  },
  {
    id: 'rgpd',
    title: 'Conformité RGPD',
    items: [
      {
        question: 'NoteThéra est-il conforme au RGPD ?',
        answer:
          "Oui. NoteThéra applique les principes du RGPD : minimisation des données (alias plutôt que noms réels), hébergement européen de votre base de données et de vos enregistrements audio, droits d'accès, de rectification, d'effacement et de portabilité garantis, et un encadrement contractuel de chaque prestataire technique. Le détail complet figure dans notre Politique de confidentialité.",
      },
      {
        question: 'Qui est responsable des données de mes patients ?',
        answer:
          "Vous restez seul(e) responsable du traitement des données de vos patients, en tant que professionnel de santé. NoteThéra agit comme sous-traitant technique : nous traitons ces données uniquement pour vous fournir le service, sur vos instructions, et ne les utilisons jamais à d'autres fins.",
      },
    ],
  },
  {
    id: 'transcription',
    title: 'Fiabilité de la transcription',
    items: [
      {
        question: 'La technologie de transcription est-elle fiable pour le français ?',
        answer:
          "Notre technologie de transcription vocale est optimisée pour le français et reconnaît correctement la grande majorité des échanges, y compris avec des accents ou un vocabulaire clinique spécifique. Comme tout outil de transcription, elle peut occasionnellement mal interpréter un mot peu courant — c'est pourquoi le texte transcrit reste toujours visible et modifiable avant la génération automatique de la note.",
      },
      {
        question: "Que se passe-t-il si l'enregistrement est de mauvaise qualité ?",
        answer:
          "La qualité de la transcription dépend directement de celle de l'enregistrement (bruit ambiant, distance du micro, voix qui se chevauchent). Dans ce cas, certains passages peuvent être approximatifs ; vous pouvez simplement les corriger à la main avant de générer la note clinique.",
      },
    ],
  },
  {
    id: 'notes',
    title: 'Modification des notes générées',
    items: [
      {
        question: 'Puis-je modifier les notes générées automatiquement ?',
        answer:
          "Oui, et c'est même essentiel. Chaque note produite par la génération automatique est un brouillon de travail, entièrement modifiable, que vous relisez et ajustez avant de la considérer comme définitive. NoteThéra est un outil d'aide à la rédaction, pas un substitut à votre jugement clinique.",
      },
      {
        question: 'Suis-je responsable du contenu final de mes notes ?',
        answer:
          "Oui. Vous restez seul(e) responsable de la validation clinique et médico-légale de chaque note. La génération automatique vous fait gagner du temps sur la rédaction, mais ne remplace à aucun moment votre relecture professionnelle.",
      },
    ],
  },
  {
    id: 'securite',
    title: 'Sécurité des données',
    items: [
      {
        question: 'Comment mes données sont-elles protégées techniquement ?',
        answer:
          "Toutes les données transitent de façon chiffrée (HTTPS) et sont également chiffrées au repos. Les enregistrements audio sont stockés dans un espace strictement isolé pour chaque compte, inaccessible aux autres utilisateurs. L'authentification est gérée par une infrastructure dédiée à la gestion sécurisée des sessions.",
      },
      {
        question: 'Que se passe-t-il en cas d’incident de sécurité ?',
        answer:
          "En cas de violation de données présentant un risque pour vous ou vos patients, nous nous engageons à vous en informer rapidement et à notifier la CNIL dans les délais prévus par la réglementation.",
      },
    ],
  },
  {
    id: 'tarifs',
    title: 'Tarifs et essai gratuit',
    items: [
      {
        question: 'Combien coûte NoteThéra ?',
        answer:
          "Trois formules simples : Solo à 19 €/mois (15 notes par mois), Pro à 49 €/mois (notes illimitées) et Pro Annuel à 39 €/mois facturé 468 €/an (notes illimitées, soit 20 % d'économie). Les prix indiqués sont nets, sans TVA additionnelle.",
      },
      {
        question: "L'essai gratuit nécessite-t-il une carte bancaire ?",
        answer:
          "Non. Vous bénéficiez de 14 jours d'essai gratuit sur tous les plans, sans communiquer aucun moyen de paiement. Vous ne serez jamais prélevé(e) sans avoir choisi et confirmé un abonnement.",
      },
    ],
  },
  {
    id: 'resiliation',
    title: 'Résiliation',
    items: [
      {
        question: 'Puis-je résilier à tout moment ?',
        answer:
          "Oui, directement depuis votre tableau de bord, en quelques clics. Les plans Solo et Pro mensuels n'impliquent aucun engagement de durée. Le plan Pro Annuel est souscrit pour 12 mois en contrepartie de son tarif réduit.",
      },
      {
        question: 'Que deviennent mes données si je résilie ?',
        answer:
          "Vos données restent accessibles pendant 30 jours après la résiliation, le temps d'exporter vos notes au format PDF si besoin, puis elles sont définitivement supprimées de nos serveurs.",
      },
    ],
  },
]

export default function FAQPage() {
  return (
    <div className="flex min-h-full flex-col bg-white">
      <header className="border-b border-gray-100">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">NoteThéra</span>
          </Link>
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

      <main className="mx-auto w-full max-w-3xl px-6 py-16">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">Questions fréquentes</h1>
          <p className="mt-3 text-gray-500">
            Les réponses aux questions que se posent la plupart des thérapeutes avant de se lancer.
          </p>
        </div>

        <nav className="mb-12 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.id}
              href={`#${cat.id}`}
              className="rounded-full border border-gray-200 px-3.5 py-1.5 text-sm text-gray-600 hover:border-teal-600 hover:text-teal-700"
            >
              {cat.title}
            </a>
          ))}
        </nav>

        <div className="space-y-12">
          {CATEGORIES.map((cat) => (
            <section key={cat.id} id={cat.id} className="scroll-mt-20">
              <h2 className="mb-4 text-xl font-bold text-gray-900">{cat.title}</h2>
              <div className="space-y-3">
                {cat.items.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-lg border border-gray-200 px-5 py-4 open:bg-gray-50"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-gray-900">
                      {item.question}
                      <span className="shrink-0 text-gray-400 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-3 leading-relaxed text-gray-600">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
          <h2 className="text-lg font-semibold text-gray-900">Une autre question ?</h2>
          <p className="mt-2 text-sm text-gray-600">
            Écrivez-nous à{' '}
            <a href="mailto:notetheraapp@gmail.com" className="font-medium text-teal-600 hover:text-teal-700">
              notetheraapp@gmail.com
            </a>
            , nous répondons rapidement.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block rounded-lg bg-teal-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-teal-700"
          >
            Démarrer l&apos;essai gratuit de 14 jours
          </Link>
        </div>

        <div className="mt-10 flex gap-4 text-sm text-gray-500">
          <Link href="/cgv" className="font-medium text-teal-600 hover:text-teal-700">
            CGV &amp; Mentions légales
          </Link>
          <Link href="/confidentialite" className="font-medium text-teal-600 hover:text-teal-700">
            Politique de confidentialité
          </Link>
        </div>

        <div className="mt-8 border-t border-gray-100 pt-8">
          <Link href="/" className="text-sm font-medium text-teal-600 hover:text-teal-700">
            ← Retour à l'accueil
          </Link>
        </div>
      </main>

      <footer className="border-t border-gray-100 py-8 text-center text-sm text-gray-400">
        © {new Date().getFullYear()} NoteThéra · Conçu pour les thérapeutes francophones
      </footer>
    </div>
  )
}
