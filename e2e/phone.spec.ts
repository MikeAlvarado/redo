import { expect, test } from '@playwright/test'

// An iPhone in Chrome with both toolbars showing: the small viewport, which
// Chrome on iOS keeps while scrolling.
test.use({ viewport: { width: 393, height: 657 }, hasTouch: true })

const navBottom = (page: import('@playwright/test').Page) =>
  page.locator('header').first().evaluate((el) => el.getBoundingClientRect().bottom)

test('the pinned statement stays between the nav and the bottom edge', async ({ page }) => {
  await page.goto('/')
  const statement = page.locator('[data-section="statement"]')
  const top = await statement.evaluate((el) => el.getBoundingClientRect().top + window.scrollY)
  // Wheel, not scrollTo: Lenis drives ScrollTrigger off real scroll events.
  for (let y = 0; y < top + 200; y += 100) await page.mouse.wheel(0, 100)
  await page.waitForTimeout(600)

  const words = statement.locator('[data-word]')
  const first = await words.first().boundingBox()
  const last = await words.last().boundingBox()
  const marquee = await statement.locator('section').boundingBox()
  expect(first?.y ?? 0).toBeGreaterThanOrEqual(await navBottom(page))
  expect((last?.y ?? 0) + (last?.height ?? 0)).toBeLessThanOrEqual(marquee?.y ?? 0)
  expect((marquee?.y ?? 0) + (marquee?.height ?? 0)).toBeLessThanOrEqual(657)
})

test('the closing card fits the small viewport under the nav', async ({ page }) => {
  await page.goto('/')
  const total = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < total; y += 400) await page.mouse.wheel(0, 400)
  await page.waitForTimeout(900)

  const eyebrow = await page.locator('[data-section="closing"] p').first().boundingBox()
  expect(eyebrow?.y ?? 0).toBeGreaterThanOrEqual(await navBottom(page))
})
