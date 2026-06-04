<script lang="ts">
  import { browser } from '$app/environment';

  let ouvert: string | null = null;
  let formulaireOuvert: string | null = null;
  let emailInput = '';
  let envoi: 'idle' | 'sending' | 'ok' | 'error' = 'idle';
  let erreurEnvoi = '';
  let dernierEnvoi: string | null = null;

  function toggle(id: string) {
    ouvert = ouvert === id ? null : id;
    if (formulaireOuvert && formulaireOuvert !== id) {
      formulaireOuvert = null;
    }
  }

  function ouvrirFormulaire(id: string, event: MouseEvent) {
    event.stopPropagation();
    formulaireOuvert = formulaireOuvert === id ? null : id;
    if (browser) {
      emailInput = localStorage.getItem('mrc_email') || '';
    }
    envoi = 'idle';
    erreurEnvoi = '';
  }

  async function envoyerNote(code: string) {
    const email = emailInput.trim();
    if (!email) return;
    envoi = 'sending';
    erreurEnvoi = '';
    try {
      const res = await fetch('/api/send-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (data.ok) {
        if (browser) localStorage.setItem('mrc_email', email);
        dernierEnvoi = email;
        envoi = 'ok';
        setTimeout(() => {
          formulaireOuvert = null;
          envoi = 'idle';
        }, 3000);
      } else {
        erreurEnvoi = data.error || 'Erreur lors de l\'envoi.';
        envoi = 'error';
      }
    } catch {
      erreurEnvoi = 'Erreur réseau.';
      envoi = 'error';
    }
  }

  type Statut = 'fiche disponible' | 'fiche en préparation' | 'en cours';

  interface Grammaire {
    id: string;
    code: string;
    nom: string;
    auteurs: string;
    statut: Statut;
    question?: string;
    apport?: string;
    tensions?: string;
    signal?: string;
  }

  const grammaires: Grammaire[] = [
    {
      id: 'g1',
      code: 'G1',
      nom: 'Évolutivité cognitive',
      auteurs: 'Boyer (2001, 2018), Tinbergen (1963), Sperber (1996), Henrich (2015)',
      statut: 'fiche disponible',
      question: "Pourquoi des dispositifs collectifs rationnellement justifiés échouent-ils à changer les comportements — et comment inscrire ce phénomène dans le registre sans en faire un simple déficit d'information ?",
      apport: "G1 répond que les dispositions cognitives humaines héritées de l'environnement d'adaptation évolutionnaire (EEA) produisent des attracteurs — des points vers lesquels les représentations tendent spontanément — qui peuvent être en décalage avec les règles délibérées du registre. Ce décalage est mesurable et inscriptible. La grammaire distingue deux niveaux d'explication (Tinbergen 1963) : proximate (le mécanisme cognitif immédiat) et ultimate (la valeur adaptative à long terme). Une règle peut être refusée pour des raisons proximates (biais, habitude) alors qu'elle est justifiée à un niveau ultimate (bien collectif). G1 oblige à désigner le niveau d'explication de toute résistance avant d'en conclure à un échec.",
      tensions: "G1 est en tension avec G3 (Soin) : l'attracteur cognitif peut être une pratique de care non reconnue, pas une résistance à réviser. Elle est également en tension avec G7 (Justice) : ce qui ressemble à une résistance cognitive peut être une injustice herméneutique — les acteurs n'ont pas les mots pour nommer leur situation.",
      signal: 'R-ATTRACTEUR, résistance_cognitive_révision, adéquation_cognitive_EEA, RÉVISION_PROXIMATE_ULTIMATE'
    },
    {
      id: 'g2',
      code: 'G2',
      nom: 'Responsabilité',
      auteurs: 'Jonas (1979/1990), Gosseries (2023), Nussbaum (2006), Morizot & Neyret (2026), Hache (2011)',
      statut: 'fiche disponible',
      question: "Comment inscrire dans un registre des obligations envers des entités vivantes — humaines et non-humaines — lorsque des irréversibilités sont en jeu, sans réduire cette responsabilité à un calcul coût-bénéfice ?",
      apport: "G2 est fondée sur l'heuristique de la peur (Jonas, Le Principe Responsabilité, 1979) : face à une décision irréversible, le scénario catastrophique a une priorité épistémique sur le scénario optimiste. La vulnérabilité de ce qui peut être détruit prime sur l'opportunité espérée. Dans le MRC, cette heuristique se traduit par R-INTERDIT-ABSOLU — un signal calculable déclenché lorsque le registre détecte un risque d'irréversibilité. G2 couvre trois horizons temporels : institutionnel (décisions réversibles à court terme), intergénérationnel (obligations envers des acteurs futurs identifiables), et existentiel (irréversibilités affectant des acteurs futurs non encore identifiables). Ce dernier horizon déclenche [ENGAGEMENT À HORIZON IRRÉVERSIBLE], qui exige une délibération explicite avant toute conclusion.",
      tensions: "G2 est en tension avec G7 (Justice) sur le seuil d'entrée dans la communauté morale : Jonas exclut les entités sans finalité immanente, Nussbaum étend les capabilités aux animaux non-humains. Cette tension est documentée dans le MRC, non lissée. G2 est également en tension avec G5 (Méséologie) : Hache récuse la notion de seuil unique d'habitabilité que G2 tend à poser.",
      signal: 'R-INTERDIT-ABSOLU, irréversibilité_jonasienne, RISQUE_EXISTENTIEL_IMMINENT, ENGAGEMENT À HORIZON IRRÉVERSIBLE, C-INDEXATION-HORIZON'
    },
    {
      id: 'g3',
      code: 'G3',
      nom: 'Soin',
      auteurs: 'Tronto (1993), Federici (2004), Held (2006), Gilligan (1982)',
      statut: 'fiche en préparation',
      question: "Comment rendre visible et inscriptible le travail de soin — reproductif, attentionnel, invisible — que les registres conventionnels effacent systématiquement ?",
      apport: "G3 mobilise les quatre dimensions du care (Tronto) : inventaire des besoins, opérations de soin, coûts assumés, attribution des responsabilités. Elle active R-CARE dès que l'une de ces dimensions est absente ou non inscrite.",
      tensions: "En tension avec G6 (Communalité) sur la question de la délégation du care aux communs, et avec G8 (Mimétique) sur les dynamiques de désignation du bouc-émissaire dans les collectifs de care.",
      signal: 'R-CARE, GENRE_GELÉ_PERSISTANT, R-MALTRAITANCE, co-dégradation'
    },
    {
      id: 'g4',
      code: 'G4',
      nom: 'Performativité',
      auteurs: 'Haraway (1988, 1991), Butler (1990), Latour (1987)',
      statut: 'fiche en préparation',
      question: "Comment les instruments de description d'un registre contribuent-ils à produire ce qu'ils prétendent seulement décrire — et comment inscrire cette performativité sans l'effacer ?",
      apport: "G4 impose la déclaration de situationnalité de tout instrument d'analyse : qui l'a conçu, qui en est exclu, dans quel régime opère-t-il. Sans cette déclaration : R-SITUATIONNALITÉ_BLOQUÉE.",
      tensions: "En tension avec G1 (Évolutivité) sur la possibilité d'attracteurs cognitifs universels vs savoirs situés, et avec G7 (Justice) sur la définition des acteurs légitimes.",
      signal: 'R-SITUATIONNALITÉ_BLOQUÉE, TOKEN_MARGINAL_NON_ENTENDU, cycle_performatif_détecté, carré_non_commutatif'
    },
    {
      id: 'g5',
      code: 'G5',
      nom: 'Méséologie',
      auteurs: 'Berque (2000, 2014), Stépanoff (2021)',
      statut: 'fiche en préparation',
      question: "Comment inscrire la relation entre un collectif et son milieu — non comme environnement extérieur, mais comme condition interne d'habitabilité ?",
      apport: "G5 pose l'habitabilité comme catégorie centrale : un milieu est habitable ou non selon la qualité du couplage entre régime métabolique (prélèvement) et régime attentionnel (soin du milieu). La dégradation du milieu est co-dégradation du collectif.",
      tensions: "En tension avec G2 (Responsabilité) sur le seuil d'habitabilité universel vs situé, et avec G6 (Communalité) sur les droits de gestion du milieu.",
      signal: 'MILIEU_DÉGRADÉ_PERSISTANT, R-CODEGRADATION, OBLIGATION_PRÉSERVATION_VIOLÉE, soin_avec_milieu'
    },
    {
      id: 'g6',
      code: 'G6',
      nom: 'Communalité',
      auteurs: "Ostrom (1990, 2009), Bollier (2014), Hess & Ostrom (2007)",
      statut: 'fiche en préparation',
      question: "Comment un collectif gouverne-t-il une ressource commune sans la privatiser ni la nationaliser — et quels faisceaux de droits rendent ce gouvernement possible ?",
      apport: "G6 mobilise la grille des cinq droits ostromiens (accès, prélèvement, gestion, exclusion, aliénation) pour évaluer le degré de communalité d'un registre. Elle déclenche COMMUN_GOUVERNÉ_FRAGILE dès que la parité délibérative est absente.",
      tensions: "En tension avec G3 (Soin) sur la délégation du care aux institutions de communs, et avec G7 (Justice) sur la définition des identités légitimes dans la délibération.",
      signal: 'degré_communalité, parité_délibérative, COMMUN_GOUVERNÉ_FRAGILE, faisceaux_de_droits'
    },
    {
      id: 'g7',
      code: 'G7',
      nom: 'Justice et capabilités',
      auteurs: 'Nussbaum (2000, 2006), Fricker (2007), Fraser (2005), Crenshaw (1991), Hache (2011)',
      statut: 'fiche disponible',
      question: "Comment inscrire une injustice dans un registre formel sans réduire la justice à un calcul ni imposer une théorie normative unique ?",
      apport: `G7 s'appuie sur trois programmes normatifs articulés. Les capabilités plancher (Nussbaum 2000/2006) définissent ce que toute personne doit pouvoir faire ou être — un seuil en dessous duquel une vie est structurellement injuste. Dans le MRC, franchir ce seuil déclenche R-CAPABILITES, une contrainte procédurale révisable collectivement.

L'injustice épistémique (Fricker 2007) est une précondition formelle bloquante (R-HERMENEUTIQUE) : si des acteurs n'ont pas les mots pour nommer leur situation, délibérer avant de corriger cette lacune produit des décisions structurellement viciées. Ce n'est pas une considération éthique additionnelle — c'est une contrainte de validité du registre.

L'intersectionnalité (Crenshaw 1991) et la parité de participation (Fraser 2005) sont les opérateurs de traçage des asymétries : G7 oblige à identifier qui parle au nom de qui, et selon quelles identités légitimes.

Un registre qui prétend être neutre sur la justice choisit de ne pas voir ce qu'il ne veut pas inscrire. G7 fait le choix inverse : inscrire les injustices comme information de conception, même en l'absence de consensus sur la théorie à appliquer.`,
      tensions: "G7 est en tension avec G2 (Responsabilité) sur l'unité d'évaluation : Nussbaum est résolument individualiste, le MRC traite l'habitabilité comme propriété systémique. Cette tension est documentée, non lissée. G7 est en tension avec G6 (Communalité) sur la définition des identités légitimes dans la délibération ostromienne.",
      signal: 'R-CAPABILITES, R-HERMENEUTIQUE, capabilité_plancher_menacée, injustice_testimoniale, injustice_herméneutique, intersectionnalité'
    },
    {
      id: 'g8',
      code: 'G8',
      nom: 'Mimétique',
      auteurs: 'Girard (1961, 1972, 1978)',
      statut: 'fiche en préparation',
      question: "Comment inscrire les dynamiques de rivalité mimétique et de désignation du bouc-émissaire qui dégradent silencieusement les collectifs ?",
      apport: "G8 détecte trois signaux girardiens : indifférenciation des acteurs (perte de distinctivité des rôles), méconnaissance fondatrice (le collectif croit résoudre une crise par un sacrifice qu'il ne reconnaît pas comme tel), unanimité accusatrice (consensus apparent sur un responsable). Si détectés : suspension des écritures ambiguës + ouverture obligatoire d'une enquête collective.",
      tensions: "En tension avec G1 (Évolutivité) sur les mécanismes cognitifs sous-jacents à la rivalité mimétique.",
      signal: 'R-CRISE_MIMETIQUE, R-VICTIME_EMISSAIRE, R-MECONNAISSANCE, indifférenciation_acteurs'
    },
    {
      id: 'g9',
      code: 'G9',
      nom: 'Affectif',
      auteurs: 'MRC 5.x — note NT-G9',
      statut: 'fiche en préparation',
      question: "Comment inscrire les régimes affectifs qui structurent les interactions sans les réduire à des données psychologiques individuelles ?",
      apport: "G9 rend inscriptibles les conditions affectives d'un commun (travail émotionnel, reconnaissance, défenses de métier, mésentente) comme variables d'état du registre, en qualifiant un régime collectif sans psychologiser les individus.",
      tensions: "En cours d'articulation avec G3 (Soin) et G8 (Mimétique).",
      signal: 'en cours de définition'
    },
    {
      id: 'g10',
      code: 'G10',
      nom: 'Démocratie épistémique',
      auteurs: 'Anderson (2006), Landemore (2012), MRC 5.x',
      statut: 'fiche en préparation',
      question: "Comment concevoir un registre qui soit lui-même un dispositif de démocratie épistémique — où la diversité des savoirs améliore la qualité des décisions collectives ?",
      apport: "G10 pose que la légitimité d'un registre dépend de sa capacité à intégrer des savoirs hétérogènes sans les réduire à un seul cadre. Elle active les signaux de parité délibérative et d'injustice herméneutique comme conditions de validité, non comme considérations optionnelles.",
      tensions: "En tension productive avec G4 (Performativité) sur la notion de savoir légitime, et avec G7 (Justice) sur les conditions d'entrée dans la délibération.",
      signal: 'parité_délibérative, TOKEN_MARGINAL_NON_ENTENDU, diversité_épistémique',
      lien: '/usage-2',
      lienLabel: 'Voir G10 à l’œuvre : une enquête collective (Usage 2) →'
    },
    {
      id: 'g11',
      code: 'G11',
      nom: 'Travail (qualité et capabilité)',
      auteurs: 'Zimmermann & Didry, Murray — MRC 5.x (NT-G11)',
      statut: 'fiche en préparation',
      question: "Comment inscrire la qualité du travail non comme un indicateur RH parmi d'autres, mais comme une capabilité — la possibilité réelle, pour le travailleur, d'exercer un métier dont il est reconnu juge légitime ?",
      apport: "Nouveauté v5.5 : G-TRAVAIL accueille les sources de sociologie/économie du travail jusque-là portées par la fiche F1. Elle distingue trois registres : la qualité du travail comme objet de délibération (DPQT, Zimmermann & Didry — salarié reconnu juge légitime), la position du travailleur sur les axes risque / autonomie / expressivité (Murray), et le travail comme commun de capabilités dont la gouvernance peut être stable, instable ou en transition (signal COMMUN_GOUVERNE_FRAGILE).",
      tensions: "Distincte de G3 (Soin), qui porte le travail attentionnel et reproductif (care), et de G7 (Justice), qui porte la reconnaissance comme plancher de dignité. Décision actée : G-TRAVAIL est maintenue comme grammaire distincte de NT-G7.",
      signal: 'salarie_comme_juge, profondeur_justice (SURFACE/INTERMEDIAIRE/PROFONDE), risque_murray, autonomie_subordination, expressivite, COMMUN_GOUVERNE_FRAGILE'
    },
    {
      id: 'g12',
      code: 'G12',
      nom: 'Valuation (comptabilité & valuemètres)',
      auteurs: 'Richard, Bensadon & Rambaud (2024), Rambaud (2019, CARE), Dumeaux (2025), Bahougne (2020), CNoCP — MRC 5.x (NT-G12)',
      statut: 'fiche en préparation',
      question: "Comment inscrire le geste comptable lui-même comme dispositif gouvernable — de sorte qu'un seuil ou un prix ne soit jamais un instrument performatif non gouverné ?",
      apport: "Nouveauté v5.5 : G-VALUATION accueille toutes les sources comptables et de valuation jusque-là portées par la fiche F8 et devient le porteur de Couche 3 de la gouvernance des valuemètres (chantier B4). Quatre blocs : mouvements comptables et équation du bilan (Richard, Bensadon & Rambaud 2024, [VÉRIFIÉ]) ; comptabilité CARE et capitaux à préserver (Rambaud 2019) ; juste prix écologique (Dumeaux 2025) ; droit et normalisation de la comptabilité publique (Bahougne, CNoCP). Tout valuemètre déclare sa source (DID) et sa convention d'attribution.",
      tensions: "Articulée à G4 (Performativité) — un seuil sans convention déclarée constitue ce qu'il prétend mesurer — et à G2 (Responsabilité) pour le chiffrage de la dette. Références primaires Rambaud 2019 et Dumeaux 2025 : [PLAUSIBLE, NON VÉRIFIÉ].",
      signal: 'regime_comptable (IFRS/PCG/CARE), ecart_juste_prix, valuemètre_source_déclarée, INSTRUMENT_PERFORMATIF_NON_GOUVERNE'
    }
  ];

  // Codes pour lesquels une note de vulgarisation est disponible (incluant NT-ARCH)
  const codesAvecNote = new Set(['G1', 'G2', 'G7', 'ARCH']);

  function couleurStatut(statut: Statut): string {
    if (statut === 'fiche disponible')    return 'bg-emerald-50 text-emerald-700';
    if (statut === 'fiche en préparation') return 'bg-amber-50 text-amber-700';
    return 'bg-slate-100 text-slate-500';
  }
