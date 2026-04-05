# RecipeBook

A personal recipe bookmarking app built with React, Vite, Tailwind CSS and shadcn/ui. The app is tested by an end-to-end automation suite built with Cypress.

---

## The App

RecipeBook solves a simple problem: keeping recipe links organized. The app lets the user save recipe URLs, auto-fill metadata from the link, search by recipe name and filter the collection by custom tags.

### Features

- **Save recipes** with a name, link, image, tags and notes
- **Auto-fill metadata** from a URL using the OpenGraph API — paste a link and the app fetches the recipe title and image automatically
- **Tag management** — create a shared tag library and assign tags to recipes
- **Filter by tags** — select one or multiple tags to view the associated recipes
- **Search by name** — works alongside tag filters
- **Sort** by newest, oldest, A–Z or Z–A
- **Edit and delete** existing recipes
- All data is persisted to **localStorage**

### Tech stack

- [React](https://react.dev/) + [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Lucide React](https://lucide.dev/) for icons
- [OpenGraph.io](https://www.opengraph.io/) for URL metadata

---

## Project Structure

```
RecipeBook/
├── src/                        # React application source
│   ├── components/             # UI components
│   ├── hooks/                  # Custom hooks (useRecipeStore)
│   └── types.ts                # Data model
├── cypress/                    # Cypress test suite
│   ├── e2e/                    # Spec files
│   ├── fixtures/               # Test data and stubbed API responses
│   └── support/                # Commands, selectors, constants, hooks
└── cypress.config.ts
```

---

## Running the App

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Setup

```bash
# Install dependencies
npm install

# Create a .env file at the project root
# Add your OpenGraph API key (free tier available at opengraph.io)
echo "VITE_OPENGRAPH_ID=your_api_key_here" > .env

# Start the development server
npm run dev
```

The app runs at `http://localhost:5173` by default.

The OpenGraph API key is optional — the app works without it, but the auto-fill button will show an error when clicked. All tests stub the API, so no key is needed to run the test suite.

### Other app commands

```bash
npm run build     # Type-check and build for production
npm run preview   # Serve the production build locally
npm run lint      # Run ESLint
```

---

## Cypress Test Suite

### Why Cypress

Cypress was chosen for its developer-friendly API, built-in time-travel debugging and strong ecosystem for testing React applications. It runs in a real browser, which makes it well suited to testing the DOM interactions, modal flows and localStorage behavior this app relies on.

A Playwright suite covering the same test cases is planned as a follow-up, to provide a practical side-by-side comparison of both tools on the same codebase.

### Test philosophy

- **All network requests are stubbed** — no real API calls are made during tests, keeping the suite fast, deterministic and free of external dependencies
- **localStorage is seeded programmatically** — tests do not rely on UI flows to set up state, which keeps each spec focused on the behavior under test
- **Tests are isolated** — localStorage is cleared before every test via a global `beforeEach` hook
- **Selectors use `data-testid` attributes exclusively** — no CSS classes or element tags, making the suite resilient to style changes
- **Test data lives in fixtures** — no inline data objects in spec files
- **Shared logic lives in custom commands** — repeated interactions are encapsulated to keep specs readable

### Test coverage

The suite covers the following areas, including happy paths, unhappy paths and edge cases:

| Spec file | What it covers |
|---|---|
| `smoke.cy.ts` | App loads correctly |
| `tag-management.cy.ts` | Adding, editing and deleting tags; validation |
| `recipe-modal-add.cy.ts` | Add recipe flow; OpenGraph stubbing; tag interactions; unsaved changes guard; validation |
| `recipe-edit-delete.cy.ts` | Edit and delete flows; pre-population; confirmation dialogs |
| `recipe-grid.cy.ts` | Card display; empty state; modal open/close interactions |
| `recipe-search-sort.cy.ts` | Search by name; sort orders; combined search and sort |
| `recipe-tag-filtering.cy.ts` | Single and multi-tag filtering; AND logic; edge cases |
| `user-journeys.cy.ts` | Full user flows across multiple features |

### Running the tests

```bash
# Open the Cypress Test Runner (interactive mode — recommended for development)
npm run cypress:open

# Run the full suite headlessly (recommended for CI)
npm run cypress:run
```

The dev server must be running on `http://localhost:5173` before launching Cypress. Open a separate terminal and run `npm run dev` first.

### Support files

```
cypress/support/
├── commands.ts     # Custom Cypress commands (seedRecipes, seedTags, stubOpenGraphSuccess, etc.)
├── constants.ts    # UI labels and error message strings used in assertions
├── selectors.ts    # All data-testid selectors grouped by component
└── e2e.ts          # Global hooks and support file entry point
```

Selectors are grouped by component in `selectors.ts` rather than defined as a flat list. This means a selector change in the app requires a fix in exactly one place, and it's immediately clear which component a selector belongs to when reading a spec.

---

## Design decisions worth noting

**Native `<select>` for sort order** — the sort control uses a native HTML select element rather than a custom shadcn Select component. During test development, it became clear that the custom component's event handling was not reliably triggerable by Cypress in a way that reflected real user interaction. The native element is fully accessible, visually consistent with the rest of the UI, and interacts with Cypress's built-in `cy.select()` command without timing workarounds.

**localStorage only** — there is no backend. This keeps the setup minimal and the focus on the frontend behavior and test patterns.

---

## Planned additions

- [ ] Playwright test suite covering the same cases, with a comparison of both tools in this README
- [ ] Custom OpenGraph metadata service to replace the third-party API dependency
- [ ] Pagination or infinite scroll