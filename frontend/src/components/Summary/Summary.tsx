import React from 'react';
import { CalculationResult } from '../../types';

interface Props {
  result: CalculationResult | null;
}

export const Summary: React.FC<Props> = ({ result }) => {
  if (!result) return null;

  return (
    <div data-testid="summary-container">
      {/* Total before discount */}
      <div>
        <span>Total (before discount)</span>
        <span data-testid="total-before-discount">
          {result.totalBeforeDiscount}
        </span>
      </div>

      {/* Pair discounts */}
      {result.pairDiscounts.length > 0 && (
        <div data-testid="pair-discounts-section">
          {result.pairDiscounts.map((d) => (
            <div key={d.productId} data-testid={`pair-discount-${d.productId}`}>
              <span>
                {d.productId} ({d.pairs} pair{d.pairs > 1 ? 's' : ''} × 5%)
              </span>
              <span>-{d.discountAmount}</span>
            </div>
          ))}
        </div>
      )}

      {/* Member card discount */}
      {result.memberCardDiscount > 0 && (
        <div data-testid="member-card-discount">
          <span>Member card (10%)</span>
          <span>-{result.memberCardDiscount}</span>
        </div>
      )}

      {/* Final total */}
      <div>
        <span>Final Total</span>
        <span data-testid="final-total">{result.finalTotal}</span>
      </div>
    </div>
  );
};
