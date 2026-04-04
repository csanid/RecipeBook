// Custom Cypress commands

declare global {
  namespace Cypress {
    interface Chainable {
      seedRecipes(recipes: object[]): Chainable<void>
      seedTags(tags: string[]): Chainable<void>
      openAddRecipeModal(): Chainable<void>
      stubOpenGraphSuccess(): Chainable<void>
      stubOpenGraphError(): Chainable<void>
    }
  }
}

// Loads an array of recipes into localStorage under 'recipebook_recipes'
Cypress.Commands.add('seedRecipes', (_recipes) => {
  // TODO
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

// TODO: Stubs the OpenGraph API with the opengraph.json success fixture
Cypress.Commands.add('stubOpenGraphSuccess', () => {
  // TODO
})

// TODO: Stubs the OpenGraph API with a 500 error using opengraph-error.json
Cypress.Commands.add('stubOpenGraphError', () => {
  // TODO
})

export {}
