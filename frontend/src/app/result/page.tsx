'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Summary } from '../../components/Summary/Summary';
import { CalculationResult, Product } from '../../types';

export default function ResultPage() {
  const router = useRouter();
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const storedResult = sessionStorage.getItem('calculationResult');
    const storedProducts = sessionStorage.getItem('products');
    if (!storedResult) {
      router.replace('/');
      return;
    }
    setResult(JSON.parse(storedResult));
    if (storedProducts) setProducts(JSON.parse(storedProducts));
  }, [router]);

  const handleNewOrder = () => {
    sessionStorage.removeItem('calculationResult');
    sessionStorage.removeItem('products');
    router.push('/');
  };

  if (!result) return null;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Order Summary</h1>

        <Summary result={result} products={products} />

        <button
          onClick={handleNewOrder}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          New Order
        </button>
      </div>
    </main>
  );
}
