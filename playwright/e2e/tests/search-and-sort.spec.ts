import { test, expect } from '../fixtures'
import { makeRecipe } from '../data/recipes'
import { SORT_LABELS } from '../data/constants'

// Pin createdAt so sort order is deterministic regardless of worker/sequence
const CHICKEN  = makeRecipe({ name: 'Chicken Stir Fry',       createdAt: 1704067200000 }) // oldest
const COOKIES  = makeRecipe({ name: 'Chocolate Chip Cookies',  createdAt: 1704153600000 })
const VEGETABLE = makeRecipe({ name: 'Vegetable Stir Fry',     createdAt: 1704240000000 }) // newest

test.use({ recipes: { items: [CHICKEN, COOKIES, VEGETABLE] } })

test.describe('Search and Sort', () => {
  test.beforeEach(async ({ recipeBookPage }) => {
    await recipeBookPage.goto()
  })

  // --- Search ---

  test('searching by exact name shows only the matching recipe', async ({ recipeBookPage, recipeGrid }) => {
    await recipeBookPage.searchInput().fill('Chocolate Chip Cookies')
    await expect(recipeGrid.cards()).toHaveCount(1)
    await expect(recipeGrid.cardNames()).toHaveText(['Chocolate Chip Cookies'])
  })

  test('searching shows multiple recipes when the term matches more than one name', async ({ recipeBookPage, recipeGrid }) => {
    await recipeBookPage.searchInput().fill('Stir Fry')
    await expect(recipeGrid.cards()).toHaveCount(2)
  })

  test('search is case-insensitive', async ({ recipeBookPage, recipeGrid }) => {
    await recipeBookPage.searchInput().fill('chocolate chip cookies')
    await expect(recipeGrid.cards()).toHaveCount(1)
    await expect(recipeGrid.cardNames()).toHaveText(['Chocolate Chip Cookies'])
  })

  test('searching shows an empty state when no recipes match the term', async ({ recipeBookPage, recipeGrid }) => {
    await recipeBookPage.searchInput().fill('Nonexistent Recipe')
    await expect(recipeGrid.emptyState()).toBeVisible()
    await expect(recipeGrid.cards()).toHaveCount(0)
  })

  test('clearing the search input restores all recipes', async ({ recipeBookPage, recipeGrid }) => {
    await recipeBookPage.searchInput().fill('Chocolate Chip Cookies')
    await expect(recipeGrid.cards()).toHaveCount(1)
    await recipeBookPage.searchInput().clear()
    await expect(recipeGrid.cards()).toHaveCount(3)
  })

  // --- Sort ---

  test('sorting displays the newest recipes first by default', async ({ recipeGrid }) => {
    await expect(recipeGrid.cardNames()).toHaveText([
      'Vegetable Stir Fry',
      'Chocolate Chip Cookies',
      'Chicken Stir Fry',
    ])
  })

  test('sorting displays the oldest recipes first when selected', async ({ recipeBookPage, recipeGrid }) => {
    await recipeBookPage.selectSort(SORT_LABELS.oldest)
    await expect(recipeGrid.cardNames()).toHaveText([
      'Chicken Stir Fry',
      'Chocolate Chip Cookies',
      'Vegetable Stir Fry',
    ])
  })

  test('sorting displays recipes in A-Z order when selected', async ({ recipeBookPage, recipeGrid }) => {
    await recipeBookPage.selectSort(SORT_LABELS.az)
    await expect(recipeGrid.cardNames()).toHaveText([
      'Chicken Stir Fry',
      'Chocolate Chip Cookies',
      'Vegetable Stir Fry',
    ])
  })

  test('sorting displays recipes in Z-A order when selected', async ({ recipeBookPage, recipeGrid }) => {
    await recipeBookPage.selectSort(SORT_LABELS.za)
    await expect(recipeGrid.cardNames()).toHaveText([
      'Vegetable Stir Fry',
      'Chocolate Chip Cookies',
      'Chicken Stir Fry',
    ])
  })

  test('the sort selection is saved to localStorage and persists on page reload', async ({ page, recipeBookPage, recipeGrid }) => {
    await recipeBookPage.selectSort(SORT_LABELS.oldest)
    await page.reload()
    await expect(recipeGrid.cardNames()).toHaveText([
      'Chicken Stir Fry',
      'Chocolate Chip Cookies',
      'Vegetable Stir Fry',
    ])
    await expect(recipeBookPage.sortSelect()).toHaveValue('oldest')
  })

  // --- Combined ---

  test('search and sort combine so the sort order applies to the search results', async ({ recipeBookPage, recipeGrid }) => {
    await recipeBookPage.searchInput().fill('Stir Fry')
    // Default sort is newest-first: Vegetable (newer) before Chicken (older)
    await expect(recipeGrid.cardNames()).toHaveText(['Vegetable Stir Fry', 'Chicken Stir Fry'])

    await recipeBookPage.selectSort(SORT_LABELS.az)
    await expect(recipeGrid.cardNames()).toHaveText(['Chicken Stir Fry', 'Vegetable Stir Fry'])
  })
})
