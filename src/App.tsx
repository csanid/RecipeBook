import { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ActionBar } from './components/ActionBar';
import { TagManager } from './components/TagManager';
import { RecipeCard } from './components/RecipeCard';
import { RecipeModal } from './components/RecipeModal';
import { useRecipeStore } from './hooks/useRecipeStore';
import { Recipe, Tag } from './types';

function App() {
  const { recipes, tags, addRecipe, updateRecipe, deleteRecipe, addTag, deleteTag } = useRecipeStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
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
    return recipes.filter(recipe => {
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
  }, [recipes, searchQuery, selectedTags]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 font-sans">
      <Header />

      <main className="container mx-auto max-w-5xl px-4 pb-12">
        <ActionBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
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
          <div className="py-16 text-center text-muted-foreground border-2 border-dashed rounded-xl">
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
      />
    </div>
  );
}

export default App;
