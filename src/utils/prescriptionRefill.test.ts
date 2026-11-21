import assert from 'node:assert';
import test from 'node:test';
import { evaluateRefillEligibility, type Prescription } from './prescriptionRefill.ts';

test('evaluateRefillEligibility: eligible refill when past 75% usage', () => {
  const rx: Prescription = {
    id: 'rx-101',
    medicationName: 'Amoxicillin 500mg',
    totalQuantity: 30,
    dailyDose: 1, // 30-day supply
    lastFillDate: '2026-01-01',
    refillsRemaining: 2,
  };

  // On day 25 (past 75% of 30 days = 22.5 -> 23 days)
  const status = evaluateRefillEligibility(rx, '2026-01-25');
  assert.strictEqual(status.canRefill, true);
  assert.strictEqual(status.daysSupply, 30);
  assert.strictEqual(status.daysRemaining, 6);
});

test('evaluateRefillEligibility: blocked if requested too early', () => {
  const rx: Prescription = {
    id: 'rx-102',
    medicationName: 'Metformin 1000mg',
    totalQuantity: 60,
    dailyDose: 2, // 30-day supply
    lastFillDate: '2026-01-01',
    refillsRemaining: 1,
  };

  // On day 10 (needs 23 days)
  const status = evaluateRefillEligibility(rx, '2026-01-10');
  assert.strictEqual(status.canRefill, false);
  assert.ok(status.message.includes('Prescription refill too early'));
});

test('evaluateRefillEligibility: zero refills remaining', () => {
  const rx: Prescription = {
    id: 'rx-103',
    medicationName: 'Lisinopril 10mg',
    totalQuantity: 30,
    dailyDose: 1,
    lastFillDate: '2026-01-01',
    refillsRemaining: 0,
  };

  const status = evaluateRefillEligibility(rx, '2026-02-01');
  assert.strictEqual(status.canRefill, false);
  assert.ok(status.message.includes('No refills remaining'));
});
