/**
 * Définition étendue du MRC pour le mode Découverte (~700 tokens).
 * Couvre les fondements conceptuels, les 4 couches d'analyse et les grammaires.
 * Le texte intégral v5.3 sera intégré dans une prochaine version du démonstrateur.
 */
export const MRC_DEFINITION = `
## Le Modèle de Registres de Communalité (MRC v5.4)

Le MRC est un outil théorique et pratique développé par Pierre Musseau-Milesi
(La Coop des Communs, 2026) pour analyser comment des collectifs produisent,
maintiennent et transmettent des ressources communes à travers leurs écrits et pratiques.

### Primitive ontologique

Tout acteur, interaction et écriture est modélisé comme un **profunctor enrichi**
M : X^op × Y → V — une relation asymétrique entre ce qui est mobilisé (**débit**)
et ce qui est contracté en retour (**crédit**). Cette règle fondamentale s'appelle
**R1 / DÉBIT–CRÉDIT** : toute mobilisation d'une entité doit engager une obligation
symétrique. L'absence de symétrie persistante est un signal d'alerte.

### Cinq concepts centraux

1. **Acteurs** : humains, organisations, non-humains et instruments qui agissent dans un registre
2. **Interactions** : relations de mobilisation entre acteurs, toujours asymétriques (débit/crédit)
3. **Écritures** : tout acte d'inscription qui stabilise ou déstabilise un registre
4. **Régimes** : métabolique (prélèvement, transformation, production) vs attentionnel (soin, maintenance, restauration)
5. **Grammaires transversales** : lentilles théoriques mobilisables pour enrichir l'analyse

### Les quatre couches d'analyse (protocole MRC)

- **Couche 0 — Acteurs et primitives** : identifier les acteurs (DID symbolique), leurs interactions,
  appliquer R1/DÉBIT–CRÉDIT, situer le niveau ostromien (opérationnel → constitutionnel → existentiel)
- **Couche 1 — Dualité des régimes** : repérer le régime métabolique et le régime attentionnel,
  vérifier leur couplage (R-COUPLAGE), évaluer si le seuil d'habitabilité est menacé (R-HABITABILITE)
- **Couche 2 — Modes d'application** : trois modes — Travail (F1), Milieu (F2), Sémantique (F3),
  Existentiel (F4) — chacun avec ses signaux propres (ex. R-CARE, R-CODEGRADATION, TOKEN_MARGINAL)
- **Couche 3 — Grammaires transversales** : huit lentilles théoriques à activer selon le contexte

### Les huit grammaires transversales

| Grammaire | Auteur(s) | Ce qu'elle éclaire |
|---|---|---|
| **G-EVOLUTIVITE** | Boyer | Attracteurs cognitifs, résistance à la révision |
| **G-RESPONSABILITE** | Jonas | Irréversibilité, heuristique de la peur |
| **G-SOIN** | Tronto, Federici | Care non reconnu, travail reproductif invisible |
| **G-PERFORMATIVITE** | Haraway | Savoirs situés, exclusions instrumentales |
| **G-MESOLOGIE** | Berque, Stépanoff | Habitabilité, couplage métabolisme/attention |
| **G-COMMUNALITE** | Ostrom | Faisceaux de droits, degré de communalité |
| **G-JUSTICE** | Nussbaum, Fricker | Capabilités plancher, injustice épistémique |
| **G-MIMETIQUE** | Girard | Crise mimétique, bouc-émissaire, méconnaissance |

### Trois usages du MRC

- **Usage 1** : analyser des documents existants via le démonstrateur conversationnel
- **Usage 2** : co-construire un registre de communalité avec un collectif
- **Usage 3** : évaluer et réviser un registre existant

### Principe R-INCAPACITE-LLM-VALIDER

Aucune analyse produite par un assistant IA dans le cadre du MRC n'est opposable.
Toute réponse est un brouillon interprétatif soumis à validation humaine.
`;
