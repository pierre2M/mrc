/**
 * Données de l'interface pédagogique MRC v5.5 — « Comprendre, pas à pas ».
 * Transcription fidèle du set pédago v5.5 (mrc_v55_pedago.html), porté en
 * module typé pour la route SvelteKit /pedagogie.
 *
 * Régime : vulgarisation dérivée du set MRC v5.5 (procédural, non calcul formel).
 * Les exemples [K3] reprennent la structure du cas « bassins versants » (GRET) ;
 * les exemples [ILLUSTRATIF] sont pédagogiques. Plusieurs sources primaires des
 * grammaires récentes restent [PLAUSIBLE, NON VÉRIFIÉ].
 */

export type Layer = 0 | 1 | 2 | 3;

export interface Exemple {
  /** Titre de la situation */
  t: string;
  /** Régime de l'exemple : K3 (cas chiffré) ou ILLUSTRATIF (pédagogique) */
  k: 'K3' | 'ILLUSTRATIF';
  /** Présentation de la situation */
  p: string;
  /** Traitement par le MRC */
  r: string;
}

export interface Relation {
  /** id de l'objet relié */
  to: string;
  /** nature du lien */
  text: string;
}

export interface MrcObjet {
  id: string;
  layer: Layer;
  ico: string;
  name: string;
  code: string;
  /** Note théorique de rattachement (grammaires uniquement) */
  nt?: string;
  /** Branche de Couche 2, le cas échéant */
  branch?: string | null;
  what: string;
  how: string;
  rel: Relation[];
  ex: Exemple[];
}

export const layerMeta: Record<Layer, { tag: string; title: string; q: string }> = {
  0: { tag: 'C0', title: 'Couche 0 — Les briques de base', q: 'Avec quoi décrit-on une situation ?' },
  1: { tag: 'C1', title: 'Couche 1 — Les règles du jeu', q: 'Quelles règles tiennent toujours, quoi qu\'il arrive ?' },
  2: { tag: 'C2', title: 'Couche 2 — Les modes d\'emploi', q: 'Comment applique-t-on tout ça à un domaine concret ?' },
  3: { tag: 'C3', title: 'Couche 3 — Les manières de lire', q: 'Sous quel angle qualifie-t-on l\'obligation ?' }
};

/** Regroupement des fiches de Couche 2 par branche, comme dans le set pédago. */
export const branchesCouche2: { title: string; ids: string[] }[] = [
  { title: '▸ Branche TRAVAIL', ids: ['F1', 'F9'] },
  { title: '▸ Branche MILIEU', ids: ['F2'] },
  { title: '▸ Autres modes d\'emploi', ids: ['F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F10'] }
];

