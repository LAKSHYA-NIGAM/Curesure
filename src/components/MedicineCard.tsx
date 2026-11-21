import React from 'react';
import { Star, Plus, ShieldCheck, AlertCircle } from 'lucide-react';
import type { Medicine } from '../types/index.ts';

interface MedicineCardProps {
  medicine: Medicine;
  onAddToCart: (med: Medicine) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({ medicine, onAddToCart }) => {
  const discountPercent = medicine.discountPrice
    ? Math.round(((medicine.price - medicine.discountPrice) / medicine.price) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        {/* Image & Tags */}
        <div className="relative h-44 bg-gray-50 overflow-hidden">
          <img
            src={medicine.image}
            alt={medicine.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition duration-300"
            loading="lazy"
          />
          {medicine.prescriptionRequired && (
            <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              Rx Required
            </span>
          )}
          {discountPercent > 0 && (
            <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-1 text-xs text-amber-500 mb-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="font-semibold text-gray-800">{medicine.rating}</span>
            <span className="text-gray-400">({medicine.reviewsCount})</span>
          </div>

          <h3 className="font-semibold text-gray-900 text-base line-clamp-1">{medicine.name}</h3>
          <p className="text-xs text-gray-500 italic mb-2 line-clamp-1">{medicine.genericName}</p>
          <p className="text-xs text-gray-600 line-clamp-2 mb-3">{medicine.description}</p>
        </div>
      </div>

      {/* Footer / Pricing & CTA */}
      <div className="p-4 pt-0 border-t border-gray-100 flex items-center justify-between mt-auto">
        <div>
          <div className="flex items-baseline gap-1.5">
            <span className="text-lg font-bold text-gray-900">
              ₹{medicine.discountPrice ?? medicine.price}
            </span>
            {medicine.discountPrice && (
              <span className="text-xs text-gray-400 line-through">
                ₹{medicine.price}
              </span>
            )}
          </div>
          <span className="text-[11px] text-gray-500">Per unit / pack</span>
        </div>

        <button
          onClick={() => onAddToCart(medicine)}
          disabled={!medicine.inStock}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm transition ${
            medicine.inStock
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{medicine.inStock ? 'Add' : 'Out of Stock'}</span>
        </button>
      </div>
    </div>
  );
};
