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

  const back = page.getByRole('button', { name: 'Back to projects' })
  await expect(back).toBeFocused()

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

// Lenis keeps its wheel/touch listener while stopped and calls preventDefault,
// which silently killed scrolling inside the fixed panel. Keyboard scrolling
// still worked, so nothing in this suite caught it.
test('the overlay scrolls with the wheel while the page behind stays put', async ({
  page,
}) => {
  await page.goto('/')
  await page.waitForTimeout(600)
  for (let i = 0; i < 6; i += 1) {
    await page.mouse.wheel(0, 400)
    await page.waitForTimeout(50)
  }
  await page.waitForTimeout(600)
  const pageYBefore = await page.evaluate(() => Math.round(window.scrollY))
  expect(pageYBefore).toBeGreaterThan(0)

  await page.evaluate(() => {
    window.location.hash = 'project/vitrina'
  })
  const panel = page.locator('[data-lenis-prevent]')
  await expect(panel).toBeVisible()
  await page.waitForTimeout(700)

  expect(
    await panel.evaluate((el) => el.scrollHeight - el.clientHeight),
  ).toBeGreaterThan(200)

  await page.mouse.move(640, 400)
  for (let i = 0; i < 8; i += 1) {
    await page.mouse.wheel(0, 300)
    await page.waitForTimeout(50)
  }
  await page.waitForTimeout(400)

  expect(await panel.evaluate((el) => Math.round(el.scrollTop))).toBeGreaterThan(300)
  // Lenis is still lerping when pageYBefore is sampled, so allow a couple of px.
  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(pageYBefore, -1)

  await page.keyboard.press('Escape')
  await expect(panel).toBeHidden()
  await page.waitForTimeout(900)

  // Locking scroll took the scroll extent off <html>, which used to dump the
  // reader back at the top of the site the moment they closed a project.
  expect(await page.evaluate(() => window.scrollY)).toBeCloseTo(pageYBefore, -1)

  for (let i = 0; i < 4; i += 1) {
    await page.mouse.wheel(0, 400)
    await page.waitForTimeout(50)
  }
  await page.waitForTimeout(500)
  expect(await page.evaluate(() => Math.round(window.scrollY))).toBeGreaterThan(
    pageYBefore,
  )
})
