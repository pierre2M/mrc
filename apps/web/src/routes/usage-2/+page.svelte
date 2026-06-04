<script lang="ts">
  import MrcStatusBadge from '$lib/components/MrcStatusBadge.svelte';
  import Stepper from '$lib/components/Stepper.svelte';
  import { LABEL_PHASE } from '$lib/enquete-phases';

  // ──────────────────────────────────────────────────────────────────────────
  // Usage 2 — Registre d'enquête contrôlé · démonstration interactive (vitrine).
  //
  // Journal cohérent avec les primitives de Couche 0 du MRC v5.5 (MRC_v5.3,
  // déf. des 8 primitives) : ACTEUR, INTERACTION, ÉCRITURE sont trois registres
  // DISTINCTS — une écriture (R1 débit/crédit) RÉFÉRENCE des acteurs et une
  // interaction, elle n'est pas « un acteur ». Les SIGNAUX sont un registre à
  // part (alertes de Couche 1/2).
  //
  // Cas Mar Menor : faits issus du rapport « Droits de la nature et gouvernance »
  // (La Coop des Communs / GRET) et de la décomposition en 6 phases (enquête
  // deweyenne, G-DEMO-EPISTEMIQUE / NT-G10). Régime : vulgarisation procédurale,
  // non calcul formel. Aucune sortie n'est opposable.
  // ──────────────────────────────────────────────────────────────────────────

  type Workflow = 'rouge' | 'ambre' | 'vert' | 'archive';
  type TypeActeur = 'humain' | 'collectif' | 'organisation' | 'non-humain' | 'instrumental';

  interface Acteur {
    id: string;
    nom: string;
    type: TypeActeur;
    role: string;
    seuil?: string;        // seuilentreecommunautemorale (entités non-humaines)
    source: string;
    phase: number;         // phase à partir de laquelle l'acteur est inscrit
  }
  interface Interaction {
    id: string;
    de: string;            // id acteur source
    vers: string;          // id acteur cible
    nature: string;
    source: string;
    phase: number;
  }
  interface Ecriture {
    id: string;
    libelle: string;
    sens: 'DÉBIT' | 'CRÉDIT';
    acteurs: string[];     // acteurs référencés
    interaction?: string;  // interaction référencée
    regime: 'ACTORIEL' | 'SYSTÉMIQUE' | 'HYBRIDE';
    statutDette: 'SYSTEMIQUE_NON_ATTRIBUEE' | 'EN_DELIBERATION' | 'ATTRIBUEE';
    porteur?: string;
    workflow: Workflow;
    source: string;
    signal?: string;       // signal ouvert si validée
    requiertRepresentation?: boolean;
    phase: number;
  }
  interface Signal {
    id: string;
    code: string;
    libelle: string;
    phase: number;
  }
  interface PhaseDef {
    id: string;
    num: number;
    label: string;
    mrc: string;           // ancrage MRC / C-ENQUETE
    porteur: string;
    periode: string;
    sortie: string;
  }
  interface Cas {
    id: string;
    titre: string;
    fiche: string;
    jouable: boolean;
    resume: string;
    phases: PhaseDef[];
    acteurs: Acteur[];
    interactions: Interaction[];
    ecritures: Ecriture[];
    signaux: Signal[];
    // entités affectées à inventorier (sous-ensemble des acteurs)
    inventaire: { ref: string; defaut: boolean }[];
    // préalable obligatoire à la phase Convention (donne voix aux sans-voix)
    prealable: { titre: string; texte: string; bouton: string; ok: string };
    porteurAttribution: string;
  }

  // ── CAS MAR MENOR ───────────────────────────────────────────────────────────
  const MAR_MENOR: Cas = {
    id: 'mar-menor',
    titre: 'Mar Menor — une lagune devient sujet de droit',
    fiche: 'F2 — Milieu · G-DEMO-EPISTEMIQUE',
    jouable: true,
    resume:
      "Espagne, région de Murcie. Une lagune asphyxiée par l'agriculture intensive devient, en 2022, la première entité naturelle dotée d'une personnalité juridique en Europe — au terme d'une enquête collective citoyenne.",
    phases: [
      { id: 'rupture', num: 1, label: 'Rupture d’expérience', mrc: 'Expérience première (Dewey) · appelEntendu = TRUE (G-DEMO-EPISTEMIQUE)',
        porteur: 'Habitant·es riverain·es', periode: '2016',
        sortie: "La « soupe verte » rend le problème irréfutable : une rupture vécue, non un rapport, déclenche l'enquête." },
      { id: 'public', num: 2, label: 'Constitution du public', mrc: 'Inclusion des affectés (exigence épistémique) · risqueEpistocratie',
        porteur: 'Associations (Pacto por el Mar Menor, ANSE, SOS Mar Menor)', periode: '2016–2019',
        sortie: 'Le public concerné se constitue ; on inventorie les entités affectées, humaines et non-humaines.' },
      { id: 'formulation', num: 3, label: 'Formulation collective', mrc: 'ENQUETE_COLLECTIVE · C-FORMES-DELIBERATION',
        porteur: 'Teresa Vicente + collectif (Plaza del Espejo)', periode: '2019–2020',
        sortie: 'Le problème prend une forme juridique : les droits de la nature. On déclare les primitives de Couche 0.' },
      { id: 'convention', num: 4, label: 'Convention', mrc: 'CONVENTION · R1 DÉBIT/CRÉDIT · REPRESENTATION-PROSPECTIVE',
        porteur: 'État espagnol (Loi 19/2022) + tutelle', periode: '2020–2022',
        sortie: 'Écriture collective opposable : la lagune devient sujet de droit ; une tutelle la représente.' },
      { id: 'epreuve', num: 5, label: 'Mise à l’épreuve', mrc: 'ecartFormelRel ≥ seuil · [DÉCOUPLAGE DE RÉGIMES DÉTECTÉ]',
        porteur: 'Administration régionale vs tutelle citoyenne', periode: '2023–2025',
        sortie: 'Le plan de restauration de l’État ignore la personnalité juridique : découplage entre régimes.' },
      { id: 'reevaluation', num: 6, label: 'Réévaluation', mrc: 'revueSubstitution · R-DEBLOCAGE-EXISTENTIEL · enquête jamais close',
        porteur: 'Tutelle + justice (procès Topillo)', periode: '2025–2026',
        sortie: 'L’obligation de réouverture est actée : sur un commun vivant, l’enquête ne se clôt pas.' }
    ],
    acteurs: [
      { id: 'lagune', nom: 'Lagune Mar Menor (+ bassin versant)', type: 'non-humain', role: 'Écosystème-commun, sujet de droit', seuil: 'FINALITÉ-IMMANENTE', phase: 1,
        source: 'Ley 19/2022 — « se reconoce como sujeto de derechos » (rapport, p. 9)' },
      { id: 'vivant', nom: 'Espèces & générations futures (hippocampes)', type: 'non-humain', role: 'Tiers affectés sans voix propre', seuil: 'FINALITÉ-IMMANENTE', phase: 1,
        source: 'Attachement aux populations d’hippocampes (rapport, contexte)' },
      { id: 'habitants', nom: 'Habitant·es riverain·es', type: 'collectif', role: 'Public concerné (expérience première)', phase: 1,
        source: '« soupe verte » 2016 — expérience directe (rapport)' },
      { id: 'assos', nom: 'Associations (Pacto por el Mar Menor, ANSE, SOS Mar Menor)', type: 'organisation', role: 'Porteurs de l’enquête collective', phase: 2,
        source: '55 000 manifestant·es à Carthagène, oct. 2019 (rapport)' },
      { id: 'agro', nom: 'Agro-industrie du Campo de Cartagena (Fundación Ingenio)', type: 'organisation', role: 'Mobilisateur / source de pression', phase: 2,
        source: 'Activités agro-industrielles, nitrates ; lobby Fundación Ingenio (rapport)' },
      { id: 'admin', nom: 'Administration régionale de Murcie', type: 'organisation', role: 'Autorité ; préside le comité scientifique', phase: 2,
        source: 'Comité d’asesoramiento científico présidé par l’administration (rapport)' },
      { id: 'vicente', nom: 'Teresa Vicente (juriste)', type: 'humain', role: 'Promotrice de l’ILP, future tutrice', phase: 3,
        source: 'Prix Goldman 2022 ; ILP Mar Menor (rapport)' },
      { id: 'etat', nom: 'État espagnol (Congrès / Sénat)', type: 'organisation', role: 'Inscripteur de la convention (loi)', phase: 4,
        source: 'Loi 19/2022 votée (3 oppositions / 266 sénateurs) (rapport)' },
      { id: 'tutelle', nom: 'Tutelle de la Mar Menor (3 comités)', type: 'organisation', role: 'Représentant désigné de la lagune', phase: 4,
        source: 'Loi 19/2022 : comités de représentants, scientifique, de suivi (rapport)' }
    ],
    interactions: [
      { id: 'i-agro', de: 'agro', vers: 'lagune', nature: 'Pollution diffuse (nitrates) → eutrophisation', phase: 1,
        source: 'Directive nitrates 1991 ; eutrophisation 2016 (rapport)' },
      { id: 'i-attach', de: 'habitants', vers: 'lagune', nature: 'Usage & attachement (résonance)', phase: 1,
        source: 'Hartmut Rosa, Résonance, cité (.md / rapport)' },
      { id: 'i-evince', de: 'admin', vers: 'lagune', nature: 'Concentration du pouvoir épistémique (éviction de scientifiques)', phase: 2,
        source: 'Comité consultatif présidé par l’administration, dès 2018 (rapport)' },
      { id: 'i-ilp', de: 'assos', vers: 'etat', nature: 'Initiative législative populaire (639 286 signatures)', phase: 4,
        source: 'ILP nov. 2020 – oct. 2021 (rapport, p. 33-34)' },
      { id: 'i-loi', de: 'etat', vers: 'lagune', nature: 'Reconnaissance de personnalité juridique', phase: 4,
        source: 'Ley 19/2022, de 30 de septiembre (rapport, p. 9)' },
      { id: 'i-tutelle', de: 'tutelle', vers: 'lagune', nature: 'Représentation fiduciaire (tutelle)', phase: 4,
        source: 'Tutelle : représentation en justice et arbitrage (rapport)' }
    ],
    ecritures: [
      { id: 'e-dette', libelle: 'Dette écologique envers la lagune (contre-écriture des gains agro-industriels et touristiques)',
        sens: 'CRÉDIT', acteurs: ['lagune', 'agro'], interaction: 'i-agro',
        regime: 'SYSTÉMIQUE', statutDette: 'SYSTEMIQUE_NON_ATTRIBUEE', workflow: 'rouge', requiertRepresentation: true,
        signal: 'R-CODEGRADATION — dégradation du milieu lagunaire',
        source: 'Eutrophisation, anoxie 2019 (rapport)', phase: 4 },
      { id: 'e-droit', libelle: 'Reconnaissance : la lagune devient sujet de droit (degré de communalité ~2 → 4, échelle Rochfeld)',
        sens: 'CRÉDIT', acteurs: ['lagune', 'etat'], interaction: 'i-loi',
        regime: 'HYBRIDE', statutDette: 'EN_DELIBERATION', workflow: 'rouge',
        source: 'Ley 19/2022 (rapport) ; NT-G6 Communalité', phase: 4 },
      { id: 'e-ecart', libelle: 'Écart : plan de restauration de l’État (675 M€) sans mention de la personnalité juridique',
        sens: 'DÉBIT', acteurs: ['etat', 'tutelle'],
        regime: 'SYSTÉMIQUE', statutDette: 'SYSTEMIQUE_NON_ATTRIBUEE', workflow: 'rouge',
        signal: 'DÉCOUPLAGE DE RÉGIMES — plan d’État vs loi citoyenne',
        source: 'Décret d’application fév. 2025 ; démission Vicente (rapport / .md)', phase: 5 },
      { id: 'e-reouverture', libelle: 'Obligation de réouverture de l’enquête (échéance procès Topillo)',
        sens: 'CRÉDIT', acteurs: ['tutelle', 'lagune'],
        regime: 'SYSTÉMIQUE', statutDette: 'EN_DELIBERATION', workflow: 'rouge',
        signal: 'enquêteInsatisfaisante (MOYEN) — réouverture actée',
        source: 'Procès Topillo prévu 20 mai 2026 (rapport / .md)', phase: 6 }
    ],
    signaux: [
      { id: 's-appel', code: 'appelEntendu = TRUE', libelle: 'Expérience première : la soupe verte rend le problème irréfutable.', phase: 1 },
      { id: 's-episto', code: 'risqueEpistocratieÉlevé', libelle: 'Le comité scientifique, présidé par l’administration, concentre le pouvoir épistémique.', phase: 2 },
      { id: 's-codeg', code: 'R-CODEGRADATION', libelle: 'Dégradation du milieu lagunaire (eutrophisation, anoxie).', phase: 4 },
      { id: 's-horizon', code: 'ENGAGEMENT À HORIZON IRRÉVERSIBLE', libelle: 'Personnalité juridique : effets non annulables sur générations futures et espèces.', phase: 4 },
      { id: 's-decouplage', code: 'DÉCOUPLAGE DE RÉGIMES DÉTECTÉ', libelle: 'Le régime institutionnel (plan État) et le régime juridico-politique (loi citoyenne) divergent.', phase: 5 },
      { id: 's-reouverture', code: 'revueSubstitution', libelle: 'Sur un commun vivant, la convention doit être rouverte : l’enquête n’est jamais close.', phase: 6 }
    ],
    inventaire: [
      { ref: 'lagune', defaut: true },
      { ref: 'vivant', defaut: true },
      { ref: 'habitants', defaut: true }
    ],
    prealable: {
      titre: 'REPRESENTATION-PROSPECTIVE',
      texte: 'La lagune et les générations futures ne peuvent pas parler en leur nom. Avant toute écriture opposable, il faut désigner une représentation (tutelle).',
      bouton: 'Désigner la tutelle de la Mar Menor',
      ok: '✓ Tutelle désignée — la dette systémique passe EN_DELIBERATION puis pourra être ATTRIBUÉE.'
    },
    porteurAttribution: 'Tutelle de la Mar Menor (3 comités)'
  };

  // ── CAS SOINS — clinique de l'activité (Musseau J. 2026) ────────────────────
  const SOINS: Cas = {
    id: 'soins',
    titre: 'Soignant·es — reconquérir le pouvoir d’agir',
    fiche: 'F1 — Travail · clinique de l’activité',
    jouable: true,
    resume:
      "Établissement public (Ehpad + foyer d’accueil médicalisé), 2014-2022. Face à un climat social dégradé, une intervention en clinique de l’activité institue un dialogue sur la qualité du travail : les soignant·es reprennent la main sur leur activité.",
    phases: [
      { id: 'rupture', num: 1, label: 'Rupture d’expérience', mrc: 'Expérience première · appelEntendu = TRUE (G-DEMO-EPISTEMIQUE)',
        porteur: 'Soignant·es de première ligne (AMP)', periode: 'amont',
        sortie: "Climat social dégradé, perte de la possibilité de « bien faire son travail » : la plainte signale un empêchement, non un simple problème de conditions." },
      { id: 'public', num: 2, label: 'Constitution du collectif', mrc: 'Inclusion des affectés · volontariat · validation ARS',
        porteur: 'Volontaires + psychologues du travail', periode: '2014',
        sortie: 'Un collectif de volontaires se constitue avec les intervenants ; on inventorie qui est affecté (soignant·es, résidents, encadrement).' },
      { id: 'formulation', num: 3, label: 'Autoconfrontations', mrc: 'ENQUETE_COLLECTIVE · C-FORMES-DELIBERATION · réel de l’activité',
        porteur: 'Collectif de volontaires (à l’écart de la hiérarchie)', periode: '2014-2020',
        sortie: 'Séquences filmées confrontées entre pairs : la plainte devient problème concret à résoudre. On déclare les primitives de Couche 0.' },
      { id: 'convention', num: 4, label: 'Migration en comités', mrc: 'CONVENTION · R1 DÉBIT/CRÉDIT · diagnostics du travail réel',
        porteur: 'Encadrement + direction + syndicats', periode: '2018-2022',
        sortie: 'Les diagnostics migrent en comités de pilotage : la contradiction est inscrite et l’organisation des soins révisée (coopération conflictuelle).' },
      { id: 'epreuve', num: 5, label: 'Mise à l’épreuve', mrc: 'ecartFormelRel ≥ seuil · [DÉCOUPLAGE DE RÉGIMES DÉTECTÉ]',
        porteur: 'Logique gestionnaire vs pouvoir d’agir', periode: 'récurrent',
        sortie: 'Les remèdes gestionnaires (revalorisations, procédures de contrôle) restent sans effet, voire se retournent contre les soignant·es.' },
      { id: 'reevaluation', num: 6, label: 'Réévaluation', mrc: 'pérennisation · enquête jamais close',
        porteur: 'Référent-métier + instance de dialogue', periode: '2022→',
        sortie: 'Institution d’un·e référent-métier élu·e : les problèmes circulent et ne sont pas oubliés.' }
    ],
    acteurs: [
      { id: 'amp', nom: 'Soignant·es de première ligne (AMP)', type: 'collectif', role: 'Porteurs du réel de l’activité', phase: 1,
        source: 'Musseau J., Soins Cadres nº 164, mars-avril 2026' },
      { id: 'residents', nom: 'Résident·es de l’Ehpad', type: 'collectif', role: 'Personnes soignées (autonomie en jeu), sans voix dans la logique gestionnaire', seuil: 'capabilité / autonomie', phase: 1,
        source: 'Dialogue filmé « on fait à leur place » (Clot et al., cité)' },
      { id: 'volontaires', nom: 'Collectif de volontaires', type: 'collectif', role: 'Engagé dans les autoconfrontations', phase: 2,
        source: 'Cadre réglé de confrontations sur la qualité du travail' },
      { id: 'psy', nom: 'Psychologues du travail (clinique de l’activité)', type: 'organisation', role: 'Tiers méthodologique (intervenants)', phase: 2,
        source: 'Zittoun M. & Clot Y., Psychol Trav Organ 2020;26(1):56–70' },
      { id: 'ars', nom: 'Agence régionale de santé (ARS)', type: 'organisation', role: 'Validateur de la démarche', phase: 2,
        source: 'Proposition validée par l’ARS malgré son caractère singulier' },
      { id: 'encadrement', nom: 'Encadrement', type: 'organisation', role: 'Niveau intermédiaire de l’organisation', phase: 4,
        source: 'Comités de pilotage (article)' },
      { id: 'direction', nom: 'Direction de l’établissement', type: 'organisation', role: 'Décideur de l’organisation des soins', phase: 4,
        source: 'Instance de dialogue sur le métier (article)' },
      { id: 'syndicats', nom: 'Organisations syndicales', type: 'organisation', role: 'Partie prenante du dialogue', phase: 4,
        source: 'Dialogue incluant les organisations syndicales (article)' },
      { id: 'referent', nom: 'Référent-métier (soignante élue)', type: 'humain', role: 'Garant·e que le réel du travail ne soit pas évacué', phase: 6,
        source: 'Fonction instituée en fin d’intervention (article)' }
    ],
    interactions: [
      { id: 'i-gestion', de: 'direction', vers: 'amp', nature: 'Logique gestionnaire (financement PASA par inscriptions) → « faire plus vite »', phase: 1,
        source: 'Pérennisation financière du PASA par les inscriptions (article)' },
      { id: 'i-empechement', de: 'amp', vers: 'residents', nature: 'Empêchement : « on accroche les manteaux à leur place » (atteinte à l’autonomie)', phase: 3,
        source: 'Autoconfrontation filmée (Clot et al., cité)' },
      { id: 'i-autoconf', de: 'volontaires', vers: 'volontaires', nature: 'Autoconfrontation croisée sur le travail bien fait', phase: 3,
        source: 'Séquences d’activité filmées et discutées entre pairs' },
      { id: 'i-migration', de: 'psy', vers: 'encadrement', nature: 'Migration des diagnostics en comités de pilotage', phase: 4,
        source: 'Diagnostics du travail réel adressés à la hiérarchie (article)' },
      { id: 'i-referent', de: 'referent', vers: 'direction', nature: 'Circulation instituée des problèmes (instance de dialogue)', phase: 6,
        source: 'Fonction de référent-métier (article)' }
    ],
    ecritures: [
      { id: 'e-empechement', libelle: 'Empêchement reconnu : « on fait à leur place » — contradiction entre moyens alloués au degré de dépendance et temps réellement nécessaire',
        sens: 'CRÉDIT', acteurs: ['amp', 'residents'], interaction: 'i-empechement',
        regime: 'SYSTÉMIQUE', statutDette: 'SYSTEMIQUE_NON_ATTRIBUEE', workflow: 'rouge', requiertRepresentation: true,
        signal: 'R-ACTIVITE-EMPECHEE — capacité bloquée, discussion professionnelle à rouvrir',
        source: 'Dialogue filmé au PASA (Clot et al., cité)', phase: 4 },
      { id: 'e-revision', libelle: 'Révision de l’organisation des soins au plus haut niveau (le regard de première ligne devient critère)',
        sens: 'CRÉDIT', acteurs: ['encadrement', 'direction'], interaction: 'i-migration',
        regime: 'HYBRIDE', statutDette: 'EN_DELIBERATION', workflow: 'rouge',
        source: 'Coopération conflictuelle (Oddone ; Clot, cités)', phase: 4 },
      { id: 'e-ecart', libelle: 'Écart : remèdes gestionnaires (revalorisations, inflation de procédures de contrôle) sans effet, voire contre-productifs',
        sens: 'DÉBIT', acteurs: ['direction', 'amp'],
        regime: 'SYSTÉMIQUE', statutDette: 'SYSTEMIQUE_NON_ATTRIBUEE', workflow: 'rouge',
        signal: 'DÉCOUPLAGE DE RÉGIMES — logique gestionnaire vs pouvoir d’agir',
        source: 'Inflation des procédures de contrôle (article, introduction)', phase: 5 },
      { id: 'e-referent', libelle: 'Institution du référent-métier : obligation de circulation et de non-oubli des problèmes du travail réel',
        sens: 'CRÉDIT', acteurs: ['referent', 'direction'], interaction: 'i-referent',
        regime: 'ACTORIEL', statutDette: 'ATTRIBUEE', porteur: 'Référent-métier élu·e', workflow: 'rouge',
        signal: 'pérennisation — le réel du travail ne doit pas être évacué',
        source: 'Fonction de référent-métier (article, conclusion)', phase: 6 }
    ],
    signaux: [
      { id: 's-appel', code: 'appelEntendu = TRUE', libelle: 'Décès faute de qualité, climat social dégradé : l’empêchement de bien faire devient irréfutable.', phase: 1 },
      { id: 's-empeche', code: 'R-ACTIVITE-EMPECHEE', libelle: 'Capacité d’agir bloquée + discussion professionnelle absente : priorité au déblocage du métier.', phase: 4 },
      { id: 's-affectif', code: 'G-AFFECTIF — pouvoir d’être affecté', libelle: 'Le dialogue provoque des émotions intenses : signe que l’activité est affectée et peut se transformer.', phase: 4 },
      { id: 's-decouplage', code: 'DÉCOUPLAGE DE RÉGIMES DÉTECTÉ', libelle: 'La logique gestionnaire (contrôle) et le développement du pouvoir d’agir ne produisent pas le même résultat.', phase: 5 },
      { id: 's-perennisation', code: 'enquête jamais close', libelle: 'Sur le travail vivant, la critique pratique de l’organisation doit rester ouverte (référent-métier garant).', phase: 6 }
    ],
    inventaire: [
      { ref: 'amp', defaut: true },
      { ref: 'residents', defaut: true },
      { ref: 'volontaires', defaut: true }
    ],
    prealable: {
      titre: 'DIALOGUE À L’ÉCART DE LA HIÉRARCHIE',
      texte: 'Le réel du travail des soignant·es n’a pas voix dans la logique gestionnaire descendante. Avant toute écriture opposable, le dialogue doit d’abord se tenir entre pairs (autoconfrontations), à l’écart de la hiérarchie.',
      bouton: 'Instituer le dialogue entre pairs',
      ok: '✓ Dialogue institué — les diagnostics peuvent migrer vers les comités et la contradiction être attribuée.'
    },
    porteurAttribution: 'Instance de dialogue sur le métier (encadrement + direction)'
  };

  // ── CAS CARE / IDEA4 — Exploitation B (comptabilité écologique, F8) ──────────
  const CARE: Cas = {
    id: 'care',
    titre: 'Exploitation B — comptabiliser ce qui compte (CARE/IDEA4)',
    fiche: 'F8 — Comptable / capitaux · CARE-IDEA4',
    jouable: true,
    resume:
      "Ferme bovin-lait bio, 144 ha, Bretagne. L'expérimentation CARE/IDEA4 double la comptabilité classique pour rendre visibles les dettes envers les capitaux naturels et humains — et les rembourser.",
    phases: [
      { id: 'rupture', num: 1, label: 'Rupture d’expérience', mrc: 'Expérience première · appel_entendu (G-DEMO-EPISTEMIQUE)',
        porteur: 'Exploitant·es (3 UTA)', periode: 'amont',
        sortie: 'La comptabilité classique invisibilise la dégradation des capitaux naturels et humains : ce qui est capital n’est pas compté.' },
      { id: 'public', num: 2, label: 'Constitution du public concerné', mrc: 'Inclusion des affectés · InventaireNonVide · limites planétaires',
        porteur: 'Collectif CARE/IDEA4 (Fermes d’Avenir, conseillers, experts)', periode: '2023-2024',
        sortie: 'On inventorie les capitaux affectés — sol, eau, biodiversité, atmosphère, troupeau, humains — avec leur état de préservation.' },
      { id: 'formulation', num: 3, label: 'Formulation collective', mrc: 'ENQUETE_COLLECTIVE + OBSERVATIONNELLE · catégorie de base V^CARE · IDEA4 (53 indicateurs)',
        porteur: 'Agriculteur·rice + comité scientifique', periode: '2023-2024',
        sortie: 'On définit ce qui est capital et comment le compter ; on déclare les primitives de Couche 0 et le régime d’obligation.' },
      { id: 'convention', num: 4, label: 'Convention', mrc: 'R1 DÉBIT/CRÉDIT · F8 (P-C-E-D-e-d) · source_valuemetre déclarée',
        porteur: 'Comité de pilotage CARE/IDEA4', periode: '2022 (exercice)',
        sortie: 'Comptes intégrés : dettes N et H inscrites, remboursements constatés. Les écritures deviennent opposables après validation humaine.' },
      { id: 'epreuve', num: 5, label: 'Mise à l’épreuve', mrc: 'écart 32 651,70 € · R-PRIORITE-CREANCIERS (non formalisée v5.3) · [DÉCOUPLAGE]',
        porteur: 'Exploitation vs créanciers NH', periode: '2022',
        sortie: 'Les coûts de préservation non réalisés (32 651,70 €) dégradent le résultat CARE ; la priorité aux créanciers NH n’est pas garantie.' },
      { id: 'reevaluation', num: 6, label: 'Réévaluation', mrc: 'R-CARE_chronique · suivi pluri-annuel · engagement long (salaire décent)',
        porteur: 'Exploitation + accompagnement', periode: '2022 →',
        sortie: 'Le suivi annuel des capitaux est obligatoire ; l’obligation de salaire décent court sur 25 ans (2 901 312 €). L’enquête ne se clôt pas.' }
    ],
    acteurs: [
      { id: 'exploitants', nom: 'Exploitant·es (Denis, Damien, Fabrice — 3 UTA)', type: 'collectif', role: 'Décideurs de la ferme, juges légitimes du travail', phase: 1,
        source: 'Fiche pédagogique Exploitation B (Fermes d’Avenir)' },
      { id: 'salaries', nom: 'Salarié·es (temps plein + saisonnier)', type: 'collectif', role: 'Capital humain mobilisé ; droit au salaire décent', seuil: 'salaire décent / bien-être', phase: 1,
        source: 'Bilan CARE — dettes humaines (fiche)' },
      { id: 'sol', nom: 'Sol agricole', type: 'non-humain', role: 'Capital naturel (fertilité, MO, vie du sol)', seuil: 'bon état écologique (IDEA4)', phase: 1,
        source: 'Capitaux naturels, net 8 959,2 € sur 62 828,9 € brut (fiche)' },
      { id: 'eau', nom: 'Ressource en eau / nappe', type: 'non-humain', role: 'Capital naturel (qualité, quantité)', seuil: 'bon état (limites planétaires)', phase: 1,
        source: 'Capitaux naturels — eau (fiche, p.6)' },
      { id: 'biodiversite', nom: 'Biodiversité parcellaire', type: 'non-humain', role: 'Capital naturel (faune, flore, habitats)', seuil: 'présence d’espèces clés', phase: 1,
        source: 'Capitaux naturels — biodiversité (fiche)' },
      { id: 'atmosphere', nom: 'Atmosphère', type: 'non-humain', role: 'Capital naturel (qualité de l’air, climat)', seuil: 'limites planétaires', phase: 1,
        source: 'Capitaux naturels — atmosphère (fiche)' },
      { id: 'troupeau', nom: 'Troupeau (125 UGB)', type: 'non-humain', role: 'Capital naturel (bien-être, santé animale)', seuil: 'bien-être animal', phase: 1,
        source: 'Capitaux naturels — troupeau (fiche)' },
      { id: 'conseillers', nom: 'Conseillers agricoles (Fermes d’Avenir)', type: 'organisation', role: 'Accompagnement de la stratégie de préservation', phase: 2,
        source: 'Projet CARE/IDEA4, Fermes d’Avenir' },
      { id: 'idea4', nom: 'Valuemètre IDEA4 (53 indicateurs)', type: 'instrumental', role: 'Mesure l’état de préservation ; déclare sa source', phase: 2,
        source: 'IDEA4 v4 — outil libre, comité scientifique' },
      { id: 'comptables', nom: 'Comptables / experts d’évaluation', type: 'organisation', role: 'Intègrent les capitaux N&H aux comptes', phase: 2,
        source: 'Méthode CARE — intégration comptable (fiche)' },
      { id: 'banque', nom: 'Banque / financeurs', type: 'organisation', role: 'Apprécient la triple performance', phase: 4,
        source: 'Rôles des acteurs du territoire (fiche)' },
      { id: 'collectivites', nom: 'Collectivités & élus (territoire / bassin versant)', type: 'organisation', role: 'Dialogue territorial, aides selon coûts de préservation', phase: 4,
        source: 'CARE/IDEA4 comme outil de dialogue (fiche)' }
    ],
    interactions: [
      { id: 'i-prelev', de: 'exploitants', vers: 'sol', nature: 'Mise en culture : prélèvement productif → obligation de restauration', phase: 1,
        source: 'R1 — DÉBIT actif sol / CRÉDIT dette sol (Annexe K §K.3.4)' },
      { id: 'i-emploi', de: 'exploitants', vers: 'salaries', nature: 'Emploi : mobilisation du capital humain → obligation de salaire décent', phase: 1,
        source: 'R1 — dette salaires décents long terme (Annexe K §K.3.4)' },
      { id: 'i-mesure', de: 'idea4', vers: 'sol', nature: 'Mesure de l’état de préservation (régime attentionnel)', phase: 3,
        source: '53 indicateurs IDEA4 (fiche)' },
      { id: 'i-accomp', de: 'conseillers', vers: 'exploitants', nature: 'Accompagnement de la feuille de route de remboursement', phase: 2,
        source: 'Rôle des conseillers (fiche)' },
      { id: 'i-dialogue', de: 'collectivites', vers: 'exploitants', nature: 'Dialogue territorial sur les biens communs (bassin versant)', phase: 4,
        source: 'Outil de dialogue territorial (fiche)' }
    ],
    ecritures: [
      { id: 'e-dette-n', libelle: 'Dette envers les capitaux naturels 2022 : 54 119,70 € ; remboursement 52 473 € → écart 1 646,70 €',
        sens: 'CRÉDIT', acteurs: ['sol', 'eau', 'biodiversite', 'atmosphere', 'troupeau'], interaction: 'i-prelev',
        regime: 'SYSTÉMIQUE', statutDette: 'SYSTEMIQUE_NON_ATTRIBUEE', workflow: 'rouge', requiertRepresentation: true,
        signal: 'signal_ecologie_superficielle — coûts de préservation non réalisés',
        source: 'Bilan CARE 2022 (fiche, p.7)', phase: 4 },
      { id: 'e-dette-h', libelle: 'Dette envers les capitaux humains 2022 (annualisée) : 157 785,50 € ; remboursement 126 780,50 € → écart 31 005 €',
        sens: 'CRÉDIT', acteurs: ['salaries'], interaction: 'i-emploi',
        regime: 'ACTORIEL', statutDette: 'ATTRIBUEE', porteur: 'Exploitation (employeur)', workflow: 'rouge',
        source: 'Bilan CARE 2022 (fiche, p.6-7)', phase: 4 },
      { id: 'e-ecart', libelle: 'Valuemètre composite : coûts de préservation non réalisés = 32 651,70 € → résultat CARE 69 207,30 € (vs 101 859 € classique)',
        sens: 'DÉBIT', acteurs: ['exploitants'], interaction: 'i-mesure',
        regime: 'SYSTÉMIQUE', statutDette: 'EN_DELIBERATION', workflow: 'rouge',
        signal: 'irreversibilite_changement_base (latent, ÉLEVÉ)',
        source: 'Compte de résultat CARE 2022 (fiche, p.7 ; Annexe K §K.1.2)', phase: 4 },
      { id: 'e-priorite', libelle: 'Règle R-PRIORITE-CREANCIERS : pas de distribution avant remboursement des dettes NH (non formalisée en v5.3 — le cas en révèle le besoin)',
        sens: 'DÉBIT', acteurs: ['exploitants', 'banque'],
        regime: 'SYSTÉMIQUE', statutDette: 'SYSTEMIQUE_NON_ATTRIBUEE', workflow: 'rouge',
        signal: 'DÉCOUPLAGE DE RÉGIMES — comptabilité classique vs CARE',
        source: 'Annexe K §K.3.4 (Piste 3) ; F8 §8.7', phase: 5 },
      { id: 'e-long', libelle: 'Engagement long : salaire décent restant à verser sur la carrière = 2 901 312 € (25 ans) ; suivi pluri-annuel obligatoire',
        sens: 'CRÉDIT', acteurs: ['salaries'],
        regime: 'ACTORIEL', statutDette: 'ATTRIBUEE', porteur: 'Exploitation (employeur)', workflow: 'rouge',
        signal: 'R-CARE_chronique — à tester sur la trajectoire pluri-annuelle',
        source: 'Bilan CARE — dette humaine long terme (fiche, p.6)', phase: 6 }
    ],
    signaux: [
      { id: 's-appel', code: 'appel_entendu = VRAI', libelle: 'L’exploitant ajuste effectivement ses pratiques selon les indicateurs IDEA4 (capitaux N et H).', phase: 1 },
      { id: 's-eco', code: 'signal_ecologie_superficielle (MOYEN)', libelle: 'Écart de 32 651,70 € : des coûts de préservation restent non réalisés.', phase: 4 },
      { id: 's-codeg', code: 'codegradation_calculable (à tester)', libelle: 'Travail × milieu : la pression économique peut dégrader simultanément capitaux humains et naturels.', phase: 5 },
      { id: 's-irrev', code: 'irreversibilite_changement_base (ÉLEVÉ, latent)', libelle: 'Si la comptabilité financière publiée évolue, le changement de base doit être tracé.', phase: 5 },
      { id: 's-chronique', code: 'R-CARE_chronique', libelle: 'La dette est-elle réellement réduite d’année en année ? Suivi pluri-annuel requis.', phase: 6 }
    ],
    inventaire: [
      { ref: 'sol', defaut: true },
      { ref: 'eau', defaut: true },
      { ref: 'biodiversite', defaut: true },
      { ref: 'atmosphere', defaut: true },
      { ref: 'troupeau', defaut: true },
      { ref: 'salaries', defaut: true }
    ],
    prealable: {
      titre: 'SOURCE DU VALUEMÈTRE DÉCLARÉE',
      texte: 'Un chiffre comptable n’est pas neutre : tout valuemètre (ici IDEA4) doit déclarer sa source et sa convention d’attribution avant qu’une écriture devienne opposable, sinon c’est un instrument performatif non gouverné (NT-ARCH §7 ; F8 §8.7).',
      bouton: 'Déclarer la source du valuemètre (IDEA4, comité scientifique)',
      ok: '✓ Source du valuemètre déclarée — les écritures comptables peuvent être validées par le comité (jamais par un LLM).'
    },
    porteurAttribution: 'Comité de pilotage CARE/IDEA4 (validation humaine)'
  };

  // Unification du nommage : le libellé affiché de chaque phase vient de la
  // source unique (lib/enquete-phases). Les ancrages MRC et descriptions
  // restent propres à chaque cas.
  for (const c of [MAR_MENOR, SOINS, CARE]) {
    for (const p of c.phases) p.label = LABEL_PHASE[p.id] ?? p.label;
  }

  const CAS: Cas[] = [MAR_MENOR, SOINS, CARE];

  // ── État de session ─────────────────────────────────────────────────────────
  let casId: string | null = null;
  let phaseIdx = 0;

  // état interactif
  let appelReconnu = false;
  let inventaire: { ref: string; inclus: boolean }[] = [];
  let inventaireConfirme = false;
  let basesDeclarees = false;
  let representationAssuree = false;
  let ecritures: Ecriture[] = [];

  $: cas = CAS.find((c) => c.id === casId) ?? null;
  $: phases = cas?.phases ?? [];
  $: phase = phases[phaseIdx];
  $: numPhase = phase?.num ?? 0;

  function choisir(c: Cas) {
    if (!c.jouable) return;
    casId = c.id;
    phaseIdx = 0;
    appelReconnu = false;
    inventaire = c.inventaire.map((i) => ({ ref: i.ref, inclus: i.defaut }));
    inventaireConfirme = false;
    basesDeclarees = false;
    representationAssuree = false;
    ecritures = c.ecritures.map((e) => ({ ...e }));
  }
  function reset() {
    if (cas) choisir(cas);
  }
  function acteur(id: string): Acteur | undefined {
    return cas?.acteurs.find((a) => a.id === id);
  }
  function nomActeur(id: string): string {
    return acteur(id)?.nom ?? id;
  }

  // registres filtrés par phase atteinte
  $: acteursVisibles = (cas?.acteurs ?? []).filter((a) => a.phase <= numPhase);
  $: interactionsVisibles = (cas?.interactions ?? []).filter((i) => i.phase <= numPhase);
  $: ecrituresVisibles = ecritures.filter((e) => e.phase <= numPhase);
  $: signauxVisibles = (cas?.signaux ?? []).filter((s) => s.phase <= numPhase);
  $: inventaireNonVide = inventaire.some((i) => i.inclus);

  // mécaniques
  function reconnaitreAppel() { appelReconnu = true; }
  function confirmerInventaire() { if (inventaireNonVide) inventaireConfirme = true; }
  function declarerPrimitives() { basesDeclarees = true; }
  function assurerRepresentation() {
    representationAssuree = true;
    // la dette systémique passe en délibération (machine d'états)
    ecritures = ecritures.map((e) =>
      e.requiertRepresentation && e.statutDette === 'SYSTEMIQUE_NON_ATTRIBUEE'
        ? { ...e, statutDette: 'EN_DELIBERATION' }
        : e
    );
  }
  function valider(id: string) {
    ecritures = ecritures.map((e) => {
      if (e.id !== id) return e;
      const attribue = e.requiertRepresentation && representationAssuree;
      return {
        ...e,
        workflow: 'vert',
        statutDette: attribue ? 'ATTRIBUEE' : e.statutDette,
        porteur: attribue ? (cas?.porteurAttribution ?? e.porteur) : e.porteur
      };
    });
  }
  function discuter(id: string) {
    ecritures = ecritures.map((e) => (e.id === id ? { ...e, workflow: 'ambre' } : e));
  }
  function archiver(id: string) {
    ecritures = ecritures.map((e) => (e.id === id ? { ...e, workflow: 'archive' } : e));
  }

  // garde de franchissement (machine d'enquête)
  $: garde = ((): { ok: boolean; raison?: string } => {
    if (!phase) return { ok: true };
    switch (phase.id) {
      case 'rupture':
        return appelReconnu ? { ok: true } : { ok: false, raison: 'Reconnaissez l’expérience première (appelEntendu) pour continuer.' };
      case 'public':
        if (!inventaireConfirme) return { ok: false, raison: 'Confirmez l’inventaire des entités affectées.' };
        if (!inventaireNonVide) return { ok: false, raison: '[BLOCAGE] InventaireNonVide : la liste ne peut pas être vide.' };
        return { ok: true };
      case 'formulation':
        return basesDeclarees ? { ok: true } : { ok: false, raison: 'Déclarez les primitives de Couche 0 et le régime d’obligation.' };
      case 'convention': {
        if (!representationAssuree) return { ok: false, raison: `[${cas?.prealable.titre ?? 'PRÉALABLE'}] Préalable requis avant toute écriture opposable.` };
        const rouges = ecrituresVisibles.filter((e) => e.workflow === 'rouge' || e.workflow === 'ambre');
        if (rouges.length) return { ok: false, raison: `Arbitrez les ${rouges.length} écriture(s) restante(s) (valider ou archiver).` };
        return { ok: true };
      }
      default:
        return { ok: true };
    }
  })();

  $: stepsBar = phases.map((p) => ({ num: p.num, label: p.label }));

  // bilan (phase finale)
  $: bilan = {
    opposables: ecritures.filter((e) => e.workflow === 'vert').length,
    archivees: ecritures.filter((e) => e.workflow === 'archive').length,
    signauxOuverts: ecritures.filter((e) => e.workflow === 'vert' && e.signal)
  };

  const wf: Record<Workflow, { label: string; cls: string; dot: string }> = {
    rouge:   { label: 'Non validée', cls: 'border-red-200 bg-red-50 text-red-800', dot: 'bg-red-400' },
    ambre:   { label: 'En discussion', cls: 'border-amber-200 bg-amber-50 text-amber-800', dot: 'bg-amber-400' },
    vert:    { label: 'Validée — opposable', cls: 'border-emerald-200 bg-emerald-50 text-emerald-800', dot: 'bg-emerald-400' },
    archive: { label: 'Archivée', cls: 'border-slate-200 bg-slate-100 text-slate-500', dot: 'bg-slate-400' }
  };
  const typeActeurCls: Record<TypeActeur, string> = {
    'humain': 'bg-sky-100 text-sky-700',
    'collectif': 'bg-sky-100 text-sky-700',
    'organisation': 'bg-indigo-100 text-indigo-700',
    'non-humain': 'bg-fuchsia-100 text-fuchsia-700',
    'instrumental': 'bg-slate-200 text-slate-700'
  };
