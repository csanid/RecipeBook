import { test, expect } from '../fixtures'
import { makeRecipe } from '../data/recipes'

const TAG_A = 'Quick'
const TAG_B = 'Vegetarian'

const RECIPE_WITH_BOTH_TAGS = makeRecipe({ name: 'Chicken Stir Fry', tags: [TAG_A, TAG_B] })
const RECIPE_WITH_ONE_TAG   = makeRecipe({ name: 'Vegetable Curry',  tags: [TAG_B] })

test.describe('Tag Management', () => {
  test.beforeEach(async ({ recipeBookPage }) => {
    await recipeBookPage.goto()
  })

  test.describe('Creating tags', () => {
    test('adding a tag when none exist creates it and persists it to localStorage', async ({ page, tagManager }) => {
      await tagManager.editBtn().click()
      await tagManager.addTag(TAG_A)
      await expect(tagManager.pillByName(TAG_A)).toBeVisible()
      const stored = await page.evaluate(() => localStorage.getItem('recipebook_tags'))
      expect(JSON.parse(stored!)).toContain(TAG_A)
    })

    test('adding a second tag displays both tags correctly', async ({ tagManager }) => {
      await tagManager.editBtn().click()
      await tagManager.addTag(TAG_A)
      await tagManager.addTag(TAG_B)
      await tagManager.editBtn().click()
      await expect(tagManager.filterPills()).toHaveCount(2)
      await expect(tagManager.filterPills()).toContainText([TAG_A, TAG_B])
    })

    test('a duplicate error shows when adding a tag that already exists', async ({ tagManager }) => {
      await tagManager.editBtn().click()
      await tagManager.addTag(TAG_A)
      await tagManager.addTag(TAG_A)
      await expect(tagManager.tagError()).toContainText('already exists')
    })

    test('an empty error shows when submitting a blank tag', async ({ tagManager }) => {
      await tagManager.editBtn().click()
      await tagManager.tagInput().press('Enter')
      await expect(tagManager.tagError()).toContainText("can't be empty")
    })

    test('an empty error shows when submitting a whitespace-only tag', async ({ tagManager }) => {
      await tagManager.editBtn().click()
      await tagManager.tagInput().fill('   ')
      await tagManager.tagInput().press('Enter')
      await expect(tagManager.tagError()).toContainText("can't be empty")
    })

    test('the tag input does not allow typing more than 40 characters', async ({ tagManager }) => {
      await tagManager.editBtn().click()
      await tagManager.tagInput().pressSequentially('a'.repeat(41))
      await expect(tagManager.tagInput()).toHaveValue('a'.repeat(40))
    })
  })

  test.describe('Edit mode', () => {
    test.use({ tags: [TAG_A, TAG_B] })

    test('a delete button shows on each tag when edit mode is entered', async ({ tagManager }) => {
      await expect(tagManager.deleteButtons()).toHaveCount(0)
      await tagManager.editBtn().click()
      await expect(tagManager.deleteButtons()).toHaveCount(2)
    })

    test('deleting a tag shows a confirmation dialog', async ({ tagManager }) => {
      await tagManager.editBtn().click()
      await tagManager.deleteButtonFor(TAG_A).click()
      await expect(tagManager.deleteTagDialogConfirm()).toBeVisible()
    })

    test('a tag is deleted after the action is confirmed', async ({ tagManager }) => {
      await tagManager.editBtn().click()
      await tagManager.deleteButtonFor(TAG_A).click()
      await tagManager.deleteTagDialogConfirm().click()
      await expect(tagManager.pills()).toHaveCount(1)
      await expect(tagManager.pillByName(TAG_A)).not.toBeVisible()
    })

    test('a tag is kept if the deletion is canceled', async ({ tagManager }) => {
      await tagManager.editBtn().click()
      await tagManager.deleteButtonFor(TAG_A).click()
      await tagManager.deleteTagDialogCancel().click()
      await expect(tagManager.pills()).toHaveCount(2)
    })
  })

  test.describe('Deleting tags from recipes', () => {
    test.use({
      recipes: { items: [RECIPE_WITH_BOTH_TAGS, RECIPE_WITH_ONE_TAG] },
      tags: [TAG_A, TAG_B],
    })

    test('deleting a tag that is used in recipes removes it from all associated recipes', async ({ page, tagManager, recipeGrid }) => {
      await tagManager.editBtn().click()
      await tagManager.deleteButtonFor(TAG_A).click()
      await tagManager.deleteTagDialogConfirm().click()

      const chickenCard = recipeGrid.cardByName(RECIPE_WITH_BOTH_TAGS.name)
      await expect(recipeGrid.cardTags(chickenCard)).not.toContainText(TAG_A)

      const stored = await page.evaluate(() => localStorage.getItem('recipebook_recipes'))
      const recipes = JSON.parse(stored!) as Array<{ name: string; tags?: string[] }>
      const chicken = recipes.find(r => r.name === RECIPE_WITH_BOTH_TAGS.name)!
      expect(chicken.tags).not.toContain(TAG_A)
    })
  })
})
