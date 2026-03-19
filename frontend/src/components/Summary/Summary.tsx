import React from 'react';
import { CalculationResult, Product } from '../../types';

interface Props {
  result: CalculationResult | null;
  products?: Product[];
}

export const Summary: React.FC<Props> = ({ result, products = [] }) => {
  const productName = (id: string) =>
    products.find((p) => p.id === id)?.name ?? id;
  const fmt = (n: number) => n.toFixed(2);
  if (!result) return null;

  return (
    <div data-testid="summary-container" className="bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm space-y-3">
      <h2 className="font-bold text-gray-800 text-lg border-b border-gray-100 pb-2">Order Summary</h2>

      <div className="flex justify-between text-sm text-gray-600">
        <span>Total (before discount)</span>
        <span data-testid="total-before-discount" className="font-medium text-gray-800">
          {fmt(result.totalBeforeDiscount)} THB
        </span>
      </div>

      {result.pairDiscounts.length > 0 && (
        <div data-testid="pair-discounts-section" className="space-y-1">
          {result.pairDiscounts.map((d) => (
            <div key={d.productId} data-testid={`pair-discount-${d.productId}`} className="flex justify-between text-sm">
              <span className="text-gray-500">
                {productName(d.productId)} ({d.pairs} pair{d.pairs > 1 ? 's' : ''} × 5%)
              </span>
              <span className="text-green-600 font-medium">-{fmt(d.discountAmount)} THB</span>
            </div>
          ))}
        </div>
      )}

      {result.memberCardDiscount > 0 && (
        <div data-testid="member-card-discount" className="flex justify-between text-sm">
          <span className="text-gray-500">Member card (10%)</span>
          <span className="text-green-600 font-medium">-{fmt(result.memberCardDiscount)} THB</span>
        </div>
      )}

      <div className="flex justify-between text-base font-bold text-gray-800 border-t border-gray-100 pt-3">
        <span>Final Total</span>
        <span data-testid="final-total">{fmt(result.finalTotal)} THB</span>
      </div>
    </div>
  );
};
