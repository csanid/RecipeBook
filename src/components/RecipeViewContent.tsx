import { Link as LinkIcon } from 'lucide-react'
import { Badge } from './ui/badge'
import { Tag } from '../types'

interface RecipeViewContentProps {
  name: string
  link: string
  selectedTags: Tag[]
  notes: string
}

export function RecipeViewContent({ name, link, selectedTags, notes }: RecipeViewContentProps) {
  return (
    <>
      {/* Name */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
      </div>

      {/* Link */}
      {link && (
        <div className="space-y-1">
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-primary hover:underline font-medium"
            data-testid="modal-recipe-link"
          >
            <LinkIcon className="w-4 h-4" /> Visit Original Recipe
          </a>
        </div>
      )}

      {/* Tags */}
      <div className="space-y-2 pt-2">
        <label className="text-sm font-medium text-muted-foreground">Tags</label>
        <div className="flex flex-wrap gap-2">
          {selectedTags.length > 0 ? (
            selectedTags.map(tag => (
              <Badge key={`view-${tag}`} variant="secondary" className="py-1">
                {tag}
              </Badge>
            ))
          ) : (
            <span className="text-sm text-muted-foreground italic">No tags assigned.</span>
          )}
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="space-y-1">
          <label className="text-sm font-medium text-muted-foreground">Notes</label>
          <div className="bg-neutral-50 dark:bg-neutral-900 border rounded-md p-3 text-sm whitespace-pre-wrap">
            {notes}
          </div>
        </div>
      )}
    </>
  )
}
