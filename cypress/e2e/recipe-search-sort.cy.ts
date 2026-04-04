import { SELECTORS } from '../support/selectors'
import { SORT_LABELS } from '../support/constants'

describe('Search and sorting', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.fixture('recipes').then((recipes) => cy.seedRecipes(recipes))
    cy.reload()
  })

  context('Search', () => {
    it('shows only the matching recipe when searching by exact name', () => {
      cy.get(SELECTORS.actionBar.searchBar).type('Chocolate Chip Cookies')
      cy.get(SELECTORS.recipeGrid.card).should('have.length', 1)
      cy.get(SELECTORS.recipeGrid.cardName).should('contain', 'Chocolate Chip Cookies')
    })

    it('shows multiple recipes when the search term matches more than one name', () => {
      cy.get(SELECTORS.actionBar.searchBar).type('Stir Fry')
      cy.get(SELECTORS.recipeGrid.card).should('have.length', 2)
      cy.getCardNames().should('include.members', ['Chicken Stir Fry', 'Vegetable Stir Fry'])
    })

    it('is case-insensitive', () => {
      cy.get(SELECTORS.actionBar.searchBar).type('chocolate chip cookies')
      cy.get(SELECTORS.recipeGrid.card).should('have.length', 1)
      cy.get(SELECTORS.recipeGrid.cardName).should('contain', 'Chocolate Chip Cookies')
    })

    it('shows an empty state when no recipes match the search term', () => {
      cy.get(SELECTORS.actionBar.searchBar).type('Nonexistent Recipe')
      cy.get(SELECTORS.recipeGrid.emptyState).should('be.visible').and('contain', 'No recipes')
      cy.get(SELECTORS.recipeGrid.card).should('not.exist')
    })

    it('restores all recipes when the search input is cleared', () => {
      cy.get(SELECTORS.actionBar.searchBar).type('Chocolate Chip Cookies')
      cy.get(SELECTORS.recipeGrid.card).should('have.length', 1)
      cy.get(SELECTORS.actionBar.searchBar).clear()
      cy.get(SELECTORS.recipeGrid.card).should('have.length', 3)
    })
  })

  context('Sorting', () => {
    it('displays newest recipes first by default', () => {
      cy.getCardNames().should('deep.equal', [
        'Vegetable Stir Fry',
        'Chocolate Chip Cookies',
        'Chicken Stir Fry',
      ])
    })

    it('displays oldest recipes first when selected', () => {
      cy.selectSortOption(SORT_LABELS.oldest)
      cy.getCardNames().should('deep.equal', [
        'Chicken Stir Fry',
        'Chocolate Chip Cookies',
        'Vegetable Stir Fry',
      ])
    })

    it('displays recipes in A-Z order when selected', () => {
      cy.selectSortOption(SORT_LABELS.az)
      cy.getCardNames().should('deep.equal', [
        'Chicken Stir Fry',
        'Chocolate Chip Cookies',
        'Vegetable Stir Fry',
      ])
    })

    it('displays recipes in Z-A order when selected', () => {
      cy.selectSortOption(SORT_LABELS.za)
      cy.getCardNames().should('deep.equal', [
        'Vegetable Stir Fry',
        'Chocolate Chip Cookies',
        'Chicken Stir Fry',
      ])
    })

    it('selection is saved to localStorage and persists on page reload', () => {
      cy.selectSortOption(SORT_LABELS.oldest)
      cy.reload()
      cy.get(SELECTORS.recipeGrid.cardName).first().should('contain', 'Chicken Stir Fry')
    })
  })

  context('Search and sort combined', () => {
    it('applies sort order to search results', () => {
      cy.get(SELECTORS.actionBar.searchBar).type('Stir Fry')
      cy.get(SELECTORS.recipeGrid.card).should('have.length', 2)
      cy.get(SELECTORS.recipeGrid.cardName).first().should('contain', 'Vegetable Stir Fry')

      cy.selectSortOption(SORT_LABELS.az)
      cy.get(SELECTORS.recipeGrid.cardName).first().should('contain', 'Chicken Stir Fry')
      cy.get(SELECTORS.recipeGrid.cardName).last().should('contain', 'Vegetable Stir Fry')
    })
  })
})
