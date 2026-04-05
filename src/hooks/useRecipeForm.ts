import { useState, type KeyboardEvent } from 'react'
import { Recipe, Tag } from '../types'

export function useRecipeForm(availableTags: Tag[], addTag: (tag: Tag) => void) {
  const [link, setLink] = useState('')
  const [name, setName] = useState('')
  const [image, setImage] = useState('')
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [tagInput, setTagInput] = useState('')
  const [notes, setNotes] = useState('')
  const [linkError, setLinkError] = useState('')
  const [imageUrlError, setImageUrlError] = useState('')
  const [tagError, setTagError] = useState('')
  const [imageLoadFailed, setImageLoadFailed] = useState(false)
  const [originalRecipe, setOriginalRecipe] = useState<Recipe | null>(null)

  const reset = () => {
    setLink('')
    setName('')
    setImage('')
    setSelectedTags([])
    setTagInput('')
    setNotes('')
    setLinkError('')
    setImageUrlError('')
    setTagError('')
    setImageLoadFailed(false)
    setOriginalRecipe(null)
  }

  const populate = (recipe: Recipe) => {
    setLink(recipe.link || '')
    setName(recipe.name || '')
    setImage(recipe.image || '')
    setSelectedTags(recipe.tags || [])
    setTagInput('')
    setNotes(recipe.notes || '')
    setLinkError('')
    setImageUrlError('')
    setTagError('')
    setImageLoadFailed(false)
    setOriginalRecipe(recipe)
  }

  const populateFromOg = (ogTitle: string, ogImage: string) => {
    setName(ogTitle)
    setImage(ogImage)
  }

  const hasUnsavedChanges = () => {
    if (originalRecipe === null) {
      return link !== '' || name !== '' || image !== '' || selectedTags.length > 0 || notes !== ''
    }
    return (
      link !== (originalRecipe.link || '') ||
      name !== (originalRecipe.name || '') ||
      image !== (originalRecipe.image || '') ||
      JSON.stringify(selectedTags) !== JSON.stringify(originalRecipe.tags || []) ||
      notes !== (originalRecipe.notes || '')
    )
  }

  const handleLinkChange = (value: string) => {
    setLink(value)
    setLinkError('')
  }

  const handleLinkBlur = () => {
    if (link && !link.startsWith('http')) {
      setLinkError('URL must start with http:// or https://')
    }
  }

  const handleImageChange = (value: string) => {
    setImage(value)
    setImageUrlError('')
    setImageLoadFailed(false)
  }

  const handleImageBlur = () => {
    if (image && !image.startsWith('http')) {
      setImageUrlError('URL must start with http:// or https://')
    }
  }

  const toggleTag = (tag: Tag) => {
    const lowerTag = tag.toLowerCase()
    if (selectedTags.some(t => t.toLowerCase() === lowerTag)) {
      setSelectedTags(selectedTags.filter(t => t.toLowerCase() !== lowerTag))
    } else {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleTagInputChange = (value: string) => {
    setTagInput(value)
    setTagError('')
  }

  const handleTagInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Enter') return
    e.preventDefault()
    const trimmed = tagInput.trim()
    if (!trimmed) return
    const lowerTrimmed = trimmed.toLowerCase()
    if (selectedTags.some(t => t.toLowerCase() === lowerTrimmed)) {
      setTagError('This tag already exists.')
      return
    }
    const existingAvailableTag = availableTags.find(t => t.toLowerCase() === lowerTrimmed)
    const tagToAdd = existingAvailableTag ?? trimmed
    if (!existingAvailableTag) {
      addTag(tagToAdd)
    }
    setSelectedTags([...selectedTags, tagToAdd])
    setTagInput('')
    setTagError('')
  }

  return {
    link,
    name,
    image,
    selectedTags,
    tagInput,
    notes,
    linkError,
    imageUrlError,
    tagError,
    imageLoadFailed,
    setName,
    setNotes,
    setImageLoadFailed,
    reset,
    populate,
    populateFromOg,
    hasUnsavedChanges,
    handleLinkChange,
    handleLinkBlur,
    handleImageChange,
    handleImageBlur,
    toggleTag,
    handleTagInputChange,
    handleTagInputKeyDown,
  }
}
