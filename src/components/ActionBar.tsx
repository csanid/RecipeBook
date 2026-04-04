import { Search, Plus, ChevronDown } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

export type SortOrder = "newest" | "oldest" | "az" | "za";

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "az", label: "A–Z" },
    { value: "za", label: "Z–A" },
];

export interface ActionBarProps {
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    sortOrder: SortOrder;
    setSortOrder: (order: SortOrder) => void;
    onAddRecipe: () => void;
}

export function ActionBar({ searchQuery, setSearchQuery, sortOrder, setSortOrder, onAddRecipe }: ActionBarProps) {
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
                    data-testid="search-bar"
                />
            </div>
            <div className="flex w-full sm:w-auto items-center gap-3">
                <div className="relative w-36">
                    <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                        className="h-8 w-full appearance-none rounded-lg border border-input bg-transparent px-2.5 py-1 pr-7 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 cursor-pointer dark:bg-input/30"
                        data-testid="sort-select"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                </div>
                <Button
                    onClick={onAddRecipe}
                    className="w-full sm:w-auto flex items-center gap-2"
                    data-testid="add-recipe-btn"
                >
                    <Plus className="w-4 h-4" /> Add Recipe
                </Button>
            </div>
        </div>
    );
}
