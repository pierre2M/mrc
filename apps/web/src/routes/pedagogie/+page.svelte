<script lang="ts">
  import {
    objets,
    objetsById,
    objetsDeCouche,
    relatedSet,
    layerMeta,
    branchesCouche2,
    type Layer,
    type MrcObjet
  } from '$lib/pedago-data';

  const couleurs: Record<Layer, string> = {
    0: 'sky',
    1: 'teal',
    2: 'amber',
    3: 'fuchsia'
  };

  // Classes Tailwind statiques par couche (le compilateur doit les voir en clair).
  const accent: Record<Layer, { dot: string; tag: string; ttl: string; chip: string }> = {
    0: { dot: 'bg-sky-500', tag: 'bg-sky-100 text-sky-800', ttl: 'text-sky-700', chip: 'bg-sky-600' },
    1: { dot: 'bg-teal-500', tag: 'bg-teal-100 text-teal-800', ttl: 'text-teal-700', chip: 'bg-teal-600' },
    2: { dot: 'bg-amber-500', tag: 'bg-amber-100 text-amber-800', ttl: 'text-amber-700', chip: 'bg-amber-600' },
    3: { dot: 'bg-fuchsia-500', tag: 'bg-fuchsia-100 text-fuchsia-800', ttl: 'text-fuchsia-700', chip: 'bg-fuchsia-600' }
  };

  let selectionId: string | null = null;
  let related: Set<string> = new Set();
  let modalId: string | null = null;

  $: selection = selectionId ? objetsById[selectionId] : null;
  $: modalObj = modalId ? objetsById[modalId] : null;

  function select(id: string) {
    selectionId = id;
    related = relatedSet(id);
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setTimeout(() => {
        document.getElementById('detail-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 50);
    }
  }

  function scrollBackToCard(id: string) {
    document.getElementById(`card-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function cardClass(id: string): string {
    if (!selectionId) return '';
    if (id === selectionId) return 'ring-2 ring-mrc-700 ring-offset-1';
    if (related.has(id)) return 'ring-2 ring-emerald-500';
    return 'opacity-40';
  }

  function openEx(id: string) {
    modalId = id;
  }
  function closeEx() {
    modalId = null;
  }

  function onKey(e: KeyboardEvent) {
    if (e.key === 'Escape') closeEx();
  }

  const layers: Layer[] = [0, 1, 2, 3];
</script>

<svelte:head>
  <title>Comprendre, pas à pas — MRC 5.x</title>
  <meta
    name="description"
    content="Lecture en langage clair du Modèle de Registres de Communalité (MRC 5.x) : à quoi sert chaque objet, comment il s'articule aux autres, et des exemples concrets."
  />
</svelte:head>

<svelte:window on:keydown={onKey} />

<div class="mx-auto max-w-6xl px-4 py-10">
  <!-- En-tête -->
  <header class="mb-8">
    <p class="text-xs font-semibold uppercase tracking-wide text-mrc-500">Pédagogie · MRC 5.x</p>
    <h1 class="mt-1 text-3xl font-bold text-mrc-900">Comprendre, pas à pas</h1>
    <p class="mt-3 max-w-3xl text-mrc-600">
      Une lecture en langage clair du Modèle de Registres de Communalité : à quoi sert chaque objet,
      comment il s'articule aux autres, et — pour chacun — un bouton « Exemples concrets » qui montre
      comment il traite une situation réelle. Cliquez sur n'importe quelle carte.
    </p>
    <p class="mt-3 inline-block rounded-full border border-mrc-200 px-3 py-1 text-xs text-mrc-500">
      Les exemples marqués <b class="font-semibold">[ILLUSTRATIF]</b> sont pédagogiques ; ceux notés
      <b class="font-semibold">[K3]</b> s'appuient sur le cas chiffré « bassins versants » (Lac Togo,
      Niayes, Drôme — GRET).
    </p>
  </header>

  <!-- Légende -->
  <div class="mb-6 flex flex-wrap gap-x-6 gap-y-2 text-xs text-mrc-600">
    <span class="flex items-center gap-2"><i class="h-3 w-3 rounded-sm {accent[0].dot}"></i>Couche 0 — Les briques de base</span>
    <span class="flex items-center gap-2"><i class="h-3 w-3 rounded-sm {accent[1].dot}"></i>Couche 1 — Les règles du jeu</span>
    <span class="flex items-center gap-2"><i class="h-3 w-3 rounded-sm {accent[2].dot}"></i>Couche 2 — Les modes d'emploi (fiches)</span>
    <span class="flex items-center gap-2"><i class="h-3 w-3 rounded-sm {accent[3].dot}"></i>Couche 3 — Les manières de lire (grammaires)</span>
    <span class="flex items-center gap-2"><i class="h-3 w-3 rounded-sm bg-emerald-500"></i>objet relié à la sélection</span>
  </div>

  <div class="grid gap-6 lg:grid-cols-[1fr_400px]">
    <!-- Scène : les 4 couches -->
    <div class="space-y-5">
      {#each layers as L}
        {@const m = layerMeta[L]}
        <section class="overflow-hidden rounded-2xl border border-mrc-100 bg-white shadow-sm">
          <div class="flex flex-wrap items-baseline gap-3 border-b border-mrc-100 px-4 py-3">
            <span class="rounded-md px-2 py-0.5 text-xs font-bold {accent[L].tag}">{m.tag}</span>
            <h2 class="text-sm font-semibold text-mrc-900">{m.title}</h2>
            <span class="ml-auto text-xs italic text-mrc-500">{m.q}</span>
          </div>

          {#if L === 2}
            <div class="flex flex-wrap gap-3 p-4">
              {#each branchesCouche2 as branche}
                <div class="min-w-[250px] flex-1 rounded-xl border border-dashed border-mrc-200 p-3">
                  <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-mrc-500">{branche.title}</h3>
                  <div class="flex flex-wrap gap-2">
                    {#each branche.ids as id}
                      {@const o = objetsById[id]}
                      <button
                        id="card-{id}"
                        type="button"
                        on:click={() => select(id)}
                        class="w-52 rounded-xl border border-mrc-100 bg-slate-50 p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md {cardClass(id)}"
                      >
                        <div class="flex items-center gap-2 text-sm font-semibold {accent[o.layer].ttl}">
                          <span>{o.ico}</span><span>{o.name}</span>
                        </div>
                        <div class="mt-1 text-xs text-mrc-500">{o.what.length > 70 ? o.what.slice(0, 68) + '…' : o.what}</div>
                      </button>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          {:else}
            <div class="flex flex-wrap gap-3 p-4">
              {#each objetsDeCouche(L) as o}
                <button
                  id="card-{o.id}"
                  type="button"
                  on:click={() => select(o.id)}
                  class="w-52 rounded-xl border border-mrc-100 bg-slate-50 p-3 text-left transition hover:-translate-y-0.5 hover:shadow-md {cardClass(o.id)}"
                >
                  <div class="flex items-center gap-2 text-sm font-semibold {accent[o.layer].ttl}">
                    <span>{o.ico}</span><span>{o.name}</span>
                  </div>
                  <div class="mt-1 text-xs text-mrc-500">{o.what.length > 70 ? o.what.slice(0, 68) + '…' : o.what}</div>
                </button>
              {/each}
            </div>
          {/if}
        </section>
      {/each}
    </div>

    <!-- Panneau latéral -->
    <aside id="detail-panel" class="lg:sticky lg:top-24 lg:self-start">
      <div class="rounded-2xl border border-mrc-100 bg-white p-5 shadow-sm">
        {#if !selection}
          <p class="py-12 text-center text-sm leading-relaxed text-mrc-400">
            Cliquez sur n'importe quelle carte de l'architecture.<br />
            Vous verrez en clair <b>ce qu'elle fait</b>, <b>comment elle se relie</b> aux autres objets,
            et un bouton pour ouvrir <b>1 à 3 exemples concrets</b>.
          </p>
        {:else}
          {@const m = layerMeta[selection.layer]}
          <button
            type="button"
            on:click={() => scrollBackToCard(selection.id)}
            class="lg:hidden mb-3 flex items-center gap-1.5 text-xs text-mrc-500 hover:text-mrc-800 transition-colors"
          >
            ↑ Revenir à la carte
          </button>
          <p class="text-xs font-semibold uppercase tracking-wide text-mrc-500">{m.title}</p>
          <h3 class="mt-1 flex items-center gap-2 text-xl font-bold text-mrc-900">
            <span>{selection.ico}</span><span>{selection.name}</span>
          </h3>
          <p class="mt-0.5 font-mono text-xs text-mrc-400">{selection.code}</p>

          <span class="mt-4 inline-block rounded-md px-2 py-0.5 text-xs font-bold text-white {accent[selection.layer].chip}">Ce que ça fait</span>
          <p class="mt-2 text-mrc-800">{selection.what}</p>
          <p class="mt-2 text-sm text-mrc-600">{selection.how}</p>

          {#if selection.rel.length}
            <div class="mt-5">
              <h4 class="mb-2 text-xs font-semibold uppercase tracking-wide text-mrc-500">
                Comment ça se relie aux autres objets
              </h4>
              <ul class="space-y-2">
                {#each selection.rel as r}
                  <li class="relative pl-4 text-sm text-mrc-700 before:absolute before:left-0 before:text-emerald-600 before:content-['→']">
                    <button
                      type="button"
                      on:click={() => select(r.to)}
                      class="border-b border-dotted border-mrc-300 font-medium text-mrc-900 hover:text-emerald-600"
                    >{objetsById[r.to]?.name ?? r.to}</button>
                    — {r.text}
                  </li>
                {/each}
              </ul>
            </div>
          {/if}

          {#if selection.ex.length}
            <button
              type="button"
              on:click={() => openEx(selection.id)}
              class="mt-5 inline-flex items-center gap-2 rounded-lg border border-mrc-200 bg-mrc-50 px-4 py-2.5 text-sm font-semibold text-mrc-800 transition hover:border-mrc-400"
            >
              🔍 Voir {selection.ex.length} exemple{selection.ex.length > 1 ? 's' : ''} concret{selection.ex.length > 1 ? 's' : ''}
            </button>
          {/if}
        {/if}
      </div>
    </aside>
  </div>

  <!-- Avertissement de régime -->
  <footer class="mt-10 rounded-xl border border-mrc-100 bg-slate-50 p-4 text-xs leading-relaxed text-mrc-500">
    <b class="text-mrc-700">[LACUNES ET LIMITES]</b> Vulgarisation dérivée du set MRC 5.x. Les exemples
    concrets sont des illustrations pédagogiques (régime procédural, non calcul formel) : ils montrent la
    logique de traitement, pas un résultat chiffré certifié. Les exemples [K3] reprennent la structure du
    cas « bassins versants » mais les valeurs précises restent à recouper sur la note K3. Plusieurs sources
    primaires des grammaires récentes sont [PLAUSIBLE, NON VÉRIFIÉ].
  </footer>
</div>

<!-- Modal exemples -->
{#if modalObj}
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-mrc-900/60 p-6 backdrop-blur-sm"
    role="presentation"
    on:click|self={closeEx}
  >
    <div class="max-h-[84vh] w-full max-w-2xl overflow-auto rounded-2xl border border-mrc-100 bg-white shadow-xl">
      <div class="sticky top-0 flex items-start gap-3 border-b border-mrc-100 bg-white px-6 py-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-wide text-mrc-500">{modalObj.ico} {modalObj.name}</p>
          <h3 class="mt-1 text-lg font-bold text-mrc-900">Exemples concrets — comment cet objet traite une situation</h3>
        </div>
        <button type="button" on:click={closeEx} class="ml-auto text-2xl leading-none text-mrc-400 hover:text-mrc-700" aria-label="Fermer">×</button>
      </div>
      <div class="space-y-4 px-6 py-5">
        {#each modalObj.ex as e}
          <div class="rounded-xl border border-mrc-100 bg-slate-50 p-4">
            <div class="flex items-baseline gap-2 font-semibold text-mrc-900">
              <span class="rounded px-1.5 py-0.5 text-xs font-bold text-white {e.k === 'K3' ? 'bg-amber-600' : 'bg-mrc-500'}">{e.k}</span>
              {e.t}
            </div>
            <p class="mt-2 text-sm text-mrc-600">{e.p}</p>
            <p class="mt-2 border-l-2 border-emerald-500 pl-3 text-sm text-mrc-800">
              <b>Traitement par le MRC :</b> {e.r}
            </p>
          </div>
        {/each}
      </div>
    </div>
  </div>
{/if}
