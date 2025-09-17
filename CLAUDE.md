# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm install` - Install project dependencies
- `npm run dev` - Start development server at http://localhost:3000
- `npm run build` - Build production bundle (includes type-checking and linting)
- `npm run start` - Serve production build (use after `npm run build`)
- `npm run lint` - Run ESLint

## Architecture Overview

This is a Next.js travel planning application using the Pages Router with TypeScript and Tailwind CSS. The app generates AI-powered travel itineraries and integrates with external services.

### Core Components Structure
- `pages/index.tsx` - Main landing page with planner form, itinerary display, and social feed
- `pages/store.tsx` - E-commerce storefront for travel add-ons
- `pages/_app.tsx` - App wrapper with global styles
- `components/PlannerForm.tsx` - Controlled form for travel preferences (origin, destination, dates, interests, budget)
- `components/ItineraryDisplay.tsx` - Renders generated itineraries with day-by-day breakdown
- `components/BlueskyFeed.tsx` - Displays social media posts for travel inspiration

### API Routes
- `POST /api/generate-itinerary` - Accepts travel preferences, returns itinerary JSON (currently mock data)
- `GET /api/get-bluesky-posts?tag=#travel` - Fetches Bluesky posts by hashtag (currently mock data)
- `POST /api/stripe-checkout` - Creates Stripe checkout sessions (currently mock data)

### State Management
Uses React useState for local component state. Main state flows:
- Planner form submission triggers API call to generate itinerary
- Itinerary state managed in index.tsx and passed to ItineraryDisplay
- Loading and error states handled at page level

### Styling
- Tailwind CSS with custom gradient backgrounds and glass-morphism effects
- Dark theme with slate/indigo color palette
- Responsive grid layouts using Tailwind's grid system

### Environment Variables
Copy `.env.local.example` to `.env.local` and populate:
- `MAPS_API_KEY` - Google Maps integration
- `GOOGLE_FLIGHTS_API_KEY` - Flight data
- `BLUESKY_HANDLE` / `BLUESKY_APP_PASSWORD` - Social media integration
- `STRIPE_SECRET_KEY` - Payment processing
- `LLM_API_KEY` - AI model integration

### Key Integration Points
The application is scaffolded for future integrations:
- Google Maps/Flights APIs for real travel data
- Bluesky social API for community content
- Stripe for payment processing
- LLM providers (Gemini/GPT) for itinerary generation

Currently all API routes return mock data pending real integrations.