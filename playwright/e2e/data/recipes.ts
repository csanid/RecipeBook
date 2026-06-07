// Mirrors src/types.ts — keep in sync if the app's Recipe shape changes
export interface Recipe {
  id: string
  createdAt: number
  name: string
  link?: string
  image?: string
  tags?: string[]
  notes?: string
}

let _seq = 0

export function makeRecipe(overrides: Partial<Recipe> = {}): Recipe {
  const n = ++_seq
  return {
    id: `recipe-${n}`,
    createdAt: 1704067200000 + n * 86400000, // Jan 1 2024 + n days
    name: `Test Recipe ${n}`,
    ...overrides,
  }
}

export function makeRecipes(count: number, overrides: Partial<Recipe> = {}): Recipe[] {
  return Array.from({ length: count }, () => makeRecipe(overrides))
}