export const objets: MrcObjet[] = [
  // ---------------- COUCHE 0 ----------------
  {
    id: 'regimeobligation', layer: 0, ico: '🎯', name: 'À qui revient la responsabilité ?', code: 'regimeobligation',
    what: "Indique si une obligation a un responsable identifié, aucun, ou un mélange des deux.",
    how: "Trois valeurs possibles, qu'on déclare explicitement : ACTORIEL (un porteur nommé), SYSTÉMIQUE (personne n'est désigné), HYBRIDE (plusieurs co-responsables). C'est une donnée de départ, jamais devinée par la machine.",
    rel: [
      { to: 'fractionactorielle', text: "fixe la part qui revient à chaque responsable nommé" },
      { to: 'C-STATUT-DETTE', text: "détermine l'état de la dette qui en découle (a-t-elle un débiteur ?)" },
      { to: 'G-RESPONSABILITE', text: "la grammaire Responsabilité s'appuie dessus pour qualifier l'obligation" }
    ],
    ex: [
      { t: "Une nappe d'eau polluée par plusieurs irrigants", k: 'K3', p: "Dans la zone des Niayes, plusieurs exploitants pompent et polluent la même nappe. Aucun n'est « le » coupable.", r: "Le registre inscrit l'obligation comme SYSTÉMIQUE : la dette envers le milieu existe, mais sans débiteur unique — elle ne peut donc pas être ignorée sous prétexte qu'« on ne sait pas à qui la mettre »." },
      { t: "Des congés non payés", k: 'ILLUSTRATIF', p: "Un employeur précis doit des congés à un salarié précis.", r: "Obligation ACTORIEL : un porteur nommé, une part de 100 %. Cas simple, classique." },
      { t: "La dette climatique d'une coopérative", k: 'ILLUSTRATIF', p: "Une coopérative émet du CO₂ ; une part lui est imputable, une autre relève d'un système plus large.", r: "Obligation HYBRIDE : on déclare la liste des co-responsables plutôt que de tout coller à un seul ou de diluer la responsabilité dans « le système »." }
    ]
  },
  {
    id: 'fractionactorielle', layer: 0, ico: '📊', name: 'Quelle part pour chaque responsable ?', code: 'fractionactorielle',
    what: "Le pourcentage de responsabilité qu'on attribue à un acteur nommé.",
    how: "Un nombre entre 0 et 1, qui doit être délibéré et déclaré — jamais calculé automatiquement. Règle de cohérence : une part de 100 % veut dire (et seulement dans ce cas) que l'obligation est ACTORIELLE.",
    rel: [
      { to: 'regimeobligation', text: "doit être cohérente avec le régime déclaré (100 % ⇔ ACTORIEL)" },
      { to: 'G-PERFORMATIVITE', text: "si on pose une part sans règle d'attribution, on crée un chiffre qui « fait la réalité » sans gouvernance — alerte performativité" }
    ],
    ex: [
      { t: "Répartir la dette de pollution", k: 'K3', p: "Faut-il imputer 40 % de la dégradation aux miniers, 30 % aux agro-industriels ? Aucun capteur ne « mesure » cette part.", r: "Le MRC interdit de présenter ce partage comme un calcul objectif : il exige qu'il soit décidé en délibération et inscrit comme tel. Un partage non délibéré est signalé comme instrument performatif non gouverné." }
    ]
  },
  {
    id: 'collectifhybridedeclare', layer: 0, ico: '👥', name: 'La liste des co-responsables', code: 'collectifhybridedeclare',
    what: "Quand personne n'est seul responsable, on inscrit nommément le groupe qui partage la charge.",
    how: "Une simple liste d'acteurs (identifiés par un DID) renseignée dès que l'obligation est SYSTÉMIQUE ou HYBRIDE.",
    rel: [
      { to: 'regimeobligation', text: "n'est rempli que pour les régimes SYSTÉMIQUE ou HYBRIDE" }
    ],
    ex: [
      { t: "Le collège absent", k: 'K3', p: "Sur les trois bassins, les gros acteurs économiques (miniers, agro-industriels) sont souvent absents des instances.", r: "Les inscrire dans la liste des co-responsables rend leur absence visible et opposable : on ne peut plus faire comme s'ils n'existaient pas dans le partage des charges." }
    ]
  },

  // ---------------- COUCHE 1 ----------------
  {
    id: 'R1', layer: 1, ico: '⚖️', name: 'Rien sans contrepartie', code: 'R1 — DÉBIT/CRÉDIT',
    what: "La règle comptable de base : toute écriture a deux faces, on ne peut pas inscrire un gain sans inscrire ce qu'il coûte.",
    how: "Comme en comptabilité classique : à chaque crédit correspond un débit. Au MRC, cela force tout engagement fort à avoir une contrepartie réfutable.",
    rel: [
      { to: 'C-STATUT-DETTE', text: "son extension pour les dettes qui n'ont pas encore de débiteur" },
      { to: 'F8', text: "la fiche comptable applique concrètement cette règle" },
      { to: 'G-VALUATION', text: "la grammaire Valuation gouverne les chiffres qui y entrent" }
    ],
    ex: [
      { t: "Distribuer des bénéfices", k: 'K3', p: "Un territoire veut redistribuer les bénéfices tirés de l'usage de l'eau.", r: "Impossible d'inscrire la distribution (crédit) sans inscrire en face la dette envers le milieu (débit). La distribution discrétionnaire ne peut pas masquer ce qu'on doit à la nappe." }
    ]
  },
  {
    id: 'C-STATUT-DETTE', layer: 1, ico: '🏷️', name: 'Une dette a-t-elle un responsable ?', code: 'C-STATUT-DETTE',
    what: "Étiquette l'état d'une obligation : qui doit, à qui, et où on en est.",
    how: "Trois états : ATTRIBUÉE (un débiteur nommé), SYSTÉMIQUE_NON_ATTRIBUÉE (réelle mais sans débiteur, en attente), EN_DÉLIBÉRATION (on cherche le responsable). On peut inscrire une dette sans débiteur — mais elle doit alors entrer dans la procédure prévue.",
    rel: [
      { to: 'R1', text: "étend la règle comptable aux dettes sans débiteur immédiat" },
      { to: 'machine-etats', text: "son état ne peut changer que selon des transitions autorisées" },
      { to: 'F8', text: "défini une seule fois ici, appliqué dans la fiche comptable" }
    ],
    ex: [
      { t: "La dette envers la rivière", k: 'K3', p: "La Drôme subit une dégradation, mais aucun acteur unique n'en est juridiquement débiteur.", r: "On l'inscrit comme SYSTÉMIQUE_NON_ATTRIBUÉE : la dette est visible, comptée, et déclenche une délibération pour lui trouver un porteur — au lieu de disparaître faute de coupable." }
    ]
  },
  {
    id: 'machine-etats', layer: 1, ico: '🚦', name: 'On ne saute pas les étapes', code: 'transition_valide',
    what: "L'enchaînement obligatoire entre les états d'une dette : on ne peut pas déclarer une situation « critique » sans avoir d'abord cherché un responsable.",
    how: "Une seule sortie pour une dette sans responsable : aller vers la délibération. Interdiction d'aller directement au niveau CRITIQUE. Il faut d'abord trouver un porteur, ensuite seulement la criticité devient mobilisable.",
    rel: [
      { to: 'C-STATUT-DETTE', text: "régit les changements d'état de la dette" },
      { to: 'G-RESPONSABILITE', text: "porte l'interdit absolu : en régime systémique il déclenche la délibération, pas l'urgence directe — verrou contre l'usage de l'urgence pour contourner la responsabilité" }
    ],
    ex: [
      { t: "« C'est une urgence, agissons ! »", k: 'ILLUSTRATIF', p: "Face à une crise écologique, la tentation est de décréter l'état d'urgence et d'agir sans désigner de responsable.", r: "La machine d'états l'interdit : inscription → délibération → attribution d'un porteur → seulement alors accès au niveau critique. L'urgence ne sert plus d'excuse pour ne désigner personne." }
    ]
  },
  {
    id: 'InventaireNonVide', layer: 1, ico: '📋', name: 'Lister tout ce qui est affecté', code: 'INVENTAIRE-ASSETS-ACTIFS',
    what: "Avant de conclure, on dresse la liste complète des entités touchées — y compris non-humaines.",
    how: "Déclenché dès qu'une obligation est systémique, qu'un milieu est dégradé durablement, ou qu'un « appel » reste sans réponse. La liste ne peut pas être vide. Pour chaque entité non-humaine, on déclare son seuil d'entrée dans la communauté morale (sentience, finalité propre, ou non déclaré).",
    rel: [
      { to: 'G-MESOLOGIE', text: "déclenché par un milieu dégradé persistant" },
      { to: 'G-JUSTICE', text: "le seuil d'entrée des non-humains est ancré dans la grammaire Justice" },
      { to: 'G-RESPONSABILITE', text: "déclenché par un appel immanent non entendu" }
    ],
    ex: [
      { t: "Qui compte dans le bassin ?", k: 'K3', p: "Avant d'arbitrer l'usage de l'eau, qui inscrit-on ? Les irrigants, oui — mais aussi la nappe, les zones humides, les espèces ?", r: "L'inventaire oblige à lister la nappe et les milieux comme entités mobilisées, avec leur seuil moral déclaré. On ne peut pas clore l'analyse en « oubliant » le milieu." }
    ]
  },
  {
    id: 'REPRESENTATION-PROSPECTIVE', layer: 1, ico: '🔮', name: 'Qui parle pour ceux qui ne sont pas là ?', code: 'REPRESENTATION-PROSPECTIVE',
    what: "Quand une décision engage des générations futures, on doit déclarer qui les représente et sur quelle base.",
    how: "Déclenché pour les horizons intergénérationnels. On déclare la légitimité du représentant (pratique, délibérative, juridique, ou « planétaire non désignée »). Si cette base est fragile, énoncer une condition de réfutation devient obligatoire.",
    rel: [
      { to: 'principeintergenerationnel', text: "précise quel principe de justice entre générations on applique" },
      { to: 'G-RESPONSABILITE', text: "ancre la légitimité du représentant" },
      { to: 'G-JUSTICE', text: "pour l'horizon planétaire sans structure de représentation" }
    ],
    ex: [
      { t: "Décider d'un prélèvement sur 50 ans", k: 'ILLUSTRATIF', p: "Vider une nappe lentement engage des gens pas encore nés, qui ne peuvent ni signer ni protester.", r: "Le registre exige de nommer un représentant prospectif et de déclarer sur quelle base il parle. Sans cela, la décision n'est pas un acte gouverné mais une usurpation non tracée. [ENGAGEMENT À HORIZON IRRÉVERSIBLE]." }
    ]
  },
  {
    id: 'principeintergenerationnel', layer: 1, ico: '⏳', name: 'Que doit-on aux générations futures ?', code: 'principeintergenerationnel',
    what: "Le principe de justice entre générations qu'on choisit d'appliquer — déclaré, pas supposé.",
    how: "Quatre options déclarables : ne pas décliner (NON-DECLINE), laisser un meilleur futur (BETTER-FUTURE), garantir un suffisant (SUFFICIENCY), ou tenir un chemin étroit (NARROW-PATH).",
    rel: [
      { to: 'REPRESENTATION-PROSPECTIVE', text: "le représentant des futurs applique l'un de ces principes" },
      { to: 'G-RESPONSABILITE', text: "l'ancrage et la vérification de ces principes y sont portés" }
    ],
    ex: [
      { t: "Quel niveau de nappe transmettre ?", k: 'ILLUSTRATIF', p: "Doit-on rendre la nappe meilleure, juste suffisante, ou éviter qu'elle décline ?", r: "Le MRC ne tranche pas à votre place : il exige de déclarer lequel des quatre principes guide la décision, pour qu'on puisse en débattre plutôt que de le laisser implicite." }
    ]
  },

  // ---------------- COUCHE 2 : FICHES ----------------
  {
    id: 'F1', layer: 2, ico: '💼', name: 'La qualité réelle du travail', code: 'F1 — Mode travail', branch: 'travail',
    what: "Inscrit le travail non comme un coût RH, mais comme la possibilité réelle d'exercer un métier dont on est reconnu juge.",
    how: "Mobilise des sous-couches sur la qualité de l'emploi et la reconnaissance du salarié. Renvoie à la grammaire Travail.",
    rel: [
      { to: 'G-TRAVAIL', text: "la grammaire qui qualifie la qualité du travail" },
      { to: 'G-SOIN', text: "articule le travail de soin non compté" },
      { to: 'G-AFFECTIF', text: "les conditions émotionnelles du métier" }
    ],
    ex: [
      { t: "Un salarié jugé « non qualifié »", k: 'ILLUSTRATIF', p: "Un agent connaît parfaitement son terrain mais n'a aucun diplôme reconnu.", r: "La fiche inscrit sa capabilité réelle et le reconnaît comme juge légitime de son métier, au lieu de le réduire à une case RH." }
    ]
  },
  {
    id: 'F2', layer: 2, ico: '🌱', name: "L'habitabilité d'un milieu", code: 'F2 — Mode milieu', branch: 'milieu',
    what: "Inscrit l'état vivant d'un milieu (eau, sol, air) et la façon dont travail et milieu se dégradent ensemble.",
    how: "Catégorie de base « présence × quantité × qualité × horizon ». Renvoie à la grammaire Mésologie.",
    rel: [
      { to: 'G-MESOLOGIE', text: "la grammaire qui pense le milieu comme relation" },
      { to: 'G-SOIN', text: "la co-dégradation travail↔milieu" },
      { to: 'G-RESPONSABILITE', text: "la dette envers le milieu" }
    ],
    ex: [
      { t: "Mesurer la nappe sans l'appauvrir", k: 'K3', p: "Les indicateurs nationaux ne retiennent que la quantité d'eau (Q), en oubliant présence et horizon.", r: "La fiche garde les quatre dimensions et rend visible la perte d'information quand on projette vers un indicateur purement quantitatif." }
    ]
  },
  {
    id: 'F3', layer: 2, ico: '🔤', name: "Les mots et catégories qu'on emploie", code: 'F3 — Mode sémantique', branch: null,
    what: "Trace les catégories de base utilisées et garde la mémoire de comment elles ont été construites.",
    how: "Inscription, traçabilité, corpus. La méthode formelle d'analyse (treillis de concepts) vit dans l'annexe méthodologique.",
    rel: [
      { to: 'G-PERFORMATIVITE', text: "les catégories « font » la réalité qu'elles décrivent" },
      { to: 'G-EVOLUTIVITE', text: "les catégories résistent au changement" }
    ],
    ex: [
      { t: "« Usager » ou « ayant droit » ?", k: 'ILLUSTRATIF', p: "Nommer quelqu'un « usager » ou « ayant droit » change ce qu'il peut réclamer.", r: "La fiche trace ce choix de catégorie comme un acte, pas comme une évidence neutre." }
    ]
  },
  {
    id: 'F4', layer: 2, ico: '🧭', name: "Ce qui est irréversible et vital", code: 'F4 — Mode existentiel', branch: null,
    what: "Inscrit les obligations qui touchent à l'habitabilité, l'irréversibilité et la justice entre générations.",
    how: "Finalité immanente, indexation sur l'horizon, mémoire des pertes. Renvoie à la grammaire Responsabilité.",
    rel: [
      { to: 'G-RESPONSABILITE', text: "la grammaire centrale qu'elle instrumente" }
    ],
    ex: [
      { t: "Une décision sans retour", k: 'ILLUSTRATIF', p: "Assécher définitivement une zone humide.", r: "La fiche marque l'acte comme irréversible et bloque la conclusion tant qu'une délibération n'a pas eu lieu." }
    ]
  },
  {
    id: 'F5', layer: 2, ico: '🧠', name: "Pourquoi on n'arrive pas à changer", code: 'F5 — Mode cognitif', branch: null,
    what: "Inscrit les pièges mentaux collectifs qui empêchent un groupe de réviser ses comportements même quand c'est rationnel.",
    how: "Attracteurs cognitifs, biais de prestige, niveaux d'explication. Renvoie à la grammaire Évolutivité.",
    rel: [
      { to: 'G-EVOLUTIVITE', text: "la grammaire des pièges cognitifs" }
    ],
    ex: [
      { t: "« On a toujours fait comme ça »", k: 'ILLUSTRATIF', p: "Un comité refuse une règle pourtant mieux fondée, par habitude et prestige.", r: "La fiche inscrit ce blocage comme un attracteur cognitif identifié, avec un acteur porteur, au lieu d'un simple « manque d'information »." }
    ]
  },
  {
    id: 'F6', layer: 2, ico: '✊', name: "Le plancher en deçà duquel c'est injuste", code: 'F6 — Mode justice', branch: null,
    what: "Inscrit les injustices : manque de capabilités, de reconnaissance, de pouvoir, ou injustice à être cru.",
    how: "Capabilités plancher, pouvoir, position de victime. Renvoie à la grammaire Justice.",
    rel: [
      { to: 'G-JUSTICE', text: "la grammaire qu'elle instrumente" }
    ],
    ex: [
      { t: "Ne pas être cru", k: 'ILLUSTRATIF', p: "Des habitants signalent une pollution mais ne sont pas pris au sérieux faute de « preuve experte ».", r: "La fiche inscrit cette injustice testimoniale : leur parole compte comme savoir, et son rejet est tracé." }
    ]
  },
  {
    id: 'F7', layer: 2, ico: '🎭', name: "Quand un groupe se trouve un bouc émissaire", code: 'F7 — Mode mimétique', branch: null,
    what: "Inscrit non pas la crise elle-même, mais la dynamique qui y mène : montée de rivalité puis désignation d'un coupable.",
    how: "Désir mimétique, méconnaissance, position de victime. Renvoie à la grammaire Mimétique.",
    rel: [
      { to: 'G-MIMETIQUE', text: "la grammaire qu'elle instrumente" },
      { to: 'G-JUSTICE', text: "le bouc émissaire comme injustice extrême" }
    ],
    ex: [
      { t: "Un coupable commode", k: 'ILLUSTRATIF', p: "Une tension monte dans un collectif jusqu'à ce que tous se liguent contre un membre.", r: "La fiche trace la montée de rivalité et la désignation, pour qu'on voie le mécanisme au lieu de croire que « c'est sa faute »." }
    ]
  },
  {
    id: 'F8', layer: 2, ico: '🧮', name: "Les chiffres et les prix, sous surveillance", code: 'F8 — Mode comptable', branch: null,
    what: "Inscrit les valeurs, seuils et prix — et les rend gouvernables au lieu de les laisser passer pour neutres.",
    how: "Applique la règle débit/crédit et le statut de dette. Tout chiffre doit déclarer sa source. Renvoie à la grammaire Valuation.",
    rel: [
      { to: 'G-VALUATION', text: "la grammaire qui gouverne les instruments de mesure" },
      { to: 'C-STATUT-DETTE', text: "implémente concrètement l'état des dettes" }
    ],
    ex: [
      { t: "Un « juste prix » de l'eau", k: 'K3', p: "Fixer un prix de l'eau, c'est poser un chiffre qui oriente tous les comportements.", r: "La fiche exige que ce prix déclare d'où il vient et qui l'a fixé — sinon c'est un instrument performatif non gouverné." }
    ]
  },
  {
    id: 'F9', layer: 2, ico: '❤️', name: "Le climat émotionnel d'un collectif", code: 'F9 — Mode affectif', branch: 'travail',
    what: "Inscrit ce qui relève du travail émotionnel, de la reconnaissance, des défenses de métier ou de la mésentente.",
    how: "Qualifie un régime collectif sans psychologiser les individus. Renvoie à la grammaire Affectif.",
    rel: [
      { to: 'G-AFFECTIF', text: "la grammaire qu'elle instrumente" },
      { to: 'G-SOIN', text: "le travail émotionnel comme soin" }
    ],
    ex: [
      { t: "Faire bonne figure en permanence", k: 'ILLUSTRATIF', p: "Une équipe doit afficher l'enthousiasme alors que la charge émotionnelle est concentrée et non reconnue.", r: "La fiche inscrit ce « surface-acting » prolongé comme une inhabitabilité affective, pas comme un problème individuel." }
    ]
  },
  {
    id: 'F10', layer: 2, ico: '🗳️', name: "Qui a le droit de savoir et décider", code: 'F10 — Mode démocratique', branch: null,
    what: "Inscrit la légitimité épistémique des décisions : qui peut produire un savoir valide, et empêche la confiscation par les experts.",
    how: "Enquête démocratique, formes de délibération, statut d'écriture. Renvoie à la grammaire Démocratie épistémique.",
    rel: [
      { to: 'G-DEMO-EPISTEMIQUE', text: "la grammaire qu'elle instrumente" },
      { to: 'G-RESPONSABILITE', text: "articulée à la responsabilité des décisions" }
    ],
    ex: [
      { t: "Un algorithme qui « valide »", k: 'ILLUSTRATIF', p: "Un outil technique prétend valider seul une décision collective.", r: "La fiche pose qu'un LLM ou un instrument ne peut pas valider à la place des sujets concernés : il faut une enquête incluant les absents." }
    ]
  },

  // ---------------- COUCHE 3 : GRAMMAIRES ----------------
  {
    id: 'G-EVOLUTIVITE', layer: 3, ico: '🧠', nt: 'NT-G1', name: 'Pourquoi le changement coince', code: 'G-EVOLUTIVITE · NT-G1',
    what: "Explique pourquoi des dispositifs bien fondés échouent à changer les comportements, sans réduire ça à un manque d'info.",
    how: "Repère les « attracteurs » cognitifs (habitudes, prestige) qui retiennent un groupe, avec un acteur porteur identifié.",
    rel: [
      { to: 'G-MIMETIQUE', text: "les pièges cognitifs nourrissent les crises mimétiques" },
      { to: 'G-AFFECTIF', text: "les blocages ont une face émotionnelle" },
      { to: 'G-JUSTICE', text: "un biais peut produire une injustice" }
    ],
    ex: [
      { t: "Le réflexe du prestige", k: 'ILLUSTRATIF', p: "Un comité suit l'avis du membre le plus prestigieux plutôt que le mieux argumenté.", r: "La grammaire nomme ce biais (prestige bias), lui donne un porteur et un critère, pour le rendre corrigible." }
    ]
  },
  {
    id: 'G-RESPONSABILITE', layer: 3, ico: '🧭', nt: 'NT-G2', name: 'Le cœur : qui répond de quoi', code: 'G-RESPONSABILITE · NT-G2',
    what: "La grammaire pivot : finalité propre des entités, habitabilité, irréversibilité, justice entre générations.",
    how: "Consomme « à qui revient la responsabilité » et la machine d'états. Empêche qu'une urgence serve à éviter de désigner un responsable.",
    rel: [
      { to: 'G-JUSTICE', text: "habitabilité systémique ↔ capabilité individuelle (couplage clé)" },
      { to: 'G-MIMETIQUE', text: "une responsabilité peut masquer un bouc émissaire" },
      { to: 'G-MESOLOGIE', text: "la dette envers le milieu" },
      { to: 'G-VALUATION', text: "les chiffres qui mesurent la dette" }
    ],
    ex: [
      { t: "L'appel du milieu non entendu", k: 'K3', p: "La nappe se dégrade et « appelle » une réponse, mais aucun acteur ne se reconnaît débiteur.", r: "La grammaire transforme cet appel en obligation inscrite, force l'inventaire et la délibération, et interdit de clore sans porteur." }
    ]
  },
  {
    id: 'G-SOIN', layer: 3, ico: '🤲', nt: 'NT-G3', name: 'Le travail invisible qui rend tout possible', code: 'G-SOIN · NT-G3',
    what: "Rend inscriptible le travail de soin (reproductif, attentionnel) que les registres standards ne comptent jamais.",
    how: "Repère aussi la co-dégradation : quand les conditions de travail et le milieu se détériorent ensemble.",
    rel: [
      { to: 'G-MESOLOGIE', text: "co-dégradation travail↔milieu" },
      { to: 'G-AFFECTIF', text: "le soin a une charge émotionnelle" },
      { to: 'G-RESPONSABILITE', text: "le soin comme charge de préservation" }
    ],
    ex: [
      { t: "Le soin qui s'épuise", k: 'ILLUSTRATIF', p: "Une personne porte seule la préservation d'un commun, sans reconnaissance.", r: "La grammaire inscrit ce care comme condition de possibilité du reste — et signale quand il bascule en sacrifice non reconnu." }
    ]
  },
  {
    id: 'G-PERFORMATIVITE', layer: 3, ico: '🪞', nt: 'NT-G4', name: 'Les instruments fabriquent ce qu\'ils mesurent', code: 'G-PERFORMATIVITE · NT-G4',
    what: "Alerte sur le fait que tout instrument de mesure produit en partie la réalité qu'il prétend décrire.",
    how: "Trace cette auto-référence pour que le registre n'en soit pas lui-même victime (risque autoréférentiel).",
    rel: [
      { to: 'G-MIMETIQUE', text: "un instrument bâti sur une exclusion porte une méconnaissance" },
      { to: 'G-VALUATION', text: "les chiffres performent les comportements" },
      { to: 'G-JUSTICE', text: "classer, c'est déjà juger" }
    ],
    ex: [
      { t: "L'indicateur qui oriente tout", k: 'K3', p: "Choisir de ne mesurer que le volume d'eau pousse à ne gérer que le volume.", r: "La grammaire rend visible que l'indicateur n'est pas neutre : il fabrique la priorité, et ce choix doit être gouverné." }
    ]
  },
  {
    id: 'G-MESOLOGIE', layer: 3, ico: '🌍', nt: 'NT-G5', name: 'Le milieu comme relation, pas comme décor', code: 'G-MESOLOGIE · NT-G5',
    what: "Pose l'habitabilité d'un milieu comme catégorie centrale, pas comme un indicateur environnemental parmi d'autres.",
    how: "Pense la double face métabolisme (ce qu'on prélève) / attention (ce qu'on surveille).",
    rel: [
      { to: 'G-SOIN', text: "co-dégradation" },
      { to: 'G-COMMUNALITE', text: "le milieu comme commun" },
      { to: 'G-RESPONSABILITE', text: "dette envers le milieu" },
      { to: 'G-VALUATION', text: "évaluer sans appauvrir" }
    ],
    ex: [
      { t: "Habitable pour qui ?", k: 'K3', p: "Un bassin peut être « rentable » tout en devenant inhabitable pour le vivant.", r: "La grammaire fait de l'habitabilité le critère architectural, ce qui rend la co-dégradation travail/milieu calculable." }
    ]
  },
  {
    id: 'G-COMMUNALITE', layer: 3, ico: '🤝', nt: 'NT-G6', name: 'Les droits réels sur un commun', code: 'G-COMMUNALITE · NT-G6',
    what: "Inscrit la gouvernance d'un commun : qui détient quels droits, et l'écart entre droits sur le papier et droits réellement exercés.",
    how: "S'appuie sur les « faisceaux de droits » (Schlager-Ostrom) et une échelle de communalisation.",
    rel: [
      { to: 'G-JUSTICE', text: "accès inégal aux droits = injustice" },
      { to: 'G-MESOLOGIE', text: "le milieu comme commun" },
      { to: 'G-RESPONSABILITE', text: "obligations attachées aux droits" }
    ],
    ex: [
      { t: "Un droit qu'on ne peut pas exercer", k: 'K3', p: "Des petits usagers ont un droit formel à l'eau mais ne peuvent pas l'exercer face aux gros préleveurs.", r: "La grammaire rend calculable l'écart entre droit formel et droit effectif, pour le rendre opposable." }
    ]
  },
  {
    id: 'G-JUSTICE', layer: 3, ico: '⚖️', nt: 'NT-G7', name: 'Le plancher de dignité', code: 'G-JUSTICE · NT-G7',
    what: "Inscrit les injustices — manque de capabilités, de reconnaissance, injustice à être cru — sans imposer une théorie unique.",
    how: "Capabilités plancher, redistribution et reconnaissance, intersectionnalité, injustice épistémique (Fricker, Nussbaum).",
    rel: [
      { to: 'G-RESPONSABILITE', text: "couplage habitabilité↔capabilité (pivot)" },
      { to: 'G-MIMETIQUE', text: "le bouc émissaire comme injustice testimoniale extrême" },
      { to: 'G-COMMUNALITE', text: "droits effectifs" },
      { to: 'G-AFFECTIF', text: "la reconnaissance" }
    ],
    ex: [
      { t: "La parole disqualifiée", k: 'ILLUSTRATIF', p: "Une communauté n'a pas les mots reconnus pour décrire le tort qu'elle subit.", r: "La grammaire inscrit cette injustice herméneutique : le problème n'est pas qu'elle se trompe, mais qu'il lui manque les ressources pour se faire entendre." }
    ]
  },
  {
    id: 'G-MIMETIQUE', layer: 3, ico: '🎭', nt: 'NT-G8', name: 'La mécanique du bouc émissaire', code: 'G-MIMETIQUE · NT-G8',
    what: "Inscrit la dynamique qui produit une crise : désir d'imitation, rivalité croissante, puis désignation d'un coupable unique.",
    how: "Décrit la « méconnaissance fondatrice » (on ne voit pas qu'on a fabriqué le coupable) avec des garde-fous anti-dérive.",
    rel: [
      { to: 'G-RESPONSABILITE', text: "distinguer responsabilité réelle et désignation arbitraire" },
      { to: 'G-JUSTICE', text: "le bouc émissaire = injustice extrême" },
      { to: 'G-PERFORMATIVITE', text: "les institutions héritent d'une exclusion masquée" }
    ],
    ex: [
      { t: "Le coupable qui arrange tout le monde", k: 'ILLUSTRATIF', p: "Un collectif retrouve sa paix en s'unissant contre un membre désigné.", r: "La grammaire trace la montée de rivalité et la désignation, pour empêcher d'institutionnaliser cette exclusion comme si elle était justifiée." }
    ]
  },
  {
    id: 'G-AFFECTIF', layer: 3, ico: '❤️', nt: 'NT-G9', name: 'Les émotions du collectif, prises au sérieux', code: 'G-AFFECTIF · NT-G9',
    what: "Rend inscriptibles les conditions affectives d'un commun : travail émotionnel, reconnaissance, défenses de métier, mésentente.",
    how: "Qualifie un régime collectif — elle ne « psychologise » pas les personnes.",
    rel: [
      { to: 'G-SOIN', text: "travail émotionnel = soin" },
      { to: 'G-JUSTICE', text: "le piège de la reconnaissance" },
      { to: 'G-MIMETIQUE', text: "l'unanimité affective peut virer à l'exclusion" }
    ],
    ex: [
      { t: "L'enthousiasme obligatoire", k: 'ILLUSTRATIF', p: "Une équipe doit afficher la motivation tout en étant empêchée de faire un travail de qualité.", r: "La grammaire distingue le vrai travail émotionnel de l'activité empêchée et du piège de la reconnaissance, sans réduire ça à des humeurs individuelles." }
    ]
  },
  {
    id: 'G-DEMO-EPISTEMIQUE', layer: 3, ico: '🗳️', nt: 'NT-G10', name: 'Le savoir ne se confisque pas', code: 'G-DEMO-EPISTEMIQUE · NT-G10',
    what: "Pose la légitimité épistémique des décisions : qui peut produire un savoir valide, et comment éviter le gouvernement des seuls experts.",
    how: "Critique l'épistocratie ; fonde l'idée qu'un instrument technique ne peut pas valider seul une décision collective.",
    rel: [
      { to: 'G-RESPONSABILITE', text: "légitimité des décisions engageantes" },
      { to: 'G-JUSTICE', text: "inclure les sujets épistémiques absents" }
    ],
    ex: [
      { t: "L'expert qui décide pour tous", k: 'ILLUSTRATIF', p: "Un bureau d'études tranche une question d'eau sans les habitants.", r: "La grammaire impose, au-delà d'un certain risque, d'ouvrir une enquête collective incluant ceux qu'on n'avait pas invités." }
    ]
  },
  {
    id: 'G-TRAVAIL', layer: 3, ico: '💼', nt: 'NT-G11', name: 'Le travail comme capabilité', code: 'G-TRAVAIL · NT-G11',
    what: "Inscrit la qualité du travail non comme un indicateur RH, mais comme la possibilité réelle d'exercer un métier dont on est reconnu juge.",
    how: "Accueille les sources de sociologie/économie du travail jusque-là portées par la fiche F1.",
    rel: [
      { to: 'G-SOIN', text: "le travail de soin" },
      { to: 'G-JUSTICE', text: "la reconnaissance au travail" },
      { to: 'G-VALUATION', text: "comment on valorise le travail" }
    ],
    ex: [
      { t: "Reconnu juge de son métier", k: 'ILLUSTRATIF', p: "Un travailleur sait ce qu'est un travail bien fait, mais on ne lui demande jamais.", r: "La grammaire inscrit cette reconnaissance comme une capabilité due, pas comme une faveur." }
    ]
  },
  {
    id: 'G-VALUATION', layer: 3, ico: '🧮', nt: 'NT-G12', name: 'Le geste comptable lui-même, gouverné', code: 'G-VALUATION · NT-G12',
    what: "Fait du fait de chiffrer (seuil, prix, valeur) un acte gouvernable, jamais un instrument neutre laissé sans contrôle.",
    how: "Comptabilité multi-régime, juste prix écologique, gouvernance des instruments de mesure (les « valuemètres »).",
    rel: [
      { to: 'G-RESPONSABILITE', text: "chiffrer la dette" },
      { to: 'G-MESOLOGIE', text: "évaluer le milieu sans l'appauvrir" },
      { to: 'G-PERFORMATIVITE', text: "un chiffre performe la réalité" },
      { to: 'G-TRAVAIL', text: "valoriser le travail" }
    ],
    ex: [
      { t: "Qui a posé ce seuil ?", k: 'K3', p: "Un seuil de prélèvement « acceptable » est fixé quelque part par quelqu'un.", r: "La grammaire exige que tout valuemètre déclare sa source et sa convention, pour qu'un seuil ne soit jamais un instrument performatif non gouverné." }
    ]
  },
  // ---------------- COUCHE 2 — champ mobilisé par le Parcours ----------------
  {
    id: 'C-MILIEU-VECU', layer: 2, ico: '🌍', name: "L'état vécu du milieu", code: 'C-MILIEU-VECU · F2', branch: 'milieu',
    what: "Renseigne la texture vécue de l'habitabilité d'un milieu : ce que vivre là veut concrètement dire.",
    how: "Champ de la fiche F2 (mode milieu). Garde les dimensions de l'état du milieu sans les réduire à un seul chiffre ; sert de base aux signaux de co-dégradation et de care non-humain.",
    rel: [
      { to: 'F2', text: "est l'un des champs nommés de la fiche F2" },
      { to: 'G-MESOLOGIE', text: "la grammaire qui pense le milieu comme relation s'en sert" }
    ],
    ex: [
      { t: "L'état vécu d'une nappe", k: 'K3', p: "Au-delà du niveau piézométrique, ce que la baisse de la nappe change pour ceux qui en dépendent.", r: "La fiche inscrit l'habitabilité vécue, pas seulement la mesure : la dégradation devient lisible comme perte de milieu, pas comme simple variable." }
    ]
  }
];

