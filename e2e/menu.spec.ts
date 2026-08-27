import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 430, height: 932 } })

test('mobile menu opens from the pill, traps focus, closes on Escape, restores focus', async ({
  page,
}) => {
  await page.goto('/')
  const trigger = page.locator('button[aria-controls="mobile-menu"]')
  await expect(trigger).toHaveAccessibleName('Open menu')
  await trigger.click()
  await expect(trigger).toHaveAttribute('aria-expanded', 'true')
  await expect(trigger).toHaveAccessibleName('Close menu')

  const panel = page.locator('#mobile-menu')
  await expect(panel.getByRole('link', { name: 'Services' })).toBeVisible()
  await expect(panel.getByRole('link', { name: 'Get In Touch' })).toBeVisible()

  for (let i = 0; i < 10; i += 1) {
    await page.keyboard.press('Tab')
    const inside = await page.evaluate(() => {
      const active = document.activeElement
      const nav = document.querySelector('header nav')
      return nav ? nav.contains(active) : false
    })
    expect(inside).toBe(true)
  }

  await page.keyboard.press('Escape')
  await expect(panel).not.toBeVisible()
  await expect(trigger).toBeFocused()
  await expect(trigger).toHaveAccessibleName('Open menu')
})

test('mobile menu closes on outside tap and does not lock page scroll', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await expect(page.locator('#mobile-menu')).toBeVisible()

  const scrolled = await page.evaluate(async () => {
    window.scrollTo(0, 240)
    await new Promise((resolve) => setTimeout(resolve, 400))
    return window.scrollY
  })
  expect(scrolled).toBeGreaterThan(0)

  await page.mouse.click(215, 700)
  await expect(page.locator('#mobile-menu')).not.toBeVisible()
})

test('language toggles from inside the open menu', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Open menu' }).click()
  await page.locator('#mobile-menu').getByRole('button', { name: 'ES' }).click()
  await expect(
    page.locator('#mobile-menu').getByRole('link', { name: 'Servicios' }),
  ).toBeVisible()
  await page.keyboard.press('Escape')
})
