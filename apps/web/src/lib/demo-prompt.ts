/**
 * Assembleur de prompts pour le démonstrateur MRC v5.4.
 *
 * Trois modes :
 *  - decouverte : questions libres sur le MRC, sans fichier, sans schéma complet
 *  - analyse    : analyse MRC Couches 0–3 (schéma allégé), avec ou sans fichier
 *  - expert     : analyse MRC complète 9 étapes (schéma full), avec fichier
 *
 * Coût tokens estimé par appel (système + sortie) :
 *  - decouverte : ~900 tokens
 *  - analyse    : ~2 400 tokens
 *  - expert     : ~4 500 tokens
 */

import { VERIF_COHERENCE_COMPACT } from './prompts/verif-coherence-compact';
import { VERIF_COHERENCE_FULL }    from './prompts/verif-coherence-full';
import { MRC_DEFINITION }          from './prompts/mrc-definition';
import { MRC_SCHEMA_LIGHT }        from './prompts/mrc-schema-light';
import { MRC_SCHEMA_FULL }         from './prompts/mrc-schema-full';

// ─── Types ────────────────────────────────────────────────────────────────────

export type Mode = 'decouverte' | 'analyse' | 'expert';

export interface Signal {
  texte: string;
  type: 'acteur' | 'interaction' | 'ecriture';
  valide: false;
}

/** Schéma de réponse JSON commun aux modes analyse et expert */
export interface DemoResponse {
  reponse: string;
  signaux: Signal[];
  alerte_donnees_personnelles: boolean;
}

/** Réponse du mode découverte — texte libre, pas de JSON */
export interface DecouverteResponse {
  reponse: string;
}

// ─── Détection PII ───────────────────────────────────────────────────────────

export const PII_PATTERNS: RegExp[] = [
  /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/,
  /\b(?:\+33|0)[1-9](?:[\s.-]?\d{2}){4}\b/,
  /\b[12]\s?\d{2}\s?\d{2}\s?\d{2}\s?\d{3}\s?\d{3}\s?\d{2}\b/,
  /\bFR\d{2}[\s\d]{20,}\b/,
];

// ─── Constructeurs de prompts ─────────────────────────────────────────────────

/**
 * Mode Découverte — Texte libre, pas de JSON.
 * Injection : MRC_DEFINITION + VERIF_COHERENCE_COMPACT (~620 tokens système)
 */
const PROMPT_DECOUVERTE = `Tu es un guide pédagogique du Modèle de Registres de Communalité (MRC).
Tu aides les personnes à découvrir le MRC pour la première fois, en répondant à leurs questions
de façon accessible, sans jargon inutile. Quand un terme technique MRC est nécessaire, tu l'expliques.

${MRC_DEFINITION}

${VERIF_COHERENCE_COMPACT}

## Règles de réponse

- **Format** : utilise le markdown standard — \`##\` pour les titres, \`**texte**\` pour les mots importants,
  tirets \`-\` pour les listes. Ne jamais laisser des astérisques littéraux \`**\` dans la réponse finale.
- **Source** : base-toi exclusivement sur les définitions et concepts ci-dessus pour répondre.
  Si une question porte sur des passages précis du texte source MRC non inclus dans cette synthèse,
  indique clairement ce que tu sais à partir de la définition fournie, et précise que le démonstrateur
  fonctionne à partir d'une synthèse conceptuelle — pas du texte intégral.
- **Longueur** : 3 à 5 paragraphes clairs maximum. Préfère la précision à l'exhaustivité.
- **Statut** : toutes les réponses sont des brouillons interprétatifs, non opposables.`;

/**
 * Mode Analyse — JSON structuré.
 * Injection : MRC_SCHEMA_LIGHT + VERIF_COHERENCE_COMPACT + schéma JSON (~1 700 tokens système)
 */
