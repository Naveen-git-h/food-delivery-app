# FoodieExpress — Food Delivery Web Application

A responsive food delivery web app built as a frontend interview assignment. Users can browse restaurants, search and filter, customize menu items, manage a cart, apply coupons, complete checkout, and track order status.

## Tech Stack

- **React** (JavaScript, no TypeScript)
- **Vite** — build tool and dev server
- **React Router DOM** — client-side routing
- **Tailwind CSS v4** — styling
- **Context API** — state management (Cart)
- **LocalStorage** — cart and order persistence (no real backend)

## Setup Instructions

1. Clone the repository
2. Install dependencies:
3. Run the dev server:
4. Open the local URL shown in the terminal (typically `http://localhost:5173`)

## Available Scripts

- `npm run dev` — start the development server
- `npm run build` — build for production
- `npm run preview` — preview the production build locally

## Architecture Overview

- Each page in `pages/` corresponds to a route defined in `App.jsx`.
- Reusable presentational pieces (like the customization modal) currently live inside their page file where they're used; shared cross-page components (Header, Skeleton) live in `components/common/`.
- Mock data is structured as plain JS arrays of objects in `data/`, decoupled from components so it's easy to extend.

## State Management Approach

Used **React Context API** instead of Redux or Zustand, split by domain:

- **CartContext** — cart items, quantities, restaurant-lock (to support the "cart from another restaurant" confirmation), persisted to `localStorage`.

Context was chosen over Redux Toolkit for a 2-day scoped project: less boilerplate, and splitting into two small contexts avoids the common "one giant re-rendering context" pitfall. Filters and search state are kept local to the pages that use them (Restaurants page) since they don't need to be shared globally.

## Features Completed

- Home page: search bar, categories, featured restaurants
- Restaurant listing: search, cuisine filter, sort, loading skeleton, empty state
- Restaurant details: menu grouped by category, veg/non-veg + bestseller indicators
- Food customization: size selection, add-ons, special instructions, live price calculation
- Cart: add/remove/update quantity, clear cart, dynamic subtotal/tax/delivery/total
- Restaurant-switch protection: confirms before clearing cart when adding from a different restaurant
- Coupon system: valid/invalid/expired/minimum order handling (codes: FOOD50, FIRSTORDER, FREEDEL)
- Checkout: address form with validation (phone, PIN code, required fields), delivery instructions, mock payment method selection
- Order confirmation page with order ID, items, address, and estimated delivery
- Order tracking with simulated status progression
- Order history with reorder functionality
- Responsive navigation (desktop nav + mobile hamburger menu)
- Cart persistence via localStorage

## Features Not Implemented (due to time constraints)

- Favorites functionality (button exists in data model, not wired to UI)
- Debounced search (search is instant, not debounced)
- URL-based filter state syncing beyond initial query params
- Automated tests (unit/E2E)
- Real-time order tracking (currently simulated via timer)

## Assumptions

- No real backend or payment gateway — all data is local/mock, and payment selection does not process any transaction.
- Delivery fee and tax rate are fixed constants for simplicity.
- Location is hardcoded to a single city (Hyderabad) — no live location detection.

## Known Limitations

- Mock data is limited to a curated set of restaurants/items rather than the full 50+ suggested in the spec.
- No authentication — addresses are entered fresh at checkout each time rather than saved to a user profile.
