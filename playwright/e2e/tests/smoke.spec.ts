import { test, expect } from '../fixtures'

test('loads the Recipe Book page', async ({ recipeBookPage }) => {
  await recipeBookPage.goto()
  await expect(recipeBookPage.heading()).toBeVisible()
})
