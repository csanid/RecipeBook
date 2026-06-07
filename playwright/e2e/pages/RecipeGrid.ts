import { type Page, type Locator } from '@playwright/test'

export class RecipeGrid {
  constructor(private readonly page: Page) {}

  cards(): Locator {
    return this.page.getByTestId('recipe-card')
  }

  cardByName(name: string): Locator {
    return this.cards().filter({ hasText: name })
  }

  async count(): Promise<number> {
    return this.cards().count()
  }

  async names(): Promise<string[]> {
    const texts = await this.page.getByTestId('recipe-card-name').allTextContents()
    return texts.map((t) => t.trim())
  }

  // Use with toHaveText([...]) for auto-waiting order / count assertions
  cardNames(): Locator {
    return this.page.getByTestId('recipe-card-name')
  }

  cardImage(withinCard?: Locator): Locator {
    if (withinCard) return withinCard.getByTestId('recipe-card-image')
    return this.page.getByTestId('recipe-card-image')
  }

  cardImagePlaceholder(withinCard?: Locator): Locator {
    if (withinCard) return withinCard.getByTestId('recipe-card-image-placeholder')
    return this.page.getByTestId('recipe-card-image-placeholder')
  }

  emptyState(): Locator {
    return this.page.getByTestId('empty-grid-state')
  }
}
