import { SELECTORS } from '../support/selectors'

describe('Tag Management', () => {
  context('Adding tags', () => {
    beforeEach(() => {
      cy.visit('/')
    })

    it('adds a new tag when none exist and persists it to localStorage', () => {
      cy.get(SELECTORS.tagManager.tagEditBtn).click()
      cy.get(SELECTORS.tagManager.tagInput).type('Pasta{enter}')
      cy.get(SELECTORS.tagManager.pill).should('have.length', 1).and('contain', 'Pasta')
      cy.window().then((win) => {
        const tags = JSON.parse(win.localStorage.getItem('recipebook_tags') ?? '[]')
        expect(tags).to.include('Pasta')
      })
    })

    it('adds a second tag and displays both correctly', () => {
      cy.get(SELECTORS.tagManager.tagEditBtn).click()
      cy.get(SELECTORS.tagManager.tagInput).type('Pasta{enter}')
      cy.get(SELECTORS.tagManager.tagInput).type('Salads{enter}')
      cy.get(SELECTORS.tagManager.pill).should('have.length', 2)
      cy.get(SELECTORS.tagManager.pill).first().should('contain', 'Pasta')
      cy.get(SELECTORS.tagManager.pill).last().should('contain', 'Salads')
    })
  })

  context('Edit mode', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.fixture('tags').then((tags: string[]) => cy.seedTags(tags))
      cy.reload()
    })

    it('shows a delete button on each tag when edit mode is entered', () => {
      cy.get(SELECTORS.tagManager.tagEditBtn).click()
      cy.get(SELECTORS.tagManager.tagDeleteBtn).should('have.length', 2)
    })
  })

  context('Deleting tags', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.fixture('tags').then((tags: string[]) => cy.seedTags(tags))
      cy.reload()
      cy.get(SELECTORS.tagManager.tagEditBtn).click()
    })

    it('shows a confirmation dialog when deleting any tag', () => {
      cy.get(SELECTORS.tagManager.tagDeleteBtn).first().click()
      cy.get(SELECTORS.tagManager.deleteTagDialogConfirm).should('be.visible')
    })

    it('deletes the tag after confirming the action', () => {
      cy.get(SELECTORS.tagManager.tagDeleteBtn).first().click()
      cy.get(SELECTORS.tagManager.deleteTagDialogConfirm).click()
      cy.get(SELECTORS.tagManager.pill).should('have.length', 1)
    })

    it('keeps the tag if deletion is canceled', () => {
      cy.get(SELECTORS.tagManager.tagDeleteBtn).first().click()
      cy.get(SELECTORS.tagManager.deleteTagDialogCancel).click()
      cy.get(SELECTORS.tagManager.pill).should('have.length', 2)
    })
  })

  context('Validation', () => {
    beforeEach(() => {
      cy.visit('/')
      cy.fixture('tags').then((tags: string[]) => cy.seedTags(tags))
      cy.reload()
      cy.get(SELECTORS.tagManager.tagEditBtn).click()
    })

    it('shows a duplicate error when adding a tag that already exists', () => {
      cy.get(SELECTORS.tagManager.tagInput).type('Air fryer{enter}')
      cy.get(SELECTORS.tagManager.tagError).should('contain', 'exists')
    })

    it('shows an empty error when submitting a blank tag', () => {
      cy.get(SELECTORS.tagManager.tagInput).type('{enter}')
      cy.get(SELECTORS.tagManager.tagError).should('contain', 'empty')
    })

    it('shows an empty error when submitting a whitespace-only tag', () => {
      cy.get(SELECTORS.tagManager.tagInput).type('   {enter}')
      cy.get(SELECTORS.tagManager.tagError).should('contain', 'empty')
    })

    it('does not allow typing more than 40 characters in the tag input', () => {
      cy.get(SELECTORS.tagManager.tagInput).type('a'.repeat(41))
      cy.get(SELECTORS.tagManager.tagInput).should('have.value', 'a'.repeat(40))
    })
  })
})
