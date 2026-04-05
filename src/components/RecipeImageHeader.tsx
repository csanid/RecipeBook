import { type MouseEvent } from 'react'
import { X, Edit2, Image as ImageIcon } from 'lucide-react'
import { Button } from './ui/button'

interface RecipeImageHeaderProps {
  image: string
  imageLoadFailed: boolean
  mode: 'add' | 'view' | 'edit'
  onEdit: () => void
  onClose: () => void
  onImageError: () => void
}

export function RecipeImageHeader({
  image,
  imageLoadFailed,
  mode,
  onEdit,
  onClose,
  onImageError,
}: RecipeImageHeaderProps) {
  const showImage = image && !imageLoadFailed

  const handleEditClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onEdit()
  }

  const handleCloseClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    onClose()
  }

  return (
    <div className={`w-full bg-neutral-100 dark:bg-neutral-800 relative flex items-center justify-center ${showImage ? 'h-64' : 'h-32'}`}>
      {showImage ? (
        <img
          src={image}
          alt="Recipe"
          className="w-full h-full object-cover"
          onError={onImageError}
          data-testid="modal-image"
        />
      ) : (
        <ImageIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-700" data-testid="modal-image-placeholder" />
      )}

      {mode === 'view' && (
        <div className="absolute top-4 right-4 flex gap-2">
          <Button
            size="icon"
            variant="secondary"
            onClick={handleEditClick}
            className="rounded-full shadow-md bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-neutral-900 dark:text-neutral-100 backdrop-blur-sm"
            data-testid="recipe-card-edit-btn"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={handleCloseClick}
            className="rounded-full shadow-md bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-neutral-900 dark:text-neutral-100 backdrop-blur-sm"
            data-testid="modal-view-close-btn"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
