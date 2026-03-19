import React from 'react';
import { Product } from '../../types';


interface Props {
  products: Product[];
  quantities: Record<string, number>;
  onChange: (productId: string, quantity: number) => void;
}

export const ProductList: React.FC<Props> = ({ products, quantities, onChange }) => {
  return (
    <div data-testid="product-list" className="space-y-3">
      {products.map((product) => {
        const qty = quantities[product.id] ?? 0;
        return (
          <div
            key={product.id}
            data-testid={`product-${product.id}`}
            className="flex items-center justify-between bg-white border border-gray-200 rounded-xl px-5 py-4 shadow-sm"
          >
            <div className="flex items-center gap-3 flex-1">
              <img
                src={`/images/${product.id}.png`}
                alt={product.name}
                width={48}
                height={48}
                className="w-12 h-12 object-cover rounded-lg"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/images/placeholder.png'; }}
              />
              <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">{product.name}</span>
                {product.isPairDiscountEligible && (
                  <span
                    data-testid="pair-discount-badge"
                    className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full"
                  >
                    5% pair discount
                  </span>
                )}
              </div>
              <span className="text-sm text-gray-500">{product.price} THB</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                data-testid={`remove-${product.id}`}
                onClick={() => qty > 0 && onChange(product.id, qty - 1)}
                disabled={qty === 0}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed text-gray-700 font-bold transition-colors"
              >
                −
              </button>

              <span data-testid="quantity-display">
                <span
                  data-testid={`quantity-${product.id}`}
                  className="w-6 text-center font-semibold text-gray-800"
                >
                  {qty}
                </span>
              </span>

              <button
                data-testid={`add-${product.id}`}
                onClick={() => onChange(product.id, qty + 1)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-100 hover:bg-indigo-200 text-indigo-700 font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
