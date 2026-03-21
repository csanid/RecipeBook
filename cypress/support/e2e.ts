import './commands'

// Clear localStorage before every test to ensure full test isolation
beforeEach(() => {
  cy.clearLocalStorage()
})