const PROMPT_ANALYSE = `Tu es un analyste du Modèle de Registres de Communalité (MRC v5.4).

${MRC_SCHEMA_LIGHT}

${VERIF_COHERENCE_COMPACT}

## Instruction de sortie

Retourne UNIQUEMENT un objet JSON valide, sans texte avant ni après.
Le JSON doit respecter exactement ce schéma (les valeurs ci-dessous sont des exemples) :

{
  "reponse": "## Brouillon interprétatif\\n\\n### ÉTAPE 1 — Acteurs\\n...",
  "signaux": [
    { "texte": "Nom ou description de l'acteur principal", "type": "acteur", "valide": false },
    { "texte": "Relation de mobilisation entre deux acteurs", "type": "interaction", "valide": false },
    { "texte": "Acte d'inscription ou de stabilisation repéré", "type": "ecriture", "valide": false }
  ],
  "alerte_donnees_personnelles": false
}

Règles strictes :
- "reponse" : chaîne markdown, newlines échappés en \\n, suit les 4 étapes du protocole MRC
- "signaux" : OBLIGATOIRE — entre 3 et 8 objets ; chaque "type" doit être exactement
  "acteur", "interaction" ou "ecriture" (une seule valeur, pas de barre oblique)
- "alerte_donnees_personnelles" : true uniquement si données personnelles identifiantes détectées
- Toutes les analyses sont des BROUILLONS INTERPRÉTATIFS, non opposables — le dire en début de "reponse"

Retourne UNIQUEMENT le JSON. Pas de \`\`\`json, pas de commentaire.`;

/**
 * Mode Expert — JSON structuré, schéma complet 9 étapes.
 * Injection : MRC_SCHEMA_FULL + VERIF_COHERENCE_FULL + schéma JSON (~3 500 tokens système)
 */
const PROMPT_EXPERT = `Tu es un analyste expert du Modèle de Registres de Communalité (MRC v5.4).

${MRC_SCHEMA_FULL}

${VERIF_COHERENCE_FULL}

## Instruction de sortie

Retourne UNIQUEMENT un objet JSON valide, sans texte avant ni après.
Le JSON doit respecter exactement ce schéma (les valeurs ci-dessous sont des exemples) :

{
  "reponse": "## Brouillon interprétatif\\n\\n### ÉTAPE 1 — Acteurs\\n...",
  "signaux": [
    { "texte": "Nom ou description de l'acteur principal", "type": "acteur", "valide": false },
    { "texte": "Relation de mobilisation entre deux entités", "type": "interaction", "valide": false },
    { "texte": "Acte d'inscription stabilisateur repéré", "type": "ecriture", "valide": false },
    { "texte": "Autre acteur secondaire identifié", "type": "acteur", "valide": false }
  ],
  "alerte_donnees_personnelles": false
}

Règles strictes :
- "reponse" : chaîne markdown, newlines échappés en \\n, suit les 9 étapes du protocole MRC expert
- "signaux" : OBLIGATOIRE — entre 5 et 12 objets ; chaque "type" doit être exactement
  "acteur", "interaction" ou "ecriture" (une seule valeur, pas de barre oblique)
- "alerte_donnees_personnelles" : true uniquement si données personnelles identifiantes détectées
- Toutes les analyses sont des BROUILLONS INTERPRÉTATIFS, non opposables — le dire en début de "reponse"

Retourne UNIQUEMENT le JSON. Pas de \`\`\`json, pas de commentaire.`;

// ─── Export principal ─────────────────────────────────────────────────────────

export const SYSTEM_PROMPTS: Record<Mode, string> = {
  decouverte: PROMPT_DECOUVERTE,
  analyse:    PROMPT_ANALYSE,
  expert:     PROMPT_EXPERT,
};

/** Retourne true si le mode génère du JSON (analyse et expert), false pour découverte */
export function isJsonMode(mode: Mode): boolean {
  return mode === 'analyse' || mode === 'expert';
}
