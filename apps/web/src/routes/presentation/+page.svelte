<script>
  const sections = [
    {
      id: 'registre',
      titre: 'Qu\'est-ce qu\'un registre de communalité ?',
      texte: `Ni base de données, ni outil de mesure : une mémoire structurée des interactions qui font tenir un collectif.

Le registre de communalité enregistre ce qui s'est passé entre des acteurs, dans un régime donné, selon une grammaire d'interprétation. Il ne produit pas de vérité — il produit de la traçabilité, de la réflexivité, et les conditions d'une délibération.

Un registre MRC opère en régime de vérifiabilité-cohérence : chaque inscription est soit ancrée dans une source déclarée, soit marquée explicitement comme inférence ou [PLAUSIBLE, NON VÉRIFIÉ]. Ce régime s'oppose au régime de plausibilité, où des énoncés sont produits parce qu'ils semblent vrais — sans que leur origine soit identifiable ni leur réfutabilité établie.`
    },
    {
      id: 'objets',
      titre: 'Les quatre objets fondamentaux',
      items: [
        { nom: 'Acteurs', desc: 'Humains, organisationnels, non-humains (vivants, écosystèmes), instrumentaux (dispositifs techniques). Tout acteur est analysé comme relation asymétrique entre ce qu\'il mobilise (débit) et ce qu\'il contracte en retour (crédit) — règle R1 / DÉBIT–CRÉDIT.' },
        { nom: 'Interactions', desc: 'Événements entre acteurs, datés, localisés, porteurs d\'obligations mutuelles. Chaque interaction instancie R1 : si une entité est mobilisée, quelle obligation symétrique est contractée en retour ?' },
        { nom: 'Écritures', desc: 'Propositions structurées issues d\'une interaction — avec auteur, sens, statut de validation. Le terme "écriture" est réservé aux propositions validées par des humains via délibération. Un LLM produit des brouillons, jamais des écritures.' },
        { nom: 'Signaux', desc: 'Indicateurs détectés dans le corpus, non validés, porteurs d\'hypothèses à vérifier. Les signaux ouvrent une enquête — ils ne la concluent pas.' }
      ]
    },
    {
      id: 'architecture',
      titre: 'L\'architecture du MRC en quatre couches',
      texte: `Le MRC s'organise selon quatre couches emboîtées :

Couche 0 — Primitives : les catégories de base (acteurs, interactions, écritures), la règle R1/DÉBIT-CRÉDIT, le régime d'analyse (booléen, flou, métrique). Ces primitives doivent être déclarées et stables — tout changement de sens en cours d'analyse est signalé [CHANGEMENT DE BASE NON TRACÉ].

Couche 1 — Règles de couplage : la dualité métabolique / attentionnelle, les règles de commutativité entre régimes. Tout engagement fort doit avoir une contrepartie réfutable — sans quoi : [ENGAGEMENT SANS SYMÉTRIE].

Couche 2 — Modes d'application : quatre postures d'analyse (Travail F1, Milieu F2, Sémantique F3, Existentiel F4), chacune avec ses signaux prioritaires et ses fiches opérationnelles.

Couche 3 — Grammaires transversales : dix lentilles théoriques (G1 à G10) mobilisées pour interpréter ce que les couches 0–2 ont détecté.

Cette architecture garantit que chaque sortie peut être retracée jusqu'aux hypothèses interprétatives qui l'ont produite.`
    },
    {
      id: 'grammaires',
      titre: 'Les dix grammaires transversales',
      texte: `Les grammaires sont les cadres théoriques que le MRC mobilise en Couche 3 pour donner sens à ce qu'un registre révèle. Chacune pose une question structurante distincte :

G1 Évolutivité (Boyer, Tinbergen) — pourquoi des règles rationnelles échouent-elles à changer les comportements ?
G2 Responsabilité (Jonas, Gosseries) — comment inscrire des obligations face à des irréversibilités ?
G3 Soin (Tronto, Federici) — comment rendre visible le travail de care que les registres conventionnels effacent ?
G4 Performativité (Haraway) — comment les instruments de description produisent-ils ce qu'ils prétendent décrire ?
G5 Méséologie (Berque) — comment inscrire la relation entre un collectif et son milieu ?
G6 Communalité (Ostrom) — quels faisceaux de droits permettent de gouverner une ressource commune ?
G7 Justice (Nussbaum, Fricker) — comment inscrire une injustice sans réduire la justice à un calcul ?
G8 Mimétique (Girard) — comment détecter les dynamiques de rivalité et de bouc-émissaire dans un collectif ?
G9 Affectif — comment tracer les états affectifs collectifs comme variables d'état du registre ?
G10 Démocratie épistémique — comment concevoir un registre qui intègre des savoirs hétérogènes ?

Les grammaires ne s'excluent pas — elles s'articulent et entrent en tension productive. Ces tensions sont documentées, jamais lissées.`,
      cta: { label: 'Explorer les fiches de grammaires →', href: '/grammaires' }
    },
    {
      id: 'usages',
      titre: 'Les trois usages du MRC',
      items: [
        { nom: 'Usage 1 — Démonstrateur conversationnel', desc: 'Un LLM applique la grille MRC à un document ou répond à des questions sur le MRC en trois modes : Découverte (questions sur le MRC et ses grammaires), Analyse (esquisse vulgarisée des acteurs et tensions), Expert (journal MRC si le document le permet). Toutes les sorties sont des brouillons interprétatifs, non opposables.' },
        { nom: 'Usage 2 — Registre d\'enquête contrôlé', desc: 'Un collectif construit progressivement un registre via une chaîne agents + humains, avec validation délibérative explicite à chaque étape. Les phases C-ENQUETE-V5 structurent la progression : PROBLÈME → ENQUÊTE → RÉVISION_CONCEPTUELLE → DÉLIBÉRATION → CONVENTION → MISE_EN_ŒUVRE.' },
        { nom: 'Usage 3 — Infrastructure organisationnelle ou notariée', desc: 'Plusieurs acteurs tiennent des registres symétriques interopérables — y compris des acteurs non-humains. Le registre est alors opposable : les écritures sont validées, les identifiants sont persistants, les obligations sont traçables.' }
      ]
    },
    {
      id: 'refus',
      titre: 'Ce que le MRC refuse',
      items: [
        { nom: 'Non-validation autonome (R-INCAPACITE-LLM-VALIDER)', desc: 'Un LLM ne peut pas valider une écriture MRC. La validation est toujours humaine et délibérative. Ce principe n\'est pas une précaution rhétorique — c\'est une contrainte architecturale du registre.' },
        { nom: 'Confusion brouillon / écriture', desc: 'Les sorties LLM sont des brouillons. Le terme "écriture" est réservé aux propositions validées collectivement. L\'utiliser pour des sorties LLM est une violation du régime de vérifiabilité-cohérence.' },
        { nom: 'Disparition des sources', desc: 'Toute inscription doit être liée à une source traçable. Un énoncé sans source déclarée est marqué [PLAUSIBLE, NON VÉRIFIÉ] — jamais présenté comme établi.' },
        { nom: 'Données personnelles non sécurisées', desc: 'L\'usage 1 public ne traite pas de données personnelles non anonymisées. Le démonstrateur détecte automatiquement les données identifiantes et déclenche une alerte.' }
      ]
    }
  ];
