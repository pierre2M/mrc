<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';

  const STORAGE_KEY = 'mrc_feedback_banner_dismissed';

  let visible = false;
  let modalOpen = false;

  // Formulaire
  let name = '';
  let email = '';
  let message = '';
  let pageLabel = '';
  let sending = false;
  let sent = false;
  let errorMsg = '';

  onMount(() => {
    visible = !sessionStorage.getItem(STORAGE_KEY);
  });

  $: if (modalOpen) {
    pageLabel = $page.url.pathname;
  }

  function dismiss() {
    sessionStorage.setItem(STORAGE_KEY, '1');
    visible = false;
  }

  function openModal() {
    sent = false;
    errorMsg = '';
    modalOpen = true;
  }

  function closeModal() {
    modalOpen = false;
    name = '';
    email = '';
    message = '';
    errorMsg = '';
  }

  async function submit() {
    errorMsg = '';
    if (!name.trim() || !email.trim()) {
      errorMsg = 'Nom et email requis.';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorMsg = 'Adresse email invalide.';
      return;
    }
    sending = true;
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, page: pageLabel, message }),
      });
      const data = await res.json();
      if (!res.ok) { errorMsg = data.error ?? 'Erreur lors de l\'envoi.'; return; }
      sent = true;
      setTimeout(() => closeModal(), 2500);
    } catch {
      errorMsg = 'Erreur réseau. Veuillez réessayer.';
    } finally {
      sending = false;
    }
  }
</script>

{#if visible}
  <!-- Bandeau -->
  <div class="relative z-40 bg-amber-50 border-b border-amber-200 px-4 py-1.5 text-center text-xs text-amber-800">
    <span>Site prototype en cours de construction · Vos retours sont bienvenus —</span>
    <button
      type="button"
      on:click={openModal}
      class="ml-1.5 font-medium underline underline-offset-2 hover:text-amber-900 focus:outline-none"
    >
      Laisser un commentaire →
    </button>
    <button
      type="button"
      on:click={dismiss}
      aria-label="Fermer le bandeau"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-amber-500 hover:text-amber-800 focus:outline-none"
    >
      <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
        <path d="M18 6L6 18M6 6l12 12"/>
      </svg>
    </button>
  </div>
{/if}

{#if modalOpen}
  <!-- Fond -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <div
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
    on:click|self={closeModal}
    on:keydown={(e) => e.key === 'Escape' && closeModal()}
  >
    <div class="w-full max-w-md rounded-xl border border-mrc-100 bg-white shadow-xl">

      <!-- En-tête -->
      <div class="flex items-center justify-between border-b border-mrc-100 px-5 py-4">
        <div>
          <p class="text-xs font-medium text-amber-600">Site en construction</p>
          <h2 class="text-sm font-semibold text-mrc-900">Laisser un commentaire</h2>
        </div>
        <button
          type="button"
          on:click={closeModal}
          aria-label="Fermer"
          class="rounded p-1 text-mrc-400 hover:bg-mrc-50 hover:text-mrc-700 focus:outline-none"
        >
          <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Corps -->
      <div class="px-5 py-4">
        {#if sent}
          <div class="flex flex-col items-center gap-2 py-6 text-center">
            <svg class="h-8 w-8 text-emerald-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-5"/>
            </svg>
            <p class="text-sm font-medium text-mrc-800">Merci pour votre retour !</p>
            <p class="text-xs text-mrc-500">Votre message a bien été transmis.</p>
          </div>
        {:else}
          <form on:submit|preventDefault={submit} class="space-y-3" novalidate>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label for="fb-name" class="mb-1 block text-xs font-medium text-mrc-700">
                  Nom <span class="text-red-500">*</span>
                </label>
                <input
                  id="fb-name"
                  type="text"
                  bind:value={name}
                  placeholder="Votre nom"
                  required
                  class="w-full rounded-lg border border-mrc-200 px-3 py-2 text-sm text-mrc-800
                         placeholder-mrc-300 focus:border-mrc-400 focus:outline-none focus:ring-1
                         focus:ring-mrc-200"
                />
              </div>
              <div>
                <label for="fb-email" class="mb-1 block text-xs font-medium text-mrc-700">
                  Email <span class="text-red-500">*</span>
                </label>
                <input
                  id="fb-email"
                  type="email"
                  bind:value={email}
                  placeholder="vous@exemple.com"
                  required
                  class="w-full rounded-lg border border-mrc-200 px-3 py-2 text-sm text-mrc-800
                         placeholder-mrc-300 focus:border-mrc-400 focus:outline-none focus:ring-1
                         focus:ring-mrc-200"
                />
              </div>
            </div>

            <div>
              <label for="fb-page" class="mb-1 block text-xs font-medium text-mrc-700">
                Page visitée
              </label>
              <input
                id="fb-page"
                type="text"
                bind:value={pageLabel}
                class="w-full rounded-lg border border-mrc-100 bg-mrc-50 px-3 py-2 text-sm
                       text-mrc-600 focus:border-mrc-300 focus:outline-none focus:ring-1
                       focus:ring-mrc-100"
              />
            </div>

            <div>
              <label for="fb-message" class="mb-1 block text-xs font-medium text-mrc-700">
                Commentaire
              </label>
              <textarea
                id="fb-message"
                bind:value={message}
                rows="4"
                placeholder="Votre retour, suggestion ou question…"
                class="w-full resize-none rounded-lg border border-mrc-200 px-3 py-2 text-sm
                       text-mrc-800 placeholder-mrc-300 focus:border-mrc-400 focus:outline-none
                       focus:ring-1 focus:ring-mrc-200"
              ></textarea>
            </div>

            {#if errorMsg}
              <p class="text-xs font-medium text-red-600">{errorMsg}</p>
            {/if}

            <div class="flex items-center justify-between pt-1">
              <p class="text-xs text-mrc-400">
                <span class="text-red-500">*</span> champs obligatoires
              </p>
              <button
                type="submit"
                disabled={sending}
                class="rounded-lg bg-mrc-700 px-4 py-2 text-sm font-medium text-white
                       hover:bg-mrc-800 focus:outline-none focus:ring-2 focus:ring-mrc-400
                       disabled:opacity-50"
              >
                {#if sending}
                  <span class="inline-flex items-center gap-1.5">
                    <span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" aria-hidden="true"></span>
                    Envoi…
                  </span>
                {:else}
                  Envoyer →
                {/if}
              </button>
            </div>

          </form>
        {/if}
      </div>

    </div>
  </div>
{/if}
