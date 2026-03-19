import { renderHook, act } from '@testing-library/react';
import { useCalculator } from '../hooks/useCalculator/useCalculator';

// Mock fetch
const mockCalculationResult = {
  totalBeforeDiscount: 240,
  pairDiscounts: [{ productId: 'orange', pairs: 1, discountAmount: 12 }],
  totalPairDiscount: 12,
  memberCardDiscount: 0,
  finalTotal: 228,
};

global.fetch = jest.fn();

describe('useCalculator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ─── INITIAL STATE ────────────────────────────────────────
  describe('Initial state', () => {
    it('should have empty quantities', () => {
      const { result } = renderHook(() => useCalculator());
      expect(result.current.quantities).toEqual({});
    });

    it('should have empty member card', () => {
      const { result } = renderHook(() => useCalculator());
      expect(result.current.memberCard).toBe('');
    });

    it('should have null calculation result', () => {
      const { result } = renderHook(() => useCalculator());
      expect(result.current.calculationResult).toBeNull();
    });

    it('should not be loading initially', () => {
      const { result } = renderHook(() => useCalculator());
      expect(result.current.isLoading).toBe(false);
    });
  });

  // ─── UPDATE QUANTITY ──────────────────────────────────────
  describe('updateQuantity', () => {
    it('should update quantity for a product', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.updateQuantity('orange', 3));
      expect(result.current.quantities['orange']).toBe(3);
    });

    it('should remove product when quantity set to 0', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.updateQuantity('orange', 2));
      act(() => result.current.updateQuantity('orange', 0));
      expect(result.current.quantities['orange']).toBeUndefined();
    });

    it('should update multiple products independently', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.updateQuantity('orange', 2));
      act(() => result.current.updateQuantity('pink', 1));
      expect(result.current.quantities['orange']).toBe(2);
      expect(result.current.quantities['pink']).toBe(1);
    });

    it('should reset calculation result when quantities change', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.updateQuantity('orange', 2));
      expect(result.current.calculationResult).toBeNull();
    });
  });

  // ─── UPDATE MEMBER CARD ───────────────────────────────────
  describe('updateMemberCard', () => {
    it('should update member card number', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.updateMemberCard('VIP001'));
      expect(result.current.memberCard).toBe('VIP001');
    });

    it('should reset calculation result when member card changes', () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.updateMemberCard('VIP001'));
      expect(result.current.calculationResult).toBeNull();
    });
  });

  // ─── CALCULATE ────────────────────────────────────────────
  describe('calculate', () => {
    beforeEach(() => {
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: true,
        json: async () => mockCalculationResult,
      });
    });

    it('should call API with correct payload', async () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.updateQuantity('orange', 2));

      await act(async () => result.current.calculate());

      expect(fetch).toHaveBeenCalledWith('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ productId: 'orange', quantity: 2 }],
          memberCardNumber: '',
        }),
      });
    });

    it('should set calculation result after API call', async () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.updateQuantity('orange', 2));

      await act(async () => result.current.calculate());

      expect(result.current.calculationResult).toEqual(mockCalculationResult);
    });

    it('should set isLoading true during calculation', async () => {
      let resolvePromise: (val: any) => void;
      (global.fetch as jest.Mock).mockReturnValue(
        new Promise((res) => { resolvePromise = res; }),
      );

      const { result } = renderHook(() => useCalculator());
      act(() => result.current.updateQuantity('orange', 2));

      act(() => { result.current.calculate(); });
      expect(result.current.isLoading).toBe(true);

      await act(async () => {
        resolvePromise!({ ok: true, json: async () => mockCalculationResult });
      });
      expect(result.current.isLoading).toBe(false);
    });

    it('should not call API when no items selected', async () => {
      const { result } = renderHook(() => useCalculator());
      await act(async () => result.current.calculate());
      expect(fetch).not.toHaveBeenCalled();
    });

    it('should set error when API fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValue({ ok: false });
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.updateQuantity('orange', 2));

      await act(async () => result.current.calculate());
      expect(result.current.error).toBeTruthy();
    });

    it('should include member card in API call', async () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.updateQuantity('pink', 2));
      act(() => result.current.updateMemberCard('VIP001'));

      await act(async () => result.current.calculate());

      const body = JSON.parse(
        (fetch as jest.Mock).mock.calls[0][1].body,
      );
      expect(body.memberCardNumber).toBe('VIP001');
    });
  });

  // ─── RESET ────────────────────────────────────────────────
  describe('reset', () => {
    it('should reset all state', async () => {
      const { result } = renderHook(() => useCalculator());
      act(() => result.current.updateQuantity('orange', 2));
      act(() => result.current.updateMemberCard('VIP001'));

      act(() => result.current.reset());

      expect(result.current.quantities).toEqual({});
      expect(result.current.memberCard).toBe('');
      expect(result.current.calculationResult).toBeNull();
    });
  });
});
