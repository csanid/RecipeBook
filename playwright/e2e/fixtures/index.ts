import { test as base } from '@playwright/test'
import { RecipeBookPage } from '../pages/RecipeBookPage'
import { RecipeGrid } from '../pages/RecipeGrid'
import { RecipeModal } from '../pages/RecipeModal'
import { TagManager } from '../pages/TagManager'
import { type Recipe } from '../data/recipes'
import { OG_SUCCESS, OG_ERROR, OG_NO_TITLE } from '../data/opengraph'

const OG_URL = '**/opengraph.io/api/**'

type OgFixture = {
  success: () => Promise<void>
  error: () => Promise<void>
  noTitle: () => Promise<void>
}

type TestFixtures = {
  /** Seed recipes written to localStorage before navigation. Default: []. */
  recipes: Recipe[]
  /** Seed tags written to localStorage before navigation. Default: []. */
  tags: string[]
  recipeBookPage: RecipeBookPage
  recipeGrid: RecipeGrid
  recipeModal: RecipeModal
  tagManager: TagManager
  /** Register OpenGraph route stubs before calling recipeBookPage.goto(). */
  og: OgFixture
}

export const test = base.extend<TestFixtures>({
  recipes: [[], { option: true }],
  tags: [[], { option: true }],

  recipeBookPage: async ({ page, recipes, tags }, use) => {
    // Runs before every page load — seeds localStorage so the app reads it on init
    await page.addInitScript(
      (seed: { r: Recipe[]; t: string[] }) => {
        localStorage.setItem('recipebook_recipes', JSON.stringify(seed.r))
        localStorage.setItem('recipebook_tags', JSON.stringify(seed.t))
      },
      { r: recipes, t: tags },
    )
    await use(new RecipeBookPage(page))
  },

  recipeGrid: async ({ recipeBookPage }, use) => {
    await use(recipeBookPage.grid)
  },

  recipeModal: async ({ recipeBookPage }, use) => {
    await use(recipeBookPage.modal)
  },

  tagManager: async ({ recipeBookPage }, use) => {
    await use(recipeBookPage.tagManager)
  },

  og: async ({ page }, use) => {
    await use({
      success: () =>
        page.route(OG_URL, (route) => route.fulfill({ json: OG_SUCCESS })),
      error: () =>
        page.route(OG_URL, (route) => route.fulfill({ status: 500, json: OG_ERROR })),
      noTitle: () =>
        page.route(OG_URL, (route) => route.fulfill({ json: OG_NO_TITLE })),
    })
  },
})

export { expect } from '@playwright/test'
