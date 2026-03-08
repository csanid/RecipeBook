import { useState, useEffect } from "react";
import { X, Edit2, Link as LinkIcon, Image as ImageIcon, Check, Loader2, AlertCircle } from "lucide-react";
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
}

export function RecipeModal({
    isOpen,
    onClose,
    recipe,
    onSave,
    availableTags,
    onDelete
}: RecipeModalProps) {
    const isAddMode = !recipe;
    const [isEditMode, setIsEditMode] = useState(isAddMode);
    const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

    // Form State
    const [link, setLink] = useState("");
    const [name, setName] = useState("");
    const [image, setImage] = useState("");
    const [selectedTags, setSelectedTags] = useState<Tag[]>([]);

    // Fetch State
    const [isFetchingOg, setIsFetchingOg] = useState(false);
    const [ogError, setOgError] = useState("");

    useEffect(() => {
        if (isOpen) {
            if (recipe) {
                setLink(recipe.link || "");
                setName(recipe.name || "");
                setImage(recipe.image || "");
                setSelectedTags(recipe.tags || []);
                setIsEditMode(false);
            } else {
                setLink("");
                setName("");
                setImage("");
                setSelectedTags([]);
                setIsEditMode(true);
            }
            setOgError("");
            setIsFetchingOg(false);
        }
    }, [isOpen, recipe]);

    const hasUnsavedChanges = () => {
        if (!isEditMode) return false;
        if (isAddMode) {
            return link !== "" || name !== "" || image !== "" || selectedTags.length > 0;
        } else {
            return (
                link !== (recipe.link || "") ||
                name !== (recipe.name || "") ||
                image !== (recipe.image || "") ||
                JSON.stringify(selectedTags) !== JSON.stringify(recipe.tags || [])
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
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleSave = () => {
        if (!name.trim()) {
            setOgError("Recipe name is required.");
            return;
        }

        onSave({
            ...(recipe || {}),
            link: link.trim(),
            name: name.trim(),
            image: image.trim(),
            tags: selectedTags,
        });

        if (isAddMode) {
            onClose();
        } else {
            setIsEditMode(false);
        }
    };

    const fetchOpenGraphData = async () => {
        if (!link || !link.startsWith("http")) return;

        // Only fetch if name and image are empty
        if (name && image) return;

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
                if (!name && data.hybridGraph.title) {
                    setName(data.hybridGraph.title);
                }
                if (!image && data.hybridGraph.image) {
                    setImage(data.hybridGraph.image);
                }
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
                <DialogContent className="sm:max-w-[600px] p-0 overflow-hidden bg-background">
                    <div className="relative">
                        {/* Image Header Area */}
                        <div className={`w-full bg-neutral-100 dark:bg-neutral-800 relative flex items-center justify-center ${image ? 'h-64' : 'h-32'}`}>
                            {image ? (
                                <img src={image} alt={name || 'Recipe'} className="w-full h-full object-cover" />
                            ) : (
                                <ImageIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-700" />
                            )}

                            {!isEditMode && (
                                <div className="absolute top-4 right-10">
                                    <Button size="icon" variant="secondary" onClick={(e) => { e.stopPropagation(); setIsEditMode(true); }} className="rounded-full shadow-md bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-neutral-900 dark:text-neutral-100 backdrop-blur-sm">
                                        <Edit2 className="w-4 h-4" />
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
                                    <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg flex items-center gap-2" data-cy="error-message">
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
                                                className="text-lg font-semibold"
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
                                                    onChange={(e) => setLink(e.target.value)}
                                                    onBlur={fetchOpenGraphData}
                                                    placeholder="https://..."
                                                    className="pl-9"
                                                />
                                                {isFetchingOg && (
                                                    <div className="absolute right-3 top-1/2 -translate-y-1/2" id="loading-spinner" data-cy="loading-spinner">
                                                        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">Paste a link and click outside to autofill details.</p>
                                        </>
                                    ) : (
                                        link && (
                                            <a href={link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:underline font-medium">
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
                                                onChange={(e) => setImage(e.target.value)}
                                                placeholder="https://.../image.jpg"
                                                className="pl-9"
                                            />
                                        </div>
                                    </div>
                                )}

                                {/* Tags */}
                                <div className="space-y-2 pt-2">
                                    <label className="text-sm font-medium text-muted-foreground">Tags</label>
                                    <div className="flex flex-wrap gap-2">
                                        {isEditMode ? (
                                            availableTags.length > 0 ? (
                                                availableTags.map(tag => (
                                                    <Badge
                                                        key={tag}
                                                        variant={selectedTags.includes(tag) ? "default" : "outline"}
                                                        className="cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors py-1"
                                                        onClick={() => toggleTag(tag)}
                                                    >
                                                        {tag}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <p className="text-sm text-muted-foreground italic">No tags available. Add some in the main menu.</p>
                                            )
                                        ) : (
                                            selectedTags.length > 0 ? (
                                                selectedTags.map(tag => (
                                                    <Badge key={tag} variant="secondary" className="py-1">
                                                        {tag}
                                                    </Badge>
                                                ))
                                            ) : (
                                                <span className="text-sm text-muted-foreground italic">No tags assigned.</span>
                                            )
                                        )}
                                    </div>
                                </div>

                            </div>

                            {/* Footer Actions */}
                            {isEditMode && (
                                <div className="flex justify-between items-center mt-8 pt-4 border-t">
                                    {recipe && !isAddMode ? (
                                        <Button variant="destructive" onClick={() => { onDelete(recipe.id); onClose(); }} className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950 dark:text-red-400 dark:hover:bg-red-900 border-red-200 dark:border-red-900">
                                            Delete Recipe
                                        </Button>
                                    ) : <div></div>}
                                    <div className="flex gap-2">
                                        <Button variant="outline" onClick={handleCloseAttempt}>Cancel</Button>
                                        <Button onClick={handleSave} className="gap-2" data-cy="modal-save-btn">
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
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Discard unsaved changes?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You have unsaved changes. Are you sure you want to close this window and lose your changes?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowUnsavedDialog(false)}>Keep Editing</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmClose} className="bg-red-500 hover:bg-red-600">
                            Discard Changes
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
