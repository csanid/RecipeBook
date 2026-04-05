import { type KeyboardEvent, type ChangeEvent } from 'react'
import { X, AlertCircle } from 'lucide-react'
import { Input } from './ui/input'
import { Badge } from './ui/badge'
import { Tag } from '../types'

interface RecipeTagEditorProps {
  tagInput: string
  tagError: string
  selectedTags: Tag[]
  availableTags: Tag[]
  onTagInputChange: (value: string) => void
  onTagInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  onToggleTag: (tag: Tag) => void
}

export function RecipeTagEditor({
  tagInput,
  tagError,
  selectedTags,
  availableTags,
  onTagInputChange,
  onTagInputKeyDown,
  onToggleTag,
}: RecipeTagEditorProps) {
  const unselectedTags = availableTags
    .filter(tag => !selectedTags.some(st => st.toLowerCase() === tag.toLowerCase()))
    .filter(tag => (tagInput ? tag.toLowerCase().includes(tagInput.toLowerCase()) : true))

  const hasAnyTags = selectedTags.length > 0 || availableTags.length > 0

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => onTagInputChange(e.target.value)

  return (
    <div className="space-y-2 pt-2">
      <label className="text-sm font-medium text-muted-foreground">Tags</label>

      <div className="mb-3">
        <Input
          value={tagInput}
          onChange={handleInputChange}
          onKeyDown={onTagInputKeyDown}
          maxLength={40}
          placeholder="Type a tag and press Enter..."
          className="h-9"
          data-testid="tag-input"
        />
        {tagError ? (
          <p className="text-sm text-destructive flex items-center gap-1.5 mt-1" data-testid="modal-tag-error">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {tagError}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground mt-1 text-right">
            Press Enter to add tag. New tags will be saved automatically.
          </p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {hasAnyTags ? (
          <>
            {selectedTags.map(tag => (
              <Badge
                key={`selected-${tag}`}
                variant="default"
                className="cursor-pointer hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors py-1 flex items-center gap-1"
                onClick={() => onToggleTag(tag)}
              >
                {tag}
                <button
                  className="hover:bg-neutral-600 dark:hover:bg-neutral-300 rounded-full p-0.5 inline-flex"
                  onClick={(e) => { e.stopPropagation(); onToggleTag(tag) }}
                  data-testid="remove-tag-chip"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
            {unselectedTags.map(tag => (
              <Badge
                key={`available-${tag}`}
                variant="outline"
                className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors py-1"
                onClick={() => onToggleTag(tag)}
              >
                + {tag}
              </Badge>
            ))}
          </>
        ) : (
          <p className="text-sm text-muted-foreground italic">Type above to create your first tag.</p>
        )}
      </div>
    </div>
  )
}
