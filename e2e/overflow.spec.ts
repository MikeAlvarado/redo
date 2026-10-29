import { expect, test } from '@playwright/test'

const WIDTHS = [320, 390, 430, 768, 1024, 1280, 1440, 1920, 2560]

async function switchToSpanish(page: import('@playwright/test').Page) {
  const toggle = page.getByRole('button', { name: 'ES', exact: true })
  if (await toggle.isVisible()) {
    await toggle.click()
  } else {
    await page.getByRole('button', { name: 'Open menu' }).click()
    await page.locator('#mobile-menu').getByRole('button', { name: 'ES' }).click()
    await page.keyboard.press('Escape')
  }
  await page.waitForTimeout(500)
}

for (const width of WIDTHS) {
  test(`no horizontal scroll at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await page.waitForTimeout(800)
    const overflow = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(overflow.scrollWidth).toBeLessThanOrEqual(overflow.clientWidth)
  })
}

// Spanish is the longer language in almost every string, and a section that
// clips its own content inside `overflow-hidden` never shows up as page scroll.
for (const width of [390, 430]) {
  test(`Spanish fits inside every section at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/')
    await switchToSpanish(page)
    // Wheel, not window.scrollTo: Lenis drives ScrollTrigger off real scroll
    // events, and a programmatic jump leaves the reveals sitting at opacity 0
    // — which `checkVisibility` below would then skip instead of measuring.
    const passes = Math.ceil((await page.evaluate(() => document.body.scrollHeight)) / 400)
    for (let i = 0; i < passes; i += 1) {
      await page.mouse.wheel(0, 400)
      await page.waitForTimeout(40)
    }
    await page.waitForTimeout(1000)

    const page_ = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }))
    expect(page_.scrollWidth).toBeLessThanOrEqual(page_.clientWidth)

    const clipped = await page.evaluate(() => {
      const clipper = (el: HTMLElement) => {
        for (let node = el.parentElement; node; node = node.parentElement) {
          const overflowX = getComputedStyle(node).overflowX
          if (overflowX === 'hidden' || overflowX === 'clip') return node
        }
        return null
      }
      return Array.from(document.querySelectorAll<HTMLElement>('[data-section] *'))
        .filter((el) => el.children.length === 0 && (el.textContent ?? '').trim() !== '')
        .filter((el) => !el.closest('[aria-hidden="true"], .animate-marquee'))
        .filter((el) =>
          el.checkVisibility({ opacityProperty: true, visibilityProperty: true }),
        )
        .flatMap((el) => {
          const box = el.getBoundingClientRect()
          if (box.width === 0) return []
          const section = el.closest('[data-section]')?.getAttribute('data-section')
          const where = `${section}: <${el.tagName.toLowerCase()}> "${(el.textContent ?? '').trim().slice(0, 32)}"`
          if (box.left < -1 || box.right > window.innerWidth + 1) {
            return [`${where} escapes the viewport (${Math.round(box.left)}..${Math.round(box.right)})`]
          }
          const bounds = clipper(el)?.getBoundingClientRect()
          if (bounds && (box.left < bounds.left - 1 || box.right > bounds.right + 1)) {
            return [`${where} is clipped by its container`]
          }
          return []
        })
    })
    expect(clipped).toEqual([])
  })
}