/** Index par id, pour la résolution des relations. */
export const objetsById: Record<string, MrcObjet> = Object.fromEntries(
  objets.map((o) => [o.id, o])
);

/** Ordre d'affichage des couches non-branchées (0, 1, 3). */
export function objetsDeCouche(layer: Layer): MrcObjet[] {
  return objets.filter((o) => o.layer === layer);
}

/**
 * Ensemble des objets reliés à `id` (relations sortantes + entrantes),
 * pour le surlignage dans l'interface.
 */
export function relatedSet(id: string): Set<string> {
  const o = objetsById[id];
  const s = new Set<string>((o?.rel ?? []).map((r) => r.to));
  for (const n of objets) {
    if (n.rel.some((r) => r.to === id)) s.add(n.id);
  }
  return s;
}

// ════════════════════════════════════════════════════════════════════════════
// PARCOURS GUIDÉ — « la vie d'une obligation », étape par étape.
// Transcription fidèle du set v5.5 (mrc_v55_complet.html, onglet Parcours).
// Régime : vulgarisation procédurale, non calcul formel.
// ════════════════════════════════════════════════════════════════════════════

/** Référence légère affichable quand l'id n'est pas un objet de la carte
 *  (cas des signaux R-*, que le set pédago « carte » n'expose pas). */
