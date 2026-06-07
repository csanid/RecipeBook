import { type Page, type Locator } from '@playwright/test'

export class RecipeModal {
  constructor(private readonly page: Page) {}

  // Form inputs — no htmlFor labels in the app, so testid is the stable locator
  nameInput(): Locator { return this.page.getByTestId('recipe-name-input') }
  linkInput(): Locator { return this.page.getByTestId('recipe-link-input') }
  imageInput(): Locator { return this.page.getByTestId('recipe-image-input') }
  notesInput(): Locator { return this.page.getByTestId('recipe-notes-input') }
  tagInput(): Locator { return this.page.getByTestId('tag-input') }
  removeTagChips(): Locator { return this.page.getByTestId('remove-tag-chip') }
  tagDuplicateError(): Locator { return this.page.getByTestId('modal-tag-error') }

  // Action buttons — testid preferred over role to avoid ambiguity with dialog buttons
  saveBtn(): Locator { return this.page.getByTestId('modal-save-btn') }
  cancelBtn(): Locator { return this.page.getByTestId('modal-cancel-btn') }
  deleteBtn(): Locator { return this.page.getByTestId('modal-delete-btn') }
  fetchOgBtn(): Locator { return this.page.getByTestId('fetch-og-btn') }
  editBtn(): Locator { return this.page.getByTestId('recipe-card-edit-btn') }
  viewCloseBtn(): Locator { return this.page.getByTestId('modal-view-close-btn') }

  // Image area
  image(): Locator { return this.page.getByTestId('modal-image') }
  imagePlaceholder(): Locator { return this.page.getByTestId('modal-image-placeholder') }

  // View mode content
  recipeLink(): Locator { return this.page.getByTestId('modal-recipe-link') }

  // Error nodes
  ogError(): Locator { return this.page.getByTestId('error-message') }
  linkError(): Locator { return this.page.getByTestId('link-error') }
  imageUrlError(): Locator { return this.page.getByTestId('image-url-error') }

  // Unsaved-changes confirmation dialog
  discardChangesDialog(): Locator { return this.page.getByTestId('discard-changes-dialog') }
  confirmDiscard(): Locator { return this.page.getByTestId('unsaved-changes-confirm') }
  keepEditing(): Locator { return this.page.getByTestId('unsaved-changes-cancel') }

  // Delete-recipe confirmation dialog
  confirmDelete(): Locator { return this.page.getByTestId('delete-confirm-btn') }
  cancelDelete(): Locator { return this.page.getByTestId('delete-cancel-btn') }
}
