# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Commands
```bash
# App
npm run dev       # Start dev server (Vite HMR)
npm run build     # TypeScript check + production build
npm run lint      # ESLint
npm run preview   # Serve the production build locally

# Cypress
npm run cypress:open   # Open Cypress Test Runner (interactive)
npm run cypress:run    # Run Cypress suite headlessly

# Playwright
npm run playwright:test        # Run Playwright suite headlessly
npm run playwright:test --ui   # Open Playwright UI mode
```

## Environment Variables

`VITE_OPENGRAPH_ID` — API key for opengraph.io. Used in `RecipeModal` to autofill recipe
name and image from a URL. The UI handles missing/failed calls gracefully.

Not required to run tests — the OpenGraph API is always stubbed in both Cypress and
Playwright suites to avoid consuming API credits and to keep tests deterministic.

## Architecture

**State management** lives entirely in `src/hooks/useRecipeStore.ts`. It holds all `recipes`
and `tags` state, persists both to `localStorage` on every change, and exposes CRUD
operations. There is no external state library — `App.tsx` calls the hook and passes
everything down as props.

**Data model** (`src/types.ts`):
- `Tag` is a `string` alias (intentional for MVP simplicity — would need to become an object
  if tag metadata like color or ID is ever added)
- `Recipe` has `id`, `createdAt`, `name`, and optional `link`, `image`, `tags`, `notes`
- Tag comparison throughout the app is case-insensitive; original casing is preserved in storage

**Component layout** (`App.tsx` orchestrates everything):
- `Header` — static title bar
- `ActionBar` — search input + "Add Recipe" button
- `TagManager` — tag filter chips + tag CRUD. Tag filtering uses AND logic
- `RecipeCard` grid — filtered results
- `RecipeModal` — handles both Add and View/Edit modes

**UI components** in `src/components/ui/` are shadcn-style (class-variance-authority +
Tailwind). To add new shadcn components: `npx shadcn add <component>`. Tailwind CSS v4
is configured via `@tailwindcss/vite` in `vite.config` (no separate `tailwind.config.js`).

## Code Style

This project follows Clean Code principles. When generating or modifying code:
- Keep components small and focused on a single responsibility
- Extract logic out of JSX — no inline conditionals beyond simple ternaries
- Name functions and variables for what they do, not how they do it
- Prefer custom hooks for any stateful or side-effect logic
- Avoid prop drilling beyond two levels — lift state or extract context if needed
- All test-facing attributes use `data-testid`

## Test Suite Structure
```
e2e/
  cypress/
    fixtures/    # Stubbed API responses (OpenGraph, etc.)
    support/     # Commands and setup
    specs/       # Test files by feature
  playwright/
    fixtures/    # Same stubs mirrored for Playwright
    support/
    specs/
```

Both suites cover the same test cases, which makes the repo a practical comparison of
the two tools. The README documents the trade-offs observed.