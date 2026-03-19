import { CalculatorService } from '../calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    service = new CalculatorService();
  });

  // ─── BASIC PRICING ───────────────────────────────────────
  describe('Basic pricing (no discount)', () => {
    it('should calculate single item correctly', () => {
      const result = service.calculate({
        items: [{ productId: 'red', quantity: 1 }],
      });
      expect(result.totalBeforeDiscount).toBe(50);
      expect(result.finalTotal).toBe(50);
    });

    it('should calculate multiple different items', () => {
      const result = service.calculate({
        items: [
          { productId: 'red', quantity: 1 },    // 50
          { productId: 'blue', quantity: 2 },   // 60
          { productId: 'yellow', quantity: 1 }, // 50
        ],
      });
      expect(result.totalBeforeDiscount).toBe(160);
      expect(result.finalTotal).toBe(160);
    });

    it('should return 0 for empty order', () => {
      const result = service.calculate({ items: [] });
      expect(result.totalBeforeDiscount).toBe(0);
      expect(result.finalTotal).toBe(0);
    });
  });

  // ─── PAIR DISCOUNT (5%) ───────────────────────────────────
  describe('Pair discount (5%)', () => {
    it('should apply 5% discount for Orange x2', () => {
      // (120 + 120) * 0.95 = 228
      const result = service.calculate({
        items: [{ productId: 'orange', quantity: 2 }],
      });
      expect(result.totalBeforeDiscount).toBe(240);
      expect(result.totalPairDiscount).toBeCloseTo(12);
      expect(result.finalTotal).toBeCloseTo(228);
    });

    it('should apply 5% discount for Pink x4 (2 pairs)', () => {
      // (80*2)*0.95 + (80*2)*0.95 = 152 + 152 = 304
      const result = service.calculate({
        items: [{ productId: 'pink', quantity: 4 }],
      });
      expect(result.totalBeforeDiscount).toBe(320);
      expect(result.totalPairDiscount).toBeCloseTo(16);
      expect(result.finalTotal).toBeCloseTo(304);
    });

    it('should apply 5% for pair only, remainder is full price (Green x3)', () => {
      // (40+40)*0.95 + 40 = 76 + 40 = 116
      const result = service.calculate({
        items: [{ productId: 'green', quantity: 3 }],
      });
      expect(result.totalBeforeDiscount).toBe(120);
      expect(result.totalPairDiscount).toBeCloseTo(4);
      expect(result.finalTotal).toBeCloseTo(116);
    });

    it('should NOT apply pair discount for non-eligible items (Red, Blue, Yellow, Purple)', () => {
      const result = service.calculate({
        items: [{ productId: 'red', quantity: 2 }],
      });
      expect(result.totalPairDiscount).toBe(0);
      expect(result.finalTotal).toBe(100);
    });

    it('should NOT apply pair discount across different price items (Orange + Pink)', () => {
      // Orange 120, Pink 80 - different price, no pair discount
      const result = service.calculate({
        items: [
          { productId: 'orange', quantity: 1 },
          { productId: 'pink', quantity: 1 },
        ],
      });
      expect(result.totalPairDiscount).toBe(0);
      expect(result.finalTotal).toBe(200);
    });

    it('should return correct pairDiscounts details', () => {
      const result = service.calculate({
        items: [{ productId: 'orange', quantity: 2 }],
      });
      expect(result.pairDiscounts).toHaveLength(1);
      expect(result.pairDiscounts[0].productId).toBe('orange');
      expect(result.pairDiscounts[0].pairs).toBe(1);
      expect(result.pairDiscounts[0].discountAmount).toBeCloseTo(12);
    });
  });

  // ─── MEMBER CARD DISCOUNT (10%) ──────────────────────────
  describe('Member card discount (10%)', () => {
    it('should apply 10% member discount on total after pair discount', () => {
      // Orange x2 after pair discount = 228, then 10% = 228 * 0.9 = 205.2
      const result = service.calculate({
        items: [{ productId: 'orange', quantity: 2 }],
        memberCardNumber: 'MEMBER001',
      });
      expect(result.totalBeforeDiscount).toBe(240);
      expect(result.totalPairDiscount).toBeCloseTo(12);
      expect(result.memberCardDiscount).toBeCloseTo(22.8);
      expect(result.finalTotal).toBeCloseTo(205.2);
    });

    it('should apply only member discount when no pair discount', () => {
      // Red x1 = 50, member 10% = 45
      const result = service.calculate({
        items: [{ productId: 'red', quantity: 1 }],
        memberCardNumber: 'MEMBER001',
      });
      expect(result.memberCardDiscount).toBeCloseTo(5);
      expect(result.finalTotal).toBeCloseTo(45);
    });

    it('should NOT apply member discount when no member card', () => {
      const result = service.calculate({
        items: [{ productId: 'red', quantity: 1 }],
      });
      expect(result.memberCardDiscount).toBe(0);
    });

    it('should NOT apply member discount for empty member card string', () => {
      const result = service.calculate({
        items: [{ productId: 'red', quantity: 1 }],
        memberCardNumber: '',
      });
      expect(result.memberCardDiscount).toBe(0);
    });
  });

  // ─── COMBINED DISCOUNTS ───────────────────────────────────
  describe('Combined discounts', () => {
    it('should apply pair + member discount correctly', () => {
      // Pink x4 = 304 after pair, then 10% member = 304 * 0.9 = 273.6
      const result = service.calculate({
        items: [{ productId: 'pink', quantity: 4 }],
        memberCardNumber: 'VIP001',
      });
      expect(result.finalTotal).toBeCloseTo(273.6);
    });

    it('should handle mixed eligible and non-eligible items with member card', () => {
      // Orange x2 (228) + Red x1 (50) = 278 before member
      // member 10% = 278 * 0.9 = 250.2
      const result = service.calculate({
        items: [
          { productId: 'orange', quantity: 2 },
          { productId: 'red', quantity: 1 },
        ],
        memberCardNumber: 'M123',
      });
      expect(result.totalBeforeDiscount).toBe(290);
      expect(result.totalPairDiscount).toBeCloseTo(12);
      expect(result.memberCardDiscount).toBeCloseTo(27.8);
      expect(result.finalTotal).toBeCloseTo(250.2);
    });
  });

  // ─── EDGE CASES ───────────────────────────────────────────
  describe('Edge cases', () => {
    it('should throw error for invalid productId', () => {
      expect(() =>
        service.calculate({
          items: [{ productId: 'invalid', quantity: 1 }],
        }),
      ).toThrow();
    });

    it('should throw error for quantity <= 0', () => {
      expect(() =>
        service.calculate({
          items: [{ productId: 'red', quantity: 0 }],
        }),
      ).toThrow();
    });

    it('should handle all 7 items in one order', () => {
      const result = service.calculate({
        items: [
          { productId: 'red', quantity: 1 },     // 50
          { productId: 'green', quantity: 2 },    // 76 (pair)
          { productId: 'blue', quantity: 1 },     // 30
          { productId: 'yellow', quantity: 1 },   // 50
          { productId: 'pink', quantity: 2 },     // 152 (pair)
          { productId: 'purple', quantity: 1 },   // 90
          { productId: 'orange', quantity: 2 },   // 228 (pair)
        ],
      });
      expect(result.pairDiscounts).toHaveLength(3);
      expect(result.finalTotal).toBeGreaterThan(0);
    });
  });
});
