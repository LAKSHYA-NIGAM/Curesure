/**
 * Curesure Pediatric & Weight-Based Dosage Calculator
 * Computes safe milligram doses based on patient body weight (kg), dose frequency,
 * and enforces FDA maximum daily limits to prevent clinical overdosing.
 */

export interface MedicationGuideline {
  name: string;
  recommendedMgPerKgPerDay: number;
  dosesPerDay: number; // e.g. 2 for BID (twice daily), 3 for TID
  maxDailyMg: number;
}

export const FORMULARY_GUIDELINES: Record<string, MedicationGuideline> = {
  amoxicillin: {
    name: 'Amoxicillin',
    recommendedMgPerKgPerDay: 40,
    dosesPerDay: 2,
    maxDailyMg: 1500,
  },
  ibuprofen: {
    name: 'Ibuprofen',
    recommendedMgPerKgPerDay: 30,
    dosesPerDay: 3,
    maxDailyMg: 2400,
  },
  acetaminophen: {
    name: 'Acetaminophen',
    recommendedMgPerKgPerDay: 50,
    dosesPerDay: 4,
    maxDailyMg: 4000,
  },
};

export interface DosageResult {
  valid: boolean;
  weightKg: number;
  totalDailyMg: number;
  singleDoseMg: number;
  frequency: number;
  isCappedByMaximum: boolean;
  warning?: string;
}

export function calculateWeightDosage(medicationKey: string, weightKg: number): DosageResult {
  const weight = Number(weightKg);
  const guideline = FORMULARY_GUIDELINES[medicationKey?.toLowerCase()];

  if (!guideline || isNaN(weight) || weight <= 0) {
    return {
      valid: false,
      weightKg: weight || 0,
      totalDailyMg: 0,
      singleDoseMg: 0,
      frequency: 0,
      isCappedByMaximum: false,
      warning: 'Invalid weight or medication not found in formulary.',
    };
  }

  const rawDailyMg = weight * guideline.recommendedMgPerKgPerDay;
  const isCapped = rawDailyMg > guideline.maxDailyMg;
  const finalDailyMg = Math.min(rawDailyMg, guideline.maxDailyMg);
  const singleDoseMg = Number((finalDailyMg / guideline.dosesPerDay).toFixed(1));

  return {
    valid: true,
    weightKg: weight,
    totalDailyMg: Number(finalDailyMg.toFixed(1)),
    singleDoseMg,
    frequency: guideline.dosesPerDay,
    isCappedByMaximum: isCapped,
    warning: isCapped
      ? `Dosage was capped at safe maximum ceiling of ${guideline.maxDailyMg}mg/day.`
      : undefined,
  };
}
