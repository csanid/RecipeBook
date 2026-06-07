import { test, expect } from '../fixtures'
import { makeRecipe } from '../data/recipes'

const RECIPE_WITH_IMAGE = makeRecipe({
  name: 'Chicken Stir Fry',
  link: 'https://example.com/chicken-stir-fry',
  image: 'https://example.com/chicken-stir-fry.jpg',
  tags: ['Quick', 'Asian'],
})

const RECIPE_WITHOUT_IMAGE = makeRecipe({
  name: 'Vegetable Stir Fry',
  image: '',
  tags: ['Vegetarian', 'Quick'],
})

test.describe('Recipe Grid', () => {
  test.beforeEach(async ({ recipeBookPage }) => {
    await recipeBookPage.goto()
  })

  test.describe('Empty state', () => {
    test('shows the empty state when no recipes exist', async ({ recipeGrid }) => {
      await expect(recipeGrid.emptyState()).toBeVisible()
      await expect(recipeGrid.cards()).toHaveCount(0)
    })
  })

  test.describe('Card display', () => {
    test.use({ recipes: { items: [RECIPE_WITH_IMAGE, RECIPE_WITHOUT_IMAGE] } })

    test('each card shows the correct name and tags', async ({ recipeGrid }) => {
      await expect(recipeGrid.cards()).toHaveCount(2)

      const chickenCard = recipeGrid.cardByName(RECIPE_WITH_IMAGE.name)
      await expect(chickenCard).toContainText(RECIPE_WITH_IMAGE.name)
      for (const tag of RECIPE_WITH_IMAGE.tags!) {
        await expect(chickenCard).toContainText(tag)
      }

      const vegetableCard = recipeGrid.cardByName(RECIPE_WITHOUT_IMAGE.name)
      await expect(vegetableCard).toContainText(RECIPE_WITHOUT_IMAGE.name)
      for (const tag of RECIPE_WITHOUT_IMAGE.tags!) {
        await expect(vegetableCard).toContainText(tag)
      }
    })

    test('a card shows the recipe image when one exists', async ({ recipeGrid }) => {
      const card = recipeGrid.cardByName(RECIPE_WITH_IMAGE.name)
      await expect(recipeGrid.cardImage(card)).toHaveAttribute('src', RECIPE_WITH_IMAGE.image!)
    })

    test('a card shows a placeholder image when the recipe has no image', async ({ recipeGrid }) => {
      const card = recipeGrid.cardByName(RECIPE_WITHOUT_IMAGE.name)
      await expect(recipeGrid.cardImagePlaceholder(card)).toBeVisible()
      await expect(recipeGrid.cardImage(card)).not.toBeVisible()
    })
  })

  test.describe('Card interactions', () => {
    test.use({ recipes: { items: [RECIPE_WITH_IMAGE, RECIPE_WITHOUT_IMAGE] } })

    test('clicking a card shows the recipe link in the modal', async ({ recipeGrid, recipeModal }) => {
      await recipeGrid.cardByName(RECIPE_WITH_IMAGE.name).click()
      await expect(recipeModal.recipeLink()).toHaveAttribute('href', RECIPE_WITH_IMAGE.link!)
    })

    test('the modal closes when the close button is clicked', async ({ recipeGrid, recipeModal }) => {
      await recipeGrid.cardByName(RECIPE_WITH_IMAGE.name).click()
      await expect(recipeModal.editBtn()).toBeVisible()
      await recipeModal.viewCloseBtn().click()
      await expect(recipeModal.editBtn()).not.toBeVisible()
    })
  })
})
