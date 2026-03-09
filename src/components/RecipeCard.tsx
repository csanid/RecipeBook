import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Image as ImageIcon, X, Edit2 } from "lucide-react";
import { Recipe } from "../types";
import { Button } from "./ui/button";

export interface RecipeCardProps {
    recipe: Recipe;
    onClick: () => void;
}

export function RecipeCard({ recipe, onClick }: RecipeCardProps) {
    return (
        <Card
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer group"
            onClick={onClick}
            data-cy="recipe-card"
        >
            <div className="aspect-video w-full bg-neutral-100 dark:bg-neutral-800 relative flex items-center justify-center overflow-hidden">
                {recipe.image ? (
                    <img
                        src={recipe.image}
                        alt={recipe.name}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <ImageIcon className="w-10 h-10 text-neutral-300 dark:text-neutral-700" />
                )}
            </div>
            <CardContent className="p-4">
                <h3 className="font-semibold text-lg line-clamp-1 mb-2" title={recipe.name}>
                    {recipe.name}
                </h3>
                <div className="flex flex-wrap gap-1">
                    {recipe.tags && recipe.tags.length > 0 ? (
                        recipe.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="secondary" className="text-xs px-2 py-0">
                                {tag}
                            </Badge>
                        ))
                    ) : (
                        <span className="text-xs text-muted-foreground italic">No tags</span>
                    )}
                    {recipe.tags && recipe.tags.length > 3 && (
                        <Badge variant="secondary" className="text-xs px-2 py-0">
                            +{recipe.tags.length - 3}
                        </Badge>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
