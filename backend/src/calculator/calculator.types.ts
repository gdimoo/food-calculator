export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface CalculationRequest {
  items: OrderItem[];
  memberCardNumber?: string;
}

export interface DiscountDetail {
  productId: string;
  pairs: number;
  discountAmount: number;
}

export interface CalculationResult {
  totalBeforeDiscount: number;
  pairDiscounts: DiscountDetail[];
  totalPairDiscount: number;
  memberCardDiscount: number;
  finalTotal: number;
}
