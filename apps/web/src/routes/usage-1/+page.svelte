<script lang="ts">
  import { tick } from 'svelte';
  import MrcStatusBadge from '$lib/components/MrcStatusBadge.svelte';

  type Mode = 'vulgarisation' | 'architecture' | 'cadres';
  type Message = { role: 'user' | 'assistant'; content: string; clean?: string };
  type Journal = { acteurs: string[]; interactions: string[]; signaux: string[]; ecritures: string[] };

  const MODES: { id: Mode; label: string; desc: string }[] = [
    { id: 'vulgarisation', label: 'Vulgarisation', desc: 'Langage accessible, première approche' },
    { id: 'architecture',  label: 'Architecture mobilisée', desc: 'Analyse technique MRC v5.4' },
    { id: 'cadres',        label: 'Cadres théoriques', desc: 'ANT, STS, diplomatique, commons' }
  ];

  const JOURNAL_RE = /\[MRC_JOURNAL\]([\s\S]*?)\[\/MRC_JOURNAL\]/;

  let mode: Mode = 'vulgarisation';
  let context = '';
  let input = '';
  let messages: Message[] = [];
  let journal: Journal = { acteurs: [], interactions: [], signaux: [], ecritures: [] };
  let isLoading = false;
  let chatContainer: HTMLElement;

  function parseResponse(text: string): { clean: string; journalData: Journal | null } {
    const match = text.match(JOURNAL_RE);
    let journalData: Journal | null = null;
    if (match) {
      try { journalData = JSON.parse(match[1].trim()); } catch { /* ignore */ }
    }
    const clean = text.replace(JOURNAL_RE, '').trim();
    return { clean, journalData };
  }

  function mergeJournal(data: Journal | null) {
    if (!data) return;
    for (const key of ['acteurs', 'interactions', 'signaux', 'ecritures'] as const) {
      if (Array.isArray(data[key])) {
        for (const item of data[key]) {
          if (item && !journal[key].includes(item)) journal[key].push(item);
        }
      }
    }
    journal = { ...journal };
  }

  function scrollToBottom() {
    if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
  }

  async function sendMessage() {
    if (!input.trim() || isLoading) return;

    const userContent = input.trim();
    input = '';

    messages = [...messages, { role: 'user', content: userContent }];
    isLoading = true;

    const assistantMsg: Message = { role: 'assistant', content: '', clean: '' };
    messages = [...messages, assistantMsg];
    const idx = messages.length - 1;

    await tick();
    scrollToBottom();

    try {
      // Build history from previous exchanges (exclude the current pair)
      const history = messages
        .slice(0, -2)
        .map(m => ({ role: m.role, content: m.content }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userContent, mode, history, context })
      });

      if (!res.ok || !res.body) throw new Error(`Erreur serveur ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        fullText += decoder.decode(value, { stream: true });
        const { clean } = parseResponse(fullText);
        messages[idx] = { ...messages[idx], content: fullText, clean };
        messages = [...messages];
        await tick();
        scrollToBottom();
      }

      const { clean, journalData } = parseResponse(fullText);
      messages[idx] = { ...messages[idx], content: fullText, clean };
      messages = [...messages];
      mergeJournal(journalData);

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erreur inconnue';
      messages[idx] = { ...messages[idx], content: msg, clean: msg };
      messages = [...messages];
    } finally {
      isLoading = false;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function resetSession() {
    messages = [];
    journal = { acteurs: [], interactions: [], signaux: [], ecritures: [] };
    context = '';
    input = '';
  }

  type JournalKey = keyof Journal;
  const JOURNAL_SECTIONS: { key: JournalKey; label: string }[] = [
    { key: 'acteurs',      label: 'Acteurs' },
    { key: 'interactions', label: 'Interactions' },
    { key: 'signaux',      label: 'Signaux' },
    { key: 'ecritures',    label: 'Écritures' }
  ];

  $: hasJournalContent = Object.values(journal).some(arr => arr.length > 0);
</script>

<svelte:head>
  <title>Démonstrateur Usage 1 — Registres de communalité</title>
</svelte:head>

<div class="flex h-[calc(100vh-57px)] flex-col">

  <!-- En-tête compact -->
  <div class="border-b border-mrc-100 bg-white px-6 py-3">
    <div class="mx-auto flex max-w-7xl items-center justify-between">
      <div>
        <div class="text-xs font-medium text-mrc-500">Expérimenter · Usage 1</div>
        <h1 class="text-lg font-bold text-mrc-900">Démonstrateur conversationnel MRC v5.4</h1>
      </div>
      {#if messages.length > 0}
        <button
          on:click={resetSession}
          class="rounded-md border border-mrc-200 px-3 py-1.5 text-xs text-mrc-600 hover:bg-mrc-50 transition-colors"
        >
          Nouvelle session
        </button>
      {/if}
    </div>
  </div>

  <!-- Corps : 3 colonnes -->
  <div class="flex flex-1 overflow-hidden">

    <!-- Colonne 1 : Préparer -->
    <aside class="w-64 flex-shrink-0 overflow-y-auto border-r border-mrc-100 bg-white p-4">
      <h2 class="mb-4 text-xs font-semibold uppercase tracking-wide text-mrc-500">Préparer la session</h2>

      <!-- Mode de réponse -->
      <div class="mb-5">
        <p class="mb-2 text-xs font-medium text-mrc-700">Mode de réponse</p>
        <div class="space-y-2">
          {#each MODES as m}
            <label class="flex cursor-pointer items-start gap-2.5 rounded-lg border p-2.5 transition-colors
              {mode === m.id ? 'border-mrc-400 bg-mrc-50' : 'border-mrc-100 hover:border-mrc-200'}">
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
      </div>

      <!-- Contexte document -->
      <div>
        <p class="mb-2 text-xs font-medium text-mrc-700">Contexte / extrait de document</p>
        <textarea
          bind:value={context}
          placeholder="Collez ici un extrait de document à analyser (texte, PV, délibération…)"
          class="h-40 w-full resize-none rounded-lg border border-mrc-200 bg-slate-50 p-2.5 text-xs text-mrc-800 placeholder-mrc-300 focus:border-mrc-400 focus:outline-none focus:ring-1 focus:ring-mrc-200"
        ></textarea>
        <p class="mt-1 text-xs text-mrc-400">Document public ou anonymisé uniquement</p>
      </div>
    </aside>

    <!-- Colonne 2 : Conversation -->
    <main class="flex flex-1 flex-col overflow-hidden">

      <!-- Zone de messages -->
      <div bind:this={chatContainer} class="flex-1 overflow-y-auto px-6 py-4 space-y-4">

        {#if messages.length === 0}
          <!-- État vide -->
          <div class="flex h-full flex-col items-center justify-center text-center text-mrc-400">
            <div class="mb-3 text-4xl opacity-30">◈</div>
            <p class="text-sm font-medium text-mrc-600">Posez une question sur un document ou un registre</p>
            <p class="mt-1 text-xs">Collez un extrait dans la colonne de gauche, puis interrogez-le.</p>
            <div class="mt-4 space-y-1.5 text-xs text-mrc-400">
              <p class="italic">"Qui sont les acteurs de ce PV de délibération ?"</p>
              <p class="italic">"Quels signaux d'autorité repères-tu dans ce texte ?"</p>
              <p class="italic">"Comment ce document s'inscrit-il dans les registres de communalité ?"</p>
            </div>
          </div>

        {:else}
          {#each messages as msg}
            {#if msg.role === 'user'}
              <div class="flex justify-end">
                <div class="max-w-[75%] rounded-xl rounded-tr-sm bg-mrc-700 px-4 py-2.5 text-sm text-white">
                  {msg.content}
                </div>
              </div>
            {:else}
              <div class="flex flex-col gap-2">
                <MrcStatusBadge statut="non-valide" modele="claude-sonnet" />
                <div class="rounded-xl rounded-tl-sm border border-mrc-100 bg-white px-4 py-3 text-sm text-mrc-800 whitespace-pre-wrap leading-relaxed">
                  {msg.clean ?? msg.content}
                  {#if isLoading && !msg.clean}
                    <span class="inline-block h-4 w-0.5 animate-pulse bg-mrc-400 align-middle ml-0.5"></span>
                  {/if}
                </div>
                {#if isLoading && msg === messages[messages.length - 1] && (msg.clean ?? '').length === 0}
                  <div class="flex items-center gap-2 px-1 text-xs text-mrc-400">
                    <span class="inline-flex gap-1">
                      <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-mrc-300 [animation-delay:0ms]"></span>
                      <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-mrc-300 [animation-delay:150ms]"></span>
                      <span class="h-1.5 w-1.5 animate-bounce rounded-full bg-mrc-300 [animation-delay:300ms]"></span>
                    </span>
                    Analyse en cours…
                  </div>
                {/if}
              </div>
            {/if}
          {/each}
        {/if}

      </div>

      <!-- Zone de saisie -->
      <div class="border-t border-mrc-100 bg-white px-6 py-4">
        <div class="flex items-end gap-3">
          <textarea
            bind:value={input}
            on:keydown={handleKeydown}
            placeholder="Posez une question sur le document… (Entrée pour envoyer)"
            rows="2"
            disabled={isLoading}
            class="flex-1 resize-none rounded-xl border border-mrc-200 px-4 py-2.5 text-sm text-mrc-800 placeholder-mrc-300
                   focus:border-mrc-400 focus:outline-none focus:ring-1 focus:ring-mrc-200
                   disabled:opacity-50"
          ></textarea>
          <button
            on:click={sendMessage}
            disabled={isLoading || !input.trim()}
            class="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-mrc-700 text-white
                   hover:bg-mrc-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Envoyer"
          >
            {#if isLoading}
              <span class="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"></span>
            {:else}
              <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 2L11 13M22 2L15 22 11 13 2 9l20-7z"/>
              </svg>
            {/if}
          </button>
        </div>
        <p class="mt-2 text-xs text-mrc-400">
          Toutes les réponses sont des brouillons interprétatifs · non opposables · MRC v5.4
        </p>
      </div>

    </main>

    <!-- Colonne 3 : Journal MRC -->
    <aside class="w-64 flex-shrink-0 overflow-y-auto border-l border-mrc-100 bg-white p-4">
      <h2 class="mb-4 text-xs font-semibold uppercase tracking-wide text-mrc-500">Journal MRC en construction</h2>

      {#if !hasJournalContent}
        <p class="text-xs text-mrc-300 italic">
          Les propositions extraites apparaîtront ici au fil de la conversation — acteurs, interactions, signaux, écritures.
        </p>
      {:else}
        <div class="space-y-4">
          {#each JOURNAL_SECTIONS as section}
            {#if journal[section.key].length > 0}
              <div>
                <p class="mb-1.5 text-xs font-semibold text-mrc-700">{section.label}</p>
                <ul class="space-y-1">
                  {#each journal[section.key] as item}
                    <li class="rounded-md bg-mrc-50 px-2.5 py-1.5 text-xs text-mrc-700 leading-snug">
                      {item}
                    </li>
                  {/each}
                </ul>
              </div>
            {/if}
          {/each}
        </div>

        <div class="mt-4 border-t border-mrc-100 pt-3">
          <p class="text-xs text-mrc-300 italic">Propositions non validées · brouillon</p>
        </div>
      {/if}
    </aside>

  </div>
</div>
