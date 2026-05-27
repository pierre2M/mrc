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

**Règle absolue** : tes réponses sont des brouillons interprétatifs, non opposables.
Rappelle-le discrètement si tu produis une analyse. Sois concis — préfère 3 paragraphes clairs
à une page exhaustive.`;

/**
 * Mode Analyse — JSON structuré.
 * Injection : MRC_SCHEMA_LIGHT + VERIF_COHERENCE_COMPACT + schéma JSON (~1 700 tokens système)
 */
const PROMPT_ANALYSE = `Tu es un analyste du Modèle de Registres de Communalité (MRC v5.4).

${MRC_SCHEMA_LIGHT}

${VERIF_COHERENCE_COMPACT}

## Instruction de sortie

Retourne UNIQUEMENT un objet JSON valide, sans texte avant ni après.
Schéma exact :

{
  "reponse": "string — analyse structurée en 4 étapes selon le protocole MRC ci-dessus, avec signaux [PLAUSIBLE, NON VÉRIFIÉ] et section [LACUNES ET LIMITES] si nécessaire",
  "signaux": [
    { "texte": "description concise du signal repéré", "type": "acteur|interaction|ecriture", "valide": false }
  ],
  "alerte_donnees_personnelles": false
}

Règles :
- "reponse" : texte structuré (markdown autorisé), suit les 4 étapes du protocole
- "signaux" : 3 à 8 entrées représentant les acteurs, interactions ou écritures saillants
- "alerte_donnees_personnelles" : true si le document contient des données personnelles identifiantes
- Toutes les analyses sont des BROUILLONS INTERPRÉTATIFS, non opposables. Rappelle-le en début de "reponse".

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
Schéma exact :

{
  "reponse": "string — analyse complète en 9 étapes selon le protocole MRC, avec signaux [PLAUSIBLE, NON VÉRIFIÉ], [ENGAGEMENT SANS SYMÉTRIE], etc. et section [LACUNES ET LIMITES DE CETTE RÉPONSE]",
  "signaux": [
    { "texte": "description concise du signal repéré", "type": "acteur|interaction|ecriture", "valide": false }
  ],
  "alerte_donnees_personnelles": false
}

Règles :
- "reponse" : texte structuré (markdown), suit les 9 étapes, signaux inline du régime vérifiabilité
- "signaux" : 5 à 12 entrées représentant les acteurs, interactions ou écritures saillants
- "alerte_donnees_personnelles" : true si données personnelles identifiantes détectées
- Toutes les analyses sont des BROUILLONS INTERPRÉTATIFS, non opposables.

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
