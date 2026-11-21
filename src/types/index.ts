export type MedicineCategory =
  | 'All'
  | 'Pain Relief'
  | 'Cardiac Care'
  | 'Diabetes Care'
  | 'Vitamins & Supplements'
  | 'Antibiotics'
  | 'First Aid';

export interface Medicine {
  id: string;
  name: string;
  genericName: string;
  category: MedicineCategory;
  price: number;
  discountPrice?: number;
  prescriptionRequired: boolean;
  inStock: boolean;
  stockCount: number;
  rating: number;
  reviewsCount: number;
  description: string;
  dosage: string;
  image: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface CartSummary {
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  itemCount: number;
}
