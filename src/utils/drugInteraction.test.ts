import assert from 'node:assert';
import test from 'node:test';
import { checkDrugInteractions } from './drugInteraction.ts';

test('checkDrugInteractions: detects severe warfarin + aspirin interaction', () => {
  const result = checkDrugInteractions(['Aspirin 81mg', 'Warfarin Sodium 5mg']);
  assert.strictEqual(result.hasInteractions, true);
  assert.strictEqual(result.hasSevere, true);
  assert.strictEqual(result.alerts.length, 1);
  assert.strictEqual(result.alerts[0].severity, 'severe');
  assert.ok(result.alerts[0].description.includes('hemorrhage risk'));
});

test('checkDrugInteractions: detects moderate lisinopril + potassium interaction', () => {
  const result = checkDrugInteractions(['Lisinopril 10mg', 'Potassium Chloride']);
  assert.strictEqual(result.hasInteractions, true);
  assert.strictEqual(result.hasSevere, false);
  assert.strictEqual(result.alerts[0].severity, 'moderate');
});

test('checkDrugInteractions: safe combinations without interactions', () => {
  const result = checkDrugInteractions(['Amoxicillin', 'Acetaminophen', 'Cetirizine']);
  assert.strictEqual(result.hasInteractions, false);
  assert.strictEqual(result.hasSevere, false);
  assert.strictEqual(result.alerts.length, 0);
});

test('checkDrugInteractions: invalid or single medication lists', () => {
  assert.strictEqual(checkDrugInteractions([]).hasInteractions, false);
  assert.strictEqual(checkDrugInteractions(['Aspirin']).hasInteractions, false);
  assert.strictEqual(checkDrugInteractions(null as any).hasInteractions, false);
});
