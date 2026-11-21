import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ShieldCheck } from 'lucide-react';
import type { CartItem, CartSummary } from '../types/index.ts';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  summary: CartSummary;
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  summary,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
              <span className="text-xs text-gray-500">({summary.itemCount} items)</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600 font-medium">Your cart is empty</p>
                <p className="text-xs text-gray-400 mt-1">Add items from the pharmacy catalog</p>
              </div>
            ) : (
              cart.map(({ medicine, quantity }) => (
                <div
                  key={medicine.id}
                  className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200/80 items-center justify-between"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img
                      src={medicine.image}
                      alt={medicine.name}
                      className="w-12 h-12 rounded-lg object-cover bg-white border border-gray-200"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{medicine.name}</h4>
                      <p className="text-xs text-gray-500 truncate">{medicine.dosage}</p>
                      <div className="text-xs font-bold text-gray-900 mt-0.5">
                        ₹{(medicine.discountPrice ?? medicine.price) * quantity}
                      </div>
                    </div>
                  </div>

                  {/* Quantity Controller */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden">
                      <button
                        onClick={() => onUpdateQuantity(medicine.id, quantity - 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-gray-800">{quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(medicine.id, quantity + 1)}
                        className="p-1 hover:bg-gray-100 text-gray-600"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => onRemoveItem(medicine.id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-md"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Price Breakdown */}
          {cart.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
              <div className="space-y-1.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{summary.subtotal}</span>
                </div>
                {summary.discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>-₹{summary.discount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span>{summary.deliveryFee === 0 ? 'FREE' : `₹${summary.deliveryFee}`}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-gray-900 pt-2 border-t border-gray-200">
                  <span>Total Amount</span>
                  <span>₹{summary.total}</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 justify-center">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>100% Genuine Medicines • Safe Checkout</span>
              </div>

              <button
                onClick={onCheckout}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md transition"
              >
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
