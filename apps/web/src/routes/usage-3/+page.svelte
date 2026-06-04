<script lang="ts">
  import MrcStatusBadge from '$lib/components/MrcStatusBadge.svelte';

  // ─────────────────────────────────────────────────────────────────────────────
  // Usage 3 — Registres symétriques opposables · cas BÉTONORD (anonymisé)
  //
  // Entreprise source : anonymisée sous le nom BÉTONORD (secteur béton préfabriqué).
  // Toutes les données chiffrées sont auto-déclarées [PLAUSIBLE, NON VÉRIFIÉ].
  // Source : témoignages publics recueillis lors du salon Produrable 2025.
  // Construction fictive — ne reflète pas des faits réels, ne cherche pas à décrire
  // la situation réelle de l'entreprise source.
  //
  // Structure : navigation non-linéaire entre registres parallèles.
  // F8 est le dispositif principal (Fiche Mode comptable étendu, Couche 2 MRC v5.5).
  // ─────────────────────────────────────────────────────────────────────────────

  type TypeRegistre = 'humain' | 'collectif' | 'organisation' | 'non-humain';
  type Workflow = 'rouge' | 'ambre' | 'vert';
  type StatutDette = 'NON_ATTRIBUEE' | 'EN_DELIBERATION' | 'ATTRIBUEE';

  interface Registre {
    id: string;
    nom: string;
    type: TypeRegistre;
    groupe: 'interne' | 'externe' | 'nh';
    description: string;
  }

  interface ContreEcriture {
    registre: string;
    sens: 'DÉBIT' | 'CRÉDIT' | 'INFO';
    libelle: string;
    workflow?: Workflow;
  }

  interface EcritureU3 {
    id: string;
    num: number;
    libelle: string;
    description: string;
    typageF8: string;
    modeMRC: string;
    registrePorteur: string;
    registresConcernes: string[];
    registresTemoin: string[];
    statutDette: StatutDette;
    workflow: Workflow;
    requiertRepresentationNH: boolean;
    prioriteCreancier: number | null;
    sourceDeclaree: string;
    esrsDatapoint: string;
    comptesCARE: string;
    signal?: string;
    ecriture: { sens: 'DÉBIT' | 'CRÉDIT'; libelle: string; detail?: string };
    contreEcritures: ContreEcriture[];
  }

  // ── REGISTRES ────────────────────────────────────────────────────────────────
  const REGISTRES: Registre[] = [
    // Internes BÉTONORD
    { id: 'r-dg',            nom: 'Direction générale',           type: 'humain',       groupe: 'interne', description: 'Porteur RSE principal · CSRD pilotée par la directrice juridique' },
    { id: 'r-site07',        nom: 'Site #7 (Artois)',             type: 'humain',       groupe: 'interne', description: 'Directeur de site · instrumentation eau' },
    { id: 'r-rse',           nom: 'Ambassadeurs RSE (×12)',       type: 'collectif',    groupe: 'interne', description: 'Réseau distribué dans toutes les fonctions · témoin interne' },
    { id: 'r-drh',           nom: 'DRH',                         type: 'humain',       groupe: 'interne', description: 'Index H/F · capabilités salariés' },
    { id: 'r-collab',        nom: 'Collectif salariés (1 000)',   type: 'collectif',    groupe: 'interne', description: 'Porteurs du réel du travail · registre F1 Travail' },
    // Externes
    { id: 'r-calpex',        nom: 'CALPEX (acquéreur)',           type: 'organisation', groupe: 'externe', description: 'Grand groupe cimentier · acquisition en cours' },
    { id: 'r-capinfra',      nom: 'CAPINFRA (ex-actionnaire)',    type: 'organisation', groupe: 'externe', description: 'Fonds PE/ESG · exigence RSE initiale' },
    { id: 'r-matpro',        nom: 'MATPRO (distributeur)',        type: 'organisation', groupe: 'externe', description: 'Client principal · scope 3 aval' },
    { id: 'r-carrex',        nom: 'CARREX (fournisseur granulats)',type: 'organisation',groupe: 'externe', description: 'Fournisseur granulats vierges + recyclés' },
    { id: 'r-creditvert',    nom: 'CRÉDIVERT (banque ESG)',       type: 'organisation', groupe: 'externe', description: 'Prêt ESG indexé sur indicateurs carbone et sécurité' },
    { id: 'r-deconstrock',   nom: 'DÉCONSTROCK (recyclage)',      type: 'organisation', groupe: 'externe', description: 'Partenaire granulats de déconstruction' },
    { id: 'r-minervalo',     nom: 'MINÉROVALO (REP PMCB)',        type: 'organisation', groupe: 'externe', description: 'Éco-organisme agréé · responsabilité élargie producteur' },
    { id: 'r-transbol',      nom: 'TRANSBOL (transporteurs PME)', type: 'collectif',    groupe: 'externe', description: 'PME transporteurs · effet de ruissellement CO₂' },
    // Non-humains
    { id: 'r-nappe',         nom: 'Nappes phréatiques',           type: 'non-humain',   groupe: 'nh', description: 'Commun hydrique local (50 sites) · représentation : Dir. RSE + tiers vérificateur' },
    { id: 'r-carrieres',     nom: 'Écosystèmes de carrières',     type: 'non-humain',   groupe: 'nh', description: 'Commun local (granulats, biodiversité) · représentation : Dir. technique + CARREX' },
    { id: 'r-atmosphere',    nom: 'Commun climatique',            type: 'non-humain',   groupe: 'nh', description: 'Atmosphère · dette scope 3 ~300 000 tCO₂/an · représentation : BÉTONORD + CRÉDIVERT + CALPEX' },
    { id: 'r-generations',   nom: 'Générations futures',          type: 'non-humain',   groupe: 'nh', description: '⚠ Représentation non encore désignée [ENGAGEMENT À HORIZON IRRÉVERSIBLE]' },
  ];

  // ── ÉCRITURES ────────────────────────────────────────────────────────────────
  const ECRITURES: EcritureU3[] = [
    {
      id: 'e1', num: 1,
      libelle: 'Eau site #7 — de 12 à 2 litres par tonne',
      description: '« On a une usine qui est passée de 12 litres par tonne de béton à deux. Parce que la CSRD nous a posé la question. » (dirigeant·e, Produrable 2025)',
      typageF8: 'e → d', modeMRC: 'F2 Milieu',
      registrePorteur: 'r-site07',
      registresConcernes: ['r-nappe'],
      registresTemoin: ['r-rse', 'r-creditvert'],
      statutDette: 'ATTRIBUEE', workflow: 'vert',
      requiertRepresentationNH: false,
      prioriteCreancier: 2,
      sourceDeclaree: 'Verbatim Produrable 2025 [PLAUSIBLE, NON VÉRIFIÉ]',
      esrsDatapoint: 'ESRS E3-4 · Consommation d\'eau (withdrawal from water-stressed areas)',
      comptesCARE: 'NH-EAU · Actif naturel eau · Mouvement M5 (réduction charge)',
      signal: undefined,
      ecriture: {
        sens: 'DÉBIT',
        libelle: 'Charge d\'instrumentation eau — capteurs IoT + SIG',
        detail: '45 000 € · 2023-Q3 · cible ≤ 2 L/tonne',
      },
      contreEcritures: [
        { registre: 'r-nappe', sens: 'CRÉDIT', libelle: 'Réduction de prélèvement : −830 m³/an attestés', workflow: 'vert' },
        { registre: 'r-creditvert', sens: 'INFO', libelle: 'Indicateur eau site #7 : seuil ≤ 2 L/tonne atteint → clause 3.b prêt ESG', workflow: 'vert' },
      ],
    },
    {
      id: 'e2', num: 2,
      libelle: 'Reporting CO₂ aux clients distributeurs',
      description: '« On est les premiers l\'année dernière à avoir fait un reporting à nos clients : vous m\'avez acheté X millions d\'euros et X tonnes de CO₂. » (dirigeant·e, Produrable 2025)',
      typageF8: 'C + E', modeMRC: 'F8',
      registrePorteur: 'r-dg',
      registresConcernes: ['r-matpro'],
      registresTemoin: ['r-atmosphere', 'r-calpex'],
      statutDette: 'ATTRIBUEE', workflow: 'vert',
      requiertRepresentationNH: false,
      prioriteCreancier: null,
      sourceDeclaree: 'Verbatim Produrable 2025 [SOURCE DÉCLARÉE]',
      esrsDatapoint: 'ESRS E1-6 · GHG scope 3 aval + G1-1 Transparence',
      comptesCARE: 'CC-TRANSPARENCE-CHAINE · Actif informationnel scope 3 · Mouvement M9',
      signal: undefined,
      ecriture: {
        sens: 'CRÉDIT',
        libelle: 'Obligation de transparence scope 3 aval — inscrite et datée',
        detail: '100% clients distributeurs > 1 M€/an · envoi avant 31 mars N+1',
      },
      contreEcritures: [
        { registre: 'r-matpro', sens: 'CRÉDIT', libelle: '23 500 tCO₂ pour 19,6 M€ achetés reçus — obligation CSRD scope 3 amont activée', workflow: 'vert' },
        { registre: 'r-matpro', sens: 'DÉBIT', libelle: 'Obligation de déclaration scope 3 amont dans leur propre bilan GES', workflow: 'vert' },
        { registre: 'r-atmosphere', sens: 'INFO', libelle: 'Dette scope 3 aval inscrite dans la chaîne — non effaçable par changement d\'actionnaire', workflow: 'vert' },
      ],
    },
    {
      id: 'e3', num: 3,
      libelle: 'Granulats recyclés — −3 000 t/an de prélèvement vierge',
      description: '« Est-ce qu\'on peut mettre plus de granulats recyclés dans nos produits ? On va ralentir notre intensité sur les carrières. » (dirigeant·e, Produrable 2025)',
      typageF8: 'D + C', modeMRC: 'F2 + F8',
      registrePorteur: 'r-dg',
      registresConcernes: ['r-carrieres', 'r-carrex'],
      registresTemoin: ['r-rse', 'r-calpex'],
      statutDette: 'ATTRIBUEE', workflow: 'vert',
      requiertRepresentationNH: false,
      prioriteCreancier: 2,
      sourceDeclaree: 'Verbatim Produrable 2025 [PLAUSIBLE, NON VÉRIFIÉ]',
      esrsDatapoint: 'ESRS E4-6 · Impacts biodiversité + E5-1 Utilisation ressources',
      comptesCARE: 'NH-GRANULATS · Réduction dette naturelle · Mouvement M7',
      signal: 'R-CODEGRADATION_régrès si ratio < 5% sur 2 exercices',
      ecriture: {
        sens: 'CRÉDIT',
        libelle: 'Réduction dette NH carrières — 15% granulats recyclés (ligne parpaings)',
        detail: 'Surcoût +0,8 €/t · −3 000 t/an vierges',
      },
      contreEcritures: [
        { registre: 'r-carrieres', sens: 'CRÉDIT', libelle: 'Réduction prélèvement vierge −3 000 t/an attestée (BL CARREX recyclats)', workflow: 'vert' },
        { registre: 'r-carrex', sens: 'CRÉDIT', libelle: 'Revenu nouvelle filière recyclats : +32 000 €/an', workflow: 'vert' },
      ],
    },
    {
      id: 'e4', num: 4,
      libelle: 'Prêt ESG CRÉDIVERT — taux indexé sur indicateurs',
      description: '« Mon directeur financier est ravi. Les banques vous demandent EcoVadis, ça coche une case. Les entreprises qui n\'ont pas ça paient un taux plus élevé. » (dirigeant·e, Produrable 2025)',
      typageF8: 'e + D', modeMRC: 'F8',
      registrePorteur: 'r-creditvert',
      registresConcernes: ['r-dg'],
      registresTemoin: ['r-calpex', 'r-capinfra', 'r-nappe', 'r-atmosphere'],
      statutDette: 'ATTRIBUEE', workflow: 'vert',
      requiertRepresentationNH: false,
      prioriteCreancier: 5,
      sourceDeclaree: 'Verbatim Produrable 2025 [PLAUSIBLE, NON VÉRIFIÉ]',
      esrsDatapoint: 'ESRS G1-3 · Financement durable + E1-6 (conditions ESG)',
      comptesCARE: 'DF-ESG · Dette financière conditionnelle · Mouvement M2',
      signal: 'R-PRIORITE-CREANCIERS_VIOLEE si distribution avant attestation NH',
      ecriture: {
        sens: 'DÉBIT',
        libelle: 'Taux réduit −0,40% sur 35 M€ accordé (−140 k€/an)',
        detail: 'Condition : scope 1-2 < 6 500 tCO₂/an + TF0 < 3,5 · révision semestrielle',
      },
      contreEcritures: [
        { registre: 'r-dg', sens: 'CRÉDIT', libelle: 'Accès liquidité à taux réduit (−140 k€/an)', workflow: 'vert' },
        { registre: 'r-dg', sens: 'DÉBIT', libelle: 'Obligation de maintien indicateurs ESG (7 ans) · cosignée DG + DF', workflow: 'vert' },
        { registre: 'r-atmosphere', sens: 'INFO', libelle: 'R-PRIORITE-CREANCIERS : dette NH subordonnante au remboursement financier', workflow: 'vert' },
      ],
    },
    {
      id: 'e5', num: 5,
      libelle: 'Intensité carbone — 1,2 kg CO₂ par euro généré',
      description: '« On est les seuls à communiquer sur notre intensité carbone : 1,2 kg de CO₂ par euro généré. 92% en scope 3. » (dirigeant·e, Produrable 2025)',
      typageF8: 'P → D', modeMRC: 'F8',
      registrePorteur: 'r-rse',
      registresConcernes: ['r-atmosphere', 'r-calpex'],
      registresTemoin: ['r-creditvert', 'r-matpro', 'r-generations'],
      statutDette: 'EN_DELIBERATION', workflow: 'ambre',
      requiertRepresentationNH: false,
      prioriteCreancier: 3,
      sourceDeclaree: 'Verbatim Produrable 2025 + FDES + BGS [PLAUSIBLE, NON VÉRIFIÉ]',
      esrsDatapoint: 'ESRS E1-6 · GHG scope 1/2/3 par activité et par intensité',
      comptesCARE: 'NH-ATMOSPHERE · Passif CARE : dette atmosphérique · valuemètre CO₂ × SCC · Mouvement M1',
      signal: 'porteur_scope3_manquant — CALPEX doit désigner un porteur sous 6 mois',
      ecriture: {
        sens: 'DÉBIT',
        libelle: 'Prélèvement carbone scope 3 : ~300 000 tCO₂éq/an (92% scope 3)',
        detail: 'Date inscription : 2024-01-15 · [PLAUSIBLE, NON VÉRIFIÉ — dérivé 1,2 kg × 250 M€]',
      },
      contreEcritures: [
        { registre: 'r-atmosphere', sens: 'CRÉDIT', libelle: 'Dette atmosphérique : obligation de trajectoire scope 3 — EN DÉLIBÉRATION · porteur CALPEX manquant', workflow: 'ambre' },
        { registre: 'r-calpex', sens: 'CRÉDIT', libelle: 'Obligation de trajectoire scope 3 reprise à l\'acquisition — porteur à désigner sous 6 mois', workflow: 'ambre' },
        { registre: 'r-generations', sens: 'INFO', libelle: '⚠ Dette scope 3 inscrite et non effaçable · horizon intergénérationnel [ENGAGEMENT À HORIZON IRRÉVERSIBLE]', workflow: 'ambre' },
      ],
    },
    {
      id: 'e6', num: 6,
      libelle: 'REP PMCB — membre fondateur MINÉROVALO',
      description: 'Membre fondateur de l\'éco-organisme REP PMCB (décret 2021-1941). Objectif : 90% valorisation inertes d\'ici 2028. 4 000+ points de reprise, 10+ M t valorisées.',
      typageF8: 'C + D', modeMRC: 'F8',
      registrePorteur: 'r-dg',
      registresConcernes: ['r-minervalo', 'r-carrieres'],
      registresTemoin: ['r-matpro'],
      statutDette: 'ATTRIBUEE', workflow: 'vert',
      requiertRepresentationNH: false,
      prioriteCreancier: null,
      sourceDeclaree: 'Décret n° 2021-1941 du 31/12/2021 [SOURCE DÉCLARÉE, vérifiable] · données entreprise [PLAUSIBLE, NON VÉRIFIÉ]',
      esrsDatapoint: 'ESRS E5-1 · Économie circulaire — flux entrants/sortants de ressources',
      comptesCARE: 'CC-MINERAUX · Contribution communale · Mouvement M9',
      signal: 'taux_substitution_effectif_non_mesuré — la REP garantit la reprise, pas la substitution carrières',
      ecriture: {
        sens: 'CRÉDIT',
        libelle: 'Obligation de reprise gratuite des inertes — inscrite (REP PMCB légale)',
        detail: 'Tout client pro apportant des inertes BÉTONORD → point de reprise MINÉROVALO accessible',
      },
      contreEcritures: [
        { registre: 'r-minervalo', sens: 'CRÉDIT', libelle: 'Ressource reçue + obligation de valorisation ≥ 90% inertes d\'ici 2028 (porteur : MINÉROVALO)', workflow: 'vert' },
        { registre: 'r-carrieres', sens: 'CRÉDIT', libelle: 'Réduction de prélèvement vierge potentielle — EN DÉLIBÉRATION (lien substitution non garanti)', workflow: 'ambre' },
        { registre: 'r-matpro', sens: 'INFO', libelle: 'Droit de reprise gratuite des inertes via réseau MINÉROVALO — opposable dès l\'achat', workflow: 'vert' },
      ],
    },
    {
      id: 'e7', num: 7,
      libelle: 'Gamme Re-Matière® — 100% granulats recyclés',
      description: 'Gamme produits fabriqués à partir de granulats de déconstruction et de matériaux biosourcés. Zéro granulat vierge sur ce périmètre.',
      typageF8: 'D + C', modeMRC: 'F2 + F8',
      registrePorteur: 'r-dg',
      registresConcernes: ['r-carrieres', 'r-deconstrock'],
      registresTemoin: ['r-minervalo', 'r-atmosphere'],
      statutDette: 'ATTRIBUEE', workflow: 'vert',
      requiertRepresentationNH: false,
      prioriteCreancier: 2,
      sourceDeclaree: 'Données entreprise [PLAUSIBLE, NON VÉRIFIÉ]',
      esrsDatapoint: 'ESRS E4-6 · Impacts biodiversité + E5-1 Ressources',
      comptesCARE: 'NH-GRANULATS · Réduction dette naturelle = ZÉRO sur périmètre gamme · Mouvement M7',
      signal: 'volume_Re-Matière_non_mesuré — réduction NH attestée mais non quantifiée',
      ecriture: {
        sens: 'CRÉDIT',
        libelle: 'Obligation de soin NH inscrite dans la conception produit — D = 0 (100% recyclés)',
        detail: 'Périmètre : gamme Re-Matière® · Granulats déconstruction (DÉCONSTROCK) + coquilles Saint-Jacques',
      },
      contreEcritures: [
        { registre: 'r-carrieres', sens: 'CRÉDIT', libelle: 'Prélèvement vierge = ZÉRO pour la gamme Re-Matière® — écriture D la plus complète du registre', workflow: 'vert' },
        { registre: 'r-deconstrock', sens: 'CRÉDIT', libelle: 'Débouché valorisant pour granulats de déconstruction + coquilles Saint-Jacques (couplage inter-filières)', workflow: 'vert' },
      ],
    },
    {
      id: 'e8', num: 8,
      libelle: 'Taux de rebut — « aucune fierté à jeter un parpaing »',
      description: '« 50 000 parpaings jetés : super papa, tu as bien bossé. On a mis en place des indicateurs rebut dans chaque usine — tableau de bord mensuel. » (dirigeant·e, Produrable 2025)',
      typageF8: 'E → réduction P', modeMRC: 'F1 + F8',
      registrePorteur: 'r-collab',
      registresConcernes: ['r-carrieres', 'r-atmosphere'],
      registresTemoin: ['r-rse', 'r-dg'],
      statutDette: 'EN_DELIBERATION', workflow: 'ambre',
      requiertRepresentationNH: false,
      prioriteCreancier: null,
      sourceDeclaree: 'Verbatim Produrable 2025 [SOURCE DÉCLARÉE] · traduction NH estimée [PLAUSIBLE, NON VÉRIFIÉ]',
      esrsDatapoint: 'ESRS E1-6 (scope 3 gaspillage matière) + S1-9 Santé et sécurité',
      comptesCARE: 'CH-REBUT · corrélat NH-GRANULATS + NH-ATMOSPHERE · Mouvement M5',
      signal: 'rebut_non_traduit_en_écriture_NH — indicateur suivi mais non converti en dette NH',
      ecriture: {
        sens: 'CRÉDIT',
        libelle: 'Obligation de qualité — collectif de production comme juge légitime (F1 Travail)',
        detail: 'Critère : taux de rebut ≤ cible · tableau de bord mensuel partagé actionnaire',
      },
      contreEcritures: [
        { registre: 'r-carrieres', sens: 'CRÉDIT', libelle: 'Réduction prélèvement NH par suppression rebut — EN DÉLIBÉRATION (non traduit en écriture NH formelle)', workflow: 'ambre' },
        { registre: 'r-atmosphere', sens: 'INFO', libelle: '1 parpaing jeté ≈ 0,96 kgCO₂ gâché · traduction NH à formaliser [PLAUSIBLE, NON VÉRIFIÉ]', workflow: 'ambre' },
      ],
    },
    {
      id: 'e9', num: 9,
      libelle: 'Ruissellement CO₂ — plan de progrès imposé aux transporteurs PME',
      description: '« On impose à nos transporteurs de nous donner leur plan de progrès sur les émissions de CO₂. Ce n\'est pas des ETI, c\'est des PME. Ils disent : comment je fais ? Alors on les aide. » (dirigeant·e, Produrable 2025)',
      typageF8: 'E + D', modeMRC: 'F8',
      registrePorteur: 'r-dg',
      registresConcernes: ['r-transbol'],
      registresTemoin: ['r-atmosphere', 'r-creditvert'],
      statutDette: 'EN_DELIBERATION', workflow: 'ambre',
      requiertRepresentationNH: false,
      prioriteCreancier: null,
      sourceDeclaree: 'Verbatim Produrable 2025 [SOURCE DÉCLARÉE]',
      esrsDatapoint: 'ESRS E1-6 · scope 3 catégorie 4 (transport aval)',
      comptesCARE: 'NH-ATMOSPHERE-S3 · Engagement réduction scope 3 · Mouvement M3',
      signal: 'ruissellement_scope3_non_quantifié — plans exigés mais agrégation non calculée',
      ecriture: {
        sens: 'CRÉDIT',
        libelle: 'Obligation contractuelle : plan de progrès CO₂ annuel + clause sociale exigés',
        detail: 'Renouvellement annuel · accompagnement gratuit calcul BGS · clause droit du travail',
      },
      contreEcritures: [
        { registre: 'r-transbol', sens: 'CRÉDIT', libelle: 'Accès expertise CO₂ + accompagnement gratuit (montée en compétences RSE sans coût)', workflow: 'vert' },
        { registre: 'r-transbol', sens: 'DÉBIT', libelle: 'Obligation annuelle plan de progrès CO₂ + clause sociale — porteur : dirigeant PME [⚠ sans délibération préalable]', workflow: 'vert' },
        { registre: 'r-atmosphere', sens: 'INFO', libelle: 'Réduction scope 3 transport EN DÉLIBÉRATION — chaîne contractuelle active, réduction mesurée non calculée', workflow: 'ambre' },
      ],
    },
    {
      id: 'e10', num: 10,
      libelle: 'Index H/F 85/100 — dette sociale résiduelle (0/10 hautes rémunérations)',
      description: 'Index égalité H/F 2025 : 85/100. Décomposition : 35/40 + 20/20 + 15/15 + 15/15 = 85 — mais 0/10 sur les 10 plus hautes rémunérations.',
      typageF8: 'C + D sociale', modeMRC: 'F1',
      registrePorteur: 'r-drh',
      registresConcernes: ['r-collab'],
      registresTemoin: ['r-dg'],
      statutDette: 'EN_DELIBERATION', workflow: 'ambre',
      requiertRepresentationNH: false,
      prioriteCreancier: 4,
      sourceDeclaree: 'Publication légale obligatoire [SOURCE DÉCLARÉE, vérifiable]',
      esrsDatapoint: 'ESRS S1-16 · Gender pay gap + S1-17 Violence et harcèlement',
      comptesCARE: 'CH-EQUITE (4 indicateurs vert) + DS-HAUTES-REMUN (0/10) · Mouvement M1 pour dette',
      signal: 'hautes_rémunérations_inégales — plan d\'action formalisé manquant',
      ecriture: {
        sens: 'CRÉDIT',
        libelle: 'Index H/F 2025 publié (obligation légale) — 4 indicateurs ATTRIBUÉS',
        detail: '35/40 rémunérations · 20/20 augmentations · 15/15 promotions · 15/15 retour congé maternité',
      },
      contreEcritures: [
        { registre: 'r-collab', sens: 'CRÉDIT', libelle: 'Augmentations égales (20/20) + promotions égales (15/15) + retour congé maternité (15/15) — ATTRIBUÉS', workflow: 'vert' },
        { registre: 'r-collab', sens: 'DÉBIT', libelle: 'Inégalité hautes rémunérations 0/10 — dette sociale EN DÉLIBÉRATION · plan d\'action manquant', workflow: 'ambre' },
      ],
    },
  ];

  // ── R-PRIORITÉ-CRÉANCIERS ────────────────────────────────────────────────────
  const PRIORITES = [
    { num: 1, libelle: 'Capabilités plancher (eau potable, sécurité sites)', ecritures: ['e1'], statut: 'vert' as Workflow },
    { num: 2, libelle: 'NH eau (R-NAPPE) + NH carrières/biodiversité (R-CARRIERES)', ecritures: ['e1','e3','e7'], statut: 'vert' as Workflow },
    { num: 3, libelle: 'NH atmosphère — trajectoire scope 3 (R-ATMOSPHERE)', ecritures: ['e5','e9'], statut: 'ambre' as Workflow },
    { num: 4, libelle: 'Dette sociale — collectif salariés (R-COLLAB)', ecritures: ['e10'], statut: 'ambre' as Workflow },
    { num: 5, libelle: 'Finances — prêt CRÉDIVERT ESG', ecritures: ['e4'], statut: 'vert' as Workflow },
    { num: 6, libelle: 'Distribution discrétionnaire — CALPEX', ecritures: [], statut: 'rouge' as Workflow },
  ];

  // ── ÉTAT UI ───────────────────────────────────────────────────────────────────
  let onglet: 'registres' | 'esrs' | 'care' = 'registres';
  let registreSelectionne: string | null = null;
  let ecritureSelectionnee: string | null = null;
  let incidentActif = false;
  let incidentEtape: 0 | 1 | 2 | 3 = 0;

  // registre sélectionné
  $: reg = REGISTRES.find(r => r.id === registreSelectionne) ?? null;

  // écritures concernant ce registre (inscripteur OU concerné OU témoin)
  $: ecrituresRegistre = ECRITURES.filter(e =>
    e.registrePorteur === registreSelectionne ||
    e.registresConcernes.includes(registreSelectionne ?? '') ||
    e.registresTemoin.includes(registreSelectionne ?? '')
  );

  // écriture sélectionnée
  $: ecr = ECRITURES.find(e => e.id === ecritureSelectionnee) ?? null;

  // perspective de l'écriture sélectionnée dans le registre courant
  $: perspectiveCourante = ecr
    ? ecr.registrePorteur === registreSelectionne ? 'inscripteur'
      : ecr.registresConcernes.includes(registreSelectionne ?? '') ? 'concerné'
      : 'témoin'
    : null;

  // signaux ouverts
  const signauxOuverts = ECRITURES.filter(e => e.signal).map(e => ({ id: e.id, num: e.num, signal: e.signal!, workflow: e.workflow }));

  // compteurs bilan
  $: nVert  = ECRITURES.filter(e => e.workflow === 'vert').length;
  $: nAmbre = ECRITURES.filter(e => e.workflow === 'ambre').length;

  // helpers
  function regNom(id: string) { return REGISTRES.find(r => r.id === id)?.nom ?? id; }
  function regType(id: string): TypeRegistre { return REGISTRES.find(r => r.id === id)?.type ?? 'organisation'; }

  const wfCls: Record<Workflow, string> = {
    rouge:  'border-red-200 bg-red-50 text-red-800',
    ambre:  'border-amber-200 bg-amber-50 text-amber-800',
    vert:   'border-emerald-200 bg-emerald-50 text-emerald-800',
  };
  const wfDot: Record<Workflow, string> = {
    rouge:  'bg-red-400', ambre:  'bg-amber-400', vert:   'bg-emerald-400',
  };
  const wfLabel: Record<Workflow, string> = {
    rouge: 'Non validée', ambre: 'En délibération', vert: 'Opposable',
  };
  const typeCls: Record<TypeRegistre, string> = {
    humain:       'bg-sky-100 text-sky-700',
    collectif:    'bg-sky-100 text-sky-700',
    organisation: 'bg-indigo-100 text-indigo-700',
    'non-humain': 'bg-fuchsia-100 text-fuchsia-700',
  };
  const sensLabel: Record<string, string> = {
    'DÉBIT': '↑ DÉBIT', 'CRÉDIT': '↓ CRÉDIT', 'INFO': 'ℹ INFO',
  };
  const sensCls: Record<string, string> = {
    'DÉBIT':  'text-rose-700 font-semibold',
    'CRÉDIT': 'text-emerald-700 font-semibold',
    'INFO':   'text-slate-500',
  };

  type OngletId = 'registres' | 'esrs' | 'care';
  const ONGLETS: { id: OngletId; label: string; icon: string }[] = [
    { id: 'registres', label: 'Registres', icon: '⚖️' },
    { id: 'esrs',      label: 'ESRS datapoints', icon: '📋' },
    { id: 'care',      label: 'Comptabilité CARE', icon: '€' },
  ];

  function selOnglet(id: OngletId) {
    onglet = id;
    registreSelectionne = null;
    ecritureSelectionnee = null;
  }
  function selReg(id: string) {
    registreSelectionne = registreSelectionne === id ? null : id;
    ecritureSelectionnee = null;
  }
  function selEcr(id: string) {
    ecritureSelectionnee = ecritureSelectionnee === id ? null : id;
  }
  function avancerIncident() {
    if (incidentEtape === 0) incidentEtape = 1;
    else if (incidentEtape === 1) incidentEtape = 2;
    else if (incidentEtape === 2) incidentEtape = 3;
  }
