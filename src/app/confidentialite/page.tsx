import Link from 'next/link'
import { FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de confidentialité – NoteThéra',
  description: 'Politique de confidentialité et de protection des données personnelles (RGPD) de NoteThéra.',
}

const LAST_UPDATED = '21 juin 2026'

export default function ConfidentialitePage() {
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
          <h1 className="text-4xl font-bold text-gray-900">Politique de confidentialité</h1>
          <p className="mt-3 text-sm text-gray-500">Dernière mise à jour : {LAST_UPDATED}</p>
        </div>

        <div className="space-y-12 text-gray-700">

          {/* ── 1. PRÉAMBULE ─────────────────────────────────────── */}
          <Section id="preambule" title="1. Préambule">
            <p>
              NoteThéra (« nous ») attache une importance particulière à la protection de la vie privée de
              ses utilisateurs et des données cliniques qu'ils traitent. La présente politique de
              confidentialité décrit comment les données personnelles sont collectées, utilisées,
              partagées et protégées dans le cadre de l'utilisation du service NoteThéra, conformément au
              Règlement Général sur la Protection des Données (RGPD – règlement UE 2016/679) et à la loi
              n° 78-17 du 6 janvier 1978 modifiée (« Informatique et Libertés »).
            </p>
            <p>
              Cette politique complète les <Link href="/cgv" className="font-medium text-teal-600 hover:text-teal-700">Conditions Générales de Vente</Link> de NoteThéra.
            </p>
          </Section>

          {/* ── 2. RESPONSABLE DU TRAITEMENT ─────────────────────── */}
          <Section id="responsable" title="2. Responsable du traitement">
            <dl className="space-y-1">
              <Row label="Nom" value="Ryan Schwartz" />
              <Row label="Statut" value="Auto-entrepreneur (en cours de création)" />
              <Row label="Pays" value="France" />
              <Row label="Contact (protection des données)" value="notetheraapp@gmail.com" />
            </dl>
            <p className="mt-3">
              NoteThéra agit en deux qualités distinctes, selon la nature de la donnée :
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                <strong>Responsable du traitement</strong> pour les données relatives au compte de
                l'Abonné (thérapeute) : identité, e-mail, facturation, usage du service.
              </li>
              <li>
                <strong>Sous-traitant</strong>, au sens de l'article 28 du RGPD, pour les données relatives
                aux <strong>patients de l'Abonné</strong> (alias, enregistrements audio, transcriptions,
                notes cliniques) : le thérapeute reste seul responsable du traitement de ces données à
                l'égard de ses propres patients. NoteThéra s'engage à ne traiter ces données que sur
                instruction du thérapeute, à les protéger par des mesures de sécurité appropriées, à ne pas
                les utiliser à d'autres fins (notamment l'entraînement de modèles d'IA), et à les
                supprimer ou les restituer à la fin de la relation contractuelle.
              </li>
            </ul>
          </Section>

          {/* ── 3. DONNÉES COLLECTÉES ─────────────────────────────── */}
          <Section id="donnees-collectees" title="3. Données collectées">
            <SubSection title="Données de compte">
              <p>Lors de l'inscription et de l'utilisation du service : nom complet, adresse e-mail, mot de passe (géré de façon chiffrée par Supabase Auth), photo de profil (facultative), plan d'abonnement souscrit, code de parrainage.</p>
            </SubSection>
            <SubSection title="Données relatives aux patients de l'Abonné">
              <p>
                NoteThéra est conçu pour minimiser la donnée collectée sur les patients : seul un{' '}
                <strong>alias</strong> choisi par le thérapeute est enregistré (aucun nom, prénom ou
                identifiant réel du patient n'est requis par l'application).
              </p>
            </SubSection>
            <SubSection title="Contenu clinique">
              <p>Enregistrements audio des séances, transcriptions textuelles générées à partir de ces enregistrements, notes cliniques structurées générées par IA, titres de notes, dates de séance.</p>
            </SubSection>
            <SubSection title="Données de paiement">
              <p>Gérées exclusivement par Stripe : NoteThéra ne stocke jamais les coordonnées bancaires. Seuls un identifiant client Stripe et le statut de l'abonnement (actif, essai, impayé, annulé) sont conservés sur nos serveurs.</p>
            </SubSection>
            <SubSection title="Données techniques et de sécurité">
              <p>Adresse IP et empreinte technique de l'appareil lors de l'inscription (utilisées exclusivement pour la lutte contre la fraude à l'essai gratuit), cookies de session, journaux de connexion (logs).</p>
            </SubSection>
          </Section>

          {/* ── 4. FINALITÉS DU TRAITEMENT ───────────────────────── */}
          <Section id="finalites" title="4. Finalités du traitement">
            <ul className="ml-5 list-disc space-y-1">
              <li>Création et gestion du compte Abonné, authentification ;</li>
              <li>Transcription des enregistrements audio des séances (via OpenAI Whisper) ;</li>
              <li>Génération assistée par IA des notes cliniques structurées (via Anthropic Claude) ;</li>
              <li>Gestion des dossiers patients (sous alias) et de l'historique des séances ;</li>
              <li>Facturation, gestion des abonnements et des paiements (via Stripe) ;</li>
              <li>Envoi d'e-mails transactionnels et de rappels de séance (via Resend) ;</li>
              <li>Sécurité du service, prévention de la fraude et des abus de la période d'essai ;</li>
              <li>Support client et réponse aux demandes des Abonnés ;</li>
              <li>Respect des obligations légales et comptables.</li>
            </ul>
            <p>
              Les données cliniques (audio, transcriptions, notes) ne sont jamais utilisées pour entraîner
              des modèles d'intelligence artificielle, ni à des fins commerciales ou publicitaires.
            </p>
          </Section>

          {/* ── 5. BASE LÉGALE ───────────────────────────────────── */}
          <Section id="base-legale" title="5. Base légale du traitement">
            <ul className="ml-5 list-disc space-y-1">
              <li><strong>Exécution du contrat</strong> (art. 6.1.b RGPD) : fourniture du service, facturation, support ;</li>
              <li><strong>Intérêt légitime</strong> (art. 6.1.f RGPD) : sécurité du service, prévention de la fraude et des abus de l'essai gratuit, amélioration du produit ;</li>
              <li><strong>Obligation légale</strong> (art. 6.1.c RGPD) : conservation des documents comptables et de facturation ;</li>
              <li><strong>Consentement</strong> (art. 6.1.a RGPD) : pour les communications marketing facultatives, lorsque applicable.</li>
            </ul>
          </Section>

          {/* ── 6. SOUS-TRAITANTS ────────────────────────────────── */}
          <Section id="sous-traitants" title="6. Sous-traitants et destinataires des données">
            <p>
              NoteThéra fait appel aux prestataires suivants pour fournir le service. Chacun n'accède qu'aux
              données strictement nécessaires à sa mission et est tenu par un contrat de sous-traitance
              conforme à l'article 28 du RGPD.
            </p>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3 text-left">Sous-traitant</th>
                    <th className="px-4 py-3 text-left">Rôle</th>
                    <th className="px-4 py-3 text-left">Données concernées</th>
                    <th className="px-4 py-3 text-left">Localisation</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-900">OpenAI</td>
                    <td className="px-4 py-3">Transcription audio (Whisper)</td>
                    <td className="px-4 py-3">Fichier audio, transcription</td>
                    <td className="px-4 py-3">États-Unis</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-900">Anthropic</td>
                    <td className="px-4 py-3">Génération des notes par IA (Claude)</td>
                    <td className="px-4 py-3">Transcription textuelle</td>
                    <td className="px-4 py-3">États-Unis</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-900">Supabase</td>
                    <td className="px-4 py-3">Base de données, authentification, stockage des fichiers audio</td>
                    <td className="px-4 py-3">Toutes les données du service</td>
                    <td className="px-4 py-3">Union européenne (Frankfurt)</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-900">Stripe</td>
                    <td className="px-4 py-3">Traitement des paiements et abonnements</td>
                    <td className="px-4 py-3">Données de paiement et de facturation</td>
                    <td className="px-4 py-3">Union européenne / États-Unis</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-900">Resend</td>
                    <td className="px-4 py-3">Envoi d'e-mails transactionnels et rappels de séance</td>
                    <td className="px-4 py-3">E-mail, nom, alias patient (rappel)</td>
                    <td className="px-4 py-3">États-Unis</td>
                  </tr>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3 font-medium text-gray-900">Vercel</td>
                    <td className="px-4 py-3">Hébergement de l'application</td>
                    <td className="px-4 py-3">Journaux techniques, adresse IP</td>
                    <td className="px-4 py-3">États-Unis</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm text-gray-500">
              Aucune donnée n'est vendue à des tiers ni utilisée à des fins publicitaires.
            </p>
          </Section>

          {/* ── 7. TRANSFERTS HORS UE ────────────────────────────── */}
          <Section id="transferts" title="7. Transferts de données hors Union européenne">
            <p>
              Certains sous-traitants (OpenAI, Anthropic, Resend, Vercel) sont établis aux États-Unis et
              peuvent traiter des données hors de l'Union européenne. Ces transferts sont encadrés par les
              clauses contractuelles types (CCT) adoptées par la Commission européenne, qui garantissent un
              niveau de protection adéquat des données personnelles conformément aux articles 44 et suivants
              du RGPD.
            </p>
            <p>
              Les données hébergées par Supabase (base de données et fichiers audio) sont quant à elles
              stockées exclusivement dans l'Union européenne (région Frankfurt, Allemagne).
            </p>
          </Section>

          {/* ── 8. DURÉE DE CONSERVATION ─────────────────────────── */}
          <Section id="conservation" title="8. Durée de conservation des données">
            <ul className="ml-5 list-disc space-y-1">
              <li>Données de compte et contenu clinique : pendant toute la durée de l'abonnement ;</li>
              <li>Après résiliation ou suppression du compte : conservées 30 jours, puis supprimées définitivement ;</li>
              <li>Données de facturation et documents comptables : conservées 10 ans, conformément aux obligations légales de conservation des documents comptables (article L. 123-22 du Code de commerce) ;</li>
              <li>Données techniques liées à la prévention de la fraude (IP, empreinte d'appareil) : 13 mois maximum ;</li>
              <li>Cookies de session : durée de la session ou de l'abonnement, selon leur nature.</li>
            </ul>
            <p>L'Abonné peut exporter ses notes au format PDF et supprimer ses patients ou ses séances à tout moment depuis son tableau de bord, avant toute suppression définitive.</p>
          </Section>

          {/* ── 9. SÉCURITÉ DES DONNÉES ──────────────────────────── */}
          <Section id="securite" title="9. Sécurité des données">
            <ul className="ml-5 list-disc space-y-1">
              <li>Chiffrement des données en transit (HTTPS/TLS) et au repos (base de données et stockage Supabase) ;</li>
              <li>Cloisonnement strict des données par compte au moyen de règles de sécurité au niveau des lignes (Row Level Security) : chaque thérapeute n'a accès qu'à ses propres patients, séances et notes ;</li>
              <li>Stockage des enregistrements audio dans des dossiers isolés par utilisateur, inaccessibles aux autres comptes ;</li>
              <li>Authentification sécurisée et gestion des sessions via Supabase Auth ;</li>
              <li>Accès aux données de production limité aux seules opérations nécessaires au fonctionnement du service.</li>
            </ul>
            <p>
              En cas de violation de données susceptible d'engendrer un risque pour les droits et libertés
              des personnes concernées, NoteThéra notifiera la CNIL dans un délai de 72 heures et informera
              les Abonnés concernés, conformément aux articles 33 et 34 du RGPD.
            </p>
          </Section>

          {/* ── 10. COOKIES ───────────────────────────────────────── */}
          <Section id="cookies" title="10. Cookies et traceurs">
            <p>
              NoteThéra n'utilise <strong>aucun cookie publicitaire ni de mesure d'audience tiers</strong>.
              Seuls des cookies strictement nécessaires au fonctionnement du service sont déposés :
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Cookies d'authentification et de session (Supabase Auth), permettant de maintenir la connexion à votre compte ;</li>
              <li>Cookies de sécurité déposés par Stripe lors du paiement, à des fins de prévention de la fraude.</li>
            </ul>
            <p>
              Ces cookies étant strictement nécessaires à la fourniture du service, ils ne requièrent pas de
              consentement préalable conformément aux recommandations de la CNIL. Vous pouvez néanmoins les
              bloquer via les paramètres de votre navigateur ; cela empêchera toutefois la connexion à votre
              compte.
            </p>
          </Section>

          {/* ── 11. DROITS DES UTILISATEURS ──────────────────────── */}
          <Section id="droits" title="11. Droits des utilisateurs">
            <p>Conformément au RGPD, tout Abonné dispose des droits suivants sur ses données personnelles :</p>
            <ul className="ml-5 list-disc space-y-1">
              <li><strong>Droit d'accès</strong> : obtenir une copie des données vous concernant ;</li>
              <li><strong>Droit de rectification</strong> : corriger des données inexactes ou incomplètes ;</li>
              <li><strong>Droit à l'effacement</strong> : demander la suppression de vos données ;</li>
              <li><strong>Droit à la portabilité</strong> : recevoir vos données dans un format structuré et réutilisable ;</li>
              <li><strong>Droit à la limitation</strong> du traitement ;</li>
              <li><strong>Droit d'opposition</strong>, pour motif légitime, au traitement de vos données.</li>
            </ul>
            <p>
              Ces droits s'exercent directement depuis le tableau de bord (export PDF, suppression de
              patients ou du compte) ou par e-mail à <strong>notetheraapp@gmail.com</strong>. NoteThéra
              s'engage à répondre dans un délai d'un (1) mois conformément à l'article 12 du RGPD.
            </p>
            <p>
              Les patients des Abonnés, en leur qualité de personnes concernées par le contenu clinique,
              sont invités à adresser leurs demandes directement à leur thérapeute, responsable du
              traitement de leurs données ; NoteThéra assiste le thérapeute dans le traitement de ces
              demandes en sa qualité de sous-traitant.
            </p>
          </Section>

          {/* ── 12. RÉCLAMATION CNIL ─────────────────────────────── */}
          <Section id="cnil" title="12. Réclamation auprès de la CNIL">
            <p>
              Si vous estimez, après nous avoir contactés, que vos droits ne sont pas respectés, vous
              pouvez adresser une réclamation à la Commission Nationale de l'Informatique et des Libertés
              (CNIL) :
            </p>
            <div className="rounded-lg bg-gray-50 p-4 text-sm">
              <p>CNIL — 3 Place de Fontenoy, TSA 80715, 75334 Paris Cedex 07</p>
              <p>cnil.fr</p>
            </div>
          </Section>

          {/* ── 13. MODIFICATIONS ────────────────────────────────── */}
          <Section id="modifications" title="13. Modification de la présente politique">
            <p>
              NoteThéra peut modifier la présente politique de confidentialité à tout moment, notamment
              pour se conformer à toute évolution légale, réglementaire ou technique. La version en vigueur
              est celle publiée sur cette page, avec mention de sa date de dernière mise à jour. En cas de
              modification substantielle, les Abonnés en seront informés par e-mail.
            </p>
          </Section>

          {/* ── 14. CONTACT ──────────────────────────────────────── */}
          <Section id="contact" title="14. Contact">
            <p>Pour toute question relative à la présente politique ou à vos données personnelles :</p>
            <div className="rounded-lg border border-gray-200 p-5">
              <p className="font-semibold text-gray-900">NoteThéra — Ryan Schwartz</p>
              <p className="mt-1 text-gray-600">Auto-entrepreneur (en cours de création) — France</p>
              <p className="text-gray-600">notetheraapp@gmail.com</p>
            </div>
          </Section>
        </div>

        <div className="mt-12 border-t border-gray-100 pt-8">
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

function Section({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="mb-4 text-xl font-bold text-gray-900">{title}</h2>
      <div className="space-y-3 leading-relaxed">{children}</div>
    </section>
  )
}

function SubSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-4">
      <h3 className="mb-2 font-semibold text-gray-800">{title}</h3>
      <div className="space-y-2">{children}</div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2 text-sm">
      <dt className="min-w-52 font-medium text-gray-600">{label} :</dt>
      <dd className="text-gray-800">{value}</dd>
    </div>
  )
}
