import React from 'react';
import { ShoppingBag, Search, Pill } from 'lucide-react';
import type { MedicineCategory } from '../types/index.ts';

interface NavbarProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCategory: MedicineCategory;
  setSelectedCategory: (cat: MedicineCategory) => void;
  prescriptionOnly: boolean;
  setPrescriptionOnly: (rx: boolean) => void;
  cartItemCount: number;
  onOpenCart: () => void;
}

const CATEGORIES: MedicineCategory[] = [
  'All',
  'Pain Relief',
  'Cardiac Care',
  'Diabetes Care',
  'Vitamins & Supplements',
  'Antibiotics',
  'First Aid'
];

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  prescriptionOnly,
  setPrescriptionOnly,
  cartItemCount,
  onOpenCart
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Logo */}
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Pill className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                CureSure
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs text-gray-500 font-medium">
                Online Pharmacy
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search medicines, salts, or health conditions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Cart Trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCart}
              className="relative p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
              aria-label="View Cart"
            >
              <ShoppingBag className="w-6 h-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories Navigation */}
        <div className="flex items-center justify-between py-2 overflow-x-auto gap-2 no-scrollbar border-t border-gray-100">
          <div className="flex items-center gap-1.5 flex-nowrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer whitespace-nowrap pl-4">
            <input
              type="checkbox"
              checked={prescriptionOnly}
              onChange={(e) => setPrescriptionOnly(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500"
            />
            <span>Rx Only</span>
          </label>
        </div>
      </div>
    </header>
  );
};
