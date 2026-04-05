import { type KeyboardEvent, type ChangeEvent } from 'react'
import { Link as LinkIcon, Image as ImageIcon, AlertCircle, ArrowRight, Loader2 } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { RecipeTagEditor } from './RecipeTagEditor'
import { Tag } from '../types'

interface RecipeFormFieldsProps {
  link: string
  name: string
  image: string
  notes: string
  tagInput: string
  selectedTags: Tag[]
  availableTags: Tag[]
  linkError: string
  imageUrlError: string
  tagError: string
  isFetchingOg: boolean
  onLinkChange: (value: string) => void
  onLinkBlur: () => void
  onNameChange: (value: string) => void
  onImageChange: (value: string) => void
  onImageBlur: () => void
  onNotesChange: (value: string) => void
  onTagInputChange: (value: string) => void
  onTagInputKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void
  onToggleTag: (tag: Tag) => void
  onFetchOg: () => void
}

export function RecipeFormFields({
  link,
  name,
  image,
  notes,
  tagInput,
  selectedTags,
  availableTags,
  linkError,
  imageUrlError,
  tagError,
  isFetchingOg,
  onLinkChange,
  onLinkBlur,
  onNameChange,
  onImageChange,
  onImageBlur,
  onNotesChange,
  onTagInputChange,
  onTagInputKeyDown,
  onToggleTag,
  onFetchOg,
}: RecipeFormFieldsProps) {
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => onNameChange(e.target.value)
  const handleLinkChange = (e: ChangeEvent<HTMLInputElement>) => onLinkChange(e.target.value)
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => onImageChange(e.target.value)
  const handleNotesChange = (e: ChangeEvent<HTMLTextAreaElement>) => onNotesChange(e.target.value)

  return (
    <>
      {/* Name */}
      <div>
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">
            Recipe Name <span className="text-destructive">*</span>
          </label>
          <Input
            value={name}
            onChange={handleNameChange}
            placeholder="e.g. Grandma's Apple Pie"
            maxLength={80}
            className="text-lg font-semibold"
            data-testid="recipe-name-input"
          />
        </div>
      </div>

      {/* Link */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">Original Recipe URL</label>
        <div className="relative">
          <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={link}
            onChange={handleLinkChange}
            onBlur={onLinkBlur}
            placeholder="https://..."
            className="pl-9 pr-10"
            data-testid="recipe-link-input"
          />
          <Button
            size="icon-sm"
            variant="secondary"
            className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md"
            onClick={onFetchOg}
            disabled={isFetchingOg || !link}
            data-testid="fetch-og-btn"
          >
            {isFetchingOg ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>
        </div>
        {linkError ? (
          <p className="text-sm text-destructive flex items-center gap-1.5 mt-1" data-testid="link-error">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {linkError}
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">Paste a link and click the arrow to autofill details.</p>
        )}
      </div>

      {/* Image URL */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">Image URL</label>
        <div className="relative">
          <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={image}
            onChange={handleImageChange}
            onBlur={onImageBlur}
            placeholder="https://.../image.jpg"
            className="pl-9"
            data-testid="recipe-image-input"
          />
        </div>
        {imageUrlError && (
          <p className="text-sm text-destructive flex items-center gap-1.5 mt-1" data-testid="image-url-error">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            {imageUrlError}
          </p>
        )}
      </div>

      {/* Tags */}
      <RecipeTagEditor
        tagInput={tagInput}
        tagError={tagError}
        selectedTags={selectedTags}
        availableTags={availableTags}
        onTagInputChange={onTagInputChange}
        onTagInputKeyDown={onTagInputKeyDown}
        onToggleTag={onToggleTag}
      />

      {/* Notes */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-muted-foreground">Notes</label>
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
          placeholder="Add any notes, tweaks, or thoughts..."
          value={notes}
          onChange={handleNotesChange}
          maxLength={2500}
          data-testid="recipe-notes-input"
        />
      </div>
    </>
  )
}
