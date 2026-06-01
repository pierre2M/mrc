<script>
  import { goto } from '$app/navigation';

  const usages = [
    {
      id: 1,
      titre: 'Découvrir et interroger',
      accroche: 'Posez des questions sur le MRC, ses grammaires ou le régime de vérifiabilité-cohérence. Testez le démonstrateur en mode Découverte ou Analyse.',
      niveau: 'Heuristique',
      href: '/usage-1',
      icon: '🔍',
      couleur: 'border-blue-200 hover:border-blue-400'
    },
    {
      id: 2,
      titre: 'Construire une enquête',
      accroche: 'Suivez la chronologie d\'un registre d\'enquête contrôlé : ingestion, staging, vérification, validation délibérative.',
      niveau: 'Méthodologique',
      href: '/usage-2',
      icon: '📋',
      couleur: 'border-amber-200 hover:border-amber-400'
    },
    {
      id: 3,
      titre: 'Tenir un registre opposable',
      accroche: 'Naviguez dans des registres symétriques entre acteurs hétérogènes — humains, organisations, non-humains.',
      niveau: 'Infrastructurel',
      href: '/usage-3',
      icon: '⚖️',
      couleur: 'border-emerald-200 hover:border-emerald-400'
    }
  ];

  const publics = [
    {
      titre: 'Chercheurs et académiques',
      description: 'Dix grammaires transversales avec fiches, bibliographie BibTeX, notes théoriques (NT) versionnées, régime vérifiabilité-cohérence.',
      href: '/grammaires',
      cta: 'Accéder aux grammaires →'
    },
    {
      titre: 'Praticiens et collectifs',
      description: 'Démonstrateur interactif en trois modes (Découverte, Analyse, Expert), exemples d\'analyse sur document réel.',
      href: '/usage-1',
      cta: 'Essayer le démonstrateur →'
    },
    {
      titre: 'Partenaires institutionnels',
      description: 'Principes de gouvernance, conformité RGPD, R-INCAPACITE-LLM-VALIDER, articulation avec vos propres référentiels.',
      href: '/gouvernance',
      cta: 'Lire la note de gouvernance →'
    }
  ];
</script>

<svelte:head>
  <title>Registres de communalité — MRC v5.x</title>
</svelte:head>

<!-- Hero -->
<section class="border-b border-mrc-100 bg-white py-16">
  <div class="mx-auto max-w-3xl px-4 text-center">

    <!-- Bandeau non-validation -->
    <div class="mb-6 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-xs text-mrc-600">
      <span class="h-1.5 w-1.5 rounded-full bg-red-400"></span>
      Ce site ne valide rien — toutes les sorties IA sont des brouillons interprétatifs, non opposables
    </div>

    <h1 class="text-3xl font-bold tracking-tight text-mrc-900 md:text-4xl">
      Le MRC est un modèle pour décrire<br class="hidden md:block" />
      ce qui fait <em class="font-normal not-italic text-mrc-600">communalité</em>
    </h1>

    <p class="mt-4 text-base text-mrc-600 md:text-lg">
      Entre des humains, des organisations, des vivants non-humains et des dispositifs techniques.
      Il opère en régime de vérifiabilité-cohérence : chaque énoncé est ancré dans une source déclarée
      ou explicitement marqué comme inférence.
    </p>

    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <a href="/presentation" class="rounded-lg bg-mrc-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-mrc-800 transition-colors">
        Comprendre le MRC
      </a>
      <a href="/usage-1" class="rounded-lg border border-mrc-200 bg-white px-5 py-2.5 text-sm font-medium text-mrc-700 hover:bg-mrc-50 transition-colors">
        Essayer le démonstrateur
      </a>
    </div>

  </div>
</section>

<!-- Trois distinctions fondamentales -->
<section class="border-b border-mrc-100 bg-mrc-50 py-10">
  <div class="mx-auto max-w-3xl px-4">
    <p class="text-center text-sm font-medium text-mrc-500 mb-6 uppercase tracking-wide">Trois distinctions fondamentales</p>
    <div class="grid gap-4 md:grid-cols-3 text-sm">
      <div class="rounded-lg bg-white p-4 border border-mrc-100">
        <p class="font-semibold text-mrc-800 mb-1">Analyser ≠ valider</p>
        <p class="text-mrc-600">Un LLM peut produire une esquisse MRC. Il ne peut pas valider une écriture. La validation est toujours humaine et délibérative.</p>
      </div>
      <div class="rounded-lg bg-white p-4 border border-mrc-100">
        <p class="font-semibold text-mrc-800 mb-1">Esquisse ≠ registre</p>
        <p class="text-mrc-600">Les sorties du démonstrateur sont des brouillons interprétatifs. Un registre MRC opposable nécessite des acteurs nommés, des interactions traçables, une délibération.</p>
      </div>
      <div class="rounded-lg bg-white p-4 border border-mrc-100">
        <p class="font-semibold text-mrc-800 mb-1">Plausible ≠ vérifiable</p>
        <p class="text-mrc-600">Le MRC distingue ce qui est ancré dans une source déclarée, ce qui est inféré, et ce qui est simplement [PLAUSIBLE, NON VÉRIFIÉ].</p>
      </div>
    </div>
  </div>
</section>

<!-- Trois usages -->
<section class="py-16">
  <div class="mx-auto max-w-5xl px-4">
    <h2 class="mb-2 text-center text-xl font-semibold text-mrc-800">Par quel usage commencer ?</h2>
    <p class="mb-10 text-center text-sm text-mrc-500">Trois niveaux d'engagement, trois architectures distinctes</p>

    <div class="grid gap-6 md:grid-cols-3">
      {#each usages as usage}
        <a href={usage.href} class="usage-card {usage.couleur} group">
          <div class="mb-3 text-2xl">{usage.icon}</div>
          <div class="mb-1 text-xs font-medium uppercase tracking-wide text-mrc-400">Usage {usage.id} · {usage.niveau}</div>
          <h3 class="mb-2 font-semibold text-mrc-900">{usage.titre}</h3>
          <p class="text-sm text-mrc-600">{usage.accroche}</p>
          <div class="mt-4 text-xs font-medium text-mrc-500 group-hover:text-mrc-700">Explorer →</div>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- Par public -->
<section class="border-t border-mrc-100 bg-mrc-50 py-16">
  <div class="mx-auto max-w-5xl px-4">
    <h2 class="mb-10 text-center text-xl font-semibold text-mrc-800">Selon votre profil</h2>
    <div class="grid gap-6 md:grid-cols-3">
      {#each publics as p}
        <div class="rounded-xl bg-white p-6 shadow-sm">
          <h3 class="mb-2 font-semibold text-mrc-900">{p.titre}</h3>
          <p class="mb-4 text-sm text-mrc-600">{p.description}</p>
          <a href={p.href} class="text-sm font-medium text-mrc-600 hover:text-mrc-900">{p.cta}</a>
        </div>
      {/each}
    </div>
  </div>
</section>