export interface RefLegere {
  id: string;
  ico: string;
  name: string;
  what: string;
}

/** Signaux mobilisés par le Parcours, absents de la carte (couches 0–3). */
export const signauxParcours: Record<string, RefLegere> = {
  'R-CARE': {
    id: 'R-CARE', ico: '🚨', name: 'Le soin effectivement assumé',
    what: "Satisfait seulement si ceux qui bénéficient d'un milieu ou d'un commun assument des charges de préservation mesurables — pas seulement déclarées."
  },
  'R-CODEGRADATION': {
    id: 'R-CODEGRADATION', ico: '🚨', name: 'Travail et milieu qui se dégradent ensemble',
    what: "Inscrit, date et attribue les dégradations subies par le milieu, en lien avec les conditions de travail. Contrepartie du soin (R-CARE)."
  },
  'R-HABITABILITE-CAPABILITE': {
    id: 'R-HABITABILITE-CAPABILITE', ico: '🚨', name: 'Vivable pour le système ET pour chacun',
    what: "Le couplage clé : une situation doit rester habitable globalement et garantir le minimum de chacun. L'habitabilité systémique ne rachète pas une perte de capabilité individuelle."
  },
  'R-INTERDIT-ABSOLU': {
    id: 'R-INTERDIT-ABSOLU', ico: '🚨', name: "L'interdit qu'on ne franchit pas",
    what: "Une limite non négociable ; en régime systémique elle déclenche la délibération, pas l'urgence directe."
  }
};

