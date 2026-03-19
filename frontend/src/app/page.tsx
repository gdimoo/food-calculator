'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProductList } from '../components/ProductList/ProductList';
import { MemberCard } from '../components/MemberCard/MemberCard';
import { useCalculator } from '../hooks/useCalculator/useCalculator';
import { Product } from '../types';

export default function Home() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const {
    quantities,
    memberCard,
    calculationResult,
    isLoading,
    error,
    updateQuantity,
    updateMemberCard,
    calculate,
    reset,
  } = useCalculator();

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then(setProducts)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!calculationResult) return;
    sessionStorage.setItem('calculationResult', JSON.stringify(calculationResult));
    sessionStorage.setItem('products', JSON.stringify(products));
    router.push('/result');
  }, [calculationResult, products, router]);

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Food Store Calculator</h1>

        <ProductList
          products={products}
          quantities={quantities}
          onChange={updateQuantity}
        />

        <div className="mt-6">
          <MemberCard value={memberCard} onChange={updateMemberCard} />
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            <span className="text-red-500 text-lg leading-none mt-0.5">⚠️</span>
            <div>
              <p className="text-sm font-semibold text-red-700">Order Restricted</p>
              <p className="text-sm text-red-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={calculate}
            disabled={isLoading || Object.values(quantities).every((q) => q === 0)}
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition-colors"
          >
            {isLoading ? 'Calculating…' : 'Calculate'}
          </button>
          <button
            onClick={reset}
            className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold rounded-xl transition-colors"
          >
            Reset
          </button>
        </div>
      </div>
    </main>
  );
}
