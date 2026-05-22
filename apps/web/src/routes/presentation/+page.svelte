<script>
  const sections = [
    {
      id: 'registre',
      titre: 'Qu\'est-ce qu\'un registre de communalité ?',
      texte: `Ni base de données, ni outil de mesure : une mémoire structurée des interactions qui font tenir un collectif.
Le registre de communalité enregistre ce qui s'est passé entre des acteurs, dans un régime donné, selon une grammaire d'interprétation.
Il ne produit pas de vérité — il produit de la traçabilité, de la réflexivité, et les conditions d'une délibération.`
    },
    {
      id: 'objets',
      titre: 'Les quatre objets fondamentaux',
      items: [
        { nom: 'Acteurs', desc: 'Humains, organisationnels, non-humains (vivants, écosystèmes), instrumentaux (dispositifs techniques).' },
        { nom: 'Interactions', desc: 'Événements entre acteurs, datés, localisés, porteurs d\'obligations mutuelles.' },
        { nom: 'Écritures', desc: 'Propositions structurées issues d\'une interaction — avec auteur, sens, statut de validation.' },
        { nom: 'Signaux', desc: 'Indicateurs détectés dans le corpus, non validés, porteurs d\'hypothèses à vérifier.' }
      ]
    },
    {
      id: 'architecture',
      titre: 'L\'architecture du MRC',
      texte: `Le MRC s'organise selon cinq niveaux emboîtés : la primitive (interaction élémentaire), le signal (indicateur détecté),
le régime (ensemble de règles applicables), le mode (posture d'analyse), et la grammaire (cadre théorique mobilisé).
Cette architecture garantit que chaque sortie peut être retracée jusqu\'aux hypothèses interprétatives qui l\'ont produite.`
    },
    {
      id: 'usages',
      titre: 'Les trois usages du MRC',
      items: [
        { nom: 'Usage 1 — Grille documentaire heuristique', desc: 'Un LLM applique la grille MRC à un document pour en extraire des propositions structurées. Toutes les sorties sont non validées.' },
        { nom: 'Usage 2 — Registre d\'enquête contrôlé', desc: 'Un collectif construit progressivement un registre via une chaîne agents + humains, avec validation délibérative explicite.' },
        { nom: 'Usage 3 — Infrastructure organisationnelle ou notariée', desc: 'Plusieurs acteurs tiennent des registres symétriques interopérables, y compris des acteurs non-humains.' }
      ]
    },
    {
      id: 'refus',
      titre: 'Ce que le MRC refuse',
      items: [
        { nom: 'Non-validation autonome', desc: 'Un LLM ne peut pas valider une écriture MRC. La validation est toujours humaine et délibérative.' },
        { nom: 'Confusion analyse / écriture', desc: 'Les sorties LLM sont des brouillons. Le terme "écriture" est réservé aux propositions validées.' },
        { nom: 'Disparition des sources', desc: 'Toute inscription doit être liée à un verbatim_uri traçable.' },
        { nom: 'Données personnelles non sécurisées', desc: 'L\'usage 1 public ne traite pas de données personnelles non anonymisées.' }
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
      Le Modèle de Registres de Communalité, version 5.4 — une introduction rigoureuse mais accessible.
    </p>
  </div>

  <!-- Sections -->
  {#each sections as section}
    <section id={section.id} class="mb-14">
      <h2 class="mb-4 text-xl font-semibold text-mrc-800 border-b border-mrc-100 pb-2">
        {section.titre}
      </h2>

      {#if section.texte}
        <div class="text-mrc-700 leading-relaxed whitespace-pre-line">{section.texte}</div>
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
    <p class="mb-4 text-mrc-700">Prêt à éprouver le MRC sur un document réel ?</p>
    <a href="/usage-1" class="rounded-lg bg-mrc-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-mrc-800 transition-colors">
      Accéder au démonstrateur →
    </a>
  </div>

</div>
