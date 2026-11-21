import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { addToCart, removeFromCart, updateQuantity, calculateCartSummary, filterMedicines } from './cart.ts';
import type { Medicine, CartItem } from '../types/index.ts';

const mockMedicineA: Medicine = {
  id: 'med-1',
  name: 'Paracetamol 650mg',
  genericName: 'Acetaminophen',
  category: 'Pain Relief',
  price: 50.0,
  discountPrice: 40.0,
  prescriptionRequired: false,
  inStock: true,
  stockCount: 10,
  rating: 4.8,
  reviewsCount: 100,
  description: 'Fever reducer',
  dosage: '1 tab',
  image: 'img.jpg'
};

const mockMedicineB: Medicine = {
  id: 'med-2',
  name: 'Amoxicillin 500mg',
  genericName: 'Amoxicillin',
  category: 'Antibiotics',
  price: 200.0,
  discountPrice: 180.0,
  prescriptionRequired: true,
  inStock: true,
  stockCount: 5,
  rating: 4.5,
  reviewsCount: 50,
  description: 'Antibiotic',
  dosage: '1 cap',
  image: 'img.jpg'
};

const mockOutOfStock: Medicine = {
  ...mockMedicineA,
  id: 'med-3',
  inStock: false,
  stockCount: 0
};

describe('CureSure Cart & Catalog Logic', () => {
  test('adds an in-stock medicine to empty cart', () => {
    const cart = addToCart([], mockMedicineA, 2);
    assert.equal(cart.length, 1);
    assert.equal(cart[0].medicine.id, 'med-1');
    assert.equal(cart[0].quantity, 2);
  });

  test('does not add out-of-stock items to cart', () => {
    const cart = addToCart([], mockOutOfStock, 1);
    assert.equal(cart.length, 0);
  });

  test('increments quantity when adding same item multiple times', () => {
    let cart = addToCart([], mockMedicineA, 2);
    cart = addToCart(cart, mockMedicineA, 3);
    assert.equal(cart.length, 1);
    assert.equal(cart[0].quantity, 5);
  });

  test('clamps quantity to available stock limit', () => {
    const cart = addToCart([], mockMedicineB, 100);
    assert.equal(cart[0].quantity, 5);
  });

  test('removes medicine from cart', () => {
    let cart: CartItem[] = [
      { medicine: mockMedicineA, quantity: 2 },
      { medicine: mockMedicineB, quantity: 1 }
    ];
    cart = removeFromCart(cart, 'med-1');
    assert.equal(cart.length, 1);
    assert.equal(cart[0].medicine.id, 'med-2');
  });

  test('updateQuantity modifies count or removes when zero', () => {
    let cart: CartItem[] = [{ medicine: mockMedicineA, quantity: 2 }];
    cart = updateQuantity(cart, 'med-1', 4);
    assert.equal(cart[0].quantity, 4);

    cart = updateQuantity(cart, 'med-1', 0);
    assert.equal(cart.length, 0);
  });

  test('calculates correct cart summary with discount and delivery fee', () => {
    const cart: CartItem[] = [
      { medicine: mockMedicineA, quantity: 2 } // 50 * 2 = 100 regular, 40 * 2 = 80 discounted
    ];
    const summary = calculateCartSummary(cart);
    assert.equal(summary.subtotal, 100);
    assert.equal(summary.discount, 20);
    assert.equal(summary.itemCount, 2);
    assert.equal(summary.deliveryFee, 40); // < 500 threshold
    assert.equal(summary.total, 120); // 80 + 40
  });

  test('waives delivery fee when subtotal exceeds threshold', () => {
    const cart: CartItem[] = [
      { medicine: mockMedicineB, quantity: 3 } // 180 * 3 = 540 discounted
    ];
    const summary = calculateCartSummary(cart);
    assert.equal(summary.deliveryFee, 0);
    assert.equal(summary.total, 540);
  });

  test('filterMedicines filters by query and category', () => {
    const meds = [mockMedicineA, mockMedicineB];
    const filteredSearch = filterMedicines(meds, 'amox', 'All');
    assert.equal(filteredSearch.length, 1);
    assert.equal(filteredSearch[0].id, 'med-2');

    const filteredCategory = filterMedicines(meds, '', 'Pain Relief');
    assert.equal(filteredCategory.length, 1);
    assert.equal(filteredCategory[0].id, 'med-1');

    const filteredPrescription = filterMedicines(meds, '', 'All', true);
    assert.equal(filteredPrescription.length, 1);
    assert.equal(filteredPrescription[0].id, 'med-2');
  });
});
