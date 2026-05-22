<script>
  const versions = [
    { version: 'v5.4', date: 'Mai 2026', statut: 'En cours', notes: 'Site web, démonstrateur conversationnel, cas chiffrés, fiche F8, note régime affectif.' },
    { version: 'v5.3', date: '2025', statut: 'Stable', notes: 'Consolidation des 9 grammaires, Annexe K2 OpenLLM France, architecture multi-agents v3.' },
    { version: 'v5.2', date: '2025', statut: 'Archive', notes: 'Intégration des usages 2 et 3, première version de la fiche registre notarié.' },
    { version: 'v5.0–v5.1', date: '2024', statut: 'Archive', notes: 'Refondation architecturale, introduction des régimes et modes.' },
    { version: 'v4.0', date: '2023', statut: 'Archive', notes: 'Version fondatrice reconstruite — base du modèle ANT / CARE.' }
  ];

  const ressources = [
    { titre: 'Note de cadrage consolidée v5.4', format: 'DOCX', href: '#', desc: 'Document de référence pour la v5.4 — programme de travail, principes, grammaires.' },
    { titre: 'Bibliographie BibTeX (CERCES, CCE, ICGS, CDM)', format: 'BIB', href: '#', desc: 'Références primaires et spécifiques à chaque grammaire — nettoyage en cours.' },
    { titre: 'Architecture multi-agents v3', format: 'DOCX', href: '#', desc: 'Spécification technique du système multi-agents MRC v5.1.' },
    { titre: 'Cas chiffré MRC v5.4', format: 'DOCX', href: '#', desc: 'Illustration chiffrée de l\'usage 3 (registre comptable de communalité).' }
  ];
</script>

<svelte:head>
  <title>Documentation & Lignée des versions — Registres de communalité</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-4 py-16">

  <div class="mb-10">
    <div class="mb-2 text-sm font-medium text-mrc-500">Ressources</div>
    <h1 class="text-3xl font-bold text-mrc-900">Documentation & Lignée des versions</h1>
    <p class="mt-3 text-mrc-600">Téléchargements, changelog, bibliographie — accès à l'ensemble du corpus MRC.</p>
  </div>

  <!-- Changelog -->
  <section class="mb-14">
    <h2 class="mb-6 text-xl font-semibold text-mrc-800 border-b border-mrc-100 pb-2">Lignée des versions</h2>
    <div class="overflow-hidden rounded-lg border border-mrc-100">
      <table class="w-full text-sm">
        <thead class="bg-mrc-50">
          <tr>
            <th class="px-4 py-3 text-left font-medium text-mrc-700">Version</th>
            <th class="px-4 py-3 text-left font-medium text-mrc-700">Date</th>
            <th class="px-4 py-3 text-left font-medium text-mrc-700">Statut</th>
            <th class="px-4 py-3 text-left font-medium text-mrc-700">Notes</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-mrc-100">
          {#each versions as v}
            <tr class="bg-white">
              <td class="px-4 py-3 font-mono font-medium text-mrc-800">{v.version}</td>
              <td class="px-4 py-3 text-mrc-600">{v.date}</td>
              <td class="px-4 py-3">
                <span class="rounded-full px-2 py-0.5 text-xs font-medium
                  {v.statut === 'En cours' ? 'bg-blue-50 text-blue-700' :
                   v.statut === 'Stable' ? 'bg-emerald-50 text-emerald-700' :
                   'bg-slate-100 text-slate-500'}">
                  {v.statut}
                </span>
              </td>
              <td class="px-4 py-3 text-mrc-600">{v.notes}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </section>

  <!-- Ressources téléchargeables -->
  <section>
    <h2 class="mb-6 text-xl font-semibold text-mrc-800 border-b border-mrc-100 pb-2">Ressources disponibles</h2>
    <div class="space-y-3">
      {#each ressources as r}
        <div class="flex items-start gap-4 rounded-lg border border-mrc-100 bg-white p-4">
          <span class="rounded bg-mrc-100 px-2 py-0.5 text-xs font-mono font-medium text-mrc-600 shrink-0 mt-0.5">
            {r.format}
          </span>
          <div>
            <a href={r.href} class="font-medium text-mrc-800 hover:text-mrc-600">{r.titre}</a>
            <p class="mt-0.5 text-sm text-mrc-500">{r.desc}</p>
          </div>
        </div>
      {/each}
    </div>
    <p class="mt-4 text-xs text-mrc-400">Les téléchargements seront activés à partir du sprint 4.</p>
  </section>

</div>
