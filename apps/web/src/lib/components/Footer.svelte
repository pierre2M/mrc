<script>
  const mrcVersion = 'v5.5';
  const year = new Date().getFullYear();
</script>

<footer class="mt-24 border-t border-mrc-100 bg-white">
  <div class="mx-auto max-w-6xl px-4 py-10">
    <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">

      <!-- Identité -->
      <div class="max-w-xs">
        <p class="text-sm font-semibold text-mrc-800">Modèle de Registres de Communalité</p>
        <p class="mt-1 text-xs text-mrc-500">
          Prototype scientifique en accès ouvert — version {mrcVersion} · {year}
        </p>
        <p class="mt-2 text-xs text-mrc-500">
          Ce site ne valide rien. Toutes les sorties IA portent le statut
          <span class="font-medium text-red-600">brouillon interprétatif, non opposable</span>.
        </p>
      </div>

      <!-- Liens -->
      <div class="flex gap-12 text-sm">
        <div>
          <p class="font-medium text-mrc-700">Explorer</p>
          <ul class="mt-2 space-y-1">
            <li><a href="/presentation" class="text-mrc-500 hover:text-mrc-800">Présentation du MRC</a></li>
            <li><a href="/grammaires" class="text-mrc-500 hover:text-mrc-800">Grammaires</a></li>
            <li><a href="/usage-1" class="text-mrc-500 hover:text-mrc-800">Démonstrateur</a></li>
          </ul>
        </div>
        <div>
          <p class="font-medium text-mrc-700">Ressources</p>
          <ul class="mt-2 space-y-1">
            <li><a href="/documentation" class="text-mrc-500 hover:text-mrc-800">Documentation</a></li>
            <li><a href="/gouvernance" class="text-mrc-500 hover:text-mrc-800">Gouvernance & RGPD</a></li>
          </ul>
        </div>
      </div>

    </div>
  </div>
</footer>
