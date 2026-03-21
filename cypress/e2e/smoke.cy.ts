import { SELECTORS } from '../support/selectors'

describe('App', () => {
  it('loads the Recipe Book page', () => {
    cy.visit('/')
    cy.get(SELECTORS.header.title).should('contain', 'My Recipe Book')
  })
})
