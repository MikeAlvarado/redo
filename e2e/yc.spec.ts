import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

test('/yc shows the badge, flips it on tap, and passes axe', async ({ page }) => {
  await page.goto('/yc')
  await expect(page.getByRole('img', { name: /Y Combinator badge/ })).toBeVisible()
  // The three.js scene is a dynamic import; wait for its canvas before flipping.
  await expect(page.locator('[data-section="yc-badge"] canvas')).toBeAttached({ timeout: 20000 })
  await page.waitForTimeout(500)
  const flipButton = page.getByRole('button', { name: /Turn the badge over/ })
  await expect(flipButton).toHaveAttribute('aria-pressed', 'false')
  await flipButton.focus()
  await page.keyboard.press('Enter')
  await expect(flipButton).toHaveAttribute('aria-pressed', 'true', { timeout: 10000 })
  await expect(page.getByRole('link', { name: /Kodda/ })).toHaveAttribute(
    'href',
    'https://www.ycombinator.com/companies/kodda',
  )
  const results = await new AxeBuilder({ page }).analyze()
  const blocking = results.violations.filter(
    (violation) => violation.impact === 'serious' || violation.impact === 'critical',
  )
  expect(blocking.map((violation) => violation.id)).toEqual([])
})

test('/yc has no horizontal scroll at 390', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/yc')
  await page.waitForTimeout(600)
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBe(0)
})
