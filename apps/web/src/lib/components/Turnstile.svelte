<script lang="ts">
  import { onMount, onDestroy, createEventDispatcher } from 'svelte';

  export let sitekey: string;

  const dispatch = createEventDispatcher<{ token: string; expired: void }>();

  let container: HTMLElement;
  let widgetId: string | undefined;

  type TurnstileAPI = {
    render(el: HTMLElement, opts: Record<string, unknown>): string;
    reset(id: string): void;
    remove(id: string): void;
  };

  function getTurnstile(): TurnstileAPI | undefined {
    return (window as unknown as { turnstile?: TurnstileAPI }).turnstile;
  }

  function mount() {
    const ts = getTurnstile();
    if (!ts || !container) return;
    widgetId = ts.render(container, {
      sitekey,
      appearance: 'interaction-only',
      theme: 'light',
      callback:           (token: string) => dispatch('token', token),
      'expired-callback': ()               => dispatch('expired'),
    });
  }

  export function reset() {
    const ts = getTurnstile();
    if (ts && widgetId !== undefined) ts.reset(widgetId);
  }

  onMount(() => {
    if (getTurnstile()) { mount(); return; }
    const iv = setInterval(() => { if (getTurnstile()) { clearInterval(iv); mount(); } }, 100);
    return () => clearInterval(iv);
  });

  onDestroy(() => {
    const ts = getTurnstile();
    if (ts && widgetId !== undefined) ts.remove(widgetId);
  });
</script>

<div bind:this={container}></div>
