import { Check } from 'lucide-react'
import { Button } from './ui/button'

interface RecipeFooterActionsProps {
  mode: 'add' | 'edit'
  onCancel: () => void
  onSave: () => void
  onDelete: () => void
}

export function RecipeFooterActions({ mode, onCancel, onSave, onDelete }: RecipeFooterActionsProps) {
  return (
    <div className="flex justify-between items-center mt-8 pt-4 border-t">
      {mode === 'edit' ? (
        <Button
          variant="destructive"
          onClick={onDelete}
          className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900 border-red-200 dark:border-red-900"
          data-testid="modal-delete-btn"
        >
          Delete Recipe
        </Button>
      ) : (
        <div />
      )}
      <div className="flex gap-2">
        <Button variant="outline" onClick={onCancel} data-testid="modal-cancel-btn">
          Cancel
        </Button>
        <Button onClick={onSave} className="gap-2" data-testid="modal-save-btn">
          <Check className="w-4 h-4" /> Save Recipe
        </Button>
      </div>
    </div>
  )
}
