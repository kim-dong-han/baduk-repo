import { expect, test } from '@playwright/test';

test('첫 화면이 렌더링된다', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
});

test('클라이언트 라우팅이 동작한다', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: '디자인 토큰 확인하기' }).click();
  await expect(page).toHaveURL(/\/design-system$/);
  await expect(page.getByRole('heading', { level: 1, name: '디자인 토큰' })).toBeVisible();
});

test('새로고침해도 딥링크가 살아 있다 (SPA fallback)', async ({ page }) => {
  await page.goto('/design-system');
  await expect(page.getByRole('heading', { level: 1, name: '디자인 토큰' })).toBeVisible();
});
