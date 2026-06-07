import { test, expect } from '../fixtures'
import { makeRecipe } from '../data/recipes'

const QUICK = 'Quick'
const VEGETARIAN = 'Vegetarian'
const ASIAN = 'Asian'
const UNUSED = 'Italian'

// CHICKEN: Quick + Asian  |  VEGETABLE: Quick + Vegetarian  |  NOODLES: Asian + Vegetarian
// Quick∩Asian = {CHICKEN}, so AND-filter tests produce a strict subset
// Quick∩Asian∩Vegetarian = {} — no single recipe has all three
const CHICKEN  = makeRecipe({ name: 'Chicken Stir Fry',   createdAt: 1704067200000, tags: [QUICK, ASIAN] })
const VEGETABLE = makeRecipe({ name: 'Vegetable Stir Fry', createdAt: 1704153600000, tags: [QUICK, VEGETARIAN] })
const NOODLES  = makeRecipe({ name: 'Asian Noodles',       createdAt: 1704240000000, tags: [ASIAN, VEGETARIAN] })

test.use({
  recipes: { items: [CHICKEN, VEGETABLE, NOODLES] },
  tags: [QUICK, VEGETARIAN, ASIAN, UNUSED],
})

test.describe('Tag Filtering', () => {
  test.beforeEach(async ({ recipeBookPage }) => {
    await recipeBookPage.goto()
  })

  test('a single tag filter shows only recipes that have the selected tag', async ({ recipeGrid, tagManager }) => {
    await tagManager.filterPillByName(QUICK).click()
    await expect(recipeGrid.cards()).toHaveCount(2)
    await expect(recipeGrid.cardByName(CHICKEN.name)).toBeVisible()
    await expect(recipeGrid.cardByName(VEGETABLE.name)).toBeVisible()
  })

  test('deselecting the tag shows all recipes again', async ({ recipeGrid, tagManager }) => {
    await tagManager.filterPillByName(QUICK).click()
    await expect(recipeGrid.cards()).toHaveCount(2)
    await tagManager.filterPillByName(QUICK).click()
    await expect(recipeGrid.cards()).toHaveCount(3)
  })

  test('multiple tag filters show only recipes that have all the selected tags', async ({ recipeGrid, tagManager }) => {
    await tagManager.filterPillByName(QUICK).click()
    await tagManager.filterPillByName(ASIAN).click()
    await expect(recipeGrid.cards()).toHaveCount(1)
    await expect(recipeGrid.cardByName(CHICKEN.name)).toBeVisible()
  })

  test('multiple tag filters show zero results when the selected tags match no single recipe', async ({ recipeGrid, tagManager }) => {
    await tagManager.filterPillByName(QUICK).click()
    await tagManager.filterPillByName(ASIAN).click()
    await tagManager.filterPillByName(VEGETARIAN).click()
    await expect(recipeGrid.emptyState()).toBeVisible()
    await expect(recipeGrid.cards()).toHaveCount(0)
  })

  test('a filter shows zero results when a tag exists but no current recipe has it', async ({ recipeGrid, tagManager }) => {
    await tagManager.filterPillByName(UNUSED).click()
    await expect(recipeGrid.emptyState()).toBeVisible()
    await expect(recipeGrid.cards()).toHaveCount(0)
  })
})