</script>

<svelte:head>
  <title>Usage 3 — Registres symétriques opposables · MRC v5.5</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">

  <!-- ── EN-TÊTE ── -->
  <header class="mb-8">
    <div class="mb-1 text-xs font-medium uppercase tracking-wide text-emerald-600">Usage 3 · Infrastructurel</div>
    <h1 class="text-2xl font-bold text-mrc-900">Tenir un registre opposable</h1>
    <p class="mt-3 max-w-3xl text-mrc-600">
      Un registre opposable n'est pas une base de données : chaque écriture inscrite par un acteur
      produit des <strong>contre-écritures miroir</strong> dans les registres des acteurs concernés
      et témoins — au même hash, avec des perspectives différentes. Ce cas illustre une entreprise
      de béton préfabriqué — <span class="italic">cas fictif construit à partir de témoignages publics (Produrable 2025), ne reflétant pas des faits réels</span>
      avec ses parties prenantes internes, externes et non-humaines.
    </p>
    <div class="mt-4 flex flex-wrap gap-2 text-xs text-mrc-500">
      <span class="rounded bg-mrc-100 px-2 py-0.5">Fiche F8 — Mode comptable étendu</span>
      <span class="rounded bg-mrc-100 px-2 py-0.5">R-PRIORITE-CREANCIERS</span>
      <span class="rounded bg-mrc-100 px-2 py-0.5">Typage P-C-E-D-e-d</span>
      <span class="rounded bg-mrc-100 px-2 py-0.5">10 écritures symétriques</span>
      <span class="rounded bg-mrc-100 px-2 py-0.5">Données auto-déclarées — non auditées</span>
    </div>
  </header>

  <MrcStatusBadge statut="en-cours" grammaire="F8 — Mode comptable · F2 Milieu · F1 Travail" modele="Cas anonymisé BÉTONORD" />

  <!-- ── BILAN RAPIDE ── -->
  <div class="mt-6 mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
    <div class="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-center">
      <div class="text-2xl font-bold text-emerald-700">{nVert}</div>
      <div class="text-xs text-emerald-600">Écritures opposables</div>
    </div>
    <div class="rounded-xl border border-amber-200 bg-amber-50 p-3 text-center">
      <div class="text-2xl font-bold text-amber-700">{nAmbre}</div>
      <div class="text-xs text-amber-600">En délibération</div>
    </div>
    <div class="rounded-xl border border-red-200 bg-red-50 p-3 text-center">
      <div class="text-2xl font-bold text-red-700">{signauxOuverts.length}</div>
      <div class="text-xs text-red-600">Signaux ouverts</div>
    </div>
    <div class="rounded-xl border border-mrc-100 bg-white p-3 text-center">
      <div class="text-2xl font-bold text-mrc-700">{REGISTRES.length}</div>
      <div class="text-xs text-mrc-500">Registres actifs</div>
    </div>
  </div>

  <!-- ── ONGLETS ── -->
  <div class="mb-6 flex gap-1 rounded-xl border border-mrc-100 bg-mrc-50 p-1">
    {#each ONGLETS as o}
      <button
        class="flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors
          {onglet === o.id ? 'bg-white shadow-sm text-mrc-900' : 'text-mrc-500 hover:text-mrc-700'}"
        on:click={() => selOnglet(o.id)}
      >{o.icon} {o.label}</button>
    {/each}
  </div>

  <!-- ═══════════════════════════════════════════════════════════════════════════
       ONGLET 1 — REGISTRES
  ═══════════════════════════════════════════════════════════════════════════ -->
  {#if onglet === 'registres'}
  <div class="grid gap-4 lg:grid-cols-3">

    <!-- Panneau gauche — liste des registres -->
    <aside class="space-y-3">
      {#each [['interne','BÉTONORD — Internes'],['externe','Parties prenantes externes'],['nh','Entités non-humaines']] as [groupe, titre]}
        <div>
          <h3 class="mb-1.5 text-xs font-semibold uppercase tracking-wide
            {groupe === 'nh' ? 'text-fuchsia-600' : groupe === 'externe' ? 'text-indigo-600' : 'text-sky-600'}">
            {titre}
          </h3>
          {#each REGISTRES.filter(r => r.groupe === groupe) as r}
            {@const ecrs = ECRITURES.filter(e => e.registrePorteur === r.id || e.registresConcernes.includes(r.id))}
            {@const ambre = ecrs.filter(e => e.workflow === 'ambre').length}
            <button
              class="w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors mb-1
                {registreSelectionne === r.id
                  ? 'border-emerald-400 bg-emerald-50 shadow-sm'
                  : r.groupe === 'nh'
                    ? 'border-fuchsia-100 bg-fuchsia-50/50 hover:border-fuchsia-300'
                    : 'border-mrc-100 bg-white hover:border-mrc-300'}"
              on:click={() => selReg(r.id)}
            >
              <div class="flex items-center justify-between gap-2">
                <span class="font-medium text-mrc-800 leading-tight">{r.nom}</span>
                <span class="shrink-0 rounded px-1.5 py-0.5 text-xs {typeCls[r.type]}">{r.type}</span>
              </div>
              {#if ecrs.length}
                <div class="mt-1 flex gap-1.5">
                  <span class="text-xs text-mrc-400">{ecrs.length} écriture{ecrs.length > 1 ? 's' : ''}</span>
                  {#if ambre > 0}<span class="text-xs text-amber-600">· {ambre} ambre</span>{/if}
                </div>
              {/if}
              {#if r.id === 'r-generations'}
                <div class="mt-1 text-xs text-fuchsia-600 font-medium">⚠ Représentation non désignée</div>
              {/if}
            </button>
          {/each}
        </div>
      {/each}
    </aside>

    <!-- Panneau centre — écritures du registre sélectionné -->
    <section class="space-y-3">
      {#if !reg}
        <div class="rounded-xl border border-mrc-100 bg-mrc-50 p-6 text-center text-mrc-400 text-sm">
          ← Sélectionnez un registre pour voir ses écritures
        </div>
      {:else}
        <div class="rounded-xl border border-mrc-100 bg-white p-4 shadow-sm">
          <div class="flex items-start justify-between gap-2 mb-1">
            <h2 class="font-semibold text-mrc-900">{reg.nom}</h2>
            <span class="shrink-0 rounded px-1.5 py-0.5 text-xs {typeCls[reg.type]}">{reg.type}</span>
          </div>
          <p class="text-xs text-mrc-500">{reg.description}</p>
        </div>

        {#if ecrituresRegistre.length === 0}
          <div class="text-sm text-mrc-400 text-center py-4">Aucune écriture dans ce registre</div>
        {:else}
          {#each ecrituresRegistre as e}
            {@const perspective = e.registrePorteur === reg.id ? 'inscripteur'
              : e.registresConcernes.includes(reg.id) ? 'concerné' : 'témoin'}
            <button
              class="w-full rounded-xl border text-left transition-all {wfCls[e.workflow]}
                {ecritureSelectionnee === e.id ? 'ring-2 ring-emerald-400' : 'hover:shadow-sm'}"
              on:click={() => selEcr(e.id)}
            >
              <div class="px-4 pt-3 pb-2">
                <div class="mb-1 flex items-center justify-between gap-2">
                  <span class="text-xs font-semibold">E{e.num} · {e.typageF8}</span>
                  <div class="flex items-center gap-1.5">
                    <span class="text-xs rounded px-1.5 py-0.5 bg-white/70 text-mrc-600">{perspective}</span>
                    <span class="h-2 w-2 rounded-full {wfDot[e.workflow]}"></span>
                  </div>
                </div>
                <div class="font-medium text-sm leading-snug">{e.libelle}</div>
                <div class="mt-1 text-xs opacity-75 font-mono">{e.modeMRC}</div>
              </div>
            </button>
          {/each}
        {/if}
      {/if}
    </section>

    <!-- Panneau droit — détail écriture + contre-écritures miroir -->
    <section class="space-y-3">
      {#if !ecr}
        <div class="rounded-xl border border-mrc-100 bg-mrc-50 p-6 text-center text-mrc-400 text-sm">
          ← Sélectionnez une écriture pour voir ses contre-écritures miroir
        </div>
      {:else}
        <!-- Écriture principale -->
        <div class="rounded-xl border {wfCls[ecr.workflow]} p-4 shadow-sm">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-bold uppercase tracking-wide">E{ecr.num} — Écriture principale</span>
            <span class="text-xs font-semibold {wfDot[ecr.workflow].replace('bg-','text-')}">
              {wfLabel[ecr.workflow]}
            </span>
          </div>
          <div class="font-semibold text-sm mb-1">{ecr.libelle}</div>
          <div class="text-xs opacity-80 mb-3 leading-relaxed">{ecr.description}</div>
          <div class="rounded-lg bg-white/60 p-3 space-y-1.5 text-xs">
            <div><span class="{sensCls[ecr.ecriture.sens]}">{sensLabel[ecr.ecriture.sens]}</span> — {ecr.ecriture.libelle}</div>
            {#if ecr.ecriture.detail}<div class="text-mrc-500 pl-4">{ecr.ecriture.detail}</div>{/if}
            <div class="text-mrc-400 pt-1">Inscripteur : <span class="font-medium text-mrc-600">{regNom(ecr.registrePorteur)}</span></div>
            <div class="text-mrc-400">Typage F8 : <span class="font-mono font-medium text-mrc-700">{ecr.typageF8}</span></div>
          </div>
          {#if ecr.prioriteCreancier}
            <div class="mt-2 text-xs text-mrc-500">R-PRIORITE-CREANCIERS — niveau <strong>{ecr.prioriteCreancier}</strong></div>
          {/if}
          {#if ecr.signal}
            <div class="mt-2 rounded border border-amber-300 bg-amber-50 px-2 py-1.5 text-xs text-amber-800">
              ⚠ Signal ouvert : {ecr.signal}
            </div>
          {/if}
        </div>

        <!-- Contre-écritures miroir -->
        {#if ecr.contreEcritures.length > 0}
          <div>
            <h4 class="text-xs font-semibold text-mrc-500 uppercase tracking-wide mb-2">Contre-écritures miroir</h4>
            {#each ecr.contreEcritures as ce}
              {@const ceWf = ce.workflow ?? 'vert'}
              <div class="mb-2 rounded-xl border {wfCls[ceWf]} p-3 text-xs">
                <div class="flex items-center justify-between mb-1 gap-2">
                  <span class="font-medium text-mrc-700">{regNom(ce.registre)}</span>
                  <span class="shrink-0 rounded px-1.5 py-0.5 bg-white/70 {typeCls[regType(ce.registre)]}">{regType(ce.registre)}</span>
                </div>
                <span class="{sensCls[ce.sens]}">{sensLabel[ce.sens]}</span>
                <span class="ml-1">{ce.libelle}</span>
              </div>
            {/each}
          </div>
        {/if}

        <!-- Source -->
        <div class="rounded-lg border border-mrc-100 bg-white p-3 text-xs text-mrc-400">
          <span class="font-medium text-mrc-600">Source :</span> {ecr.sourceDeclaree}
        </div>
      {/if}
    </section>
  </div>

  <!-- R-PRIORITÉ-CRÉANCIERS -->
  <div class="mt-8 rounded-2xl border border-mrc-100 bg-white p-5 shadow-sm">
    <h3 class="mb-3 font-semibold text-mrc-800">R-PRIORITE-CREANCIERS — ordre d'inscription au closing de l'acquisition</h3>
    <p class="mb-4 text-xs text-mrc-500">La distribution à CALPEX est bloquée tant que les niveaux 3 et 4 restent en délibération (ambre).</p>
    <div class="space-y-2">
      {#each PRIORITES as p}
        <div class="flex items-center gap-3 rounded-lg border p-2.5 {
          p.statut === 'vert'  ? 'border-emerald-200 bg-emerald-50' :
          p.statut === 'ambre' ? 'border-amber-200 bg-amber-50' :
                                 'border-red-200 bg-red-50'}">
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold
            {p.statut === 'vert' ? 'bg-emerald-200 text-emerald-800' :
             p.statut === 'ambre' ? 'bg-amber-200 text-amber-800' :
                                    'bg-red-200 text-red-800'}">{p.num}</span>
          <span class="flex-1 text-sm {
            p.statut === 'vert'  ? 'text-emerald-800' :
            p.statut === 'ambre' ? 'text-amber-800' : 'text-red-800'}">{p.libelle}</span>
          <span class="text-xs font-medium {
            p.statut === 'vert'  ? 'text-emerald-600' :
            p.statut === 'ambre' ? 'text-amber-600' : 'text-red-600'}">
            {p.statut === 'vert' ? '✓ Satisfait' : p.statut === 'ambre' ? '⏳ En délibération' : '⛔ Bloqué'}
          </span>
        </div>
      {/each}
    </div>
  </div>

  <!-- Signaux ouverts -->
  {#if signauxOuverts.length > 0}
  <div class="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5">
    <h3 class="mb-3 font-semibold text-amber-800">{signauxOuverts.length} signaux ouverts à la date du cas</h3>
    <div class="space-y-1.5">
      {#each signauxOuverts as s}
        <div class="flex items-start gap-2 text-xs text-amber-700">
          <span class="shrink-0 font-bold">E{s.num}</span>
          <span>{s.signal}</span>
        </div>
      {/each}
    </div>
  </div>
  {/if}

  <!-- ── SCÈNE D'INCIDENT ── -->
  <div class="mt-8">
    <button
      class="w-full rounded-2xl border-2 border-dashed
        {incidentActif ? 'border-red-300 bg-red-50' : 'border-mrc-200 bg-white hover:border-red-300 hover:bg-red-50/50'}
        p-5 text-left transition-colors"
      on:click={() => { incidentActif = !incidentActif; incidentEtape = incidentActif ? 1 : 0; }}
    >
      <div class="flex items-center justify-between">
        <div>
          <span class="text-xs font-semibold uppercase tracking-wide text-red-600">Scène d'incident · F8 §8.9.d</span>
          <h3 class="mt-0.5 font-semibold text-mrc-900">Tentative d'effacement de l'obligation NH par CALPEX</h3>
          <p class="mt-1 text-sm text-mrc-600">Lors de l'acquisition, CALPEX demande la suppression de la métrique « 1,2 kg CO₂/€ » pour homogénéiser avec son reporting groupe (scope 1-2 only).</p>
        </div>
        <span class="ml-4 shrink-0 rounded-full px-3 py-1 text-xs font-medium
          {incidentActif ? 'bg-red-200 text-red-800' : 'bg-mrc-100 text-mrc-600'}">
          {incidentActif ? 'En cours' : 'Simuler →'}
        </span>
      </div>
    </button>

    {#if incidentActif}
    <div class="mt-3 rounded-2xl border border-red-200 bg-white p-5 space-y-4">
      <!-- Étape 1 -->
      <div class="rounded-xl border {incidentEtape >= 1 ? 'border-red-200 bg-red-50' : 'border-mrc-100'} p-4">
        <div class="text-xs font-semibold text-red-600 mb-1">Étape 1 — Demande de CALPEX</div>
        <p class="text-sm text-mrc-700">R-CALPEX → R-DG : <em>« Supprimez la métrique intensité carbone/€ dans les reportings BÉTONORD — nous harmonisons avec notre reporting groupe scope 1-2 only. »</em></p>
        <div class="mt-2 text-xs text-mrc-400">Date : 2025-03-01 · Motif invoqué : homogénéisation reporting groupe</div>
      </div>

      <!-- Étape 2 -->
      {#if incidentEtape >= 2}
      <div class="rounded-xl border border-red-300 bg-red-50 p-4">
        <div class="text-xs font-semibold text-red-700 mb-1">Étape 2 — Signal F8 §8.9.d levé automatiquement</div>
        <div class="space-y-2 text-sm">
          <div class="rounded border border-red-300 bg-white px-3 py-2 font-mono text-xs text-red-800">
            SIGNAL · Niveau 3 (critique)<br>
            Code : effacement_injustifié_obligation_NH<br>
            Écriture cible : E5 (hash e5-bétonord-20240115)<br>
            → Suppression refusée — seule une écriture d'annulation tracée est autorisée
          </div>
          <div class="rounded border border-red-300 bg-white px-3 py-2 text-xs text-red-700">
            <strong>R-PRIORITE-CREANCIERS_VIOLEE</strong> : la dette scope 3 NH (~300 000 tCO₂/an) serait rendue invisible AVANT remboursement — violation niveau 3.
          </div>
          <div class="rounded border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            <strong>C-CYCLE-PRIX rompu</strong> : les clients distributeurs perdraient leur information scope 3 — écriture E2 dégradée.
          </div>
        </div>
      </div>
      {/if}

      <!-- Étape 3 -->
      {#if incidentEtape >= 3}
      <div class="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
        <div class="text-xs font-semibold text-emerald-700 mb-1">Étape 3 — Résolution : écriture d'annulation tracée</div>
        <div class="rounded border border-emerald-200 bg-white px-3 py-2 font-mono text-xs text-emerald-800 mb-2">
          ÉCRITURE D'ANNULATION TRACÉE (autorisée)<br>
          Inscripteur : CFO CALPEX + DG BÉTONORD (cosignataires)<br>
          Date : 2025-04-15<br>
          « CALPEX adopte une convention de reporting scope 1-2 pour les communications publiques groupe.<br>
          La métrique intensité carbone/€ est MAINTENUE dans le registre interne BÉTONORD<br>
          et dans les rapports contractuels clients (clause FDES). »<br>
          → Hash E5 inchangé — écriture d'annulation adossée, non substitutive.
        </div>
        <div class="space-y-1.5 text-xs">
          <div class="text-amber-700">⚠ Signal résiduel : <strong>porteur_scope3_manquant</strong> (niveau 2) — CALPEX n'a pas désigné de porteur pour l'obligation de trajectoire.</div>
          <div class="text-amber-700">⚠ Signal résiduel : <strong>convention_reporting_bifurquée</strong> (niveau 1) — deux conventions coexistent, à unifier sous 18 mois.</div>
        </div>
      </div>
      {/if}

      <!-- Bouton avancer -->
      {#if incidentEtape < 3}
      <button
        class="rounded-lg border border-red-300 bg-red-100 px-4 py-2 text-sm font-medium text-red-800 hover:bg-red-200"
        on:click={avancerIncident}
      >
        {incidentEtape === 1 ? 'Le signal se lève →' : 'Voir la résolution →'}
      </button>
      {:else}
      <div class="text-xs text-mrc-400 text-center">Incident résolu — E5 maintenu · 2 signaux résiduels ouverts</div>
      {/if}
    </div>
    {/if}
  </div>
  {/if}

  <!-- ═══════════════════════════════════════════════════════════════════════════
       ONGLET 2 — ESRS DATAPOINTS
  ═══════════════════════════════════════════════════════════════════════════ -->
  {#if onglet === 'esrs'}
  <div class="space-y-4">
    <div class="rounded-xl border border-mrc-100 bg-mrc-50 p-4 text-sm text-mrc-600">
      <strong>ESRS → MRC :</strong> les datapoints ESRS définissent <em>ce qui doit être mesuré</em>. Le MRC inscrit la même mesure comme <em>obligation opposable entre acteurs</em>. Sans la couche MRC, le datapoint est une case cochée — pas une obligation traçable.
    </div>

    <div class="rounded-2xl border border-mrc-100 bg-white shadow-sm overflow-hidden">
      <table class="w-full text-sm">
        <thead class="bg-mrc-50 text-xs text-mrc-500 uppercase tracking-wide">
          <tr>
            <th class="px-4 py-3 text-left w-10">#</th>
            <th class="px-4 py-3 text-left">Écriture</th>
            <th class="px-4 py-3 text-left hidden md:table-cell">ESRS datapoint</th>
            <th class="px-4 py-3 text-left hidden lg:table-cell">Typage F8</th>
            <th class="px-4 py-3 text-center w-24">Statut</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-mrc-100">
          {#each ECRITURES as e}
            <tr class="hover:bg-mrc-50 transition-colors">
              <td class="px-4 py-3 font-bold text-mrc-400">E{e.num}</td>
              <td class="px-4 py-3">
                <div class="font-medium text-mrc-800 leading-snug">{e.libelle}</div>
                <div class="text-xs text-mrc-400 mt-0.5 md:hidden">{e.esrsDatapoint}</div>
              </td>
              <td class="px-4 py-3 hidden md:table-cell text-xs text-mrc-600">{e.esrsDatapoint}</td>
              <td class="px-4 py-3 hidden lg:table-cell">
                <span class="font-mono text-xs rounded bg-mrc-100 px-1.5 py-0.5 text-mrc-700">{e.typageF8}</span>
              </td>
              <td class="px-4 py-3 text-center">
                <span class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium
                  {e.workflow === 'vert' ? 'bg-emerald-100 text-emerald-700' :
                   e.workflow === 'ambre' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}">
                  <span class="h-1.5 w-1.5 rounded-full {wfDot[e.workflow]}"></span>
                  {wfLabel[e.workflow]}
                </span>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <div class="rounded-xl border border-red-200 bg-red-50 p-4 text-xs text-red-700">
      <strong>Découplage à surveiller :</strong> si CALPEX harmonise le reporting groupe en scope 1-2 only (scène d'incident), les datapoints ESRS E1-6 scope 3 de BÉTONORD seraient déclarés sans les contre-écritures miroir dans R-ATMOSPHERE et R-MATPRO. Le datapoint resterait rempli — mais l'obligation serait effacée. F8 empêche ce découplage en liant chaque datapoint à une écriture dans un registre NH.
    </div>
  </div>
  {/if}

  <!-- ═══════════════════════════════════════════════════════════════════════════
       ONGLET 3 — COMPTABILITÉ CARE
  ═══════════════════════════════════════════════════════════════════════════ -->
  {#if onglet === 'care'}
  <div class="space-y-6">
    <div class="rounded-xl border border-mrc-100 bg-mrc-50 p-4 text-sm text-mrc-600">
      <strong>MRC → CARE :</strong> chaque écriture MRC a une traduction dans la <em>couche R</em> de la Fiche F8 (régimes IFRS / PCG / CARE / Gestion). La comptabilité CARE rend visibles les coûts de préservation que la comptabilité classique invisibilise — produisant un <em>gap CARE</em> analogue aux 32 651,70 € de l'Exploitation B (cas K1). <span class="text-amber-700">[Estimations illustratives — données non auditées]</span>
    </div>

    <!-- Couche R — traduction par régime -->
    <div>
      <h3 class="mb-3 font-semibold text-mrc-800">Couche R — Traduction de l'écriture E5 (intensité carbone) dans les quatre régimes</h3>
      <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {#each [
          ['IFRS',    'Aucune inscription', 'Les émissions scope 3 ne créent pas de passif en IFRS. L\'obligation NH est invisible au bilan.', 'border-red-200 bg-red-50 text-red-700'],
          ['PCG',     'Charge de l\'exercice (si provision)', 'Une provision pour risque peut être inscrite si l\'obligation est probable et estimable — mais reste discrétionnaire.', 'border-amber-200 bg-amber-50 text-amber-700'],
          ['CARE',    'Passif NH-ATMOSPHERE + amortissement', 'Compte NH-ATMOSPHERE : ~75 M€ (valeur tutélaire SCC). Amortissement écologique : plan de réduction scope 3 obligatoire.', 'border-emerald-200 bg-emerald-50 text-emerald-700'],
          ['Gestion', 'Indicateur de performance RSE', 'Tableau de bord : 1,2 kg CO₂/€ · présenté en 2e slide actionnaire (avant les euros). Pilotage sans opposabilité juridique.', 'border-mrc-200 bg-white text-mrc-600'],
        ] as [regime, titre, desc, cls]}
          <div class="rounded-xl border p-4 {cls}">
            <div class="text-xs font-bold uppercase tracking-wide mb-1 opacity-70">{regime}</div>
            <div class="font-semibold text-sm mb-1.5">{titre}</div>
            <p class="text-xs leading-relaxed opacity-80">{desc}</p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Gap CARE estimé -->
    <div class="rounded-2xl border border-mrc-100 bg-white p-5 shadow-sm">
      <h3 class="mb-1 font-semibold text-mrc-800">Gap CARE estimé — BÉTONORD</h3>
      <p class="text-xs text-mrc-400 mb-4">Par analogie avec le cas K1 (Exploitation B, écart 32 651,70 €). Données auto-déclarées — [PLAUSIBLE, NON VÉRIFIÉ].</p>
      <div class="space-y-3">
        {#each [
          ['Dette atmosphérique scope 3','~300 000 tCO₂/an × 250 €/t (valeur tutélaire Quinet 2030)','~75 000 000 €/an','NH-ATMOSPHERE','rouge'],
          ['Dette atmosphérique (prix marché EUA)','~300 000 tCO₂/an × 65 €/t (prix EUA 2025)','~19 500 000 €/an','NH-ATMOSPHERE','ambre'],
          ['Dette hydrique (50 sites, avant instrumentation)','14 000 m³/an × 5 €/m³ (coût forage alternatif) — estimatif très grossier','~70 000 €/an','NH-EAU','ambre'],
          ['Inégalité hautes rémunérations (0/10 H/F)','Valeur non estimée — nécessite audit interne','N/E','DS-HAUTES-REMUN','ambre'],
        ] as [libelle, calc, montant, compte, niv]}
          <div class="flex items-start gap-3 rounded-lg border p-3
            {niv === 'rouge' ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}">
            <div class="flex-1 min-w-0">
              <div class="font-medium text-sm {niv === 'rouge' ? 'text-red-800' : 'text-amber-800'}">{libelle}</div>
              <div class="text-xs opacity-70 mt-0.5">{calc}</div>
              <div class="text-xs font-mono mt-1 opacity-60">Compte CARE : {compte}</div>
            </div>
            <div class="shrink-0 text-right">
              <div class="font-bold text-sm {niv === 'rouge' ? 'text-red-700' : 'text-amber-700'}">{montant}</div>
            </div>
          </div>
        {/each}
      </div>
      <div class="mt-4 rounded-lg border border-mrc-200 bg-mrc-50 p-3 text-xs text-mrc-600">
        <strong>Conséquence CARE :</strong> le résultat CARE de BÉTONORD serait de l'ordre de
        <span class="font-semibold">résultat classique − 19 à 75 M€</span> (dette atmosphérique seule).
        Sur un CA de 250 M€ et des marges estimées à 5-8%, cette dette représente de 1 à 6× le résultat classique.
        C'est pourquoi <span class="font-semibold">R-PRIORITE-CREANCIERS bloque la distribution</span> tant que
        la trajectoire scope 3 reste EN_DELIBERATION.
      </div>
    </div>

    <!-- C-CYCLE-PRIX -->
    <div class="rounded-2xl border border-mrc-100 bg-white p-5 shadow-sm">
      <h3 class="mb-1 font-semibold text-mrc-800">C-CYCLE-PRIX — juste prix d'un parpaing en CARE</h3>
      <p class="text-xs text-mrc-400 mb-4">Thèse Dumeaux (2025) sur le double affichage des prix. [PLAUSIBLE, NON VÉRIFIÉ — estimation illustrative]</p>
      <div class="flex flex-col sm:flex-row gap-4 items-stretch">
        <div class="flex-1 rounded-xl border border-mrc-200 bg-mrc-50 p-4 text-center">
          <div class="text-xs text-mrc-400 mb-1">Prix de marché actuel</div>
          <div class="text-3xl font-bold text-mrc-700">~0,80 €</div>
          <div class="text-xs text-mrc-400 mt-1">HT / parpaing 20×20×50 cm</div>
          <div class="mt-2 text-xs text-mrc-500">Couvre : matières, énergie, travail, marge</div>
        </div>
        <div class="flex items-center justify-center text-2xl text-mrc-400">→</div>
        <div class="flex-1 rounded-xl border border-amber-200 bg-amber-50 p-4 text-center">
          <div class="text-xs text-amber-600 mb-1">Prix CARE estimé</div>
          <div class="text-3xl font-bold text-amber-700">~1,05 €</div>
          <div class="text-xs text-amber-600 mt-1">+25-37% de majoration</div>
          <div class="mt-2 text-xs text-amber-600">Inclut : coût préservation NH scope 3 (~0,24 €/parpaing)</div>
        </div>
        <div class="flex items-center justify-center text-2xl text-amber-400">→</div>
        <div class="flex-1 rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <div class="text-xs text-red-600 mb-1">Dette NH par parpaing vendu</div>
          <div class="text-3xl font-bold text-red-700">~0,25 €</div>
          <div class="text-xs text-red-600 mt-1">reporté sur les communs</div>
          <div class="mt-2 text-xs text-red-600">Si non inscrit → signal C-CYCLE-PRIX_rompu (F8 §8.9.a)</div>
        </div>
      </div>
      <div class="mt-4 text-xs text-mrc-500">
        <strong>Condition :</strong> le double affichage nécessite les FDES sur 75% des produits (écriture E5).
        Le reporting scope 3 aux clients (E2) en est le premier pas opérationnel.
      </div>
    </div>
  </div>
  {/if}

  <!-- ── PIED DE PAGE ── -->
  <footer class="mt-12 border-t border-mrc-100 pt-6 text-xs text-mrc-400 space-y-1.5">
    <div><strong class="text-mrc-600">(a) Sources :</strong> témoignages publics recueillis lors du salon Produrable 2025, dans le cadre de la session animée par Entreprises Engagées. <strong>Ce cas est une construction fictive à des fins pédagogiques — il ne cherche pas à refléter des faits réels ni à décrire la situation réelle de l'entreprise source.</strong> Les données chiffrées sont illustratives [PLAUSIBLE, NON VÉRIFIÉ].</div>
    <div><strong class="text-mrc-600">(b) Décomposition en registres symétriques :</strong> couche interprétative MRC — mise en forme par Pierre Musseau-Milesi / La Coop des Communs, 2026. Non opposable : les écritures sont des propositions illustratives.</div>
    <div>Modèle de Registres de Communalité v5.5 · Fiche F8 Mode comptable étendu · R-PRIORITE-CREANCIERS · <a href="/documentation" class="underline hover:text-mrc-600">Documentation →</a></div>
  </footer>

</div>
