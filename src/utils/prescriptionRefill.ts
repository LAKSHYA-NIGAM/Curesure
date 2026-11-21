/**
 * Curesure Prescription Refill Engine
 * Calculates remaining days of medication, next refill date, and enforces
 * insurance refill thresholds (e.g., patient must consume >= 75% of supply).
 */

export interface Prescription {
  id: string;
  medicationName: string;
  totalQuantity: number;
  dailyDose: number;
  lastFillDate: string; // ISO format: YYYY-MM-DD
  refillsRemaining: number;
}

export interface RefillStatus {
  canRefill: boolean;
  daysSupply: number;
  daysRemaining: number;
  nextEligibleRefillDate: string;
  message: string;
}

export function evaluateRefillEligibility(
  prescription: Prescription,
  currentDateStr: string = new Date().toISOString().split('T')[0],
  requiredConsumptionPct: number = 0.75
): RefillStatus {
  if (!prescription || prescription.dailyDose <= 0 || prescription.totalQuantity <= 0) {
    return {
      canRefill: false,
      daysSupply: 0,
      daysRemaining: 0,
      nextEligibleRefillDate: '',
      message: 'Invalid prescription parameters',
    };
  }

  if (prescription.refillsRemaining <= 0) {
    return {
      canRefill: false,
      daysSupply: 0,
      daysRemaining: 0,
      nextEligibleRefillDate: '',
      message: 'No refills remaining. Doctor renewal required.',
    };
  }

  const daysSupply = Math.floor(prescription.totalQuantity / prescription.dailyDose);
  const fillDate = new Date(prescription.lastFillDate);
  const today = new Date(currentDateStr);
  const diffTime = today.getTime() - fillDate.getTime();
  const daysElapsed = Math.max(0, Math.floor(diffTime / (1000 * 60 * 60 * 24)));

  const daysRemaining = Math.max(0, daysSupply - daysElapsed);
  const daysNeededToRefill = Math.ceil(daysSupply * requiredConsumptionPct);

  const eligibleDate = new Date(fillDate.getTime() + daysNeededToRefill * 24 * 60 * 60 * 1000);
  const nextEligibleRefillDate = eligibleDate.toISOString().split('T')[0];

  const canRefill = daysElapsed >= daysNeededToRefill;

  return {
    canRefill,
    daysSupply,
    daysRemaining,
    nextEligibleRefillDate,
    message: canRefill
      ? 'Prescription eligible for refill'
      : `Prescription refill too early. Eligible on ${nextEligibleRefillDate}`,
  };
}
