import { test, expect } from '../fixtures'
import { makeRecipe } from '../data/recipes'
import { UPDATED_RECIPE_NAME } from '../data/constants'

const RECIPE = makeRecipe({
  name: 'Chicken Stir Fry',
  link: 'https://example.com/chicken-stir-fry',
  image: 'https://example.com/chicken-stir-fry.jpg',
  tags: ['Quick', 'Asian'],
  notes: 'Asian-inspired chicken stir fry',
})

test.use({ recipes: [RECIPE] })

test.describe('Edit and Delete Recipes', () => {
  test.beforeEach(async ({ recipeBookPage }) => {
    await recipeBookPage.goto()
  })

  test.describe('Edit mode', () => {
    test('is accessible by clicking the edit button on a recipe card', async ({ recipeGrid, recipeModal }) => {
      await recipeGrid.cardByName(RECIPE.name).click()
      await recipeModal.editBtn().click()
      await expect(recipeModal.nameInput()).toBeVisible()
    })

    test('pre-populates all fields with the existing recipe data', async ({ recipeGrid, recipeModal }) => {
      await recipeGrid.cardByName(RECIPE.name).click()
      await recipeModal.editBtn().click()
      await expect(recipeModal.nameInput()).toHaveValue(RECIPE.name)
      await expect(recipeModal.linkInput()).toHaveValue(RECIPE.link!)
      await expect(recipeModal.imageInput()).toHaveValue(RECIPE.image!)
      await expect(recipeModal.notesInput()).toHaveValue(RECIPE.notes!)
      await expect(recipeModal.removeTagChips()).toHaveCount(RECIPE.tags!.length)
    })
  })

  test.describe('Editing a recipe', () => {
    test('updates the card in the grid after saving changes to the name', async ({ recipeGrid, recipeModal }) => {
      await recipeGrid.cardByName(RECIPE.name).click()
      await recipeModal.editBtn().click()
      await recipeModal.nameInput().clear()
      await recipeModal.nameInput().fill(UPDATED_RECIPE_NAME)
      await recipeModal.saveBtn().click()
      await expect(recipeGrid.cardByName(UPDATED_RECIPE_NAME)).toBeVisible()
    })

    test('shows the unsaved changes dialog when clicking cancel after making edits', async ({ recipeGrid, recipeModal }) => {
      await recipeGrid.cardByName(RECIPE.name).click()
      await recipeModal.editBtn().click()
      await recipeModal.nameInput().clear()
      await recipeModal.nameInput().fill(UPDATED_RECIPE_NAME)
      await recipeModal.cancelBtn().click()
      await expect(recipeModal.discardChangesDialog()).toBeVisible()
    })

    test('keeps the changes if closing the modal is canceled', async ({ recipeGrid, recipeModal }) => {
      await recipeGrid.cardByName(RECIPE.name).click()
      await recipeModal.editBtn().click()
      await recipeModal.nameInput().clear()
      await recipeModal.nameInput().fill(UPDATED_RECIPE_NAME)
      await recipeModal.cancelBtn().click()
      await recipeModal.keepEditing().click()
      await expect(recipeModal.nameInput()).toHaveValue(UPDATED_RECIPE_NAME)
    })

    test('discards the changes if closing the modal is confirmed', async ({ recipeGrid, recipeModal }) => {
      await recipeGrid.cardByName(RECIPE.name).click()
      await recipeModal.editBtn().click()
      await recipeModal.nameInput().clear()
      await recipeModal.nameInput().fill(UPDATED_RECIPE_NAME)
      await recipeModal.cancelBtn().click()
      await recipeModal.confirmDiscard().click()
      await expect(recipeModal.nameInput()).not.toBeVisible()
      await expect(recipeGrid.cardByName(RECIPE.name)).toBeVisible()
    })
  })

  test.describe('Deleting a recipe', () => {
    test('shows a delete confirmation dialog when Delete Recipe is clicked', async ({ recipeGrid, recipeModal }) => {
      await recipeGrid.cardByName(RECIPE.name).click()
      await recipeModal.editBtn().click()
      await recipeModal.deleteBtn().click()
      await expect(recipeModal.confirmDelete()).toBeVisible()
    })

    test('removes the card from the grid after the deletion is confirmed', async ({ recipeGrid, recipeModal }) => {
      await recipeGrid.cardByName(RECIPE.name).click()
      await recipeModal.editBtn().click()
      await recipeModal.deleteBtn().click()
      await recipeModal.confirmDelete().click()
      await expect(recipeGrid.cardByName(RECIPE.name)).not.toBeVisible()
    })

    test('keeps the recipe if the deletion is canceled', async ({ recipeGrid, recipeModal }) => {
      await recipeGrid.cardByName(RECIPE.name).click()
      await recipeModal.editBtn().click()
      await recipeModal.deleteBtn().click()
      await recipeModal.cancelDelete().click()
      await expect(recipeGrid.cardByName(RECIPE.name)).toBeVisible()
    })
  })
})
