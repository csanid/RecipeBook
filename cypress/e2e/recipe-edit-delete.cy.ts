import { SELECTORS } from '../support/selectors'
import { UPDATED_RECIPE_NAME } from '../support/constants'

describe('Edit and Delete Recipes', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.fixture('recipes').then((recipes) => cy.seedRecipes(recipes))
    cy.fixture('tags').then((tags: string[]) => cy.seedTags(tags))
    cy.reload()
  })

  context('Edit mode', () => {
    it('is accessible by clicking the edit button on a recipe card', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.contains(SELECTORS.recipeGrid.card, recipe.name).click()
        cy.get(SELECTORS.recipeModal.editBtn).click()
        cy.get(SELECTORS.recipeModal.nameInput).should('be.visible')
      })
    })

    it('pre-populates all fields with the existing recipe data', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.contains(SELECTORS.recipeGrid.card, recipe.name).click()
        cy.get(SELECTORS.recipeModal.editBtn).click()
        cy.get(SELECTORS.recipeModal.nameInput).should('have.value', recipe.name)
        cy.get(SELECTORS.recipeModal.linkInput).should('have.value', recipe.link)
        cy.get(SELECTORS.recipeModal.imageInput).should('have.value', recipe.image)
        cy.get(SELECTORS.recipeModal.notesInput).should('have.value', recipe.notes)
        cy.get(SELECTORS.recipeModal.removeTagChip).should('have.length', recipe.tags.length)
      })
    })
  })

  context('Editing a recipe', () => {
    it('updates the card in the grid after saving changes to the name', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.contains(SELECTORS.recipeGrid.card, recipe.name).click()
        cy.get(SELECTORS.recipeModal.editBtn).click()
        cy.get(SELECTORS.recipeModal.nameInput).clear().type(UPDATED_RECIPE_NAME)
        cy.get(SELECTORS.recipeModal.saveBtn).click()
        cy.contains(SELECTORS.recipeGrid.card, UPDATED_RECIPE_NAME).should('exist')
      })
    })

    it('shows the unsaved changes dialog when clicking on cancel after making edits', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.contains(SELECTORS.recipeGrid.card, recipe.name).click()
        cy.get(SELECTORS.recipeModal.editBtn).click()
        cy.get(SELECTORS.recipeModal.nameInput).clear().type(UPDATED_RECIPE_NAME)
        cy.get(SELECTORS.recipeModal.cancelBtn).click()
        cy.get(SELECTORS.recipeModal.discardChangesDialog).should('be.visible')
      })
    })

    it('keeps changes if closing modal is canceled', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.contains(SELECTORS.recipeGrid.card, recipe.name).click()
        cy.get(SELECTORS.recipeModal.editBtn).click()
        cy.get(SELECTORS.recipeModal.nameInput).clear().type(UPDATED_RECIPE_NAME)
        cy.get(SELECTORS.recipeModal.cancelBtn).click()
        cy.get(SELECTORS.recipeModal.keepEditingBtn).click()
        cy.get(SELECTORS.recipeModal.nameInput).should('have.value', UPDATED_RECIPE_NAME)
      })
    })

    it('discards changes if closing modal is confirmed', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.contains(SELECTORS.recipeGrid.card, recipe.name).click()
        cy.get(SELECTORS.recipeModal.editBtn).click()
        cy.get(SELECTORS.recipeModal.nameInput).clear().type(UPDATED_RECIPE_NAME)
        cy.get(SELECTORS.recipeModal.cancelBtn).click()
        cy.get(SELECTORS.recipeModal.discardChangesConfirmBtn).click()
        cy.get(SELECTORS.recipeModal.nameInput).should('not.exist')
        cy.contains(SELECTORS.recipeGrid.card, recipe.name).should('exist')
      })
    })
  })

  context('Deleting a recipe', () => {
    it('shows a delete confirmation dialog when Delete Recipe is clicked', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.contains(SELECTORS.recipeGrid.card, recipe.name).click()
        cy.get(SELECTORS.recipeModal.editBtn).click()
        cy.get(SELECTORS.recipeModal.deleteBtn).click()
        cy.get(SELECTORS.recipeModal.deleteConfirmBtn).should('be.visible')
      })
    })

    it('removes the card from the grid after confirming deletion', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.contains(SELECTORS.recipeGrid.card, recipe.name).click()
        cy.get(SELECTORS.recipeModal.editBtn).click()
        cy.get(SELECTORS.recipeModal.deleteBtn).click()
        cy.get(SELECTORS.recipeModal.deleteConfirmBtn).click()
        cy.contains(SELECTORS.recipeGrid.card, recipe.name).should('not.exist')
      })
    })

    it('keeps the recipe if deletion is canceled', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.contains(SELECTORS.recipeGrid.card, recipe.name).click()
        cy.get(SELECTORS.recipeModal.editBtn).click()
        cy.get(SELECTORS.recipeModal.deleteBtn).click()
        cy.get(SELECTORS.recipeModal.deleteCancelBtn).click()
        cy.contains(SELECTORS.recipeGrid.card, recipe.name).should('exist')
      })
    })
  })
})
