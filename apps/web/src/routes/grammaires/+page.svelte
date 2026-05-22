<!-- Sprint 4 — placeholder page grammaires -->
<svelte:head>
  <title>Grammaires & cadres théoriques — Registres de communalité</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-16">

  <div class="mb-8">
    <div class="mb-2 text-sm font-medium text-mrc-500">Comprendre · Académique</div>
    <h1 class="text-3xl font-bold text-mrc-900">Grammaires & cadres théoriques</h1>
    <p class="mt-3 text-mrc-600">
      Les neuf grammaires du MRC v5.3 — chacune avec ses auteurs fondateurs, ses références, son articulation
      dans l'architecture et ses tensions avec les autres grammaires.
    </p>
  </div>

  <div class="mb-8 flex items-center gap-3 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
    <span class="text-blue-600">🚧</span>
    <p class="text-sm text-blue-800">
      L'explorateur de grammaires est en construction (Sprint 4). Fiches disponibles prochainement.
    </p>
  </div>

  <!-- Liste anticipée des grammaires -->
  <div class="grid gap-3 md:grid-cols-2">
    {#each [
      { nom: 'Sociologie de la traduction (ANT)', auteurs: 'Latour, Callon, Law', statut: 'stable' },
      { nom: 'Critique de la comptabilité capitaliste', auteurs: 'Chiapello, Ezzamel', statut: 'stable' },
      { nom: 'Écologie scientifique & bioéconomie', auteurs: 'Georgescu-Roegen, Daly', statut: 'stable' },
      { nom: 'Éthique de la responsabilité', auteurs: 'Jonas', statut: 'stable' },
      { nom: 'Care féministe', auteurs: 'Tronto, Held, Gilligan', statut: 'stable' },
      { nom: 'Communs d\'Ostrom', auteurs: 'Ostrom, Bollier', statut: 'stable' },
      { nom: 'Économisation (Callon)', auteurs: 'Callon, MacKenzie', statut: 'en consolidation' },
      { nom: 'Capabilités', auteurs: 'Sen, Nussbaum', statut: 'en consolidation' },
      { nom: 'Grammaire affective', auteurs: 'MRC v5.4 interne', statut: 'en cours' }
    ] as g}
      <div class="flex items-start gap-3 rounded-lg border border-mrc-100 bg-white p-4">
        <div class="flex-1">
          <p class="font-medium text-mrc-800 text-sm">{g.nom}</p>
          <p class="text-xs text-mrc-500 mt-0.5">{g.auteurs}</p>
        </div>
        <span class="shrink-0 rounded-full px-2 py-0.5 text-xs font-medium
          {g.statut === 'stable' ? 'bg-emerald-50 text-emerald-700' :
           g.statut === 'en consolidation' ? 'bg-amber-50 text-amber-700' :
           'bg-slate-100 text-slate-500'}">
          {g.statut}
        </span>
      </div>
    {/each}
  </div>

  <div class="mt-8 text-sm text-mrc-500">
    <a href="/documentation" class="text-mrc-600 hover:underline">Télécharger la bibliographie BibTeX →</a>
  </div>

</div>
