import { expect, test } from '@playwright/test'

test('defaults to English on a fresh profile', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('navigation').getByRole('link', { name: 'About' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

test('toggle switches every visible string and survives a hard reload', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'ES', exact: true }).click()

  await expect(page.getByRole('navigation').getByRole('link', { name: 'Sobre mí' })).toBeVisible()
  await expect(
    page.getByRole('navigation').getByRole('link', { name: 'Trabajo' }),
  ).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
  await expect(page.getByText('Tecnología que hace')).toBeVisible()

  await page.reload()
  await expect(page.getByRole('navigation').getByRole('link', { name: 'Sobre mí' })).toBeVisible()
  await expect(page.locator('html')).toHaveAttribute('lang', 'es')
})
