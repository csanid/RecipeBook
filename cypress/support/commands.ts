// Custom Cypress commands

declare global {
  namespace Cypress {
    interface Chainable {
      seedRecipes(recipes: object[]): Chainable<void>
      seedTags(tags: string[]): Chainable<void>
      openAddRecipeModal(): Chainable<void>
      stubOpenGraphSuccess(): Chainable<void>
      stubOpenGraphError(): Chainable<void>
      selectSortOption(label: string): Chainable<void>
      getCardNames(): Chainable<string[]>
    }
  }
}

// Loads an array of recipes into localStorage under 'recipebook_recipes'
Cypress.Commands.add('seedRecipes', (recipes: object[]) => {
  cy.window().then((win) => {
    win.localStorage.setItem('recipebook_recipes', JSON.stringify(recipes))
  })
})

// Loads an array of tags into localStorage under 'recipebook_tags'
Cypress.Commands.add('seedTags', (tags: string[]) => {
  cy.window().then((win) => {
    win.localStorage.setItem('recipebook_tags', JSON.stringify(tags))
  })
})

// Clicks the add-recipe-btn to open the Add Recipe modal
Cypress.Commands.add('openAddRecipeModal', () => {
  cy.get('[data-testid="add-recipe-btn"]').click()
})

// Clicks the sort trigger and selects the option matching the given label
Cypress.Commands.add('selectSortOption', (label: string) => {
  cy.get('[data-testid="sort-select"]').select(label)
})

// Resolves to an array of visible recipe card name texts
Cypress.Commands.add('getCardNames', () =>
  cy.get('[data-testid="recipe-card-name"]').then(($els) =>
    [...$els].map((el) => el.textContent?.trim() ?? '')
  )
)

// TODO: Stubs the OpenGraph API with the opengraph.json success fixture
Cypress.Commands.add('stubOpenGraphSuccess', () => {
  // TODO
})

// TODO: Stubs the OpenGraph API with a 500 error using opengraph-error.json
Cypress.Commands.add('stubOpenGraphError', () => {
  // TODO
})

export {}
