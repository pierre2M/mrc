<script>
  import { goto } from '$app/navigation';

  const usages = [
    {
      id: 1,
      titre: 'Découvrir et interroger',
      accroche: 'Posez des questions sur le MRC, ses grammaires et ses concepts. Testez le démonstrateur pour explorer des situations concrètes.',
      niveau: 'Heuristique',
      href: '/usage-1',
      icon: '🔍',
      couleur: 'border-blue-200 hover:border-blue-400'
    },
    {
      id: 2,
      titre: 'Construire une enquête',
      accroche: 'Suivez les étapes d\'une enquête collective sur un cas réel — des premières observations jusqu\'à la validation par les acteurs concernés.',
      niveau: 'Méthodologique',
      href: '/usage-2',
      icon: '📋',
      couleur: 'border-amber-200 hover:border-amber-400'
    },
    {
      id: 3,
      titre: 'Tenir un registre opposable',
      accroche: 'Naviguez dans des registres entre différents types d\'acteurs — personnes, organisations, entités naturelles.',
      niveau: 'Infrastructurel',
      href: '/usage-3',
      icon: '⚖️',
      couleur: 'border-emerald-200 hover:border-emerald-400'
    }
  ];

  const publics = [
    {
      titre: 'Chercheurs et académiques',
      description: 'Douze grammaires transversales avec fiches et bibliographie, notes théoriques versionnées, accès aux sources primaires.',
      href: '/grammaires',
      cta: 'Accéder aux grammaires →'
    },
    {
      titre: 'Praticiens et collectifs',
      description: 'Démonstrateur conversationnel et enquêtes collectives sur cas réels — Mar Menor, pouvoir d\'agir des soignant·es.',
      href: '/usage-2',
      cta: 'Parcourir une enquête collective →'
    },
    {
      titre: 'Partenaires institutionnels',
      description: 'Principes de gouvernance, conformité RGPD, limites d\'usage de l\'IA, articulation avec vos propres référentiels.',
      href: '/gouvernance',
      cta: 'Lire la note de gouvernance →'
    }
  ];
</script>

<svelte:head>
  <title>Modèle des Registres de Communalité — MRC v5.5</title>
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
      Le MRC est un modèle pour rendre lisibles<br class="hidden md:block" />
      les obligations qui font tenir un collectif
    </h1>

    <p class="mt-4 text-base text-mrc-600 md:text-lg">
      Dans toute organisation, des ressources circulent, du travail est fourni, des engagements
      sont pris ou esquivés — souvent sans trace. Un <strong>registre de communalité</strong> rend
      ces échanges visibles et délibérables, pour des humains, des organisations et des entités
      naturelles. La <strong>communalité</strong>, c'est la gouvernance démocratique de ces relations.
    </p>

    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <a href="/presentation" class="rounded-lg bg-mrc-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-mrc-800 transition-colors">
        Comprendre le MRC
      </a>
      <a href="/pedagogie" class="rounded-lg border border-mrc-200 bg-white px-5 py-2.5 text-sm font-medium text-mrc-700 hover:bg-mrc-50 transition-colors">
        Pas à pas
      </a>
      <a href="/usage-1" class="rounded-lg border border-mrc-200 bg-white px-5 py-2.5 text-sm font-medium text-mrc-700 hover:bg-mrc-50 transition-colors">
        Démonstrateur
      </a>
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

<!-- À garder en tête -->
<section class="border-t border-mrc-100 bg-white py-10">
  <div class="mx-auto max-w-3xl px-4">
    <p class="text-center text-sm font-medium text-mrc-400 mb-6 uppercase tracking-wide">Pour bien utiliser ce site</p>
    <div class="grid gap-4 md:grid-cols-3 text-sm">
      <div class="rounded-lg bg-mrc-50 p-4 border border-mrc-100">
        <p class="font-semibold text-mrc-800 mb-1">Analyser ≠ valider</p>
        <p class="text-mrc-600">Le démonstrateur produit des esquisses. Il ne valide rien. La validation est toujours humaine et délibérative.</p>
      </div>
      <div class="rounded-lg bg-mrc-50 p-4 border border-mrc-100">
        <p class="font-semibold text-mrc-800 mb-1">Esquisse ≠ registre</p>
        <p class="text-mrc-600">Un registre MRC opposable nécessite des acteurs nommés, des interactions traçables et une délibération collective — pas seulement une sortie IA.</p>
      </div>
      <div class="rounded-lg bg-mrc-50 p-4 border border-mrc-100">
        <p class="font-semibold text-mrc-800 mb-1">Plausible ≠ vérifiable</p>
        <p class="text-mrc-600">Le MRC distingue ce qui est ancré dans une source déclarée, ce qui est inféré, et ce qui semble vrai sans pouvoir être vérifié.</p>
      </div>
    </div>
  </div>
</section>
