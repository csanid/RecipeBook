import { SELECTORS } from '../support/selectors'

describe('Recipe Grid', () => {
  context('Empty state', () => {
    it('shows the empty state when no recipes exist', () => {
      cy.visit('/')
      cy.get(SELECTORS.recipeGrid.emptyState).should('be.visible')
      cy.get(SELECTORS.recipeGrid.card).should('not.exist')
    })
  })

  context('Card display', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.fixture('recipes').then((recipes) => cy.seedRecipes(recipes))
      cy.reload()
    })

    it('shows the correct name and tags on each card', () => {
      cy.fixture('recipes').then((recipes) => {
        cy.get(SELECTORS.recipeGrid.card).should('have.length', recipes.length)
        recipes.forEach((recipe: { name: string; tags: string[] }) => {
          cy.contains(SELECTORS.recipeGrid.card, recipe.name).within(() => {
            cy.get(SELECTORS.recipeGrid.cardName).should('contain', recipe.name)
            recipe.tags.slice(0, 3).forEach((tag) => {
              cy.get(SELECTORS.recipeGrid.cardTag).should('contain', tag)
            })
          })
        })
      })
    })

    it('shows the recipe image when one exists', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.contains(SELECTORS.recipeGrid.card, recipe.name).within(() => {
          cy.get(SELECTORS.recipeGrid.cardImage)
            .should('exist')
            .and('have.attr', 'src', recipe.image)
        })
      })
    })

    it('shows a placeholder when the recipe has no image', () => {
      cy.contains(SELECTORS.recipeGrid.card, 'Vegetable Stir Fry').within(() => {
        cy.get(SELECTORS.recipeGrid.cardImagePlaceholder).should('exist')
        cy.get(SELECTORS.recipeGrid.cardImage).should('not.exist')
      })
    })
  })

  context('Card interactions', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.fixture('recipes').then((recipes) => cy.seedRecipes(recipes))
      cy.reload()
    })

    it('shows the recipe link in the modal after clicking a card', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.contains(SELECTORS.recipeGrid.card, recipe.name).click()
        cy.get(SELECTORS.recipeModal.recipeLink).should('have.attr', 'href', recipe.link)
      })
    })

    it('closes the modal when clicking on close', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.contains(SELECTORS.recipeGrid.card, recipe.name).click()
        cy.get(SELECTORS.recipeModal.editBtn).should('be.visible')
        cy.get(SELECTORS.recipeModal.viewCloseBtn).click()
        cy.get(SELECTORS.recipeModal.editBtn).should('not.exist')
      })
    })
  })
})
