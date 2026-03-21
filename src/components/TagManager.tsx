import { useState } from "react";
import { Plus, X, Edit2, Check, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
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
import { Card, CardContent } from "./ui/card";
import { Tag } from "../types";

export interface TagManagerProps {
    tags: Tag[];
    selectedTags: Tag[];
    setSelectedTags: (tags: Tag[]) => void;
    addTag: (tag: Tag) => void;
    deleteTag: (tag: Tag) => void;
}

export function TagManager({
    tags,
    selectedTags,
    setSelectedTags,
    addTag,
    deleteTag
}: TagManagerProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [newTagStr, setNewTagStr] = useState("");
    const [tagToDelete, setTagToDelete] = useState<Tag | null>(null);
    const [tagError, setTagError] = useState("");

    const toggleTagSelection = (tag: Tag) => {
        if (isEditing) return;
        if (selectedTags.includes(tag)) {
            setSelectedTags(selectedTags.filter(t => t !== tag));
        } else {
            setSelectedTags([...selectedTags, tag]);
        }
    };

    const handleAddTag = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTagStr.trim()) {
            setTagError("Enter one or more words to save a tag.");
            return;
        }
        if (tags.some(t => t.toLowerCase() === newTagStr.trim().toLowerCase())) {
            setTagError("This tag already exists.");
            return;
        }
        addTag(newTagStr.trim());
        setNewTagStr("");
        setTagError("");
    };

    const confirmDelete = () => {
        if (tagToDelete) {
            deleteTag(tagToDelete);
            if (selectedTags.includes(tagToDelete)) {
                setSelectedTags(selectedTags.filter(t => t !== tagToDelete));
            }
            setTagToDelete(null);
        }
    };

    return (
        <Card className="mb-8 overflow-hidden shadow-sm" data-testid="tags-container">
            <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold tracking-tight text-neutral-800 dark:text-neutral-200">
                        Filter by Tags
                    </h2>
                    <Button
                        variant={isEditing ? "default" : "outline"}
                        size="sm"
                        onClick={() => { setIsEditing(!isEditing); setTagError(""); setNewTagStr(""); }}
                        className={`gap-2 transition-colors ${!isEditing ? "hover:bg-neutral-100 dark:hover:bg-neutral-800" : ""}`}
                    >
                        {isEditing ? <><Check className="w-4 h-4" /> Done Editing</> : <><Edit2 className="w-4 h-4" /> Manage Tags</>}
                    </Button>
                </div>

                {tags.length === 0 && !isEditing ? (
                    <p className="text-sm text-neutral-500 italic">No tags created yet. Click "Manage Tags" to add some!</p>
                ) : (
                    <div className="flex flex-wrap gap-2">
                        {tags.map((tag) => {
                            const isSelected = selectedTags.includes(tag);
                            return (
                                <Badge
                                    key={tag}
                                    variant={isSelected ? "default" : "secondary"}
                                    className={`text-sm py-1.5 px-3 cursor-pointer transition-all duration-200 shadow-sm ${!isEditing && !isSelected ? 'hover:bg-neutral-200 dark:hover:bg-neutral-800' : ''}`}
                                    onClick={() => toggleTagSelection(tag)}
                                    data-testid="tag-pill"
                                >
                                    {tag}
                                    {isEditing && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setTagToDelete(tag);
                                            }}
                                            className="ml-2 hover:bg-red-100 dark:hover:bg-red-900 rounded-full p-0.5 transition-colors"
                                            data-testid="remove-tag-chip"
                                        >
                                            <X className="w-3 h-3 text-neutral-500 hover:text-red-500" />
                                        </button>
                                    )}
                                </Badge>
                            );
                        })}
                    </div>
                )}

                {isEditing && (
                    <div className="mt-4 max-w-sm">
                        <form onSubmit={handleAddTag} className="flex gap-2">
                            <Input
                                type="text"
                                placeholder="New tag..."
                                value={newTagStr}
                                onChange={(e) => { setNewTagStr(e.target.value); setTagError(""); }}
                                maxLength={40}
                                className="h-9 w-40"
                            />
                            <Button type="submit" size="sm" variant="secondary" className="h-9 px-3">
                                <Plus className="w-4 h-4" />
                            </Button>
                        </form>
                        {tagError && (
                            <p className="text-sm text-destructive flex items-center gap-1.5 mt-1" data-testid="tag-error">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                {tagError}
                            </p>
                        )}
                    </div>
                )}
            </CardContent>

            <AlertDialog open={!!tagToDelete} onOpenChange={(open) => !open && setTagToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the tag "{tagToDelete}"
                            from all your recipes.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-500 hover:bg-red-600">
                            Delete Tag
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Card>
    );
}
