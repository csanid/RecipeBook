import { SELECTORS } from '../support/selectors'
import { FIXTURE_TAGS } from '../support/constants'

describe('Tag Filtering', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.fixture('recipes').then((recipes) => {
      const recipeTags: string[] = [...new Set(recipes.flatMap((r: { tags?: string[] }) => r.tags ?? []))]
      cy.seedTags([...recipeTags, FIXTURE_TAGS.first])
      cy.seedRecipes(recipes)
    })
    cy.reload()
  })

  context('Single tag filter', () => {
    it('shows only recipes that have the selected tag', () => {
      cy.contains(SELECTORS.tagManager.filterPill, 'Quick').click()
      cy.get(SELECTORS.recipeGrid.card).should('have.length', 2)
      cy.contains(SELECTORS.recipeGrid.card, 'Chicken Stir Fry').should('exist')
      cy.contains(SELECTORS.recipeGrid.card, 'Vegetable Stir Fry').should('exist')
      cy.contains(SELECTORS.recipeGrid.card, 'Chocolate Chip Cookies').should('not.exist')
    })

    it('shows all recipes again when the tag is deselected', () => {
      cy.contains(SELECTORS.tagManager.filterPill, 'Quick').click()
      cy.get(SELECTORS.recipeGrid.card).should('have.length', 2)
      cy.contains(SELECTORS.tagManager.filterPill, 'Quick').click()
      cy.get(SELECTORS.recipeGrid.card).should('have.length', 3)
    })
  })

  context('Multiple tag filters (AND logic)', () => {
    it('shows only recipes that have ALL selected tags', () => {
      cy.contains(SELECTORS.tagManager.filterPill, 'Quick').click()
      cy.get(SELECTORS.recipeGrid.card).should('have.length', 2)
      cy.contains(SELECTORS.tagManager.filterPill, 'Asian').click()
      cy.get(SELECTORS.recipeGrid.card).should('have.length', 1)
      cy.contains(SELECTORS.recipeGrid.card, 'Chicken Stir Fry').should('exist')
    })

    it('shows zero results when selected tags match no single recipe', () => {
      cy.contains(SELECTORS.tagManager.filterPill, 'Quick').click()
      cy.contains(SELECTORS.tagManager.filterPill, 'Baking').click()
      cy.get(SELECTORS.recipeGrid.emptyState).should('be.visible')
      cy.get(SELECTORS.recipeGrid.card).should('not.exist')
    })
  })

  context('Edge cases', () => {
    it('shows zero results when a tag exists but no current recipe has it', () => {
      cy.contains(SELECTORS.tagManager.filterPill, FIXTURE_TAGS.first).click()
      cy.get(SELECTORS.recipeGrid.emptyState).should('be.visible')
      cy.get(SELECTORS.recipeGrid.card).should('not.exist')
    })
  })
})
