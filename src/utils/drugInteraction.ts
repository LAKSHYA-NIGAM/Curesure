/**
 * Curesure Drug Interaction & Contraindication Engine
 * Flags adverse drug combinations, severity levels (severe, moderate, minor),
 * and clinical advice warnings.
 */

export interface InteractionRule {
  drugA: string;
  drugB: string;
  severity: 'severe' | 'moderate' | 'minor';
  description: string;
  recommendation: string;
}

const KNOWN_INTERACTIONS: InteractionRule[] = [
  {
    drugA: 'aspirin',
    drugB: 'warfarin',
    severity: 'severe',
    description: 'Concurrent anticoagulant and antiplatelet therapy substantially elevates internal hemorrhage risk.',
    recommendation: 'Do not co-prescribe without specialized clinical monitoring.',
  },
  {
    drugA: 'lisinopril',
    drugB: 'potassium',
    severity: 'moderate',
    description: 'ACE inhibitors reduce potassium excretion, causing risk of hyperkalemia.',
    recommendation: 'Monitor serum potassium levels regularly.',
  },
  {
    drugA: 'metformin',
    drugB: 'contrast_dye',
    severity: 'severe',
    description: 'Iodinated radiocontrast agents with metformin carry risk of lactic acidosis.',
    recommendation: 'Temporarily withhold metformin prior to imaging procedure.',
  },
  {
    drugA: 'ibuprofen',
    drugB: 'aspirin',
    severity: 'moderate',
    description: 'Concurrent NSAID use increases gastrointestinal ulceration risk and blunts aspirin cardioprotection.',
    recommendation: 'Take aspirin at least 30 minutes before or 8 hours after ibuprofen.',
  },
];

export function checkDrugInteractions(medications: string[]): {
  hasInteractions: boolean;
  hasSevere: boolean;
  alerts: InteractionRule[];
} {
  if (!Array.isArray(medications) || medications.length < 2) {
    return { hasInteractions: false, hasSevere: false, alerts: [] };
  }

  const normalized = medications.map((m) => (typeof m === 'string' ? m.trim().toLowerCase() : ''));
  const alerts: InteractionRule[] = [];

  for (let i = 0; i < normalized.length; i++) {
    for (let j = i + 1; j < normalized.length; j++) {
      const medA = normalized[i];
      const medB = normalized[j];

      for (const rule of KNOWN_INTERACTIONS) {
        if (
          (medA.includes(rule.drugA) && medB.includes(rule.drugB)) ||
          (medA.includes(rule.drugB) && medB.includes(rule.drugA))
        ) {
          alerts.push(rule);
        }
      }
    }
  }

  const hasSevere = alerts.some((a) => a.severity === 'severe');

  return {
    hasInteractions: alerts.length > 0,
    hasSevere,
    alerts,
  };
}
