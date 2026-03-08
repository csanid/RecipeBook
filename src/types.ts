export type Tag = string;

export interface Recipe {
    id: string;
    createdAt: number;
    name: string;
    link?: string;
    image?: string;
    tags?: Tag[];
    notes?: string;
}
