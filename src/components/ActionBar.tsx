import { Search, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export interface ActionBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    onAddRecipe: () => void;
}

export function ActionBar({ searchQuery, setSearchQuery, onAddRecipe }: ActionBarProps) {
    return (
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between py-6">
            <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full bg-background mt-0"
                    data-cy="search-bar"
                />
            </div>
            <Button
                onClick={onAddRecipe}
                className="w-full sm:w-auto flex items-center gap-2"
                data-cy="add-recipe-btn"
            >
                <Plus className="w-4 h-4" /> Add Recipe
            </Button>
        </div>
    );
}
