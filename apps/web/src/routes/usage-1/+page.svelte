<!-- Sprint 2 — placeholder du démonstrateur conversationnel -->
<svelte:head>
  <title>Démonstrateur Usage 1 — Registres de communalité</title>
</svelte:head>

<div class="mx-auto max-w-5xl px-4 py-16">

  <div class="mb-8">
    <div class="mb-2 text-sm font-medium text-mrc-500">Expérimenter · Usage 1</div>
    <h1 class="text-3xl font-bold text-mrc-900">Démonstrateur conversationnel</h1>
    <p class="mt-3 text-mrc-600">
      Interrogez un document à travers la grille MRC. L'agent produit une analyse structurée
      — toujours marquée <span class="font-medium text-red-600">brouillon interprétatif, non opposable</span>.
    </p>
  </div>

  <!-- Bandeau statut -->
  <div class="mb-8 flex items-center gap-3 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
    <span class="text-amber-600">🚧</span>
    <p class="text-sm text-amber-800">
      Le démonstrateur est en construction (Sprint 2). Cette page sera opérationnelle prochainement.
    </p>
  </div>

  <!-- Aperçu de l'interface à venir -->
  <div class="grid gap-4 md:grid-cols-3 opacity-40 pointer-events-none select-none">

    <!-- Colonne 1 : Préparer la session -->
    <div class="rounded-xl border border-mrc-200 bg-white p-5">
      <h3 class="mb-4 text-sm font-semibold text-mrc-700">Préparer la session</h3>
      <div class="mb-4">
        <p class="mb-2 text-xs font-medium text-mrc-600">Mode de réponse</p>
        <div class="space-y-2">
          {#each ['Vulgarisation (défaut)', 'Architecture mobilisée', 'Cadres théoriques'] as mode, i}
            <label class="flex items-center gap-2 text-xs text-mrc-600">
              <input type="radio" name="mode" checked={i === 0} class="accent-mrc-600" />
              {mode}
            </label>
          {/each}
        </div>
      </div>
      <div class="rounded border-2 border-dashed border-mrc-200 p-4 text-center text-xs text-mrc-400">
        Déposer un document (PDF, TXT, MD) · max 5 Mo · public ou anonymisé
      </div>
    </div>

    <!-- Colonne 2 : Conversation -->
    <div class="rounded-xl border border-mrc-200 bg-white p-5">
      <h3 class="mb-4 text-sm font-semibold text-mrc-700">Conversation</h3>
      <div class="mb-3 rounded bg-mrc-50 p-3 text-xs">
        <span class="mrc-status-badge mrc-status-badge--non-valide mb-2 inline-flex">brouillon non opposable</span>
        <p class="text-mrc-600">L'agent répondra ici...</p>
      </div>
      <input type="text" placeholder="Posez une question sur le document..." class="w-full rounded border border-mrc-200 px-3 py-2 text-xs" disabled />
    </div>

    <!-- Colonne 3 : Journal MRC -->
    <div class="rounded-xl border border-mrc-200 bg-white p-5">
      <h3 class="mb-4 text-sm font-semibold text-mrc-700">Journal MRC en construction</h3>
      <p class="text-xs text-mrc-400">Les propositions extraites apparaîtront ici — acteurs, interactions, signaux, écritures.</p>
    </div>

  </div>

</div>
