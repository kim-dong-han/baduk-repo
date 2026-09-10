import { expect, test } from '@playwright/test';

test('첫 화면이 렌더링된다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});
