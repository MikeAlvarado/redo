import { expect, test } from '@playwright/test'

test('project overlay traps focus, closes on Escape, and restores focus', async ({
  page,
}) => {
  await page.goto('/')
  const opener = page.getByRole('button', {
    name: 'Open project details: Vitrina',
  })
  await opener.scrollIntoViewIfNeeded()
  await page.waitForTimeout(600)
  await opener.click()

  const dialog = page.getByRole('dialog', { name: 'Vitrina' })
  await expect(dialog).toBeVisible()
  expect(page.url()).toContain('#project/vitrina')

  const close = page.getByRole('button', { name: 'Close project details' })
  await expect(close).toBeFocused()

  for (let i = 0; i < 12; i += 1) {
    await page.keyboard.press('Tab')
    const inside = await page.evaluate(() => {
      const active = document.activeElement
      const panel = document.querySelector('[role="dialog"]')
      return panel ? panel.contains(active) : false
    })
    expect(inside).toBe(true)
  }

  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(opener).toBeFocused()
})

test('an open project survives a refresh via the hash', async ({ page }) => {
  await page.goto('/#project/mediterra')
  await expect(
    page.getByRole('dialog', { name: 'Mediterra' }),
  ).toBeVisible()
})
