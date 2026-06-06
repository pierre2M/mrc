<script>
  import '../app.css';
  import Nav from '$lib/components/Nav.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import FeedbackBanner from '$lib/components/FeedbackBanner.svelte';
</script>

<svelte:head>
  <meta name="description" content="Prototype scientifique du Modèle de Registres de Communalité (MRC) v5.5 — présentation, démonstrateur conversationnel, grammaires." />
</svelte:head>

<div class="flex min-h-screen flex-col">
  <FeedbackBanner />
  <Nav />
  <main class="flex-1">
    <slot />
  </main>
  <Footer />
</div>
