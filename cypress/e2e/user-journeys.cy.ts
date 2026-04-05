import { SELECTORS } from '../support/selectors'
import { JOURNEY_TAG, UPDATED_RECIPE_NAME } from '../support/constants'

describe('User Journeys', () => {
  it('new user adds a tag and a recipe, then finds it by filtering and searching', () => {
    cy.stubOpenGraphSuccess()
    cy.visit('/')

    // Add a new tag via TagManager
    cy.get(SELECTORS.tagManager.tagEditBtn).click()
    cy.get(SELECTORS.tagManager.tagInput).type('Italian{enter}')
    cy.get(SELECTORS.tagManager.tagEditBtn).click()

    // Open Add Recipe modal and fetch Open Graph data
    cy.openAddRecipeModal()
    cy.get(SELECTORS.recipeModal.linkInput).type('https://example.com/italian-pasta')
    cy.get(SELECTORS.recipeModal.fetchOgBtn).click()
    cy.wait('@ogSuccess')

    // Add the Italian tag via the tag input
    cy.get(SELECTORS.recipeModal.tagInput).type('Italian{enter}')

    // Save the recipe
    cy.get(SELECTORS.recipeModal.saveBtn).click()

    // Assert the card appears in the grid with the correct name and tag
    cy.fixture('opengraph').then((og) => {
      cy.contains(SELECTORS.recipeGrid.card, og.hybridGraph.title).within(() => {
        cy.get(SELECTORS.recipeGrid.cardName).should('contain', og.hybridGraph.title)
        cy.get(SELECTORS.recipeGrid.cardTag).should('contain', 'Italian')
      })

      // Filter by Italian tag and assert only the new recipe is shown
      cy.contains(SELECTORS.tagManager.filterPill, 'Italian').click()
      cy.get(SELECTORS.recipeGrid.card).should('have.length', 1)
      cy.get(SELECTORS.recipeGrid.cardName).should('contain', og.hybridGraph.title)

      // Search by name and assert the recipe is shown
      cy.get(SELECTORS.actionBar.searchBar).type(og.hybridGraph.title)
      cy.get(SELECTORS.recipeGrid.card).should('have.length', 1)
      cy.get(SELECTORS.recipeGrid.cardName).should('contain', og.hybridGraph.title)
    })
  })

  it('user edits a recipe and finds it with the new tag filter', () => {
    cy.visit('/')
    cy.fixture('recipes').then(([recipe]) => {
      cy.seedRecipes([{ ...recipe, tags: [] }])
      cy.seedTags([JOURNEY_TAG])
      cy.reload()

      // Open the recipe and switch to edit mode
      cy.contains(SELECTORS.recipeGrid.card, recipe.name).click()
      cy.get(SELECTORS.recipeModal.editBtn).click()

      // Update the name
      cy.get(SELECTORS.recipeModal.nameInput).clear().type(UPDATED_RECIPE_NAME)

      // Add the Vegan tag via the tag input
      cy.get(SELECTORS.recipeModal.tagInput).type(`${JOURNEY_TAG}{enter}`)

      // Save and close the view modal
      cy.get(SELECTORS.recipeModal.saveBtn).click()
      cy.get(SELECTORS.recipeModal.viewCloseBtn).click()

      // Assert the card shows the updated name and tag
      cy.contains(SELECTORS.recipeGrid.card, UPDATED_RECIPE_NAME).within(() => {
        cy.get(SELECTORS.recipeGrid.cardName).should('contain', UPDATED_RECIPE_NAME)
        cy.get(SELECTORS.recipeGrid.cardTag).should('contain', JOURNEY_TAG)
      })

      // Filter by Vegan and assert the card is in the filtered results
      cy.contains(SELECTORS.tagManager.filterPill, JOURNEY_TAG).click()
      cy.get(SELECTORS.recipeGrid.card).should('have.length', 1)
      cy.get(SELECTORS.recipeGrid.cardName).should('contain', UPDATED_RECIPE_NAME)
    })
  })
})
