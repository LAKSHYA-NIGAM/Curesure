/**
 * Curesure Insurance Co-pay & Deductible Adjudication Engine
 * Calculates patient out-of-pocket obligation, remaining deductible,
 * co-insurance percentage, and insurance plan contribution.
 */

export interface InsurancePolicy {
  annualDeductible: number;
  deductibleMet: number;
  outOfPocketMax: number;
  outOfPocketMet: number;
  coinsuranceRate: number; // e.g. 0.20 for 20% patient responsibility
  tierCopay: {
    generic: number;
    preferredBrand: number;
    specialty: number;
  };
}

export interface ClaimAssessment {
  patientOwes: number;
  insuranceCovers: number;
  appliedToDeductible: number;
  coinsuranceAmount: number;
  newDeductibleMet: number;
  newOutOfPocketMet: number;
}

export function adjudicatePharmacyClaim(
  drugCost: number,
  tier: 'generic' | 'preferredBrand' | 'specialty',
  policy: InsurancePolicy
): ClaimAssessment {
  const cost = Math.max(0, Number(drugCost) || 0);
  if (cost === 0 || !policy) {
    return {
      patientOwes: 0,
      insuranceCovers: 0,
      appliedToDeductible: 0,
      coinsuranceAmount: 0,
      newDeductibleMet: policy?.deductibleMet || 0,
      newOutOfPocketMet: policy?.outOfPocketMet || 0,
    };
  }

  // Check if patient already hit out-of-pocket maximum
  const remainingOop = Math.max(0, policy.outOfPocketMax - policy.outOfPocketMet);
  if (remainingOop === 0) {
    return {
      patientOwes: 0,
      insuranceCovers: cost,
      appliedToDeductible: 0,
      coinsuranceAmount: 0,
      newDeductibleMet: policy.deductibleMet,
      newOutOfPocketMet: policy.outOfPocketMet,
    };
  }

  let patientShare = 0;
  let appliedDeductible = 0;
  let coinsurance = 0;

  // 1. Check deductible
  const remainingDeductible = Math.max(0, policy.annualDeductible - policy.deductibleMet);
  if (remainingDeductible > 0) {
    appliedDeductible = Math.min(cost, remainingDeductible);
    patientShare += appliedDeductible;
  }

  const costAfterDeductible = cost - appliedDeductible;

  // 2. Co-pay or co-insurance on remaining portion
  if (costAfterDeductible > 0) {
    const fixedCopay = policy.tierCopay[tier] ?? policy.tierCopay.generic;
    // Patient pays co-insurance or tier fixed co-pay, whichever is lower or structured
    coinsurance = Math.min(costAfterDeductible, costAfterDeductible * policy.coinsuranceRate + fixedCopay);
    patientShare += coinsurance;
  }

  // 3. Cap patient share by remaining OOP
  const finalPatientOwes = Math.min(patientShare, remainingOop);
  const insuranceCovers = cost - finalPatientOwes;

  return {
    patientOwes: Number(finalPatientOwes.toFixed(2)),
    insuranceCovers: Number(insuranceCovers.toFixed(2)),
    appliedToDeductible: Number(appliedDeductible.toFixed(2)),
    coinsuranceAmount: Number(coinsurance.toFixed(2)),
    newDeductibleMet: Number((policy.deductibleMet + appliedDeductible).toFixed(2)),
    newOutOfPocketMet: Number((policy.outOfPocketMet + finalPatientOwes).toFixed(2)),
  };
}
