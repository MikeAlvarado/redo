import { expect, test } from '@playwright/test'

test('defaults to English on a fresh profile', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation').getByRole('link', { name: 'How I ship' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('toggle switches every visible string and survives a hard reload', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'ES', exact: true }).click()

  await expect(page.getByRole('navigation').getByRole('link', { name: 'Cómo entrego' })).toBeVisible()
  await expect(
    page.getByRole('navigation').getByRole('link', { name: 'Trabajo' }),
  ).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page.getByText('Del primer commit')).toBeVisible()

  await page.reload()
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Cómo entrego' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
})
