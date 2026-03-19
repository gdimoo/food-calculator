import { PRODUCTS, PAIR_DISCOUNT_RATE, MEMBER_DISCOUNT_RATE } from '../products/products.data';
import {
  CalculationRequest,
  CalculationResult,
  DiscountDetail,
} from './calculator.types';

export class CalculatorService {
  calculate(request: CalculationRequest): CalculationResult {
    const { items, memberCardNumber } = request;

    // Validate
    for (const item of items) {
      const product = PRODUCTS.find((p) => p.id === item.productId);
      if (!product) throw new Error(`Invalid productId: ${item.productId}`);
      if (item.quantity <= 0) throw new Error(`Quantity must be > 0`);
    }

    // Calculate total before discount
    let totalBeforeDiscount = 0;
    for (const item of items) {
      const product = PRODUCTS.find((p) => p.id === item.productId)!;
      totalBeforeDiscount += product.price * item.quantity;
    }

    // Calculate pair discounts
    // Group eligible items by price (same price = can pair)
    const priceGroups = new Map<number, number>(); // price -> total quantity
    for (const item of items) {
      const product = PRODUCTS.find((p) => p.id === item.productId)!;
      if (!product.isPairDiscountEligible) continue;
      priceGroups.set(
        product.price,
        (priceGroups.get(product.price) ?? 0) + item.quantity,
      );
    }

    const pairDiscounts: DiscountDetail[] = [];
    let totalPairDiscount = 0;

    for (const item of items) {
      const product = PRODUCTS.find((p) => p.id === item.productId)!;
      if (!product.isPairDiscountEligible) continue;

      const totalQtyAtPrice = priceGroups.get(product.price) ?? 0;
      if (totalQtyAtPrice < 2) continue;

      // Only process once per price group
      if (pairDiscounts.find((d) => d.productId === item.productId)) continue;

      const pairs = Math.floor(totalQtyAtPrice / 2);
      const discountAmount = pairs * 2 * product.price * PAIR_DISCOUNT_RATE;

      pairDiscounts.push({
        productId: item.productId,
        pairs,
        discountAmount,
      });

      totalPairDiscount += discountAmount;
    }

    // Member card discount (applied after pair discount)
    const afterPairDiscount = totalBeforeDiscount - totalPairDiscount;
    const memberCardDiscount =
      memberCardNumber && memberCardNumber.trim()
        ? afterPairDiscount * MEMBER_DISCOUNT_RATE
        : 0;

    const finalTotal = afterPairDiscount - memberCardDiscount;

    return {
      totalBeforeDiscount,
      pairDiscounts,
      totalPairDiscount,
      memberCardDiscount,
      finalTotal,
    };
  }
}
