# Food Store Calculator

A full-stack food store calculator with discount logic, built with NestJS and Next.js.

## Tech Stack

- **Backend:** NestJS + TypeScript
- **Frontend:** Next.js 14 (App Router) + React + TypeScript + Tailwind CSS v4
- **Testing:** Jest + React Testing Library
- **API Docs:** Swagger UI

## Prerequisites

- Node.js v18+
- npm v9+

## Project Structure

```
food-calculator/
├── backend/
│   └── src/
│       ├── calculator/       # POST /api/calculate
│       ├── products/         # GET /api/products
│       └── red-set/          # Red Set hourly restriction logic
└── frontend/
    └── src/
        ├── app/
        │   ├── page.tsx          # Order page
        │   ├── result/page.tsx   # Result page
        │   └── api/              # Next.js proxy routes → backend
        ├── components/
        │   ├── ProductList/      # Product list with +/− quantity
        │   ├── MemberCard/       # Member card input
        │   └── Summary/          # Order summary with discounts
        ├── hooks/
        │   └── useCalculator/    # State + API call logic
        └── types/                # Shared TypeScript interfaces
```

## Setup & Running

> Both backend and frontend must be running at the same time.

### 1. Backend

```bash
cd backend
npm install
npm run start:dev
```

Runs at **http://localhost:3001**

### 2. Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Runs at **http://localhost:3000**

### 3. Open the app

Visit **http://localhost:3000** in your browser.

### Swagger API Docs

Visit **http://localhost:3001/api/docs**

## Running Tests

### Backend

```bash
cd backend
npm run test
```

### Frontend

```bash
cd frontend
npm run test
```

## UI Flow

1. **Order page** — select product quantities, enter optional member card number, click Calculate
2. **Result page** — shows full order summary with discounts breakdown
3. Calculate button is disabled when no items are selected
4. All prices displayed with 2 decimal places

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
  "totalBeforeDiscount": 290.00,
  "pairDiscounts": [
    { "productId": "orange", "pairs": 1, "discountAmount": 12.00 }
  ],
  "totalPairDiscount": 12.00,
  "memberCardDiscount": 27.80,
  "finalTotal": 250.20
}
```

**Error — Red Set restriction (HTTP 429):**
```json
{
  "message": "Red Set can only be ordered once per hour",
  "minutesRemaining": 42
}
```

## Business Rules

### Pair Discount (5%)
- Applies to: **Orange** (120 THB), **Pink** (80 THB), **Green** (40 THB)
- Every 2 items of the same price = 1 pair = 5% off that pair
- Odd quantity: last item gets no discount

```
Orange x2 → (120+120) × 0.95 = 228.00
Pink x4   → (80+80) × 0.95 × 2 = 304.00
Green x3  → (40+40) × 0.95 + 40 = 116.00
```

### Member Card Discount (10%)
- Applied **after** pair discount
- Any non-empty member card number qualifies

### Red Set Restriction
- Only **1 customer per IP** can order Red Set within **1 hour**
- Returns HTTP 429 with `minutesRemaining` if blocked
- Frontend shows an alert with the time remaining

## Test Coverage

| Module | Tests |
|---|---|
| Backend - ProductsService | 6 |
| Backend - CalculatorService | 13 |
| Backend - RedSetService | 7 |
| Frontend - ProductList | 10 |
| Frontend - MemberCard | 7 |
| Frontend - Summary | 9 |
| Frontend - useCalculator | 14 |
| **Total** | **66** |
