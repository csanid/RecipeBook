export const SELECTORS = {
  header: {
    title: '[data-testid="app-title"]',
  },
  actionBar: {
    searchBar: '[data-testid="search-bar"]',
    sortSelect: '[data-testid="sort-select"]',
    addRecipeBtn: '[data-testid="add-recipe-btn"]',
  },
  tagManager: {
    container: '[data-testid="tags-container"]',
    pill: '[data-testid="tag-pill"]',
    tagError: '[data-testid="tag-error"]',
    tagInput: '[data-testid="tag-input"]',
    tagEditBtn: '[data-testid="tag-edit-btn"]',
    tagDeleteBtn: '[data-testid="tag-delete-btn"]',
    deleteTagDialogConfirm: '[data-testid="delete-tag-dialog-confirm"]',
    deleteTagDialogCancel: '[data-testid="delete-tag-dialog-cancel"]',
  },
  recipeGrid: {
    card: '[data-testid="recipe-card"]',
  },
  recipeModal: {
    saveBtn: '[data-testid="modal-save-btn"]',
    fetchOgBtn: '[data-testid="fetch-og-btn"]',
    removeTagChip: '[data-testid="remove-tag-chip"]',
    tagDuplicateError: '[data-testid="modal-tag-error"]',
    linkError: '[data-testid="link-url-error"]',
    imageUrlError: '[data-testid="image-url-error"]',
    ogError: '[data-testid="error-message"]',
  },
} as const
