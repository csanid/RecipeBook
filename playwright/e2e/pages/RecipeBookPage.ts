import { type Page, type Locator } from '@playwright/test'
import { RecipeGrid } from './RecipeGrid'
import { RecipeModal } from './RecipeModal'
import { TagManager } from './TagManager'

export class RecipeBookPage {
  readonly grid: RecipeGrid
  readonly modal: RecipeModal
  readonly tagManager: TagManager

  constructor(private readonly page: Page) {
    this.grid = new RecipeGrid(page)
    this.modal = new RecipeModal(page)
    this.tagManager = new TagManager(page)
  }

  async goto(): Promise<void> {
    await this.page.goto('/')
  }

  // Role-based locators for unique, labelled top-level controls
  heading(): Locator {
    return this.page.getByRole('heading', { name: 'My Recipe Book' })
  }

  async openAddModal(): Promise<void> {
    await this.page.getByRole('button', { name: 'Add Recipe' }).click()
  }

  // No accessible label — fallback to testid
  searchInput(): Locator {
    return this.page.getByTestId('search-bar')
  }

  async selectSort(label: string): Promise<void> {
    await this.page.getByTestId('sort-select').selectOption(label)
  }
}
