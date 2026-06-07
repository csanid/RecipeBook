import { test, expect } from '../fixtures'
import { FIXTURE_TAGS } from '../data/constants'
import { OG_SUCCESS } from '../data/opengraph'

const RECIPE_NAME = 'Chicken Stir Fry'
const RECIPE_LINK = 'https://example.com/chicken-stir-fry'
const RECIPE_IMAGE = 'https://example.com/chicken-stir-fry.jpg'

test.describe('Recipe Add', () => {
  test.beforeEach(async ({ recipeBookPage }) => {
    await recipeBookPage.goto()
    await recipeBookPage.openAddModal()
  })

  test('the modal opens with all fields empty and the placeholder image shown', async ({ recipeModal }) => {
    await expect(recipeModal.nameInput()).toHaveValue('')
    await expect(recipeModal.linkInput()).toHaveValue('')
    await expect(recipeModal.imageInput()).toHaveValue('')
    await expect(recipeModal.notesInput()).toHaveValue('')
    await expect(recipeModal.imagePlaceholder()).toBeVisible()
    await expect(recipeModal.image()).not.toBeVisible()
  })

  test('a recipe saves successfully with the name only', async ({ recipeModal, recipeGrid }) => {
    await recipeModal.nameInput().fill(RECIPE_NAME)
    await recipeModal.saveBtn().click()
    await expect(recipeModal.nameInput()).not.toBeVisible()
    await expect(recipeGrid.cards()).toHaveCount(1)
    await expect(recipeGrid.cardByName(RECIPE_NAME)).toBeVisible()
  })

  test('a recipe saves with name, link, image and tags', async ({ recipeModal, recipeGrid }) => {
    await recipeModal.nameInput().fill(RECIPE_NAME)
    await recipeModal.linkInput().fill(RECIPE_LINK)
    await recipeModal.imageInput().fill(RECIPE_IMAGE)
    await recipeModal.tagInput().fill(FIXTURE_TAGS.first)
    await recipeModal.tagInput().press('Enter')
    await recipeModal.saveBtn().click()
    await expect(recipeGrid.cardByName(RECIPE_NAME)).toBeVisible()
  })

  test('a recipe cannot be saved if the name is empty', async ({ recipeModal }) => {
    await recipeModal.saveBtn().click()
    await expect(recipeModal.ogError()).toContainText('required')
  })

  test.describe('OpenGraph autofill', () => {
    test('shows a spinner while fetching', async ({ og, recipeModal }) => {
      await og.successDelayed(800)
      await recipeModal.linkInput().fill(RECIPE_LINK)
      await recipeModal.fetchOgBtn().click()
      await expect(recipeModal.fetchOgSpinner()).toBeVisible()
      await expect(recipeModal.fetchOgSpinner()).not.toBeVisible()
    })

    test('fills in the name and image on a successful fetch', async ({ og, recipeModal }) => {
      await og.success()
      await recipeModal.linkInput().fill(RECIPE_LINK)
      await recipeModal.fetchOgBtn().click()
      await expect(recipeModal.nameInput()).toHaveValue(OG_SUCCESS.hybridGraph.title)
      await expect(recipeModal.image()).toHaveAttribute('src', OG_SUCCESS.hybridGraph.image)
    })

    test('shows an error message and keeps the placeholder image when the fetch fails', async ({ og, recipeModal }) => {
      await og.error()
      await recipeModal.linkInput().fill(RECIPE_LINK)
      await recipeModal.fetchOgBtn().click()
      await expect(recipeModal.ogError()).toBeVisible()
      await expect(recipeModal.imagePlaceholder()).toBeVisible()
      await expect(recipeModal.image()).not.toBeVisible()
    })

    test('allows manual name entry when the fetch returns no title', async ({ og, recipeModal, recipeGrid }) => {
      await og.noTitle()
      await recipeModal.linkInput().fill(RECIPE_LINK)
      await recipeModal.fetchOgBtn().click()
      await expect(recipeModal.nameInput()).toHaveValue('')
      await recipeModal.nameInput().fill(RECIPE_NAME)
      await recipeModal.saveBtn().click()
      await expect(recipeGrid.cardByName(RECIPE_NAME)).toBeVisible()
    })
  })

  test.describe('Tag interactions', () => {
    test.use({ tags: [FIXTURE_TAGS.first] })

    test('a tag chip is added successfully', async ({ recipeModal }) => {
      await recipeModal.tagInput().fill(FIXTURE_TAGS.first)
      await recipeModal.tagInput().press('Enter')
      await expect(recipeModal.removeTagChips()).toHaveCount(1)
    })

    test('a tag chip is removed successfully', async ({ recipeModal }) => {
      await recipeModal.tagSuggestion(FIXTURE_TAGS.first).click()
      await expect(recipeModal.removeTagChips()).toHaveCount(1)
      await recipeModal.removeTagChips().click()
      await expect(recipeModal.removeTagChips()).not.toBeVisible()
      await expect(recipeModal.tagSuggestion(FIXTURE_TAGS.first)).toBeVisible()
    })

    test('a duplicate error shows when adding a tag already selected for this recipe', async ({ recipeModal }) => {
      await recipeModal.tagInput().fill(FIXTURE_TAGS.first)
      await recipeModal.tagInput().press('Enter')
      await recipeModal.tagInput().fill(FIXTURE_TAGS.first)
      await recipeModal.tagInput().press('Enter')
      await expect(recipeModal.tagDuplicateError()).toContainText('exists')
    })
  })

  test.describe('Unsaved changes guard', () => {
    test('shows a confirmation dialog when closing with dirty fields', async ({ recipeModal }) => {
      await recipeModal.nameInput().fill(RECIPE_NAME)
      await recipeModal.cancelBtn().click()
      await expect(recipeModal.discardChangesDialog()).toBeVisible()
    })

    test('closes the modal without saving when discard is confirmed', async ({ recipeModal, recipeGrid }) => {
      await recipeModal.nameInput().fill(RECIPE_NAME)
      await recipeModal.cancelBtn().click()
      await recipeModal.confirmDiscard().click()
      await expect(recipeModal.nameInput()).not.toBeVisible()
      await expect(recipeGrid.cards()).toHaveCount(0)
    })

    test('keeps the modal open with fields intact when discard is canceled', async ({ recipeModal }) => {
      await recipeModal.nameInput().fill(RECIPE_NAME)
      await recipeModal.cancelBtn().click()
      await recipeModal.keepEditing().click()
      await expect(recipeModal.nameInput()).toHaveValue(RECIPE_NAME)
    })
  })

  test.describe('Validation', () => {
    test('shows an error for an invalid URL in the link field', async ({ recipeModal }) => {
      await recipeModal.linkInput().fill('not-a-url')
      await recipeModal.linkInput().blur()
      await expect(recipeModal.linkError()).toBeVisible()
    })

    test('does not allow typing more than 80 characters in the name field', async ({ recipeModal }) => {
      await recipeModal.nameInput().pressSequentially('a'.repeat(81))
      await expect(recipeModal.nameInput()).toHaveValue('a'.repeat(80))
    })
  })
})
