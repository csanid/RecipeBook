import { useState, useEffect } from 'react';
import { Recipe, Tag } from '../types';

const RECIPES_KEY = 'recipebook_recipes';
const TAGS_KEY = 'recipebook_tags';

export function useRecipeStore() {
    const [recipes, setRecipes] = useState<Recipe[]>(() => {
        try {
            const stored = localStorage.getItem(RECIPES_KEY);
            return stored ? JSON.parse(stored) as Recipe[] : [];
        } catch (e) {
            console.error('Failed to parse recipes from localstorage', e);
            return [];
        }
    });

    const [tags, setTags] = useState<Tag[]>(() => {
        try {
            const stored = localStorage.getItem(TAGS_KEY);
            return stored ? JSON.parse(stored) as Tag[] : [];
        } catch (e) {
            console.error('Failed to parse tags from localstorage', e);
            return [];
        }
    });

    // Persist on change
    useEffect(() => {
        localStorage.setItem(RECIPES_KEY, JSON.stringify(recipes));
    }, [recipes]);

    useEffect(() => {
        localStorage.setItem(TAGS_KEY, JSON.stringify(tags));
    }, [tags]);

    const addRecipe = (recipe: Omit<Recipe, 'id' | 'createdAt'>) => {
        const newRecipe: Recipe = { ...recipe, id: crypto.randomUUID(), createdAt: Date.now() };
        setRecipes((prev) => [newRecipe, ...prev]);
    };

    const updateRecipe = (updatedRecipe: Recipe) => {
        setRecipes((prev) =>
            prev.map((r) => (r.id === updatedRecipe.id ? updatedRecipe : r))
        );
    };

    const deleteRecipe = (id: string) => {
        setRecipes((prev) => prev.filter((r) => r.id !== id));
    };

    const addTag = (tagName: string) => {
        const trimmed = tagName.trim();
        if (!trimmed) return;
        const lowerTrimmed = trimmed.toLowerCase();

        setTags((prev) => {
            if (prev.some(t => t.toLowerCase() === lowerTrimmed)) return prev;
            return [...prev, trimmed];
        });
    };

    const deleteTag = (tagName: string) => {
        const lowerName = tagName.toLowerCase();
        setTags((prev) => prev.filter((t) => t.toLowerCase() !== lowerName));
        // Also remove this tag from all existing recipes
        setRecipes((prev) =>
            prev.map((recipe) => ({
                ...recipe,
                tags: recipe.tags ? recipe.tags.filter((t) => t.toLowerCase() !== lowerName) : [],
            }))
        );
    };

    return {
        recipes,
        tags,
        addRecipe,
        updateRecipe,
        deleteRecipe,
        addTag,
        deleteTag,
    };
}
