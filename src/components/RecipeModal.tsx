import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { RecipeImageHeader } from './RecipeImageHeader'
import { RecipeFormFields } from './RecipeFormFields'
import { RecipeViewContent } from './RecipeViewContent'
import { RecipeFooterActions } from './RecipeFooterActions'
import { UnsavedChangesDialog } from './UnsavedChangesDialog'
import { DeleteConfirmationDialog } from './DeleteConfirmationDialog'
import { useRecipeForm } from '../hooks/useRecipeForm'
import { useOpenGraph } from '../hooks/useOpenGraph'
import { Recipe, Tag } from '../types'

export interface RecipeModalProps {
  isOpen: boolean
  onClose: () => void
  recipe: Recipe | null
  onSave: (recipe: Recipe | Omit<Recipe, 'id' | 'createdAt'>) => void
  availableTags: Tag[]
  onDelete: (id: string) => void
  addTag: (tag: Tag) => void
}

export function RecipeModal({
  isOpen,
  onClose,
  recipe,
  onSave,
  availableTags,
  onDelete,
  addTag,
}: RecipeModalProps) {
  const [mode, setMode] = useState<'add' | 'view' | 'edit'>('add')
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const form = useRecipeForm(availableTags, addTag)
  const og = useOpenGraph()

  useEffect(() => {
    if (isOpen) {
      if (recipe) {
        form.populate(recipe)
        setMode('view')
      } else {
        form.reset()
        setMode('add')
      }
      og.clearOgError()
    }
  }, [isOpen, recipe])

  const handleCloseAttempt = () => {
    if (mode !== 'view' && form.hasUnsavedChanges()) {
      setShowUnsavedDialog(true)
    } else {
      onClose()
    }
  }

  const handleConfirmClose = () => {
    setShowUnsavedDialog(false)
    onClose()
  }

  const handleKeepEditing = () => setShowUnsavedDialog(false)

  const handleStartEdit = () => setMode('edit')

  const handleSave = () => {
    if (!form.name.trim()) {
      og.setOgError('Recipe name is required.')
      return
    }
    if (form.linkError || form.imageUrlError || form.tagError) return

    onSave({
      id: recipe?.id,
      createdAt: recipe?.createdAt,
      link: form.link.trim(),
      name: form.name.trim(),
      image: form.image.trim(),
      tags: form.selectedTags,
      notes: form.notes.trim(),
    })

    if (mode === 'add') {
      onClose()
    } else {
      setMode('view')
    }
  }

  const handleFetchOg = async () => {
    if (!form.link || !form.link.startsWith('http')) return
    const result = await og.fetchMetadata(form.link)
    if (result) {
      form.populateFromOg(result.title, result.image)
    }
  }

  const handleImageError = () => form.setImageLoadFailed(true)

  const handleOpenDelete = () => setShowDeleteDialog(true)

  const handleConfirmDelete = () => {
    onDelete(recipe!.id)
    setShowDeleteDialog(false)
    onClose()
  }

  const handleCancelDelete = () => setShowDeleteDialog(false)

  const dialogTitle = mode === 'add' ? 'Add Recipe' : mode === 'edit' ? 'Edit Recipe' : 'View Recipe'

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleCloseAttempt}>
        <DialogContent showCloseButton={false} className="sm:max-w-[600px] p-0 overflow-y-auto max-h-[90vh] bg-background">
          <div className="relative">
            <RecipeImageHeader
              image={form.image}
              imageLoadFailed={form.imageLoadFailed}
              mode={mode}
              onEdit={handleStartEdit}
              onClose={handleCloseAttempt}
              onImageError={handleImageError}
            />

            <div className="p-6">
              <DialogHeader className="mb-6 hidden">
                <DialogTitle>{dialogTitle}</DialogTitle>
              </DialogHeader>

              <div className="space-y-6">
                {og.ogError && (
                  <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg flex items-center gap-2" data-testid="error-message">
                    <AlertCircle className="w-4 h-4" />
                    <span>{og.ogError}</span>
                  </div>
                )}

                {mode !== 'view' ? (
                  <RecipeFormFields
                    link={form.link}
                    name={form.name}
                    image={form.image}
                    notes={form.notes}
                    tagInput={form.tagInput}
                    selectedTags={form.selectedTags}
                    availableTags={availableTags}
                    linkError={form.linkError}
                    imageUrlError={form.imageUrlError}
                    tagError={form.tagError}
                    isFetchingOg={og.isFetchingOg}
                    onLinkChange={form.handleLinkChange}
                    onLinkBlur={form.handleLinkBlur}
                    onNameChange={form.setName}
                    onImageChange={form.handleImageChange}
                    onImageBlur={form.handleImageBlur}
                    onNotesChange={form.setNotes}
                    onTagInputChange={form.handleTagInputChange}
                    onTagInputKeyDown={form.handleTagInputKeyDown}
                    onToggleTag={form.toggleTag}
                    onFetchOg={handleFetchOg}
                  />
                ) : (
                  <RecipeViewContent
                    name={form.name}
                    link={form.link}
                    selectedTags={form.selectedTags}
                    notes={form.notes}
                  />
                )}
              </div>

              {mode !== 'view' && (
                <RecipeFooterActions
                  mode={mode}
                  onCancel={handleCloseAttempt}
                  onSave={handleSave}
                  onDelete={handleOpenDelete}
                />
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <UnsavedChangesDialog
        isOpen={showUnsavedDialog}
        onKeepEditing={handleKeepEditing}
        onDiscard={handleConfirmClose}
      />

      <DeleteConfirmationDialog
        isOpen={showDeleteDialog}
        recipeName={form.name}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </>
  )
}
