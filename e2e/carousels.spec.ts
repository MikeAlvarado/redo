import { expect, test } from '@playwright/test'

test('showcase carousel operates by keyboard alone with visible focus', async ({
  page,
}) => {
  await page.goto('/')
  const next = page.getByRole('button', { name: 'Next project' })
  await next.scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)

  await expect(page.getByRole('heading', { name: 'Vitrina' })).toBeVisible()

  await next.focus()
  await expect(next).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('heading', { name: 'Mediterra' })).toBeVisible()

  await page.keyboard.press('ArrowRight')
  await expect(page.getByRole('heading', { name: 'AIMeter' })).toBeVisible()

  await page.keyboard.press('ArrowLeft')
  await expect(page.getByRole('heading', { name: 'Mediterra' })).toBeVisible()
})

test('the reviews section and its nav link stay away while there are no testimonials', async ({
  page,
}) => {
  await page.goto('/')
  await expect(page.locator('[data-section="reviews"]')).toHaveCount(0)
  await expect(
    page.getByRole('navigation').getByRole('link', { name: 'Reviews' }),
  ).toHaveCount(0)
  await expect(page.getByRole('tab')).toHaveCount(0)
})
