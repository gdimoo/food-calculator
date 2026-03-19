export interface Product {
  id: string;
  name: string;
  price: number;
  isPairDiscountEligible: boolean;
}

export const PRODUCTS: Product[] = [
  { id: 'red',    name: 'Red Set',    price: 50,  isPairDiscountEligible: false },
  { id: 'green',  name: 'Green Set',  price: 40,  isPairDiscountEligible: true  },
  { id: 'blue',   name: 'Blue Set',   price: 30,  isPairDiscountEligible: false },
  { id: 'yellow', name: 'Yellow Set', price: 50,  isPairDiscountEligible: false },
  { id: 'pink',   name: 'Pink Set',   price: 80,  isPairDiscountEligible: true  },
  { id: 'purple', name: 'Purple Set', price: 90,  isPairDiscountEligible: false },
  { id: 'orange', name: 'Orange Set', price: 120, isPairDiscountEligible: true  },
];

export const PAIR_DISCOUNT_RATE = 0.05;
export const MEMBER_DISCOUNT_RATE = 0.10;
