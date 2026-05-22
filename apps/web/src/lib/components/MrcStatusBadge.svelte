<!-- Composant réutilisable — bandeau de statut MRC sur toutes les sorties IA -->
<script>
  /** @type {'non-valide' | 'en-cours' | 'valide' | 'brouillon'} */
  export let statut = 'non-valide';

  /** @type {string | undefined} */
  export let grammaire = undefined;

  /** @type {string | undefined} */
  export let modele = undefined;

  const labels = {
    'non-valide': 'Brouillon interprétatif · non opposable',
    'en-cours':   'En discussion · validation en attente',
    'valide':     'Validé par humain',
    'brouillon':  'Proposition non validée'
  };
</script>

<div class="rounded-lg border px-4 py-2.5 text-xs
  {statut === 'non-valide' ? 'border-red-200 bg-red-50' :
   statut === 'en-cours'   ? 'border-amber-200 bg-amber-50' :
   statut === 'valide'     ? 'border-emerald-200 bg-emerald-50' :
                             'border-slate-200 bg-slate-50'}">
  <div class="flex items-center gap-2">
    <span class="h-2 w-2 rounded-full flex-shrink-0
      {statut === 'non-valide' ? 'bg-red-400' :
       statut === 'en-cours'   ? 'bg-amber-400' :
       statut === 'valide'     ? 'bg-emerald-400' :
                                 'bg-slate-400'}">
    </span>
    <span class="font-medium
      {statut === 'non-valide' ? 'text-red-700' :
       statut === 'en-cours'   ? 'text-amber-700' :
       statut === 'valide'     ? 'text-emerald-700' :
                                 'text-slate-600'}">
      Statut : {labels[statut]}
    </span>
  </div>
  {#if grammaire || modele}
    <div class="mt-1 flex gap-4 text-slate-500">
      {#if grammaire}
        <span>Grammaire : <span class="font-medium">{grammaire}</span></span>
      {/if}
      {#if modele}
        <span>Modèle : <span class="font-medium">{modele}</span></span>
      {/if}
    </div>
  {/if}
</div>
