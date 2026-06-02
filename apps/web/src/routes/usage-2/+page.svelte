<script lang="ts">
  import MrcStatusBadge from '$lib/components/MrcStatusBadge.svelte';
  import Stepper from '$lib/components/Stepper.svelte';

  // ──────────────────────────────────────────────────────────────────────────
  // Usage 2 — Registre d'enquête contrôlé · démonstration interactive (vitrine).
  // Séquence canonique : machine d'états à 6 phases C-ENQUETE (cf. note de
  // révision des specs Usage 2 & 3, MRC v5.5, juin 2026).
  // Aucune sortie n'est opposable : démonstration pédagogique, sans appel LLM.
  // ──────────────────────────────────────────────────────────────────────────

  type Statut = 'rouge' | 'ambre' | 'vert' | 'archive';
  type Role = 'humain' | 'ia' | 'collectif';

  interface Ecriture {
    id: string;
    texte: string;
    type: 'acteur' | 'interaction' | 'ecriture';
    fiche: string;          // fiche-mode dominante (F1…F8)
    source: string;         // extrait justificatif (cas fictif)
    statut: Statut;
    motif?: string;         // motif d'archivage / renvoi
  }

  interface Phase {
    id: string;
    num: number;
    label: string;
    porteur: string;
    role: Role;
    sortie: string;
    precondition: string;
  }

  const PHASES: Phase[] = [
    { id: 'probleme', num: 1, label: 'PROBLÈME', porteur: 'Coordinatrice d’enquête', role: 'humain',
      sortie: 'Énoncé du problème, périmètre, et inventaire des tiers affectés.',
      precondition: 'Inventaire des affectés non vide (InventaireNonVide).' },
    { id: 'enquete', num: 2, label: 'ENQUÊTE', porteur: 'Agent d’extraction (IA) + humain', role: 'ia',
      sortie: 'Propositions d’écriture (rouge, non validées) avec source citée.',
      precondition: 'Sous-séquence interne : ingestion → staging → vérification. Aucune écriture opposable ici.' },
    { id: 'revision', num: 3, label: 'RÉVISION CONCEPTUELLE', porteur: 'Agent de vérification + humain', role: 'ia',
      sortie: 'Primitives stabilisées ; concepts de base déclarés (Couche 0).',
      precondition: 'Tout changement de base est tracé, sinon [CHANGEMENT DE BASE NON TRACÉ].' },
    { id: 'deliberation', num: 4, label: 'DÉLIBÉRATION', porteur: 'Collectif d’enquête', role: 'collectif',
      sortie: 'Désignation d’un porteur de dette ; arbitrage des propositions (ambre).',
      precondition: 'BLOQUÉE si R-HERMENEUTIQUE > seuil (entités sans voix propre) ; pas de saut au niveau critique sans porteur (machine-états).' },
    { id: 'convention', num: 5, label: 'CONVENTION', porteur: 'Collectif + signataires', role: 'collectif',
      sortie: 'Écritures validées (vert), signées, datées, opposables dans le registre d’enquête.',
      precondition: 'Validation humaine explicite ; le LLM ne valide jamais (R-INCAPACITE-LLM-VALIDER).' },
    { id: 'mise_en_oeuvre', num: 6, label: 'MISE EN ŒUVRE', porteur: 'Porteurs désignés', role: 'humain',
      sortie: 'Obligations instrumentées + signaux ouverts suivis.',
      precondition: 'Horizon déclaré ; si irréversible → délibération préalable.' }
  ];

  // ── Cas de démonstration ────────────────────────────────────────────────
  const CAS = [
    { id: 'milieu', titre: 'Commun écologique — nappe phréatique', fiche: 'F2 — Milieu',
      jouable: true,
      resume: 'Une coopérative arbitre l’usage d’une nappe. La décision affecte des entités non-humaines (nappe, zones humides) qui ne parlent pas en leur nom — la phase DÉLIBÉRATION est donc verrouillée par R-HERMENEUTIQUE.' },
    { id: 'compta', titre: 'Coopérative — écriture comptable', fiche: 'F8 — Comptable (entrée)',
      jouable: false,
      resume: 'Une écriture comptable typée P-C-E-D-e-d est proposée par l’agent, mais jamais validée par le LLM. À venir.' },
    { id: 'affectif', titre: 'Dispositif de travail émotionnel', fiche: 'F1 / F4 — affectif',
      jouable: false,
      resume: 'Le système refuse de soumettre les verbatims au LLM sans consentement préalable (fiche T1). À venir.' }
  ];

  // Inventaire initial des entités affectées (cas nappe)
  const INVENTAIRE_INIT = [
    { nom: 'Habitant·es de la commune', type: 'humain', inclus: true },
    { nom: 'Maraîcher·ères en aval', type: 'humain', inclus: true },
    { nom: 'Nappe phréatique', type: 'non-humain', inclus: true },
    { nom: 'Zones humides connectées', type: 'non-humain', inclus: true },
    { nom: 'Générations futures', type: 'non-humain', inclus: false }
  ];

  // Propositions d'écriture produites en phase ENQUÊTE (cas nappe)
  const ECRITURES_INIT: Ecriture[] = [
    { id: 'e1', type: 'acteur', fiche: 'F2', statut: 'rouge',
      texte: 'Acteur non-humain : nappe phréatique, dotée d’un seuil d’entrée dans la communauté morale.',
      source: '« le niveau de la nappe a baissé de 1,8 m en cinq ans » (note de bassin, p. 3)' },
    { id: 'e2', type: 'interaction', fiche: 'F2', statut: 'rouge',
      texte: 'Interaction : prélèvement agricole → nappe (mobilisation d’un capital non-humain).',
      source: '« la coopérative prélève 220 000 m³/an » (délibération du 12 mars)' },
    { id: 'e3', type: 'ecriture', fiche: 'F2', statut: 'rouge',
      texte: 'Écriture : dette de care envers la nappe, contre-écriture du gain de production.',
      source: 'R-CARE branche non-humain + R-CODEGRADATION (→ NT-G3)' },
    { id: 'e4', type: 'ecriture', fiche: 'F2', statut: 'rouge',
      texte: 'Écriture : co-dégradation travail maraîcher / milieu (signal R-CODEGRADATION).',
      source: '« les maraîchers en aval signalent des sols plus secs » (compte-rendu atelier)' },
    { id: 'e5', type: 'acteur', fiche: 'F2', statut: 'rouge',
      texte: 'Acteur instrumental : compteur volumétrique (dispositif de mesure non déclaré).',
      source: '[PLAUSIBLE, NON VÉRIFIÉ — instrument mentionné sans référence de calibration]' }
  ];

  // ── État ──────────────────────────────────────────────────────────────────
  let casChoisi: string | null = null;
  let phaseIdx = 0;
  let inventaire = INVENTAIRE_INIT.map((x) => ({ ...x }));
  let inventaireConfirme = false;
  let ecritures: Ecriture[] = ECRITURES_INIT.map((x) => ({ ...x }));
  let enqueteLancee = false;
  let basesStabilisees = false;
  let representationProspective = false; // lève le blocage R-HERMENEUTIQUE
  let porteurDette = '';

  $: phase = PHASES[phaseIdx];
  $: inventaireNonVide = inventaire.some((e) => e.inclus);
  $: aNonHumainSansVoix = inventaire.some((e) => e.inclus && e.type === 'non-humain');
  $: deliberationBloquee = aNonHumainSansVoix && !representationProspective;

  // Conditions de franchissement par phase (la machine d’états).
  // Tous les deps sont passés en paramètres pour que la déclaration réactive
  // $: garde = peutAvancer(...) les suive explicitement — Svelte 4 ne traque
  // pas les variables lues à l’intérieur du corps d’une fonction appelée.
  function peutAvancer(
    idx: number,
    _inventaireConfirme: boolean,
    _inventaireNonVide: boolean,
    _enqueteLancee: boolean,
    _basesStabilisees: boolean,
    _deliberationBloquee: boolean,
    _porteurDette: string,
    _ecritures: Ecriture[]
  ): { ok: boolean; raison?: string } {
    switch (PHASES[idx].id) {
      case ‘probleme’:
        if (!_inventaireConfirme) return { ok: false, raison: "Confirmez l’inventaire des affectés avant de continuer." };
        if (!_inventaireNonVide) return { ok: false, raison: "[BLOCAGE] InventaireNonVide : la liste des entités affectées ne peut pas être vide." };
        return { ok: true };
      case ‘enquete’:
        if (!_enqueteLancee) return { ok: false, raison: "Lancez le staging pour produire les propositions d’écriture." };
        return { ok: true };
      case ‘revision’:
        if (!_basesStabilisees) return { ok: false, raison: "Déclarez les primitives de base (Couche 0) avant de continuer." };
        return { ok: true };
      case ‘deliberation’:
        if (_deliberationBloquee) return { ok: false, raison: "[BLOCAGE R-HERMENEUTIQUE] Des entités sans voix propre sont affectées : franchissez d’abord la représentation prospective." };
        if (!_porteurDette.trim()) return { ok: false, raison: "[BLOCAGE machine-états] Aucun porteur de dette désigné : pas de passage au niveau critique." };
        return { ok: true };
      case ‘convention’:
        if (_ecritures.some((e) => e.statut === ‘rouge’)) return { ok: false, raison: "Arbitrez chaque proposition (valider ou archiver) avant de clore la convention." };
        return { ok: true };
      default:
        return { ok: true };
    }
  }

  $: garde = peutAvancer(
    phaseIdx,
    inventaireConfirme,
    inventaireNonVide,
    enqueteLancee,
    basesStabilisees,
    deliberationBloquee,
    porteurDette,
    ecritures
  );
  $: stepsBar = PHASES.map((p) => ({ num: p.num, label: p.label }));

  function lancerStaging() {
    enqueteLancee = true;
    ecritures = ECRITURES_INIT.map((x) => ({ ...x }));
  }
  function valider(id: string) {
    ecritures = ecritures.map((e) => (e.id === id ? { ...e, statut: 'vert', motif: undefined } : e));
  }
  function archiver(id: string) {
    ecritures = ecritures.map((e) => (e.id === id ? { ...e, statut: 'archive', motif: 'renvoyée en staging' } : e));
  }
  function discuter(id: string) {
    ecritures = ecritures.map((e) => (e.id === id ? { ...e, statut: 'ambre' } : e));
  }

  $: bilan = {
    opposables: ecritures.filter((e) => e.statut === 'vert').length,
    archivees: ecritures.filter((e) => e.statut === 'archive').length,
    signaux: ecritures.filter((e) => e.statut === 'vert' && e.type === 'ecriture').length
  };

  const statutMeta: Record<Statut, { label: string; cls: string; dot: string }> = {
    rouge:   { label: 'Non validée', cls: 'border-red-200 bg-red-50 text-red-800', dot: 'bg-red-400' },
    ambre:   { label: 'En discussion', cls: 'border-amber-200 bg-amber-50 text-amber-800', dot: 'bg-amber-400' },
    vert:    { label: 'Validée — opposable', cls: 'border-emerald-200 bg-emerald-50 text-emerald-800', dot: 'bg-emerald-400' },
    archive: { label: 'Archivée', cls: 'border-slate-200 bg-slate-100 text-slate-500', dot: 'bg-slate-400' }
  };

  function reset() {
    phaseIdx = 0; inventaire = INVENTAIRE_INIT.map((x) => ({ ...x }));
    inventaireConfirme = false; ecritures = ECRITURES_INIT.map((x) => ({ ...x }));
    enqueteLancee = false; basesStabilisees = false; representationProspective = false; porteurDette = '';
  }
