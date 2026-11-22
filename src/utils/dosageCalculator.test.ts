import assert from 'node:assert';
import test from 'node:test';
import { calculateWeightDosage } from './dosageCalculator.ts';

test('calculateWeightDosage: standard pediatric amoxicillin calculation', () => {
  // Child weight: 15kg. Rate: 40mg/kg/day = 600mg/day. BID (2 doses) = 300mg/dose.
  const res = calculateWeightDosage('amoxicillin', 15);
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.totalDailyMg, 600);
  assert.strictEqual(res.singleDoseMg, 300);
  assert.strictEqual(res.frequency, 2);
  assert.strictEqual(res.isCappedByMaximum, false);
});

test('calculateWeightDosage: caps dosage at maximum safe limit for adult weight', () => {
  // Amoxicillin max is 1500mg. Adult weight: 80kg * 40 = 3200mg (exceeds 1500mg max).
  const res = calculateWeightDosage('amoxicillin', 80);
  assert.strictEqual(res.valid, true);
  assert.strictEqual(res.totalDailyMg, 1500);
  assert.strictEqual(res.singleDoseMg, 750);
  assert.strictEqual(res.isCappedByMaximum, true);
  assert.ok(res.warning?.includes('safe maximum ceiling'));
});

test('calculateWeightDosage: handles invalid weight or unknown medication', () => {
  const res1 = calculateWeightDosage('amoxicillin', -5);
  assert.strictEqual(res1.valid, false);

  const res2 = calculateWeightDosage('unknown_drug', 20);
  assert.strictEqual(res2.valid, false);
});
