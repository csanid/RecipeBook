import { useState, useEffect } from "react";
import { X, Edit2, Link as LinkIcon, Image as ImageIcon, Check, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";
import { Recipe, Tag } from "../types";

export interface RecipeModalProps {
    isOpen: boolean;
    onClose: () => void;
    recipe: Recipe | null;
    onSave: (recipe: Recipe | Omit<Recipe, 'id' | 'createdAt'>) => void;
    availableTags: Tag[];
    onDelete: (id: string) => void;
    addTag: (tag: Tag) => void;
}

export function RecipeModal({
    isOpen,
    onClose,
    recipe,
    onSave,
    availableTags,
    onDelete,
    addTag
}: RecipeModalProps) {
    const isAddMode = !recipe;
    const [isEditMode, setIsEditMode] = useState(isAddMode);
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    // Form State
    const [link, setLink] = useState("");
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
    const [tagInput, setTagInput] = useState("");
    const [notes, setNotes] = useState("");

    // Fetch State
    const [isFetchingOg, setIsFetchingOg] = useState(false);
    const [ogError, setOgError] = useState("");

    // Validation State
    const [linkError, setLinkError] = useState("");
    const [imageUrlError, setImageUrlError] = useState("");
    const [tagError, setTagError] = useState("");
    const [imageLoadFailed, setImageLoadFailed] = useState(false);

    useEffect(() => {
        if (isOpen) {
            if (recipe) {
                setLink(recipe.link || "");
                setName(recipe.name || "");
                setImage(recipe.image || "");
                setSelectedTags(recipe.tags || []);
                setTagInput("");
                setNotes(recipe.notes || "");
                setIsEditMode(false);
            } else {
                setLink("");
                setName("");
                setImage("");
                setSelectedTags([]);
                setTagInput("");
                setNotes("");
                setIsEditMode(true);
            }
            setOgError("");
            setIsFetchingOg(false);
            setLinkError("");
            setImageUrlError("");
            setTagError("");
            setImageLoadFailed(false);
        }
    }, [isOpen, recipe]);

    const hasUnsavedChanges = () => {
        if (!isEditMode) return false;
        if (isAddMode) {
            return link !== "" || name !== "" || image !== "" || selectedTags.length > 0 || notes !== "";
        } else {
            return (
                link !== (recipe.link || "") ||
                name !== (recipe.name || "") ||
                image !== (recipe.image || "") ||
                JSON.stringify(selectedTags) !== JSON.stringify(recipe.tags || []) ||
                notes !== (recipe.notes || "")
            );
        }
    };

    const handleCloseAttempt = () => {
        if (hasUnsavedChanges()) {
            setShowUnsavedDialog(true);
        } else {
            onClose();
        }
    };

    const confirmClose = () => {
        setShowUnsavedDialog(false);
        onClose();
    };

    const toggleTag = (tag: Tag) => {
        if (!isEditMode) return;
        const lowerTag = tag.toLowerCase();
        if (selectedTags.some(t => t.toLowerCase() === lowerTag)) {
            setSelectedTags(selectedTags.filter(t => t.toLowerCase() !== lowerTag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const trimmed = tagInput.trim();
            if (trimmed) {
                const lowerTrimmed = trimmed.toLowerCase();

                if (selectedTags.some(t => t.toLowerCase() === lowerTrimmed)) {
                    setTagError("This tag already exists.");
                    return;
                }

                // Check if it exists in available tags natively
                const existingAvailableTag = availableTags.find(t => t.toLowerCase() === lowerTrimmed);

                // If it exists in available tags, use the exact available tag case,
                // otherwise use the user's typed case.
                const tagToAdd = existingAvailableTag || trimmed;

                // Add to globally available tags if it's new
                if (!existingAvailableTag) {
                    addTag(tagToAdd);
                }

                setSelectedTags([...selectedTags, tagToAdd]);
                setTagInput("");
                setTagError("");
            }
        }
    };

    const handleSave = () => {
        if (!name.trim()) {
            setOgError("Recipe name is required.");
            return;
        }
        if (linkError || imageUrlError || tagError) return;

        onSave({
            id: recipe?.id,
            createdAt: recipe?.createdAt,
            link: link.trim(),
            name: name.trim(),
            image: image.trim(),
            tags: selectedTags,
            notes: notes.trim(),
        });

        if (isAddMode) {
            onClose();
        } else {
            setIsEditMode(false);
        }
    };

    const fetchOpenGraphData = async () => {
        if (!link || !link.startsWith("http")) return;

        setIsFetchingOg(true);
        setOgError("");

        try {
            const appId = import.meta.env.VITE_OPENGRAPH_ID;
            if (!appId) {
                throw new Error("No OpenGraph API ID found in environment.");
            }

            const encodedUrl = encodeURIComponent(link);
            const res = await fetch(`https://opengraph.io/api/1.1/site/${encodedUrl}?app_id=${appId}`);

            if (!res.ok) {
                throw new Error("Failed to fetch OpenGraph data.");
            }

            const data = await res.json();

            if (data.hybridGraph) {
                setName(data.hybridGraph.title || "");
                setImage(data.hybridGraph.image || "");
            }
        } catch (err) {
            console.error(err);
            setOgError("Could not automatically fill recipe details from URL. Please enter them manually.");
        } finally {
            setIsFetchingOg(false);
        }
    };

    return (
        <>
            <Dialog open={isOpen} onOpenChange={handleCloseAttempt}>
                <DialogContent showCloseButton={false} className="sm:max-w-[600px] p-0 overflow-y-auto max-h-[90vh] bg-background">
                    <div className="relative">
                        {/* Image Header Area */}
                        <div className={`w-full bg-neutral-100 dark:bg-neutral-800 relative flex items-center justify-center ${image && !imageLoadFailed ? 'h-64' : 'h-32'}`}>
                            {image && !imageLoadFailed ? (
                                <img
                                    src={image}
                                    alt={name || 'Recipe'}
                                    className="w-full h-full object-cover"
                                    onError={() => setImageLoadFailed(true)}
                                    data-testid="modal-image"
                                />
                            ) : (
                                <ImageIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-700" data-testid="modal-image-placeholder" />
                            )}

                            {!isEditMode && (
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        onClick={(e) => { e.stopPropagation(); setIsEditMode(true); }}
                                        className="rounded-full shadow-md bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-neutral-900 dark:text-neutral-100 backdrop-blur-sm"
                                        data-testid="recipe-card-edit-btn"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        size="icon"
                                        variant="secondary"
                                        onClick={(e) => { e.stopPropagation(); handleCloseAttempt(); }}
                                        className="rounded-full shadow-md bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-neutral-900 dark:text-neutral-100 backdrop-blur-sm"
                                        data-testid="modal-view-close-btn"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </div>

                        <div className="p-6">
                            <DialogHeader className="mb-6 hidden">
                                <DialogTitle>{isAddMode ? 'Add Recipe' : (isEditMode ? 'Edit Recipe' : 'View Recipe')}</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6">

                                {/* Error Message */}
                                {ogError && (
                                    <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg flex items-center gap-2" data-testid="error-message">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{ogError}</span>
                                    </div>
                                )}

                                {/* Name */}
                                <div>
                                    {isEditMode ? (
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-muted-foreground">Recipe Name <span className="text-destructive">*</span></label>
                                            <Input
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                placeholder="e.g. Grandma's Apple Pie"
                                                maxLength={80}
                                                className="text-lg font-semibold"
                                                data-testid="recipe-name-input"
                                            />
                                        </div>
                                    ) : (
                                        <h2 className="text-2xl font-bold tracking-tight">{name}</h2>
                                    )}
                                </div>

                                {/* Link */}
                                <div className="space-y-1">
                                    {isEditMode ? (
                                        <>
                                            <label className="text-sm font-medium text-muted-foreground">Original Recipe URL</label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                                <Input
                                                    value={link}
                                                    onChange={(e) => { setLink(e.target.value); setLinkError(""); }}
                                                    onBlur={() => {
                                                        if (link && !link.startsWith("http")) setLinkError("URL must start with http:// or https://");
                                                    }}
                                                    placeholder="https://..."
                                                    className="pl-9 pr-10"
                                                    data-testid="recipe-link-input"
                                                />
                                                <Button
                                                    size="icon-sm"
                                                    variant="secondary"
                                                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md"
                                                    onClick={fetchOpenGraphData}
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
                                        </>
                                    ) : (
                                        link && (
                                            <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline font-medium" data-testid="modal-recipe-link">
                                                <LinkIcon className="w-4 h-4" /> Visit Original Recipe
                                            </a>
                                        )
                                    )}
                                </div>

                                {/* Image URL explicitly editable */}
                                {isEditMode && (
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-muted-foreground">Image URL</label>
                                        <div className="relative">
                                            <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                value={image}
                                                onChange={(e) => { setImage(e.target.value); setImageUrlError(""); setImageLoadFailed(false); }}
                                                onBlur={() => {
                                                    if (image && !image.startsWith("http")) setImageUrlError("URL must start with http:// or https://");
                                                }}
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
                                )}

                                {/* Tags */}
                                <div className="space-y-2 pt-2">
                                    <label className="text-sm font-medium text-muted-foreground">Tags</label>

                                    {isEditMode && (
                                        <div className="mb-3">
                                            <Input
                                                value={tagInput}
                                                onChange={(e) => { setTagInput(e.target.value); setTagError(""); }}
                                                onKeyDown={handleTagInputKeyDown}
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
                                    )}

                                    <div className="flex flex-wrap gap-2">
                                        {isEditMode ? (
                                            selectedTags.length > 0 || availableTags.length > 0 ? (
                                                <>
                                                    {/* Show selected tags first with an X to remove */}
                                                    {selectedTags.map(tag => (
                                                        <Badge
                                                            key={`selected-${tag}`}
                                                            variant="default"
                                                            className="cursor-pointer hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-colors py-1 flex items-center gap-1"
                                                            onClick={() => toggleTag(tag)}
                                                        >
                                                            {tag}
                                                            <button
                                                                className="hover:bg-neutral-600 dark:hover:bg-neutral-300 rounded-full p-0.5 inline-flex"
                                                                onClick={(e) => { e.stopPropagation(); toggleTag(tag); }}
                                                                data-testid="remove-tag-chip"
                                                            >
                                                                <X className="w-3 h-3" />
                                                            </button>
                                                        </Badge>
                                                    ))}
                                                    {/* Show available unselected tags next */}
                                                    {availableTags
                                                        .filter(tag => !selectedTags.some(st => st.toLowerCase() === tag.toLowerCase()))
                                                        .filter(tag => tagInput ? tag.toLowerCase().includes(tagInput.toLowerCase()) : true)
                                                        .map(tag => (
                                                            <Badge
                                                                key={`available-${tag}`}
                                                                variant="outline"
                                                                className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors py-1"
                                                                onClick={() => toggleTag(tag)}
                                                            >
                                                                + {tag}
                                                            </Badge>
                                                        ))}
                                                </>
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic">Type above to create your first tag.</p>
                                            )
                                        ) : (
                                            selectedTags.length > 0 ? (
                                                selectedTags.map(tag => (
                                                    <Badge key={`view-${tag}`} variant="secondary" className="py-1">
                                                        {tag}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-sm text-muted-foreground italic">No tags assigned.</span>
                                            )
                                        )}
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="space-y-1">
                                    {isEditMode ? (
                                        <>
                                            <label className="text-sm font-medium text-muted-foreground">Notes</label>
                                            <textarea
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                                                placeholder="Add any notes, tweaks, or thoughts..."
                                                value={notes}
                                                onChange={(e) => setNotes(e.target.value)}
                                                maxLength={2500}
                                                data-testid="recipe-notes-input"
                                            />
                                        </>
                                    ) : (
                                        notes && (
                                            <>
                                                <label className="text-sm font-medium text-muted-foreground">Notes</label>
                                                <div className="bg-neutral-50 dark:bg-neutral-900 border rounded-md p-3 text-sm whitespace-pre-wrap">
                                                    {notes}
                                                </div>
                                            </>
                                        )
                                    )}
                                </div>

                            </div>

                            {/* Footer Actions */}
                            {isEditMode && (
                                <div className="flex justify-between items-center mt-8 pt-4 border-t">
                                    {recipe && !isAddMode ? (
                                        <Button variant="destructive" onClick={() => setShowDeleteDialog(true)} className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900 border-red-200 dark:border-red-900" data-testid="modal-delete-btn">
                                            Delete Recipe
                                        </Button>
                                    ) : <div></div>}
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={handleCloseAttempt} data-testid="modal-cancel-btn">Cancel</Button>
                                        <Button onClick={handleSave} className="gap-2" data-testid="modal-save-btn">
                                            <Check className="w-4 h-4" /> Save Recipe
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={showUnsavedDialog} onOpenChange={setShowUnsavedDialog}>
                <AlertDialogContent data-testid="discard-changes-dialog">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have unsaved changes. Are you sure you want to close this window and lose your changes?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowUnsavedDialog(false)} data-testid="unsaved-changes-cancel">Keep Editing</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmClose} className="bg-red-500 hover:bg-red-600" data-testid="unsaved-changes-confirm">
                            Discard Changes
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete "{name || 'this recipe'}". This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowDeleteDialog(false)} data-testid="delete-cancel-btn">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { onDelete(recipe!.id); setShowDeleteDialog(false); onClose(); }} className="bg-red-500 hover:bg-red-600" data-testid="delete-confirm-btn">
                            Delete Recipe
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
