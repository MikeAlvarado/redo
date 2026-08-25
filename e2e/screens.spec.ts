import { test } from '@playwright/test'

const VIEWPORTS = [
  { name: '1440', width: 1440, height: 900 },
  { name: '390', width: 390, height: 844 },
]

for (const viewport of VIEWPORTS) {
  for (const lang of ['en', 'es'] as const) {
    test(`full page screenshot ${viewport.name} (${lang})`, async ({ page }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height })
      await page.goto('/')
      if (lang === 'es') {
        const toggle = page.getByRole('button', { name: 'ES', exact: true })
        if (await toggle.isVisible()) {
          await toggle.click()
        } else {
          await page.getByRole('button', { name: 'Open menu' }).click()
          await page.getByRole('dialog').getByRole('button', { name: 'ES' }).click()
          await page.keyboard.press('Escape')
        }
      }
      await page.waitForTimeout(1000)
      await page.evaluate(async () => {
        const step = window.innerHeight / 2
        for (let y = 0; y < document.body.scrollHeight; y += step) {
          window.scrollTo(0, y)
          await new Promise((resolve) => setTimeout(resolve, 60))
        }
        window.scrollTo(0, 0)
      })
      await page.waitForTimeout(800)
      await page.screenshot({
        path: `reference/self-check/full-${viewport.name}-${lang}.png`,
        fullPage: true,
      })
    })
  }
}