</script>

<svelte:head>
  <title>Grammaires transversales — Registres de communalité</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-16">

  <div class="mb-8">
    <div class="mb-2 text-sm font-medium text-mrc-500">Comprendre · Cadres théoriques</div>
    <h1 class="text-3xl font-bold text-mrc-900">Grammaires transversales</h1>
    <p class="mt-3 text-mrc-600 max-w-2xl">
      Les douze grammaires transversales du MRC 5.x (NT-G1 à NT-G12) — lentilles théoriques
      mobilisées en Couche 3 pour analyser ce qui fait communalité dans un collectif. Chacune pose
      une question structurante distincte et s'articule aux autres selon des tensions documentées.
      Pour une lecture pas à pas, voir <a href="/pedagogie" class="underline hover:text-mrc-900">Comprendre, pas à pas</a>.
    </p>
  </div>

  <!-- Résumé NT-ARCH -->
  <div class="mb-10 rounded-xl border border-mrc-200 bg-mrc-50 px-6 py-5">
    <div class="flex items-center gap-2 mb-3">
      <span class="inline-block rounded-md bg-mrc-100 text-mrc-700 text-xs font-bold px-2 py-1">NT-ARCH</span>
      <p class="text-sm font-semibold text-mrc-800">Architecture transversale des obligations</p>
    </div>
    <p class="text-sm text-mrc-700 leading-relaxed mb-3">
      Avant les dix grammaires, le MRC pose une question architecturale : <em>que faire quand une obligation n'a pas encore de porteur ?</em>
      NT-ARCH répond par trois régimes d'obligation déclarés explicitement dans le registre —
      <strong>ACTORIEL</strong> (porteur identifié), <strong>SYSTEMIQUE</strong> (sans porteur, en attente),
      <strong>HYBRIDE</strong> — et une machine d'états qui interdit de traiter une dette comme urgente
      avant qu'une délibération ait tenté de l'attribuer.
    </p>
    <p class="text-sm text-mrc-700 leading-relaxed mb-3">
      Quatre contraintes concrètes : (1) tout régime d'obligation doit être déclaré — une dette sans porteur ne peut pas être traitée
      comme si elle en avait un ; (2) une dette systémique non attribuée ne peut jamais déclencher directement le niveau CRITIQUE ;
      (3) toute représentation d'acteurs absents (générations futures, entités non-humaines) doit déclarer son principe de référence
      et sa condition de réfutabilité ; (4) une asymétrie à portée planétaire déclenche une obligation de légitimité représentative
      spécifique (<code class="text-xs bg-white px-1 rounded">planetaireNonDesignee</code>).
    </p>
    <p class="text-sm text-mrc-600 leading-relaxed">
      NT-ARCH ne tranche pas <em>qui</em> est responsable ni quelle théorie de la justice intergénérationnelle est la bonne.
      Elle tranche une question plus étroite : quelles propriétés une obligation inscrite doit-elle avoir pour être
      traçable, délibérable et réfutable ? Les contenus restent l'affaire des grammaires G1–G10 et de la délibération collective.
    </p>
    <p class="mt-3 text-xs text-mrc-400 italic">NT-ARCH v5.6 (ébauche) — 31 mai 2026 / 1er juin 2026</p>

    <!-- Formulaire NT-ARCH -->
    <div class="mt-4 pt-4 border-t border-mrc-200">
      <button
        class="text-sm text-mrc-600 hover:text-mrc-800 underline underline-offset-2 transition-colors"
        on:click={(e) => ouvrirFormulaire('nt-arch', e)}
      >
        {formulaireOuvert === 'nt-arch' ? 'Fermer' : 'Recevoir la note complète NT-ARCH →'}
      </button>

      {#if formulaireOuvert === 'nt-arch'}
        <div class="mt-3 rounded-lg border border-mrc-100 bg-white px-4 py-4">
          <p class="text-sm text-mrc-700 mb-3">
            Recevoir la note théorique <strong>NT-ARCH — Architecture transversale des obligations</strong> par email.
          </p>
          {#if envoi === 'ok'}
            <p class="text-sm text-emerald-700 font-medium">✓ Note envoyée à {dernierEnvoi}.</p>
          {:else}
            <form
              class="flex flex-col sm:flex-row gap-2"
              on:submit|preventDefault={() => envoyerNote('ARCH')}
            >
              <input
                type="email"
                bind:value={emailInput}
                placeholder="votre@email.fr"
                required
                class="flex-1 rounded-md border border-mrc-200 bg-white px-3 py-2 text-sm text-mrc-900 placeholder-mrc-400 focus:outline-none focus:ring-2 focus:ring-mrc-300"
              />
              <button
                type="submit"
                disabled={envoi === 'sending'}
                class="shrink-0 rounded-md bg-mrc-600 px-4 py-2 text-sm font-medium text-white hover:bg-mrc-700 disabled:opacity-60 transition-colors"
              >
                {envoi === 'sending' ? 'Envoi…' : 'Envoyer'}
              </button>
            </form>
            {#if envoi === 'error'}
              <p class="mt-2 text-xs text-red-600">{erreurEnvoi}</p>
            {/if}
          {/if}
        </div>
      {/if}
    </div>
  </div>

  <!-- Légende statuts -->
  <div class="mb-8 flex flex-wrap gap-3 text-xs">
    <span class="flex items-center gap-1.5"><span class="inline-block rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700">fiche disponible</span> contenu vulgarisé accessible</span>
    <span class="flex items-center gap-1.5"><span class="inline-block rounded-full px-2 py-0.5 bg-amber-50 text-amber-700">fiche en préparation</span> note théorique existante, vulgarisation à venir</span>
    <span class="flex items-center gap-1.5"><span class="inline-block rounded-full px-2 py-0.5 bg-slate-100 text-slate-500">en cours</span> formalisation MRC en cours</span>
  </div>

  <!-- Liste des grammaires -->
  <div class="space-y-3">
    {#each grammaires as g}
      <div class="rounded-xl border border-mrc-100 bg-white overflow-hidden">

        <!-- En-tête cliquable -->
        <button
          class="w-full flex items-start gap-4 p-5 text-left hover:bg-mrc-50 transition-colors"
          on:click={() => toggle(g.id)}
          aria-expanded={ouvert === g.id}
        >
          <span class="shrink-0 flex items-center justify-center w-9 h-9 rounded-lg bg-mrc-100 text-mrc-700 text-sm font-bold">
            {g.code}
          </span>
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2">
              <span class="font-semibold text-mrc-900">{g.nom}</span>
              <span class="rounded-full px-2 py-0.5 text-xs font-medium {couleurStatut(g.statut)}">
                {g.statut}
              </span>
            </div>
            <p class="text-xs text-mrc-500 mt-0.5">{g.auteurs}</p>
          </div>
          <span class="shrink-0 text-mrc-400 text-lg leading-none mt-0.5">
            {ouvert === g.id ? '−' : '+'}
          </span>
        </button>

        <!-- Contenu dépliable -->
        {#if ouvert === g.id}
          <div class="px-5 pb-5 border-t border-mrc-50">

            {#if g.question}
              <div class="mt-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-mrc-400 mb-1.5">Question structurante</p>
                <p class="text-sm text-mrc-700 italic">{g.question}</p>
              </div>
            {/if}

            {#if g.apport}
              <div class="mt-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-mrc-400 mb-1.5">Apport au MRC</p>
                <p class="text-sm text-mrc-700 whitespace-pre-line leading-relaxed">{g.apport}</p>
              </div>
            {/if}

            {#if g.tensions}
              <div class="mt-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-mrc-400 mb-1.5">Tensions avec d'autres grammaires</p>
                <p class="text-sm text-mrc-600">{g.tensions}</p>
              </div>
            {/if}

            {#if g.signal}
              <div class="mt-4">
                <p class="text-xs font-semibold uppercase tracking-wide text-mrc-400 mb-1.5">Signaux associés</p>
                <p class="text-xs font-mono text-mrc-500 bg-mrc-50 rounded px-3 py-2">{g.signal}</p>
              </div>
            {/if}

            {#if g.statut === 'fiche en préparation' || g.statut === 'en cours'}
              <p class="mt-4 text-xs text-mrc-400 italic">
                Note théorique complète disponible dans le corpus MRC interne — vulgarisation site-vitrine à venir.
              </p>
            {/if}

            {#if g.lien}
              <a href={g.lien} class="mt-4 inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-800 transition hover:border-amber-400">
                📋 {g.lienLabel}
              </a>
            {/if}

            <!-- Lien "plus de contenu" -->
            <div class="mt-5 pt-4 border-t border-mrc-50">
              {#if codesAvecNote.has(g.code)}
                <button
                  class="text-sm text-mrc-600 hover:text-mrc-800 underline underline-offset-2 transition-colors"
                  on:click={(e) => ouvrirFormulaire(g.id, e)}
                >
                  {formulaireOuvert === g.id ? 'Fermer' : 'Plus de contenu sur cette fiche →'}
                </button>

                {#if formulaireOuvert === g.id}
                  <div class="mt-3 rounded-lg border border-mrc-100 bg-mrc-50 px-4 py-4">
                    <p class="text-sm text-mrc-700 mb-3">
                      Recevoir la note de vulgarisation complète de <strong>{g.nom}</strong> par email.
                    </p>

                    {#if envoi === 'ok'}
                      <p class="text-sm text-emerald-700 font-medium">
                        ✓ Note envoyée à {dernierEnvoi}.
                      </p>
                    {:else}
                      <form
                        class="flex flex-col sm:flex-row gap-2"
                        on:submit|preventDefault={() => envoyerNote(g.code)}
                      >
                        <input
                          type="email"
                          bind:value={emailInput}
                          placeholder="votre@email.fr"
                          required
                          class="flex-1 rounded-md border border-mrc-200 bg-white px-3 py-2 text-sm text-mrc-900 placeholder-mrc-400 focus:outline-none focus:ring-2 focus:ring-mrc-300"
                        />
                        <button
                          type="submit"
                          disabled={envoi === 'sending'}
                          class="shrink-0 rounded-md bg-mrc-600 px-4 py-2 text-sm font-medium text-white hover:bg-mrc-700 disabled:opacity-60 transition-colors"
                        >
                          {envoi === 'sending' ? 'Envoi…' : 'Envoyer'}
                        </button>
                      </form>

                      {#if envoi === 'error'}
                        <p class="mt-2 text-xs text-red-600">{erreurEnvoi}</p>
                      {/if}
                    {/if}
                  </div>
                {/if}

              {:else}
                <button
                  class="text-sm text-mrc-400 cursor-default"
                  disabled
                  title="Note de vulgarisation en préparation"
                >
                  Plus de contenu sur cette fiche — note de vulgarisation à venir
                </button>
              {/if}
            </div>

          </div>
        {/if}

      </div>
    {/each}
  </div>

  <!-- Note épistémique -->
  <div class="mt-10 rounded-lg border border-mrc-100 bg-mrc-50 px-5 py-4 text-sm text-mrc-600">
    <p class="font-medium text-mrc-800 mb-1">Régime de vérifiabilité-cohérence</p>
    <p>
      Les fiches disponibles sont issues des Notes Théoriques (NT) du MRC, rédigées en régime
      vérifiabilité-cohérence : tout énoncé est ancré dans une source déclarée ou marqué
      [PLAUSIBLE, NON VÉRIFIÉ]. Les fiches en préparation résument le contenu des NT sans
      encore avoir fait l'objet d'une note de vulgarisation formelle.
    </p>
  </div>

  <div class="mt-6 text-sm text-mrc-500">
    <a href="/documentation" class="text-mrc-600 hover:underline">Télécharger la bibliographie BibTeX →</a>
  </div>

</div>
