import React, { useState, useMemo } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { MedicineCard } from './components/MedicineCard.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { MEDICINES_DATA } from './data/medicines.ts';
import { addToCart, removeFromCart, updateQuantity, calculateCartSummary, filterMedicines } from './utils/cart.ts';
import type { MedicineCategory, CartItem, Medicine } from './types/index.ts';

export const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MedicineCategory>('All');
  const [prescriptionOnly, setPrescriptionOnly] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredMedicines = useMemo(() => {
    return filterMedicines(MEDICINES_DATA, searchQuery, selectedCategory, prescriptionOnly);
  }, [searchQuery, selectedCategory, prescriptionOnly]);

  const cartSummary = useMemo(() => {
    return calculateCartSummary(cart);
  }, [cart]);

  const handleAddToCart = (medicine: Medicine) => {
    setCart((prev) => addToCart(prev, medicine, 1));
  };

  const handleUpdateQuantity = (id: string, qty: number) => {
    setCart((prev) => updateQuantity(prev, id, qty));
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => removeFromCart(prev, id));
  };

  const handleCheckout = () => {
    alert(`Thank you for your order! Total amount: ₹${cartSummary.total}`);
    setCart([]);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        prescriptionOnly={prescriptionOnly}
        setPrescriptionOnly={setPrescriptionOnly}
        cartItemCount={cartSummary.itemCount}
        onOpenCart={() => setIsCartOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-8">
          <div className="max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold mb-3">
              Fast & Reliable Delivery
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-2">
              Your Trusted Healthcare & Medicine Partner
            </h1>
            <p className="text-blue-100 text-sm">
              Authentic medicines delivered directly to your doorstep. Free delivery on orders above ₹500.
            </p>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {selectedCategory === 'All' ? 'All Medicines' : selectedCategory}
            </h2>
            <p className="text-xs text-gray-500">
              Showing {filteredMedicines.length} verified products
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {filteredMedicines.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <p className="text-gray-600 font-medium text-base">No medicines found</p>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your search filters or browse other categories
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredMedicines.map((medicine) => (
              <MedicineCard
                key={medicine.id}
                medicine={medicine}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}
      </main>

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        summary={cartSummary}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <footer className="bg-white border-t border-gray-200 py-6 text-center text-xs text-gray-500">
        <p>© 2025 CureSure Online Pharmacy. Built with React, TypeScript & Tailwind CSS.</p>
      </footer>
    </div>
  );
};

export default App;
