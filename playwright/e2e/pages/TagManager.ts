import { type Page, type Locator } from '@playwright/test'

export class TagManager {
  constructor(private readonly page: Page) {}

  container(): Locator { return this.page.getByTestId('tags-container') }

  // In filter mode (default): data-testid="tag-filter-pill"
  filterPills(): Locator { return this.page.getByTestId('tag-filter-pill') }

  // In edit mode: data-testid="tag-pill"
  pills(): Locator { return this.page.getByTestId('tag-pill') }

  // Tag input — visible only while in edit mode
  tagInput(): Locator { return this.page.getByTestId('tag-input') }
  tagError(): Locator { return this.page.getByTestId('tag-error') }

  // Toggles between "Manage Tags" and "Done Editing" — testid is stable across both states
  editBtn(): Locator { return this.page.getByTestId('tag-edit-btn') }

  // Delete X buttons, one per pill in edit mode
  deleteButtons(): Locator { return this.page.getByTestId('tag-delete-btn') }

  filterPillByName(name: string): Locator { return this.filterPills().filter({ hasText: name }) }
  pillByName(name: string): Locator { return this.pills().filter({ hasText: name }) }
  deleteButtonFor(name: string): Locator { return this.pillByName(name).getByTestId('tag-delete-btn') }

  async addTag(name: string): Promise<void> {
    await this.tagInput().fill(name)
    await this.tagInput().press('Enter')
  }

  // Delete-tag confirmation dialog
  deleteTagDialogConfirm(): Locator { return this.page.getByTestId('delete-tag-dialog-confirm') }
  deleteTagDialogCancel(): Locator { return this.page.getByTestId('delete-tag-dialog-cancel') }
}
