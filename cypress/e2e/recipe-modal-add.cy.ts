import { SELECTORS } from '../support/selectors'

describe('Recipe Modal — Add Flow', () => {
  beforeEach(() => {
    cy.stubOpenGraphSuccess()
    cy.visit('/')
    cy.openAddRecipeModal()
  })

  context('Modal', () => {
    it('opens with all fields empty and placeholder image shown', () => {
      cy.get(SELECTORS.recipeModal.nameInput).should('have.value', '')
      cy.get(SELECTORS.recipeModal.linkInput).should('have.value', '')
      cy.get(SELECTORS.recipeModal.imageInput).should('have.value', '')
      cy.get(SELECTORS.recipeModal.notesInput).should('have.value', '')
      cy.get(SELECTORS.recipeModal.modalImagePlaceholder).should('be.visible')
      cy.get(SELECTORS.recipeModal.modalImage).should('not.exist')
    })
  })

  context('Saving recipes', () => {
    it('saves successfully with name only', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.get(SELECTORS.recipeModal.nameInput).type(recipe.name)
        cy.get(SELECTORS.recipeModal.saveBtn).click()
        cy.get(SELECTORS.recipeModal.nameInput).should('not.exist')
        cy.get(SELECTORS.recipeGrid.card).should('have.length', 1).and('contain', recipe.name)
      })
    })

    it('saves with name, link, image and tags', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.get(SELECTORS.recipeModal.nameInput).type(recipe.name)
        cy.get(SELECTORS.recipeModal.linkInput).type(recipe.link)
        cy.get(SELECTORS.recipeModal.imageInput).type(recipe.image)
        cy.get(SELECTORS.recipeModal.tagInput).type(`${recipe.tags[0]}{enter}`)
        cy.get(SELECTORS.recipeModal.saveBtn).click()
        cy.get(SELECTORS.recipeGrid.card).should('contain', recipe.name)
      })
    })

    it('does not save when name is empty and shows a validation message', () => {
      cy.get(SELECTORS.recipeModal.saveBtn).click()
      cy.get(SELECTORS.recipeModal.ogError).should('be.visible').and('contain', 'required')
    })
  })

  context('OpenGraph autofill', () => {
    it('shows a spinner while fetching and autofills name and image on success', () => {
      cy.intercept('GET', '**/opengraph.io/api/**', {
        fixture: 'opengraph.json',
        delay: 300,
      }).as('ogDelayed')
      cy.fixture('recipes').then(([recipe]) => {
        cy.get(SELECTORS.recipeModal.linkInput).type(recipe.link)
        cy.get(SELECTORS.recipeModal.fetchOgBtn).click()
        cy.get(SELECTORS.recipeModal.fetchOgBtn).find('[class*="animate-spin"]').should('exist')
        cy.wait('@ogDelayed')
        cy.get(SELECTORS.recipeModal.fetchOgBtn).find('[class*="animate-spin"]').should('not.exist')
        cy.fixture('opengraph').then((og) => {
          cy.get(SELECTORS.recipeModal.nameInput).should('have.value', og.hybridGraph.title)
        })
      })
    })

    it('shows the stubbed image in the modal image area after successful fetch', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.get(SELECTORS.recipeModal.linkInput).type(recipe.link)
        cy.get(SELECTORS.recipeModal.fetchOgBtn).click()
        cy.wait('@ogSuccess')
        cy.fixture('opengraph').then((og) => {
          cy.get(SELECTORS.recipeModal.modalImage).should('have.attr', 'src', og.hybridGraph.image)
        })
      })
    })

    it('shows an error message and keeps placeholder image when API returns 500', () => {
      cy.stubOpenGraphError()
      cy.fixture('recipes').then(([recipe]) => {
        cy.get(SELECTORS.recipeModal.linkInput).type(recipe.link)
        cy.get(SELECTORS.recipeModal.fetchOgBtn).click()
        cy.wait('@ogError')
        cy.get(SELECTORS.recipeModal.ogError).should('be.visible')
        cy.get(SELECTORS.recipeModal.modalImagePlaceholder).should('exist')
        cy.get(SELECTORS.recipeModal.modalImage).should('not.exist')
      })
    })

    it('allows manual name entry and saving when fetch succeeds but returns no title', () => {
      cy.intercept('GET', '**/opengraph.io/api/**', {
        body: { hybridGraph: { image: 'https://example.com/og-image.jpg' } },
      }).as('ogNoTitle')
      cy.fixture('recipes').then(([recipe]) => {
        cy.get(SELECTORS.recipeModal.linkInput).type(recipe.link)
        cy.get(SELECTORS.recipeModal.fetchOgBtn).click()
        cy.wait('@ogNoTitle')
        cy.get(SELECTORS.recipeModal.nameInput).should('have.value', '')
        cy.get(SELECTORS.recipeModal.nameInput).type(recipe.name)
        cy.get(SELECTORS.recipeModal.saveBtn).click()
        cy.get(SELECTORS.recipeGrid.card).should('contain', recipe.name)
      })
    })
  })

  context('Tag interactions', () => {
    beforeEach(() => {
      cy.fixture('tags').then((tags: string[]) => cy.seedTags(tags))
      cy.reload()
      cy.openAddRecipeModal()
    })

    it('adds a tag chip when a tag is typed and Enter is pressed', () => {
      cy.fixture('tags').then(([firstTag]: string[]) => {
        cy.get(SELECTORS.recipeModal.tagInput).type(`${firstTag}{enter}`)
        cy.get(SELECTORS.recipeModal.removeTagChip).should('have.length', 1)
        cy.contains(firstTag).should('be.visible')
      })
    })

    it('removes a tag chip when the X button is clicked', () => {
      cy.fixture('tags').then(([firstTag]: string[]) => {
        cy.contains(`+ ${firstTag}`).click()
        cy.get(SELECTORS.recipeModal.removeTagChip).should('have.length', 1)
        cy.get(SELECTORS.recipeModal.removeTagChip).click()
        cy.get(SELECTORS.recipeModal.removeTagChip).should('not.exist')
        cy.contains(`+ ${firstTag}`).should('be.visible')
      })
    })

    it('shows duplicate error when adding a tag already selected for this recipe', () => {
      cy.fixture('tags').then(([firstTag]: string[]) => {
        cy.get(SELECTORS.recipeModal.tagInput).type(`${firstTag}{enter}`)
        cy.get(SELECTORS.recipeModal.tagInput).type(`${firstTag}{enter}`)
        cy.get(SELECTORS.recipeModal.tagDuplicateError).should('be.visible').and('contain', 'exists')
      })
    })
  })

  context('Unsaved changes guard', () => {
    it('shows a confirmation dialog when closing with dirty fields', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.get(SELECTORS.recipeModal.nameInput).type(recipe.name)
        cy.get(SELECTORS.recipeModal.cancelBtn).click()
        cy.get(SELECTORS.recipeModal.unsavedChangesConfirmDiscard).should('be.visible')
      })
    })

    it('closes the modal without saving when discard is confirmed', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.get(SELECTORS.recipeModal.nameInput).type(recipe.name)
        cy.get(SELECTORS.recipeModal.cancelBtn).click()
        cy.get(SELECTORS.recipeModal.unsavedChangesConfirmDiscard).click()
        cy.get(SELECTORS.recipeModal.nameInput).should('not.exist')
        cy.get(SELECTORS.recipeGrid.card).should('not.exist')
      })
    })

    it('keeps the modal open with fields intact when discard is canceled', () => {
      cy.fixture('recipes').then(([recipe]) => {
        cy.get(SELECTORS.recipeModal.nameInput).type(recipe.name)
        cy.get(SELECTORS.recipeModal.cancelBtn).click()
        cy.get(SELECTORS.recipeModal.unsavedChangesCancelDiscard).click()
        cy.get(SELECTORS.recipeModal.nameInput).should('have.value', recipe.name)
      })
    })
  })

  context('Validation', () => {
    it('shows an error for an invalid URL in the link field', () => {
      cy.get(SELECTORS.recipeModal.linkInput).type('not-a-url')
      cy.get(SELECTORS.recipeModal.linkInput).blur()
      cy.get(SELECTORS.recipeModal.linkError).should('be.visible')
    })

    it('does not allow typing more than 80 characters in the name field', () => {
      cy.get(SELECTORS.recipeModal.nameInput).type('a'.repeat(81))
      cy.get(SELECTORS.recipeModal.nameInput).should('have.value', 'a'.repeat(80))
    })
  })
})
