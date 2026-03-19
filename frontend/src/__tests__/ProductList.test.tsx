import { render, screen, fireEvent } from '@testing-library/react';
import { ProductList } from '../components/ProductList/ProductList';
import { Product } from '../types';

const mockProducts: Product[] = [
  { id: 'red',    name: 'Red Set',    price: 50,  isPairDiscountEligible: false },
  { id: 'orange', name: 'Orange Set', price: 120, isPairDiscountEligible: true  },
  { id: 'pink',   name: 'Pink Set',   price: 80,  isPairDiscountEligible: true  },
];

const mockOnChange = jest.fn();

describe('ProductList', () => {
  beforeEach(() => {
    mockOnChange.mockClear();
  });

  // ─── RENDERING ────────────────────────────────────────────
  describe('Rendering', () => {
    it('should render all products', () => {
      render(
        <ProductList
          products={mockProducts}
          quantities={{}}
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByText('Red Set')).toBeInTheDocument();
      expect(screen.getByText('Orange Set')).toBeInTheDocument();
      expect(screen.getByText('Pink Set')).toBeInTheDocument();
    });

    it('should display product prices', () => {
      render(
        <ProductList
          products={mockProducts}
          quantities={{}}
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByText('50 THB')).toBeInTheDocument();
      expect(screen.getByText('120 THB')).toBeInTheDocument();
      expect(screen.getByText('80 THB')).toBeInTheDocument();
    });

    it('should show quantity as 0 by default', () => {
      render(
        <ProductList
          products={mockProducts}
          quantities={{}}
          onChange={mockOnChange}
        />,
      );
      const quantities = screen.getAllByTestId('quantity-display');
      quantities.forEach((q) => expect(q).toHaveTextContent('0'));
    });

    it('should show current quantities from props', () => {
      render(
        <ProductList
          products={mockProducts}
          quantities={{ red: 2, orange: 1 }}
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByTestId('quantity-red')).toHaveTextContent('2');
      expect(screen.getByTestId('quantity-orange')).toHaveTextContent('1');
      expect(screen.getByTestId('quantity-pink')).toHaveTextContent('0');
    });

    it('should show pair discount badge for eligible products', () => {
      render(
        <ProductList
          products={mockProducts}
          quantities={{}}
          onChange={mockOnChange}
        />,
      );
      const badges = screen.getAllByTestId('pair-discount-badge');
      expect(badges).toHaveLength(2); // orange + pink
    });
  });

  // ─── ADD BUTTON ───────────────────────────────────────────
  describe('Add button', () => {
    it('should call onChange with +1 when add clicked', () => {
      render(
        <ProductList
          products={mockProducts}
          quantities={{ red: 1 }}
          onChange={mockOnChange}
        />,
      );
      fireEvent.click(screen.getByTestId('add-red'));
      expect(mockOnChange).toHaveBeenCalledWith('red', 2);
    });

    it('should call onChange with 1 when add clicked from 0', () => {
      render(
        <ProductList
          products={mockProducts}
          quantities={{}}
          onChange={mockOnChange}
        />,
      );
      fireEvent.click(screen.getByTestId('add-orange'));
      expect(mockOnChange).toHaveBeenCalledWith('orange', 1);
    });
  });

  // ─── REMOVE BUTTON ────────────────────────────────────────
  describe('Remove button', () => {
    it('should call onChange with -1 when remove clicked', () => {
      render(
        <ProductList
          products={mockProducts}
          quantities={{ red: 3 }}
          onChange={mockOnChange}
        />,
      );
      fireEvent.click(screen.getByTestId('remove-red'));
      expect(mockOnChange).toHaveBeenCalledWith('red', 2);
    });

    it('should NOT go below 0', () => {
      render(
        <ProductList
          products={mockProducts}
          quantities={{ red: 0 }}
          onChange={mockOnChange}
        />,
      );
      fireEvent.click(screen.getByTestId('remove-red'));
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it('should disable remove button when quantity is 0', () => {
      render(
        <ProductList
          products={mockProducts}
          quantities={{}}
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByTestId('remove-red')).toBeDisabled();
    });

    it('should enable remove button when quantity > 0', () => {
      render(
        <ProductList
          products={mockProducts}
          quantities={{ red: 1 }}
          onChange={mockOnChange}
        />,
      );
      expect(screen.getByTestId('remove-red')).not.toBeDisabled();
    });
  });
});
