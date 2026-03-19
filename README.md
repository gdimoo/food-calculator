# Food Store Calculator

A full-stack calculator app for a food store with discount logic.

## Tech Stack

- **Backend:** NestJS + TypeScript
- **Frontend:** Next.js + React + TypeScript
- **Testing:** Jest + React Testing Library (TDD)

## Project Structure

```
food-calculator/
├── backend/          # NestJS API
│   └── src/
│       ├── products/     # GET /api/products
│       ├── calculator/   # POST /api/calculate
│       └── red-set/      # Red Set restriction logic
└── frontend/         # Next.js UI
    └── src/
        ├── components/
        │   ├── ProductList/
        │   ├── MemberCard/
        │   └── Summary/
        └── hooks/
            └── useCalculator/
```

## Getting Started

### Backend

```bash
cd backend
npm install
npm run start:dev     # http://localhost:3001
npm run test          # run unit tests
```

### Frontend

```bash
cd frontend
npm install
npm run dev           # http://localhost:3000
npm run test          # run unit tests
```

## API Endpoints

### GET /api/products
Returns all 7 products.

```json
[
  { "id": "red",    "name": "Red Set",    "price": 50,  "isPairDiscountEligible": false },
  { "id": "green",  "name": "Green Set",  "price": 40,  "isPairDiscountEligible": true  },
  { "id": "blue",   "name": "Blue Set",   "price": 30,  "isPairDiscountEligible": false },
  { "id": "yellow", "name": "Yellow Set", "price": 50,  "isPairDiscountEligible": false },
  { "id": "pink",   "name": "Pink Set",   "price": 80,  "isPairDiscountEligible": true  },
  { "id": "purple", "name": "Purple Set", "price": 90,  "isPairDiscountEligible": false },
  { "id": "orange", "name": "Orange Set", "price": 120, "isPairDiscountEligible": true  }
]
```

### POST /api/calculate

**Request:**
```json
{
  "items": [
    { "productId": "orange", "quantity": 2 },
    { "productId": "red",    "quantity": 1 }
  ],
  "memberCardNumber": "VIP001"
}
```

**Response:**
```json
{
  "totalBeforeDiscount": 290,
  "pairDiscounts": [
    { "productId": "orange", "pairs": 1, "discountAmount": 12 }
  ],
  "totalPairDiscount": 12,
  "memberCardDiscount": 27.8,
  "finalTotal": 250.2
}
```

**Error (Red Set restriction):**
```json
{
  "statusCode": 429,
  "message": "Red Set can only be ordered once per hour per customer"
}
```

## Business Rules

### Pair Discount (5%)
- Applies to: **Orange** (120), **Pink** (80), **Green** (40)
- Same price items can pair together
- Every 2 items of the same price = 1 pair = 5% off that pair
- Odd quantity: last item gets no discount

```
Orange x2 → (120+120) × 0.95 = 228
Pink x4   → (80+80) × 0.95 × 2 = 304
Green x3  → (40+40) × 0.95 + 40 = 116
```

### Member Card Discount (10%)
- Applied **after** pair discount
- Any non-empty member card number qualifies

### Red Set Restriction
- Only **1 customer per IP** can order Red Set within **1 hour**
- Returns HTTP 429 if another customer tries within the same hour

## Test Coverage

| Module | Tests |
|--------|-------|
| Backend - ProductsService | 6 |
| Backend - CalculatorService | 13 |
| Backend - RedSetService | 7 |
| Frontend - ProductList | 10 |
| Frontend - MemberCard | 7 |
| Frontend - Summary | 9 |
| Frontend - useCalculator | 14 |
| **Total** | **66** |
