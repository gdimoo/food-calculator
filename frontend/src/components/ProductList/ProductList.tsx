import React from 'react';
import { Product } from '../../types';

interface Props {
  products: Product[];
  quantities: Record<string, number>;
  onChange: (productId: string, quantity: number) => void;
}

export const ProductList: React.FC<Props> = ({ products, quantities, onChange }) => {
  return (
    <div data-testid="product-list">
      {products.map((product) => {
        const qty = quantities[product.id] ?? 0;
        return (
          <div key={product.id} data-testid={`product-${product.id}`}>
            <span>{product.name}</span>
            <span>{product.price} THB</span>

            {product.isPairDiscountEligible && (
              <span data-testid="pair-discount-badge">5% pair discount</span>
            )}

            <button
              data-testid={`remove-${product.id}`}
              onClick={() => qty > 0 && onChange(product.id, qty - 1)}
              disabled={qty === 0}
            >
              -
            </button>

            <span
              data-testid={`quantity-${product.id}`}
              data-testid-generic="quantity-display"
            >
              {qty}
            </span>

            <button
              data-testid={`add-${product.id}`}
              onClick={() => onChange(product.id, qty + 1)}
            >
              +
            </button>
          </div>
        );
      })}
    </div>
  );
};
