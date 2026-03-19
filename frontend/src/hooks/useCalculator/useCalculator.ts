import { useState, useCallback } from 'react';
import { CalculationResult } from '../../types';

interface State {
  quantities: Record<string, number>;
  memberCard: string;
  calculationResult: CalculationResult | null;
  isLoading: boolean;
  error: string | null;
}

export const useCalculator = () => {
  const [state, setState] = useState<State>({
    quantities: {},
    memberCard: '',
    calculationResult: null,
    isLoading: false,
    error: null,
  });

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setState((prev) => {
      const next = { ...prev.quantities };
      if (quantity <= 0) {
        delete next[productId];
      } else {
        next[productId] = quantity;
      }
      return { ...prev, quantities: next, calculationResult: null };
    });
  }, []);

  const updateMemberCard = useCallback((value: string) => {
    setState((prev) => ({
      ...prev,
      memberCard: value,
      calculationResult: null,
    }));
  }, []);

  const calculate = useCallback(async () => {
    setState((prev) => {
      // Don't call API if no items
      const hasItems = Object.values(prev.quantities).some((q) => q > 0);
      if (!hasItems) return prev;
      return { ...prev, isLoading: true, error: null };
    });

    setState((prev) => {
      const hasItems = Object.values(prev.quantities).some((q) => q > 0);
      if (!hasItems) return prev;
      return prev;
    });

    const { quantities, memberCard } = state;
    const hasItems = Object.values(quantities).some((q) => q > 0);
    if (!hasItems) return;

    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const items = Object.entries(quantities).map(([productId, quantity]) => ({
        productId,
        quantity,
      }));

      const response = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, memberCardNumber: memberCard }),
      });

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({}));
        const msg = errBody.message ?? 'Calculation failed';
        const minutes = errBody.minutesRemaining;
        throw new Error(
          minutes ? `${msg}. Please try again in ${minutes} minute${minutes > 1 ? 's' : ''}.` : msg,
        );
      }

      const result: CalculationResult = await response.json();
      setState((prev) => ({
        ...prev,
        calculationResult: result,
        isLoading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Unknown error',
        isLoading: false,
      }));
    }
  }, [state]);

  const reset = useCallback(() => {
    setState({
      quantities: {},
      memberCard: '',
      calculationResult: null,
      isLoading: false,
      error: null,
    });
  }, []);

  return {
    ...state,
    updateQuantity,
    updateMemberCard,
    calculate,
    reset,
  };
};
