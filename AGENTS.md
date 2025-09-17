# Repository Guidelines

## Project Structure & Module Organization
- `pages/`: Next.js Pages Router entry points. `/index.tsx` for the landing flow, `/store.tsx` for the storefront, `/api/*` for serverless routes integrating Google, Bluesky, Stripe, and future LLM logic.
- `components/`: Reusable UI building blocks (`PlannerForm`, `ItineraryDisplay`, `BlueskyFeed`).
- `styles/`: Global Tailwind layers (`globals.css`).
- `public/`: Static assets; currently empty.
- `README.md`, `AGENTS.md`: High-level documentation; update when behavior changes.

## Build, Test, and Development Commands
- `npm install`: Sync project dependencies.
- `npm run dev`: Launches the Next.js dev server with hot reload at `http://localhost:3000`.
- `npm run build`: Executes type-checking, linting, and generates the production bundle.
- `npm run start`: Serves the optimized build (use after `npm run build`).

## Coding Style & Naming Conventions
- Language: TypeScript + React functional components.
- Formatting: Prettier defaults via Next.js; keep 2-space indentation and trailing commas.
- Styling: Tailwind utility classes; prefer descriptive class groupings over inline styles.
- Naming: PascalCase for components/files in `components/`, camelCase for variables/functions, kebab-case for non-code assets.

## Testing Guidelines
- No automated test suite is configured yet; propose additions before introducing frameworks (Vitest, Jest, Playwright, etc.).
- Co-locate tests alongside source files (`Component.test.tsx`) or under a future `tests/` directory.
- Ensure new endpoints/components ship with sanity checks or mock-driven tests once tooling is agreed upon.

## Commit & Pull Request Guidelines
- Write commits in the imperative mood (`Add Bluesky feed polling`). Keep scope focused; favor multiple small commits over one large change.
- Reference related issues in both commit body and PR description (`Refs #12`).
- Pull requests should include: summary of changes, testing evidence (`npm run build` output or screenshots), deployment considerations, and follow-up tasks.
- Request review from domain owners (frontend, API, integrations) before merge; ensure branch is rebased onto latest `main`.

## Security & Configuration Tips
- Never commit `.env.local` or real credentials. Use `.env.local.example` for shared keys.
- Gate external API calls behind serverless routes to keep secrets server-side and enable rate-limiting/throttling later.