</script>

<svelte:head>
  <title>Présentation du MRC — Registres de communalité</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-16">

  <!-- En-tête -->
  <div class="mb-12">
    <div class="mb-2 text-sm font-medium text-mrc-500">Comprendre</div>
    <h1 class="text-3xl font-bold text-mrc-900">Présentation du MRC</h1>
    <p class="mt-3 text-lg text-mrc-600">
      Le Modèle de Registres de Communalité — une introduction rigoureuse et accessible aux fondements,
      à l'architecture et aux usages du MRC v5.x.
    </p>
  </div>

  <!-- Navigation interne -->
  <nav class="mb-12 flex flex-wrap gap-2 text-sm" aria-label="Sections">
    {#each sections as s}
      <a href="#{s.id}" class="rounded-full border border-mrc-100 bg-white px-3 py-1 text-mrc-600 hover:border-mrc-300 hover:text-mrc-900 transition-colors">
        {s.id === 'registre' ? 'Registre' :
         s.id === 'objets' ? 'Quatre objets' :
         s.id === 'architecture' ? 'Architecture' :
         s.id === 'grammaires' ? 'Grammaires' :
         s.id === 'usages' ? 'Trois usages' :
         'Ce que le MRC refuse'}
      </a>
    {/each}
  </nav>

  <!-- Sections -->
  {#each sections as section}
    <section id={section.id} class="mb-14">
      <h2 class="mb-4 text-xl font-semibold text-mrc-800 border-b border-mrc-100 pb-2">
        {section.titre}
      </h2>

      {#if section.texte}
        <div class="text-mrc-700 leading-relaxed whitespace-pre-line">{section.texte}</div>
      {/if}

      {#if section.cta}
        <a href={section.cta.href} class="mt-4 inline-block text-sm font-medium text-mrc-600 hover:text-mrc-900">
          {section.cta.label}
        </a>
      {/if}

      {#if section.items}
        <dl class="mt-4 space-y-4">
          {#each section.items as item}
            <div class="rounded-lg bg-mrc-50 p-4">
              <dt class="font-semibold text-mrc-800">{item.nom}</dt>
              <dd class="mt-1 text-sm text-mrc-600">{item.desc}</dd>
            </div>
          {/each}
        </dl>
      {/if}
    </section>
  {/each}

  <!-- CTA vers le démonstrateur -->
  <div class="rounded-xl border border-mrc-200 bg-mrc-50 p-6 text-center">
    <p class="mb-2 font-medium text-mrc-800">Prêt à aller plus loin ?</p>
    <p class="mb-4 text-sm text-mrc-600">Explorez chaque objet pas à pas, ou éprouvez le MRC sur un document réel.</p>
    <div class="flex flex-wrap justify-center gap-3">
      <a href="/pedagogie" class="rounded-lg border border-mrc-300 bg-white px-5 py-2.5 text-sm font-medium text-mrc-700 hover:bg-mrc-100 transition-colors">
        Lire pas à pas →
      </a>
      <a href="/usage-1" class="rounded-lg bg-mrc-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-mrc-800 transition-colors">
        Accéder au démonstrateur →
      </a>
    </div>
  </div>

</div>
