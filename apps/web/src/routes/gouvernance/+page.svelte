<script>
  const principes = [
    { titre: 'Non-validation par LLM seul (R-INCAPACITE-LLM-VALIDER)', texte: 'Aucune sortie de ce site ne constitue une écriture MRC validée. Toutes les réponses de l\'agent portent explicitement la mention "brouillon interprétatif, non opposable".' },
    { titre: 'Frugalité des données', texte: 'En v1, aucun document n\'est stocké sur les serveurs. Le traitement est stateless. Les sessions ne sont pas enregistrées.' },
    { titre: 'Marquage explicite des sorties IA', texte: 'Chaque réponse affiche le statut, la grammaire mobilisée et les limites de l\'interprétation. Le modèle LLM utilisé est toujours visible.' },
    { titre: 'Transparence sur le cadre théorique', texte: 'Les grammaires et cadres théoriques mobilisés dans chaque analyse sont documentés et accessibles. Aucune boîte noire.' },
    { titre: 'Absence de tracking publicitaire', texte: 'Ce site n\'utilise pas de cookies publicitaires. L\'analytics éventuel est limité à des compteurs agrégés anonymes (Plausible).' }
  ];
</script>

<svelte:head>
  <title>Gouvernance & RGPD — Registres de communalité</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-4 py-16">

  <div class="mb-10">
    <div class="mb-2 text-sm font-medium text-mrc-500">Ressources</div>
    <h1 class="text-3xl font-bold text-mrc-900">Gouvernance & RGPD</h1>
    <p class="mt-3 text-mrc-600">
      Principes de gouvernance du prototype MRC 5.x — transparence, protection des données, limites du dispositif.
    </p>
  </div>

  <section class="mb-12">
    <h2 class="mb-6 text-xl font-semibold text-mrc-800 border-b border-mrc-100 pb-2">Principes directeurs</h2>
    <div class="space-y-4">
      {#each principes as p}
        <div class="rounded-lg border border-mrc-100 bg-white p-5">
          <h3 class="mb-2 font-semibold text-mrc-800">{p.titre}</h3>
          <p class="text-sm text-mrc-600">{p.texte}</p>
        </div>
      {/each}
    </div>
  </section>

  <section class="mb-12">
    <h2 class="mb-4 text-xl font-semibold text-mrc-800 border-b border-mrc-100 pb-2">Traitement des données personnelles</h2>
    <div class="rounded-lg bg-amber-50 border border-amber-200 p-5 text-sm text-amber-800">
      <p class="font-medium mb-2">⚠️ Documents déposés sur le démonstrateur (Usage 1)</p>
      <p>L\'utilisateur atteste que tout document déposé est public ou anonymisé. En cas de détection automatique de données personnelles, le traitement est interrompu et un message explicatif est affiché. Aucune donnée n\'est conservée au-delà de la session.</p>
    </div>
  </section>

  <section>
    <h2 class="mb-4 text-xl font-semibold text-mrc-800 border-b border-mrc-100 pb-2">Contact & contribution</h2>
    <p class="text-mrc-600 text-sm">
      Ce prototype est développé en accès ouvert. Pour signaler un problème, proposer une contribution ou contacter l\'équipe :
      <a href="mailto:contact@registre-communalite.org" class="text-mrc-700 underline">contact@registre-communalite.org</a>
    </p>
    <p class="mt-3 text-mrc-600 text-sm">
      Code source disponible sur GitHub · Licence MIT · Version MRC : 5.5 (mai 2026)
    </p>
  </section>

</div>
