/**
 * Définition courte du MRC pour le mode Découverte (~320 tokens).
 * Pas de protocole d'analyse — fondements conceptuels + grammaires interrogeables.
 * MRC v5.x (dernières NT : G2 v5.6, G7 v7 — juin 2026)
 */
export const MRC_DEFINITION = `
## Le Modèle de Registres de Communalité (MRC v5.x)

Le MRC est un outil théorique et pratique développé par Pierre Musseau-Milesi
(2026) pour analyser comment des collectifs produisent,
maintiennent et transmettent des ressources communes à travers leurs écrits et pratiques.
Il opère en régime de vérifiabilité-cohérence : tout énoncé est soit ancré dans une
source déclarée, soit marqué comme inférence ou [PLAUSIBLE, NON VÉRIFIÉ].

**Primitive ontologique** : tout acteur, interaction et écriture est analysé comme
profunctor enrichi M : X^op × Y → V — une relation asymétrique entre ce qui est
mobilisé (débit) et ce qui est contracté en retour (crédit). Cette règle fondamentale
s'appelle R1 / DÉBIT–CRÉDIT.

**Quatre objets fondamentaux** :
1. Acteurs : humains, organisations, non-humains et instruments qui agissent dans un registre
2. Interactions : relations de mobilisation entre acteurs, toujours asymétriques
3. Écritures : actes d'inscription qui stabilisent ou déstabilisent un registre (validées par des humains, jamais par un LLM)
4. Signaux : indicateurs détectés dans le corpus, non validés, porteurs d'hypothèses à vérifier

**Grammaires transversales (Couche 3)** — dix lentilles théoriques mobilisables :
G1 Évolutivité (Boyer, Tinbergen) · G2 Responsabilité (Jonas, Gosseries) · G3 Soin (Tronto, Federici)
G4 Performativité (Haraway) · G5 Méséologie (Berque) · G6 Communalité (Ostrom)
G7 Justice (Nussbaum, Fricker) · G8 Mimétique (Girard) · G9 Affectif · G10 Démocratie épistémique
Tu peux poser des questions sur n'importe laquelle de ces grammaires — leurs auteurs, leur apport au MRC, leurs tensions mutuelles.

**Dualité des régimes** : métabolique (prélèvement, transformation) vs attentionnel (soin, maintenance, cartographie).
Le couplage entre ces deux régimes est la condition d'habitabilité d'un collectif.

**Trois usages du MRC** :
— Usage 1 : analyser des documents existants via le démonstrateur conversationnel
— Usage 2 : co-construire un registre de communalité avec un collectif
— Usage 3 : tenir des registres symétriques interopérables entre acteurs hétérogènes

**Principe R-INCAPACITE-LLM-VALIDER** : aucune analyse produite par un assistant IA
dans le cadre du MRC n'est opposable. Toute réponse est un brouillon interprétatif
soumis à validation humaine.
`;
