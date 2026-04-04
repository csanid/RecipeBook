import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ActionBar, type SortOrder } from './components/ActionBar';
import { TagManager } from './components/TagManager';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { useRecipeStore } from './hooks/useRecipeStore';
import { Recipe, Tag } from './types';

const SORT_KEY = 'recipebook_sort';

function App() {
  const { recipes, tags, addRecipe, updateRecipe, deleteRecipe, addTag, deleteTag } = useRecipeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [sortOrder, setSortOrder] = useState<SortOrder>(() => {
    const stored = localStorage.getItem(SORT_KEY);
    return (stored as SortOrder) || 'newest';
  });

  const handleSortChange = (order: SortOrder) => {
    setSortOrder(order);
    localStorage.setItem(SORT_KEY, order);
  };
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const handleAddRecipe = () => {
    setSelectedRecipe(null);
    setIsRecipeModalOpen(true);
  };

  const handleViewRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsRecipeModalOpen(true);
  };

  const handleSaveRecipe = (recipeData: Recipe | Omit<Recipe, 'id' | 'createdAt'>) => {
    if ('id' in recipeData && recipeData.id) {
      updateRecipe(recipeData as Recipe);
    } else {
      addRecipe(recipeData);
    }
  };

  const filteredRecipes = useMemo(() => {
    const filtered = recipes.filter(recipe => {
      // 1. Search Query
      if (searchQuery) {
        if (!recipe.name.toLowerCase().includes(searchQuery.toLowerCase())) {
          return false;
        }
      }
      // 2. Selected Tags (AND logic)
      if (selectedTags.length > 0) {
        const recipeTags = recipe.tags || [];
        const hasAllTags = selectedTags.every(t => recipeTags.includes(t));
        if (!hasAllTags) {
          return false;
        }
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sortOrder) {
        case 'oldest': return a.createdAt - b.createdAt;
        case 'az': return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
        case 'za': return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
        case 'newest':
        default: return b.createdAt - a.createdAt;
      }
    });
  }, [recipes, searchQuery, selectedTags, sortOrder]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 pb-12">
        <ActionBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          sortOrder={sortOrder}
          setSortOrder={handleSortChange}
          onAddRecipe={handleAddRecipe}
        />

        <TagManager
          tags={tags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          addTag={addTag}
          deleteTag={deleteTag}
        />

        {filteredRecipes.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => handleViewRecipe(recipe)}
              />
            ))}
          </div>
        ) : (
          <div className="py-16 text-center text-muted-foreground border-2 border-dashed rounded-xl" data-testid="empty-state">
            <h3 className="text-lg font-medium mb-1">No recipes found</h3>
            <p className="text-sm">Try adjusting your search or filters, or add a new recipe.</p>
          </div>
        )}
      </main>

      <RecipeModal
        isOpen={isRecipeModalOpen}
        onClose={() => setIsRecipeModalOpen(false)}
        recipe={selectedRecipe}
        onSave={handleSaveRecipe}
        availableTags={tags}
        onDelete={deleteRecipe}
        addTag={addTag}
      />
    </div>
  );
}

export default App;
