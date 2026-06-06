import { test, expect } from '@playwright/test';

test('loads the Recipe Book page', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'My Recipe Book' })).toBeVisible();
});
