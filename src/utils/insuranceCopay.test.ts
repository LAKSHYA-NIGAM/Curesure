import assert from 'node:assert';
import test from 'node:test';
import { adjudicatePharmacyClaim, type InsurancePolicy } from './insuranceCopay.ts';

const mockPolicy: InsurancePolicy = {
  annualDeductible: 1000,
  deductibleMet: 800, // $200 remaining deductible
  outOfPocketMax: 3000,
  outOfPocketMet: 800,
  coinsuranceRate: 0.2, // 20%
  tierCopay: {
    generic: 10,
    preferredBrand: 30,
    specialty: 75,
  },
};

test('adjudicatePharmacyClaim: applies remaining deductible and coinsurance', () => {
  // Drug costs $500. $200 goes to deductible. $300 remainder has 20% ($60) + $10 copay = $70
  // Patient owes 200 + 70 = $270. Insurance covers $230.
  const claim = adjudicatePharmacyClaim(500, 'generic', mockPolicy);
  assert.strictEqual(claim.appliedToDeductible, 200);
  assert.strictEqual(claim.coinsuranceAmount, 70);
  assert.strictEqual(claim.patientOwes, 270);
  assert.strictEqual(claim.insuranceCovers, 230);
  assert.strictEqual(claim.newDeductibleMet, 1000);
  assert.strictEqual(claim.newOutOfPocketMet, 1070);
});

test('adjudicatePharmacyClaim: 100% insurance coverage when OOP is met', () => {
  const metPolicy: InsurancePolicy = {
    ...mockPolicy,
    deductibleMet: 1000,
    outOfPocketMet: 3000, // Maximum reached
  };

  const claim = adjudicatePharmacyClaim(1200, 'specialty', metPolicy);
  assert.strictEqual(claim.patientOwes, 0);
  assert.strictEqual(claim.insuranceCovers, 1200);
});

test('adjudicatePharmacyClaim: zero or invalid cost', () => {
  const claim = adjudicatePharmacyClaim(0, 'generic', mockPolicy);
  assert.strictEqual(claim.patientOwes, 0);
  assert.strictEqual(claim.insuranceCovers, 0);
});