/** Résout un id en objet affichable (carte d'abord, puis signaux du parcours). */
export function refParcours(id: string): MrcObjet | RefLegere | null {
  return objetsById[id] ?? signauxParcours[id] ?? null;
}

export interface ParcoursEtape {
  n: string;
  t: string;
  txt: string;
  ids: string[];
}

export const parcours: ParcoursEtape[] = [
  {
    n: 'Étape 1 · Couche 0', t: 'Un collectif décide quelque chose qui affecte des tiers',
    txt: "Une coopérative arbitre l'usage d'une ressource. La décision touche des absents : milieu, voisins, générations futures. On commence par déclarer, avec les briques de base, à qui revient la responsabilité — et personne ne peut être inventé ni effacé.",
    ids: ['regimeobligation', 'fractionactorielle', 'collectifhybridedeclare']
  },
  {
    n: 'Étape 2 · Couche 1', t: "Rien ne s'inscrit sans contrepartie",
    txt: "La règle débit/crédit force à inscrire, en face de tout gain, ce qu'il coûte. La dette qui en résulte reçoit un statut : a-t-elle un débiteur, ou pas encore ?",
    ids: ['R1', 'C-STATUT-DETTE']
  },
  {
    n: 'Étape 3 · Couche 1', t: "Sans responsable, on délibère — on ne décrète pas l'urgence",
    txt: "Si la dette n'a pas de porteur, la machine d'états interdit de sauter au niveau « critique ». Elle force le passage par la délibération, qui doit produire un responsable avant toute mobilisation de l'urgence.",
    ids: ['machine-etats']
  },
  {
    n: 'Étape 4 · Couche 1', t: "On dresse l'inventaire de tout ce qui est affecté",
    txt: "Avant de conclure, on liste les entités touchées — y compris non-humaines (la nappe, les zones humides), avec leur seuil d'entrée dans la communauté morale. La liste ne peut pas être vide.",
    ids: ['InventaireNonVide', 'REPRESENTATION-PROSPECTIVE', 'principeintergenerationnel']
  },
  {
    n: 'Étape 5 · Couche 2', t: 'Une fiche applique tout ça à un domaine concret',
    txt: "Selon le terrain, un mode d'emploi s'active : ici le mode milieu (F2) pour un bassin versant, qui garde les dimensions de l'état du milieu, ou le mode comptable (F8) pour gouverner les chiffres.",
    ids: ['F2', 'F8', 'C-MILIEU-VECU']
  },
  {
    n: 'Étape 6 · Couche 3', t: "Une grammaire qualifie l'obligation",
    txt: "La grammaire Responsabilité lit l'obligation, couplée à la grammaire Justice : une situation doit rester habitable pour le système ET garantir le minimum de chacun. Le couplage doit tenir dans les deux sens.",
    ids: ['G-RESPONSABILITE', 'G-JUSTICE', 'G-MESOLOGIE']
  },
  {
    n: 'Étape 7 · Signaux', t: 'Les alertes se déclenchent',
    txt: "Le registre lève automatiquement ses signaux : co-dégradation travail/milieu, soin réellement assumé ou non, habitabilité-capabilité. Et tout chiffre mobilisé doit déclarer sa source.",
    ids: ['R-CODEGRADATION', 'R-CARE', 'R-HABITABILITE-CAPABILITE', 'R-INTERDIT-ABSOLU']
  },
  {
    n: 'Étape 8 · Bouclage', t: 'Traçable, gouvernable, réfutable',
    txt: "L'obligation est désormais inscrite, attribuée (ou explicitement en attente), instrumentée et qualifiée — avec, à chaque étape, une contrepartie réfutable et des lacunes déclarées. C'est le passage de la plausibilité à la vérifiabilité-cohérence.",
    ids: ['G-VALUATION', 'G-DEMO-EPISTEMIQUE']
  }
];
