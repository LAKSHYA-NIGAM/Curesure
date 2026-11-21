import type { Medicine, CartItem, CartSummary } from '../types/index.ts';

const FREE_DELIVERY_THRESHOLD = 500.0;
const STANDARD_DELIVERY_FEE = 40.0;

export function addToCart(cart: CartItem[], medicine: Medicine, quantity: number = 1): CartItem[] {
  if (quantity <= 0) return cart;
  if (!medicine.inStock) return cart;

  const existingIndex = cart.findIndex(item => item.medicine.id === medicine.id);
  if (existingIndex > -1) {
    const updated = [...cart];
    const currentQty = updated[existingIndex].quantity;
    const newQty = Math.min(currentQty + quantity, medicine.stockCount);
    updated[existingIndex] = {
      ...updated[existingIndex],
      quantity: newQty
    };
    return updated;
  }

  const initialQty = Math.min(quantity, medicine.stockCount);
  return [...cart, { medicine, quantity: initialQty }];
}

export function removeFromCart(cart: CartItem[], medicineId: string): CartItem[] {
  return cart.filter(item => item.medicine.id !== medicineId);
}

export function updateQuantity(cart: CartItem[], medicineId: string, quantity: number): CartItem[] {
  if (quantity <= 0) {
    return removeFromCart(cart, medicineId);
  }

  return cart.map(item => {
    if (item.medicine.id === medicineId) {
      const clamped = Math.min(quantity, item.medicine.stockCount);
      return { ...item, quantity: clamped };
    }
    return item;
  });
}

export function calculateCartSummary(cart: CartItem[]): CartSummary {
  let subtotal = 0;
  let discount = 0;
  let itemCount = 0;

  for (const item of cart) {
    const regularPrice = item.medicine.price * item.quantity;
    const effectivePrice = (item.medicine.discountPrice ?? item.medicine.price) * item.quantity;

    subtotal += regularPrice;
    discount += (regularPrice - effectivePrice);
    itemCount += item.quantity;
  }

  const effectiveTotal = subtotal - discount;
  const deliveryFee = (effectiveTotal >= FREE_DELIVERY_THRESHOLD || effectiveTotal === 0) ? 0 : STANDARD_DELIVERY_FEE;
  const total = effectiveTotal + deliveryFee;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    discount: Math.round(discount * 100) / 100,
    deliveryFee: Math.round(deliveryFee * 100) / 100,
    total: Math.round(total * 100) / 100,
    itemCount
  };
}

export function filterMedicines(
  medicines: Medicine[],
  searchQuery: string = '',
  category: string = 'All',
  prescriptionOnly: boolean = false
): Medicine[] {
  const query = searchQuery.trim().toLowerCase();

  return medicines.filter(med => {
    const matchesSearch = !query ||
      med.name.toLowerCase().includes(query) ||
      med.genericName.toLowerCase().includes(query) ||
      med.category.toLowerCase().includes(query);

    const matchesCategory = category === 'All' || med.category.toLowerCase() === category.toLowerCase();
    const matchesPrescription = !prescriptionOnly || med.prescriptionRequired;

    return matchesSearch && matchesCategory && matchesPrescription;
  });
}
