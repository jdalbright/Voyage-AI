# Voyage AI

Voyage AI is an intelligent travel planner that blends large language models with real-time data sources to craft unforgettable journeys. This project scaffolding bootstraps a Next.js (Pages Router) application with Tailwind CSS styling, serverless API routes, and integration points for Google Cloud, Bluesky, Stripe, and LLM providers.

## Features
- **Dynamic planning form:** Collect rich itinerary preferences including origin, destination, travel window, interests, and budget.
- **Itinerary visualization:** Render AI-generated plans day by day with placeholders for flights, hotels, and activities.
- **Social inspiration feed:** Surface trending Bluesky travel posts filtered by hashtag.
- **Digital storefront:** Present monetized add-ons that will be fulfilled via Stripe Checkout.

## Tech Stack
- [Next.js](https://nextjs.org/) (Pages Router) with TypeScript
- React 18 + Tailwind CSS for the UI
- Node.js API routes deployed via `/pages/api`
- Axios (available for API calls once business logic is implemented)

## Project Structure
```
./components
  ├─ BlueskyFeed.tsx       # Fetches social posts from internal API
  ├─ ItineraryDisplay.tsx  # Renders itinerary details provided by LLM
  └─ PlannerForm.tsx       # Collects traveler preferences
./pages
  ├─ index.tsx             # Landing page composing the planner, itinerary, and feed
  ├─ store.tsx             # Placeholder ecommerce storefront
  └─ api
      ├─ generate-itinerary.ts   # POST endpoint returning mock itinerary JSON
      ├─ get-bluesky-posts.ts    # GET endpoint returning mock Bluesky posts
      └─ stripe-checkout.ts      # POST endpoint returning mock checkout URLs
./styles
  └─ globals.css           # Tailwind layer imports and base theming
```

## API Routes
- `POST /api/generate-itinerary`
  - Accepts planner input (origin, destination, dates, interests, budget).
  - **Integration points:** Google Flights API for live fares; selected LLM (Gemini/GPT) for narrative generation.
  - Currently returns a mock itinerary payload.
- `GET /api/get-bluesky-posts?tag=#travel`
  - Accepts a hashtag, queries Bluesky, and returns recent posts.
  - Authenticate with Bluesky via `BLUESKY_APP_PASSWORD` and normalize the response.
  - Currently returns mock posts.
- `POST /api/stripe-checkout`
  - Accepts a `productId` and should create a Stripe Checkout session.
  - Use `STRIPE_SECRET_KEY` and configure success/cancel URLs.
  - Currently returns a placeholder checkout URL.

## Environment Variables
Create an `.env.local` file (never commit real values) and include the following keys. See `.env.local.example` for the template.

```bash
# Google Cloud services for Maps and Flights integrations
MAPS_API_KEY=your_google_maps_key
GOOGLE_FLIGHTS_API_KEY=your_google_flights_key

# Bluesky API credentials
BLUESKY_HANDLE=your_bluesky_handle
BLUESKY_APP_PASSWORD=your_bluesky_app_password

# Stripe secret for Checkout sessions
STRIPE_SECRET_KEY=sk_live_or_test_key

# LLM provider key (Gemini, GPT, etc.)
LLM_API_KEY=your_llm_api_key
```

## Getting Started
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Add environment variables**
   - Copy `.env.local.example` to `.env.local` and populate each value.
3. **Run the development server**
   ```bash
   npm run dev
   ```
4. **Open in browser**
   - Navigate to http://localhost:3000 to view the landing page.
   - Visit http://localhost:3000/store for the storefront.

## Next Steps
- Connect the planner submission to the itinerary generation API using `fetch` or `axios`.
- Replace mock data in API routes with real integrations (Google Maps/Flights, Bluesky, Stripe, LLM).
- Add persistent storage or caching to capture user itineraries and product purchases.
