<script lang="ts">
  // ──────────────────────────────────────────────────────────────────────────
  // Stepper — barre de paliers réutilisable.
  // Utilisé par /pedagogie (Parcours guidé, navigation libre) et /usage-2
  // (machine d'états à 6 phases, avance contrôlée par une garde).
  // ──────────────────────────────────────────────────────────────────────────
  import { createEventDispatcher } from 'svelte';

  export let steps: { num: number; label: string }[] = [];
  /** Index du palier actif (lié via bind:current). */
  export let current = 0;
  /** Index maximal cliquable. Par défaut tous les paliers sont accessibles. */
  export let maxReached: number = steps.length - 1;
  /** Garde de franchissement « suivant » (contrôlée par le parent). */
  export let canNext = true;
  /** Raison affichée quand « suivant » est bloqué. */
  export let nextReason = '';
  /** Thème d'accent : 'mrc' (pédagogie) ou 'amber' (usage 2). */
  export let accent: 'mrc' | 'amber' = 'mrc';
  /** Afficher les boutons préc./suiv. */
  export let showNav = true;

  const dispatch = createEventDispatcher<{ change: number }>();

  $: activeBorder = accent === 'amber' ? 'border-amber-500 bg-amber-50' : 'border-mrc-500 bg-mrc-50';

  function go(i: number) {
    if (i < 0 || i >= steps.length || i > maxReached) return;
    current = i;
    dispatch('change', i);
  }
  function next() {
    // Le bouton « suivant » est gardé par canNext, pas par maxReached
    // (maxReached ne limite que les clics directs sur la barre).
    if (canNext && current < steps.length - 1) {
      current = current + 1;
      dispatch('change', current);
    }
  }
  function prev() {
    if (current > 0) go(current - 1);
  }
</script>

<div class="space-y-4">
  <!-- Barre de paliers -->
  <div class="flex items-stretch gap-1 overflow-x-auto pb-2">
    {#each steps as s, i}
      <button
        type="button"
        class="flex-1 min-w-[120px] rounded-lg border px-3 py-2 text-left text-xs transition-colors
          {i === current ? activeBorder :
           i < current ? 'border-emerald-200 bg-emerald-50' : 'border-mrc-100 bg-white'}
          {i > maxReached ? 'cursor-not-allowed opacity-50' : 'hover:border-mrc-300'}"
        on:click={() => go(i)}
        disabled={i > maxReached}
      >
        <div class="font-semibold {i <= current ? 'text-mrc-800' : 'text-mrc-400'}">
          {s.num}. {s.label}
        </div>
      </button>
    {/each}
  </div>

  <!-- Contenu du palier courant -->
  <slot current={current} />

  <!-- Navigation -->
  {#if showNav}
    <div class="flex items-center justify-between">
      <button
        type="button"
        class="rounded-lg border border-mrc-200 px-4 py-2 text-sm font-medium text-mrc-700 hover:bg-mrc-50 disabled:opacity-40"
        on:click={prev}
        disabled={current === 0}
      >← Précédent</button>

      <div class="flex items-center gap-3">
        {#if !canNext && current < steps.length - 1 && nextReason}
          <span class="max-w-md text-right text-xs font-medium text-amber-700">{nextReason}</span>
        {/if}
        <button
          type="button"
          class="rounded-lg bg-mrc-700 px-4 py-2 text-sm font-medium text-white hover:bg-mrc-800 disabled:opacity-40"
          on:click={next}
          disabled={!canNext || current === steps.length - 1}
        >Suivant →</button>
      </div>
    </div>
  {/if}
</div>