</script>

<svelte:head>
  <title>Usage 2 — Registre d'enquête · MRC v5.5</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">

  <!-- En-tête -->
  <header class="mb-8">
    <div class="mb-1 text-xs font-medium uppercase tracking-wide text-amber-600">Usage 2 · Méthodologique</div>
    <h1 class="text-2xl font-bold text-mrc-900">Construire une enquête</h1>
    <p class="mt-3 max-w-3xl text-mrc-600">
      Un registre d'enquête ne se génère pas en un clic : il se construit phase par phase, avec une
      validation humaine explicite à chaque étape. Cette démonstration rejoue la machine d'états à
      six phases. Aucune sortie n'est opposable — c'est une vitrine pédagogique.
    </p>
  </header>

  {#if !casChoisi}
    <!-- Sélection du cas -->
    <h2 class="mb-3 text-lg font-semibold text-mrc-800">Choisir un cas d'enquête</h2>
    <div class="grid gap-4 md:grid-cols-3">
      {#each CAS as c}
        <button
          class="usage-card text-left {c.jouable ? '' : 'opacity-60'}"
          on:click={() => c.jouable && (casChoisi = c.id)}
          disabled={!c.jouable}
        >
          <div class="mb-1 text-xs font-medium uppercase tracking-wide text-mrc-400">{c.fiche}</div>
          <h3 class="mb-2 font-semibold text-mrc-900">{c.titre}</h3>
          <p class="text-sm text-mrc-600">{c.resume}</p>
          {#if !c.jouable}<div class="mt-3 text-xs font-medium text-mrc-400">À venir</div>{/if}
        </button>
      {/each}
    </div>

  {:else}
    <!-- Barre de phases + navigation déléguées au composant Stepper -->
    <Stepper
      steps={stepsBar}
      bind:current={phaseIdx}
      maxReached={phaseIdx}
      canNext={garde.ok}
      nextReason={garde.raison ?? ''}
      accent="amber"
    >
    <div class="grid gap-6 lg:grid-cols-3">

      <!-- Panneau phase courante -->
      <section class="lg:col-span-2 space-y-4">
        <div class="rounded-2xl border border-mrc-100 bg-white p-6 shadow-sm">
          <div class="mb-2 text-xs font-medium uppercase tracking-wide text-amber-600">
            Phase {phase.num} / 6
          </div>
          <h2 class="text-xl font-bold text-mrc-900">{phase.label}</h2>
          <dl class="mt-3 space-y-1.5 text-sm">
            <div><dt class="inline font-semibold text-mrc-700">Porteur : </dt><dd class="inline text-mrc-600">{phase.porteur}</dd></div>
            <div><dt class="inline font-semibold text-mrc-700">Sortie attendue : </dt><dd class="inline text-mrc-600">{phase.sortie}</dd></div>
            <div><dt class="inline font-semibold text-mrc-700">Précondition : </dt><dd class="inline text-mrc-600">{phase.precondition}</dd></div>
          </dl>

          <!-- Mécaniques propres à chaque phase -->
          <div class="mt-5 border-t border-mrc-100 pt-4">

            {#if phase.id === 'probleme'}
              <p class="mb-2 text-sm font-medium text-mrc-700">Inventaire des entités affectées</p>
              <div class="space-y-1.5">
                {#each inventaire as e}
                  <label class="flex items-center gap-2 text-sm text-mrc-700">
                    <input type="checkbox" bind:checked={e.inclus} disabled={inventaireConfirme} />
                    <span>{e.nom}</span>
                    <span class="rounded px-1.5 py-0.5 text-xs {e.type === 'non-humain' ? 'bg-fuchsia-100 text-fuchsia-700' : 'bg-sky-100 text-sky-700'}">{e.type}</span>
                  </label>
                {/each}
              </div>
              {#if !inventaireNonVide}
                <p class="mt-3 text-xs font-semibold text-red-600">[BLOCAGE] L'inventaire ne peut pas être vide.</p>
              {/if}
              <button
                class="mt-4 rounded-lg bg-mrc-700 px-4 py-2 text-sm font-medium text-white hover:bg-mrc-800 disabled:opacity-40"
                disabled={!inventaireNonVide || inventaireConfirme}
                on:click={() => (inventaireConfirme = true)}
              >
                {inventaireConfirme ? 'Inventaire confirmé ✓' : 'Confirmer l’inventaire'}
              </button>

            {:else if phase.id === 'enquete'}
              <p class="mb-3 text-sm text-mrc-600">
                L'agent d'extraction propose des écritures à partir des documents ingérés. Toutes
                sont <span class="font-medium text-red-600">non validées</span> : aucune n'est opposable à ce stade.
              </p>
              <button
                class="rounded-lg bg-mrc-700 px-4 py-2 text-sm font-medium text-white hover:bg-mrc-800 disabled:opacity-40"
                disabled={enqueteLancee}
                on:click={lancerStaging}
              >
                {enqueteLancee ? 'Staging produit ✓' : 'Lancer le staging LLM'}
              </button>

            {:else if phase.id === 'revision'}
              <p class="mb-3 text-sm text-mrc-600">
                Avant d'arbitrer, on stabilise les concepts de base (acteurs, unités, relations). Un
                concept qui change de sens en cours d'enquête doit être tracé.
              </p>
              <button
                class="rounded-lg bg-mrc-700 px-4 py-2 text-sm font-medium text-white hover:bg-mrc-800 disabled:opacity-40"
                disabled={basesStabilisees}
                on:click={() => (basesStabilisees = true)}
              >
                {basesStabilisees ? 'Primitives déclarées ✓' : 'Déclarer les primitives (Couche 0)'}
              </button>

            {:else if phase.id === 'deliberation'}
              {#if deliberationBloquee}
                <div class="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  <p class="font-semibold">[BLOCAGE R-HERMENEUTIQUE]</p>
                  <p class="mt-1">Des entités non-humaines, qui ne peuvent pas parler en leur nom, sont affectées.
                  La délibération est verrouillée tant qu'une représentation prospective n'est pas assurée.</p>
                  <button
                    class="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700"
                    on:click={() => (representationProspective = true)}
                  >
                    Désigner une représentation prospective
                  </button>
                </div>
              {:else}
                <p class="mb-2 text-xs font-medium text-emerald-700">✓ Représentation prospective assurée — délibération déverrouillée.</p>
              {/if}
              <label class="block text-sm font-medium text-mrc-700">Porteur de la dette (acteur identifié)</label>
              <input
                class="mt-1 w-full rounded-lg border border-mrc-200 px-3 py-2 text-sm"
                placeholder="ex. Coopérative agricole + Agence de bassin"
                bind:value={porteurDette}
                disabled={deliberationBloquee}
              />
              <p class="mt-1 text-xs text-mrc-500">Sans porteur désigné, la machine d'états interdit le passage au niveau critique.</p>

            {:else if phase.id === 'convention'}
              <p class="text-sm text-mrc-600">
                Chaque proposition doit être <span class="font-medium text-emerald-700">validée</span> (elle devient opposable)
                ou <span class="font-medium text-slate-600">archivée</span>. Le LLM ne valide jamais —
                c'est un acte humain assumé. Utilisez le journal à droite.
              </p>
              {#if ecritures.some((e) => e.statut === 'rouge')}
                <p class="mt-2 text-xs font-semibold text-red-600">Propositions encore non arbitrées : {ecritures.filter((e) => e.statut === 'rouge').length}</p>
              {/if}

            {:else if phase.id === 'mise_en_oeuvre'}
              <p class="mb-3 text-sm text-mrc-600">L'enquête est close. Bilan de session :</p>
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                  <div class="text-2xl font-bold text-emerald-700">{bilan.opposables}</div>
                  <div class="text-xs text-emerald-700">écritures opposables</div>
                </div>
                <div class="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div class="text-2xl font-bold text-slate-600">{bilan.archivees}</div>
                  <div class="text-xs text-slate-600">propositions archivées</div>
                </div>
                <div class="rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <div class="text-2xl font-bold text-amber-700">{bilan.signaux}</div>
                  <div class="text-xs text-amber-700">signaux ouverts</div>
                </div>
              </div>
              <p class="mt-4 text-xs text-mrc-500">
                Engagement à horizon potentiellement irréversible (capitaux non-humains, générations
                futures) : toute annulation ultérieure produira une nouvelle écriture, jamais une suppression.
              </p>
              <button class="mt-4 rounded-lg border border-mrc-200 px-4 py-2 text-sm font-medium text-mrc-700 hover:bg-mrc-50" on:click={reset}>
                Recommencer l'enquête
              </button>
            {/if}
          </div>
        </div>
      </section>

      <!-- Journal d'enquête -->
      <aside class="space-y-3">
        <MrcStatusBadge statut={bilan.opposables > 0 ? 'valide' : 'non-valide'} />
        <div class="rounded-2xl border border-mrc-100 bg-white p-4 shadow-sm">
          <h3 class="mb-3 text-sm font-semibold text-mrc-800">Journal d'enquête</h3>
          {#if !enqueteLancee}
            <p class="text-sm text-mrc-400">Les propositions apparaîtront après le staging (phase ENQUÊTE).</p>
          {:else}
            <div class="space-y-2">
              {#each ecritures as e}
                <div class="rounded-lg border p-3 text-xs {statutMeta[e.statut].cls}">
                  <div class="flex items-center justify-between gap-2">
                    <span class="rounded bg-white/60 px-1.5 py-0.5 font-medium">{e.type}</span>
                    <span class="flex items-center gap-1">
                      <span class="h-2 w-2 rounded-full {statutMeta[e.statut].dot}"></span>
                      {statutMeta[e.statut].label}
                    </span>
                  </div>
                  <p class="mt-1.5 font-medium">{e.texte}</p>
                  <p class="mt-1 italic opacity-80">{e.source}</p>
                  {#if phase.id === 'convention' && e.statut !== 'vert' && e.statut !== 'archive'}
                    <div class="mt-2 flex gap-1.5">
                      <button class="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700" on:click={() => valider(e.id)}>Valider</button>
                      {#if e.statut === 'rouge'}
                        <button class="rounded bg-amber-500 px-2 py-1 text-xs font-medium text-white hover:bg-amber-600" on:click={() => discuter(e.id)}>Discuter</button>
                      {/if}
                      <button class="rounded border border-slate-300 px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100" on:click={() => archiver(e.id)}>Archiver</button>
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </aside>
    </div>
    </Stepper>
  {/if}

  <p class="mt-10 border-t border-mrc-100 pt-4 text-xs text-mrc-400">
    Démonstration interactive — séquence 6 phases (note de révision specs Usage 2 & 3, MRC v5.5).
    Cas fictif anonymisé. Aucune écriture n'est opposable ; aucune donnée n'est conservée.
  </p>
</div>
