// Labels canoniques des phases C-ENQUETE partagées entre les cas d'usage-2.
// Un label absent laisse intact le label défini dans la définition du cas.
export const LABEL_PHASE: Record<string, string> = {
  rupture:      "Rupture d'expérience",
  public:       'Constitution du public',
  formulation:  'Formulation collective',
  convention:   'Convention',
  epreuve:      "Mise à l'épreuve",
  reevaluation: 'Réévaluation',
};

// Séquence canonique des 6 phases — utilisée dans la présentation textuelle.
export const SEQUENCE_ENQUETE = Object.values(LABEL_PHASE).join(' → ');
