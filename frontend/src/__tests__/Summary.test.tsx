import { render, screen } from '@testing-library/react';
import { Summary } from '../components/Summary/Summary';
import { CalculationResult } from '../types';

const mockResult: CalculationResult = {
  totalBeforeDiscount: 240,
  pairDiscounts: [
    { productId: 'orange', pairs: 1, discountAmount: 12 },
  ],
  totalPairDiscount: 12,
  memberCardDiscount: 22.8,
  finalTotal: 205.2,
};

const noDiscountResult: CalculationResult = {
  totalBeforeDiscount: 100,
  pairDiscounts: [],
  totalPairDiscount: 0,
  memberCardDiscount: 0,
  finalTotal: 100,
};

describe('Summary', () => {

  // ─── NULL STATE ───────────────────────────────────────────
  it('should not render when result is null', () => {
    render(<Summary result={null} />);
    expect(screen.queryByTestId('summary-container')).not.toBeInTheDocument();
  });

  // ─── TOTAL BEFORE DISCOUNT ────────────────────────────────
  it('should display total before discount', () => {
    render(<Summary result={mockResult} />);
    expect(screen.getByTestId('total-before-discount')).toHaveTextContent('240');
  });

  // ─── PAIR DISCOUNTS ───────────────────────────────────────
  it('should display pair discount details', () => {
    render(<Summary result={mockResult} />);
    expect(screen.getByTestId('pair-discount-orange')).toBeInTheDocument();
    expect(screen.getByTestId('pair-discount-orange')).toHaveTextContent('-12');
  });

  it('should NOT show pair discount section when no pair discounts', () => {
    render(<Summary result={noDiscountResult} />);
    expect(screen.queryByTestId('pair-discounts-section')).not.toBeInTheDocument();
  });

  it('should show multiple pair discounts', () => {
    const multiPairResult: CalculationResult = {
      ...mockResult,
      pairDiscounts: [
        { productId: 'orange', pairs: 1, discountAmount: 12 },
        { productId: 'pink',   pairs: 2, discountAmount: 16 },
      ],
      totalPairDiscount: 28,
    };
    render(<Summary result={multiPairResult} />);
    expect(screen.getByTestId('pair-discount-orange')).toBeInTheDocument();
    expect(screen.getByTestId('pair-discount-pink')).toBeInTheDocument();
  });

  // ─── MEMBER CARD DISCOUNT ─────────────────────────────────
  it('should display member card discount', () => {
    render(<Summary result={mockResult} />);
    expect(screen.getByTestId('member-card-discount')).toHaveTextContent('-22.8');
  });

  it('should NOT show member card discount when 0', () => {
    render(<Summary result={noDiscountResult} />);
    expect(screen.queryByTestId('member-card-discount')).not.toBeInTheDocument();
  });

  // ─── FINAL TOTAL ──────────────────────────────────────────
  it('should display final total', () => {
    render(<Summary result={mockResult} />);
    expect(screen.getByTestId('final-total')).toHaveTextContent('205.2');
  });

  it('should display final total when no discounts', () => {
    render(<Summary result={noDiscountResult} />);
    expect(screen.getByTestId('final-total')).toHaveTextContent('100');
  });
});