</script>

<svelte:head>
  <title>Usage 2 — Registre d'enquête · MRC v5.5</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-4 py-10">

  <header class="mb-8">
    <div class="mb-1 text-xs font-medium uppercase tracking-wide text-amber-600">Usage 2 · Méthodologique</div>
    <h1 class="text-2xl font-bold text-mrc-900">Construire une enquête</h1>
    <p class="mt-3 max-w-3xl text-mrc-600">
      Un registre d'enquête ne se génère pas en un clic : il se construit phase par phase, et son
      journal distingue strictement <b>acteurs</b>, <b>interactions</b> et <b>écritures</b> — les
      trois primitives de Couche 0 du MRC. Cette démonstration rejoue un cas réel. Aucune sortie
      n'est opposable.
    </p>
  </header>

  {#if !cas}
    <h2 class="mb-3 text-lg font-semibold text-mrc-800">Choisir un cas d'enquête</h2>
    <div class="grid gap-4 md:grid-cols-3">
      {#each CAS as c}
        <button class="usage-card text-left {c.jouable ? '' : 'opacity-60'}" on:click={() => choisir(c)} disabled={!c.jouable}>
          <div class="mb-1 text-xs font-medium uppercase tracking-wide text-mrc-400">{c.fiche}</div>
          <h3 class="mb-2 font-semibold text-mrc-900">{c.titre}</h3>
          <p class="text-sm text-mrc-600">{c.resume}</p>
          {#if !c.jouable}<div class="mt-3 text-xs font-medium text-mrc-400">À venir</div>{/if}
        </button>
      {/each}
    </div>

  {:else}
    <div class="mb-4 flex items-center justify-between">
      <div>
        <h2 class="text-lg font-semibold text-mrc-900">{cas.titre}</h2>
        <p class="text-xs text-mrc-500">{cas.fiche}</p>
      </div>
      <button class="text-xs text-mrc-500 underline hover:text-mrc-700" on:click={() => (casId = null)}>← Changer de cas</button>
    </div>

    <Stepper steps={stepsBar} bind:current={phaseIdx} maxReached={phaseIdx} canNext={garde.ok} nextReason={garde.raison ?? ''} accent="amber">
    <div class="grid gap-6 lg:grid-cols-3">

      <!-- Panneau phase -->
      <section class="lg:col-span-2 space-y-4">
        <div class="rounded-2xl border border-mrc-100 bg-white p-6 shadow-sm">
          <div class="mb-2 flex items-baseline gap-2">
            <span class="text-xs font-medium uppercase tracking-wide text-amber-600">Phase {phase.num} / {phases.length}</span>
            <span class="text-xs text-mrc-400">· {phase.periode}</span>
          </div>
          <h2 class="text-xl font-bold text-mrc-900">{phase.label}</h2>
          <dl class="mt-3 space-y-1.5 text-sm">
            <div><dt class="inline font-semibold text-mrc-700">Ancrage MRC : </dt><dd class="inline text-mrc-600">{phase.mrc}</dd></div>
            <div><dt class="inline font-semibold text-mrc-700">Porteur : </dt><dd class="inline text-mrc-600">{phase.porteur}</dd></div>
            <div><dt class="inline font-semibold text-mrc-700">Ce qui se joue : </dt><dd class="inline text-mrc-600">{phase.sortie}</dd></div>
          </dl>

          <div class="mt-5 border-t border-mrc-100 pt-4">
            {#if phase.id === 'rupture'}
              <p class="mb-3 text-sm text-mrc-600">{phase.sortie} Ce n'est pas un rapport mais une expérience directe qui ouvre l'enquête.</p>
              <button class="rounded-lg bg-mrc-700 px-4 py-2 text-sm font-medium text-white hover:bg-mrc-800 disabled:opacity-40" disabled={appelReconnu} on:click={reconnaitreAppel}>
                {appelReconnu ? 'Expérience première reconnue ✓' : 'Reconnaître l’expérience première (appelEntendu)'}
              </button>

            {:else if phase.id === 'public'}
              <p class="mb-2 text-sm font-medium text-mrc-700">Inventaire des entités affectées (InventaireNonVide)</p>
              <div class="space-y-1.5">
                {#each inventaire as item}
                  {@const a = acteur(item.ref)}
                  <label class="flex items-center gap-2 text-sm text-mrc-700">
                    <input type="checkbox" bind:checked={item.inclus} disabled={inventaireConfirme} />
                    <span>{a?.nom}</span>
                    {#if a}<span class="rounded px-1.5 py-0.5 text-xs {typeActeurCls[a.type]}">{a.type}</span>{/if}
                    {#if a?.seuil}<span class="rounded bg-fuchsia-50 px-1.5 py-0.5 text-[10px] text-fuchsia-600">seuil : {a.seuil}</span>{/if}
                  </label>
                {/each}
              </div>
              {#if !inventaireNonVide}<p class="mt-3 text-xs font-semibold text-red-600">[BLOCAGE] L'inventaire ne peut pas être vide.</p>{/if}
              <button class="mt-4 rounded-lg bg-mrc-700 px-4 py-2 text-sm font-medium text-white hover:bg-mrc-800 disabled:opacity-40" disabled={!inventaireNonVide || inventaireConfirme} on:click={confirmerInventaire}>
                {inventaireConfirme ? 'Inventaire confirmé ✓' : 'Confirmer l’inventaire'}
              </button>

            {:else if phase.id === 'formulation'}
              <p class="mb-3 text-sm text-mrc-600">
                On stabilise les <b>primitives de Couche 0</b> — acteur, interaction, écriture — et on déclare
                le <b>régime d'obligation</b>. Ici la dette est <b>SYSTÉMIQUE</b> : elle existe
                sans porteur attribué (les tiers affectés ne peuvent pas la réclamer).
              </p>
              <button class="rounded-lg bg-mrc-700 px-4 py-2 text-sm font-medium text-white hover:bg-mrc-800 disabled:opacity-40" disabled={basesDeclarees} on:click={declarerPrimitives}>
                {basesDeclarees ? 'Primitives & régime déclarés ✓' : 'Déclarer les primitives (Couche 0) + régime SYSTÉMIQUE'}
              </button>

            {:else if phase.id === 'convention'}
              {#if !representationAssuree}
                <div class="mb-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
                  <p class="font-semibold">[{cas.prealable.titre}]</p>
                  <p class="mt-1">{cas.prealable.texte}</p>
                  <button class="mt-2 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700" on:click={assurerRepresentation}>{cas.prealable.bouton}</button>
                </div>
              {:else}
                <p class="mb-2 text-xs font-medium text-emerald-700">{cas.prealable.ok}</p>
              {/if}
              <p class="text-sm text-mrc-600">Validez ou archivez chaque écriture dans le journal. Le LLM ne valide jamais : c'est un acte humain (R-INCAPACITE-LLM-VALIDER).</p>

            {:else if phase.id === 'epreuve'}
              <p class="text-sm text-mrc-600">
                {phase.sortie} Le journal inscrit une <b>écriture d'écart</b> et lève un signal de
                <b>découplage de régimes</b> (voir le journal).
              </p>

            {:else if phase.id === 'reevaluation'}
              <p class="mb-3 text-sm text-mrc-600">{phase.sortie} L'enquête reste ouverte — bilan de session :</p>
              <div class="grid grid-cols-3 gap-3 text-center">
                <div class="rounded-lg border border-emerald-200 bg-emerald-50 p-3"><div class="text-2xl font-bold text-emerald-700">{bilan.opposables}</div><div class="text-xs text-emerald-700">écritures opposables</div></div>
                <div class="rounded-lg border border-slate-200 bg-slate-50 p-3"><div class="text-2xl font-bold text-slate-600">{bilan.archivees}</div><div class="text-xs text-slate-600">propositions archivées</div></div>
                <div class="rounded-lg border border-amber-200 bg-amber-50 p-3"><div class="text-2xl font-bold text-amber-700">{bilan.signauxOuverts.length}</div><div class="text-xs text-amber-700">signaux ouverts</div></div>
              </div>
              {#if bilan.signauxOuverts.length}
                <div class="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-amber-700">Signaux ouverts — à suivre</p>
                  <ul class="space-y-1.5">
                    {#each bilan.signauxOuverts as e}
                      <li class="text-sm text-amber-900"><span class="font-medium">{e.signal}</span><span class="block text-xs text-amber-700/80">{e.libelle}</span></li>
                    {/each}
                  </ul>
                </div>
              {/if}
              <p class="mt-4 text-xs text-mrc-500">Sur un commun vivant, l'enquête ne se clôt pas : une écriture validée n'est jamais supprimée — une révision produit une nouvelle écriture liée, jamais un effacement.</p>
              <button class="mt-4 rounded-lg border border-mrc-200 px-4 py-2 text-sm font-medium text-mrc-700 hover:bg-mrc-50" on:click={reset}>Recommencer l'enquête</button>
            {/if}
          </div>
        </div>
      </section>

      <!-- Journal : 4 registres distincts -->
      <aside class="space-y-3">
        <MrcStatusBadge statut={bilan.opposables > 0 ? 'valide' : 'non-valide'} />

        <!-- ACTEURS -->
        <div class="rounded-2xl border border-mrc-100 bg-white p-4 shadow-sm">
          <h3 class="mb-2 text-sm font-semibold text-mrc-800">Acteurs <span class="font-normal text-mrc-400">· {acteursVisibles.length}</span></h3>
          {#if !acteursVisibles.length}
            <p class="text-xs text-mrc-400">Les acteurs s'inscrivent au fil des phases.</p>
          {:else}
            <div class="space-y-1.5">
              {#each acteursVisibles as a}
                <div class="rounded-lg border border-mrc-100 p-2 text-xs">
                  <div class="flex items-center gap-1.5">
                    <span class="rounded px-1.5 py-0.5 text-[10px] {typeActeurCls[a.type]}">{a.type}</span>
                    <span class="font-medium text-mrc-800">{a.nom}</span>
                  </div>
                  <p class="mt-0.5 text-mrc-500">{a.role}{a.seuil ? ` · seuil : ${a.seuil}` : ''}</p>
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <!-- INTERACTIONS -->
        <div class="rounded-2xl border border-mrc-100 bg-white p-4 shadow-sm">
          <h3 class="mb-2 text-sm font-semibold text-mrc-800">Interactions <span class="font-normal text-mrc-400">· {interactionsVisibles.length}</span></h3>
          {#if !interactionsVisibles.length}
            <p class="text-xs text-mrc-400">Aucune interaction inscrite à ce stade.</p>
          {:else}
            <div class="space-y-1.5">
              {#each interactionsVisibles as i}
                <div class="rounded-lg border border-purple-100 bg-purple-50/40 p-2 text-xs">
                  <p class="font-medium text-purple-900">{nomActeur(i.de)} <span class="text-purple-500">→</span> {nomActeur(i.vers)}</p>
                  <p class="mt-0.5 text-mrc-600">{i.nature}</p>
                </div>
              {/each}
            </div>
          {/if}
        </div>

        <!-- ÉCRITURES -->
        <div class="rounded-2xl border border-mrc-100 bg-white p-4 shadow-sm">
          <h3 class="mb-2 text-sm font-semibold text-mrc-800">Écritures <span class="font-normal text-mrc-400">· {ecrituresVisibles.length}</span></h3>
          {#if !ecrituresVisibles.length}
            <p class="text-xs text-mrc-400">Les écritures (R1 débit/crédit) apparaissent à partir de la Convention.</p>
          {:else}
            <div class="space-y-2">
              {#each ecrituresVisibles as e}
                <div class="rounded-lg border p-3 text-xs {wf[e.workflow].cls}">
                  <div class="flex items-center justify-between gap-2">
                    <span class="rounded bg-white/70 px-1.5 py-0.5 font-semibold">{e.sens}</span>
                    <span class="flex items-center gap-1"><span class="h-2 w-2 rounded-full {wf[e.workflow].dot}"></span>{wf[e.workflow].label}</span>
                  </div>
                  <p class="mt-1.5 font-medium">{e.libelle}</p>
                  <p class="mt-1 text-[11px] opacity-80">
                    Régime : {e.regime} · dette : {e.statutDette}{e.porteur ? ` · porteur : ${e.porteur}` : ''}
                  </p>
                  <p class="mt-0.5 text-[11px] opacity-70">Acteurs : {e.acteurs.map(nomActeur).join(', ')}{e.interaction ? ' · via interaction' : ''}</p>
                  <p class="mt-0.5 italic opacity-70">{e.source}</p>
                  {#if phase.id === 'convention' && (e.workflow === 'rouge' || e.workflow === 'ambre') && e.phase <= numPhase}
                    <div class="mt-2 flex gap-1.5">
                      <button class="rounded bg-emerald-600 px-2 py-1 text-xs font-medium text-white hover:bg-emerald-700 disabled:opacity-40" disabled={!representationAssuree && e.requiertRepresentation} on:click={() => valider(e.id)}>Valider</button>
                      {#if e.workflow === 'rouge'}
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

        <!-- SIGNAUX -->
        <div class="rounded-2xl border border-mrc-100 bg-white p-4 shadow-sm">
          <h3 class="mb-2 text-sm font-semibold text-mrc-800">Signaux <span class="font-normal text-mrc-400">· {signauxVisibles.length}</span></h3>
          {#if !signauxVisibles.length}
            <p class="text-xs text-mrc-400">Aucun signal levé à ce stade.</p>
          {:else}
            <div class="space-y-1.5">
              {#each signauxVisibles as s}
                <div class="rounded-lg border border-amber-100 bg-amber-50/50 p-2 text-xs">
                  <p class="font-semibold text-amber-800">🚨 {s.code}</p>
                  <p class="mt-0.5 text-mrc-600">{s.libelle}</p>
                </div>
              {/each}
            </div>
          {/if}
        </div>
      </aside>
    </div>
    </Stepper>
  {/if}

  {#if cas}
  <div class="mt-10 border-t border-mrc-100 pt-4 text-xs text-mrc-400 space-y-1.5">
    {#if cas.id === 'mar-menor'}
      <p>
        <b class="text-mrc-600">Source des faits.</b> Thomas Fabre, « La lagune de Mar Menor en Espagne »
        (Section 1), in D. Bourg, T. Fabre &amp; E. Zürcher, <i>Droits de la nature et gouvernance — En quoi
        l'institution « Droits de la nature » améliore-t-elle la gouvernance environnementale ?</i>,
        responsables scientifiques D. Bourg &amp; S. Swaton, La Coop des Communs / Fondation Zoein,
        étude réalisée nov. 2023 – déc. 2025.
      </p>
      <p>
        <b class="text-mrc-600">Décomposition en 6 phases.</b> Lecture deweyenne de l'enquête collective
        (G-DEMO-EPISTEMIQUE / NT-G10, MRC v5.5) — couche interprétative distincte des faits, non imputable à T. Fabre.
      </p>
      <p>
        [LACUNES] Correspondance phases historiques ↔ objets MRC construite en mode procédural, non calcul formel.
        Les faits 2025-2026 (décret d'application, démission de la tutrice, procès Topillo) ont le statut de sources
        primaires du corpus Fabre, non de faits indépendamment vérifiés ici.
      </p>
    {:else if cas.id === 'soins'}
      <p>
        <b class="text-mrc-600">Source des faits.</b> Musseau J., « Le pouvoir d'agir des soignants au
        risque du dialogue sur la qualité du travail », <i>Soins Cadres</i>, nº 164, mars-avril 2026, Elsevier Masson.
        L'intervention dans l'Ehpad (2014-2022) est documentée par : Zittoun M. &amp; Clot Y., « Une intervention
        dans un Ehpad. L'animation réciproque de la discussion », <i>Psychologie du Travail et des Organisations</i>,
        2020, 26(1), 56–70 ; cadre théorique : clinique de l'activité (Y. Clot et al.).
      </p>
      <p>
        <b class="text-mrc-600">Décomposition en 6 phases.</b> Lecture en enquête collective (G-DEMO-EPISTEMIQUE,
        F1 Mode travail, R-ACTIVITE-EMPECHEE, MRC v5.5) — couche interprétative distincte du texte source.
      </p>
      <p>
        [LACUNES] Correspondance épisodes d'intervention ↔ objets MRC construite en mode procédural, non calcul formel.
        Le « pouvoir d'agir » (clinique de l'activité) et la primitive MRC ne sont pas formellement équivalents.
      </p>
    {:else if cas.id === 'care'}
      <p>
        <b class="text-mrc-600">Source des faits et chiffres.</b> Fiche pédagogique « Exploitation B —
        CARE/IDEA 4 », Fermes d'Avenir (2023/2024) ; Guide CARE V4F, Fermes d'Avenir. Cadre théorique :
        J. Richard, D. Bensadon &amp; A. Rambaud, <i>Comptabilité financière</i> (Dunod, 2018/2024) ;
        A. Rambaud (2019), comptabilité CARE ; L. Dumeaux (2025), thèse Paris-Dauphine PSL, juste prix écologique.
      </p>
      <p>
        <b class="text-mrc-600">Lecture MRC.</b> P. Musseau-Milesi, <i>MRC v5.3 — Annexe K, Cas n°1 : Exploitation B
        (CARE/IDEA4)</i>, La Coop des Communs, 2026 (lecture F8 · P-C-E-D-e-d · Couche 0) — couche interprétative
        distincte des faits comptables.
      </p>
      <p>
        [LACUNES] Les chiffres sont ceux de l'exercice 2022 (fiche Fermes d'Avenir), non revérifiés ici.
        R-PRIORITE-CREANCIERS et source_valuemetre n'étaient pas formalisés en v5.3 — le cas en révèle le besoin.
        F8 relève principalement de l'Usage 3 (notarié) ; en Usage 2, l'écriture comptable est proposée et validée
        par un comité humain, jamais par un LLM (R-INCAPACITE-LLM-VALIDER).
      </p>
    {/if}
    <p>Démonstration ; aucune écriture n'est opposable, aucune donnée n'est conservée.</p>
  </div>
  {/if}
</div>
