# FoodieExpress — Food Delivery Web Application

A responsive food delivery web app built as a frontend interview assignment. Users can browse restaurants, search and filter, customize menu items, manage a cart, apply coupons, complete checkout, and track order status.

## Tech Stack

- **React** (JavaScript, no TypeScript)
- **Vite** — build tool and dev server
- **React Router DOM** — client-side routing
- **Tailwind CSS v4** — styling
- **Context API** — state management (Cart, Favorites)
- **LocalStorage** — cart, order, and favorites persistence (no real backend)

## Setup Instructions

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the dev server:
   ```
   npm run dev
   ```
4. Open the local URL shown in the terminal (typically `http://localhost:5173`)

## Available Scripts

- `npm run dev` — start the development server
- `npm run build` — build for production
- `npm run preview` — preview the production build locally

## Architecture Overview

- Each page in `pages/` corresponds to a route defined in `App.jsx`.
- Reusable presentational pieces (like the customization modal) currently live inside their page file where they're used; shared cross-page components (Header, Skeleton) live in `components/common/`.
- Mock data is structured as plain JS arrays of objects in `data/`, decoupled from components so it's easy to extend.
- A custom `useDebounce` hook (`hooks/useDebounce.js`) is reused wherever debounced input is needed.

## State Management Approach

Used **React Context API** instead of Redux or Zustand, split by domain:

- **CartContext** — cart items, quantities, restaurant-lock (to support the "cart from another restaurant" confirmation), persisted to `localStorage`.
- **FavoritesContext** — favorited restaurant IDs, persisted to `localStorage`, exposing `isFavorite` and `toggleFavorite`.

Context was chosen over Redux Toolkit for a 2-day scoped project: less boilerplate, and splitting into multiple small contexts avoids the common "one giant re-rendering context" pitfall. Filters and search state are kept local to the pages that use them (Restaurants page) since they don't need to be shared globally.

## Features Completed

- Home page: search bar, categories, featured restaurants
- Restaurant listing: debounced search, cuisine filter, sort, loading skeleton, empty state
- Favorites: toggle a restaurant as favorite from the listing page, persisted across refreshes
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
- Cart, order, and favorites persistence via localStorage

## Features Not Implemented (due to time constraints)

- URL-based filter state syncing beyond initial query params
- End-to-end (E2E) tests
- Real-time order tracking (currently simulated via timer)

## Assumptions

- No real backend or payment gateway — all data is local/mock, and payment selection does not process any transaction.
- Delivery fee and tax rate are fixed constants for simplicity.

## Known Limitations

- No authentication — addresses are entered fresh at checkout each time rather than saved to a user profile.