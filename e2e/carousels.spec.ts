import { expect, test } from '@playwright/test'

test('showcase carousel operates by keyboard alone with visible focus', async ({
  page,
}) => {
  await page.goto('/')
  const next = page.getByRole('button', { name: 'Next project' })
  await next.scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)

  await expect(
    page.getByRole('heading', { name: 'Atlas — Logistics Dashboard' }),
  ).toBeVisible()

  await next.focus()
  await expect(next).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(
    page.getByRole('heading', { name: 'Ledger — Fintech Onboarding' }),
  ).toBeVisible()

  await page.keyboard.press('ArrowRight')
  await expect(
    page.getByRole('heading', { name: 'Pulse — Health Tracker' }),
  ).toBeVisible()

  await page.keyboard.press('ArrowLeft')
  await expect(
    page.getByRole('heading', { name: 'Ledger — Fintech Onboarding' }),
  ).toBeVisible()
})

test('testimonial pagination operates by keyboard', async ({ page }) => {
  await page.goto('/')
  const secondDot = page.getByRole('tab', { name: 'Go to testimonial 2' })
  await secondDot.scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)

  await secondDot.focus()
  await expect(secondDot).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(secondDot).toHaveAttribute('aria-selected', 'true')
})
