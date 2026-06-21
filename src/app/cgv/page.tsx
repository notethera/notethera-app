import Link from 'next/link'
import { FileText } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales de Vente – NoteThéra',
  description: 'Conditions générales de vente, mentions légales et politique de remboursement de NoteThéra.',
}

const LAST_UPDATED = '21 juin 2026'

export default function CGVPage() {
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
          <h1 className="text-4xl font-bold text-gray-900">Conditions Générales de Vente</h1>
          <p className="mt-3 text-sm text-gray-500">Dernière mise à jour : {LAST_UPDATED}</p>
        </div>

        <div className="space-y-12 text-gray-700">

          {/* ── 1. MENTIONS LÉGALES ──────────────────────────────── */}
          <Section id="mentions-legales" title="1. Mentions légales">
            <p>
              Conformément aux dispositions de la loi n° 2004-575 du 21 juin 2004 pour la Confiance dans
              l'Économie Numérique (LCEN), les informations suivantes sont portées à la connaissance des
              utilisateurs du site <strong>NoteThéra</strong>.
            </p>
            <SubSection title="Éditeur">
              <dl className="space-y-1">
                <Row label="Nom" value="Ryan Schwartz" />
                <Row label="Statut" value="Auto-entrepreneur (en cours de création)" />
                <Row label="Pays" value="France" />
                <Row
                  label="Immatriculation"
                  value="En cours auprès du Guichet unique (INPI) — n° SIREN à venir"
                />
                <Row label="TVA" value="Non applicable, article 293 B du Code général des impôts" />
                <Row label="Adresse" value="[Adresse — à compléter]" />
                <Row label="Contact" value="notetheraapp@gmail.com" />
              </dl>
              <p className="mt-3 text-sm text-gray-500">
                NoteThéra est édité à titre individuel par Ryan Schwartz, dont l'activité d'auto-entrepreneur
                est en cours de création. Les présentes CGV seront mises à jour dès l'obtention du numéro
                SIREN définitif, sans incidence sur la validité des contrats déjà conclus.
              </p>
            </SubSection>
            <SubSection title="Hébergement">
              <dl className="space-y-1">
                <Row label="Hébergeur" value="Vercel Inc." />
                <Row label="Adresse" value="340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis" />
                <Row label="Site" value="vercel.com" />
              </dl>
              <p className="mt-3">
                Les données des utilisateurs sont stockées sur l'infrastructure Supabase, dont les serveurs
                sont localisés dans l'Union européenne (région Frankfurt, Allemagne), conformément aux
                exigences du RGPD.
              </p>
            </SubSection>
            <SubSection title="Propriété intellectuelle">
              <p>
                L'ensemble des éléments composant le site NoteThéra (textes, graphismes, logiciels,
                noms, logos, marques, créations et œuvres protégeables diverses, bases de données) sont la
                propriété exclusive de Ryan Schwartz. Toute reproduction, représentation, modification,
                publication ou adaptation, totale ou partielle, de ces éléments est interdite sans accord
                écrit préalable.
              </p>
            </SubSection>
          </Section>

          {/* ── 2. OBJET ET CHAMP D'APPLICATION ─────────────────── */}
          <Section id="objet" title="2. Objet et champ d'application">
            <p>
              Les présentes Conditions Générales de Vente (« CGV ») régissent les relations contractuelles
              entre Ryan Schwartz, exerçant sous le nom commercial <strong>NoteThéra</strong> (ci-après «
              NoteThéra » ou « nous »), et toute personne physique ou morale (ci-après « l'Abonné » ou «
              vous ») souscrivant à l'un des abonnements proposés sur le site NoteThéra.
            </p>
            <p>
              NoteThéra est un logiciel en ligne (SaaS) permettant aux professionnels de santé mentale de
              transcrire leurs séances et de générer automatiquement des notes cliniques structurées en
              langue française.
            </p>
            <p>
              Toute commande implique l'acceptation pleine et entière des présentes CGV. NoteThéra se
              réserve le droit de modifier les présentes CGV à tout moment ; les modifications sont
              opposables aux Abonnés dès leur publication en ligne, avec un préavis de trente (30) jours.
            </p>
          </Section>

          {/* ── 3. DESCRIPTION DES SERVICES ──────────────────────── */}
          <Section id="services" title="3. Description des services">
            <p>NoteThéra propose les fonctionnalités suivantes, selon le plan souscrit :</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Transcription audio via le modèle Whisper d'OpenAI ;</li>
              <li>Génération de notes cliniques structurées par intelligence artificielle ;</li>
              <li>Gestion des dossiers patients ;</li>
              <li>Export des notes au format PDF ;</li>
              <li>Accès à l'historique des notes ;</li>
              <li>Support client par e-mail.</li>
            </ul>
            <p>
              NoteThéra est un outil d'aide à la rédaction. Les notes générées sont des propositions que
              le professionnel est seul responsable de relire, corriger et valider avant tout usage clinique
              ou médico-légal. NoteThéra ne constitue pas un dispositif médical au sens du règlement (UE)
              2017/745.
            </p>
          </Section>

          {/* ── 4. ESSAI GRATUIT ─────────────────────────────────── */}
          <Section id="essai-gratuit" title="4. Période d'essai gratuite">
            <p>
              Tout nouveau compte bénéficie, sur l'ensemble des plans, d'une période d'essai gratuite de
              <strong> 14 jours</strong>, sans obligation de fournir un moyen de paiement au moment de
              l'inscription. À l'issue de cette période :
            </p>
            <ul className="ml-5 list-disc space-y-1">
              <li>
                Si l'Abonné a renseigné ses informations de paiement et choisi un plan, l'abonnement est
                automatiquement activé et le premier prélèvement est effectué ;
              </li>
              <li>
                Si aucun moyen de paiement n'a été enregistré, le compte est suspendu et les données
                conservées pendant 30 jours supplémentaires.
              </li>
            </ul>
            <p>
              NoteThéra adresse un e-mail de rappel avant la fin de la période d'essai. L'essai gratuit est
              limité à un par utilisateur et ne peut être renouvelé sur le même compte.
            </p>
          </Section>

          {/* ── 5. PRIX ET MODALITÉS DE PAIEMENT ─────────────────── */}
          <Section id="prix" title="5. Prix et modalités de paiement">
            <SubSection title="Plans et tarifs en vigueur">
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs font-medium uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3 text-left">Plan</th>
                      <th className="px-4 py-3 text-left">Prix</th>
                      <th className="px-4 py-3 text-left">Facturation</th>
                      <th className="px-4 py-3 text-left">Engagement</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-3 font-medium text-gray-900">Solo</td>
                      <td className="px-4 py-3">19 €/mois</td>
                      <td className="px-4 py-3">Mensuelle</td>
                      <td className="px-4 py-3">Sans engagement</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-3 font-medium text-gray-900">Pro</td>
                      <td className="px-4 py-3">49 €/mois</td>
                      <td className="px-4 py-3">Mensuelle</td>
                      <td className="px-4 py-3">Sans engagement</td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td className="px-4 py-3 font-medium text-gray-900">Pro Annuel</td>
                      <td className="px-4 py-3">39 €/mois (soit 468 €/an)</td>
                      <td className="px-4 py-3">Annuelle, en une fois</td>
                      <td className="px-4 py-3">12 mois</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-sm text-gray-500">
                Le plan <strong>Solo</strong> inclut 15 notes cliniques par mois, la transcription audio, la
                génération de notes par IA, la gestion des patients et l'export PDF. Les plans <strong>Pro
                </strong> et <strong>Pro Annuel</strong> incluent les mêmes fonctionnalités avec des notes
                illimitées et un support prioritaire.
              </p>
              <p className="mt-3 text-sm text-gray-500">
                Les prix sont indiqués en euros (€). NoteThéra bénéficie de la franchise en base de TVA
                prévue à l'article 293 B du Code général des impôts : la TVA n'est pas applicable sur les
                montants facturés. Les prix indiqués s'entendent donc nets de toute taxe. Si l'activité
                venait à dépasser les seuils légaux d'assujettissement, NoteThéra en informerait les Abonnés
                et appliquerait la TVA en vigueur à compter de la date d'assujettissement. NoteThéra se
                réserve par ailleurs le droit de modifier ses tarifs, avec un préavis de 30 jours.
              </p>
            </SubSection>
            <SubSection title="Modalités de paiement">
              <p>
                Le paiement s'effectue exclusivement par carte bancaire (Visa, Mastercard, American Express)
                via la plateforme de paiement sécurisée <strong>Stripe</strong>. Les coordonnées bancaires
                ne sont jamais stockées sur les serveurs de NoteThéra. Stripe est certifié PCI-DSS niveau 1.
              </p>
              <p>
                Pour les plans Solo et Pro, le prélèvement intervient à chaque date anniversaire mensuelle de
                l'abonnement. Pour le plan Pro Annuel, le prélèvement intervient en une fois au début de
                chaque période de 12 mois. En cas d'échec de paiement, NoteThéra effectue jusqu'à trois
                nouvelles tentatives sur une période de sept (7) jours avant de suspendre l'accès au
                service. Un e-mail de notification est envoyé à chaque tentative infructueuse.
              </p>
            </SubSection>
            <SubSection title="Factures">
              <p>
                Une facture est générée automatiquement à chaque prélèvement et disponible depuis
                l'espace « Facturation » du tableau de bord.
              </p>
            </SubSection>
          </Section>

          {/* ── 6. DURÉE D'ENGAGEMENT ET RENOUVELLEMENT ──────────── */}
          <Section id="duree" title="6. Durée d'engagement et renouvellement">
            <p>
              Les plans <strong>Solo</strong> et <strong>Pro</strong> sont souscrits sans engagement de
              durée : l'abonnement est facturé mensuellement et renouvelé tacitement par périodes
              successives d'un mois.
            </p>
            <p>
              Le plan <strong>Pro Annuel</strong> est souscrit pour une durée minimale de douze (12) mois,
              facturée intégralement en une seule fois en contrepartie du tarif préférentiel de 39 €/mois.
              À l'issue de cette période, l'abonnement est renouvelé tacitement pour une nouvelle période de
              12 mois, sauf résiliation par l'Abonné avant la date de renouvellement.
            </p>
            <p>
              Conformément à l'article L. 215-1 du Code de la consommation, lorsque l'Abonné agit en
              qualité de consommateur, NoteThéra l'informe par e-mail, au plus tôt trois (3) mois et au plus
              tard un (1) mois avant la date de renouvellement tacite d'un abonnement annuel, de la
              possibilité de ne pas reconduire le contrat.
            </p>
          </Section>

          {/* ── 7. RÉSILIATION ───────────────────────────────────── */}
          <Section id="resiliation" title="7. Résiliation">
            <SubSection title="Résiliation par l'Abonné">
              <p>
                L'Abonné peut résilier son abonnement à tout moment depuis son tableau de bord (rubrique
                « Facturation » → « Gérer mon abonnement ») ou en contactant le support à
                notetheraapp@gmail.com.
              </p>
              <p>
                Pour les plans Solo et Pro, la résiliation prend effet à la fin de la période de facturation
                mensuelle en cours ; l'Abonné conserve l'accès au service jusqu'à cette date, sans
                remboursement proratisé des jours restants.
              </p>
              <p>
                Pour le plan Pro Annuel, la résiliation met fin au renouvellement tacite pour la période de
                12 mois suivante, mais ne donne pas lieu à un remboursement de la période annuelle déjà
                payée, sauf exercice du droit de rétractation dans les conditions prévues à l'article 8.
              </p>
            </SubSection>
            <SubSection title="Résiliation par NoteThéra">
              <p>
                NoteThéra peut résilier l'abonnement avec un préavis de trente (30) jours en cas de
                cessation d'activité, ou sans préavis en cas de violation grave des présentes CGV
                (utilisation frauduleuse, tentative de détournement du service, comportement abusif envers
                le support, etc.).
              </p>
              <p>
                En cas de résiliation par NoteThéra pour un motif autre qu'une faute de l'Abonné, un
                remboursement proratisé des jours non consommés est effectué.
              </p>
            </SubSection>
            <SubSection title="Sort des données">
              <p>
                Après résiliation, les données de l'Abonné sont conservées pendant <strong>30 jours</strong>
                , puis définitivement supprimées. L'Abonné peut exporter ses notes au format PDF depuis son
                tableau de bord avant la suppression.
              </p>
            </SubSection>
          </Section>

          {/* ── 8. DROIT DE RÉTRACTATION ─────────────────────────── */}
          <Section id="retractation" title="8. Droit de rétractation">
            <p>
              Conformément aux articles L. 221-18 et suivants du Code de la consommation, l'Abonné
              consommateur dispose d'un délai de <strong>14 jours calendaires</strong> à compter de la
              date de souscription pour exercer son droit de rétractation, sans avoir à motiver sa décision.
            </p>
            <p>
              L'Abonné qui souhaite se rétracter adresse une déclaration non ambiguë à :
            </p>
            <div className="rounded-lg bg-gray-50 p-4 text-sm">
              <p>NoteThéra — Ryan Schwartz</p>
              <p>[Adresse postale — à compléter]</p>
              <p>notetheraapp@gmail.com</p>
            </div>
            <p>
              En souscrivant à l'abonnement, l'Abonné reconnaît expressément demander l'exécution
              immédiate du contrat et accepte que, si le service a commencé à être fourni avant l'expiration
              du délai de rétractation, il sera redevable d'un montant proportionnel aux jours d'utilisation
              écoulés (article L. 221-25 du Code de la consommation).
            </p>
            <p className="text-sm font-medium text-gray-500">
              Le droit de rétractation ne s'applique pas aux Abonnés qui agissent dans le cadre de leur
              activité professionnelle (personnes morales ou professionnels de santé souscrivant au titre
              de leur exercice professionnel).
            </p>
          </Section>

          {/* ── 9. POLITIQUE DE REMBOURSEMENT ────────────────────── */}
          <Section id="remboursement" title="9. Politique de remboursement">
            <p>En dehors du droit de rétractation légal, NoteThéra applique la politique suivante :</p>
            <ul className="ml-5 list-disc space-y-2">
              <li>
                <strong>Interruption totale et prolongée du service (&gt; 48 h consécutives)</strong> due à
                NoteThéra (hors maintenance planifiée notifiée) : remboursement proratisé des jours
                d'indisponibilité.
              </li>
              <li>
                <strong>Double prélèvement</strong> : remboursement intégral du montant prélevé en erreur
                sous 5 jours ouvrés.
              </li>
              <li>
                <strong>Annulation pendant la période d'essai</strong> : aucun prélèvement n'aura eu lieu ;
                aucun remboursement n'est donc applicable.
              </li>
              <li>
                <strong>Insatisfaction hors cas ci-dessus</strong> : aucun remboursement n'est accordé
                pour la période de facturation écoulée (mensuelle ou annuelle selon le plan). L'Abonné
                reste libre de résilier avant le prochain renouvellement.
              </li>
            </ul>
            <p>
              Pour toute demande de remboursement, contactez notetheraapp@gmail.com en précisant votre
              adresse e-mail de compte et le motif. NoteThéra s'engage à répondre sous 5 jours ouvrés.
            </p>
          </Section>

          {/* ── 10. DISPONIBILITÉ ET SLA ─────────────────────────── */}
          <Section id="disponibilite" title="10. Disponibilité du service">
            <p>
              NoteThéra s'engage à maintenir le service accessible <strong>99 % du temps</strong> sur une
              base mensuelle, hors maintenances planifiées. Les maintenances programmées sont notifiées par
              e-mail ou via le tableau de bord au moins 24 heures à l'avance.
            </p>
            <p>
              La disponibilité du service de transcription et de génération de notes dépend également de
              tiers (OpenAI, Supabase, Stripe). NoteThéra ne saurait être tenu responsable des interruptions
              imputables à ces prestataires.
            </p>
          </Section>

          {/* ── 11. RESPONSABILITÉ ───────────────────────────────── */}
          <Section id="responsabilite" title="11. Limitation de responsabilité">
            <p>
              NoteThéra met à disposition un outil d'aide à la rédaction. <strong>La validation
              clinique, médicale ou médico-légale des notes générées relève de la seule responsabilité
              du professionnel.</strong> NoteThéra ne saurait être tenu responsable d'une erreur de
              diagnostic, d'une mauvaise prise en charge ou de tout préjudice découlant de l'utilisation
              des notes générées sans relecture.
            </p>
            <p>
              En tout état de cause, la responsabilité de NoteThéra est limitée au montant des sommes
              effectivement perçues au titre de l'abonnement de l'Abonné concerné au cours des trois (3)
              mois précédant le fait générateur.
            </p>
            <p>
              NoteThéra ne peut être tenu responsable des dommages indirects, pertes de données, manques à
              gagner, préjudices immatériels ou perte de clientèle, quelles qu'en soient les causes.
            </p>
          </Section>

          {/* ── 12. DONNÉES PERSONNELLES ─────────────────────────── */}
          <Section id="donnees-personnelles" title="12. Protection des données personnelles (RGPD)">
            <p>
              Conformément au Règlement Général sur la Protection des Données (RGPD – règlement UE 2016/679)
              et à la loi Informatique et Libertés modifiée, NoteThéra collecte et traite les données
              personnelles de l'Abonné — et, en qualité de sous-traitant, les données cliniques relatives
              aux patients de l'Abonné — dans le cadre de la fourniture du service.
            </p>
            <p>
              Le détail des données collectées, des finalités, des sous-traitants (OpenAI, Anthropic,
              Supabase, Stripe, Resend, Vercel), des durées de conservation et des droits de l'Abonné est
              disponible dans la{' '}
              <Link href="/confidentialite" className="font-medium text-teal-600 hover:text-teal-700">
                Politique de confidentialité
              </Link>{' '}
              de NoteThéra, qui fait partie intégrante des présentes CGV.
            </p>
            <p>
              Responsable du traitement : Ryan Schwartz (NoteThéra) — notetheraapp@gmail.com. Ces droits
              s'exercent à cette même adresse ; en cas de litige, l'Abonné peut saisir la CNIL (cnil.fr).
            </p>
          </Section>

          {/* ── 13. MÉDIATION ────────────────────────────────────── */}
          <Section id="mediation" title="13. Médiation des litiges de consommation">
            <p>
              Conformément aux articles L. 611-1 et suivants du Code de la consommation, tout Abonné
              consommateur a le droit de recourir gratuitement à un médiateur de la consommation en vue de
              la résolution amiable d'un litige avec NoteThéra.
            </p>
            <p>
              NoteThéra adhère au service de médiation : <strong>[Nom du médiateur — à compléter]</strong>.
              La saisine du médiateur peut également se faire via la plateforme européenne de règlement en
              ligne des litiges (RLL) : <strong>ec.europa.eu/consumers/odr</strong>.
            </p>
            <p className="text-sm text-gray-500">
              Le recours à la médiation est facultatif. Tout Abonné peut toujours saisir les tribunaux
              compétents.
            </p>
          </Section>

          {/* ── 14. LOI APPLICABLE ET JURIDICTION ───────────────── */}
          <Section id="loi" title="14. Loi applicable et juridiction compétente">
            <p>
              Les présentes CGV sont soumises au droit français. En cas de litige relatif à leur
              interprétation ou à leur exécution, et à défaut d'accord amiable, les tribunaux français
              seront seuls compétents.
            </p>
            <p>
              Pour les Abonnés agissant en qualité de consommateurs, le tribunal compétent est celui du
              domicile du défendeur ou du lieu d'exécution de la prestation, conformément aux règles du
              Code de procédure civile. Pour les Abonnés agissant en qualité de professionnels, tout litige
              sera soumis aux tribunaux compétents du lieu d'exercice de l'activité de Ryan Schwartz.
            </p>
          </Section>

          {/* ── 15. CONTACT ──────────────────────────────────────── */}
          <Section id="contact" title="15. Contact">
            <p>Pour toute question relative aux présentes CGV :</p>
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
