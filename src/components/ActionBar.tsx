import { Search, Plus } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SelectRoot, SelectTrigger, SelectValue, SelectPopup, SelectItem } from "./ui/select";

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
                <SelectRoot value={sortOrder} onValueChange={(val) => val && setSortOrder(val as SortOrder)}>
                    <SelectTrigger className="w-36" data-testid="sort-select">
                        <SelectValue>
                            {SORT_OPTIONS.find(opt => opt.value === sortOrder)?.label}
                        </SelectValue>
                    </SelectTrigger>
                    <SelectPopup>
                        {SORT_OPTIONS.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </SelectItem>
                        ))}
                    </SelectPopup>
                </SelectRoot>
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
