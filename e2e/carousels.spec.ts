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

test('clicking a peeking card centres it; only the centred card opens', async ({
  page,
}) => {
  await page.goto('/')
  const section = page.locator('[data-section="work"]')
  await section.scrollIntoViewIfNeeded()
  await page.waitForTimeout(700)

  const caption = section.getByRole('heading', { level: 3 })
  await expect(caption).toHaveText('Vitrina')

  // The right-hand neighbour scrolls into the centre instead of opening.
  await page.getByRole('button', { name: 'Go to project: Mediterra' }).click()
  await page.waitForTimeout(800)
  await expect(caption).toHaveText('Mediterra')
  await expect(page.locator('[data-lenis-prevent]')).toHaveCount(0)
  expect(page.url()).not.toContain('#project/')

  // A neighbour on the other side loops back the short way.
  await page.getByRole('button', { name: 'Go to project: Vitrina' }).click()
  await page.waitForTimeout(800)
  await expect(caption).toHaveText('Vitrina')
  await expect(page.locator('[data-lenis-prevent]')).toHaveCount(0)

  // The centred card is the only one that opens.
  await page.getByRole('button', { name: 'Open project details: Vitrina' }).click()
  await expect(page.locator('[data-lenis-prevent]')).toBeVisible()
  expect(page.url()).toContain('#project/vitrina')
})

test('the stacked list below tab: opens every card directly', async ({ page }) => {
  await page.setViewportSize({ width: 430, height: 900 })
  await page.goto('/')
  await page.waitForTimeout(700)

  const cards = page.locator('[data-section="work"] button[aria-label^="Open project"]')
  await expect(cards).toHaveCount(7)
  await expect(
    page.locator('[data-section="work"] button[aria-label^="Go to project"]'),
  ).toHaveCount(0)

  await page.getByRole('button', { name: 'Open project details: AIMeter' }).click()
  await expect(page.locator('[data-lenis-prevent]')).toBeVisible()
  expect(page.url()).toContain('#project/ai-meter')
})
