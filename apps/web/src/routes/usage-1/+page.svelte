<script lang="ts">
  import { tick } from 'svelte';
  import MrcStatusBadge from '$lib/components/MrcStatusBadge.svelte';
  import { extractTextFromFile } from '$lib/pdf-extract';

  type Mode = 'vulgarisation' | 'architecture' | 'cadres';

  interface Signal {
    texte: string;
    type: string;
    valide: boolean;
  }

  interface DemoResponse {
    reponse_vulgarisee: string;
    reponse_architecture: string;
    reponse_cadres: string;
    signaux: Signal[];
    alerte_donnees_personnelles: boolean;
  }

  interface Exchange {
    question: string;
    response: DemoResponse;
  }

  const MODES: { id: Mode; label: string; desc: string }[] = [
    { id: 'vulgarisation', label: 'Vulgarisation',          desc: 'Langage accessible, première approche' },
    { id: 'architecture',  label: 'Architecture mobilisée', desc: 'Niveaux et régimes MRC v5.4' },
    { id: 'cadres',        label: 'Cadres théoriques',      desc: 'ANT, STS, commons, diplomatique' }
  ];

  function getResponseText(exchange: Exchange, m: Mode): string {
    if (m === 'architecture') return exchange.response.reponse_architecture;
    if (m === 'cadres')       return exchange.response.reponse_cadres;
    return exchange.response.reponse_vulgarisee;
  }

  function signalColor(type: string): string {
    const map: Record<string, string> = {
      acteur:      'border-blue-200 bg-blue-50 text-blue-800',
      interaction: 'border-purple-200 bg-purple-50 text-purple-800',
      ecriture:    'border-emerald-200 bg-emerald-50 text-emerald-800'
    };
    return map[type] ?? 'border-slate-200 bg-slate-50 text-slate-700';
  }

  function signalLabel(type: string): string {
    const map: Record<string, string> = {
      acteur: 'Acteur', interaction: 'Interaction', ecriture: 'Écriture'
    };
    return map[type] ?? type;
  }

  let mode: Mode = 'vulgarisation';
  let attestation = false;
  let documentText = '';
  let fileName = '';
  let isDragging = false;
  let input = '';
  let exchanges: Exchange[] = [];
  let signals: Signal[] = [];
  let isLoading = false;
  let error: string | null = null;
  let chatContainer: HTMLElement;
  let fileInputEl: HTMLInputElement;

  async function loadFile(file: File) {
    error = null;
    if (file.size > 5 * 1024 * 1024) {
      error = 'Fichier trop volumineux (max 5 Mo).';
      return;
    }
    const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
    if (!['pdf', 'txt', 'md'].includes(ext)) {
      error = 'Format non supporté. Utilisez PDF, TXT ou MD.';
      return;
    }
    try {
      documentText = await extractTextFromFile(file);
      fileName = file.name;
    } catch (err) {
      error = err instanceof Error ? err.message : 'Erreur de lecture du fichier.';
    }
  }

  function onDragOver(e: DragEvent)  { e.preventDefault(); isDragging = true; }
  function onDragLeave()              { isDragging = false; }
  async function onDrop(e: DragEvent) {
    e.preventDefault(); isDragging = false;
    const file = e.dataTransfer?.files[0];
    if (file) await loadFile(file);
  }
  async function onFileInput(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) await loadFile(file);
  }
  function clearDocument() {
    documentText = ''; fileName = '';
    if (fileInputEl) fileInputEl.value = '';
  }

  async function sendMessage() {
    if (!canSend) return;
    const question = input.trim();
    input = '';
    isLoading = true;
    error = null;
    try {
      const res = await fetch('/api/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, document: documentText || undefined })
      });
      const data = await res.json();
      if (!res.ok) { error = data.error ?? `Erreur ${res.status}`; return; }
      exchanges = [...exchanges, { question, response: data as DemoResponse }];
      for (const sig of (data.signaux as Signal[]) ?? []) {
        signals = [...signals, { ...sig, valide: false }];
      }
      await tick();
      scrollToBottom();
    } catch (err) {
      error = err instanceof Error ? err.message : 'Erreur réseau.';
    } finally {
      isLoading = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function toggleSignal(idx: number) {
    signals[idx] = { ...signals[idx], valide: !signals[idx].valide };
    signals = [...signals];
  }

  function scrollToBottom() {
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  function resetSession() {
    exchanges = []; signals = []; documentText = ''; fileName = '';
    input = ''; error = null; attestation = false;
    if (fileInputEl) fileInputEl.value = '';
  }

  $: canSend = attestation && input.trim().length > 0 && !isLoading;
  $: validatedCount = signals.filter(s => s.valide).length;
</script>

<svelte:head>
  <title>Démonstrateur Usage 1 — Registres de communalité</title>
</svelte:head>

<div class="flex h-[calc(100vh-57px)] flex-col">

  <!-- En-tête -->
  <div class="border-b border-mrc-100 bg-white px-6 py-3">
    <div class="mx-auto flex max-w-full items-center justify-between">
      <div>
        <div class="text-xs font-medium text-mrc-500">Expérimenter · Usage 1</div>
        <h1 class="text-lg font-bold text-mrc-900">Démonstrateur conversationnel MRC v5.4</h1>
      </div>
      {#if exchanges.length > 0}
        <button
          on:click={resetSession}
          class="rounded-md border border-mrc-200 px-3 py-1.5 text-xs font-medium text-mrc-600
                 hover:bg-mrc-50 transition-colors focus:outline-none focus:ring-2 focus:ring-mrc-400"
        >
          Nouvelle session
        </button>
      {/if}
    </div>
  </div>

  <!-- Corps : 3 colonnes -->
  <div class="flex flex-1 overflow-hidden">

    <!-- ── Colonne 1 : Préparer ── -->
    <aside
      class="w-64 flex-shrink-0 overflow-y-auto border-r border-mrc-100 bg-white p-4"
      aria-label="Préparer la session"
    >
      <h2 class="mb-4 text-xs font-semibold uppercase tracking-wide text-mrc-500">
        Préparer la session
      </h2>

      <!-- Mode de réponse -->
      <fieldset class="mb-5">
        <legend class="mb-2 text-xs font-medium text-mrc-700">Mode de réponse</legend>
        <div class="space-y-2">
          {#each MODES as m}
            <label
              class="flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition-colors
                     {mode === m.id ? 'border-mrc-400 bg-mrc-50' : 'border-mrc-100 hover:border-mrc-200'}"
            >
              <input
                type="radio"
                name="mode"
                value={m.id}
                bind:group={mode}
                class="mt-0.5 accent-mrc-600"
              />
              <div>
                <div class="text-xs font-medium text-mrc-800">{m.label}</div>
                <div class="text-xs text-mrc-400">{m.desc}</div>
              </div>
            </label>
          {/each}
        </div>
      </fieldset>

      <!-- Zone de dépôt de document -->
      <div class="mb-4">
        <p class="mb-2 text-xs font-medium text-mrc-700">Document à analyser</p>
        {#if fileName}
          <div class="flex items-center gap-2 rounded-lg border border-mrc-200 bg-mrc-50 px-3 py-2">
            <span class="flex-1 truncate text-xs font-medium text-mrc-700" title={fileName}>{fileName}</span>
            <button
              on:click={clearDocument}
              class="flex-shrink-0 text-mrc-400 hover:text-mrc-700 transition-colors
                     focus:outline-none focus:ring-1 focus:ring-mrc-400 rounded"
              aria-label="Supprimer le document"
            >
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        {:else}
          <!-- svelte-ignore a11y-no-static-element-interactions -->
          <div
            role="button"
            tabindex="0"
            on:dragover={onDragOver}
            on:dragleave={onDragLeave}
            on:drop={onDrop}
            on:click={() => fileInputEl?.click()}
            on:keydown={(e) => e.key === 'Enter' && fileInputEl?.click()}
            class="cursor-pointer rounded-lg border-2 border-dashed p-4 text-center transition-colors
                   {isDragging ? 'border-mrc-400 bg-mrc-50' : 'border-mrc-200 hover:border-mrc-300'}"
            aria-label="Zone de dépôt — cliquez ou glissez un fichier PDF, TXT ou MD"
          >
            <svg class="mx-auto mb-1.5 h-5 w-5 text-mrc-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <path d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M16 12l-4-4-4 4M12 8v8"/>
            </svg>
            <p class="text-xs text-mrc-500">Déposer un fichier</p>
            <p class="mt-0.5 text-xs text-mrc-400">PDF · TXT · MD · max 5 Mo</p>
          </div>
          <input
            bind:this={fileInputEl}
            type="file"
            accept=".pdf,.txt,.md,text/plain,text/markdown,application/pdf"
            on:change={onFileInput}
            class="sr-only"
            aria-hidden="true"
            tabindex="-1"
          />
        {/if}
        <p class="mt-1.5 text-xs text-mrc-400">Document public ou anonymisé uniquement</p>
      </div>

      <!-- Attestation -->
      <label class="flex cursor-pointer items-start gap-2.5">
        <input
          type="checkbox"
          bind:checked={attestation}
          class="mt-0.5 h-4 w-4 flex-shrink-0 rounded accent-mrc-600"
        />
        <span class="text-xs leading-snug text-mrc-600">
          J'atteste que ce document est public ou anonymisé — aucune donnée personnelle identifiante
        </span>
      </label>
    </aside>

    <!-- ── Colonne 2 : Conversation ── -->
    <main class="flex flex-1 flex-col overflow-hidden" aria-label="Zone de conversation">

      <!-- Messages -->
      <div
        bind:this={chatContainer}
        class="flex-1 overflow-y-auto px-6 py-4 space-y-5"
        aria-live="polite"
        aria-atomic="false"
      >
        {#if exchanges.length === 0 && !isLoading}
          <div class="flex h-full flex-col items-center justify-center text-center" aria-hidden="true">
            <div class="mb-3 select-none text-5xl text-mrc-200">◈</div>
            <p class="text-sm font-medium text-mrc-600">Interrogez un registre de communalité</p>
            <p class="mt-1 max-w-xs text-xs text-mrc-400">
              Cochez l'attestation à gauche, puis posez une question — avec ou sans document.
            </p>
            <div class="mt-5 max-w-xs space-y-1.5 text-xs text-mrc-400">
              <p class="italic">"Qui sont les acteurs dans ce procès-verbal ?"</p>
              <p class="italic">"Quels régimes d'écriture identifies-tu ?"</p>
              <p class="italic">"Comment ce document s'inscrit-il dans les registres de communalité ?"</p>
            </div>
          </div>
        {/if}

        {#each exchanges as exchange}
          <!-- Question utilisateur -->
          <div class="flex justify-end">
            <div class="max-w-[70%] rounded-xl rounded-tr-sm bg-mrc-700 px-4 py-2.5 text-sm text-white">
              {exchange.question}
            </div>
          </div>

          <!-- Réponse selon mode actif -->
          <div class="flex flex-col gap-2">
            <div class="flex items-center gap-3">
              <MrcStatusBadge statut="non-valide" modele="claude-sonnet" />
              <span class="text-xs text-mrc-400">
                {MODES.find(m => m.id === mode)?.label ?? ''}
              </span>
            </div>
            <div
              class="rounded-xl rounded-tl-sm border border-mrc-100 bg-white px-4 py-3
                     text-sm leading-relaxed text-mrc-800 whitespace-pre-wrap"
            >
              {getResponseText(exchange, mode)}
            </div>
          </div>
        {/each}

        {#if isLoading}
          <div aria-live="assertive">
            <div class="flex items-center gap-2 px-1">
              <span class="inline-flex gap-1" aria-hidden="true">
                <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-mrc-300 [animation-delay:0ms]"></span>
                <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-mrc-300 [animation-delay:150ms]"></span>
                <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-mrc-300 [animation-delay:300ms]"></span>
              </span>
              <span class="text-xs text-mrc-400">Analyse en cours — les 3 modes sont générés simultanément…</span>
            </div>
          </div>
        {/if}

        {#if error}
          <div class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        {/if}
      </div>

      <!-- Zone de saisie -->
      <div class="border-t border-mrc-100 bg-white px-6 py-4">

        <!-- Basculeur de mode rapide -->
        <div class="mb-3 flex items-center gap-2" role="group" aria-label="Mode d'affichage">
          {#each MODES as m}
            <button
              on:click={() => (mode = m.id)}
              class="rounded-full px-3 py-1 text-xs font-medium transition-colors
                     focus:outline-none focus:ring-2 focus:ring-mrc-400
                     {mode === m.id
                       ? 'bg-mrc-700 text-white'
                       : 'border border-mrc-200 text-mrc-600 hover:bg-mrc-50'}"
              aria-pressed={mode === m.id}
            >
              {m.label}
            </button>
          {/each}
          {#if exchanges.length > 0}
            <span class="ml-auto text-xs text-mrc-400">Basculer ne relance pas l'API</span>
          {/if}
        </div>

        <div class="flex items-end gap-3">
          <textarea
            bind:value={input}
            on:keydown={handleKeydown}
            placeholder={attestation
              ? 'Posez une question… (Entrée pour envoyer, Maj+Entrée pour sauter une ligne)'
              : 'Cochez d\'abord l\'attestation pour activer la saisie'}
            rows="2"
            disabled={isLoading || !attestation}
            class="flex-1 resize-none rounded-xl border border-mrc-200 px-4 py-2.5
                   text-sm text-mrc-800 placeholder-mrc-300
                   focus:border-mrc-400 focus:outline-none focus:ring-1 focus:ring-mrc-200
                   disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60
                   transition-colors"
            aria-label="Question"
          ></textarea>
          <button
            on:click={sendMessage}
            disabled={!canSend}
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl
                   bg-mrc-700 text-white transition-colors
                   hover:bg-mrc-800 focus:outline-none focus:ring-2 focus:ring-mrc-400
                   disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Envoyer"
          >
            {#if isLoading}
              <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true"></span>
            {:else}
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/>
              </svg>
            {/if}
          </button>
        </div>

        <p class="mt-2 text-xs text-mrc-400">
          Brouillons interprétatifs · non opposables · MRC v5.4 · Les 3 modes sont générés en un seul appel
        </p>
      </div>
    </main>

    <!-- ── Colonne 3 : Journal MRC ── -->
    <aside
      class="w-72 flex-shrink-0 overflow-y-auto border-l border-mrc-100 bg-white p-4"
      aria-label="Journal MRC"
    >
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-xs font-semibold uppercase tracking-wide text-mrc-500">Journal MRC</h2>
        {#if signals.length > 0}
          <span class="text-xs text-mrc-400">{validatedCount}/{signals.length} validé{validatedCount > 1 ? 's' : ''}</span>
        {/if}
      </div>

      {#if signals.length === 0}
        <p class="text-xs italic leading-relaxed text-mrc-300">
          Les propositions extraites apparaîtront ici — acteurs, interactions, écritures repérés dans le document.
          <br /><br />
          Chaque entrée peut être validée manuellement.
        </p>
      {:else}
        <ul class="space-y-2">
          {#each signals as signal, idx}
            <li
              class="rounded-lg border p-2.5 transition-all
                     {signal.valide ? 'border-emerald-200 bg-emerald-50' : signalColor(signal.type)}"
            >
              <div class="mb-1.5 flex items-center justify-between gap-2">
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-medium
                         {signal.valide ? 'bg-emerald-100 text-emerald-700' : 'bg-white/60 opacity-80'}"
                >
                  {signal.valide ? '✓ Validé' : signalLabel(signal.type)}
                </span>
                <button
                  on:click={() => toggleSignal(idx)}
                  class="rounded p-0.5 opacity-60 hover:opacity-100 transition-opacity
                         focus:outline-none focus:ring-1 focus:ring-current"
                  aria-label="{signal.valide ? 'Invalider' : 'Valider'} : {signal.texte}"
                  aria-pressed={signal.valide}
                >
                  {#if signal.valide}
                    <svg class="h-3.5 w-3.5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5"/>
                    </svg>
                  {:else}
                    <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
                    </svg>
                  {/if}
                </button>
              </div>
              <p class="text-xs leading-snug {signal.valide ? 'text-emerald-800' : ''}">
                {signal.texte}
              </p>
              {#if !signal.valide}
                <p class="mt-1 text-xs opacity-50">Non validé</p>
              {/if}
            </li>
          {/each}
        </ul>

        <div class="mt-4 border-t border-mrc-100 pt-3">
          <p class="text-xs italic text-mrc-400">
            Propositions générées par IA · validation humaine requise avant tout usage
          </p>
        </div>
      {/if}
    </aside>

  </div>
</div>
